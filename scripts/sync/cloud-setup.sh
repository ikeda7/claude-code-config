#!/bin/bash
# Leva esta config para o ~/.claude de uma VM de nuvem do Claude Code
# (claude.ai/code, app desktop ou mobile em sessao na nuvem).
#
# Na nuvem o ~/.claude comeca vazio: o que vale no seu PC nao vai junto. Este
# script e o equivalente Linux do bootstrap.ps1, feito para o "Setup script"
# do ambiente de nuvem. Uso (texto completo em docs/manual.md, secao 9):
#
#   git clone --depth 1 https://github.com/ikeda7/claude-code-config /opt/claude-code-config
#   bash /opt/claude-code-config/scripts/sync/cloud-setup.sh
#
# O que faz:
#   - copia CLAUDE.md, rules, skills, agents, commands, scripts, prompts e
#     contexts para ~/.claude (sem apagar o que o ambiente ja pos la)
#   - mescla hooks, env, plugins e marketplaces do settings.shared.json no
#     ~/.claude/settings.json; model, effortLevel e statusLine ficam de fora,
#     porque na nuvem o modelo e escolhido na interface
#   - injeta os MCP servers portateis (apply-mcp.js)
#   - instala o playwright-cli e os plugins (apply-plugins.js), com limite
#     de tempo; pule os plugins com --no-plugins
#
# Nunca sai com erro: setup script com exit != 0 impede a sessao de abrir.
# CLAUDE_CLOUD_HOME troca o destino (usado em teste).

set -u
SRC="$(cd "$(dirname "$0")/../.." && pwd)"
HOME_DIR="${CLAUDE_CLOUD_HOME:-$HOME}"
DEST="$HOME_DIR/.claude"
PLUGINS=1
for arg in "$@"; do
  [ "$arg" = "--no-plugins" ] && PLUGINS=0
done

echo "[cloud-setup] origem: $SRC -> destino: $DEST"
mkdir -p "$DEST"

# ---- 1. arquivos -----------------------------------------------------------
for d in rules skills agents commands scripts prompts contexts; do
  mkdir -p "$DEST/$d"
  cp -R "$SRC/$d/." "$DEST/$d/" || echo "[cloud-setup] AVISO: falhou copiar $d"
done

# CLAUDE.md descreve a maquina Windows; a nota final situa a sessao na nuvem.
{
  cat "$SRC/CLAUDE.md"
  cat <<'EOF'

## Sessao na nuvem

Esta copia foi instalada pelo `scripts/sync/cloud-setup.sh` no setup script do
ambiente de nuvem. Aqui o SO e Linux (Ubuntu), nao Windows: os scripts
`.ps1` e o `bootstrap.ps1` nao se aplicam. Fluxo, regras, skills, agents,
commands e hooks valem igual. Para mudar a config, edite o repositorio
`ikeda7/claude-code-config` e abra uma sessao nova (o ambiente reconstroi o
cache quando o setup script muda ou a cada ~7 dias).
EOF
} > "$DEST/CLAUDE.md"

# ---- 2. settings -----------------------------------------------------------
node - "$SRC/settings.shared.json" "$DEST/settings.json" <<'EOF' || echo "[cloud-setup] AVISO: falhou mesclar settings"
const fs = require('fs');
const [shared, target] = process.argv.slice(2);
const read = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, '')); } catch (_) { return {}; } };
const s = read(shared);
const t = read(target);
const KEYS = ['hooks', 'env', 'enabledPlugins', 'extraKnownMarketplaces'];
for (const k of KEYS) {
  if (s[k] === undefined) continue;
  t[k] = (k === 'hooks') ? s[k] : Object.assign({}, t[k] || {}, s[k]);
}
fs.writeFileSync(target, JSON.stringify(t, null, 2) + '\n');
console.log('[cloud-setup] settings.json: ' + KEYS.filter(k => s[k] !== undefined).join(', '));
EOF

# ---- 3. MCP ----------------------------------------------------------------
CLAUDE_HOME="$HOME_DIR" node "$SRC/scripts/sync/apply-mcp.js" \
  || echo "[cloud-setup] AVISO: falhou aplicar MCP"

# ---- 4. playwright-cli -----------------------------------------------------
# A skill playwright-cli chama o binario; o bootstrap.ps1 faz o mesmo no PC.
if [ -z "${CLAUDE_CLOUD_HOME:-}" ] && ! command -v playwright-cli >/dev/null 2>&1; then
  timeout 90 npm install -g @playwright/cli@latest >/dev/null 2>&1 \
    || echo "[cloud-setup] AVISO: playwright-cli nao instalou"
fi

# ---- 5. plugins ------------------------------------------------------------
# O cache do ambiente so e gravado se o setup terminar em ~5 min; por isso o
# limite. Plugin que nao instalar fica de fora, sem travar a sessao.
if [ "$PLUGINS" = "1" ] && [ -z "${CLAUDE_CLOUD_HOME:-}" ]; then
  timeout 200 node "$SRC/scripts/sync/apply-plugins.js" \
    || echo "[cloud-setup] AVISO: plugins incompletos (tempo ou rede); o resto funciona"
else
  echo "[cloud-setup] plugins pulados"
fi

echo "[cloud-setup] pronto"
exit 0
