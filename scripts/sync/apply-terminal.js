#!/usr/bin/env node
'use strict';
/**
 * Aplica a personalizacao do Windows Terminal versionada em
 * terminal/windows-terminal.json no settings.json do Terminal desta maquina.
 *
 *   node ~/.claude/scripts/sync/apply-terminal.js [--dry-run] [--set-default]
 *
 * Funde, nao substitui:
 *   - settings e defaults: as chaves do repo sobrescrevem; as outras ficam.
 *   - profiles: troca pelo guid (ou pelo nome, se ja houver um "Claude Code"
 *     com outro guid); perfis que nao sao do repo ficam intactos.
 *   - actions pelo id; keybindings pelo id e pela tecla (a tecla do repo vence).
 *   - defaultProfile: so troca se o padrao atual nao for um perfil WSL.
 *     Numa maquina em que o WSL e o padrao de proposito, ele continua.
 *     --set-default troca mesmo assim.
 * Perfil com "_requires" so entra se o arquivo indicado existir (ex.: Git Bash).
 * Antes de gravar, copia o settings.json para settings.json.bak-<data>.
 *
 * Comentarios do settings.json do Terminal (JSONC) nao sobrevivem a regravacao;
 * o backup guarda o original.
 *
 * WT_SETTINGS_PATH aponta para outro arquivo (usado em teste).
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SOURCE = path.join(ROOT, 'terminal', 'windows-terminal.json');
const WSL_HINT = /wsl|ubuntu|debian|kali|opensuse|alpine/i;

function settingsCandidates() {
  if (process.env.WT_SETTINGS_PATH) return [process.env.WT_SETTINGS_PATH];
  const local = process.env.LOCALAPPDATA || '';
  return [
    path.join(local, 'Packages', 'Microsoft.WindowsTerminal_8wekyb3d8bbwe', 'LocalState', 'settings.json'),
    path.join(local, 'Packages', 'Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe', 'LocalState', 'settings.json'),
    path.join(local, 'Microsoft', 'Windows Terminal', 'settings.json'),
  ];
}

function findSettingsFiles() {
  return settingsCandidates().filter(f => fs.existsSync(f));
}

// Uma passada que respeita strings: remove comentarios // e /* */ e virgula
// antes de } ou ]. Texto dentro de string nunca e alterado.
function stripJsonc(src) {
  let out = '';
  let inStr = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    const next = src[i + 1];
    if (inStr) {
      out += ch;
      if (ch === '\\') { out += next; i++; } else if (ch === '"') inStr = false;
    } else if (ch === '"') {
      inStr = true; out += ch;
    } else if (ch === '/' && next === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      out += '\n';
    } else if (ch === '/' && next === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i++;
    } else if (ch === ',' && /^[}\]]/.test(stripLeadingComments(src.slice(i + 1)))) {
      // virgula sobrando: descarta
    } else {
      out += ch;
    }
  }
  return out;
}

// Pula espaco e comentarios no inicio de um trecho (para olhar o proximo token).
function stripLeadingComments(rest) {
  let s = rest;
  for (;;) {
    const t = s.replace(/^\s+/, '');
    if (t.startsWith('//')) s = t.slice(t.indexOf('\n') + 1 || t.length);
    else if (t.startsWith('/*')) s = t.slice((t.indexOf('*/') + 2) || t.length);
    else return t;
  }
}

function parseJsonc(text) {
  const src = text.replace(/^\uFEFF/, '');
  try {
    return JSON.parse(src);
  } catch (_) {
    return JSON.parse(stripJsonc(src));
  }
}

function readSource() {
  return JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
}

function wantedProfiles(source) {
  return source.profiles
    .filter(p => !p._requires || fs.existsSync(p._requires))
    .map(({ _requires, ...p }) => p);
}

function isWslProfile(p) {
  return Boolean(p) && (WSL_HINT.test(p.source || '') || WSL_HINT.test(p.commandline || '') || WSL_HINT.test(p.name || ''));
}

function upsertProfiles(list, wanted, log) {
  let out = list.slice();
  // Ao contrario para que os perfis novos fiquem no topo na ordem do repo.
  for (const p of wanted.slice().reverse()) {
    const sameName = out.filter(x => x.name === p.name && x.guid !== p.guid && !x.source);
    if (sameName.length) {
      log.push('perfil "' + p.name + '" com outro guid substituido pelo do repo');
      out = out.filter(x => !sameName.includes(x));
    }
    const idx = out.findIndex(x => x.guid === p.guid);
    if (idx >= 0) {
      const merged = { ...out[idx], ...p };
      if (JSON.stringify(merged) !== JSON.stringify(out[idx])) log.push('perfil "' + p.name + '" atualizado');
      out[idx] = merged;
    } else {
      log.push('perfil "' + p.name + '" criado');
      out.unshift(p);
    }
  }
  return out;
}

// Troca no lugar pelo id; remove o que colide pela outra chave; o resto entra no fim.
function upsertById(list, wanted, sameKey) {
  let out = (list || []).slice();
  for (const w of wanted) {
    out = out.filter(x => x.id === w.id || !(sameKey && sameKey(w, x)));
    const idx = out.findIndex(x => x.id === w.id);
    if (idx >= 0) out[idx] = { ...out[idx], ...w };
    else out.push(w);
  }
  return out;
}

/** Devolve { next, log, notes } sem tocar no disco; log vazio = nada a gravar. */
function merge(current, source, opts) {
  const log = [];
  const notes = [];
  const next = { ...current, ...source.settings };
  for (const k of Object.keys(source.settings)) {
    if (JSON.stringify(current[k]) !== JSON.stringify(source.settings[k])) log.push('settings.' + k);
  }

  // "profiles" pode ser so a lista (formato antigo do Terminal).
  const profiles = Array.isArray(current.profiles)
    ? { list: current.profiles }
    : { ...(current.profiles || {}) };
  const defaults = { ...(profiles.defaults || {}), ...source.defaults };
  if (JSON.stringify(defaults) !== JSON.stringify(profiles.defaults || {})) log.push('profiles.defaults');
  profiles.defaults = defaults;
  profiles.list = upsertProfiles(profiles.list || [], wantedProfiles(source), log);
  next.profiles = profiles;

  // defaultProfile pode ser guid ou nome. Se nao esta na lista, e um perfil
  // dinamico que o Terminal nao gravou (tipico do WSL): trata como WSL.
  const currentDefault = profiles.list.find(p => p.guid === current.defaultProfile || p.name === current.defaultProfile);
  const keepCurrent = current.defaultProfile && (!currentDefault || isWslProfile(currentDefault));
  if (current.defaultProfile !== source.defaultProfile) {
    if (keepCurrent && !opts.setDefault) {
      const label = currentDefault ? currentDefault.name : current.defaultProfile;
      notes.push('perfil padrao mantido em "' + label + '" (WSL ou perfil dinamico); use --set-default para trocar');
    } else {
      next.defaultProfile = source.defaultProfile;
      log.push('perfil padrao -> Claude Code');
    }
  }

  const actions = upsertById(current.actions, source.actions);
  const keybindings = upsertById(current.keybindings, source.keybindings, (w, x) => String(w.keys).toLowerCase() === String(x.keys).toLowerCase());
  if (JSON.stringify(actions) !== JSON.stringify(current.actions || [])) log.push('actions');
  if (JSON.stringify(keybindings) !== JSON.stringify(current.keybindings || [])) log.push('keybindings');
  next.actions = actions;
  next.keybindings = keybindings;

  return { next, log, notes };
}

/** Usado pelo check-machine.js: o perfil do repo existe em algum settings? */
function isApplied() {
  let guid;
  try {
    guid = readSource().profiles[0].guid;
  } catch (_) {
    return false;
  }
  return findSettingsFiles().some(f => {
    try {
      const s = parseJsonc(fs.readFileSync(f, 'utf8'));
      const list = Array.isArray(s.profiles) ? s.profiles : ((s.profiles && s.profiles.list) || []);
      return list.some(p => p.guid === guid);
    } catch (_) {
      return false;
    }
  });
}

function stamp() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
}

function main() {
  const args = process.argv.slice(2);
  const opts = { dryRun: args.includes('--dry-run'), setDefault: args.includes('--set-default') };

  if (process.platform !== 'win32' && !process.env.WT_SETTINGS_PATH) {
    console.log('  Windows Terminal so existe no Windows: nada a fazer.');
    return 0;
  }
  const files = findSettingsFiles();
  if (!files.length) {
    console.log('  AVISO: settings.json do Windows Terminal nao encontrado.');
    console.log('  Instale o Windows Terminal (winget install Microsoft.WindowsTerminal),');
    console.log('  abra-o uma vez e rode este script de novo.');
    return 0;
  }

  const where = spawnSync('where', ['claude'], { encoding: 'utf8', shell: true });
  if (process.platform === 'win32' && where.status !== 0) {
    console.log('  AVISO: "claude" nao esta no PATH; o perfil Claude Code vai abrir so o cmd.');
  }

  const source = readSource();
  let failed = 0;
  for (const file of files) {
    let current;
    try {
      current = parseJsonc(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      console.log('  ERRO: nao consegui ler ' + file + ': ' + e.message);
      failed++;
      continue;
    }
    const { next, log, notes } = merge(current, source, opts);
    console.log('  ' + file);
    for (const line of notes) console.log('    * ' + line);
    if (!log.length) {
      console.log('    ja estava igual ao repo');
      continue;
    }
    for (const line of log) console.log('    - ' + line);
    if (opts.dryRun) {
      console.log('    (dry-run: nada gravado)');
      continue;
    }
    const backup = file + '.bak-' + stamp();
    fs.copyFileSync(file, backup);
    // Grava ao lado e renomeia: uma queda no meio nao deixa o arquivo truncado.
    const tmp = file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(next, null, 4) + '\n', 'utf8');
    fs.renameSync(tmp, file);
    console.log('    gravado; backup em ' + backup);
  }
  return failed ? 1 : 0;
}

if (require.main === module) process.exit(main());

module.exports = { merge, parseJsonc, isApplied, findSettingsFiles };
