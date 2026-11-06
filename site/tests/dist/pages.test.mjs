// Rules over the built pages (run `npm run build` first). Each test names the decision or the
// critic's note it protects.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { privateHits } from '../../../content/private-literals.mjs';

const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const dist = process.env.LL_DIST ?? join(site, 'dist'); // tests/run.mjs points LL_DIST at its snapshot
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
  const collageHtml = h.slice(collage, h.indexOf('</section>', collage));
  assert.ok((collageHtml.match(/<figure\b/g) ?? []).length >= 5, 'a collage of several photos');
  assert.match(collageHtml, /Powder-blue suits|Backstage, 1998/, 'the 1998 suits are in the collage (LL-32)');
  assert.ok(h.includes('David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002'), 'the forever-members photo, exact caption');
});

test('home singles blurbs: the copy track’s value or nothing; never filler, a track list or a date', () => {
  const h = page('');
  const cards = [...h.matchAll(/<article class="single"[^>]*>([\s\S]*?)<\/article>/g)].map((m) => m[1]);
  assert.equal(cards.length, 2);
  // content/home.md: the blurb rendered is exactly the content's; null renders no blurb at all
  // (critiques build-copy round 3 B-1, build-skeleton round 2 item 1)
  const home = readFileSync(join(site, '..', 'content', 'home.md'), 'utf8');
  const fm = home.split(/^---$/m)[1];
  const want = [...fm.matchAll(/release_id: luxury-liners-2026-([a-z-]+)\n\s+title: [^\n]+\n\s+blurb: ([^\n]*)/g)].map((m) => [m[1], m[2].trim()]);
  assert.equal(want.length, 2, 'both singles are in content/home.md');
  for (const [slug, raw] of want) {
    const card = cards.find((c) => c.includes(`/music/${slug}/`));
    assert.ok(card, slug);
    const b = /<p class="blurb">([\s\S]*?)<\/p>/.exec(card);
    if (raw === 'null' || raw === '') { assert.equal(b, null, `${slug}: blurb is null in content, so none is rendered`); continue; }
    assert.ok(b, `${slug}: the content blurb is rendered`);
    const blurb = text(b[1]).trim();
    assert.equal(norm(blurb), norm(raw.replace(/^"(.*)"$/, '$1').replace(/\*/g, '')), `${slug}: the content's own words`);
    assert.ok(blurb.length > 30, `a real blurb: ${blurb}`);
    assert.doesNotMatch(blurb, /^(?:one|two|three|\d+) (?:tracks?|songs?)\b/i, 'not a bare track list');
    assert.doesNotMatch(blurb, /\b(19|20)\d\d\b|January|February|March|April|May|June|July|August|September|October|November|December/, `no date in the blurb: ${blurb}`);
    assert.doesNotMatch(blurb.replace(/“[^”]*”/g, ''), /\b(new|latest|brand)\b/i, 'no stale-making words (song titles aside)');
  }
  // the site never substitutes its own padded line ("with all four forever members playing")
  for (const c of cards) assert.doesNotMatch(text(c), /with all four forever members playing/);
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

test('photo credits are the same on every page; Amy Wilstermann credited on the 2003 photos only (LL-45)', () => {
  const credits = (h) => new Set([...h.matchAll(/class="credit">Photo: ([^<]+?)\.?</g)].map((m) => m[1].trim()));
  const fromPhotos = credits(page('photos'));
  const storyPages = readdirSync(join(dist, 'story'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `story/${d.name}`);
  for (const p of ['', 'story', ...storyPages, 'epk', 'music/overbored']) for (const c of credits(page(p))) assert.ok(fromPhotos.has(c), `${c} on /${p}/ but not on /photos/`);
  const people = page('people');
  const sec = text(people.slice(people.indexOf('id="photographers"')));
  for (const c of fromPhotos) assert.ok(sec.includes(c), `/people/ lists ${c}`);
  // LL-45: "Photo: Amy Wilstermann" on the 2003 shoot, credit line only
  const photos = JSON.parse(readFileSync(join(site, 'data', 'photos.json'), 'utf8')).photos;
  const amy = photos.filter((p) => p.credit === 'Amy Wilstermann');
  assert.ok(amy.length >= 1 && amy.every((p) => p.year === '2003' && p.status === 'publish'), 'her 2003 photos are published with her credit');
  assert.ok(fromPhotos.has('Amy Wilstermann'), '/photos/ credits her');
  assert.match(sec, /Amy Wilstermann \(2003\)/, '/people/ credits her for 2003');
  for (const f of walk(dist).filter((f) => /\.(html|txt)$/.test(f))) {
    const h = readFileSync(f, 'utf8');
    // every mention is a credit line or the People photographers row, and nothing ties her to anyone
    const mentions = [...h.matchAll(/Amy Wilstermann/g)].map((m) => h.slice(Math.max(0, m.index - 40), m.index + 60));
    for (const m of mentions) assert.match(m, /Photo: Amy Wilstermann|<strong>Amy Wilstermann<\/strong> \(2003\)/, `${f}: ${m}`);
    assert.doesNotMatch(text(h), /Amy Wilstermann[^.]{0,80}\b(?:wife|sister|married|daughter|mother|relative|family|Larry|David)\b|\b(?:wife|sister|married|daughter|mother|relative)\b[^.]{0,80}Amy Wilstermann/i, f);
  }
});

test('/shows/: sorted by date, notes kept, no leading comma for a missing venue', () => {
  const h = page('shows');
  const rows = [...h.matchAll(/<tr>\s*<td[^>]*>\s*<time datetime="([^"]*)"[^>]*>[^<]*<\/time>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g)];
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
  // the old family page (a private literal, hashed: content/private-literals.mjs) goes home only;
  // its row is in the git-ignored data/private/legacy-urls.private.json, merged when present
  const privateRows = rows.filter((r) => privateHits(r[0]).length);
  for (const r of privateRows) assert.equal(r[1], '/', 'a private page goes home only');
  const privFile = join(site, '..', 'data', 'private', 'legacy-urls.private.json');
  if (existsSync(privFile)) {
    const want = JSON.parse(readFileSync(privFile, 'utf8')).urls.filter((u) => u.action === '301').map((u) => u.path.split('?')[0]);
    assert.ok(want.length > 0 && want.every((p) => sources.has(p)), 'the private rows are merged into _redirects');
  }
  assert.ok(!readFileSync(join(site, '..', 'data', 'legacy-urls.json'), 'utf8').split('\n').some((l) => privateHits(l).length), 'the public data names no private literal');
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
  // in the page's own content (the footer adds the site-wide rights line, audit-design round 1, B1)
  const main = (h) => h.slice(h.indexOf('<main'), h.indexOf('</main>'));
  for (const r of ['great-day', 'overbored', 'shake-it-up-live']) {
    assert.equal((text(main(page(`music/${r}`))).match(/Cover art/g) ?? []).length, 1, r);
    assert.equal((text(page(`music/${r}`)).match(/Cover art: all rights reserved by the rights holders\./g) ?? []).length, 1, `${r}: the footer line once`);
  }
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
