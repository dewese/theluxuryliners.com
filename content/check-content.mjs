#!/usr/bin/env node
// check-content.mjs: copy-rule checker for theluxuryliners.com.
//
//   node content/check-content.mjs                 scan content/ (Markdown + JSON)
//   node content/check-content.mjs --dist dist     also scan a built site (HTML, JSON-LD, JS, llms.txt, XML);
//                                                  the LL-6 one-liner is compared byte for byte there
//   node content/check-content.mjs --dist-only dist
//   node content/check-content.mjs --repo          every tracked file (git ls-files): private literals only
//                                                  (the repository is public; see REPO_EXCEPTIONS)
//   node content/check-content.mjs --self-test     prove every rule fires on a bad sample and not on a good one
//   add --json for machine-readable output
//
// Exit code 1 when any error is found. Warnings never fail. See content/CHECK.md for
// the rules, the scopes and how internal (never-rendered) fields are told apart.
// No dependencies: Node 18+.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { PRIVATE_HASHES, KEY as PRIVATE_KEY, privateHits, privateLines, digest } from './private-literals.mjs';
import { fileHasGps, bufferHasGps } from './exif-gps.mjs';
export { privateHits };

const HERE = dirname(fileURLToPath(import.meta.url));

// Canonical strings (owner decisions). Compared after quote-glyph normalisation in text,
// and byte-for-byte in content/home.md's one_liner field.
export const ONE_LINER =
  "The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together. The name comes from the Gram Parsons song 'Luxury Liner'."; // LL-6
export const LL17 =
  'The band never broke up. The four forever members reconnected during the pandemic and started making music again.'; // LL-17
export const CAPTION_2002 = 'David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002'; // P23

// Keys whose values are never rendered (source notes, ids, flags). Everything else is public.
const INTERNAL_KEYS = new Set([
  'sources', 'source', 'confidence', 'contested', 'notes_internal', 'held', 'checked_on', 'checked_by',
  'why', 'id', 'sort_key', 'date_precision', 'release_id', 'show_id', 'faq_jsonld', 'publish', 'data',
  'chapters_dir', 'use', 'target_words', 'era', 'slug', 'page', 'photo', 'file', 'link', 'href',
  'excerpt_speaker', 'kind_internal', 'claim', 'item',
]);
const SKIP_FILES = new Set(['CHECK.md', 'check-content.mjs']);

// ---------- text helpers ----------
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…', eacute: 'é' };
function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}
// Curly apostrophes and quotes are folded to ASCII so one pattern catches both spellings.
export function norm(s) {
  return s
    .replace(/[‘’‚‛ʼ′`´]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[   ]/g, ' ')
    .replace(/[‐‑]/g, '-')
    .replace(/(^|[^*])\*{1,2}([^*\n]+?)\*{1,2}/g, '$1$2') // markdown emphasis
    .replace(/\s+/g, ' ');
}

// ---------- rules ----------
// scope 'all': applies to every string, internal notes included (privacy; the repo is public).
// scope 'public': rendered text only. quoteExempt: not applied inside <blockquote>/<q>/[data-quote]
// or Markdown "> " quotes (plan §7.4 rule 2, the † rules).
const R = [];
const rule = (id, level, scope, re, msg, extra = {}) => R.push({ id, level, scope, re, msg, ...extra });

// Privacy (plan §2 item 3, LL-7, LL-31)
// Private literals are matched by a keyed digest (HMAC-SHA256) of a lower-cased token, never written
// here: the matcher and the digest list live in content/private-literals.mjs (shared with
// site/scripts/check-dist.mjs).
let privateHashes = PRIVATE_HASHES; // the self-test swaps in a synthetic list
let privateKey = PRIVATE_KEY;       // and, on a machine without the key, a synthetic key

// Privacy (plan §2 item 3, LL-7, LL-31)
rule('private-literal', 'error', 'all', null, 'A private name or address (hash match) must never appear in copy, data or the built site.', {
  test: (t) => privateHits(t, privateHashes, privateKey).length > 0,
  detail: (t) => privateHits(t, privateHashes, privateKey).join('; '),
});
rule('email-address', 'error', 'all', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, 'No email addresses in copy or data (the band Gmail and the contact address stay private).');
rule('phone-number', 'error', 'all', /(?:\(\d{3}\)\s?|\b\d{3}[-.\s])\d{3}[-.]\d{4}\b/, 'No phone numbers (old site privacy flags).');
rule('postal-address', 'error', 'all', /\bP\.?\s?O\.?\s+Box\b|\b\d{2,5}\s+[A-Z][a-z]+\s+(?:Street|St\.|Avenue|Ave\.|Road|Rd\.|Drive|Dr\.|Lane|Ln\.|Boulevard|Blvd\.)/, 'No mailing addresses.');
rule('family-page', 'error', 'all', /family page/i, 'The private family page is never linked or named.');
rule('college-name', 'error', 'all', /\b(?:[A-Z][\w&.'-]*\s+){1,4}(?:University|College)\b|\bUniversity of\b/, 'No college names (plan §2 item 3). "college friend" is fine.');
rule('life-outside-band', 'error', 'public', /\b(?:wife|wives|husband|married|kids|children|daughters?|sons|grandkids|dads|careers|day jobs?|church|pastor|minister|ministry|seminary)\b|dads with careers/i, 'Nothing about members\' lives outside the band (LL-7, LL-17).');
rule('where-members-live', 'error', 'public', /\b(?:lives?|living|resides?|based|moved|moving|relocated)\b(?:\s+[\w']+){0,4}\s+(?:in|to)\s+(?:Tennessee|Michigan|Texas|Dallas|California|Southern California|San Diego|Detroit|Grand Rapids)\b/i, 'Never say which member lives where (LL-7, LL-19). "spread across Tennessee, Michigan and Texas" is the approved form.');
rule('southern-california', 'error', 'public', /Southern California/i, 'Do not say where anyone moved (LL-7).');
rule('four-states', 'error', 'public', /four (?:different )?states/i, 'Three states today (LL-19).');
rule('banned-hosts', 'error', 'all', /isawtheocean|bigcartel|noisetrade|myspace\.com|soundcloud/i, 'Expired or excluded hosts (P5, LL-36).');

// Story rules
rule('talent-show', 'error', 'public', /talent[\s-]*shows?/i, 'LL-13: the talent-show story is left out entirely, Vault included.');
rule('battle-of-bands', 'warn', 'public', /battle of the bands/i, 'Check this is not drifting toward a contest origin story (LL-13).');
rule('great-day-bonus-disc', 'error', 'public', /bonus disc|discogs\.com\/release\/15436127/i, 'LL-13: never mention or link the 2008 bonus disc that lists the "Great Day" demo.');
rule('demo-near-great-day', 'error', 'public', null, 'LL-13: never say or imply the "Great Day" single is the 2008 demo.', {
  test: (t) => t.split(/(?<=[.!?])\s+/).some((s) => /great day/i.test(s) && /\bdemo|\b2008\b|same recording|re-?recorded|first recorded/i.test(s))
    || (/great day/i.test(t) && /\bdemo/i.test(t)),
});
rule('broke-up', 'error', 'public', null, '"broke up" only as "never broke up" (plan §2 item 5).', {
  quoteExempt: true,
  test: (t) => [...t.matchAll(/(\w+\s+)?(?:broke up|broken up|break-?up|split up)\b/gi)].some((m) => !/^(?:never|not)\s+$/i.test(m[1] || '')),
});
rule('reunion', 'error', 'public', /\breunion|\breunit|together again|back together|\bre-formed\b|\bcomeback\b/i, 'No "reunion"/"together again": LL-17 wording is the only account.', { quoteExempt: true });
rule('former-member', 'error', 'public', /former (?:band\s?)?members?|former[^.]{0,20}\b(?:Chad|Scott|Larry|Wilstermann|Carpenter|Edgington|Dewese)\b/i, 'Never "former" of a forever member (plan §2 item 5).', { quoteExempt: true });
rule('one-time', 'error', 'public', /\bone-time\b/i, 'The band is not "one-time" (plan §1).', { quoteExempt: true });
rule('nashville-based', 'error', 'public', /nashville[\s-]based/i, 'No present-tense "Nashville-based" (plan §7.4).', { quoteExempt: true });
rule('single-founder', 'error', 'public', /\bformed by Chad\b|\bChad formed\b|\bChad's band\b|\bDavid joined\b|\b(?:founded|formed|started) by (?:Chad|David)(?: Edgington| Dewese)?\b(?!\s+and)|\bI named my band\b/i, 'Co-founded by David Dewese and Chad Edgington (F4, LL-6).', { quoteExempt: true });
rule('founded-in-nashville', 'error', 'public', /(?:founded|formed|started) in Nashville/i, 'Named in Texas, based in Nashville from May 1997 (LL-4, LL-5).');
rule('line-up-2002', 'error', 'public', /2002 line-?up/i, 'Never "the 2002 line-up" (P23).');
rule('caption-2002', 'error', 'public', null, `The 2002 photo caption must be exactly "${CAPTION_2002}" (P23).`, {
  test: (t) => /Wilstermann, Chad Edgington, David Dewese and Scott Carpenter/.test(t) && !t.includes(CAPTION_2002),
});
rule('chad-april', 'error', 'public', /Chad[^.]{0,80}\bApril 2001|April 2001[^.]{0,80}\bChad/, 'Chad left in March 2001 (LL-15).');
rule('left-nashville-2010', 'error', 'public', /left Nashville[^.]{0,30}2010|2010[^.]{0,30}left Nashville/i, 'David left Nashville in 2009 (LL-17).');
rule('shake-it-up-cover', 'error', 'public', /cover (?:of|version of)\s+"?Shake It Up|"?Shake It Up"?,?\s+(?:is|was)\s+a\s+cover|Cars'?\s+"?Shake It Up/i, '"Shake It Up" is an original (P27).');
rule('believe-without-cher', 'error', 'public', null, 'The song "Believe" is always credited to Cher (P27).', {
  test: (t) => /"Believe"/.test(t) && !/\bCher\b/.test(t),
});
rule('one-liner-exact', 'error', 'public', null, 'The LL-6 one-liner must be verbatim wherever it is used.', {
  test: (t) => /power-pop band co-founded/i.test(t) && !t.includes(norm(ONE_LINER)),
});
rule('ll17-exact', 'error', 'public', null, 'The reconnection is told only in the LL-17 wording, verbatim.', {
  test: (t) => /reconnect/i.test(t) && !t.includes(LL17),
});
rule('ascii-year-apostrophe', 'error', 'public', null, 'Use U+2019 (’) before a two-digit year: ’97, not \'97.', {
  raw: true,
  test: (raw) => /(?:^|[^\w'’])'\d\d\b/.test(raw),
});

// Unverified or contested facts
rule('unverified-items', 'error', 'public', /hot prospects|monsters of pop|music music caf/i, 'Unverified (Billboard title, Monsters of Pop) or mistaken names never publish.');
rule('lead-me-on-jetpack', 'error', 'public', /Lead Me On[^.]{0,60}Jetpack|Jetpack[^.]{0,60}Lead Me On/i, 'Which Jetpack is open (plan §4.3): held.');
rule('emmylou-year', 'warn', 'public', /Emmylou Harris[^.]{0,80}\b19(?:76|77)\b|Luxury Liner"?\s*\(19\d\d\)/, 'The year of Emmylou Harris\'s album is contested; default is no year (plan §4.3).');
rule('ishee-years', 'error', 'public', /Ishee[^.]{0,60}\b2004\s*[–-]\s*(?:20)?0[6-9]\b/, 'LL-24: Gary Ishee played shows in 2004–05; Nonetheless guitar is a separate role.');
rule('nonetheless-cover-credit', 'error', 'public', /paint(?:ed|ing|ings)\b[^.]{0,80}Nonetheless|Nonetheless[^.]{0,80}\bpaint(?:ed|ing|ings)\b/i, 'The Nonetheless painting credit is single-source and outside LL-23: held until David confirms.');
rule('two-waco-sessions', 'error', 'public', /\balso recorded\b[^.]{0,80}E-Cleff|E-Cleff[^.]{0,120}\b(?:separate|another|second|also)\b/i, 'Whether the E-Cleff set (Trunk Box) and the Texas Music Café night are one session or two is not known: never imply two.');
rule('barlowe-spelling', 'warn', 'public', /Krist[ei]n Barlowe/i, 'Photographer spelling not confirmed (research/01 D12).');
rule('hatch-show', 'warn', 'public', /Hatch Show/i, 'Unverified that Hatch Show Print made the band\'s poster.');

// No downloads, no newsletter, no logo designer credit
rule('downloads', 'error', 'public', /\bdownload|\.mp3\b/i, 'LL-27: no MP3s or downloads at all.');
rule('mp3-mention', 'warn', 'public', /\bmp3s?\b/i, 'LL-27: old MP3s may be listed by title as history only.');
rule('newsletter', 'error', 'public', /newsletter|mailing list|mail list|luxlist|\bsubscribe|\bsign[\s-]?up\b/i, 'LL-40: no newsletter.');
rule('logo-designer', 'error', 'public', /\bGlen\b|logos?\s+(?:were\s+|was\s+)?(?:designed|drawn|created|made)\s+by|logo design(?:er)?\s*:?\s*by/i, 'LL-39: no logo designer credit.');

// No sourcing notes or internal tags in rendered text
rule('sourcing-note', 'error', 'public', /as credited on|discography page|search snippet|\b(?:single|verified)-source\b|confirmed-owner|\bunverified\b|\(source[:)]|\bper the (?:band|journal|roster)|\bcited (?:in|on|by)\b/i, 'No sourcing notes in public copy; sources live in frontmatter/JSON.');
rule('source-host-mention', 'warn', 'public', /\bWayback\b|web\.archive\.org|\bFlickr\b|\bDiscogs\b/i, 'Usually a sourcing note; fine only as a deliberate link (e.g. sameAs, Listen).');
rule('decision-tags', 'error', 'public', /\bLL-\d+\b|\bX1\b|\[(?:F|P|O|L|R)\d+\]|\bDL-\d|withheld under/, 'Internal decision tags never reach the site.');

// ---------- extraction ----------
function mdSegments(file, src) {
  const segs = [];
  const lines = src.split('\n');
  let i = 0;
  if (lines[0] === '---') {
    let top = null, internal = false;
    for (i = 1; i < lines.length && lines[i] !== '---'; i++) {
      const line = lines[i];
      const m = /^([A-Za-z_][\w-]*):(.*)$/.exec(line);
      if (m) { top = m[1]; internal = INTERNAL_KEYS.has(top); }
      // nested "key: value": internal when the nested key is internal
      const nested = /^\s+(?:-\s+)?([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
      const isInternal = internal || (nested && INTERNAL_KEYS.has(nested[1]));
      const value = m ? m[2] : nested ? nested[2] : line.replace(/^\s*-\s*/, '');
      if (value.trim() && !/^[>|]-?$/.test(value.trim())) segs.push({ file, loc: `line ${i + 1}`, raw: unquoteYaml(value.trim()), scope: isInternal ? 'internal' : 'public', quote: false });
    }
    i++;
  }
  // body: paragraphs
  let start = i, buf = [];
  const flush = (end) => {
    if (!buf.length) return;
    const quote = buf.every((l) => /^\s*>/.test(l));
    segs.push({ file, loc: `line ${start + 1}`, raw: buf.join('\n'), scope: 'public', quote });
    buf = [];
  };
  for (; i < lines.length; i++) {
    if (!lines[i].trim()) { flush(i); start = i + 1; continue; }
    if (/^#{1,6}\s/.test(lines[i])) { flush(i); segs.push({ file, loc: `line ${i + 1}`, raw: lines[i].replace(/^#+\s*/, ''), scope: 'public', quote: false }); start = i + 1; continue; }
    if (!buf.length) start = i;
    buf.push(lines[i]);
  }
  flush(lines.length);
  return segs;
}
function unquoteYaml(v) {
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    try { return v.startsWith('"') ? JSON.parse(v) : v.slice(1, -1).replace(/''/g, "'"); } catch { return v.slice(1, -1); }
  }
  return v;
}

function jsonSegments(file, obj) {
  const segs = [];
  const walk = (v, path, internal) => {
    if (v && typeof v === 'object' && !Array.isArray(v) && v.publish === false) internal = true;
    if (typeof v === 'string') { segs.push({ file, loc: path, raw: v, scope: internal ? 'internal' : 'public', quote: /excerpt$/.test(path) }); return; }
    if (Array.isArray(v)) { v.forEach((x, k) => walk(x, `${path}[${k}]`, internal)); return; }
    if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k, internal || INTERNAL_KEYS.has(k) || k.startsWith('_'));
  };
  walk(obj, '', false);
  return segs;
}

function htmlSegments(file, html) {
  const segs = [];
  const push = (raw, quote, loc) => { const t = decodeEntities(raw).trim(); if (t) segs.push({ file, loc, raw: t, scope: 'public', quote }); };
  // JSON-LD is public data
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { segs.push(...jsonSegments(file, JSON.parse(m[1])).map((s) => ({ ...s, scope: 'public', loc: `JSON-LD ${s.loc}` }))); } catch { push(m[1], false, 'JSON-LD (unparsed)'); }
  }
  let body = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  // attributes people or machines read
  for (const m of body.matchAll(/\s(?:alt|title|aria-label|content|placeholder)=("([^"]*)"|'([^']*)')/gi)) push(m[2] ?? m[3] ?? '', false, 'attribute');
  // quotations: allow-listed for the quoteExempt rules
  const quoteRe = /<(blockquote|q)\b[^>]*>([\s\S]*?)<\/\1>|<(\w+)\b[^>]*\sdata-quote\b[^>]*>([\s\S]*?)<\/\3>/gi;
  body = body.replace(quoteRe, (_, t1, c1, t2, c2) => { push(stripTags(c1 ?? c2 ?? ''), true, 'quote'); return ' '; });
  const blocks = body.replace(/<\/(?:p|li|h[1-6]|td|th|dd|dt|figcaption|caption|div|section|article|header|footer|nav|tr)>|<br\s*\/?>/gi, '\n\n');
  stripTags(blocks).split(/\n\s*\n/).forEach((p, k) => push(p, false, `block ${k + 1}`));
  return segs;
}
const stripTags = (s) => s.replace(/<[^>]+>/g, ' ');

// ---------- running ----------
function applyRules(seg) {
  const out = [];
  const t = norm(seg.raw);
  for (const r of R) {
    if (r.scope === 'public' && seg.scope !== 'public') continue;
    if (r.quoteExempt && seg.quote) continue;
    const hit = r.test ? r.test(r.raw ? seg.raw : t) : r.re.test(t);
    if (hit) {
      const m = r.re ? t.match(r.re) : null;
      out.push({ level: r.level, rule: r.id, file: seg.file, loc: seg.loc, msg: r.detail ? `${r.msg} (${r.detail(t)})` : r.msg, text: r.detail ? '' : (m ? m[0] : t).slice(0, 140) });
    }
  }
  return out;
}

function listFiles(dir, exts) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { if (!/^(node_modules|\.git|\.astro)$/.test(name)) out.push(...listFiles(p, exts)); }
    else if (exts.includes(extname(name).toLowerCase()) || exts.includes(name)) out.push(p);
  }
  return out;
}

function checkContent(root) {
  const issues = [];
  const json = {};
  const add = (level, rule, file, loc, msg, text = '') => issues.push({ level, rule, file, loc, msg, text });
  for (const p of listFiles(root, ['.md', '.json'])) {
    if (SKIP_FILES.has(basename(p))) continue;
    const rel = relative(process.cwd(), p);
    const src = readFileSync(p, 'utf8');
    let segs;
    if (p.endsWith('.json')) {
      try { json[basename(p)] = JSON.parse(src); } catch (e) { add('error', 'json-parse', rel, '', e.message); continue; }
      segs = jsonSegments(rel, json[basename(p)]);
    } else {
      segs = mdSegments(rel, src);
      if (!/^---\n[\s\S]*?\nsources:/m.test(src)) add('error', 'md-sources', rel, 'frontmatter', 'Every content Markdown file needs a sources: list in its frontmatter.');
    }
    for (const s of segs) issues.push(...applyRules(s));
  }

  // Structural checks
  const home = join(root, 'home.md');
  if (existsSync(home)) {
    const m = /^one_liner:\s*(.*)$/m.exec(readFileSync(home, 'utf8'));
    if (!m || unquoteYaml(m[1].trim()) !== ONE_LINER) add('error', 'one-liner-field', 'content/home.md', 'one_liner', 'home.md one_liner must equal the LL-6 text byte for byte.');
  }
  const epk = join(root, 'epk.md');
  if (existsSync(epk)) {
    const body = readFileSync(epk, 'utf8').split(/^---$/m).slice(2).join('---');
    for (const [heading, target] of [['Short bio', 50], ['Medium bio', 150], ['Long bio', 300]]) {
      const sec = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`).exec(body);
      const words = sec ? sec[1].trim().split(/\s+/).filter(Boolean).length : 0;
      if (Math.abs(words - target) > target * 0.2) add('error', 'epk-length', 'content/epk.md', heading, `${heading}: ${words} words, target ${target} (±20%).`);
    }
  }
  const shows = json['shows.json']?.shows ?? [];
  const showIds = new Set();
  const PREC = new Set(['day', 'approx-day', 'month', 'month-range', 'season', 'season-range', 'year']);
  shows.forEach((s, k) => {
    const loc = `shows[${k}] ${s.id}`;
    if (showIds.has(s.id)) add('error', 'show-id-dup', 'content/shows.json', loc, 'Duplicate show id.');
    showIds.add(s.id);
    if (!/^\d{4}-(?:0\d|1[0-2])-(?:[0-2]\d|3[01])$/.test(s.sort_key || '')) add('error', 'show-sort-key', 'content/shows.json', loc, 'sort_key must be YYYY-MM-DD (00 for unknown parts).');
    if (!PREC.has(s.date_precision)) add('error', 'show-precision', 'content/shows.json', loc, `date_precision must be one of ${[...PREC].join(', ')}.`);
    if (s.date_precision === 'year' && !/-00-00$/.test(s.sort_key)) add('error', 'show-sort-key', 'content/shows.json', loc, 'A year-only row sorts as YYYY-00-00.');
    if (!s.sort_key?.startsWith(String(s.date_display).match(/\d{4}/)?.[0] ?? '')) add('error', 'show-sort-key', 'content/shows.json', loc, 'sort_key year must match the first year in date_display.');
  });
  const sorted = [...shows].sort((a, b) => (a.sort_key + a.id).localeCompare(b.sort_key + b.id));
  if (sorted.some((s, k) => s !== shows[k])) add('warn', 'show-order', 'content/shows.json', 'shows', 'Rows are not stored in [sort_key, id] order (the build sorts anyway).');
  const people = json['people.json'];
  if (people) {
    for (const group of Object.values(people)) if (Array.isArray(group)) for (const p of group) {
      if (p.show_id && !showIds.has(p.show_id)) add('error', 'people-show-ref', 'content/people.json', p.id, `show_id ${p.show_id} is not in shows.json.`);
    }
    const doli = people.early_and_guest_players?.find((p) => p.id === 'doli-stepniewski');
    const show = shows.find((s) => s.id === doli?.show_id);
    if (doli && !(show && /nonetheless/i.test(show.venue) && /release/i.test(show.venue))) add('error', 'nonetheless-release-show', 'content/people.json', 'doli-stepniewski', 'Must point at the Nonetheless CD release show row.');
  }
  // Every published record carries a source and a confidence; none is unverified.
  for (const [name, data] of Object.entries(json)) {
    for (const [key, arr] of Object.entries(data)) {
      if (!Array.isArray(arr) || key === 'held') continue;
      arr.forEach((r, k) => {
        if (!r || typeof r !== 'object' || r.publish === false) return;
        if (!r.source || !r.confidence) add('error', 'record-source', `content/${name}`, `${key}[${k}] ${r.id ?? ''}`, 'Published records need source and confidence.');
        if (/^unverified/i.test(r.confidence ?? '')) add('error', 'record-unverified', `content/${name}`, `${key}[${k}] ${r.id ?? ''}`, 'Unverified facts never publish.');
      });
    }
  }
  return issues;
}

// --dist: the LL-6 one-liner byte for byte (critique build-copy round 3, S1). The text rules above
// compare after norm() folds quote glyphs, so a curled ‘Luxury Liner’ would pass them. Here every
// occurrence in a built file, with HTML entities decoded and nothing else changed, must be the
// exact approved string, straight quotes included.
export function oneLinerRawHits(src) {
  const t = decodeEntities(src);
  const out = [];
  const lead = 'The Luxury Liners are a ';
  for (const m of t.matchAll(/power-pop band co-founded/gi)) {
    const s0 = m.index - lead.length;
    if (s0 < 0 || t.slice(s0, s0 + ONE_LINER.length) !== ONE_LINER) out.push(t.slice(Math.max(0, s0), m.index + 160).replace(/\s+/g, ' '));
  }
  return out;
}

// --dist: a visible sentence that names Discogs (or Wayback, Flickr) outside a link is a sourcing
// note ("Discogs lists…", "Writers as Discogs credits them"), an error in a built page (audit-copy
// round 1, B1/B2). A link's own text ("Overbored on Discogs") and a one-word label are fine.
export function sourceSentenceHits(html) {
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, ' ');
  const blocks = stripTags(body.replace(/<\/(?:p|li|h[1-6]|td|th|dd|dt|figcaption|caption|div|section|article|header|footer|nav|tr)>|<br\s*\/?>/gi, '\n\n')).split(/\n\s*\n/);
  const out = [];
  for (const b of blocks) {
    const t = decodeEntities(b).replace(/\s+/g, ' ').trim();
    if (!/\b(?:Discogs|Wayback|Flickr)\b/i.test(t)) continue;
    for (const sentence of t.split(/(?<=[.!?])\s+/)) if (/\b(?:Discogs|Wayback|Flickr)\b/i.test(sentence) && sentence.split(' ').length >= 4) out.push(sentence);
  }
  return out;
}

function checkDist(dir) {
  const issues = [];
  for (const p of listFiles(dir, ['.html', '.json', '.jsonld', '.txt', '.xml', '.js', '.mjs', '.webmanifest'])) {
    const rel = relative(process.cwd(), p);
    const src = readFileSync(p, 'utf8');
    const ext = extname(p).toLowerCase();
    let segs;
    if (ext === '.html') segs = htmlSegments(rel, src);
    else if (ext === '.js' || ext === '.mjs') segs = [{ file: rel, loc: 'file', raw: src, scope: 'internal', quote: false }]; // privacy rules only
    else segs = [{ file: rel, loc: 'file', raw: src, scope: 'public', quote: false }];
    // privacy rules also run on the raw file (hrefs, mailto:, data attributes)
    segs.push({ file: rel, loc: 'raw', raw: decodeEntities(src), scope: 'internal', quote: false });
    for (const s of segs) issues.push(...applyRules(s));
    if (ext === '.html') for (const hit of sourceSentenceHits(src)) issues.push({ level: 'error', rule: 'source-sentence', file: rel, loc: 'text', msg: 'A visible sentence names a source (Discogs, Wayback, Flickr) outside a link: a sourcing note (content/CHECK.md).', text: hit.slice(0, 200) });
    for (const hit of oneLinerRawHits(src)) issues.push({ level: 'error', rule: 'one-liner-bytes', file: rel, loc: 'raw', msg: 'The LL-6 one-liner must appear byte for byte (straight quotes, no other glyphs) in the built site.', text: hit.slice(0, 200) });
  }
  return issues;
}

// --repo: the repository is public, so no tracked file may hold a private literal (hashed match,
// content/private-literals.mjs). Each line is also read with regex escapes removed, so a literal
// written as a pattern (a word-boundary escape before it) is caught too.
// REPO_EXCEPTIONS: files the owner has to decide on. Only the owner edits the decisions file; its
// LL-4 founding story and LL-31 contact address are in public history already, and the owner must
// choose (accept, approve a history purge, or make the repository private) and reword (site/BUILD-LOG.md,
// "Owner decisions needed"). Nothing else may be added here without an owner decision.
export const REPO_EXCEPTIONS = new Set(['DECISIONS-2026-10-07.md']);
const BINARY = /\.(png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|pdf|mp3|zip|gz|psd|tiff?|bmp|eps|ai)$/i;
export function repoHits(rel, text, hashes = privateHashes, key = privateKey) {
  const out = [];
  const lines = text.split('\n');
  const unescaped = text.replace(/\\[a-zA-Z]/g, ' ').replace(/\\(.)/g, '$1');
  const seen = new Set();
  for (const src of [text, unescaped]) for (const { line, labels } of privateLines(src, hashes, key)) {
    if (seen.has(line)) continue;
    seen.add(line);
    out.push({ level: 'error', rule: 'private-literal-repo', file: rel, loc: `line ${line}`, msg: `A private literal is in a tracked file of this public repository: ${labels.join('; ')}.`, text: `line ${line}` });
  }
  return out;
}
function checkRepo(root) {
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, maxBuffer: 64 * 1024 * 1024 }).toString().split('\0').filter(Boolean);
  const issues = [];
  for (const rel of files) {
    // a tracked photo must not carry the place it was taken (EXIF GPS): Decap uploads go straight
    // into this public repository (audit-security round 2, minor)
    if (/\.(jpe?g|png|webp)$/i.test(rel) && existsSync(join(root, rel)) && fileHasGps(join(root, rel))) {
      issues.push({ level: 'error', rule: 'image-gps-repo', file: rel, loc: 'EXIF', msg: 'This image carries GPS position data (EXIF) in a tracked file of this public repository. Strip it before committing.', text: 'EXIF GPS' });
    }
    if (BINARY.test(rel) || REPO_EXCEPTIONS.has(rel)) continue;
    const p = join(root, rel);
    if (!existsSync(p)) continue;
    const buf = readFileSync(p);
    if (buf.subarray(0, 8000).includes(0)) continue;
    issues.push(...repoHits(rel, buf.toString('utf8')));
  }
  return issues;
}

function selfTest() {
  const cases = [
    ['talent-show', 'Chad’s college talent-show band'],
    ['demo-near-great-day', 'A demo of “Great Day” was on a 2008 disc.'],
    ['great-day-bonus-disc', 'the bonus disc'],
    ['broke-up', 'The band broke up in 2009.'],
    [null, 'The band never broke up. The four forever members reconnected during the pandemic and started making music again.'],
    ['ll17-exact', 'The four reconnected during COVID.'],
    ['reunion', 'The band got back together.'],
    ['former-member', 'former member Chad Edgington'],
    ['one-liner-exact', 'The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese.'],
    [null, ONE_LINER.replace(/'/g, '’')],
    ['ascii-year-apostrophe', "Rocking the '97 suit"],
    [null, 'Rocking the ’97 suit'],
    ['single-founder', 'Chad’s band'],
    ['believe-without-cher', 'a cover of “Believe”'],
    ['shake-it-up-cover', '“Shake It Up” is a cover'],
    ['private-literal', 'mail zz.private@example.test'],
    ['private-literal', 'see https://example.test/zzfamily.html'],
    ['private-literal', 'at Zzpriv Zzcollege'],
    ['email-address', 'theband@gmail.com'],
    ['phone-number', 'call 615-555-0100'],
    ['where-members-live', 'Scott now lives in Michigan'],
    ['life-outside-band', 'dads with careers'],
    ['downloads', 'Free download'],
    ['newsletter', 'Join our newsletter'],
    ['logo-designer', 'Logos designed by Glen'],
    ['sourcing-note', 'as credited on David’s 2010 discography page'],
    ['decision-tags', 'per LL-17'],
    ['unverified-items', 'one of Billboard’s Hot Prospects'],
    ['chad-april', 'Chad left in April 2001'],
    ['caption-2002', 'David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter, 2002 line'],
    ['nashville-based', 'a Nashville-based band'],
    ['ishee-years', 'Gary Ishee (2004–06)'],
    ['nonetheless-cover-credit', 'Scott painted the pictures for the cover of Nonetheless'],
    ['two-waco-sessions', 'In Waco that autumn they also recorded a live set at E-Cleff Studios'],
    ['four-states', 'scattered across four different states'],
    ['founded-in-nashville', 'founded in Nashville in 1997'],
  ];
  // Synthetic private tokens prove the hash matcher (unigram, dotted file name, address, word pair)
  // without writing any real private literal into this public file.
  privateKey = PRIVATE_KEY ?? 'zz-self-test-key';
  privateHashes = new Map([...PRIVATE_HASHES, ...['zz.private@example.test', 'zzfamily.html', 'zzpriv zzcollege'].map((t) => [digest(t, privateKey), 'synthetic'])]);
  let fail = 0;
  if (![...PRIVATE_HASHES.keys()].every((h) => /^[0-9a-f]{64}$/.test(h))) { fail++; console.log('FAIL private hash list malformed'); }
  for (const [expect, text] of cases) {
    const got = applyRules({ file: 'self-test', loc: '', raw: text, scope: 'public', quote: false }).filter((i) => i.level === 'error').map((i) => i.rule);
    const ok = expect ? got.includes(expect) : got.length === 0;
    if (!ok) { fail++; console.log(`FAIL expected ${expect ?? 'no error'}: ${JSON.stringify(text)} -> ${got.join(', ') || 'none'}`); }
  }
  // quote exemption: a dated quotation may say "former member"; talent show stays banned in quotes
  const q1 = applyRules({ file: 'self-test', loc: '', raw: 'the band visited former member X', scope: 'public', quote: true });
  const q2 = applyRules({ file: 'self-test', loc: '', raw: 'won the talent show', scope: 'public', quote: true });
  if (q1.length) { fail++; console.log('FAIL quote exemption'); }
  if (!q2.some((i) => i.rule === 'talent-show')) { fail++; console.log('FAIL talent show in quote'); }
  // internal notes: privacy applies, phrase rules do not
  const i1 = applyRules({ file: 'self-test', loc: '', raw: 'LL-13: no talent-show story', scope: 'internal', quote: false });
  const i2 = applyRules({ file: 'self-test', loc: '', raw: 'see zz.private@example.test', scope: 'internal', quote: false });
  if (i1.length) { fail++; console.log('FAIL internal phrase scope'); }
  if (!i2.length) { fail++; console.log('FAIL internal privacy scope'); }
  // HTML extraction: blockquote exemption and JSON-LD
  const h = htmlSegments('x.html', '<p>Hi</p><blockquote>former member Chad</blockquote><script type="application/ld+json">{"description":"a Nashville-based band"}</script>');
  const hi = h.flatMap(applyRules).map((i) => i.rule);
  if (hi.includes('former-member') || !hi.includes('nashville-based')) { fail++; console.log('FAIL html extraction', hi); }
  // raw one-liner check (--dist): entities are fine, curled quotes or a changed word are not
  const enc = ONE_LINER.replace(/'/g, '&#39;');
  if (oneLinerRawHits(`<p>${enc}</p><meta content="${ONE_LINER.replace(/'/g, '&#x27;')}">`).length) { fail++; console.log('FAIL one-liner-bytes: exact text with entities flagged'); }
  if (!oneLinerRawHits(`<p>${ONE_LINER.replace(/'/g, '’')}</p>`).length) { fail++; console.log('FAIL one-liner-bytes: curled quotes not caught'); }
  if (!oneLinerRawHits('The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese.').length) { fail++; console.log('FAIL one-liner-bytes: shortened text not caught'); }
  // --repo: a literal written plainly, or as a regex with word-boundary escapes, is caught
  if (!repoHits('x.md', 'see zzfamily.html here').length) { fail++; console.log('FAIL repo: plain literal'); }
  if (!repoHits('x.mjs', "/\\bzzfamily\\.html\\b/").length) { fail++; console.log('FAIL repo: escaped literal'); }
  if (repoHits('x.md', 'nothing private here').length) { fail++; console.log('FAIL repo: clean text flagged'); }
  // --repo: a JPEG whose EXIF has a GPS directory is caught; one without is not
  const exifJpeg = (gpsEntries) => {
    const tiff = Buffer.alloc(8 + 2 + 12 + 4 + 2 + 12 * gpsEntries + 4);
    tiff.write('II', 0, 'latin1'); tiff.writeUInt16LE(42, 2); tiff.writeUInt32LE(8, 4);
    tiff.writeUInt16LE(1, 8); tiff.writeUInt16LE(0x8825, 10); tiff.writeUInt16LE(4, 12); tiff.writeUInt32LE(1, 14); tiff.writeUInt32LE(26, 18);
    tiff.writeUInt16LE(gpsEntries, 26);
    for (let k = 0; k < gpsEntries; k++) tiff.writeUInt16LE(k + 1, 28 + 12 * k);
    const app1 = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), tiff]);
    const head = Buffer.from([0xff, 0xd8, 0xff, 0xe1, (app1.length + 2) >> 8, (app1.length + 2) & 255]);
    return Buffer.concat([head, app1, Buffer.from([0xff, 0xda, 0, 2])]);
  };
  if (!bufferHasGps(exifJpeg(2))) { fail++; console.log('FAIL image-gps: GPS not caught'); }
  if (bufferHasGps(exifJpeg(0))) { fail++; console.log('FAIL image-gps: empty GPS directory flagged'); }
  // --dist source sentences: a sentence naming Discogs is caught; a link or a one-word label is not
  if (!sourceSentenceHits('<p>Discogs lists the pressing as 100 copies.</p>').length) { fail++; console.log('FAIL source-sentence: not caught'); }
  if (!sourceSentenceHits('<p class="meta">Writers as Discogs credits them.</p>').length) { fail++; console.log('FAIL source-sentence: writers note not caught'); }
  if (sourceSentenceHits('<dl><dt>Discogs</dt><dd><a href="https://www.discogs.com/x">Overbored on Discogs</a></dd></dl>').length) { fail++; console.log('FAIL source-sentence: link flagged'); }
  console.log(fail ? `self-test: ${fail} failure(s)` : `self-test: all ${cases.length + 17} checks passed`);
  return fail;
}

// ---------- CLI ----------
const args = process.argv.slice(2);
if (args.includes('--self-test')) process.exit(selfTest() ? 1 : 0);
const distIdx = args.findIndex((a) => a === '--dist' || a === '--dist-only');
const distDir = distIdx >= 0 ? args[distIdx + 1] : null;
let issues = [];
if (args.includes('--repo')) issues.push(...checkRepo(join(HERE, '..')));
else if (!args.includes('--dist-only')) issues.push(...checkContent(HERE));
if (distDir) {
  if (!existsSync(distDir)) { console.error(`No such directory: ${distDir}`); process.exit(2); }
  issues.push(...checkDist(distDir));
}
// de-duplicate (raw + extracted passes can report the same hit)
const seen = new Set();
issues = issues.filter((i) => { const k = `${i.rule}|${i.file}|${i.text}|${i.msg}`; if (seen.has(k)) return false; seen.add(k); return true; });
const errors = issues.filter((i) => i.level === 'error');
if (args.includes('--json')) console.log(JSON.stringify({ errors: errors.length, warnings: issues.length - errors.length, issues }, null, 2));
else {
  for (const i of issues) console.log(`${i.level.toUpperCase()} [${i.rule}] ${i.file} ${i.loc}: ${i.msg}${i.text ? `\n    > ${i.text}` : ''}`);
  console.log(`\n${errors.length} error(s), ${issues.length - errors.length} warning(s)`);
}
process.exit(errors.length ? 1 : 0);
