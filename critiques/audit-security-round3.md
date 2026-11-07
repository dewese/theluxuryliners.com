# Security audit, round 3

**Auditor lens:** security (Worker input validation, Turnstile server-side, rate limiting, e-mail
header injection, secrets, error messages, security headers and CSP, Decap CMS auth, dependencies,
secrets and private data anywhere in the repository, source maps).
**Date:** 2026-11-06. **Branch:** `claude/determined-clarke-5sslfw` at `37d958e`.
**Site files edited:** none (this report is the only file committed).

## Verdict

**Score: 7.5 / 10. Not approved** (one blocking issue: private details in a tracked file of a
repository that is public right now).

The site and the Worker are in good shape. Every round-2 item is fixed, and each fix has a test:
`npm test` is green, the editor page loads, the private-literal digests are keyed (HMAC) and fail
closed in CI and release builds, the Worker applies the editor's CSP and COOP under `/admin/` on
staging, staging requires Turnstile, the body read stops at 32 KB, the Actions are pinned by SHA,
and tracked images are checked for GPS EXIF. I found no vulnerability in the Worker, the headers
or the client scripts. What keeps this from approval is not code. The current tree of the public
repository still names the founding-story town (a hard LL-7 rule: "never the founding town") and
the LL-31 contact address, in `DECISIONS-2026-10-07.md`. The checker exempts that file
(`REPO_EXCEPTIONS`) and the build log hands it to the owner. But the leak is live today, and part
of it can be fixed in the tree without any history rewrite.

## What I ran

| Check | Result |
|---|---|
| `cd site && npm ci && npm test` | 37 pages built; data, unit, dist, jsonld, repo (self-test 53/53), axe 370/370, behaviour 223/223: **all PASS** |
| `RELEASE=1 node scripts/check-dist.mjs` | fails only on the two expected keys (`PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CF_ANALYTICS_TOKEN`) |
| `node content/check-content.mjs`, `--repo` | 0 errors, 0 warnings (the key is present locally) |
| `npm audit`, `npm audit --omit=dev` | 0 vulnerabilities |
| `gh api repos/dewese/theluxuryliners.com` | `private: false`, `visibility: public` |
| Keyed private-literal scan of **every** tracked text file (no exceptions) | hits only in `DECISIONS-2026-10-07.md`: line 10 (P7, the founding-story town) and line 59 (P1, the contact address) (B1) |
| `git grep` and `git log -p --all` for keys (`0x4AAA…`, `ghp_`, `github_pat_`, `AKIA…`, `AIza…`, `sk-`, `xox?-`, private keys); tracked `.env`, `.dev.vars`, `.key`, `.pem`, `data/private/` | none; `data/private/` and `.dev.vars` are git-ignored |
| `git grep` for e-mail addresses and phone numbers | only synthetic test probes (`theband@gmail.com`, `615-555-0100`) and the LL-31 address in the decisions file |
| `dist/` grep: the LL-31 address, `david@`, `sourceMappingURL`, `*.map` | none |
| `dist/` images (146): EXIF or XMP | 0 |
| `dist/` data files | only `admin/config.yml` (field schema, no content); no `notes_internal`/source data shipped |
| Browser CSP sweep (Chromium via playwright-core, `dist` served with the `_headers` CSP, `/admin/*` with `ADMIN_CSP`): all 38 HTML pages | 0 CSP violations, 0 page errors, 0 third-party requests (except the pinned Decap file on `/admin/`) |
| YouTube facade click (`a.yt`) on `/` and `/music/great-day/` | iframe `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0`, `referrerpolicy=strict-origin-when-cross-origin`, 0 violations; nothing from YouTube before the click |
| Worker driven in Node (stub bindings, production vars): no token and no `Sec-Fetch-Site`/`Origin`; `Origin: https://theluxuryliners.com.evil.example`; `Origin: http://…`; `Sec-Fetch-Site: same-site`; siteverify answering a wrong hostname; a wrong action; a good token; `ALLOW_NO_JS_CONTACT=1` with `REQUIRE_TURNSTILE=1` | 403, 403, 403, 403, 422, 422, 303 (one message), 403. Every response carries the CSP |
| Worker: staging `/admin/`; staging `/%61dmin/`; `GET /api/contact`; `/?content=//evil.com` | admin CSP + COOP `same-origin-allow-popups` + noindex; 404 with the site CSP; 405 `Allow: POST`; 404 (no open redirect) |
| `wrangler deploy --dry-run` (local bundle only, nothing uploaded) | builds; bindings `SEND_EMAIL`, `RL_CONTACT` (3/60 s), `ASSETS`, vars only; no secrets in `vars`; no `upload_source_maps` |
| Client scripts (`public/js/*.js`): `innerHTML`, `insertAdjacentHTML`, `eval`, `document.write` | none; errors are built with `textContent`; the `?topic=` value is stripped to `[a-z-]` before use in a selector |

## Blocking

### B1. The public repository's current tree names the founding-story town and the contact address (`DECISIONS-2026-10-07.md`, lines 10 and 59)

The repository is public (checked with the GitHub API). Line 10 (LL-4) names the town from the
founding story in bold, and line 11 (LL-5) says whose house it was. The hard rules say "never the
founding town" for the public repo as well as the site (LL-7, plan §2). Line 59 (LL-31) prints
the contact address, which is otherwise kept only as the Worker secret `CONTACT_TO`. This is not
just history: anyone can read it today in GitHub's file view, and code search indexes it.
`content/check-content.mjs` exempts the file (`REPO_EXCEPTIONS`), so `npm test` stays green. The
reason given is that "only the owner edits the decisions file". That rule was set by the build
log, not by the owner, and Claude wrote every commit of this file. The history question (purge,
accept, or make the repository private) is rightly the owner's. The tree is a separate problem,
and it can be fixed now with one-line rewording that changes no decision.
**Fix:**
1. Ask the owner in one line (add it to `QUESTIONS-FOR-CARLY.md` as a launch gate) to approve
   rewording two cells. Until they answer, treat this as a launch blocker.
2. Once approved, in `DECISIONS-2026-10-07.md`:
   - LL-4: replace the town with "a Texas town (named in the git-ignored
     `data/private/decisions-private.md`)".
   - LL-31: replace the address with "the owner's address (Worker secret `CONTACT_TO`; in
     `data/private/decisions-private.md`)".
   Move the exact wording of both cells into `data/private/decisions-private.md`.
3. Then remove the file from `REPO_EXCEPTIONS` in `content/check-content.mjs`, so the `--repo`
   check covers every tracked file with no exceptions. Re-run
   `node content/check-content.mjs --repo` (expect 0 errors) and `npm test`.
4. Keep "Owner decisions needed" item 1 (history) in `site/BUILD-LOG.md` as it is.

If the owner prefers, make the repository private until launch. That also closes B1 and the
history item, and needs no code change.

## Should fix

### S1. JSON written into `<script>` blocks is not escaped for `</script>` (`site/src/layouts/Base.astro` line 57; `site/src/pages/contact/index.astro` line 30)

`<script type="application/ld+json" set:html={JSON.stringify(ld)} />` writes raw JSON, and `set:html`
does not escape it. The JSON-LD includes the page name, which comes from editable copy (story
titles through Decap). A title containing `</script><img …>` would end the block early and inject
markup into every page that carries it. The CSP (no `unsafe-inline`) blocks script execution, and
edits go through reviewed pull requests, so the risk is low. But the CSP should not be the only
defence. The same applies to the `#contact-rules` block.
**Fix:** add a helper `safeJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c').replace(/ /g, '\\u2028').replace(/ /g, '\\u2029')`
in `src/lib/` and use it at both call sites. Add a dist test that no
`<script type="application/ld+json">` body contains a literal `<`.

### S2. Markdown link targets are not attribute-escaped (`site/src/lib/markdown.ts` line 14)

`inline()` escapes `& < >` but not `"`, then writes `<a href="$2">`. Today a `"` in a link target
cannot break out, but only because `smart()` happens to curl it to `”` first. If someone changes
`smart()` or the order of the steps, `[x](https://a"onmouseover="…)` gives attribute injection.
The CSP would still block the handler. The same curling also corrupts any real URL that contains
a quote.
**Fix:** run `smart()` on the link text only. Build the href from the raw target with a real
attribute escape (`&` `"` `<` `>`), and keep the `https?://` or `/` allowlist. Add a unit test
with `"` and `'` in a link target.

### S3. Decap has no sign-in endpoint configured, so it would default to Netlify's (`site/public/admin/config.yml`, `backend`)

`base_url` is only a comment. Decap's GitHub backend without `base_url` opens its sign-in popup
at `api.netlify.com`. On this host that either fails, or it sends the editor through a third
party the handbook never mentions. HANDBOOK §11 says to set it at hosting time, but nothing checks
that.
**Fix:** make `RELEASE=1 node scripts/check-dist.mjs` fail when `dist/admin/config.yml` has no
`base_url:` under `backend` (and when it is not `https://`). Also set
`auth_endpoint` explicitly once the helper exists.

## Minor / notes

- `ADMIN_CSP` (`site/worker/headers.ts`) has no `form-action`. Add `form-action 'none'` (Decap
  posts nothing) and `upgrade-insecure-requests`, to match the site CSP. Note in the comment that
  `img-src https:` and `style-src 'unsafe-inline'` are needed by the Decap previews and its
  CSS-in-JS.
- `QUESTIONS-FOR-CARLY.md` line 154 says where David lives and that the members are spread across
  four states. David publishes his city on his own site (F3), so this is not a leak. But it sits
  close to the "never which member lives where" rule in a public file. Reword it to "Where is the
  band based today? (see F3)".
- No `/.well-known/security.txt`. Add one with a `Contact:` that is the contact page URL (never
  the LL-31 address) and an `Expires:` date.
- HSTS has no `preload`. That is fine for now. Add it only after the owner confirms that every
  subdomain is HTTPS-only for good.
- The `SEND_EMAIL` binding is "unrestricted". Cloudflare only delivers to verified destination
  addresses, and restricting it in `wrangler.jsonc` would put the address in the repo. Keep it
  unrestricted, and make sure the account has only one verified destination (handbook §9).
- `wrangler deploy --dry-run` writes `index.js.map` locally. Nothing uploads it
  (`upload_source_maps` is unset). Keep it that way, and do not add `upload_source_maps: true`
  unless the map is checked first.
- CI fails closed until the owner adds the `PRIVATE_LITERALS_KEY` repository secret. This is
  correct, and it is already in "Owner decisions needed" item 2.

## What is good (keep it)

- **Contact Worker:** the order of checks is right (configuration, method, `Sec-Fetch-Site` and
  exact `Origin`, content type, declared and streamed size cap, rate limit before any parsing or
  siteverify, honeypot, shared validation, then Turnstile). Turnstile is verified on the server
  with hostname, action, a 5 s timeout and fail-closed errors. `REQUIRE_TURNSTILE=1` in production
  and staging overrides the no-JS opt-in. Error messages are generic, and the logs hold fixed
  event codes only, never message text or addresses.
- **E-mail:** visitor text reaches no header except a strictly validated ASCII `Reply-To`. The
  subject is built from fixed labels and RFC 2047-encoded. Every header value is stripped of
  CR/LF/NEL/LS/PS and control characters. The body is base64. The refilled form escapes everything
  and uses replacement callbacks.
- **Headers:** the site CSP has no `unsafe-inline` or `unsafe-eval`. Its only outside origins are
  Cloudflare Insights (script and connect), Turnstile (script and frame) and
  `www.youtube-nocookie.com` (frame, loaded after the click). It also sets `frame-ancestors 'none'`,
  `object-src 'none'`, `base-uri 'self'` and `form-action 'self'`. HSTS with `includeSubDomains`,
  `nosniff`, `strict-origin-when-cross-origin`, a Permissions-Policy, COOP and
  `X-Frame-Options: DENY` are on every response, Worker-built and staging included. The values
  live in one source of truth, `worker/headers.ts`, which also generates `dist/_headers`.
- **Decap:** pinned version with a correct SRI hash. The script now sits in `<body>`, and the
  browser test loads the real bundle. The CSP allows that one file. COOP is
  `same-origin-allow-popups` on both the static and the Worker path. The editorial workflow runs
  through pull requests with CI checks.
- **Repo and dist:** HMAC-keyed private-literal digests with generic labels. The key is
  git-ignored locally and comes from a CI secret, and the check fails closed in CI and release
  builds. No secrets in the tree or history. No source maps, EXIF, addresses or dev paths in
  `dist`. `/admin/` is noindex and out of the sitemap. 0 dependency advisories. The Actions are
  SHA-pinned, with `persist-credentials: false` and `contents: read`.
