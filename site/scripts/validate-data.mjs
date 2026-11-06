// The data gate (runs before every build and as the `data` test suite). Fails with a plain
// message when a data file would put something wrong on the site:
//  - data/releases.json (the master, LL-3): every release with a page exists, has a real date,
//    a tracklist and https links; the 2008 bonus disc never links out (LL-13)
//  - site/data/*.json: every record has status publish|pending; photos exist on disk and a
//    photographer whose credit is pending is never published; artwork names a release with a
//    page; facts marked publish are confirmed-owner or verified-source, or attributed in the
//    sentence; shows have a date the page can sort; nothing anywhere holds an e-mail address
//  - data/legacy-urls.json is readable
// Usage: node scripts/validate-data.mjs [--quiet]
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(site, '..');
const quiet = process.argv.includes('--quiet');
const errors = [];
const fail = (m) => errors.push(m);
const read = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch (e) { fail(`${p}: ${e.message}`); return null; } };
const realDate = (s) => /^\d{4}(-\d{2}(-\d{2})?)?$/.test(s) && !Number.isNaN(Date.parse(s.length === 4 ? `${s}-01-01` : s.length === 7 ? `${s}-01` : s)) && (s.length < 10 || new Date(s).toISOString().slice(0, 10) === s);

// ---- the master release data ----
const PAGES = {
  'luxury-liners-2000-sound-as-ever': 'sound-as-ever', 'luxury-liners-2001-believe-ep': 'believe-ep', 'luxury-liners-2003-overbored': 'overbored',
  'luxury-liners-2006-nonetheless': 'nonetheless', 'luxury-liners-2021-shake-it-up-live': 'shake-it-up-live', 'luxury-liners-2026-great-day': 'great-day', 'luxury-liners-2026-new-beginning': 'new-beginning',
};
const releases = read(join(root, 'data', 'releases.json')) ?? [];
const ids = new Set();
for (const r of releases) {
  if (ids.has(r.id)) fail(`releases.json: duplicate id ${r.id}`);
  ids.add(r.id);
  if (!r.release_date || !realDate(r.release_date)) fail(`releases.json ${r.id}: release_date "${r.release_date}" is not a real date`);
  for (const [k, v] of Object.entries(r.links ?? {})) if (v !== null && !/^https:\/\//.test(v)) fail(`releases.json ${r.id}: links.${k} is not an https URL`);
}
for (const [id, slug] of Object.entries(PAGES)) {
  const r = releases.find((x) => x.id === id);
  if (!r) { fail(`releases.json: no release ${id} (page /music/${slug}/)`); continue; }
  if (!(r.tracklist ?? []).length) fail(`releases.json ${id}: no tracklist`);
  if (!Object.values(r.links ?? {}).some(Boolean)) fail(`releases.json ${id}: no listen links`);
}
for (const id of ['luxury-liners-2026-sound-as-ever-lp', 'll-appearance-2008-make-the-best-of-it-bonus-disc']) if (!ids.has(id)) fail(`releases.json: no ${id}`);

// ---- site data ----
const slugs = new Set(Object.values(PAGES));
const status = (file, xs) => xs.forEach((x, i) => { if (!['publish', 'pending'].includes(x.status)) fail(`${file}[${i}]: status must be "publish" or "pending"`); });
const D = (n) => read(join(site, 'data', n));
const people = D('people.json'), photos = D('photos.json'), artwork = D('artwork.json'), press = D('press.json'), shows = D('shows.json'), facts = D('facts.json'), vault = D('vault.json'), story = D('story.json');
const PENDING_CREDITS = []; // keep in step with src/lib/content.ts (LL-45 cleared Amy Wilstermann, 2026-11-06)
if (people) { status('people.forever', people.forever); status('people.early', people.early); status('people.records', people.records);
  if (people.forever.filter((p) => p.status === 'publish').length !== 4) fail('people.json: the four forever members must all be published (LL-9)');
  for (const r of people.records) if (!slugs.has(r.release)) fail(`people.json records: ${r.name}: release "${r.release}" has no page`); }
if (photos) { status('photos', photos.photos);
  const seen = new Set();
  for (const p of photos.photos) {
    if (seen.has(p.id)) fail(`photos.json: duplicate id ${p.id}`); seen.add(p.id);
    if (!existsSync(join(root, p.src))) fail(`photos.json ${p.id}: file ${p.src} not found`);
    if (!p.alt || !p.caption) fail(`photos.json ${p.id}: needs a caption and alt text`);
    if (p.status === 'publish' && PENDING_CREDITS.includes(p.credit)) fail(`photos.json ${p.id}: the ${p.credit} credit is still pending; the photo cannot be published`);
    if (p.cutout && !existsSync(join(site, 'public', p.cutout))) fail(`photos.json ${p.id}: cut-out ${p.cutout} not found in public/`);
    if (p.status === 'publish' && !/^(?:19|20)\d\d$/.test(p.year ?? '')) fail(`photos.json ${p.id}: needs a four-digit year (photographer years on /people/ come from it)`);
    if (/line-up/i.test(p.caption)) fail(`photos.json ${p.id}: never caption a photo as a line-up`);
    if (p.src.endsWith('luxury-liners-2002.jpg') && p.caption !== 'David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002') fail('photos.json: the 2002 photo caption must be exactly the approved text (P23)');
  } }
if (artwork) { status('artwork', artwork.credits); for (const a of artwork.credits) if (!slugs.has(a.release)) fail(`artwork.json: release "${a.release}" has no page`); }
if (press) { status('press.items', press.items); status('press.placements', press.placements); }
if (shows) { status('shows', shows.shows); for (const s of shows.shows) {
  if (!realDate(s.date)) fail(`shows.json: "${s.when}": date "${s.date}" is not YYYY, YYYY-MM or YYYY-MM-DD`);
  if (s.sort && !realDate(s.sort)) fail(`shows.json: "${s.when}": sort "${s.sort}" is not a date`);
  if (!s.city) fail(`shows.json: "${s.when}": needs a city`);
  if (s.release && !slugs.has(s.release)) fail(`shows.json: "${s.when}": release "${s.release}" has no page`);
  if (s.photo && !photos?.photos.some((p) => p.id === s.photo && p.status === 'publish')) fail(`shows.json: "${s.when}": photo "${s.photo}" is not a published photo`); } }
if (facts) { status('facts', facts.facts); for (const f of facts.facts) if (f.status === 'publish' && !['confirmed-owner', 'verified-source'].includes(f.confidence) && !(f.confidence === 'single-source' && f.attributed)) fail(`facts.json: "${f.q}" is ${f.confidence} and cannot be published${f.confidence === 'single-source' ? ' unless the answer attributes it (attributed: true)' : ''}`); }
if (vault) { status('vault.coverSongs', vault.coverSongs.songs);
  for (const s of vault.oldMp3s.songs) { if (s.appearance && !ids.has(s.appearance)) fail(`vault.json oldMp3s: "${s.title}": appearance "${s.appearance}" is not in releases.json`); if (s.release && !slugs.has(s.release)) fail(`vault.json oldMp3s: "${s.title}": release "${s.release}" has no page`); if (/great day|new beginning/i.test(s.title)) fail('vault.json oldMp3s: "Great Day" and "New Beginning" stay off the old-MP3 list (LL-13)'); } }
if (story) for (const c of story.chapters) if (c.photo && !photos?.photos.some((p) => p.id === c.photo && p.status === 'publish')) fail(`story.json ${c.id}: photo "${c.photo}" is not a published photo`);

// ---- nothing in site/data holds an e-mail address or a mailto: link ----
for (const f of readdirSync(join(site, 'data')).filter((f) => f.endsWith('.json'))) {
  const t = readFileSync(join(site, 'data', f), 'utf8');
  if (/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/.test(t) || /mailto:/i.test(t)) fail(`site/data/${f}: holds an e-mail address`);
}
const legacy = read(join(root, 'data', 'legacy-urls.json'));
if (legacy && legacy.urls?.length !== 675) fail(`legacy-urls.json: expected 675 rows, found ${legacy?.urls?.length}`);

if (errors.length) { console.error(`validate-data: FAIL (${errors.length})\n  ${errors.join('\n  ')}`); process.exit(1); }
if (!quiet) console.log(`validate-data: PASS (${releases.length} releases, ${photos?.photos.length} photos, ${shows?.shows.length} shows, ${press?.items.length} press items, ${facts?.facts.length} facts)`);
