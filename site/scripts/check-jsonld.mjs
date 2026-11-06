// JSON-LD on every built page (plan §7.4 item 3, §8.2): valid JSON, a schema.org @context, no
// null or empty values, no e-mail address. The MusicGroup: founded 1997 in Texas (LL-5), the two
// founders (F4), the four forever members with no end date (LL-9), the one-liner as its
// description (LL-6), sameAs only from the allow-list (plan §8.3). Every MusicAlbum: numTracks
// equals its track list, a real datePublished, byArtist the band. FAQPage: every question and
// answer is visible on the page.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(site, 'dist');
if (!existsSync(join(dist, 'index.html'))) { console.error('check-jsonld: dist/ not built'); process.exit(1); }
const pages = [];
const walk = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) pages.push(p); });
walk(dist);
const SKIP = new Set(['admin/index.html']); // the Decap editor shell (noindex)

const SAME_AS = new Set([
  'https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc', 'https://music.apple.com/us/artist/the-luxury-liners/47333263',
  'https://www.youtube.com/channel/UCi2Kheqfw714F4v8bwBbViA', 'https://www.instagram.com/theluxuryliners/', 'https://www.facebook.com/theluxuryliners/',
  'https://musicbrainz.org/artist/7af7fd54-1d1b-4353-ab60-4b61bceed337', 'https://www.discogs.com/artist/4298743-The-Luxury-Liners',
  'https://www.deezer.com/artist/1518436', 'https://tidal.com/browse/artist/5748092',
  // later, once they exist or are checked (plan §8.3): Wikidata, AllMusic, Last.fm
]);
const ONE_LINER = "The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together. The name comes from the Gram Parsons song 'Luxury Liner'.";
const FOREVER = ['David Dewese', 'Chad Edgington', 'Scott Carpenter', 'David Wilstermann'];
const visible = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<\/?(?:em|strong|i|b|a|span|cite|time|q)\b[^>]*>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ');

const errors = [];
let groups = 0, albums = 0, faqs = 0;
const nodesOf = (ld) => (ld['@graph'] ?? [ld]);
function walkValues(v, path, rel) {
  if (v === null || v === undefined || v === '') errors.push(`${rel}: empty value at ${path}`);
  else if (Array.isArray(v)) { if (!v.length) errors.push(`${rel}: empty array at ${path}`); v.forEach((x, i) => walkValues(x, `${path}[${i}]`, rel)); }
  else if (typeof v === 'object') for (const [k, x] of Object.entries(v)) walkValues(x, `${path}.${k}`, rel);
  else if (typeof v === 'string' && /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/.test(v)) errors.push(`${rel}: e-mail address at ${path}`);
}
for (const f of pages) {
  const rel = relative(dist, f);
  if (SKIP.has(rel)) continue;
  const html = readFileSync(f, 'utf8');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) { errors.push(`${rel}: no JSON-LD`); continue; }
  for (const [, body] of blocks) {
    let ld;
    try { ld = JSON.parse(body); } catch (e) { errors.push(`${rel}: invalid JSON-LD (${e.message})`); continue; }
    if (ld['@context'] !== 'https://schema.org') errors.push(`${rel}: @context is not https://schema.org`);
    walkValues(ld, '$', rel);
    for (const n of nodesOf(ld)) {
      if (n['@type'] === 'MusicGroup') {
        groups++;
        if (n['@id'] !== 'https://theluxuryliners.com/#band') errors.push(`${rel}: MusicGroup @id`);
        if (n.foundingDate !== '1997') errors.push(`${rel}: foundingDate must be 1997`);
        if (n.foundingLocation?.name !== 'Texas') errors.push(`${rel}: foundingLocation must be Texas (LL-5)`);
        const founders = (n.founder ?? []).map((p) => p.name).sort().join('|');
        if (founders !== 'Chad Edgington|David Dewese') errors.push(`${rel}: founders must be David Dewese and Chad Edgington (got ${founders})`);
        const members = (n.member ?? []).map((m) => m.member?.name);
        if (members.length !== 4 || FOREVER.some((x) => !members.includes(x))) errors.push(`${rel}: members must be the four forever members (got ${members.join(', ')})`);
        if ((n.member ?? []).some((m) => m.endDate)) errors.push(`${rel}: a forever member has an endDate (LL-9)`);
        if (n.description !== ONE_LINER) errors.push(`${rel}: description is not the one-liner word for word`);
        for (const u of n.sameAs ?? []) if (!SAME_AS.has(u)) errors.push(`${rel}: sameAs not in the allow-list: ${u}`);
        if ((n.sameAs ?? []).some((u) => /bandcamp/.test(u))) errors.push(`${rel}: Bandcamp is David's account, never the band's sameAs`);
      }
      if (n['@type'] === 'MusicAlbum') {
        albums++;
        if (n.numTracks !== (n.track ?? []).length) errors.push(`${rel}: numTracks ${n.numTracks} but ${(n.track ?? []).length} tracks`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(n.datePublished ?? '')) errors.push(`${rel}: datePublished`);
        if (n.byArtist?.['@id'] !== 'https://theluxuryliners.com/#band') errors.push(`${rel}: byArtist must be the band`);
        if (!/^https:\/\/theluxuryliners\.com\/music\/[a-z0-9-]+\/#album$/.test(n['@id'] ?? '')) errors.push(`${rel}: album @id`);
      }
      if (n['@type'] === 'FAQPage') {
        faqs++;
        const text = visible(html);
        for (const q of n.mainEntity ?? []) {
          if (!text.includes(q.name)) errors.push(`${rel}: FAQ question not visible: ${q.name}`);
          const a = q.acceptedAnswer?.text ?? '';
          if (!text.includes(a.replace(/\s+/g, ' ').trim())) errors.push(`${rel}: FAQ answer not visible: ${a.slice(0, 60)}…`);
        }
      }
    }
  }
}
if (!groups) errors.push('no page carries the full MusicGroup');
if (!readFileSync(join(dist, 'index.html'), 'utf8').includes('"@type":"MusicGroup"')) errors.push('index.html: the home page must carry the full MusicGroup');
if (errors.length) { console.log(`check-jsonld: FAIL (${errors.length})\n  ${errors.slice(0, 40).join('\n  ')}`); process.exit(1); }
console.log(`check-jsonld: PASS (${pages.length} pages; ${groups} MusicGroup, ${albums} MusicAlbum, ${faqs} FAQPage)`);
