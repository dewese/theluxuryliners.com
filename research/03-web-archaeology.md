# 03 — Web archaeology: theluxuryliners.com and The Luxury Liners online (1998 to today)

Track: **archaeology** · Worker draft, round 1 · Compiled 2026-10-07 for the theluxuryliners.com rebuild.
Gauntlet: this file goes to the critic (approval bar 8/10, no blocking issues); critiques live in `critiques/`.
Companion data file: `data/legacy-urls.json` (675 rows, one per archived URL; described in §10).

> **Authority order.** (1) Owner decisions, `/home/user/daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md` (`DEC`), beat everything. The ones that matter most here: **F4** David co-founded the band with Chad Edgington in 1997; Chad left Nashville in 2001 and David carried on. **P5** isawtheocean.com has expired: never link it. **P8** forever members. **P22/P23** the 2002 four-piece photo is never "the 2002 line-up". **P27** "Shake It Up" is an original, first released on the *Believe* EP. **L1** the band keeps its own site. **X1** one 1990s side project and its person are left out of every file; nothing here mentions them. (2) The band's own words on its old site. (3) Databases and press. (4) Search snippets: leads only.
>
> **Privacy.** People appear in their public band roles only. The old site holds private material: mailing addresses and a phone number (2000 bio, mail-order pages), family members named in press clips, and at least one private family page. This file points at those pages so nobody republishes them by accident. It does not repeat the details (§12).
>
> **Quotations.** "Verbatim" means the source's words, spelling and capitalisation. Curly quotes are printed straight, and source misspellings are marked [sic]. Almost all old-site quotations come through the daviddewese.com team's reading of the Wayback Machine on 2026-09-28 (`R04`), because the Wayback Machine is blocked from this session (§0.2).

---

## 0. How to read this file

### 0.1 Labels and source keys

| Label | Meaning |
|---|---|
| **confirmed-owner** | In `DEC` (Carly speaking for David). Final. |
| **verified-source** | Read first-hand: the band's archived site (via `R04`), the Wayback CDX index, a database API record, or a live page fetched this session. |
| **single-source** | One secondary source read first-hand, nothing to confirm it. |
| **unverified** | Snippet, inference or lead. Do not publish without checking. |

| Key | Source |
|---|---|
| `DEC` | `/home/user/daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md` |
| `R04` | `/home/user/daviddewese.com/daviddewese-com/research/04-live-sites-and-archive.md` (§3 live site, §5 Wayback history, §6 redirects). Its Wayback quotes were read in raw `id_` mode on 2026-09-28. |
| `SI` | `/home/user/daviddewese.com/daviddewese-com/data/site-inventory.json` (`wayback_eras`, `sites`, `redirect_map`): the structured notes behind R04 |
| `CDX` | `/home/user/daviddewese.com/daviddewese-com/research/legacy/cdx-theluxuryliners.com.json`: the Wayback index, 675 URLs (header + 675 rows), collapsed by urlkey, so each row is that URL's **first** capture |
| `HO` | the daviddewese.com handover pack: `architecture/redirects/ll-legacy-urls.json` (276 paths), `ll-carrd-redirects.txt` (81 lines), `ll-bulk-redirects.csv` (72 rows), and `architecture/ARCHITECTURE.md` §4.1, §4.6, DNS table |
| `VAULT` | `/home/user/daviddewese.com/daviddewese-com/site/data/vault.json` (the daviddewese.com Vault entries for the band) |
| `LIVE` | curl of https://theluxuryliners.com this session, 2026-10-07 (home page, headers, and every one of the 675 archived paths) |
| `IA` | Internet Archive item metadata, fetched this session: `https://archive.org/metadata/TheLuxuryLiners` and `https://archive.org/metadata/lliners2003-06-19.at853.shnf` |
| `MB` | MusicBrainz API, artist `7af7fd54-1d1b-4353-ab60-4b61bceed337` with url-rels, fetched this session |
| `DG` | Discogs API, artist 4298743 and its releases, fetched this session |
| `MS` | https://myspace.com/theluxuryliners, fetched with curl this session |
| `FL` | https://www.flickr.com/photos/dewese/collections/72157600177972175/ (David's Flickr collection "The Luxury Liners"), fetched this session; plus `/home/user/daviddewese.com/daviddewese-com/data/photos.json` |
| `YT` | YouTube oEmbed for video `V6h-vFJfRjI`, fetched this session; `R02` §b for the band channel |
| `SP` / `AP` | Spotify artist page (curl) and the iTunes lookup API for artist 47333263, this session |
| `R02`, `R05` | daviddewese.com research 02 (artist story, links, IDs) and 05 (Foxymorons history, with the 2001 *earpollution* interview) |
| `LL01`, `LL02` | sister files in this project: `research/01-band-history-and-people.md`, `research/02-discography.md` |

### 0.2 What this session could and could not reach (tried once each, 2026-10-07)

| Host | Result | Consequence |
|---|---|---|
| web.archive.org, wayback.archive.org | curl: connection reset by peer; WebFetch refused | **No new Wayback reads.** Old copy comes from `R04`/`SI`; §11 lists what a human should open |
| archive.org/wayback/available (http) | 403 "Host not in allowlist" (https gave 429 once) | no Wayback availability lookups |
| archive.ph, timetravel.mementoweb.org, arquivo.pt, webarchive.loc.gov | refused, 502, 403, Cloudflare challenge | no alternative mirror worked |
| **theluxuryliners.com** | **curl 200** (WebFetch refused) | the live site and all 675 legacy paths were checked first-hand (§8, §10) |
| **archive.org (https) metadata and search APIs** | **200** | **new find: the band's Live Music Archive collection** (§5.3) |
| musicbrainz.org API, api.discogs.com | 200 | link and member records (§9) |
| myspace.com, flickr.com, open.spotify.com, music.apple.com, itunes.apple.com, youtube.com/oembed | 200 | profile facts (§9) |
| last.fm, daviddewese.bandcamp.com | 200 but a JavaScript "Client Challenge" page | no content |
| allmusic.com, discogs.com (web), nashvillescene.com, tennessean.com | 403 | press pages unread (see `LL01` §11 for the press list) |
| litterbugrecords.com, isawtheocean.com | no connection (000) | no label site found; isawtheocean.com is not linked anywhere (P5) |

WebSearch worked but returned little for this band. Several of its summaries described pages that, when fetched, never mention the band (earcandymag.com "Reviews-June 2000", a gullbuy.com 2005 review, a Substack power-pop list). They are **not** used as evidence.

---

## 1. Summary

- **The domain is older than the site.** theluxuryliners.com was registered on **1998-03-20** at GoDaddy (Verisign RDAP, read by the daviddewese.com architecture lead on 2026-09-28; `HO` ARCHITECTURE.md DNS table). The Wayback Machine's first capture is **2000-04-07** (`CDX`). Verified-source.
- **Seven design eras, 2000 to today** (§2): a FrontPage site (2000); a blue table-layout site with a journal (Oct 2000 to early 2002); a khaki photo-collage frame with lyrics, press, galleries and a history section (2002–04); a red rotating-photo splash with a long MP3 list (late 2004–05); a white logo page that became an echomusic CMS with a store (late 2005–09); a bare link list and later a hand-coded page (2009–Sept 2024); and the current one-page Carrd (Oct 2024–). echomusic designed, hosted and powered the site from 2000 to about 2009 (`R04` §5.1; `SI`).
- **The old site held a lot that is worth bringing back** (§3–§6): a 2000 bio, a 2005 band history and member roster, the *Overbored* one-sheet and PDF, about 30 dated press quotes, *Overbored* lyrics and chord charts, a **band journal of 33 monthly archives (June 2001 – March 2004)**, 18 photo galleries (about 180 photo pages) plus 16 dated history photos (1997–2000), and **free audio**: 4 *Trunk Box* MP3s (1998 live, archived 2001), 11 MP3s archived in 2005–07, and 4 RealAudio clips (2001).
- **New finds (round 1):** an **Internet Archive Live Music Archive collection** the band opted into on 2003-06-23, holding the French Quarter Cafe, Nashville, 2003-06-19 show with downloadable MP3s (§5.3); the band's **MySpace** shell (Nashville, TN; 2,279 connections) linked from MusicBrainz (§9); David's **Flickr collection** of 13 band photo sets (§9); the Carrd YouTube button's **2001 Basement live clip** (§8); **13 e-mail newsletters, 2002–04**, dated from `/email/` file names (§7); and evidence that the **"sxsw" and "capitol" galleries date from 2001 or earlier**, so "capitol" is not the July 2002 DC trip (§3.8, §13 W2).
- **Live status of every legacy URL** (2026-10-07): 630 × 404, 6 × 403, 39 × 200 (the home page, `/index.html`, robots/sitemap, three Carrd images, Cloudflare's e-mail script and 31 query-string URLs that Carrd answers with the home page) (§10).
- **The legacy URL inventory is complete for what the Wayback Machine holds** (§10, `data/legacy-urls.json`). 300 rows get a 301, 17 should be re-hosted at the same path (MP3s and press downloads), 32 are query-string URLs that need a Worker or redirect rule, and 243 need no rule. Targets are **provisional** paths on the new theluxuryliners.com. The daviddewese.com handover targets are kept alongside for traceability, but L1 means the band's archive now belongs on the band's own site.
- **Biggest gaps** (details in §11 and §13): the band's own **concert history page** (`/history/concerts.html`, archived 2003-06-07) has never been read; neither have the **2000 news and events pages**, the **2007–08 echomusic news and bio**, **three journal months** (2001-07, 2003-11, 2003-12), the **lyrics** (never transcribed), the **one-sheet PDF**, or the **2004 splash pages**. The Wayback Machine's **later** captures of each URL are unknown, because the CDX pull kept only first captures.

---

## 2. Design eras of theluxuryliners.com

Era boundaries come from `R04` §5.1 and `SI` (sampled homepage captures), refined with the first-capture dates of era-specific files in `CDX`. A file's first capture can lag its creation by months, so the boundaries are approximate. Every row is verified-source unless marked.

| Era | Dates | Design (as read by R04/SI) | Evidence in CDX (first captures) | Sample snapshots |
|---|---|---|---|---|
| **E1 FrontPage** | Apr–Sep 2000 | Microsoft FrontPage 4.0; white page; GIF title and button images; circle-cropped member photos | `/biography.htm` 2000-04-07; `/events.htm`, `/mail_list.htm`, `/_vti_bin/shtml.exe/mailing_list.htm` (FrontPage form) 2000-06-05; `/news.htm` 2000-08-23; `/bio.htm`, `/merch.htm`, `/photos.htm`, `/images/gif/*` (Merch, Photos, title_with_logo, newstiny, videostiny) 2000-09-26; `/images/jpg/Echologo.jpg` 2000-09-26 | [20000407063254](https://web.archive.org/web/20000407063254/http://theluxuryliners.com/), [bio.htm 20000926003543](https://web.archive.org/web/20000926003543/http://www.theluxuryliners.com/bio.htm) |
| **E2 Blue table layout** | Oct 2000 – Mar 2002 | Table layout on `#336699`; image nav; rotating 263×321 band photos; tagline "el rock band de mucho luxurious"; footer "design • maintenance • commerce by echomusic" | `/index.html`, `/band.html`, `/music.html`, `/press.html`, `/mail_list.html` 2000-10-22; `/albums.html`, `/contact.html`, `/multimedia.html` 2001-03-11; nav GIFs `/images/nav/go_{albums,band,email,journal,links,luxlist,message,misc,news,photos,press}.gif` 2001-06 to 2001-12; `/journal.html`, `/links.html`, `/misc.html`, `/email.html` 2001-07-11; `/mp3/waco/*` and `/ram/*` 2001-06-15; `/images/rotating/*` 2001-12-22 | [20010308175130](https://web.archive.org/web/20010308175130/http://theluxuryliners.com/), [20020122083859](https://web.archive.org/web/20020122083859/http://theluxuryliners.com/), [albums.html 20011212092215](https://web.archive.org/web/20011212092215/http://theluxuryliners.com/albums.html) |
| **E3 Khaki photo-collage frame** | Apr 2002 – Sep 2004 | Collage frame in khaki `#d2d0BB` / `#6b675e`, content in an iframe (`splash.html`); nav: news, music, data, photos, misc, journal, contact | `/images/picture_top.jpg`, `/main.css` 2002-04; `/data.html`, `/news.html` 2002-06-09; `/downloads/luxuryliners300dpi.jpg` 2002-06-16; `/archives.html`, `/content.css` 2002-08-08; `/splash.html` 2002-10-04; `/downloads/luxury_liners_onesheet.pdf` 2003-04-14; `/lyrics.html`, `/history/*` 2003-06; `/bios.html` 2003-09-13; most `/photos/<set>/` pages 2003–05 | [20030523111724](https://web.archive.org/web/20030523111724/http://theluxuryliners.com/) |
| **E4 Red rotating-photo splash** | Sep 2004 – Nov 2005 | Full-window rotating photo on red `#C20000`; long list of MP3 links (album tracks, live/acoustic, covers, unreleased) | `/images/splash_larry_enter.gif`, `/images/splash_larry_singing.jpg` 2004-09-28; `/index4.html` 2004-10-10; `/history/photos/*` 2005-01-19/20; `/images/redsplash/rotate.php` 2005-02-04; `/luxuryliners.html` 2005-02-04; `/images/03012005/rotate.php` 2005-03-05; `/mp3/*.mp3` 2005-11-05 | [20050305090711](https://web.archive.org/web/20050305090711/http://theluxuryliners.com/) |
| **E5 White logo page, then the echomusic CMS** | Dec 2005 – Jun 2009 | White page, `logo.jpg` 450×58, text nav NEWS / MUSIC / BIO / PHOTOS / MYSPACE / CONTACT; footer "©1997-2006 The Luxury Liners \| Powered by echomusic". From Aug 2007 the pages run on a query-string CMS (`/?content=bio`, `news`, `music`, `album&album=…`, `photos`, `mailinglist`, `mailorder`, `contact`) with a Flash photo gallery and a store | `/images/luxuryliners2005_{band.jpg,logotop.gif,logobot.gif}` 2005-12-15; `/images/albums_between.jpg` 2006-02-07; `/css.css`, `/images/logo.jpg`, `/swf/gallery.swf`, `/xml/photos.php`, `/scripts/securityImage.php` (mailing-list captcha), `/client_images/luxuryliners/*`, all `/?content=` URLs 2007-08-23 to 2007-11-14; `/store` 2007-11-19; `/store/cat/LuxuryLiners`, `/store/product/5/Nonetheless` 2008-09-30; `/go/?` 2008-10-12 | [20070205211156](https://web.archive.org/web/20070205211156/http://theluxuryliners.com/), [20090105172729](https://web.archive.org/web/20090105172729/http://theluxuryliners.com/) |
| **E6 Link list, then a hand-coded page** | Jul 2009 – Sep 2024 | A bare link list (2009–22). In 2012 it read "The band is currently going by the name "David Dewese."". April 2024: a hand-coded page in Archivo Black and Lexend Deca with SVG social icons; its `og:image` was `/images/jumping.jpg` and its `og:description` wrongly described the Foxymorons | `/css/theluxuryliners.css`, `/images/jumping.jpg` 2009-07-22; `/images/_big_background_gradient.jpg`, `/images/wall_background.jpg` (both 404) 2013-06-05; `/style.css`, `/images/icon-{apple,instagram,spotify,youtube}.svg` 2024-07-26 | [20120521212708](https://web.archive.org/web/20120521212708/http://theluxuryliners.com/), [20200814053240](https://web.archive.org/web/20200814053240/http://theluxuryliners.com/), [20240415061227](https://web.archive.org/web/20240415061227/http://theluxuryliners.com/) |
| **E7 Carrd** | 15 Oct 2024 – today | One-page Carrd link-in-bio, white, two columns (§8) | `/cdn-cgi/l/email-protection` 2024-11-03; `/assets/images/*` 2026-06-27 | [20241103070211](https://web.archive.org/web/20241103070211/http://theluxuryliners.com/), live |

**Notes on the eras**

- **Captures per year** (first captures in `CDX`): 2000 29 · 2001 97 · 2002 51 · 2003 133 · 2004 62 · 2005 154 · 2006 1 · 2007 78 · 2008 4 · 2009 2 · 2013 2 · 2021 41 · 2024 17 · 2026 4. Of the 675 rows, **311 are status-200 HTML, audio or PDF** (matching `R04` §5); 534 rows are 200, 137 are 404, two are 301 and two are revisits.
- **The 2021 burst (41 rows)** is a crawl of old newsletter images and MP3 links found elsewhere on the web, all 404 by then. It is not a new design.
- **E5's CMS album IDs.** Album `88761` carries 12 track IDs (`em1886=88765 … 88901`). *Nonetheless* has 12 tracks, so 88761 is probably *Nonetheless*. Albums 88939, 88940 and 88941 are probably the other three records. This is an inference: unverified.
- **echomusic.** echomusic (Mark Montgomery's Nashville company, which co-produced *Sound As Ever* and produced the *Believe* EP: `LL02`) built and hosted the band site from 2000 to about 2009 (footers in E2 and E5; `/images/jpg/Echologo.jpg` 2000; `/client_images/` and `/go/` paths in E5). In 2005 David himself said "I make webpages at echomusic" (`R04` §4.2). echomusic.com still answers (200) today; who owns it now was not checked.
- **The site also hosted a Foxymorons page.** `/foxymorons/list.html` (archived 2002-12-07), with its own CSS and a "labels_foxylist" image, was The Foxymorons' mailing-list page on this domain (`CDX`; verified-source that it existed; content unread).

---

## 3. What the old site contained, section by section

"Read" means `R04`/`SI` opened the capture on 2026-09-28. "Unread" means nobody on either project has opened it yet (all are in §11).

### 3.1 Bios and history

| Page | First capture | What it holds | Read? |
|---|---|---|---|
| `/biography.htm` | 2000-04-07 | E1 bio (FrontPage) | Unread |
| `/bio.htm` | 2000-09-26 | The 2000 bio: "caricature lunch box" opening; members Chad, David, Scott; quotes from each; the *Billboard* "buzz-bin article" | **Read** (§4.1). Holds an old mailing address and phone number (§12) |
| `/band.html` | 2000-10-22 | E2 band page | Unread |
| `/data.html` | 2002-06-09 | "data": the *Overbored* one-sheet bio and member "data" profiles (gear, favourites) | **Read** in part (opening quoted, §4.4) |
| `/bios.html` | 2003-09-13 | Member bios, 2003–05 | Opened by SI (2005-04-25 capture) but not quoted |
| `/history/index.html`, `/history/intro.html`, `/history/story.html` | 2003-06 to 2004-03 | History hub; intro ("invented 'Texas Pop'"); the member roster with tenures | **Read** (§4.3) |
| `/history/photos.html` + 16 files `/history/photos/{97,98,99,00}_*.jpg` | 2003-06-08; files 2005-01-19/20 | Dated photo history 1997–2000. File names: 97_12th_porter, 97_opry, 97_pajamas, 98_hard_rock, 98_waco, 99_12th_serious, 99_green_jackets, 99_session_guitars, 00_chad, 00_scott, 00_coverone, 00_dancing, 00_hearseespeak, 00_photoshoot, 00_sitting, and one more 2000 file whose name needs checking before any reuse (§12) | Page unread; images archived |
| `/?content=bio` | 2007-11-12 | The 2006–09 echomusic bio | Unread |

### 3.2 News

| Page | First capture | Read? |
|---|---|---|
| `/news.htm` | 2000-08-23 | Unread |
| `/news.html` | 2002-06-09 | Unread |
| `/?content=news` and the dated news archives `?em1884=…_08_2007`, `_10_2007`, `_11_2007`, `_09_2008` | 2007-08-23 to 2008-09-26 | Unread. The homepage captures show the content: the 2006 year-end lists, *Nonetheless* on iTunes (Dec 2006) and at Grimey's, and the Nov 2008 news of David's solo album, with Chad Edgington ("1997-2001") joining him for a Texas CD-release show (`SI`) |

### 3.3 The band journal, June 2001 – March 2004

A Blogger-style journal: a front page (`/journal.html`, 2001-07-11), an archive index (`/archives.html`, 2002-08-08), and **33 monthly archives that the Wayback Machine holds as 200** (`/<yyyy>_<mm>_01_archives.html`). Three early months also exist under `/blogs/` (archived 2001-08-25). Months after March 2004 were requested but never existed (404). Full month-by-month list with exact capture links: §6.

### 3.4 Shows

- `/events.htm` (2000-06-05): the E1 events list. **Unread.**
- `/history/concerts.html` (2003-06-07): **the band's own concert history**, probably 1997–2003. **Unread. Highest-value page on the domain** (§11).
- The 2001–04 journal names about 40 shows and trips (`R04` §5.2 table; reused in `LL01` §7).
- New this pass: the **2003-06-19 French Quarter Cafe** recording (§5.3) and the newsletter dates in §7.

### 3.5 Music, albums, store

- `/music.html` (2000-10-22), `/albums.html` (2001-03-11; read at 2001-12-12), `/history/music.html` (2004-03-31; read at 2005-03-21): album notes for *Sound As Ever*, the *Believe* EP and *Trunk Box*; compilation appearances; *Live Liners* and *From The Vaults* (§4.5).
- `/merch.htm` (2000-09-26): merch. Unread. The E2 nav also had "tshirts" (`SI`).
- `/?content=music`, `/?content=album&album=…`, `/?content=mailorder` (2007): the CMS music and mail-order pages. Unread. Mail-order text holds an old address (§12).
- `/store`, `/store/cat/LuxuryLiners`, `/store/product/5/Nonetheless` (2007-11 to 2008-09): the echomusic store. Unread.

### 3.6 Lyrics

`/lyrics.html` (first capture 2003-06-04; read at 2005-04-25): full lyrics and **chord charts** for *Overbored* ("Sunshine", "Dreaming", "Overbored", "Waiting For The Sun", "Woman", …), plus the *Believe* EP and *Sound As Ever* track lists (`R04` §5.2). **Never transcribed.** It needs a human to copy it out (§11), and David's OK to republish lyrics he did not write alone.

### 3.7 Press

- `/press.html` (first capture 2000-10-22; read at 2005-12-25): about 30 dated quotes, 2001–04 (`R04` §5.2; the positive ones in §4.6). The 2000 version is unread.
- `/downloads/luxury_liners_onesheet.pdf` (2003-04-14): the *Overbored* one-sheet PDF. Archived as 200; contents unread.
- `/downloads/luxuryliners300dpi.jpg` (2002-06-16): a 300 dpi press photo. Archived as 200.

### 3.8 Photos

- `/photos.htm` (2000-09-26) and `/photos.html` (2001-06-07): the index pages.
- **18 galleries** under `/photos/<set>/<n>.html` (about 180 pages and 79 image files archived). No photo credits on the pages (`R04`).

| Set | Pages / images archived | Earliest capture of anything in the set | Note |
|---|---|---|---|
| sxsw | 8 / 5 | 2001-06-24 (thumbnail) | So these are **SXSW 2001 or earlier** (the SESAC showcase CD is from SXSW 2001: `DG` 8057090) |
| trio | 11 / 6 | 2001-06-24 | |
| studio | 6 / 3 | 2001-06-22 | |
| capitol | 12 / 5 | 2001-08-25 | **Older than the July 2002 DC trip** that `R04` linked it to; subject unknown |
| live | 5 / 1 | 2001-08-26 | |
| misc | 9 / 3 | 2001-08-26 | |
| live2 | 5 / 5 | 2002-04-04 | |
| dancin | 9 / 4 | 2002-06-16 | Probably "Dancin' in the District", 2002-05-23 (journal); unverified |
| july_02 | 5 / 1 | 2002-10-23 | |
| dancin_02 | 13 / 4 | 2002-12-07 | |
| random_02 | 19 / 6 | 2003-04-15 | |
| atlanta_02 | 11 / 5 | 2003-06-04 | Aug 2002 Atlanta trip (journal) |
| misc_5-03 | 12 / 4 | 2003-09-25 | |
| recording_7-03 | 12 / 3 | 2003-09-27 | July 2003 recording sessions (the *Nonetheless* era? unverified) |
| rocketown_4-03 | 11 / 4 | 2003-09-28 | Rocketown, Nashville, late Apr 2003 (journal) |
| various_live_03 | 8 / 2 | 2003-09-30 | |
| detroit_3-03 | 5 / 1 | 2003-11-03 | Michigan trip, late Mar 2003 (journal) |
| columbia_10-03 | 19 / 1 | 2003-11-10 | Columbia SC, early Oct 2003 (journal); camera-named pages (`DSC031xx`) |

- E5 had a Flash gallery (`/swf/gallery.swf` fed by `/xml/photos.php`, 2007). Unread.
- The current Carrd photos (a white-seamless studio shoot) and `/images/jumping.jpg` (2009) are the same shoot (`R04` §3.3). Photographer unknown.

### 3.9 Audio and video

Free MP3s, RealAudio clips and the *Trunk Box* live album: §5. `/multimedia.html` (2001-03-11) held the multimedia page: probably the *Believe* EP enhanced-CD content ("It's You" video, interview video). Unread. `/images/movie_dreaming.jpg` (2002-06-16) suggests a "Dreaming" video was offered in 2002 (unverified).

### 3.10 Contact, mailing list ("luxlist"), message board, links, misc

- Contact: `/contact.html` (2001-03-11), `/email.html` (2001-07-11), `/?content=contact` (2007). Mailing list: `/mail_list.htm` (2000), `/mail_list.html` (2000-10-22), `/?content=mailinglist` (2007, with a captcha). The E2 nav button was "luxlist".
- The E2 nav also had a **"message"** button (`go_message.gif`, 2001-06-11): probably a message board or guestbook, hosted elsewhere. No message-board URL is in the CDX. **Unread / location unknown.**
- `/links.html`, `/misc.html` (2001-07-11): unread.
- One 2002 page (`/ethan.html`) is a family page. It is private: never republish it (§12).

### 3.11 Images to request from David in original resolution

Carried over from `R04` §7 ("reusable assets") and checked against `CDX`. The archived copies are small web files; the new site should use David's originals. Photographer credits are unknown for all of them (§13 Q7).

| Image | Old URL (first capture, CDX status) | What it is | Ask for |
|---|---|---|---|
| *Believe* EP cover | `/images/believe_cover.jpg` (2001-06-02, 200) | The 2001 EP cover as shown on the E2 albums page | the original cover art file |
| Album thumbnails | `/images/music_believe_75.jpg`, `/images/music_overbored_75.jpg` (2003-10-07, 200); `/images/music_sound_as_75.jpg` (2021-02-14, 404: never archived) | 75 px cover thumbnails from the E3 music page | full-size *Sound As Ever*, *Believe*, *Overbored* covers (`LL02` has the cover status) |
| "Jumping" studio shot | `/images/jumping.jpg` (2009-07-22, 200); the same shot is the Carrd `image02.jpg` (2026-06-27, 200) and the 2024 `og:image` | White-seamless studio shoot, the band mid-jump | the full shoot |
| "Seated" and "cartwheel" shots | Carrd `share.jpg` (seated); the cartwheel frame is named in `R04` §7 but no file with that name is in `CDX` | Same white-seamless shoot | the full shoot (one request covers all three) |
| 2005 band photo | `/images/luxuryliners2005_band.jpg` (2005-12-15, 200) | E5 home-page band photo | original |
| E2 rotating photos | `/images/rotating/{1,2,5–8,11–15}.jpg` (2001-12-22, 200; 9, 10, 16 were 404) | The 263×321 rotating band photos, 2001–02 | originals, with dates and who is in each |
| E4 splash | `/images/splash_larry_singing.jpg`, `/images/splash_larry_enter.gif` (2004-09-28, 200) | The red-splash "Larry singing" photo | original |
| 300 dpi press photo | `/downloads/luxuryliners300dpi.jpg` (2002-06-16, 200) | 2002 press photo (P22/P23 caption rule applies if it is the four-piece photo: never "the 2002 line-up") | original and credit |
| History photos | `/history/photos/{97,98,99,00}_*.jpg` (2005-01, 200) | Dated 1997–2000 photos (§3.1) | originals and captions, **except** the one flagged `sensitive-image` (§12), which needs owner review first |

---

## 4. Old copy worth preserving (verbatim where it has been read)

All rows are verified-source **as the band's own words**, via `R04`/`SI`. Use them only with Carly's OK. Where an archive account conflicts with an owner decision, the decision wins in site copy; the archive text can appear only as a dated quotation in the Vault, labelled as such.

### 4.1 The 2000 bio (`/bio.htm`, [20000926003543](https://web.archive.org/web/20000926003543/http://www.theluxuryliners.com/bio.htm))

> "How many times do you come across a rock band whose ultimate career goal is a caricature lunch box? Meet the Luxury Liners, an original pop band with the drive and potential to conquer the world, armed with all the spontaneity and charm of a 3-piece rock combo."

Also in the bio: the band's live show earned "a buzz-bin article in industry giant Billboard magazine" (the item itself is unseen; `LL01` D5). And Scott: "We always try to look sharp when we hit the stage, to show the audience we take a lot of pride in what we're doing." **Unread remainder:** the rest of the bio and the Chad and David quotes (`SI`). Strip the address and phone (§12).

### 4.2 E2 lines (2001)

- Tagline: "el rock band de mucho luxurious".
- Footer: "design • maintenance • commerce by echomusic".

### 4.3 The 2005 history intro and roster (`/history/intro.html` [20050826054452](https://web.archive.org/web/20050826054452/http://theluxuryliners.com/history/intro.html); `/history/story.html` [20050321225706](https://web.archive.org/web/20050321225706/http://theluxuryliners.com/history/story.html))

> "In 1997, college senior Chad Edgington vowed to win his school's annual talent show by putting together "the greatest band of all time". He called upon all of his musical friends, named the band The Luxury Liners, and did indeed win the contest. Later that spring he and his college pal David Dewese resurrected the name, invented "Texas Pop", and moved to Nashville, Tennessee to "get famous"."

**Contested against F4.** The owner decision is that **David co-founded the band with Chad in 1997** (confirmed-owner). This text is an archive record only: never use it as the origin story (`LL01` D1, Q1).

Roster as printed in 2005 (public band roles only):

| Member | Role | Tenure (as printed) |
|---|---|---|
| Chad Edgington | guitar, bass, vocals | Feb 1997 – Apr 2001 |
| David Dewese | guitar, bass, vocals | May 1997 – current |
| Scott Carpenter | drums | Aug 1998 – current |
| "Larry" Wilstermann | bass | Dec 2000 – current |
| Jeff LaFrate | drums | Jun 1997 – Apr 1998 |
| Mark W. Winchester | bass | Dec 1997 – Apr 1998 |
| Kyle Edgington | drums | May – Aug 1998 |
| Scott Jeffries | Tamborine [sic] | Jun 1997 (one show) |

The "David from May 1997" tenure conflicts with F4 (co-founder). Site copy follows F4.

### 4.4 The *Overbored* one-sheet (`/data.html`, [20050308093846](https://web.archive.org/web/20050308093846/http://www.theluxuryliners.com/data.html))

> "Roll down the windows, drop the top, turn up the radio and step on the gas. OVERBORED, the new release by The Luxury Liners, may just be the perfect CD for traveling up the 5 from San Diego to L.A. …"

The rest of the one-sheet, the member "data" profiles, and the PDF version (`/downloads/luxury_liners_onesheet.pdf`, [20030414032936](https://web.archive.org/web/20030414032936/http://theluxuryliners.com/downloads/luxury_liners_onesheet.pdf)) are unread.

### 4.5 Album notes (albums.html 2001, history/music.html 2005)

From `R04` §5.2 and `SI` (paraphrased there; the exact wording needs the captures):

- *Sound As Ever*: Litterbug Records, May 2000; produced by Mike Poole and Mark Montgomery; "three unreleased hidden bonus tracks".
- *Believe* E.P.: echomusic, 2001; enhanced CD ("It's You" video, interview video, desktop images); produced by Mark Montgomery, mixed by Shane D. Wilson.
- *Trunk Box*: live MP3 album, fall 1998, E-Cleff Studios, Waco TX; "scott's first offical [sic] gig"; 11 tracks, including "Trans-Am Mind" and "Araby", which are on no other record.
- Compilations: *Fireworks, Volume 2* (Sound Asleep, 1998: "Since You Met Me", "Think She's Coming Around") and *Nashpop* (Notlame, 1998: "If I Cry").
- *Live Liners*: 12th & Porter, 18 Jul 2002, and an acoustic set on 17 Nov 2002.
- *From The Vaults*, 1997–2001.

### 4.6 Press quotes (`/press.html`, [20051225072849](https://web.archive.org/web/20051225072849/http://www.theluxuryliners.com/press.html))

Positive excerpts only; link the source. Verbatim with attribution as printed (`R04` §5.2):

- *Performing Songwriter* 7-04 (—LN): "Overbored … is a must-have for all power pop fans."
- *Metroland* 6-03, Erik Hage: "'Waiting for the Sun' … is drop-dead perfect pop-rock (and the best song here) … This is one of my favorites of the year."
- *Nashville Rage* 10-03, Todd Anderson: "The bittersweet trio of Woman, Equasue and Fifteen Again really push the album into the pantheon of tremendous local songwriting."
- *Nashville Rage* 7-02: "…the best (and best dressed) purveyors of pop in Nashville."
- *Nashville Rage* 4-02: "Excellent power pop with the tongue-in cheek wiliness of Cheap Trick and the underlying violence of Big Star."
- *Nashville Rage* 9-01: "Former Texans who craft stylish Americana pop as if the Byrds had arisen in a post-alternative rock world."
- *All Music Guide* 9-01, Erik Hage: "Named after a Gram Parsons song, the Luxury Liners were originally intended as an alt-country outlet for Foxymorons member David Dewese … the group ended up more as a guitar-crunchy power pop band that called to mind classic acts like Big Star, Badfinger, and the Raspberries." (Contested framing against F4: quote only with the co-founder line beside it.)
- *Kool Kat* 7-03: "Brand new full-length effort from one of our favorites!"
- Also listed (not quoted by R04): CCM 4-02; Splendid 10-03; Lost At Sea 10-03; Southeast Performer 9-03; Impact Press 8-03; Aiding and Abetting 8-03; Nashville Scene 1-04, 7-02, 10-01; Tennessean 12-01 (style profile); Nashville Scene 7-01 profile "Catching Up Fast" (it names members' family: §12).
- Year-end lists on the 2007 home page: *Absolute Power Pop*, Top 100 Releases of 2006 (#100); *Carligula*, Top Five Nashville Releases of 2006 (#3).

### 4.7 The 2004–05 MP3 list (red splash, [20050305090711](https://web.archive.org/web/20050305090711/http://theluxuryliners.com/))

Covers and unreleased songs (`R04`; `SI`): "Lead Me On" (Jetpack), "Baby's Waiting" (Superdrag), "Purple Parallelogram" and "Ride With Me" (The Lemonheads), "Manger Throne" (Julie Miller), "Jesus Christ" (Big Star); demos of **"New Beginning", "Great Day", "Shake It Up", "Fall Awake"** and **"Breakaway"**.

**Why this matters:** "Great Day" and "New Beginning" are the band's 2026 singles (F6). `SI`'s reading of this page puts both titles on the band site **by March 2005**, earlier than the 2008 "Great Day" demo in `LL01`/`LL02`. Single-source (one reading of one capture): confirm with David that they are the same songs before telling that story. "Shake It Up" here is a demo or live take; it does not change P27 (first **release** on the *Believe* EP, 2001).

### 4.8 Journal lines (from `R04` §5.2; verbatim fragments)

"our Memphis debut" (June 2001) · "the new three piece configuration" (Aug 2001) · "the boring acoustic guy" (David's first solo show, Sept 2001) · "we lost a little money" (first Ohio/Michigan trip, Sept 2001) · "all of nevada was rocked last friday night" (House of Blues, Las Vegas, May 2002) · "we didn't win" (a battle of the bands, July 2002) · "pretty darn rockin, which was strange after so many acoustic shows" (2003-06-19) · "yesterday's show was yet again good stuff" (Oct 2003) · "our first show of 2004". The posts also mention a 2002 "west coast tour with the foxymorons" and Scott touring as Ginny Owens's drummer in April 2002.

### 4.9 Later lines

- 2006–09 footer: "©1997-2006 The Luxury Liners | Powered by echomusic".
- 2012 home page: "The band is currently going by the name "David Dewese."" ([20120521212708](https://web.archive.org/web/20120521212708/http://theluxuryliners.com/)). What it meant is an open question (`LL01` Q13).
- April 2024 `og:description`: "Texas-based musical duo of Jerry James and David Dewese". **A copy error** (that is the Foxymorons): do not reuse.
- Current Carrd (§8): "Forever brosephs that formed in 1997 and have released several albums over the years." Meta: "One-time Nashville rock band, now scattered across the country."

### 4.10 The band in David's other web copy

- daviddewese.com 2012–24 bio (`R04` §4.2): "I moved to Nashville with my college buddy, Chad Edgington, to start this band. We played a zillion shows, made records, and met famous people. Although the band members are now scattered across four different states I refuse to say we've broken up."
- daviddewese.com, "The Luxury Liners Believe EP" post, 2011-02-24 ([capture](https://web.archive.org/web/20210422235120/http://daviddewese.com/the-luxury-liners-believe-ep/)): "two goofy Texans obsessed with Gram Parsons, The Beatles, rhinestones, and Coca Cola".
- *earpollution* interview, Aug 2001 (`R05` §7): "When I moved to Nashville, I named my band after a Gram Parsons song called 'Luxury Liner.' …" and "Luxury Liners has the poppy girl/boy songs, and Foxymorons has the weird art songs."

### 4.11 David's 2003 message to the Internet Archive (new; `IA`, collection `TheLuxuryLiners`, "rights" field)

> "On June 23, 2003, The Luxury Liners gave permission for shows to be hosted at the Archive:
>
> hello,
>
> i represent the nashville, tn, band called the luxury liners. the band would like to become part of the archive.org concert archives. please let me know what i need to do to allow this to happen.
>
> thank you,
>
> david dewese
> http://theluxuryliners.com"

The policy note reads "Allows audience audio recording." Verified-source. It is a nice piece of band history: the band opted in to free live taping in 2003.

---

## 5. Free audio the band put online

The P5 rule applies: **isawtheocean.com has expired and is never linked.** The files below come from the band's own domain or the Internet Archive. For the Vault, ask David for the masters first; the Wayback copies are a fallback. The download links use Wayback's raw `id_` mode, so a human can save the original file.

### 5.1 *Trunk Box* (live, E-Cleff Studios, Waco TX, fall 1998), archived 2001-06-15 (E2)

| Track (from file name) | Wayback raw download |
|---|---|
| Be With You | https://web.archive.org/web/20010615001544id_/http://theluxuryliners.com:80/mp3/waco/luxury_liners_be_with_you.mp3 |
| Blockbuster | https://web.archive.org/web/20010615001823id_/http://theluxuryliners.com:80/mp3/waco/luxury_liners_blockbuster.mp3 |
| If I Cry | https://web.archive.org/web/20010615081500id_/http://theluxuryliners.com:80/mp3/waco/luxury_liners_if_i_cry.mp3 |
| Shake It Up | https://web.archive.org/web/20010615080228id_/http://theluxuryliners.com:80/mp3/waco/luxury_liners_shake_it_up.mp3 |
| Say Goodbye | linked as `/web/mp3/waco/luxury_liners_say_goodbye.mp3`: **404 when captured** (a broken link) |

That is 4 of the 11 *Trunk Box* tracks. The full tracklist is on `/history/music.html` (§11). The "Shake It Up" take is a 1998 live recording; the song's first **release** is still the *Believe* EP, 2001 (P27).

### 5.2 Site MP3s archived 2005–07 (E4/E5)

| Song (file name) | First captured | Probably from | Wayback raw download |
|---|---|---|---|
| Believe (Cher cover) | 2005-11-05 | *Believe* EP (track 3; credit Cher, P27) | https://web.archive.org/web/20051105025725id_/http://www.theluxuryliners.com:80/mp3/luxury_liners_believe_cher.mp3 |
| Breaking Out | 2007-08-23 | *Nonetheless* | https://web.archive.org/web/20070823125405id_/http://theluxuryliners.com/mp3/luxury_liners_breaking_out.mp3 |
| Breezy | 2005-11-05 | *Sound As Ever* | https://web.archive.org/web/20051105025511id_/http://www.theluxuryliners.com:80/mp3/luxury_liners_breezy.mp3 |
| (Think She's) Coming Around | 2005-11-05 | *Sound As Ever* / *Fireworks Vol. 2* | https://web.archive.org/web/20051105020225id_/http://www.theluxuryliners.com:80/mp3/luxury_liners_coming_around.mp3 |
| (The Duke Of) Gloucester | 2005-11-05 | *Sound As Ever* | https://web.archive.org/web/20051105015959id_/http://www.theluxuryliners.com:80/mp3/luxury_liners_gloucester.mp3 |
| It's You | 2005-11-05 | *Believe* EP / *Overbored* | https://web.archive.org/web/20051105025540id_/http://www.theluxuryliners.com:80/mp3/luxury_liners_its_you.mp3 |
| Just A Girl | 2005-11-05 | *Sound As Ever* | https://web.archive.org/web/20051105015710id_/http://www.theluxuryliners.com:80/mp3/luxury_liners_just_a_girl.mp3 |
| Restless | 2005-11-05 | *Overbored* | https://web.archive.org/web/20051105025641id_/http://www.theluxuryliners.com:80/mp3/luxury_liners_restless.mp3 |
| Since (You) Met Me | 2005-11-05 | *Sound As Ever* / *Fireworks Vol. 2* | https://web.archive.org/web/20051105015558id_/http://www.theluxuryliners.com:80/mp3/luxury_liners_since_met_me.mp3 |
| Sunshine | 2005-11-05 | *Overbored* | https://web.archive.org/web/20051105025702id_/http://www.theluxuryliners.com:80/mp3/luxury_liners_sunshine.mp3 |
| Breakaway | 2005-11-05 | unreleased demo (`LL02` §5) | https://web.archive.org/web/20051105015937id_/http://www.theluxuryliners.com:80/mp3/misc/luxury_liners_breakaway.mp3 |

The "probably from" column is matched by title only (unverified): a file could be a demo or live take. Check by listening.

**Archived as 404 (broken or truncated links, 2005 and 2021):**
- `/mp3/20021117/01, 02, 03, 05, 06, 07`: the 17 Nov 2002 acoustic set (*Live Liners*). The file names were cut off at the first space.
- `/mp3/7.18.02/7-luxury_waiting_for_sun.mp3`, `/mp3/7.18.02/8-luxury_breaking_out.mp3`: the 18 Jul 2002 12th & Porter set (*Live Liners*), tracks 7 and 8.
- `/mp3/misc/01, 02, 04, 07, Fall, Purple, Ride`: the covers and demos list, truncated ("Fall [Awake]", "Purple [Parallelogram]", "Ride [With Me]").

These recordings existed but were never archived. Only David can supply them.

**RealAudio clips (2001, E2), archived as 200:** `/ram/breezy.ram`, `/ram/comingaround.ram`, `/ram/gloucester.ram`, `/ram/itsyou.ram`. A `.ram` file is only a pointer to a stream; the stream itself is probably not archived. Low value.

### 5.3 The Internet Archive Live Music Archive (new this pass; `IA`)

| Item | Details |
|---|---|
| Collection | **"The Luxury Liners"**, https://archive.org/details/TheLuxuryLiners. Homepage field: http://www.theluxuryliners.com/. Public since 2003-06-24. Policy: "Allows audience audio recording." The collection image carries a photo credit to a named person (not repeated here; see the IA page; ask Carly before reusing the image, §12) |
| Show | **"The Luxury Liners Live at The French Quarter Cafe on 2003-06-19"**, https://archive.org/details/lliners2003-06-19.at853.shnf. Coverage: Nashville, TN. Taper and transfer: Mike Zodun (audience recording, AT853 microphone). Added 2003-06-25. Files: Shorten (lossless) plus derived VBR MP3s |
| Setlist (as listed) | 1. Breaking Out (5:37) · 2. Sunshine (3:07) · 3. Restless (3:31) · 4. Waiting For The Sun (3:24) · 5. Overbored (5:40) · 6. Crash And Burn (3:47) · 7. That's How It Should Be (3:21) |

- **It is the only item in the collection** (archive.org search, `collection:TheLuxuryLiners`, 1 result).
- **It fills a gap in the show list.** The journal's 2003-06-19 show was "venue not named" (`R04`). This recording names it: **The French Quarter Cafe, Nashville**. Verified-source.
- **It previews *Nonetheless*.** "Breaking Out", "Crash And Burn" and "How It Should Be" appeared on *Nonetheless* in 2006 (`LL02` §3.4). So these songs were in the live set three years before release.
- **Vault use.** The recording is the band's own opt-in (§4.11). It can be embedded from archive.org, which keeps it a live, stable link. Ask David first. Don't copy the taper's e-mail address from the item.

### 5.4 Video

- The current site's YouTube button plays **"The Luxury Liners - Live at The Basement, Nashville, TN 2001 - 3 of 3"** (`V6h-vFJfRjI`), uploaded by **David Dewese** (@daviddewese), not by the band channel (`YT`). Parts 1 and 2 were not found (§11). The journal has a Basement show on 2001-08-09 (`R04`); that this video is from that night is unverified.
- The band channel `UCi2Kheqfw714F4v8bwBbViA` (@theluxuryliners) had three videos, all from 2006: "It's You", "Equasue", "Circles" (`R02` §b, read 2026-09-28). The feed returned a server error this session.
- The *Believe* EP enhanced CD had an "It's You" video and an interview video (§4.5).

---

## 6. The journal, month by month (exact captures)

Status is the HTTP code the Wayback Machine recorded at that capture. "Read" means `R04` opened it on 2026-09-28. The three unread 200 months are top priorities in §11.

| Month file | Status | Capture | Read? |
|---|---|---|---|
| 2001_06_01_archives.html | 200 | [20020203232010](https://web.archive.org/web/20020203232010/http://theluxuryliners.com:80/2001_06_01_archives.html) | read |
| 2001_07_01_archives.html | 200 | [20011213000950](https://web.archive.org/web/20011213000950/http://theluxuryliners.com:80/2001_07_01_archives.html) | **NOT READ** (connection resets in R04). Backup copy: blogs/2001_07 below |
| 2001_08_01_archives.html | 200 | [20011213001845](https://web.archive.org/web/20011213001845/http://theluxuryliners.com:80/2001_08_01_archives.html) | read |
| 2001_09_01_archives.html | 200 | [20011213002914](https://web.archive.org/web/20011213002914/http://theluxuryliners.com:80/2001_09_01_archives.html) | read |
| 2001_10_01_archives.html | 200 | [20011213005859](https://web.archive.org/web/20011213005859/http://theluxuryliners.com:80/2001_10_01_archives.html) | read |
| 2001_11_01_archives.html | 200 | [20020903202557](https://web.archive.org/web/20020903202557/http://theluxuryliners.com:80/2001_11_01_archives.html) | read |
| 2001_12_01_archives.html | 200 | [20011213011446](https://web.archive.org/web/20011213011446/http://www.theluxuryliners.com:80/2001_12_01_archives.html) | read (no shows named) |
| 2002_01_01_archives.html | 200 | [20020203234114](https://web.archive.org/web/20020203234114/http://www.theluxuryliners.com:80/2002_01_01_archives.html) | read |
| 2002_02_01_archives.html | 200 | [20020203231330](https://web.archive.org/web/20020203231330/http://www.theluxuryliners.com:80/2002_02_01_archives.html) | read (no shows named) |
| 2002_03_01_archives.html | 200 | [20020907041018](https://web.archive.org/web/20020907041018/http://theluxuryliners.com:80/2002_03_01_archives.html) | read |
| 2002_04_01_archives.html | 200 | [20020907155848](https://web.archive.org/web/20020907155848/http://theluxuryliners.com:80/2002_04_01_archives.html) | read |
| 2002_05_01_archives.html | 200 | [20020608024816](https://web.archive.org/web/20020608024816/http://www.theluxuryliners.com:80/2002_05_01_archives.html) | read |
| 2002_06_01_archives.html | 200 | [20020808065530](https://web.archive.org/web/20020808065530/http://www.theluxuryliners.com:80/2002_06_01_archives.html) | read |
| 2002_07_01_archives.html | 200 | [20021008071758](https://web.archive.org/web/20021008071758/http://www.theluxuryliners.com:80/2002_07_01_archives.html) | read |
| 2002_08_01_archives.html | 200 | [20020908140738](https://web.archive.org/web/20020908140738/http://theluxuryliners.com:80/2002_08_01_archives.html) | read |
| 2002_09_01_archives.html | 200 | [20021005091947](https://web.archive.org/web/20021005091947/http://www.theluxuryliners.com:80/2002_09_01_archives.html) | read |
| 2002_10_01_archives.html | 200 | [20021005090940](https://web.archive.org/web/20021005090940/http://www.theluxuryliners.com:80/2002_10_01_archives.html) | read |
| 2002_11_01_archives.html | 200 | [20031027120510](https://web.archive.org/web/20031027120510/http://www.theluxuryliners.com:80/2002_11_01_archives.html) | read |
| 2002_12_01_archives.html | 200 | [20031027122042](https://web.archive.org/web/20031027122042/http://www.theluxuryliners.com:80/2002_12_01_archives.html) | read |
| 2003_01_01_archives.html | 200 | [20040117040432](https://web.archive.org/web/20040117040432/http://theluxuryliners.com:80/2003_01_01_archives.html) | read |
| 2003_02_01_archives.html | 200 | [20030526114321](https://web.archive.org/web/20030526114321/http://www.theluxuryliners.com:80/2003_02_01_archives.html) | read |
| 2003_03_01_archives.html | 200 | [20030527093643](https://web.archive.org/web/20030527093643/http://www.theluxuryliners.com:80/2003_03_01_archives.html) | read |
| 2003_04_01_archives.html | 200 | [20030529091448](https://web.archive.org/web/20030529091448/http://www.theluxuryliners.com:80/2003_04_01_archives.html) | read |
| 2003_05_01_archives.html | **404** | [20030605082900](https://web.archive.org/web/20030605082900/http://www.theluxuryliners.com:80/2003_05_01_archives.html) | — (May 2003 is missing: the *Overbored* release month) |
| 2003_06_01_archives.html | 200 | [20030810183228](https://web.archive.org/web/20030810183228/http://www.theluxuryliners.com:80/2003_06_01_archives.html) | read |
| 2003_07_01_archives.html | 200 | [20030810183602](https://web.archive.org/web/20030810183602/http://www.theluxuryliners.com:80/2003_07_01_archives.html) | read |
| 2003_08_01_archives.html | 200 | [20030810183715](https://web.archive.org/web/20030810183715/http://www.theluxuryliners.com:80/2003_08_01_archives.html) | read |
| 2003_09_01_archives.html | 200 | [20040118154010](https://web.archive.org/web/20040118154010/http://theluxuryliners.com:80/2003_09_01_archives.html) | read |
| 2003_10_01_archives.html | 200 | [20031218231614](https://web.archive.org/web/20031218231614/http://www.theluxuryliners.com:80/2003_10_01_archives.html) | read |
| 2003_11_01_archives.html | 200 | [20031218231651](https://web.archive.org/web/20031218231651/http://www.theluxuryliners.com:80/2003_11_01_archives.html) | **NOT READ** (resets in R04). Likely names the Nov 14, 2003 show (see §7) |
| 2003_12_01_archives.html | 200 | [20031230001009](https://web.archive.org/web/20031230001009/http://www.theluxuryliners.com:80/2003_12_01_archives.html) | **NOT READ** (resets in R04) |
| 2004_01_01_archives.html | 200 | [20040313182052](https://web.archive.org/web/20040313182052/http://www.theluxuryliners.com:80/2004_01_01_archives.html) | read |
| 2004_02_01_archives.html | 200 | [20040314050916](https://web.archive.org/web/20040314050916/http://www.theluxuryliners.com:80/2004_02_01_archives.html) | read |
| 2004_03_01_archives.html | 200 | [20040331005053](https://web.archive.org/web/20040331005053/http://www.theluxuryliners.com:80/2004_03_01_archives.html) | read (the last month) |
| blogs/2001_06_01_archives.html | 200 | [20010825033316](https://web.archive.org/web/20010825033316/http://www.theluxuryliners.com:80/blogs/2001_06_01_archives.html) | not read (early copy) |
| blogs/2001_07_01_archives.html | 200 | [20010825033605](https://web.archive.org/web/20010825033605/http://www.theluxuryliners.com:80/blogs/2001_07_01_archives.html) | **not read: the backup for July 2001** |
| blogs/2001_08_01_archives.html | 200 | [20010825034906](https://web.archive.org/web/20010825034906/http://www.theluxuryliners.com:80/blogs/2001_08_01_archives.html) | not read (early copy) |

Also in the CDX, all 404 when captured: `2001_06_01_month.html` and `2001_07_01_month.html` (an earlier Blogger naming, 2001-07), and monthly archives for **2004-04 to 2005-06**. They were requested (probably from archive links) but never existed: the journal ends in March 2004. The front page `/journal.html` ([20010711194549](https://web.archive.org/web/20010711194549/http://theluxuryliners.com:80/journal.html)) and `/archives.html` ([20020808065935](https://web.archive.org/web/20020808065935/http://theluxuryliners.com:80/archives.html)) are unread.

**For the Vault:** the journal is the band's best first-hand record. Republish it month by month at `/vault/journal/<yyyy-mm>/` (P5), after a privacy pass on every post (people's names outside the band, family news, addresses).

---

## 7. E-mail newsletters, 2002–04 (new; dated from `/email/` file names)

The band mailed HTML newsletters whose images lived under `/email/`. The Wayback Machine found these image URLs in 2021 (all 404 or "revisit" by then), so the mailings themselves are not archived. The **file names date the mailings**. The "likely subject" column matches each date to the journal show table in `R04` §5.2 and is an inference (unverified).

| Mailing (from file name) | Image files | Likely subject |
|---|---|---|
| 5/17/02 | email_5_17_02.gif | mid-May 2002 shows (two Borders acoustic shows; "Dancin' in the District" on 5/23) |
| 5/23/02 | 5_23_02_cake.gif, 5_23_02_name.jpg | "Dancin' in the District", Nashville, 2002-05-23 |
| 6/7/02 | 6_7_02_top.jpg, 6_7_02_bottom.jpg | The End, Nashville, with Jetpack, 2002-06-07 |
| 6/27/02 | 6-27-02_PICTURE.gif, 6-27-02_SIDE.jpg | Exit/In, Nashville, 2002-06-27 |
| 11/17 (year not in name) | 11_17_luxury_liners.jpg, 11_17_vert.jpg, 11_17_footer.jpg | probably the 17 Nov 2002 acoustic set at 12th & Porter (*Live Liners*) |
| 1/8/03 | email_1-8-03_03.gif, _05.jpg, _06.gif | unknown (January 2003) |
| 1/30/03 | email-1-30-03_02-band.jpg, email-1-30-03_06_hoosier.jpg | the "indiana acoustic tour", c. 2003-01-31 to 02-01 ("hoosier") |
| 2/20/03 | 2_20_03_luxury_liners.jpg, 2_20_03_dotcom.gif | Nashville show, 2003-02-20 |
| 3/8/03 | email_3_8_03.gif, email_3_8_06.jpg | March 2003 trips (Columbia SC; Michigan) |
| 5/8/03 | email_5_8_03_03_top.gif, **_05_album.jpg**, _07_right.gif, _08_bottom.jpg, _09.gif | the ***Overbored*** release mailing (public date 2003-05-01) |
| 10/18/03 | luxury_liners_10-18-03.jpg, luxury_dudes_10-18-03.jpg, left/right/star_10-18-03.gif | the 2003-10-18 East Nashville show (Radio Cafe, probably), with the "Luxury Liner" cover |
| 5/19/04 | email_5-19-04_banner.jpg, _background.gif, _bottom.gif | unknown: after the journal ends |
| 10/01/04 | 10-01-04.jpg | unknown: after the journal ends |

Other dated images on the site point the same way: `/images/flyer7-20-01.jpg` (a show flyer, c. 2001-07-20, in the unread July 2001 journal month), `/images/splash_3-30-02.gif` (The Sutler, 2002-03-30), `/images/splash_9_15_02.jpg` (2002-09-15), `/images/luxury_liners_nov_14_03.jpg` (a **2003-11-14** event not in any read journal month) and `/images/luxury_liners_feb-20.jpg` (2003-02-20). The 2004 mailings are the only trace of the band's 2004 activity on the domain apart from the March 2004 journal. Ask David whether he kept the newsletters (§13 Q4).

---

## 8. The current live site (Carrd), re-checked 2026-10-07

`LIVE` matches `R04` §3 (captured 2026-09-28) exactly. Nothing has changed since the site was published.

| Item | Value |
|---|---|
| Platform | Carrd, served through Cloudflare (`content-security-policy: frame-ancestors https://carrd.com`; `server: cloudflare`) |
| Last-Modified | Tue, 15 Oct 2024 16:52:05 GMT |
| DNS (`HO`, 2026-09-28) | GoDaddy nameservers `ns69/ns70.domaincontrol.com`; apex A `172.66.0.70` (Carrd, inside Cloudflare's range); `www` CNAME to the apex. Live check: `www` returns 301 to `https://theluxuryliners.com/` |
| Domain | registered 1998-03-20 at GoDaddy; expires **2027-03-19** (`HO`). Carly's team holds GoDaddy, Cloudflare and Carrd access (O1) |
| `<title>` / H1 | "The Luxury Liners" |
| Body copy | "Forever brosephs that formed in 1997 and have released several albums over the years." |
| Meta / og:description | "One-time Nashville rock band, now scattered across the country." (differs from the body) |
| Buttons | Spotify `3416B3EOd5itWZazwzw9Qc` · Apple Music `47333263` · Instagram `theluxuryliners` · Facebook `theluxuryliners` · YouTube `V6h-vFJfRjI` (the 2001 Basement clip, §5.4) · Email (Cloudflare-obfuscated; decodes to the band's Gmail address, `R04`) |
| Images | `image02.jpg` 596×596 (jumping studio shot, `alt=""`), `share.jpg` 1200×990 (seated studio shot), favicon and touch icon from the jumping shot. Photographer unknown |
| Fonts / colours | Montserrat 800, Inter 200/300; `#42474F` on white |
| robots / sitemap / llms.txt | 200 / 200 (one URL, `lastmod 2024-10-15`) / 404 |
| `/index.html` | 200: a duplicate of `/` |
| Legacy URLs | all 404 (§10) |

Audit points carried over from `R04` §3.4: the only content image has empty alt text; the button borders fail 3:1 contrast; email works only with JavaScript; there is no JSON-LD; the meta and body descriptions differ (`LL01` Q14 asks which is canonical).

---

## 9. Other web presences, past and present

"Status" was checked this session unless marked. Never link anything marked dead or excluded.

| Presence | URL / ID | Status (2026-10-07) | What it shows / why it matters | Confidence |
|---|---|---|---|---|
| **MySpace** | https://myspace.com/theluxuryliners | **Up**, as an empty shell | Name "The Luxury Liners", **Nashville, TN**; **2,279** people connected to them; **1.6K** they connect to; friends shown on the profile (probably the Top 8) include Ben Kweller, Nada Surf, The Lemonheads, Derek Webb, David Dewese and Trevor Morgan; a photo album "Dancing In The District"; no songs or posts (MySpace lost pre-2013 music). Linked from the 2006–09 site nav ("MYSPACE") and from `MB` | verified-source |
| **Internet Archive LMA** | https://archive.org/details/TheLuxuryLiners | Up | One show, French Quarter Cafe, 2003-06-19 (§5.3). The band's own opt-in, 2003 | verified-source |
| Facebook | https://www.facebook.com/theluxuryliners/ | Login wall | Linked from the live site, `MB` and `DG` | verified-source (exists) |
| Instagram | https://www.instagram.com/theluxuryliners/ | Login wall | Linked from the live site; the 2026 single posts are here (`LL01` §11) | verified-source (exists) |
| YouTube (band) | channel `UCi2Kheqfw714F4v8bwBbViA` (@theluxuryliners) | feed 500 this session | three 2006 videos: "It's You", "Equasue", "Circles" (`R02`, 2026-09-28) | verified-source (2026-09-28) |
| YouTube (David's channel) | @daviddewese; video `V6h-vFJfRjI` | Up | "Live at The Basement, Nashville, TN 2001 - 3 of 3"; parts 1–2 not located | verified-source |
| SoundCloud | https://soundcloud.com/theluxuryliners | blocked here | listed in the daviddewese.com artist links (`R02` §b) | single-source |
| **Flickr** (David's) | collection https://www.flickr.com/photos/dewese/collections/72157600177972175/ "The Luxury Liners" | Up | 13 sets: ARCHIVE: Luxury Larry Promos · ARCHIVE: Luxury Liners 2000 (`72157603331145135`) · ARCHIVE: Luxury Liners 2003 (`72157603362848870`) · ARCHIVE: Luxury Liners 2005 (`72157603344283357`) · ARCHIVE: Random Liners (`72157600312232610`) · ARCHIVE: Rejected Designs (`72157600306637690`) · ARCHIVE: Vintage Luxury Liners Shots (`72157603310364995`) · IPO Seriousness · Lux Liners / Codaphonic (`1710599`) · Luxury Liner Picnic (`72157600335846078`) · Luxury Liners - Grand Rapids, MI · The Luxury Liners & Jeff Grant (`72157602473896355`) · The Luxury Liners 3-04 (`432338`). IDs from `photos.json` where known. "IPO Seriousness" may be International Pop Overthrow (the band turned IPO Chicago down in March 2003, `R04`; another IPO date is possible): unverified. Linked from `MB` | verified-source |
| Spotify | artist `3416B3EOd5itWZazwzw9Qc` | Up | **553 monthly listeners** (page meta, this session) | verified-source |
| Apple Music | artist `47333263` | Up | 7 releases (iTunes API this session: *Sound As Ever* 2000-05-01, *Believe* single 2001-03-01, *Overbored* 2003-05-01, *Nonetheless* 2006-10-01, "Shake It Up (Live at the Texas Music Cafe)" 2021-08-27, "Great Day" 2026-02-13, "New Beginning" 2026-04-17). No artist bio was found in the page HTML fetched this session, so the "Since 1998…" bio in search snippets may come from elsewhere (iHeart or Last.fm); not settled | verified-source |
| Bandcamp | https://daviddewese.bandcamp.com/ (David's account; the band has none of its own) | JS challenge here | the four albums, credited to The Luxury Liners (`R02`, `catalog-meta.json`) | verified-source (2026-09-28) |
| Last.fm | https://www.last.fm/music/The+Luxury+Liners | JS challenge here | artist page plus track pages (e.g. "It's You", "Mine"); wiki unread. The snippet bio ("Nashville-based rock band… Scott Carpenter, David Dewese, and David Wilstermann… Since 1998… currently with Litterbug Records") is Apple/iHeart-style text | unverified (snippet) |
| iHeart | artist 384637 | page gives no bio to curl | same bio in snippets | unverified |
| AllMusic | `mn0000759673` | 403 | Erik Hage bio (quoted on the 2005 press page, §4.6) | verified-source via press page |
| Discogs | artist 4298743 | API 200 | Profile: "Indie rock band in Nashville, Tennessee. Originally formed in 1997 in Texas." URLs: the band's Facebook and http://theluxuryliners.com/. Members: Chad Edgington, David Dewese, Jeff Lafrate, David Wilstermann, Scott Carpenter. Releases and appearances: see `LL02` | verified-source |
| MusicBrainz | `7af7fd54-1d1b-4353-ab60-4b61bceed337` | API 200 | URL rels: official homepage `http://www.theluxuryliners.com/`, **MySpace**, iTunes, Facebook, **the Flickr collection** above. Members: Carpenter, Dewese, Wilstermann (no Chad). No begin date | verified-source |
| Wikidata | none | (429 this session; `R02` found none) | no item exists | verified-source (2026-09-28) |
| Deezer / Tidal | 1518436 / 5748092 | not re-checked | beware Deezer 1123705 and 4424854 (other acts) | verified-source (`R02`) |
| PureVolume | `purevolume.com/theluxuryliners` | 404 (PureVolume is defunct) | no evidence the band had a page | unverified |
| CD Baby | — | the store now redirects to downloads.cdbaby.com | no evidence of a band page; the UPC prefixes 635759 and 789577 are not identified as CD Baby's (`LL02`) | unverified |
| Label: Litterbug Records | no site found | litterbugrecords.com does not connect | label of *Overbored*, *Nonetheless*, the 2026 singles (and co-label of *Sound As Ever*). Owner unknown (`LL01` Q3). Do not confuse with the UK punk band Litterbug (litterbug.bandcamp.com) | single-source |
| Label/host: echomusic | https://echomusic.com | 200 (current owner unchecked) | built and hosted the band site 2000–09; released the *Believe* EP | verified-source (old footers) |
| Other labels | Sound Asleep Records (Sweden), Not Lame Recordings | — | compilation and reissue labels (`LL02` §4) | — |
| The Foxymorons on this domain | `/foxymorons/list.html` (2002) | 404 | Foxymorons mailing-list page hosted here | verified-source |
| daviddewese.com | `/the-luxury-liners-believe-ep/` (2011), the 2012–24 bio, `/placements/` (One Tree Hill "Dreaming", FOX Sports "Sunshine") | old site gone; the new daviddewese.com has a full band page that links here (L1) | §4.10 | verified-source |
| Band e-mail | the band's Gmail (decoded from the live site) | in use | do not print the address in page HTML; use a form, as daviddewese.com does (P2) | verified-source |
| **isawtheocean.com** | — | **expired; no connection** | David's old MP3 host (the *I Saw The Ocean* publishing name). **Never link it** (P5) | confirmed-owner |
| Shazam | https://www.shazam.com/artist/-/47333263 (same ID as Apple) | 403 to this session (bot wall or proxy) | artist page with the AllMusic-style bio line quoted in `LL02` ("named after a Gram Parsons song … originally intended as an alt-country outlet for Foxymorons member David Dewese …"). That line is contested against F4 (§13 W1) | single-source (`LL02`, search snippet) |
| Big Cartel (David's shop) | `daviddewese.bigcartel.com/product/sound-as-ever` | **Dead: 404** (the shop root `daviddewese.bigcartel.com/` is also 404, checked 2026-10-07) | once sold the *Sound As Ever* CD (search-result title "David Dewese — Sound As Ever", `LL02`). Do not link | verified-source (status); single-source (contents) |
| NoiseTrade sampler (David's) | was on noisetrade.com; old post `http://daviddewese.com/noisetrade-sampler/` (Wayback 20210422233343, from `vault.json`) | **Dead**: NoiseTrade no longer hosts it (`vault.json`); `noisetrade.com/daviddewese` 404 here | a free 2008 sampler of David's songs. A David solo item, not a band release; whether it held any Luxury Liners tracks is unknown (ask David) | single-source |
| Fan sites, guestbooks, message boards | none found | — | The 2001 site had a "message" nav button, but no board URL is archived (§3.10) | — |

Name collisions to exclude: Emmylou Harris's album *Luxury Liner* (1977) and Gram Parsons' song "Luxury Liner" (the band's namesake); Carter Tanton's "Luxury Liners"; Spotify `6IkyFyVyUt99P1jjMllZ5m`; Deezer `1123705` and `4424854`; the 1948 film *Luxury Liner*; cruise ships and yacht charters; Luxury Liners, Inc. (a California company); the Georgia band Luxury; Nashville's The Luxury Stars (`LL01` D15).

---

## 10. Legacy URL inventory and 301 plan

### 10.1 What the inventory covers

`data/legacy-urls.json` has **one row for each of the 675 URLs in `CDX`**. Each row has: the URL as captured; the normalised path; first capture date and timestamp; last known capture (only where `R04` cited a later one; otherwise `null`, meaning unknown); the CDX status and MIME type; the **live status on 2026-10-07**; the design era at first capture (`capture_era`); the period the content belongs to (`content_period`: from dated gallery names or the gallery's earliest archive date, so the 2001 sxsw and capitol galleries now read "2001 or earlier"); category; action; a **suggested target on the new site**; the old daviddewese.com handover target; an exact Wayback link (deliberately `null` for the `private-*` and `sensitive-image` rows); and a note.

| Action | Rows | Meaning |
|---|---|---|
| `301` | 300 | permanent redirect to `suggested_target` |
| `301-if-query-capable` | 32 | `/?content=…` and `/?em18…` URLs (2007–08 CMS). Carrd and Cloudflare `_redirects` cannot match query strings; only a Worker or a Cloudflare Redirect Rule can. Without one, they land on the home page (200), which is acceptable |
| `rehost-same-path` | 17 | 11 site MP3s, 4 *Trunk Box* MP3s, 2 press downloads: put the file back at the **same URL** (old links and blog posts keep working); otherwise 301 to the Vault or press page |
| `rehost-or-none` | 78 | gallery and history photos: re-host only if used |
| `keep` / `serve` | 2 / 3 | `/`, `/index.html`; robots.txt, sitemap.xml, favicon.ico |
| `none` | 243 | images, CSS, scripts, Flash files, plugin probes, `.well-known` probes, Cloudflare `/cdn-cgi/`, newsletter images, private family images, and one history image flagged `sensitive-image` (§12): 404 is correct |

Live status today: **630 × 404, 6 × 403** (`.php` paths: `/background/rotate.php`, `/images/03012005/rotate.php`, `/images/redsplash/rotate.php`, `/index.php?&content=mailinglist`, `/scripts/securityImage.php`, `/xml/photos.php`), **39 × 200** (`/`, `/index.html`, `/robots.txt`, `/sitemap.xml`, three Carrd images, the Cloudflare email script, and 31 query-string URLs answered with the home page).

The 276 paths in `HO` are the status-200 HTML, audio and PDF paths with the query strings removed. This inventory adds the other 399 rows (404s, images, probes and query variants), so nothing archived is left unclassified.

### 10.2 Redirect rules (provisional targets; the architecture track must confirm the IA)

| Old path(s) | Suggested target | Rows | Was (daviddewese.com handover) |
|---|---|---|---|
| `/`, `/index.html` | keep `/` | 2 | keep |
| `/index4.html`, `/splash.html`, `/luxuryliners.html`, `/go/?…` (4), `/ethan.html` (private: home only) | `/` | 8 | band page |
| `/bio.htm`, `/biography.htm`, `/bio.html` (404), `/band.html`, `/bios.html`, `/data.html`, `/history`, `/history/index.html`, `/history/intro.html`, `/history/story.html` | `/story/` | 10 | band page |
| `/events.htm`, `/history/concerts.html` | `/shows/` | 2 | band page `#live` |
| `/music.html`, `/albums.html`, `/history/music.html` (the 2004–05 album-notes page: re-publish its copy on `/music/`), `/merch.htm`, `/store`, `/store/cat/LuxuryLiners` | `/music/` | 6 | music |
| `/store/product/5/Nonetheless` | `/music/nonetheless/` | 1 | same |
| `/lyrics.html` | `/lyrics/` (or `/music/overbored/#lyrics`) | 1 | Overbored page |
| `/press.html` | `/press/` | 1 | press |
| `/downloads/luxury_liners_onesheet.pdf`, `/downloads/luxuryliners300dpi.jpg` | re-host same path; else `/press/` | 2 | press |
| 33 × `/<yyyy>_<mm>_01_archives.html` (200) and 3 × `/blogs/2001_0{6,7,8}_01_archives.html` | `/vault/journal/<yyyy-mm>/` | 36 | band page |
| `/journal.html`, `/archives.html`, and the 404 months (`2003_05`, `2004_04`–`2005_06`, `*_month.html`) | `/vault/journal/` | 19 | band page / vault `#journal` |
| `/news.htm`, `/news.html` | `/vault/news/` | 2 | band page |
| `/links.html`, `/misc.html`, `/multimedia.html` | `/vault/` | 3 | band page |
| `/mp3/*.mp3` and `/mp3/misc/luxury_liners_breakaway.mp3` (200) | re-host same path; else `/vault/mp3s/` | 11 | music |
| `/mp3/waco/*.mp3` (200), `/web/mp3/waco/…` (404) | re-host same path; else `/vault/trunk-box/` | 5 | music |
| `/mp3/20021117/*`, `/mp3/7.18.02/*` (404) | `/vault/live-liners/` | 8 | music |
| `/mp3/misc/<truncated>` (404), `/ram/*.ram` | `/vault/mp3s/` | 11 | music |
| `/photos.htm`, `/photos.html`, `/pictures.htm` (404), `/history/photos.html`, `/xml/photos.php`, 180 × `/photos/<set>/<n>.html` | `/photos/` (or `/photos/#<set>`) | 185 | band page |
| `/contact.html`, `/email.html`, `/mail_list.htm`, `/mail_list.html`, `/_vti_bin/shtml.exe/mailing_list.htm` | `/contact/` | 5 | contact |
| `/foxymorons/list.html` | `https://foxymorons.com/` | 1 | Foxymorons band page |
| `/?content=bio` → `/story/`; `music`, `mailorder`, `album…` → `/music/`; `news` and `em1884` → `/vault/news/`; `photos` → `/photos/`; `contact`, `mailinglist` → `/contact/` | as listed (query-capable only) | 32 | not covered |

### 10.3 Mechanism notes

- **While the band stays on Carrd:** Carrd's Redirects feature needs Pro Plus or higher, takes `/request=destination` lines with `*` as a trailing wildcard, and always sends 301 (`HO` ARCHITECTURE.md §4.6). Re-hosting MP3s at their old paths is **not** possible on Carrd. A Cloudflare Bulk Redirect list will not work in front of Carrd either: a proxied A record pointing at Carrd's Cloudflare IP gives Error 1000 (`HO` §4.2, §4.6).
- **If the new site is a static build on Cloudflare** (as daviddewese.com is): put exact paths first and splats last in `_redirects` (`/photos/*`, `/history/photos/*`, `/mp3/20021117/*`, `/mp3/7.18.02/*`), never splat over a built route, and serve re-hosted MP3s and PDFs as static files at their old paths. Query-string URLs need a small Worker or Redirect Rule if anyone cares; otherwise leave them on the home page.
- **Do not redirect images to HTML pages.** Old image URLs stay 404 unless the same image is re-hosted.
- **Never redirect `/cdn-cgi/*`.** Cloudflare owns it.
- **`/ethan.html`** goes to the home page only. Its content is private.
- **Regenerate** `data/legacy-urls.json` once the IA is fixed, and again once a human has run CDX query #24 (§11): add the last-capture timestamps to `KNOWN_LATER` in the script (or load the uncollapsed CDX) so `last_known_capture` is filled for every row. Today it is null in 666 of 675 rows (null = unknown).
- Regenerate command: `python3 research/tools/gen_legacy_urls.py research/legacy/live-status-2026-10-07.tsv` (the rules are in `classify()`; the TSV is this session's live status check).

---

## 11. Needs a human with a browser (Wayback is blocked here)

Open each link in a browser, save the page (File > Save, or copy the text into `research/legacy/wayback/<path>.txt`), and note the capture timestamp. Add `id_` after the timestamp (e.g. `/web/20030607225256id_/http://…`) to get the raw file without the Wayback toolbar. Ranked by value.

### Priority 1: content nobody has read

| # | Wayback URL | Why |
|---|---|---|
| 1 | https://web.archive.org/web/20030607225256/http://theluxuryliners.com:80/history/concerts.html | **The band's own concert history**, probably 1997–2003. Fills the empty 1997–2000 show years |
| 2 | https://web.archive.org/web/20011213000950/http://theluxuryliners.com:80/2001_07_01_archives.html (backup: https://web.archive.org/web/20010825033605/http://www.theluxuryliners.com:80/blogs/2001_07_01_archives.html) | July 2001 journal: from the first months after Chad left (his tenure ends Apr 2001 in the 2005 roster, §4.3); the 2001-07-20 flyer show |
| 3 | https://web.archive.org/web/20031218231651/http://www.theluxuryliners.com:80/2003_11_01_archives.html and https://web.archive.org/web/20031230001009/http://www.theluxuryliners.com:80/2003_12_01_archives.html | The last two unread journal months (the 2003-11-14 show) |
| 4 | https://web.archive.org/web/20050425000737/http://theluxuryliners.com/lyrics.html | Copy out the *Overbored* lyrics and chord charts in full |
| 5 | https://web.archive.org/web/20050321225645/http://theluxuryliners.com/history/music.html | The full *Trunk Box* tracklist (11 tracks), *Live Liners* and *From The Vaults* details, exact album-note wording |
| 6 | https://web.archive.org/web/20030414032936id_/http://theluxuryliners.com:80/downloads/luxury_liners_onesheet.pdf | The *Overbored* one-sheet PDF (save the file) |
| 7 | https://web.archive.org/web/20000823195951/http://www.theluxuryliners.com:80/news.htm and https://web.archive.org/web/20000605102421/http://www.theluxuryliners.com:80/events.htm | 2000 news and show listings |
| 8 | https://web.archive.org/web/20020609184248/http://www.theluxuryliners.com:80/news.html | 2002 news page |
| 9 | https://web.archive.org/web/20070823124101/http://theluxuryliners.com/?content=news, https://web.archive.org/web/20071114175023/http://theluxuryliners.com:80/?em1884=_-1__1_~0_-1_11_2007_0_0&content=news, https://web.archive.org/web/20080926154855/http://www.theluxuryliners.com:80/?em1884=_-1__1_~0_-1_09_2008_0_0 | 2007–08 news: the 2007 shows and tours, the 2008 Chad reunion show |
| 10 | https://web.archive.org/web/20071112180601/http://theluxuryliners.com:80/?content=bio | The 2006–09 band bio |
| 11 | https://web.archive.org/web/20000926003543/http://www.theluxuryliners.com/bio.htm (read the rest), https://web.archive.org/web/20000407105847/http://www.theluxuryliners.com:80/biography.htm, https://web.archive.org/web/20001022071739/http://www.theluxuryliners.com:80/band.html, https://web.archive.org/web/20050425000647/http://theluxuryliners.com/bios.html | Bios 2000–05 (strip private details) |
| 12 | https://web.archive.org/web/20030608000211/http://theluxuryliners.com:80/history/photos.html | Captions for the 16 dated 1997–2000 history photos |
| 13 | https://web.archive.org/web/20050308093846/http://www.theluxuryliners.com/data.html | The rest of the one-sheet text and the member "data" profiles |
| 14 | https://web.archive.org/web/20001022140356/http://www.theluxuryliners.com:80/press.html | The 2000 press page (older quotes than the 2005 version) |

### Priority 2: audio, images, and pages that explain the eras

| # | Wayback URL | Why |
|---|---|---|
| 15 | the 15 MP3 links in §5.1–5.2 (`id_` form) | Save the files as a fallback if David lacks masters |
| 16 | https://web.archive.org/web/20010311152739/http://theluxuryliners.com:80/multimedia.html | Videos and the enhanced-CD content |
| 17 | https://web.archive.org/web/20011212092215/http://theluxuryliners.com/albums.html | Exact 2001 album-note wording |
| 18 | https://web.archive.org/web/20020616104106id_/http://theluxuryliners.com:80/downloads/luxuryliners300dpi.jpg | The 2002 300 dpi press photo (ask Carly about credit) |
| 19 | https://web.archive.org/web/20021004004512/http://theluxuryliners.com:80/splash.html, https://web.archive.org/web/20041010205156/http://theluxuryliners.com:80/index4.html, https://web.archive.org/web/20050204103904/http://theluxuryliners.com:80/luxuryliners.html | E3/E4 splash copy (news blurbs) |
| 20 | https://web.archive.org/web/20010711194549/http://theluxuryliners.com:80/journal.html, https://web.archive.org/web/20010711195105/http://theluxuryliners.com:80/links.html, https://web.archive.org/web/20010711194145/http://theluxuryliners.com:80/misc.html | Journal front page; the band's links (other bands, any fan sites, the "message" board) |
| 21 | https://web.archive.org/web/20070823124036/http://theluxuryliners.com/?content=music, https://web.archive.org/web/20080930021214/http://www.theluxuryliners.com:80/store/product/5/Nonetheless | CMS music page and store (confirm album IDs; prices and formats) |
| 22 | https://web.archive.org/web/20021207141708/http://theluxuryliners.com:80/foxymorons/list.html | The Foxymorons list page on this domain (for the sister project) |
| 23 | Galleries: start at https://web.archive.org/web/20030606000000*/theluxuryliners.com/photos/* | Gallery captions and any credits; date "capitol" and "sxsw" |

### Priority 3: fill in the timeline of captures

| # | Query | Why |
|---|---|---|
| 24 | `https://web.archive.org/cdx/search/cdx?url=theluxuryliners.com/*&output=json&fl=original,timestamp,statuscode,digest` (no collapse) | **Last-capture dates** for every URL (the existing pull kept only first captures) |
| 25 | `https://web.archive.org/cdx/search/cdx?url=theluxuryliners.com/&output=json&fl=timestamp,statuscode,digest&collapse=digest` | Every homepage change: sharpens the era boundaries in §2 |
| 26 | `https://web.archive.org/cdx/search/cdx?url=myspace.com/theluxuryliners*&output=json&collapse=urlkey` and `…url=purevolume.com/*luxury*` | The 2005–10 MySpace page (bio, songs, shows); any PureVolume page |
| 27 | https://web.archive.org/web/2006*/www.myspace.com/theluxuryliners | MySpace-era bio and show list |

### Outside the Wayback Machine

- YouTube: search David's channel for "Live at The Basement … 1 of 3" and "2 of 3"; check the band channel's three 2006 videos.
- Flickr: open the 13 sets in §9 for captions, dates and photographer names (P14, P17).
- Last.fm: read the wiki and listener counts (JS challenge here).
- Instagram and Facebook: the 2026 announcements (who plays on "Great Day" and "New Beginning").

---

## 12. Privacy flags (do not republish without a check)

| Where | What | Rule |
|---|---|---|
| `/bio.htm` (2000), `/?content=mailorder` (2007), the 2001–05 mail-order text | old mailing addresses and a phone number | strip before quoting (`R04` §5.2) |
| *Nashville Scene* 2001 profile, *Nashville Rage* 2002 blurb (press page) | members' family members by name | do not repeat those names |
| `/ethan.html` and four personal image files (2002–05) | a private family page and family photos | never republish, re-host or describe; the page redirects to `/` only. In `data/legacy-urls.json` these rows (`private-*`) keep their paths but have `wayback_url: null` |
| `/history/photos/00_*.jpg` | one file name in this set needs a look before any reuse | a human (with the owner) reviews the image first. In `data/legacy-urls.json` that row is category `sensitive-image`, action `none`, `wayback_url: null`, with the note "do not re-host or reuse without owner review" |
| IA item `lliners2003-06-19` | the taper's personal e-mail address | credit the taper by name only |
| IA collection image | credited to a named person | ask Carly before reusing the image |
| Journal posts | names of friends, family news, health or work details | privacy pass on every month before the Vault publishes it |
| Band Gmail | the address | not printed in page HTML (P2 pattern) |

X1: nothing in this file concerns the excluded side project or person.

---

## 13. Discrepancies and open questions

### 13.1 Discrepancies (shown as contested)

| # | Topic | Version A | Version B | Handling |
|---|---|---|---|---|
| W1 | Who founded the band | **David and Chad co-founded it, 1997** (F4; confirmed-owner) | 2005 history: Chad's talent-show band, David from May 1997 (roster); AllMusic: an outlet for David | Copy follows F4; archive texts are dated quotations only (`LL01` D1) |
| W2 | "capitol" photo gallery | `R04` §5.2: "probably the July 2002 DC trip" | `CDX`: its thumbnail was archived **2001-08-25**, before that trip | Not the 2002 trip; subject unknown (ask David) |
| W3 | SXSW | `LL01` Q5: did the band play SXSW, and when? | The sxsw gallery existed by **2001-06-24**; the SESAC SXSW CD is 2001 (`DG` 8057090) | Strong support for SXSW 2001; still confirm with David |
| W4 | When "Great Day" and "New Beginning" date from | `LL01`/`LL02`: "Great Day" demo by 2008 | `SI`: both titles in the band-site MP3 list by **March 2005** | Single-source; confirm with David |
| W5 | The 2003-06-19 show | `R04`: "venue not named" | `IA`: The French Quarter Cafe, Nashville | Use the IA venue (verified-source) |
| W6 | `/history/music.html` first capture | `CDX`: 2004-03-31 | `R04` read a 2005-03-21 capture | Both are right (two captures); no conflict |
| W7 | Band descriptions online | Live body copy: "Forever brosephs that formed in 1997…" | Meta: "One-time Nashville rock band, now scattered across the country"; Discogs: "formed in 1997 in Texas"; 2024 og: the Foxymorons text | Pick one canonical line (`LL01` Q14); fix the 2024 error everywhere it was copied |
| W8 | Member lists on databases | P8 forever members (4) | MusicBrainz: 3, no Chad; Discogs: 5, incl. Jeff Lafrate; snippet bios: the trio | Fix MusicBrainz and Wikidata after launch (with the go-ahead) |
| W9 | Spelling: "Lafrate" vs "LaFrate" | Discogs "Jeff Lafrate" | 2005 roster "Jeff LaFrate" | Use the band's own spelling (LaFrate) unless David says otherwise |
| W10 | Album 88761 in the 2007 CMS | probably *Nonetheless* (12 track IDs) | not confirmed | Inference only; affects nothing public |

### 13.2 Open questions for Carly / David

1. **Q1** Does David have the masters (or better copies) of *Trunk Box*, *Live Liners* (both 2002 sets), *From The Vaults*, the 2005 demos ("Great Day", "New Beginning", "Shake It Up", "Fall Awake", "Breakaway") and the covers? Are the 2005 "Great Day" and "New Beginning" the songs released in 2026?
2. **Q2** May the Vault embed the Internet Archive French Quarter Cafe recording (2003-06-19)?
3. **Q3** Does the band keep the old file paths? Re-hosting MP3s and the one-sheet at their 2001–07 URLs means leaving Carrd (Carrd can't serve files at arbitrary paths).
4. **Q4** Do you still have the 2002–04 e-mail newsletters (13 mailings, §7), the 2001 flyer and the posters?
5. **Q5** What was the 2001 "message" board (a guestbook?), and where did it live?
6. **Q6** What do the "capitol" photos show (2001)? And the 2003-11-14 event?
7. **Q7** Who took the white-seamless studio photos used on the Carrd site and as the 2009 `jumping.jpg`? (Also asked in `R04` §8.)
8. **Q8** May the site publish the *Overbored* lyrics and chord charts? Who wrote each song?
9. **Q9** Are you happy for the MySpace page to stay as it is? It is linked from MusicBrainz. If the login still works, add a link to the new site.
10. **Q10** Who owns Litterbug Records, and should it have a web presence (even one line on the new site)? (`LL01` Q3)
11. **Q11** Should the Basement 2001 parts 1 and 2 go online (if they exist), and may the site embed the 2006 band-channel videos?
12. **Q12** Is the Flickr "IPO Seriousness" set from International Pop Overthrow? Which year and city?

---

## 14. Sources

**On disk (read 2026-10-07)**
- `/home/user/daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md`
- `/home/user/daviddewese.com/daviddewese-com/research/04-live-sites-and-archive.md` (§3, §5, §6, §7, §8)
- `/home/user/daviddewese.com/daviddewese-com/research/legacy/cdx-theluxuryliners.com.json`
- `/home/user/daviddewese.com/daviddewese-com/data/site-inventory.json`
- `/home/user/daviddewese.com/daviddewese-com/architecture/redirects/ll-legacy-urls.json`, `ll-carrd-redirects.txt`, `ll-bulk-redirects.csv`, `report.txt`
- `/home/user/daviddewese.com/daviddewese-com/architecture/ARCHITECTURE.md` (§4.1, §4.2, §4.6, DNS and registration table)
- `/home/user/daviddewese.com/daviddewese-com/site/data/vault.json`; `data/release-leads.json`; `data/catalog-meta.json`; `data/photos.json`
- `/home/user/daviddewese.com/daviddewese-com/research/01-discography.md` (§2), `02-artist-story-and-brand.md` (§b), `05-foxymorons-history.md` (§7)
- `/home/user/daviddewese.com/daviddewese-com/critiques/` (grep for LL; `arch-v2-round2.md` for DNS)
- `/home/user/theluxuryliners.com/research/01-band-history-and-people.md`, `02-discography.md`
- `/home/user/foxymorons.com/research/03-web-archaeology.md` (format reference)

**Fetched this session (2026-10-07)**
- https://theluxuryliners.com/ (headers and HTML) and all 675 archived paths (status codes)
- https://archive.org/metadata/TheLuxuryLiners · https://archive.org/metadata/lliners2003-06-19.at853.shnf · https://archive.org/advancedsearch.php (queries "luxury liners", creator, collection)
- https://musicbrainz.org/ws/2/artist/7af7fd54-1d1b-4353-ab60-4b61bceed337?inc=url-rels+artist-rels&fmt=json
- https://api.discogs.com/artists/4298743 · https://api.discogs.com/artists/4298743/releases · release records 6768612, 6768660, 14391955, 14401612, 37658859, 9601921, 22919255, 8057090, 34741341
- https://myspace.com/theluxuryliners (and `/photos`)
- https://www.flickr.com/photos/dewese/collections/72157600177972175/
- https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=V6h-vFJfRjI&format=json
- https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc (meta) · https://itunes.apple.com/lookup?id=47333263&entity=album · https://music.apple.com/us/artist/the-luxury-liners/47333263
- WebSearch queries (leads only): "Luxury Liners" Nashville band myspace; "theluxuryliners.com"; purevolume / cdbaby / last.fm; "Luxury Liners" "Overbored"; "Sound As Ever" / Litterbug / echomusic; "Litterbug Records" Nashville; YouTube Basement queries. Result pages that never mention the band (earcandymag.com, gullbuy.com, rememberthelightning.substack.com) were fetched and discarded.

**Blocked or unusable this session:** web.archive.org, wayback.archive.org, archive.org/wayback (http), archive.ph, timetravel.mementoweb.org, arquivo.pt, webarchive.loc.gov, last.fm and bandcamp.com (JS challenge), allmusic.com, discogs.com (web), nashvillescene.com, tennessean.com, mb.videolan.org, soundcloud.com (WebFetch), litterbugrecords.com, isawtheocean.com.

---

## Revision log

**Round 2 (2026-10-07), after `critiques/archaeology-round1.md` (7.5/10):**
- **B1 fixed.** `/history/music.html` (the 2004–05 album-notes page) now gets a 301 to `/music/` in `data/legacy-urls.json`. The music rule in `research/tools/gen_legacy_urls.py` now runs before the `/history/` catch-all. Re-checked after regenerating: the only status-200 HTML row left on `none` is Cloudflare's `/cdn-cgi/l/email-protection` (correct), and every `HO` path with a target is covered. Counts updated in §1 and §10.1 (301: 299 → 300; `rehost-or-none`: 79 → 78; `none` stays 243).
- **B2 fixed.** The flagged history photo row is now category `sensitive-image`, action `none`, `wayback_url: null`, note "do not re-host or reuse without owner review". The prose stays discreet (§12 says where the flag lives).
- **Privacy.** The IA collection image credit no longer prints a name (§5.3). The `private-*` rows (`/ethan.html` and four image files) keep their paths but have `wayback_url: null`, and the description of the subject of those files is gone from the prose, the data notes and the generator.
- **`content_period`** is now derived from the evidence: dated gallery names, or "2001 or earlier" / "2002 or earlier" from each gallery's earliest archive date (sxsw, capitol, trio, studio, live, misc, live2, dancin); `/history/concerts.html` reads "1997–2003 (guess)". The field note in the JSON says what the field means.
- §11 #2 now says "the first months after Chad left (Apr 2001)", matching the 2005 roster.
- §9 adds Shazam (403 here; single-source), David's Big Cartel shop (dead, 404, re-checked 2026-10-07) and the NoiseTrade sampler (dead; a David solo item).
- New §3.11: images to request from David in original resolution (from `R04` §7, checked against `CDX`).
- §1 "new this pass" bullets merged into two.
- §10.3 says to fill `last_known_capture` when the uncollapsed CDX query (§11 #24) is run; still null in 666 of 675 rows.
