// Rules over the built site for the round-1 audits (critiques/audit-*-round1.md): accessibility,
// copy, security, design, QA and SEO/GEO. Run `npm run build` first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = join(site, '..');
const dist = process.env.LL_DIST ?? join(site, 'dist'); // tests/run.mjs points LL_DIST at its snapshot
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

test('a11y B1: the accessibility statement is dated, has a status and known limitations, and claims only what is true', () => {
  const t = text(page('accessibility'));
  assert.match(t, /last reviewed on November 6, 2026/); // US style, as on every other page (copy audit round 3, S6)
  assert.match(t, /partially conforms to WCAG 2\.2 level AA/);
  assert.match(t, /Known limitations/);
  assert.doesNotMatch(t, /each time the site is built, and a page that fails is not published/);
  assert.doesNotMatch(t, /^.*\bLinks are underlined\b/);
  const pkg = JSON.parse(readFileSync(join(site, 'package.json'), 'utf8'));
  assert.match(pkg.scripts['build:production'], /tests\/run\.mjs axe/, 'the production build runs axe, as the statement says');
});

test('seo S9 / qa M1: noindex pages have no canonical or og:url; every page has a sized card with alt text', () => {
  for (const p of ['404.html', '410/index.html', 'contact/sent/index.html']) {
    const h = readFileSync(join(dist, p), 'utf8');
    assert.doesNotMatch(h, /rel="canonical"|property="og:url"/, p);
  }
  for (const f of htmlPages()) {
    const h = readFileSync(f, 'utf8');
    for (const tag of ['og:image:alt', 'og:image:width', 'og:image:height']) assert.match(h, new RegExp(`property="${tag}" content="[^"]+"`), `${relative(dist, f)} ${tag}`);
    assert.match(h, /name="twitter:image:alt" content="[^"]+"/, relative(dist, f));
  }
  assert.match(page(''), /property="og:image" content="https:\/\/theluxuryliners\.com\/img\/cards\/four-2002\.jpg"/);
  assert.match(page('music/overbored'), /name="twitter:card" content="summary"/, 'a square cover uses the summary card');
});

test('seo S1-S4: typed band references, a Nashville location, the album list, two labels, the daviddewese.com band page', () => {
  const band = ldOf(page('')).find((n) => n['@type'] === 'MusicGroup');
  assert.equal(band.location.address.addressLocality, 'Nashville');
  assert.ok(!band.member.some((m) => m.member.location || m.member.homeLocation), 'never a place per member (LL-7)');
  assert.equal(band.album.length, 7);
  assert.ok(band.sameAs.includes('https://daviddewese.com/bands/the-luxury-liners/'));
  const album = ldOf(page('music/sound-as-ever')).find((n) => n['@type'] === 'MusicAlbum');
  assert.deepEqual(album.byArtist, { '@type': 'MusicGroup', '@id': 'https://theluxuryliners.com/#band', name: 'The Luxury Liners' });
  assert.deepEqual(album.recordLabel.map((o) => o.name), ['Echomusic', 'Litterbug Records']);
  assert.ok(album.track.every((t) => t.byArtist?.['@id'] === 'https://theluxuryliners.com/#band' && t.inAlbum?.['@id'] === album['@id']));
});

test('seo S6/S8/S11: chapter titles and summaries, Facts ids, snippet lengths', () => {
  const ch = page('story/overbored');
  assert.match(ch, /<title>Overbored \(2003\): the story, chapter 6 \| The Luxury Liners<\/title>/);
  for (const c of ['two-texans', 'nudie-suits', 'sound-as-ever', 'believe', 'journal-years', 'overbored', 'nonetheless', 'quiet-years', 'great-day']) {
    const d = decode(/<meta name="description" content="([^"]*)"/.exec(page(`story/${c}`))[1]);
    assert.ok(d.length >= 120 && d.length <= 155, `${c}: ${d.length}`);
    assert.doesNotMatch(page(`story/${c}`), /img\/photos\/four-2002-1096\.jpg" \/>\s*<meta property="og:image:width"/, `${c}: its own card`);
  }
  const facts = JSON.parse(readFileSync(join(root, 'content', 'facts.json'), 'utf8')).facts.filter((f) => f.publish !== false);
  for (const f of facts) assert.match(page('facts'), new RegExp(`<dt id="${f.id}">`), f.id);
  const live = page('music/shake-it-up-live');
  assert.ok(decode(/<title>([^<]*)<\/title>/.exec(live)[1]).length <= 60);
  assert.ok(decode(/<meta name="description" content="([^"]*)"/.exec(live)[1]).length <= 160);
  assert.ok(decode(/<meta name="description" content="([^"]*)"/.exec(page('music/appearances'))[1]).length >= 120);
});

test('seo S7: llms.txt lists every section, the chapters and the Facts, with a date', () => {
  const l = readFileSync(join(dist, 'llms.txt'), 'utf8');
  assert.match(l, /^Last updated: \d{4}-\d{2}-\d{2}$/m);
  for (const p of ['/listen/', '/people/', '/photos/', '/vault/', '/music/appearances/', '/contact/', '/story/great-day/']) assert.ok(l.includes(`https://theluxuryliners.com${p}`), p);
  assert.match(l, /\[Press\]\(https:\/\/theluxuryliners\.com\/press\/\): \w/);
  assert.match(l, /## Facts\n### /);
});

test('copy: the round-1 fixes are on the pages', () => {
  assert.match(text(page('music/appearances')), /“Precious To My Heart” is the first hidden track of Sound As Ever, listed there as “Precious”\./);
  assert.match(text(page('story')), /A 1998 live recording released in 2021, and two singles in 2026\./);
  assert.match(text(page('vault/mp3s')), /“Shake It Up \(live\)”: the song is on Believe EP, and a live recording of it is on Shake It Up \(Live at the Texas Music Café\)/);
  const home = text(page(''));
  assert.doesNotMatch(home, /[Pp]ale-blue/);
  assert.match(home, /Powder-blue suits about 1998/);
  assert.equal((home.match(/already had a David/g) ?? []).length, 1, 'the Larry line once on home');
  assert.match(text(page('epk')), /Founded 1997 in Texas, by David Dewese and Chad Edgington; based in Nashville from May 1997/);
  assert.match(text(page('facts')), /Sound Asleep Records in Sweden released Sound As Ever on vinyl in 2026/);
  assert.match(text(page('facts')), /Mike Poole recorded both bands’ first albums/);
  assert.match(text(page('music')), /Six compilations with Luxury Liners songs/);
  assert.equal((text(page('press')).match(/featured in Billboard/g) ?? []).length, 0, 'the Billboard row says it once (publication and kind)');
  const people = text(page('people'));
  assert.match(people, /Photos without a credit line come from the band’s own collection\./);
  assert.doesNotMatch(people, /by family|self-timer/);
  assert.doesNotMatch(people, /Jim Horan: [^.]*2026 vinyl, 2026/);
});

test('a11y: home h1 text, the Spotify pill, the cover descriptions, the video title, the stacked table', () => {
  const h = page('');
  assert.match(h, /<h1 class="hero__logo" id="h1t"><span class="visually-hidden">The Luxury Liners<\/span><svg class="logo-full"[^>]*aria-hidden="true"/);
  assert.match(text(h), /New Beginning on Spotify/);
  assert.doesNotMatch(text(h), /Listen to New Beginning/);
  assert.match(page('music/overbored'), /alt="Cover of Overbored by The Luxury Liners: three figures in coats/);
  assert.match(readFileSync(join(dist, 'js', 'site.js'), 'utf8'), /on YouTube \(video player\)/);
  const shows = page('shows');
  assert.ok((shows.match(/<td data-label="Where">/g) ?? []).length > 20);
  assert.match(shows, /<time datetime="2001-09">Late September 2001<\/time>/, 'a month-precision date carries the month only');
});

test('qa M3-M6: the main image loads first; smaller encodings; the topic starts empty', () => {
  assert.match(page('music/overbored'), /<img class="cover"[^>]*loading="eager" fetchpriority="high"/);
  assert.match(page(''), /<img class="cover"[^>]*fetchpriority="high"/);
  const sizes = JSON.parse(readFileSync(join(site, 'data', 'image-sizes.json'), 'utf8'));
  for (const [k, v] of Object.entries(sizes)) if (v.webp === false) assert.doesNotMatch(page(k.startsWith('covers/') ? 'music' : 'photos'), new RegExp(`${k.split('/')[1]}-\\d+\\.webp`), `${k}: no larger WebP offered`);
  assert.match(page('contact'), /<option value="" disabled selected>Choose a topic<\/option>/);
});
