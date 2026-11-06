// Rules over the built site for design direction C "Roundel" (LL-44) and the should-fix items of
// critiques/build-skeleton-round2.md, build-copy-round3.md and design-c-round1.md. Run
// `npm run build` first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = join(site, '..');
const dist = join(site, 'dist');
const page = (p) => readFileSync(join(dist, p, 'index.html'), 'utf8');
const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (h) => decode(h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<\/?(?:em|strong|a|span|cite|time|i|b)\b[^>]*>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const htmlPages = () => walk(dist).filter((f) => f.endsWith('.html') && !f.includes('/admin/'));
const ONE_LINER = "The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together. The name comes from the Gram Parsons song 'Luxury Liner'.";

test('every page uses the Roundel layout: masthead with the sprite roundel, theme switch, footer, self-hosted fonts', () => {
  for (const f of htmlPages()) {
    const h = readFileSync(f, 'utf8');
    assert.match(h, /<header class="masthead">/, f);
    assert.match(h, /<use href="\/art\/sprite\.svg#lx-roundel"/, f);
    assert.match(h, /<button class="theme-switch" type="button" aria-pressed="false" hidden>/, f);
    assert.match(h, /<script src="\/js\/theme\.js"><\/script>/, `${f}: theme set before first paint`);
    assert.match(h, /<footer class="foot">/, f);
    assert.equal((h.match(/<h1[\s>]/g) ?? []).length, 1, `${f}: one h1`);
  }
  const css = walk(join(dist, '_astro')).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('');
  assert.match(css, /url\("?\/fonts\/archivo-black\.woff2/);
  assert.doesNotMatch(css, /url\("?https?:/, 'no off-site font or image in the CSS');
  assert.match(css, /\[data-theme=dark\]|\[data-theme="dark"\]/, 'a dark theme');
  assert.match(css, /prefers-color-scheme:\s*dark/, 'the system setting without JavaScript');
  assert.match(css, /prefers-reduced-motion/, 'motion off on request');
  for (const f of ['fonts/archivo-black.woff2', 'fonts/archivo-text.woff2', 'fonts/archivo-text-italic.woff2', 'fonts/OFL-archivo.txt', 'fonts/OFL-archivo-black.txt', 'art/sprite.svg', 'js/theme.js', 'js/site.js']) assert.ok(existsSync(join(dist, f)), f);
});

test('the logo sprite copies the logo masters byte for byte (no redrawn mark)', () => {
  const masters = readdirSync(join(root, 'assets', 'derived', 'logos')).filter((f) => f.endsWith('.svg')).map((f) => readFileSync(join(root, 'assets', 'derived', 'logos', f), 'utf8')).join('\n');
  const sprite = readFileSync(join(dist, 'art', 'sprite.svg'), 'utf8');
  const ds = [...sprite.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(ds.length > 20, `paths: ${ds.length}`);
  for (const d of ds) assert.ok(masters.includes(`d="${d}"`), `path not in the masters: ${d.slice(0, 40)}`);
  for (const id of ['lx-roundel', 'lx-roundel-ink', 'lx-wordmark', 'lx-full']) assert.match(sprite, new RegExp(`<symbol id="${id}"`));
});

test('nothing off-site loads with a page: no third-party src, the YouTube facade loads nothing until pressed', () => {
  for (const f of htmlPages()) {
    const h = readFileSync(f, 'utf8');
    const srcs = [...h.matchAll(/\s(?:src|srcset|href)="(https?:\/\/[^"]+)"/g)].map((m) => m[0]).filter((a) => !/^\shref=/.test(a));
    const allowed = srcs.filter((a) => !/challenges\.cloudflare\.com|static\.cloudflareinsights\.com/.test(a));
    assert.deepEqual(allowed, [], f);
    assert.doesNotMatch(h, /<iframe/i, `${f}: no iframe in the page`);
    assert.doesNotMatch(h, /<link(?![^>]*rel="canonical")[^>]+href="https?:/i, `${f}: no off-site stylesheet or preload`);
  }
  for (const p of ['', 'music/great-day', 'music/overbored']) {
    const h = page(p);
    assert.match(h, /<a class="yt" href="https:\/\/www\.youtube\.com\/watch\?v=[\w-]+" data-yt="[\w-]+"/, `${p}: the facade is a plain link without JavaScript`);
    assert.doesNotMatch(h, /i\.ytimg\.com|img\.youtube\.com/, `${p}: no YouTube thumbnail`);
  }
  const js = readFileSync(join(dist, 'js', 'site.js'), 'utf8');
  assert.match(js, /https:\/\/www\.youtube-nocookie\.com\/embed\//);
  assert.doesNotMatch(js, /https:\/\/www\.youtube\.com\/embed/);
  assert.match(readFileSync(join(dist, '_headers'), 'utf8'), /frame-src [^;\n]*https:\/\/www\.youtube-nocookie\.com/);
});

test('the Overbored video has its own words, not the TV songs (design-c M1); no repeated cover as a poster (M3)', () => {
  const h = page('music/overbored');
  const sec = h.slice(h.indexOf('id="vid"'), h.indexOf('</section>', h.indexOf('id="vid"')));
  assert.match(text(sec), /Equasue/);
  assert.doesNotMatch(text(sec), /One Tree Hill|Soccer|television|TV/i);
  assert.equal((h.match(/Photo: Amy Wilstermann/g) ?? []).length, 1, 'one 2003 photo, not two near-identical ones');
  const home = page('');
  assert.ok((home.match(/<source[^>]+srcset="\/img\/covers\/great-day-/g) ?? []).length <= 2, 'the Great Day cover at most twice on home');
  assert.doesNotMatch(home, /poster/);
});

test('LL-6: the one-liner is byte for byte (straight quotes) wherever it appears, and quotes elsewhere are curly', () => {
  for (const f of [...htmlPages(), join(dist, 'llms.txt')]) {
    const t = decode(readFileSync(f, 'utf8'));
    for (const m of t.matchAll(/power-pop band co-founded/g)) {
      const s0 = m.index - 'The Luxury Liners are a '.length;
      assert.equal(t.slice(s0, s0 + ONE_LINER.length), ONE_LINER, f);
    }
  }
  for (const p of ['', 'facts', 'epk']) assert.ok(decode(page(p)).includes(`>${ONE_LINER}<`) || decode(page(p)).includes(ONE_LINER), p);
  // curly quotes in the site's own visible text: a straight ' or " between letters appears only
  // inside the one-liner (titles from releases.json included: "Think She’s Coming Around")
  for (const f of htmlPages()) {
    const t = text(readFileSync(f, 'utf8')).split(ONE_LINER).join(' ');
    assert.doesNotMatch(t, /\w'\w|\s'\w|\w'\s|"\w|\w"/, `${f}: straight quote in visible text`);
  }
  assert.match(text(page('music/sound-as-ever')), /Think She’s Coming Around/);
});

test('Story: an index and one page per chapter, with the chapter list and a pager', () => {
  const idx = page('story');
  const links = [...idx.matchAll(/<a href="(\/story\/[a-z0-9-]+\/)"><span class="oval"/g)].map((m) => m[1]);
  assert.equal(links.length, 9);
  for (const [i, l] of links.entries()) {
    const h = page(l.slice(1, -1));
    assert.match(h, new RegExp(`Chapter ${i + 1} · `));
    assert.match(h, /class="prose dropcap"/);
    assert.match(h, /aria-current="page"><span class="oval"/, `${l}: current chapter marked`);
    if (i > 0) assert.match(h, /<a class="prev" href="\/story\//);
    if (i < 8) assert.match(h, /<a class="next" href="\/story\//);
  }
  const all = links.map((l) => text(page(l.slice(1, -1)))).join(' ');
  assert.ok(all.includes('The band never broke up. The four forever members reconnected during the pandemic and started making music again.'), 'LL-17 verbatim in the Story');
});

test('journal quotes not yet through the LL-25 pass are not on /shows/ or in the Story', () => {
  const pages = ['shows', 'story', ...readdirSync(join(dist, 'story'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `story/${d.name}`)];
  for (const p of pages) {
    const t = text(page(p)).toLowerCase();
    for (const q of ['three piece configuration', 'lost a little money', 'nevada was rocked', 'our detroit tour', '“three shows in one week”']) assert.ok(!t.includes(q), `${p}: ${q}`);
  }
});

test('/shows/: Zanies sorts as September 1997; no empty Where cell', () => {
  const h = page('shows');
  // sorts by its key (1997-09) but its datetime is no more precise than its text (audit-a11y m3)
  assert.match(h, /<time datetime="1997">Probably autumn 1997 or winter 1998<\/time>/);
  const order = [...h.matchAll(/<time datetime="[^"]*">([^<]*)<\/time>/g)].map((m) => m[1]);
  assert.equal(order[0], 'Probably autumn 1997 or winter 1998', 'Zanies is the first show (sort key 1997-09)');
  const cells = [...h.matchAll(/<tr>\s*<td[^>]*>[\s\S]*?<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => text(m[1]).trim());
  assert.ok(cells.length > 20);
  for (const c of cells) assert.ok(c.length > 0, 'a Where cell is empty');
  assert.match(text(h), /March 2001 Place not recorded Chad’s last show/);
});

test('/photos/: date order within each era (build-skeleton round 2, item 3)', () => {
  const h = page('photos');
  const photos = JSON.parse(readFileSync(join(site, 'data', 'photos.json'), 'utf8')).photos;
  for (const sec of h.split(/<section class="era"/).slice(1)) {
    const ids = [...sec.matchAll(/<figure id="([^"]+)"/g)].map((m) => m[1]);
    const years = ids.map((id) => photos.find((p) => p.id === id).year);
    assert.deepEqual(years, [...years].sort(), `era order: ${ids.join(', ')}`);
  }
});

test('/vault/mp3s/: "If I Cry" points to its compilation', () => {
  const h = page('vault/mp3s');
  assert.match(h, /“If I Cry”: the song is on <a href="\/music\/appearances\/#ll-appearance-1998-nashpop">Nashpop/);
  assert.match(page('music/appearances'), /<li id="ll-appearance-1998-nashpop">/);
});

test('/people/: photographers’ years match the dated photos; Mark Montgomery the same in both lists', () => {
  const t = text(page('people'));
  const photos = JSON.parse(readFileSync(join(site, 'data', 'photos.json'), 'utf8')).photos.filter((p) => p.status === 'publish' && p.credit);
  for (const name of new Set(photos.map((p) => p.credit))) {
    const ys = photos.filter((p) => p.credit === name).map((p) => Number(p.year)).sort();
    const years = ys[0] === ys.at(-1) ? `${ys[0]}` : `${ys[0]}–${ys.at(-1)}`;
    assert.ok(t.includes(`${name} (${years})`), `${name} (${years})`);
    if (name === 'Mark Montgomery') assert.match(t, new RegExp(`Mark Montgomery: [^.]*band photographs, ${years}`), 'On the records agrees');
  }
});

test('/epk/: logo links are named, not just "SVG" or "PNG"', () => {
  const h = page('epk');
  const links = [...h.matchAll(/<a href="\/logos\/[^"]+">([\s\S]*?)<\/a>/g)].map((m) => text(m[1]).trim());
  assert.ok(links.length >= 4);
  for (const l of links) assert.match(l, /\w+ .*\((SVG|PNG)\)$/, l);
});

test('Facts: Chad left in March 2001, month only (LL-15)', () => {
  const t = text(page('facts'));
  assert.match(t, /When did Chad leave Nashville\? In March 2001\. His last show with the band was that month too\./);
  assert.doesNotMatch(t, /after his last show/);
});

test('privacy describes the theme memory and the click-to-load video', () => {
  const t = text(page('privacy'));
  assert.equal(/local storage/.test(t), readFileSync(join(dist, 'js', 'site.js'), 'utf8').includes('localStorage'));
  assert.equal(/youtube-nocookie\.com/.test(t), htmlPages().some((f) => readFileSync(f, 'utf8').includes('data-yt=')));
});
