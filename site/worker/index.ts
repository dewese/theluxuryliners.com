// The Worker (NOT DEPLOYED from this build; see docs/HANDBOOK.md, "Cloudflare"). It runs first
// for /api/* and for the home page (wrangler.jsonc run_worker_first), and for any request that
// matched no static file and no dist/_redirects row:
//   - POST /api/contact                 -> api/contact.ts (Turnstile, honeypot, limits, email)
//   - /?content=… (the 2007–09 site)    -> 301 to its new page; plain / goes to the static home
//   - an old file in gone.ts            -> 410 with the /410/ page
//   - anything else                     -> 404 with the /404 page
// Any other hostname (staging) gets noindex on every response and a Disallow-all robots.txt.
// Every response carries the security headers, staging included (audit-security round 1, S3), and
// an unexpected error gives a plain 500 page with them instead of Cloudflare's error 1101 (S2).
// Under /admin/ the editor's own CSP and COOP replace the site's (worker/headers.ts ADMIN_HEADERS),
// as dist/_headers does for static responses (audit-security round 2, S2).
import { handleContact, type ContactEnv } from './api/contact.ts';
import { withSecurityHeaders, text } from './security.ts';
import { STAGING_ROBOTS, isStagingHost, isGone, queryRedirect } from './routing.ts';

export interface Env extends ContactEnv {
  ASSETS: { fetch(input: Request | URL | string, init?: RequestInit): Promise<Response> };
}

const BODY = { 404: '/404', 410: '/410/' } as const;
const FALLBACK = {
  404: '<!doctype html><title>Not found</title><h1>Not found</h1><p><a href="/">The Luxury Liners</a></p>',
  410: '<!doctype html><title>Gone</title><h1>This page is gone</h1><p><a href="/">The Luxury Liners</a></p>',
};

function noindex(res: Response): Response {
  const out = new Response(res.body, res);
  out.headers.set('x-robots-tag', 'noindex, nofollow');
  return out;
}

const ERROR_PAGE = '<!doctype html><html lang="en"><meta charset="utf-8"><title>Something went wrong | The Luxury Liners</title><h1>Something went wrong</h1><p>Please try again in a moment, or go to <a href="/">The Luxury Liners home page</a>.</p></html>';

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(req.url);
      if (isStagingHost(url.hostname, env)) {
        if (url.pathname === '/robots.txt') return withSecurityHeaders(new Response(STAGING_ROBOTS, { headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex, nofollow' } }));
        return withSecurityHeaders(noindex(await respond(req, env, url)), url.pathname);
      }
      return withSecurityHeaders(await respond(req, env, url), url.pathname);
    } catch {
      console.log(JSON.stringify({ event: 'worker_error' }));
      return withSecurityHeaders(new Response(ERROR_PAGE, { status: 500, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } }));
    }
  },
};

export async function respond(req: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;
  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/contact' || pathname === '/api/contact/') return handleContact(req, env);
    return text('Not found', 404);
  }
  const moved = queryRedirect(url);
  if (moved) return new Response(null, { status: 301, headers: { location: moved, 'cache-control': 'public, max-age=86400' } });
  const asset = await env.ASSETS.fetch(req);
  if (asset.status !== 404) return asset;
  const status = isGone(pathname) ? 410 : 404;
  const page = await env.ASSETS.fetch(new URL(BODY[status], req.url));
  const body = page.status === 200 ? await page.text() : '';
  return new Response(body || FALLBACK[status], {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex', 'cache-control': status === 410 ? 'public, max-age=86400' : 'no-store' },
  });
}
