# Aplica settings.shared.json no settings.json local desta maquina.
#
# Uso (PowerShell):
#   powershell -ExecutionPolicy Bypass -File ~\.claude\scripts\sync\apply-shared.ps1
#
# Mescla as chaves portateis (hooks, env, model, effortLevel, plugins) sobre o
# settings.json local, PRESERVANDO `permissions` — as aprovacoes de comando
# desta maquina nao sao tocadas.
#
# Faz backup antes de escrever.

$ErrorActionPreference = 'Stop'

$ClaudeDir = Join-Path $env:USERPROFILE '.claude'
$Shared    = Join-Path $ClaudeDir 'settings.shared.json'
$Local     = Join-Path $ClaudeDir 'settings.json'

if (-not (Test-Path $Shared)) {
    Write-Error "settings.shared.json nao encontrado em $ClaudeDir. O repositorio foi clonado corretamente?"
}

# ---- backup ----------------------------------------------------------------
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
    $localObj = [PSCustomObject]@{}
}

$applied = @()
foreach ($prop in $sharedObj.PSObject.Properties) {
    $localObj | Add-Member -MemberType NoteProperty -Name $prop.Name -Value $prop.Value -Force
    $applied += $prop.Name
}

# permissions nunca vem do compartilhado; se nao existir local, cria vazio
if (-not $localObj.PSObject.Properties.Name.Contains('permissions')) {
    $localObj | Add-Member -MemberType NoteProperty -Name 'permissions' -Value ([PSCustomObject]@{ allow = @(); additionalDirectories = @() }) -Force
}

$localObj | ConvertTo-Json -Depth 100 | Out-File $Local -Encoding utf8

# ---- verificacao -----------------------------------------------------------
try {
    Get-Content $Local -Raw | ConvertFrom-Json | Out-Null
    Write-Output "settings.json valido."
} catch {
    Write-Error "settings.json ficou invalido. Restaure de $backupDir"
}

$permCount = 0
if ($localObj.permissions.allow) { $permCount = $localObj.permissions.allow.Count }

Write-Output ""
Write-Output "Aplicado: $($applied -join ', ')"
Write-Output "Preservado: permissions ($permCount regras locais)"
Write-Output ""
Write-Output "Proximos passos nesta maquina:"
Write-Output "  1. Configure os MCP servers em ~/.claude.json (ver SETUP_TODO.md)"
Write-Output "  2. Reinicie o Claude Code para carregar hooks e regras"
