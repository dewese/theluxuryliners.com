// The Worker: legacy routing (410s, the old query-string addresses) and the contact handler with
// stand-ins for the Cloudflare bindings. Needs `npm run build` first (worker/gone.ts is generated).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isGone, queryRedirect, isStagingHost, safeDecode } from '../../worker/routing.ts';
import { handleContact, fillForm, verifyTurnstile, readCapped, MAX_BODY } from '../../worker/api/contact.ts';
import worker, { respond } from '../../worker/index.ts';
import { MESSAGES } from '../../src/lib/contact.ts';
import { buildMime } from '../../worker/api/mime.ts';
import { GONE, QUERY_REDIRECTS } from '../../worker/gone.ts';
import { SECURITY_HEADERS, ADMIN_CSP, ADMIN_HEADERS } from '../../worker/headers.ts';

test('routing: 410 for old files, query redirects, staging host', () => {
  assert.ok(GONE.length > 100);
  assert.ok(isGone(GONE[0]));
  assert.equal(isGone('/story/'), false);
  assert.ok(GONE.every((p) => !p.startsWith('/cdn-cgi/') && !p.startsWith('/.well-known/')), 'Cloudflare and probe paths are left as 404');
  assert.equal(queryRedirect(new URL('https://theluxuryliners.com/?content=bio')), QUERY_REDIRECTS['content=bio']);
  assert.equal(queryRedirect(new URL('https://theluxuryliners.com/index.php?&content=mailinglist')), '/contact/');
  assert.equal(queryRedirect(new URL('https://theluxuryliners.com/?em1884=x')), QUERY_REDIRECTS.em1884);
  assert.equal(queryRedirect(new URL('https://theluxuryliners.com/')), null);
  assert.equal(queryRedirect(new URL('https://theluxuryliners.com/story/?content=bio')), null);
  assert.equal(isStagingHost('staging.theluxuryliners.com', { SITE_HOSTNAME: 'theluxuryliners.com' }), true);
  assert.equal(isStagingHost('www.theluxuryliners.com', { SITE_HOSTNAME: 'theluxuryliners.com' }), false);
});

const ENV = (over = {}) => ({
  CONTACT_HOSTNAMES: 'theluxuryliners.com', CONTACT_FROM: 'contact-form@theluxuryliners.com', CONTACT_TO: 'owner@example.org',
  TURNSTILE_SECRET: 'secret', RL_CONTACT: { limit: async () => ({ success: true }) },
  SEND_EMAIL: { sent: [], async send(m) { this.sent.push(m); } }, ...over,
});
const form = (fields, headers = {}) => new Request('https://theluxuryliners.com/api/contact', {
  method: 'POST', body: new URLSearchParams(fields).toString(),
  headers: { 'content-type': 'application/x-www-form-urlencoded', 'sec-fetch-site': 'same-origin', origin: 'https://theluxuryliners.com', ...headers },
});
const GOOD = { name: 'A Fan', email: 'fan@example.com', topic: 'fan-mail', message: 'Hello from a fan of Overbored.', elapsed: '20' };
const makeMessage = async (from, to, raw) => ({ from, to, raw });

test('contact: a good message is sent to CONTACT_TO with Reply-To the visitor, then 303', async () => {
  // no token: accepted only with the owner's ALLOW_NO_JS_CONTACT opt-in while a secret is set
  const env = ENV({ ALLOW_NO_JS_CONTACT: '1' });
  const res = await handleContact(form(GOOD), env, { makeMessage });
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), '/contact/sent/');
  assert.equal(env.SEND_EMAIL.sent.length, 1);
  assert.equal(env.SEND_EMAIL.sent[0].to, 'owner@example.org');
  assert.match(env.SEND_EMAIL.sent[0].raw, /Reply-To: <fan@example\.com>/);
  assert.match(env.SEND_EMAIL.sent[0].raw, /\[no Turnstile\]/);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) assert.equal(res.headers.get(k), v);
});

test('contact: refusals', async () => {
  assert.equal((await handleContact(form(GOOD), ENV({ RL_CONTACT: undefined }), { makeMessage })).status, 503, 'fails closed without a limiter');
  assert.equal((await handleContact(new Request('https://theluxuryliners.com/api/contact'), ENV())).status, 405);
  assert.equal((await handleContact(form(GOOD, { 'sec-fetch-site': 'cross-site' }), ENV())).status, 403);
  assert.equal((await handleContact(form(GOOD, { origin: 'https://evil.example' }), ENV())).status, 403);
  assert.equal((await handleContact(form({ ...GOOD, email: 'x' }), ENV())).status, 422);
  assert.equal((await handleContact(form({ ...GOOD, message: 'x'.repeat(40000) }), ENV())).status, 413);
  const trapped = ENV();
  assert.equal((await handleContact(form({ ...GOOD, website: 'http://spam' }), trapped, { makeMessage })).status, 303, 'honeypot looks like success');
  assert.equal(trapped.SEND_EMAIL.sent.length, 0, 'and sends nothing');
  const limited = ENV({ RL_CONTACT: { limit: async () => ({ success: false }) } });
  assert.equal((await handleContact(form(GOOD), limited, { makeMessage })).status, 429);
  const withSecret = ENV();
  assert.equal((await handleContact(form(GOOD), withSecret, { makeMessage })).status, 403, 'TURNSTILE_SECRET set: a token-less post with a forged same-origin header is refused');
  assert.equal(withSecret.SEND_EMAIL.sent.length, 0);
  const noSecret = ENV({ TURNSTILE_SECRET: undefined });
  assert.equal((await handleContact(form(GOOD), noSecret, { makeMessage })).status, 303, 'no secret configured (preview): the same-origin rule applies');
  const noSite = new Request('https://theluxuryliners.com/api/contact', { method: 'POST', body: new URLSearchParams(GOOD).toString(), headers: { 'content-type': 'application/x-www-form-urlencoded' } });
  assert.equal((await handleContact(noSite, ENV(), { makeMessage })).status, 403, 'no token and no same-origin signal');
  const strict = ENV({ REQUIRE_TURNSTILE: '1' });
  assert.equal((await handleContact(form(GOOD), strict, { makeMessage })).status, 403, 'REQUIRE_TURNSTILE: a faked same-origin header no longer skips Turnstile');
  assert.equal(strict.SEND_EMAIL.sent.length, 0);
});

test('contact: Turnstile token checked with siteverify (hostname and action)', async () => {
  const fetcher = (ok, over = {}) => async () => new Response(JSON.stringify({ success: ok, hostname: 'theluxuryliners.com', action: 'contact', ...over }));
  const env = ENV();
  const good = await handleContact(form({ ...GOOD, 'cf-turnstile-response': 'tok' }), env, { makeMessage, fetcher: fetcher(true) });
  assert.equal(good.status, 303);
  assert.doesNotMatch(env.SEND_EMAIL.sent[0].raw, /\[no Turnstile\]/);
  const post = (env, f) => handleContact(form({ ...GOOD, 'cf-turnstile-response': 'tok' }), env, { makeMessage, fetcher: f });
  assert.equal((await post(ENV(), fetcher(false))).status, 422, 'siteverify says no');
  assert.equal((await post(ENV(), fetcher(true, { hostname: 'evil.example' }))).status, 422, 'a token for another hostname');
  assert.equal((await post(ENV(), fetcher(true, { action: 'login' }))).status, 422, 'a token for another action');
  assert.equal((await post(ENV(), async () => { throw new Error('network'); })).status, 422, 'siteverify unreachable');
  assert.equal((await post(ENV(), async () => new Response('oops', { status: 500 }))).status, 422, 'siteverify error');
  assert.equal((await post(ENV({ TURNSTILE_SECRET: undefined }), fetcher(true))).status, 422, 'no TURNSTILE_SECRET: a token cannot be verified');
});

test('contact: remoteip is sent only when Cloudflare gave one', async () => {
  const seen = [];
  const fetcher = async (_u, init) => { seen.push(init.body.has('remoteip')); return new Response(JSON.stringify({ success: true, hostname: 'theluxuryliners.com', action: 'contact' })); };
  await verifyTurnstile('tok', null, ENV(), fetcher);
  await verifyTurnstile('tok', '203.0.113.9', ENV(), fetcher);
  assert.deepEqual(seen, [false, true]);
});

test('contact: the rate limit runs before siteverify and before validation (audit-qa S2, audit-security S4)', async () => {
  let verifies = 0;
  const fetcher = async () => { verifies++; return new Response(JSON.stringify({ success: false })); };
  const limited = ENV({ RL_CONTACT: { limit: async () => ({ success: false }) } });
  assert.equal((await handleContact(form({ ...GOOD, 'cf-turnstile-response': 'bad' }), limited, { makeMessage, fetcher })).status, 429);
  assert.equal((await handleContact(form({ ...GOOD, email: 'x' }), limited, { makeMessage, fetcher })).status, 429, 'a bad form counts too');
  assert.equal(verifies, 0, 'siteverify never called for a limited client');
  const keys = [];
  const env = ENV({ RL_CONTACT: { limit: async ({ key }) => { keys.push(key); return { success: true }; } } });
  await handleContact(form({ ...GOOD, email: 'x' }, { 'cf-connecting-ip': '203.0.113.9' }), env, { makeMessage });
  assert.deepEqual(keys, ['203.0.113.9'], 'a refused form is counted');
});

const CONTACT_HTML = '<html><head><title>Contact | The Luxury Liners</title></head><body><form method="post" action="/api/contact" data-contact><div class="error-summary" data-contact-errors tabindex="-1" hidden></div>'
  + '<p class="field-error" id="name-error" hidden></p><input id="name" name="name" type="text" aria-describedby="name-hint name-error">'
  + '<p class="field-error" id="email-error" hidden></p><input id="email" name="email" type="email">'
  + '<p class="field-error" id="topic-error" hidden></p><select id="topic" name="topic"><option value="" disabled selected>Choose a topic</option><option value="booking">Booking</option><option value="fan-mail">Fan mail</option></select>'
  + '<p class="field-error" id="message-error" hidden></p><textarea id="message" name="message" aria-describedby="message-hint message-error"></textarea></form></body></html>';

test('contact: a refused message without JavaScript gets the form again, filled in, with the errors (audit-a11y B2)', async () => {
  const input = { name: 'David "Larry" <b>', email: 'nope', topic: 'fan-mail', message: 'Hi & <script>x</script>' };
  const out = fillForm(CONTACT_HTML, { email: MESSAGES.email, form: MESSAGES.tooFast }, input);
  assert.match(out, /<title>Error: Contact/);
  // focus starts on the summary without JavaScript (audit-a11y round 2, m3)
  assert.match(out, /<div class="error-summary" data-contact-errors tabindex="-1" role="alert" autofocus><h2 class="h3">Your message was not sent<\/h2>/);
  assert.match(out, /<li><a href="#email">Enter a full email address/);
  assert.match(out, /<p class="field-error" id="email-error">Enter a full email address/);
  assert.match(out, /<p class="field-error" id="name-error" hidden><\/p>/, 'no error, slot stays hidden');
  assert.match(out, /<input id="email" value="nope" aria-invalid="true"/);
  assert.match(out, /<input id="name" value="David &quot;Larry&quot; &lt;b&gt;" name=/, 'value kept and escaped');
  assert.match(out, /<option value="fan-mail" selected>/);
  assert.match(out, /<option value="" disabled>Choose/);
  assert.match(out, /<textarea id="message"[^>]*>Hi &amp; &lt;script&gt;x&lt;\/script&gt;<\/textarea>/);
  assert.doesNotMatch(out, /<script>x/);
  // through the handler, with an ASSETS stand-in serving the page
  const env = ENV({ ASSETS: { fetch: async (r) => new URL(r.url ?? r).pathname === '/contact/' ? new Response(CONTACT_HTML) : new Response('', { status: 404 }) } });
  const res = await handleContact(form({ ...GOOD, email: 'x' }), env, { makeMessage });
  assert.equal(res.status, 422);
  assert.match(await res.text(), /<input id="email" value="x" aria-invalid="true"/);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) assert.equal(res.headers.get(k), v);
  // with fetch(): JSON
  const js = await handleContact(form({ ...GOOD, email: 'x' }, { accept: 'application/json' }), ENV(), { makeMessage });
  assert.deepEqual(await js.json(), { ok: false, errors: { email: MESSAGES.email } });
});

test('routing: a malformed escape never throws (audit-qa S1, audit-security S2)', () => {
  for (const p of ['/foo%zz', '/100%', '/%E0%A4%A']) { assert.doesNotThrow(() => isGone(p)); assert.equal(isGone(p), false); assert.equal(safeDecode(p), p); }
  assert.equal(safeDecode('/a%20b'), '/a b');
});

const ASSETS = (files) => ({ fetch: async (r) => { const p = new URL(r.url ?? r).pathname; return p in files ? new Response(files[p], { status: 200 }) : new Response('nope', { status: 404 }); } });
const SITE_ENV = (over = {}) => ({ ...ENV(), SITE_HOSTNAME: 'theluxuryliners.com', ASSETS: ASSETS({ '/': 'home', '/404': '<h1>404 page</h1>', '/410/': '<h1>410 page</h1>' }), ...over });

test('respond(): static files, 404, 410, fallbacks and the old query addresses', async () => {
  const env = SITE_ENV();
  const get = (p) => respond(new Request(`https://theluxuryliners.com${p}`), env, new URL(`https://theluxuryliners.com${p}`));
  assert.equal(await (await get('/')).text(), 'home');
  const nf = await get('/no-such-page/');
  assert.equal(nf.status, 404); assert.equal(await nf.text(), '<h1>404 page</h1>'); assert.equal(nf.headers.get('x-robots-tag'), 'noindex');
  const gone = await get(GONE[0]);
  assert.equal(gone.status, 410); assert.equal(await gone.text(), '<h1>410 page</h1>');
  assert.equal((await get('/foo%zz')).status, 404, 'malformed escape: a 404, not a 500');
  const bare = SITE_ENV({ ASSETS: ASSETS({}) });
  const fb = await respond(new Request('https://theluxuryliners.com/x'), bare, new URL('https://theluxuryliners.com/x'));
  assert.equal(fb.status, 404); assert.match(await fb.text(), /Not found/, 'built-in fallback when /404 is missing');
  const moved = await get('/?content=bio');
  assert.equal(moved.status, 301); assert.equal(moved.headers.get('location'), QUERY_REDIRECTS['content=bio']);
  assert.equal((await get('/api/other')).status, 404);
});

test('the Worker: security headers everywhere, staging included, and a 500 page on an error (audit-security S2, S3)', async () => {
  const prod = await worker.fetch(new Request('https://theluxuryliners.com/no-such-page/'), SITE_ENV());
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) assert.equal(prod.headers.get(k), v, k);
  const staging = await worker.fetch(new Request('https://staging.theluxuryliners.com/no-such-page/'), SITE_ENV());
  assert.equal(staging.status, 404);
  assert.equal(staging.headers.get('x-robots-tag'), 'noindex, nofollow');
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) assert.equal(staging.headers.get(k), v, `staging ${k}`);
  const robots = await worker.fetch(new Request('https://staging.theluxuryliners.com/robots.txt'), SITE_ENV());
  assert.match(await robots.text(), /Disallow: \//);
  const broken = SITE_ENV({ ASSETS: { fetch: async () => { throw new Error('boom'); } } });
  const err = await worker.fetch(new Request('https://theluxuryliners.com/x'), broken);
  assert.equal(err.status, 500);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) assert.equal(err.headers.get(k), v, `500 ${k}`);
});

test('headers: modern Permissions-Policy, HSTS with subdomains; /admin/ allows the OAuth popup and pins Decap', () => {
  assert.match(SECURITY_HEADERS['Permissions-Policy'], /browsing-topics=\(\)/);
  assert.doesNotMatch(SECURITY_HEADERS['Permissions-Policy'], /interest-cohort/);
  assert.match(SECURITY_HEADERS['Strict-Transport-Security'], /includeSubDomains/);
  const h = readFileSync(process.env.LL_DIST ? join(process.env.LL_DIST, '_headers') : new URL('../../dist/_headers', import.meta.url), 'utf8');
  const admin = h.slice(h.indexOf('/admin/*'));
  assert.match(admin, /! Cross-Origin-Opener-Policy\n  Cross-Origin-Opener-Policy: same-origin-allow-popups/);
  assert.match(admin, /object-src 'none'; base-uri 'self'/);
  assert.match(admin, /script-src 'self' 'unsafe-eval' https:\/\/unpkg\.com\/decap-cms@[\d.]+\/dist\/decap-cms\.js;/);
  const html = readFileSync(new URL('../../public/admin/index.html', import.meta.url), 'utf8');
  const v = /decap-cms@([\d.]+)/.exec(admin)[1];
  assert.match(html, new RegExp(`<script src="https://unpkg\\.com/decap-cms@${v.replace(/\./g, '\\.')}/dist/decap-cms\\.js" integrity="sha384-[A-Za-z0-9+/=]{64}" crossorigin="anonymous">`));
});

test('wrangler: production requires Turnstile; the www host may send the form', () => {
  const w = readFileSync(new URL('../../wrangler.jsonc', import.meta.url), 'utf8');
  const top = w.slice(0, w.indexOf('"env"'));
  assert.match(top, /"REQUIRE_TURNSTILE": "1"/);
  assert.match(top, /"CONTACT_HOSTNAMES": "theluxuryliners\.com,www\.theluxuryliners\.com"/);
});

test('mime: no visitor text can start a header', () => {
  const raw = buildMime({ from: 'a@b.co', to: 'c@d.co', replyTo: null, subject: 'Hi\r\nBcc: x@y.z', text: 'body\r\nBcc: q@r.s' });
  const head = raw.split('\r\n\r\n')[0];
  assert.doesNotMatch(head, /^Bcc:/m);
});

test('the contact address is configured only as a secret', () => {
  const w = readFileSync(new URL('../../wrangler.jsonc', import.meta.url), 'utf8');
  assert.doesNotMatch(w, /CONTACT_TO"\s*:/, 'CONTACT_TO is a secret, never a var');
  assert.doesNotMatch(w, /@dewese\.com|@gmail\.com/);
});

// ---- round 2 (critiques/audit-security-round2.md)

test('security r2 S2: /admin/ keeps the editor CSP and COOP through the Worker (staging runs the Worker first)', async () => {
  const env = SITE_ENV({ ASSETS: ASSETS({ '/admin/': '<!doctype html><title>Editor</title>', '/404': '404' }) });
  for (const host of ['staging.theluxuryliners.com', 'theluxuryliners.com']) {
    const res = await worker.fetch(new Request(`https://${host}/admin/`), env);
    assert.equal(res.status, 200, host);
    assert.equal(res.headers.get('content-security-policy'), ADMIN_CSP, `${host}: admin CSP`);
    assert.equal(res.headers.get('cross-origin-opener-policy'), 'same-origin-allow-popups', `${host}: admin COOP`);
    assert.match(res.headers.get('x-robots-tag'), /noindex/, host);
    assert.equal(res.headers.get('strict-transport-security'), SECURITY_HEADERS['Strict-Transport-Security'], `${host}: the other headers stay`);
  }
  const other = await worker.fetch(new Request('https://staging.theluxuryliners.com/administrator/'), env);
  assert.equal(other.headers.get('content-security-policy'), SECURITY_HEADERS['Content-Security-Policy'], 'only /admin/ gets the editor CSP');
  const h = readFileSync(process.env.LL_DIST ? join(process.env.LL_DIST, '_headers') : new URL('../../dist/_headers', import.meta.url), 'utf8');
  assert.ok(h.includes(`Content-Security-Policy: ${ADMIN_CSP}`), 'dist/_headers uses the same ADMIN_CSP');
  assert.equal(ADMIN_HEADERS['Content-Security-Policy'], ADMIN_CSP);
});

test('security r2 S2: staging requires Turnstile too', () => {
  const w = readFileSync(new URL('../../wrangler.jsonc', import.meta.url), 'utf8');
  const staging = w.slice(w.indexOf('"staging"'));
  assert.match(staging.slice(0, staging.indexOf('"ratelimits"')), /"REQUIRE_TURNSTILE": "1"/);
});

test('security r2 S3: a body with no Content-Length is read only up to MAX_BODY, then 413', async () => {
  let pulled = 0;
  const chunk = new Uint8Array(64 * 1024).fill(97);
  const body = new ReadableStream({ pull(c) { pulled += chunk.byteLength; if (pulled > 5 * 1024 * 1024) c.close(); else c.enqueue(chunk); } });
  const req = new Request('https://theluxuryliners.com/api/contact', {
    method: 'POST', body, duplex: 'half',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'sec-fetch-site': 'same-origin', origin: 'https://theluxuryliners.com', accept: 'application/json', 'cf-connecting-ip': '192.0.2.1' },
  });
  assert.equal(req.headers.get('content-length'), null);
  const res = await handleContact(req, ENV(), { makeMessage });
  assert.equal(res.status, 413);
  assert.ok(pulled <= MAX_BODY + 3 * chunk.byteLength, `read ${pulled} bytes of a 5 MB body before the 413`);
  // a small body is read whole
  assert.equal((await readCapped(new Request('https://x/', { method: 'POST', body: 'a=1' }), MAX_BODY)).byteLength, 3);
  assert.equal(await readCapped(new Request('https://x/', { method: 'POST', body: 'x'.repeat(MAX_BODY + 1) }), MAX_BODY), null);
});

test('security r2 minor: a request without cf-connecting-ip is logged (shared rate-limit bucket)', async () => {
  const logs = [];
  const orig = console.log;
  console.log = (m) => logs.push(String(m));
  try { await handleContact(form({ ...GOOD }), ENV({ ALLOW_NO_JS_CONTACT: '1' }), { makeMessage }); }
  finally { console.log = orig; }
  assert.ok(logs.some((l) => l.includes('contact_no_client_ip')), logs.join(' '));
});
