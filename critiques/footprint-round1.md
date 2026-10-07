# Critique: footprint, round 1

Reviewed: `research/04-press-and-digital-footprint.md` (428 lines). This track produced no data files. Critic run 2026-10-07.

**Score: 6 / 10**
**Verdict: NOT APPROVED.** There are three blocking issues. Each is a factual error on a core part of the brief (platform bios and entity state), and each leads to a wrong recommendation.

## Summary

The structure is strong and most of the content is good:
- The press inventory is thorough, with 26 items. Every quote I checked is word-for-word against dd research/04 §5.2.
- The quote policy is careful (no pull-quotes from the mixed reviews).
- The collision table and the sameAs rules are good.
- The "needs a browser" list and the discrepancy table are useful.

Owner decisions are followed throughout:
- **F4:** co-founders, with Chad's 2001 exit.
- **P8:** the four forever members, with no `endDate` for Scott and Larry.
- **F6 and P6:** the 2026 dates and the Spotify-date rule.
- **P5:** isawtheocean.com appears only in the "never link" rule.
- **X1:** the MusicBrainz X1 material is described only in general terms.
- **F3:** Dallas is used only to show that "Nashville-based" is out of date.

I found nothing that contradicts an owner decision.

The problems are in the live-platform layer. The worker treated WebFetch refusals as "the host is blocked." In fact, plain `curl` reached MusicBrainz, the Discogs API, the iTunes lookup, music.apple.com, iheart.com and open.spotify.com from this environment today. The worker also skipped a first-hand read already on disk: dd `research/03-standards-and-stack.md` line 549 records the Apple Music bio, fetched. The result is three wrong statements about what the platforms say. One wrong statement contradicts this project's own discography file.

## Checks (17 claims re-verified)

| # | Claim in the deliverable | Checked against | Result |
|---|---|---|---|
| 1 | Press quotes: *Performing Songwriter* 7-04, *Metroland* 6-03 (Hage), *Rage* 10-03 (Todd Anderson), *Rage* 7-02, 4-02, 9-01, AllMusic 9-01 (Hage), Kool Kat 7-03; mixed reviews in Splendid and Lost At Sea | dd research/04 lines 357–369 | PASS (word-for-word) |
| 2 | *Nashville Scene* "Catching Up Fast", Noel Murray, July 2001; "a rapidly developing, often stunning tunesmith" | dd research/05 lines 93, 190 | PASS |
| 3 | *earpollution* interview, Aug 2001, writer "unknown" | dd research/05 line 92: "earpollution, **Erik Hage**, Aug 2001" | CONTRADICTED (the writer is known) |
| 4 | CDX: press.html 2000-10-22 (200), links.html 2001-07-11, one-sheet PDF 2003-04-14 | `cdx-theluxuryliners.com.json` | PASS |
| 5 | 2005 roster roles and years used in the JSON-LD sketch (David and Chad: guitar, bass, vocals; Scott Aug 1998; Larry Dec 2000) | dd research/04 lines 330–341 | PASS |
| 6 | Tidal dates: "New Beginning" 2026-04-10; *Overbored* 2003-01-01 | LL02 lines 133, 224, D4, D5 | PASS |
| 7 | Last.fm "Constellation Invitation" is "no such title in any LL release (LL02)" and is a probable mis-merge | LL02 line 154: track 10 of *Overbored* (ISRC USEC40500240); LL01 line 201; foxymorons research/01 line 307 | **CONTRADICTED** (B1) |
| 8 | Apple Music, iHeart (and Last.fm/Shazam) carry the "Nashville-based rock band … Carpenter, Dewese, Wilstermann … since 1998" blurb | Live today: music.apple.com/us/artist/the-luxury-liners/47333263 (JSON-LD `description`) and iheart.com/artist/the-luxury-liners-384637 both show the **Erik Hage / AllMusic bio** ("Named after a Gram Parsons song, Luxury Liners were…", signed "~ Erik Hage"). dd research/03 line 549 already recorded the Apple text as fetched | **CONTRADICTED for Apple and iHeart** (B2). Last.fm attribution UNVERIFIABLE (the page returns 406 to scripts). The most likely home for the blurb is the Last.fm wiki, shown on the similar-artist cards that surface for this query |
| 9 | "Shazam … suggests Apple licenses the AllMusic bio (inference; unverified)" | Apple page (above); iTunes lookup for 47333263 returns `amgArtistId: 468639` | CONTRADICTED as a label: this is **verified**, not an inference |
| 10 | MusicBrainz 7af7fd54: "URL rels: Apple 47333263 (itunes form) only"; "no … official-site … links"; members Carpenter, Dewese, Wilstermann; release groups *Overbored* and *Nonetheless*; no begin date | MB ws/2 live today (`curl`): URL rels are **official homepage http://www.theluxuryliners.com/, Facebook, MySpace, Flickr collection 72157600177972175, iTunes 47333263**. Members and release groups as stated; begin date null | **CONTRADICTED** on URL rels (B3); PASS on the rest |
| 11 | Discogs 4298743 profile: "Originally formed in 1997 in Texas"; five members incl. Chad and "Lafrate"; recommendation to "add the official site URL" | Discogs API live: profile "**Indie rock band in Nashville, Tennessee.** Originally formed in 1997 in Texas."; URLs already include `http://theluxuryliners.com/` and Facebook; members Chad Edgington, David Dewese, Jeff Lafrate, David Wilstermann, Scott Carpenter (5) | PASS on members. Profile **half-quoted**. The "add official site" fix is redundant (N3) |
| 12 | Spotify bio and monthly listeners "not found" (host blocked) | open.spotify.com artist page reachable with `curl`: "Artist · **553 monthly listeners**" | CONTRADICTED (the data was there to be had; N4) |
| 13 | No Wikidata item for the band | Wikidata API rate-limited this run (as in GEO2) | UNVERIFIABLE (the GEO1 2026-10-03 read stands) |
| 14 | Emmylou Harris *Luxury Liner*: year contested, 1976 vs 1977 | WebSearch (the Wikipedia "Luxury Liner (album)" result): released 1976-12-28 in the US, 1977-01-14 in the UK; Billboard chart 1977 | PASS as "contested", but now resolvable (N5) |
| 15 | Luxury (Iowa band), Des Moines power pop, 1977–82 | WebSearch: the Wikipedia "Luxury (Iowa band)" result | PASS |
| 16 | No press found for "Great Day" or "New Beginning" (2026) | WebSearch: only cruise results | PASS |
| 17 | daviddewese.com LL band page not deployed; `LUXURY_LINERS_SAME_AS` has 7 entries; the disambiguation constant | `site/BUILD-LOG.md` lines 360, 432; `src/lib/jsonld.ts` lines 46–54; `src/lib/site.ts` line 32 | PASS |

## Blocking issues

**B1. A real *Overbored* track is called a mis-merge.**
- Where: §3.4 says "Constellation Invitation" has "no such title in any LL release (LL02)", blames Carter Tanton, and §7 #7 says to "report" it to Last.fm. §9 repeats it.
- Evidence: the cited file says the opposite. LL02 line 154 lists "Constellation Invitation" as *Overbored* track 10 (2:55, ISRC USEC40500240). LL01 line 201 and the Bandcamp tracklist agree.
- Why it blocks: the error cites as its source the file that refutes it. Acting on it would ask Last.fm to remove the band's own song.
- Fix:
  - Delete the mis-merge claim.
  - Turn the Last.fm track page into a positive signal: the catalogue is scrobbled at track level.
  - Remove the §7 #7 "report" step and the §9 row.

**B2. The bios are attributed to the wrong platforms, so the correction plan aims at the wrong targets.**
- Where: §1 point 3, §3.2, the iHeart row in §3.5, the Apple row in §4.1, §7 #4 and #8, and row 14 of §8.2.
- Evidence: music.apple.com and iheart.com, read live today, both carry the **Erik Hage AllMusic bio**, signed "~ Erik Hage". They do not carry the "Nashville-based rock band" blurb. The iTunes lookup ties the artist to AllMusic (`amgArtistId 468639`). The Apple bio was already recorded as fetched in dd research/03 line 549, which the worker did not use.
- Why it blocks: the brief asks for the bio on each platform, quoted and assessed. Two of the four main attributions are wrong. As a result, §7 tells David to "replace the Apple bio" and to "fix the iHeart blurb at the source". In fact one upstream fix, to the AllMusic bio, would correct Apple, iHeart and Shazam together.
- Fix:
  - Re-attribute the Hage bio to Apple, iHeart and Shazam, citing the live reads and dd research/03 line 549.
  - Mark the "Nashville-based" blurb as **source unknown**. The probable source is the Last.fm wiki. Note that it may also be a search-engine composite.
  - Re-order §7 so that the AllMusic correction ranks with Wikidata, since it is the one root fix for the bio repeated on Apple, iHeart and Shazam.
  - Remove the "Apple bio may not be editable (unverified)" hedge, and say plainly that it is AllMusic-syndicated.

**B3. The MusicBrainz state is wrong.**
- Where: §1 point 5, the MB row in §4.1, and §7 #3.
- Evidence: the deliverable says the MB record has only an Apple link and no official-site link. The live MB API today shows five URL relations: official homepage (http, not https), Facebook, **MySpace** (a dead platform), a Flickr collection, and iTunes 47333263. dd research/03 line 549 also records the official homepage.
- Why it blocks: entity state is a named deliverable, and §7 #3 would have editors "add" links that already exist. It also misses the real fixes:
  - change the homepage to https;
  - end or remove the MySpace link;
  - decide whether a Flickr link belongs on the band record.
- Fix: rewrite the MB row and §7 #3 from a fresh read (`curl "https://musicbrainz.org/ws/2/artist/7af7fd54-1d1b-4353-ab60-4b61bceed337?inc=url-rels+artist-rels+release-groups&fmt=json"` works from this environment).

## Non-blocking issues

1. **N1. Privacy: the headline gives away what the text holds back.**
   - Row 26 of §2.2, §9 and the Sources list all print the Baptist Standard headline and slug (headline withheld). That headline states Chad's current calling and state.
   - Line 10 promises not to repeat such details, and this table is the source for the future `/press/` page.
   - Cite the item as "*Baptist Standard* profile of Chad Edgington (internal only; headline withheld)". Keep the URL only in a clearly internal note. History round 1 raised the same point (N5); make both files consistent.
2. **N2. Erik Hage wrote three items.**
   - He is the writer of the *earpollution* interview (dd research/05 line 92), as well as the AllMusic bio and the *Metroland* review. Fill in the writer in row 7.
   - Add a note that three of the "independent" items share one critic. This matters for the Wikipedia/Wikidata notability argument in §4.1.
3. **N3. The Discogs profile is half-quoted.**
   - The full text is "Indie rock band in Nashville, Tennessee. Originally formed in 1997 in Texas."
   - The "Indie rock … in Nashville" half is itself a stale present-tense claim and a genre mismatch (power pop), so it needs fixing too.
   - Discogs already lists the official site and Facebook, so drop "add the official site URL" from §7 #5.
4. **N4. The note on web access overstates the blocking.**
   - WebFetch was refused, but `curl` works for MusicBrainz, the Discogs API, the iTunes lookup, Apple, iHeart and Spotify. AllMusic and Shazam return 403, and Last.fm returns 406.
   - Record Spotify's **553 monthly listeners** (2026-10-07) as a baseline, and correct the list of "blocked" hosts.
5. **N5. The Emmylou Harris year can be resolved.**
   - Per the Wikipedia result: released 1976-12-28 in the US, 1977-01-14 in the UK.
   - Recommend that the site either omits the year or says "1976". Flag that daviddewese.com `site.ts` line 32 (`LUXURY_LINERS_NOT`, "1977 album") needs the same fix, so that the two sites agree.
6. **N6. Material on disk is missing.**
   - dd research/05 line 373: David's 2001 account of meeting Emmylou Harris and Phil Kaufman and wearing Nudie suits. This is a strong, sourced GEO fact for the namesake/disambiguation rows. Use it as a link, not just a collision.
   - dd research/05 line 324: a Luxury Liners track on *Superdrag Tribute II* (Bomberpunk, 2004). This is a compilation appearance absent from the press/footprint and Discogs gap lists.
7. **N7. The Wikidata "founded by" plan won't work as written.** P112 takes an item, not a string. If Chad gets no item for privacy reasons, use "unknown value" with an "object named as" (P1932) qualifier, or omit him and rely on the description. Say this explicitly.
8. **N8. The AI-answer sample may be circular.** The "AI answer engines repeat both errors" sample may simply be the search tool restating whatever page carries the "Nashville-based" text. Say that the source of that text is unconfirmed, and keep the stronger evidence (the live Apple and iHeart bios) at the front.
9. **N9. The "22 queries, the official site never appeared" claim cannot be checked.** It is plausible, but there is no query log. List the queries, or soften the wording to "in this session's searches".

## What round 2 must do

1. Fix B1–B3 using the live reads above.
2. Apply N1–N5.
3. Re-check §1 and §6 so the summary matches the corrected platform table.

I expect an 8+ once the three blocking errors are fixed. The rest of the file is careful and well sourced.
