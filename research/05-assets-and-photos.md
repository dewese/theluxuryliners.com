# 05 - Assets and photos (theluxuryliners.com)

Track: **assets**. Worker deliverable for the theluxuryliners.com gauntlet. Written 2026-10-07.

This file lists every image we can use on the new site: album art, band photos, live photos, flyers, logos and the engraved portraits. For each one it gives the file, its size, how good it is (print or web), who to credit, a draft alt text, and the caption rules. The machine-readable twin is **`data/assets.json`** (310 records plus a `do_not_use_ids` list, and logo, Wayback and current-site sections). The last two sections are the **wish-list for Carly** and the **discrepancies / open questions**.

**Owner decisions applied** (`/home/user/daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md`, authoritative): R1 and P17 (credits), P14 (name people where a source supports it), P15 and P28 (cover masters; missing covers), P22 and P23 (the 2002 photo of all four), P27 ("Shake It Up"), P32 and P34 (Duotone: engraved portraits, covers in full colour), P39 (band portraits on discography pages), P40 (cover-art rights line), F4 (David and Chad co-founded the band in 1997; Chad left Nashville in 2001), P8 (the four forever members), X1 (exclusion).

**Confidence key:** **confirmed-owner** (DECISIONS file or a file the owner supplied) · **verified-source** (read first-hand: the file, the Flickr API record, the platform CDN, Discogs API) · **single-source** (one source, e.g. a Flickr title, not checked against another) · **unverified** (inference or visual guess). In the tables, "(confirm)" after a **name in *People*** means Carly confirms the name before it goes into a caption (P14). In the **Credit** column, "(confirm)" appears only where a photographer is *named* on Flickr but not yet owner-confirmed; "none" means publish with no credit line (P17 closed the credit gate). `data/assets.json` carries this as `credit_status`.

**Privacy.** Captions and alt text name people only in their band roles. No homes, jobs, churches or family details of Chad Edgington, Scott Carpenter, David Wilstermann or anyone else. Photos of friends, audiences, family and children are excluded (listed at the end of §4 so nobody re-adds them).

---

## 1. Summary

| | Count | Notes |
|---|---|---|
| Cover masters copied | **6** | *Sound As Ever*, *Believe* EP, *Overbored*, *Nonetheless*, *Great Day*, *New Beginning*. Byte-identical copies (SHA-256 checked) of the daviddewese.com masters. |
| Cover found online, no master | **1** | *Shake It Up (Live at the Texas Music Café)* (spelling as in `data/releases.json`; Apple and the cover lettering use "Cafe"): a **3000x3000** copy from the Apple Music CDN, kept as a reference (P28: no owner master yet). |
| Larger cover copies found | **3** | Bandcamp holds **1600px** originals of *Believe*, *Overbored* and *Nonetheless* (our masters are 1400px). Same artwork. |
| Packaging scans (Discogs) | 9 | Back covers, disc, LP reissue: for credits research only. |
| Local band photos copied | 3 | The 2002 photo of all four (P22) and two 2005 Kristin Barlowe portraits of David (400x600, web-small). |
| Flickr photos inventoried | **274** | From **18 albums** on David's Flickr (`dewese`), read through the Flickr API. **248 usable**, 26 excluded (privacy, other acts, low value), plus 1 id-only `do_not_use_ids` entry in `data/assets.json`. |
| ... originals downloaded | 98 | `assets/source/photos/flickr/` (unmodified Flickr originals). |
| ... web copies downloaded | 150 | `assets/source/photos/flickr-web/` (largest Flickr size that downloaded, up to 2048px). Flickr blocked these originals with HTTP 429. `scripts/fetch-flickr-originals.sh` fetches them later. |
| Engraved portraits | 6 | daviddewese.com Duotone renders of the 2002 photo (copied to `assets/derived/daviddewese-portraits/`). |
| Logos / wordmarks | 8 identified | **No vector logo exists anywhere.** Rasters only (§6). |
| Wayback image captures | 209 | 60 high-priority ones listed in §9 ("needs a browser"). web.archive.org is blocked here. |

**The big findings**

1. **The best band photos are the 2003 *Overbored* promos by Amy Wilstermann** (2560x1920, four frames). They are the only images that work as a retina-wide hero. One original (`2083621513`) is on disk; the other three are 2048px web copies until Flickr lets the originals through.
2. **There are many more Chad-era photos than the daviddewese.com work found.** The Flickr albums "Vintage Luxury Liners Shots" (1998-2000) and "Luxury Liners 2000" (Mark Montgomery's white-studio session) hold the powder-blue-suit shows (Hard Rock Cafe 1998, The End 1998, Exit/In 1999), the 1998 *Billboard* contact sheets, Texas Music Café 1998, a captioned trio photo "Scott, Chad, and Me. August 2000", and a Chad portrait at 1100x1635 (`2073240141`).
3. **The *Shake It Up (Live)* cover photo comes from the c. 2000 Mark Montgomery session** (the same embroidered Western shirts as `2074032162` and the unused cover `529745579`). So the 2021 single's cover shows the Chad-era trio. Caption carefully (§3).
4. **Name T-shirts help captions.** The 2001 "Capitol shoot" and other trio photos show shirts printed "DAVID", "SCOTT" and "LARRY". That is good evidence for left-to-right names (single-source until Carly confirms).
5. **The March 2004 club set names a fourth player: Gary Ishee** (Flickr title of `18289095`), a guest on *Nonetheless*. The 2007 pedal-steel player is titled "Grant Johnson" (`2096371215`). Both single-source.
6. **Flyers survive** for 12th & Porter (Nov 14, probably 2003; Sept 15, probably 1999), Exit/In "Western Beat" (Dec 9, 2003; Jan 20, 2004) and the Dec 2007 Luxury Liners / The Nobility show. Two use third-party images (another band's press photo; a film still): archive only.
7. **A 2000 website credit:** the "J.Co Website" screenshot credits the band's 2000 site design to **Jeremy Cowart / andersonthomas** (`2068114608`; single-source).

**Biggest gaps** (details in §11): no vector logo; no master for the *Shake It Up* cover; no original files of the 2005 Kristin Barlowe session (800px only) or the 2001 Capitol shoot (350px only); the 1997 photos exist only as filenames on the old site (`97_12th_porter.jpg`, `97_opry.jpg`, `97_pajamas.jpg`); nothing at all from 2010-2026 except the two new single covers; no photo of the band today.

---

## 2. What is in the repo now

| Path | What | Count |
|---|---|---|
| `assets/source/covers/` | Owner cover masters, copied byte-identical, filenames kept | 6 |
| `assets/source/photos/luxury-liners-2002.jpg` | The 2002 photo of all four (P22) | 1 |
| `assets/source/photos/solo-archive/` | Two 2005 Kristin Barlowe portraits of David (masters supplied to daviddewese.com) | 2 |
| `assets/source/photos/flickr/` | Flickr originals, unmodified, Flickr filenames (`<id>_<secret>_o.jpg`) | 98 |
| `assets/source/photos/flickr-web/` | Largest Flickr derivative for photos whose original was rate-limited | 150 |
| `assets/reference/dsp-artwork/` | Cover copies from Bandcamp, Apple Music and Spotify (reference; not owner masters) | 12 |
| `assets/reference/discogs/` | Discogs packaging scans (research only; never publish) | 9 |
| `assets/derived/daviddewese-portraits/` | daviddewese.com engraved portraits of the 2002 photo | 6 |
| `data/assets.json` | Full inventory with dimensions, SHA-256, credit, alt, caption rules, logo list, Wayback leads | 310 records |
| `scripts/fetch-flickr-originals.sh` | Slow, one-at-a-time fetch of the 150 originals still on Flickr | - |

Nothing was modified. Masters are never served as they are: the build exports resized sRGB WebP/AVIF/JPEG copies.

**Quality tiers used below** (long edge): **print-ok** 2400px or more (about 8 in at 300 dpi; retina hero) · **web-large** 1600-2399 · **web-medium** 1000-1599 · **web-small** 600-999 · **archive-thumbnail** under 600 (Vault and galleries only). For covers: 3000px is the distributor and print spec; 1400-1600px is fine for the web and prints a CD booklet (4.75 in) at about 300 dpi.

---

## 3. Album art

### 3.1 Owner masters (copied)

| Release (id) | File | Size | Format / mode / dpi tag | Tier | Larger or better copy found | Credit (confidence) |
|---|---|---|---|---|---|---|
| *Sound As Ever* (2000) `luxury-liners-2000-sound-as-ever` | `soundasever.jpg` | 1400x1400 | JPEG RGB, 300 | web-large; CD print | Bandcamp original is identical (pixel difference 0) | Design: Mark Montgomery (daviddewese.com `research/01-discography.md`, *Sound As Ever* credits line; single-source. **Not on Discogs**: Discogs 6768612 lists him only as Producer) |
| *Believe* EP (2001) `luxury-liners-2001-believe-ep` | `believe.jpg` | 1400x1400 | JPEG RGB, 300 | web-large; CD print | **Bandcamp 1600px** (`assets/reference/dsp-artwork/believe-bandcamp-1600.jpg`) | unknown (gap); Mark Montgomery co-produced (disc scan), designer unconfirmed |
| *Overbored* (2003) `luxury-liners-2003-overbored` | `overbored.jpg` | 1400x1400 | JPEG RGB, 300 | web-large; CD print | **Bandcamp 1600px** | painter unknown (gap) |
| *Nonetheless* (2006) `luxury-liners-2006-nonetheless` | `nonetheless.jpg` | 1400x1400 | JPEG RGB, 300 | web-large; CD print | **Bandcamp 1600px** | painting Scott Carpenter, design David Dewese (research 01; verified-source) |
| *Great Day* (2026) `luxury-liners-2026-great-day` | `great-day-1-upscale.png` | 3000x3000 | PNG **RGBA**, 72 | print + web | Apple Music 3000px RGB JPEG, visually identical (mean difference under 1/255) | unknown |
| *New Beginning* (2026) `luxury-liners-2026-new-beginning` | `new-beginning-3000x3000-final.jpg` | 3000x3000 | JPEG RGB, 72 | print + web | Apple copy identical | unknown |

Notes:
- ***Great Day* PNG:** the filename says "upscale", so the 3000px master was enlarged from a smaller original; check for artefacts at large sizes. Its alpha channel is **not fully opaque (alpha 219-255)**, so flatten it onto the sky blue, not onto white or black. Or use the opaque Apple JPEG for the web. (verified-source: read with PIL)
- **Bandcamp copies** come from `https://f4.bcbits.com/img/a<art_id>_0.jpg` (the original upload); art IDs 3843531632, 3767872852, 1401131777, 1986068801, found through Bandcamp's embedded player for albums 2083883374, 4159017568, 404979016, 54140699. Prefer them for *Believe*, *Overbored* and *Nonetheless* if Carly agrees (same artwork, 14% larger).
- **Rights line on the site:** "Cover art: all rights reserved by the rights holders." (P40). Covers stay in full colour (P32).

**Alt-text drafts** (from viewing each file):
- *Sound As Ever*: "Cover of Sound As Ever by The Luxury Liners: four pairs of light-blue trouser legs in red boots on a blue-and-white pattern, under the band name in a blue bar and 'Sound as ever...' in script."
- *Believe* EP: "Cover of the Believe EP by The Luxury Liners: a black silhouette of a leaping guitarist over a white ring on red, with the band name in spaced capitals."
- *Overbored*: "Cover of Overbored by The Luxury Liners: a painting of three figures in coats hanging upside down on an off-white ground, the title small below."
- *Nonetheless*: "Cover of Nonetheless by The Luxury Liners: a painting of a long dark dress on a hanger on an off-white ground, the band name and title across the top."
- *Great Day*: "Cover of Great Day by The Luxury Liners: a red kite on a long string against a deep blue sky, 'Great Day' in white serif lettering."
- *New Beginning*: "Cover of New Beginning by The Luxury Liners: a hand holds up a clear CD case with a rainbow sunburst design and 'New Beginning' lettering against a bright blue sky."

### 3.2 *Shake It Up (Live at the Texas Music Café)* (2021): no master

| | |
|---|---|
| Status | **No owner master** (P28: Carly is looking). Not in daviddewese.com `assets/source/covers/`. |
| Best copy found | `assets/reference/dsp-artwork/shake-it-up-live-apple-music-3000.jpg`, **3000x3000** RGB JPEG from the Apple Music CDN (album 1581823464), fetched 2026-10-07. Also the Spotify 640px copy. (verified-source) |
| What it shows | Three band members in embroidered Western suits leap in the air against white, under "THE LUXURY LINERS" in condensed black capitals with a red X; "LIVE AT THE TEXAS MUSIC CAFE" below. |
| Where the photo is from | Very probably the c. 2000 Mark Montgomery white-studio session (same shirts as Flickr `2074032162` and the unused cover `529745579`). So it shows the **Chad-era trio** (probably David Dewese, Chad Edgington, Scott Carpenter). (unverified: visual match) |
| Use | Fine as the release's cover on its own page. Do not caption the photo as the 2021 band. Credit unknown (Mark Montgomery?). |
| Spelling | Title follows `data/releases.json`: "Texas Music Café". Apple Music, YouTube Music and the cover lettering spell it "Cafe". |
| Alt draft | "Cover of Shake It Up (Live at the Texas Music Café) by The Luxury Liners: three band members in embroidered Western suits leap in the air against white, under the band name with a red X." |
| Facts | "Shake It Up" is an original first released on the *Believe* EP (2001); this single is a live version (P27). The 1998 Flickr photo `2067318469` shows the Texas Music Café TV studio sign listing the band, a good link for the release page. |

### 3.3 Other release art

| Release | Art found | Where | Use |
|---|---|---|---|
| *Sound As Ever* LP reissue (2026, Sound Asleep Records, Sweden) | Front scan, 577x600: same artwork, catalogue tag **"ZZZ056"** | `assets/reference/discogs/discogs-37658859-...jpg` (Discogs 37658859) | Use the *Sound As Ever* master for the LP page; ask for the LP master (and label photos) |
| *Sound As Ever* CD back tray | 600x463 scan: "produced by Mike Poole; tracks 8 & 9 produced by Mark Montgomery for echomusic" | Discogs 6768612 | credits research only |
| *Believe* EP back + disc | Back shows two white-studio photos of three members in suits (one mid-jump); disc in red-and-white roundel design, "produced by mark montgomery & the luxury liners" | Discogs 6768660 | proves the white-studio session predates March 2001; logo evidence |
| *Overbored* back | Tracklist + small photo of the three on a sofa (likely `533776161` "Homemade") | Discogs 14391955 | credits research |
| *Trunk Box* (1998 live MP3 album) | `trunkbox_cover.jpg`, `trunkbox_big.jpg` | Wayback only (2001-06-22) | The Vault: needs a browser (§9) |
| Compilations (*Fireworks Vol. 2*, *Nashpop*, SESAC SXSW promo, *Antarctic Antics*, *Between Goodlettsville And Murfreesboro*, *Fireworks Vol. 3*, Kool Kat bonus disc) | Discogs scans exist (349-600px) | Discogs releases 6907226, 7044627, 8057090, 22919255, 9601921, 34741341, 15436127 | **Third-party art**: link to the release, do not host. Not downloaded. |
| Unused covers | 4 by Mark Montgomery (c. 2000-01, 432px) and 6 *Nonetheless* designs (c. 2005-06, 399px) | Flickr "ARCHIVE: Rejected Designs" (§4) | design-history strip on album pages |

---

## 4. Band photos

### 4.1 Local masters

| Record | File | Size | Tier | Credit | Caption / alt |
|---|---|---|---|---|---|
| `ext-luxury-liners-2002-four-piece` | `assets/source/photos/luxury-liners-2002.jpg` | 1096x848 | web-medium (not a full-width hero) | none (P22) | **Caption, exactly:** "David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002". **Never** "the 2002 line-up" (P23: Chad left in 2001). Alt: "David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter of The Luxury Liners in 2002, in matching green T-shirts against a concrete wall." AI-enhanced by the owner (Gemini), watermark cropped; keep that in metadata, not in public copy. |
| `master-2076667081` | `assets/source/photos/solo-archive/2076667081_b0dadc7bb2_o.jpg` | 400x600 | web-small (600px long edge) | Photo: Kristin Barlowe (P17) | David Dewese, 2005: corduroy jacket, green T-shirt, red wall |
| `master-2077455616` | `assets/source/photos/solo-archive/2077455616_3b27905d21_o.jpg` | 400x600 | web-small (600px long edge) | Photo: Kristin Barlowe (P17) | David Dewese, 2005: black-and-white striped shirt, dark backdrop |

### 4.2 Shortlist by use (start here)

| Use | Pick (Flickr id) | Why | Size | On disk |
|---|---|---|---|---|
| **Home hero (wide)** | `2084406418` (2003, Amy Wilstermann) | three members in stone-wall niches; the only retina-wide band image | 2560x1920 | web 2048x1536 |
| Hero alternates | `2083621513`, `2083620879`, `2084406228` (portrait) | same 2003 shoot | 2560x1920 (`2084406228`: 1920x2560) | `2083621513` original; others web 2048x1536 / 1536x2048 |
| **Founding / Chad era** | `530769478` "Chad's Last Show - March 2001" | the four as a working band at Chad's last show (title says March 2001; Flickr date 2001-04-21, contested: §12 A15) | 2160x1440 | original |
| | `2073239851` "Dance Party USA", `2074031888` "Coats", `2073239679` "Sweaters", `2074032206` jump (Mark Montgomery, c. 2000) | white-studio session; the band's most distinctive images; the current Carrd site probably uses two of them | 1646x1082, 1584x1307, 1583x1001, 687x661 | `2073239851` original; others web at full size |
| | `2086444773` "Scott, Chad, and Me. August 2000" (outside The Gig, Los Angeles) | the only Chad-era trio photo with names in the caption | 500x390 | web 500x390 |
| | `2068108792` backstage 1998; `2068110424`, `2067315769` Hard Rock 1998; `2067311761` "Classic Chad"; `2068114522` 12th & Porter 1998 | powder-blue suits; the Nudie-suit years | 844x619, 600x919, 919x588, 963x600, 350x250 | mixed |
| **Chad portrait** | `2073240141` (Mark Montgomery, c. 2000) | Chad with a red bass | 1100x1635 | web 1076x1599 |
| **The four together** | `luxury-liners-2002.jpg` | P22/P23 caption | 1096x848 | master |
| **Trio era (2001-07)** | `533776779` "After Our First Trio Practice - 2001" | opens the trio chapter | 1182x1803 | web 1049x1600 |
| | `533675192` (Peyton Hoge), `533776499` Atlanta tunnel, `533776573` B&W (Amy Wilstermann), `533675920` "Attic" (SCOTT/LARRY shirts) | best promo frames | 1038x1536, 1692x1104, 1675x1086, 1683x1107 | web 1038x1536, 1600x1044, 1599x1037, 1599x1052 |
| | `2077455434`, `2076666865`, `2076666803` (Kristin Barlowe 2005) | *Nonetheless* era | 800x1200, 800x533, 800x533 | web 683x1024, 800x533, 800x533 |
| | `539255423` "The Luxury Liners 2007" | last trio snapshot | 1632x1224 | web 1600x1200 |
| **Member portraits** | David `2076666953` (800x533) / `2077455616` (400x600, master on disk); Larry `2077455756` (800x1200), `2076666999` (800x533); Scott `2077455704`, `2076667133`, `2077455656` (800x1200 each; all Kristin Barlowe 2005); Scott `2074031748` (826x538, Montgomery); Chad `2073240141` (1100x1635), `2068107526` (819x900) | a "forever members" grid; the 2005 set is not uniform (portrait and landscape crops), so crop to one ratio | 400x600 to 1100x1635 | mixed |
| **Live** | `530879301` (Dancin' In The District), `530769920`, `530879919`, `1601757448` and `1600868501` (Oct 2007 coffee-shop set, band with guest fiddle and steel), `2096369003` (Dec 2007, pedal steel), `18289225` (Mar 2004) | stage variety from 2001 to 2007 | 1536x1038, 1110x1700, 1025x1515, 2561x1918 (x2), 1632x1224, 1280x960 | first three original; others web (2048x1534, 1600x1200, 1024x768) |
| **Later years** | `3978343931` (2009, David and Scott after a gig, "Played all old-school Luxury Liners songs"), `4470275899` (Royse City, TX, David with Chad; date unknown) | the "never broke up" story | 649x800, 604x446 | web |
| **Vault / timeline** | flyers (§7), `2068108124`/`2068108482`/`2067318287`/`2068113640` *Billboard* contact sheets (1998), `2067318469` Texas Music Café sign (1998), `529049789` Nudie's Rodeo Tailors label, `2068114608`/`2068114476`/`2067318305` old website graphics, `2083679651` The End marquee | ephemera | small | mixed |
| **Engraving source** (new palette) | `2083621513` or `533776573` (trio); `luxury-liners-2002.jpg` (four) | sharp, high-contrast | 2560x1920, 1675x1086, 1096x848 | original / web 1599x1037 / master |

### 4.3 Full Flickr inventory

Every frame below was viewed (contact sheets from the downloaded originals or 640px copies). Album, title, description, date taken and original size come from the Flickr API (`flickr.photosets.getPhotos`, owner `70946985@N00`, read 2026-10-07; verified-source). "Era" combines the Flickr date or title with what the frame shows. Most "Random Liners" frames are 350px scans uploaded in Dec 2007: Vault use only. **This section is generated from `data/assets.json`** (round 2), so sizes, tiers, credits and on-disk sizes match the json exactly. Credit column: "Photo: X (owner-confirmed)" = P17-confirmed; "Photo: X (confirm)" = photographer named only on Flickr, awaiting Carly; "none" = publish with no credit line (P17). "On disk" gives the actual pixel size of the stored web copy.

#### ARCHIVE: Random Liners (88 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157600312232610)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [530879919](https://www.flickr.com/photos/dewese/530879919/) | Two guitarists in silhouette on an outdoor stage against a dusk sky, a steel truss bridge behind them. | 2001 (Dancin' In The District, Nashville) | 1025x1515 | web-medium | Photo: Mark Montgomery (owner-confirmed) | original | band page / live gallery (4:5 card) |
| [530880283](https://www.flickr.com/photos/dewese/530880283/) | A bald man in a dark T-shirt poses for a mock police mugshot holding the number 49917. *People:* Scott Carpenter (Flickr title "Scott - On Tour"; confirm). | 2007-06-04 (Flickr date) | 1012x1020 | web-medium | none | original | archive only (joke shot) |
| [530770250](https://www.flickr.com/photos/dewese/530770250/) | A man tips his head back under a waterfall in a rocky gorge. *People:* band member (unnamed; confirm). | 2007-06-04 (Flickr date) | 400x300 | archive-thumbnail only | none | original | archive only |
| [530879249](https://www.flickr.com/photos/dewese/530879249/) | A long-haired guitarist sings at an outdoor festival stage in an olive T-shirt. *People:* David Dewese (probable; confirm). | 2002-07 (DC Sessions, Washington DC) | 320x350 | archive-thumbnail only | none | original | live gallery |
| [530879793](https://www.flickr.com/photos/dewese/530879793/) | Black-and-white close-up of a Converse sneaker. | 2007-06-04 (Flickr date) | 1340x1200 | web-medium | none | original | texture / archive |
| [530770086](https://www.flickr.com/photos/dewese/530770086/) | Gig flyer: 'The Luxury Liners, 12th & Porter, Friday Nov 14', opening for Fairfax, over a black-and-white photo of three young men. | probably 2003-11-14 (a Friday; CDX has luxury_liners_nov_14_03.jpg) | 330x510 | archive-thumbnail only | none | original | Vault / flyer wall (archive) |
| [530879257](https://www.flickr.com/photos/dewese/530879257/) | Two guitarists, one in a 'DAVID' T-shirt and green trousers, play against a brick wall in a basement club. *People:* David Dewese (DAVID T-shirt) and David Wilstermann (confirm). | c. 2001-02 (The Basement, Nashville) | 602x882 | web-small | none | original | live gallery |
| [530880353](https://www.flickr.com/photos/dewese/530880353/) | Three band members pose in a stone-walled basement, one balancing on a skateboard. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | c. 2001-02 (The Basement) | 1200x1600 | web-large | none | original | band page gallery |
| [530770026](https://www.flickr.com/photos/dewese/530770026/) | Wide view of the band on a big outdoor festival stage under a 'Atlanta' banner, crowd in front. | 2002 (Atlanta; "On The Bricks") | 676x441 | web-small | none | original | live gallery (small) |
| [530769062](https://www.flickr.com/photos/dewese/530769062/) | Three band members sit and stand around a sofa in a radio green room, the middle one with arms flung wide. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm order). | 2003-10-24 (Mitch Albom Show, Detroit, MI; Flickr date) | 963x805 | web-small | none | original | band page / timeline (radio appearance) |
| [530770314](https://www.flickr.com/photos/dewese/530770314/) | A man in a white T-shirt straddles a fallen tree trunk in a forest. *People:* band member (Flickr title "Tump - On Tour"; confirm). | 2007-06-04 (Flickr date) | 400x300 | archive-thumbnail only | none | original | archive only |
| [530769530](https://www.flickr.com/photos/dewese/530769530/) | A long-haired guitarist plays a red guitar on a dark stage. *People:* David Dewese (probable; confirm). | 12th & Porter, Nashville ("Prep Rock") | 640x409 | web-small | none | original | live gallery |
| [530880117](https://www.flickr.com/photos/dewese/530880117/) | The band on a red-lit club stage, guitarist left, drummer centre, bassist right. | The End, Nashville (date unknown) | 768x512 | web-small | none | original | live gallery |
| [530769090](https://www.flickr.com/photos/dewese/530769090/) | Seen from behind, a guitarist faces a large street-festival crowd on a sunny day. | 2002-07 (DC Sessions, Washington DC) | 320x350 | archive-thumbnail only | none | original | live gallery |
| [530879301](https://www.flickr.com/photos/dewese/530879301/) | A long-haired singer-guitarist in an olive shirt sings at an outdoor stage, coloured stage lights behind. *People:* David Dewese (probable; confirm). | 2001-02 (Dancin' In The District, Nashville) | 1536x1038 | web-medium | Photo: Mark Montgomery (confirm) | original | live gallery / hero candidate at 1536px |
| [530880159](https://www.flickr.com/photos/dewese/530880159/) | Three band members stand in front of a rocky cliff and trees. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | On tour (date unknown; "Lumber Liners") | 400x300 | archive-thumbnail only | none | original | band page gallery (small) |
| [530769920](https://www.flickr.com/photos/dewese/530769920/) | A long-haired guitarist in a checked shirt and green trousers plays on an outdoor festival stage. | 2002 (Dancin' In The District, "2002 Version") | 1110x1700 | web-large | Photo: Mark Montgomery (owner-confirmed) | original | live gallery (portrait) |
| [530769478](https://www.flickr.com/photos/dewese/530769478/) | Four members of The Luxury Liners stand arm in arm in front of a painted mural of a tree and birds. *People:* Probably David Dewese, Chad Edgington, Scott Carpenter, David Wilstermann (order unconfirmed). | 2001-03 (Chad's last show) | 2160x1440 | web-large | none | original | band page: the only photo of the four as a working band, the night Chad left |
| [530880219](https://www.flickr.com/photos/dewese/530880219/) | A triptych of a band on a red-draped stage: guitarist, drummer, guitarist. | Memphis, The Map Room (date unknown) | 874x445 | web-small | none | original | live gallery (small) |
| [530772008](https://www.flickr.com/photos/dewese/530772008/) | A guitarist seen from behind plays toward a festival crowd, the city behind motion-blurred. *People:* David "Larry" Wilstermann (Flickr title; confirm). | 2001 (Dancin' In The District) | 1454x896 | web-medium | Photo: Mark Montgomery (owner-confirmed) | original | live gallery |
| [2084463832](https://www.flickr.com/photos/dewese/2084463832/) | A bassist in a white shirt and green trousers plays a red bass on an outdoor stage. *People:* David Wilstermann (Flickr title "Larry"; confirm). | 2007-12-03 (Flickr date) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084465116](https://www.flickr.com/photos/dewese/2084465116/) | A guitarist and a drummer play an outdoor stage, the river and bridge behind them. | Dancin' In The District | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083679035](https://www.flickr.com/photos/dewese/2083679035/) | Three band members in winter jackets stand in a shopping mall. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | Michigan (tour; date unknown) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083681711](https://www.flickr.com/photos/dewese/2083681711/) | A small band plays in front of a huge American flag backdrop. | Mesquite, TX (Rodeo City) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084467138](https://www.flickr.com/photos/dewese/2084467138/) | A bassist in a lime shirt and tie plays a red bass under stage lights. | Dallas, TX | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083679871](https://www.flickr.com/photos/dewese/2083679871/) | A guitarist in a white shirt plays a red-curtained club stage strung with lights. | Memphis, The Map Room | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083682299](https://www.flickr.com/photos/dewese/2083682299/) | The band plays a small stage under 'Welcome' and 'Red Eyed Fly' banners. | Austin, TX, SXSW (year unknown; Red Eyed Fly venue banner) | 350x350 | archive-thumbnail only | none | original | thumbnail only; evidence for the SXSW question (Q5) |
| [2083679183](https://www.flickr.com/photos/dewese/2083679183/) | Three musicians play acoustic instruments in a coffee shop beside a Starbucks sign. | Detroit, MI | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084464478](https://www.flickr.com/photos/dewese/2084464478/) | The band plays a club stage under red and blue light. | The End, Nashville | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084465740](https://www.flickr.com/photos/dewese/2084465740/) | A group of young men and a woman pose in front of the Slow Bar sign. | Slow Bar (Nashville?) | 350x350 | archive-thumbnail only | none | original | archive only |
| [2084464292](https://www.flickr.com/photos/dewese/2084464292/) | A man in sunglasses photographs himself in a car wing mirror. | 2007-12-03 (Flickr date) | 350x350 | archive-thumbnail only | none | original | archive only |
| [2083678033](https://www.flickr.com/photos/dewese/2083678033/) | A guitarist in an olive shirt plays in front of a large festival backdrop. | Atlanta ("On The Bricks") | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083681777](https://www.flickr.com/photos/dewese/2083681777/) | Electric guitars and a pile of effects pedals laid out on a wooden floor. | c. 2005 (recording Nonetheless) | 350x350 | archive-thumbnail only | none | original | album page: Nonetheless (thumbnail) |
| [2084465462](https://www.flickr.com/photos/dewese/2084465462/) | Three band members in Halloween costumes, one dressed as Peter Pan. | Halloween 2001 | 350x350 | archive-thumbnail only | none | original | archive only |
| [2083681671](https://www.flickr.com/photos/dewese/2083681671/) | A guitarist silhouetted in red and orange stage smoke. | Nashville, TN | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084465304](https://www.flickr.com/photos/dewese/2084465304/) | A man in a white Elvis-style jumpsuit with a red scarf strikes a pose on stage. *People:* Chad Edgington (Flickr title; confirm). | 2007-12-03 (Flickr date) | 350x350 | archive-thumbnail only | none | original | band page: Chad-era colour (thumbnail) |
| [2084467004](https://www.flickr.com/photos/dewese/2084467004/) | A wide stage under orange spotlights with two players at the edges. | Nashville, TN | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084465986](https://www.flickr.com/photos/dewese/2084465986/) | Three band members in T-shirts stand in front of a rock cliff, one shirt reading 'Made in Texas'. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2007-12-03 (Flickr date) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084464638](https://www.flickr.com/photos/dewese/2084464638/) | A drummer in a white shirt plays a blue drum kit against red drapes. *People:* Scott Carpenter (probable; confirm). | Memphis, TN | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084464380](https://www.flickr.com/photos/dewese/2084464380/) | Two men in sunglasses shout and wave in the front seats of a car. | "Wreck" (tour) | 350x350 | archive-thumbnail only | none | original | archive only |
| [2084466294](https://www.flickr.com/photos/dewese/2084466294/) | Two guitarists play a dark club stage, a Texas-flag bass drum behind. | Columbia, SC | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084466932](https://www.flickr.com/photos/dewese/2084466932/) | A big stage washed in pink and yellow light, the band small at the edges. | Nashville, TN | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084467636](https://www.flickr.com/photos/dewese/2084467636/) | Three band members peer out from behind a stone column, two in blue T-shirts printed 'ARRY' and 'DAVID'. *People:* David Wilstermann ("LARRY" shirt), David Dewese ("DAVID" shirt), Scott Carpenter (confirm). | 2001 (Capitol shoot, Nashville) | 350x350 | archive-thumbnail only | none | original | band page (thumbnail; ask for the original shoot) |
| [2084466842](https://www.flickr.com/photos/dewese/2084466842/) | A guitarist in a grey T-shirt plays against deep blue curtains. | Nashville, TN | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083681469](https://www.flickr.com/photos/dewese/2083681469/) | A long-haired guitarist plays a red guitar on a dark stage. | Rocketown, Nashville (2003-04?) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083680395](https://www.flickr.com/photos/dewese/2083680395/) | A man in an orange shirt sits at a large mixing desk in a recording studio. | Studio (date unknown) | 350x350 | archive-thumbnail only | none | original | archive only |
| [2084465244](https://www.flickr.com/photos/dewese/2084465244/) | Two guitarists in 'DAVID' and 'LARRY' T-shirts play against a painted brick wall. *People:* David Dewese and David Wilstermann (shirts; confirm). | The Basement, Nashville (c. 2001) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083678959](https://www.flickr.com/photos/dewese/2083678959/) | A guitarist in a checked shirt and green trousers plays on an outdoor stage. | Dancin' In The District | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084466654](https://www.flickr.com/photos/dewese/2084466654/) | The band plays the stage of The House café, a lit sign above. | Indianapolis, IN | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083682207](https://www.flickr.com/photos/dewese/2083682207/) | Three band members in olive work shirts lean against stone columns. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2001 (Capitol shoot, Nashville) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083680247](https://www.flickr.com/photos/dewese/2083680247/) | Three band members lean on the open boot of a car in a car park. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | Georgia tour | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083678153](https://www.flickr.com/photos/dewese/2083678153/) | A drummer in sunglasses plays a light-blue kit; the bass drum head carries the band's circular logo. *People:* Scott Carpenter (probable; confirm). | Atlanta ("On The Bricks") | 350x350 | archive-thumbnail only | none | original | logo evidence (roundel on the kick drum) |
| [2084466500](https://www.flickr.com/photos/dewese/2084466500/) | A signed black-and-white 8x10 promo print of the three Luxury Liners lies on a desk. | c. 2003 (signed promo print; same image as 533775919) | 350x350 | archive-thumbnail only | none | original | Vault / press kit history |
| [2084467542](https://www.flickr.com/photos/dewese/2084467542/) | Three band members walk down wide stone steps in blue T-shirts, one printed 'LARRY'. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2001 (Capitol shoot) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084463616](https://www.flickr.com/photos/dewese/2084463616/) | Two men in sunglasses ride in a car, seen through the windscreen. | On tour | 400x300 | archive-thumbnail only | none | original | archive only |
| [2084463656](https://www.flickr.com/photos/dewese/2084463656/) | Gig flyer: 'The Luxury Liners, Tues Dec 9, Exit/In 8:00, Western Beat', with a split image of a man in a white suit. | 2003-12-09 (a Tuesday) | 330x510 | archive-thumbnail only | none | original | Vault / flyer wall |
| [2084464804](https://www.flickr.com/photos/dewese/2084464804/) | A singer-guitarist in a white shirt plays under red light. | Memphis, TN | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084467510](https://www.flickr.com/photos/dewese/2084467510/) | Three band members in olive shirts, one sniffing a white magnolia flower. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2001 (Capitol shoot) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084463470](https://www.flickr.com/photos/dewese/2084463470/) | Three band members in olive shirts stand in a curved tiled tunnel. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | Atlanta, GA (same session as 533776499) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084465400](https://www.flickr.com/photos/dewese/2084465400/) | Close-up of a smiling young man with long hair in a black Western shirt with white piping. *People:* band member (unnamed; confirm). | c. 2000 (Mark Montgomery white-studio session?) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084465904](https://www.flickr.com/photos/dewese/2084465904/) | A man in a white cowboy hat and checked shirt stands in a Western-wear shop. *People:* David Dewese (Flickr title "Western DD"; confirm). | 2007-12-03 (Flickr date) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083678081](https://www.flickr.com/photos/dewese/2083678081/) | A bassist in a green work shirt plays on stage. | Atlanta ("On The Bricks") | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084465942](https://www.flickr.com/photos/dewese/2084465942/) | A man in a cowboy hat and 'Twins' T-shirt adjusts his suspenders in a shop. | 2007-12-03 (Flickr date) | 350x350 | archive-thumbnail only | none | original | archive only |
| [2084466592](https://www.flickr.com/photos/dewese/2084466592/) | Close-up of a yellow acoustic guitar with a round 'The Luxury Liners' logo sticker and a flower sticker. | c. 2001-04 | 350x350 | archive-thumbnail only | none | original | logo reference (roundel sticker) |
| [2084467408](https://www.flickr.com/photos/dewese/2084467408/) | Three band members in olive shirts stand beside a vintage bus. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2001 (Capitol shoot) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084463250](https://www.flickr.com/photos/dewese/2084463250/) | Wide shot of the band on a large outdoor festival stage under a banner. | Atlanta, GA | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083681019](https://www.flickr.com/photos/dewese/2083681019/) | A red-and-white letterpress-style poster: 'The Luxury Liners, Texas Pop, Tonight No Cover'. | c. 2001-04 (Flickr title "Hatch Show") | 350x350 | archive-thumbnail only | none | original | logo/type reference ("Texas Pop"); Vault |
| [2083677995](https://www.flickr.com/photos/dewese/2083677995/) | A singer-guitarist in a green work shirt sings into a microphone on an outdoor stage. | Atlanta, GA | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083681129](https://www.flickr.com/photos/dewese/2083681129/) | A singer-guitarist in a black hoodie plays a red guitar beside a drummer in a yellow T-shirt. | Slow Bar | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083681803](https://www.flickr.com/photos/dewese/2083681803/) | Three band members in name T-shirts ('DAVID', 'SCOTT') stand arm in arm by a stone building. *People:* David Wilstermann, David Dewese ("DAVID"), Scott Carpenter ("SCOTT") (confirm left one). | 2001 (Capitol shoot) | 350x350 | archive-thumbnail only | none | original | thumbnail only; strong caption evidence |
| [2084463352](https://www.flickr.com/photos/dewese/2084463352/) | Three band members stand on a busy city street at dusk. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | Atlanta, GA | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083681529](https://www.flickr.com/photos/dewese/2083681529/) | A long-haired singer-guitarist sings under red light. | Rocketown, Nashville | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084465170](https://www.flickr.com/photos/dewese/2084465170/) | The band plays an outdoor stage in a parking lot, a Texas-flag bass drum centre. | Georgia (parking-lot show) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084463766](https://www.flickr.com/photos/dewese/2084463766/) | The band plays a riverside outdoor stage, a truss bridge behind. | Dancin' In The District, Nashville | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083679651](https://www.flickr.com/photos/dewese/2083679651/) | A marquee lit with bulbs reads 'the END. Luxury Liners'. | The End, Nashville | 350x350 | archive-thumbnail only | none | original | timeline / Vault (thumbnail) |
| [2083680909](https://www.flickr.com/photos/dewese/2083680909/) | A big festival crowd in front of a stage set against a columned building. | Washington, DC | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084466076](https://www.flickr.com/photos/dewese/2084466076/) | Seen from behind, a guitarist plays to a large street crowd. | Washington, DC | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083680433](https://www.flickr.com/photos/dewese/2083680433/) | A grinning man in a grey 'LARRY' T-shirt at a microphone. *People:* David "Larry" Wilstermann (Flickr title and shirt; confirm). | 2007-12-03 (Flickr date) | 350x350 | archive-thumbnail only | none | original | band page: Larry nickname story (thumbnail) |
| [2083681167](https://www.flickr.com/photos/dewese/2083681167/) | A bald man in a dark T-shirt poses for a mock mugshot holding the number 49917. *People:* Scott Carpenter (Flickr title "Scott"; confirm). | 2007-12-03 (Flickr date) | 350x350 | archive-thumbnail only | none | original | archive only (duplicate of 530880283) |
| [2084464548](https://www.flickr.com/photos/dewese/2084464548/) | A guitarist in a checked shirt plays under bright stage light at dusk. | Dancin' In The District | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083678371](https://www.flickr.com/photos/dewese/2083678371/) | Three band members sit in a radio studio under an Epiphone banner. | Atlanta, GA (radio/in-store) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084465038](https://www.flickr.com/photos/dewese/2084465038/) | The band plays a small café stage in matching blue T-shirts, a Texas-flag bass drum behind. | Knoxville, TN | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083679813](https://www.flickr.com/photos/dewese/2083679813/) | Looking over a drum kit at two guitarists on a red-lit stage. | Memphis, TN | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2083680513](https://www.flickr.com/photos/dewese/2083680513/) | A roadside sign in a field reads 'Used Cows For Sale'. | Kentucky (tour) | 350x350 | archive-thumbnail only | none | original | archive only (tour humour) |
| [2084467252](https://www.flickr.com/photos/dewese/2084467252/) | Three men pose indoors, one in an orange T-shirt. | Indiana (tour) | 400x300 | archive-thumbnail only | none | original | archive only |
| [2083682095](https://www.flickr.com/photos/dewese/2083682095/) | Three band members walk down wide stone steps in blue name T-shirts, 'SCOTT' in front. *People:* Scott Carpenter ("SCOTT"), David Wilstermann ("LARRY"), David Dewese ("DAVID") (confirm). | 2001 (Capitol shoot) | 350x350 | archive-thumbnail only | none | original | thumbnail only |
| [2084467676](https://www.flickr.com/photos/dewese/2084467676/) | Gig flyer: 'The Luxury Liners, Tues Jan 20, Exit/In 9:00, Western Beat', with a cowboy film still. | 2004-01-20 (a Tuesday) | 330x510 | archive-thumbnail only | none | original | Vault / flyer wall |
| [2083680633](https://www.flickr.com/photos/dewese/2083680633/) | A man in a black cowboy hat and olive T-shirt stands in a Western-wear shop. *People:* David Wilstermann (Flickr title "Cowboy Larry"; confirm). | 2007-12-03 (Flickr date) | 350x350 | archive-thumbnail only | none | original | thumbnail only |

#### ARCHIVE: Vintage Luxury Liners Shots (33 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157603310364995)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [2067311143](https://www.flickr.com/photos/dewese/2067311143/) | Two musicians in white shirts and red neckerchiefs play guitars against a brick wall. *People:* David Dewese and Chad Edgington (probable; confirm). | c. 1998-99 (Chad era) | 894x600 | web-small | none | original | band page: early years |
| [2068107526](https://www.flickr.com/photos/dewese/2068107526/) | A long-haired singer in a white shirt and pink neckerchief sings and plays a Telecaster. *People:* Chad Edgington (Flickr title "Chad 'Ace' Edgington"; confirm). | c. 1998-99 | 819x900 | web-small | none | original | band page: Chad profile |
| [2067311761](https://www.flickr.com/photos/dewese/2067311761/) | Three young men in matching pale-blue suits and black ties grin at the camera. *People:* Chad Edgington among them (Flickr title "Classic Chad"); others unconfirmed. | c. 1998 (Chad era) | 963x600 | web-small | none | original | band page: early years (powder-blue suits) |
| [2068108124](https://www.flickr.com/photos/dewese/2068108124/) | Black-and-white contact sheet of a studio portrait session of two young men. *People:* David Dewese and Chad Edgington (probable; confirm). | 1998 (Billboard photo shoot) | 1275x1400 | web-medium | none | original | Vault / timeline (1998 Billboard) |
| [2068108482](https://www.flickr.com/photos/dewese/2068108482/) | Contact sheet of a black-and-white studio shoot of two young people in pale jackets. *People:* two people, not captioned; ask Carly. | 1998 (Billboard photo shoot) | 1275x1257 | web-medium | Photo: Trey Mitchell (owner-confirmed) | original | Vault / timeline |
| [2068108792](https://www.flickr.com/photos/dewese/2068108792/) | Four young men in matching pale-blue suits stand backstage. *People:* Chad-era four-piece (names unconfirmed). | 1998 (backstage) | 844x619 | web-small | none | original | band page: early years |
| [2067314041](https://www.flickr.com/photos/dewese/2067314041/) | Colour contact sheet of a studio shoot, two young men in suits against an orange backdrop. | 1998 (Billboard photo shoot) | 1275x1238 | web-medium | none | original | Vault |
| [2068110424](https://www.flickr.com/photos/dewese/2068110424/) | The band in white suits plays the Hard Rock Cafe stage under a Bud Light banner. | 1998 (Hard Rock Cafe, Nashville) | 600x919 | web-small | none | original | band page: early years / timeline |
| [2067314683](https://www.flickr.com/photos/dewese/2067314683/) | A smiling young man in a pale-blue suit and black tie. *People:* Kyle Edgington (Flickr title; former drummer, May-Aug 1998). | 1998 | 769x600 | web-small | none | web 769x600 | archive only |
| [2067315769](https://www.flickr.com/photos/dewese/2067315769/) | The band in pale suits plays the Hard Rock Cafe stage. | 1998 (Hard Rock Cafe) | 919x588 | web-small | none | web 919x588 | timeline |
| [2068112158](https://www.flickr.com/photos/dewese/2068112158/) | Two guitarists in white suits play the Hard Rock Cafe stage. | 1998 (Hard Rock Cafe) | 888x625 | web-small | none | web 800x563 | timeline |
| [2067316175](https://www.flickr.com/photos/dewese/2067316175/) | Three young men in matching pale-blue suits. *People:* Chad-era line-up (names unconfirmed). | 1998 (The End, Nashville) | 809x539 | web-small | none | web 800x533 | band page: early years |
| [2068112626](https://www.flickr.com/photos/dewese/2068112626/) | A singer in sunglasses and a Hawaiian shirt sings into a microphone. | 1998 (Sam-n-Zoe's) | 919x494 | web-small | none | web 919x494 | archive only |
| [2068112804](https://www.flickr.com/photos/dewese/2068112804/) | The band in white suits plays the Hard Rock Cafe stage, seen from the floor. | 1998 (Hard Rock Cafe) | 913x600 | web-small | none | web 913x600 | timeline |
| [2068113640](https://www.flickr.com/photos/dewese/2068113640/) | Colour contact sheet of a studio session with the band in suits against orange and blue. | 1998 (Billboard photoshoot; "They put SO much makeup on us.") | 1275x1300 | web-medium | none | web 1004x1024 | Vault |
| [2067317821](https://www.flickr.com/photos/dewese/2067317821/) | Three young men sing together around studio microphones. | c. 1998 ("Sony Tree") | 925x613 | web-small | none | web 925x613 | timeline (studio) |
| [2068113990](https://www.flickr.com/photos/dewese/2068113990/) | A young man plays acoustic guitar alone in a bright studio room. *People:* Chad Edgington (Flickr title; confirm). | 2007-11-26 (Flickr date) | 900x588 | web-small | none | web 800x523 | band page: Chad profile |
| [2067318287](https://www.flickr.com/photos/dewese/2067318287/) | Black-and-white contact sheet of a studio portrait session. | 1998 (Billboard photoshoot) | 1213x1288 | web-medium | Photo: Trey Mitchell (confirm) | web 964x1024 | Vault |
| [2067318305](https://www.flickr.com/photos/dewese/2067318305/) | A green speech-bubble graphic holding an early band bio about Texas pop and the band members' college. | c. 1999-2000 (early band website) | 377x296 | archive-thumbnail only | none | web 377x296 | Vault (old website); text source for history |
| [2067318425](https://www.flickr.com/photos/dewese/2067318425/) | Black-and-white photo of three young men in dark suits clowning with outstretched arms. | 1998 (12th & Porter) | 350x250 | archive-thumbnail only | none | web 350x250 | band page: early years |
| [2067318457](https://www.flickr.com/photos/dewese/2067318457/) | A smiling young man with long hair in a pale-blue suit and black tie. *People:* David Dewese (Flickr title). | 1998 | 240x250 | archive-thumbnail only | none | web 240x250 | band page / Vault (small) |
| [2067318469](https://www.flickr.com/photos/dewese/2067318469/) | Outside the Texas Music Café television studio, a sign lists 'Luxury Liners' as this week's taping; one man leaps in the air. | 1998 (Waco, TX; Texas Music Café) | 350x250 | archive-thumbnail only | none | web 350x250 | timeline: first Texas Music Café taping (links to the 2021 live single) |
| [2068114460](https://www.flickr.com/photos/dewese/2068114460/) | Black-and-white photo of young men in dark suits beside a lamp in a club. | 1998 (12th & Porter) | 300x250 | archive-thumbnail only | none | web 300x250 | archive only |
| [2068114476](https://www.flickr.com/photos/dewese/2068114476/) | A green oval collage of band photos with a 12th & Porter show notice: the band's website graphic. | 2000 (band website) | 394x296 | archive-thumbnail only | none | web 394x296 | Vault (old website) |
| [2067318521](https://www.flickr.com/photos/dewese/2067318521/) | Postcard flyer: 'the luxury liners, 12th & Porter, Wed Sept 15th 9:30' over a drawing of trouser legs and shoes. | Flickr says 1998; Sept 15 was a Wednesday in 1999, so probably 1999-09-15 (contested) | 350x250 | archive-thumbnail only | none | web 350x250 | Vault / flyer wall; same leg motif as the Sound As Ever cover |
| [2068114522](https://www.flickr.com/photos/dewese/2068114522/) | Black-and-white close-up of three grinning young men in white shirts and dark ties. *People:* Chad-era trio (names unconfirmed). | 1998 (12th & Porter) | 350x250 | archive-thumbnail only | none | web 350x250 | band page: early years |
| [2068114542](https://www.flickr.com/photos/dewese/2068114542/) | A smiling drummer in a white shirt and black tie behind a cymbal. *People:* Scott Carpenter (Flickr title). | c. 1998-99 | 300x250 | archive-thumbnail only | none | web 300x250 | band page: Scott profile (small) |
| [2068114558](https://www.flickr.com/photos/dewese/2068114558/) | Black-and-white photo of three laughing young men in dark suits. | 1998 (12th & Porter) | 350x250 | archive-thumbnail only | none | web 350x250 | band page: early years |
| [2068114580](https://www.flickr.com/photos/dewese/2068114580/) | Three singers in dark suits share microphones on the Exit/In stage. | 1999 (Exit/In, Nashville) | 350x250 | archive-thumbnail only | none | web 350x250 | timeline |
| [2067318655](https://www.flickr.com/photos/dewese/2067318655/) | Two guitarists in white suits play the Texas Music Café stage. | 1998 (Waco, TX; Texas Music Café) | 350x250 | archive-thumbnail only | none | web 350x250 | timeline |
| [2068114608](https://www.flickr.com/photos/dewese/2068114608/) | Old website splash: 'the Luxury Liners' logo in green and white, credit 'Design: Jeremy Cowart, andersonthomas'. | 2000 (J.Co website) | 268x200 | archive-thumbnail only | none | web 268x200 | Vault (old website); logo history |
| [2086444773](https://www.flickr.com/photos/dewese/2086444773/) | Three young men in T-shirts pose on a sunny Los Angeles sidewalk in front of the sign for The Gig club. *People:* Scott Carpenter, Chad Edgington and David Dewese (Flickr description; order unconfirmed). | 2000-08 (Los Angeles; "Scott, Chad, and Me") | 500x390 | archive-thumbnail only | none | web 500x390 | band page: Chad-era trio (small but documented) |
| [2218885470](https://www.flickr.com/photos/dewese/2218885470/) | A long-haired guitarist plays a Les Paul in a dark room. | unknown ("Bad Idea") | 288x393 | archive-thumbnail only | none | web 288x393 | archive only |

#### ARCHIVE: Luxury Larry Promos (20 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157600319833733)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [533675524](https://www.flickr.com/photos/dewese/533675524/) | Promo image: three band members against white, under a red 'The Luxury Liners' wordmark with a crossed X. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | c. 2003-04 (Paul Paternoster shoot) | 768x512 | web-small | Photo: Paul Paternoster (confirm) | web 768x512 | logo reference + band page |
| [533675584](https://www.flickr.com/photos/dewese/533675584/) | Promo image: three band members, one in a shearling coat, beside the condensed 'The Luxury Liners' wordmark. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2003 (Amy Wilstermann shoot) | 388x391 | archive-thumbnail only | Photo: Amy Wilstermann (confirm) | web 388x391 | logo reference |
| [533776657](https://www.flickr.com/photos/dewese/533776657/) | Three band members in a dark green-lit doorway marked 34. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | c. 2002-03 (Downtown Pres shoot) | 500x325 | archive-thumbnail only | none | web 500x325 | band page |
| [533675632](https://www.flickr.com/photos/dewese/533675632/) | Three band members look out from behind window bars. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | c. 2002-03 (Wes Ware shoot) | 360x299 | archive-thumbnail only | Photo: Wes Ware (confirm) | web 360x299 | band page (small) |
| [533675938](https://www.flickr.com/photos/dewese/533675938/) | Three band members in silhouette against a bright light, under an orange 'The Luxury Liners' wordmark. | Atlanta, GA ("the logo is the only fake part of this photo") | 665x434 | web-small | none | web 665x434 | logo reference |
| [533776261](https://www.flickr.com/photos/dewese/533776261/) | Three band members against a pale wall, one in a red '7' T-shirt. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | c. 2003-04 (Paul Paternoster shoot) | 512x768 | web-small | Photo: Paul Paternoster (confirm) | web 512x768 | band page |
| [533675192](https://www.flickr.com/photos/dewese/533675192/) | Three band members in olive work shirts on a Nashville street, the 'Batman' tower behind. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | c. 2001-02 (Peyton Hoge) | 1038x1536 | web-medium | Photo: Peyton Hoge (confirm) | web 1038x1536 | band page / hero candidate (1536px portrait) |
| [533776161](https://www.flickr.com/photos/dewese/533776161/) | Three band members sit on a sofa in a living room. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | c. 2003 ("Homemade") | 1800x1194 | web-large | none | web 1599x1061 | band page |
| [533776283](https://www.flickr.com/photos/dewese/533776283/) | Three band members sit in the seats of an old bus. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | c. 2003-04 (Paul Paternoster shoot) | 768x512 | web-small | Photo: Paul Paternoster (confirm) | web 768x512 | band page |
| [533776573](https://www.flickr.com/photos/dewese/533776573/) | Black-and-white portrait of three band members in black T-shirts against white. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | c. 2003 (Amy Wilstermann shoot) | 1675x1086 | web-large | Photo: Amy Wilstermann (confirm) | web 1599x1037 | band page / engraving source candidate (1675px) |
| [533675926](https://www.flickr.com/photos/dewese/533675926/) | Three band members in a dark doorway marked 34, looking toward the light. | Downtown Pres shoot | 426x274 | archive-thumbnail only | none | web 426x274 | band page (small) |
| [533776319](https://www.flickr.com/photos/dewese/533776319/) | Three band members leap into the air between skyscrapers against a blue sky. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | c. 2003 ("That's Right") | 640x427 | web-small | none | web 640x427 | band page / social card (640px) |
| [533675920](https://www.flickr.com/photos/dewese/533675920/) | Three band members sit in front of a shelf of books and LPs in an attic, two in 'SCOTT' and 'LARRY' shirts. *People:* Scott Carpenter ("SCOTT"), David Wilstermann ("LARRY"), David Dewese (confirm). | c. 2003 ("Attic") | 1683x1107 | web-large | none | web 1599x1052 | band page (1683px) |
| [533776329](https://www.flickr.com/photos/dewese/533776329/) | Sepia photo of three band members around a table by a window. | Downtown Pres shoot | 424x271 | archive-thumbnail only | none | web 424x271 | band page (small) |
| [533676000](https://www.flickr.com/photos/dewese/533676000/) | Sepia photo of three band members at a table with a vignette border. | c. 2002-03 (Wes Ware shoot) | 360x280 | archive-thumbnail only | Photo: Wes Ware (confirm) | web 360x280 | band page (small) |
| [533776499](https://www.flickr.com/photos/dewese/533776499/) | Three band members in olive shirts stand in a curved tiled tunnel lit green. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | Atlanta, GA | 1692x1104 | web-large | none | web 1600x1044 | band page (1692px) |
| [533775919](https://www.flickr.com/photos/dewese/533775919/) | Black-and-white 8x10 promo print: three band members between stone pillars, 'theluxuryliners' wordmark below. | 2003 (Overbored promo 8x10; Amy Wilstermann photo) | 600x480 | web-small | Photo: Amy Wilstermann (confirm) | web 600x480 | press kit history; logo reference |
| [533776611](https://www.flickr.com/photos/dewese/533776611/) | Three band members in a narrow alley flooded with green-yellow light. | Downtown Pres shoot | 500x324 | archive-thumbnail only | none | web 500x324 | band page (small) |
| [533776779](https://www.flickr.com/photos/dewese/533776779/) | Three band members on a porch at dusk, the city skyline behind. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2001 (after the first trio practice) | 1182x1803 | web-large | none | web 1049x1600 | band page / timeline: start of the trio era (1803px portrait) |
| [533676680](https://www.flickr.com/photos/dewese/533676680/) | Three band members sit among boxes in a storeroom, one holding an acoustic guitar. | Downtown Pres shoot | 427x274 | archive-thumbnail only | none | web 427x274 | band page (small) |

#### ARCHIVE: Luxury Liners 2003 (4 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157603362848870)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [2083620879](https://www.flickr.com/photos/dewese/2083620879/) | The Luxury Liners' three members photographed from below against a clear blue sky. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (positions unconfirmed). | 2003 (Overbored promo) | 2560x1920 | print-ok | Photo: Amy Wilstermann (owner-confirmed) | web 2048x1536 | hero / album page: Overbored |
| [2084406418](https://www.flickr.com/photos/dewese/2084406418/) | Three members of The Luxury Liners stand apart, each in a recessed dark panel of a pale stone wall. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (positions unconfirmed). | 2003 (Overbored promo) | 2560x1920 | print-ok | Photo: Amy Wilstermann (owner-confirmed) | web 2048x1536 | HERO: the only retina-wide band image |
| [2084406228](https://www.flickr.com/photos/dewese/2084406228/) | Low-angle portrait of The Luxury Liners' three members against blue sky. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (positions unconfirmed). | 2003 (Overbored promo) | 1920x2560 | print-ok | Photo: Amy Wilstermann (owner-confirmed) | web 1536x2048 | portrait hero / mobile |
| [2083621513](https://www.flickr.com/photos/dewese/2083621513/) | The Luxury Liners lean between stone pillars, one member in a shearling coat in front. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (positions unconfirmed). | 2003 (Overbored promo) | 2560x1920 | print-ok | Photo: Amy Wilstermann (owner-confirmed) | original | hero / album page: Overbored; engraving source candidate |

#### ARCHIVE: Luxury Liners 2005 (14 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157603344283357)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [2077455434](https://www.flickr.com/photos/dewese/2077455434/) | The Luxury Liners sit on vintage TV sets in front of a distressed red wall. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2005 (Kristin Barlowe session) | 800x1200 | web-medium | Photo: Kristin Barlowe (confirm) | web 683x1024 | band page; album page: Nonetheless |
| [2076666865](https://www.flickr.com/photos/dewese/2076666865/) | The Luxury Liners sit on a couch and vintage TV sets in front of a distressed red wall. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2005 (Kristin Barlowe session) | 800x533 | web-small | Photo: Kristin Barlowe (owner-confirmed) | web 800x533 | album page: Nonetheless |
| [2076666909](https://www.flickr.com/photos/dewese/2076666909/) | The Luxury Liners sit on vintage TV sets in front of a distressed red wall. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2005 (Kristin Barlowe session) | 800x1200 | web-medium | Photo: Kristin Barlowe (confirm) | web 683x1024 | band page; album page: Nonetheless |
| [2077455756](https://www.flickr.com/photos/dewese/2077455756/) | Close portrait of a man in a pink checked shirt against a dark leather backdrop. *People:* David Wilstermann (Flickr title "Larry"). | 2005 (Kristin Barlowe) | 800x1200 | web-medium | Photo: Kristin Barlowe (confirm) | web 683x1024 | band page: member portrait |
| [2076666953](https://www.flickr.com/photos/dewese/2076666953/) | Close portrait of David Dewese in a corduroy jacket and green T-shirt against a red wall. *People:* David Dewese (Flickr title "David"). | 2005 (Kristin Barlowe) | 800x533 | web-small | Photo: Kristin Barlowe (confirm) | web 800x533 | band page: member portrait |
| [2077455616](https://www.flickr.com/photos/dewese/2077455616/) | David Dewese grins at the camera in a bold black-and-white striped shirt and bead necklace, against a dark backdrop. *People:* David Dewese. | 2005 (Kristin Barlowe) | 400x600 | web-small | Photo: Kristin Barlowe (confirm) | web 400x600 | band page: member portrait (master on disk) |
| [2076666931](https://www.flickr.com/photos/dewese/2076666931/) | The three Luxury Liners sit on a couch in front of a distressed red wall, laughing. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2005 (Kristin Barlowe) | 800x533 | web-small | Photo: Kristin Barlowe (confirm) | web 800x533 | band page |
| [2076666803](https://www.flickr.com/photos/dewese/2076666803/) | The Luxury Liners laugh together in an alley at dusk. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2005 (Kristin Barlowe) | 800x533 | web-small | Photo: Kristin Barlowe (owner-confirmed) | web 800x533 | band page |
| [2076666765](https://www.flickr.com/photos/dewese/2076666765/) | The three Luxury Liners stand in a street at dusk under power lines. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2005 (Kristin Barlowe) | 800x1200 | web-medium | Photo: Kristin Barlowe (confirm) | web 683x1024 | band page (portrait) |
| [2076666999](https://www.flickr.com/photos/dewese/2076666999/) | Tight close-up of a man in a checked shirt, half his face lit. *People:* David Wilstermann (Flickr title "Larry"). | 2005 (Kristin Barlowe) | 800x533 | web-small | Photo: Kristin Barlowe (confirm) | web 800x533 | band page: member portrait |
| [2077455704](https://www.flickr.com/photos/dewese/2077455704/) | A bald man in a black zip track jacket against a dark backdrop. *People:* Scott Carpenter (Flickr title). | 2005 (Kristin Barlowe) | 800x1200 | web-medium | Photo: Kristin Barlowe (confirm) | web 683x1024 | band page: member portrait |
| [2076667133](https://www.flickr.com/photos/dewese/2076667133/) | Close portrait of a bald man in a black zip top. *People:* Scott Carpenter (Flickr title). | 2005 (Kristin Barlowe) | 800x1200 | web-medium | Photo: Kristin Barlowe (confirm) | web 683x1024 | band page: member portrait |
| [2077455656](https://www.flickr.com/photos/dewese/2077455656/) | A bald man in a black Western shirt with red embroidery sits against a red wall. *People:* Scott Carpenter (Flickr title). | 2005 (Kristin Barlowe) | 800x1200 | web-medium | Photo: Kristin Barlowe (confirm) | web 683x1024 | band page: member portrait |
| [2076667081](https://www.flickr.com/photos/dewese/2076667081/) | Close portrait of David Dewese in a brown corduroy jacket, green T-shirt and bead necklace, against a mottled red wall. *People:* David Dewese. | 2005 (Kristin Barlowe) | 400x600 | web-small | Photo: Kristin Barlowe (confirm) | web 400x600 | band page: member portrait (master on disk) |

#### ARCHIVE: Luxury Liners 2000 (9 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157603331145135)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [2074032206](https://www.flickr.com/photos/dewese/2074032206/) | In a white studio, one band member in a pale-blue suit leaps with an arm raised while two in suits watch. *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000 (Mark Montgomery) | 687x661 | web-small | Photo: Mark Montgomery (confirm) | web 687x661 | band page; the jump image the current Carrd site uses |
| [2074031888](https://www.flickr.com/photos/dewese/2074031888/) | The Luxury Liners sit on the floor of a white photo studio in coats. *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000 (Mark Montgomery) | 1584x1307 | web-medium | Photo: Mark Montgomery (owner-confirmed) | web 1584x1307 | band page; matches the current Carrd share image |
| [2074031748](https://www.flickr.com/photos/dewese/2074031748/) | A smiling man frames his face with both hands against white. *People:* Scott Carpenter (Flickr title "Scott as Chris Gaines"). | c. 2000 (Mark Montgomery) | 826x538 | web-small | Photo: Mark Montgomery (confirm) | web 800x521 | band page: member portrait |
| [2073239679](https://www.flickr.com/photos/dewese/2073239679/) | Three band members in black sweaters stand with arms outstretched in a row against white. *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000 (Mark Montgomery) | 1583x1001 | web-medium | Photo: Mark Montgomery (confirm) | web 1583x1001 | band page (1583px) |
| [2074032054](https://www.flickr.com/photos/dewese/2074032054/) | Three band members in blue, red and green T-shirts sit together, one holding a guitar. *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000 (Mark Montgomery) | 826x539 | web-small | Photo: Mark Montgomery (confirm) | web 800x522 | band page |
| [2073240141](https://www.flickr.com/photos/dewese/2073240141/) | A long-haired man in a black turtleneck plays a red bass in a white studio. *People:* Chad Edgington (Flickr title). | c. 2000 (Mark Montgomery) | 1100x1635 | web-large | Photo: Mark Montgomery (confirm) | web 1076x1599 | band page: Chad profile (1100x1635) |
| [2073240487](https://www.flickr.com/photos/dewese/2073240487/) | Three band members in coloured T-shirts stand far apart in a white studio. *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000 (Mark Montgomery) | 829x542 | web-small | Photo: Mark Montgomery (confirm) | web 800x523 | band page |
| [2074032162](https://www.flickr.com/photos/dewese/2074032162/) | Three band members in embroidered Western shirts laugh together against white. *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000 (Mark Montgomery) | 818x552 | web-small | Photo: Mark Montgomery (confirm) | web 800x540 | band page; same session as the Shake It Up (Live) cover photo |
| [2073239851](https://www.flickr.com/photos/dewese/2073239851/) | The Luxury Liners dance in coloured T-shirts against a white studio backdrop. *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000 (Mark Montgomery) | 1646x1082 | web-large | Photo: Mark Montgomery (owner-confirmed) | original | band page (1646px) |

#### ARCHIVE: Rejected Designs (10 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157600306637690)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [529027803](https://www.flickr.com/photos/dewese/529027803/) | Unused Nonetheless cover design: the three band members in a green duotone with the band name. | c. 2005-06 | 399x399 | archive-thumbnail only | none | web 399x399 | album page: Nonetheless (design history) |
| [529027877](https://www.flickr.com/photos/dewese/529027877/) | Unused Nonetheless cover design: three band members in close-up on a deep red panel. | c. 2005-06 | 399x399 | archive-thumbnail only | none | web 399x399 | album page: Nonetheless (design history) |
| [528939136](https://www.flickr.com/photos/dewese/528939136/) | Unused Nonetheless cover design: 'The Luxury Liners Nonetheless' on a scratched green square. | c. 2005-06 | 399x399 | archive-thumbnail only | none | web 399x399 | album page: Nonetheless (design history) |
| [529027789](https://www.flickr.com/photos/dewese/529027789/) | Unused Nonetheless cover design: a red stain on a yellow halftone ground. | c. 2005-06 | 399x399 | archive-thumbnail only | none | web 399x399 | album page: Nonetheless (design history) |
| [529027907](https://www.flickr.com/photos/dewese/529027907/) | Unused Nonetheless cover design: the three band members in a sunlit lane under a yellow wordmark. | c. 2005-06 | 399x399 | archive-thumbnail only | none | web 399x399 | album page: Nonetheless (design history) |
| [528939016](https://www.flickr.com/photos/dewese/528939016/) | Unused Nonetheless cover design: a yellow starburst over piano keys on a blue ground. | c. 2005-06 | 399x399 | archive-thumbnail only | none | web 399x399 | album page: Nonetheless (design history) |
| [529745579](https://www.flickr.com/photos/dewese/529745579/) | Unused cover design: three band members in Western suits leap beside a blue 'The Luxury Liners' wordmark and a round LXL mark. *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000-01 | 432x432 | archive-thumbnail only | Photo: Mark Montgomery (owner-confirmed) | web 432x432 | design history; logo reference |
| [529657430](https://www.flickr.com/photos/dewese/529657430/) | Unused cover design ('Hear See Speak'): three band members on a pale oval under spaced green capitals. *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000-01 | 432x432 | archive-thumbnail only | Photo: Mark Montgomery (confirm) | web 432x432 | design history; logo reference |
| [529745605](https://www.flickr.com/photos/dewese/529745605/) | Unused cover design: three band members in black sweaters behind a shadowed 'The Luxury Liners' wordmark. *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000-01 | 432x432 | archive-thumbnail only | Photo: Mark Montgomery (confirm) | web 432x432 | design history; logo reference |
| [529745619](https://www.flickr.com/photos/dewese/529745619/) | Unused cover design: three band members in black sweaters behind a shadowed 'The Luxury Liners' wordmark (variant). *People:* David Dewese, Chad Edgington and Scott Carpenter (probable; confirm). | c. 2000-01 | 432x432 | archive-thumbnail only | Photo: Mark Montgomery (confirm) | web 432x432 | design history; logo reference |

#### The Luxury Liners 3-04 (15 usable) · [album](https://www.flickr.com/photos/dewese/albums/432338)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [18289372](https://www.flickr.com/photos/dewese/18289372/) | A drummer plays a kit lit green, his face hidden by a cymbal. *People:* Scott Carpenter (Flickr title). | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18289321](https://www.flickr.com/photos/dewese/18289321/) | A singer-guitarist in a yellow T-shirt leans back, eyes closed, under red light. | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18289296](https://www.flickr.com/photos/dewese/18289296/) | A guitarist plays in front of a drummer on a stage hung with red drapes. | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18289253](https://www.flickr.com/photos/dewese/18289253/) | A guitarist bends over his instrument under a yellow spotlight. | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18289225](https://www.flickr.com/photos/dewese/18289225/) | The Luxury Liners play on a stage hung with red drapes, the crowd in silhouette. | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18289166](https://www.flickr.com/photos/dewese/18289166/) | Wide view of the band playing a club stage, the crowd dark in front. *People:* The Luxury Liners with a fourth player (Gary Ishee per another frame; confirm). | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18289119](https://www.flickr.com/photos/dewese/18289119/) | A drummer under green light behind his kit. *People:* Scott Carpenter (Flickr title). | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18289095](https://www.flickr.com/photos/dewese/18289095/) | A guitarist with a sunburst Les Paul plays under a yellow spotlight. *People:* Gary Ishee (Flickr title; guest player, later on Nonetheless). | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18289057](https://www.flickr.com/photos/dewese/18289057/) | Stage lights flare over the drum kit. | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18289000](https://www.flickr.com/photos/dewese/18289000/) | A singer-guitarist in a yellow T-shirt plays under stage lights. | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18288781](https://www.flickr.com/photos/dewese/18288781/) | David Dewese sings hard into a microphone on stage in a yellow T-shirt. *People:* David Dewese (Flickr title). | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | Photo: Duke Logan (owner-confirmed) | web 1024x768 | live gallery |
| [18288820](https://www.flickr.com/photos/dewese/18288820/) | A bassist in a red shirt plays under red light. *People:* David Wilstermann (Flickr title "david wilsterman"). | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18288872](https://www.flickr.com/photos/dewese/18288872/) | A singer in a yellow T-shirt sings while a bassist plays behind him. | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18288909](https://www.flickr.com/photos/dewese/18288909/) | A bassist in a red shirt sings into a microphone. *People:* David Wilstermann (Flickr title). | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |
| [18288953](https://www.flickr.com/photos/dewese/18288953/) | A singer-guitarist in a yellow T-shirt and a bassist in red play side by side. | 2004-03 (club show, Nashville; journal: The End, early March 2004 - unconfirmed) | 1280x960 | web-medium | none | web 1024x768 | live gallery |

#### Lux Liners / Codaphonic (5 usable) · [album](https://www.flickr.com/photos/dewese/albums/1710599)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [79977649](https://www.flickr.com/photos/dewese/79977649/) | Close-up of a guitarist's feet on effects pedals, a cable snaking across the stage. *People:* which band is shown is unconfirmed (David Dewese in a striped sweater? confirm). | 2005-12 (club show with Codaphonic) | 1600x1200 | web-large | Photo: Phil Thornton (confirm) | web 1600x1200 | live gallery (after confirmation) |
| [79977751](https://www.flickr.com/photos/dewese/79977751/) | A singer-guitarist in a striped sweater plays a red electric guitar on a club stage, a bassist at the right. *People:* which band is shown is unconfirmed (David Dewese in a striped sweater? confirm). | 2005-12 (club show with Codaphonic) | 1600x1200 | web-large | Photo: Phil Thornton (owner-confirmed) | web 1600x1200 | live gallery (after confirmation) |
| [79977839](https://www.flickr.com/photos/dewese/79977839/) | A bassist in a short-sleeved checked shirt plays on a dark stage. *People:* which band is shown is unconfirmed (David Dewese in a striped sweater? confirm). | 2005-12 (club show with Codaphonic) | 1200x1600 | web-large | Photo: Phil Thornton (confirm) | web 1200x1600 | live gallery (after confirmation) |
| [79978098](https://www.flickr.com/photos/dewese/79978098/) | A singer in a striped sweater plays a red guitar and sings. *People:* which band is shown is unconfirmed (David Dewese in a striped sweater? confirm). | 2005-12 (club show with Codaphonic) | 1200x1600 | web-large | Photo: Phil Thornton (confirm) | web 1200x1600 | live gallery (after confirmation) |
| [79978239](https://www.flickr.com/photos/dewese/79978239/) | Tilted view up into the stage lighting rig, a guitarist in a striped sweater below. *People:* which band is shown is unconfirmed (David Dewese in a striped sweater? confirm). | 2005-12 (club show with Codaphonic) | 1600x1200 | web-large | Photo: Phil Thornton (confirm) | web 1600x1200 | live gallery (after confirmation) |

#### Luxury Liners - Grand Rapids, MI (17 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157602769010665)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [1793911314](https://www.flickr.com/photos/dewese/1793911314/) | A long-haired man in sunglasses and a denim shirt drives a car. | 2007-10 (Grand Rapids, MI tour) | 1632x1224 | web-large | none | web 1600x1200 | archive only |
| [1793103627](https://www.flickr.com/photos/dewese/1793103627/) | Three band members pose stiffly in a supermarket juice aisle. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2007-10 (Grand Rapids, MI tour) | 1632x1224 | web-large | none | web 1600x1200 | band page: humour (self-timer) |
| [1793935110](https://www.flickr.com/photos/dewese/1793935110/) | A man in a cap reads a road map in a car. | 2007-10 (Grand Rapids, MI tour) | 1632x1224 | web-large | none | web 1600x1200 | archive only |
| [1793964582](https://www.flickr.com/photos/dewese/1793964582/) | A dark club stage with keyboards and amplifiers set up. | 2007-10 (Grand Rapids, MI tour) | 639x375 | web-small | none | web 639x375 | archive only |
| [1793120991](https://www.flickr.com/photos/dewese/1793120991/) | Close-up of a drummer in a white cap under blue light. | 2007-10 (Grand Rapids, MI tour) | 639x425 | web-small | none | web 639x425 | archive only |
| [1793119645](https://www.flickr.com/photos/dewese/1793119645/) | Two men rest in rocking chairs on a porch, one on the phone. | 2007-10 (Grand Rapids, MI tour) | 1632x1224 | web-large | none | web 1600x1200 | archive only |
| [1793121319](https://www.flickr.com/photos/dewese/1793121319/) | A drummer in a white cap seen close behind a cymbal. *People:* Scott Carpenter (Flickr title). | 2007-10 (Grand Rapids, MI tour) | 639x520 | web-small | none | web 639x520 | live gallery (small) |
| [1793120377](https://www.flickr.com/photos/dewese/1793120377/) | A long-haired singer-guitarist in a white T-shirt sings under stage light. *People:* David Dewese (title "Sleepy St. Dewese"). | 2007-10 (Grand Rapids, MI tour) | 638x430 | web-small | none | web 638x430 | live gallery (small) |
| [1793964014](https://www.flickr.com/photos/dewese/1793964014/) | A bassist plays under blue and green stage light. *People:* David Wilstermann (Flickr title). | 2007-10 (Grand Rapids, MI tour) | 638x463 | web-small | none | web 638x463 | live gallery (small) |
| [1793120567](https://www.flickr.com/photos/dewese/1793120567/) | A guitarist plays under a bright stage light in green. | 2007-10 (Grand Rapids, MI tour) | 638x485 | web-small | none | web 638x485 | live gallery (small) |
| [1793915338](https://www.flickr.com/photos/dewese/1793915338/) | A club crowd in silhouette faces a lit stage. | 2007-10 (Grand Rapids; "The Samples") | 1224x1632 | web-large | none | web 1200x1600 | archive only |
| [1793120179](https://www.flickr.com/photos/dewese/1793120179/) | A singer-guitarist in a white T-shirt sings into a microphone. | 2007-10 (Grand Rapids, MI tour) | 513x639 | web-small | none | web 513x639 | live gallery (small) |
| [1793119901](https://www.flickr.com/photos/dewese/1793119901/) | Black-and-white wide shot of musicians on a stage crowded with keyboards. | 2007-10 (Grand Rapids, MI tour) | 639x416 | web-small | none | web 639x416 | archive only |
| [1793069849](https://www.flickr.com/photos/dewese/1793069849/) | Two men sign a setlist and CDs at a merch table. | 2007-10 (Grand Rapids, MI tour) | 1224x1632 | web-large | none | web 1200x1600 | archive only |
| [1793964770](https://www.flickr.com/photos/dewese/1793964770/) | A singer-guitarist and a bassist play side by side under dark green light. | 2007-10 ("Double Daves": Dewese and Wilstermann?) | 425x639 | web-small | none | web 425x639 | live gallery (small) |
| [1793937342](https://www.flickr.com/photos/dewese/1793937342/) | A man carries a cardboard box to a car on a leafy street. | 2007-10 (Grand Rapids, MI tour) | 1632x1224 | web-large | none | web 1600x1200 | archive only |
| [1793075825](https://www.flickr.com/photos/dewese/1793075825/) | Three band members clown in a supermarket juice aisle, one kneeling. *People:* David Dewese, Scott Carpenter and David "Larry" Wilstermann (confirm). | 2007-10 (Grand Rapids, MI tour) | 1224x1632 | web-large | none | web 1200x1600 | band page: humour |

#### The Luxury Liners & Jeff Grant (12 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157602473896355)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [1600871411](https://www.flickr.com/photos/dewese/1600871411/) | A band with lap steel, acoustic guitar and fiddle plays a coffee shop. **Performer: The Luxury Liners.** | 2007-10 (coffee-shop show with Jeff Grant) | 1632x1224 | web-large | none | web 1600x1200 | live gallery |
| [1600869857](https://www.flickr.com/photos/dewese/1600869857/) | Jeff Grant's set: a guitarist and a keyboard player perform in a coffee shop. **Performer: other act (Jeff Grant).** | 2007-10 (coffee-shop show with Jeff Grant) | 1632x1224 | web-large | none | web 1600x1200 | archive only: other act, never caption as The Luxury Liners |
| [1600870771](https://www.flickr.com/photos/dewese/1600870771/) | A guest fiddler sings at a microphone during The Luxury Liners' coffee-shop set. **Performer: The Luxury Liners (guest musician).** | 2007-10 (coffee-shop show with Jeff Grant) | 1224x1632 | web-large | none | web 1200x1600 | archive only |
| [1600868501](https://www.flickr.com/photos/dewese/1600868501/) | A guitarist strums an acoustic guitar beside a fiddler, a drummer behind. **Performer: The Luxury Liners.** | 2007-10 (coffee-shop show with Jeff Grant) | 2561x1918 | print-ok | none | web 2048x1534 | live gallery (2561px) |
| [1600871639](https://www.flickr.com/photos/dewese/1600871639/) | A singer in a polo shirt plays acoustic guitar and sings. *People:* David Dewese (probable; confirm). **Performer: The Luxury Liners.** | 2007-10 (coffee-shop show with Jeff Grant) | 1101x1466 | web-medium | none | web 1101x1466 | live gallery |
| [1601757020](https://www.flickr.com/photos/dewese/1601757020/) | The coffee shop seen from outside, its window lettered 'Coffee Shop', a band inside. **Performer: unidentifiable.** | 2007-10 (coffee-shop show with Jeff Grant) | 2848x2136 | print-ok | none | web 2048x1536 | archive only |
| [1601758242](https://www.flickr.com/photos/dewese/1601758242/) | Wide view of a four-piece band in a coffee shop. **Performer: The Luxury Liners.** | 2007-10 (coffee-shop show with Jeff Grant) | 2304x1722 | web-large | none | web 2048x1531 | live gallery (2304px) |
| [1601759454](https://www.flickr.com/photos/dewese/1601759454/) | Jeff Grant plays acoustic guitar at a coffee shop. **Performer: other act (Jeff Grant).** | 2007-10 (coffee-shop show with Jeff Grant) | 1632x1224 | web-large | none | web 1600x1200 | archive only: other act, never caption as The Luxury Liners |
| [1601759890](https://www.flickr.com/photos/dewese/1601759890/) | A bearded guest player in a plaid shirt plays lap steel with The Luxury Liners in a coffee shop. *People:* Guest pedal steel: Flickr title 'Grant'; probably Grant Johnson (see 2096371215). single-source; confirm.. **Performer: The Luxury Liners (guest musician).** | 2007-10 (coffee-shop show with Jeff Grant) | 1224x1632 | web-large | none | web 1200x1600 | live gallery |
| [1601760272](https://www.flickr.com/photos/dewese/1601760272/) | A singer in a polo shirt sings with an acoustic guitar. *People:* David Dewese (probable; confirm). **Performer: The Luxury Liners.** | 2007-10 (coffee-shop show with Jeff Grant) | 1224x1632 | web-large | none | web 1200x1600 | live gallery |
| [1600870351](https://www.flickr.com/photos/dewese/1600870351/) | Jeff Grant's set: a guitarist and a keyboard player perform. **Performer: other act (Jeff Grant).** | 2007-10 (coffee-shop show with Jeff Grant) | 1632x1224 | web-large | none | web 1600x1200 | archive only: other act, never caption as The Luxury Liners |
| [1601757448](https://www.flickr.com/photos/dewese/1601757448/) | A four-piece band with lap steel, acoustic guitar, drums and fiddle plays in a coffee shop. **Performer: The Luxury Liners.** | 2007-10 (coffee-shop show with Jeff Grant) | 2561x1918 | print-ok | none | web 2048x1534 | live gallery (2561px) |

#### Luxury Liner Picnic (2 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157600335846078)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [539245963](https://www.flickr.com/photos/dewese/539245963/) | A bald man in a red polo shirt poses beside a red convertible at night. *People:* Scott Carpenter (title "Scott's Porsche Pose"). | 2007-06 | 1632x1224 | web-large | none | web 1600x1200 | archive only |
| [539255423](https://www.flickr.com/photos/dewese/539255423/) | Three members of The Luxury Liners pose at night in T-shirts, one reading 'LARRY'. *People:* David Dewese ("MANPOWER" shirt?), David Wilstermann ("LARRY"), Scott Carpenter (confirm). | 2007-06 (Luxury Liner Picnic) | 1632x1224 | web-large | none | web 1600x1200 | band page |

#### ARCHIVE: 2003 Memorial Day Weekend (4 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157600306446071)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [529049233](https://www.flickr.com/photos/dewese/529049233/) | Friends at a party, one in a cap, one in a blue T-shirt. | 2003-05 ("Liners Reunion") | 450x338 | archive-thumbnail only | none | web 450x338 | archive only (450px) |
| [529049789](https://www.flickr.com/photos/dewese/529049789/) | Close-up of a Nudie's Rodeo Tailors, North Hollywood, California, garment label. | 2003-05 ("Nudie") | 450x338 | archive-thumbnail only | none | web 450x338 | band page: supports the Nudie-suit story (450px) |
| [528960398](https://www.flickr.com/photos/dewese/528960398/) | A band plays on a house porch: singer-guitarist, guitarist, drummer. | 2003-05 (Memorial Day weekend porch show) | 450x338 | archive-thumbnail only | none | web 450x338 | live gallery (450px) |
| [528960190](https://www.flickr.com/photos/dewese/528960190/) | A man arranges CDs and flyers on a merch table. | 2003-05 ("Merch") | 450x338 | archive-thumbnail only | none | web 450x338 | archive only |

#### ARCHIVE: dewese.com (2 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157600307014983)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [529309225](https://www.flickr.com/photos/dewese/529309225/) | Portfolio spread of four photos of David Dewese in a mint suit against pink, captioned 'David Dewese of The Luxury Liners'. *People:* David Dewese. | c. 2000-03 (Kristina Marie Krug) | 500x390 | archive-thumbnail only | Photo: Kristina Marie Krug (owner-confirmed) | web 500x390 | Vault / timeline (500px) |
| [529309371](https://www.flickr.com/photos/dewese/529309371/) | David Dewese, long-haired and in a pale mint suit, leans back dramatically against a pink studio backdrop. *People:* David Dewese. | c. 2000-03 (Kristina Marie Krug; printed in The Tennessean) | 288x385 | archive-thumbnail only | Photo: Kristina Marie Krug (owner-confirmed) | web 288x385 | band page / press history (288px) |

#### Parents Trip (Concert & Party) (7 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157603412058977)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [2096371215](https://www.flickr.com/photos/dewese/2096371215/) | A bearded man plays pedal steel, in black and white. *People:* Grant Johnson (Flickr title; guest pedal steel; confirm). | 2007-12 (Luxury Liners and The Nobility show, Nashville) | 1632x1224 | web-large | none | web 1600x1200 | live gallery |
| [2096370891](https://www.flickr.com/photos/dewese/2096370891/) | A drummer in a cap plays, photographed in black and white. *People:* Scott Carpenter (Flickr title). | 2007-12 (Luxury Liners and The Nobility show, Nashville) | 1632x1224 | web-large | none | web 1600x1200 | live gallery |
| [2096369003](https://www.flickr.com/photos/dewese/2096369003/) | The Luxury Liners play a small venue, a pedal-steel player in a red plaid shirt at right. *People:* four musicians incl. a pedal-steel player (names unconfirmed). | 2007-12 (Luxury Liners and The Nobility show, Nashville) | 1632x1224 | web-large | none | web 1600x1200 | live gallery |
| [2097145860](https://www.flickr.com/photos/dewese/2097145860/) | Close-up of hands on a Sho-Bud pedal-steel guitar. | 2007-12 (Luxury Liners and The Nobility show, Nashville) | 1632x1224 | web-large | none | web 1600x1200 | live gallery (detail) |
| [2096369349](https://www.flickr.com/photos/dewese/2096369349/) | Wide view of a band playing to a seated audience in a dim room. | 2007-12 (Luxury Liners and The Nobility show, Nashville) | 1632x1224 | web-large | none | web 1600x1200 | live gallery |
| [2096370517](https://www.flickr.com/photos/dewese/2096370517/) | A singer-guitarist in a black shirt sings into a microphone. *People:* David Dewese (Flickr title). | 2007-12 (Luxury Liners and The Nobility show, Nashville) | 1632x1224 | web-large | none | web 1600x1200 | live gallery |
| [2096390867](https://www.flickr.com/photos/dewese/2096390867/) | A poster in a shop window: 'The Luxury Liners and The Nobility', with a photo of ballet dancers. | 2007-12 (Luxury Liners and The Nobility show, Nashville) | 1632x1224 | web-large | none | web 1600x1200 | Vault / flyer wall |

#### Solo Artist Egomaniac (4 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157607376830703)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [4449282315](https://www.flickr.com/photos/dewese/4449282315/) | David Dewese, long-haired, sings into a microphone while playing electric guitar on stage in Grand Rapids. *People:* David Dewese. | 2007-10 (The Intersection, Grand Rapids, MI) | 513x639 | web-small | none | web 513x639 | live gallery (513px) |
| [4470275899](https://www.flickr.com/photos/dewese/4470275899/) | Two performers, one on banjo and one on acoustic guitar, share a small stage in Royse City, Texas. *People:* David Dewese and Chad Edgington (which is which unconfirmed). | unknown (scan 2010; Royse City, TX, with Chad Edgington) | 604x446 | web-small | none | web 604x446 | band page: Chad + David duo (604px) |
| [4471053728](https://www.flickr.com/photos/dewese/4471053728/) | A person with shoulder-length hair, in grey trousers and a black sweater, does a cartwheel against a white studio backdrop. | c. 2000 (Mark Montgomery) | 604x578 | web-small | Photo: Mark Montgomery (owner-confirmed) | web 604x578 | band page accent (604px) |
| [4470276083](https://www.flickr.com/photos/dewese/4470276083/) | In black and white, a young musician with a bob haircut, in a light suit and tie, stands with arms folded. | c. 2000 (Mark Montgomery) | 393x604 | web-small | Photo: Mark Montgomery (owner-confirmed) | web 393x604 | band page accent (604px) |

#### California Migration (1 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157625298585298)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [5122724227](https://www.flickr.com/photos/dewese/5122724227/) | A stack of David Dewese, Foxymorons and Luxury Liners CDs, spines showing titles from Calcutta to Bible Stories. | 2010-11 | 2048x1536 | web-large | none | web 2048x1536 | archive only (mixed catalogue) |

#### Fall 2009 (1 usable) · [album](https://www.flickr.com/photos/dewese/albums/72157622983149087)

| Flickr | What it shows (alt draft) | Era | Original size | Tier | Credit | On disk | Use |
|---|---|---|---|---|---|---|---|
| [3978343931](https://www.flickr.com/photos/dewese/3978343931/) | David Dewese, in a pale blue suit and thin black tie, and Scott Carpenter of The Luxury Liners sit on a red sofa after a 2009 gig. *People:* David Dewese (pale blue suit: Flickr description 'Scott & I ... Rocking the '97 suit', written by David) and Scott Carpenter (cap). single-source; confirm.. | 2009 (autumn; "Played all old-school Luxury Liners songs") | 649x800 | web-small | none | web 649x800 | band page: 2009 reunion gig |

#### Excluded Flickr frames (listed so nobody re-adds them by accident)

| Flickr | Album | Reason |
|---|---|---|
| [2083678545](https://www.flickr.com/photos/dewese/2083678545/) | ARCHIVE: Random Liners | personal joke card; no value for the site |
| [2084463908](https://www.flickr.com/photos/dewese/2084463908/) | ARCHIVE: Random Liners | third-party likeness (cardboard cut-out of a public figure) |
| [2083681389](https://www.flickr.com/photos/dewese/2083681389/) | ARCHIVE: Random Liners | non-member third party named in title ("Frank"); no site value |
| [2084465520](https://www.flickr.com/photos/dewese/2084465520/) | ARCHIVE: Random Liners | other band (Flickr title "Jetpack 2001") and non-members; archive only |
| [2068111606](https://www.flickr.com/photos/dewese/2068111606/) | ARCHIVE: Vintage Luxury Liners Shots | private individual (not a band member) |
| [79976307](https://www.flickr.com/photos/dewese/79976307/) | Lux Liners / Codaphonic | audience/friends at the Codaphonic show; private individuals |
| [79976424](https://www.flickr.com/photos/dewese/79976424/) | Lux Liners / Codaphonic | audience/friends at the Codaphonic show; private individuals |
| [79976540](https://www.flickr.com/photos/dewese/79976540/) | Lux Liners / Codaphonic | audience/friends at the Codaphonic show; private individuals |
| [79976654](https://www.flickr.com/photos/dewese/79976654/) | Lux Liners / Codaphonic | audience/friends at the Codaphonic show; private individuals |
| [79976774](https://www.flickr.com/photos/dewese/79976774/) | Lux Liners / Codaphonic | audience/friends at the Codaphonic show; private individuals |
| [79976877](https://www.flickr.com/photos/dewese/79976877/) | Lux Liners / Codaphonic | appears to show the other band on the bill (Codaphonic), not The Luxury Liners; confirm with Carly before any use |
| [79977003](https://www.flickr.com/photos/dewese/79977003/) | Lux Liners / Codaphonic | appears to show the other band on the bill (Codaphonic), not The Luxury Liners; confirm with Carly before any use |
| [79977111](https://www.flickr.com/photos/dewese/79977111/) | Lux Liners / Codaphonic | appears to show the other band on the bill (Codaphonic), not The Luxury Liners; confirm with Carly before any use |
| [79977214](https://www.flickr.com/photos/dewese/79977214/) | Lux Liners / Codaphonic | appears to show the other band on the bill (Codaphonic), not The Luxury Liners; confirm with Carly before any use |
| [79977293](https://www.flickr.com/photos/dewese/79977293/) | Lux Liners / Codaphonic | appears to show the other band on the bill (Codaphonic), not The Luxury Liners; confirm with Carly before any use |
| [79977401](https://www.flickr.com/photos/dewese/79977401/) | Lux Liners / Codaphonic | appears to show the other band on the bill (Codaphonic), not The Luxury Liners; confirm with Carly before any use |
| [79977506](https://www.flickr.com/photos/dewese/79977506/) | Lux Liners / Codaphonic | appears to show the other band on the bill (Codaphonic), not The Luxury Liners; confirm with Carly before any use |
| [79977978](https://www.flickr.com/photos/dewese/79977978/) | Lux Liners / Codaphonic | appears to show the other band on the bill (Codaphonic), not The Luxury Liners; confirm with Carly before any use |
| [1793916932](https://www.flickr.com/photos/dewese/1793916932/) | Luxury Liners - Grand Rapids, MI | possibly a non-member (title "All-Johns"); no site value |
| [1601758836](https://www.flickr.com/photos/dewese/1601758836/) | The Luxury Liners & Jeff Grant | audience (private individuals) |
| [1601761038](https://www.flickr.com/photos/dewese/1601761038/) | The Luxury Liners & Jeff Grant | audience (private individuals) |
| [539249943](https://www.flickr.com/photos/dewese/539249943/) | Luxury Liner Picnic | second person may be a non-member; low value |
| [539251573](https://www.flickr.com/photos/dewese/539251573/) | Luxury Liner Picnic | non-members on a porch; private event |
| [528960300](https://www.flickr.com/photos/dewese/528960300/) | ARCHIVE: 2003 Memorial Day Weekend | not shown to be a member; private |
| [529049737](https://www.flickr.com/photos/dewese/529049737/) | ARCHIVE: 2003 Memorial Day Weekend | non-member; private |
| [2096388847](https://www.flickr.com/photos/dewese/2096388847/) | Parents Trip (Concert & Party) | house concert with private guests |

`data/assets.json` also holds one id-only entry in `do_not_use_ids`. It is never used and needs no follow-up.

---

## 5. Engraved portraits (Duotone)

The daviddewese.com build makes two-colour "engraved" portraits from real photos (P32: subject mask, wavy engraving lines, record-groove rings; never AI-drawn). Its Luxury Liners renders all come from `luxury-liners-2002.jpg`. Copies are in `assets/derived/daviddewese-portraits/` (copied, unmodified).

| File | Size | Slot on daviddewese.com | Palette | Alt (as shipped there) |
|---|---|---|---|---|
| `luxury-liners-lead--dark.jpg` / `--light.jpg` | 1400x816 | `/bands/the-luxury-liners/` lead | oxblood `#6E1410` / blush `#F7D6C8` (P34) | "Engraved portrait of David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter of The Luxury Liners in 2002, in matching T-shirts." |
| `luxury-liners-lead--rings.webp` | 700x408 RGBA | ring overlay | - | decorative: `alt=""` |
| `luxury-liners-discography--dark.jpg` / `--light.jpg` | 1400x545 | `/music/the-luxury-liners/` (P39) | same | same people |
| `luxury-liners-discography--rings.webp` | 700x273 RGBA | ring overlay | - | decorative |

For theluxuryliners.com:
- These are **web quality only** (1400px) and carry the daviddewese.com colour pair. If the new site uses the Duotone treatment, **re-render** with `daviddewese.com/daviddewese-com/site/scripts/portraits/engrave.py` (prototype in `prototypes/duotone/engrave.py`) in the new site's own palette.
- The 2002 source is small and AI-enhanced. A sharper source for the trio is a 2003 Amy Wilstermann frame (`2083621513`, 2560px original on disk). For the founding era, `530769478` (2160px) or `2073239851` (1646px).
- The same caption rule applies to any engraving of the 2002 photo (P23).

---

## 6. Logos and wordmarks

**There is no vector logo and no hi-res logo file anywhere** (not in the daviddewese.com assets, not in the Flickr albums, not on the current Carrd site). Below is every mark found, with evidence.

| # | Mark | Years | Evidence (record ids) | Best copy | Notes |
|---|---|---|---|---|---|
| 1 | **Condensed bold capitals with an oversized "crossed X"**: "THE LUXURY LINERS", the X often in a contrast colour | c. 2000-2021 | `533675524` (red), `533675584`, `533675938` (orange), unused covers `529745605`/`529745619`, unused *Nonetheless* designs, *Shake It Up (Live)* cover (black with red X) | *Shake It Up* cover, 3000px (reference copy) | The band's most consistent mark over 20 years. **Recommended primary wordmark**, redrawn as SVG only with Carly's OK. Designer unknown. |
| 2 | **Roundel**: white ring with a diagonal L-like stroke on red | c. 2001-04 | *Believe* EP cover and disc; guitar sticker `2084466592`; kick-drum head `2083678153`; Wayback `/images/sticker.jpg` (2001) | *Believe* master (1400px) | Good favicon / avatar candidate. |
| 3 | Lowercase "the luxury liners" on a blue bar | 2000 | *Sound As Ever* cover; Wayback `/images/jpg/liners_blue.jpg` | cover master | album typography |
| 4 | Widely spaced capitals | 2000-01 | *Believe* cover; unused "Hear See Speak" cover `529657430` | cover master | album typography |
| 5 | Letterpress poster "THE LUXURY LINERS / TEXAS POP / TONIGHT NO COVER" | c. 2001-04 | `2083681019` (Flickr title "Hatch Show") | 350px | Ask whether the physical poster survives; "Texas Pop" is the band's own genre tag. Whether Hatch Show Print made it is unverified. |
| 6 | 2000 website logo, green/white blocks | 2000 | `2068114608`; Wayback `/images/gif/title_with_logo.gif` | 268px | site design credited to Jeremy Cowart / andersonthomas (single-source) |
| 7 | Bold lowercase "theluxuryliners" | 2003 | 8x10 promo print `533775919`, signed copy `2084466500` | 600px | archive |
| 8 | Logo GIFs of the 2004-09 sites | 2004-09 | Wayback `/history/images/luxury_liners.gif`, `/images/luxuryliners2005_logotop.gif` and `_logobot.gif`, `/images/logo.jpg` | not seen | needs a browser (§9) |

The current Carrd site (2024-) has no logo: just the name set in Montserrat 800.

---

## 7. Flyers, posters and ephemera

| Item | Record | Date (as printed / inferred) | Size | Use and flags |
|---|---|---|---|---|
| 12th & Porter, "Friday Nov 14", opening for Fairfax | `530770086` | **probably 2003-11-14** (a Friday; the band site had `luxury_liners_nov_14_03.jpg`) | 330x510 | Archive only: the photo seems to be another band's press photo (Flickr title "Uncle Tupelo"). Never present it as a Luxury Liners photo. |
| 12th & Porter postcard, "Wed Sept 15th 9:30" | `2067318521` | Flickr says 1998, but **Sept 15 was a Wednesday in 1999**, not 1998: probably 1999 (contested) | 350x250 | Vault; repeats the trouser-legs motif of the *Sound As Ever* cover |
| Exit/In "Western Beat", Tues Dec 9, 8:00 | `2084463656` | 2003-12-09 (a Tuesday) | 330x510 | Vault |
| Exit/In "Western Beat", Tues Jan 20, 9:00 | `2084467676` | 2004-01-20 (a Tuesday) | 330x510 | Archive only: film still of a famous actor |
| "The Luxury Liners and The Nobility" poster in a window | `2096390867` | 2007-12 | 1632x1224 | Vault (ballet photo on the poster is third-party: crop to the text or show small) |
| "Texas Pop / Tonight No Cover" poster | `2083681019` | c. 2001-04 | 350px | logo reference (§6) |
| The End marquee "Luxury Liners" | `2083679651` | undated | 350px | timeline |
| Texas Music Café TV studio sign listing "Luxury Liners" | `2067318469` | 1998 (Waco, TX) | 350x250 | release page for *Shake It Up (Live at the Texas Music Café)* |
| Nudie's Rodeo Tailors label | `529049789` | 2003-05 | 450x338 | band page: supports the Nudie-suit story (research 01) |
| Signed 8x10 promo print | `2084466500` (and the clean scan `533775919`) | c. 2003 | 350 / 600 | press-kit history |
| *Billboard* shoot contact sheets | `2068108124`, `2068108482`, `2067314041`, `2068113640`, `2067318287` | 1998 | 1213-1275px | Vault; the *Billboard* article itself is still unseen (research 01 D5). `2067318287` credits Trey Mitchell. |
| Early-website graphics | `2067318305` (bio bubble), `2068114476` (collage), `2068114608` (J.Co site) | 1999-2000 | 268-394px | Vault ("our old websites") |
| Wayback flyer and e-mail art | `/images/flyer7-20-01.jpg` (2001), `/email/...` newsletter images 2002-04 (most 404 in the archive) | 2001-04 | ? | needs a browser |

---

## 8. Images on the current theluxuryliners.com (Carrd, 2024-)

theluxuryliners.com is blocked from this environment; these come from daviddewese.com research 04 §3.3 (read live 2026-09-28).

| URL | Size | What | Match |
|---|---|---|---|
| `https://theluxuryliners.com/assets/images/image02.jpg?v=5f05de21` | 596x596 | white-studio jump photo; three members, one in a pale-blue suit mid-jump | probably Mark Montgomery c. 2000 (`2074032206`): unverified visual match |
| `https://theluxuryliners.com/assets/images/share.jpg?v=5f05de21` | 1200x990 | three members seated on a white studio floor in jackets | probably `2074031888` "Coats" (Mark Montgomery): unverified |
| `.../apple-touch-icon.png`, `.../favicon.png` | 228, 64 | crops of the jump photo | - |

The Carrd photo has an empty `alt`. If those matches hold, the credit is "Photo: Mark Montgomery" and the photo shows the Chad-era trio.

---

## 9. Wayback captures: "needs a browser"

`web.archive.org` and `theluxuryliners.com` are blocked here, so none of these was opened. The CDX index (`daviddewese.com/daviddewese-com/research/legacy/cdx-theluxuryliners.com.json`) lists **209** image or PDF URLs captured with status 200. The high-priority ones are below; open each link in a browser and save the file into `assets/source/wayback/` with its original name. The most valuable are the **2002 300-dpi press photo** (`/downloads/luxuryliners300dpi.jpg`), the **2003 one-sheet PDF**, the **1997-2000 history photos** and the **logo GIFs**.

| Priority | Category | Path | First good capture | Open in a browser |
|---|---|---|---|---|
| 1 | cover/music art | `/history/photos/00_coverone.jpg` | 2005-01-20 | [Wayback](https://web.archive.org/web/20050120012318im_/http://theluxuryliners.com:80/history/photos/00_coverone.jpg) |
| 1 | cover/music art | `/images/albums_between.jpg` | 2006-02-07 | [Wayback](https://web.archive.org/web/20060207080056im_/http://theluxuryliners.com:80/images/albums_between.jpg) |
| 1 | cover/music art | `/images/believe_cover.jpg` | 2001-06-02 | [Wayback](https://web.archive.org/web/20010602165705im_/http://theluxuryliners.com:80/images/believe_cover.jpg) |
| 1 | cover/music art | `/images/movie_dreaming.jpg` | 2002-06-16 | [Wayback](https://web.archive.org/web/20020616111449im_/http://theluxuryliners.com:80/images/movie_dreaming.jpg) |
| 1 | cover/music art | `/images/music_acoustic.jpg` | 2003-10-07 | [Wayback](https://web.archive.org/web/20031007022357im_/http://www.theluxuryliners.com:80/images/music_acoustic.jpg) |
| 1 | cover/music art | `/images/music_believe_75.jpg` | 2003-10-07 | [Wayback](https://web.archive.org/web/20031007041205im_/http://www.theluxuryliners.com:80/images/music_believe_75.jpg) |
| 1 | cover/music art | `/images/music_live.jpg` | 2003-07-06 | [Wayback](https://web.archive.org/web/20030706215225im_/http://theluxuryliners.com:80/images/music_live.jpg) |
| 1 | cover/music art | `/images/music_nash_pop.jpg` | 2003-07-19 | [Wayback](https://web.archive.org/web/20030719080241im_/http://theluxuryliners.com:80/images/music_nash_pop.jpg) |
| 1 | cover/music art | `/images/music_overbored_75.jpg` | 2003-10-07 | [Wayback](https://web.archive.org/web/20031007050837im_/http://www.theluxuryliners.com:80/images/music_overbored_75.jpg) |
| 1 | cover/music art | `/images/soundas_cover.gif` | 2001-06-14 | [Wayback](https://web.archive.org/web/20010614232039im_/http://theluxuryliners.com:80/images/soundas_cover.gif) |
| 1 | cover/music art | `/images/trunkbox_big.jpg` | 2001-06-22 | [Wayback](https://web.archive.org/web/20010622162005im_/http://theluxuryliners.com:80/images/trunkbox_big.jpg) |
| 1 | cover/music art | `/images/trunkbox_cover.jpg` | 2001-06-22 | [Wayback](https://web.archive.org/web/20010622162027im_/http://theluxuryliners.com:80/images/trunkbox_cover.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/00_blackfaces.jpg` | 2005-01-20 | [Wayback](https://web.archive.org/web/20050120002201im_/http://theluxuryliners.com:80/history/photos/00_blackfaces.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/00_chad.jpg` | 2005-01-20 | [Wayback](https://web.archive.org/web/20050120010503im_/http://theluxuryliners.com:80/history/photos/00_chad.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/00_dancing.jpg` | 2005-01-20 | [Wayback](https://web.archive.org/web/20050120014931im_/http://theluxuryliners.com:80/history/photos/00_dancing.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/00_hearseespeak.jpg` | 2005-01-20 | [Wayback](https://web.archive.org/web/20050120022525im_/http://theluxuryliners.com:80/history/photos/00_hearseespeak.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/00_photoshoot.jpg` | 2005-01-20 | [Wayback](https://web.archive.org/web/20050120024236im_/http://theluxuryliners.com:80/history/photos/00_photoshoot.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/00_scott.jpg` | 2005-01-20 | [Wayback](https://web.archive.org/web/20050120025352im_/http://theluxuryliners.com:80/history/photos/00_scott.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/00_sitting.jpg` | 2005-01-20 | [Wayback](https://web.archive.org/web/20050120030659im_/http://theluxuryliners.com:80/history/photos/00_sitting.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/97_12th_porter.jpg` | 2005-01-19 | [Wayback](https://web.archive.org/web/20050119195050im_/http://theluxuryliners.com:80/history/photos/97_12th_porter.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/97_opry.jpg` | 2005-01-19 | [Wayback](https://web.archive.org/web/20050119202624im_/http://theluxuryliners.com:80/history/photos/97_opry.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/97_pajamas.jpg` | 2005-01-19 | [Wayback](https://web.archive.org/web/20050119205309im_/http://theluxuryliners.com:80/history/photos/97_pajamas.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/98_hard_rock.jpg` | 2005-01-19 | [Wayback](https://web.archive.org/web/20050119213404im_/http://theluxuryliners.com:80/history/photos/98_hard_rock.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/98_waco.jpg` | 2005-01-19 | [Wayback](https://web.archive.org/web/20050119220056im_/http://theluxuryliners.com:80/history/photos/98_waco.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/99_12th_serious.jpg` | 2005-01-19 | [Wayback](https://web.archive.org/web/20050119223532im_/http://theluxuryliners.com:80/history/photos/99_12th_serious.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/99_green_jackets.jpg` | 2005-01-19 | [Wayback](https://web.archive.org/web/20050119231747im_/http://theluxuryliners.com:80/history/photos/99_green_jackets.jpg) |
| 1 | history photos 1997-2000 | `/history/photos/99_session_guitars.jpg` | 2005-01-19 | [Wayback](https://web.archive.org/web/20050119233719im_/http://theluxuryliners.com:80/history/photos/99_session_guitars.jpg) |
| 1 | logo/wordmark | `/history/images/luxury_liners.gif` | 2004-03-25 | [Wayback](https://web.archive.org/web/20040325140638im_/http://theluxuryliners.com:80/history/images/luxury_liners.gif) |
| 1 | logo/wordmark | `/images/gif/title_with_logo.gif` | 2000-09-26 | [Wayback](https://web.archive.org/web/20000926003533im_/http://www.theluxuryliners.com:80/images/gif/title_with_logo.gif) |
| 1 | logo/wordmark | `/images/jpg/Echologo.jpg` | 2000-09-26 | [Wayback](https://web.archive.org/web/20000926003701im_/http://www.theluxuryliners.com:80/images/jpg/Echologo.jpg) |
| 1 | logo/wordmark | `/images/jpg/liners_blue.jpg` | 2000-08-23 | [Wayback](https://web.archive.org/web/20000823195955im_/http://theluxuryliners.com:80/images/jpg/liners_blue.jpg) |
| 1 | logo/wordmark | `/images/logo.jpg` | 2007-08-23 | [Wayback](https://web.archive.org/web/20070823123909im_/http://theluxuryliners.com/images/logo.jpg) |
| 1 | logo/wordmark | `/images/luxuryliners2005_logobot.gif` | 2005-12-15 | [Wayback](https://web.archive.org/web/20051215204326im_/http://theluxuryliners.com:80/images/luxuryliners2005_logobot.gif) |
| 1 | logo/wordmark | `/images/luxuryliners2005_logotop.gif` | 2005-12-15 | [Wayback](https://web.archive.org/web/20051215193124im_/http://theluxuryliners.com:80/images/luxuryliners2005_logotop.gif) |
| 1 | logo/wordmark | `/images/sticker.jpg` | 2001-08-06 | [Wayback](https://web.archive.org/web/20010806151106im_/http://theluxuryliners.com:80/images/sticker.jpg) |
| 1 | logo/wordmark | `/images/title.gif` | 2001-06-22 | [Wayback](https://web.archive.org/web/20010622161505im_/http://theluxuryliners.com:80/images/title.gif) |
| 1 | press/promo photo | `/assets/images/image02.jpg?v=5f05de21` | 2026-06-27 | [Wayback](https://web.archive.org/web/20260627191420im_/https://theluxuryliners.com/assets/images/image02.jpg?v=5f05de21) |
| 1 | press/promo photo | `/downloads/luxury_liners_onesheet.pdf` | 2003-04-14 | [Wayback](https://web.archive.org/web/20030414032936im_/http://theluxuryliners.com:80/downloads/luxury_liners_onesheet.pdf) |
| 1 | press/promo photo | `/downloads/luxuryliners300dpi.jpg` | 2002-06-16 | [Wayback](https://web.archive.org/web/20020616104106im_/http://theluxuryliners.com:80/downloads/luxuryliners300dpi.jpg) |
| 1 | press/promo photo | `/images/album_2002.jpg` | 2002-06-16 | [Wayback](https://web.archive.org/web/20020616105029im_/http://theluxuryliners.com:80/images/album_2002.jpg) |
| 1 | press/promo photo | `/images/aquaCROP.jpg` | 2001-06-02 | [Wayback](https://web.archive.org/web/20010602164943im_/http://theluxuryliners.com:80/images/aquaCROP.jpg) |
| 1 | press/promo photo | `/images/bio_green.jpg` | 2002-12-21 | [Wayback](https://web.archive.org/web/20021221213057im_/http://theluxuryliners.com:80/images/bio_green.jpg) |
| 1 | press/promo photo | `/images/bio_green_david.jpg` | 2002-04-02 | [Wayback](https://web.archive.org/web/20020402220732im_/http://theluxuryliners.com:80/images/bio_green_david.jpg) |
| 1 | press/promo photo | `/images/bio_window.jpg` | 2002-06-16 | [Wayback](https://web.archive.org/web/20020616111050im_/http://theluxuryliners.com:80/images/bio_window.jpg) |
| 1 | press/promo photo | `/images/graybath170X.jpg` | 2001-06-02 | [Wayback](https://web.archive.org/web/20010602170421im_/http://theluxuryliners.com:80/images/graybath170X.jpg) |
| 1 | press/promo photo | `/images/graycouch300x.jpg` | 2001-06-22 | [Wayback](https://web.archive.org/web/20010622162624im_/http://theluxuryliners.com:80/images/graycouch300x.jpg) |
| 1 | press/promo photo | `/images/jumping.jpg` | 2009-07-22 | [Wayback](https://web.archive.org/web/20090722064003im_/http://www.theluxuryliners.com/images/jumping.jpg) |
| 1 | press/promo photo | `/images/luxury_liners_feb-20.jpg` | 2005-05-02 | [Wayback](https://web.archive.org/web/20050502122901im_/http://www.theluxuryliners.com/images/luxury_liners_feb-20.jpg) |
| 1 | press/promo photo | `/images/luxury_liners_nov_14_03.jpg` | 2003-12-15 | [Wayback](https://web.archive.org/web/20031215223431im_/http://theluxuryliners.com:80/images/luxury_liners_nov_14_03.jpg) |
| 1 | press/promo photo | `/images/luxury_liners_picture.jpg` | 2003-10-23 | [Wayback](https://web.archive.org/web/20031023155446im_/http://www.theluxuryliners.com:80/images/luxury_liners_picture.jpg) |
| 1 | press/promo photo | `/images/luxury_liners_top.jpg` | 2003-10-23 | [Wayback](https://web.archive.org/web/20031023183023im_/http://www.theluxuryliners.com:80/images/luxury_liners_top.jpg) |
| 1 | press/promo photo | `/images/luxuryliners2005_band.jpg` | 2005-12-15 | [Wayback](https://web.archive.org/web/20051215194758im_/http://theluxuryliners.com:80/images/luxuryliners2005_band.jpg) |
| 1 | press/promo photo | `/images/luxurypromo2.jpg` | 2001-08-25 | [Wayback](https://web.archive.org/web/20010825153700im_/http://theluxuryliners.com:80/images/luxurypromo2.jpg) |
| 1 | press/promo photo | `/images/picture.jpg` | 2002-09-29 | [Wayback](https://web.archive.org/web/20020929114141im_/http://theluxuryliners.com:80/images/picture.jpg) |
| 1 | press/promo photo | `/images/splash_3-30-02.gif` | 2002-04-03 | [Wayback](https://web.archive.org/web/20020403075516im_/http://theluxuryliners.com:80/images/splash_3-30-02.gif) |
| 1 | press/promo photo | `/images/splash_9_15_02.jpg` | 2002-11-20 | [Wayback](https://web.archive.org/web/20021120152504im_/http://theluxuryliners.com:80/images/splash_9_15_02.jpg) |
| 1 | press/promo photo | `/images/splash_larry_enter.gif` | 2004-09-28 | [Wayback](https://web.archive.org/web/20040928023805im_/http://www.theluxuryliners.com:80/images/splash_larry_enter.gif) |
| 1 | press/promo photo | `/images/splash_larry_singing.jpg` | 2004-09-28 | [Wayback](https://web.archive.org/web/20040928025323im_/http://www.theluxuryliners.com:80/images/splash_larry_singing.jpg) |

Outside the Wayback, one more "needs a browser" lead: the MTSU Center for Popular Music **Nashville Show Posters** finding aid (https://w1.mtsu.edu:8443/popmusic/findingaids/pdfaids/SHOPOST.pdf; port 8443 is blocked here). Search it for "Luxury Liners".

Other captured images (not listed one by one; all in `data/assets.json` → `wayback_leads`): flyer/ephemera 3; gallery photo 80; other 13; layout-chrome 55.

---

## 10. Credit and caption rules (for the build)

**Credits**
1. R1: no licence requests. Show the photographer's credit where known.
2. P17: the credit line is "Photo: Name". Photos taken by the band, family or a self-timer carry no credit line.
3. P17 closed the credit gate: uncredited photos publish with no credit line. `data/assets.json` → `credit_status` splits the records: **21 named-credit-confirmed** (show the credit), **37 named-credit-awaiting-confirmation** (a photographer is named only in a Flickr album title or description: Mark Montgomery, Amy Wilstermann, Kristin Barlowe, Paul Paternoster, Wes Ware, Peyton Hoge, Phil Thornton; Carly confirms these names in one pass), **193 no-credit-publishable (P17)** (no photographer named; no action). Covers use the P40 line instead.
4. P40: covers carry "Cover art: all rights reserved by the rights holders."
5. P22: the 2002 photo has no credit.

**Captions**
1. **P23:** the 2002 photo caption is exactly "David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002". Never "the 2002 line-up".
2. **F4:** David Dewese and Chad Edgington co-founded the band in 1997; Chad left Nashville in 2001. A photo from 1997 to early 2001 may say "with co-founder Chad Edgington". Photos from after Chad left may show him only as a forever member (P8) or a guest (the 2002 photo of all four, P23; the Royse City duo `4470275899`), never as part of the current line-up. Trio-era photos (2001 on) show David Dewese, Scott Carpenter and David "Larry" Wilstermann. The *Shake It Up (Live)* cover photo is Chad-era (§3.2).
3. **P14:** name people where a source supports it. Anything marked "(confirm)" waits for Carly. Name band members and credited guests in their band roles only; never audience, friends, family or children.
4. **P8:** "David 'Larry' Wilstermann" is fine; tell the nickname story once, on the band page (`2083680433`, the "LARRY" T-shirt, is a good illustration).
5. Former members (Jeff LaFrate, Mark W. Winchester, Kyle Edgington, Scott Jeffries): band role only, and only after the consent question (research 01 Q10). `2067314683` shows Kyle Edgington.
6. Third-party likenesses (another band's press photo, a film still, a cardboard cut-out, the ballet image on a poster) stay archive-only.
7. Flyers: caption with the venue and date as printed; mark inferred years "probably".
8. **P27:** "Shake It Up" is an original first released on the *Believe* EP (2001); the 2021 single is a live version.
9. Unused covers: "Unused cover design" + "Design: Mark Montgomery" where known.
10. **X1:** the excluded side project and person never appear in any file, caption, alt text or question. Ids in `do_not_use_ids` are never used and need no follow-up.
12. **Shared bills:** frames of other acts are never captioned as The Luxury Liners. In the Oct 2007 coffee-shop album, `1600869857`, `1600870351` and `1601759454` show Jeff Grant's set (field `performer` in the json); the fiddler (`1600870771`, "Jeremy") and the lap/pedal-steel player (`1601759890`, "Grant", the same player as `2096371215` "Grant Johnson") are guests with the band, not members.
13. **Never "former":** the band never broke up (F6) and the four are forever members (P8). Later photos say "of The Luxury Liners", not "former".
11. Alt text: describe what is visible; name people only when the caption may name them; decorative ring layers get `alt=""`.

---

## 11. Wish-list for Carly

Ranked by how much each would improve the site.

| # | Ask | Why | Notes |
|---|---|---|---|
| 1 | **A recent photo of the band** (any of the four, together or separately, 2021-2026) | Nothing on file is newer than 2009 except the two 2026 single covers; the site would read as a closed archive | Even phone photos work for the Duotone treatment |
| 2 | **Logo files**: the condensed "crossed X" wordmark and the roundel, as vector (AI/EPS/SVG/PDF) or at least 2000px | No logo exists in any usable size | Who designed them? (Mark Montgomery / echomusic?) |
| 3 | **Master for the *Shake It Up (Live)* cover** (P28), and who took the photo | Only a distributor copy exists | Probably Mark Montgomery, c. 2000 |
| 4 | **Originals of the Mark Montgomery white-studio session** (c. 2000) | The band's most distinctive photos; Flickr has 687-1646px; the Carrd site probably uses two | Also confirm: David, Chad and Scott? left to right? |
| 5 | **Originals of the 2005 Kristin Barlowe session** | Flickr holds only 800px (and 400x600 for David) | Also: "Kristin" or "Kristen" Barlowe? |
| 6 | **The 2001 Capitol shoot** (name T-shirts DAVID / SCOTT / LARRY) | 350px scans only; these name the trio | Who shot it? |
| 7 | **Photos of the 1997-2000 band with Chad**: the old site's `97_12th_porter.jpg`, `97_opry.jpg`, `97_pajamas.jpg`, `98_hard_rock.jpg`, `98_waco.jpg`, `99_12th_serious.jpg`, `99_green_jackets.jpg`, `99_session_guitars.jpg`, `00_chad.jpg`, `00_scott.jpg` | The founding story needs pictures; 1997 has none at all | Wayback has them (§9); originals better |
| 8 | **Flyers and posters**: the "Texas Pop" letterpress poster, the 2001 flyer (`flyer7-20-01.jpg`), any gig posters 1997-2007 | Good Vault material; Flickr has only 330px copies | Physical posters can be photographed |
| 9 | **The 2002 300-dpi press photo and the 2003 one-sheet PDF** | Listed on the old site's downloads page | Wayback links in §9 |
| 10 | **A non-AI scan of the 2002 photo of all four** | The supplied file is AI-enhanced and only 1096x848 | If the print or negative still exists |
| 11 | **Liner notes and inside panels** of *Sound As Ever*, *Believe*, *Overbored*, *Nonetheless* (and the 2026 LP) | Credits (cover painters, designers), band photos inside | A phone scan of each booklet is enough |
| 12 | **Live photos 2008-2026**, including the Texas Music Café session behind the 2021 single | No live photo after Dec 2007 except the 2009 sofa snapshot | |
| 13 | **Confirm names** in the group photos marked "(confirm)", especially `530769478` (March 2001), the 2003 and 2005 trio shoots, `2086444773` (Aug 2000), `4470275899` (Royse City) and `3978343931` (2009) | P14 | Left-to-right order |
| 14 | **Confirm the 37 named credits** awaiting confirmation (§10.3; uncredited photos need nothing), and who shot the Downtown Pres, Atlanta, "Homemade", "That's Right" and "Attic" promos | P17 covered only the earlier set | |
| 15 | **Codaphonic show, Dec 2005:** which frames (if any) show The Luxury Liners? | 13 frames excluded as probably the other band | Phil Thornton shot some |

---

## 12. Discrepancies and open questions

| # | Topic | Source A | Source B | Handling |
|---|---|---|---|---|
| A1 | Credit line for Flickr `530879919` and `530772008` | daviddewese.com `photos.json`: "Photo: Mark Montgomery2001 Mark Montgomery')" (garbled) | Flickr description "©2001 Mark Montgomery" | Used "Photo: Mark Montgomery" in `data/assets.json`. Fix the source record on daviddewese.com too. |
| A2 | Who shot the 1998 *Billboard* contact sheet `2068108482` | P17 credit "Photo: Trey Mitchell" (owner) | its own flag "Photographer unknown (possibly Trey Mitchell); Billboard may hold rights"; the Flickr description naming Trey Mitchell sits on a different sheet (`2067318287`) | Owner credit kept; ask Carly whether Billboard commissioned the shoot (rights). |
| A3 | Date of the 12th & Porter postcard `2067318521` | Flickr title "Postcard 1998" | "Wed Sept 15th": 15 Sept was a Wednesday in 1999 | Treat as probably 1999-09-15; contested. |
| A4 | Date of the "Friday Nov 14" flyer `530770086` | Flickr title only ("Uncle Tupelo") | Nov 14 was a Friday in 1997 and 2003; the 2003 site had `luxury_liners_nov_14_03.jpg` | Probably 2003-11-14. |
| A5 | Line-up in the c. 2000 Montgomery session | research: probably David, Chad, Scott (Wilstermann joined Dec 2000) | the *Believe* EP (March 2001) back cover uses the same session; by then the band was a four-piece | Session predates Dec 2000 → Chad-era trio is the best reading; confirm. |
| A6 | Kristin vs Kristen Barlowe | Flickr: Kristin | 2010 discography page: Kristen | Ask (research 01 D12). |
| A7 | *Great Day* master | PNG named "upscale", RGBA, alpha 219-255 | Apple serves an opaque 3000px JPEG | Use either; flatten the PNG onto the sky colour. Ask for the pre-upscale original. |
| A8 | Cover master sizes | daviddewese.com masters 1400px | Bandcamp originals 1600px for *Believe*, *Overbored*, *Nonetheless* | Bandcamp copies are larger; ask Carly which is the true master. |
| A9 | Scott Carpenter's start date | roster: Aug 1998 | Waco 1998 photos and *Trunk Box* ("scott's first offical gig", fall 1998) | consistent; noted for photo dating (pre-Aug-1998 photos cannot show Scott). |
| A10 | Fourth player, March 2004 | research 06: "a fourth player" | Flickr title `18289095` "gary ishee" | Gary Ishee (single-source; he plays on *Nonetheless*). |
| A11 | Pedal-steel player, Dec 2007 | research: unnamed | Flickr title `2096371215` "Grant Johnson" | single-source; confirm before naming. |
| A12 | Carrd photos' photographer | research 04: "unknown" | visual match to the Mark Montgomery session | probably Mark Montgomery; confirm. |
| A13 | Flickr originals | 98 downloaded | 150 returned HTTP 429 all session (the larger "_k"/"_h" sizes still worked) | web copies stored; run `scripts/fetch-flickr-originals.sh` later. |
| A14 | WebSearch for other LL images (press photos, gig posters) | Round 1: 2 searches, nothing. Round 2: 7 more WebSearch queries plus direct fetches (see §13): Nashville Scene, Tennessean, Texas Music Café, Sound Asleep LP, Kool Kat, Last.fm, Nashville venue posters | Results: only name collisions (Emmylou Harris *Luxury Liner*, Carter Tanton's Luxury Liners, cruise ships) and a Last.fm bio line; Last.fm `+images` returned a bot challenge; soundasleeprecords.com is a legacy frameset with no LL product image; koolkatmusik.com returned HTTP 406 | **No new usable images.** One lead: MTSU Center for Popular Music "Nashville Show Posters" collection (300+ posters from 1990 on, incl. Exit/In, 12th & Porter, The End): finding aid https://w1.mtsu.edu:8443/popmusic/findingaids/pdfaids/SHOPOST.pdf, connection reset here: **needs a browser** to check for LL posters. |
| A15 | Date of `530769478` ("Chad's Last Show") | Flickr title: "March 2001" | Flickr date_taken: 2001-04-21 | Title is the stronger source (camera/scan dates are often wrong), but contested; caption "2001" or "March 2001" only after Carly confirms. |
| A16 | *Sound As Ever* cover design credit | daviddewese.com research 01: Mark Montgomery (Producer; design) | Discogs 6768612: Mark Montgomery as Producer only, no design credit | Single-source; round 1 mis-cited it to Discogs (fixed). Confirm with Carly or the CD booklet (§11 #11). |
| A17 | Release title spelling | daviddewese.com and our `releases.json`: "Shake It Up (Live at the Texas Music Café)" | Apple Music, YouTube Music, cover lettering: "Cafe" | Use "Café" in site copy (matches releases.json); alt text quoting the cover may say what is printed. |
| A18 | Who is on the Oct 2007 coffee-shop frames | Flickr album "The Luxury Liners & Jeff Grant" | Titles name Jeff Grant / Josh / Jeremy / Grant; frames show two different acts | Marked per frame (§10.12, json `performer`). Whether the steel player "Grant" is Grant Johnson is a visual match to `2096371215` (same player and shirt): single-source + inference. |

Open questions are the "confirm" items in §11 (13-15) plus: Are the Discogs packaging scans fine to use as reference images inside the Vault (they are user uploads)? Does David want the Chad-era white-studio photos to stay the band's "face" (as on the current Carrd site), or should the site lead with the trio era?

---

## 13. Sources

Local (read 2026-10-07):
- `/home/user/daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md` (owner decisions)
- `/home/user/daviddewese.com/daviddewese-com/data/photos.json`, `data/covers.json`, `research/06-photo-inventory.md`, `research/04-live-sites-and-archive.md` §3, §5, §7, `research/legacy/cdx-theluxuryliners.com.json`
- `/home/user/daviddewese.com/daviddewese-com/assets/source/covers/`, `assets/source/photos/`, `site/src/assets/portraits/` and `portraits.json`, `site/src/assets/masters.json`
- `/home/user/theluxuryliners.com/research/01-band-history-and-people.md`, `02-discography.md`, `data/releases.json`

Web (fetched with curl 2026-10-07; verified-source):
- Flickr API `flickr.photosets.getPhotos` for 18 albums of user `dewese` (70946985@N00); originals and derivatives from `live.staticflickr.com`
- iTunes lookup `https://itunes.apple.com/lookup?id=47333263&entity=album`; artwork from `is1-ssl.mzstatic.com`
- Bandcamp embedded player `https://bandcamp.com/EmbeddedPlayer/album=<id>` (art ids); originals from `f4.bcbits.com`
- Discogs API `https://api.discogs.com/releases/<id>` for 6768612, 6768660, 14391955, 14401612, 37658859, 15436127, 6907226, 7044627, 8057090, 22919255, 9601921, 34741341; images from `i.discogs.com`
- Spotify image `https://i.scdn.co/image/ab67616d0000b27339732e51fd05e75ebe9fd74d`
- WebSearch: "\"The Luxury Liners\" Nashville band photo Dewese Edgington"; "\"Luxury Liners\" \"Texas Pop\" poster OR flyer OR \"Hatch Show\"" (no relevant results)
- WebSearch, round 2 (2026-10-07), all with no new LL image: "\"Luxury Liners\" Nashville Scene band Dewese" (only a Last.fm bio line and unrelated pages); "\"Luxury Liners\" \"Texas Music Cafe\" Shake It Up" (venue pages only, e.g. https://destinationwaco.org/events/texas-music-cafe-grand-reopening-ribbon-cutting); "\"Luxury Liners\" \"Sound As Ever\" Sound Asleep Records LP" (Emmylou Harris and Carter Tanton collisions); "\"Luxury Liners\" Kool Kat Musik Overbored OR Nonetheless" (cruise-ship noise); "\"The Luxury Liners\" Tennessean band photo 2003 OR 2004 OR 2006" (nothing); "last.fm \"The Luxury Liners\" images" (track page https://last.fm/zh/music/The+Luxury+Liners/_/Constellation+Invitation only); "\"Luxury Liners\" \"12th & Porter\" OR \"Exit/In\" OR \"The End\" Nashville ... poster" (lead: MTSU Nashville Show Posters finding aid)
- Direct fetches, round 2: `https://www.last.fm/music/The+Luxury+Liners/+images` (HTTP 200 but a "Client Challenge" bot page); `https://soundasleeprecords.com/` (legacy frameset, no LL item); `https://www.koolkatmusik.com/` (HTTP 406); `https://w1.mtsu.edu:8443/popmusic/findingaids/pdfaids/SHOPOST.pdf` (connection reset)

Blocked: web.archive.org, theluxuryliners.com, archive.ph (connection reset). Instagram and Facebook (@theluxuryliners) were not tried: they need a login (research 04).

---

## Revision log

**Round 2 (2026-10-07)**, answering `critiques/assets-round1.md` (7.5/10):
- **B1 (X1), fixed.** The frame the critic flagged is removed from the md (inventory, excluded table, caption rule, wish-list) and its record is dropped from `data/assets.json`. Only a bare id is left in `do_not_use_ids`, with no title and no reason. Nothing about it is asked of Carly. The X1 caption rule is now general.
- **N1.** The *Sound As Ever* design credit is now cited to daviddewese.com research 01 (single-source), with a note that Discogs 6768612 lists Mark Montgomery only as Producer. The *Believe* credit note no longer leans on that claim. New discrepancy row A16.
- **N2.** §4.3 is now generated from `data/assets.json`, so sizes, tiers, credits and on-disk sizes match the json. Fixes: 18 albums, not 15; 274 Flickr records, 26 excluded; the solo-archive tier is web-small; the `2073240141` web copy is 1076x1599; §4.2 member portraits and every other §4.2 row now give real per-photo sizes (this also fixed a wrong "600-963" range that hid a 350px frame).
- **N3.** `3978343931` no longer says "former". The alt names David Dewese (in the '97 suit, from the Flickr description) and Scott Carpenter "of The Luxury Liners". New rule §10.13.
- **N4.** `2086444773` alt now says the sign is for The Gig in Los Angeles. The "Chicago" reading is gone.
- **N5.** The F4 rule is rewritten: after 2001, Chad may appear as a forever member or a guest, never as current line-up.
- **N6.** `credit_status` added to every json record (21 confirmed, 37 named awaiting confirmation, 193 no-credit-publishable under P17). "(confirm)" in the Credit column now appears only where a photographer is named. The confidence key explains the difference.
- **N7.** `530769478` date conflict (title March 2001 vs date_taken 2001-04-21) is added as A15 and as a json flag.
- **N8.** The *Great Day* comparison now reads "mean difference under 1/255".
- **N9.** "Texas Music Café" is used throughout, matching `releases.json`. The "Cafe" variants are noted in §3.2 and A17.
- **N10.** Ran 7 more WebSearch queries and 4 direct fetches (listed in §13). No new images turned up. One lead, the MTSU poster collection, is added to "needs a browser".
- **N11.** In the Jeff Grant album, each frame is now marked: 3 frames show the other act (json `performer`, use "archive only"), 2 show guests (a fiddler, and the steel player matched to `2096371215`), 1 cannot be identified, and the rest show the band. New rule §10.12 and discrepancy A18.
- All json file dimensions were re-checked against the files on disk with PIL: no mismatches.

