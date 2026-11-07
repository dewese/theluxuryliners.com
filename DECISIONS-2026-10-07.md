# Owner decisions: 2026-10-07

Carly's answers to the first Tier 1 questions in `QUESTIONS-FOR-CARLY.md`. **Authoritative**, the same way `daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md` is: where any file in this repository disagrees with a row below, the row wins. Codes start with `LL-` so they never collide with the daviddewese.com codes (F4, P8 and so on, which still apply here).

| # | Question | Decision |
|---|---|---|
| LL-1 | A1. Launch strategy | **Yes: launch the authoritative core first**, then add depth in layers (plan §9). |
| LL-2 | A3. Timing | **Sooner than March 2027.** The six-month plan only queued this site behind daviddewese.com's launch; the build itself is about six weeks because it reuses daviddewese.com's code. New proposed target: **launch Friday 2026-11-20**, with gates, not dates, deciding (plan §9). |
| LL-3 | A11. Master release data | **Yes: this repository is the master for The Luxury Liners' releases.** daviddewese.com copies the band's releases from `data/releases.json` here, and a check on both sites fails if they differ. |
| LL-4 | A7. Founding story and place | Carly, 2026-10-07: Chad and David corresponded by email in the winter and spring of 1997, while Chad was finishing college and David was living in **a Texas town** (named in the git-ignored `data/private/decisions-private.md`; never named in the public repository or on the site, LL-7). They came up with the band name over **spring break 1997**, when they met up at Chad's parents' house to record a ton of songs together on a 4-track. They **moved to Nashville in May 1997**, after Chad's graduation. |
| LL-5 | A7b. Founding place for search data | **Texas.** Chad's parents' house, where the name was chosen over spring break 1997, was in Texas. The search data on both sites says the band was **founded in Texas in 1997** (`foundingLocation`: Texas; the town is never named), and the text says Nashville was the band's home from May 1997. |
| LL-6 | A8. The one-line description | **Approved without the sentence about Chad leaving.** The canonical one-liner is: "The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together. The name comes from the Gram Parsons song 'Luxury Liner'." Use it on the site and in the Spotify bio, Wikidata, Discogs and Last.fm. Chad's 2001 departure stays in the Story and the Facts page, not in the one-liner. |

## What LL-4 changes

- **The story:** the band was conceived in Texas in the spring of 1997 (email, then the spring-break 4-track sessions, where the name was chosen) and became a working band in Nashville from May 1997. It refines F4's "1997 (Nashville)": Nashville is where the band was based and played, but not where the idea or the name began.
- **The talent-show story** on the band's 2005 site (Chad's college talent-show band "named The Luxury Liners", which "did indeed win the contest") does not match LL-4's account of how the name was chosen. It stays out of the Story; if it is used at all, it goes in the Vault only as a dated quotation from the 2005 site (question B1 is still open).
- **Privacy:** "Chad's parents' house" is never located on the site. The site says "over spring break 1997" without naming a place.
- **Structured data:** settled by LL-5: `foundingDate` 1997, `foundingLocation` Texas, on both sites.

## Round 2: 2026-11-06

| # | Question | Decision |
|---|---|---|
| LL-7 | C1. Chad, Scott and Larry on the site | **Names, band roles, years and band-era photos go on the site.** No quotes from them unless they offer one. **Nothing about their lives outside the band, ever.** |
| LL-8 | E1. Fixing other websites | **Yes**, and ideally the project team does all of it (Wikidata item, AllMusic correction, MusicBrainz, Discogs, Last.fm), after launch, in the band's name, with the LL-6 one-liner. Where an edit needs a login, the team prepares it and the account holder submits it. |
| LL-9 | B2. Who is in the band now | **The four forever members are the band today:** David Dewese, Chad Edgington, Scott Carpenter and David "Larry" Wilstermann. **All four play on "Great Day" and "New Beginning" (2026).** This reverses the plan's earlier rule that the site never says all four play together today; Chad left Nashville in March 2001 (LL-15) and is in the band again now. |
| LL-10 | B2. The live "Shake It Up" (2021 single) | Recorded live at the **Texas Music Café in Waco, Texas**, with **Chad on guitar, David on bass and Scott on drums**. (Carly wrote "The Music Music Cafe"; the release and the 2023 compilation name the Texas Music Café, so that name is used.) The line-up places the recording in the Chad-and-Scott years (about 1998–2001); the exact date is still open. |
| LL-11 | A5. Where the site is built | **In this repository** (dewese/theluxuryliners.com), reusing daviddewese.com's components, checks, editor and handbook. |
| LL-12 | A6. The old redirect pack | **Not used.** The new site redirects old links to its own pages. |
| LL-13 | B1 and B3. Talent show; "Great Day" demo | **The college talent-show story is left out entirely** (not in the Story, not in the Vault). **The 2026 "Great Day" single is the same recording as the demo on the 2008 bonus disc; the site does not mention it.** |
| LL-14 | B4. Songwriting | *Nonetheless*: **David**. "Great Day" and "New Beginning": **Chad and David**. "The Duke Of Gloucester": **David** (possibly shared with Jerry James; not confirmed, so the site credits David until Jerry's share is confirmed). The Discogs credits for *Sound As Ever* and *Overbored* stand otherwise. |
| LL-15 | B12. When Chad left | **March 2001.** The site says "March 2001" (David's Flickr photo "Chad's Last Show – March 2001"); the 2005 site's "April 2001" is corrected. |
| LL-16 | B5. SXSW 2001 | **The band played the SESAC Showcase at SXSW 2001.** |

## Round 3: 2026-11-06

| # | Question | Decision |
|---|---|---|
| LL-17 | When the four came back together | Chad left in 2001. The band slowly stopped touring and releasing music in the late 2000s, and David left Nashville in 2009, but **the four never said the band was over**. Living in three different states, **they reconnected during COVID and started talking about music again**, which led to the 2026 singles. Site wording: "The band never broke up. The four forever members reconnected during the pandemic and started making music again." Carly's phrase "dads with careers" is not used on the site (LL-7: nothing about their lives outside the band). |
| LL-18 | Live "Shake It Up" date | **Corrected by Carly, 2026-11-06: recorded at the Texas Music Café in Waco in autumn 1998** (not 2001, as first recalled). That fits the line-up: Chad on guitar, David on bass, Scott on drums (Scott joined in August 1998). The site says "recorded live in Waco, Texas, in autumn 1998". |
| LL-19 | Where the band is based | **Nashville** is the band's home town: the only city all four lived in together while pursuing the band. Members now live in Tennessee, Michigan and Texas. The site may say "now spread across Tennessee, Michigan and Texas", but never says which member lives where (LL-7). |
| LL-20 | Nudie suits, Manuel, Emmylou Harris | **Told as fact.** Manuel suited the band for its **first full-band concert, at 12th & Porter in Nashville, July or August 1998, opening for Austin Hanks.** The band met **Emmylou Harris and Phil Kaufman** when it played **Billy Block's Western Beat Roots Revival at Zanies in Nashville, probably autumn 1997 or winter 1998.** |
| LL-21 | "Sound as ever" | **Yes**: the first album is named after Gram Parsons's sign-off "Sound as ever". The Story can say so. |
| LL-22 | *Billboard*, 1998 | **It happened**; the clipping exists and is to be found. The site says the band was **featured in *Billboard* in 1998**; the item's title and issue are added when the clipping turns up. |
| LL-23 | Cover art | *Overbored*: **David Dewese**. *Believe* EP: **Mark Montgomery**. "Great Day": **David**. "New Beginning": **David**. "Shake It Up (Live)": **David, from a Mark Montgomery photo**. **Jim Horan restored the *Sound As Ever* art for the 2026 vinyl**; he is not the original artist (the original design credit stays Mark Montgomery). |
| LL-24 | Early and guest players | The People page lists, by name, role and years only: **Jeff LaFrate** (drums, 1997–98), **Mark W. Winchester** (bass, 1997–98), **Kyle Edgington** (drums, summer 1998), **Scott Jeffries** (tambourine, one show, 1997), **Gary Ishee** (several shows, 2004–05; also guitar on *Nonetheless*), **Doli Stepniewski** (the *Nonetheless* CD release show, 2006), **Grant Johnson** and **Jeremy Stephens** (shows in 2007). |
| LL-25 | The band journal (2001–04) | **Our team does a privacy pass first, then David approves each month**; months go live in the Vault as they clear. |
| LL-26 | A recent photo | **Launch without one**; the home page leads with the 2026 singles. |
| LL-27 | Free MP3s | **The site gives away no MP3s at all**: no downloads of covers or of the band's own songs. Music is played through streaming links and embeds (Spotify, Apple Music, Bandcamp, YouTube). This replaces the plan's Vault downloads (daviddewese.com's P5 does not carry over here). The Vault lists the old free MP3s and covers by title, as history. |
| LL-28 | Logos | Carly supplied the logo masters (2026-11-06): `assets/source/logos/` holds `logos.ai`, `Lux_Liner_logo_masters.eps.pdf` and `BIG_luxury_logos_separated.eps` (Illustrator 9, made 2002-12-10 on David's computer). They hold the red oval "L" roundel with the spaced wordmark, the black "L" roundel, the layered "distressed" wordmark, the stacked "THE LUXURY LINERS" wordmark with the crossed X and the slate "LXL" oval, and the condensed wordmark over the red roundel. Web copies (SVG and 300 dpi PNG sheets) are in `assets/derived/logos/`. **No redrawing needed.** The designer is not yet credited (question 31). |

## Round 4: 2026-11-06

| # | Question | Decision |
|---|---|---|
| LL-29 | Covers list | No free MP3s (LL-27). The Vault keeps **a list of the band's known cover songs** by title and original artist. |
| LL-30 | Live "Shake It Up" cover | **Use the 3000-pixel released cover** (Apple Music copy). |
| LL-31 | Contact form | Messages go to **the owner's address** (the Worker secret `CONTACT_TO`; the exact address is in the git-ignored `data/private/decisions-private.md`); the address is never printed in the page. |
| LL-32 | Home page photo | **A collage of a few photos from the band's eras**, including the forever-members photo, because "we used to dress so much cooler in the earlier eras of the band". The collage favours the best-dressed early photos (the c. 2000 studio shots, the Nudie-suit years). |
| LL-33 | Music databases | **Yes**: Chad, Scott and Larry are listed as members by name only on Wikidata, MusicBrainz and Discogs, with no profile entries of their own. |
| LL-34 | Spotify and Apple Music profiles | **David controls both.** The team prepares the bio text (the LL-6 one-liner) for him to paste. |
| LL-35 | Videos | **Embedding YouTube videos is fine**, including the *One Tree Hill* and FOX Sports clips (with captions where possible). |
| LL-36 | Social accounts | **Instagram @theluxuryliners and Facebook /theluxuryliners are the band's own and active**; link them in the footer and the structured data. **No SoundCloud.** The band's albums are on **David's Bandcamp** (daviddewese.bandcamp.com), which the site links as the band's Bandcamp. |
| LL-37 | The 2008 Texas show | **It happened.** David played a solo CD-release show in Texas in 2008 (for *Make The Best Of It*), and **Chad joined him for a few songs**. Carly supplied a photo of the two of them on stage (David and Chad, banjo and acoustic guitar): `assets/source/photos/2008-texas-cd-release-david-and-chad.jpg` (1632×1224). Left-to-right names and the venue still to be confirmed (question 32). |

## Round 5: 2026-11-06

| # | Question | Decision |
|---|---|---|
| LL-38 | The 2008 photo | Left to right: **Chad Edgington (banjo), David Dewese (acoustic guitar)**, at David's CD-release show at **Opening Bell Coffee, downtown** (Dallas, Texas), 2008. |
| LL-39 | Logo designer | Not remembered for sure: "a popular designer in Nashville in 1999, Glen something perhaps". **No designer credit on the site** until a name is confirmed; the colophon says the logos date from 1999–2002. |
| LL-40 | Newsletter (A4) | **No newsletter.** |
| LL-41 | AI crawlers (A9) and authority | **Allow all crawlers, AI included.** The goal is for **theluxuryliners.com to be the authoritative source of all information about The Luxury Liners**: full Facts page, JSON-LD, `llms.txt`, sitemap and the off-site fixes (LL-8). |
| LL-42 | Analytics (A13) | Checked 2026-11-06: **the current Carrd site has no analytics of any kind** (no Google Analytics tag). Proposed, pending Carly's OK: Cloudflare Web Analytics (cookie-free, so no cookie banner) plus Google Search Console and Bing Webmaster Tools. |
| LL-43 | Analytics and go-ahead | Carly, 2026-11-06: "yes build". Taken as approval of the analytics proposal (Cloudflare Web Analytics, cookie-free with no banner, plus Google Search Console and Bing Webmaster Tools) and as the **go-ahead to build the site**. |
| LL-44 | Design direction (A2) | Carly, 2026-11-06: **C, "Roundel"**: *Believe*-era red and white built on the red "L" roundel, with the 2026 sky blue. `design/samples/c-roundel/` is the reference for the real site. |
| LL-45 | Amy Wilstermann credit (D4, in part) | Carly, 2026-11-06: **Amy Wilstermann is fine to credit for the 2003 photos.** Print "Photo: Amy Wilstermann" on the 2003 shoot. Credit line only; no relationship to anyone is stated. |
| LL-46 | Journal-derived material (G1, LL-25) | Carly, 2026-11-07: **approved** as it stands: the 2001–04 Shows rows, Story chapter 5, the /shows/ meta description, the Story-index and `llms.txt` summaries and the EPK long-bio journal sentence. `content/shows.json` `journalDerivedApproved` is now true. The journal quotes removed in the Roundel round stay out; journal months for the Vault still pass LL-25 month by month. |
| LL-47 | Repository visibility and git history (G3) | Carly, 2026-11-07: **make the repository private until launch**, and **keep the git history** (no purge). The decisions file keeps its role wording; no further OK needed. |
| LL-48 | CI secret (G4) | Carly, 2026-11-07: **okay** to add the `PRIVATE_LITERALS_KEY` Actions secret. When it is in place, remove the two `PRIVATE_LITERALS_OPTIONAL` lines from `.github/workflows/ci.yml`. |
| LL-49 | Cloudflare setup | Carly, 2026-11-07: **later.** The Turnstile key, analytics token, Decap `base_url`, staging deploy and redirect check wait for a session with the team. |
