#!/usr/bin/env node
'use strict';
/**
 * Verifica que os .ps1 do repo estao em ASCII puro.
 *
 *   node ~/.claude/scripts/sync/check-ascii.js
 *
 * Motivo: o PowerShell 5.1 le arquivos .ps1 sem BOM usando a codepage ANSI.
 * Um travessao ou letra acentuada vira byte invalido, o parser perde o
 * fechamento de bloco e o script inteiro falha com erro que nao aponta para a
 * causa real. Ja aconteceu uma vez com bootstrap.ps1.
 *
 * Sai com 1 se achar qualquer byte fora de ASCII.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function collectPs1(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectPs1(full, acc);
    else if (entry.name.toLowerCase().endsWith('.ps1')) acc.push(full);
  }
  return acc;
}

const files = collectPs1(ROOT);
let bad = 0;

for (const file of files) {
  const buf = fs.readFileSync(file);
  const lines = buf.toString('latin1').split(/\r?\n/);

  lines.forEach((line, i) => {
    for (let c = 0; c < line.length; c++) {
      const code = line.charCodeAt(c);
      if (code > 126 || (code < 32 && code !== 9)) {
        bad++;
        console.log(
          `  ${path.relative(ROOT, file)}:${i + 1}:${c + 1}  ` +
          `byte 0x${code.toString(16).padStart(2, '0')}  -> ${line.trim().slice(0, 60)}`
        );
        return; // um achado por linha basta
      }
    }
  });
}

console.log(`\nArquivos .ps1 verificados: ${files.length}`);
if (bad > 0) {
  console.log(`FALHOU: ${bad} linha(s) com caractere nao-ASCII.`);
  console.log('Troque travessao por hifen e remova acentos.');
  process.exit(1);
}
console.log('OK: todos em ASCII puro.');
