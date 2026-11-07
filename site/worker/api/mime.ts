// The contact e-mail as raw MIME (ported from daviddewese.com, where it passed its security audit). Hand-written rather than a library
// so that every byte that reaches a header is visible here and covered by tests/unit/worker.test.mjs:
//   - no visitor text in any header except Reply-To, and that only when the address passes
//     EMAIL_RE, is plain ASCII and has no control or line-separator characters;
//   - the Subject is built from fixed parts (the topic label, the release title from the built
//     form's own list) and RFC 2047-encoded when it is not plain ASCII;
//   - every header value is stripped of CR, LF, NEL (U+0085), U+2028, U+2029 and control codes,
//     then length-capped; the body is base64, so nothing in the message can start a header.
import { EMAIL_RE } from '../../src/lib/contact.ts';

const BREAKERS = /[\u0000-\u001f\u007f\u0085\u2028\u2029]+/g;
const HAS_BREAKER = /[\u0000-\u001f\u007f\u0085\u2028\u2029]/;
/** One header value: no line breaks of any kind, no control codes, at most `max` characters. */
export const headerSafe = (s: string, max = 200): string => String(s ?? '').replace(BREAKERS, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

const b64 = (bytes: Uint8Array): string => {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
};

/** RFC 2047 "B" encoded words for a non-ASCII value, each ≤ 75 characters, never splitting a character. */
export function encodeWord(value: string): string {
  if (/^[\x20-\x7e]*$/.test(value)) return value;
  const words: string[] = [];
  let chunk = '';
  const enc = new TextEncoder();
  for (const ch of value) {
    // 45 bytes of UTF-8 -> 60 base64 characters + 12 for "=?UTF-8?B?" and "?=" = 72
    if (enc.encode(chunk + ch).length > 45) { words.push(chunk); chunk = ''; }
    chunk += ch;
  }
  if (chunk) words.push(chunk);
  return words.map((w) => `=?UTF-8?B?${b64(enc.encode(w))}?=`).join('\r\n ');
}

/** A Reply-To address, or null if the visitor's address is not safe to put in a header. */
export function replyToAddress(email: string): string | null {
  const raw = String(email ?? '');
  if (HAS_BREAKER.test(raw)) return null;
  const e = raw.trim();
  if (e.length > 254) return null;
  return EMAIL_RE.test(e) && /^[\x21-\x7e]+$/.test(e) ? e : null;
}

export interface Mail { from: string; to: string; replyTo?: string | null; subject: string; text: string; date?: Date; id?: string }

export function buildMime(m: Mail): string {
  const domain = headerSafe(m.from).split('@')[1] ?? 'localhost';
  const headers = [
    `From: "theluxuryliners.com contact form" <${headerSafe(m.from, 254)}>`,
    `To: <${headerSafe(m.to, 254)}>`,
    ...(m.replyTo ? [`Reply-To: <${m.replyTo}>`] : []),
    `Subject: ${encodeWord(headerSafe(m.subject, 200))}`,
    `Date: ${(m.date ?? new Date()).toUTCString()}`,
    `Message-ID: <${headerSafe(m.id ?? crypto.randomUUID(), 64).replace(/[^A-Za-z0-9.-]/g, '')}@${domain}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
  ];
  const body = b64(new TextEncoder().encode(m.text.replace(/\r?\n/g, '\r\n'))).replace(/.{1,76}/g, '$&\r\n');
  return `${headers.join('\r\n')}\r\n\r\n${body}`;
}
