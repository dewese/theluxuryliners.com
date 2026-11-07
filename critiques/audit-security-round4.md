# Security audit, round 4

**Auditor lens:** security (Worker input validation, Turnstile server-side, rate limiting, e-mail
header injection, secrets, error messages, security headers and CSP, Decap CMS auth, dependencies,
secrets and private data anywhere in the repository, source maps).
**Date:** 2026-11-06. **Branch:** `claude/determined-clarke-5sslfw` at `4ef31e8`.
**Site files edited:** none (this report is the only file committed). Private literals are named
by their id (P1–P8) only.

## Verdict

**Score: 8.6 / 10. Approved** (no blocking issue).

I checked each round-3 item against the code, not the commit message. B1 is fixed in the tree:
the decisions file names the town and the address by role, `REPO_EXCEPTIONS` is empty, and a plain
(not hashed) case-insensitive scan of every tracked file for all eight private literals finds
nothing. S1, S2 and S3 are fixed, and each has a test. Every minor item from round 3 that was
asked for is done (`form-action 'none'` and `upgrade-insecure-requests` on the admin CSP,
`security.txt`, the B11 rewording). The Worker has not changed since round 3, except for the admin
CSP string. `npm test` is green.

What is left is small. Three should-fix items are hardening, and none of them is exploitable
today: a private-use marker in the new link code that editable copy can smuggle in, `//host`
links that pass the internal-link allowlist, and the CI private-literal check, which is off until
the owner adds the secret.

## What I ran

| Check | Result |
|---|---|
| `cd site && npm ci && npm test` (CHROMIUM set) | data, unit (96/96), dist, jsonld (38 pages), repo (0 errors, self-test 53/53), axe 370/370, behaviour 231/231: **all PASS** |
| `node content/check-content.mjs --repo` | 0 errors, 0 warnings, with `REPO_EXCEPTIONS` now empty |
| `RELEASE=1 node scripts/check-dist.mjs` | fails on 4 expected gates: Turnstile key, analytics token, G1 (`journalDerivedApproved`), Decap `base_url` |
| `npm audit`, `npm audit --omit=dev` | 0 vulnerabilities |
| `gh api repos/dewese/theluxuryliners.com` | still `public` |
| **Plain** scan of every tracked file (`git ls-files`, every line, case-insensitive, also with regex escapes removed) for P1–P8 from the git-ignored list | **0 hits** |
| Same scan of `dist/` | 0 hits in anything served. `dist/_redirects` holds P2 and P3 in old source paths (see note N1) |
| `git log --all -S` for P1–P8 | all eight are still in history (owner item O1) |
| `git grep` for keys (`ghp_`, `github_pat_`, `AKIA…`, `AIza…`, `sk-`, `xox?-`, private keys, `0x4AAA…`); tracked `.env`, `.dev.vars`, `.pem`, `.key`, `.map`, `data/private/` | none |
| `git grep` for e-mail addresses | only synthetic probes (`example.com/.org/.test`, `a@b.co`, `theband@gmail.com`) and the public sender `contact-form@theluxuryliners.com` |
| `dist/`: `*.map`, `sourceMappingURL` | none |
| `dist/_headers` | site CSP unchanged (no `unsafe-inline`/`unsafe-eval`, `frame-ancestors 'none'`); HSTS, `nosniff`, Referrer-Policy, Permissions-Policy, COOP, XFO on `/*`; `/admin/*` CSP now has `form-action 'none'` and `upgrade-insecure-requests` |
| `git diff 12e863c HEAD -- site/worker site/public/js wrangler.jsonc` | only `worker/headers.ts` (the admin CSP string) changed. The Worker logic verified in round 3 is unchanged |
| Probes of `mdInline` (Node, type stripping) | see S1 and S2 below |

## Round-3 items, verified

| Item | Status | Evidence |
|---|---|---|
| **B1** decisions file names the town and the address | **Fixed in the tree** | `DECISIONS-2026-10-07.md` LL-4 says "a Texas town", LL-31 says "the owner's address (the Worker secret `CONTACT_TO`)". The exact wording is in `data/private/decisions-private.md`, which is git-ignored (checked with `git check-ignore`). `content/check-content.mjs`: `REPO_EXCEPTIONS = new Set([])`. Plain scan: 0 hits. Owner sign-off is tracked as launch gate G3 in `QUESTIONS-FOR-CARLY.md` |
| **S1** JSON in `<script>` not escaped | **Fixed** | `src/lib/json.ts` `safeJson` escapes `<`, `>`, U+2028 and U+2029. It is used in `Base.astro` (JSON-LD) and `contact/index.astro` (`#contact-rules`). `tests/dist/audit3.test.mjs` checks that no JSON block in any page holds `<` and that each block parses, plus a round-trip unit test. No other `<script … set:html>` exists in `src/` |
| **S2** markdown href not attribute-escaped | **Fixed**, with a new edge case (S1 below) | Link targets are pulled out before `smart()`. They are escaped with `attr()` (`& " < >`). The allowlist is kept. Unit tests cover `"`, `'`, `&`, `<>` and a breakout attempt |
| **S3** Decap has no sign-in endpoint | **Fixed as a release gate** | `RELEASE=1 check-dist` fails without an `https://` `base_url` under `backend:` (a commented line does not count; checked). Tested in `audit3.test.mjs`. `auth_endpoint` is documented as a comment; it is fine to set it at hosting time |
| Minor: admin CSP `form-action`, `upgrade-insecure-requests` | Done | `worker/headers.ts`, `dist/_headers`, test |
| Minor: B11 wording in `QUESTIONS-FOR-CARLY.md` | Done | "Where is the band based today? (see F3)" |
| Minor: `security.txt` | Done | `public/.well-known/security.txt`: contact page URL, no address, `Expires` 2027-11-06, `Canonical`. Tested |
| Minor: HSTS `preload`, unrestricted `SEND_EMAIL`, local `index.js.map` | Unchanged, as advised | no `upload_source_maps` in `wrangler.jsonc` |

## Blocking

None.

## Should fix

### S1. Editable copy can inject the new link-placeholder characters (`site/src/lib/markdown.ts`, `inline()`)

The S2 fix marks link *n* as `]n` and then replaces every such marker in the escaped
text. Input that already holds those characters is not stripped, so copy can forge a marker.
- `"[a]5"` makes `targets[5]` `undefined`, and `attr(undefined)` throws, so **the build
  crashes** (a denial of service against publishing, from one Decap edit).
- `"[a]0 and [b](/x)"` gives `<a href="/x">a</a>`: the first text gets the second
  link's target.

This cannot cause XSS, because every reachable target has already passed the allowlist and
`attr()`. But a copy field should never be able to crash the build.
**Fix:** at the start of `inline()`, strip the markers (`s = s.replace(/[]/g, '')`).
In the final replace, fall back to the plain text when `targets[i]` is `undefined`. Add both
probes above to `tests/unit/helpers.test.mjs`.

### S2. `//host` passes the internal-link allowlist (`site/src/lib/markdown.ts`, `LINK`)

`(?:https?:\/\/|\/)` accepts `//evil.example/p`, a protocol-relative *external* link that looks
like a site path in review: `[x](//evil.example/p)` gives `<a href="//evil.example/p">`. Editors
are trusted and their edits go through PRs, so this is low risk. But the allowlist does not do
what its shape suggests.
**Fix:** change the path branch to `\/(?!\/)`, and add a unit test that `[x](//a.example)` stays
text.

### S3. CI does not run the private-literal check until the owner adds the secret (`.github/workflows/ci.yml`; commit `55e62fb`)

Since round 3, CI sets `PRIVATE_LITERALS_OPTIONAL=1` when `secrets.PRIVATE_LITERALS_KEY` is
empty, so the `repo` and dist privacy checks only warn there. Release builds still refuse to run
without the key (`STRICT` in `content/private-literals.mjs`), and local runs have the key. But
Decap's editorial workflow merges through PRs, and CI is the only check on those. Until the secret
exists, an editor's PR that adds a private literal goes green. (I could not read the repository's
secrets list: the proxy blocks the Actions API.)
**Fix:** this is an owner action. Add `PRIVATE_LITERALS_KEY` as a repository secret before the
editor is opened to anyone, and then remove the `PRIVATE_LITERALS_OPTIONAL` lines. Until then,
put "add the CI secret" next to G3 as a launch gate in `QUESTIONS-FOR-CARLY.md`, so it is not
only in the build log.

## Minor / notes

- **N1. `dist/_redirects` holds P2 and P3** in old URL paths. They come from the git-ignored
  `data/private/legacy-urls.private.json`. Cloudflare's documentation says `_redirects` "will not
  itself be served as a static asset", and `check-dist` exempts it deliberately. On the first
  staging deploy, confirm that `GET /_redirects` and `GET /_headers` return 404. Never deploy
  `dist/` to a host other than Workers or Pages, because another host would serve the file.
- **N2. Fallback facts path** (`site/src/lib/views.ts` line 105): `{{link:(\/[^|}]*)|…}}`
  writes `href="$1"` after an `esc()` that does not escape `"`. It runs only when
  `content/facts.json` has no facts, and `site/data/facts.json` is not editable in Decap, so it
  cannot be reached from the editor. Use `attr()` from `markdown.ts` there anyway, or delete the
  fallback.
- **N3.** `[x*](/a) *y*` gives `<a href="/a">x<em></a> </em>y*`, which is badly nested markup.
  This is older than the S2 fix and is not a security bug (the parser repairs it), but it shows
  emphasis can span a link boundary. Running the link pass before the emphasis passes would fix
  it.
- `security.txt` expires 2027-11-06. The test fails once that date passes, which is the right
  reminder.
- HSTS `preload`: still add it only after the owner confirms every subdomain is HTTPS-only.

## Owner item (not a blocker)

- **O1. History.** All eight private literals (P1–P8), not only the two decision-file cells, are
  still in the public repository's git history. This is already "Owner decisions needed" item 1
  in `site/BUILD-LOG.md`: accept it, purge history, or make the repository private.

## What is good (keep it)

- The B1 fix is the right shape. The public file keeps every decision and drops only the two
  details. The exact wording lives in a git-ignored file. The checker now has no exemptions, and
  the owner is asked for one line of sign-off (G3).
- The S1 and S2 fixes each come with a test that would catch a regression, at both the unit and
  the built-page level.
- Launch gates (G1 journal approval, Decap `base_url`) are enforced by `RELEASE=1`, not left to
  memory.
- The Worker, headers, Turnstile, rate limit, e-mail header handling and client scripts are as
  verified in round 3, with no regressions. There are 0 dependency advisories, no source maps, and
  no secrets in the tree.
