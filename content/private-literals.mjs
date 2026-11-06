// private-literals.mjs: the keyed matcher for private literals, shared by
// content/check-content.mjs, site/scripts/check-dist.mjs, site/scripts/validate-data.mjs and the
// site's dist tests. No dependencies (Node 18+).
//
// Some literals must never appear in this public repository or on the site (LL-7, LL-31). They are
// matched by an HMAC-SHA256 of a lower-cased token under a secret key, never written here, and
// their labels say nothing about what they are (audit-security round 2, S1: plain SHA-256 of a
// dictionary word can be reversed by hashing public word lists; a keyed digest cannot without the
// key). Tokens tried: every word or dotted/at-sign token, its parts split on . @ / - _, and adjacent
// word pairs (joined with and without a space).
//
// The key: the PRIVATE_LITERALS_KEY environment variable (a CI secret), else the git-ignored file
// data/private/private-literals.key. The plain literals and what each one is are in the git-ignored
// data/private/private-literals.json. Without a key the matcher fails closed in CI and in release
// builds (CI or RELEASE=1: importing this file throws); on a developer machine it warns once and
// matches nothing.
//
// To add a literal: put it in data/private/private-literals.json, run
//   node content/private-literals.mjs --digest 'the token'
// and add the printed digest below with the next generic label. To change the key: write a new
// key file, run `node content/private-literals.mjs --rebuild` (it prints the new table from the
// private JSON), paste it here and update the CI secret.
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const KEY_FILE = join(here, '..', 'data', 'private', 'private-literals.key');
export const PRIVATE_FILE = join(here, '..', 'data', 'private', 'private-literals.json');

export function loadKey(env = process.env) {
  if (env.PRIVATE_LITERALS_KEY && env.PRIVATE_LITERALS_KEY.trim()) return env.PRIVATE_LITERALS_KEY.trim();
  try { return readFileSync(KEY_FILE, 'utf8').trim() || null; } catch { return null; }
}
export const KEY = loadKey();
export const STRICT = Boolean(process.env.CI) || process.env.RELEASE === '1';
if (!KEY && STRICT) {
  throw new Error('content/private-literals.mjs: no key for the private-literal check. Set PRIVATE_LITERALS_KEY (CI secret) or create data/private/private-literals.key. The check fails closed in CI and release builds.');
}

export const PRIVATE_HASHES = new Map([
  ['8acbf0d82b2b671ff0e3fbcaeb0218e817b3d173fd31d894144e0cc5f32f735e', 'private literal P1'],
  ['ea6ce4733b8604c4800279fb041c0529dbb0752854ecacfed8386f465a1dcb37', 'private literal P2'],
  ['708aadc7fe42db927f180a49b7f33ec17e546fc654d615f75be87c882f3f6812', 'private literal P3'],
  ['6fc1e9b9955b7845b6f47a327b6eb949905c8ff02c757d359c88c13aa2338d20', 'private literal P4'],
  ['d7cdad84a3be17cc5a28986250ad3a0b283484169f7f88081529d5146a9ecab0', 'private literal P5'],
  ['5873f749d4392e386d5276f406a47c24fd2943bcadcae78d948ab057bf2ed8e8', 'private literal P6'],
  ['6b8af0fa26a6764f737bfcea3f1acaf9416ef4ef5f58b9af551897b03ebf8d40', 'private literal P7'],
  ['d5666a5ac38c2934235aaa8bee2cf08f60b6580609e72e93d806dad75e75253f', 'private literal P8'],
]);

/** The keyed digest of one token. */
export const digest = (s, key = KEY) => createHmac('sha256', key).update(s).digest('hex');

let warned = false;
function noKey() {
  if (!warned) { warned = true; console.warn('WARN private-literals: no key (PRIVATE_LITERALS_KEY or data/private/private-literals.key); the private-literal check is OFF on this machine. CI and release builds refuse to run without it.'); }
  return [];
}

/** Labels of every private literal found in the text (empty when clean). */
export function privateHits(text, hashes = PRIVATE_HASHES, key = KEY) {
  if (!key) return noKey();
  const toks = String(text).toLowerCase().match(/[a-z0-9][a-z0-9@._-]*[a-z0-9]|[a-z0-9]/g) || [];
  const cands = new Set();
  toks.forEach((t, k) => {
    cands.add(t);
    for (const part of t.split(/[.@\/_-]+/)) if (part) cands.add(part);
    const nx = toks[k + 1];
    if (nx) { cands.add(`${t} ${nx}`); cands.add(t + nx); }
  });
  const out = [];
  for (const c of cands) { const label = hashes.get(digest(c, key)); if (label) out.push(label); }
  return [...new Set(out)];
}

/** The 1-based line numbers of the lines that hold a private literal, with their labels. */
export function privateLines(text, hashes = PRIVATE_HASHES, key = KEY) {
  if (!key) return noKey();
  const out = [];
  String(text).split('\n').forEach((line, i) => { const h = privateHits(line, hashes, key); if (h.length) out.push({ line: i + 1, labels: h }); });
  return out;
}

// CLI: --digest <token> prints one digest; --rebuild prints the table from the private JSON.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [cmd, arg] = process.argv.slice(2);
  if (!KEY) { console.error('no key'); process.exit(1); }
  if (cmd === '--digest' && arg) console.log(digest(arg.toLowerCase()));
  else if (cmd === '--rebuild') {
    const { literals } = JSON.parse(readFileSync(PRIVATE_FILE, 'utf8'));
    for (const l of literals) console.log(`  ['${digest(l.token)}', 'private literal ${l.id}'],`);
  } else { console.error('usage: node content/private-literals.mjs --digest <token> | --rebuild'); process.exit(2); }
}
