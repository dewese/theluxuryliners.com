# Critique: discography, round 2

Reviewed: `research/02-discography.md` (round-2 revision) and `data/releases.json` (21 objects). Critic run 2026-10-07.

**Score: 6.5 / 10**
**Verdict: NOT APPROVED.** There are three blocking issues.

## Summary

Every round-1 fix was applied correctly:
- the *Nonetheless* art credit;
- the CDX audio inventory, which I re-ran against `cdx-theluxuryliners.com.json` row by row and found exact;
- the D1 relabel;
- the Tidal *Believe* date;
- the D7 citations;
- the appearance tracklists.

The P6 dates, UPCs, ISRCs, platform IDs and totals still match the daviddewese.com catalogue exactly. I confirmed this by script diff on all seven releases.

The premise of §1 is now wrong, though, and that matters. §1 says that every music-data host refuses both `curl` and WebFetch. In this run, **plain `curl` reached these hosts and returned data**:
- `itunes.apple.com` lookup (200);
- `api.deezer.com` (200);
- `api.discogs.com` (200);
- `musicbrainz.org/ws/2` (200);
- `open.spotify.com` album and track pages (200, with `music:release_date` in the HTML);
- `daviddewese.bigcartel.com` (404).

WebFetch is still blocked, and Bandcamp returns only a 3 KB challenge stub. Whatever the case was when the worker tried, live re-verification is possible now. When I did it, the first two Discogs reads contradicted the songwriting in the deliverable. The deliverable copied dd research summaries ("release-level credit; no per-track split", "most tracks; exceptions not listed") without re-reading the source, and both summaries are wrong. That is the brief's "re-verify, do not just copy" failure, and it puts wrong writer credits on two albums.

## Checks

| # | Claim in the deliverable | Checked against | Result |
|---|---|---|---|
| 1 | Public dates 2000-05-01, 2001-03-01, 2003-05-01, 2006-10-01, 2021-08-27, 2026-02-13, 2026-04-17 (P6, F6) | **Live** Spotify album pages (`music:release_date`), all 7 album IDs, 2026-10-07 | PASS |
| 2 | Apple IDs, ℗ lines and track counts; *New Beginning* track date 04-10 vs album 04-17 | **Live** iTunes lookup, artist 47333263 and all 7 collections | PASS (*Shake It Up* ℗ 2021 Texas Music Café is also confirmed) |
| 3 | *Great Day* / *New Beginning*: label Litterbug, UPCs 199900557513 / 991043318712, 3:22 / 6:04 | **Live** Deezer API, albums 902290832 and 949841901 | PASS |
| 4 | Spotify track 5VN9RMk9n83auNJvD8FF9G is "Great Day" (labelled single-source search snippet) | **Live** open.spotify.com/track page: "Great Day - song and lyrics by The Luxury Liners", 2026 | PASS. Can be upgraded to verified |
| 5 | MusicBrainz: release groups only for *Overbored* and *Nonetheless* | **Live** MB ws/2, release-group browse for artist 7af7fd54… | PASS |
| 6 | *Sound As Ever* songwriting: "written-by David Dewese and Chad Edgington (release-level Discogs credit; **no per-track split**)" | **Live** Discogs API r6768612: Edgington/Dewese "Written-By" on **tracks 1–8, 10–15**. Track 9 "Mine" is written by **Brad Miles, Robert Reynolds and Scott Carpenter**. Also dd `data/release-leads.json` line 46: "Brad Miles also co-wrote 'Mine' on Sound As Ever" | **CONTRADICTED** (blocking 1) |
| 7 | *Sound As Ever* producers "Mike Poole and Mark Montgomery" | Live Discogs r6768612: Poole on tracks 1–7 and 10–15, Montgomery on 8–9 | PASS, but the per-track split is missing |
| 8 | *Overbored* songwriting: "written by David Dewese ('most tracks'); exceptions not listed" | **Live** Discogs API r14391955: **per-track** writers for all 10 tracks. Dewese alone on 1, 3, 4, 5 and 10. **Wilstermann alone on 2 "Restless"**. Edgington/Dewese on 6. Dewese/Wilstermann/Carpenter on 8. Edgington/Dewese/Carpenter on 9. Track 7 has three writers (see blocking 2 on X1) | **CONTRADICTED** (blocking 2) |
| 9 | *Believe* EP credits: Montgomery producer/engineer; Shane D. Wilson mix; Chris Milfred engineer/master; tracks 1–2 Edgington/Dewese/Carpenter; track 3 a Cher cover | Live Discogs r6768660 | PASS. Two items are missing: "The Luxury Liners" is a co-producer credit, and the track-3 writers are listed (Higgins, Gray, Barry, Torch, McLennan, Powell) |
| 10 | *Nonetheless* personnel and guests; Henning mix and master | Live Discogs r14401612; dd research/04 line 222–225 | PASS |
| 11 | *Nonetheless* art: paintings Scott Carpenter, design David Dewese, photos Kristen Barlowe | dd research/04 line 225 | PASS (round-1 fix verified) |
| 12 | 2026 LP: ZZZ056, 2026-05-27, 100 copies, marbled maroon, Anders Peterson remaster, A1–B6 = CD 1–12 | Live Discogs r37658859 | PASS. But it misses the LP credit **"Jim Horan – Cover"** and the per-track producer split |
| 13 | Kool Kat bonus disc: "Track numbers not recorded" | Live Discogs r15436127: 10 tracks. LL tracks are **4 Great Day 3:22, 5 Breakaway 3:29, 6 Baby's Waiting 2:35, 7 Purple Parallelogram 3:00, 9 Lead Me On 2:48**. Notes: "Tracks 4 and 5 were unreleased demos", "Track 9 is a Jetpack UK cover" | **CONTRADICTED** (the data was available) |
| 14 | *Fireworks Vol. 3* 2025-05-27, ZZZ054, track 12 "Precious To My Heart" 3:16 | Live Discogs r34741341 | PASS |
| 15 | Big Cartel `daviddewese.bigcartel.com/product/sound-as-ever` listed as a platform link ("not opened (blocked)"); Q7 "should the site link it?" | **Live curl: 404** (the shop root is also 404). dd research/02 line 203 lists daviddewese.bigcartel.com as a **dead link to purge**. The sibling track `research/03-web-archaeology.md` line 515 says "Dead: 404 … Do not link" | **CONTRADICTED** (blocking 3) |
| 16 | CDX: November 2002 rows 01, 02, 03, 05, 06, 07, all 404; misc `Fall`/`Purple`/`Ride`/01/02/04/07; Breaking Out 2007-08-23; Waco four 200 + say_goodbye 404 | `cdx-theluxuryliners.com.json` (row dump) | PASS. Nit: `say_goodbye` is under `/web/mp3/waco/`, not `/mp3/waco/` |
| 17 | Roster dates: Scott Aug 1998, Wilstermann Dec 2000 | dd research/04 lines 336–337; `the-luxury-liners.astro` lines 53–54 | PASS |
| 18 | *One Tree Hill* S1E15, The WB, 2004-02-24 | WebSearch (Wikipedia episode list, fandom): "Suddenly Everything Has Changed", aired 2004-02-24 | PASS (but the air date has no source cited in the file; dd research/04 line 248 wrongly says "CW", and the deliverable is right) |
| 19 | §1: `curl` gets proxy CONNECT 403 for Discogs, MB, iTunes, Spotify, Deezer | My `curl` runs, 2026-10-07 | **CONTRADICTED** now (WebFetch is still blocked; Bandcamp is a stub; Amazon 500; AllMusic 403) |
| 20 | Owner rules F4, F6, P6, P8, P22/P23, P27, P5, X1; privacy | Whole file and JSON grep (X1 build-check words, isawtheocean, "2002 line-up", residence terms) | PASS. Nothing excluded is present, and only public roles are given |

## Blocking issues

1. **The *Sound As Ever* songwriting is wrong.**
   - **What is wrong:** Track 9, "Mine", is credited on Discogs to Brad Miles, Robert Reynolds and Scott Carpenter, not to Dewese/Edgington. The daviddewese research already knew this (`data/release-leads.json` line 46). The claim "no per-track split" is false, because Discogs gives writers per track.
   - **Fix:**
     - Record per-track writers in §3.1 and in the JSON `songwriting` and `tracklist[].writers`: Dewese/Edgington on 1–8 and 10–15; Miles/Reynolds/Carpenter on 9.
     - Also record the per-track producers: Poole on 1–7 and 10–15, Montgomery on 8–9.
     - Mirror both on the 2026 LP object (B3 = "Mine").
     - Note that Robert Reynolds is also credited on *Antarctic Antics*. That is a useful clue for question 8.
   - **Confidence:** single-source (Discogs, read live). Put it to David as a check.

2. **The *Overbored* songwriting is wrong, and handling it needs an X1 check.**
   - **What is wrong:** Discogs r14391955 lists writers for every track. The deliverable says "exceptions not listed" and implies that David wrote nearly everything. In fact, "Restless" is credited to Wilstermann alone, and four other tracks are co-writes.
   - **Fix:** Record the per-track writers.
   - **X1 caution:** Track 7 ("Equasue") carries a third co-writer credit next to Edgington and Dewese. **Before writing that name into any file, the worker must check it with the team against X1.** If it falls under X1, record track 7 as "Edgington / Dewese (+1 further credit withheld under X1)", or as "Edgington / Dewese" with an internal note kept outside the repo, whichever the team prefers. I have deliberately left the name out of this critique.
   - Apply the same per-track treatment to the *Believe* EP. Add "The Luxury Liners" as co-producer, and add the six "Believe" writers as the cover's original writers.

3. **A dead store link is listed as a platform link, against the evidence on disk and the live web.**
   - **What is wrong:**
     - `daviddewese.bigcartel.com/product/sound-as-ever` returns 404, and so does the shop root.
     - dd research/02 says to purge this domain.
     - The project's own `research/03-web-archaeology.md` already marks it "Dead: 404 … Do not link".
     - Yet §3.1 hyperlinks it among the platform IDs, the JSON has it in `other_links` and `sources`, §9 sends a human to it, and question 7 asks whether to link it.
   - **Fix:**
     - Remove it from the platform IDs and from `other_links`.
     - Keep it only as a historical note: "store page once existed (search-result title); 404 on 2026-10-07; do not link".
     - Drop question 7, or reword it as "Do you still sell the CD anywhere?".

## Non-blocking issues

1. **Rewrite §1 and the confidence labels.** `curl` to iTunes, Deezer, Discogs, MusicBrainz and Spotify works now. Re-read every value you can, and upgrade the labels where the re-read agrees:
   - the "Great Day" track ID is now verified (live Spotify page);
   - the 2026 LP is Discogs-only, but read live.

   Keep the honest list of hosts that stay blocked: web.archive.org, theluxuryliners.com, Bandcamp (stub), Amazon (500), AllMusic (403), and WebFetch generally. Use a polite User-Agent with no personal email in it.
2. **Kool Kat bonus disc.**
   - Add the track positions and durations from Discogs: 4, 5, 6, 7 and 9 (see check 13).
   - The "Great Day" demo runs **3:22**, exactly as long as the 2026 single. Add an open question: is the 2026 single the 2008 demo recording, released as is or remastered?
   - D7: Discogs' own release notes say "Jetpack UK cover". Keep the Nashville-Jetpack argument, but show it as contested, not as "very probably" (the JSON wording in `ll-archive-2005-covers-and-mp3s` is too strong). The claim that David "was himself in Jetpack" is an inference from "play music with … Jetpack". Label it as such.
3. **The *Sound As Ever* cover-art credit is incomplete.** The LP's Discogs page credits "Jim Horan – Cover", and "David DeWeese / Mark Montgomery – Art Direction, Design". Add Jim Horan as a single-source cover credit for the artwork, which is presumably the same illustration. Add it to the questions for David.
4. **`upc` misuse in the JSON.** The *Antarctic Antics* object stores ISBN 9781555929725 in `upc`. Move it to `identifiers.isbn`.
5. **JSON/Markdown mismatch on *Nonetheless* songwriting.** The JSON says "Presumed David Dewese; unconfirmed", while the Markdown says "Not published". Discogs r14401612 has no writer credits either. Use one wording, and drop the presumption, or label it plainly as an inference.
6. **Duration differences.** Discogs and Bandcamp durations differ by a second on several tracks. "How Do I Say Goodbye" is 4:56 on the CD's Discogs page and 4:22 on Bandcamp; that is probably silence before the hidden tracks. Add a one-line note so that nobody "fixes" the Bandcamp figure.
7. **Source the *One Tree Hill* air date.** Cite the Wikipedia episode list, and note that the dd "CW" label is anachronistic (The WB in 2004).
8. **Press leads (for the press track, not this one).** WebSearch surfaced `musicstreetjournal.com/cdreviews_display.cfm?id=101483` and `powerpopaholic.com/?p=28851` next to LL queries. Both are blocked and unconfirmed. Hand them to the press track as leads; do not cite them here.

## What is good (keep it)

- The round-1 fixes are exact. The CDX inventory is now correct to the row.
- P6/F6 handling is right: every public date matches live Spotify today.
- UPCs, ISRCs, IDs and totals are consistent with the dd catalogue, and the live Apple, Deezer and Spotify reads confirm them.
- The name-collision guard is good: Carter Tanton, Emmylou Harris and the cruise ships are all excluded.
- There are no X1 or privacy problems in the current text.

## Live reads used by this critic (2026-10-07)

- `itunes.apple.com/lookup?id=47333263&entity=album`, and `?id=<each collection>&entity=song`
- `api.deezer.com/album/902290832`, `/949841901`
- `api.discogs.com/releases/6768612`, `6768660`, `14391955`, `14401612`, `15436127`, `34741341`, `37658859`
- `musicbrainz.org/ws/2/release-group?artist=7af7fd54-1d1b-4353-ab60-4b61bceed337`
- `open.spotify.com/album/<all 7>`, `open.spotify.com/track/5VN9RMk9n83auNJvD8FF9G`
- `daviddewese.bigcartel.com/product/sound-as-ever` (404) and the shop root (404)
- Blocked or useless: WebFetch (all hosts tried), Bandcamp (stub), Amazon (500), AllMusic (403), archive.ph (no connection)
