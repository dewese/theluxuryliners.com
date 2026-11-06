// POST /api/contact (LL-31; ported from daviddewese.com and trimmed). NOT DEPLOYED from this
// build. The address messages go to exists only as the Worker secret CONTACT_TO; it is never in
// the repository, the HTML, the JSON-LD or llms.txt.
// Order of checks:
//   1. configuration: CONTACT_HOSTNAMES and the rate limiter must be bound, or 503 (fail closed)
//   2. method (405); cross-site requests (403): Sec-Fetch-Site same-origin when sent, Origin one
//      of CONTACT_HOSTNAMES when sent
//   3. a form content type (415), at most 32 KB (413)
//   4. rate limit: RL_CONTACT (wrangler.jsonc), per connection. It runs before anything costly,
//      so a flood of bad tokens never reaches siteverify and failed requests count too
//      (audit-qa round 1, S2; audit-security round 1, S4)
//   5. honeypot ("Leave this empty"): filled -> answer as if sent, drop silently
//   6. field rules shared with the page (src/lib/contact.ts): 422 with the messages
//   7. Turnstile: a token is verified with siteverify (success, hostname, action 'contact').
//      A message with no token is refused whenever TURNSTILE_SECRET is set or REQUIRE_TURNSTILE
//      is "1" (audit-security round 1, S1: Sec-Fetch-Site is only a browser's word, so a script
//      could otherwise skip Turnstile). The one opt-in is ALLOW_NO_JS_CONTACT="1" (an owner
//      decision, handbook §9): then a same-origin message without a token is accepted, marked
//      "[no Turnstile]". With no secret at all (a test or preview build) the same-origin rule applies.
//   8. send one plain-text email (send_email binding) with Reply-To = the visitor
//   9. 303 to /contact/sent/ (or JSON {ok:true} for fetch())
// A refused message without JavaScript gets the contact page again (from ASSETS), with the errors
// in its summary and next to each field and the visitor's text put back (formPage()); with
// fetch() it gets JSON {ok:false, errors}.
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
  ALLOW_NO_JS_CONTACT?: string; // var: "1" accepts a same-origin message with no token even when TURNSTILE_SECRET is set (owner opt-in)
  ASSETS?: { fetch(input: Request | URL | string): Promise<Response> }; // the static site (formPage)
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
const escAttr = (s: string) => esc(s).replace(/"/g, '&quot;');
const HTML_HEADERS = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };
const FIELDS = ['name', 'email', 'topic', 'message'] as const;

/** Last resort (no ASSETS binding, or the page could not be read): a plain list of what to fix. */
function page(status: number, messages: string[]): Response {
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Error: message not sent | The Luxury Liners</title><main><h1>Your message was not sent</h1><ul>${messages.map((m) => `<li>${esc(m)}</li>`).join('')}</ul><p>Use your browser’s Back button to return to the form with your message, or <a href="/contact/">open a new contact form</a>.</p></main></html>`;
  return withSecurityHeaders(new Response(html, { status, headers: HTML_HEADERS }));
}

/**
 * The built /contact/ page with the errors and the visitor's text filled in (pure; tested in
 * tests/unit/worker.test.mjs). Relies on the markers in src/pages/contact/index.astro: the empty
 * [data-contact-errors] summary, a hidden <p class="field-error" id="<field>-error"> per field,
 * inputs that start with their id, and the disabled "Choose a topic" option.
 */
export function fillForm(html: string, errors: Record<string, string>, input: Partial<ContactInput>): string {
  const keys = Object.keys(errors);
  const items = keys.map((k) => (FIELDS as readonly string[]).includes(k) ? `<li><a href="#${k}">${esc(errors[k])}</a></li>` : `<li>${esc(errors[k])}</li>`).join('');
  const summary = `<h2 class="h3">Your message was not sent</h2><p>Please fix ${keys.length === 1 ? 'this' : 'these'} and send it again. Everything you typed is still here.</p><ul>${items}</ul>`;
  let out = html.replace(/<title>/, '<title>Error: ');
  out = out.replace(/(<div class="error-summary"[^>]*?)\shidden(?:="")?([^>]*>)<\/div>/, (_m, a, b) => `${a} role="alert"${b}${summary}</div>`);
  for (const f of FIELDS) {
    const msg = errors[f];
    if (msg) out = out.replace(new RegExp(`<p class="field-error" id="${f}-error" hidden(?:="")?></p>`), () => `<p class="field-error" id="${f}-error">${esc(msg)}</p>`);
  }
  const invalid = (f: string) => (errors[f] ? ' aria-invalid="true"' : '');
  for (const f of ['name', 'email'] as const) {
    out = out.replace(new RegExp(`<input id="${f}"`), () => `<input id="${f}" value="${escAttr(clean(input[f] ?? '', f === 'name' ? 1000 : 320))}"${invalid(f)}`);
  }
  out = out.replace(/(<textarea id="message")([^>]*>)<\/textarea>/, (_m, a, b) => `${a}${invalid('message')}${b}${esc(cleanMessage(input.message ?? '').slice(0, 20000))}</textarea>`);
  out = out.replace(/<select id="topic"/, () => `<select id="topic"${invalid('topic')}`);
  if (input.topic && TOPICS.some((t) => t.value === input.topic)) {
    out = out.replace(/<option value="" disabled selected(?:="")?>/, '<option value="" disabled>')
      .replace(new RegExp(`<option value="${input.topic}">`), `<option value="${input.topic}" selected>`);
  }
  return out;
}

async function formPage(req: Request, env: ContactEnv, status: number, errors: Record<string, string>, input: Partial<ContactInput>): Promise<Response> {
  try {
    if (env.ASSETS) {
      const res = await env.ASSETS.fetch(new Request(new URL('/contact/', req.url)));
      const html = res.status === 200 ? await res.text() : '';
      if (html.includes('data-contact-errors')) return withSecurityHeaders(new Response(fillForm(html, errors, input), { status, headers: HTML_HEADERS }));
    }
  } catch { log('contact_form_page_failed'); }
  return page(status, Object.values(errors));
}
const refuse = (req: Request, env: ContactEnv, status: number, errors: Record<string, string>, input: Partial<ContactInput> = {}) =>
  wantsJson(req) ? Promise.resolve(json(status, { ok: false, errors })) : formPage(req, env, status, errors, input);
const sent = (req: Request) => wantsJson(req) ? json(200, { ok: true }) : withSecurityHeaders(new Response(null, { status: 303, headers: { location: '/contact/sent/', 'cache-control': 'no-store' } }));

export async function verifyTurnstile(token: string, ip: string | null, env: ContactEnv, fetcher: typeof fetch = fetch): Promise<boolean> {
  const hosts = hostnames(env);
  if (!env.TURNSTILE_SECRET || !hosts.length) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (ip) body.append('remoteip', ip); // only when Cloudflare gave one (audit-security round 1, minor)
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
  const declared = Number(req.headers.get('content-length') ?? '0');
  if (declared > MAX_BODY) return refuse(req, env, 413, { form: MESSAGES.tooLong });

  const ip = req.headers.get('cf-connecting-ip');
  try { if (!(await env.RL_CONTACT.limit({ key: ip ?? 'unknown' })).success) return refuse(req, env, 429, { form: MESSAGES.busy }); }
  catch { log('contact_limiter_failed'); return refuse(req, env, 503, { form: MESSAGES.unavailable }); }

  const buf = await req.arrayBuffer();
  if (buf.byteLength > MAX_BODY) return refuse(req, env, 413, { form: MESSAGES.tooLong });
  let form: FormData;
  try { form = await new Request(req.url, { method: 'POST', headers: { 'content-type': req.headers.get('content-type')! }, body: buf }).formData(); }
  catch { return text('Bad request', 400); }
  const field = (k: string) => { const v = form.get(k); return typeof v === 'string' ? v : ''; };
  const input: ContactInput = { name: field('name'), email: field('email'), topic: field('topic'), message: field('message'), website: field('website'), elapsed: field('elapsed') !== '' ? field('elapsed') : undefined };

  if (isTrapped(input)) { log('contact_trapped'); return sent(req); }
  const errors = validate(input, { checkTiming: input.elapsed !== undefined });
  if (Object.keys(errors).length) return refuse(req, env, 422, errors as Record<string, string>, input);

  const token = field('cf-turnstile-response');
  const verified = token ? await verifyTurnstile(token, ip, env, deps.fetcher) : false;
  if (token && !verified) return refuse(req, env, 422, { form: MESSAGES.turnstile }, input);
  const noTokenAllowed = site === 'same-origin' && env.REQUIRE_TURNSTILE !== '1' && (!env.TURNSTILE_SECRET || env.ALLOW_NO_JS_CONTACT === '1');
  if (!token && !noTokenAllowed) return refuse(req, env, 403, { form: MESSAGES.noToken }, input);

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
    return refuse(req, env, 500, { form: MESSAGES.sendFailed }, input);
  }
  log('contact_sent');
  return sent(req);
}
