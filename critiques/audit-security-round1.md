# Security audit, round 1

**Auditor lens:** security (Worker, Turnstile, rate limiting, e-mail header injection, secrets,
error messages, security headers and CSP, Decap CMS auth, dependencies, secrets and private data
anywhere in the repository, source maps).
**Date:** 2026-11-06. **Branch:** `claude/determined-clarke-5sslfw` at `0d45953`.
**Site files edited:** none (this report is the only file committed).

## Verdict

**Score: 6.5 / 10. Not approved** (one blocking issue: private literals written in plain text
across the public repository, against the hard privacy rule and the repository's own
`content/CHECK.md`).

The shipped code itself is in good shape: the Worker is careful, the e-mail cannot be
header-injected, the CSP is tight and was proven to work in a real browser with Turnstile, the
analytics beacon and the YouTube facade, there are no secrets, no source maps and no private
data in `dist/`. The problems are in the repository around the site, in the default spam
posture of the contact form, and in two configuration details that will bite at hosting time.

## What I ran

| Check | Result |
|---|---|
| `cd site && npm ci && npm run build` | builds, 37 pages |
| `cd site && node tests/run.mjs` (data, unit, dist, jsonld, axe) | **all PASS** (axe 370/370) |
| `RELEASE=1 node scripts/check-dist.mjs` | fails only on the two expected keys (`PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CF_ANALYTICS_TOKEN`) |
| `node content/check-content.mjs` and `--dist` | 0 errors, 0 warnings |
| `npm audit` and `npm audit --omit=dev` | 0 vulnerabilities |
| `dist/` grep: e-mail addresses, `mailto:`, the LL-31 address, Gmail, `localhost`, `/home/user`, `file://` | none |
| `dist/` source maps (`*.map`, `sourceMappingURL`) | none |
| `dist/` inline `<script>`, `<style>`, `style=""`, `on*=""` | none (only `application/ld+json` data blocks, which CSP does not govern) |
| Browser CSP test: dist served with the exact `SECURITY_HEADERS` (HSTS and `upgrade-insecure-requests` dropped for http://localhost), Chromium via playwright-core, `securitypolicyviolation` listener with a positive control (an injected inline script was reported) | **0 violations** on `/`, `/music/great-day/`, `/music/overbored/`, `/contact/` |
| Second build to a scratch folder with the Turnstile test key `1x00000000000000000000AA` and a dummy analytics token | Turnstile iframe renders and fills `cf-turnstile-response` (21 chars) under the CSP; `beacon.min.js` loads; 0 CSP violations |
| YouTube facade | 0 external requests before the click; after the click the iframe is `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0` |
| Worker driven directly in Node (stub `ASSETS`, stub `SEND_EMAIL`, stub fetcher) | see findings S1, S2, S3, S4 |
| `git grep` of the whole tree and `git log -p --all` for keys (`0x4AAA…`, `ghp_`, `github_pat_`, `AKIA…`, `AIza…`, private keys, `.env`, `.dev.vars`) | none, ever. `.dev.vars` is git-ignored |
| `git log -p --all` for e-mail addresses | only the LL-31 address (owner decision and question files, critiques) and the synthetic `theband@gmail.com` test probe; the band's real Gmail was never committed; the URL of the later-life profile was never committed |

## Blocking

### B1. Private literals in plain text across the public repository (privacy, LL-4/LL-5/LL-7)

The repository is public (`gh api repos/dewese/theluxuryliners.com` → `"visibility": "public"`).
The hard rule covers the public repo, not just the site: never the founding town, never the
profile of Chad's later life, never family pages. `content/CHECK.md` ("Private literals are
hashed, never written … the repository is public") states the same policy and
`content/check-content.mjs` implements it with SHA-256 hashes. Other files ignore it.
(The literals are deliberately not repeated in this report.)

- **`site/scripts/check-dist.mjs` lines 70, 73 and 74** write the family-page file name, the
  name of the publication that profiled Chad's later life and the founding-story town as plain
  regexes, and line 74's label ("the town of the founding story (LL-5)") tells any reader
  exactly what the literal is. This is shipped code in the site package, and it is the worst
  case, because it labels each literal.
- **The founding-story town** is also in: `site/BUILD-LOG.md`, `data/assets.json` (two fields of
  the Flickr record `flickr-2083681711`: `flickr_title` and `era`),
  `design/samples/{a-stitched,b-tonight-no-cover,c-roundel}/check_sample.py`,
  `research/01-band-history-and-people.md`, `research/05-assets-and-photos.md`,
  `critiques/audit-copy-round1.md`, `critiques/audit-seo-geo-round1.md`,
  `critiques/build-copy-round1.md`, `critiques/build-copy-round2.md`,
  `critiques/build-skeleton-round1.md`, `critiques/build-skeleton-round2.md`, and the owner's own
  `DECISIONS-2026-10-07.md` (LL-4), where it is also a statement of where a member lived
  outside the band (LL-7).
- **The publication of Chad's later-life profile** is named in `site/data/press.json` (`_about`),
  `site/BUILD-LOG.md`, `research/01-band-history-and-people.md` (15 times, including quoted
  snippets from that profile about his schooling), `research/04-press-and-digital-footprint.md`
  (13 times), and the critiques `build-skeleton-round1/2`, `footprint-round1/2`,
  `history-round1`, `plan-round1/2`. The publication's name on its own says something about his
  life outside the band, which is exactly what LL-7 forbids. RD5 removed the URL but not the
  name.
- **The family page file name** (and two photo file names on it) is in `site/tests/dist/pages.test.mjs`,
  `site/BUILD-LOG.md`, `plan/00-master-plan.md`, `research/01`, `research/03` (5 times),
  `research/legacy/live-status-2026-10-07.tsv`, `research/tools/gen_legacy_urls.py`,
  `data/assets.json`, `data/legacy-urls.json` and three critiques. (The rows in
  `data/legacy-urls.json` are needed to retire the old URL. Keep them, but see the fix.)

**Fix:**
1. `site/scripts/check-dist.mjs`: drop the three plain regexes; import `privateHits` /
   `PRIVATE_HASHES` from `content/check-content.mjs` (or copy its hashed matcher) and run it on
   every dist text file, with generic labels ("private literal (LL-7)"). Make the same change
   in `site/tests/dist/pages.test.mjs` and the three `design/samples/*/check_sample.py`.
2. Redact the literals from `site/BUILD-LOG.md`, `site/data/press.json`, the research files, the
   plan and every critique ("the founding-story town", "the later-life profile", "the family
   page"). In `data/assets.json` set that photo's `flickr_title`/`era` to a neutral value
   ("Texas, December 2007"), or move the raw Flickr metadata out of the repo.
3. For the legacy-URL rows, keep the paths (the 301/410 needs them) but generate them from a
   git-ignored `data/legacy-urls.private.json`, or accept them as the one documented exception
   and note it in `content/CHECK.md`.
4. Add a repo-wide mode to `content/check-content.mjs` (`--repo`, over `git ls-files`) that runs
   the hashed private-literal rule on every tracked text file, and run it in `npm test`, so this
   cannot come back.
5. **Owner decision needed** (not for the team to do on its own, since history rewrites are off
   limits): the literals are already in the public history. Either the owner accepts that, or
   approves a one-time history purge (`git filter-repo --replace-text`) and a force-push, or
   makes the repository private. The LL-4 line in `DECISIONS-2026-10-07.md` is the owner's own
   record. Ask Carly whether it may be reworded to "a town in Texas" in the public copy, with the
   detail kept in a private note.

## Should fix

### S1. Turnstile is optional server-side: any script gets past it with one forged header (`site/worker/api/contact.ts` line 105, `site/wrangler.jsonc`)

A POST with no `cf-turnstile-response` and `Sec-Fetch-Site: same-origin` is accepted and mailed
(verified: stub env, `curl`-style request with only that header → **303, one message sent**).
The code comments and the handbook (§10, item 5) admit this is "a known spam route" and leave
`REQUIRE_TURNSTILE` off by default, so a release build that *requires* a Turnstile site key
(check-dist RELEASE) still ships a Worker that does not require a token. The rate limit (3 a
minute per IP, per Cloudflare location) does not stop a botnet. The impact is limited: the only
recipient is `CONTACT_TO`, it is not an open relay, and the subject carries `[no Turnstile]`.
**Fix:** fail closed when Turnstile is configured. In `handleContact`, treat a missing token as
`403 noToken` whenever `env.TURNSTILE_SECRET` is set, unless `ALLOW_NO_JS_CONTACT="1"` is set
explicitly, and set `"REQUIRE_TURNSTILE": "1"` in the production `vars` of `wrangler.jsonc`.
Keep the no-JavaScript path as an opt-in. Add a unit test: secret set + no token + forged
`Sec-Fetch-Site` → 403, nothing sent.

### S2. A malformed percent-encoded path crashes the Worker (`site/worker/routing.ts` line 13)

`isGone()` calls `decodeURIComponent(path)` without a guard. `GET /%E0%A4%A` (no matching
asset) → **uncaught `URIError: URI malformed`** (verified) → the visitor gets Cloudflare's
generic error 1101 page instead of the 404 page, with none of the security headers. Any scanner
can trigger it.
**Fix:** `const safeDecode = (p) => { try { return decodeURIComponent(p); } catch { return p; } };`
and use it in `isGone`. Wrap the body of `fetch` in `index.ts` in try/catch so any error returns
the plain `FALLBACK[404]`-style 500 with `withSecurityHeaders`. Add the path to
`tests/unit/worker.test.mjs`.

### S3. Staging responses built by the Worker carry no security headers (`site/worker/index.ts` line 33)

On a non-production host the result is `noindex(await respond(...))` with no
`withSecurityHeaders`. Verified: `https://staging.theluxuryliners.com/nope` → 404 with only
`cache-control, content-type, x-robots-tag`, so no CSP, no `frame-ancestors`, no `nosniff`.
Because staging runs `run_worker_first: true`, every staging response passes this branch, and
it is not certain that `_headers` rules apply to responses fetched through the `ASSETS`
binding.
**Fix:** `return withSecurityHeaders(noindex(await respond(req, env, url)));`, plus a unit
test that a staging 404 has `content-security-policy`. Also put staging behind Cloudflare
Access, because noindex does not hide it.

### S4. The siteverify call happens before the rate limiter (`site/worker/api/contact.ts` lines 101–108)

A client that is already over its limit still makes the Worker call siteverify on every request
(verified: limiter returns `success:false`, the fetcher was still called once and the result
was 422, not 429). Requests that fail validation or Turnstile are never counted at all, so the
limiter only throttles successful sends.
**Fix:** move the `RL_CONTACT.limit` call to just after the content-type and size checks
(before parsing, validation and siteverify), so every POST counts. Keep 3/60 s.

### S5. COOP `same-origin` on `/admin/` will break the Decap GitHub sign-in popup (`site/scripts/build-headers.mjs`)

The `/*` block sends `Cross-Origin-Opener-Policy: same-origin`, and `/admin/*` does not
override it. Decap's GitHub backend opens the OAuth helper in a cross-origin popup that returns
the token through `window.opener.postMessage`. With `same-origin` on the opener, the
cross-origin popup gets no `opener`, so sign-in never completes once `base_url` is set (HANDBOOK
§11).
**Fix:** in the `/admin/*` block add `! Cross-Origin-Opener-Policy` and
`Cross-Origin-Opener-Policy: same-origin-allow-popups`. In the handbook, require that the OAuth
helper's callback `postMessage`s with `targetOrigin` set to `https://theluxuryliners.com` (not
`*`), restricts its allowed origins to the site, and requests the narrowest scope that works
(`public_repo` while the repo is public).

### S6. Decap is loaded from unpkg with no Subresource Integrity, and the admin CSP trusts all of unpkg (`site/public/admin/index.html`, `site/scripts/build-headers.mjs`)

`<script src="https://unpkg.com/decap-cms@3.17.1/dist/decap-cms.js">` has no `integrity`. On a
page that holds a GitHub token with write access to the repository, a tampered CDN response
takes over the editor. `script-src https://unpkg.com` also allows every other package on unpkg.
**Fix:** add `integrity="sha384-…" crossorigin="anonymous"` (compute it from the pinned file), and
narrow the CSP to `https://unpkg.com/decap-cms@3.17.1/`. Better still, self-host the pinned
bundle under `/admin/` and drop unpkg. Add `object-src 'none'; base-uri 'self'` to `ADMIN_CSP`.

### S7. The handbook's "checks run on it, a second person publishes it" has no enforcement (repo, `site/docs/HANDBOOK.md` §11, plan §5)

There is no `.github/workflows/` in the repository, so nothing runs `npm test` or
`check-content` on a Decap pull request, and nothing documents branch protection on `main`. The
editorial workflow alone does not stop an editor with write access from merging their own
draft, or from merging copy that breaks LL-7, past every privacy check.
**Fix:** add a CI workflow (`npm ci && npm test && node content/check-content.mjs`, with
`permissions: contents: read`) and document branch protection for `main` in HANDBOOK §11: one
required review, the CI check required, no force-push.

### S8. Header hygiene (`site/worker/headers.ts`)

- `Permissions-Policy: interest-cohort=()` names a feature Chrome removed. Chrome logs
  "Unrecognized feature" and it protects nothing. Replace it with `browsing-topics=()`, and add
  `payment=(), usb=()` while you are there.
- `Strict-Transport-Security: max-age=31536000` has no `includeSubDomains`. Staging is a subdomain
  and everything is HTTPS-only, so add `; includeSubDomains`. Add `preload` only after the owner
  agrees to submit the domain.
- Optional: `X-Frame-Options: DENY` for old browsers that ignore `frame-ancestors`.
- HANDBOOK §10: tell the operator to turn off the Cloudflare zone features that inject inline
  script (Rocket Loader, Email Address Obfuscation, the Web Analytics *automatic* injection,
  because the site builds the beacon in itself). The CSP will block them and log violations.

## Minor / notes

- `contact.ts` sends `remoteip=unknown` to siteverify when `cf-connecting-ip` is missing. Omit
  `remoteip` in that case.
- The comment at the top of `worker/api/mime.ts` points to `tests/unit/worker-security`, which
  does not exist (the tests are in `tests/unit/worker.test.mjs`). Fix the comment.
- `CONTACT_HOSTNAMES` lists only the apex. `isStagingHost` treats `www.` as production, so a
  form sent from `www.theluxuryliners.com` would get 403. Redirect `www` to the apex at the zone,
  or add it to the list.
- The LL-31 contact address is in plain text in `DECISIONS-2026-10-07.md`,
  `QUESTIONS-FOR-CARLY.md` and six critiques. The hard rule only bars it from built output,
  where it is absent, but `content/CHECK.md` lists "the contact address" among the literals to
  hash in the repo. Redact it from the critiques at least, and ask the owner about the
  decision files (same treatment as B1).

## What is good (keep it)

- **Worker contact path:** fails closed when misconfigured (503). Checks the method, then
  `Sec-Fetch-Site` and `Origin` (a `null` Origin is refused). Requires a form content type, caps
  the body at 32 KB before parsing, shares the validation rules with the page, uses a honeypot
  and a timing check, and verifies the token with `hostname` and `action === 'contact'` and a
  5-second timeout. Error messages are generic. Logs carry fixed event codes and never the
  message or an address.
- **E-mail:** no visitor text in any header except a strictly validated `Reply-To`. Verified:
  `\r\nBcc:` and U+2028 in the address → no Reply-To; CRLF in the subject is flattened. The
  subject comes from fixed labels, and the body is base64. `CONTACT_TO` and `TURNSTILE_SECRET`
  live only as Worker secrets.
- **CSP:** no `unsafe-inline`/`unsafe-eval` on the site. Only Cloudflare Insights, Turnstile and
  youtube-nocookie are allowed, and each was exercised in a browser with zero violations. The
  CSP also sets `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` and
  `form-action 'self'`. The facade makes no third-party request before the click. Every page
  is light/dark-switchable with an external script, so no inline script is needed.
- **Dependencies:** 0 audit findings, the lockfile is committed and Decap is version-pinned.
- **`dist/`:** no source maps, no e-mail addresses, no `mailto:`, no dev paths. `/admin/` is
  noindex (meta and header) and is not in the sitemap.
