# Security audit, round 2

**Auditor lens:** security (Worker input validation, Turnstile server-side, rate limiting, e-mail
header injection, secrets, error messages, security headers and CSP, Decap CMS, dependencies,
secrets and private data anywhere in the repository, source maps).
**Date:** 2026-11-06. **Branch:** `claude/determined-clarke-5sslfw` at `5eaab60`.
**Site files edited:** none (this report is the only file committed).

## Verdict

**Score: 7.0 / 10. Not approved** (two blocking issues: `npm test` fails on HEAD, and `/admin/`
renders a blank page).

Round 1's findings were taken seriously and almost all are fixed properly, with tests:
Turnstile now fails closed (S1), malformed escapes no longer crash the Worker and errors give a
500 page with headers (S2), staging responses carry the security headers (S3), the rate limiter
runs before parsing and siteverify (S4), `/admin/` has COOP `same-origin-allow-popups` (S5),
Decap is pinned with a correct SRI hash and the admin CSP allows that one file only (S6), CI and
branch protection are in place (S7), and the header hygiene items are done (S8). The private
literals are gone from every tracked file except the owner's decisions file (a documented
exception), and a `--repo` check now guards that. But HEAD does not pass its own test suite, and
the CMS page does not work at all.

## What I ran

| Check | Result |
|---|---|
| `cd site && npm ci && npm test` | builds 37 pages; data, unit, dist, jsonld, axe (370/370, behaviour 200/200) PASS; **`repo` FAIL** (B1) |
| `RELEASE=1 node scripts/check-dist.mjs` | fails only on the two expected keys (`PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CF_ANALYTICS_TOKEN`) |
| `node content/check-content.mjs`, `--dist site/dist` | 0 errors (12 LL-27 history warnings in `--dist`) |
| `node content/check-content.mjs --repo` | **1 error** (B1) |
| `npm audit`, `npm audit --omit=dev` | 0 vulnerabilities |
| `dist/` grep: the LL-31 address, `mailto:`, Gmail, `localhost`, `/home/user`, `file://` | none |
| `dist/` source maps (`*.map`, `sourceMappingURL`) | none |
| `dist/` images with EXIF; tracked images with GPS EXIF | 0; 0 (93 tracked images carry non-GPS EXIF) |
| `git grep` + `git log -p --all` for keys (`0x4AAA…`, `ghp_`, `github_pat_`, `AKIA…`, `AIza…`, `sk-`, `xox?-`, private keys), tracked `.env`/`.dev.vars`/`.pem` | none |
| Browser CSP (dist served with `SECURITY_HEADERS`, Chromium via playwright-core, `securitypolicyviolation` listener) on `/`, `/music/great-day/`, `/music/overbored/`, `/contact/`, `/story/`, `/photos/`, `/vault/`, `/epk/` | 0 violations; 0 third-party requests before the facade click; after the click the iframe is `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0`, still 0 violations |
| `/admin/` under `ADMIN_CSP`, with the real pinned `decap-cms@3.17.1` bundle (fetched; its sha384 matches the `integrity` attribute) | 0 CSP violations, **but a `TypeError` and a blank page** (B2) |
| Worker driven in Node (stub bindings): forged `Sec-Fetch-Site` with no token and a secret set; `REQUIRE_TURNSTILE` with no secret; siteverify answers with a wrong hostname or wrong action; CRLF in name/email; reflected `"><script>` / `</textarea>` / `$&` in the refilled form; a 5 MB chunked body with no `Content-Length`; `/%E0%A4%A`; `/?content=http://…` | 403 nothing sent; 403; 422; 422; 422; all escaped; 413; 404 with headers; 404 (no open redirect) |
| `dist/_redirects` external targets | one fixed same-band target only; no open redirect |

## Blocking

### B1. `npm test` fails on HEAD: the LL-31 contact address is in plain text in `critiques/audit-copy-round2.md` (line 5)

The round-2 copy audit (`5eaab60`) wrote the contact address literally while reporting that it
is absent from `dist`. The `repo` stage of `npm test` (and `check-content.mjs --repo`) now fails:
`ERROR [private-literal-repo] critiques/audit-copy-round2.md line 5 … the contact address`. CI
on `main` would be red, and the repository is public, so the address is now in a tracked file
outside the owner's own decisions file (against `content/CHECK.md` and the round-1 B1 fix).
**Fix:** in `critiques/audit-copy-round2.md` line 5, replace the literal with "the LL-31 contact
address". Re-run `node content/check-content.mjs --repo` (expect 0 errors) and `npm test`.
Add one line to the auditor brief / `content/CHECK.md`: critiques must name private literals
by role, never by value. (The literal is now in public history too: add it to the owner's
history-purge question already listed in `site/BUILD-LOG.md`, "Owner decisions needed".)

### B2. `/admin/` (Decap CMS) is a blank page: the editor script runs before `<body>` exists (`site/public/admin/index.html`)

`<script src="https://unpkg.com/decap-cms@3.17.1/dist/decap-cms.js" …>` is a classic,
synchronous script in `<head>`. Decap mounts itself on `document.body` as soon as it runs, which
is still `null` there. Verified in Chromium with the real pinned bundle (served for the unpkg URL
by request interception, under the exact `ADMIN_CSP`): page error
`Cannot read properties of null (reading 'appendChild')`, empty page, no sign-in button. Moving
the same tag (same SRI, same CSP) into `<body>` gives "Login with GitHub" and 0 errors and 0
CSP violations. So the whole editorial workflow in HANDBOOK §11 cannot start. No test catches it:
the axe suite skips or does not load `/admin/` with the CDN script.
**Fix:** move the `<script … integrity=… crossorigin="anonymous">` tag to the end of `<body>`
(as in Decap's install docs), or keep it in `<head>` with `defer`. Add a dist test that
`dist/admin/index.html` has the Decap `<script>` after `<body>` (or with `defer`) and carries an
`integrity` attribute. If the browser suite can, add a check that loads `/admin/` with the
bundle routed from a local copy and asserts no `pageerror`.

## Should fix

### S1. The private-literal hashes are unsalted SHA-256 of single dictionary words, labelled with what they are (`content/private-literals.mjs`)

`PRIVATE_HASHES` stores `sha256(lowercased token)` with labels such as "a town from the founding
story (LL-4, LL-5)", "a college name" and "a private family name". Towns, colleges and surnames
come from small public lists (a few thousand entries), so anyone reading the public repo can
hash every Texas town or US college name and recover the literal in seconds. The label tells
them which list to try. I did not attempt it; it is trivial. The scheme hides the literal from a
casual reader, which is useful, but it does not protect it.
**Fix:** switch to a keyed hash: `HMAC-SHA256(key, token)`, with the key in the git-ignored
`data/private/` locally and as a GitHub Actions secret in CI (`env: PRIVATE_LITERALS_KEY`), and
have the checker fail closed in CI and with `RELEASE=1` when the key is missing. Make the labels
generic ("private literal 3, LL-7"). Rotate by re-hashing; the old unkeyed hashes stay in history,
so add this to the owner's history question.

### S2. Staging: the Worker overwrites `/admin/`'s CSP and COOP, and staging does not require Turnstile (`site/worker/index.ts`, `site/wrangler.jsonc`)

- Staging runs `run_worker_first: true`, so `/admin/` passes through `withSecurityHeaders()`,
  which `set`s the site CSP and `Cross-Origin-Opener-Policy: same-origin` over the asset's
  headers. Verified: a staging `/admin/` response gets `script-src 'self' …` (no unpkg) and COOP
  `same-origin`, so Decap is blocked on staging even after B2 is fixed, and the OAuth popup
  would lose its opener. **Fix:** in `index.ts`, for paths under `/admin/` apply `ADMIN_CSP`
  (move it from `scripts/build-headers.mjs` into `worker/headers.ts` and import it in both) and
  COOP `same-origin-allow-popups`; add a unit test for a staging `/admin/` response.
- Staging `vars` have no `REQUIRE_TURNSTILE`. If `TURNSTILE_SECRET` is ever missing on staging
  (HANDBOOK §9 says to set it, but nothing checks), a script with a forged
  `Sec-Fetch-Site: same-origin` and no token gets a message delivered (verified: 303, one message
  sent). Cloudflare Access mitigates this only if it is set up. **Fix:** add
  `"REQUIRE_TURNSTILE": "1"` to `env.staging.vars`.

### S3. A body with no `Content-Length` is buffered whole before the size cap (`site/worker/api/contact.ts`, `await req.arrayBuffer()`)

The 32 KB cap is checked on the declared length, then on the buffered body. A chunked request
with no `Content-Length` is read completely into memory first (a 5 MB probe was read in full,
then 413). Workers accept request bodies up to 100 MB, so a few such requests can push the
isolate toward its 128 MB memory limit, which ends in an uncatchable error (Cloudflare 1101, no
security headers). The rate limiter blunts it per IP, not per botnet.
**Fix:** require `Content-Length` (411 when missing), or read `req.body` with a reader and stop
with 413 as soon as the running total passes `MAX_BODY`. Add a unit test with a chunked body.

## Minor / notes

- `.github/workflows/ci.yml` pins `actions/checkout@v4` and `actions/setup-node@v4` by tag. Pin
  both to a full commit SHA (with the tag in a comment) so a moved tag cannot run new code in CI.
- Decap uploads (`media_folder: assets/source/photos`) go straight into the public repo with
  their EXIF intact. No tracked image has GPS today, and `dist` images are stripped, but an
  editor's phone photo would publish its location in the repo. Add a `--repo` rule (or a CI step)
  that fails on GPS EXIF in tracked images, and a line in HANDBOOK §11.
- `contact.ts` rate-limits by `cf-connecting-ip ?? 'unknown'`. In production Cloudflare always
  sets the header, but log `contact_no_ip` when it is missing so a shared `unknown` bucket is
  visible.
- `ADMIN_CSP` keeps `img-src … https:` and `style-src 'unsafe-inline'`; both are needed by
  Decap previews and its CSS-in-JS. Acceptable on a noindex page; note it in the comment.

## What is good (keep it)

- **Contact Worker:** fail-closed configuration (503), method, `Sec-Fetch-Site` and `Origin`
  checks, form content type, 32 KB cap, rate limit before any costly work, honeypot, timing,
  shared validation, siteverify with hostname, action and a 5 s timeout, `remoteip` only when
  known, and a missing token refused whenever a secret is set or `REQUIRE_TURNSTILE` is on.
  Production `vars` set `REQUIRE_TURNSTILE: "1"`. Generic error messages; fixed log event codes.
- **E-mail:** visitor text reaches no header except a strictly validated `Reply-To`; subject from
  fixed labels; base64 body. The refilled no-JS form escapes everything it echoes back and uses
  replacement callbacks, so `$&` and `</textarea>` cannot break out.
- **Headers:** CSP with no `unsafe-inline`/`unsafe-eval` on the site, `frame-ancestors 'none'`,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`; only Cloudflare Insights,
  Turnstile and youtube-nocookie (after the click) are allowed. HSTS with `includeSubDomains`,
  `nosniff`, `strict-origin-when-cross-origin`, a current Permissions-Policy, COOP, and
  `X-Frame-Options: DENY`. The Worker sets the same headers on every response, staging and the
  500 page included.
- **Decap:** pinned version, correct SRI, CSP limited to that one file, COOP for the OAuth popup,
  handbook rules for the helper (`postMessage` to the site's origin, `public_repo` scope).
- **Repo and dist:** no secrets in the tree or history, `.dev.vars` ignored, no source maps, no
  addresses or dev paths in `dist`, `/admin/` noindex and out of the sitemap, 0 audit findings.
