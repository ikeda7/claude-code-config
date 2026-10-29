#!/usr/bin/env node
'use strict';
/**
 * Aplica as chaves de scripts/sync/claude-mem-shared.json no
 * ~/.claude-mem/settings.json desta maquina.
 *
 *   node ~/.claude/scripts/sync/apply-claude-mem.js [--dry-run]
 *
 * So troca as chaves listadas; o resto do arquivo fica como esta. Se o
 * claude-mem ainda nao criou o settings.json (nunca rodou nesta maquina),
 * avisa e sai sem erro: rode de novo depois da primeira sessao.
 * Faz backup em settings.json.bak-<data> antes de gravar.
 *
 * CLAUDE_HOME sobrescreve o diretorio home (usado em teste).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.CLAUDE_HOME || os.homedir();
const TARGET = path.join(HOME, '.claude-mem', 'settings.json');
const SOURCE = path.join(__dirname, 'claude-mem-shared.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

/** Chaves do repo cujo valor local difere (ou falta). */
function pending(local, wanted) {
  return Object.keys(wanted).filter(k => local[k] !== wanted[k]);
}

function isApplied() {
  try {
    return pending(readJson(TARGET), readJson(SOURCE).settings).length === 0;
  } catch (_) {
    return false;
  }
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  if (!fs.existsSync(TARGET)) {
    console.log('  claude-mem ainda nao criou ' + TARGET + '; rode de novo depois da primeira sessao.');
    return 0;
  }
  let local;
  try {
    local = readJson(TARGET);
  } catch (e) {
    console.log('  ERRO: ' + TARGET + ' nao e JSON valido: ' + e.message);
    return 1;
  }
  const wanted = readJson(SOURCE).settings;
  const keys = pending(local, wanted);
  if (!keys.length) {
    console.log('  ja estava igual ao repo');
    return 0;
  }
  for (const k of keys) console.log('    - ' + k + ': ' + (local[k] === undefined ? '(ausente)' : local[k]) + ' -> ' + wanted[k]);
  if (dryRun) {
    console.log('    (dry-run: nada gravado)');
    return 0;
  }
  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
  fs.copyFileSync(TARGET, TARGET + '.bak-' + stamp);
  const tmp = TARGET + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify({ ...local, ...wanted }, null, 2) + '\n', 'utf8');
  fs.renameSync(tmp, TARGET);
  console.log('  gravado; vale a partir da proxima sessao (o worker rele ao reiniciar)');
  return 0;
}

if (require.main === module) process.exit(main());

module.exports = { isApplied };
