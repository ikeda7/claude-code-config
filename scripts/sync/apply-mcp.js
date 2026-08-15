#!/usr/bin/env node
'use strict';
/**
 * Injeta os MCP servers portateis em ~/.claude.json (escopo global).
 *
 *   node ~/.claude/scripts/sync/apply-mcp.js [--force] [caminho-extra ...]
 *
 * Preserva TODO o resto do arquivo — inclusive `oauthAccount` e `projects`.
 * Por padrao nao sobrescreve server ja existente; use --force para isso.
 *
 * Os roots do `filesystem` sao resolvidos por maquina: so entram diretorios
 * que existem de fato ali. Caminhos extras podem vir por argumento.
 *
 * CLAUDE_HOME sobrescreve o diretorio home (usado pelos testes).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.CLAUDE_HOME || os.homedir();
const TARGET = path.join(HOME, '.claude.json');
const SHARED = path.join(__dirname, 'mcp-shared.json');

const args = process.argv.slice(2);
const force = args.includes('--force');
const extraRoots = args.filter(a => !a.startsWith('--'));

/** Candidatos a root do filesystem. So os existentes entram. */
function resolveRoots() {
  const candidates = [
    path.join(HOME, 'Desktop'),
    path.join(HOME, 'Documents'),
    'G:\\Meu Drive',
    'H:\\Meu Drive',
    path.join(HOME, 'Google Drive'),
    path.join(HOME, 'OneDrive'),
    ...extraRoots,
  ];

  const seen = new Set();
  const roots = [];
  for (const c of candidates) {
    if (!c) continue;
    const norm = path.normalize(c);
    if (seen.has(norm.toLowerCase())) continue;
    seen.add(norm.toLowerCase());
    try {
      if (fs.statSync(norm).isDirectory()) roots.push(norm);
    } catch { /* nao existe nesta maquina */ }
  }
  return roots;
}

function backup(file) {
  if (!fs.existsSync(file)) return null;
  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
  const dir = path.join(HOME, '.claude', 'backups', `pre-mcp-${stamp}`);
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, path.basename(file));
  fs.copyFileSync(file, dest);
  return dir;
}

function main() {
  if (!fs.existsSync(SHARED)) {
    console.error(`ERRO: ${SHARED} nao encontrado.`);
    process.exit(1);
  }

  const shared = JSON.parse(fs.readFileSync(SHARED, 'utf8')).mcpServers || {};
  const roots = resolveRoots();

  let target = {};
  if (fs.existsSync(TARGET)) {
    try {
      target = JSON.parse(fs.readFileSync(TARGET, 'utf8'));
    } catch (err) {
      console.error(`ERRO: ${TARGET} nao e JSON valido (${err.message}). Abortado.`);
      process.exit(1);
    }
  }

  const hadOauth = Boolean(target.oauthAccount);
  const keyCountBefore = Object.keys(target).length;

  const backupDir = backup(TARGET);

  target.mcpServers = target.mcpServers || {};

  const added = [];
  const kept = [];
  const replaced = [];

  for (const [name, cfgRaw] of Object.entries(shared)) {
    // resolve o placeholder de roots
    const cfg = JSON.parse(JSON.stringify(cfgRaw));
    if (Array.isArray(cfg.args)) {
      const i = cfg.args.indexOf('__ROOTS__');
      if (i !== -1) {
        if (roots.length === 0) {
          console.warn(`AVISO: nenhum root valido nesta maquina; '${name}' ignorado.`);
          continue;
        }
        cfg.args.splice(i, 1, ...roots);
      }
    }

    if (target.mcpServers[name] && !force) {
      kept.push(name);
      continue;
    }
    if (target.mcpServers[name]) replaced.push(name);
    else added.push(name);
    target.mcpServers[name] = cfg;
  }

  fs.writeFileSync(TARGET, JSON.stringify(target, null, 2) + '\n', 'utf8');

  // verificacao pos-escrita
  const after = JSON.parse(fs.readFileSync(TARGET, 'utf8'));
  if (hadOauth && !after.oauthAccount) {
    console.error('ERRO CRITICO: oauthAccount sumiu. Restaure de ' + backupDir);
    process.exit(1);
  }

  console.log('MCP aplicado em ' + TARGET);
  if (backupDir) console.log('  backup:      ' + backupDir);
  console.log('  roots:       ' + (roots.join(' | ') || '(nenhum)'));
  console.log('  adicionados: ' + (added.join(', ') || '(nenhum)'));
  if (replaced.length) console.log('  substituidos:' + replaced.join(', '));
  if (kept.length) console.log('  preservados: ' + kept.join(', ') + '  (use --force para sobrescrever)');
  console.log('  chaves no arquivo: ' + keyCountBefore + ' -> ' + Object.keys(after).length);
  console.log('  oauthAccount: ' + (after.oauthAccount ? 'intacto' : 'ausente (nao havia)'));
}

main();
