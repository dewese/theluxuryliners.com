# Audit: copy and facts, round 2

Auditor: independent, harsh. Lens: every visible sentence in `site/dist` (body text, captions, alt text, meta and OG descriptions, FAQPage JSON-LD and `llms.txt`), checked against LL-1..LL-45, `data/releases.json`, `data/assets.json`, the daviddewese.com decisions (F4, P17, P21, P22, P23, P27) and `research/*.md`. Also checked: tone, typos, consistency of names, dates and quotes, privacy (LL-7, LL-19, LL-25, LL-45), and whether the round-1 fixes held.

Build and checks on this commit (`3323ed0`): `npm ci && npm run build` is clean (37 pages, plus 404). `npm test` passes: data, unit, dist (warnings only), jsonld (38 pages), repo (self-test 51/51) and axe (370/370 page checks, 200/200 behaviour). `node content/check-content.mjs` and `--dist`: 0 errors. Every internal `href` and in-page anchor in dist resolves. The contact address does not appear anywhere in dist (HTML, JS, JSON-LD, `llms.txt`). A grep of dist for private-life terms (Gmail, parents, spouse and family words, "lives in", "dads", "careers", talent show, demo, download, `.mp3`, newsletter, "first band") found nothing.

## Score: 8.0 / 10. Not approved (2 blocking)

The copy is accurate, plain and warm, and nearly every owner decision is followed to the letter. Eleven of the twelve round-1 should-fixes were made, and both round-1 blockers are gone. Two small factual errors remain, both in data-driven lines that the checkers cannot catch. Fix B1 and B2 and this audit would pass.

## Round-1 fixes confirmed

- **B1/B2 (round 1), Discogs sourcing notes:** gone. The vinyl section now reads "The pressing is a limited edition of 100 copies on Sweden's Sound Asleep Records." The "as Discogs credits them" lines are gone from Believe EP and Shake It Up. "Discogs" now appears only as link labels on `/music/appearances/` and the Sound As Ever "Details" row.
- **International Submarine Band:** confirmed. `/story/sound-as-ever/` reads "…the last of them is called 'The International Submarine Band', the name of Parsons's 1960s band." "First band" appears nowhere in dist. `/vault/covers/` credits "Luxury Liner" to "Gram Parsons (The International Submarine Band)".
- Mike Poole is now "recorded both bands' first albums" (Facts). The "Precious" / "Precious To My Heart" link is made on `/music/appearances/`. The chapter 9 summary now says "A 1998 live recording released in 2021". The MP3 row for "Shake It Up (live)" now points to the 2021 single. "Powder-blue" is used throughout. The home members note no longer repeats Larry. People reads "Photos without a credit line come from the band's own collection". The Accessibility page changes its JavaScript line when Turnstile is built in (`accessibility.astro` line 19). The EPK "Founded" row says "1997 in Texas…". Facts names Sound Asleep Records. `/music/` says "Six compilations". The Billboard row no longer repeats itself. Member years read "1997 to today" on both pages.
- **Still open from round 1:** should-fix 2 is only half done (chapter 9, S1 below), and should-fix 11 (LL-25) was deferred to the owner in `BUILD-LOG.md` (S2 below).

## Confirmed correct (no action)

- **LL-6:** the one-liner is verbatim on Home, Facts, EPK (in one line, short, medium and long bios), `llms.txt`, and the meta and OG descriptions.
- **LL-17:** the sentence is exact in every instance: Home (twice, see S4), Story index, chapter 9, Facts, EPK (medium, long and fact sheet) and `llms.txt`. "Dads with careers" does not appear.
- **LL-4 / LL-5:** spring break 1997, May 1997, Nashville from May 1997, "founded in Texas", with no town and no house. "College friend" is approved wording (P21), and no college is named.
- **LL-7 / LL-19:** "spread across Tennessee, Michigan and Texas" appears with no member-to-state mapping. Chad, Scott and Larry appear only with names, roles, years and band-era photos.
- **LL-9, 10, 14, 15, 16, 18, 20, 21, 22, 23, 24, 37, 38:** all match. Writers per track match `releases.json` and LL-14 ("The Duke Of Gloucester": David; *Nonetheless*: David; the 2026 singles: Chad and David). Cover-art credits match LL-23. LL-24 names, roles and years match exactly. The 2008 caption matches LL-38 left to right.
- **LL-13:** no talent show. Nothing ties "Great Day" to 2008 or to a demo. "Breakaway" is listed bare.
- **LL-27 / LL-29:** no audio files or download links. The MP3s and covers are listed by title.
- **LL-36:** Instagram, Facebook and David's Bandcamp are linked. There is no SoundCloud.
- **LL-39 / LL-40:** no logo designer is credited ("The band's logos date from 1999–2002"), and there is no newsletter.
- **LL-45:** "Photo: Amy Wilstermann" appears on the two 2003 shots and in People › Photographers. No relationship is stated or implied. The surname-sharing names (Amy Wilstermann, Kyle Edgington) are given credit or role only.
- **P22 / P23:** the 2002 photo is always captioned "David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002" and never called a line-up.
- **Durations and identifiers:** album totals match the track sums (Sound As Ever 52:14, Believe EP 8:55, Overbored 36:23, Nonetheless 44:35). Every UPC and catalogue number matches `releases.json`. Track-level guest credits are right: Seykora on 3 and 6, Ishee on 2 and 6, Proegler and Milligan on 11.
- **Captions vs. sources:** Hard Rock 1998, "Chad's Last Show – March 2001", Dancin' in the District 2001 (©2001 Mark Montgomery), the Detroit radio green room (Flickr date 2003-10-24) and the 2003 promo all agree with `assets.json`.
- **Press quotes:** these match `content/press.json` and the research, including "tongue-in cheek" as printed. Mixed reviews (Splendid, Lost At Sea) are listed but never pull-quoted.
- **Disambiguation sentence:** verbatim from `research/04` §5. Tone is third person for the band throughout. "We" appears only on Privacy, Accessibility and Contact.
- **Spelling of names:** consistent across the site (Dewese, Edgington, Wilstermann, LaFrate, Winchester, Stepniewski, Seykora, Nightwine, Henning, Proegler, Milligan, Milfred). There are no repeated words and no stray punctuation.

## Blocking

### B1. Shows: "The first trip out of the region" is false
- **Page:** `/shows/`, row "Late September 2001 · Shows in Ohio and Michigan". **Source:** `content/shows.json` id `2001-09-ohio-michigan`, `note`.
- **Why blocking (factual error):** the same page lists the band in Waco, Texas (autumn 1998) and at SXSW in Austin (March 2001), and chapter 2 covers Waco. Both trips are well outside the Nashville region and both came earlier. The source (`research/01` lines 186, 273, 370: journal, "first Ohio/Michigan trip", "we lost a little money") supports only "first trip to Ohio and Michigan". "Out of the region" is an inference that the page itself disproves.
- **Fix:** set the note to "The band's first trip to Ohio and Michigan." Add a dist test that this row does not say "out of the region".

### B2. Vault: *Live Liners* dated to July 18 only, which contradicts Story and Shows
- **Page:** `/vault/` › Archive recordings. **Source:** `site/src/pages/vault/index.astro` line 31: "*Live Liners* (2002): recorded at 12th & Porter, Nashville, on July 18, 2002."
- **Why blocking (factual error / inconsistency):** chapter 5 says "Two sets at 12th & Porter in 2002, one electric in July and one acoustic in November, became *Live Liners*". `/shows/` marks both July 18 and November 17, 2002 "Recorded for *Live Liners*". `releases.json` `ll-archive-2002-live-liners` has rows for both 7/18/02 and 11/17/02. The Vault line tells readers the record is a single July night.
- **Fix:** "*Live Liners* (2002): two sets at 12th & Porter, Nashville: electric on July 18 and acoustic on November 17, 2002." Better still, render it from `releases.json` so it cannot drift again.

## Should fix

1. **Chapter 9 still says only "Precious To My Heart"** (round-1 should-fix 2, half done). Page `/story/great-day/`. Source `content/story/09-great-day.md`: "In 2025 'Precious To My Heart', the first of the hidden tracks on *Sound As Ever*…". The tracklist printed on the same site says "Precious". **Fix:** "…'Precious To My Heart' (listed as 'Precious' on *Sound As Ever*), the first of its hidden tracks, appeared on *Fireworks Vol. 3*…".
2. **LL-25 is still unresolved for the journal-derived rows.** `/shows/` 2001–04 rows and chapter 5 publish dated journal material: venues, a benefit, a July 4 trip, the Michigan coffee-house dates. `/vault/journal/` says the months are still "being prepared". `BUILD-LOG.md` (Owner decisions needed, item 3) correctly refuses to invent an approval. **Fix:** get David's yes or no on these extracts before launch (add it to `QUESTIONS-FOR-CARLY.md` as a Tier 1 launch gate). If the answer is no, set `publish: false` on the 2001–04 rows in `content/shows.json` and cut chapter 5 to the album-level facts.
3. **Shows page provenance line.** `/shows/` opens with "Shows from 2001 to 2004 come from the band's journal." (`content/shows.json` `journal_note`, `content/shows.md`). That sentence is about where the facts came from, not about the band, which is close to the "no sourcing notes" rule in `content/CHECK.md`. **Fix:** drop it, or turn it into a reader-facing pointer: "The band kept a journal from 2001 to 2004; see chapter 5 of the Story."
4. **Home says "The band never broke up." twice within a screen.** The hero factline (`Founded in 1997. Two new singles in 2026. The band never broke up.`) is followed straight away by the singles intro, which repeats the full LL-17 sentence. **Fix:** in the hero factline (`content/home.md` / `site/src/pages/index.astro`) use "Founded in 1997. Two new singles in 2026." and keep the exact LL-17 sentence in the singles section.
5. **"The *Believe* EP original, recorded live in Waco… in autumn 1998"** (`site/src/lib/releases.ts` line 76; shown on `/music/` and as the `/music/shake-it-up-live/` lead and meta description). It reads as if the EP came first, but the recording is from 1998 and the EP from 2001. **Fix:** "'Shake It Up', the band's own song, recorded live in Waco, Texas, in autumn 1998 with Chad on guitar, David on bass and Scott on drums. The studio version came out on the *Believe* EP in 2001."
6. **Facts › "How dates are given" contains method notes.** "Release dates are the dates the streaming services list… Where accounts differ, the band's own answer stands." (`content/facts.json` / `site/src/pages/facts.astro`). These read as sourcing notes. **Fix:** keep "For the older records the site gives the month; where only a season or a range is known, the site says so." and drop the rest.
7. **`/press/` "Performing Songwriter, by LN".** Bare initials look like a typo to a reader. **Fix:** drop "by LN" in `content/press.json` (`/music/overbored/` already shows the entry without a writer), or print the byline exactly as it ran if a scan confirms it.
8. **Nashville Scene, July 2001, "Catching Up Fast".** `/press/` lists it by title and writer. `research/03` (line 276) notes that the article names members' family. The site neither links nor quotes it, but the title makes it easy to find. **Fix:** confirm with David that listing it is fine. If not, list it as "*Nashville Scene*, July 2001: profile" with no title.
9. **`/shows/` and its meta description claim "Known Luxury Liners shows, 1997–2008"**, but the 2008 row is David's solo CD-release show. **Fix:** prefix that note with "Not a Luxury Liners show:". Alternatively, change the description to "1997–2004, and a 2008 show where Chad joined David". Also change "Two Nashville shows, Nashville, Tennessee" to "Two shows, Nashville, Tennessee".
10. **`/music/new-beginning/` note "Track 2 is 'Great Day'."** This only repeats the tracklist. **Fix** (`site/src/lib/releases.ts` line 67): "Track 2 is 'Great Day', the February single." Do not mention any earlier version (LL-13).
11. **Small consistency items:**
    - In the Overbored chapter prose, "Erik Hage called 'Waiting for the Sun'…" sits outside the quotation, so use the track's casing, "Waiting For The Sun". Keep the quote's own casing inside the quotation marks (`content/story/06-overbored.md`).
    - The EPK press quotes have no dates, but `/press/` and `/music/overbored/` date them. Add month and year (`site/src/pages/epk.astro`).
    - The EPK "Contact" block says the same thing twice ("use the form on the Contact page. Contact the band."). Keep one link.
    - Chapter 2 is dated "(1997–1999)", but nothing in it happens in 1999. Either use "(1997–1998)" or add the 1999 line about the white-shirts era.

## Verdict

- **Approved:** no.
- **Score:** 8.0 / 10.
- **Blocking:** B1 (Ohio and Michigan "first trip out of the region"), B2 (*Live Liners* July-only).
- Both fixes are one line each. Nothing in this round is a privacy leak or an owner-decision violation.
