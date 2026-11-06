// LL-3 (stub): data/releases.json here is the master for the band's releases; daviddewese.com
// copies them, and a check on both sites fails if the shared fields differ. This test compares
// the two files when the daviddewese.com copy is on this machine (DD_RELEASES=/path overrides);
// in CI without it, the test is skipped. Once both repositories are on GitHub, CI fetches the
// other site's file instead (docs/HANDBOOK.md, "The release data").
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { compareReleases, MASTER, DD_DEFAULT } from '../../scripts/compare-releases.mjs';

test('LL-3: the daviddewese.com copy of the band\'s releases matches the master', { skip: !existsSync(DD_DEFAULT) && `no daviddewese.com copy at ${DD_DEFAULT}` }, () => {
  const diffs = compareReleases(JSON.parse(readFileSync(MASTER, 'utf8')), JSON.parse(readFileSync(DD_DEFAULT, 'utf8')));
  assert.deepEqual(diffs, [], `shared fields differ:\n${diffs.join('\n')}`);
});

test('LL-3: the comparison catches a changed date, ISRC or missing release', () => {
  const master = JSON.parse(readFileSync(MASTER, 'utf8'));
  const copy = structuredClone(master).filter((r) => r.release_role === 'primary');
  assert.deepEqual(compareReleases(master, copy), []);
  copy[0].release_date = '1999-01-01';
  copy[1].tracklist[0].isrc = 'XX';
  copy.pop();
  const diffs = compareReleases(master, copy);
  assert.equal(diffs.length, 3, diffs.join('\n'));
});
