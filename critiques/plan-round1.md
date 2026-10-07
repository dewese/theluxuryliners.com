# Critique: plan track, round 1

**Reviewed:** `plan/00-master-plan.md` (Draft 1, 551 lines), `QUESTIONS-FOR-CARLY.md` (62 questions), `README.md`.
**Critic:** harsh critic, 2026-10-07.
**Score: 7.5 / 10**
**Verdict: NOT APPROVED.** There is 1 blocking issue. It is a small fix, but it sits in the story spine, which every later copy deliverable will build on.

## Summary

This is a strong synthesis. It covers every section in the brief: mission and measurable success criteria, ground rules, the state of research with critic scores, the story spine, the full page list, three design directions, technology, authority and AI visibility, phases with exit criteria, risks, and a discrepancies section at the end.

Almost every number I re-checked is correct:
- the legacy-URL action counts, the release spine dates and the domain expiry;
- all 8 contrast ratios;
- the DD-ARCH milestones, Astro 6.4.8 and the Error 1000 reasoning;
- the `site.ts` line numbers and the MusicBrainz, Discogs and Apple identifiers.

The research debt table (RD1–RD15) faithfully carries every non-blocking item from the five research critiques. I found no privacy leak in the plan text, and no X1 name.

The failures are in the synthesis itself:
- **One owner-decision conflict (blocking).** The spine says all four forever members are still in the band today, which contradicts F4 and P23.
- **One factual mis-merge.** The plan puts Scott at the Foxymorons' first show; the research says Chad drove David there.
- **A schedule that contradicts itself.** The plan says it avoids daviddewese.com's launch window, but Phase 1 runs straight through it.
- **Uneven question formatting.** Half the owner questions lack the "why it matters" line the brief requires.

## Checks (22 claims re-verified)

| # | Claim in plan | Source checked | Result |
|---|---|---|---|
| 1 | Legacy URL actions: 301 = 300, query = 32, rehost-same-path = 17, rehost-or-none = 78, keep/serve = 2/3, none = 243 (§7.2) | `data/legacy-urls.json` `counts` and a recount of `urls` | PASS |
| 2 | `/ethan.html` 301s to `/` only; `/history/concerts.html` first captured 2003-06-07 → `/shows/` | `data/legacy-urls.json` rows | PASS |
| 3 | releases.json has 21 objects (7 releases, 1 reissue, 8 appearances, 4 archive items, 1 lead); assets.json has 310 records; 274 Flickr photos, 248 usable | data files, recount | PASS |
| 4 | Release spine dates 2000-05-01, 2001-03-01, 2003-05-01, 2006-10-01, 2021-08-27, 2026-02-13, 2026-04-17 (§3.1) | iTunes lookup `id=47333263`, live 2026-10-07 | PASS (agrees with F6 and P6) |
| 5 | Domain registered 1998-03-20, expires 2027-03-19 (§7.2) | Verisign RDAP, live | PASS |
| 6 | MusicBrainz: no Chad, no begin date, http homepage, MySpace and Flickr links (S3, §8.5) | MB API `7af7fd54-…`, live | PASS (3 members, no Chad, `begin: null`) |
| 7 | Discogs profile says "Originally formed in 1997 in Texas"; spelled "Lafrate" (§8.5 #4) | Discogs API artist 4298743, live | PASS |
| 8 | Spotify artist `3416B3EOd5itWZazwzw9Qc` is the band; `6IkyFyVyUt99P1jjMllZ5m` is a collision (§8.3) | Spotify page titles, live | PASS ("The Luxury Liners" vs "Luxury Liners") |
| 9 | Deezer `1518436` is the band | Deezer API, live | PASS |
| 10 | *One Tree Hill* S1 E15 aired 2004-02-24 with "Dreaming" | WebSearch (Wikipedia season page, fandom) | PASS |
| 11 | Carter Tanton's Luxury Liners, *They're Flowers*, 2013 (§8.4) | MusicBrainz release-group search: 2013-04-02, artist "Luxury Liners" | PASS |
| 12 | Emmylou Harris's *Luxury Liner* is "1976", and CI bans "1977" (§4.3, §7.4) | MusicBrainz release group gives **1977**; LL04 D8 uses Wikipedia's 1976-12-28 | UNVERIFIABLE / contested (see N6) |
| 13 | All 8 contrast figures in §6 (8.70, 11.11, 11.59, 9.64, 7.04, 6.85, 18.88, 7.36) | Recomputed with the WCAG 2.x formula | PASS |
| 14 | `LUXURY_LINERS_LINE` is at `site.ts` line 26 and `LUXURY_LINERS_NOT` (with "1977") at line 32 | dd `site/src/lib/site.ts` | PASS |
| 15 | dd milestones: M3 2026-12-04, M4 2026-12-11, M5 to 2027-01-29; Astro 6.4.8; Node 24; Zod 4; Error 1000 for a proxied Carrd record | `ARCHITECTURE.md` lines 36, 338, 2390 | PASS |
| 16 | Owner decisions as cited: O1, O3, F3, F4, F6, P1, P2, P3, P5, P6, P8, P14, P17, P21, P22/P23, P27, P29, P32, P35, P36, P40, P42, P43, L1, R1, X1 | `DECISIONS-2026-09-29.md` | PASS, except check 17 |
| 17 | "The four 'forever members' (P8) are still the band's members today" (§4.1 item 2); status line "the same four friends" (§5.3) | F4 ("David continued The Luxury Liners **without him**"); P23 ("Chad was not in the band then"); LL01 line 117 (Chad 1997–2001); the plan's own §8.2 (Chad `endDate` 2001) | **CONTRADICTED** (B1) |
| 18 | "Chad and Scott at the Foxymorons' first show (SXSW 2000)" (§4.2 ch. 3) | LL01 lines 171 and 261 (Chad drove David to it); FM research `04-people-and-scene.md` line 115 (players: Dewese, Chad Edgington, Jackson Chang, Carlos Lopez) | **CONTRADICTED** (N1) |
| 19 | "Great Day" demo on the 2008 bonus disc, 3:22; titles on the 2005 MP3 list (single-source) | LL02 lines 229, 273, 387; LL03 lines 281–283, 661 | PASS |
| 20 | "Precious To My Heart" on *Fireworks Vol. 3* (2025); LP cover credited to Jim Horan | LL02 lines 100, 256, 275 | PASS |
| 21 | 2002 photo is 1096×848 and AI-enhanced; keep that fact in metadata only | LL05 line 125; P22 | PASS |
| 22 | Phase dates "avoid daviddewese.com's own launch window"; R5 "Phases start after dd's M4" | Plan §9: Phase 1 runs 2026-11-30 to 12-18, across dd M3 (12-04) and M4 (12-11); Phase 2 runs 2027-01-04 to 01-29, the same span as dd M5 | **CONTRADICTED** (N2) |

**Totals:** 18 PASS, 3 CONTRADICTED, 1 UNVERIFIABLE (contested).

**Privacy and X1 sweep:**
- The plan, the questions file and the README contain no college name, no Baptist Standard URL, no church or career detail, no family-page content and no Gmail address.
- X1 is never named. The only exception is the pointer in N4.

## Blocking issues

**B1. The story spine says Chad is still in the band, which contradicts F4 and P23.**
- §4.1 item 2 says: "The four 'forever members' (P8) are still the band's members today."
- §5.3's sample status line says: "the same four friends."

Neither statement is supported:
- P8 names the forever members but says nothing about current membership.
- F4 says David "continued The Luxury Liners without him".
- P23 says "Chad was not in the band" in 2002.
- LL01 gives Chad's years as 1997–2001.
- The plan's own JSON-LD (§8.2) gives Chad an `endDate` of 2001, so it contradicts itself.

Because §4 is the brief for `plan/10-story.md` and the home page, this sentence would turn into public copy and `llms.txt` text.

**Fix:**
- Reword item 2 along these lines: "P8 calls the four 'forever members'. Chad left in 2001, but he is in the 2002 photo of all four, and David refuses to say the band broke up."
- Make the §5.3 example status line one that does not claim the four play together now.
- Add a §4.3 row for current membership (open: B2) and a check-dist phrase for "still members" or "same four" wording.

## Non-blocking issues

**N1. Foxymorons first show (contradicted).**
- **Problem:** §4.2 chapter 3 puts "Chad and Scott" at the SXSW 2000 show. The sources say Chad drove David there, and the FM people file lists the players without Scott. Scott played live with the Foxymorons in 2000–02, but not at that show.
- **Fix:** write "Chad drove to Austin with David for the Foxymorons' first show (SXSW, March 2000)".

**N2. The schedule contradicts itself.**
- **Problem:** §9 says the dates avoid dd's launch window, and R5 says "Phases start after dd's M4". But Phase 1, which includes a review with Carly and David, runs from 2026-11-30 to 12-18, across dd M3 (12-04) and the M4 go/no-go (12-11). Phase 2 runs over the same span as dd M5. A3 in the questions file also promises "start the build after daviddewese.com launches".
- **Fix:** move Phase 1 to begin after 2026-12-11 (or hold the Phase 1 review after M4), and re-check that the 2027-03-01 target still leaves the ≥7-day Active zone and a cutover before 2027-03-19.

**N3. Half the owner questions lack "why it matters".**
- **Problem:** the brief requires each question to give why it matters and a proposed default. Only 31 of 62 have a "Why it matters" line; every Tier 3 and Tier 4 question has a default only.
- **Fix:** add one line to each.

**N4. The X1 pointer in R3.**
- **Problem:** R3 names "the *Overbored* track 7 credit" and "MusicBrainz relations on David's record" as the leak points. Anyone with Discogs can follow that pointer to the excluded person. X1 says not to mention them anywhere in project files.
- **Fix:** make R3 generic ("a withheld credit and some database relations; specifics with the team"). The questions file (B4: "except one *Overbored* track") is acceptable because it goes to Carly, but it should not name the track number either.

**N5. Design contrast gaps.**
- **Direction C, light:** the shared foundation requires a pair of at least 7:1, but C's *Believe* red on white is 6.85:1.
- **Direction C, dark** ("ink ground, white and red"): red on `#111111` is **2.76:1** and sky `#0A5A8C` on ink is 2.57:1. Both fail even the 3:1 large-text rule.
- **Direction B's dark toggle:** the powder-blue link ink `#1F4E79` on the oxblood ground is 1.37:1.

Either state the dark-mode tokens or say that the light figures are the only ones computed. Do not imply the directions pass as written.

**N6. Emmylou Harris year.**
- **Problem:** §4.3 lists the year as a contested fact, but §7.4 makes "1977" a hard CI failure, and §8.5 #7 asks daviddewese.com to change approved copy. MusicBrainz gives 1977, and the chart year and first single are 1977. Only Wikipedia's 1976-12-28 supports 1976.
- **Fix:** keep "no year" as the default, drop the CI ban on "1977" (or make it a warning), and frame the dd change as a suggestion.

**N7. `sameAs` lists accounts the plan has not confirmed.**
- **Problem:** §8.3 puts Instagram and Facebook in the launch `sameAs`, while E7 asks whether those accounts are active and who posts.
- **Fix:** gate them on E7.

**N8. Chapter titles lead with weak facts.**
- **Problem:** chapter 2 is titled "Nudie suits and Monsters of Pop". Monsters of Pop is single-source, and the Nudie suits are "David has said…" material (B8). A chapter title cannot carry the attribution the plan's own §2.2 requires.
- **Fix:** retitle the chapter, or make the title conditional on B8 and B13.

**N9. Over-broad check-dist phrases.**
- **Problem:** banning "David joined" and "former member" anywhere near a forever member's name will also fail legitimate dated quotations. For example, the 2002 journal says "former member Chad Edgington", and the Vault plans to show the 2005 talent-show quote.
- **Fix:** scope these rules to non-quoted copy, with an allow-list for `<blockquote>` and Vault transcriptions.

**N10. Membership wording in the JSON-LD.**
- **Problem:** §8.2 models Chad as a `member` with `endDate` 2001, and Scott and Larry with no end date. That is consistent with F4, but it should be stated as a deliberate reading of P8 ("forever" is a band joke, not current membership) and cross-referenced to B2, so that a later worker does not "fix" it.

**N11. Story claims to tighten before drafting.**
- "Two Texans" (chapter 1) states Chad's origin. That rests on the "Former Texans" press line and P21's "college friend", which is acceptable, but cite it.
- "about 40 logged shows" is journal rows, not verified gigs (LL01 line 341 says so). Say "about 40 shows and trips logged in the band's journal" everywhere, including §1.

**N12. Small items.**
- The README calls the plan "Draft 1, awaiting the critic". Update it after this round.
- §3 says RD1–RD15 must close before Phase 0 exits. Also say which RD items block a specific page (for example RD5 must close before anything is published from the repo).
- §11 repeats §13's question list; trim one.

## What must change for approval

Fix B1. Then N1, N2 and N3 should be done in the same pass. They are quick, and together they would put this plan at or above 8.5.
