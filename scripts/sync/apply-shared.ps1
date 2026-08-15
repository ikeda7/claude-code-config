# Aplica settings.shared.json no settings.json local desta maquina.
#
# Uso:
#   powershell -ExecutionPolicy Bypass -File ~\.claude\scripts\sync\apply-shared.ps1
#
# Mescla as chaves portateis (hooks, env, model, effortLevel, plugins) sobre o
# settings.json local, PRESERVANDO `permissions`: as aprovacoes de comando
# desta maquina nao sao tocadas.
#
# Faz backup antes de escrever e valida o JSON depois.
#
# IMPORTANTE: manter este arquivo em ASCII puro. O PowerShell 5.1 le .ps1 sem
# BOM como ANSI, e acento ou travessao quebra o parser.
#
# $env:CLAUDE_HOME sobrescreve o diretorio home (usado pelos testes).

$ErrorActionPreference = 'Stop'

$HomeDir = if ($env:CLAUDE_HOME) { $env:CLAUDE_HOME } else { $env:USERPROFILE }
$ClaudeDir = Join-Path $HomeDir '.claude'
$Shared    = Join-Path $ClaudeDir 'settings.shared.json'
$Local     = Join-Path $ClaudeDir 'settings.json'

if (-not (Test-Path $Shared)) {
    Write-Output "ERRO: settings.shared.json nao encontrado em $ClaudeDir"
    Write-Output "O repositorio foi clonado corretamente?"
    exit 1
}

# ---- backup ----------------------------------------------------------------
$backupDir = $null
if (Test-Path $Local) {
    $stamp     = Get-Date -Format 'yyyyMMdd-HHmmss'
    $backupDir = Join-Path $ClaudeDir "backups\pre-sync-$stamp"
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    Copy-Item $Local (Join-Path $backupDir 'settings.json') -Force
    Write-Output "Backup: $backupDir"
}

# ---- merge -----------------------------------------------------------------
$sharedObj = Get-Content $Shared -Raw | ConvertFrom-Json

if (Test-Path $Local) {
    $localObj = Get-Content $Local -Raw | ConvertFrom-Json
} else {
    $localObj = New-Object PSObject
}

$existingNames = @($localObj.PSObject.Properties | ForEach-Object { $_.Name })
$permCountBefore = 0
if ($existingNames -contains 'permissions' -and $localObj.permissions.allow) {
    $permCountBefore = @($localObj.permissions.allow).Count
}

$applied = @()
foreach ($prop in $sharedObj.PSObject.Properties) {
    # permissions nunca vem do compartilhado: protecao redundante
    if ($prop.Name -eq 'permissions') { continue }
    $localObj | Add-Member -MemberType NoteProperty -Name $prop.Name -Value $prop.Value -Force
    $applied += $prop.Name
}

# garante que permissions exista, sem sobrescrever o que ja havia
if (-not ($existingNames -contains 'permissions')) {
    $emptyPerms = [PSCustomObject]@{ allow = @(); additionalDirectories = @() }
    $localObj | Add-Member -MemberType NoteProperty -Name 'permissions' -Value $emptyPerms -Force
}

# Depth alto: o objeto `hooks` e profundamente aninhado
$localObj | ConvertTo-Json -Depth 100 | Out-File $Local -Encoding utf8

# ---- verificacao -----------------------------------------------------------
try {
    $check = Get-Content $Local -Raw | ConvertFrom-Json
} catch {
    Write-Output "ERRO: settings.json ficou invalido."
    if ($backupDir) { Write-Output "Restaure de: $backupDir" }
    exit 1
}

$permCountAfter = 0
if ($check.permissions.allow) { $permCountAfter = @($check.permissions.allow).Count }

if ($permCountAfter -lt $permCountBefore) {
    Write-Output "ERRO: permissions encolheu de $permCountBefore para $permCountAfter."
    if ($backupDir) { Write-Output "Restaure de: $backupDir" }
    exit 1
}

$hookEvents = 0
if ($check.hooks) { $hookEvents = @($check.hooks.PSObject.Properties).Count }

Write-Output ""
Write-Output "settings.json valido."
Write-Output "  aplicado:   $($applied -join ', ')"
Write-Output "  hooks:      $hookEvents eventos"
Write-Output "  permissions: $permCountAfter regras locais preservadas"
exit 0
