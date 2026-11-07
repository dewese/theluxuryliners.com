// `npm test` builds the site, then runs every suite, each in its own process, with one summary at
// the end; exit 1 if any suite failed (a failing suite never hides the ones after it).
//   data     scripts/validate-data.mjs        the data gate (master releases + site/data)
//   unit     node --test tests/unit tests/dist pure helpers, the Worker, the LL-3 check, and the
//                                              built pages' content rules
//   dist     scripts/check-dist.mjs           copy, privacy and owner-decision rules over dist/
//            (+ content/check-content.mjs --dist-only, when the copy track's checker exists)
//   jsonld   scripts/check-jsonld.mjs         JSON-LD on every page
//   repo     content/check-content.mjs --repo  no tracked file of the public repository holds a
//                                              private literal (+ the checker's self-test)
//   axe      tests/browser/axe.mjs            axe-core (WCAG 2.2 A/AA) on every page, 1280 and 375 px
//            tests/browser/behaviour.mjs      contact errors, forced colours, word breaks, first screen
// `node tests/run.mjs unit axe` runs only the named suites. `RELEASE=1` makes `dist` strict.
// `--build` (what `npm test` passes) builds first.
// Isolation (copy audit round 3, S9): the run holds site/.build.lock (scripts/lock.mjs), so a
// second build or test run in this checkout waits instead of rebuilding dist/ underneath it; the
// suites read a snapshot of dist/ in a temporary directory (LL_DIST), never the live dist/; and the
// browser suite first checks that its modules resolve, naming any that are missing.
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, existsSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { acquire } from '../scripts/lock.mjs';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const doBuild = argv.includes('--build');
acquire(`node tests/run.mjs ${argv.join(' ')}`.trim());
if (doBuild) {
  console.log('\n=== build ===');
  const b = spawnSync('npm', ['run', 'build'], { cwd: site, stdio: 'inherit', env: process.env });
  if (b.status !== 0) { console.log('\n=== summary ===\nFAIL  build'); process.exit(1); }
}
const pick = argv.filter((a) => a !== '--build');
const NEEDS_DIST = ['unit', 'dist', 'jsonld', 'axe'];
let snapshot = join(site, 'dist');
if (!pick.length || pick.some((n) => NEEDS_DIST.includes(n))) {
  if (!existsSync(join(site, 'dist', 'index.html'))) { console.error('dist/ not built: run `npm run build` first (or `npm test`, which builds)'); process.exit(1); }
  const tmp = mkdtempSync(join(tmpdir(), 'll-dist-'));
  cpSync(join(site, 'dist'), tmp, { recursive: true });
  process.on('exit', () => rmSync(tmp, { recursive: true, force: true }));
  snapshot = process.env.LL_DIST = tmp;
}
/** The browser suite's modules, resolved from site/ (a reinstall in progress shows up here by name). */
const missingModules = () => {
  const req = createRequire(join(site, 'package.json'));
  return ['playwright-core', '@axe-core/playwright'].filter((m) => { try { req.resolve(m); return false; } catch { return true; } });
};
const tests = (dir) => readdirSync(join(site, dir)).filter((f) => f.endsWith('.test.mjs')).map((f) => `${dir}/${f}`);
const node = (args) => [process.execPath, ['--disable-warning=ExperimentalWarning', ...args]];
const contentChecker = join(site, '..', 'content', 'check-content.mjs');
const SUITES = {
  data: [node(['scripts/validate-data.mjs'])],
  unit: [node(['--test', ...tests('tests/unit'), ...tests('tests/dist')])],
  dist: [node(['scripts/check-dist.mjs']), ...(existsSync(contentChecker) ? [node([contentChecker, '--dist-only', snapshot])] : [])],
  jsonld: [node(['scripts/check-jsonld.mjs'])],
  repo: existsSync(contentChecker) ? [node([contentChecker, '--repo']), node([contentChecker, '--self-test'])] : [],
  axe: [node(['tests/browser/axe.mjs']), node(['tests/browser/behaviour.mjs'])],
};
const names = pick.length ? pick : Object.keys(SUITES);
const results = [];
for (const name of names) {
  if (!SUITES[name]) { console.error(`unknown suite ${name}`); process.exit(2); }
  const t0 = Date.now();
  console.log(`\n=== ${name} ===`);
  let ok = true;
  const missing = name === 'axe' ? missingModules() : [];
  if (missing.length) { ok = false; console.log(`FAIL the browser suite cannot start: missing module(s) ${missing.join(', ')} (run \`npm ci\` in site/, and wait for any other install to finish)`); }
  else for (const [cmd, args] of SUITES[name]) ok = spawnSync(cmd, args, { cwd: site, stdio: 'inherit', env: process.env }).status === 0 && ok;
  results.push({ name, ok, s: ((Date.now() - t0) / 1000).toFixed(0) });
}
console.log('\n=== summary ===');
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name.padEnd(7)} ${r.s}s`);
process.exit(results.every((r) => r.ok) ? 0 : 1);
