# Critique: archaeology track, round 1

Deliverables reviewed: `research/03-web-archaeology.md` (698 lines), `data/legacy-urls.json` (675 rows), `research/tools/gen_legacy_urls.py`, `research/legacy/live-status-2026-10-07.tsv`.
Critic: harsh critic, 2026-10-07.

## Score: 7.5 / 10. Verdict: NOT APPROVED (2 blocking issues)

This is careful, unusually well-sourced work. Every Wayback timestamp in the file (99 distinct) traces to the CDX index or to the daviddewese.com research (R04/SI). The only exception is one deliberate wildcard search URL. Every live claim I re-fetched matched: the IA collection, MusicBrainz, Discogs, iTunes, YouTube, Flickr, MySpace and the live Carrd site. Owner decisions F4, P5, P8, P23, P27, L1 and X1 are handled correctly. Contested origin texts are clearly labelled as contested. The Internet Archive Live Music Archive find (David's 2003 opt-in and the 2003-06-19 French Quarter Cafe show) is a real, verified new source. The needs-a-browser list is ranked, exact and useful.

It fails on the data file. The redirect deliverable silently drops one of the highest-value pages on the domain, and it does not carry the prose's own sensitivity flag onto the rows that drive the build. Both are quick fixes.

## Checks performed

| # | Claim | Source checked | Result |
|---|---|---|---|
| 1 | CDX has 675 rows; first capture 2000-04-07; per-year counts (2000 29 … 2026 4); status split 534/137/2/2; 311 status-200 HTML/audio/PDF | Recomputed from `cdx-theluxuryliners.com.json` | PASS |
| 2 | sxsw thumbnail 2001-06-24; capitol thumbnail 2001-08-25, so "capitol" predates the July 2002 DC trip (contradicts R04) | CDX rows `thumbSXSW.jpg` 20010624085229, `capitol/thumbnail.jpg` 20010825170055 | PASS (a good catch) |
| 3 | 13 newsletter mailings dated from `/email/` file names, crawled in 2021, all 404/revisit | CDX `/email/*` rows (2021-02-14) | PASS |
| 4 | Domain registered 1998-03-20 at GoDaddy, expires 2027-03-19 | `architecture/ARCHITECTURE.md` l.794 | PASS |
| 5 | 2005 roster (LaFrate, Winchester, Kyle Edgington, Jeffries "Tamborine [sic]"), the talent-show intro and the "lunch box" bio, quoted verbatim | R04 l.321–341 | PASS (verbatim); shown as contested against F4 |
| 6 | Press quotes (Performing Songwriter 7-04, Metroland 6-03) | R04 l.359–360 | PASS |
| 7 | "Great Day" / "New Beginning" demos on the band site by March 2005 | `site-inventory.json` l.439 (red splash era, snapshot 20050305090711) | PASS; correctly marked single-source |
| 8 | IA collection: David's 2003-06-23 message, public 2003-06-24, homepage field, "Allows audience audio recording" | `archive.org/metadata/TheLuxuryLiners` (live) | PASS, verbatim |
| 9 | IA show: French Quarter Cafe, Nashville, 2003-06-19, taper Mike Zodun, AT853, 7-song setlist, MP3s present | `archive.org/metadata/lliners2003-06-19.at853.shnf` (live) | PASS |
| 10 | MusicBrainz: 3 members (no Chad), url-rels to MySpace, homepage, iTunes, Facebook and the Flickr collection, no begin date | MB API (live) | PASS |
| 11 | Discogs profile "Originally formed in 1997 in Texas", 5 members incl. "Jeff Lafrate" | Discogs API 4298743 (live) | PASS |
| 12 | Apple: 7 releases with dates (incl. Great Day 2026-02-13, New Beginning 2026-04-17, F6) | iTunes lookup API (live) | PASS |
| 13 | YouTube `V6h-vFJfRjI` = "Live at The Basement, Nashville, TN 2001 - 3 of 3", uploaded by David Dewese | oEmbed (live) | PASS |
| 14 | Flickr collection has 13 sets with the titles listed | flickr.com collection page (live) | PASS |
| 15 | MySpace: Nashville, TN; 2,279 connections; 1.6K | myspace.com/theluxuryliners (live) | PASS |
| 16 | Live Carrd: Last-Modified 15 Oct 2024; "Forever brosephs…" body copy; "…scattered across the country." meta; live status 630×404 / 6×403 / 39×200 | curl (live) + data file counts | PASS |
| 17 | `legacy-urls.json`: 675 rows; action counts 299/32/17/79/2/3/243 | Recomputed | PASS arithmetically, but see B1 |
| 18 | §10.2: `/history/music.html` → `/music/` | `legacy-urls.json` row | **CONTRADICTED**: the row says category `asset`, action `none`, target `null` |
| 19 | All 276 handover (`HO`) paths are covered | Cross-check against `ll-legacy-urls.json` | **CONTRADICTED** for `/history/music.html` (HO redirects it; the new file drops it). `/go/` and `/index.php` are present as query variants, so those are PASS |
| 20 | §11 #2: July 2001 is "the month after Chad left" | 2005 roster in the same file: Chad's tenure ends Apr 2001 | **CONTRADICTED** (minor) |
| 21 | Owner decisions F4, P5, P8, P23, P27, X1 | Whole file, grep | PASS: isawtheocean.com is never hyperlinked; no "2002 line-up"; no X1 material (0 hits for spouse/marriage terms) |
| 22 | Name collisions (Emmylou, Gram Parsons, Carter Tanton, Paste) | WebSearch, 2 queries; Paste `/artist/luxury-liners` (live) | PASS. Paste's page is a Daytrotter session by Carter Tanton's act, and the file and LL02 treat it as a collision |

## Blocking issues

**B1. `/history/music.html` has no redirect in the data file.** In `gen_legacy_urls.py`, the catch-all `if base.startswith('/history/')` rule (line ~130) runs before the music rule (line ~134), which explicitly lists `/history/music.html`. That page is the 2004–05 album-notes page (the *Trunk Box* tracklist, *Live Liners*, *From The Vaults*). It is one of the most valuable pages on the domain, it was in the daviddewese.com handover (`ll-legacy-urls.json`), and §10.2 and §11 #5 both rely on it. As shipped, the data file would leave it 404. This is a regression against the handover and a contradiction between the prose and the data. Fix: move the music rule above the `/history/` catch-all. Regenerate, then re-check that no other status-200 HTML page lands on `none` (it is the only one today). Update the counts in §1 and §10.1 (the 301 count becomes 300) and the "6 rows" in the §10.2 music row.

**B2. The sensitive history photo carries no flag in the data file.** The prose (§3.1, §12) rightly says one 2000 history-photo file name "needs a look before any reuse". In `legacy-urls.json`, that row (`/history/photos/00_blackfaces.jpg`) has the same generic note as the other 15 ("Ask David for the original; re-host only if it is used") and the action `rehost-or-none`. The data file is what a builder or a later agent will act on, so the warning must live there too. Fix: give that row a distinct category (e.g. `sensitive-image`), the action `none`, and a note saying "do not re-host or reuse without owner review". Keep the prose discreet, as it is now.

## Non-blocking issues

1. **Privacy consistency (IA image credit).** §5.3 prints the IA collection image credit with a full name. The file's own rule (§4.6, §12) is not to repeat band members' family members' names, and the shared surname suggests this is one. §12 already describes the credit generically ("credited to a named person"). Do the same in §5.3.
2. **Private-family rows in the data file.** The `/ethan.html` row and the three family-image rows give one-click `wayback_url` links to a child's photos, and the prose says "the image names suggest a band member's young child". The paths must stay in the redirect inventory, but set `wayback_url` to null for `private-*` rows. Also cut the "young child" description: "never describe" should apply to this file too.
3. **`content_period` is wrong in places.** All sxsw and capitol gallery pages are labelled "2002-05 khaki", although §3.8 shows the photos date from 2001. `/history/concerts.html` is labelled "2000-05", although the file guesses 1997–2003. Either derive the period from the gallery evidence or call the field the "first-capture era" only.
4. **§11 #2 wording.** "The month after Chad left" contradicts the roster (Apr 2001). Say "the first months after Chad left (Apr 2001)".
5. **Missing web presences** that exist in the sister files or the daviddewese.com data: the Shazam artist page (cited in LL02), David's Big Cartel shop (`daviddewese.bigcartel.com/product/sound-as-ever` is cited in LL02 and returns 404 today, so list it as dead), and the NoiseTrade sampler (in `vault.json`). Add them to §9 with their status.
6. **R04 §7 reusable assets not carried over.** R04 lists LL images to request in original resolution: `images/believe_cover.jpg`, `images/music_*_75.jpg` cover thumbnails, `/images/jumping.jpg`, and the white-seamless "cartwheel" shot. §3.8 mentions the shoot, but there is no "images to request from David" list. Add a short subsection.
7. **`last_known_capture` is null in 666 of 675 rows.** This is honestly disclosed and a CDX query to fix it is in §11 #24, so there is no penalty beyond noting it. Make sure the regeneration step fills it once a human runs that query.
8. **§1 summary length.** The summary is long (seven "new this pass" bullets). It reads fine but could be tighter; this is not padding.

## What is good (keep it)

- The re-check of every one of the 675 paths against the live site, and the clear "301-if-query-capable" class for Carrd's query-string limits.
- Contested facts (the talent-show origin, AllMusic's "outlet for David", the David-from-May-1997 roster) are always shown as contested against F4.
- The new IA find and David's verbatim 2003 opt-in letter.
- The "capitol" and SXSW re-dating, from evidence.
- The needs-a-browser list: exact URLs with timestamps, ranked, all traceable.

Round 2 bar: fix B1 and B2, and address non-blocking items 1–3. On that basis the track should pass.
