// Rules over the built site for the round-1 audits (critiques/audit-*-round1.md): accessibility,
// copy, security, design, QA and SEO/GEO. Run `npm run build` first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = join(site, '..');
const dist = join(site, 'dist');
const page = (p) => readFileSync(join(dist, p, 'index.html'), 'utf8');
const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (h) => decode(h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<\/?(?:em|strong|a|span|cite|time|i|b)\b[^>]*>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const htmlPages = () => walk(dist).filter((f) => f.endsWith('.html') && !f.includes('/admin/'));
const ldOf = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => { const j = JSON.parse(m[1]); return j['@graph'] ?? [j]; });

test('design B1: every page that shows a cover carries the cover-rights line (plan line 58, P40)', () => {
  let n = 0;
  for (const f of htmlPages()) {
    const h = readFileSync(f, 'utf8');
    if (!/\/img\/covers\//.test(h)) continue;
    n++;
    assert.ok(text(h).includes('Cover art: all rights reserved by the rights holders.'), relative(dist, f));
  }
  assert.ok(n >= 10, 'covers are shown on the home page, /music/ and the release pages');
});

test('copy B1/B2: no Discogs sourcing sentences on the release pages', () => {
  for (const p of ['music/sound-as-ever', 'music/believe-ep', 'music/shake-it-up-live']) {
    const t = text(page(p));
    assert.doesNotMatch(t, /Discogs (?:lists|credits)|as Discogs/, p);
  }
  assert.match(text(page('music/sound-as-ever')), /The pressing is a limited edition of 100 copies on Sweden’s Sound Asleep Records\./);
});
