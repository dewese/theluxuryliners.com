// The Worker: legacy routing (410s, the old query-string addresses) and the contact handler with
// stand-ins for the Cloudflare bindings. Needs `npm run build` first (worker/gone.ts is generated).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isGone, queryRedirect, isStagingHost } from '../../worker/routing.ts';
import { handleContact } from '../../worker/api/contact.ts';
import { buildMime } from '../../worker/api/mime.ts';
import { GONE, QUERY_REDIRECTS } from '../../worker/gone.ts';
import { SECURITY_HEADERS } from '../../worker/headers.ts';

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
  const env = ENV();
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
  const noSite = new Request('https://theluxuryliners.com/api/contact', { method: 'POST', body: new URLSearchParams(GOOD).toString(), headers: { 'content-type': 'application/x-www-form-urlencoded' } });
  assert.equal((await handleContact(noSite, ENV(), { makeMessage })).status, 403, 'no token and no same-origin signal');
});

test('contact: Turnstile token checked with siteverify (hostname and action)', async () => {
  const fetcher = (ok) => async () => new Response(JSON.stringify({ success: ok, hostname: 'theluxuryliners.com', action: 'contact' }));
  const env = ENV();
  const good = await handleContact(form({ ...GOOD, 'cf-turnstile-response': 'tok' }), env, { makeMessage, fetcher: fetcher(true) });
  assert.equal(good.status, 303);
  assert.doesNotMatch(env.SEND_EMAIL.sent[0].raw, /\[no Turnstile\]/);
  assert.equal((await handleContact(form({ ...GOOD, 'cf-turnstile-response': 'tok' }), ENV(), { makeMessage, fetcher: fetcher(false) })).status, 422);
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
