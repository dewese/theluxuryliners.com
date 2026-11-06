// Rules over the built site for the round-2 audits (critiques/audit-*-round2.md): copy, design,
// accessibility and security. Run `npm run build` first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = join(site, '..');
const dist = process.env.LL_DIST ?? join(site, 'dist'); // tests/run.mjs points LL_DIST at its snapshot
const page = (p) => readFileSync(join(dist, p, 'index.html'), 'utf8');
const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (h) => decode(h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<\/?(?:em|strong|a|span|cite|time|i|b)\b[^>]*>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const main = (h) => h.slice(h.indexOf('<main'), h.indexOf('</main>'));
const roundels = (h) => (h.match(/class="dot[ "]/g) ?? []).length;

test('copy B1: the Ohio and Michigan trip is the first to Ohio and Michigan, not "out of the region"', () => {
  const t = text(page('shows'));
  assert.match(t, /The band’s first trip to Ohio and Michigan\./);
  assert.doesNotMatch(t, /out of the region/i);
  assert.match(t, /Waco/, 'the earlier Texas show is still listed');
});

test('copy B2: /vault/ gives Live Liners both sets, as Story ch. 5, /shows/ and releases.json do', () => {
  const t = text(page('vault'));
  assert.match(t, /Live Liners \(2002\): two sets at 12th & Porter, Nashville: electric on July 18 and acoustic on November 17, 2002\./);
  assert.doesNotMatch(t, /recorded at 12th & Porter, Nashville, on July 18, 2002/);
});

test('copy: /shows/ has no provenance note, marks the 2008 solo show, and says "Two shows"', () => {
  const t = text(page('shows'));
  assert.doesNotMatch(t, /come from the band’s journal/);
  assert.match(t, /Not a Luxury Liners show: David’s CD-release show/);
  assert.match(t, /Two shows, Nashville, Tennessee/);
  assert.doesNotMatch(t, /Two Nashville shows/);
});

test('copy: home says "The band never broke up." once (in the LL-17 sentence, not the hero factline)', () => {
  const t = text(main(page('')));
  assert.equal((t.match(/The band never broke up\./g) ?? []).length, 1);
  assert.match(t, /The band never broke up\. The four forever members reconnected during the pandemic and started making music again\./);
});

test('copy: the live single puts the 1998 take first and the 2001 EP second', () => {
  for (const p of ['music', 'music/shake-it-up-live']) {
    const t = text(page(p));
    assert.doesNotMatch(t, /The Believe EP original, recorded live/, p);
    assert.match(t, /Recorded live in Waco, Texas, in autumn 1998[^.]*\. The studio version is on the Believe EP \(2001\)\./, p);
  }
});

test('copy: small items (ch. 9 Precious, New Beginning note, Facts dating note, press, EPK, ch. 2 years, Overbored casing)', () => {
  assert.match(text(page('story/great-day')), /“Precious To My Heart” \(listed as “Precious” on Sound As Ever/);
  const nb = text(page('music/new-beginning'));
  assert.match(nb, /Track 2 is “Great Day”, the February single\./);
  assert.doesNotMatch(nb, /demo|earlier version|2008/i, 'LL-13: no earlier version');
  const facts = text(page('facts'));
  assert.doesNotMatch(facts, /streaming services list|own answer stands/);
  const press = text(page('press'));
  assert.doesNotMatch(press, /\bLN\b/);
  assert.doesNotMatch(press, /Catching Up Fast/, 'listed without its title until David confirms');
  const epk = page('epk');
  const contact = text(epk.slice(epk.indexOf('id="contact"')));
  assert.equal((contact.match(/contact/gi) ?? []).length >= 1, true);
  assert.doesNotMatch(contact, /Contact the band/);
  assert.equal((epk.slice(epk.indexOf('id="contact"'), epk.indexOf('</section>', epk.indexOf('id="contact"'))).match(/href="\/contact\//g) ?? []).length, 1, 'one contact link');
  const quotes = epk.slice(epk.indexOf('id="quotes"'), epk.indexOf('</section>', epk.indexOf('id="quotes"')));
  for (const li of quotes.split('<li>').slice(1)) assert.match(text(li), /(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}/, 'every EPK quote is dated');
  assert.doesNotMatch(text(page('story')), /1997–1999/);
  assert.match(text(page('story/overbored')), /called “Waiting For The Sun” “/);
});

test('design: the Nonetheless cover caption says "Cover art: all rights reserved…", no invented artist', () => {
  for (const p of ['music/nonetheless', 'story/nonetheless']) {
    const t = text(main(page(p)));
    assert.match(t, /Cover art: all rights reserved by the rights holders\./, p);
    assert.doesNotMatch(t, /(?<!: )All rights reserved by the rights holders\./, p);
  }
});

test('design m8: release pages drop ": Review." from "More press"; /press/ keeps the kind', () => {
  assert.doesNotMatch(text(page('music/overbored')), /: Review\./);
  assert.match(text(page('press')), /[Rr]eview/);
});

test('design m3, m2: /contact/ has a kicker; /listen/ keeps roundels for the hero pills only', () => {
  assert.match(page('contact'), /class="kicker"[^>]*>Booking, press and hello</);
  const l = page('listen');
  const records = l.slice(l.indexOf('class="rows records"'), l.indexOf('</ul>', l.indexOf('class="rows records"')));
  assert.ok(records.includes('pill--plain'));
  assert.equal(roundels(records), 0, 'no roundels in the record-by-record pills');
  assert.ok(roundels(l) <= 15, `${roundels(l)} roundels on /listen/ (at most 15)`);
  assert.match(records, /<h3 id="l-[^"]+" class="h3"><a href="\/music\/[^"]+\/">[^<]+<\/a><\/h3>/, 'the record name is the heading link, alone');
});

test('design S2, S3, m5, m7: home video row, release video band, collage door, sizes', () => {
  const home = page('');
  assert.match(home, /class="two-col two-col--media home-video"/);
  assert.match(home, /class="col-more"><a class="pill" href="\/photos\/">/);
  assert.match(home, /min\(calc\(40vw - 48px\), 447px\)/, 'hero cover sizes (the 84% front cover; design r3 S1)');
  assert.match(home, /min\(58vw, 800px\)/, 'collage anchor sizes');
  const ob = page('music/overbored');
  assert.match(ob, /<section class="band band--tight surface" aria-labelledby="vid">/);
  assert.match(ob, /two-col--top/);
  assert.match(ob, /<section class="band band--short-end" aria-labelledby="more-press">/);
});

test('a11y m1: every release cover alt describes the art', () => {
  const alts = [...page('music/shake-it-up-live').matchAll(/<img class="cover"[^>]*alt="([^"]*)"/g)].map((m) => m[1]);
  assert.ok(alts.length);
  for (const a of alts) assert.match(a, /by The Luxury Liners: three band members/, a);
});

test('a11y m2: the accessibility statement gives a reply time', () => {
  assert.match(text(page('accessibility')), /We aim to reply within \d+ working days\./);
});

test('security B2: the Decap script runs after <body> exists (at the end of <body>, not in <head>)', () => {
  const h = readFileSync(join(dist, 'admin', 'index.html'), 'utf8');
  const head = h.slice(0, h.indexOf('</head>'));
  assert.doesNotMatch(head, /<script\b/, 'no script in <head>');
  const body = h.slice(h.indexOf('<body'), h.indexOf('</body>'));
  assert.match(body, /<script src="https:\/\/unpkg\.com\/decap-cms@[\d.]+\/dist\/decap-cms\.js" integrity="sha384-[^"]+" crossorigin="anonymous"><\/script>\s*$/);
});

test('security: CI pins its actions to commit SHAs and gives the private-literal key to the checks', () => {
  const ci = readFileSync(join(root, '.github', 'workflows', 'ci.yml'), 'utf8');
  for (const m of ci.matchAll(/uses:\s*(\S+)/g)) assert.match(m[1], /@[0-9a-f]{40}$/, m[1]);
  assert.match(ci, /PRIVATE_LITERALS_KEY: \$\{\{ secrets\.PRIVATE_LITERALS_KEY \}\}/);
});

test('security S1: private literals are keyed digests with generic labels', () => {
  const src = readFileSync(join(root, 'content', 'private-literals.mjs'), 'utf8');
  assert.match(src, /createHmac\('sha256'/);
  const labels = [...src.matchAll(/\['[0-9a-f]{64}', '([^']+)'\]/g)].map((m) => m[1]);
  assert.ok(labels.length >= 8);
  for (const l of labels) assert.match(l, /^private literal P\d+$/, l);
});
