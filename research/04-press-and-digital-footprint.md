# 04 — The Luxury Liners: press, reviews and digital footprint (and what it means for SEO/GEO)

Track: **footprint** · Worker draft, **round 2** (revised after `critiques/footprint-round1.md`, 6/10) · Compiled 2026-10-07 for the theluxuryliners.com rebuild.
Gauntlet: this file goes to the critic (approval bar 8/10, no blocking issues); critiques live in `critiques/`.

> **Authority order.** (1) Owner decisions in `/home/user/daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md` beat everything (F4, F6, P5, P6, P8, P21–P23, P27, L1, X1). (2) The band's own words (old theluxuryliners.com, the 2001–04 journal, David's posts). (3) Press and databases. (4) Search-engine summaries, which are **leads only**.
>
> **X1 applies.** One 1990s side project and the person tied to it are left out of this file completely. Where a public record carries X1 material, this file says so only in general terms (see §4.2) and does not name it.
>
> **Privacy.** Chad Edgington, Scott Carpenter, David Wilstermann and everyone else appear in **public band roles only**. Some sources below (the Baptist Standard profile, the 2001 *Nashville Scene* profile, the 2002 *Nashville Rage* blurb, the old mail-order pages) contain jobs, churches, family names, addresses or phone numbers. This file points to those sources but does not repeat those details. **Rule for the new site: none of those details may appear in copy, captions, JSON-LD, `llms.txt` or alt text.**

---

## How to read this file

**Confidence labels** (on every fact):

| Label | Meaning |
|---|---|
| **confirmed-owner** | Stated by Carly for David in DECISIONS-2026-09-29.md. Final. |
| **verified-source** | Read first-hand (by this session, or by the daviddewese.com team in Sept–Oct 2026 from a live API or a Wayback capture, as cited). |
| **single-source** | One secondary source, read first-hand, nothing to confirm it. |
| **unverified** | Known only from a search-engine summary, an inference or a lead. Do not publish without checking. |

**Source keys:**

- `DEC` owner decisions. `R01`, `R02`, `R04`, `R05`, `R06` = daviddewese.com research files 01, 02, 04, 05, 06 (`/home/user/daviddewese.com/daviddewese-com/research/`).
- `GEO1`, `GEO2` = `/home/user/daviddewese.com/daviddewese-com/critiques/audit-geo-round1.md` and `-round2.md` (these critics read MusicBrainz, Wikidata, Spotify oEmbed and YouTube RSS live on 2026-10-03).
- `LL01`, `LL02` = this project's `research/01-band-history-and-people.md` and `research/02-discography.md`.
- `CDX` = `/home/user/daviddewese.com/daviddewese-com/research/legacy/cdx-theluxuryliners.com.json` (Wayback index, 675 rows).
- `WB:<timestamp>/<path>` = a theluxuryliners.com Wayback capture read by the daviddewese.com team (quoted in R04 §5).
- `WS` = WebSearch, this session (2026-10-07). WebSearch returns titles, URLs and a model-written summary. **The summary is not the page**; anything that rests only on it is `unverified` or, where the wording matches a quote already read first-hand elsewhere, `single-source`.

**Web access this session (corrected in round 2).** WebFetch was refused (`EGRESS_BLOCKED`) for every host tried, but **plain `curl` works for most of the platforms that matter**. Round 1 wrongly treated the WebFetch refusals as "host blocked". Read live with `curl` on 2026-10-07 (marked **[live 10-07]** below):

| Host | Result with `curl` |
|---|---|
| musicbrainz.org (ws/2 API) | 200, full JSON |
| api.discogs.com | 200, full JSON |
| itunes.apple.com (lookup API) | 200 |
| music.apple.com | 200 (artist JSON-LD includes the bio) |
| www.iheart.com | 200 (bio in page) |
| open.spotify.com | 200 (meta tags only: name and monthly listeners) |
| api.deezer.com | 200 |
| en.wikipedia.org (raw wikitext, search API) | 200 |
| www.wikidata.org (API) | one `wbsearchentities` call returned 200; the next calls were rate-limited ("too many requests") |
| www.allmusic.com, www.shazam.com | **403** |
| www.last.fm | 200, but it serves a "Client Challenge" page with no content (the critic got 406) |
| web.archive.org, theluxuryliners.com | blocked (per the brief; not retried) |

Facts from AllMusic, Shazam, Last.fm, Instagram and Facebook therefore still rest on earlier first-hand reads by the daviddewese.com team or on search summaries, and are labelled that way. Everything still worth opening by hand is in §9.

---

## 1. Summary

1. **The press record is real but almost all of it is offline.** About 25 press items are known (1998–2006, plus a later profile of Chad). Nearly all are known only through the band's own 2005 press page on Wayback (`WB:20051225072849/press.html`, read by R04). Only a handful of originals are online today (*Nashville Scene* archive pages, the Baptist Standard profile, AllMusic). None of the originals could be opened this session. Best quotes: "the best (and best dressed) purveyors of pop in Nashville" (*Nashville Rage*, 7-02), "drop-dead perfect pop-rock" (Erik Hage, *Metroland*, 6-03), "a must-have for all power pop fans" (*Performing Songwriter*, 7-04).
2. **The one bio every platform repeats is AllMusic's 2001 bio by Erik Hage**: "Named after a Gram Parsons song, Luxury Liners were originally intended as an alt-country outlet for Foxymorons member David Dewese (after moving from Texas to Nashville) … The Believe EP followed in 2001. ~ Erik Hage". It is shown word for word, signed "~ Erik Hage", on **Apple Music** (artist 47333263, in the page's JSON-LD `description`) and on **iHeart** (artist 384637). Both were read live today **[live 10-07]**; the Apple text was also recorded as fetched in dd `research/03-standards-and-stack.md` (line 549). **Shazam** (which uses the Apple artist ID) shows it too, per search summary. Apple's lookup API ties the artist to AllMusic (`amgArtistId` 468639) **[live 10-07]**, so this is syndication from AllMusic. The bio **omits Chad Edgington's co-founding** (F4), frames the band as David's side outlet, and stops in 2001. **One upstream fix at AllMusic would correct Apple, iHeart and Shazam together.**
3. **A second blurb circulates, source unknown**: "The Luxury Liners are a Nashville-based rock band. The band members consist of Scott Carpenter, David Dewese, and David Wilstermann. Since 1998, they have been releasing albums and EPs and are currently with Litterbug Records." Round 1 attributed it to Apple and iHeart. **That was wrong**: neither page contains "Nashville-based" today **[live 10-07]**. The most likely home is the **Last.fm wiki** (Last.fm "similar artists" pages are what surface for this exact phrase), but Last.fm could not be read. The text may also be a search engine's own composite. It **omits Chad** (P8, F4), says "Nashville-based" in the present tense (David lives in Dallas, F3), and "since 1998" is loose (founded 1997; first compilation tracks 1998; first album 2000).
4. **Search/AI answers repeat both texts.** This session's search tool, asked about the band, answered with the two texts above merged together, with **no mention of Chad, the 2021 live single or the 2026 singles** (§6). Caution: this may only be the search tool restating whichever page carries the text, so it shows what retrieval surfaces, not an independent AI view. The stronger evidence is the live Apple and iHeart pages in point 2.
5. **Entity state:**
   - **Wikidata:** no item. `wbsearchentities` for "Luxury Liners" returned no results **[live 10-07]**.
   - **Wikipedia:** no article; no Wikipedia page mentions "Luxury Liners" together with "Dewese" (search API, 0 hits) **[live 10-07]**.
   - **MusicBrainz** `7af7fd54-1d1b-4353-ab60-4b61bceed337` **[live 10-07]**: no begin date, no area, three members (no Chad), two of seven releases, and five URL links. One link is a dead MySpace page, and the homepage is `http://www.`, not https.
   - **Discogs** `4298743` **[live 10-07]**: the most complete record (five members incl. Chad; official site and Facebook already linked). But the profile says "Indie rock band in Nashville, Tennessee. Originally formed in 1997 in Texas.", and the 2021/2026 singles are missing.
   - **AllMusic** `mn0000759673` lists the band as "Luxury Liners" (no "The").
   - **Spotify:** **553 monthly listeners** (baseline, 2026-10-07) **[live 10-07]**.
6. **The official site is invisible in search.** In this session's searches, **theluxuryliners.com never appeared**. Round 1's queries were not logged; round 2's logged queries are in §6. A search for the bare domain returned only cruise pages. The band's own words reach engines only through Bandcamp (David's account), Apple/iHeart/Shazam (the AllMusic bio), Last.fm and old *Nashville Scene* pages. The current Carrd page has one sentence of copy. Its meta description calls the band "one-time" (i.e. finished), though it released two singles in 2026. It has no JSON-LD and no `llms.txt` (R04 §3).
7. **Name collisions dominate every query.** Emmylou Harris's album *Luxury Liner*, ocean liners and cruise ships, Carter Tanton's project *Luxury Liners*, a Marina del Rey yacht-charter firm called Luxury Liners, the bands Luxury (Georgia) and Luxury (Iowa), and even a UK punk band called **Litterbug** (which collides with the band's label name). The new site must carry disambiguation in HTML, JSON-LD and `llms.txt` (§5, §8).
8. **Biggest wins, in order:**
   - (a) Publish the canonical facts on theluxuryliners.com, with a full `MusicGroup` JSON-LD graph and `sameAs` (§8.2).
   - (b) Create the Wikidata item, **and** submit the AllMusic bio correction. AllMusic is the one root fix for the bio repeated on Apple, iHeart and Shazam.
   - (c) Fix MusicBrainz: add Chad as co-founder (1997–2001), begin date 1997, https homepage, end the MySpace link, and add the missing releases and DSP links.
   - (d) Fix the Discogs profile.
   - (e) Write a Spotify bio and rewrite the Last.fm wiki (§7).


---

## 2. Press inventory

### 2.1 How the press is known

| Layer | What it is | Confidence |
|---|---|---|
| The band's 2005 press page | `WB:20051225072849/press.html`, read by the daviddewese.com team. Quotes reprinted "verbatim with attribution as printed" (R04 §5.2). | **verified-source as the band's reprint**; the original articles are unseen |
| The band's 2000 press page | `http://www.theluxuryliners.com:80/press.html`, captured **2000-10-22** (`CDX`, status 200). **Never read.** It should hold the 1998–2000 press (*Billboard*, Monsters of Pop, *Sound As Ever* reviews). | unread (§9) |
| The 2001 links page | `/links.html`, captured 2001-07-11 (`CDX`). Never read. | unread |
| The 2003 one-sheet | `/downloads/luxury_liners_onesheet.pdf`, captured 2003-04-14 (`CDX`); its web version (`WB:20050308093846/data.html`) was read (R04 §5.2) | verified-source (band's own copy) |
| Foxymorons press pages | the 2003 foxymorons.com press page carries the 2001 *Nashville Scene* profile of David and the *earpollution* interview, both of which cover the LL (R05 §4.3, §7) | verified-source as reprint |
| Search | *Nashville Scene* archive URLs and the Baptist Standard profile surfaced in WS; pages blocked | unverified / single-source |

**Quote policy for the new site** (carried over from R04 §5.2): quote only the positive excerpts below, always with publication and date, and link the original where one is online. Some 2003 reviews were mixed (Lost At Sea: "'Overbored' is not a clever pun"; Splendid: "they don't have anything to say"); do not quote them out of context, and do not fake a positive pull-quote from them.

### 2.2 Press items (chronological)

"Excerpt" = the exact words known. "Reprint" = known through the band's own press page, not read in the original.

| # | Date | Publication | Writer | Headline / type | URL | Excerpt | Confidence |
|---|---|---|---|---|---|---|---|
| 1 | 1998 (issue unknown) | *Billboard* | unknown | "Hot Prospects" (Baptist Standard) or "buzz-bin article" (band bio, 2000) | none found; look in the worldradiohistory.com *Billboard* 1998 PDFs or Google Books | excerpt unverified. Band bio 2000: the live show earned "a buzz-bin article in industry giant Billboard magazine" (`WB:20000926003543/bio.htm`) | **unverified** (two band-side sources agree; the item itself is unseen). David's Flickr has a "Billboard Photo Shoot 1998" set (`PH:2068108482`, R06) |
| 2 | 1998 (June; year from snippet) | *Nashville Scene* | unknown | "Top of the Pops" (Monsters of Pop showcase, June 11–13, Exit/In and The End) | https://www.nashvillescene.com/arts_culture/top-of-the-pops/article_a7f15ca7-0558-526a-9709-e4ee4a74a05f.html ; alternate path surfaced today: https://nashvillescene.com/arts-culture/article/13002339/top-of-the-pops | "the Byrds-influenced Luxury Liners" (WS summary, today and in LL01) | single-source (snippet; page blocked) |
| 3 | 1998 (year from snippet) | *Nashville Scene* | unknown | "Block-Rockin'" (Monsters of Pop) | https://www.nashvillescene.com/arts_culture/block-rockin/article_81f0b3b8-63a9-521b-82c4-d324fe5d9065.html | excerpt unverified | unverified |
| 4 | Sep 2001 | *All Music Guide* (AllMusic) | Erik Hage | artist biography | https://www.allmusic.com/artist/luxury-liners-mn0000759673 | "Named after a Gram Parsons song, the Luxury Liners were originally intended as an alt-country outlet for Foxymorons member David Dewese … the group ended up more as a guitar-crunchy power pop band that called to mind classic acts like Big Star, Badfinger, and the Raspberries." | verified-source (reprint on the 2005 press page, R04; same text live today on Apple Music and iHeart [live 10-07], and on Shazam per WS). Assessed in §3.1 |
| 5 | Sep 2001 | *Nashville Rage* | not printed in R04 extract | blurb | none | "Former Texans who craft stylish Americana pop as if the Byrds had arisen in a post-alternative rock world." | verified-source (reprint) |
| 6 | Jul 2001 | *Nashville Scene* | Noel Murray | "Catching Up Fast" (profile of **David**; covers both bands) | not located online; reprinted on the 2003 foxymorons.com press page (R05 §4.3) | "Foxymorons gets the artsy songs, and Luxury Liners gets the cheesy hits." (David, quoted). Also: "a rapidly developing, often stunning tunesmith" (of David). **Contains family details: do not reuse those.** | verified-source (reprint) |
| 7 | Aug 2001 | *earpollution* (webzine) | **Erik Hage** (R05 line 92) | interview with David (Foxymorons; long LL passage) | reprinted at https://web.archive.org/web/20030211083145/http://www.foxymorons.com:80/bio.html (R05 §7) | "When I moved to Nashville, I named my band after a Gram Parsons song called 'Luxury Liner.' We got to meet [Western clothes designer] Manuel and wear Nudie Suits in concert. We met Emmylou [Harris] and Philip Kaufman… They all came to see us play. Then we discovered the Beach Boys and the alt-country dream was over for the Luxury Liners." (R05 line 373) | verified-source (as David's 2001 words; the meetings themselves are David's claim, unconfirmed). Note: "I named my band" is David's claim; F4 governs the founding |
| 8 | Oct 2001 | *Nashville Scene* | unknown | listed on the band's press page | none | excerpt unverified | verified-source that it exists (reprint list); content unseen |
| 9 | Dec 2001 | *The Tennessean* | unknown | style profile | none | excerpt unverified. A Kristina Marie Krug portrait of David was printed in *The Tennessean* (`PH:529309225`, R06); probably this item (inference) | listed (reprint); content unseen |
| 10 | Apr 2002 | *CCM Magazine* | unknown | review of the *Believe* EP (paired with the Foxymorons' *Rodeo City*) | none | excerpt unverified | listed (reprint) |
| 11 | Apr 2002 | *Nashville Rage* | not printed in extract | blurb | none | "Excellent power pop with the tongue-in cheek wiliness of Cheap Trick and the underlying violence of Big Star." | verified-source (reprint) |
| 12 | Jul 2002 | *Nashville Rage* | not printed in extract | blurb | none | "…the best (and best dressed) purveyors of pop in Nashville." **The 2002 blurb names band members' family members: do not reuse those details** (R04 §5.2 privacy flag) | verified-source (reprint) |
| 13 | Jul 2002 | *Nashville Scene* | unknown | listed on the band's press page | none | excerpt unverified | listed (reprint) |
| 14 | Jun 2003 | *Metroland* (Albany, NY) | Erik Hage | review of *Overbored* | none | "'Waiting for the Sun' … is drop-dead perfect pop-rock (and the best song here) … This is one of my favorites of the year." | verified-source (reprint) |
| 15 | Jul 2003 | Kool Kat Musik (mail-order catalogue) | — | retailer blurb for *Overbored* | none | "Brand new full-length effort from one of our favorites!" | verified-source (reprint). A shop listing, not a review; label it as such |
| 16 | Aug 2003 | *Impact Press* | unknown | review of *Overbored* | none | excerpt unverified | listed (reprint) |
| 17 | Aug 2003 | *Aiding & Abetting* | unknown | review of *Overbored* | none | excerpt unverified | listed (reprint) |
| 18 | Sep 2003 | *Southeast Performer* | aaron mendelsohn (as printed) | review of *Overbored* | none | excerpt unverified | listed (reprint) |
| 19 | Oct 2003 | *Nashville Rage* | Todd Anderson | review of *Overbored* | none | "The bittersweet trio of Woman, Equasue and Fifteen Again really push the album into the pantheon of tremendous local songwriting." | verified-source (reprint) |
| 20 | Oct 2003 | *Splendid* (ezine) | Theodore Defosse | review of *Overbored* | none | mixed; contains "they don't have anything to say" | listed (reprint). **Do not pull-quote** |
| 21 | Oct 2003 | *Lost At Sea* | Andy Brown | review of *Overbored* | none | mixed; contains "'Overbored' is not a clever pun" | listed (reprint). **Do not pull-quote** |
| 22 | Jan 2004 | *Nashville Scene* | unknown | listed on the band's press page | none | excerpt unverified | listed (reprint) |
| 23 | Jul 2004 | *Performing Songwriter* | "—LN" | review of *Overbored* | none | "Overbored … is a must-have for all power pop fans." | verified-source (reprint) |
| 24 | 2006 (year-end) | Absolute Power Pop (blog) | unknown | Top 100 Releases of 2006: *Nonetheless* at **#100** | none (listed on the band's 2007 home page, `WB:20070205211156/`) | — | verified-source (band's own listing) |
| 25 | 2006 (year-end) | Carligula (blog) | unknown | Top Five Nashville Releases of 2006: *Nonetheless* at **#3** | none (same capture) | — | verified-source (band's own listing) |
| 26 | date unknown (after 2001) | *Baptist Standard* (Texas) | unknown | profile of **Chad Edgington** (**internal only; headline withheld**: the headline and URL state Chad's later life and are not repeated in this file; the URL is kept only in the internal note in §9) | internal only | Band facts only (WS summary): Chad and David were college friends (the college name is held back until the owner confirms it; P21 approves only "college friend Chad Edgington"); after graduating in 1997 they moved to Nashville and formed the band; it lasted "about four and a half years" with drummer Scott Carpenter and "at times, additional musicians on bass"; it "secured a production deal, recorded two CDs, and was named one of Billboard magazine's Hot Prospects in 1998". **Not to be cited, summarised or linked on the site without Chad's OK.** | single-source (summary only; page blocked) |

**One critic, three items.** Erik Hage wrote the AllMusic bio (#4), the *earpollution* interview (#7) and the *Metroland* review (#14). Count them as one independent voice, not three. This matters for any Wikidata or Wikipedia notability case (§4.1): the independent coverage is thinner than 26 rows suggest.


**Other *Nashville Scene* pages that mention the band** (found by LL01's searches; content known only from snippets; probably club listings and critics' picks, 1998–2004; each **unverified**): "Popzilla", "Set to Pop", "Formation of Stars" (The Luxury Stars, a Nashville band, reportedly took care to avoid confusion with "fellow Nashville power-poppers The Luxury Liners"; it surfaced again in today's search), "Our Critics' Picks", "March 1 ♦ The Mountain Goats/John Vanderslice", "The Magic Carpathians, Wednesday, 3/14", "Sound & Fury", "Ragman Son Revue". Full URLs: LL01 §11. One snippet (article unknown) praises "head-bobbing hooks, guitars altered with dollops of distortion and reverb, and an emphatic beat that's all about getting butts up out of seats" and mentions an EP-release show (probably the *Believe* EP, 2001; inference).

**Searches that found nothing new (2026-10-07):** reviews of *Sound As Ever*, *Overbored*, *Nonetheless* on the open web; any coverage of the 2021 live single or of "Great Day" / "New Beginning" (2026). Results were swamped by cruise ships, the book *Luxury Liners: Life on Board*, Emmylou Harris and a yacht-charter firm. **There is no known press for the 2021–2026 releases.** That is the biggest press gap and the biggest freshness gap for GEO.

### 2.3 Screen and sync placements (press-adjacent; from the band's own posts)

| Placement | Detail | Source | Confidence |
|---|---|---|---|
| *One Tree Hill* (The WB/CW) | "Dreaming", S1 E15 "Suddenly Everything Has Changed" | R04 §4.2 placements page; clip YouTube KAq9dUlt3Rw | verified-source (band claim + clip); Tunefind listing **not found** by WS (unverified there) |
| FOX Sports / FOX Soccer | "Sunshine" as the theme song of the *US Youth Soccer Show* | R04 §4.2; YouTube mju1nb3BOzU; David's post of 2010-04-07 ([Wayback](https://web.archive.org/web/20210422234859/http://daviddewese.com/tv-theme-song/)) | verified-source (band claim + clip); no third-party confirmation found by WS |

Both are strong GEO facts (they answer "has their music been on TV?") and should be on the site with the episode/show named, not "a FOX Sports theme" (GEO2 nit 4 made the same point on daviddewese.com).

**Compilation appearance missing from every database:** a Luxury Liners track is on *Superdrag Tribute II* (Bomberpunk, 2004, sold on eBay only), per the Foxymorons' own site (dd research/05 line 324; LL02 line 281). The track title is unknown, and neither Discogs nor MusicBrainz lists it. Confidence: **single-source** (band-side). Ask David for the title (§10.2), then add it to Discogs and MusicBrainz along with the other compilations.

---

## 3. Platform bios: what they say and how accurate they are

### 3.1 The AllMusic bio by Erik Hage, syndicated to Apple Music, iHeart and Shazam

**Where it appears:**

| Platform | URL | What was read | Confidence |
|---|---|---|---|
| AllMusic (origin) | https://www.allmusic.com/artist/luxury-liners-mn0000759673 (name **"Luxury Liners"**, without "The") | page returns 403 to scripts; text known from the band's 2005 reprint (R04 §5.2) and the syndicated copies below | verified-source (via syndication); AllMusic page itself unread |
| **Apple Music** | https://music.apple.com/us/artist/the-luxury-liners/47333263 | full bio in the page's JSON-LD `description`, signed "~ Erik Hage" | **verified-source [live 10-07]**; also dd `research/03-standards-and-stack.md` line 549 [fetched] |
| **iHeart** | https://www.iheart.com/artist/the-luxury-liners-384637/ | same bio, word for word, signed "~ Erik Hage". The page's meta description is "Great Day, New Beginning", so iHeart has the 2026 singles | **verified-source [live 10-07]** |
| Shazam | https://www.shazam.com/artist/-/47333263 ("Artist Biography") | 403 to scripts; search summary shows the same text. Shazam uses the Apple artist ID | single-source (WS) |

**Why one text everywhere:** the iTunes lookup API returns `amgArtistId: 468639` for artist 47333263 **[live 10-07]**. That field is Apple's link to the All Music Guide database. So Apple, and services that use Apple's metadata (Shazam, and evidently iHeart), show the AllMusic bio. **This is verified, not an inference.** Round 1 called it an inference; that was wrong.

**Text (live, Apple and iHeart, identical):** "Named after a Gram Parsons song, Luxury Liners were originally intended as an alt-country outlet for Foxymorons member David Dewese (after moving from Texas to Nashville). However, the group ended up more as a guitar-crunchy power pop band that called to mind classic acts like Big Star, Badfinger, and the Raspberries. The group released its debut album, Sound As Ever, in May 2000. The Believe EP followed in 2001. ~ Erik Hage". Writer: **Erik Hage** (Sept 2001 per the band's 2005 press page). The 2005 reprint reads "the Luxury Liners"; the live copy reads "Luxury Liners".

| Claim | Assessment against owner decisions and sources |
|---|---|
| "Named after a Gram Parsons song" | **Correct** (David, *earpollution* 2001; LL01 §2.3). The song is "Luxury Liner", first recorded by the International Submarine Band on *Safe at Home* (1968). |
| "originally intended as an alt-country outlet for Foxymorons member David Dewese" | **Misleading by omission.** F4: **David co-founded the band with Chad Edgington in 1997.** The sentence makes the band David's side project and erases Chad. The "alt-country" origin itself is supported by David's own 2001 words ("the alt-country dream was over"), so the fix is to add Chad, not to deny the alt-country start. |
| "Foxymorons member" | True, but it frames the LL as secondary to the Foxymorons. In 1997–2006 the LL was David's main working band in Nashville (LL01 §8). |
| "guitar-crunchy power pop … Big Star, Badfinger, and the Raspberries" | Fair (a critic's view; consistent with the press in §2.2). Keep as a quote. |
| *Sound As Ever* May 2000; *Believe* EP 2001 | Correct (LL02 §2). |
| What is missing | Chad (co-founder), Scott Carpenter and David "Larry" Wilstermann (P8), *Overbored* (2003), *Nonetheless* (2006), the 2021 live single, "Great Day" (2026-02-13) and "New Beginning" (2026-04-17) (F6). The bio froze in 2001. |

**Verdict:** accurate as far as it goes, but stale (2001) and wrong in emphasis on the founding. It is the only critic-written bio, and it is syndicated to Apple Music, iHeart and Shazam. That makes it the **single most-repeated text about the band** on the web and in search/AI answers (§6). **Correction route: one fix at AllMusic (§7 #2b) corrects all three copies.** Apple's artist bio is AllMusic-syndicated, so a bio written in Apple Music for Artists may or may not override it; do not rely on that.

### 3.2 The "Nashville-based rock band" blurb (source unknown)

- **Text** (WS summary; again today for the exact-phrase query `"The Luxury Liners" "Nashville-based rock band"`; matches LL01 D10 and the foxymorons.com research): "The Luxury Liners are a Nashville-based rock band. The band members consist of Scott Carpenter, David Dewese, and David Wilstermann. Since 1998, they have been releasing albums and EPs and are currently with Litterbug Records."
- **Which platform shows it: source unknown.**
  - **Not Apple, not iHeart.** Neither page contains "Nashville-based" today **[live 10-07]**. Both carry the Hage bio (§3.1). Round 1 attributed the blurb to them, and LL01/LL02 did the same from search snippets. That attribution is withdrawn.
  - **Probable source: the Last.fm wiki.** For the exact-phrase query, the results were three Last.fm "similar artists" pages (The Nobility, Zaemon, Rob Momary), the Shazam page, and Emmylou Harris pages. Last.fm similar-artist cards show a short wiki excerpt for each artist. Last.fm returned a "Client Challenge" page to `curl`, so this is **unverified**.
  - **Alternative:** the search engine may have composed the text itself from credits and label metadata. The member list matches MusicBrainz's three members exactly (§4.1).
- It reads like an auto-generated blurb: a member list taken from credits, and "currently with" a label taken from metadata.

| Claim | Assessment |
|---|---|
| "Nashville-based" | **Out of date.** The band was Nashville-based 1997–c. 2010. David lives in Dallas (F3); members are "scattered across four different states" (David, 2012–24 bio, R04 §4.2). |
| Members: Carpenter, Dewese, Wilstermann | **Incomplete; contradicts P8 and F4.** Omits co-founder and forever member **Chad Edgington**. (This is the 2001–2007 trio.) |
| "Since 1998" | Loose. First recordings 1998 (*Fireworks Vol. 2*, *Nashpop*); first album 2000; band founded 1997 (F4). |
| "currently with Litterbug Records" | Correct for the digital catalogue and the 2026 singles (LL02). |

### 3.3 Spotify

- Artist `3416B3EOd5itWZazwzw9Qc` ([link](https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc)); name "The Luxury Liners" (Spotify oEmbed, GEO1; page meta **[live 10-07]**).
- **Monthly listeners: 553** (page `og:description` "Artist · 553 monthly listeners.", 2026-10-07) **[live 10-07]**. Record this as the baseline for measuring the site launch and the 2026 singles.
- **Bio ("About"): not visible to scripts.** The server-rendered page holds no bio text (no "Named after", "Nashville" or "Erik Hage"). Whether Spotify shows a bio to logged-in users is **unverified** (§9).
- Duplicate: an unavailable *Believe* album `4d8xq6q2H9a9VpwPrOmgLz` exists alongside the live one `0b8te1vh6pqC1vcUrzmVD5` (R01 §2 links; verified-source). It is harmless, but worth asking the distributor to remove.
- Action: claim or confirm Spotify for Artists and write the bio (§7 #4).

### 3.4 Last.fm

- https://www.last.fm/music/The+Luxury+Liners exists. WS shows the page title "The Luxury Liners music, videos, stats, and photos", plus an album page `/The+Luxury+Liners/Sound+As+Ever`. Wiki text, listener counts and scrobble counts are **not read**: `curl` gets a "Client Challenge" page (the critic got a 406).
- **Track-level scrobbles exist (a positive signal).** WS surfaced a Last.fm track page for **"Constellation Invitation"** under The Luxury Liners (https://last.fm/zh/music/The+Luxury+Liners/_/Constellation+Invitation). This is a real Luxury Liners song: *Overbored* track 10, 2:55, ISRC USEC40500240 (LL02 line 154; LL01; Bandcamp tracklist). **Round 1 wrongly called it a mis-merge; that claim is withdrawn.** The page shows that the catalogue is being scrobbled track by track, and that Last.fm has a separate entity for the band.
- Last.fm's "Similar Artists" pages for The Nobility, Zaemon and Rob Momary surface in band searches. They tie the band to David's Nashville circle, which is fine.
- Last.fm wikis are user-editable and widely scraped. If the "Nashville-based" blurb (§3.2) lives there, rewriting the wiki with sourced, owner-consistent facts is a cheap, high-yield fix (§7 #6).


### 3.5 Other bios and profiles

| Platform | ID / URL | What it says | Accuracy | Confidence |
|---|---|---|---|---|
| Discogs artist | [4298743](https://www.discogs.com/artist/4298743-The-Luxury-Liners) | profile, in full: **"Indie rock band in Nashville, Tennessee. Originally formed in 1997 in Texas."**; members Chad Edgington, David Dewese, Jeff Lafrate, David Wilstermann, Scott Carpenter (5); URLs `https://www.facebook.com/theluxuryliners/` and `http://theluxuryliners.com/` (already present); name variation "Luxury Liners"; data quality "Needs Vote" | Members good (Chad present). **Both sentences need fixing.** (1) "Indie rock band in Nashville" is a stale present-tense base (F3; D4) and a genre mismatch (the press and AllMusic say power pop). (2) "Formed … in Texas" conflicts with F4's "1997 (Nashville)", though the band's 2005 history supports a Texas college start (LL01 D2). Recommend: "American power-pop band co-founded in 1997 by David Dewese and Chad Edgington, college friends from Texas who took the band to Nashville." "Lafrate" vs band roster "LaFrate" | **verified-source [live 10-07]** (Discogs API) |
| Bandcamp | daviddewese.bandcamp.com (David's account hosts *Sound As Ever*, *Believe EP*, *Overbored*, *Nonetheless*) | album pages carry credits; no band bio known | Bandcamp dates differ from the P6 public dates (LL02 D3, D4) | verified-source (R01) |
| Deezer | [1518436](https://www.deezer.com/artist/1518436) | name "The Luxury Liners"; 6 albums; 48 fans | no bio known | **verified-source [live 10-07]** (Deezer API) |
| Tidal | [5748092](https://tidal.com/browse/artist/5748092) | — | Tidal lists "New Beginning" as 2026-04-10 and *Overbored* as 2003-01-01 (LL02 D4, D5) | verified-source (R01) |
| YouTube | channel [UCi2Kheqfw714F4v8bwBbViA](https://www.youtube.com/channel/UCi2Kheqfw714F4v8bwBbViA) (@theluxuryliners): 3 videos, all 2006 ("It's You", "Equasue", "Circles"); a "Topic" auto-channel also exists | no recent uploads; nothing for 2021/2026 | verified-source (RSS, R02, GEO1) |
| iHeart | [384637](https://www.iheart.com/artist/the-luxury-liners-384637/) | **the Erik Hage AllMusic bio**, word for word (§3.1); meta description "Great Day, New Beginning" | as §3.1 (round 1 wrongly said the "Nashville-based" blurb) | **verified-source [live 10-07]** |
| SoundCloud | soundcloud.com/theluxuryliners | listed in LL02; contents unknown | — | unverified (not opened) |
| Instagram | [@theluxuryliners](https://www.instagram.com/theluxuryliners/) | linked from the official site; unreadable (429 / login) | — | exists (official link); contents unverified |
| Facebook | [/theluxuryliners](https://www.facebook.com/theluxuryliners/) | linked from the official site; login wall | — | exists (official link); contents unverified |
| MySpace (2006–09) | linked from the 2006–09 site nav ("MYSPACE", R04 §5.1 L5); **still linked from MusicBrainz** as https://myspace.com/theluxuryliners **[live 10-07]** | dead platform | never link; end the MB link (§7 #3) | verified-source (archive; MB API) |
| Big Cartel | daviddewese.bigcartel.com/product/sound-as-ever | a store page for the *Sound As Ever* CD (LL02); R02 lists bigcartel as a dead link to purge | conflicting; check by hand | unverified |
| Amazon | CD ASINs B00004U073 (*Sound As Ever*), B000065T3A (*Believe*) | — | — | single-source (R01, LL02) |
| RateYourMusic | not found (RYM blocks scripts; WS found nothing) | — | — | unverified |
| Paste | pastemagazine.com/artist/luxury-liners | **collision: probably Carter Tanton's Luxury Liners** (LL02) | not this band | unverified |

### 3.6 The band's own sites (as engines see them)

| Property | What engines get | Problem | Source |
|---|---|---|---|
| theluxuryliners.com (Carrd, Oct 2024–) | title "The Luxury Liners"; meta/OG description "One-time Nashville rock band, now scattered across the country."; on-page "Forever brosephs that formed in 1997 and have released several albums over the years."; 6 buttons; sitemap with one URL; `llms.txt` 404; no JSON-LD | meta says the band is over; on-page copy has no names, no Chad, no releases; image `alt=""`; YouTube button points to one video (V6h-vFJfRjI), not the channel; email only via Cloudflare JS | R04 §3 (read live 2026-09-28) |
| theluxuryliners.com, April 2024 version | `og:description` "Texas-based musical duo of Jerry James and David Dewese" | **described the Foxymorons.** Fixed in Oct 2024, but caches and AI training sets from 2024 may still hold it | R04 §5.1 L6 |
| theluxuryliners.com, 2012 | "The band is currently going by the name 'David Dewese.'" | can make engines merge the band into David's solo act | R04 §5.1 L6 |
| Legacy URLs (`/press.html`, `/history/`, `/lyrics.html`, `/music.html` …) | all 404 today | link equity from 2000s blogs and directories is lost; R04 §6 item 6 has a ready redirect list | R04 §3.4, §6 |
| daviddewese.com `/bands/the-luxury-liners/` | full band page with F4 co-founder copy, FAQ ("Who founded The Luxury Liners?"), disambiguation sentence and `MusicGroup` JSON-LD with 7 `sameAs` | **built and audited but not yet deployed** (BUILD-LOG: "Nothing was deployed"). Once live it will be the best source about the band until theluxuryliners.com is rebuilt; the two sites must say the same thing | `site/src/lib/site.ts`, `jsonld.ts`, `answers.ts`; GEO1, GEO2 |

---

## 4. Knowledge-graph entity state

### 4.1 Summary table

| Graph | ID | State | What's wrong / missing | Confidence |
|---|---|---|---|---|
| **Wikidata** | **none** | No item for the band. `wbsearchentities` for "Luxury Liners" (English) returned `"search":[]` **[live 10-07]**; later calls were rate-limited. This agrees with the daviddewese.com team's searches of 2026-09-28 and 2026-10-03. No item for David Dewese either (dd research/03). Only The Foxymorons have one (Q22022568) | Create the item (§7 #2a) | **verified-source [live 10-07]** |
| **Wikipedia** | **none** | No article for the band or David. The Wikipedia search API returned **0 hits** for `"Luxury Liners" Dewese` **[live 10-07]**. The article that wins every "Luxury Liner(s)" query is **"Luxury Liner (album)"** (Emmylou Harris). The Foxymorons article is the only one in the family (R02) | An article is not realistic yet. Independent coverage is thin: most press is offline, and three items share one critic, Erik Hage (§2.2). Priority is Wikidata + MusicBrainz. If the 1998 *Billboard* item and two or three full *Nashville Scene* / *Rage* reviews by different writers are recovered, an article becomes arguable | verified-source [live 10-07] / R02 |
| **MusicBrainz** | [7af7fd54-1d1b-4353-ab60-4b61bceed337](https://musicbrainz.org/artist/7af7fd54-1d1b-4353-ab60-4b61bceed337) | Group "The Luxury Liners"; no begin/end date (`ended: false`); no area; no disambiguation; no aliases. **Members** ("member of band", no dates or attributes): Scott Carpenter, David Dewese, David Wilstermann. **URL relations (5):** official homepage `http://www.theluxuryliners.com/`; social network `https://www.facebook.com/theluxuryliners`; myspace `https://myspace.com/theluxuryliners`; social network `http://www.flickr.com/photos/dewese/collections/72157600177972175/` (David's personal Flickr collection); purchase for download `https://itunes.apple.com/us/artist/id47333263`. **Release groups (2):** *Overbored* (110c4bd6-6ef3-3297-a99c-a334213cb228), *Nonetheless* (f45d4be4-6850-3b8e-aae9-3fe518ad8403), both with no first-release date | **No begin date (1997), no area, no Chad Edgington** (co-founder 1997–2001), no member dates. Homepage is http + www (should become `https://theluxuryliners.com/`). **MySpace link is dead**: end it. The Flickr link points to David's personal account: keep only if the collection is LL-only (owner call). Missing links: Spotify, Deezer, Tidal, YouTube, Discogs, AllMusic, Apple Music (current form), Instagram. Missing release groups: *Sound As Ever*, *Believe*, "Shake It Up (Live at the Texas Music Cafe)", "Great Day", "New Beginning", the 1998 compilation appearances. No disambiguation comment (the collision with Carter Tanton's "Luxury Liners" 20764777-… makes one useful) | **verified-source [live 10-07]** (MB ws/2 API); round 1's "Apple link only" was wrong |
| **Discogs** | artist [4298743](https://www.discogs.com/artist/4298743); label Litterbug [1721608](https://www.discogs.com/label/1721608) | Releases: *Sound As Ever* r6768612 (+ 2026 LP r37658859, Sound Asleep ZZZ056), *Believe* r6768660, *Overbored* r14391955, *Nonetheless* r14401612; compilations *Fireworks Vol. 2*, *Nashpop*, SESAC SXSW 2001 CD r8057090, Kool Kat bonus disc r15436127. Official site and Facebook already linked | Profile (both sentences, §3.5); no 2021/2026 singles; no *Superdrag Tribute II* (2004) appearance (track unidentified, LL02); "Lafrate" spelling; *Antarctic Antics* credit unexplained (LL02 D10) | verified-source [live 10-07] (artist record); release list single-source (R01 2026-09-28) |
| **AllMusic** | mn0000759673 ("Luxury Liners"); Apple's `amgArtistId` for the band is 468639 (the older numeric AMG key) | 2001 bio (§3.1), syndicated to Apple, iHeart and Shazam; discography and rating not read (403) | Name without "The"; bio stale and omits Chad. **The root of the most-repeated text** | verified-source (via Apple/iHeart [live 10-07]) / page unread |
| **Spotify** | 3416B3EOd5itWZazwzw9Qc | live; 7 releases; **553 monthly listeners** (2026-10-07) | bio not visible to scripts; a dead duplicate *Believe* | verified-source [live 10-07] |
| **Apple Music** | 47333263 | live; 7 releases incl. the 2026 singles **[live 10-07, iTunes lookup]**: *Sound As Ever* 2000-05-01, "Believe - Single" 2001-03-01, *Overbored* 2003-05-01, *Nonetheless* 2006-10-01, "Shake It Up (Live at the Texas Music Cafe) - Single" 2021-08-27, "Great Day - Single" 2026-02-13, "New Beginning - Single" 2026-04-17 | Bio is the **AllMusic/Hage bio** (§3.1), not the "Nashville-based" blurb. Apple labels the *Believe* EP a "Single" (D12) | verified-source [live 10-07] |

| **Google Knowledge Graph** | unknown | No knowledge panel is known for the band. The "Luxury Liner" panel almost certainly belongs to the Emmylou Harris album (inference from the Wikipedia dominance in every WS result) | Wikidata + consistent `sameAs` is the path to a panel | unverified |

### 4.2 Related records that touch the band

- **David Dewese, MusicBrainz** `ab0d8004-fa6d-4011-b60d-04651b7d7a74`: member of The Foxymorons and The Luxury Liners; **no URL relationships**. GEO1 (M5) also found relationships on this record that fall under **X1**; their specifics are deliberately not recorded here. Any `sameAs` to this record points engines at that material; the decision whether to ask MusicBrainz to remove them is the owner's (pending, daviddewese.com BUILD-LOG question). theluxuryliners.com should still link David's Person node to `https://daviddewese.com/#person` rather than straight to MB.
- **Chad Edgington, Scott Carpenter, David Wilstermann:** no Wikidata items; MB member entries exist for Carpenter and Wilstermann (not read in detail). **Do not create Wikidata items for them** (private individuals; no structural need beyond the band's `has part` statement, which can use string qualifiers or be left to members with existing items). Discuss with Carly before any edit that names them on a third-party database (LL01 Q10 consent question).
- **Carter Tanton's "Luxury Liners"** (MB `20764777-ce35-47cb-b44d-5375d2d4c953`, Person, US, disambiguation "performance name for Carter Tanton"; Discogs 3169134; AllMusic mn0003161630; album *They're Flowers*, 2013; Spotify 6IkyFyVyUt99P1jjMllZ5m) is correctly separate on MB (GEO2, verified-source). Spin covered it in 2013 ("Carter Tanton – Luxury Liners – 'Caribbean Sunset' stream premiere", spinmagazine.com/2013/01/…, WS). This is the collision most likely to bleed into streaming metadata and Last.fm.

---

## 5. Name collisions and disambiguation

| Collision | What it is | Risk | Handling on the new site | Source / confidence |
|---|---|---|---|---|
| **Emmylou Harris, *Luxury Liner*** | Her 4th studio album, Warner Bros.; title track is the Gram Parsons song; No. 1 country album | **Highest.** Owns the Wikipedia result, Apple results, radio-show pages and record-shop listings for "Luxury Liner". **Release date resolved:** Wikipedia's infobox gives **1976-12-28** (US), citing the 2004 Warner reissue note "originally issued as Warner Bros #BS-2998/#BSK-3115 (12/28/76)" **[live 10-07, Wikipedia wikitext]**. Its first single dates from February 1977, and its year-end chart run was 1977, which explains why many sources say "1977". A UK release of 1977-01-14 appears in the critic's search result only (single-source) | "Not Emmylou Harris's album *Luxury Liner*". **Either omit the year or say "1976".** **daviddewese.com must make the same fix:** `site/src/lib/site.ts` line 32 (`LUXURY_LINERS_NOT`) says "1977 album". The two sites must agree | verified-source (Wikipedia wikitext) |
| **Gram Parsons, "Luxury Liner"** (song) | Written by Parsons; International Submarine Band, *Safe at Home* (1968) | The namesake: a **link**, not just a collision. powerpop.blog posted "International Submarine Band – Luxury Liner" on 2026-04-26 (WS) | Name the song and recording in the name story; the band covered it live on 2003-10-18 (LL01). **Use David's 2001 account as the bridge between the band and the Emmylou/Parsons world** (*earpollution*, Erik Hage, Aug 2001; dd research/05 line 373): the band met Western-wear designer Manuel and wore Nudie suits on stage, and met Emmylou Harris and Phil Kaufman (Parsons's road manager), who "all came to see us play". That turns the disambiguation into a story and gives engines a sourced fact that links the names *correctly*. It is David's own claim, so present it as "David has said…" unless the owner confirms it | verified-source (R05, as David's words) |
| **Carter Tanton, "Luxury Liners"** | US singer-songwriter's recording name; *They're Flowers* (2013) | High on streaming, Last.fm, Paste | "Not Carter Tanton's project Luxury Liners (*They're Flowers*, 2013)" (GEO2 corrected an earlier error that called it a song) | verified-source (MB via GEO2) |
| Luxury Liner (Finnish band) | country band on MusicBrainz | Medium (same genre neighbourhood) | name it in the disambiguation line | GEO1 (MB, 2026-10-03); WS today found nothing; single-source |
| **Luxury** (Georgia, 1990s) | noise-pop band from the same 1990s US Christian-indie orbit | Medium ("Luxury Nashville 90s") | name it | GEO1; single-source |
| **Luxury** (Iowa, 1977–82) | Des Moines power-pop band with a Wikipedia article ("Luxury (Iowa band)"; "played together from 1977 – 1982", wikitext read live 10-07) | Medium: **"Luxury" + "power pop"** queries return it; new this round | add to the disambiguation list if space allows | verified-source (Wikipedia wikitext [live 10-07]) |
| The Luxury Stars (Nashville) | Nashville band c. 2000s | Low | none needed; trivia (*Nashville Scene* "Formation of Stars") | unverified |
| Deezer "Luxury Liner" 1123705, "Luxury Liners" 4424854; Apple "The Liners" 522057446 | unrelated artist pages | Medium on store search | never link; `sameAs` only to verified IDs | R02, LL02 |
| Luxury Liners (Marina del Rey yacht charters); Hampton Luxury Liner (coach company) | businesses | High on local and Maps queries ("Luxury Liners Los Angeles") | none; `MusicGroup` schema and "band" in the title tag | WS |
| Ocean liners / cruise ships; book *Luxury Liners: Life on Board* | generic | **Very high**: the plural phrase is a common noun | Always "The Luxury Liners" + "band" in `<title>`, H1 context and meta | WS |
| **Litterbug** (UK punk band, litterbug.bandcamp.com) | shares the band's label name | Medium: "Litterbug Records" searches return the punk band | Always "Litterbug Records" in full; link Discogs label 1721608 | WS (new this round) |
| Album-title collisions: *Sound As Ever* (You Am I, Wikidata Q7564649), *Nonetheless* (Pet Shop Boys, Q124414312); singles "Great Day", "New Beginning" (generic titles) | other works | High for album/single queries | Always pair the title with "The Luxury Liners" in titles, headings and `MusicAlbum` names | R02 §b.2 |

**Recommended disambiguation sentence** (the daviddewese.com `LUXURY_LINERS_NOT`, with the Emmylou year dropped and the Iowa band added): *"Not to be confused with Emmylou Harris's album* Luxury Liner*; Luxury Liners, the recording name of singer-songwriter Carter Tanton (*They're Flowers*, 2013); the Finnish band Luxury Liner; or the bands Luxury (Georgia, 1990s) and Luxury (Iowa, 1977–82)."* If a year is wanted for Emmylou's album, use "1976" (above). Put the sentence in visible HTML on the home and about pages, in `disambiguatingDescription`, and in `llms.txt`.


---

## 6. What Google and AI answer engines probably say today

**First-hand evidence (strongest).** The bios that engines retrieve are known first-hand. Apple Music and iHeart both serve the Erik Hage AllMusic bio, read live today (§3.1). Spotify serves no bio text to crawlers. The official site has one sentence. Whatever an engine says about the band, these are its raw materials.

**Search-tool sample (weaker; may be circular).** The WebSearch tool's summariser is an LLM answering from live search results. Its answers show what retrieval surfaces, but they may only restate whichever page holds the text. They are not independent evidence of what Google AI Overviews, Perplexity or ChatGPT say. The source of the "Nashville-based" text it repeats is **unconfirmed** (§3.2).

Round 1 claimed "22 queries" but kept no query log, so that count is withdrawn. Round 2 logged its queries (2026-10-07):

| Query | Results (top) | Summary said |
|---|---|---|
| `"The Luxury Liners" "Nashville-based rock band"` | Wikipedia "Luxury Liner (album)"; Last.fm similar-artist pages (The Nobility, Zaemon, Rob Momary); Shazam 47333263; Emmylou Harris pages (Apple, bestclassicbands, americanhitnetwork) | the "Nashville-based" blurb, plus the Hage sentences ("guitar-crunchy power pop … *Sound As Ever*, in May 2000. The *Believe* EP followed in 2001") |
| `The Luxury Liners band Dewese Edgington` | Last.fm Zaemon similar page; nine Emmylou Harris pages | the "Nashville-based" blurb; **no Chad**; it "corrected" the query by treating "Dewese Edgington" as a misspelling of David Dewese |
| `theluxuryliners.com` | cruise and luxury-travel pages only | "unable to find specific information about the website" |

Round 1's summaries (same tool, unlogged queries) also produced:

- *"The Luxury Liners were named after a Gram Parsons song and were originally intended as an alt-country outlet for Foxymorons member David Dewese after he moved from Texas to Nashville."*
- Asked about "Great Day" (2026): it found nothing and asked whether the user meant a cruise.
- Asked about *Overbored* and *Sound As Ever* reviews: it assumed ocean liners.
- One answer **hallucinated** that the band had "multiple appearances in power pop communities and compilations released by Kool Kat Musik". In fact there is one Kool Kat bonus disc, credited to David (LL02 §4).

**The telling result:** searching for "Dewese Edgington" did not surface Chad at all. The tool treated his surname as noise. Nothing crawlable connects Chad to the band except Discogs's member list and the Baptist Standard profile.

**Inferred answer to "Who are The Luxury Liners?"** today: *a Nashville power-pop band, started as David Dewese's alt-country outlet, members Carpenter / Dewese / Wilstermann, debut* Sound As Ever *2000.* **Wrong or missing against owner decisions:** Chad Edgington as co-founder (F4) and forever member (P8); the founding year 1997; the 2021 and 2026 releases (F6); that the band is active; *Overbored* and *Nonetheless*; the TV placements.

**Inferred answer to "Luxury Liners band":** Emmylou Harris or Carter Tanton first, this band second or not at all.

**Why:** the only crawlable text about the band is the AllMusic/Hage bio (syndicated to Apple, iHeart and Shazam, §3.1), the "Nashville-based" blurb from an unknown source (§3.2), Bandcamp album pages, and a few 1998–2004 *Nashville Scene* pages. The official site has one sentence and does not rank. There is no Wikidata item for engines to anchor on.


**What would change it:** a crawlable, answer-shaped official site whose facts are repeated in Wikidata, MusicBrainz and the DSP bios with the same wording (§7, §8).

---

## 7. Prioritised corrections

Ordered by impact on what engines say, then by effort. "Who" = who can do it. Nothing here should be done before the owner OKs the off-site edits (the same pending question as daviddewese.com BUILD-LOG audit round 1, Q6–Q7).

| # | Where | Fix | Why | Who / effort |
|---|---|---|---|---|
| 1 | **theluxuryliners.com** (new site) | Publish the canonical facts in plain HTML: "The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together. Chad left Nashville in 2001; David carried the band on." Plus forever members (P8), releases with P6 dates, the 2026 singles, TV placements, name story, disambiguation, FAQ. Full JSON-LD (§8.2), `llms.txt`, real meta description (not "one-time"), alt text, YouTube channel link. Redirect the legacy URLs (R04 §6 item 6) | Every other fix points here; today it has one sentence | build team / large |
| 2a | **Wikidata** | Create "The Luxury Liners" with these statements:<br>• instance of: musical group (Q215380)<br>• country: USA<br>• inception: 1997<br>• location of formation: Nashville<br>• genre: power pop<br>• record label: Litterbug Records<br>• official website: https://theluxuryliners.com/<br>• **founded by (P112):** this property takes an **item**, not a string. David Dewese needs an item, created at the same time. For Chad, there are two options. (a) Use P112 = "unknown value" with the qualifier "object named as" (P1932) = "Chad Edgington". (b) Leave Chad out of P112 and name him only in the description. **Do not create an item for Chad** (private individual). Choose (a) only if Chad agrees (§10.2 Q2).<br>• IDs: P434 MusicBrainz 7af7fd54-…; P1953 Discogs 4298743; P1902 Spotify 3416B3EOd5itWZazwzw9Qc; P2850 Apple 47333263; P2722 Deezer 1518436; P4576 Tidal 5748092; P2397 YouTube UCi2Kheqfw714F4v8bwBbViA; P1728 AllMusic mn0000759673; P3192 Last.fm "The+Luxury+Liners"; P2003 Instagram theluxuryliners; P2013 Facebook theluxuryliners<br>• description: "American power-pop band co-founded in 1997 by David Dewese and Chad Edgington"<br>• alias: "Luxury Liners"<br>• references: the official site, Discogs, AllMusic, *Nashville Scene*<br>**Verify each property number on Wikidata before entry** (not re-checked here; the API was rate-limited) | No anchor entity exists; Wikidata feeds Google's Knowledge Graph and most LLM corpora | Carly's team / medium; steps already in daviddewese.com `site/docs/HANDBOOK.md` "Outside the site" |
| 2b | **AllMusic** mn0000759673 (**root fix for Apple, iHeart, Shazam**) | Submit a correction through AllMusic's corrections/feedback route (exact process unverified; AllMusic is 403 here). Ask for: (1) name "The Luxury Liners"; (2) an added sentence that the band was co-founded in 1997 by David Dewese and Chad Edgington, with Chad leaving in 2001; (3) the later releases (*Overbored* 2003, *Nonetheless* 2006, the 2021 live single, the 2026 singles); (4) the lineup Carpenter / Wilstermann. Even a single updated sentence flows to Apple (`amgArtistId` 468639), iHeart and Shazam | The Hage bio is the most-repeated text about the band, live today on Apple and iHeart (§3.1). One fix here corrects three platforms | Carly's team / small (outcome and timing uncertain; AllMusic controls the text) |
| 3 | **MusicBrainz** 7af7fd54-… (state read live 10-07, §4.1) | • **Change** the official homepage `http://www.theluxuryliners.com/` → `https://theluxuryliners.com/`<br>• **End** the MySpace relation (or remove it; follow MB style guidance for dead links)<br>• **Decide** on the Flickr link: it points to David's personal Flickr collection. Keep it only if the collection is LL-only, and otherwise move it to David's own record (owner call)<br>• **Update** the iTunes link to the current Apple Music form<br>• **Add** begin date 1997 and area Nashville (or US)<br>• **Add** Chad Edgington as a member, 1997–2001 ("founder" attribute if used), and dates for the other members (Scott from 1998, Larry from 2000)<br>• **Add** URL relations: Spotify, Deezer, Tidal, YouTube, Discogs, AllMusic, Instagram, Wikidata (once created)<br>• **Add** release groups: *Sound As Ever*, *Believe*, "Shake It Up (Live at the Texas Music Cafe)", "Great Day", "New Beginning" (ISRCs/UPCs from LL02); give first-release dates to *Overbored* and *Nonetheless*<br>• **Add** the disambiguation "Nashville power-pop band, 1997–" | MB is the graph that Spotify-independent engines and ListenBrainz use. Today it erases Chad, shows two of seven releases, and links a dead platform | Carly's team / medium. Coordinate with the X1 decision on David's MB record (§4.2) |
| 4 | **Spotify for Artists / Apple Music for Artists** | Claim both. Write a Spotify bio from the canonical facts (Chad as co-founder; 2026 singles). Set images (credit rules P17). Apple's bio is AllMusic-syndicated (§3.1), so fix it through #2b; an Apple for Artists bio may or may not override it. Ask the distributor to: remove the dead duplicate *Believe* on Spotify; correct Tidal's dates ("New Beginning" 04-10 → 04-17; *Overbored* 01-01 → 05-01); and consider whether Apple's "Believe - Single" label should be "EP" (D12) | Spotify shows no bio to crawlers today; 553 monthly listeners is the baseline | David / small |
| 5 | **Discogs** 4298743 | Replace **both** profile sentences ("Indie rock band in Nashville, Tennessee. Originally formed in 1997 in Texas.") with: "American power-pop band co-founded in 1997 by David Dewese and Chad Edgington, college friends from Texas who took the band to Nashville. Chad left in 2001; Dewese continued with Scott Carpenter and David 'Larry' Wilstermann." Add the 2021 and 2026 digital releases and, once identified, the *Superdrag Tribute II* track. Fix "Lafrate" → "LaFrate" (band roster spelling). (The official site and Facebook are **already linked**; nothing to add there) | Discogs is the most complete graph, and it is scraped by Wikidata and LLMs | Carly's team / small |
| 6 | **Last.fm** | Read the wiki by hand. If it carries the "Nashville-based" blurb (§3.2), rewrite it with the canonical facts and sources. Check the artist image. (The "Constellation Invitation" track page is a real *Overbored* track; leave it alone) | User-editable, widely scraped; the probable home of the "trio only, Nashville-based" text | Carly's team / small |
| 7 | **iHeart / Shazam** | No separate action: both show the AllMusic bio, which #2b fixes. Re-check both about 60 days after the AllMusic correction | Confirms the syndication fix took | Carly's team / trivial |
| 8 | **YouTube** @theluxuryliners | Upload the 2026 singles (or official audio/visualisers) and the "Shake It Up" live clip if rights allow. Add a channel description with the official site. Feature the One Tree Hill / FOX clips only if rights allow | The channel's newest video is from 2006: a staleness signal | David / small |
| 9 | **Instagram / Facebook** | Bio link to https://theluxuryliners.com/; same one-line description | Consistency (engines compare profile bios) | David / trivial |
| 10 | **daviddewese.com** | `LUXURY_LINERS_SAME_AS`: keep https://theluxuryliners.com/ as the group's `url`, not in `sameAs` (GEO2 nit 9); use the slugged Apple URL form; add the Wikidata QID when created. `LUXURY_LINERS_NOT` (`site.ts` line 32): drop "1977" (Emmylou's album was released 1976-12-28, §5) | The two sites must point at the same entity and say the same thing | build team / trivial |
| 11 | Press recovery | Find and archive the 1998 *Billboard* item, the 2000 press page and the *Nashville Scene*/*Rage* originals (§9). Prefer writers other than Erik Hage, who already accounts for three items. Host scans on the press page with citations | Independent sources from different writers are what make Wikidata (and a future Wikipedia article) stick | Carly's team / medium |


---

## 8. The `sameAs` graph and structured data the new site should publish

### 8.1 Rules

- **One entity, one `@id`:** `https://theluxuryliners.com/#band` for the `MusicGroup`. daviddewese.com's band page refers to the band by this `@id` once the new site is live (and keeps its own page as `subjectOf`).
- **`sameAs` holds only profiles that are (a) this band, (b) verified, and (c) stable.** Never the official site itself (that is `url`), never a single video, never a release page, never a collision (§5), never MySpace / NoiseTrade / isawtheocean.com (P5) / Big Cartel.
- **Bandcamp is David's account,** not the band's: link Bandcamp album URLs from each `MusicAlbum` (`offers` / `url`), not from the band's `sameAs`.
- **People:** Person nodes for the four forever members with **name and band role only** (`OrganizationRole` with `roleName` and `startDate`/`endDate`). No `sameAs`, no images without consent, no personal social links for Chad, Scott or Larry. David's node points to `https://daviddewese.com/#person`.
- **Founders:** `founder` = David Dewese and Chad Edgington (F4). `foundingDate` 1997. `foundingLocation` **Texas** (owner decision LL-5, 2026-10-07; supersedes F4's "1997 (Nashville)" for this field); see Discrepancy D2. Note that daviddewese.com's JSON-LD deliberately **leaves `foundingLocation` out** until the Texas-college vs Nashville wording is settled with David (dd research/03 line 551). The two sites must match: either both publish Nashville or both omit it (open question §10.2 Q10).
- Use the same canonical description string everywhere (site meta, JSON-LD `description`, Wikidata description, DSP bios, Discogs profile, Last.fm wiki).

### 8.2 Recommended `sameAs` list

| # | URL | Status | Include? |
|---|---|---|---|
| 1 | https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc | verified (oEmbed, GEO1; page [live 10-07]) | **yes** |
| 2 | https://music.apple.com/us/artist/the-luxury-liners/47333263 | verified (iTunes lookup and page [live 10-07]) | **yes** (slugged form, as the official site links it) |
| 3 | https://www.youtube.com/channel/UCi2Kheqfw714F4v8bwBbViA | verified (RSS) | **yes** |
| 4 | https://www.instagram.com/theluxuryliners/ | linked from the official site; contents unread | **yes** (owner-controlled) |
| 5 | https://www.facebook.com/theluxuryliners/ | linked from the official site; contents unread | **yes** (owner-controlled) |
| 6 | https://musicbrainz.org/artist/7af7fd54-1d1b-4353-ab60-4b61bceed337 | verified (MB API [live 10-07]) | **yes** (fix it first, §7 #3: https homepage, end MySpace, add Chad) |
| 7 | https://www.discogs.com/artist/4298743-The-Luxury-Liners | verified (Discogs API [live 10-07]) | **yes** |
| 8 | https://www.deezer.com/artist/1518436 | verified (Deezer API [live 10-07]) | **yes** |
| 9 | https://tidal.com/browse/artist/5748092 | verified (R01) | **yes** |
| 10 | https://www.allmusic.com/artist/luxury-liners-mn0000759673 | ID from search and the daviddewese research; its bio is confirmed via Apple/iHeart syndication, but the page itself returns 403 | **yes, after a human opens it** |

| 11 | https://www.last.fm/music/The+Luxury+Liners | exists (WS) | **yes, after the wiki is fixed** (optional) |
| 12 | https://www.wikidata.org/wiki/Q… | to be created | **yes, when created** (highest-value entry) |
| 13 | https://www.shazam.com/artist/-/47333263 | exists (WS; 403 to scripts); same ID and AllMusic bio as Apple | optional; low value |
| 14 | https://www.iheart.com/artist/the-luxury-liners-384637/ | verified [live 10-07]; carries the AllMusic/Hage bio and the 2026 singles | optional, low value (a syndicated copy; revisit after the AllMusic fix) |
| 15 | https://soundcloud.com/theluxuryliners | not opened | **no, until checked** |
| 16 | Amazon Music artist | ID unknown | no, until resolved |

### 8.3 Sketch (for the architecture track; not final)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicGroup",
      "@id": "https://theluxuryliners.com/#band",
      "name": "The Luxury Liners",
      "alternateName": "Luxury Liners",
      "url": "https://theluxuryliners.com/",
      "description": "The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together.",
      "disambiguatingDescription": "Not Emmylou Harris's album Luxury Liner, and not Carter Tanton's recording name Luxury Liners.",
      "foundingDate": "1997",
      "foundingLocation": { "@type": "Place", "name": "Texas" },
      "founder": [ { "@id": "https://daviddewese.com/#person" }, { "@id": "https://theluxuryliners.com/#chad-edgington" } ],
      "genre": ["Power pop", "Pop rock"],
      "member": [
        { "@type": "OrganizationRole", "member": { "@id": "https://daviddewese.com/#person" }, "startDate": "1997", "roleName": "vocals, guitar, bass" },
        { "@type": "OrganizationRole", "member": { "@id": "https://theluxuryliners.com/#chad-edgington" }, "startDate": "1997", "endDate": "2001", "roleName": "guitar, bass, vocals" },
        { "@type": "OrganizationRole", "member": { "@id": "https://theluxuryliners.com/#scott-carpenter" }, "startDate": "1998", "roleName": "drums" },
        { "@type": "OrganizationRole", "member": { "@id": "https://theluxuryliners.com/#david-wilstermann" }, "startDate": "2000", "roleName": "bass" }
      ],
      "sameAs": [ "…rows 1–9 of §8.2, then 10–12 when cleared…" ]
    }
  ]
}
```

Person nodes for Chad, Scott and Larry: `{"@type":"Person","@id":…,"name":…}` only. `member` start years follow the 2005 roster (Scott Aug 1998, Larry Dec 2000; LL01 §3); the "forever members" framing (P8) means no `endDate` for Scott and Larry. Chad's `endDate` 2001 follows F4. **Validate with the Schema.org validator and Google's Rich Results Test before launch.**

### 8.4 `llms.txt` and answer-shaped content

- `llms.txt`: the canonical description, the four forever members, the release list with P6 dates, the TV placements, the disambiguation sentence, and links to Wikidata/MB/Discogs.
- Question-shaped headings or an FAQ (same set as daviddewese.com `LUXURY_LINERS_ANSWERS`): "Who founded The Luxury Liners?", "Where does the name come from?", "Is this Emmylou Harris's *Luxury Liner*?", "Is this the Luxury Liners who released *They're Flowers*?", "Who is in the band?", "Are they still active?", plus "Has their music been on TV?" and "What label are they on?".
- Visible dates on the 2026 releases (freshness signal; GEO1).
- A press page (`/press/`) with the §2.2 quotes, each with publication, date and writer, linking originals where online; `Review`/`CreativeWork` markup only where the review text is actually shown and cited.

---

## 9. Needs a browser (cannot be read by script here; open by hand)

Round 2 removed the rows that `curl` has now answered: the MusicBrainz state, the Discogs profile, the Apple and iHeart bios, Spotify monthly listeners, and the Emmylou Harris year.

| Priority | URL | What to get |
|---|---|---|
| 1 | https://web.archive.org/web/20001022140356/http://www.theluxuryliners.com:80/press.html | **the 2000 press page** (never read): the *Billboard* item, Monsters of Pop, *Sound As Ever* reviews |
| 1 | https://web.archive.org/web/20051225072849/http://www.theluxuryliners.com/press.html | re-read the 2005 page for the writers of the Rage 9-01/4-02/7-02 blurbs and the full CCM, Impact Press, Aiding & Abetting, Southeast Performer and Nashville Scene items (only titles are recorded) |
| 1 | https://www.allmusic.com/artist/luxury-liners-mn0000759673 (403 to scripts) | confirm the current bio matches the Apple/iHeart copy; discography, ratings, member list; find the corrections route |
| 1 | https://www.last.fm/music/The+Luxury+Liners/+wiki ("Client Challenge" to scripts) | **is the "Nashville-based" blurb here?** (§3.2); listener and scrobble counts |
| 1 | https://www.wikidata.org/w/index.php?search=Luxury+Liners | re-confirm no item just before creating one (API rate-limited after one call) |
| 2 | https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc (logged in) | does the "About" tab show a bio, and which one? |
| 2 | https://www.shazam.com/artist/-/47333263 (403 to scripts) | confirm it shows the Hage bio |
| 2 | Nashville Scene "Top of the Pops" (both URLs in §2.2), "Block-Rockin'", and the others in LL01 §11 | dates, writers and exact LL wording |
| 2 | *Billboard* 1998 issues (worldradiohistory.com; Google Books) | the "Hot Prospects" / buzz-bin item |
| 3 | Baptist Standard profile of Chad (URL in the internal note below) | publication date and band facts only (privacy rule) |
| 3 | https://web.archive.org/web/20010711195105/http://theluxuryliners.com:80/links.html | 2001 links page: fan sites, press and directories that may still exist |
| 3 | https://web.archive.org/web/20030414032936/http://theluxuryliners.com/downloads/luxury_liners_onesheet.pdf | the *Overbored* one-sheet (press quotes as of 2003) |
| 3 | https://www.tunefind.com/show/one-tree-hill (season 1) | third-party confirmation of "Dreaming" in S1 E15 |
| 3 | https://soundcloud.com/theluxuryliners ; Instagram and Facebook pages | do they exist / what do their bios say; 2026 announcements and credits |
| 3 | http://www.flickr.com/photos/dewese/collections/72157600177972175/ | is this collection LL-only? (decides the MusicBrainz Flickr link, §7 #3) |
| 3 | Google search "The Luxury Liners" and "Luxury Liners band" (logged out, US) | is there a knowledge panel; what the AI Overview says (record a screenshot as a baseline) |

> **Internal note: not for publication, not for the site, not for any public file.** The Baptist Standard profile of Chad Edgington is at (URL held outside the repo; RD5). Its headline and slug state Chad's later life, so this file cites the item only as "*Baptist Standard* profile of Chad Edgington". Use it for band facts only, and only with Chad's OK (§10.2 Q8).


---

## 10. Discrepancies and open questions

### 10.1 Discrepancies (shown as contested)

| # | Topic | Version A | Version B | Handling |
|---|---|---|---|---|
| D1 | Who founded the band | **David and Chad co-founded it, 1997** (F4; confirmed-owner) | AllMusic/Hage bio (live on Apple, iHeart, Shazam): "an alt-country outlet for … David Dewese" (Chad absent); the "Nashville-based" blurb (source unknown): trio only; Baptist Standard (summary): Chad "formed" the band; 2005 band history: Chad's talent-show band, David joined May 1997 | Site copy follows F4. Off-site fixes §7 #2a–#6 |
| D2 | Where it formed | Nashville (F4) | Texas (Discogs "formed in 1997 in Texas"; 2005 band history) | "co-founded in 1997 … took it to Nashville". JSON-LD `foundingLocation` Nashville per F4; flag for Carly if Wikidata editors challenge it |
| D3 | Members | P8: four forever members | MB (live): Carpenter, Dewese, Wilstermann; the "Nashville-based" blurb: the same three; Discogs (live): five incl. Chad and "Lafrate" | P8 on site; add Chad on MB |
| D4 | Base | "Nashville-based" (blurb) | David in Dallas (F3); members in several states (David, 2012–24) | Do not say "Nashville-based" in the present tense; "formed in Nashville" is fine |
| D5 | Active or not | Official meta (2024–): "One-time Nashville rock band" | 2021 live single; 2026 singles (F6) | Active. Replace the meta |
| D6 | "Since 1998" | the "Nashville-based" blurb (source unknown) | founded 1997; first recordings 1998; first album 2000 | Use 1997 (founding) and 2000 (first album) |
| D7 | Band name form | "The Luxury Liners" (Spotify, Apple, Discogs, MB, official site) | "Luxury Liners" (AllMusic; *Nashville Rage* and Hage reviews) | Canonical "The Luxury Liners"; "Luxury Liners" as `alternateName` |
| D8 | Emmylou Harris album year | 1977 (daviddewese.com `LUXURY_LINERS_NOT`; first single Feb 1977; 1977 year-end chart) | **1976-12-28** (Wikipedia infobox, citing the 2004 Warner reissue note; read live 10-07) | **Resolved: 1976.** Omit the year or say 1976 on both sites; fix daviddewese.com `site.ts` line 32 |
| D9 | *Billboard* | "Hot Prospects", 1998 (Baptist Standard) | "buzz-bin article" (2000 band bio) | Do not publish a title until the item is found |
| D10 | Big Cartel store | live store page for *Sound As Ever* (WS, LL02) | R02: bigcartel is a dead link to purge | Check by hand; do not link until checked |
| D11 | Tidal dates | "New Beginning" 2026-04-10; *Overbored* 2003-01-01 | Spotify 2026-04-17; 2003-05-01 (P6) | P6 on site; ask distributor to fix Tidal |
| D12 | *Believe* release type | EP (band, Discogs, LL02; P27 calls it "the *Believe* EP") | Apple: "Believe - Single" (iTunes lookup, live 10-07) | Call it the *Believe* EP on the site; optional distributor fix (§7 #4) |
| D13 | Where the "Nashville-based" blurb lives | Apple Music and iHeart (LL01/LL02 and round 1 of this file, from search snippets) | Not on Apple or iHeart (both live 10-07 show the Hage bio); probably the Last.fm wiki (unverified) | Attribution to Apple/iHeart withdrawn; check Last.fm by hand (§9). LL01 D10 and LL02 should be updated to match |
| D14 | Writer of the *earpollution* interview | "unknown" (round 1 of this file) | Erik Hage (dd research/05 line 92) | Erik Hage |

### 10.2 Open questions for Carly / David

1. **Off-site edits:** may Carly's team (or we, in a handover doc) create the Wikidata item and edit MusicBrainz, Discogs, Last.fm and AllMusic for the band? (Same pending go-ahead as daviddewese.com audit round 1, Q6–Q7.)
2. **Chad's name on third-party databases:** is Chad happy to be listed as co-founder (1997–2001) on Wikidata/MusicBrainz/Discogs, by name only? Same question for Scott and Larry (LL01 Q10).
3. **Spotify for Artists / Apple Music for Artists:** who holds the logins for The Luxury Liners (the distributor of the 2026 singles)? Is there a current bio on Spotify?
4. **Press clippings:** does David have the 1998 *Billboard* item, the *Nashville Rage* and *Nashville Scene* reviews, *The Tennessean* style profile (Dec 2001) or the CCM review as paper or scans? May they be shown on the site?
5. **The 2026 singles:** was there any press, radio or playlist coverage of "Great Day" or "New Beginning"? Any blog premieres?
6. **Social:** are Instagram @theluxuryliners and Facebook /theluxuryliners active, and who posts? Does a SoundCloud account exist and should it be linked?
7. **Canonical one-liner:** approve the description in §8.3 for use on the site, DSPs, Wikidata and Discogs (it is the daviddewese.com `LUXURY_LINERS_LINE`, already owner-consistent with F4).
8. **The Baptist Standard profile:** may the site cite it as a source for band facts (it is a public article about Chad), or should it stay internal only?
9. **TV placements:** may the site embed or link the YouTube clips of the *One Tree Hill* and FOX Sports uses (R04: KAq9dUlt3Rw, mju1nb3BOzU), or just name them?
10. **`foundingLocation`:** should both sites publish "Nashville" in JSON-LD (F4), or both leave it out until the Texas-college wording is settled (as daviddewese.com does now)?
11. **Superdrag Tribute II (2004):** which Luxury Liners song is on it?
12. **Flickr on MusicBrainz:** is David's Flickr collection 72157600177972175 Luxury Liners-only (keep the MB link) or mixed (move it to David's record)?
13. **Phil Kaufman, Manuel, Nudie suits, Emmylou at a show:** may the site retell David's 2001 account (§5) as fact, or only as "David has said…"?

---

## Sources

**On disk (read 2026-10-07):**
- `/home/user/daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md` (F3, F4, F6, L1, P5, P6, P8, P17, P21–P23, P27, X1)
- `/home/user/daviddewese.com/daviddewese-com/research/02-artist-story-and-brand.md` §b.1–§b.4 (web presence, KG IDs, errors, fixes)
- `/home/user/daviddewese.com/daviddewese-com/research/04-live-sites-and-archive.md` §3 (live site), §4.2 (placements, 2012–24 bio), §5 (Wayback eras, press page, roster, journal), §6 item 6
- `/home/user/daviddewese.com/daviddewese-com/research/05-foxymorons-history.md` §4.3, §7 (*earpollution* by Erik Hage, line 92; the Emmylou/Kaufman/Nudie account, line 373; *Superdrag Tribute II*, line 324; *Nashville Scene* 2001)
- `/home/user/daviddewese.com/daviddewese-com/research/03-standards-and-stack.md` lines 545–552 (Apple bio [fetched], MB and Discogs reads; `foundingLocation` left out)
- `/home/user/daviddewese.com/daviddewese-com/research/01-discography.md` (links, ASINs)
- `/home/user/daviddewese.com/daviddewese-com/research/legacy/cdx-theluxuryliners.com.json` (press.html 2000-10-22, links.html 2001-07-11, onesheet PDF 2003-04-14, bio pages)
- `/home/user/daviddewese.com/daviddewese-com/critiques/audit-geo-round1.md`, `audit-geo-round2.md` (live MB/Wikidata/Spotify/YouTube reads, collisions, M4, M5)
- `/home/user/daviddewese.com/daviddewese-com/site/src/lib/site.ts`, `jsonld.ts`, `answers.ts`; `site/docs/HANDBOOK.md` ("Outside the site"); `site/BUILD-LOG.md`
- `/home/user/theluxuryliners.com/research/01-band-history-and-people.md`, `02-discography.md`
- `/home/user/foxymorons.com/research/04-people-and-scene.md`, `05-digital-footprint-seo-geo.md` (structure)

**Web (WebSearch, 2026-10-07; result pages surfaced, not opened unless stated):**
- Shazam artist bio: https://www.shazam.com/artist/-/47333263
- Last.fm: https://www.last.fm/music/The+Luxury+Liners ; https://www.last.fm/music/The+Luxury+Liners/Sound+As+Ever ; https://last.fm/zh/music/The+Luxury+Liners/_/Constellation+Invitation ; similar-artist pages https://last.fm/music/The+Nobility/+similar , https://last.fm/music/Zaemon/+similar , https://last.fm/music/Rob+Momary/+similar
- Bandcamp: https://daviddewese.bandcamp.com/album/overbored , https://daviddewese.bandcamp.com/album/believe-ep
- *Nashville Scene*: https://www.nashvillescene.com/arts_culture/formation-of-stars/article_2354206e-23bd-5b0a-aaff-3a21f788939c.html ; https://nashvillescene.com/arts-culture/article/13002339/top-of-the-pops
- Baptist Standard profile of Chad Edgington (URL in the §9 internal note only)
- Collisions: https://en.wikipedia.org/wiki/Luxury_Liner_(album) ; https://en.wikipedia.org/wiki/Luxury_(Iowa_band) ; https://www.spinmagazine.com/2013/01/carter-tanton-luxury-liners-caribbean-sunset-stream-premiere/ ; https://www.pastemagazine.com/artist/luxury-liners ; https://litterbug.bandcamp.com ; https://www.poyst.com/business/luxury-liners-marina-del-rey-yacht-rentals-la-yacht-charter ; https://magpie.travel/companies/hampton-luxury-liner ; https://highwayqueens.com/2026/04/12/emmylou-harriss-discography-luxury-liner-1976/ ; https://music.apple.com/us/album/5560295
- Namesake: https://powerpop.blog/2026/04/26/international-submarine-band-luxury-liner/
- Tunefind One Tree Hill pages (no LL listing surfaced): https://www.tunefind.com/show/one-tree-hill/season-3/1703
- Kool Kat Musik context: https://www.goldminemag.com/blogs/power-pop-plus-kool-kat-musik-label-spotlight/

**Live reads with `curl` (2026-10-07; marked [live 10-07] above):**
- MusicBrainz: `https://musicbrainz.org/ws/2/artist/7af7fd54-1d1b-4353-ab60-4b61bceed337?inc=url-rels+artist-rels+release-groups+aliases&fmt=json`
- Discogs: `https://api.discogs.com/artists/4298743`
- iTunes lookup: `https://itunes.apple.com/lookup?id=47333263&entity=album` (`amgArtistId` 468639; seven collections with dates)
- Apple Music: https://music.apple.com/us/artist/the-luxury-liners/47333263 (JSON-LD `description` = Hage bio)
- iHeart: https://www.iheart.com/artist/the-luxury-liners-384637/ (Hage bio; meta "Great Day, New Beginning")
- Spotify: https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc (meta "Artist · 553 monthly listeners.")
- Deezer: `https://api.deezer.com/artist/1518436` (6 albums, 48 fans)
- Wikidata: `wbsearchentities` "Luxury Liners" → no results (then rate-limited)
- Wikipedia: raw wikitext of "Luxury Liner (album)" and "Luxury (Iowa band)"; search API `"Luxury Liners" Dewese` → 0 hits
- Not readable by script: allmusic.com (403), shazam.com (403), last.fm ("Client Challenge")

**WebFetch:** refused (`EGRESS_BLOCKED`) for every host tried in both rounds. Round 1 wrongly read this as "host blocked"; see the web-access table at the top.

---

## Revision log

**Round 2 (2026-10-07), responding to `critiques/footprint-round1.md` (6/10):**

- **B1 fixed.** Withdrew the claim that "Constellation Invitation" is a Last.fm mis-merge. It is *Overbored* track 10 (ISRC USEC40500240, LL02 line 154). §3.4 now treats the track page as a positive signal. The "report it" step (old §7 #7) and the §9 row are gone.
- **B2 fixed.** Re-read Apple Music and iHeart live. Both carry the **Erik Hage AllMusic bio**, signed "~ Erik Hage", not the "Nashville-based" blurb. The iTunes `amgArtistId` 468639 verifies the AllMusic syndication.
  - §1, §3.1, §3.2, §3.5, §4.1, §6, §7, §8.2 and §10 are rewritten to match.
  - The "Nashville-based" blurb is now **source unknown** (probably the Last.fm wiki; new D13).
  - AllMusic moves up to §7 #2b, as the single root fix for Apple, iHeart and Shazam.
  - The "Apple bio may not be editable" hedge is replaced by a plain statement that the bio is AllMusic-syndicated.
- **B3 fixed.** Re-read MusicBrainz live: five URL relations (http homepage, Facebook, dead MySpace, David's Flickr collection, iTunes), three members, two release groups, no dates.
  - §4.1 and §7 #3 now ask to: switch the homepage to https; end the MySpace link; decide on the Flickr link; update the Apple link; add Chad, dates and the missing releases.
- **N1.** The Baptist Standard headline and slug are removed from §2.2, §9 and the Sources list. The URL survives only in a marked internal note in §9.
- **N2.** Erik Hage is now named as the *earpollution* writer (D14). A note says he wrote three of the press items, and the Wikipedia/Wikidata notability reasoning is adjusted.
- **N3.** The Discogs profile is quoted in full and both sentences are flagged. The redundant "add official site" step is removed (Discogs already links the site and Facebook).
- **N4.** The web-access note is corrected: a host-by-host `curl` table replaces the "blocked" claim. Spotify's 553 monthly listeners are recorded as a baseline.
- **N5.** The Emmylou Harris year is resolved as 1976-12-28 (Wikipedia wikitext, read live). The recommendation is to omit the year or say 1976, and to fix daviddewese.com `site.ts` line 32 to match (§5, §7 #10, D8).
- **N6.** Added David's 2001 account of meeting Manuel, Emmylou Harris and Phil Kaufman, and wearing Nudie suits, to the namesake row (§5). Added the *Superdrag Tribute II* appearance (§2.3, §4.1, Q11).
- **N7.** Wikidata P112 now has explicit options: "unknown value" with the P1932 "object named as" qualifier, or omit Chad. No item for Chad.
- **N8.** §6 now separates first-hand evidence (Apple and iHeart) from the search-tool sample, and flags that the sample may be circular.
- **N9.** The "22 queries" claim is withdrawn. Round 2's queries are logged in §6.
- **Also:**
  - Apple's seven releases and dates were verified live against P6; there are no conflicts.
  - Apple labels *Believe* a "Single" (new D12).
  - Deezer: 6 albums and 48 fans, read live.
  - Wikidata (no item) and Wikipedia (0 hits) were re-confirmed live.
  - A `foundingLocation` consistency note with daviddewese.com was added (§8.1, Q10).
  - New open questions Q10–Q13.
