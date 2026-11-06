# Audit: functional QA, round 1

Auditor lens: functional QA. Checked: internal links and images, every page type at 1440/768/375/320, theme toggle, 404/410, the contact form front end and Worker, console errors, performance basics.
Build audited: `claude/determined-clarke-5sslfw` at `d20dc9e` (`npm ci && npm run build`; dist/ was copied to a scratch folder so that other agents' concurrent rebuilds could not change it mid-audit).

**Score: 8.0 / 10. Approved: yes (no blocking issues).**

## What was run

| Check | Result |
|---|---|
| `npm test` (data, unit, dist, jsonld, axe) | All pass. The first full run failed in `axe` with `ENOENT dist/404.html` because another agent was rebuilding the shared `dist/` at the same moment (its `npm test` process was running). Re-run alone: `axe: 370 of 370 page checks passed`. Not a site defect; see S6 for the test-harness fragility. |
| Worker unit tests (`tests/unit/worker.test.mjs`) | 49/49 unit tests pass across the unit suite |
| `RELEASE=1` check-dist | Fails only on the missing Turnstile key and analytics token, as expected |
| `node content/check-content.mjs` and `--dist` | 0 errors, 0 warnings |
| Static link and image check (every `href`/`src`/`srcset` in 38 HTML files, plus `#anchors` and `_redirects`) | 1,864 internal references. All resolve except one canonical URL on the 404 page (M1). All 300+ `_redirects` targets exist. The one external target, `/foxymorons/list.html -> https://foxymorons.com/`, is deliberate. |
| Playwright crawl: 37 pages × 1440/768/375/320, CSP header from `_headers` applied, all external requests blocked and logged, full scroll so lazy images load | 0 console errors or warnings, 0 page errors, 0 CSP violations, 0 HTTP ≥ 400 subresources, 0 broken images, 0 images without `alt`/`width`/`height`, 0 horizontal overflow, 0 external requests before user action. Screenshots of home, music, album, story, people, photos, shows, contact, 404 and 410 at all four widths checked by eye: no layout faults. At 320 px the nav wraps to two lines ("Listen" alone on the second line); it reads fine and does not overflow. |
| Theme toggle | Light system: starts light, `aria-pressed=false`. Click: dark, `aria-pressed=true`, `localStorage ll-theme=dark`. Persists to the next page and to a new tab. The same works in reverse from a dark system. With JS off the switch stays `hidden` and the page follows `prefers-color-scheme` (dark = `rgb(17,17,17)`). |
| YouTube facade | No request to YouTube until the click. The click swaps in a `youtube-nocookie.com` iframe titled "Great Day" and moves focus to it. CSP `frame-src` allows it. |
| Worker under `wrangler dev` (local workerd, the real `worker/index.ts`, the dist snapshot as ASSETS) | `/` 200. `/?content=bio` 301 to `/story/`. `/index.php?&content=mailinglist` 301 to `/contact/`. Legacy `_redirects` sample: all 301 to the right pages. Three GONE paths: 410 with the "This page is gone" page. `/nope`: 404 with the "Page not found" page. `/api/x` 404. `GET /api/contact` 405. **`/foo%zz`: 500 (S1).** |
| Contact end to end (local Worker, fake `CONTACT_TO` passed with `--var`) | Same-origin POST: 303 to `/contact/sent/`, one email with `To` = the env value, `Reply-To` = the visitor, subject `[no Turnstile] [theluxuryliners.com] Fan mail`, base64 body. Posts 4 and 5 within 60 s: **429** (rate limit works). `Sec-Fetch-Site: cross-site`: 403. Bad Turnstile token: 422. Empty/invalid fields: 422 page listing all four errors. Front end: `?topic=press` preselects Press; submit sends `elapsed`; the honeypot is sent empty. |
| Address exposure | No email address of any kind appears in built HTML, JS, JSON, XML or llms.txt (admin excluded). `CONTACT_TO` is read only from `env`, and a test (`the contact address is configured only as a secret`) keeps it out of `wrangler.jsonc`. |
| Home page weight (1440, DPR 1) | First load: 11 requests, 252 KB (HTML 23 KB, CSS 23 KB, fonts 93 KB, sprite 64 KB, covers 45 KB, JS 3 KB). After a full scroll: 18 requests, 689 KB. Fonts are self-hosted with `font-display: swap`, and the two upright faces are preloaded. Images are `<picture>` WebP with JPEG fallback, below-the-fold images are `loading="lazy"`, and the hero is eager. Acceptable. |

## Blocking

None.

## Should fix

**S1. The Worker throws (HTTP 500) on any unmatched path with a malformed percent escape.** File: `site/worker/routing.ts:12`.
`isGone()` calls `decodeURIComponent(path)` without a guard. A request for `/foo%zz`, `/100%` or `/%E0%A4%A` misses the assets, reaches `isGone`, and throws `URIError: URI malformed`. I reproduced this under `wrangler dev`: the response is a 500 `text/plain` error, not the site's 404 page. In production the visitor would see a Cloudflare 1101 error page, and the exception is logged as an error. This is not a data leak, but it is an unhandled crash on reachable input.
Fix: `const safeDecode = (p) => { try { return decodeURIComponent(p); } catch { return p; } };` and use it in `isGone`. Add a unit test that `isGone('/foo%zz') === false` and that `respond()` returns 404 for that path. `respond()` in `worker/index.ts` currently has no test at all; see S5.

**S2. The rate limit runs after the Turnstile siteverify call.** File: `site/worker/api/contact.ts:103-107`.
Each POST that carries any `cf-turnstile-response` value makes an outbound siteverify request, with a 5 s timeout, before `RL_CONTACT` is consulted. So one client can drive unlimited siteverify traffic and unlimited Worker CPU time, and bad tokens are never throttled. In my run, posts 4 and 5 with no token were limited, but a flood of bad tokens gets 422 every time and is never limited.
Fix: move the `RL_CONTACT.limit({ key: ip })` check to just after the content-type and size checks, before validation and before `verifyTurnstile`. Then add a test that a limited client with a token is refused with 429 and the fetcher is never called.

**S3. The no-Turnstile path stays open in production.** Files: `site/worker/api/contact.ts` (step 6), `site/wrangler.jsonc` (`vars`).
Once the site key is set, a scripted POST with a forged `Sec-Fetch-Site: same-origin` header and no token is still accepted, only tagged `[no Turnstile]`. The handbook already calls this a known spam route. Today the only brake is 3 per minute per IP.
Fix: decide on this explicitly for launch. Either set `"REQUIRE_TURNSTILE": "1"` in the production `vars` once `TURNSTILE_SECRET` is set (and say on the page that the form needs JavaScript), or keep it open and record the choice in DECISIONS/HANDBOOK so it is not left as a default.

**S4. Contact errors lose the visitor's message, and nothing is checked in the browser.** Files: `site/src/pages/contact/index.astro:22` (`novalidate`), `site/public/js/contact.js`, `site/worker/api/contact.ts:58`.
The form sets `novalidate`, and `contact.js` does no validation of its own. Any mistake (an empty name, a bad email, a message under 10 characters, or sending within 3 s, for example after autofill and a paste) goes through a full POST and lands on the Worker's unstyled error page. That page's only way back is a link, `<a href="/contact/">`, which loads a fresh, empty form. The code comment says "the browser keeps the form's text", but that is only true with the browser's Back button, not this link. Someone who wrote a long message can lose it.
Fix (any one of these):
- (a) With JS on, submit with `fetch` and `Accept: application/json`, which the Worker already supports. Render the returned `errors` inline next to each field, linked with `aria-describedby` and `aria-invalid`, and move focus to an error summary.
- (b) At minimum, drop `novalidate` so the browser's own required/type/minlength checks run first.
- (c) Make the error page's link `href="javascript:history.back()"`. That is blocked by the CSP, so instead tell the visitor "Use your browser's Back button to keep what you typed", or render the page with the submitted values re-filled.
Separately, give the error page the site stylesheet (`<link rel="stylesheet">` to the built CSS).

**S5. Gaps in Worker test coverage for the security-relevant branches.** File: `site/tests/unit/worker.test.mjs`.
- The test named `contact: Turnstile token checked with siteverify (hostname and action)` (line 69) never checks hostname or action. Both stubs return the correct `hostname`/`action`, and only `success` changes. Add cases where `success:true` comes with `hostname:'evil.example'`, and with `action:'other'`; both must give 422. Add a case where the fetcher throws or times out; that must also give 422.
- No test for a missing `TURNSTILE_SECRET` when a token is present. Expected: `verifyTurnstile` returns false, giving 422.
- No test of `respond()` in `worker/index.ts`: 404 body and status, 410 body/status/cache headers, the `FALLBACK` body when the asset page is missing, staging `noindex` and staging robots.txt. Add tests with an `ASSETS` stub.

**S6. The test harness's static server crashes the whole axe run on a missing 404.html.** File: `site/tests/lib/harness.mjs:34`.
The `catch` branch awaits `readFile(join(dist,'404.html'))` with no guard. If `dist/` is being rebuilt, or the 404 page is missing, the error is unhandled and the suite dies with a stack trace instead of reporting failures. This is what happened in this audit's first run.
Fix: wrap it as `readFile(...).catch(() => 'Not found')`, and fail the suite with a clear message ("dist/404.html missing") instead of an unhandled exception. Also consider having `npm test` build into its own directory, or take a lock, since several agents share `site/dist/`.

## Minor

**M1. The 404 page's canonical URL and `og:url` point to `https://theluxuryliners.com/404/`, which does not exist.** The file is `404.html`, and the Worker serves it under any missing path. The 410 page and `/contact/sent/` also carry canonicals although they are `noindex`.
File: `site/src/layouts/Base.astro:16`.
Fix: leave out `canonical` and `og:url` when the page is `noindex` (404, 410, contact/sent).

**M2. `/404` and `/410/` answer 200 when requested directly.** Both are noindex, so this is harmless, but it is untidy.
Fix (optional): in `respond()`, return the matching status for these two paths, or move the bodies to non-routable names such as `/_errors/404.html`.

**M3. The hero cover has no `fetchpriority="high"`.** On home, the LCP image `new-beginning` is `loading="eager"` with `fetchpriority=auto`.
File: `site/src/components/Cover.astro:12`.
Fix: add `fetchpriority={eager ? 'high' : undefined}`. Likewise, the first one or two images on `/photos/` and `/music/` are above the fold but `loading="lazy"`. Pass `eager` to the first card on those pages (`Photo.astro:14`).

**M4. `sizes` undershoots the rendered width at desktop.**
- Hero cover: `sizes="(max-width: 56rem) 84vw, 28rem"` (448 px), but it renders at 532 px at 1440.
- Home "Through the years" backstage photo: `40rem` (640 px), but it renders at 783 px.

The browser can pick a smaller candidate than needed (for example at DPR 1.25 to 1.5).
Fix: measure the real column widths and correct the `sizes` strings in the callers of `Cover.astro` and `Photo.astro`.

**M5. One WebP is larger than its JPEG.** `img/photos/district-2002-1110.webp` (300 KB) is bigger than `district-2002-1110.jpg` (267 KB), and `district-2002-960.webp` is 209 KB.
Fix: in `scripts/prepare-images.mjs`, lower the WebP quality for this source, or keep whichever encoding is smaller per width. Photos are 7.4 MB on disk in total, but each is fetched lazily and only one size, so this costs bandwidth, not correctness.

**M6. The Topic select defaults to "Booking".** There is no empty first option, so the `required` check never fires and a fan who skips the field files their message as Booking.
File: `site/src/pages/contact/index.astro:35`.
Fix: add `<option value="" disabled selected>Choose a topic</option>`. `?topic=` preselection still works, and the server already rejects an empty topic.

**M7. The italic font (39 KB) loads on the first view of home even though it is not preloaded.** It is used early somewhere on the page.
Fix: if the use is decorative, either preload it as well, so it does not cause a late swap, or stop using italic above the fold. This is a small first-load saving or a small layout-shift fix.

## Owner-decision and privacy spot checks (within this lens)

- No email address in any built text file.
- No download links, MP3 files or newsletter form. `/vault/mp3s/` lists titles only and points to streaming (LL-27, LL-40).
- The contact page prints no address (LL-31).
- No logo designer credit in the footer (LL-39).

No violations found.

## Verdict

The built site works. Every page renders cleanly at all four widths, with no console errors or CSP violations, no broken links or images, a working and persistent theme switch, correct 404/410/legacy routing, and a contact Worker whose Turnstile, origin, size, honeypot and rate-limit checks behave as designed. The address comes only from `env.CONTACT_TO`.

The score is held at 8.0 by:
- the unguarded `decodeURIComponent` crash (S1),
- the limiter placed after siteverify (S2),
- the form's poor error recovery (S4),
- Worker tests whose names promise more than they check (S5).

All of these should be fixed before launch.
