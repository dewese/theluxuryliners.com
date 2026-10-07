# Critique: discography, round 3

Reviewed: `research/02-discography.md` (round-3 revision, 445 lines) and `data/releases.json` (21 objects). Critic run 2026-10-07.

**Score: 8.5 / 10**
**Verdict: APPROVED.** No blocking issues remain. There are six non-blocking issues for the next pass.

## Summary

The worker fixed all three round-2 blocking issues, and fixed them properly:
- **Writer credits.** *Sound As Ever* and *Overbored* writers are now recorded per track. I re-read both from Discogs today and they match exactly, including "Mine" (Miles / Reynolds / Carpenter) and "Restless" (Wilstermann alone).
- **X1.** The X1 co-writer on *Overbored* track 7 is withheld everywhere. I grepped the repo for the name, and it appears in no file.
- **Dead store link.** The Big Cartel link has been moved to a do-not-link historical note.

Every non-blocking item from round 2 was also handled.

I re-read 12 Discogs releases, the Discogs artist release list, 8 Spotify album pages, the iTunes lookup, 6 Deezer albums, the MusicBrainz release groups and one Amazon page with live `curl`. I also spot-checked nine on-disk citations. Nothing in the deliverable is contradicted.

Discogs knows exactly 12 Luxury Liners releases (5 Main, 7 TrackAppearance), and all 12 are in the file. The public dates match live Spotify and owner decisions P6 and F6 exactly.

What keeps this from a 9 is mostly about labels, not facts:
- Five appearance objects are labelled `verified-source` but rest on Discogs alone.
- The X1 placeholder wording needs a hard rule so that it never reaches public copy.
- There are a few small wording nits.

## Checks

| # | Claim in the deliverable | Checked against | Result |
|---|---|---|---|
| 1 | Public dates 2000-05-01, 2001-03-01, 2003-05-01, 2006-10-01, 2021-08-27, 2026-02-13, 2026-04-17; Texas Music Café compilation 2023-03-03 | **Live** `open.spotify.com/album/<8 ids>` `music:release_date`; DECISIONS P6, F6 | PASS |
| 2 | Apple album IDs, track counts, ℗ lines (*Shake It Up* ℗ 2021 Texas Music Café) | **Live** `itunes.apple.com/lookup?id=47333263&entity=album` | PASS |
| 3 | UPCs, label Litterbug, totals 52:14 / 8:55 / 36:23 / 44:35 / 3:22 / 6:04; Deezer "Think She's Coming Around (Live)" oddity (D15) | **Live** `api.deezer.com/album/<6 ids>` (3134, 535, 2183, 2675, 202, 364 s) | PASS |
| 4 | *Sound As Ever* writers: Edgington/Dewese on 1–8 and 10–15; "Mine" by Brad Miles / Robert Reynolds / Scott Carpenter. Producers: Poole on 1–7 and 10–15, Montgomery on 8–9; catalogue EMLLCD1001 on Echomusic and Litterbug; barcode | **Live** Discogs r6768612; dd `data/release-leads.json` line 46 | PASS |
| 5 | *Overbored* per-track writers (Dewese on 1, 3, 4, 5, 10; Wilstermann on 2; and so on); Seykora keyboards on 3 and 6; Nightwine recording, Henning mix; no producer credit | **Live** Discogs r14391955 | PASS. Track 7 does carry a third writer, and it is correctly withheld (X1) |
| 6 | *Believe*: Montgomery and The Luxury Liners producers; Wilson mix; Milfred engineer and master; tracks 1–2 Edgington/Dewese/Carpenter; six "Believe" writers; enhanced QuickTime items 3:45 and 6:53 | **Live** Discogs r6768660; P27 | PASS |
| 7 | 2026 LP: ZZZ056, 2026-05-27, 100 copies, marbled maroon vinyl; Anders Peterson remaster; Jim Horan "Cover"; art direction DeWeese/Montgomery; producer split A, B1, B4–B6 / B2–B3 | **Live** Discogs r37658859 | PASS. Nit: Discogs format also says "Deluxe Edition", which is not recorded |
| 8 | Kool Kat bonus disc: LL on tracks 4 (3:22), 5 (3:29), 6 (2:35), 7 (3:00) and 9 (2:48); notes quoted; uncredited writers John Davis, Dando/Gallagher | **Live** Discogs r15436127 | PASS (the quotes are verbatim) |
| 9 | *Fireworks Vol. 2*: tracks 9–10; Dewese bass, Edgington guitar, Lafrate drums, Poole producer; "Think She's Coming Around" written by Edgington alone (D14) | **Live** Discogs r6907226 | PASS |
| 10 | *Antarctic Antics*: ISBN 9781555929725 in `identifiers.isbn`; track 6 credits; Reynolds music, producer, bass and vocals on 1–11 | **Live** Discogs r22919255 | PASS |
| 11 | *Between Goodlettsville And Murfreesboro* track 15 "Promise Ring" with personnel; Nashpop NL-046 "If I Cry" (Edgington/Dewese); SESAC promo track 2; *Fireworks Vol. 3* ZZZ054 track 12 3:16 | **Live** Discogs r9601921, r7044627, r8057090, r34741341 | PASS |
| 12 | Completeness: no Discogs Luxury Liners release is missing | **Live** `api.discogs.com/artists/4298743/releases` (12 rows, all present) | PASS |
| 13 | MusicBrainz has release groups only for *Overbored* and *Nonetheless* | **Live** MusicBrainz ws/2 | PASS |
| 14 | Amazon CD B00004U073 "Sound As Ever"; MP3 ASIN B00859ZP5I in its other-formats block; CD date May 30, 2000 | **Live** amazon.com/dp/B00004U073 (200) | PASS |
| 15 | §1: theluxuryliners.com answers 200; web.archive.org has no connection | **Live** curl (200, 62 KB; Wayback connection reset) | PASS |
| 16 | *Nonetheless* art: paintings Scott Carpenter, band photos Kristen Barlowe, design David Dewese | dd research/04 line 225 | PASS |
| 17 | *One Tree Hill* S1E15; the dd file says "CW", which is anachronistic | dd research/04 line 248 (says "CW"); the WB air date was verified in round 2 | PASS |
| 18 | Big Cartel is dead and must not be linked | dd research/02 line 203; this project's research/03 line 515; JSON `dead_links_do_not_use` | PASS |
| 19 | *Trunk Box*: fall 1998, E-Cleff Studios, Waco; 11 tracks; "Trans-Am Mind", "Araby" | dd research/04 line 349 | PASS |
| 20 | D7 Jetpack evidence (dd research/04 lines 285, 399, 407; research/05 lines 304–308) | on-disk lines | PASS. Nit: the research/05 lines are **Foxymorons** bills, not Luxury Liners bills (see non-blocking 4) |
| 21 | dd cross-check: dates, UPCs, tracklists, durations, ISRCs, catalogue numbers identical for all 7 releases | script diff against dd `data/releases.json` | PASS |
| 22 | Owner rules F4, F6, P5, P6, P8, P22/P23, P27, P28, P29, X1; privacy | full read of the Markdown, plus grep of both files for the X1 name, "isawtheocean", "line-up" and residence terms | PASS. No excluded person is named, there are no residences, and only public roles are given |

## Blocking issues

None.

## Non-blocking issues (fix in the next pass)

1. **Five confidence labels contradict the file's own definition.** §0 defines `verified-source` as two or more *independent* authoritative sources. These five appearance objects rest on Discogs alone; the dd `catalog-meta.json` is itself derived from Discogs, so it is not independent:
   - `ll-appearance-1998-fireworks-vol-2`
   - `-1998-nashpop`
   - `-2001-sesac-sxsw-promo`
   - `-2005-between-goodlettsville-and-murfreesboro`
   - `-2025-fireworks-vol-3`

   Yet they are labelled `verified-source`, while *Antarctic Antics* and the Kool Kat disc, also Discogs-only, are correctly labelled `single-source`.

   **Fix:** relabel the five as `single-source`, unless a second independent source is cited. For example:
   - the band site's own press or albums pages for *Nashpop* and the SESAC promo;
   - the Sound Asleep label page for the *Fireworks* volumes.

   Also update §4's "Verif." column to match.

   In the `sources` arrays, the access note "JSON fetched 2026-09-28" sits next to a basis of "read live 2026-10-07". Make the two consistent.
2. **X1 placeholder wording must never reach public output.** "(+1 further credit withheld under X1)" in §3.3, the JSON `writers_note`, the summary, and D18 as an open question are fine for internal research. They still tell any reader that a co-writer was deliberately hidden, and X1 asks that the person not be mentioned, including in open questions.
   - **Rule for the build:**
     - the site shows "Chad Edgington / David Dewese" for track 7, or no writer credit at all;
     - no "withheld", "X1" or "+1" text renders anywhere;
     - `writers_note` is never emitted into structured data.
   - Consider removing D18 from the open-questions table altogether, because there is nothing to ask David.
   - Add a test: the dd `check-dist.mjs` already rejects internal tags such as `[X1]`. Extend the same check to the bare token "X1" in theluxuryliners.com output.
3. **Ambiguous "(live)".** In §4, "*Nashpop* 'If I Cry': Edgington / Dewese (live)" means "read live from Discogs". A copywriter could easily read it as a live recording. Write "(Discogs, read 2026-10-07)" instead.
4. **The D7 Jetpack evidence is slightly overstated.** "Jetpack and the LL/Foxymorons kept sharing bills in 2005 (dd research/05 lines 304–308)": those lines are Foxymorons shows (Philadelphia, Dallas, March 2005). Reword this as "the Foxymorons shared 2005 bills with a Jetpack".
5. **Small data completeness points:**
   - The LP format omits Discogs' "Deluxe Edition" descriptor.
   - *Between Goodlettsville* credits Scott Carpenter as Discogs artist "(2)", while every other Luxury Liners release uses "(5)". That is a Discogs profile split worth a note, so that nobody merges the wrong profile.
   - The 2001 *Antarctic Antics* track title has a sibling track 17 of the same name: a reading by Judy Sierra, which is not the band. One line saying so prevents a miscount.
6. **Length and padding.** At 445 lines the file is thorough. The revision log, though, now holds roughly 30 lines of process history. Move rounds 2 and 3 of the log into a collapsed appendix, or into the critiques folder, so that the site-copy team reads facts first.

## What is good (keep it)

- **Re-verification is real this time.** Every value I re-read live matched: Discogs credits, Spotify dates, Apple, Deezer UPCs and totals, MusicBrainz and Amazon.
- **The X1 handling is correct in substance.** The name appears in no file.
- The P6/F6 dates, the P27 original-versus-cover wording, the P22/P23 guard, the P5 rule against isawtheocean, and the privacy handling are all right.
- **Contested facts are shown as contested:**
  - Jetpack vs Jetpack UK (D7);
  - "Think She's Coming Around" writers (D14);
  - "Great Day" as demo vs new recording (D16);
  - the 4:56 vs 4:22 length (D17).
- The name-collision guard is good (Emmylou Harris, Carter Tanton's "Luxury Liners", cruise ships).
- The "needs a browser" list and the gaps list are specific and actionable.
- The JSON is a valid 21-object array, and every object has `verification` and `sources`.

## Live reads used by this critic (2026-10-07)

- `api.discogs.com/releases/` 6768612, 6768660, 14391955, 14401612, 37658859, 15436127, 6907226, 7044627, 8057090, 22919255, 9601921, 34741341; `api.discogs.com/artists/4298743/releases`
- `open.spotify.com/album/` (all 7 releases plus 4HcZ87IXLiyVui34xeLHxO)
- `itunes.apple.com/lookup?id=47333263&entity=album`
- `api.deezer.com/album/` 7189504, 1372240, 3230601, 8406852, 902290832, 949841901
- `musicbrainz.org/ws/2/release-group?artist=7af7fd54-…`
- `amazon.com/dp/B00004U073`
- theluxuryliners.com (200); web.archive.org (connection reset)
- WebSearch: "Luxury Liners" Superdrag tribute (nothing new; the lead stays unverified); "The Luxury Liners" Nashville compilation (nothing new)
