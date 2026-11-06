# Critique: build-skeleton, round 2

Critic: independent, 2026-11-06. Reviewed `/home/user/theluxuryliners.com/site/` at commit `2fe1d4d` ("site: round 2 fixes"), with `content/` as the copy track left it (round 3, `fc03c39`). I ran every check below myself and did not rely on what BUILD-LOG claims.

**Score: 8.5/10. Approved.** There are no blocking issues. Both round-1 blockers are fixed and guarded. The remaining items are polish.

## What I ran

| Check | Result |
|---|---|
| `npm ci` | clean, 0 vulnerabilities |
| `npm test` | **all PASS**: data; unit 35/35; dist (check-dist 0 errors, 13 warnings, all deliberate sameAs/Discogs/MP3-history mentions); jsonld 29 pages (3 MusicGroup, 7 MusicAlbum, 1 FAQPage); axe 112/112 |
| `RELEASE=1 node scripts/check-dist.mjs` | FAIL, correctly, on the two missing keys only (no PLACEHOLDER in today's build) |
| RELEASE mode on a copy of dist with an injected `PLACEHOLDER` on /epk/ | FAIL with `epk/index.html: PLACEHOLDER copy (1)`, so the gate works |
| LL-3 stub (`tests/unit/ll3-sync.test.mjs`) | 2/2 pass: the copies match, and the negative case catches a changed date, ISRC or missing release |
| `_redirects` | 315 rows, all 301. No chains. Every internal target exists in `dist/`. No overlap with the 293 paths that `worker/gone.ts` answers with 410 |
| Screenshots, 1280 and 375 px, DPR 1 (16 pages each: home, story, people, music, great-day, facts, shows, photos, vault, mp3s, covers, epk, contact, privacy, press, listen) | no horizontal scroll anywhere (`scrollWidth` equals the viewport). 0 broken images after lazy-load scrolling. Plain, token-based, readable layout; the logo is the supplied artwork |
| dist grep: `david@dewese.com`, `@gmail`, `mailto:`, e-mail addresses, phone patterns | **none**. The form posts to `/api/contact`; `CONTACT_TO` is a Worker secret |
| dist grep: talent show, Mesquite, Baptist, "lives in", newsletter/subscribe, "demo", "download", designer credit/"Glen", `web.archive.org`, Discogs 15436127, `.mp3`/`.zip` files | none in pages. `.mp3` and `/downloads/` appear only as `_redirects` sources (old URLs 301 to `/vault/mp3s/`, `/vault/` and `/press/`), which is correct |
| "college" | only "college friend" and "Chad was finishing college" (P21, LL-4). The college is never named |
| JSON-LD MusicGroup | `foundingDate` 1997; `foundingLocation` Texas (TX, no town); founders David (`daviddewese.com/#person`) and Chad; the four forever members with start dates and no `endDate` (LL-9). Roles match home, People and llms.txt. sameAs has no Bandcamp; the reason is in BUILD-LOG and check-jsonld enforces it |
| robots.txt / llms.txt / sitemap | `Allow: /` for all agents (LL-41). llms.txt is complete and accurate, with Chad's line "(1997–2001, and again today)". sitemap-index is present |
| Analytics | the beacon is gated on `PUBLIC_CF_ANALYTICS_TOKEN` in `Base.astro`. The privacy page carries no analytics or Turnstile paragraph, because neither is built in |

## Round-1 items, re-verified

1. **The *Nonetheless* cover credit (round-1 blocker): fixed.**
   - It is gone from /people/ Artwork, Story ch. 7, Facts (and FAQPage), the EPK and the release page.
   - The Nonetheless caption reads only "All rights reserved by the rights holders."
   - check-dist now fails on a pending artwork credit anywhere, JSON-LD and llms.txt included.
2. **LL-9 for Chad (round-1 blocker): fixed.**
   - /people/ and llms.txt say "1997–2001, and again today" and "He is in the band again today".
   - Facts and Story ch. 9 agree. JSON-LD has no endDate.
3. **Cover captions: fixed.** "Cover art: David Dewese, from a photo by Mark Montgomery. All rights reserved by the rights holders." There is no doubled label and no "Photo: Cover art".
4. **/vault/mp3s/: fixed.** Every row says "the song is on …". The page never says "not released", and the intro points to streaming.
5. **/shows/ doubled place: fixed.** "Shows in Ohio and Michigan" stands alone. The null-venue row (March 2001, Chad's last show) has no leading comma and keeps its note. Partial dates sort correctly: "Probably autumn 1997 or winter 1998" comes first, then "July or August 1998", then "Autumn 1998"; "2006" and "2008" come after 2004.
6. **Credit spacing: fixed.** Captions read "about 2000. Photo: Mark Montgomery."
7. **Wayback links: removed.** There is no `web.archive.org` in dist, and check-dist guards it.
8. **Turnstile:** the `REQUIRE_TURNSTILE` switch is in place and handbook §9 records the trade-off.
9. **Member roles: consistent** across home, People, JSON-LD and llms.txt, from one source (`members.ts`).
10. **Gary Ishee:** "several shows, 2004–05; guitar on *Nonetheless*". Fixed.
11. **Vault "since at least 2000":** fixed.
12. **Privacy:** it describes what ships. With no Turnstile key in this build, the "keeps nothing in your browser" line is true. The build adds the qualifying paragraph when the widget is built in, and the dist test compares the page with the build.

Other known issues from the lost run, checked:
- People › Artwork names each release.
- Amy Wilstermann's credit is gated (`pending` in `photos.json`, not printed anywhere).
- Photographers on /people/ match the captions on home, Story and Photos.
- Home blurbs carry no dates.
- The 2008 bonus disc is not listed and is not linked.
- No talent show; no "Great Day"/demo link.
- LL-6 is verbatim on home, Facts, EPK, llms.txt and JSON-LD; LL-17 is verbatim on Story, Facts, EPK and llms.txt.
- LL-29 covers list; LL-39 colophon only; no newsletter (LL-40).
- Single-source Antarctic Antics and the Superdrag tribute are correctly left off.

## Should fix (not blocking)

1. **The home "New Beginning" blurb is thin.** "Two tracks, “New Beginning” and “Great Day”." It passes `blurbOk` (no date), but it says less than the release page's own summary ("A second song by Chad Edgington and David Dewese with all four forever members playing, paired with “Great Day”"). It also repeats what the "Great Day" card beside it already shows. Tighten `blurbOk` so it rejects a blurb that is only a track list, or ask the copy track for a line about the song. This is a copy-track field, but the gate is the build's.
2. **Unattributed journal quotes on /shows/ and in Story ch. 4–5** ("The new three piece configuration.", "We lost a little money.", "All of nevada was rocked last friday night."):
   - LL-25 puts the journal behind a privacy pass and David's approval, month by month.
   - LL-7 says "no quotes from them unless they offer one". We do not know which member wrote each entry.
   - The quotes are harmless show facts, but quoting the journal before its months clear bypasses the LL-25 process.
   - Ask the copy track or Carly whether short show quotes are cleared. Until then, paraphrase.
3. **/photos/ order within an era.** In 2001–2004 the 2002 four-piece photo comes before the two 2001 photos. Sort by `year` (then `collage`) inside each era.
4. **Typography is inconsistent.**
   - Track titles from `releases.json` keep straight apostrophes ("Think She's Coming Around", "User's Guide"), while the copy uses curly ones.
   - The LL-6 one-liner has curly quotes on home and EPK "In one line", but straight 'Luxury Liner' in Facts, the EPK bios and JSON-LD.
   - Normalise at render time. check-dist already normalises the glyphs, so verbatim checks will not break.
5. **The /shows/ March 2001 row** has an empty Where cell. It is fine for screen readers, but "Nashville" (or "—") would read better than a gap. Only fill it if the place is known.
6. **/vault/mp3s/: "If I Cry" has no pointer**, though it is on *Nashpop* (/music/appearances/). Link the appearances page for compilation-only songs.
7. **People › On the records: "Mark Montgomery: … band photographs, 1999–2002".** This comes from content, not from `photos.json`, so it partly bypasses the rule that photo credits come only from the shown photos. The site's dated Montgomery photos are about 2000, 2001 and 2002. Use "2000–2002", or confirm 1999.
8. **The EPK logo download links read "SVG", "SVG · PNG", "SVG".** These are acceptable in context (inside a figure with an alt-texted image), but "Roundel wordmark (SVG)" is better for screen-reader link lists.

## Verdict

This is a solid, honest build:
- Tests, axe, the RELEASE gate, redirects/410s, JSON-LD, the Worker contact path and the privacy controls all hold up under independent checking.
- Both round-1 blockers are fixed at the gate level, not just in the copy. Each fix has a test, so it cannot regress silently.
- No owner-decision violation, privacy leak or factual error was found in the built site.
- The should-fix items above are polish and one process question (journal quotes) for the copy track and Carly.
