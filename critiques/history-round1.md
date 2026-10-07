# Critique: history, round 1

Reviewed: `research/01-band-history-and-people.md` (485 lines). This track produced no data files; `data/releases.json` and `data/legacy-urls.json` belong to other tracks and were only cross-checked. Critic run 2026-10-07.

**Score: 8.5 / 10**
**Verdict: APPROVED** (score of at least 8, no blocking issues). The non-blocking fixes below should still go in before any of this text is used for site copy.

## Summary

This is the strongest first-round history file in the three projects. It meets every part of the brief:
- the origin story told under F4, with the archive accounts kept as context;
- the name and the move from alt-country to power pop;
- a line-up table by period, a members table and a guests/credits table, both with a public-OK column;
- the eras from 1997 to 2026;
- labels, producers and studios;
- showcases, venues, radio and TV;
- the Nashville scene, and the links to The Foxymorons and David's solo work;
- anecdotes, a year-by-year timeline, contested facts, open questions and a "needs a browser" list.

Every fact carries a source key and a confidence label. The authority order is stated and followed.

**Owner decisions.** I checked the file against every decision that applies to it:
- **F4:** co-founded 1997 by David and Chad; Chad left Nashville in 2001; David carried the band on. The talent-show story is held back for Carly's OK.
- **F6:** the two 2026 singles and their dates.
- **P6:** Spotify dates are used as the public dates.
- **P8:** the four forever members, with the "Larry" nickname story.
- **P22/P23:** the caption is exact, and the file warns against "the 2002 line-up".
- **P27:** "Shake It Up" is an original; track 3 of the *Believe* EP is Cher's "Believe".
- **P9:** The Nobility.
- **F3:** David lives in Dallas.
- **P5:** isawtheocean.com is never linked.
- **X1:** nothing that looks like a 1990s side project appears. The file even leaves out David's pre-LL college bands, which daviddewese research/02 lists.

I found no contradiction with any owner decision.

**Re-verification.** I checked 16 concrete claims against the files on disk and the web. The file's own mistakes are small: one confidence label set too high, one list of songs written wrongly, one Flickr photo cited from the wrong album, and some facts on disk that the worker left out. None of them changes the story.

**Web access.** I confirmed that the network blocks the pages the worker could not open. WebFetch returned EGRESS_BLOCKED for onetreehill.fandom.com and tunefind.com. I have not penalised the worker for relying on search snippets, which the file says plainly.

## Checks

| # | Claim in the deliverable | Checked against | Result |
|---|---|---|---|
| 1 | 2005 roster: Chad Feb 1997–Apr 2001; David May 1997–current; LaFrate Jun 1997–Apr 1998; Winchester Dec 1997–Apr 1998; Kyle Edgington May–Aug 1998; Scott Aug 1998; "Larry" Dec 2000; Jeffries (tambourine, one show) | dd research/04 §5.2 roster table | PASS |
| 2 | Talent-show intro quote ("resurrected the name, invented 'Texas Pop'… 'get famous'") | dd research/04 §5.2, verbatim | PASS (correctly fenced off under F4) |
| 3 | AllMusic/Hage 9-01 quote; *Nashville Rage* 9-01, 4-02, 7-02 and 10-03; *Metroland* 6-03; *Performing Songwriter* 7-04 | dd research/04 §5.2 press list | PASS (verbatim) |
| 4 | David 2001 (*earpollution*): "I named my band after a Gram Parsons song…"; the Nudie suits; "Blockbuster… played it for four years"; the "Baby Blue" reject | dd research/05 lines 177, 371, 373 | PASS |
| 5 | "Chad's Last Show – March 2001", "Matching gray slacks from Castner-Knott" | `data/photos.json` id 530769478 | PASS. But the photo's `date_taken` is **2001-04-21**, which the file does not mention (see N3) |
| 6 | "I moved to Nashville 13 years ago to make music. Mission accomplished!" (2010-10-27) | photos.json 5122724227 | PASS |
| 7 | "Scott & I post gig. Played all old-school Luxury Liners songs." / "Rocking the '97 suit." (2009-10-03) | photos.json 3978343931 | PASS |
| 8 | Grand Rapids tour, Oct 2007, The Intersection, cited as `PH:4449282315` | photos.json: that photo sits in the album "**Solo Artist Egomaniac**"; R06 has a separate album, "Luxury Liners - Grand Rapids, MI" (33 photos, Oct 2007) | PASS on the fact; the citation is wrong (N6) |
| 9 | *Trunk Box* MP3 paths `/mp3/waco/…`: be_with_you, blockbuster, if_i_cry, shake_it_up, say_goodbye | CDX: four are 200 (June 2001); `say_goodbye` is **404** under `/web/mp3/waco/` | PASS in part. The list is also called "songs heard nowhere else", which is wrong for "If I Cry" (*Nashpop*) and "Shake It Up" (*Believe*) (N4) |
| 10 | Photo-archive filenames 97_12th_porter, 97_opry, 97_pajamas, 98_hard_rock, 98_waco, 99_* | CDX `/history/photos/` | PASS (and labelled as inference) |
| 11 | *Sound As Ever* EMLLCD1001 Echomusic/Litterbug; *Believe* EMLLCDP1002; writers of tracks 1–2 Edgington/Dewese/Carpenter; *Overbored* LLCD1003; *Nonetheless* LLCD1004 and its credits | dd research/01 §LL entries | PASS |
| 12 | "Shake It Up (Live)" UPC 662582233728, ISRC US2762100919; "Great Day" ISRC USQ7J2600001; *Sound As Ever* LP ZZZ056, 2026-05-27, 100 copies, Anders Peterson | dd research/01 lines 73, 330, 384, 398 | PASS |
| 13 | "Dreaming" on *One Tree Hill* S1 E15, "Suddenly Everything Has Changed"; air date "unverified, probably early 2004" | dd research/04 line 248; WebSearch: the episode aired **2004-02-24**, and both the One Tree Hill fandom wiki and Tunefind list "Dreaming" by The Luxury Liners | PASS. The date can now be filled in at single-source or better (N2) |
| 14 | echomusic: formed 1999 by Mark Montgomery and Neil Einstman; sold to Ticketmaster/IAC in 2007 | WebSearch: Wikipedia "Mark Montgomery (entrepreneur)" snippet (March 2007, $25M); MusicRow "Montgomery To Exit Echo" | PASS |
| 15 | Texas Music Café, Waco, founded 1997; TV/radio series | WebSearch: destinationwaco.org and Baylor Lariat (founded 1997 by the Ermoian brothers; PBS and AFRTS) | PASS |
| 16 | Mike Poole: a Nashville engineer and producer (newhaven.edu profile) | WebSearch: the profile says he is a Nashville-based engineer (MTSU; credits include The Byrds and Patty Griffin) | PASS. Same person, no name collision |
| 17 | Monsters of Pop, June 11–13, 1998, "the Byrds-influenced Luxury Liners" | WebSearch could not show the Luxury Liners on the bill; it only confirmed that the festival and Lee Swartz existed | UNVERIFIABLE (the file already labels it single-source, D13) |
| 18 | *Billboard* "Hot Prospects" 1998 | WebSearch found nothing; the Baptist Standard search did not bring up the profile | UNVERIFIABLE (the file already labels it unverified, D5) |
| 19 | Summary: "it became a sharp-dressed guitar power-pop band (`DEC` F4, P21; confirmed-owner)" | DECISIONS F4 and P21 | **CONTRADICTED as sourced.** Neither decision says "sharp-dressed" or "power pop"; that comes from AllMusic and *Nashville Rage* (N1) |

## Blocking issues

None.

## Non-blocking issues (fix in the next pass)

1. **N1. A confidence label is set too high (§1, line 41).** "Sharp-dressed guitar power-pop band" is credited to F4/P21 as confirmed-owner. Neither decision says it. Credit the sound to AllMusic 9-01 and the look to *Nashville Rage* 7-02, as verified-source. Only "co-founded in 1997 with college friend Chad Edgington, took it to Nashville" is confirmed-owner.

2. **N2. The *One Tree Hill* air date can be found.** The episode aired 2004-02-24 (One Tree Hill fandom wiki and Tunefind, via search; both pages are blocked for fetching). Update §4.7 and the timeline row "2004? / n.d." to "2004-02-24 (episode air date; single-source, search)". Keep Q8 only for how the placement happened and for the FOX Sports dates.

3. **N3. D3 leaves out evidence.** The Flickr record for "Chad's Last Show – March 2001" has `date_taken` 2001-04-21, which matches the roster's "Apr 2001". Add it to D3 with a caution that the camera clock could be wrong. The public rule ("2001" only) stays.

4. **N4. The *Trunk Box* wording is wrong (§4.1).** "Including songs heard nowhere else" should cover only "Trans-Am Mind" and "Araby". "If I Cry", "Shake It Up" and "Blockbuster" are heard or documented elsewhere. Also:
   - Say that the `say_goodbye` path is a 404 capture, and that "Say Goodbye" may be "How Do I Say Goodbye" from *Sound As Ever* (unverified).
   - Add the finding from the discography critique: every *Live Liners* MP3 path in the CDX is a 404, so no live audio from 2002 survives in the archive. §4.4 currently implies the files exist.

5. **N5. Privacy: the source URL gives away what the text holds back.** Line 10 promises no current workplaces, churches or other private details for Chad. But the profile URL, quoted in full in §11 and §12, gives private details in its slug. Keep the link for the human checker, but move it into a clearly internal note ("internal only; never cite on the site") or cite it by title alone. Also note that the college is David's college too (dd research/02 line 39; research/05 line 50). That makes the college a shared, publishable fact behind "college friend" (P21), not a private detail about Chad alone. Say so, so that later writers don't strip it out or misuse it.

6. **N6. Fix the Grand Rapids citation.** Cite R06's album "Luxury Liners - Grand Rapids, MI" (Oct 2007) for the tour, not `PH:4449282315`, which is filed under David's solo album "Solo Artist Egomaniac". The two 2007 entries ("Dec 2007 Luxury Liners and Nobility show") rest on album titles. Say so.

7. **N7. Facts on disk that were left out:**
   - the *From The Vaults 1997–2001* collection on the 2005 music page (dd research/04 §5.2);
   - the second Luxury Liners demo, **"Breakaway"**, on the 2008 Kool Kat bonus disc (dd research/01 line 443). Only "Great Day" is mentioned, but the same disc also has LL covers of Superdrag, the Lemonheads and Jetpack UK;
   - the 2001 "Capitol" photo shoot (R06 "ARCHIVE: Random Liners"; R04 thinks it may be from the July 2002 DC trip).

   These belong in §4 or §9 and in the Vault lead list.

8. **N8. The streaming history is misdated (§4.7, "2014–2020").** "The band's catalog went to streaming via Litterbug" is placed in 2014–2020. The ISRC prefixes show earlier digital distribution: USEC405…/USEC406… for *Sound As Ever*, *Overbored* and *Nonetheless* (2005–06), and USQ7J10… for the *Believe* EP (2010). There is also a 2010 Spotify duplicate of *Believe*. Restate it as "digital release c. 2005–2010 (inferred from ISRC years; unverified)".

9. **N9. Unsourced superlatives.**
   - "The only good photo of all four forever members together" (§3.1): P22 calls it the lead photo; it does not say it is the only good one. Soften it.
   - The note that the 2001 *Nashville Scene* profile "names family members" needs a source pointer, or should go.

10. **N10. Trey Mitchell.** R06's credit table credits Trey Mitchell for photo 2068108482. The file calls him "possibly" the photographer and marks it unverified. Give his confidence as R06 records it, and cite R06 instead of a "note".

11. **N11. Layout.** The brief asks for "Discrepancies / open questions" at the end. They are in §10, followed by §11 (needs a browser) and §12 (sources). That is acceptable, but think about moving §10 to the end, or adding a pointer to it from §1.

## What would raise the score

Fix N1–N6: about 30 minutes of editing, mostly from facts already on disk. That and the missing items in N7 would take this to 9 or more. To get past 9, someone with a browser must read the never-opened `/history/concerts.html` capture (2003). It is the only real gap in the history (the 1997–2000 shows).
