# theluxuryliners.com: Master Plan (Draft 2)

> The project manager's synthesis of the five approved research files (`research/01`–`05`), their data files (`data/releases.json`, `data/legacy-urls.json`, `data/assets.json`) and their critiques (`critiques/`). It is modelled on `/home/user/foxymorons.com/plan/00-master-plan.md` and on the daviddewese.com architecture (`/home/user/daviddewese.com/daviddewese-com/architecture/ARCHITECTURE.md`, cited as `DD-ARCH`).
> Written 2026-10-07. **Status: Draft 2** (round 2), revised after `critiques/plan-round1.md` (7.5/10, 1 blocking issue; every item is answered in the revision log at the end). Awaiting the critic (approval bar 8/10, no blocking issues), **then Carly's answers** (`QUESTIONS-FOR-CARLY.md`). Nothing here is final.

**Source keys used in this file**

| Key | File |
|---|---|
| `DEC` | `/home/user/daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md` (owner decisions; authoritative). Codes such as F4, P8 and X1 refer to rows in it |
| `LL01` | `research/01-band-history-and-people.md` (history and people) |
| `LL02` | `research/02-discography.md` and `data/releases.json` (21 objects) |
| `LL03` | `research/03-web-archaeology.md` and `data/legacy-urls.json` (675 rows) |
| `LL04` | `research/04-press-and-digital-footprint.md` |
| `LL05` | `research/05-assets-and-photos.md` and `data/assets.json` (310 records) |
| `DD-ARCH` | daviddewese.com `architecture/ARCHITECTURE.md` (§ numbers given) |
| `FM-PLAN` | `/home/user/foxymorons.com/plan/00-master-plan.md` |

Confidence labels follow the research files: **confirmed-owner**, **verified-source**, **single-source**, **unverified**. Facts in this plan carry the key of the research file that sources them; the research file holds the primary citation.

---

## 1. Mission

Make theluxuryliners.com **the first place that fans, journalists, search engines and AI answer engines trust about The Luxury Liners**, and make it as sharp-dressed, funny and warm as the band.

Today the band's own site is a one-page Carrd with one sentence of copy. Its meta description calls the band "one-time" (finished), even though it released two singles in 2026. It has no JSON-LD and no `llms.txt`, and in this project's searches it never appeared for the band's name (`LL03` §8; `LL04` §1, §6). What engines repeat instead is a 2001 AllMusic bio that leaves out Chad Edgington's co-founding and stops in 2001 (`LL04` §3.1). The band's real history (four records, a 2001–04 journal with about 40 shows and trips logged in it, TV placements, a 2021 live single and two 2026 singles) is scattered across Wayback captures, Flickr and Discogs.

**Success looks like this** (measurable where possible; baseline 2026-10-07):

| # | Outcome | Measure | Baseline |
|---|---|---|---|
| S1 | The band's site wins its own name | theluxuryliners.com is in the top 3 results for "The Luxury Liners band" (Google and Bing, US, logged out) within 6 months of launch | Not found at all (`LL04` §6) |
| S2 | AI answers carry the story correctly | Quarterly audit (§8.6): ChatGPT, Perplexity, Google AI Overview, Claude and Copilot name **David Dewese and Chad Edgington as co-founders (1997)** and mention the **2026 singles** | They name a trio and stop in 2001 (`LL04` §6, inferred) |
| S3 | The entity exists in the knowledge graph | A Wikidata item exists; MusicBrainz has Chad, a 1997 begin date and all 7 releases | No Wikidata item; MB has 2 of 7 releases and no Chad (`LL04` §4.1) |
| S4 | Old links work | 0 new 404s from legacy URLs in Search Console over 60 days after launch | 630 of 675 archived URLs return 404 today (`LL03` §10.1) |
| S5 | A journalist can write a feature from the site alone | The Facts page and EPK answer the 20 questions in §5.4 without a search | No EPK, no facts page |
| S6 | It looks complete after a year with no updates | No dated "latest news"; an honest status line (§5.3) | n/a |
| S7 | Carly's team runs it | A team member who did not build the site adds a release, edits copy, adds a photo with its credit, publishes and rolls back, unaided, on staging (same acceptance test as `DD-ARCH` §12.4) | n/a |
| S8 | Everyone can use it | WCAG 2.2 AA: axe, Pa11y and Lighthouse accessibility = 1.0 in every configuration, plus a manual screen-reader pass (`DD-ARCH` §14.2 gate 1) | Carrd page: empty alt on its only image, button borders below 3:1 (`LL03` §8) |
| S9 | Fans stay | Median engaged time on Story and Vault pages over 2 minutes (Cloudflare Web Analytics, cookie-free) | n/a |

**Ambition versus sequence.** As on foxymorons.com (`FM-PLAN` §1), "exhaustive" is the destination and the launch is an **authoritative core**. Depth (the full journal, lyrics, song pages, a show archive) is added in layers, each triggered by real material and approvals, not by a calendar (§9).

---

## 2. Ground rules

1. **Owner decisions are authoritative.** `DEC` overrides every research file, archive page, database and press clipping. The ones that shape this site:
   - **F4**: David Dewese **co-founded** The Luxury Liners with Chad Edgington in 1997 (Nashville). Chad left Nashville in 2001; David carried the band on.
   - **F6**: "Great Day" (2026-02-13) and "New Beginning" (2026-04-17) are the band's releases, with those dates.
   - **P6**: the public release date is the date Spotify lists.
   - **P8**: the forever members are David Dewese, Chad Edgington, Scott Carpenter and David "Larry" Wilstermann (nicknamed "Larry" because the band already had a David).
   - **P22/P23**: the 2002 photo of all four is captioned exactly "David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002". **Never "the 2002 line-up"**: Chad had left in 2001.
   - **P27**: "Shake It Up" is an original, first released on the *Believe* EP (2001). The EP's track 3 is a cover of Cher's "Believe", credited to Cher.
   - **P5**: isawtheocean.com has expired. Never link it.
   - **L1**: the band keeps its own site. daviddewese.com has a full band page that links out to it.
   - **P14, P17, R1, P40**: name people in photos where a source supports it; uncredited photos publish with no credit line; Flickr photos may be used with credits; covers carry "Cover art: all rights reserved by the rights holders."
   - **X1**: one side project and the person tied to it are excluded from every file, page, data record and question. This plan does not describe them.
2. **Verification gate.** Nothing is published as fact unless it is `confirmed-owner` or `verified-source`, with a source a person has opened (`checked_by`, `checked_on`, as on foxymorons.com, `FM-PLAN` §2.2). `single-source` facts publish only **with attribution in the sentence** ("according to the band's 2005 site…") or wait. `unverified` facts never publish. Search-engine summaries are leads, not facts. **Contested facts are shown as contested** (for example "Chad left in 2001", not a month; §4.3).
3. **Privacy and consent gate.**
   - No current homes, workplaces, churches, family members, health, or later careers of private people (Chad Edgington, Scott Carpenter, David Wilstermann, former members, guests, photographers, tapers). Public band roles only.
   - Never publish, cite or link the profile of Chad that names his later life (`LL04` §2.2 row 26; internal only). Never republish the old site's mailing addresses, phone number, the private family page or the band Gmail address (`LL03` §12).
   - Quotes from Chad, Scott or Larry, and any new photo of them taken after 2009, need their consent through Carly (§11; `QUESTIONS-FOR-CARLY.md` C1).
   - The 2001–04 journal gets a privacy pass, month by month, before each month is published (`LL03` §12).
4. **Only real artifacts.** Every image is a real photo, cover, flyer or scan from the band. No AI-drawn people, no fake "vintage" grain, no stock ocean liners. The engraved portraits are made from real photos by the daviddewese.com method (`DEC` P32; `LL05` §5). The 2002 photo is AI-enhanced by the owner; that fact stays in metadata, not in public copy (`LL05` §4.1).
5. **Never "broke up".** The band never broke up (`LL01` §4.7: "I refuse to say we've broken up"; `DEC` F6). Copy never says "former" of a forever member, and never says "reunion" (`critiques/assets-round2.md` N3).
6. **Accessible by construction.** WCAG 2.2 AA, enforced in CI (§7.4). Accessibility failures block a deploy.
7. **Designed for neglect.** New music arrives every few years (`DEC` P3 for daviddewese.com; the same pattern holds here: 2006 → 2021 → 2026). No dated news feed on the home page, no "upcoming shows" box that goes stale.
8. **Band-owned accounts, team-maintained site.** Carly's team holds GoDaddy, Cloudflare and Carrd for this domain (`DEC` O1) and will maintain the site (`DEC` O3). The site ships with a plain-language handbook and a training session, as daviddewese.com does (`DD-ARCH` §12.4).
9. **One fact, one wording, both sites.** theluxuryliners.com and daviddewese.com describe the band in the same words and point at the same entity IDs (§8.1). A CI check compares the shared release data (§7.3).

---

## 3. State of research

All five research tracks passed the gauntlet (critic score at least 8/10, no blocking issues).

| File | Track | Rounds | Final score | Verdict | Critique | What it gives the site |
|---|---|---|---|---|---|---|
| `research/01-band-history-and-people.md` | history | 1 | **8.5** | APPROVED | `critiques/history-round1.md` | Origin under F4, eras 1997–2026, line-ups, people tables with a public-OK column, timeline, labels, shows, scene, anecdotes |
| `research/02-discography.md` + `data/releases.json` | discography | 3 (7.5 → 6.5 → 8.5) | **8.5** | APPROVED | `critiques/discography-round3.md` | 7 releases, 1 reissue, 8 appearances, 4 archive items, 1 lead; per-track writers, ISRCs, UPCs, platform IDs, all P6 dates checked live |
| `research/03-web-archaeology.md` + `data/legacy-urls.json` | archaeology | 2 (7.5 → 8.6) | **8.6** | APPROVED | `critiques/archaeology-round2.md` | 7 design eras of the old site, old copy, free audio, the Internet Archive collection, 13 newsletters, all 675 legacy URLs with live status and a 301 plan |
| `research/04-press-and-digital-footprint.md` | footprint | 2 (6 → 8.5) | **8.5** | APPROVED | `critiques/footprint-round2.md` | 26 press items, platform bios and where they come from, knowledge-graph state, name collisions, prioritised off-site fixes, `sameAs` and JSON-LD sketch |
| `research/05-assets-and-photos.md` + `data/assets.json` | assets | 2 (7.5 → 8.5) | **8.5** | APPROVED | `critiques/assets-round2.md` | 6 cover masters, 274 Flickr photos (248 usable), engraved portraits, logos, flyers, credit and caption rules, wish-list |

### 3.1 Release spine (public dates per P6; `LL02` §2)

| Date | Release | Label | Confidence |
|---|---|---|---|
| 2000-05-01 | *Sound As Ever* (album, 15 tracks, 3 hidden) | Echomusic / Litterbug Records | verified-source |
| 2001-03-01 | *Believe* EP (3 tracks; enhanced CD) | Echomusic (digital: Litterbug) | verified-source |
| 2003-05-01 | *Overbored* (album, 10 tracks) | Litterbug Records | verified-source |
| 2006-10-01 | *Nonetheless* (album, 12 tracks) | Litterbug Records | verified-source |
| 2021-08-27 | "Shake It Up (Live at the Texas Music Café)" (single) | Texas Music Café | verified-source |
| 2026-02-13 | "Great Day" (single) | Litterbug Records | confirmed-owner (F6) |
| 2026-04-17 | "New Beginning" (2-track single) | Litterbug Records | confirmed-owner (F6) |
| 2026-05-27 | *Sound As Ever* remastered LP, 100 copies (reissue) | Sound Asleep Records (Sweden) | single-source (Discogs, read live) |

Plus 8 compilation or bonus-disc appearances (1998–2025) and 4 free archive items (*Trunk Box* 1998, *Live Liners* 2002, *From The Vaults* 1997–2001, the 2005 covers and demos) (`LL02` §4–§5).

### 3.2 Research debt: fix before any text becomes site copy

The critics approved every file but left non-blocking items. None blocks this plan; each must be fixed (or consciously dropped) **before** copy or data is drawn from the passage concerned, and all must close before Phase 0 exits. Owner: the worker of each track, in a short "round N+1 tidy" pass in Phase 0. The last column says what each item blocks, so work can start where nothing is blocked.

| # | File | Item (from the critique) | Effect if left | Blocks |
|---|---|---|---|---|
| RD1 | LL01 | "Sharp-dressed power pop" is labelled confirmed-owner via F4/P21; neither decision says it (N1) | A descriptor would be passed off as owner wording | Home one-liner, Story ch. 1, EPK bios |
| RD2 | LL01 | Add the *One Tree Hill* S1 E15 air date, 2004-02-24, The WB (N2; already in LL02 §3.3) | The two files disagree | Story ch. 6; `/music/overbored/` |
| RD3 | LL01 | Add to D3 that the "Chad's Last Show" photo has a Flickr date taken of 2001-04-21 (N3; LL05 A15) | The contested month looks less contested than it is | Story ch. 4; Facts "when Chad left" |
| RD4 | LL01 | *Trunk Box*: some songs called "heard nowhere else" are on other releases; Live Liners audio paths are all dead captures (N4) | Wrong Vault copy | `/vault/trunk-box/`, `/vault/live-liners/` |
| RD5 | LL01, LL04 | **Done 2026-10-07** (URL removed from the repo, college name dropped). Privacy: the profile URL slug of Chad's later life sits in research files inside this repo; Chad's college is named in LL04 §2.2 row 26. Move the URL to an internal note **outside** the repo; drop the college name or mark it internal (LL01 N5; LL04 N1, N2) | A private detail could leak into copy or a public repo | **anything published from this repo, and making the repository public or shared** (do first) |
| RD6 | LL01 | Cite the "Luxury Liners - Grand Rapids, MI" Flickr album for the 2007 tour (N6) | Weak citation | Story ch. 7; `/shows/` |
| RD7 | LL01 | Add *From The Vaults 1997–2001*, the "Breakaway" demo and the 2001 Capitol shoot (N7) | Gaps in the Story | Story ch. 4–5; `/vault/` |
| RD8 | LL01 | The catalogue reached streaming about 2005–2010 (ISRC years), not 2014–2020 (N8) | Wrong date in the Story | Story ch. 8; `/listen/` |
| RD9 | LL01 | Soften unsourced superlatives ("the only good photo of all four") (N9); give Trey Mitchell's credit the confidence LL05 records (N10); move the discrepancies section to the end (N11) | Style and sourcing | Story (all chapters); `/photos/` credits |
| RD10 | LL02 | Five compilation rows rest on Discogs alone: relabel them single-source (N1) | Over-stated confidence | `/music/appearances/`; `facts.json` |
| RD11 | LL02 | The "withheld under X1" placeholder must never reach the site or JSON-LD; drop it from D18 and add a build check (N2; built in §7.4) | An X1 leak | any build with `LAUNCH=1`; JSON-LD |
| RD12 | LL02 | "(live)" beside the Nashpop credit means "read live from Discogs", not a live recording (N3); the Jetpack evidence in D7 partly comes from Foxymorons shows (N4); small gaps: the LP's "Deluxe Edition" label, a mismatched Scott Carpenter Discogs profile, a second "Penguin's First Swim" on *Antarctic Antics* that is not the band (N5); move the revision log to an appendix (N6) | Copywriter confusion | `/music/appearances/`; `/vault/mp3s/`; LP edition (`/music/sound-as-ever/#lp-2026`) |
| RD13 | LL03 | Line 3 still says "round 1"; mark the Discogs "formed in Texas" line as contested in W7; cross-reference P17 so Q7 is not read as a launch blocker; "How It Should Be" vs the IA setlist's "That's How It Should Be"; echomusic hosting dates (2000–c.2009 here, 2000–02 in LL02); 666 of 675 rows lack a last-capture date (disclosed); small CDX extras (N1–N7) | Inconsistency between files | `_redirects` generation; `/vault/old-sites/`; `/shows/` |
| RD14 | LL04 | Omit `foundingLocation` in the JSON-LD sketch until Carly answers (N4; this plan adopts that default, §8.2); stray blank lines split two tables (N5); LL01 D10 and LL02 line 28 disagree with LL04 (N6); the Shazam bio stays single-source (N7) | Sibling files disagree | JSON-LD (§8.2); `llms.txt` |
| RD15 | LL05 | `2068108482` still flags "photographer unknown" though P17 credits Trey Mitchell (N1); `2073240141` alt text says "red bass" but the bass is black with a red tortoiseshell pickguard, and should name Chad (N2, P14); "2009 reunion gig" breaks the never-broke-up rule (N3); the json revision string and md log still link the bare excluded ID to X1 (N4); a double full stop (N5); the *Shake It Up* wordmark is hand-drawn brush lettering, not "condensed capitals" (N6) | Wrong alt text; rule breaches | `/photos/`; alt text anywhere those photos appear |

### 3.3 What the research could not reach

- **The Wayback Machine and theluxuryliners.com's archive** were blocked to WebFetch and curl in this environment; every old-site quotation comes through the daviddewese.com team's reads of 2026-09-28 (`LL03` §0.2). **The band's own concert history page (`/history/concerts.html`, archived 2003-06-07) has never been read**; neither have the 2000 news and events pages, three journal months, the lyrics page, the one-sheet PDF or the 2007–08 news (`LL03` §11 Priority 1).
- AllMusic, Shazam, Last.fm, Bandcamp, Instagram, Facebook and the *Nashville Scene* archive were not readable by script (`LL04` §9).
- There is **no known press for the 2021–2026 releases** (`LL04` §2.2).

A one-sitting "browser pass" by a person fixes most of this (Phase 0, §9).

---

## 4. The story spine

### 4.1 The organizing idea: "Sound as ever"

The band's first album is called *Sound As Ever*. The phrase works as the site's spine on three levels:

1. **The namesake thread.** The band is named after Gram Parsons' song "Luxury Liner" (`LL01` §2.3, verified-source). *Sound As Ever* ends with a hidden track called "The International Submarine Band", the name of Parsons' first band (`LL02` §3.1). The research also notes that Parsons signed letters "Sound as ever"; that link is **unverified as the band's intent** (`LL01` §2.3), so copy uses it only if David confirms (`QUESTIONS-FOR-CARLY.md` B6).
2. **The friendship.** Two college friends (P21: "college friend"; the 2001 *Nashville Rage* called the band "Former Texans", `LL01` line 84) took a band to Nashville in 1997 "to 'get famous'" (2005 band history, quoted as lore only; `LL01` §2.2). P8 calls David Dewese, Chad Edgington, Scott Carpenter and David "Larry" Wilstermann the four "forever members", and the live site calls them "forever brosephs" (`LL03` §8). **"Forever" is about the friendship, not current membership:** Chad left in 2001 and David carried the band on without him (F4), so Chad was not in the band in 2002 (P23). Yet Chad is in the 2002 photo of all four (P23), the band visited him in July 2002 (`LL01` §4.4), the 2008 band site announced him joining David for a Texas CD-release show (`LL03` §3.2; single-source), and David refuses to say the band broke up: "Although the band members are now scattered across four different states I refuse to say we've broken up" (`LL01` §4.7). **Who is in the band today is not known** (open: `QUESTIONS-FOR-CARLY.md` B2); copy never says or implies that all four play together now.
3. **The return.** In 2026 the band released "Great Day" and "New Beginning", and Sweden's Sound Asleep Records pressed *Sound As Ever* on vinyl for the first time (`LL02` §3.6–§3.8). The sound is, in fact, as ever: a Luxury Liners demo of "Great Day" was already on a 2008 bonus disc, and both titles were on the band site's MP3 list by 2005 (`LL02` D16; `LL03` W4; single-source).

So the site tells **a band that never stopped being a band**: loud and busy for ten years, quiet and scattered for fifteen, and back with new songs. The long quiet stretch is not a gap to explain away; it is part of the story, like the long-distance shape of The Foxymorons (`FM-PLAN` §1).

**Tone.** Sharp-dressed, funny, unpretentious: "Texas Pop" (the band's own 2005 phrase), Nudie suits, a "caricature lunch box" as the "ultimate career goal" (2000 bio), "all of nevada was rocked last friday night" (journal) (`LL01` §9). Third person, as on daviddewese.com (`DEC` P21). No mythologising and no music-press clichés. Every design review asks David: **"Is this too precious?"** (`FM-PLAN` §2.5).

### 4.2 Chapters (the Story page, launch version)

One long page in sections at launch; it can split into chapter pages later (§9, layer L3).

| # | Chapter | Years | Core facts (all sourced in LL01 §4–§5 unless noted) | Key artifacts |
|---|---|---|---|---|
| 1 | **Two Texans and a Gram Parsons song** | 1997 | F4 co-founding; "college friend" (P21); "Former Texans" (*Nashville Rage*, 2001, verified-source as reprinted; `LL01` line 84), which is the basis for "Texans" in the title; the name; "Texas Pop"; the move to Nashville; the talent-show lore only if Carly approves (B1) | the 2005 history intro (quoted, dated); "97_" history photos if recovered |
| 2 | **Powder-blue suits and the first recordings** | 1997–1999 | Early line-ups (Jeff LaFrate, Mark W. Winchester, Kyle Edgington; roster); Scott Carpenter joins Aug 1998; Monsters of Pop June 1998 (single-source); *Billboard* 1998 (unverified: shown as "the band remembered…" or held); *Fireworks Vol. 2* and *Nashpop*; *Trunk Box* (Waco, fall 1998); David's 2001 account of Manuel, Nudie suits and Emmylou Harris (shown as "David has said…") | powder-blue suit photos 1998–99 (`LL05` §4.2); *Billboard* contact sheets; Texas Music Café sign 1998 |
| 3 | ***Sound As Ever*** | 2000 | May 2000; Mike Poole and Mark Montgomery; echomusic; the 2000 bio ("caricature lunch box"); Chad drove to Austin with David for the Foxymorons' first show (SXSW, March 2000; `LL01` §4.2, confirmed-owner via the Foxymorons oral history); Larry joins Dec 2000 | Mark Montgomery white-studio session (`LL05` §4.2) |
| 4 | ***Believe*, SXSW and Chad's last show** | 2001 | *Believe* EP; "Shake It Up" (original, P27) and the Cher cover; the SESAC SXSW 2001 CD (whether the band played: open, `LL03` W3); "Chad's Last Show" (month contested); Chad leaves Nashville in 2001 (F4); the trio begins ("the new three piece configuration", 2001-08-12) | "Chad's Last Show" photo; "After Our First Trio Practice - 2001" |
| 5 | **The journal years** | 2001–2004 | About 40 shows and trips logged in the band's journal (journal rows, not a verified gig list; `LL01` §7): Memphis, House of Blues Las Vegas, opening for Blues Traveler in Atlanta, Detroit, Indiana, Columbia SC, Canada; the 2002 photo of all four (P23); the Internet Archive opt-in and the French Quarter Cafe recording (2003-06-19, `LL03` §5.3) | journal excerpts (privacy-passed); flyers; Atlanta and Rocketown galleries |
| 6 | ***Overbored*** | 2003 | May 2003; the one-sheet ("up the 5 from San Diego to L.A."); reviews (*Metroland*, *Nashville Rage*, *Performing Songwriter*); "Dreaming" on *One Tree Hill* (aired 2004-02-24); "Sunshine" as the FOX Sports *US Youth Soccer Show* theme | Amy Wilstermann 2003 promos (the best hero images, `LL05` §1) |
| 7 | ***Nonetheless*** | 2004–2007 | "Promise Ring" (2005); Kristin Barlowe session; *Nonetheless* (Oct 2006), Scott's cover painting; year-end lists; 2007 shows (Grand Rapids, The Nobility, pedal steel) | Barlowe portraits; 2007 picnic and coffee-shop sets |
| 8 | **Scattered across four states** | 2008–2020 | "Great Day" demo on the 2008 bonus disc; Chad at a Texas show (2008, single-source); David and Scott play "all old-school Luxury Liners songs" (2009); David leaves Nashville (late 2010); "currently going by the name 'David Dewese'" (2012; meaning open, B9); "I refuse to say we've broken up" | "Rocking the '97 suit" (2009) |
| 9 | **Great Day** | 2021–2026 | "Shake It Up (Live at the Texas Music Café)" (2021); "Precious To My Heart" on *Fireworks Vol. 3* (2025); "Great Day" and "New Beginning" (2026, F6); the *Sound As Ever* LP (2026); who plays on the new songs (open, B2) | the two 2026 covers; **a recent photo (wish-list #1)** |

**Chapter titles** state only facts at `verified-source` or better. Chapter 2 was retitled from "Nudie suits and Monsters of Pop" (round-1 critique N8): Monsters of Pop is single-source and the Nudie suits are "David has said…" material (B8); neither can carry a title. If David confirms both (B8, B13), the old title may return.

**Anniversary hook.** 2027 is the band's **30th year** (founded 1997, F4). A spring-2027 launch can carry that honestly (§9).

### 4.3 How contested facts are shown

| Topic | Shown on the site as | Source |
|---|---|---|
| Who founded the band | "co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville" (F4). The talent-show story and the AllMusic "outlet for David" framing appear only as dated quotations in the Vault, if at all | `LL01` D1; `LL04` D1 |
| Where it formed | "co-founded in 1997 … took the band to Nashville" (no "formed in Nashville" or "formed in Texas" claim until Carly answers A7) | `LL01` D2; `LL04` D2 |
| When Chad left | "2001" (the photo title says March, its Flickr date taken says 2001-04-21, the 2005 roster says April) | `LL01` D3; `LL05` A15; B12 |
| Who is in the band now | Not stated. The four are "forever members" (P8), never "the current line-up"; Chad's membership ended in 2001 (F4, P23). New recordings are credited to "The Luxury Liners" with no personnel until B2 is answered | F4; P8; P23; B2 (open) |
| *Billboard* 1998 | not stated as fact until the item is found; at most "the band's 2000 bio mentions a *Billboard* write-up" | `LL01` D5 |
| Release dates | P6 Spotify dates only; other dates internal | `LL02` D3–D5 |
| Emmylou Harris's *Luxury Liner* | **no year** (default). Sources split: Wikipedia gives 1976-12-28, citing a Warner reissue note; MusicBrainz, the chart year and the first single give 1977 | `LL04` D8; round-1 critique check 12 |
| "Lead Me On" | "a Jetpack song" only after David says which Jetpack | `LL02` D7 |

A short "How we date and source things" note sits on the Facts page (§5.4).

---

## 5. Information architecture

### 5.1 Sitemap (v1.0 launch unless marked)

URLs use trailing slashes, as on daviddewese.com (`DD-ARCH` §3.2). The legacy targets in `LL03` §10.2 already point at these paths.

| Path | Page | Purpose | Main content | Launch? |
|---|---|---|---|---|
| `/` | **Home** | Who, what, now | one-line description, honest status line, latest release, the four forever members, listen buttons, a path into the Story and the Vault, the disambiguation line | v1.0 |
| `/story/` | **Story** | The band's history | the 9 chapters (§4.2), with photos, quotes and sources | v1.0 |
| `/music/` | **Music** | Discography | the 7 releases plus the LP edition, appearances, archive items (linking to the Vault) | v1.0 |
| `/music/sound-as-ever/` | Release | | cover, P6 date, label, tracklist with writers, credits, band note, liner facts, listen links, press, the 2026 LP as an edition (`#lp-2026`) | v1.0 |
| `/music/believe-ep/` | Release | | as above; "Shake It Up" original (P27); "Believe" credited to Cher | v1.0 |
| `/music/overbored/` | Release | | as above; *One Tree Hill* and FOX placements; lyrics section only if approved (V3) | v1.0 |
| `/music/nonetheless/` | Release | | as above; cover painting by Scott Carpenter (single-source, B10) | v1.0 |
| `/music/shake-it-up-live/` | Release | | live version of the *Believe* EP original; recording date open | v1.0 |
| `/music/great-day/` | Release | | 2026 single; the 2008 demo history (contested: same recording or new, B3) | v1.0 |
| `/music/new-beginning/` | Release | | 2026 single (2 tracks) | v1.0 |
| `/music/appearances/` | Appearances | | the 8 compilations and bonus discs, linking out (third-party art is not hosted, `LL05` §3.3) | v1.0 |
| `/people/` | **People** | Who is and was in the band | forever members (P8) with roles and years; all-time roster (2005 roster); producers, engineers, guests, artists and photographers (`LL01` §3.3), band roles only; David links to daviddewese.com | v1.0 |
| `/press/` | **Press** | Coverage | the 26 items in date order, positive excerpts only with publication, date and writer; scans where David has them | v1.0 |
| `/shows/` | **Shows / Live** | Live history | one table of known shows (journal 2001–04, flyers, IA recording, photos), each with a confidence column; showcases; TV placements | v1.0 (grows when `/history/concerts.html` is read) |
| `/vault/` | **Vault** | The archive | free audio, the old sites, the journal, newsletters, ephemera | v1.0 (core items) |
| `/vault/journal/` and `/vault/journal/<yyyy-mm>/` | Journal | | the 2001–04 band journal, month by month, privacy-passed | v1.0 for months already passed; the rest as they clear |
| `/vault/news/` | Old news | | the band site's news pages 2000–08 | when read (browser pass) |
| `/vault/trunk-box/` | *Trunk Box* | | the 1998 Waco live album; 4 archived MP3s; full tracklist when read | v1.0 if audio approved |
| `/vault/live-liners/` | *Live Liners* | | 12th & Porter 2002 (no archived audio; needs David's files) | when files arrive |
| `/vault/mp3s/` | Free MP3s | | the 2005 site MP3 list; originals only (cover songs: §10 R9) | v1.0 for originals |
| `/vault/old-sites/` | Old websites | | the 7 design eras 2000–2024 with screenshots and dates (`LL03` §2) | v1.0 |
| `/photos/` | **Photos** | Galleries | by era (1997–2000, 2001–04, 2005–07, 2008–), with credits and captions; anchors for the old gallery names (`#sxsw`, `#capitol`, …) | v1.0 |
| `/facts/` | **Facts** | Cited answers | fact table with sources and confidence; FAQ; disambiguation; "how we date things"; feeds `llms.txt` | v1.0 |
| `/epk/` | **EPK** | Press kit | 50/150/300-word bios, approved photos (downloads with credits), logos, fact sheet, best quotes, contact | v1.0 |
| `/listen/` | **Listen** | Where to hear and buy | Spotify, Apple Music, Bandcamp (David's account, per album), YouTube, Deezer, Tidal, Amazon where resolved; the LP | v1.0 |
| `/contact/` | **Contact** | Reach the band | form (Worker + Turnstile; address never in HTML), social links | v1.0 |
| `/lyrics/` | Lyrics | | *Overbored* lyrics and chords from the 2003 site, if approved | layer L2 |
| `/songs/` and `/songs/<slug>/` | Songs | | A–Z song index; full pages only where there is real content | layer L1 |
| `/accessibility/`, `/privacy/` | Statements | | accessibility statement (dated, tools named) and privacy note (cookie-free analytics) | v1.0 |
| `/llms.txt`, `/sitemap.xml`, `/robots.txt`, `404`, `410` | Plumbing | | §7, §8 | v1.0 |

### 5.2 Navigation

- **Header (5 items + logo):** Story · Music · People · Vault · Listen. The logo returns home.
- **Footer:** Shows · Photos · Press · EPK · Facts · Contact · Accessibility · Privacy · theme toggle (if the chosen direction has one) · "David Dewese" (link to daviddewese.com) · "The Foxymorons" (link to foxymorons.com).
- No mega-menus. Every page is two clicks from home. The Vault stays in the main navigation, as on daviddewese.com (`DEC` P29).

### 5.3 Home page

1. **Name and one line:** the canonical description (§8.1), visible as text.
2. **Honest status line**, written to age well, e.g. "Founded in 1997. Two new singles in 2026. The band never broke up." (It must not claim that the four forever members play together now; §4.3.) No "latest news", no dates that rot (rule 7). Carly's team edits this one line when something real happens.
3. **Latest release slot** (pinned, as on daviddewese.com): cover, title, date, listen buttons. It reads well years later ("Latest release: *New Beginning*, April 2026").
4. **The four forever members** (P8): engraved portraits or a grid, names and roles, the "Larry" story in one line.
5. **Three doors:** Read the story · Hear the records · Open the Vault.
6. **Disambiguation line** in visible HTML (§8.4).

### 5.4 Facts page and EPK: the questions they must answer

Who founded The Luxury Liners? When and where? Where does the name come from? Is this Emmylou Harris's *Luxury Liner*? Is this Carter Tanton's Luxury Liners? Who is in the band? Who are the forever members? Who were the early members? Are they still active? What did they release, and when? What is the newest release? Which label? Has their music been on TV? Who produced the records? Who wrote the songs? What does "Texas Pop" mean? How is the band connected to The Foxymorons? Where can I listen? Where can I buy the LP? How do I contact the band? Each answer is one or two sentences with a source, in visible HTML and `FAQPage` JSON-LD only where the answer is shown.

### 5.5 Content model (collections)

| Collection | Source of truth | Feeds |
|---|---|---|
| `releases` | `data/releases.json` (21 objects; §7.3 on sync with daviddewese.com) | Music, release pages, Listen, JSON-LD `MusicAlbum`, `llms.txt` |
| `people` | new `data/people.json` from `LL01` §3.2–§3.3 (name, role, years, source, confidence, `public_ok`, `consent`) | People, JSON-LD `member` |
| `shows` | new `data/shows.json` from the journal table (`LL01` §7; dd `live.ts` `LL_SHOWS`), flyers and the IA item | Shows |
| `press` | new `data/press.json` from `LL04` §2.2 (with `quotable: true/false`) | Press, EPK |
| `facts` | new `data/facts.json` (claim, answer text, source, confidence, `checked_by`, `checked_on`, `contested`) | Facts, FAQ JSON-LD, `llms.txt`; CI refuses `unverified` rows |
| `photos` | `data/assets.json` (310 records; `credit_status`, alt, caption rules) | everywhere |
| `vault` | new `data/vault.json` (item, type, date, files, approval, privacy pass) | Vault |
| `journal` | one Markdown file per month, transcribed in the browser pass, with a `privacy_passed_by` field | `/vault/journal/` |
| `story` | Markdown, one file per chapter | Story |
| `legacy-urls` | `data/legacy-urls.json` (675 rows) | `_redirects`, Worker rules, the redirect test suite |
| `approvals` | `data/approvals.json` (David's sign-off per rendered record, as on daviddewese.com `DD-ARCH` §6.1) | the `LAUNCH=1` build gate |

---

## 6. Design directions

All three directions share the daviddewese.com foundations, so Carly's team maintains one way of working: real photos only; covers always in full colour (P32, P40); a colour **pair** system with contrast enforced at build (pair at least 7:1; derived text at least 4.5:1; UI at least 3:1, as in `DD-ARCH` §7.0); pills and soft corners optional; motion with full reduced-motion alternatives (P36). They differ from daviddewese.com's **Duotone** (Inter only, dark by default, one pair per page, engraved portraits on every lead; the Luxury Liners pair there is oxblood `#6E1410` / blush `#F7D6C8`, contrast 8.70:1) in type, layout logic and motif, so the band's site feels like a cousin, not a sub-page.

Contrast figures below were computed with the WCAG 2.x relative-luminance formula on 2026-10-07, for **both themes** of each direction (dark-theme tokens are named where a direction has a toggle). They are a starting point; Phase 1 runs the full token test. Direction A's pairs work in both themes because each pair is used as light-on-dark (dark theme) or dark-on-light (light theme), and the ratio is the same either way.

### Direction A: "Stitched" (the Duotone cousin)

- **Idea.** The band's suits, embroidered. Keep Duotone's engraved portraits and colour pairs, and add one motif: a chain-stitch line drawn in SVG, like the piping on a Nudie suit, used for rules, section breaks and the edges of portrait frames. It honours the Gram Parsons and Nudie-suit thread (`LL01` §2.3) without costume.
- **Colour.** The band's anchor pair is the daviddewese.com one, so the two sites visibly match: oxblood `#6E1410` / blush `#F7D6C8` (8.70:1). **Era pairs** replace per-page pairs: 1997–2000 "powder-blue suit" navy `#0E2A44` / powder `#CFE3F2` (11.11:1); 2001–2007 trio oxblood / blush; 2008–2026 "Great Day" deep sky `#0B3A66` / white `#FFFFFF` (11.59:1). Story chapters, release pages and Vault items take their era pair; album pages still take their pair from the cover (dd method).
- **Type.** **Archivo** (variable, with a width axis): condensed ExtraBold capitals for titles, echoing the band's crossed-X wordmark (`LL05` §6 #1); the 2024 band site already used Archivo Black (`LL03` §2 E6). Inter for body text, shared with daviddewese.com. Budget at most 100 KB in at most 4 files.
- **Imagery.** Engraved portraits re-rendered with `engrave.py` in the era pairs (`LL05` §5), from the sharper sources: the 2003 Amy Wilstermann frames for the trio and the 2001 "Chad's Last Show" photo for the four-piece. Archive photos stay in original colour.
- **Theme.** Dark by default with the footer toggle, as on daviddewese.com (P35).
- **Motion.** "The jump": the band's signature mid-air photos (the white-studio session; the *Shake It Up* cover) lift a few pixels on scroll; stitch lines draw in once. Off under reduced motion.
- **Risk.** Too close to daviddewese.com; the stitch can turn twee. Mitigation: the stitch is used in at most three places per page; the "too precious?" review.

### Direction B: "Tonight, No Cover" (the show poster)

- **Idea.** Every page is a gig poster. The band's own letterpress-style poster read "THE LUXURY LINERS / TEXAS POP / TONIGHT NO COVER" (`LL05` §6 #5). Big stacked wood-type capitals, two flat inks per page on a paper ground, and a Shows page that works like a wall of flyers.
- **Colour.** Paper `#F4E6D0` with oxblood ink `#6E1410` (9.64:1) for text and headings, and a second ink, powder blue `#1F4E79` (7.04:1 on paper), for links and accents. Flat colour only: **no fake letterpress grain or distressing** (rule 4).
- **Type.** **Big Shoulders Display** (wood-type-inspired, OFL) for poster headings; Archivo for body.
- **Imagery.** Real flyers and posters as the hero material (`LL05` §7); photos in full colour inside poster-style frames.
- **Theme.** Light by default (paper), with a dark "after hours" toggle: oxblood ground `#6E1410`, paper ink `#F4E6D0` for text (9.64:1) and powder `#CFE3F2` for links (8.99:1). The light link ink `#1F4E79` is **not** reused on oxblood (1.37:1).
- **Motion.** Minimal: posters settle into place; marquee-style text never auto-scrolls (WCAG 2.2.2).
- **Risk.** Hatch Show pastiche and Nashville cliché; whether Hatch Show Print made the band's poster is unverified (`LL05` §6 #5), so the site must not claim it. Poster type at small sizes hurts readability: body text stays in Archivo at 16 px and up.

### Direction C: "Roundel" (Texas Pop hi-fi)

- **Idea.** Bright, confident power pop built from the band's own marks: the red-and-white roundel of the *Believe* era (`LL05` §6 #2) as the recurring device (bullets, favicon, section markers, the player button), the crossed-X wordmark, and the white-studio "jump" photos as cut-outs. The 2026 covers (kite on deep blue; sunburst on blue) supply the "now" colour.
- **Colour.** The pair is ink `#111111` on white `#FFFFFF` (18.88:1). *Believe* red `#B5121B` (6.85:1 on white) is an **accent** for headings, large text and fills; it does not meet the shared 7:1 pair rule, so it is not a text pair. If red body text is wanted, use the darker `#9A0E16` (8.58:1). Deep sky `#0A5A8C` for the 2026 layer and links (7.36:1). White text on red fills is 6.85:1 (passes 4.5:1).
- **Type.** Archivo Black for titles; Archivo for text.
- **Imagery.** Cut-out jump photos (masked from real photos, never redrawn), covers large, the roundel everywhere small.
- **Theme.** Light by default with a dark toggle: ink ground `#111111`, white text (18.88:1), a lighter red `#FF8A80` for headings and accents (8.27:1) and a lighter sky `#7CC4F2` for links (9.92:1). The light-theme red (2.76:1) and sky (2.57:1) **fail** on ink and are never used there.
- **Motion.** A short "jump" on hover or scroll for the cut-outs; the roundel spins once when a player starts. Off under reduced motion.
- **Risk.** Reads younger and louder than a 30-year-old band that never broke up; needs vector logo files that do not exist yet (`LL05` §6; wish-list #2).

### Recommendation

**A as the system, with C's marks and B's Shows page.** A keeps the family resemblance with daviddewese.com (same pair system, same portrait pipeline, same Inter body text), so one handbook and one set of CI checks serve both sites. From C, use the roundel and the crossed-X wordmark (redrawn as SVG only with Carly's OK, Q D2). From B, borrow the flyer-wall layout for `/shows/` and the Vault ephemera. Phase 1 builds three sample pages (a release page, a Story chapter, a Vault item) in A, B and the hybrid, and David and Carly pick (`QUESTIONS-FOR-CARLY.md` A2).

Rules that hold in every direction:
- Underlined links; a 3 px focus ring in the ink colour; nothing conveyed by colour alone.
- No text on photos without a solid scrim that passes 4.5:1.
- Flyer and poster images always have a text transcription.
- The 2002 photo caption is exact (P23), including on engravings.

---

## 7. Technology

### 7.1 Stack (reuse daviddewese.com)

| Layer | Choice | Why / source |
|---|---|---|
| Site generator | **Astro 6** static (`output: 'static'`, `trailingSlash: 'always'`, directory format), Node 24 LTS pinned, Zod 4 schemas | Same as daviddewese.com (`DD-ARCH` §12.1); the routing spike ran on Astro 6.4.8 |
| Host | **Cloudflare Workers with Static Assets**, free plan | Same as daviddewese.com; Carly's team holds Cloudflare (`DEC` O1) and stays on free plans (P42) |
| Worker | `/api/contact` (Turnstile, honeypot, rate limits; address never in HTML), 410 bodies, and the 32 query-string legacy URLs (`/?content=…`; `LL03` §10.1) | Static `_redirects` cannot match query strings; use a Cloudflare redirect rule that matches the query, or run the Worker first on `/` only. The Phase 2 spike picks one; the fallback (home page, 200) is acceptable (`LL03` §10.1) |
| Editing | **Decap CMS** with the editorial workflow (Draft → In review → Ready), GitHub login with two-factor, preview link per change | Same as daviddewese.com (`DD-ARCH` §12.4), so Carly's team learns one tool |
| Analytics | Cloudflare Web Analytics (cookie-free); Google Search Console and Bing Webmaster Tools | No cookie banner needed |
| Media | Pre-sized web masters in git (long edge ≤ 3,000 px, ≤ 3 MB); originals in a private R2 bucket; audio files for the Vault in `public/` at their **old paths** where the legacy plan says re-host (`LL03` §10.2) | `DD-ARCH` §13.1 |
| Fonts | Self-hosted, subset, at most 100 KB, 1 preload | `DD-ARCH` §7.0 budget |

Repository: a **separate repository** for this site (proposed name `theluxuryliners-com`), scaffolded from the daviddewese.com `site/` template so that components, schemas, `check-dist`, `check-jsonld`, the contrast test, the portrait pipeline and the handbook carry over (`QUESTIONS-FOR-CARLY.md` A5).

### 7.2 DNS, cutover and legacy URLs

- **Today:** theluxuryliners.com is on GoDaddy nameservers, the apex points at Carrd (`172.66.0.70`), `www` 301s to the apex; the domain was registered 1998-03-20 and **expires 2027-03-19** (`LL03` §8).
- **Plan:** add the zone to the Cloudflare account Carly's team controls, import records DNS-only, change nameservers at GoDaddy, and wait until the zone has been Active for at least 7 days. Then, in one cutover window with Carly's team present: delete the Carrd apex record, attach the apex as the Worker's Custom Domain, create the `www` → apex redirect, turn on Always Use HTTPS, run the smoke tests, and remove the domain from Carrd. This is the daviddewese.com procedure (`DD-ARCH` §4.6, §4.9, §14.1 M4).
- **Do not** put a Cloudflare Bulk Redirect in front of Carrd: a proxied record to Carrd's Cloudflare IP gives Error 1000 (`DD-ARCH` §4.6; `LL03` §10.3).
- **Do not paste** the daviddewese.com "optional handover pack" (81 Carrd rows pointing old band URLs at daviddewese.com) unless the new site slips past mid-2027 (`QUESTIONS-FOR-CARLY.md` A6). L1 means the archive now belongs here.
- **Every archived URL gets a deliberate answer** (`data/legacy-urls.json`, 675 rows; `LL03` §10):

| Action | Rows | Response on the new site |
|---|---|---|
| `301` | 300 | 301 to the target in §5.1 (exact rows before splats; no chains) |
| `301-if-query-capable` | 32 | 301 via the query rule; otherwise the home page (200) |
| `rehost-same-path` | 17 | 200: the file served at its old URL (11 site MP3s, 4 *Trunk Box* MP3s, the one-sheet PDF and the 300 dpi photo), **subject to rights** (§10 R9); otherwise 301 to its Vault or press page |
| `rehost-or-none` | 78 | 200 if the image is re-hosted at its old path; otherwise **410** |
| `keep` / `serve` | 2 / 3 | 200 (`/`, `/index.html`, robots, sitemap, favicon) |
| `none` | 243 | **410 Gone** for old images, CSS, scripts, Flash, newsletter images and private files; **untouched** for Cloudflare's `/cdn-cgi/*` and generic bot probes (404 is right for those). The private family page (`/ethan.html`) 301s to `/` only (`LL03` §10.3) |

- The redirect generator (`research/tools/gen_legacy_urls.py`, ported to the dd `build-redirects` pattern) regenerates `_redirects` from the JSON after the IA is final, and again after the browser pass adds last-capture dates (`LL03` §10.3).

### 7.3 Data: one catalogue, two sites

daviddewese.com already carries the 7 Luxury Liners releases in its own `data/releases.json`; this project's file is identical in dates, UPCs, ISRCs, catalogue numbers and tracklists, and **more correct** in writers and producers (`LL02` §7). To stop the two drifting:
- **Proposed:** this project's `data/releases.json` becomes the **source of truth for Luxury Liners releases**; daviddewese.com syncs the shared fields from it (its `split-releases`/sync script already pulls from a data folder, `DD-ARCH` §12.2).
- **Both** sites run a CI check that compares the shared fields (id, title, P6 date, label, catalogue number, UPC, ISRCs, track titles and durations) and fails on any mismatch.
- The writer corrections in `LL02` §7 (*Sound As Ever* "Mine"; *Overbored* "Restless" and the per-track split; the *Believe* co-producer) flow back to daviddewese.com through that sync, after David confirms them (`QUESTIONS-FOR-CARLY.md` B4).

### 7.4 CI gates (every pull request; a failure blocks the deploy)

1. **Data:** Zod `.strict()` validation of every collection; real-calendar dates; the P6 Spotify-date lint; `facts.json` has no `unverified` row marked public; every rendered record has an `approvals.json` entry when `LAUNCH=1`.
2. **Copy rules (`check-dist`, over the built HTML, JSON-LD, `llms.txt` and alt text):** port the daviddewese.com word list for X1 and its internal-tag rule unchanged; and fail on the phrases below. **Scope:** the phrase rules marked † apply to the site's own copy only. Text inside `<blockquote>`, `<q>`, or an element marked `data-quote` (dated quotations and Vault transcriptions, such as the 2002 journal's "former member Chad Edgington" or the 2005 talent-show history) is allow-listed, because a dated quotation is shown as a quotation. The X1 list, internal tags, the 2002-caption rule and the privacy strings apply everywhere, quotes included.
   - any internal decision tag (`X1`, `[F4]`, `[P8]`, `DL-…`) and the strings "withheld under";
   - "the 2002 line-up" and any caption of the 2002 photo that is not the exact P23 text;
   - † single-founder wording ("formed by Chad Edgington", "David joined", "Chad's band");
   - † "reunion", "broke up" (except "never broke up"), "former member" next to a forever member's name, "one-time";
   - † current-membership claims about the four: "still members", "same four", "current line-up" or "line-up today" within a sentence naming Chad Edgington (§4.3, B2);
   - † "Nashville-based" (present tense; `LL04` D4);
   - "isawtheocean", "bigcartel", "noisetrade", "myspace" as links; the band Gmail address; any old postal address or phone number from the 2000 bio; the private family page; the host of the profile of Chad (RD5);
   - "Shake It Up" described as a cover; "Believe" without "Cher";
   - **warning only (does not block):** a year next to Emmylou Harris's *Luxury Liner*. The default is no year; the year is contested (§4.3), so a dated mention gets a human look, not a failure.
3. **JSON-LD:** valid against Schema.org; `numTracks` equals the track count; no nulls; every `sameAs` URL in the allow-list (§8.3).
4. **Accessibility:** axe and Pa11y in every configuration (themes, JS on and off, motion on and reduced), Lighthouse accessibility = 1.0, 320 px reflow and 200% zoom, focus-not-obscured.
5. **Contrast:** every token pair, both themes, including text on fills.
6. **Performance:** text pages ≤ 300 KB, release pages ≤ 350 KB, home ≤ 500 KB; first-party JS ≤ 2.5 KB on text pages; LCP ≤ 1.8 s; CLS ≤ 0.02 (`DD-ARCH` §13).
7. **Redirects:** the full 675-row suite on `wrangler dev` and on staging: each row returns its expected code and target; every target returns 200; no chains (`DD-ARCH` §4.7 pattern).
8. **Links:** lychee (warn only for external links).
9. **Cross-site data:** the release comparison in §7.3.

### 7.5 Handover

- `docs/HANDBOOK.md`, adapted from daviddewese.com's (`site/docs/HANDBOOK.md`): adding a release, editing copy (with the band's copy rules in plain words), adding a photo with its credit and caption, adding a Vault item, deploying, rolling back, accessibility checks, accounts and renewals (including the **2027-03-19** domain renewal), and when to call a developer.
- `ACCOUNTS.md` (who holds GoDaddy, Cloudflare, GitHub, Spotify for Artists, Apple Music for Artists, Instagram, Facebook, YouTube) and `BUILDING.md`.
- One hands-on training session (about an hour, since the team will already know the daviddewese.com workflow), recorded.

---

## 8. Authority and AI visibility

### 8.1 Canonical strings

| Field | Value | Source |
|---|---|---|
| Name | **The Luxury Liners** (alternate: "Luxury Liners") | `LL04` D7 |
| One-line description | "The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together. Chad left Nashville in 2001, and David has carried the band on since." | daviddewese.com `LUXURY_LINERS_LINE` (`site/src/lib/site.ts` line 26); F4. Carly approves its use here (A8) |
| Name story | "The name comes from the Gram Parsons song 'Luxury Liner'." | same line; `LL01` §2.3 |
| Members | David Dewese, Chad Edgington, Scott Carpenter, David "Larry" Wilstermann (forever members) | P8 |
| Status | active (2021 and 2026 releases) | F6; `LL04` D5 |

The same strings go into the site meta, JSON-LD `description`, `llms.txt`, the Wikidata description, the Spotify and Apple bios, the Discogs profile and the Last.fm wiki (`LL04` §8.1).

### 8.2 JSON-LD

- `MusicGroup` with `@id` `https://theluxuryliners.com/#band`; `url` the home page; `foundingDate` 1997; `founder` David (`https://daviddewese.com/#person`) and Chad (`https://theluxuryliners.com/#chad-edgington`, a `Person` with **name only**); `member` as `OrganizationRole` with `roleName`, `startDate` and, for Chad only, `endDate` 2001 (forever members otherwise have no end date); `genre` power pop, pop rock; `disambiguatingDescription`.
- **Membership modelling is deliberate.** Chad's `endDate` 2001 follows F4 and P23. Scott and Larry have no `endDate` because no source gives one, not because the site claims they play in the band today (B2 is open). P8's "forever" is the band's word for the friendship, not a membership record. A later worker must not "fix" this by removing Chad's end date or by adding end dates for Scott and Larry without an owner answer to B2.
- **`foundingLocation` is omitted** until Carly answers A7, matching daviddewese.com, which omits it today (`LL04` §8.1 and critic N4).
- `MusicAlbum` per release with `@id` `https://theluxuryliners.com/music/<slug>/#album`, `byArtist` the band, `datePublished` (P6), `numTracks`, `track` list, `recordLabel`, `image` (cover), and Bandcamp, Spotify and Apple links as `url`/`offers`, not as band `sameAs` (`LL04` §8.1).
- daviddewese.com's band page and its Luxury Liners release pages reference these `@id`s once this site is live (`LL04` §7 #10).
- `FAQPage` only for questions whose answers are visible on the Facts page.

### 8.3 `sameAs` allow-list (from `LL04` §8.2)

**At launch:** Spotify artist `3416B3EOd5itWZazwzw9Qc`; Apple Music `47333263` (slugged URL); YouTube channel `UCi2Kheqfw714F4v8bwBbViA`; MusicBrainz `7af7fd54-1d1b-4353-ab60-4b61bceed337` (after its fixes); Discogs `4298743`; Deezer `1518436`; Tidal `5748092`. **After a human check:** Instagram and Facebook `theluxuryliners` (only once E7 confirms the accounts are the band's and active); AllMusic `mn0000759673`; Last.fm (after its wiki is fixed); **Wikidata (when created: the highest-value entry)**. **Never:** the site itself, single videos, release pages, MySpace, NoiseTrade, Big Cartel, isawtheocean.com, or any name-collision ID (Carter Tanton's Spotify `6IkyFyVyUt99P1jjMllZ5m`; Deezer `1123705`, `4424854`; Apple "The Liners" `522057446`).

### 8.4 Disambiguation

Visible on Home and Facts, in `disambiguatingDescription` and in `llms.txt` (`LL04` §5): *"Not to be confused with Emmylou Harris's album* Luxury Liner*; Luxury Liners, the recording name of singer-songwriter Carter Tanton (*They're Flowers*, 2013); the Finnish band Luxury Liner; or the bands Luxury (Georgia, 1990s) and Luxury (Iowa, 1977–82)."* Album and single titles are always paired with the band name in `<title>` and headings (*Sound As Ever* and *Nonetheless* collide with other bands' albums; `LL04` §5). "Litterbug Records" is always written in full (a UK punk band is called Litterbug).

### 8.5 Off-site corrections (after the owner's go-ahead; `QUESTIONS-FOR-CARLY.md` E1)

In order of impact (`LL04` §7):
1. **Wikidata:** create the item (instance of musical group; inception 1997; genre; label; official website; IDs). Founded-by takes an item: create David's item at the same time; for Chad, use "unknown value" with "object named as" only if Chad agrees, otherwise leave him to the description (E2). Do not create items for Chad, Scott or Larry.
2. **AllMusic:** submit a correction to the 2001 bio (name with "The"; the co-founding; later releases; the trio). It is the root of the bio on Apple Music, iHeart and Shazam.
3. **MusicBrainz:** https homepage; end the MySpace link; decide the Flickr link (E4); begin date 1997; Chad as a member 1997–2001; member dates; DSP links; the missing release groups.
4. **Discogs:** replace "Originally formed in 1997 in Texas" with the canonical wording; add the 2021 and 2026 releases; "LaFrate" spelling.
5. **Spotify for Artists and Apple Music for Artists:** claim; write the bio; ask the distributor to remove the dead duplicate *Believe* on Spotify and fix Tidal's dates.
6. **Last.fm wiki**, **YouTube channel description**, **Instagram and Facebook bios**: same one line and the site link.
7. **daviddewese.com (suggestions, not changes to approved copy without its owner's say):** consider dropping the year from `LUXURY_LINERS_NOT` (`site/src/lib/site.ts` line 32 says "1977"; the year is contested, §4.3), so the two sites agree on "no year"; keep the band site as `url`, not `sameAs`; add the Wikidata ID when created.

### 8.6 `llms.txt`, robots and the AI audit

- `robots.txt` allows all crawlers, AI included (P1 on daviddewese.com; confirm for this site, A9).
- `llms.txt`: the canonical description, the forever members, the release list with P6 dates, the TV placements, the disambiguation sentence, and links to Facts, Wikidata, MusicBrainz and Discogs.
- **Quarterly AI audit** (the dd `docs/ai-audit.md` pattern): ask five assistants the same eight questions ("Who founded The Luxury Liners?", "What is the newest Luxury Liners release?", "Is the band still active?", "Where does the name come from?" and others), log the answers with dates, and track S2. First audit: before launch (baseline) and 30 days after.

---

## 9. Launch phases

Each phase ends on its **exit criteria**, not on a date. The same team runs both sites, so the dates below are set against daviddewese.com's milestones (M3 content and approvals to 2026-12-04, **M4 launch go/no-go 2026-12-11**, M5 post-launch to 2027-01-29; `DD-ARCH` §14.1):

- **Phase 0** is research and asynchronous owner questions only. Tier 1 questions go out in October so that answers can arrive before dd's M3 crunch; nothing in Phase 0 needs a meeting with David.
- **No Luxury Liners review meeting or build work happens before dd's M4 (2026-12-11).** Phase 1 starts 2026-12-14 and its review with Carly and David is held in January.
- **Phase 2 overlaps dd's M5** (post-launch: weekly 404 review, one 30–60-minute follow-up session). Phase 2 is developer work; the only thing it asks of Carly's team is one test release in Decap, which can follow the M5 follow-up session. This overlap is a known load, not an avoided one.
- **Domain check:** nameservers change at the start of Phase 2 (about 2027-01-11), so the zone has been Active for 7 days by about 2027-01-20; the cutover at launch (2027-03-01) leaves 18 days before the 2027-03-19 renewal date.

### Phase 0: Truth, access and material (no website) — proposed 2026-10-08 to 2026-12-11

- **Owner answers** to the priority questions (`QUESTIONS-FOR-CARLY.md` sections A and B).
- **Browser pass** (one sitting, about half a day, by anyone with a normal browser): open the `LL03` §11 Priority 1 list (the band's concert history page, the three unread journal months, lyrics, `/history/music.html`, the one-sheet PDF, the 2000 and 2002 news and events pages, the 2007–08 news and bio, the bios) and save each to `research/legacy/wayback/`; then `LL04` §9 (AllMusic, Last.fm wiki, the 2000 press page, *Nashville Scene* articles, *Billboard* 1998 in the worldradiohistory archive) and the Flickr and Instagram checks in `LL05` §9. Run the uncollapsed CDX query (`LL03` §11 #24).
- **Research tidy:** fix RD1–RD15 (§3.2); fold the browser-pass findings into LL01–LL05 (each change goes back through the critic).
- **Consent:** Carly asks Chad, Scott and Larry how they want to appear (C1, C2).
- **Assets:** ask for the wish-list items (`LL05` §11): a recent photo, logo files, the *Shake It Up* cover master, the Montgomery and Barlowe originals, the Capitol shoot, 1997–2000 photos, flyers, booklets.
- **Accounts:** confirm Carrd, GoDaddy and Cloudflare access for this domain (O1); create the GitHub repository; confirm who holds Spotify for Artists and Apple Music for Artists (E3).
- **Exit criteria:** the A-section questions are answered or their defaults accepted in writing; `/history/concerts.html` and the three missing journal months are read and summarised; `data/facts.json` v1 is frozen with a confidence label on every row; RD1–RD15 are closed; consent answers are recorded in `data/people.json`.

### Phase 1: Look — proposed 2026-12-14 to 2027-01-15 (review in the week of 2027-01-11)

- Three sample pages (a release page: *Overbored*; a Story chapter: "Believe, SXSW and Chad's last show"; a Vault item: *Trunk Box*) in directions A, B and the hybrid, on real data, both themes.
- Token test for each direction; engraved portraits re-rendered in the candidate palettes.
- One review with Carly and David ("Is this too precious?"), in the week of 2027-01-11, after dd's M4 and the holidays.
- **Exit criteria:** a direction is chosen; its tokens pass the contrast rules in both themes; the three samples have 0 axe violations; the logo approach is decided (redraw or wait for files, D2).

### Phase 2: Skeleton — proposed 2027-01-11 to 2027-02-05

- Phase 2 starts during Phase 1's review week because its first tasks (scaffold, schemas, redirects, Worker, DNS) do not depend on the chosen direction; design tokens are applied once Phase 1 exits.

- Scaffold the repository from the daviddewese.com template; content collections (§5.5); CI gates (§7.4); the redirect generator and the 675-row suite; the Worker (contact, 410, query rule); Decap with every collection.
- Add the zone to Cloudflare (DNS-only), change nameservers, wait for Active; attach `staging.theluxuryliners.com`.
- **Exit criteria:** the redirect suite passes on staging (675/675 rows give their expected result, 0 chains); the Decap zero-diff round trip passes; a test contact message arrives and the address appears nowhere in `dist/`; Carly's team drafts a test release on its own; the zone has been Active for at least 7 days.

### Phase 3: v1.0, "the authoritative core" — target launch 2027-03-01

- Everything marked v1.0 in §5.1, with approved copy (`approvals.json`), credits and captions; the Vault's first items (old sites, the journal months that have passed their privacy pass, the *Trunk Box* originals if approved, the IA recording embed if approved); JSON-LD, `llms.txt`, sitemap, statements.
- Handbook finished; training held; manual screen-reader pass (Carly's team, with the dd checklist, as in P43).
- Cutover (§7.2) **well before the 2027-03-19 domain renewal**; auto-renew confirmed.
- **Launch gates (all must pass):** accessibility (CI 1.0 everywhere plus the manual pass); contrast; redirects on production (smoke test of 20 random rows, 5 × 410, 3 unknown URLs); data and approvals; performance budgets; operations (zone Active ≥ 7 days, `www` → apex 301, contact tested, robots as agreed, handbook acceptance test passed). **Not blockers:** missing artwork (typographic placeholder), a photo without a credit (left out of its slot), unread archive pages (shown later).

### Phase 4: Authority push — launch to launch + 60 days

- Off-site edits in §8.5 (with the go-ahead); daviddewese.com references the new `@id`s; Search Console and Bing submitted; first post-launch AI audit; weekly 404 review.
- **Exit criteria:** Wikidata item live; MusicBrainz and Discogs edits accepted; AllMusic correction submitted; 0 new legacy 404s over 60 days; AI audit #2 logged against the baseline.

### Phase 5+: Depth layers (each starts when its trigger is met)

| Layer | Contents | Trigger |
|---|---|---|
| L1 Songs | A–Z index; song pages with writer credits, versions (demo, album, live), first-played dates from the journal, the "Baby Blue" and "Duke Of Gloucester" stories | Writer credits confirmed by David (B4) |
| L2 Lyrics | *Overbored* lyrics and chord charts from the 2003 site, then other albums | Lyrics transcribed in the browser pass; David's OK, and co-writers' where needed (V3) |
| L3 Story chapters | Split the Story into chapter pages with era openers | More material (interviews with David, Scott, Larry, Chad if willing) |
| L4 Full journal | Every month 2001–04, privacy-passed | Privacy pass done month by month |
| L5 Show archive | Shows 1997–2009 from `/history/concerts.html`, flyers, photos; venue index | Concert history page read; 25+ dated shows |
| L6 Audio Vault | *Live Liners*, *From The Vaults*, more *Trunk Box*, demos | David's files arrive (P29 pattern) and rights clear (§10 R9) |
| L7 Video | The 2006 videos, the 2001 Basement clips, the *Believe* EP enhanced-CD videos, captioned with transcripts | Files and rights; captions written |
| L8 30th anniversary (2027) | A "30 years" Story feature; a Vault release (e.g. *Trunk Box* restored) | David wants it |
| L9 Newsletter or updates | Only if the band wants and can sustain it | Owner decision (A4) |

---

## 10. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Name collisions** bury the site (ocean liners, Emmylou Harris, Carter Tanton, yacht charters) | High | High | "The Luxury Liners" + "band" in every `<title>`; disambiguation in HTML and JSON-LD; Wikidata item; consistent `sameAs` (§8) |
| R2 | **Privacy leak**: journal entries, old bios, press clippings and the profile of Chad carry private details | Medium | High | Privacy pass per month; `check-dist` bans the known strings; private rows have no Wayback link in the data; RD5 moves the URL out of the repo |
| R3 | **X1 leak** (a withheld credit and some third-party database relations; the specifics are kept with the team, not in this file) | Low | High | The placeholder never renders (RD11); dd's X1 word list ported into `check-dist`; David's Person node points to daviddewese.com, not MusicBrainz (`LL04` §4.2) |
| R4 | **The two sites disagree** (dates, writers, wording) | Medium | Medium | One source of truth for LL releases and a cross-site CI check (§7.3); shared canonical strings (§8.1) |
| R5 | **Owner time**: David and Carly are also finishing daviddewese.com | High | Medium | Before dd's M4 (2026-12-11) only asynchronous questions go out; the Phase 1 review and all build work come after M4; Phase 2's overlap with dd's M5 needs only one test release from the team (§9); every question has a safe default; exit criteria accept written defaults |
| R6 | **Wayback stays blocked** for scripted research | High | Medium | A human browser pass (Phase 0); launch does not depend on unread pages |
| R7 | **The site reads as a closed archive** (no photo newer than 2009 except two covers) | High | Medium | Wish-list #1 (a recent photo); status line; 2026 releases on the home page; the "never broke up" spine |
| R8 | **Cutover breaks the live site** (Carrd → Worker; Error 1000) | Low | High | The dd procedure; zone Active ≥ 7 days; Carrd stays live until the window; rollback = re-add the Carrd A record |
| R9 | **Rights for re-hosted audio and lyrics.** Cover-song MP3s on the old site (Cher's "Believe", Superdrag, the Lemonheads, Jetpack, Julie Miller, Big Star; the live "Luxury Liner" cover) would be free downloads of other writers' songs; lyrics of co-written songs need the co-writers' OK | Medium | Medium | Re-host **originals only** at launch; covers are listed with a DSP link (the *Believe* EP is on Spotify and Apple) or held until rights are checked (E5); lyrics only with approval |
| R10 | **Domain expiry** 2027-03-19 | Low | Very high | Confirm auto-renew in Phase 0 (dd QUESTIONS lists the same renewal) and again before cutover |
| R11 | **Photo quality**: the best four-piece photo is small (1096×848) and AI-enhanced; 150 Flickr originals are still rate-limited | High | Low | Sharper sources for engravings (`LL05` §5); `scripts/fetch-flickr-originals.sh`; ask for a non-AI scan |
| R12 | **No vector logo** | High | Low | Text wordmark in the chosen display face until files arrive; redraw only with OK (D2) |
| R13 | **Over-designing**: Nudie or poster pastiche, a "precious" museum tone | Medium | Medium | The "too precious?" review in Phase 1; motifs limited to a few uses per page |
| R14 | **Contested facts creep into copy as settled** (founding place, Chad's month, *Billboard*) | Medium | Medium | §4.3 table; `facts.json` `contested` flag; `check-dist` phrases |
| R15 | **A new release arrives mid-build** | Low | Low | The release form and the latest-release pin work from Phase 2 |
| R16 | **Duplicate content** between daviddewese.com's band and release pages and this site | Medium | Low | Different focus (David's story vs the band's); shared `@id`s; cross-links; Carly decides canonicals (A10) |

---

## 11. Open questions

All owner questions, in priority order with a proposed default for each, are in **`QUESTIONS-FOR-CARLY.md`**. The ones that shape this plan most:

1. **A1** Launch strategy: authoritative core first, then depth layers?
2. **A2** Design direction (after the Phase 1 samples).
3. **A3** Phase timing: start the build after daviddewese.com launches, and aim for a spring-2027 launch in the band's 30th year?
4. **A5** Separate repository from the daviddewese.com template?
5. **A7** `foundingLocation`: Nashville on both sites, or omitted on both?
6. **A11** Source of truth for Luxury Liners release data.
7. **B2** Who plays on the 2021 and 2026 recordings?
8. **C1** Consent of Chad, Scott and Larry.
9. **E1** Go-ahead for the off-site knowledge-graph edits.

---

## 12. Team and the gauntlet (how the rest of the work runs)

Every deliverable goes through a harsh critic who scores it out of 10; the approval bar is **8/10 with no blocking issues**; critiques are kept in `critiques/` as `<track>-round<N>.md`, and the worker revises until approved (see `README.md`).

| Next deliverable | Worker | Critic focus |
|---|---|---|
| `plan/00-master-plan.md` (this file) | PM | owner-decision conflicts, sourcing, feasibility, completeness against the brief |
| Research tidy (RD1–RD15) and browser-pass findings | each research track | every changed fact re-checked |
| `plan/10-story.md`: the Story copy, 9 chapters | storyteller | F4 framing, sourcing per sentence, privacy, tone ("too precious?") |
| `plan/11-design.md`: the three sample pages and tokens | design director | contrast, kinship with Duotone, real artifacts only |
| `plan/12-architecture.md`: repo, schemas, redirect rules, Worker, CI | lead engineer | the dd spike assertions repeated for this domain |
| `plan/13-accessibility.md` | accessibility reviewer | WCAG 2.2 AA map per component |
| `plan/14-red-team.md` | red team | cross-document conflicts, what breaks under neglect |

---

## 13. Discrepancies and open questions in this plan

| # | Topic | What conflicts | How this plan handles it |
|---|---|---|---|
| PD1 | `foundingLocation` | `LL04` §8.3's sketch sets Nashville (F4 says "1997 (Nashville)"); daviddewese.com omits it; the critic (footprint N4) advised omitting | Omitted on both sites until A7 is answered |
| PD2 | Legacy URL responses | The brief asks for "every legacy URL 301/410"; `LL03` marks 243 rows "none" (404 is correct) | 410 for the site's own retired files; 404 left only for Cloudflare's `/cdn-cgi/*` and generic bot probes, which were never the band's pages (§7.2) |
| PD3 | Where old band URLs should point | The daviddewese.com handover pack points them at daviddewese.com; `LL03` points them at this site (L1) | This site's paths; the dd pack is not pasted unless the build slips (A6) |
| PD4 | Release data ownership | Two `releases.json` files describe the same 7 releases; this project's has corrected writer credits | This project's file proposed as source of truth with a cross-site check (A11) |
| PD5 | Base today | Old blurbs say "Nashville-based"; David lives in Dallas (F3); members in several states | Never "Nashville-based"; base left as history unless Carly answers B11 |
| PD6 | The "Sound as ever" Gram Parsons link | Research notes it; intent unverified | The spine stands on the album title alone; the Parsons letter link is used only if David confirms (B6) |
| PD7 | Theme default | Duotone is dark by default (P35); Directions B and C are light by default | Decided with the direction (A2) |
| PD8 | 2008 Chad show | Known from one band-site home page read by the dd team (`LL03` §3.2) | Story uses it with attribution, or waits for the browser pass to read the 2008 news page |
| PD9 | "Sharp-dressed" | LL01 labels it owner wording; it is not (RD1) | Used here only as tone guidance, not as a quoted owner phrase |
| PD11 | Current membership | P8 names four "forever members"; F4 and P23 say Chad left in 2001; no source says who plays now | Never stated (§4.3); Chad's `endDate` 2001, none for Scott and Larry (§8.2); asked in B2 |
| PD12 | Emmylou Harris's album year | Wikipedia: 1976-12-28; MusicBrainz, chart year and first single: 1977 | No year by default; CI warns, does not fail (§7.4); daviddewese.com change offered as a suggestion (§8.5 #7) |
| PD13 | Schedule vs dd's milestones | Draft 1 claimed to avoid dd's launch window but ran Phase 1 across M3 and M4 | Phase 1 now starts after M4; Phase 2's overlap with dd's M5 is stated (§9) |
| PD10 | Story-chapter count | foxymorons.com plans 12 chapters; this band's material supports 9 | 9 chapters at launch; split later (L3) |

**Open questions raised by this plan:** see §11 and `QUESTIONS-FOR-CARLY.md` (not repeated here).

---

## Revision log

**Draft 2 (round 2), 2026-10-07**, answering `critiques/plan-round1.md` (7.5/10):

| Critique item | Change |
|---|---|
| **B1** (blocking): spine said all four forever members are still in the band | §4.1 item 2 rewritten: "forever" is the friendship; Chad left in 2001 (F4) and was not in the band in 2002 (P23); current membership open (B2). §5.3 status line no longer claims the four play together. New §4.3 row "Who is in the band now". New check-dist rule for "still members", "same four", "current line-up" near Chad's name (§7.4). PD11 added. B2 in the questions file now also asks who is in the band today |
| N1: Scott at the Foxymorons' first show | Chapter 3 now says Chad drove to Austin with David (`LL01` §4.2) |
| N2: schedule contradicted itself | Phase 0 runs to dd's M4; Phase 1 starts 2026-12-14 with its review in the week of 2027-01-11; Phase 2 moves to 2027-01-11 to 02-05 and its overlap with dd's M5 is stated; domain-date check added (§9); R5 and A3 updated; PD13 added |
| N3: half the questions lacked "why it matters" | Every Tier 3 and Tier 4 question in `QUESTIONS-FOR-CARLY.md` now has a "Why it matters" line and a "Proposed default" |
| N4: R3 pointed at the excluded person | R3 made generic; the questions file names no track number |
| N5: design contrast gaps | Direction C: the pair is ink/white; red is an accent (6.85:1), with `#9A0E16` (8.58:1) if red body text is wanted; dark tokens named (`#FF8A80` 8.27:1, `#7CC4F2` 9.92:1). Direction B dark: powder `#CFE3F2` links on oxblood (8.99:1). Failing figures stated, not hidden |
| N6: Emmylou year | §4.3 shows the year as contested with no year by default; CI rule is now a warning; the daviddewese.com change is a suggestion (§8.5 #7); PD12 |
| N7: unconfirmed `sameAs` | Instagram and Facebook moved to "after a human check", gated on E7 |
| N8: weak chapter title | Chapter 2 retitled "Powder-blue suits and the first recordings"; rule that titles carry only verified facts |
| N9: over-broad check-dist phrases | Phase rules marked † apply only outside `<blockquote>`, `<q>` and `data-quote` transcriptions |
| N10: membership in JSON-LD | §8.2 states the modelling is deliberate and cross-references B2 |
| N11: story claims | "Texans" cited to *Nashville Rage* 2001 and P21; "about 40 shows and trips logged in the band's journal" used in §1 and chapter 5 |
| N12: small items | README updated; RD table has a "Blocks" column (RD5 first); §13 no longer repeats §11's question list |
