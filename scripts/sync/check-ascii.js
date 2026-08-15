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

function collect(dir, exts, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full, exts, acc);
    else if (exts.some(e => entry.name.toLowerCase().endsWith(e))) acc.push(full);
  }
  return acc;
}

let bad = 0;

// ---- BOM ------------------------------------------------------------------
// Um BOM em .js quebra `node --check` logo no shebang, e em .json quebra
// JSON.parse. PowerShell 5.1 introduz BOM com Out-File/Set-Content -Encoding
// utf8, entao isso reaparece toda vez que alguem edita por ali.
const bomFiles = collect(ROOT, ['.js', '.json', '.mjs', '.ps1']);
for (const file of bomFiles) {
  const buf = fs.readFileSync(file);
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    bad++;
    console.log(`  BOM  ${path.relative(ROOT, file)}`);
  }
}

// ---- ASCII nos .ps1 -------------------------------------------------------
const files = collect(ROOT, ['.ps1']);

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

console.log(`\nBOM verificado em ${bomFiles.length} arquivo(s); ASCII em ${files.length} .ps1`);
if (bad > 0) {
  console.log(`FALHOU: ${bad} problema(s) de encoding.`);
  console.log('  .ps1: troque travessao por hifen e remova acentos.');
  console.log('  BOM:  grave com UTF-8 sem BOM (nunca Out-File -Encoding utf8 no PS 5.1).');
  process.exit(1);
}
console.log('OK: sem BOM e .ps1 em ASCII puro.');
