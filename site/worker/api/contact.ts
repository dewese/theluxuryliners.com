// POST /api/contact (LL-31; ported from daviddewese.com and trimmed). NOT DEPLOYED from this
// build. The address messages go to exists only as the Worker secret CONTACT_TO; it is never in
// the repository, the HTML, the JSON-LD or llms.txt.
// Order of checks:
//   1. configuration: CONTACT_HOSTNAMES and the rate limiter must be bound, or 503 (fail closed)
//   2. method (405); cross-site requests (403): Sec-Fetch-Site same-origin when sent, Origin one
//      of CONTACT_HOSTNAMES when sent
//   3. a form content type (415), at most 32 KB (413)
//   4. honeypot ("Leave this empty"): filled -> answer as if sent, drop silently
//   5. field rules shared with the page (src/lib/contact.ts): 422 with the messages
//   6. Turnstile: a token is verified with siteverify (success, hostname, action 'contact').
//      No token (JavaScript off, or Turnstile not configured) is accepted only from a browser
//      that says the form was sent from this site (Sec-Fetch-Site: same-origin), with
//      "[no Turnstile]" in the subject. Sec-Fetch-Site is only a browser's word: any script can
//      send it, so this path is a known spam route (handbook §9). REQUIRE_TURNSTILE="1" closes it
//      (every message then needs a verified token; the form stops working with JavaScript off).
//   7. rate limit: RL_CONTACT (wrangler.jsonc), per connection
//   8. send one plain-text email (send_email binding) with Reply-To = the visitor
//   9. 303 to /contact/sent/ (or JSON {ok:true} for fetch())
// Stores nothing; logs fixed event codes only (never the message or any address).
import { validate, isTrapped, clean, cleanMessage, TOPICS, MESSAGES, type ContactInput } from '../../src/lib/contact.ts';
import { withSecurityHeaders, text } from '../security.ts';
import { buildMime, replyToAddress } from './mime.ts';

interface RateLimit { limit(opts: { key: string }): Promise<{ success: boolean }> }
interface SendEmail { send(message: unknown): Promise<void> }

export interface ContactEnv {
  TURNSTILE_SECRET?: string;   // secret: wrangler secret put TURNSTILE_SECRET
  CONTACT_TO?: string;         // secret: wrangler secret put CONTACT_TO (the address messages go to)
  CONTACT_FROM?: string;       // var: contact-form@theluxuryliners.com
  SITE_HOSTNAME?: string;      // var: theluxuryliners.com
  CONTACT_HOSTNAMES?: string;  // var: hosts the form may be sent from, comma-separated
  REQUIRE_TURNSTILE?: string;  // var: "1" refuses every message without a verified Turnstile token
  RL_CONTACT?: RateLimit;      // ratelimits binding
  SEND_EMAIL?: SendEmail;      // send_email binding
}
/** Builds the message object for SEND_EMAIL (the runtime's EmailMessage; tests pass a stand-in). */
export type MakeMessage = (from: string, to: string, raw: string) => Promise<unknown>;
const runtimeMessage: MakeMessage = async (from, to, raw) => {
  const { EmailMessage } = await import('cloudflare:email');
  return new EmailMessage(from, to, raw);
};

export const MAX_BODY = 32 * 1024;
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const log = (event: string) => console.log(JSON.stringify({ event }));
export const hostnames = (env: Pick<ContactEnv, 'CONTACT_HOSTNAMES'>): string[] =>
  (env.CONTACT_HOSTNAMES ?? '').split(',').map((h) => h.trim().toLowerCase()).filter(Boolean);
const wantsJson = (req: Request) => (req.headers.get('accept') ?? '').includes('application/json');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function json(status: number, body: unknown): Response {
  return withSecurityHeaders(new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } }));
}
/** Without JavaScript: a plain page listing what to fix, with a link back (the browser keeps the form's text). */
function page(status: number, messages: string[]): Response {
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Error: message not sent | The Luxury Liners</title><main><h1>Your message was not sent</h1><ul>${messages.map((m) => `<li>${esc(m)}</li>`).join('')}</ul><p><a href="/contact/">Back to the contact form</a></p></main></html>`;
  return withSecurityHeaders(new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } }));
}
const refuse = (req: Request, status: number, errors: Record<string, string>) =>
  wantsJson(req) ? json(status, { ok: false, errors }) : page(status, Object.values(errors));
const sent = (req: Request) => wantsJson(req) ? json(200, { ok: true }) : withSecurityHeaders(new Response(null, { status: 303, headers: { location: '/contact/sent/', 'cache-control': 'no-store' } }));

export async function verifyTurnstile(token: string, ip: string | null, env: ContactEnv, fetcher: typeof fetch = fetch): Promise<boolean> {
  const hosts = hostnames(env);
  if (!env.TURNSTILE_SECRET || !hosts.length) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetcher(SITEVERIFY, { method: 'POST', body, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const out = await res.json() as { success?: boolean; hostname?: string; action?: string };
    return out.success === true && hosts.includes(String(out.hostname ?? '').toLowerCase()) && out.action === 'contact';
  } catch { return false; }
}

export async function handleContact(req: Request, env: ContactEnv, deps: { makeMessage?: MakeMessage; fetcher?: typeof fetch } = {}): Promise<Response> {
  const hosts = hostnames(env);
  if (!hosts.length || !env.RL_CONTACT) { log('contact_misconfigured'); return text('The contact form isn’t available just now.', 503); }
  if (req.method !== 'POST') return text('Method not allowed', 405, { allow: 'POST' });
  const site = req.headers.get('sec-fetch-site');
  const origin = req.headers.get('origin');
  if ((site !== null && site !== 'same-origin') || (origin !== null && !hosts.some((h) => origin === `https://${h}`))) { log('contact_cross_site'); return text('Forbidden', 403); }
  const type = (req.headers.get('content-type') ?? '').toLowerCase();
  if (!type.startsWith('application/x-www-form-urlencoded') && !type.startsWith('multipart/form-data')) return text('Send the form from the contact page.', 415);
  const buf = await req.arrayBuffer();
  if (buf.byteLength > MAX_BODY) return refuse(req, 413, { form: 'That message is too long.' });
  let form: FormData;
  try { form = await new Request(req.url, { method: 'POST', headers: { 'content-type': req.headers.get('content-type')! }, body: buf }).formData(); }
  catch { return text('Bad request', 400); }
  const field = (k: string) => { const v = form.get(k); return typeof v === 'string' ? v : ''; };
  const input: ContactInput = { name: field('name'), email: field('email'), topic: field('topic'), message: field('message'), website: field('website'), elapsed: field('elapsed') !== '' ? field('elapsed') : undefined };

  if (isTrapped(input)) { log('contact_trapped'); return sent(req); }
  const errors = validate(input, { checkTiming: input.elapsed !== undefined });
  if (Object.keys(errors).length) return refuse(req, 422, errors as Record<string, string>);

  const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
  const token = field('cf-turnstile-response');
  const verified = token ? await verifyTurnstile(token, ip, env, deps.fetcher) : false;
  if (token && !verified) return refuse(req, 422, { form: MESSAGES.turnstile });
  if (!token && (site !== 'same-origin' || env.REQUIRE_TURNSTILE === '1')) return refuse(req, 403, { form: MESSAGES.noToken });

  try { if (!(await env.RL_CONTACT.limit({ key: ip })).success) return refuse(req, 429, { form: MESSAGES.busy }); }
  catch { log('contact_limiter_failed'); return refuse(req, 503, { form: MESSAGES.unavailable }); }

  const topic = TOPICS.find((t) => t.value === input.topic)?.label ?? 'Message';
  const subject = `${verified ? '' : '[no Turnstile] '}[theluxuryliners.com] ${topic}`;
  const email = clean(input.email, 320);
  const replyTo = replyToAddress(email);
  const body = `From: ${clean(input.name, 100)} <${email}>\nTopic: ${topic}\n${replyTo ? '' : 'Reply-To was left off: the address could not be used safely in a header.\n'}\n${cleanMessage(input.message)}\n`;
  try {
    if (!env.SEND_EMAIL || !env.CONTACT_TO || !env.CONTACT_FROM) throw new Error('not configured');
    const raw = buildMime({ from: env.CONTACT_FROM, to: env.CONTACT_TO, replyTo, subject, text: body });
    await env.SEND_EMAIL.send(await (deps.makeMessage ?? runtimeMessage)(env.CONTACT_FROM, env.CONTACT_TO, raw));
  } catch {
    log('contact_send_failed');
    return refuse(req, 500, { form: 'Your message could not be sent just now. Please try again later.' });
  }
  log('contact_sent');
  return sent(req);
}
