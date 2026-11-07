# Critique: discography, round 1

Reviewed: `research/02-discography.md` and `data/releases.json` (21 objects). Critic run 2026-10-07.

**Score: 7.5 / 10**
**Verdict: NOT APPROVED.** There is one blocking issue. The fix is small, and the work is otherwise strong.

## Summary

This is careful, well-sourced work. The release set, dates, UPCs, ISRCs, durations, labels, catalogue numbers and platform IDs all agree with the critic-approved daviddewese.com catalogue. I recomputed every track total from the JSON tracklists and all eight match. The owner rules are followed: F4, F6, P6, P8, P22/P23, P27, P5 and X1. The name-collision guard is good, and it catches Carter Tanton's "Luxury Liners", whom WebSearch still returns for this name. The file says plainly that live re-verification was blocked. I confirmed that it is blocked: WebFetch to daviddewese.bandcamp.com, itunes.apple.com and api.deezer.com returned EGRESS_BLOCKED. Five WebSearch queries for the band's releases returned only cruise ships, Emmylou Harris and Carter Tanton. So I am not penalising the worker for the missing live reads.

The failure is a missed cover-art credit. That credit is printed in the very daviddewese research section the worker cites for the *Nonetheless* photo credit.

## Checks

| # | Claim in the deliverable | Checked against | Result |
|---|---|---|---|
| 1 | Seven primary releases, with public dates 2000-05-01, 2001-03-01, 2003-05-01, 2006-10-01, 2021-08-27, 2026-02-13, 2026-04-17 | dd `data/releases.json` (script diff); DECISIONS P6, F6 | PASS |
| 2 | UPCs 635759200625 / 635759201127 / 635759145124 / 789577513228 / 662582233728 / 199900557513 / 991043318712 | dd `data/releases.json` lines 3742–5222; dd research/01 §LL table | PASS |
| 3 | Tracklists, ISRCs and the stated totals (52:14, 8:55, 36:23, 44:35, 3:10, 3:22, 6:04) | Recomputed from `data/releases.json`; diffed against the dd tracklists | PASS (no differences) |
| 4 | *Believe* EP tracks 1–2 written by Edgington/Dewese/Carpenter; track 3 a Cher cover; "Shake It Up" an original | dd research/01 line 344 (Discogs credits); P27 | PASS |
| 5 | *Sound As Ever* producers Mike Poole and Mark Montgomery; design by Mark Montgomery | dd research/01 line 328; dd releases.json `credits_text` | PASS |
| 6 | *Nonetheless* cover painter "unknown"; question 2 asks David who painted it | dd research/04 line 225 (2010 daviddewese.com discography): "Art: Scott Carpenter (paintings); Kristen Barlowe (band photos); David Dewese (design)" | **CONTRADICTED** (missed source) |
| 7 | 2026 LP reissue: Sound Asleep ZZZ056, 2026-05-27, 100 copies, remastered by Anders Peterson | dd releases.json line 3679–3683; dd critique (Discogs 37658859 "released 2026-05-27") | PASS (single-source, correctly labelled) |
| 8 | Fireworks Vol. 2 early line-up: Dewese (bass), Edgington (guitar), Jeff LaFrate (drums) | dd research/01 line 511; band page roster (LaFrate June 1997 – April 1998) | PASS |
| 9 | *Trunk Box*: fall 1998, E-Cleff Studios, Waco, 11 tracks, includes "Trans-Am Mind" and "Araby" | dd research/04 line 349 | PASS (single-source) |
| 10 | Five Waco MP3s (four 200, `say_goodbye` 404), captured June 2001 | CDX `cdx-theluxuryliners.com.json` | PASS |
| 11 | Album-track MP3s "captured as 200 audio on 2005-11-05", including Breaking Out | CDX | **CONTRADICTED** in part: `luxury_liners_breaking_out.mp3` was captured on 2007-08-23 (`/mp3/`, not `/www…:80/mp3/`). The other nine are correct |
| 12 | Live Liners November 2002: "files 01–07" | CDX | **CONTRADICTED** in part: the CDX has 01, 02, 03, 05, 06 and 07 (no 04), all 404. The July 2002 `/mp3/7.18.02/` rows are also 404 (2021 captures), so no live audio is archived. The file does not say so |
| 13 | 2007 album pages: album 88761 has 12 song sub-pages; 88939/88940/88941 exist | CDX (12 `em1886` rows for 88761; 1 row each for the others) | PASS |
| 14 | Amazon ASIN B00004U073 comes from the foxymorons.com research | foxymorons.com/research/01-discography.md line 305 | PASS (single-source, labelled) |
| 15 | Discogs: "originally formed in 1997 in Texas" | dd research/03 line 549 (Discogs API, fetched) | PASS |
| 16 | Spotify track ID 5VN9RMk9n83auNJvD8FF9G for "Great Day" | WebSearch for the ID and for the title, 2026-10-07 | UNVERIFIABLE (my searches did not reproduce it; host blocked) |
| 17 | Internal date list for *Believe* (Discogs, Apple, Deezer, Bandcamp) | dd critique audit (Tidal API: *Believe* 2001-01-01) | Incomplete: the Tidal date is missing (non-blocking) |
| 18 | One Tree Hill S1E15 "Dreaming", FOX Sports *US Youth Soccer Show* "Sunshine" | dd research/04 lines 248–249 | PASS |
| 19 | Owner rules: F4 co-founder, P8 forever members, P22/P23 caption rule, P5 isawtheocean not linked, X1 | Whole file and JSON grep | PASS (no X1 material found; no isawtheocean link; no "2002 line-up") |
| 20 | Privacy | Whole file | PASS (public credits only; no residences or private details) |
| 21 | Live web re-verification blocked | My WebFetch attempts (Bandcamp, iTunes, Deezer) and WebSearch | PASS (blocking confirmed; the honest disclosure is correct) |

## Blocking issues

1. **The *Nonetheless* cover-art credit is missing, although it is in the daviddewese research.** `daviddewese.com/daviddewese-com/research/04-live-sites-and-archive.md` line 225 (the 2010 daviddewese.com discography credits) says: "Art: Scott Carpenter (paintings); Kristen Barlowe (band photos); David Dewese (design)". The deliverable quotes Kristen Barlowe from the same block, yet it says "Painter **unknown**" (§3.4, `cover_art.credit: null` in the JSON). It lists this as gap 2 and puts it to David as question 2. The brief requires cover-art credits and says to hunt for "missing material that exists in the daviddewese research". Fix:
   - set the *Nonetheless* credit to "Paintings: Scott Carpenter; design: David Dewese; band photos: Kristen Barlowe" (single-source, 2010 daviddewese.com discography) in both the Markdown and the JSON;
   - update §8 gap 2 and question 2;
   - the *Overbored* cover is also a painting. Do **not** infer that Scott painted it. Instead, change the question to David to: "Did Scott Carpenter also paint the *Overbored* cover?"

## Non-blocking issues

1. **CDX audio inventory errors (§5).**
   - "Breaking Out" was captured on 2007-08-23, not 2005-11-05.
   - The November 2002 Live Liners files are 01, 02, 03, 05, 06 and 07, all 404.
   - The July 2002 `/mp3/7.18.02/` rows are 404 captures from 2021.

   State plainly that **no Live Liners audio is archived** on Wayback. That matters for The Vault (P29). Also list the unreported `/mp3/misc/` rows: `Fall`, `Purple`, `Ride`, `01`, `02`, `04` and `07` (2005-05-25, all 404). `Fall…` is an unidentified title. Add it to the gaps and to the questions for David.
2. **D1 is labelled "Contested"**, but F4 settles it, and owner decisions override other sources. Relabel it "Resolved by F4 (owner). Historical sources differ:" so that no later worker treats the origin as open.
3. **Give the Great Day Spotify track ID a confidence label in §3.6 and §6.** The JSON calls it "surfaced in WebSearch; not opened". The Markdown just says "new". Mark it `single-source (search snippet)`. I could not reproduce it.
4. **Tidal's *Believe* date (2001-01-01)** is missing from the §3.2 internal date list. A dd audit critique (Tidal API) recorded it. Add it for completeness, internal only.
5. **D7 / "Lead Me On":** "the Nashville band they played with in 2002–03" is unsourced as worded. The dd research (04 line 285) has David saying in 2005 that he plays "with … Jetpack", and research/05 shows Jetpack on shared bills in 2002–05. Cite those lines, and note that David was himself in Jetpack. That makes the "Jetpack, not Jetpack UK" reading stronger.
6. **The appearance objects in the JSON have an empty `tracklist`.** The LL track is held elsewhere in each object. For consistency, put the LL track(s) into `tracklist` with position, title and duration where known: *Fireworks Vol. 3* 3:16 and *TMC Vol. One* 3:12 are known.
7. §2 shows the 2026 LP as "12 / n.a." Say "durations not listed" to make clear that this is a data gap, not zero.

## What is good (keep it)

- The provenance is honest. The worker distinguished the inherited first-hand API reads from snippet-level WebSearch corroboration and listed every blocked host.
- The P6 handling is exact. Alternative dates are kept only in `release_date_candidates_internal`.
- P27 is correctly applied to both the EP and the live single, and the second, different live recording (US2762202822, 3:12) is caught.
- The "needs a browser" list is specific and useful.
- The name-collision guard is thorough.
