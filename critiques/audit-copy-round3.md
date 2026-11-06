# Audit: copy and facts, round 3

Auditor: independent and harsh. Lens: every visible sentence in `site/dist`, checked against LL-1..LL-45, `data/releases.json`, `data/assets.json` and `research/*.md`. That covers body text, captions, alt text, meta and OG descriptions, FAQPage and other JSON-LD strings, and `llms.txt`. I also checked tone (plain, warm, third person), typos, whether names, dates and quotes are consistent, and privacy (LL-7, LL-19, LL-25, LL-45). Private literals are named by role only, as `critiques/README.md` requires.

Build and checks on this commit (`37d958e`):

- `npm ci && npm run build`: clean. 37 pages, 315 redirects.
- `npm test`: data, unit, dist, jsonld and repo (self-test 53/53) pass. Axe passes 370/370 page checks and 223/223 behaviour checks. I ran it four times. Two runs passed. Two failed the axe suite while other round-3 audits were running `npm ci` and `npm run build` in the same working tree:
  - one failed in 0 s with `ERR_MODULE_NOT_FOUND`, because `node_modules` was being reinstalled;
  - one failed on a single check, `/music/great-day/ @1280px no-js dark`: an empty document with no `<title>`, no `lang` and no `main`, which is the harness's fallback answer while `dist/404.html` is being rewritten.

  A run of `node tests/run.mjs axe` on its own, with nothing else running, passed 370/370 and 223/223. I count these as environment interference, not a site defect. See S9.
- `node content/check-content.mjs` and `--dist`: 0 errors.
- Every internal `href` and in-page anchor in dist resolves. The only "misses" were `/contact/?topic=…` query links, which are fine.
- The contact address appears nowhere in dist (HTML, JS, JSON-LD, `llms.txt`). The only `@` strings in dist are CSS and JSON-LD keywords.
- I grepped dist for private-life and banned terms: Gmail, spouse and family words, "lives in", "hometown", "dads", "careers", talent show, demo, download, `.mp3`, newsletter and "first band". None appear.

## Score: 8.7 / 10. Approved (no blocking issues)

The copy is accurate, plain and warm. It follows the owner decisions to the letter. Both round-2 blockers are fixed and covered by tests. Ten of the eleven round-2 should-fixes were made, and the eleventh (LL-25) is now an explicit launch gate. What remains is one gate that is not yet enforced by the build (S1), a few claims that go slightly beyond their sources (S3, S4, S5), and style consistency. None of it is a privacy leak, an owner-decision violation in visible copy, or a broken page.

## Earlier fixes confirmed

- **International Submarine Band (rounds 1–3):** confirmed. `/story/sound-as-ever/` reads: "…the last of them is called “The International Submarine Band”, the name of Parsons’s 1960s band." "First band" appears nowhere in dist. `/vault/covers/` credits "Luxury Liner" to "Gram Parsons (The International Submarine Band)", which is correct: ISB recorded it on *Safe at Home*, 1968.
- **Round-2 B1:** fixed. The `/shows/` Ohio and Michigan row now reads "The band’s first trip to Ohio and Michigan."
- **Round-2 B2:** fixed. The Vault now reads "*Live Liners* (2002): two sets at 12th & Porter, Nashville: electric on July 18 and acoustic on November 17, 2002." This matches chapter 5, `/shows/` and `releases.json`.
- **Round-2 should-fixes, done:**
  - Chapter 9 "Precious To My Heart" now adds "(listed as “Precious” on *Sound As Ever*, where it is the first of the hidden tracks)".
  - The provenance line is gone from `/shows/`.
  - The home factline no longer repeats LL-17.
  - The live-single blurb puts 1998 first and the 2001 EP second.
  - Facts › "How dates are given" is now reader-facing.
  - The "by LN" byline is gone.
  - The 2001 *Nashville Scene* profile is listed without its title (G2).
  - The 2008 row starts "Not a Luxury Liners show:".
  - The row reads "Two shows, Nashville, Tennessee".
  - New Beginning reads "Track 2 is “Great Day”, the February single." (LL-13 safe).
  - Chapter 6 uses the track casing "Waiting For The Sun" outside the quotation.
  - EPK quotes are dated, and the EPK has a single contact link.
  - Chapter 2 is dated 1997–1998.
- **Round-2 S2 (LL-25):** moved to launch gate G1 in `QUESTIONS-FOR-CARLY.md`. It is still open; see S1.

## Confirmed correct (no action)

- **LL-6:** the one-liner is verbatim, straight quotes included, on Home, Facts (visible and JSON-LD), all four EPK bios, `llms.txt` and every default meta and OG description.
- **LL-17:** the exact two sentences appear on Home, the Story index, chapter 9, Facts, the EPK (medium bio, long bio and fact sheet) and `llms.txt`. "Dads with careers" appears nowhere.
- **LL-4 and LL-5:** the site has spring break 1997, the move in May 1997, "founded in Texas" (EPK and `llms.txt`) and "Nashville is the band’s home town". It names no town and no house. "College friend" names no college.
- **LL-7 and LL-19:** "spread across Tennessee, Michigan and Texas" never maps a member to a state. Chad, Scott and Larry appear only with names, roles, years and band-era photos. No quotes from them are used.
- **LL-9, 10, 14, 15, 16, 18, 20, 21, 22, 23, 24, 37, 38:** all match.
  - Writers match `releases.json` on every release page, and LL-14 holds in visible copy.
  - Cover-art credits match LL-23, with Jim Horan as restorer only.
  - The LL-24 names, roles and years are exact on People and Facts.
  - The 2008 caption is left to right per LL-38.
  - The live single reads "recorded live in Waco, Texas, in autumn 1998" everywhere.
  - SXSW is "the SESAC Showcase at SXSW 2001".
  - *Billboard* is "featured in *Billboard* in 1998", with no invented title.
- **LL-13:** there is no talent show anywhere. Nothing ties "Great Day" to 2008 or to a demo. "Breakaway" is listed bare on `/vault/mp3s/`.
- **LL-27 and LL-29:** there are no audio files or download links. The old MP3s and the covers are listed by title, with original artists.
- **LL-36, LL-39, LL-40, LL-31:**
  - Instagram, Facebook and David's Bandcamp are linked, and there is no SoundCloud.
  - The colophon reads "The band’s logos date from 1999–2002." and credits no designer.
  - There is no newsletter.
  - The contact form prints no address.
- **LL-45:** "Photo: Amy Wilstermann" appears on exactly the two 2003 shoot photos, and People › Photographers lists "Amy Wilstermann (2003)". No relationship to anyone is stated or implied. Kyle Edgington is likewise given a role only.
- **Numbers:**
  - Album totals match the track sums: 52:14, 8:55, 36:23 and 44:35.
  - Every UPC and catalogue number matches `releases.json`.
  - Release dates and labels agree across Music, Listen, Facts, EPK, chapter cards and `llms.txt`.
- **Press quotes:** all seven match `research/01` and `research/04` word for word, including "tongue-in cheek" and the Metroland ellipses. The mixed reviews (Splendid, Lost At Sea) are listed but never quoted.
- **Captions vs. `assets.json`:** these all agree: Hard Rock 1998, "Chad’s last show, March 2001", Dancin' in the District 2001 and 2002 (Mark Montgomery), the Detroit radio green room (October 2003), and the white-studio set (Mark Montgomery, about 2000).
- **Smaller facts:**
  - "Emmylou Harris in the audience" is supported by David's 2001 quote ("They all came to see us play").
  - The Believe EP was an enhanced CD with the "It's You" video (Discogs).
  - *Trunk Box* came from E-Cleff Studios, Waco, autumn 1998.
  - The one-sheet line about "the 5 from San Diego to L.A." is verbatim.
  - The Den is in Ferndale, CA, as the Discogs credit gives it.
- **Tone:** the band is in the third person throughout. "We" appears only on Privacy, Accessibility and Contact. There are no doubled words and no stray spaces before punctuation in any page.

## Blocking

None.

## Should fix

1. **LL-25 is a launch gate on paper only, and the gate is narrower than the material.**
   - **Pages:** `/shows/` (2001–04 rows and the meta description "SXSW, Las Vegas, Atlanta with Blues Traveler"), `/story/journal-years/`, the `/story/` index summary ("About 40 shows and trips, logged by the band itself"), the `llms.txt` chapter list, and the EPK long bio ("Their journal logged about 40 shows and trips, from the House of Blues in Las Vegas to opening for Blues Traveler in Atlanta and a gig in Canada.").
   - **Problem:** `QUESTIONS-FOR-CARLY.md` G1 names only the Shows rows and chapter 5, and nothing in the build stops a release while G1 is open. `RELEASE=1 check-dist` is expected to fail only on the Turnstile and analytics keys.
   - **Fix:**
     - Widen G1 to name the EPK long-bio sentence, the `/shows/` meta description and the Story-index and `llms.txt` summaries.
     - Add a release check, for example a `journalDerivedApproved` flag in `content/shows.json` or `site/src/lib/site.ts`, that makes `RELEASE=1 node scripts/check-dist.mjs` fail until the flag is set from David's answer.
     - If David says no, cut the EPK sentence to "The trio kept touring from Nashville." and use a non-journal Shows meta description.
2. **Master data contradicts LL-14 (not visible on this site).**
   - **File:** `data/releases.json`, `luxury-liners-2026-sound-as-ever-lp`, track A6 "The Duke Of Gloucester".
   - **Problem:** `writers` is `["Chad Edgington", "David Dewese"]`. The CD record already says `["David Dewese"]`, and LL-14 says David. LL-3 makes this file the master that daviddewese.com copies.
   - **Fix:** set A6 `writers` to `["David Dewese"]`. Add a `validate-data` rule that LP tracks inherit writers from the parent CD's `cd_track`. Once the data is right, drop the now-redundant override in `site/src/lib/releases.ts` line 40.
3. **"A different live recording" is stated more firmly than the evidence.**
   - **Page:** `/music/appearances/`, the *25 Years… Texas Music Cafe* entry.
   - **Problem:** the only basis in `releases.json` is a different ISRC (US2762202822 vs US2762100919) and a 2-second length difference. A new ISRC can be a remaster or re-edit of the same take.
   - **Fix:** "A live “Shake It Up”, released as a separate track from the 2021 single." Alternatively, ask David whether it is the same night and say so.
4. **"A run of top-of-the-year lists" overstates two blog lists.**
   - **Pages:** `/story/nonetheless/` (dek and meta description), the `/story/` index and `llms.txt`.
   - **Problem:** the chapter body names exactly two: Absolute Power Pop #100 and Carligula #3.
   - **Fix:** "A third album, two year-end lists, and the band still playing." Change it in `content/story/07-nonetheless.md` front matter, which feeds all three places.
5. **"Still In Love" names a song that appears on no record.**
   - **Page:** `/shows/`, early October 2003 row ("The first performances of “Circles” and “Still In Love”.").
   - **Problem:** *Nonetheless* has "So In Love", and "Still In Love" is on nothing the site lists. Readers will take it for a typo. The source is the journal, which is not yet approved (S1).
   - **Fix:** ask David whether this is "So In Love". Until then, use "The first performance of “Circles”." (`content/shows.json`, line 445).
6. **The date format is inconsistent.**
   - **Page:** `/accessibility/` reads "last reviewed on 6 November 2026". Every other date on the site is US style ("February 13, 2026").
   - **Fix:** "November 6, 2026" in `site/src/pages/accessibility.astro`.
   - **Same family:** `/press/` says "shop catalogue listing" while release pages say "Catalog number". Pick "catalog" in `content/press.json` (Kool Kat entry).
7. **The Photos page range does not match its own sections.**
   - **Page:** `/photos/`. The kicker and meta description say "1998–2008", but the first section is headed "1997–2000", and `llms.txt` and People treat the band as 1997 on.
   - **Fix:** either rename the section "1998–2000", since every photo in it is dated 1998 or later, or keep the heading and leave the range as is. The first option is the honest one.
8. **A slang slug is public.**
   - **Page:** `/photos/#brosephs` (the figure `id`) and the image files `/img/photos/brosephs-*.jpg|webp` and `/img/cards/brosephs.jpg`.
   - **Problem:** the photo is captioned "White shirts and red neckerchiefs, about 1998–99". The slug is an internal nickname that shows up in shared links and image search.
   - **Fix:** rename the id in `site/data/photos.json` (and `site/data/image-sizes.json`) to `white-shirts-1998`, and add a redirect from the old image paths if any were ever published.
9. **Test reliability (process, not copy).**
   - **Problem:** two of my four `npm test` runs failed the axe suite while parallel audits were rebuilding `site/dist` and reinstalling `site/node_modules` in the same checkout (see the top of this report). In `tests/lib/harness.mjs`, `serve()` reads files from the live `dist/` on every request, so a concurrent build can turn any page into the "dist/404.html is missing" fallback text and fail an unrelated check. A suite that fails without a code change will eventually be "fixed" by skipping it.
   - **Fix:** in `tests/run.mjs`, copy `dist/` to a temporary directory (or build into `--outDir` under `os.tmpdir()`) once per run, and point `serve()` at that snapshot. Take a simple lock file in `site/` around `npm run build` and the test run, and print a clear "another build is running" message instead of a false failure. Before the axe suite starts, check that `playwright-core` and `@axe-core/playwright` resolve, and print the name of any missing module. The suite must stay mandatory.

## Polish (optional)

- On Home, the 2002 photo's figcaption runs into the note (`…in 2002.<span class="col-note">Chad had left…`). It looks right because the span is `display: block`, but copied text and some screen readers read "2002.Chad". Add a space before the `col-note` span in `site/src/components/Photo.astro`, line 16.
- `/shows/` has "Le Jive Coffee House, Michigan". Every other row gives a city, so give one, or write "Michigan (city not recorded)".
- `/shows/` 2006 row: the "Where" column holds an event ("The *Nonetheless* CD release show"). Use "Nashville area, Tennessee" if known, or "Place not recorded" as the March 2001 row does, and move the event into Notes.
- `/vault/covers/` says "Songs by other people…", while the Vault index says "Songs by other writers…". Use one phrase in both places.

## Verdict

- **Approved:** yes.
- **Score:** 8.7 / 10.
- **Blocking:** none.
- **Before launch:** S1 (the LL-25 gate is enforced and covers every page) is the one item that must be settled before go-live. It is an owner question, not a copy defect. S2–S5 are one-line data or copy fixes.
