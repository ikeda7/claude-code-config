#!/usr/bin/env node
'use strict';
/**
 * Instala os plugins declarados em settings.shared.json.
 *
 *   node ~/.claude/scripts/sync/apply-plugins.js [--dry-run]
 *
 * Declarar em `enabledPlugins` + `extraKnownMarketplaces` nao basta: a extensao
 * do VS Code pula em silencio marketplaces que ainda nao estao no disco. Este
 * script chama o CLI (`claude plugin ...`) para registrar cada marketplace e
 * instalar o que faltar. Idempotente: plugin ja instalado e pulado.
 *
 * O CLI vem do PATH ou, na falta dele, do binario embutido na extensao do
 * VS Code. Sem CLI nenhum, avisa e sai com 0 (nao bloqueia o bootstrap).
 *
 * CLAUDE_HOME sobrescreve o diretorio home e forca --dry-run, porque o CLI
 * sempre escreve no ~/.claude real (usado pelos testes).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const HOME = process.env.CLAUDE_HOME || os.homedir();
const CLAUDE_DIR = path.join(HOME, '.claude');
const SHARED = path.join(__dirname, '..', '..', 'settings.shared.json');
const INSTALLED = path.join(CLAUDE_DIR, 'plugins', 'installed_plugins.json');
const DRY_RUN = process.argv.includes('--dry-run') || Boolean(process.env.CLAUDE_HOME);

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
}

/**
 * Binario nativo do `claude` no PATH, senao o da versao mais nova da extensao.
 * Wrappers .cmd do npm sao ignorados: exigiriam shell, sem escape de argumento.
 */
function findCli() {
  const isWin = process.platform === 'win32';
  const probe = spawnSync(isWin ? 'where' : 'which', ['claude'], { encoding: 'utf8' });
  const onPath = (probe.stdout || '').split(/\r?\n/)
    .find(p => p && (isWin ? p.toLowerCase().endsWith('.exe') : true));
  if (onPath) return onPath.trim();

  const extDir = path.join(os.homedir(), '.vscode', 'extensions');
  if (!fs.existsSync(extDir)) return null;
  const exe = process.platform === 'win32' ? 'claude.exe' : 'claude';
  const candidates = fs.readdirSync(extDir)
    .filter(d => d.startsWith('anthropic.claude-code-'))
    .map(d => path.join(extDir, d, 'resources', 'native-binary', exe))
    .filter(p => fs.existsSync(p))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  return candidates[0] || null;
}

/** Converte a `source` do settings no argumento aceito por `marketplace add`. */
function marketplaceArg(source) {
  if (!source) return null;
  if (source.source === 'github') return source.repo;
  if (source.source === 'git' || source.source === 'url') return source.url;
  if (source.source === 'directory') return source.path;
  return null;
}

/** `label` e o que aparece no log: o repo do marketplace ou o id do plugin. */
function run(cli, args, label) {
  if (DRY_RUN) {
    console.log('  [dry-run] claude ' + args.join(' '));
    return true;
  }
  const r = spawnSync(cli, args, { encoding: 'utf8' });
  const out = ((r.stdout || '') + (r.stderr || '')).trim().split('\n').pop();
  console.log('  ' + (r.status === 0 ? 'ok   ' : 'FALHA') + ' ' + label + (out ? '  -> ' + out : ''));
  return r.status === 0;
}

function main() {
  const shared = readJson(SHARED, null);
  if (!shared) {
    console.error('ERRO: ' + SHARED + ' nao encontrado.');
    process.exit(1);
  }

  const cli = DRY_RUN ? 'claude' : findCli();
  if (!cli) {
    console.log('  AVISO: CLI do Claude Code nao encontrado (nem no PATH, nem na extensao do VS Code).');
    console.log('  Plugins declarados, mas nao instalados. Instale o CLI e rode este script de novo.');
    return;
  }

  const installed = Object.keys(readJson(INSTALLED, { plugins: {} }).plugins || {});
  const failures = [];

  for (const [name, cfg] of Object.entries(shared.extraKnownMarketplaces || {})) {
    const arg = marketplaceArg(cfg.source);
    if (!arg) { failures.push('marketplace ' + name + ' (source desconhecida)'); continue; }
    if (!run(cli, ['plugin', 'marketplace', 'add', arg], name)) failures.push('marketplace ' + name);
  }

  const wanted = Object.entries(shared.enabledPlugins || {}).filter(([, on]) => on).map(([id]) => id);
  const missing = wanted.filter(id => !installed.includes(id));
  console.log('  plugins: ' + wanted.length + ' declarados, ' + missing.length + ' a instalar');
  for (const id of missing) {
    if (!run(cli, ['plugin', 'install', id, '--scope', 'user'], id)) failures.push(id);
  }

  if (failures.length) {
    console.log('  AVISO: falharam: ' + failures.join(', '));
    process.exitCode = 1;
  }
}

main();
