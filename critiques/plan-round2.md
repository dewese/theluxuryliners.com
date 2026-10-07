# Critique: plan track, round 2

**Reviewed:** `plan/00-master-plan.md` (Draft 2, 588 lines), `QUESTIONS-FOR-CARLY.md` (62 questions, 290 lines) and `README.md` (72 lines), against the brief and against `critiques/plan-round1.md`.
**Critic:** harsh critic, 2026-10-07.
**Score: 8.5 / 10**
**Verdict: APPROVED.** There are no blocking issues. The non-blocking items below should be fixed in the Phase 0 tidy, before `plan/10-story.md` is briefed.

## Summary

Round 1's blocker is fixed properly, not just patched:
- §4.1 item 2 now says "forever" is about the friendship, and that Chad left in 2001 (F4) and was not in the band in 2002 (P23).
- §4.3 has a new "Who is in the band now" row that says "not stated".
- The §5.3 status line no longer implies the four play together.
- §8.2 explains why Chad has `endDate` 2001 and Scott and Larry have none, and cross-references B2.
- `check-dist` gets a rule for current-membership wording near Chad's name.
- B2 in the questions file now asks who is in the band today.

All twelve round-1 non-blocking items were also handled:
- The schedule now starts Phase 1 after dd's M4 and states the overlap with M5 openly.
- Every question has both "why it matters" and a proposed default (62 of 62 of each).
- R3 no longer points at the excluded person.
- The dark-theme tokens are named and the failing figures are stated.
- The Emmylou Harris year is a warning, not a CI failure.
- Instagram and Facebook in `sameAs` wait on E7.
- Chapter 2 is retitled.
- `check-dist` rules exempt quotations.

I re-checked 22 claims and every one passed. The rest of this critique is polish plus one factual mis-merge that should be fixed before Story copy is written (N1).

## Checks (22 claims re-verified)

| # | Claim in plan | Source checked | Result |
|---|---|---|---|
| 1 | Legacy actions: 301 = 300, query = 32, rehost-same-path = 17, rehost-or-none = 78, keep/serve = 2/3, none = 243 (§7.2) | `data/legacy-urls.json`, recounted from `urls` | PASS |
| 2 | "630 of 675 archived URLs return 404 today" (§1, S4) | `research/legacy/live-status-2026-10-07.tsv` (no header row: 630 × 404, 6 × 403, 39 × 200); LL03 lines 70 and 538 | PASS |
| 3 | `releases.json` has 21 objects | the data file | PASS (21 objects: 4 album-type records including the LP, 1 EP, 3 singles, 9 compilation-type records, 4 free-archive items; this matches 7 + 1 + 8 + 4 + 1) |
| 4 | `assets.json` has 310 records | the data file | PASS |
| 5 | New contrast figures: `#9A0E16`/white 8.58; `#FF8A80`/`#111111` 8.27; `#7CC4F2`/`#111111` 9.92; `#CFE3F2`/`#6E1410` 8.99; failing figures 2.76, 2.57 and 1.37 | Recomputed with the WCAG 2.x formula | PASS (all 7) |
| 6 | Existing contrast figures: 9.64, 7.04, 6.85, 7.36, 11.11, 11.59, 18.88 | Recomputed | PASS |
| 7 | Release spine dates 2000-05-01, 2001-03-01, 2003-05-01, 2006-10-01, 2021-08-27, 2026-02-13, 2026-04-17 (§3.1) | iTunes lookup `id=47333263&entity=album`, live | PASS (agrees with F6 and P6) |
| 8 | Domain registered 1998-03-20 and expires 2027-03-19 (§7.2, R10) | Verisign RDAP, live | PASS |
| 9 | Discogs says "Originally formed in 1997 in Texas"; Discogs lists 5 members and spells the name "Lafrate" (§8.5 #4, B19) | Discogs API, artist 4298743, live | PASS |
| 10 | MusicBrainz: no begin date, an http homepage, and MySpace and Flickr links (§8.5 #3) | MusicBrainz API `7af7fd54-…`, live | PASS (`begin: null`; 5 URL links as stated) |
| 11 | Deezer `1518436` is the band; Tidal `5748092`; AllMusic `mn0000759673` (§8.3) | Deezer API, live; LL04 lines 66, 104, 215 | PASS |
| 12 | dd milestones: M3 2026-12-04, M4 2026-12-11, M5 to 2027-01-29 (§9) | `ARCHITECTURE.md` lines 36 and 2528–2530 | PASS |
| 13 | `LUXURY_LINERS_LINE` is at `site.ts` line 26; `LUXURY_LINERS_NOT` with "1977" is at line 32 (§8.1, §8.5 #7) | dd `site/src/lib/site.ts` | PASS |
| 14 | The canonical one-liner matches daviddewese.com word for word (§8.1, A8) | `site.ts` line 26 | PASS |
| 15 | Owner decisions as summarised in §2: F3, F4, F6, P1, P2, P3, P8 (the Larry story), P14, P17, P21, P22/P23 (exact caption), P27, P29, P32, P35, P40, P42, P43, O1, O3, X1 | `DECISIONS-2026-09-29.md` | PASS, except that rule 5 cites F6 for "never broke up" (N3) |
| 16 | The forever-members framing in §4.1, §4.3 and §8.2 no longer claims current membership | F4 ("continued … without him"); P23 | PASS (round-1 B1 resolved) |
| 17 | "Former Texans", *Nashville Rage* 2001 (§4.1, chapter 1) | LL01 line 84; LL04 §2.2 row 5 (Sep 2001, verified-source as a reprint) | PASS |
| 18 | Chad went to the Foxymorons' first show (SXSW, March 2000), confirmed-owner via the oral history (chapter 3) | `foxymorons.com/research/00-oral-history-carly.md` line 46; LL01 line 171 | PASS on the drive, but it understates Chad's part: the oral history lists Chad in the line-up, so he **played** the show (N2) |
| 19 | The 2008 band site said Chad would join David for a Texas CD-release show (§4.1; chapter 8; B15) | LL03 line 123: "the Nov 2008 news of **David's solo album**, with Chad Edgington ('1997-2001') joining him for a Texas CD-release show" | PASS as worded in §4.1. **Mis-framed** in B15 and chapter 8, which present it as a band show (N1) |
| 20 | Powder-blue suit photos from 1998–99 support the new chapter 2 title | LL05 lines 34, 138 and 254 (Flickr `2067311761` and others) | PASS |
| 21 | One Tree Hill air date 2004-02-24; "Sunshine" was the theme of the FOX Sports *US Youth Soccer Show*; the August 2002 Atlanta show opening for Blues Traveler | LL01 lines 47, 225 and 274; round-1 check 10 (web) | PASS |
| 22 | The 20 questions in §5.4 match success measure S5 | Counted | PASS (20) |

**Totals:** 22 PASS (one with a framing problem, N1; one understated, N2). None CONTRADICTED. None UNVERIFIABLE.

**Privacy and X1 sweep (plan, questions file and README):**
- The three files contain no college name, no Baptist Standard URL or slug, no church or career detail, no Gmail address, no family-page content and no X1 name or track number.
- The Baptist Standard slug and the college name still sit in `research/04` (line 126 and the line-438 internal note). The plan tracks this as RD5 and makes it the first thing to fix before anything is published or the repository is shared. That is the right control. Note that `research/04` line 126 now calls the college "a shared, publishable fact", while the questions file (C3) asks whether to publish it. Carly's answer to C3 wins, and RD5 should strip that phrase.

## Blocking issues

None.

## Non-blocking issues

**N1. The 2008 Texas show was for David's solo album, but the plan treats it as a band show.**
- **Where:** LL03 line 123 says the 2008 news was about **David's solo album**, with Chad joining *him* for a CD-release show.
- **Problems:**
  - B15's "why it matters" says it "would be the last known time Chad played with **the band**".
  - Chapter 8 lists "Chad at a Texas show (2008)" among Luxury Liners facts.
  - §4.1 uses it as evidence that the band never stopped being a band.
- **Risk:** this is the same kind of mis-merge as round 1's B1. Left alone, the Story could claim that Chad played a Luxury Liners show in 2008.
- **Fix:**
  - Reword B15: "the last known time Chad played with David".
  - In chapter 8, say "Chad joined David at a Texas release show for David's solo album *Make The Best Of It* (2008, single-source)".
  - In §4.1, keep it as a friendship fact, not band activity.

**N2. Chapter 3 understates Chad's part.** The oral history (line 46) lists Chad in the line-up of the Foxymorons' first show. He played it; he did not just drive. Write: "Chad drove to Austin with David and played the Foxymorons' first show (SXSW, March 2000)". This is also the stronger link between the two bands.

**N3. Rule 5 cites the wrong decision.**
- **Problem:** §2 rule 5 cites "`DEC` F6" for "never broke up". F6 is only about the 2026 singles and their dates.
- **Fix:** cite David's quote (LL01 §4.7), the assets-round2 critique N3 and, if wanted, P3 (long gaps between releases). Do not cite F6.

**N4. Phase 0 exit depends on the browser pass, which phases are not supposed to do.**
- **Problem:** Phase 0 can exit only when `/history/concerts.html` and the three missing journal months are read. Yet R6 and the launch gates say launch does not depend on unread pages. Phase 1 also has a fixed start date (2026-12-14), even though §9 says phases end "on exit criteria, not on a date".
- **Fix:** say what happens if the browser pass has not happened by 2026-12-11. For example: "Phase 1 may start; the unread pages move to layer L5 and the Shows page launches with what is sourced."

**N5. Cross-reference dd's own commitments about this domain.**
- **Problem:** the dd architecture says:
  - DL-27: theluxuryliners.com "stays on GoDaddy DNS".
  - M4 (DL-32): "Nothing is changed on theluxuryliners.com".
  - M5 (to 2027-01-29): "Hand the optional theluxuryliners.com pack to the band".

  This plan moves the zone to Cloudflare in Phase 2 (about 2027-01-11) and recommends not pasting that pack (A6). Neither choice conflicts with an owner decision, but the M5 handover task and Phase 2 fall in the same weeks.
- **Fix:** name DL-27, DL-32 and the M5 task in §7.2 or PD3, and ask dd's maintainer to drop the M5 handover task once A6 is answered, so the two teams do not act on the same domain at once.

**N6. Direction A's dark theme has no link or UI tokens.** §6 says dark-theme tokens are named "where a direction has a toggle". Direction A has a toggle (P35), but only its colour pairs are given; it names no link or accent token for either theme. Name them, or say that A uses Duotone's derived-token rules (`DD-ARCH` §7.0) unchanged.

**N7. The Facts page has to answer "Who is in the band?", but the answer is not written.** §5.4 lists that question, and §4.3 says current membership is "not stated". Write the interim answer now (for example "Its forever members are … Chad Edgington was a member from 1997 to 2001."), so the storyteller does not improvise one.

**N8. Small items.**
- **§13 numbering:** PD10 comes after PD13. Renumber.
- **README after this round:** the status line and the deliverables table still say "round 2 awaiting critic". Record 8.5/10 APPROVED and point to this file.
- **Questions file V2:** "crediting the taper by name only". Tapers are listed as private people in rule 3. A name credit is fine, but make it the name as it appears on the Internet Archive item, nothing more.
- **Questions file A12:** daviddewese.com's form goes to david@dewese.com (P2). Mention that precedent next to the proposed Gmail default.

## What would raise the score

Fix N1 and N2 in the brief for `plan/10-story.md`. Those two, together with RD5, are the points where wrong or private material could reach public copy.
