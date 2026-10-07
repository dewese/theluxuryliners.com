# Critique: track "assets", round 1

Reviewer: harsh critic (gauntlet). Date: 2026-10-07.
Deliverables reviewed: `research/05-assets-and-photos.md`, `data/assets.json` (311 records), `assets/source/covers/`, `assets/source/photos/` (incl. `flickr/`, `flickr-web/`, `solo-archive/`), `assets/reference/`, `assets/derived/daviddewese-portraits/`.
Checked against: `/home/user/daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md` (authoritative), daviddewese.com `data/photos.json`, `data/releases.json`, `research/01`, `02`, `04`, `06`, live Flickr pages, Discogs API, iTunes lookup API (via curl; WebFetch is egress-blocked for those hosts).

## Score: 7.5 / 10

## Verdict: NOT APPROVED (one blocking issue)

This is a strong, thorough deliverable. The cover copies, dimensions, alpha check, P22/P23 caption rule, P27 wording and the Shake It Up cover sourcing all check out. The Flickr inventory goes well beyond the daviddewese.com work (Chad-era sessions, flyers, the 2000 site credit), and the wish-list is useful and ranked. It fails only because of one owner-decision risk (X1), plus a group of internal inconsistencies that a build team would trip over. Fix those and it should pass round 2.

## Checks (re-verified by the critic)

| # | Claim | Checked against | Result |
|---|---|---|---|
| 1 | 6 cover masters copied byte-identical, filenames kept | `sha256sum` vs daviddewese.com `assets/source/covers/` | PASS (all 6 SAME) |
| 2 | Covers 1400x1400 RGB 300 dpi (SAE, Believe, Overbored, Nonetheless); Great Day 3000 PNG RGBA 72; New Beginning 3000 RGB 72 | PIL on the copies | PASS |
| 3 | Great Day PNG alpha is not fully opaque (219-255) | PIL `getchannel('A').getextrema()` = (219, 255) | PASS |
| 4 | Great Day PNG vs Apple 3000px JPEG "difference 0.5/255" | mean abs RGB difference measured 0.72/255 | PASS in substance (visually identical); the number is a little off |
| 5 | Sound As Ever Bandcamp copy identical (pixel difference 0) | `ImageChops.difference().getbbox()` = None | PASS |
| 6 | Bandcamp 1600px copies of Believe, Overbored, Nonetheless | PIL: 1600x1600 each | PASS |
| 7 | Shake It Up (Live) 3000px Apple copy, album 1581823464, 2021-08-27 | iTunes lookup API for artist 47333263 (curl) + PIL | PASS |
| 8 | Shake It Up cover photo is from the c. 2000 Mark Montgomery session (same shirts as `2074032162`) | Viewed both images: same three embroidered Western shirts (black with red embroidery and wagon wheel; blue with white; black with white arrow piping) | PASS (strong visual match; correctly marked as inference) |
| 9 | 2002 four-piece photo: 1096x848, byte-identical, caption per P23, no credit (P22) | `cmp`, PIL, DECISIONS P22/P23 | PASS |
| 10 | 2002 photo alt: "matching green T-shirts against a concrete wall" | Viewed the file | PASS |
| 11 | 6 engraved portraits copied unmodified; sizes 1400x816, 1400x545, 700x408, 700x273 | `cmp` vs `site/src/assets/portraits/`, PIL | PASS |
| 12 | Flickr `530769478` title "Chad's Last Show - March 2001", 2160x1440, four people | Live Flickr page (curl), file on disk viewed | PASS (but Flickr date_taken is 2001-04-21, not flagged; see N7) |
| 13 | Flickr `2073240141` is titled "Chad Edgington" | Live Flickr page | PASS |
| 14 | Flickr `18289095` titled "gary ishee" | Live Flickr page | PASS |
| 15 | Trey Mitchell credit on `2068108482` is owner-confirmed (P17) but sibling-frame based | daviddewese.com `photos.json` (`photographer_credit_note`) | PASS (discrepancy A2 is honest) |
| 16 | Sound As Ever design credit "Mark Montgomery (Discogs 6768612)" | Discogs API release 6768612: extraartists list Mark Montgomery only as Producer; no design credit, no notes | CONTRADICTED as sourced (the design credit comes from daviddewese.com research 01 line 328, not from Discogs) |
| 17 | LP reissue 2026, Sound Asleep Records, Sweden, ZZZ056 | Discogs API 37658859 | PASS |
| 18 | Kyle Edgington drums May-Aug 1998; Scott Carpenter from Aug 1998; Wilstermann from Dec 2000 | research 02 line 57/59, research 04 roster lines 336-340 | PASS |
| 19 | Flyer weekdays: 15 Sep 1999 Wed; 14 Nov 2003 Fri; 9 Dec 2003 Tue; 20 Jan 2004 Tue | Calendar | PASS |
| 20 | 98 originals + 150 web copies on disk; 248 usable + 27 excluded = 275 Flickr records | `ls | wc -l`; sum of per-album "usable" counts = 248 | PASS |
| 21 | "From 15 albums" | Section 4.3 has 18 album headings | CONTRADICTED (count is wrong) |
| 22 | Kristin Barlowe solo-archive masters tier "archive-thumbnail" (§4.1) | Doc's own tier rule (600-999 = web-small); `assets.json` says web-small | CONTRADICTED (md disagrees with json and with its own rule) |
| 23 | `2073240141` web copy "web 1024" (§4.2) / "web 1599px" (§4.3) | `assets.json` web_copy.width = 1076 | CONTRADICTED (two different wrong numbers) |
| 24 | §4.2 member portraits all "800x1200" | `2076666953` is 800x533, `2077455616` is 400x600 | CONTRADICTED |
| 25 | `2086444773` alt: "pose on a city sidewalk under a 'Chicago' sign" | Viewed the image: the lit sign reads "The Gig" (LA club); a smaller sign behind is partly "Chicago..."; Flickr title "Los Angeles, CA" | CONTRADICTED (misleading alt; implies Chicago) |
| 26 | P5: isawtheocean.com never linked | grep md + json | PASS |
| 27 | F4 co-founder wording; P27 "Shake It Up" original; P40 rights line; P32 covers in full colour | md §3, §10 | PASS |
| 28 | LL records in daviddewese.com `photos.json` all carried over | Script diff: only 5 not present, all solo/Chad-solo or the same Barlowe photo as the masters | PASS |

## Blocking issues

**B1. X1 risk: the "Glorious Thunder" record and question.** The doc lists Flickr `2084464138` by its title, calls it an "unidentified pre-band group photo" under the **X1** caption rule (§10.10), and puts "Identify `2084464138` ('Glorious Thunder') ... X1 safety" on Carly's wish-list (§11 #15). `assets.json` keeps a full record (`kind: unidentified`, title). X1 says the excluded 1990s side project and its person must not be researched, listed, linked or mentioned anywhere, *including open questions*. The worker has linked this item to X1, so naming it, linking it and asking the owner about it is exactly what X1 forbids. Fix: remove the title and the link from the md, the wish-list and the X1 rule. Drop the record from `assets.json`, or keep only a bare id in a `do_not_use` list with no title and no reason text. Do not ask Carly about it. (The daviddewese.com project never mentions this title, which supports the decision to leave it out.)

## Non-blocking issues (fix in round 2)

- **N1. Mis-sourced cover credit.** *Sound As Ever* "Design: Mark Montgomery" is cited to Discogs 6768612. The Discogs API shows him only as Producer. Re-cite it to daviddewese.com `research/01-discography.md` (line 328) and keep it single-source. The `credit_note` on the *Believe* record leans on the same claim.
- **N2. Internal size and tier inconsistencies.** These are checks 21-24: 15 vs 18 albums; the solo-archive tier (md "archive-thumbnail", json "web-small"); the `2073240141` web copy (1024 / 1599 / actual 1076); the member-portrait row saying "800x1200" for mixed sizes. The build team will read the md, so make it agree with `assets.json`. Ideally, generate the md tables from the json.
- **N3. "Two former Luxury Liners" (`3978343931`, 2009).** The band is active (2026 singles, F6) and the story is that it "never broke up". David is not a former member. Reword it, e.g. "David Dewese and Scott Carpenter of The Luxury Liners on a red sofa after a 2009 gig".
- **N4. `2086444773` alt text.** Remove "under a 'Chicago' sign". The photo is at The Gig in Los Angeles (Flickr title "Los Angeles, CA"). The md era column already says Los Angeles, so the alt contradicts the row it sits in.
- **N5. Caption rule F4 (§10.2) is overbroad.** "A later photo ... must not suggest Chad was in it" conflicts with the doc's own later Chad photos: the 2002 four-piece (P23) and the Royse City duo `4470275899`. Rephrase it: post-2001 photos may show Chad only as a forever member or guest, never as a current line-up member.
- **N6. "(confirm)" on credit "none".** R1 makes credits a "credit required → publish" gate, and P17 says uncredited band, family and self-timer photos publish with no credit line. Keep "confirm" only where a photographer is *named* but not yet owner-confirmed. A blanket "none (confirm)" on about 200 rows suggests a publish gate the owner has closed. Split `credit_confidence` so the build can tell "no credit, publishable" apart from "named credit awaiting confirmation".
- **N7. `530769478` date.** Its Flickr title says March 2001, but Flickr date_taken is 2001-04-21. Add this to §12 (the camera date may be wrong; the title is the stronger source, but it is contested).
- **N8. Great Day difference figure.** 0.5/255 is stated; 0.72/255 was measured. Say "visually identical (mean difference under 1/255)".
- **N9. Shake It Up title spelling.** The release id and title use "Café" in daviddewese.com `releases.json`; the md uses "Cafe" (as Apple does). Pick one and note the other.
- **N10. WebSearch effort.** Only 2 searches were run for new LL images (A14). A few more targeted queries are cheap and might find press photos or gig posters: Nashville Scene photo archive, Tennessean, Texas Music Cafe / Texas Music Café TV episode stills, Kool Kat Musik and Sound Asleep product images, Last.fm artist images. Record the results, even if empty.
- **N11. Third-party credits on the 2007 coffee-shop set.** The "& Jeff Grant" album is a shared bill. Mark which frames show other acts (fiddle and keyboard frames) so they are not captioned as The Luxury Liners.

## What is good (keep)

- Byte-identical copying, SHA-256 in the json, and nothing modified.
- P22/P23 caption reproduced exactly, with the AI-enhancement note kept in metadata, not in public copy.
- The Shake It Up cover traced to the c. 2000 Chad-era session, correctly marked as an inference and with a caption warning.
- Bandcamp 1600px originals found, plus the RGBA flattening note for Great Day.
- Honest discrepancy table (A1-A14), with day-of-week reasoning for the flyer dates.
- Privacy handling: audience, friends and family frames excluded; former members kept to band roles behind the consent question.
- The Wayback "needs a browser" list is prioritised and has direct `im_` links.
