#!/usr/bin/env node
'use strict';
/**
 * Status line do Claude Code.
 *
 *   pasta  branch*  modelo  ctx 42%  5h 23% 14:30  sem 41% sex 09:00  $0.31  +120 -8
 *
 * Recebe o JSON da sessao no stdin. Todo campo e opcional: versoes do Claude
 * Code que nao mandam um campo simplesmente omitem aquele segmento.
 * Registrado em settings.shared.json -> statusLine.
 */

const path = require('path');
const { execFileSync } = require('child_process');

const GIT_TIMEOUT_MS = 800;
const CTX_WARN_PCT = 60;
const CTX_CRIT_PCT = 80;
const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

const c = (code, s) => `\x1b[${code}m${s}\x1b[0m`;
const dim = s => c('2', s);
const SEP = dim(' | ');

function gitBranch(cwd) {
  try {
    const opts = { cwd, timeout: GIT_TIMEOUT_MS, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' };
    const branch = execFileSync('git', ['--no-optional-locks', 'rev-parse', '--abbrev-ref', 'HEAD'], opts).trim();
    if (!branch) return null;
    const dirty = execFileSync('git', ['--no-optional-locks', 'status', '--porcelain', '-uno'], opts).trim().length > 0;
    return branch + (dirty ? '*' : '');
  } catch {
    return null;
  }
}

function contextPct(data) {
  const cw = data.context_window;
  if (!cw) return null;
  if (typeof cw.used_percentage === 'number') return Math.round(cw.used_percentage);
  const used = cw.current_usage
    ? (cw.current_usage.input_tokens || 0)
      + (cw.current_usage.cache_creation_input_tokens || 0)
      + (cw.current_usage.cache_read_input_tokens || 0)
    : null;
  if (used == null || !cw.context_window_size) return null;
  return Math.round((used / cw.context_window_size) * 100);
}

function pctColor(pct) {
  return pct >= CTX_CRIT_PCT ? '31' : pct >= CTX_WARN_PCT ? '33' : '32';
}

// resets_at vem em epoch segundos; a janela de 5h mostra a hora, a semanal o dia.
function resetLabel(resetsAt, withDay) {
  if (typeof resetsAt !== 'number') return '';
  const d = new Date(resetsAt * 1000);
  const hhmm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return withDay ? ` ${WEEKDAYS[d.getDay()]} ${hhmm}` : ` ${hhmm}`;
}

/**
 * Uso da assinatura (Pro/Max): "5h 23% 14:30 | sem 41% sex 09:00".
 * rate_limits so chega depois da primeira resposta da API na sessao.
 */
function rateLimitParts(rl) {
  if (!rl) return null;
  const windows = [
    ['5h', rl.five_hour, false],
    ['sem', rl.seven_day, true],
  ];
  const out = windows
    .filter(([, w]) => w && typeof w.used_percentage === 'number')
    .map(([label, w, withDay]) => {
      const pct = Math.round(w.used_percentage);
      return c(pctColor(pct), `${label} ${pct}%`) + dim(resetLabel(w.resets_at, withDay));
    });
  return out.length ? out.join(SEP) : null;
}

function render(data) {
  const cwd = (data.workspace && data.workspace.current_dir) || data.cwd || process.cwd();
  const parts = [c('1;36', path.basename(cwd) || cwd)];

  const branch = gitBranch(cwd);
  if (branch) parts.push(c(branch.endsWith('*') ? '33' : '32', branch));

  if (data.model && data.model.display_name) parts.push(c('35', data.model.display_name));

  const pct = contextPct(data);
  if (pct != null) parts.push(c(pctColor(pct), `ctx ${pct}%`));

  const limits = rateLimitParts(data.rate_limits);
  if (limits) parts.push(limits);

  const cost = data.cost || {};
  if (typeof cost.total_cost_usd === 'number') parts.push(dim(`$${cost.total_cost_usd.toFixed(2)}`));
  if (cost.total_lines_added || cost.total_lines_removed) {
    parts.push(c('32', `+${cost.total_lines_added || 0}`) + ' ' + c('31', `-${cost.total_lines_removed || 0}`));
  }

  return parts.join(SEP);
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let data = {};
  try {
    data = JSON.parse(raw.replace(/^﻿/, '') || '{}');
  } catch {
    // JSON invalido: mostra ao menos a pasta atual
  }
  process.stdout.write(render(data));
});
