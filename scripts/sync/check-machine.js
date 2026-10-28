#!/usr/bin/env node
'use strict';
/**
 * Confere se esta maquina esta com a config completa. So le, nao altera nada.
 *
 *   node ~/.claude/scripts/sync/check-machine.js
 *
 * Substitui o checklist manual do SETUP_TODO.md: cada linha diz OK ou FALTA
 * e, quando falta, o comando que resolve. Roda sozinho no fim do
 * bootstrap.ps1. Sai com 1 se algum item obrigatorio faltar; itens opcionais
 * so avisam.
 *
 * CLAUDE_HOME sobrescreve o diretorio home (usado em teste).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const HOME = process.env.CLAUDE_HOME || os.homedir();
const CLAUDE_DIR = path.join(HOME, '.claude');
const IS_WIN = process.platform === 'win32';

const results = [];
function check(label, ok, fix, optional) {
  results.push({ label, ok: Boolean(ok), fix, optional: Boolean(optional) });
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  } catch (_) {
    return null;
  }
}

// shell: true para achar os wrappers .cmd do npm no Windows. Os argumentos
// sao fixos neste arquivo, nunca vindos de entrada externa.
function sh(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', shell: IS_WIN, cwd, timeout: 20000 });
  return { ok: r.status === 0, out: ((r.stdout || '') + (r.stderr || '')).trim() };
}

// Ordem de chave nao conta: o apply-shared.ps1 regrava o JSON pelo PowerShell.
function canonical(v) {
  if (Array.isArray(v)) return v.map(canonical);
  if (v && typeof v === 'object') {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = canonical(v[k]);
    return out;
  }
  return v;
}

function sameJson(a, b) {
  return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
}

// ---- 1. repositorio ---------------------------------------------------------
const sameDir = path.resolve(ROOT).toLowerCase() === path.resolve(CLAUDE_DIR).toLowerCase();
check('Repo clonado direto em ~/.claude', sameDir,
  'clone o repo em ~/.claude (ver README, "Maquina nova")');

sh('git', ['fetch', '--quiet', 'origin'], ROOT);
const behind = sh('git', ['rev-list', '--count', 'HEAD..@{u}'], ROOT);
check('Repo atualizado com o GitHub', behind.ok && behind.out === '0',
  'git -C ~/.claude pull, depois rode o bootstrap.ps1');

// ---- 2. settings ------------------------------------------------------------
const shared = readJson(path.join(ROOT, 'settings.shared.json')) || {};
const local = readJson(path.join(CLAUDE_DIR, 'settings.json'));
const drift = local
  ? Object.keys(shared).filter(k => !sameJson(shared[k], local[k]))
  : ['settings.json ausente'];
check('settings.json igual ao settings.shared.json' + (drift.length ? ' (difere: ' + drift.join(', ') + ')' : ''),
  drift.length === 0,
  'powershell -ExecutionPolicy Bypass -File ~/.claude/scripts/sync/apply-shared.ps1');

// ---- 3. plugins -------------------------------------------------------------
const installedFile = readJson(path.join(CLAUDE_DIR, 'plugins', 'installed_plugins.json'));
const installed = Object.keys((installedFile && installedFile.plugins) || {});
const wanted = Object.entries(shared.enabledPlugins || {}).filter(([, on]) => on).map(([id]) => id);
const missingPlugins = wanted.filter(id => !installed.includes(id));
check('Plugins instalados (' + (wanted.length - missingPlugins.length) + '/' + wanted.length + ')' +
  (missingPlugins.length ? ': faltam ' + missingPlugins.join(', ') : ''),
  missingPlugins.length === 0,
  'node ~/.claude/scripts/sync/apply-plugins.js');

// ---- 4. MCP -----------------------------------------------------------------
const mcpShared = readJson(path.join(__dirname, 'mcp-shared.json')) || { mcpServers: {} };
const claudeJson = readJson(path.join(HOME, '.claude.json')) || {};
const mcpLocal = Object.keys(claudeJson.mcpServers || {});
const missingMcp = Object.keys(mcpShared.mcpServers).filter(n => !mcpLocal.includes(n));
check('MCP servers globais' + (missingMcp.length ? ': faltam ' + missingMcp.join(', ') : ''),
  missingMcp.length === 0,
  'node ~/.claude/scripts/sync/apply-mcp.js');

// ---- 5. fluxo padrao ------------------------------------------------------
check('Skill fluxo presente', fs.existsSync(path.join(ROOT, 'skills', 'fluxo', 'SKILL.md')),
  'git -C ~/.claude pull');
check('Catalogo do fluxo completo', sh(process.execPath, [path.join(__dirname, 'check-fluxo.js')]).ok,
  'node ~/.claude/scripts/sync/check-fluxo.js e inclua o que faltar em skills/fluxo/catalogo.md');

// ---- 6. ferramentas ---------------------------------------------------------
const nodeMajor = Number(process.versions.node.split('.')[0]);
check('Node.js 18+ (atual ' + process.versions.node + ')', nodeMajor >= 18, 'instale Node.js LTS');
check('git no PATH', sh('git', ['--version']).ok, 'instale o Git for Windows');
check('gh autenticado', sh('gh', ['auth', 'status']).ok, 'gh auth login');
check('playwright-cli instalado', sh('playwright-cli', ['--version']).ok,
  'npm install -g @playwright/cli@latest');
// O claude-security chama `python3` (3.9+). No Windows, `python3` pode ser o
// atalho da Microsoft Store, que falha: isso conta como faltando.
const py = sh('python3', ['--version']);
const pyVer = (py.out.match(/Python (\d+)\.(\d+)/) || []).slice(1).map(Number);
check('python3 3.9+ no PATH (claude-security)' + (py.ok && pyVer.length ? ' (atual ' + pyVer.join('.') + ')' : ''),
  py.ok && pyVer.length === 2 && (pyVer[0] > 3 || (pyVer[0] === 3 && pyVer[1] >= 9)),
  'instale Python 3 e garanta que "python3 --version" responde (no Windows, desative o alias da Store em Configuracoes > Aliases de execucao de aplicativo)');
check('sh no PATH (hooks do claude-security)', sh('sh', ['--version']).ok || sh('sh', ['-c', 'exit 0']).ok,
  'instale o Git for Windows e ponha o Git\\bin no PATH');

// ---- 7. opcionais -----------------------------------------------------------
if (wanted.some(id => id.startsWith('omniroute@'))) {
  check('omniroute instalado (opcional, so para rotear modelos)', sh('omniroute', ['--version']).ok,
    'npm i -g omniroute e deixe "omniroute" rodando', true);
}

// ---- saida ------------------------------------------------------------------
let missing = 0;
for (const r of results) {
  const tag = r.ok ? 'OK   ' : (r.optional ? 'OPC  ' : 'FALTA');
  console.log(tag + ' ' + r.label);
  if (!r.ok) {
    console.log('      -> ' + r.fix);
    if (!r.optional) missing++;
  }
}
console.log('');
if (missing) {
  console.log(missing + ' item(ns) faltando. Rode os comandos indicados e depois este script de novo.');
  process.exit(1);
}
console.log('Maquina completa. Reinicie o Claude Code se algo mudou nesta rodada.');
