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

export const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': CSP,
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};
