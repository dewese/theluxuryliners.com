// The security headers, in one place: scripts/build-headers.mjs writes them into dist/_headers
// (static responses) and the Worker sets the same set on every response it builds (404, 410,
// the contact API). CSP: no inline scripts or styles anywhere; the only outside scripts are
// Cloudflare Web Analytics (when enabled) and Turnstile (on /contact/ when enabled). The only frames
// are Turnstile and, after the reader presses play, a youtube-nocookie.com video (design C facade).
export const CSP = [
  "default-src 'self'",
  "script-src 'self' https://static.cloudflareinsights.com https://challenges.cloudflare.com",
  "connect-src 'self' https://cloudflareinsights.com",
  'frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com',
  "img-src 'self' data:",
  "style-src 'self'",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

/** /admin/ (Decap CMS) loads its editor from a CDN, so it gets its own CSP: only the pinned Decap
 *  file (which also carries an SRI hash in public/admin/index.html), no plugins, no <base>. The
 *  editor signs in through a cross-origin OAuth popup that hands the token back with
 *  window.opener.postMessage, so /admin/ uses COOP same-origin-allow-popups (audit-security
 *  round 1, S5). Used by scripts/build-headers.mjs (dist/_headers) and by the Worker, which runs
 *  first for every path on staging (audit-security round 2, S2). Decap posts no form, so form-action
 *  is 'none' (audit-security round 3). img-src https: is needed by the editor's image previews and
 *  style-src 'unsafe-inline' by its CSS-in-JS. */
export const ADMIN_CSP = "default-src 'self'; script-src 'self' 'unsafe-eval' https://unpkg.com/decap-cms@3.17.1/dist/decap-cms.js; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://github.com; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests";
export const ADMIN_HEADERS: Record<string, string> = {
  'Content-Security-Policy': ADMIN_CSP,
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'X-Robots-Tag': 'noindex',
};
export const isAdminPath = (pathname: string) => pathname === '/admin' || pathname.startsWith('/admin/');

export const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': CSP,
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
};
