#!/usr/bin/env node
/**
 * Docs sync check (Stop)
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Enforces rules/common/documentacao-viva.md: a change is not done until the
 * docs it affects are updated. When the working tree has code changes and no
 * documentation changes, the stop is blocked once, asking the agent to update
 * the docs or state explicitly why they do not change.
 *
 * Opt-in per repository: only runs where a `docs/` directory exists at the
 * repo root, so throwaway scripts and repos without docs are left alone.
 *
 * Nags once per new set of changed code files: acknowledged files are stored
 * per repo + HEAD in ~/.claude/state, so a justified "docs do not change" is
 * not asked again until another code file changes or a new commit lands.
 *
 * Never blocks on failure: any error exits 0 with stdin passed through.
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const GIT_TIMEOUT_MS = 5000;
const MAX_FILES_LISTED = 10;
const MAX_STATE_KEYS = 200;

const DOC_PATTERNS = [/^docs\//i, /\.(md|mdx|markdown|adoc|rst)$/i];

// Changes that never call for a doc update on their own.
const IGNORED_PATTERNS = [
  /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb?|pubspec\.lock|Cargo\.lock|go\.sum|poetry\.lock|gradle\.lockfile)$/,
  /(^|\/)\.gitignore$/,
  /(^|\/)\.(vscode|idea)\//,
  /\.(png|jpe?g|gif|svg|ico|webp)$/i
];

function stateFile() {
  const override = process.env.ECC_DOCS_SYNC_STATE_FILE;
  if (override && override.trim()) return path.resolve(override.trim());
  return path.join(os.homedir(), '.claude', 'state', 'docs-sync-check.json');
}

function git(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', timeout: GIT_TIMEOUT_MS });
  if (result.error || result.status !== 0) return null;
  return result.stdout.trim();
}

function lines(text) {
  return text ? text.split(/\r?\n/).filter(Boolean) : [];
}

function changedFiles(root) {
  const head = git(root, ['rev-parse', 'HEAD']);
  const tracked = head ? git(root, ['diff', '--name-only', 'HEAD']) : git(root, ['diff', '--name-only', '--cached']);
  const untracked = git(root, ['ls-files', '--others', '--exclude-standard']);
  if (tracked === null || untracked === null) return null;
  const files = [...new Set([...lines(tracked), ...lines(untracked)])].map(f => f.replace(/\\/g, '/'));
  return { head: head || 'no-head', files };
}

function classify(files) {
  const relevant = files.filter(f => !IGNORED_PATTERNS.some(p => p.test(f)));
  const docs = relevant.filter(f => DOC_PATTERNS.some(p => p.test(f)));
  const code = relevant.filter(f => !DOC_PATTERNS.some(p => p.test(f)));
  return { docs, code };
}

function readState(file) {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeState(file, state) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(state, null, 2));
}

function stateKey(root, head) {
  return crypto.createHash('sha1').update(`${path.resolve(root).toLowerCase()}|${head}`).digest('hex');
}

function buildReason(code) {
  const listed = code.slice(0, MAX_FILES_LISTED).map(f => `- ${f}`);
  if (code.length > MAX_FILES_LISTED) listed.push(`- ... e mais ${code.length - MAX_FILES_LISTED}`);
  return [
    '[docs-sync-check] Codigo alterado sem nenhuma alteracao de documentacao (regra documentacao-viva):',
    ...listed,
    '',
    'Atualize os docs afetados (docs/fluxos, docs/README.md, ADRs, docs/setup.md) ou diga explicitamente por que a doc nao muda. Este aviso nao se repete para estes arquivos.'
  ].join('\n');
}

function run(rawInput) {
  const passThrough = { stdout: rawInput || '', exitCode: 0 };
  try {
    const payload = JSON.parse(rawInput || '{}');

    // Already resumed by a Stop hook: blocking again would wedge the session.
    if (payload.stop_hook_active) return passThrough;

    const root = git(payload.cwd || process.cwd(), ['rev-parse', '--show-toplevel']);
    if (!root || !fs.existsSync(path.join(root, 'docs'))) return passThrough;

    const changes = changedFiles(root);
    if (!changes) return passThrough;

    const { docs, code } = classify(changes.files);
    if (code.length === 0 || docs.length > 0) return passThrough;

    const file = stateFile();
    const state = readState(file);
    const key = stateKey(root, changes.head);
    const acknowledged = new Set(Array.isArray(state[key]) ? state[key] : []);
    const fresh = code.filter(f => !acknowledged.has(f));
    if (fresh.length === 0) return passThrough;

    // Newest key last; old repo/HEAD pairs are dropped so the file stays small.
    const { [key]: _previous, ...others } = state;
    const kept = Object.entries(others).slice(-(MAX_STATE_KEYS - 1));
    writeState(file, { ...Object.fromEntries(kept), [key]: [...new Set([...acknowledged, ...code])] });

    return {
      stdout: JSON.stringify({ decision: 'block', reason: buildReason(fresh) }),
      exitCode: 0
    };
  } catch (err) {
    process.stderr.write(`[Hook] docs-sync-check error: ${err.message}\n`);
    return passThrough;
  }
}

module.exports = { run, classify, buildReason };
