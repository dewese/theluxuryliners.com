# Critique: archaeology track, round 2

Deliverables reviewed: `research/03-web-archaeology.md` (727 lines, with the round 2 revision log), `data/legacy-urls.json` (675 rows), and the regenerated output of `research/tools/gen_legacy_urls.py`.
Critic: harsh critic, 2026-10-07.

## Score: 8.6 / 10. Verdict: APPROVED (no blocking issues)

Both round 1 blockers are fixed, and I checked the fixes in the data, not just in the revision log. The three required non-blocking items (IA credit name, private-row links, `content_period`) are also fixed. So are the optional ones: Shazam, Big Cartel and NoiseTrade were added to §9, and §3.11 now lists the images to request. I re-checked 22 claims against the files on disk and live sources. None of them contradicts the file. The leftover problems are small: a stale header, a missing owner-decision cross-reference, and one Discogs "formed in Texas" line that should be marked as contested against F4. They do not block approval.

## Round 1 fixes, checked

| Round 1 item | Check | Result |
|---|---|---|
| B1 `/history/music.html` had no redirect | Data row: category `music`, action `301`, target `/music/`. All 276 `HO` paths are present. The only `HO` path left on `none` is `/cdn-cgi/l/email-protection`, which is correct | FIXED |
| B2 sensitive history photo had no flag | Row `/history/photos/00_*` has category `sensitive-image`, action `none`, `wayback_url` null, and the note "do not re-host or reuse without owner review" | FIXED |
| NB1 IA image credit printed a name | §5.3 and §12 now describe the credit generically | FIXED |
| NB2 private rows had one-click links and a description of the subject | All 4 `private-image` rows and the `private-family-page` row have `wayback_url` null. A grep for "child" in the prose, data and generator finds 0 hits | FIXED |
| NB3 `content_period` was wrong | sxsw and capitol pages now read "2001 or earlier (thumbnail archived …)"; concerts.html reads "1997-2003 (guess…)". The field note explains what the field means | FIXED |
| NB4 §11 #2 wording | Now reads "the first months after Chad left (his tenure ends Apr 2001…)" | FIXED |
| NB5 missing presences | Shazam, Big Cartel (404, which I re-checked live) and NoiseTrade added to §9 | FIXED |
| NB6 reusable assets from R04 §7 | New §3.11, checked against CDX | FIXED |

## Checks performed (re-verification sample)

| # | Claim | Source checked | Result |
|---|---|---|---|
| 1 | CDX: 675 rows; per-year counts (2000 29 … 2026 4); statuses 534/137/2/2; 311 status-200 HTML/audio/PDF | Recomputed from `cdx-theluxuryliners.com.json` | PASS |
| 2 | `/history/concerts.html` first capture 20030607225256 (§11 #1) | CDX | PASS |
| 3 | Journal 2001-07 (20011213000950), blogs backup (20010825033605), 2003-11 (20031218231651), 2003-12 (20031230001009), 2003-05 = 404 | CDX | PASS |
| 4 | *Trunk Box* MP3 timestamps (4 × 200 on 2001-06-15) and `say_goodbye` 404 under `/web/mp3/waco/` | CDX | PASS |
| 5 | Believe (Cher) MP3 20051105025725; one-sheet PDF 20030414032936; `believe_cover.jpg` 2001-06-02; `jumping.jpg` 2009-07-22; `music_sound_as_75.jpg` 2021 404 | CDX | PASS |
| 6 | 16 history photos: 8 dated 1997–99 and 8 dated 2000 (7 named, plus the flagged one) | CDX | PASS |
| 7 | 2000 bio "caricature lunch box", Billboard "buzz-bin" line, Scott quote, verbatim | R04 l.321–323 | PASS |
| 8 | 2005 talent-show intro and roster (LaFrate, Winchester, Jeffries "Tamborine [sic]"), verbatim; shown as contested against F4 | R04 l.326–341; DEC F4 | PASS |
| 9 | Press quotes (Performing Songwriter, Metroland, Nashville Rage, AMG, Kool Kat) and the "also listed" set | R04 l.359–367 | PASS |
| 10 | Domain registered 1998-03-20, expires 2027-03-19 | ARCHITECTURE.md l.794 | PASS |
| 11 | "Great Day" and "New Beginning" demos on the band site by March 2005 | site-inventory.json l.439 | PASS (correctly single-source) |
| 12 | Litterbug Records is the label of *Overbored*, *Nonetheless* and the 2026 singles, and co-label of *Sound As Ever* | `research/02-discography.md` l.51–57 | PASS |
| 13 | IA show: French Quarter Cafe, Nashville, 2003-06-19; taper Mike Zodun; AT853; added 2003-06-25; 7-song setlist | archive.org metadata (live) | PASS |
| 14 | IA collection: David's 2003-06-23 letter (verbatim); public 2003-06-24; homepage field; "Allows audience audio recording" (under Policy Notes in the rights field) | archive.org metadata (live) | PASS |
| 15 | Apple: 7 releases with the dates listed, including Great Day 2026-02-13 and New Beginning 2026-04-17 (F6) | iTunes lookup API (live) | PASS |
| 16 | MusicBrainz: 3 members (no Chad); url-rels to MySpace, homepage, iTunes, Facebook and Flickr; no begin date | MB API (live) | PASS |
| 17 | Discogs profile "Originally formed in 1997 in Texas"; 5 members including "Jeff Lafrate" | Discogs API (live) | PASS (but see NB2) |
| 18 | Carrd: Last-Modified Tue, 15 Oct 2024 16:52:05 GMT; body "Forever brosephs…"; meta "…scattered across the country."; served by Cloudflare | curl (live) | PASS |
| 19 | YouTube `V6h-vFJfRjI`: "Live at The Basement, Nashville, TN 2001 - 3 of 3", by David Dewese | oEmbed (live) | PASS |
| 20 | Big Cartel product page is dead (404); MySpace is up (200) | curl (live) | PASS |
| 21 | Action counts 300/243/78/32/17/3/2 = 675, as stated in §1 and §10.1 | Recomputed from the data | PASS |
| 22 | Name collisions: web search for the band returns Emmylou Harris, cruise ships and Paste's Carter Tanton page, all excluded in §9 | WebSearch, 2 queries | PASS (searches add nothing new about the band, as the file says) |
| 23 | Owner decisions F4, F6, P5, P8, P22/P23, P27, L1, X1 | Whole file and grep | PASS: isawtheocean.com is never hyperlinked; no "2002 line-up"; P27 is respected in §4.7 and §5.1; X1 has 0 relevant hits |

## Blocking issues

None.

## Non-blocking issues (fix when convenient; none is worth another round)

1. **Stale header.** Line 3 still says "Worker draft, round 1". Change it to "round 2".
2. **Discogs "formed in 1997 in Texas" is not marked as contested against F4.** F4 places the founding in Nashville. W7 lists the Discogs line only as a "description variant". Add F4 to the W7 handling, or add a W row: "Discogs/2005 history: Texas origin vs F4: Nashville; copy follows F4, and fix Discogs with the go-ahead".
3. **P17 is not cross-referenced.** §3.11 and Q7 treat photographer credits as unknown. P17 (daviddewese.com) settled that uncredited band photos were taken by the band, family or a self-timer and publish with no credit line. Say that P17 likely covers these too, so Q7 is a "nice to know", not a launch gate. Confirm with Carly that P17 extends to the band site.
4. **Small title mismatch.** §5.3 says "How It Should Be" appeared on *Nonetheless*. The IA setlist reads "That's How It Should Be". Note it as a title variant ("listed by the taper as …").
5. **The echomusic hosting span differs from the sister file.** This file says 2000–c.2009 (E5 footers support that). `LL02` §6 says "the band's 2000–02 site". Align `LL02` or note the difference.
6. **`last_known_capture` is still null in 666 of 675 rows.** This is disclosed, and the fix is documented (§10.3, §11 #24). No penalty.
7. **Minor CDX extras not mentioned:** for example `/images/music_sound_as_170.jpg` (2007, 404), which is relevant to §3.11's "never archived" note for the *Sound As Ever* thumbnail. Cosmetic.

## What is good (keep it)

- The data file is now safe for a builder to act on. The privacy and sensitivity flags live in the rows themselves, and the field notes explain every column.
- Every timestamp I sampled traces to CDX. Every live fact I sampled re-fetched cleanly.
- Contested origin texts (the talent-show intro, AMG's "outlet for David", the David-from-May-1997 roster) are always set against F4.
- The needs-a-browser list is exact, ranked and traceable, and the redirect mechanism notes (Carrd limits, query strings, `/cdn-cgi/`) are correct and practical.
