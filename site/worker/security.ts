import { SECURITY_HEADERS, ADMIN_HEADERS, isAdminPath } from './headers.ts';

/** A copy of the response with every security header set. Under /admin/ the editor's own CSP and
 *  COOP replace the site's (audit-security round 2, S2: on staging the Worker serves /admin/ too). */
export function withSecurityHeaders(res: Response, pathname?: string): Response {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) out.headers.set(k, v);
  if (pathname && isAdminPath(pathname)) for (const [k, v] of Object.entries(ADMIN_HEADERS)) out.headers.set(k, v);
  return out;
}

/** A plain-text response with the security headers. */
export function text(body: string, status: number, extra: Record<string, string> = {}): Response {
  return withSecurityHeaders(new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...extra } }));
}
