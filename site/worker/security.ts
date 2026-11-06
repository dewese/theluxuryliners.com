import { SECURITY_HEADERS } from './headers.ts';

/** A copy of the response with every security header set. */
export function withSecurityHeaders(res: Response): Response {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) out.headers.set(k, v);
  return out;
}

/** A plain-text response with the security headers. */
export function text(body: string, status: number, extra: Record<string, string> = {}): Response {
  return withSecurityHeaders(new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...extra } }));
}
