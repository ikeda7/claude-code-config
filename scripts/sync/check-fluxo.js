#!/usr/bin/env node
'use strict';
/**
 * Verifica que toda skill, agent e command ativo esta no catalogo do fluxo.
 *
 *   node ~/.claude/scripts/sync/check-fluxo.js
 *
 * Motivo: o fluxo padrao (skills/fluxo) promete cobrir tudo que esta
 * instalado. Sem esta checagem, algo novo em skills/, agents/ ou commands/
 * fica invisivel para o fluxo e nunca e usado.
 *
 * Conta como citado o nome entre crases no catalogo: `nome` ou `/nome`.
 * Sai com 1 se faltar algum.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const CATALOG = path.join(ROOT, 'skills', 'fluxo', 'catalogo.md');

function names(dir, kind) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true })
    .filter(e => (kind === 'dir' ? e.isDirectory() : e.isFile() && e.name.endsWith('.md')))
    .map(e => (kind === 'dir' ? e.name : e.name.slice(0, -3)));
}

const catalog = fs.readFileSync(CATALOG, 'utf8');
const cited = new Set();
for (const m of catalog.matchAll(/`\/?([A-Za-z0-9_.:-]+)`/g)) cited.add(m[1]);

const groups = [
  ['skills', names('skills', 'dir')],
  ['agents', names('agents', 'file')],
  ['commands', names('commands', 'file')],
];

let missing = 0;
for (const [dir, list] of groups) {
  for (const name of list) {
    if (!cited.has(name)) {
      console.error(`[check-fluxo] ${dir}/${name} nao esta em skills/fluxo/catalogo.md`);
      missing++;
    }
  }
}

if (missing) {
  console.error(`[check-fluxo] ${missing} item(ns) fora do catalogo. Inclua uma linha (fase e quando usar, ou F com o motivo).`);
  process.exit(1);
}
const total = groups.reduce((n, [, list]) => n + list.length, 0);
console.log(`[check-fluxo] OK: ${total} itens catalogados.`);
