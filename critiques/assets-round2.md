# Critique: track "assets", round 2

Reviewer: harsh critic (gauntlet). Date: 2026-10-07.
Deliverables reviewed: `research/05-assets-and-photos.md` (785 lines, incl. the round-2 revision log), `data/assets.json` (310 asset records, 8 logo records, 209 Wayback leads, 1 `do_not_use_ids` entry), `assets/source/covers/`, `assets/source/photos/` (incl. `flickr/` 98 files, `flickr-web/` 150 files, `solo-archive/`), `assets/reference/`, `assets/derived/daviddewese-portraits/`.
Checked against: `/home/user/daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md` (authoritative), daviddewese.com `data/photos.json`, `data/releases.json`, `site/src/assets/portraits/`, live Flickr photo pages (curl), the live iTunes lookup API, and the image files themselves (viewed).

## Score: 8.5 / 10

## Verdict: APPROVED

The round-1 blocker (X1) is fixed: the flagged frame's title, link, caption rule and wish-list question are gone from the md, its json record is dropped, and no file for it is on disk. Of the 11 non-blocking issues from round 1, all 11 have been addressed, and my spot checks confirm the fixes. Generating §4.3 from the json has removed the internal size and tier drift. The remaining issues are small wording and metadata slips. None of them breaks an owner decision or a privacy rule, so none of them blocks.

## Checks (re-verified by the critic in round 2)

| # | Claim | Checked against | Result |
|---|---|---|---|
| 1 | 6 cover masters copied byte-identical, filenames kept | `cmp` against daviddewese.com `assets/source/covers/` | PASS (all 6 SAME) |
| 2 | `luxury-liners-2002.jpg` copied unmodified, 1096x848 | `cmp`, PIL, DECISIONS P22 | PASS |
| 3 | 6 engraved LL portraits copied unmodified | `cmp` against `site/src/assets/portraits/luxury-liners-*` | PASS (6/6) |
| 4 | Every json width matches the file on disk | PIL over the 134 records that have a local `file` | PASS (0 mismatches) |
| 5 | `credit_status` counts: 21 confirmed / 37 awaiting / 193 no-credit (P17) | Counter over `assets.json` | PASS (plus 27 cover, 26 excluded, 6 derived = 310) |
| 6 | Release dates on cover records match `releases.json` (Believe 2001-03-01, Great Day 2026-02-13, New Beginning 2026-04-17, Shake It Up 2021-08-27) | daviddewese.com `data/releases.json`; DECISIONS F6 | PASS |
| 7 | *Shake It Up (Live)* single released 2021-08-27, album id 1581823464; Apple spells it "Cafe" | Live iTunes lookup: "Shake It Up (Live at the Texas Music Cafe) - Single", 2021-08-27 | PASS (the "Café"/"Cafe" note is accurate) |
| 8 | Shake It Up alt: three members in embroidered Western suits leap against white, band name with a red X | Viewed the 3000px cover | PASS |
| 9 | 2002 photo caption exactly per P23; never "the 2002 line-up"; AI note kept in metadata only (P22) | DECISIONS P22/P23; md §4.1 and §10.1; json caption_rules | PASS |
| 10 | `2086444773` is "Scott, Chad, and Me. August 2000", Los Angeles; the "Chicago" alt is gone | Live Flickr page: title "Los Angeles, CA", description "Scott, Chad, and Me. August 2000." | PASS |
| 11 | `3978343931`: David in the '97 suit with Scott; "former" removed | Live Flickr: "Scott & I post gig. Played all old-school Luxury Liners so[ngs]" / "Rocking the '97 suit."; image viewed (pale blue suit, thin black tie; man in cap) | PASS |
| 12 | `2073240141` titled "Chad Edgington", 1100x1635 original, 1076x1599 web copy | Live Flickr title; PIL on the web copy | PASS |
| 13 | `2073240141` alt: "plays a red bass" | Viewed the image: a **black** P-bass with a red tortoiseshell pickguard | CONTRADICTED (minor alt error; see N2) |
| 14 | X1: the flagged item is gone from md, wish-list and json records; no file on disk | grep and `find` across the repo | PASS (only a bare id remains; see N4) |
| 15 | `2068108482` credit "Photo: Trey Mitchell", owner-confirmed (P17) | daviddewese.com `photos.json`: `photographer_credit: Trey Mitchell` | PASS for the credit, but the record also says "Photographer unknown (possibly Trey Mitchell)" (see N1) |
| 16 | *Sound As Ever* design credit re-cited to research 01 (single-source); Discogs lists Montgomery only as Producer | md line 72, A16 | PASS |
| 17 | `530769478` date conflict (title March 2001 vs date_taken 2001-04-21) recorded | json flags, md A15 | PASS |
| 18 | P5: isawtheocean.com never linked | grep md and json | PASS (0 hits) |
| 19 | F4 caption rule: post-2001 Chad only as forever member or guest | md §10.2; DECISIONS F4/P8/P23 | PASS |
| 20 | Privacy: no residences or private contact details | grep for residence and contact terms; audience and party frames are archive-only or excluded | PASS |

## Blocking issues

None.

## Non-blocking issues (fix during the build; no round 3 needed)

- **N1. `flickr-2068108482` flags contradict each other.** `credit_line` is "Photo: Trey Mitchell" with `credit_status: named-credit-confirmed` (P17), yet a flag still says "Photographer unknown (possibly Trey Mitchell); Billboard may hold rights." P17 settled the credit, so drop the stale flag. Keep the sibling-frame provenance only in discrepancy A2.
- **N2. `2073240141` alt text.** The bass is black with a red tortoiseshell pickguard, not "a red bass". The person is also identified by the Flickr title, so under P14 the alt can name him: "Chad Edgington in a black turtleneck holds a black bass with a red pickguard in a white studio." Check the other "red bass" alts (`2084463832`, `2084467138`) against the frames as well.
- **N3. "2009 reunion gig".** `3978343931` `recommended_use` (json line ~9787 and md §4.3) says "band page: 2009 reunion gig". That breaks the doc's own caption rule (json caption_rules: "The Luxury Liners never broke up"). Use "2009 gig of old-school Luxury Liners songs" instead. The Flickr album title "Liners Reunion" (`529049233`) can stay as a quoted title, but a caption must not echo it as a band reunion.
- **N4. X1 residue.** The json `revision` string reads "X1 record removed (bare id kept in do_not_use_ids)", and the md revision log ties "the frame the critic flagged" to X1. Together these link the bare id to the exclusion, which is the reason text round 1 asked to drop. Reword both to "one record removed at owner request". `critiques/assets-round1.md` still names the item; since critiques are internal, consider redacting the title there too.
- **N5. Typo.** In §4.3, the `3978343931` row ends "single-source; confirm.." (double full stop). This comes from the json `people` field ending in a full stop before the generator adds one.
- **N6. Shake It Up wordmark description.** The json note calls the cover lettering "condensed black capitals". On the 3000px cover it is a hand-drawn brush/marker style with a red X. Make sure the §6 logo notes do not merge two different wordmarks.

## What is good (keep)

- The X1 fix was done properly: no title, no link, no question to Carly, no file left on disk.
- Generating §4.3 from `assets.json` closes the whole class of size and tier inconsistencies. A PIL re-check of 134 local files found no mismatches.
- `credit_status` cleanly separates "no credit, publishable (P17)" from "named, awaiting confirmation", which matches R1/P17 exactly.
- Honest discrepancies (A15 to A18), the "Café"/"Cafe" note backed by the live Apple data, and the MTSU poster lead added to "needs a browser".
- The wish-list is ranked and specific (old-site filenames for the Chad-era photos, logo vectors, a non-AI scan of the 2002 photo), and it asks Carly nothing that X1 forbids.
