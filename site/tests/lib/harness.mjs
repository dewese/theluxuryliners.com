// Shared harness for the browser suite: serves dist/ over http, finds the preinstalled Chromium
// (never `playwright install`; CHROMIUM=/path overrides), and lists the built pages.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const dist = join(site, 'dist');

export function findChromium() {
  if (process.env.CHROMIUM) return process.env.CHROMIUM;
  const known = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  if (existsSync(known)) return known;
  const roots = existsSync('/opt/pw-browsers') ? readdirSync('/opt/pw-browsers').filter((d) => /^chromium-\d+$/.test(d)).map((d) => `/opt/pw-browsers/${d}`) : [];
  for (const base of roots) for (const rel of ['chrome-linux64/chrome', 'chrome-linux/chrome']) if (existsSync(join(base, rel))) return join(base, rel);
  throw new Error('No Chromium found under /opt/pw-browsers; set CHROMIUM=/path/to/chrome');
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };

export async function serve() {
  if (!existsSync(join(dist, 'index.html'))) { console.error('dist/ not built: run `npm run build` first'); process.exit(1); }
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    let path;
    try { path = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }
    let p = join(dist, path);
    if (!p.startsWith(dist)) { res.writeHead(403).end(); return; }
    try {
      if ((await stat(p)).isDirectory()) p = join(p, 'index.html');
      const body = await readFile(p);
      res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' }).end(body);
    } catch {
      // dist/ may be mid-rebuild (another build running): answer, never crash the suite
      // (audit-qa round 1, S6); a missing 404 page shows as a failing check with this message
      const body = await readFile(join(dist, '404.html')).catch(() => 'dist/404.html is missing: is dist/ being rebuilt? Run the suite again after `npm run build`.');
      res.writeHead(404, { 'content-type': 'text/html' }).end(body);
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { base: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}

export const launch = () => chromium.launch({ executablePath: findChromium(), args: ['--no-sandbox'] });

/** Every built page as a URL path, plus /404.html. The Decap editor shell (/admin/) is not a site page. */
export function allPages(dir = dist, prefix = '/') {
  const out = readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() && !d.name.startsWith('_') && !(prefix === '/' && d.name === 'admin') ? allPages(join(dir, d.name), `${prefix}${d.name}/`) : d.name === 'index.html' ? [prefix] : []);
  return prefix === '/' ? [...out, '/404.html'] : out;
}
