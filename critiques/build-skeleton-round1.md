# Critique: build-skeleton, round 1

Critic: independent, 2026-11-06. Output reviewed: `/home/user/theluxuryliners.com/site/` at commit `614a52b`, with `content/` as the parallel copy track left it. I checked everything below myself and did not rely on BUILD-LOG claims.

**Score: 7/10. Not approved:** two blocking issues, both small fixes.

## What I ran

| Check | Result |
|---|---|
| `npm ci` | clean, 0 vulnerabilities |
| `npm test` (build + data, unit, dist, jsonld, axe) | **all PASS**: unit 28/28, check-dist 0 errors (13 warnings), JSON-LD 29 pages, axe 112/112 |
| `RELEASE=1 node scripts/check-dist.mjs` | FAIL, as it should without keys: missing `PUBLIC_TURNSTILE_SITE_KEY` and `PUBLIC_CF_ANALYTICS_TOKEN` |
| RELEASE mode on a copy of dist with one injected `PLACEHOLDER` (dummy keys set) | FAIL with `epk/index.html: PLACEHOLDER copy (1)`, so the gate works. Without RELEASE it passes and reports "would fail on 1 PLACEHOLDER block" |
| `_redirects` | 315 rows, all 301. No chains, no self-redirects, every internal target exists in `dist/`, no overlap with the 293 paths in `worker/gone.ts` (410) |
| Screenshots, 1280 and 375 px, DPR 1 (14 pages each) | no horizontal scroll on any page (`scrollWidth` equals the viewport). After scrolling, every lazy image loads (0 broken). Layout is plain and token-based, as asked |
| `dist` grep: e-mail addresses / `david@dewese.com` / gmail | **none.** The only `dewese.com` strings are `daviddewese.com` links. `CONTACT_TO` exists only as a Worker secret |
| `dist` grep: talent show, Mesquite, Baptist, "lives in", demo, download, newsletter, designer credit, `.mp3`/`.zip` files | none. "Designer" appears only as Mark Montgomery's *Sound As Ever* role, not as a logo credit |
| LL-6 one-liner | verbatim on home, in JSON-LD `description`, in llms.txt and in the EPK |
| LL-17 sentence | verbatim on Story, Facts, EPK and llms.txt. "reconnected" never appears outside it |
| JSON-LD MusicGroup | foundingDate 1997; foundingLocation Texas (region TX, no town); founders David (`daviddewese.com/#person`) and Chad; the four forever members with no endDate; sameAs without Bandcamp, with the reason recorded in BUILD-LOG |
| robots.txt / llms.txt / sitemap | `Allow: /` for all agents; llms.txt is good and complete; sitemap-index present |
| Analytics gating / CSP | beacon appears only when the token is set. CSP allows `static.cloudflareinsights.com` and `challenges.cloudflare.com`. The privacy page includes the analytics and Turnstile paragraphs only when those features are built in |

Most of the lost run's known issues are handled:
- Each People › Artwork row names its release.
- No doubled parentheses and no "Photo: Cover art".
- Amy Wilstermann's credit is gated.
- Home blurbs carry no dates.
- Bandcamp is kept out of sameAs, with the reason logged.
- `/vault/mp3s/` points to streaming and never says "not released".
- The 2008 bonus disc row is dropped entirely, which is stricter than asked.
- `/shows/` keeps its notes, has no leading comma and sorts partial dates correctly.
- A stub for the LL-3 check exists.

## Blocking

1. **A single-source cover credit prints without attribution, and the build's own gate is bypassed.**
   - Where: Scott Carpenter painting the *Nonetheless* cover appears on `/people/` twice (in Scott's entry, "painted the pictures on the cover of *Nonetheless*", and in Artwork, "Paintings: Scott Carpenter. Design: David Dewese."). It also appears in `/story/` ch. 7, in `/facts/` (visible text and the FAQPage JSON-LD answer "Who made the cover art?") and in the `/epk/` long bio.
   - Why it is single-source: the credit is not in LL-23. `research/02-discography.md` §3.4 and plan §5 (`/music/nonetheless/`) both mark it **single-source** (the 2010 daviddewese.com discography page). `site/data/artwork.json` itself marks it `"status": "pending"`, and BUILD-LOG says so too.
   - The problem: the release page hides it while five other pages print it as plain fact. This breaks the hard rule "single-source facts only with attribution in the sentence". It is also inconsistent: the build gates photographers against `data/photos.json` "whatever a copy file says" but does not gate cover credits against `artwork.json`.
   - Fix: apply the `artwork.json` status to `content/people.json` `cover_art` (pending rows do not render) and add a check-dist rule. Better still, have Carly confirm B10. Until then, any remaining mention needs the attribution in the sentence, which the copy track owns for Story, Facts and EPK. Flagging it in BUILD-LOG is not the same as not shipping it.

2. **LL-9: Chad is shown as a 1997–2001 member who only guested on the singles.**
   - Where: `/people/` gives Chad's years as "(1997–2001; on the 2026 singles)". llms.txt says "1997 to March 2001, and on the 2026 singles", while the other three read "to today".
   - Why it matters: LL-9 says the four forever members **are the band today** and Chad "is in the band again now". The page's own JSON-LD (no endDate) contradicts the visible text. Machine readers of llms.txt will conclude that Chad left in 2001 and later guested, which is the very misreading LL-41 wants this site to correct.
   - Fix: write something like "1997–2001, and again today" (or "1997–", with the March 2001 departure in the line). Make llms.txt match.

## Should fix (not blocking)

3. **Cover captions read badly.**
   - `/music/shake-it-up-live/` says "Artwork, from a photo by Mark Montgomery: David Dewese.", which reads as if it were a Montgomery photo *of* David. Use "Cover art: David Dewese, from a photo by Mark Montgomery."
   - Every release page repeats the label: "Cover art: David Dewese. Cover art: all rights reserved by the rights holders." Merge the two, or make the second line plain "All rights reserved by the rights holders."
4. **`/vault/mp3s/` says "“Shake It Up (live)”: on Believe EP".**
   - The old live MP3 was the Trunk Box/Waco recording (`/mp3/waco/…`). The Believe EP has the studio version. The line points to a different recording as though it were the same one.
   - Fix: write "the song is on the *Believe* EP" or link the 2021 live single. The same applies wherever an old demo MP3 maps to an album track: say "the song", not the recording.
5. **`/shows/` doubles the place** in two rows: "Shows in Ohio and Michigan, Ohio and Michigan" and "…then a gig in Canada, Michigan and Canada". `where()` should skip `place` when the venue already contains it. Add this to the unit test that covers the null-venue case.
6. **No space before a photo credit.** The figcaption text runs "about 2000.Photo: Mark Montgomery": the credit `<span>` has no leading space, so it reads run-together in reader mode, copy-paste and some screen readers. This affects home, Story and EPK. Add a space or a separator.
7. **Unread Wayback snapshots are linked from `/vault/`** (2000-04-07, 2001-03-08, 2003-05-23, 2020-08-14 home pages).
   - Plan §2 records that Wayback could not be read in this project, and plan R2 requires private rows to have no Wayback link.
   - The 2000 and 2001 pages are very likely to show the old band e-mail, mailing-list form or mailing address. We would be pointing readers at old contact details we have not checked.
   - Keep the descriptions; drop the links until the human browser pass (plan §11) clears each snapshot.
8. **Turnstile is effectively optional for scripts.** The Worker accepts a token-less POST whenever `Sec-Fetch-Site: same-origin`, a header any non-browser client can set. This is a deliberate trade-off so the form works with JavaScript off, and the honeypot plus rate limit help. Still, record it in the handbook §9 as a known spam vector, and consider dropping it if spam arrives.
9. **Member roles differ between pages.**
   - Home: Scott "drums, vocals"; Larry "bass".
   - People: Scott "drums, percussion, vocals"; Larry "bass, keyboards, vocals".
   - JSON-LD: Larry "Bass; keyboards and vocals on *Nonetheless*".
   - Pick one source (people data) for all three.
10. **Gary Ishee "2004–06" (People) and "(2004–06)" (Facts) merge LL-24's two facts** (several shows in 2004–05; guitar on *Nonetheless*). It reads as shows through 2006. Use "several shows, 2004–05; guitar on *Nonetheless* (2006)".
11. **`/vault/` says "theluxuryliners.com has been the band's address since 1998".** Research shows only that the domain was *registered* on 1998-03-20; the first capture is 2000. Use "registered in 1998" or "since 2000".
12. **Privacy page.** "keeps nothing in your browser" should be qualified once Turnstile is built in, because Turnstile may use browser storage on `/contact/`. Check before launch.
13. **check-dist's British-spelling warning fires on "catalogue"** in `/press/`. Either fix the copy or drop the warning; a warning nobody acts on is noise.

## Verdict

The engineering is good and largely verified:
- Tests, redirects/410s, release gating, JSON-LD, the Worker, the handbook and the privacy controls all hold up under independent checking.
- Every one of the lost run's known issues is addressed.

The two blocking items are both content-integrity failures at the integration layer: one hard rule (single-source facts) and one owner decision (LL-9). The build knew about the first and shipped it anyway. Fix 1 and 2 (and ideally 3–7), and this should clear 8.
