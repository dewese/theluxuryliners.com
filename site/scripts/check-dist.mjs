// check-dist: scans every built file in dist/ and fails (exit 1) on anything that must never
// ship. Ported from daviddewese.com and extended with the band's own rules (plan §7.4 item 2 and
// the owner decisions). Rules marked † apply to the site's own words only: text inside
// <blockquote>, <q> or an element with data-quote is a dated quotation and is allowed.
//
// Everywhere, always:
//  - any e-mail address or mailto: link (LL-31: the contact address lives only in the Worker)
//  - internal project references (decision codes, research/plan paths, "withheld under", §)
//  - template junk: {{ }}, __X__, undefined / NaN / [object Object] / null as visible text
//  - LL-13: the talent-show story; "Great Day" next to "demo" or "2008"; a link to the 2008
//    bonus disc's Discogs page
//  - LL-27: any .mp3 file or link; LL-40: a newsletter; LL-39: a logo designer credit
//  - LL-6: the home page carries the one-liner byte for byte (entities decoded, quotes not folded); LL-17: "reconnected" only in the
//    approved sentence; "dads with careers" never
//  - privacy (plan §2.3, LL-7): the family page, phone numbers, "lives in", the Baptist Standard
//    profile, the town named in the founding story; old dead hosts as links
//  - the 2002 photo is never "the 2002 line-up"
//  - † "reunion", "broke up" (but "never broke up"), "one-time", "Nashville-based", "former
//    member", single-founder wording ("formed by Chad", "David joined", "Chad's band")
//  - "Shake It Up" called a cover; a page naming the song "Believe" without Cher
//  - typography the critics caught: "((" or "))", "..", "Photo: Cover art", a table cell or a
//    line starting with a comma, sourcing notes ("as credited on", "Source:")
//  - source maps; image metadata (Exif/XMP); dist/_headers without a CSP
// RELEASE=1 (npm run build:production) also fails on:
//  - PLACEHOLDER copy (content not written yet)
//  - a missing key: PUBLIC_TURNSTILE_SITE_KEY (no Turnstile widget on /contact/) or
//    PUBLIC_CF_ANALYTICS_TOKEN (no analytics beacon on every page)
// Usage: node scripts/check-dist.mjs [dist-dir]
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.argv[2] ?? join(site, 'dist');
const RELEASE = process.env.RELEASE === '1';
if (!existsSync(join(dist, 'index.html'))) { console.error('check-dist: dist/ not built (run npm run build)'); process.exit(1); }

const all = [];
const walk = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = join(d, e.name); if (e.isDirectory()) walk(p); else all.push(p); });
walk(dist);
const textFiles = all.filter((f) => /\.(html|txt|md|json|xml|js|css|svg|yml)$/.test(f) || /_redirects$|_headers$/.test(f));

const decode = (s) => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
/** Visible text of an HTML page (scripts, styles and tags removed). */
export const visible = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<\/?(?:em|strong|i|b|a|span|cite|time|q)\b[^>]*>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
/** Visible text without quotations (for the † rules). */
const ownWords = (html) => visible(html.replace(/<blockquote[\s\S]*?<\/blockquote>/gi, ' ').replace(/<q[\s>][\s\S]*?<\/q>/gi, ' ').replace(/<(\w+)[^>]*\bdata-quote\b[^>]*>[\s\S]*?<\/\1>/gi, ' '));
const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

const ONE_LINER = "The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together. The name comes from the Gram Parsons song 'Luxury Liner'.";
const LL17 = 'The band never broke up. The four forever members reconnected during the pandemic and started making music again.';
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/;

// [name, regex, scope]; scope: 'raw' (every byte of every text file), 'text' (visible text of
// pages + plain-text files), 'own' (visible text minus quotations), 'html' (raw HTML of pages)
const RULES = [
  ['e-mail address', EMAIL, 'raw'],
  ['mailto: link', /mailto:/i, 'raw'],
  ['internal project reference', /\b(?:LL|DL)-\d+\b|\bX1\b|\[(?:F\d|P\d+)\]|research\/0\d|DECISIONS|00-master-plan|withheld under|\bRD\d+\b|§/, 'raw'],
  ['template placeholder {{ }}', /\{\{[^}]*\}\}|__[A-Z][A-Z0-9_]{2,}__/, 'text'],
  ['undefined / NaN / [object Object] / null as text', /(^|[\s>(:])(undefined|NaN|\[object Object\]|null)([\s<.,;)]|$)/, 'text'],
  ['talent-show story (LL-13)', /talent[- ]show/i, 'raw'],
  ['"Great Day" tied to a demo or to 2008 (LL-13)', /great day[^.!?]{0,120}\bdemos?\b|\bdemos?\b[^.!?]{0,120}great day|great day[^.!?]{0,80}\b2008\b(?!–)|\b2008\b(?!–)[^.!?()]{0,80}great day/i, 'text'],
  ['link to the 2008 bonus disc on Discogs (LL-13)', /discogs\.com\/(?:[a-z]+\/)?release\/15436127/i, 'raw'],
  ['MP3 link (LL-27)', /href="[^"]*\.mp3(?:[?#"][^"]*)?"/i, 'html'],
  ['newsletter (LL-40)', /\bnewsletters?\b/i, 'own'],
  ['logo designer credit (LL-39)', /logos?\b[^.]{0,60}\b(?:designed|drawn|created) by\b|logo design(?:er)?:/i, 'text'],
  ['"reconnected" outside the approved sentence (LL-17)', /reconnected/i, 'll17'],
  ['"dads with careers" (LL-17, LL-7)', /dads with careers/i, 'raw'],
  ['private family page (privacy)', /\bethan(?:\.html|\.jpg|_)|href="[^"]*ethan/i, 'html'],
  ['phone number (privacy)', /\(\d{3}\)\s?\d{3}-\d{4}|\b\d{3}[-.]\d{3}[-.]\d{4}\b/, 'text'],
  ['where a member lives (LL-7, LL-19)', /\b(?:lives|living|resides|resident) (?:in|near|outside)\b|\bnow (?:lives|based) in\b/i, 'own'],
  ['the profile of Chad\'s later life (privacy)', /baptist ?standard/i, 'raw'],
  ['the town of the founding story (LL-5)', /\bMesquite\b/i, 'raw'],
  ['link to a dead or retired host', /href="https?:\/\/(?:www\.)?(?:isawtheocean\.com|[a-z0-9-]*\.?bigcartel\.com|noisetrade\.com|myspace\.com|soundcloud\.com)/i, 'html'],
  ['"the 2002 line-up" (P23)', /2002 line-?up|line-?up (?:of|in) 2002/i, 'text'],
  ['† "reunion"', /\breunion|\breunited\b/i, 'own'],
  ['† "broke up" (except "never broke up")', /(?<!never )\bbroke(?:n)? up\b|\bsplit up\b|\bbreak-?up\b/i, 'own'],
  ['† "one-time"', /\bone-time\b/i, 'own'],
  ['† "Nashville-based"', /\bNashville-based\b/i, 'own'],
  ['† "former member"', /\bformer (?:band ?)?members?\b/i, 'own'],
  ['† single-founder wording', /formed by Chad|David joined (?:the band|The Luxury Liners)|Chad['’]s band|outlet for (?:Foxymorons member )?David/i, 'own'],
  ['"Shake It Up" called a cover', /shake it up[^.?]{0,40}\bcover\b(?! of Cher|\?)/i, 'own'],
  ['doubled parentheses', /\(\(|\)\)/, 'text'],
  ['double full stop', /[^.]\.\.(?!\.)/, 'text'],
  ['"Photo: Cover art"', /Photo:\s*Cover art/i, 'text'],
  ['comma at the start of a cell or line', /<td[^>]*>\s*,|<dd[^>]*>\s*,|<li[^>]*>\s*,|, ,/, 'html'],
  ['Internet Archive link (no snapshot has been read yet; plan R2, §11)', /href="https?:\/\/web\.archive\.org/i, 'html'],
  ['a place repeated ("Ohio and Michigan, Ohio and Michigan")', /\b([A-Z][a-z]+(?: and [A-Z][a-z]+)?), \1\b/, 'text'],
  ['sourcing note in public copy', /\bas credited on\b|\bSources?:\s|\bper (?:the )?(?:band['’]s )?\d{4} (?:site|website|discography)/i, 'own'],
];
// Cover credits still pending in data/artwork.json (single-source, outside LL-23) never ship, on
// any page or in JSON-LD, whatever a copy file says (round-1 critique, blocking item 1).
const ARTWORK = JSON.parse(readFileSync(join(site, 'data', 'artwork.json'), 'utf8')).credits;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const a of ARTWORK.filter((x) => x.status !== 'publish')) {
  const t = esc(a.release.replace(/-/g, ' ')); // the release slug read as its title ("nonetheless")
  RULES.push([`pending cover credit: ${a.name}, ${a.release}`, new RegExp(`${esc(a.name)}[^.<]{0,60}\\b(?:paint(?:ed|ing|ings|s)?|cover (?:art|painting|design)|the cover)\\b|\\b(?:paint(?:ed|ing|ings)|cover(?: art)?)\\b[^.]{0,40}\\bby ${esc(a.name)}|\\bpaint(?:ed|ing|ings)?\\b[^.]{0,80}\\b(?:${t})\\b|\\b(?:${t})\\b[^.]{0,80}\\bpaint(?:ed|ing|ings)?\\b`, 'i'), 'raw']);
}
const WARN = [
  ['a year next to Emmylou Harris’s Luxury Liner (contested; human check)', /Emmylou Harris['’]s? (?:album )?Luxury Liner[^.]{0,30}\b19\d\d\b/i, 'text'],
  ['British spelling on an American band’s site', /\b(?:colours?|travell(?:ed|ing)|licence|favourite|organis(?:e|ed|ing)|recognis(?:e|ed|ing)|behaviour|practis(?:e|ed|ing))\b/i, 'own'],
];
// The fonts' SIL Open Font Licence files ship with the fonts (OFL §2). Their legal wording ("null
// and void") is not template junk, so that one rule skips them; every other rule still applies.
const SKIP_TEXT = { 'undefined / NaN / [object Object] / null as text': (f) => /\/fonts\/OFL-[\w-]+\.txt$/.test(f) };
const SKIP_RAW = {
  // bundled code and generated config are not prose; _redirects is Cloudflare configuration (never served)
  'e-mail address': (f) => /\.(js|css)$/.test(f),
  'internal project reference': (f) => /\.(js|css)$/.test(f) || /_redirects$|_headers$/.test(f),
};

const hits = [], warns = [];
const scan = (list, out, f, rel, raw, isHtml) => {
  for (const [name, re, scope] of list) {
    if (scope === 'raw' && SKIP_RAW[name]?.(f)) continue;
    if (SKIP_TEXT[name]?.(f)) continue;
    if ((scope === 'html' || scope === 'own') && !isHtml) continue;
    let hay;
    if (scope === 'raw' || scope === 'html') hay = raw;
    else if (scope === 'own') hay = ownWords(raw);
    else if (scope === 'll17') { if (!isHtml && !/\.(txt|md)$/.test(f)) continue; hay = norm(isHtml ? visible(raw) : raw).split(norm(LL17)).join(' '); }
    else hay = isHtml ? visible(raw) : /\.(txt|md|xml)$/.test(f) ? raw : '';
    if (!hay) continue;
    const m = re.exec(hay);
    if (m) out.push(`${rel}: ${name}: "…${hay.slice(Math.max(0, m.index - 50), m.index + m[0].length + 40).replace(/\s+/g, ' ')}…"`);
  }
};
let placeholders = 0;
for (const f of textFiles) {
  const raw = readFileSync(f, 'utf8');
  const rel = relative(dist, f);
  const isHtml = f.endsWith('.html');
  scan(RULES, hits, f, rel, raw, isHtml);
  scan(WARN, warns, f, rel, raw, isHtml);
  if (isHtml) {
    const n = (raw.match(/\bPLACEHOLDER\b/g) ?? []).length;
    placeholders += n;
    if (n && RELEASE) hits.push(`${rel}: PLACEHOLDER copy (${n}): write the content/ file named in its data-placeholder attribute`);
    const t = visible(raw);
    if (/“Believe”|"Believe"/.test(raw) && !/Cher/.test(t)) hits.push(`${rel}: names the song “Believe” without Cher`);
  }
}
// LL-6: the one-liner, word for word, on the home page
if (!visible(readFileSync(join(dist, 'index.html'), 'utf8')).includes(ONE_LINER)) hits.push('index.html: the one-line description is missing or not byte for byte (straight quotes, LL-6)');
// LL-27: no audio files at all
for (const f of all) if (/\.(mp3|m4a|wav|ogg|ram|ra)$/i.test(f)) hits.push(`${relative(dist, f)}: audio file (LL-27: no downloads)`);
// source maps and image metadata
for (const f of all) {
  if (/\.map$/.test(f)) hits.push(`${relative(dist, f)}: source map`);
  if (/\.(jpe?g|webp|png)$/i.test(f)) { const b = readFileSync(f).subarray(0, 65536).toString('latin1'); if (/Exif\0\0|<x:xmpmeta|http:\/\/ns\.adobe\.com\/xap/.test(b)) hits.push(`${relative(dist, f)}: image metadata (Exif/XMP)`); }
}
// _headers with a CSP
const hdr = existsSync(join(dist, '_headers')) ? readFileSync(join(dist, '_headers'), 'utf8') : '';
if (!/Content-Security-Policy: default-src/.test(hdr)) hits.push('_headers: missing or without a Content-Security-Policy (run node scripts/build-headers.mjs)');
if (!existsSync(join(dist, '_redirects'))) hits.push('_redirects: missing (run node scripts/build-redirects.mjs)');
// keys: required for a release build
const contact = existsSync(join(dist, 'contact/index.html')) ? readFileSync(join(dist, 'contact/index.html'), 'utf8') : '';
const hasTurnstile = /challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/.test(contact) && /class="cf-turnstile[^"]*"[^>]*data-sitekey="[^"]+"/.test(contact);
const pages = all.filter((f) => f.endsWith('.html') && !relative(dist, f).startsWith('admin/')); // the Decap editor shell is not a site page
const withBeacon = pages.filter((f) => /static\.cloudflareinsights\.com\/beacon\.min\.js[^>]*data-cf-beacon='\{[^']*"token":"[^"]+"/.test(readFileSync(f, 'utf8').replace(/data-cf-beacon="([^"]*)"/, (m, v) => `data-cf-beacon='${decode(v)}'`))).length;
if (RELEASE) {
  if (!hasTurnstile) hits.push('missing key: PUBLIC_TURNSTILE_SITE_KEY (no Turnstile on /contact/)');
  if (withBeacon !== pages.length) hits.push(`missing key: PUBLIC_CF_ANALYTICS_TOKEN (analytics beacon on ${withBeacon} of ${pages.length} pages)`);
}

for (const w of warns) console.log(`check-dist: warning: ${w}`);
if (hits.length) { console.log(`check-dist: FAIL (${hits.length})\n  ${hits.slice(0, 60).join('\n  ')}`); process.exit(1); }
const notes = [];
if (placeholders) notes.push(`${placeholders} PLACEHOLDER block(s)`);
if (!hasTurnstile) notes.push('no Turnstile key');
if (!withBeacon) notes.push('no analytics token');
console.log(`check-dist: PASS${RELEASE ? ' (RELEASE)' : ''} (${textFiles.length} text files, ${all.length} files)${notes.length && !RELEASE ? `; a release build (RELEASE=1) would fail on: ${notes.join(', ')}` : ''}`);
