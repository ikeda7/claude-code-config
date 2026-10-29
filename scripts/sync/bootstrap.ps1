# Bootstrap do ambiente Claude Code numa maquina nova.
#
#   git clone <repo> $env:USERPROFILE\.claude
#   cd $env:USERPROFILE\.claude
#   powershell -ExecutionPolicy Bypass -File .\scripts\sync\bootstrap.ps1
#
# Faz, em ordem:
#   1. checa pre-requisitos (node, git)
#   2. aplica settings.shared.json no settings.json local
#   3. injeta os MCP servers portateis em ~/.claude.json
#   4. instala os plugins declarados (via CLI do Claude Code)
#   5. instala o playwright-cli global (usado pela skill playwright-cli)
#   6. aplica a personalizacao do Windows Terminal (terminal/windows-terminal.json)
#   7. reporta o que ficou pendente
#
# Headroom NAO e instalado nem configurado (decisao de 2026-10-22, ver
# SETUP_TODO.md): `headroom init` aponta ANTHROPIC_BASE_URL para o proxy
# local, e isso desliga o /remote-control.
#
# Nao toca em credenciais. Nao autoriza OAuth. Nao apaga nada: tudo com backup.
#
# IMPORTANTE: este arquivo deve permanecer em ASCII puro. O PowerShell 5.1 le
# .ps1 sem BOM como ANSI, e qualquer caractere acentuado ou travessao quebra o
# parser. Ha um teste que verifica isso (scripts/sync/check-ascii.js).
#
# $env:CLAUDE_HOME sobrescreve o diretorio home (usado pelos testes).

$ErrorActionPreference = 'Stop'

$HomeDir   = if ($env:CLAUDE_HOME) { $env:CLAUDE_HOME } else { $env:USERPROFILE }
$ClaudeDir = Join-Path $HomeDir '.claude'
$SyncDir   = Join-Path $ClaudeDir 'scripts\sync'

Write-Output "=============================================="
Write-Output " Bootstrap do ambiente Claude Code"
Write-Output " Destino: $ClaudeDir"
Write-Output "=============================================="
Write-Output ""

# ---- 1. pre-requisitos -----------------------------------------------------
Write-Output "[1/6] Pre-requisitos"

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Output "  ERRO: Node.js nao encontrado. Instale Node 18+ e rode de novo."
    exit 1
}
Write-Output ("  node " + (& node --version))

$git = Get-Command git -ErrorAction SilentlyContinue
if ($git) {
    Write-Output ("  git  " + ((& git --version) -replace 'git version ',''))
} else {
    Write-Output "  AVISO: git nao encontrado. O sync futuro vai precisar dele."
}

if (-not (Test-Path (Join-Path $ClaudeDir 'settings.shared.json'))) {
    Write-Output "  ERRO: settings.shared.json ausente."
    Write-Output "  O clone foi para $ClaudeDir mesmo?"
    exit 1
}
Write-Output ""

# ---- 2. settings -----------------------------------------------------------
Write-Output "[2/6] Configuracao: hooks, env, model, plugins"
& powershell -ExecutionPolicy Bypass -File (Join-Path $SyncDir 'apply-shared.ps1')
if ($LASTEXITCODE -ne 0) {
    Write-Output "  ERRO ao aplicar settings. Abortado."
    exit 1
}
Write-Output ""

# ---- 3. MCP ----------------------------------------------------------------
Write-Output "[3/6] MCP servers"
& node (Join-Path $SyncDir 'apply-mcp.js')
if ($LASTEXITCODE -ne 0) {
    Write-Output "  ERRO ao aplicar MCP. Abortado."
    exit 1
}
Write-Output ""

# ---- 4. plugins ------------------------------------------------------------
# A extensao do VS Code nao instala sozinha plugin de marketplace novo.
# Falha aqui nao aborta: o resto do ambiente ja esta aplicado.
Write-Output "[4/6] Plugins"
& node (Join-Path $SyncDir 'apply-plugins.js')
if ($LASTEXITCODE -ne 0) {
    Write-Output "  AVISO: algum plugin nao instalou. Rode apply-plugins.js de novo depois."
}
Write-Output ""

# ---- 5. playwright-cli -----------------------------------------------------
# A skill skills/playwright-cli chama o binario `playwright-cli`. Falha aqui
# nao aborta: sem ele, a skill cai para `npx playwright` quando o projeto tem.
Write-Output "[5/6] playwright-cli (automacao de navegador para as skills de frontend)"
if (Get-Command playwright-cli -ErrorAction SilentlyContinue) {
    Write-Output "  ja instalado"
} else {
    & npm install -g "@playwright/cli@latest"
    if ($LASTEXITCODE -ne 0) {
        Write-Output "  AVISO: falhou. Rode depois: npm install -g @playwright/cli@latest"
    }
}
Write-Output ""

# ---- 6. Windows Terminal ---------------------------------------------------
# Perfil "Claude Code" como padrao, Git Bash, fonte, tema e atalhos. Funde sem
# apagar perfis existentes e nao tira o posto de padrao de um perfil WSL.
# Falha aqui nao aborta.
Write-Output "[6/6] Windows Terminal (perfil Claude Code, tema, atalhos)"
& node (Join-Path $SyncDir 'apply-terminal.js')
if ($LASTEXITCODE -ne 0) {
    Write-Output "  AVISO: falhou. Rode depois: node scripts\sync\apply-terminal.js"
}
Write-Output ""

# ---- conferencia ----------------------------------------------------------
# So le: lista o que ainda falta nesta maquina, com o comando que resolve.
Write-Output "Conferencia da maquina (check-machine.js)"
& node (Join-Path $SyncDir 'check-machine.js')
Write-Output ""

# ---- pendencias ------------------------------------------------------------
Write-Output "=============================================="
Write-Output " Pronto. Pendente nesta maquina:"
Write-Output "=============================================="
Write-Output ""
Write-Output "  1. Reinicie o Claude Code para carregar hooks e regras."
Write-Output ""
Write-Output "  2. MCP que exigem credencial (opcional). Ver SETUP_TODO.md:"
Write-Output "       github, supabase    -> precisam de token"
Write-Output "       vercel, cloudflare  -> OAuth, rode /mcp em sessao interativa"
Write-Output "       railway             -> precisa do Railway CLI logado"
Write-Output ""
Write-Output "  3. Conectores claude.ai (Gmail, Drive, Calendar, Canva):"
Write-Output "       autorize nas configuracoes de conectores do claude.ai."
Write-Output ""
Write-Output "  A config local desta maquina (permissions) foi preservada."
Write-Output "  ~/.claude.json nao e versionado: oauthAccount permanece so aqui."
Write-Output ""
exit 0
