// Rules over the built site for the round-3 audits (critiques/audit-*-round3.md): copy, security
// and design. Run `npm run build` first (tests/run.mjs points LL_DIST at its snapshot of dist/).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { safeJson } from '../../src/lib/json.ts';
import { ADMIN_CSP } from '../../worker/headers.ts';
import { loadKey } from '../../../content/private-literals.mjs';

const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = join(site, '..');
const dist = process.env.LL_DIST ?? join(site, 'dist');
const page = (p) => readFileSync(join(dist, p, 'index.html'), 'utf8');
const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (h) => decode(h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<\/?(?:em|strong|a|span|cite|time|i|b)\b[^>]*>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const files = (d, out = []) => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) files(p, out); else out.push(p); } return out; };
const htmlFiles = files(dist).filter((f) => f.endsWith('.html'));

test('security S1: no JSON data block in any page holds a literal "<" (a "</script>" can never end it early)', () => {
  let blocks = 0;
  for (const f of htmlFiles) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<script type="application\/(?:ld\+)?json"[^>]*>([\s\S]*?)<\/script>/g)) {
      blocks++;
      assert.ok(!m[1].includes('<'), `${f}: a JSON block contains "<"`);
      assert.doesNotThrow(() => JSON.parse(m[1]), `${f}: a JSON block does not parse`);
    }
  }
  assert.ok(blocks >= htmlFiles.length - 2, `JSON-LD on (nearly) every page (${blocks} blocks)`);
});

test('security S1: safeJson escapes <, >, U+2028 and U+2029 and still parses to the same value', () => {
  const v = { name: '</script><img src=x onerror=alert(1)>', s: 'a\u2028b\u2029c' };
  const out = safeJson(v);
  assert.ok(!/[<>\u2028\u2029]/.test(out));
  assert.deepEqual(JSON.parse(out), v);
});

test('security minor: the admin CSP blocks form posts and upgrades insecure requests', () => {
  assert.match(ADMIN_CSP, /form-action 'none'/);
  assert.match(ADMIN_CSP, /upgrade-insecure-requests/);
});

test('security minor: /.well-known/security.txt names the contact page, no address, and has not expired', () => {
  const p = join(dist, '.well-known', 'security.txt');
  assert.ok(existsSync(p), 'dist/.well-known/security.txt exists');
  const t = readFileSync(p, 'utf8');
  assert.match(t, /^Contact: https:\/\/theluxuryliners\.com\/contact\/$/m);
  assert.doesNotMatch(t, /@|mailto:/);
  const exp = /^Expires: (\S+)$/m.exec(t);
  assert.ok(exp && Date.parse(exp[1]) > Date.now(), 'Expires is in the future (renew it: RFC 9116 allows at most a year)');
});

test('release gates: RELEASE=1 check-dist fails while G1 (LL-25) is open or Decap has no https base_url', () => {
  const approved = JSON.parse(readFileSync(join(root, 'content', 'shows.json'), 'utf8')).journalDerivedApproved === true;
  const cfg = readFileSync(join(dist, 'admin', 'config.yml'), 'utf8');
  const hasBase = /^\s+base_url:\s*['"]?https:\/\//m.test(cfg);
  const r = spawnSync(process.execPath, [join(site, 'scripts', 'check-dist.mjs'), dist], { env: { ...process.env, RELEASE: '1' }, encoding: 'utf8' });
  // Without the private-literal key a release build refuses to start at all (fail closed), so the
  // gate messages are never reached: assert that refusal instead. With the key, assert each gate.
  if (!loadKey()) { assert.notEqual(r.status, 0); assert.match(r.stderr, /no key for the private-literal check/); return; }
  if (!approved) { assert.equal(r.status, 1); assert.match(r.stdout, /launch gate G1/); }
  if (!hasBase) { assert.equal(r.status, 1); assert.match(r.stdout, /admin\/config\.yml: backend has no https:\/\/ base_url/); }
});

test('copy S3-S6: the round-3 wording', () => {
  assert.match(text(page('music/appearances')), /A live “Shake It Up”, released as a separate track from the 2021 single\./);
  for (const p of ['story/nonetheless', 'story']) assert.match(text(page(p)), /two year-end lists/, p);
  assert.match(readFileSync(join(dist, 'llms.txt'), 'utf8'), /two year-end lists/);
  assert.match(text(page('shows')), /The first performance of “Circles”\./);
  assert.match(text(page('accessibility')), /last reviewed on November 6, 2026/);
  assert.doesNotMatch(text(page('press')), /catalogue/i);
  for (const f of htmlFiles.concat(join(dist, 'llms.txt'))) {
    const t = readFileSync(f, 'utf8');
    assert.doesNotMatch(t, /top-of-the-year|Still In Love|different live recording|\d November 2026/, f);
  }
});

test('copy S7-S8: /photos/ starts at 1998, and the internal "brosephs" slug is gone', () => {
  const h = page('photos');
  assert.match(text(h), /1998–2000/);
  assert.doesNotMatch(text(h), /1997–2000/);
  for (const f of files(dist)) assert.ok(!/brosephs/i.test(f), `${f}: old slug in a file name`);
  for (const f of files(dist).filter((f) => /\.(html|txt|xml|json|js|css)$/.test(f))) assert.doesNotMatch(readFileSync(f, 'utf8'), /brosephs/i, f);
});

test('copy polish: the 2002 caption and its note are separated by a space', () => {
  assert.doesNotMatch(page(''), /\.<span class="col-note">/);
});

test('design m6: "All releases" sits inside the release pager', () => {
  assert.match(page('music/overbored'), /<div class="pager">[\s\S]*?<a class="all" href="\/music\/">All releases<\/a>[\s\S]*?<\/div>/);
});
