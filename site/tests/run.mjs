// `npm test` builds the site, then runs every suite, each in its own process, with one summary at
// the end; exit 1 if any suite failed (a failing suite never hides the ones after it).
//   data     scripts/validate-data.mjs        the data gate (master releases + site/data)
//   unit     node --test tests/unit tests/dist pure helpers, the Worker, the LL-3 check, and the
//                                              built pages' content rules
//   dist     scripts/check-dist.mjs           copy, privacy and owner-decision rules over dist/
//            (+ content/check-content.mjs --dist-only, when the copy track's checker exists)
//   jsonld   scripts/check-jsonld.mjs         JSON-LD on every page
//   axe      tests/browser/axe.mjs            axe-core (WCAG 2.2 A/AA) on every page, 1280 and 375 px
// `node tests/run.mjs unit axe` runs only the named suites. `RELEASE=1` makes `dist` strict.
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, existsSync } from 'node:fs';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const tests = (dir) => readdirSync(join(site, dir)).filter((f) => f.endsWith('.test.mjs')).map((f) => `${dir}/${f}`);
const node = (args) => [process.execPath, ['--disable-warning=ExperimentalWarning', ...args]];
const contentChecker = join(site, '..', 'content', 'check-content.mjs');
const SUITES = {
  data: [node(['scripts/validate-data.mjs'])],
  unit: [node(['--test', ...tests('tests/unit'), ...tests('tests/dist')])],
  dist: [node(['scripts/check-dist.mjs']), ...(existsSync(contentChecker) ? [node([contentChecker, '--dist-only', 'dist'])] : [])],
  jsonld: [node(['scripts/check-jsonld.mjs'])],
  axe: [node(['tests/browser/axe.mjs'])],
};
const pick = process.argv.slice(2);
const names = pick.length ? pick : Object.keys(SUITES);
const results = [];
for (const name of names) {
  if (!SUITES[name]) { console.error(`unknown suite ${name}`); process.exit(2); }
  const t0 = Date.now();
  console.log(`\n=== ${name} ===`);
  let ok = true;
  for (const [cmd, args] of SUITES[name]) ok = spawnSync(cmd, args, { cwd: site, stdio: 'inherit' }).status === 0 && ok;
  results.push({ name, ok, s: ((Date.now() - t0) / 1000).toFixed(0) });
}
console.log('\n=== summary ===');
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name.padEnd(7)} ${r.s}s`);
process.exit(results.every((r) => r.ok) ? 0 : 1);
