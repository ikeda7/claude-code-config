#!/usr/bin/env node
'use strict';
/**
 * Gera ~/.claude/settings.shared.json a partir do settings.json local.
 *
 * Rode DEPOIS de mudar hooks, env, model ou plugins, e antes de commitar.
 *
 *   node ~/.claude/scripts/sync/make-shared.js
 *
 * `permissions` fica de fora de proposito: sao aprovacoes pontuais de cada
 * maquina (caminhos absolutos, UUIDs de sessao, nomes de projeto) e ja
 * conteve credencial em texto claro. Nunca deve ir para o repositorio.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME_CLAUDE = path.join(os.homedir(), '.claude');
const SRC = path.join(HOME_CLAUDE, 'settings.json');
const OUT = path.join(HOME_CLAUDE, 'settings.shared.json');

/** Chaves que fazem sentido em qualquer maquina. */
const PORTABLE = [
  'hooks',
  'env',
  'model',
  'effortLevel',
  'enabledPlugins',
  'extraKnownMarketplaces',
  'autoUpdatesChannel',
];

/** Se algum destes casar no resultado, aborta sem escrever. */
const SECRET_PATTERNS = [
  /senha/i,
  /password/i,
  /passwd/i,
  /api[_-]?key/i,
  /client[_-]?secret/i,
  /ghp_[A-Za-z0-9]/,
  /gho_[A-Za-z0-9]/,
  /github_pat_/i,
  /sk-[A-Za-z0-9]/,
  /Bearer\s+[A-Za-z0-9]/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`ERRO: ${SRC} nao encontrado.`);
    process.exit(1);
  }

  const src = JSON.parse(fs.readFileSync(SRC, 'utf8'));

  const out = {};
  for (const key of PORTABLE) {
    if (src[key] !== undefined) out[key] = src[key];
  }

  const serialized = JSON.stringify(out, null, 2) + '\n';

  const hits = SECRET_PATTERNS.filter(p => p.test(serialized));
  if (hits.length > 0) {
    console.error('ABORTADO: possivel segredo no conteudo portatil.');
    for (const h of hits) console.error('  padrao: ' + h);
    console.error('Revise settings.json antes de sincronizar.');
    process.exit(1);
  }

  fs.writeFileSync(OUT, serialized, 'utf8');

  const excluded = Object.keys(src).filter(k => !PORTABLE.includes(k));
  console.log('settings.shared.json gerado.');
  console.log('  exportado: ' + Object.keys(out).join(', '));
  console.log('  excluido:  ' + (excluded.join(', ') || '(nada)'));
  console.log('  tamanho:   ' + Math.round(serialized.length / 1024) + ' KB');
  console.log('  segredos:  nenhum');
}

main();
