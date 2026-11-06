// Rules over the built pages (run `npm run build` first). Each test names the decision or the
// critic's note it protects.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const dist = join(site, 'dist');
const page = (p) => readFileSync(join(dist, p, p.endsWith('.html') || p.includes('.') ? '' : 'index.html'), 'utf8');
const text = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<\/?(?:em|strong|a|span|cite|time)\b[^>]*>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s+/g, ' ');
const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

test('the sitemap pages exist (plan §5.1, v1.0)', () => {
  for (const p of ['', 'story', 'music', 'music/appearances', 'people', 'facts', 'press', 'shows', 'photos', 'vault', 'vault/mp3s', 'vault/covers', 'vault/journal', 'epk', 'listen', 'contact', 'contact/sent', 'accessibility', 'privacy', '410'])
    assert.ok(existsSync(join(dist, p, 'index.html')), `/${p}/`);
  for (const f of ['404.html', 'llms.txt', 'robots.txt', 'sitemap-index.xml', 'favicon.ico', '_redirects', '_headers']) assert.ok(existsSync(join(dist, f)), f);
});

test('one page per release, from the master data (LL-3)', () => {
  for (const s of ['sound-as-ever', 'believe-ep', 'overbored', 'nonetheless', 'shake-it-up-live', 'great-day', 'new-beginning']) assert.ok(existsSync(join(dist, 'music', s, 'index.html')), s);
});

test('home leads with the 2026 singles and the one-liner (LL-6, LL-26), with the era collage (LL-32)', () => {
  const h = page('');
  const t = norm(text(h));
  assert.ok(t.includes("The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together. The name comes from the Gram Parsons song 'Luxury Liner'."));
  const singles = h.indexOf('The 2026 singles'), collage = h.indexOf('class="collage"');
  assert.ok(singles > 0 && collage > singles, 'singles before the collage');
  assert.ok(h.includes('/music/new-beginning/') && h.includes('/music/great-day/'));
  assert.ok((h.match(/<figure>/g) ?? []).length >= 3, 'a collage of several photos');
  assert.ok(h.includes('David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002'), 'the forever-members photo, exact caption');
});

test('home singles blurbs: not filler, no dates repeated in the blurb', () => {
  const h = page('');
  const cards = [...h.matchAll(/<article class="card">([\s\S]*?)<\/article>/g)].map((m) => m[1]);
  assert.equal(cards.length, 2);
  for (const c of cards) {
    const ps = [...c.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)].map((m) => text(m[1]).trim());
    const blurb = ps.find((p) => !/^Single,/.test(p));
    assert.ok(blurb && blurb.length > 30, `a real blurb: ${blurb}`);
    assert.doesNotMatch(blurb, /\b(19|20)\d\d\b|January|February|March|April|May|June|July|August|September|October|November|December/, `no date in the blurb: ${blurb}`);
    assert.doesNotMatch(blurb.replace(/“[^”]*”/g, ''), /\b(new|latest|brand)\b/i, 'no stale-making words (song titles aside)');
  }
});

test('release pages: writers (LL-14) and cover-art credits (LL-23)', () => {
  const t = (s) => text(page(`music/${s}`));
  assert.match(t('nonetheless'), /Circles [^|]*David Dewese/);
  for (const s of ['great-day', 'new-beginning']) { assert.match(t(s), /Chad Edgington and David Dewese/); assert.match(t(s), /Cover art: David Dewese/); }
  assert.match(t('sound-as-ever'), /Mark Montgomery/);
  assert.match(t('sound-as-ever'), /Jim Horan restored the cover art for the 2026 vinyl/);
  assert.match(t('believe-ep'), /Cover art: Mark Montgomery/);
  assert.match(t('believe-ep'), /Cher/);
  assert.match(t('overbored'), /Cover art: David Dewese/);
  assert.match(t('shake-it-up-live'), /Cover art: David Dewese, from a photo by Mark Montgomery\./);
  assert.match(t('sound-as-ever'), /The Duke Of Gloucester 4:03|The Duke Of Gloucester David Dewese/);
  assert.doesNotMatch(t('great-day'), /demo|2008/i, 'LL-13');
});

test('no doubled parentheses, no "Photo: Cover art" anywhere', () => {
  for (const f of walk(dist).filter((f) => f.endsWith('.html'))) {
    const t = text(readFileSync(f, 'utf8'));
    assert.doesNotMatch(t, /\(\(|\)\)/, f);
    assert.doesNotMatch(t, /Photo:\s*Cover art/i, f);
  }
});

test('People › Artwork names the release next to every credit', () => {
  const h = page('people');
  const sec = h.slice(h.indexOf('id="artwork"'), h.indexOf('id="photographers"'));
  const items = [...sec.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert.ok(items.length >= 6);
  for (const li of items) assert.match(li, /<a href="\/music\/[a-z-]+\/(#lp-2026)?">/, `release link in: ${text(li)}`);
});

test('photo credits are the same on every page; pending credits never print', () => {
  const credits = (h) => new Set([...h.matchAll(/class="credit">Photo: ([^<]+?)\.?</g)].map((m) => m[1].trim()));
  const fromPhotos = credits(page('photos'));
  for (const p of ['', 'story', 'epk']) for (const c of credits(page(p))) assert.ok(fromPhotos.has(c), `${c} on /${p}/ but not on /photos/`);
  const people = page('people');
  const sec = text(people.slice(people.indexOf('id="photographers"')));
  for (const c of fromPhotos) assert.ok(sec.includes(c), `/people/ lists ${c}`);
  for (const f of walk(dist).filter((f) => f.endsWith('.html'))) assert.doesNotMatch(readFileSync(f, 'utf8'), /Photo: Amy Wilstermann/, f);
});

test('/shows/: sorted by date, notes kept, no leading comma for a missing venue', () => {
  const h = page('shows');
  const rows = [...h.matchAll(/<tr>\s*<td>\s*<time datetime="([^"]*)"[^>]*>[^<]*<\/time>\s*<\/td>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g)];
  assert.ok(rows.length > 20, `rows: ${rows.length}`);
  const years = rows.map((r) => r[1].slice(0, 4));
  assert.deepEqual(years, [...years].sort(), 'years in order');
  for (const r of rows) assert.doesNotMatch(r[2].trim(), /^,|,\s*$/, `where: ${r[2]}`);
  assert.ok(rows.filter((r) => text(r[3]).trim()).length > rows.length / 2, 'notes are kept');
});

test('/vault/mp3s/: titles only, points to streaming, never "not released on a record" (LL-27)', () => {
  const t = text(page('vault/mp3s'));
  assert.doesNotMatch(t, /not released|unreleased|never released/i);
  assert.match(page('vault/mp3s'), /href="\/listen\/"/);
  assert.doesNotMatch(page('vault/mp3s'), /\.mp3/);
  for (const f of walk(dist)) assert.doesNotMatch(f, /\.(mp3|m4a|wav)$/i);
});

test('the 2008 disc with the "Great Day" demo is never listed or linked (LL-13)', () => {
  for (const f of walk(dist).filter((f) => /\.(html|txt|xml)$/.test(f))) {
    const h = readFileSync(f, 'utf8');
    assert.doesNotMatch(h, /15436127|bonus disc/i, f);
    assert.doesNotMatch(h, /talent[- ]show/i, f);
  }
});

test('the contact form posts to the Worker and no page holds the address (LL-31)', () => {
  assert.match(page('contact'), /<form method="post" action="\/api\/contact"/);
  for (const f of walk(dist).filter((f) => /\.(html|txt|json|xml|js)$/.test(f) && !f.includes('/admin/'))) assert.doesNotMatch(readFileSync(f, 'utf8'), /dewese\.com\b[^/]|@dewese|mailto:/i, f);
});

test('privacy page describes only what ships', () => {
  const t = text(page('privacy'));
  const analytics = walk(dist).some((f) => f.endsWith('.html') && readFileSync(f, 'utf8').includes('cloudflareinsights.com/beacon'));
  const turnstile = page('contact').includes('cf-turnstile');
  assert.equal(/Web Analytics/.test(t), analytics);
  assert.equal(/Turnstile/.test(t), turnstile);
  assert.doesNotMatch(t, /cookie banner|newsletter|YouTube embed|Google Analytics/i);
});

test('robots.txt allows all crawlers (LL-41); llms.txt carries the one-liner and the members', () => {
  const r = readFileSync(join(dist, 'robots.txt'), 'utf8');
  assert.match(r, /User-agent: \*\nAllow: \//);
  assert.doesNotMatch(r, /Disallow: \/\s*$/m);
  const l = norm(readFileSync(join(dist, 'llms.txt'), 'utf8'));
  assert.ok(l.includes('co-founded in 1997 by David Dewese and Chad Edgington'));
  for (const n of ['Scott Carpenter', 'Wilstermann', 'Great Day', 'New Beginning']) assert.ok(l.includes(n), n);
});

test('the sitemap lists the pages and not the error or thank-you pages', () => {
  const x = readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f)).map((f) => readFileSync(join(dist, f), 'utf8')).join('');
  for (const p of ['/story/', '/music/great-day/', '/facts/', '/vault/covers/']) assert.ok(x.includes(`https://theluxuryliners.com${p}`), p);
  assert.doesNotMatch(x, /\/404|\/410\/|\/contact\/sent\//);
});

test('legacy URLs: every redirect target exists, no chains, a 410 list (data/legacy-urls.json)', () => {
  const rows = readFileSync(join(dist, '_redirects'), 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split(' '));
  assert.ok(rows.length > 250);
  const sources = new Set(rows.map((r) => r[0]));
  for (const [from, to, code] of rows) {
    assert.equal(code, '301');
    assert.ok(!sources.has(to), `chain ${from} -> ${to}`);
    if (to.startsWith('/')) assert.ok(existsSync(join(dist, to.split('#')[0], to.endsWith('/') ? 'index.html' : '')), `target ${to}`);
  }
  assert.ok(sources.has('/ethan.html') && rows.find((r) => r[0] === '/ethan.html')[1] === '/', 'the private page goes home only');
  const gone = readFileSync(join(site, 'worker', 'gone.ts'), 'utf8');
  assert.match(gone, /export const GONE/);
});

function walk(d) { return readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]); }

// ---- round 2 (critiques/build-skeleton-round1.md) ----
const ldOf = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const allText = () => walk(dist).filter((f) => /\.(html|txt)$/.test(f)).map((f) => [f, readFileSync(f, 'utf8')]);

test('a pending cover credit (data/artwork.json) is printed nowhere, JSON-LD included (blocking 1)', () => {
  const art = JSON.parse(readFileSync(join(site, 'data', 'artwork.json'), 'utf8')).credits.filter((a) => a.status !== 'publish');
  assert.ok(art.some((a) => a.release === 'nonetheless'), 'the Nonetheless credit is still pending');
  for (const [f, h] of allText()) {
    assert.doesNotMatch(h, /paint(?:ed|ing|ings)?\b[^.]{0,80}Nonetheless|Nonetheless[^.]{0,80}\bpaint(?:ed|ing|ings)?\b/i, f);
    for (const a of art) assert.doesNotMatch(h, new RegExp(`${a.name}[^.<]{0,60}\\b(?:paint\\w*|cover (?:art|painting|design)|the cover)\\b`, 'i'), `${f}: ${a.name}`);
  }
  assert.doesNotMatch(text(page('people')), /\bNonetheless\b: /, 'People › Artwork has no Nonetheless row');
});

test('LL-9: the four forever members are the band today on every surface (blocking 2)', () => {
  const t = text(page('people'));
  assert.doesNotMatch(t, /on the 2026 singles\)/);
  assert.match(t, /Chad Edgington [^.]*\(1997–2001, and again today\)/);
  const l = readFileSync(join(dist, 'llms.txt'), 'utf8');
  assert.doesNotMatch(l, /and on the 2026 singles/);
  assert.match(l, /Chad Edgington \(1997–2001, and again today\)/);
  for (const n of ['David Dewese', 'Scott Carpenter', 'Wilstermann']) assert.match(l, new RegExp(`${n}[^\\n]*\\(\\d{4} to today\\)`), n);
});

test('member roles are the same on home, /people/ and in the JSON-LD (item 9)', () => {
  const home = text(page('')), people = text(page('people'));
  const band = ldOf(page('')).flatMap((g) => g['@graph']).find((n) => n['@type'] === 'MusicGroup');
  for (const m of band.member) {
    const roles = m.roleName;
    assert.ok(people.includes(roles), `/people/: ${roles}`);
    assert.ok(home.includes(roles), `home: ${roles}`);
  }
});

test('captions: a space before every photo credit; cover captions say "Cover art" once (items 3, 6)', () => {
  for (const p of ['', 'story', 'epk', 'people', 'photos']) assert.doesNotMatch(page(p), /\S<span class="credit">Photo:/, p);
  const s = text(page('music/shake-it-up-live'));
  assert.match(s, /Cover art: David Dewese, from a photo by Mark Montgomery\./);
  for (const r of ['great-day', 'overbored', 'shake-it-up-live']) assert.equal((text(page(`music/${r}`)).match(/Cover art/g) ?? []).length, 1, r);
});

test('/vault/: no unread Internet Archive links, no overstated domain date; /vault/mp3s/ says "the song" (items 4, 7, 11)', () => {
  assert.doesNotMatch(page('vault'), /web\.archive\.org/);
  assert.doesNotMatch(text(page('vault')), /since 1998/);
  const m = text(page('vault/mp3s'));
  assert.doesNotMatch(m, /: on /);
  assert.match(m, /Shake It Up \(live\)”: the song is on/);
});

test('/shows/ never repeats the place (item 5)', () => {
  assert.doesNotMatch(text(page('shows')), /\b([A-Z][a-z]+(?: and [A-Z][a-z]+)?), \1\b/);
});

test('early players: years sit next to the role they belong to (LL-24, item 10)', () => {
  assert.match(text(page('people')), /Gary Ishee: several shows, 2004–05; guitar on Nonetheless/i);
});
