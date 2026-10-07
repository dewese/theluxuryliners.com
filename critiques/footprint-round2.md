# Critique: footprint, round 2

Reviewed: `research/04-press-and-digital-footprint.md` (552 lines, round 2 revision). This track produced no data files. Critic run 2026-10-07.

**Score: 8.5 / 10**
**Verdict: APPROVED.** No blocking issues remain. All three round 1 blockers (B1 to B3) are fixed, and the fixes hold up against live reads I made today. All nine non-blocking items (N1 to N9) were addressed. The non-blocking issues below are small, and the next pass can fix them; the worker does not need another full round.

## Summary

The live-platform layer is now right, and I confirmed it first-hand:
- Apple Music and iHeart both carry the Erik Hage AllMusic bio, word for word, signed "~ Erik Hage". Neither page contains "Nashville-based".
- The iTunes lookup returns `amgArtistId` 468639 on the artist record and on all seven collections.
- The MusicBrainz state (five URL relations, three members, two release groups, no dates) is exactly as described.
- The Discogs profile is quoted in full.
- Spotify shows 553 monthly listeners.
- Deezer shows 6 albums and 48 fans.
- The Emmylou Harris 1976-12-28 date checks out.

The correction plan now has the right shape:
- AllMusic is the single root fix for the bio on Apple, iHeart and Shazam.
- MusicBrainz gets the real fixes: an https homepage, ending the MySpace link, and a decision on the Flickr link.
- The redundant Discogs "add site" step is gone.
- The "Nashville-based" blurb is honestly marked as **source unknown**.

Owner decisions are followed throughout:
- **F4:** co-founders, and Chad left in 2001.
- **F6:** the 2026 dates, which match Apple's live dates exactly.
- **P5:** isawtheocean.com appears only in the "never link" rule.
- **P6:** the Spotify-date rule.
- **P8:** the four forever members, with no `endDate` for Scott and Larry.
- **P27:** the *Believe* EP is called an EP. D12 records Apple's "Single" label as a discrepancy.
- **X1:** mentioned only in general terms, with no specifics.
- **F3:** used only to show that "Nashville-based" is out of date.

I found no contradiction with an owner decision.

## Checks (18 claims re-verified)

| # | Claim in the deliverable | Checked against | Result |
|---|---|---|---|
| 1 | Apple Music 47333263 JSON-LD `description` = Hage bio ("Named after a Gram Parsons song, Luxury Liners were … The Believe EP followed in 2001. ~ Erik Hage"); no "Nashville-based" | `curl` music.apple.com today: exact text; 0 hits for "Nashville-based" | PASS |
| 2 | iHeart 384637 = same Hage bio; meta description "Great Day, New Beginning" | `curl` iheart.com today: bio present, "Erik Hage" present, meta/og/twitter description = "Great Day, New Beginning"; 0 hits for "Nashville-based" | PASS |
| 3 | iTunes lookup `amgArtistId` 468639; seven releases with dates (2000-05-01, 2001-03-01 "Believe - Single", 2003-05-01, 2006-10-01, 2021-08-27, 2026-02-13, 2026-04-17) | iTunes lookup API today | PASS (also matches F6) |
| 4 | MusicBrainz 7af7fd54: no begin date or area, no aliases; members Carpenter, Dewese, Wilstermann (no dates); 5 URL relations (http www homepage, Facebook, MySpace, Flickr collection 72157600177972175, iTunes id47333263); release groups *Overbored* 110c4bd6 and *Nonetheless* f45d4be4, with no dates | MB ws/2 API today | PASS (every item) |
| 5 | Discogs 4298743 profile "Indie rock band in Nashville, Tennessee. Originally formed in 1997 in Texas."; URLs FB and http://theluxuryliners.com/; members incl. Chad Edgington and "Jeff Lafrate"; name variation "Luxury Liners"; "Needs Vote" | Discogs API today | PASS |
| 6 | Spotify "Artist · 553 monthly listeners." | `curl` open.spotify.com today, `og:description` | PASS |
| 7 | Deezer 1518436: 6 albums, 48 fans | Deezer API today | PASS |
| 8 | Emmylou *Luxury Liner* released 1976-12-28, citing the 2004 Warner reissue note | Wikipedia raw wikitext today | PASS |
| 9 | Luxury (Iowa band) "played together from 1977 – 1982", power pop | Wikipedia raw wikitext today | PASS |
| 10 | Wikipedia search `"Luxury Liners" Dewese` gives 0 hits | Wikipedia search API today (`totalhits: 0`) | PASS |
| 11 | No Wikidata item | `wbsearchentities` was rate-limited for me today ("too many requests") | UNVERIFIABLE this round. The worker's own read and the GEO1/GEO2 reads stand |
| 12 | Carter Tanton "Luxury Liners" = MB 20764777, Person, US, "performance name for Carter Tanton", *They're Flowers* 2013 | MB API today: *They're Flowers*, 2013-04-02 | PASS |
| 13 | Press quotes: *Performing Songwriter* 7-04, *Metroland* 6-03 (Hage), *Rage* 10-03 (Todd Anderson), *Rage* 7-02, 4-02 and 9-01, Kool Kat 7-03; Splendid (Defosse), Lost At Sea (Andy Brown), Southeast Performer (aaron mendelsohn); "do not pull-quote" for the mixed reviews | dd research/04 lines 359–369 | PASS (word for word) |
| 14 | 2005 roster: David guitar/bass/vocals from May 1997; Chad Feb 1997–Apr 2001; Scott drums from Aug 1998; Larry bass from Dec 2000 (used in the §8.3 JSON-LD) | dd research/04 roster table (around line 333) | PASS |
| 15 | "Constellation Invitation" is *Overbored* track 10, 2:55, ISRC USEC40500240 (LL02 line 154) | LL02 lines 150–154 (it sits at line 154) | PASS (B1 is fixed) |
| 16 | *earpollution* writer is Erik Hage, cited as "R05 line 92" | dd research/05: line 92 is the interview quote with no byline; the byline "*earpollution*, Erik Hage, Aug 2001" is at **line 183** | PASS on the fact; **wrong line cited** (N3) |
| 17 | David's 2001 Manuel / Nudie suits / Emmylou / Kaufman account (R05 line 373); *Superdrag Tribute II* (Bomberpunk, 2004) LL track (R05 line 324) | dd research/05 lines 373 and 324 | PASS. R05 itself says to verify the account before using it; the deliverable's "David has said…" framing and Q13 respect that |
| 18 | daviddewese.com `LUXURY_LINERS_NOT` at `site.ts` line 32 says "1977 album"; the canonical line "co-founded in 1997 … who took it to Nashville together" is the dd `LUXURY_LINERS_LINE` | `site/src/lib/site.ts` lines 26 and 32 | PASS |

I also checked these against the owner decisions file:
- **F4:** the 1997 co-founding and Chad's 2001 exit.
- **F6:** the 2026 dates.
- **P8:** the four forever members.
- **P23:** no "2002 line-up" wording anywhere.
- **X1:** generic only (§4.2, line 8).
- **P5:** "never link" only.

All pass.

## Blocking issues

None.

## Non-blocking issues

1. **N1. Privacy: Chad's university is named.**
   - Where: §2.2 row 26 names Chad's college and calls it "a shared, publishable fact". That label is the worker's own judgment. The owner did not confirm it: P21 approves only the wording "college friend Chad Edgington".
   - Evidence: the daviddewese.com site source never names the university.
   - Fix: drop the university name from Chad's row, or mark it "internal; site says 'college friends' only (P21)".
2. **N2. The Baptist Standard URL is still in a repo file.**
   - The internal note in §9 keeps the full URL. Its slug states Chad's current calling and state. This follows round 1's instruction, but the note says "not for any public file" while it sits inside the website repo.
   - If this repo is ever pushed to a public remote, the slug goes with it.
   - Fix: move the URL to a non-committed or `.gitignore`d internal notes file, or say "URL held by Carly's team".
3. **N3. Wrong line cited for Hage.** The Hage *earpollution* byline is at dd research/05 **line 183**, not line 92. Line 92 has the interview with no writer. The error came from the round 1 critique and was copied in three places: §2.2 row 7, D14 and the Sources list. Correct the line number.
4. **N4. The §8.3 sketch pulls two ways on the founding place.**
   - The description says "co-founded in 1997 … who took it to Nashville together", which implies the band began in Texas. The same node sets `foundingLocation` to Nashville.
   - daviddewese.com deliberately omits `foundingLocation`.
   - Q10 flags the question, but the sketch should default to the dd state (omit `foundingLocation`) until Carly answers, so the two sites cannot disagree at launch.
5. **N5. Two tables are broken by blank lines.**
   - In §4.1, a blank line before the "Google Knowledge Graph" row splits the table.
   - In §8.2, a blank line before row 11 splits the table.
   - In Markdown, both orphaned rows render as plain text.
6. **N6. Sibling files disagree with this one.**
   - LL01 D10 (line 393) still calls the "Since 1998" text the "Apple/iHeart bio".
   - LL02 line 28 still says `curl` to api.discogs.com was refused, but this file and I both reached it today.
   - D13 notes the first. The history and discography tracks should be told to fix both, so the research set is consistent before the build.
7. **N7. Shazam is still single-source.** The claim that Shazam carries the Hage bio rests on the search summary plus the shared Apple ID. That is reasonable, and it is labelled correctly. Keep it in §9 as a hand check (it already is).
8. **N8. Some length could go.**
   - At 552 lines, some text is repeated: the Hage bio is restated in §1, §3.1, §4.1 and §6, and the long revision log repeats the body.
   - Not a defect, but the architecture track will want a one-page "canonical facts + sameAs + corrections" extract.

## What happens next

- Approved for the footprint track.
- Apply N1 to N5 in place. These are quick edits, and none needs another critic round.
- Pass N6 to the history and discography tracks.
