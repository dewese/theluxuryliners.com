// Legacy URLs (plan §7.2; data/legacy-urls.json, 675 rows): every archived URL of the band's
// old websites gets a deliberate answer on the new site. Runs AFTER `astro build`, because every
// internal target must exist in dist/:
//   dist/_redirects     301 rows (Cloudflare static redirects), exact paths, no chains
//   worker/gone.ts      the 410 list and the query-string redirects (the Worker answers those:
//                       _redirects cannot match a query string)
// Rules (BUILD-LOG, "Legacy URLs"):
//   301 / rehost-same-path      -> 301 to suggested_target. LL-27: nothing is re-hosted, so the
//                                  old MP3 and press-file URLs redirect too. A target the v1.0
//                                  site does not have (/vault/news/, /lyrics/, a journal month…)
//                                  falls back to its nearest existing parent page, then '/'.
//   301-if-query-capable        -> the Worker (by the 'content' or em1884/em1886 parameter)
//   rehost-or-none              -> 410 (no old images are re-hosted)
//   none                        -> 410 for old site files (images, CSS, scripts, newsletter and
//                                  private images); left alone (404) for bot and plugin probes,
//                                  /.well-known/ and Cloudflare's /cdn-cgi/
//   keep / serve                -> must exist (or, for /sitemap.xml, 301 to the sitemap index)
// Usage: node scripts/build-redirects.mjs           write the files
//        node scripts/build-redirects.mjs --check   verify dist/_redirects and worker/gone.ts
//                                                   match the data and every target exists
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(site, 'dist');
const rows = JSON.parse(readFileSync(join(site, '..', 'data', 'legacy-urls.json'), 'utf8')).urls;
if (!existsSync(join(dist, 'index.html'))) { console.error('build-redirects: dist/ not built (run astro build first)'); process.exit(1); }

/** Does the built site answer 200 for this path? */
export function existsInDist(p) {
  const clean = decodeURIComponent(p.split('#')[0].split('?')[0]);
  const f = join(dist, clean);
  if (!f.startsWith(dist)) return false;
  if (clean.endsWith('/')) return existsSync(join(f, 'index.html'));
  return existsSync(f) && statSync(f).isFile();
}
/** The nearest existing page for a target: itself, else its parents, else '/'. */
// Targets the v1.0 site does not have, with a better home than their parent page.
const NEAREST = { '/lyrics/': '/music/overbored/' }; // the old lyrics page held the Overbored lyrics
function resolve(target) {
  if (/^https?:\/\//.test(target)) return target;
  if (existsInDist(target)) return target;
  if (NEAREST[target] && existsInDist(NEAREST[target])) return NEAREST[target];
  const parts = target.replace(/\/$/, '').split('/');
  while (parts.length > 1) { parts.pop(); const t = parts.join('/') + '/'; if (existsInDist(t)) return t; }
  return '/';
}
const pathOnly = (p) => p.split('?')[0] || '/';
const LEAVE_404 = new Set(['bot-probe', 'plugin-probe', 'host-internal']);

const redirects = new Map(); // source -> { to, from: original target }
const gone = new Set();
const query = {}; // key -> target
const fallbacks = [];
const problems = [];

for (const r of rows) {
  const src = pathOnly(r.path);
  switch (r.action) {
    case 'keep':
      if (!existsInDist(src) && src !== '/index.html') problems.push(`keep ${src}: not in dist`);
      break;
    case 'serve':
      if (src === '/sitemap.xml') { if (!existsInDist('/sitemap-index.xml')) problems.push('sitemap-index.xml missing'); redirects.set(src, { to: '/sitemap-index.xml', from: '/sitemap.xml' }); }
      else if (!existsInDist(src)) problems.push(`serve ${src}: not in dist`);
      break;
    case '301':
    case 'rehost-same-path': {
      if (src === '/' || existsInDist(src)) break; // never redirect a live page
      const to = resolve(r.suggested_target);
      if (to !== r.suggested_target) fallbacks.push(`${r.suggested_target} -> ${to}`);
      redirects.set(src, { to, from: r.suggested_target });
      break;
    }
    case '301-if-query-capable': {
      const q = new URLSearchParams(r.path.split('?')[1] ?? '');
      const key = q.get('content') ? `content=${q.get('content')}` : q.has('em1884') ? 'em1884' : q.has('em1886') ? 'em1886' : null;
      if (!key) { problems.push(`query row without a known parameter: ${r.path}`); break; }
      const to = resolve(r.suggested_target);
      if (to !== r.suggested_target) fallbacks.push(`${r.suggested_target} -> ${to}`);
      if (query[key] && query[key] !== to) problems.push(`query ${key}: two targets (${query[key]}, ${to})`);
      query[key] = to;
      break;
    }
    case 'rehost-or-none':
      gone.add(src);
      break;
    case 'none':
      if (!LEAVE_404.has(r.category) && !src.startsWith('/cdn-cgi/') && !src.startsWith('/.well-known/')) gone.add(src);
      break;
    default:
      problems.push(`unknown action ${r.action} for ${r.path}`);
  }
}
// a source that is also gone is a redirect, not a 410
for (const s of redirects.keys()) gone.delete(s);
// no chains: no target is itself a redirect source or gone
for (const [s, { to }] of redirects) {
  if (redirects.has(to)) problems.push(`chain: ${s} -> ${to} -> ${redirects.get(to).to}`);
  if (gone.has(to)) problems.push(`redirect to a gone path: ${s} -> ${to}`);
  if (!/^https?:/.test(to) && !existsInDist(to)) problems.push(`target missing in dist: ${s} -> ${to}`);
  if (/\s/.test(s)) problems.push(`source with whitespace: ${s}`);
}
for (const to of Object.values(query)) if (!existsInDist(to)) problems.push(`query target missing: ${to}`);

const sorted = [...redirects].sort(([a], [b]) => a.localeCompare(b));
const redirectsFile = [
  '# Generated by scripts/build-redirects.mjs from data/legacy-urls.json. Do not edit by hand.',
  '# Old addresses of the band’s earlier websites, sent to their pages on this site (301).',
  ...sorted.map(([s, { to }]) => `${s} ${to} 301`),
  '',
].join('\n');
const goneFile = `// Generated by scripts/build-redirects.mjs from data/legacy-urls.json. Do not edit by hand.
// GONE: old files of the band's earlier websites that the Worker answers with 410 Gone.
// QUERY_REDIRECTS: the 2007–09 site's query-string addresses (/?content=bio …), by parameter.
export const GONE: string[] = ${JSON.stringify([...gone].sort(), null, 1)};
export const QUERY_REDIRECTS: Record<string, string> = ${JSON.stringify(Object.fromEntries(Object.entries(query).sort()), null, 1)};
`;

const outRedirects = join(dist, '_redirects');
const outGone = join(site, 'worker', 'gone.ts');
if (process.argv.includes('--check')) {
  if (!existsSync(outRedirects) || readFileSync(outRedirects, 'utf8') !== redirectsFile) problems.push('dist/_redirects is missing or out of date (run node scripts/build-redirects.mjs)');
  if (!existsSync(outGone) || readFileSync(outGone, 'utf8') !== goneFile) problems.push('worker/gone.ts is missing or out of date');
} else {
  writeFileSync(outRedirects, redirectsFile);
  writeFileSync(outGone, goneFile);
}
if (problems.length) { console.error(`build-redirects: FAIL\n  ${problems.join('\n  ')}`); process.exit(1); }
const uniqFallbacks = [...new Set(fallbacks)];
console.log(`build-redirects: ${redirects.size} redirects, ${gone.size} gone (410), ${Object.keys(query).length} query redirects; ${uniqFallbacks.length} targets fell back to a parent page${process.env.VERBOSE ? `:\n  ${uniqFallbacks.join('\n  ')}` : ''}${process.argv.includes('--check') ? ' (check)' : ''}`);
