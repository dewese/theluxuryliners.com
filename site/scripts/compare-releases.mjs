// LL-3: this repository's data/releases.json is the master for The Luxury Liners' releases, and
// daviddewese.com copies the band's releases from it. compareReleases() lists every difference in
// the shared fields (plan §7.3): id, title, public date, label, catalog number, UPC, and per track
// the title, duration and ISRC. Used by tests/unit/ll3-sync.test.mjs; the same comparison runs on
// daviddewese.com. Usage: node scripts/compare-releases.mjs [path/to/daviddewese.com/data/releases.json]
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
export const MASTER = join(site, '..', 'data', 'releases.json');
export const DD_DEFAULT = process.env.DD_RELEASES ?? '/home/user/daviddewese.com/daviddewese-com/data/releases.json';

const SHARED = ['title', 'release_date', 'label', 'catalog_number', 'upc'];
const isBand = (r) => /luxury liners/i.test(String(r.artist ?? '')) && ['primary', undefined].includes(r.release_role) && r.release_role !== 'reissue';

export function compareReleases(master, copy) {
  const diffs = [];
  const mine = master.filter((r) => r.release_role === 'primary');
  const theirs = new Map(copy.filter(isBand).map((r) => [r.id, r]));
  for (const r of mine) {
    const t = theirs.get(r.id);
    if (!t) { diffs.push(`${r.id}: missing from the copy`); continue; }
    const val = (o, k) => o[k] ?? o.identifiers?.[k] ?? null;
    for (const k of SHARED) if (val(r, k) !== val(t, k)) diffs.push(`${r.id}: ${k} "${r[k]}" vs "${t[k]}"`);
    const a = r.tracklist ?? [], b = t.tracklist ?? [];
    if (a.length !== b.length) diffs.push(`${r.id}: ${a.length} tracks vs ${b.length}`);
    a.forEach((x, i) => {
      const y = b[i] ?? {};
      for (const k of ['title', 'duration', 'isrc']) if ((x[k] ?? null) !== (y[k] ?? null)) diffs.push(`${r.id} track ${i + 1}: ${k} "${x[k]}" vs "${y[k]}"`);
    });
    theirs.delete(r.id);
  }
  for (const id of theirs.keys()) diffs.push(`${id}: in the copy but not in the master`);
  return diffs;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const other = process.argv[2] ?? DD_DEFAULT;
  if (!existsSync(other)) { console.log(`compare-releases: ${other} not found; nothing to compare`); process.exit(0); }
  const diffs = compareReleases(JSON.parse(readFileSync(MASTER, 'utf8')), JSON.parse(readFileSync(other, 'utf8')));
  console.log(diffs.length ? `compare-releases: ${diffs.length} differences\n  ${diffs.join('\n  ')}` : 'compare-releases: the shared fields match');
  process.exit(diffs.length ? 1 : 0);
}
