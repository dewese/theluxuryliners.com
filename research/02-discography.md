# The Luxury Liners: Discography

_Research track "discography", theluxuryliners.com project. Compiled 2026-10-07; revised for rounds 2 and 3 the same day (see the Revision log at the end)._
_Machine-readable companion: `data/releases.json` (21 objects: 7 primary releases, 1 reissue, 8 appearances, 4 archive items, 1 lead)._

## 0. Ground rules applied

| Rule | Source | Effect here |
|---|---|---|
| David Dewese and Chad Edgington **co-founded** the band in 1997 in Nashville; Chad left Nashville in 2001; David carried on | DECISIONS F4 | Credits and notes say "co-founder". The 2005 band-site story (Chad's talent-show band that David "joined") is not repeated as the origin |
| Public release date = **the date Spotify lists**, except owner dates | P6 (owner dates: F1 *Calcutta*, P25 *Make The Best Of It*, neither one a Luxury Liners record) | Every Luxury Liners release on Spotify uses Spotify's date. Other dates are internal only (`release_date_candidates_internal`) |
| *Great Day* 2026-02-13 and *New Beginning* 2026-04-17 are the band's own releases | F6 | Marked `confirmed-owner` |
| "Shake It Up" is an **original**, first released on the *Believe* EP (2001). *Believe* EP track 3 is a **cover of Cher's "Believe"** | P27 | The live single is labelled as a live version, not a cover |
| Forever members: David Dewese, Chad Edgington, Scott Carpenter, David "Larry" Wilstermann | P8 | Used for personnel names |
| 2002 four-piece photo: never call it "the 2002 line-up" | P22/P23 | Not used as evidence for who played on any record |
| isawtheocean.com has expired | P5 | Never linked |
| One side project and person are excluded | X1 | Nothing about them appears here. Where a source credit touches X1 (one co-writer credit on *Overbored* track 7), the credit is **withheld** and marked "withheld under X1"; the team has the specifics |
| Privacy | brief | Band roles only. No residences or private details |

**Confidence labels** used for each fact and in the `verification` field of each JSON object:
- `confirmed-owner`: stated by Carly for David in DECISIONS-2026-09-29.md.
- `verified-source`: read first-hand from at least two independent authoritative sources (store APIs, Discogs, MusicBrainz) that agree.
- `single-source`: rests on one source.
- `unverified`: a lead or an inference.

## 1. How this was verified, and what could not be re-checked

**Round 3 (2026-10-07): live re-reads with plain `curl` worked.** The round-2 statement that every music-data host refused `curl` is withdrawn; it was true when first tried, but not now. Using a polite User-Agent (no personal details), these hosts answered and were read for this revision:

| Host | What was read | Result |
|---|---|---|
| `api.discogs.com/releases/<id>` | 6768612, 6768660, 14391955, 14401612, 37658859, 15436127, 34741341, 22919255, 7044627, 6907226, 8057090, 9601921 | 200. Per-track writers and producers, notes, durations, barcodes. **This corrected the *Sound As Ever* and *Overbored* songwriting** (§3.1, §3.3) |
| `itunes.apple.com/lookup` | artist 47333263 (`entity=album`) and all 7 collections (`entity=song`) | 200. Every album date, ℗ line, track count and track duration agrees with this file |
| `api.deezer.com/album/<id>` | 7189504, 1372240, 3230601, 8406852, 902290832, 949841901 | 200. UPCs, label "Litterbug Records", dates and durations agree; one title oddity (D15) |
| `open.spotify.com` album and track pages (`music:release_date`) | all 7 albums, the 2023 Texas Music Café compilation, track 5VN9RMk9n83auNJvD8FF9G | 200. **All P6 public dates agree.** The "Great Day" track ID is now verified |
| `musicbrainz.org/ws/2/release-group?artist=7af7fd54…` | release groups | 200. Still only *Overbored* and *Nonetheless* |
| `www.amazon.com/dp/<asin>` (with `--compressed`) | B00004U073, B000065T3A; search pages | 200. Both CD pages confirmed; MP3 album ASINs found (§3.1, §3.2); searches for later titles returned only name collisions |
| `daviddewese.bigcartel.com` | product page and shop root | **404** both. Dead; not linked (§3.1) |
| `en.wikipedia.org` (raw page) | *One Tree Hill* season 1 | 200 (after one 429). Episode 15 air date confirmed (§3.3) |
| `theluxuryliners.com` | home page | 200. The current one-page site: a one-line blurb plus Spotify, Apple, Instagram, Facebook and YouTube links. No discography content |

**Still not readable:** WebFetch (every host), `web.archive.org` (no connection), Bandcamp (3 KB challenge stub only), AllMusic (403), Tidal (needs a token; not tried), Amazon MP3 and music.amazon.com pages (render only in a browser), archive.ph (no connection in round 2). Values from those hosts are carried over from the daviddewese.com catalog worker's first-hand reads of 2026-09-28/29 (`daviddewese.com/daviddewese-com/data/releases.json`, critic-approved in `catalog-fix-round1.md` and `catalog-round3.md`) and are marked as such.

**Earlier WebSearch leads** (round 2) are kept only where a live read now backs them: the Bandcamp listings (dates and track counts match the dd catalog), the Apple pages (now read live) and the "Great Day" track ID (now read live). The AllMusic/Shazam biography line ("named after a Gram Parsons song … originally intended as an alt-country outlet for Foxymorons member David Dewese … a guitar-crunchy power pop band") is a history-track matter, recorded in D1 only.

**Bottom line:** every Spotify, Apple, Deezer and Discogs value in this file was compared with a live read on 2026-10-07. Bandcamp, Tidal and YouTube Music values rest on the 2026-09-28/29 dd reads. Section 9 lists what still needs a human with a browser.

## 2. Release summary

Public dates follow P6. "Verif." is the JSON `verification` value.

| # | Public date | Title | Type | Label / cat. no. | UPC | Tracks / length | Verif. |
|---|---|---|---|---|---|---|---|
| 1 | 2000-05-01 | *Sound As Ever* | album | Echomusic / Litterbug Records, EMLLCD1001 | 635759200625 | 15 / 52:14 | verified-source |
| 2 | 2001-03-01 | *Believe* EP | EP | Echomusic, EMLLCDP1002 (digital: Litterbug) | 635759201127 | 3 / 8:55 | verified-source |
| 3 | 2003-05-01 | *Overbored* | album | Litterbug Records, LLCD1003 | 635759145124 | 10 / 36:23 | verified-source |
| 4 | 2006-10-01 | *Nonetheless* | album | Litterbug Records, LLCD1004 | 789577513228 | 12 / 44:35 | verified-source |
| 5 | 2021-08-27 | *Shake It Up (Live at the Texas Music Cafe)* | single (live) | Texas Music Café | 662582233728 | 1 / 3:10 | verified-source |
| 6 | 2026-02-13 | *Great Day* | single | Litterbug Records | 199900557513 | 1 / 3:22 | confirmed-owner |
| 7 | 2026-04-17 | *New Beginning* | single (2 tracks) | Litterbug Records | 991043318712 | 2 / 6:04 | confirmed-owner |
| R | 2026-05-27 | *Sound As Ever* (remastered LP reissue) | reissue | Sound Asleep Records (Sweden), ZZZ056 | none listed | 12 / durations not listed (data gap) | single-source |

The band also appears on **8 compilations or bonus discs** (section 4) and has **4 non-commercial archive items** plus one lead (section 5).

---

## 3. Releases in detail

### 3.1 *Sound As Ever* (2000)

| Field | Value | Source / confidence |
|---|---|---|
| Public date | **2000-05-01** (Spotify) | P6; dd releases.json. Internal: Discogs 2000-05; Bandcamp, Apple and Deezer 2000-05-01; Tidal 2000-01-01; band site "May 2000" |
| Format | CD (2000); digital; LP reissue 2026 (see 3.8) | Discogs 6768612 |
| Label / cat. no. | Echomusic **and** Litterbug Records, both EMLLCD1001 (Discogs); digital label Litterbug (Deezer/Tidal); band site 2005: "Litterbug Records, May 2000" | verified-source |
| UPC | 635759200625 (= Discogs barcode 6 35759-2006-2 5) | verified-source |
| Producers | **Mike Poole on tracks 1–7 and 10–15; Mark Montgomery on tracks 8–9** (Discogs per-track credit, read live 2026-10-07). Recorded and mixed in Nashville by Mike Poole (band site 2005) | single-source per-track split (Discogs); both names also on the band site 2005 |
| Studio / mastering | not credited in any source read | gap |
| Songwriting | **Chad Edgington and David Dewese on tracks 1–8 and 10–15. Track 9 "Mine": Brad Miles, Robert Reynolds and Scott Carpenter.** Discogs gives writers per track (read live 2026-10-07). dd `data/release-leads.json` line 46 independently notes "Brad Miles also co-wrote 'Mine' on Sound As Ever", but it draws on Discogs too, so this is one source. Robert Reynolds is also the music and production credit on *Antarctic Antics* (§4) | single-source; ask David (question 4) |
| Personnel | David Dewese, Chad Edgington, Scott Carpenter (performers, Discogs). Roster roles: David guitar/bass/vocals; Chad guitar/bass/vocals; Scott drums (joined Aug 1998). Wilstermann joined Dec 2000, after this record | Discogs; band roster 2005 |
| Cover art | Illustration of four pairs of blue trouser legs and red shoes; "Sound as ever…" script. **Design: Mark Montgomery** (Discogs, CD). The 2026 LP credits **"Jim Horan – Cover"** and "David DeWeese / Mark Montgomery – Art Direction, Design" (Discogs 37658859, read live). Jim Horan is presumably the illustrator of the same artwork; that is an inference (question 2). Master: `assets/source/covers/soundasever.jpg` (1400 px) | single-source |
| Copyright | ℗ 2000 The Luxury Liners (Apple, live) | verified-source |

**Tracklist** (Bandcamp titles and durations; Apple durations identical on the live read; ISRCs from Tidal and Deezer; writers and producers from Discogs, live):

| # | Title | Time | ISRC | Writers | Producer | Note |
|---|---|---|---|---|---|---|
| 1 | Think She's Coming Around | 3:13 | USEC40500197 | Edgington / Dewese | Poole | also on *Fireworks Vol. 2* (1998), where Discogs credits Edgington alone (D14). Deezer titles it "(Live)" (D15) |
| 2 | Fresh Start | 3:30 | USEC40500198 | Edgington / Dewese | Poole | |
| 3 | Just A Girl | 3:15 | USEC40500199 | Edgington / Dewese | Poole | |
| 4 | Since You Met Me | 2:38 | USEC40500200 | Edgington / Dewese | Poole | also on *Fireworks Vol. 2* (1998) |
| 5 | When We're Alone | 4:18 | USEC40500201 | Edgington / Dewese | Poole | |
| 6 | The Duke Of Gloucester | 4:03 | USEC40500202 | Edgington / Dewese | Poole | |
| 7 | Pecan Valley Blues | 3:24 | USEC40500203 | Edgington / Dewese | Poole | |
| 8 | Breezy | 3:38 | USEC40500204 | Edgington / Dewese | Montgomery | |
| 9 | Mine | 2:35 | USEC40500205 | **Brad Miles / Robert Reynolds / Scott Carpenter** | Montgomery | |
| 10 | Serengeti Summer | 3:36 | USEC40500206 | Edgington / Dewese | Poole | |
| 11 | User's Guide | 3:47 | USEC40500207 | Edgington / Dewese | Poole | |
| 12 | How Do I Say Goodbye | 4:22 | USEC40500208 | Edgington / Dewese | Poole | Apple: "How Do I Say Goodbye?". Discogs (CD) says 4:56 (see note below) |
| 13 | Precious | 3:19 | USEC40500209 | Edgington / Dewese | Poole | hidden track; Apple/Discogs "Precious To My Heart"; on *Fireworks Vol. 3* (2025) |
| 14 | The Loneliest Boy In Town | 2:46 | USEC40500210 | Edgington / Dewese | Poole | hidden track; Apple "Loneliest Boy in Town" |
| 15 | The International Submarine Band | 3:50 | USEC40500211 | Edgington / Dewese | Poole | hidden track; the title is the name of Gram Parsons' 1960s band, not a cover |

**Duration note.** Discogs lists most tracks one second shorter than Apple and Bandcamp (a rounding difference: 3:29 vs 3:30, and so on). The one real gap is track 12: **4:56 on the CD's Discogs page, 4:22 on Apple and Bandcamp.** The CD figure probably includes the silence before the hidden tracks, which are separate tracks in the digital edition. Keep 4:22 in the digital tracklist; do not "fix" it to 4:56.

**Platform IDs:** Spotify album [6qzUYiUTCQvsgP1NbGY4lD](https://open.spotify.com/album/6qzUYiUTCQvsgP1NbGY4lD) · Apple [529281147](https://music.apple.com/us/album/sound-as-ever/529281147) · Bandcamp album 2083883374, [daviddewese.bandcamp.com/album/sound-as-ever](https://daviddewese.bandcamp.com/album/sound-as-ever) · Deezer [7189504](https://www.deezer.com/album/7189504) · Tidal [31180549](https://tidal.com/browse/album/31180549) · YouTube Music [MPREb_bzXGIht8w0Q](https://music.youtube.com/browse/MPREb_bzXGIht8w0Q) · Discogs release [6768612](https://www.discogs.com/release/6768612) · MusicBrainz: **no release group** (re-checked live 2026-10-07) · Amazon CD ASIN [B00004U073](https://www.amazon.com/dp/B00004U073) (read live 2026-10-07: "Sound As Ever", Audio CD, now sold as a CD-R by a third party; Original Release Date 2000; first available on Amazon 2007-01-26; verified-source together with Discogs) · Amazon MP3 album ASIN [B00859ZP5I](https://www.amazon.com/dp/B00859ZP5I) (listed in the CD page's "other formats" block as MP3 Music, May 1, 2000; the MP3 page itself renders only in a browser; single-source) · CD Baby: not found.

**Historical store page (do not link):** a Big Cartel page, `daviddewese.bigcartel.com/product/sound-as-ever`, once existed (WebSearch result title "David Dewese — Sound As Ever"). On 2026-10-07 it returned **404**, and so did the shop root. dd research/02 line 203 lists the domain as a dead link to purge, and `research/03-web-archaeology.md` line 515 marks it "Dead: 404 … Do not link".

Notes: the digital ISRCs (USEC405…) are 2005 registrations, so the digital edition dates from about 2005. The digital album is hosted on David's own Bandcamp account under the artist name "The Luxury Liners". Amazon gives the CD date as May 30, 2000 (internal only; P6 date stays 2000-05-01).

### 3.2 *Believe* EP (2001)

| Field | Value | Source / confidence |
|---|---|---|
| Public date | **2001-03-01** (Spotify) | P6. Internal: Discogs 2001-03; Apple and Deezer 2001-03-01; **Bandcamp 2001-01-21**; Tidal 2001-01-01 (Tidal API, recorded in dd `critiques/audit-geo-round2.md` line 88; a 1 January value, probably a placeholder) |
| Format | Enhanced CD EP (QuickTime "It's You" video, interview video/EPK, desktop images); digital | Discogs 6768660; band albums page 2001 |
| Label / cat. no. | Echomusic EMLLCDP1002 (CD); Litterbug Records (digital, Deezer/Tidal) | verified-source |
| UPC | 635759201127 (= Discogs barcode) | verified-source |
| Producer | **Mark Montgomery and The Luxury Liners** (both credited "Producer" on Discogs, read live). Montgomery also engineer; mixed by Shane D. Wilson; engineered and mastered by Chris Milfred | Discogs (live) + band site 2001 |
| Songwriting | Tracks 1–2: **Edgington / Dewese / Carpenter** (Discogs, per track). Track 3: **cover of Cher's "Believe"**; Discogs lists the song's writers as Brian Higgins, Matt Gray, Paul Barry, Steve Torch, Stuart McLennan and Tim Powell | single-source (writers, Discogs live); confirmed-owner P27 (original vs cover) |
| Personnel | David Dewese, Chad Edgington, Scott Carpenter (Discogs). Whether Wilstermann (joined Dec 2000) plays on it is not stated | single-source |
| Cover art | Red cover, black silhouette of a leaping guitarist over a white ring. Credit **unknown**. Master: `assets/source/covers/believe.jpg` | gap |
| Copyright | ℗ 2001 The Luxury Liners (Apple) | verified-source |

| # | Title | Time | ISRC | Writers / note |
|---|---|---|---|---|
| 1 | It's You | 3:28 | USQ7J1000012 | Edgington/Dewese/Carpenter. A different recording (3:24, USEC40500239) closes *Overbored* |
| 2 | Shake It Up | 2:37 | USQ7J1000013 | Edgington/Dewese/Carpenter. **Original** (not the Cars song), first released here (P27) |
| 3 | Believe | 2:50 | USQ7J1000014 | Cover; original artist **Cher** (writers Higgins, Gray, Barry, Torch, McLennan, Powell per Discogs). Bandcamp title "Believe (Cher Cover)" |

The CD also carries enhanced content (Discogs): "It's You" QuickTime movie (3:45) and an electronic press kit QuickTime movie (6:53).

**Platform IDs:** Spotify [0b8te1vh6pqC1vcUrzmVD5](https://open.spotify.com/album/0b8te1vh6pqC1vcUrzmVD5) (the live US listing; **do not use** duplicate 4d8xq6q2H9a9VpwPrOmgLz, dated 2010-12-14 and not available in the US) · Apple [483219017](https://music.apple.com/us/album/believe-single/483219017) (Apple calls it "Believe - Single") · Bandcamp 4159017568, [believe-ep](https://daviddewese.bandcamp.com/album/believe-ep) · Deezer [1372240](https://www.deezer.com/album/1372240) · Tidal [31180579](https://tidal.com/browse/album/31180579) · Discogs [6768660](https://www.discogs.com/release/6768660) · MusicBrainz: none (re-checked live) · Amazon CD [B000065T3A](https://www.amazon.com/dp/B000065T3A) (read live: "The Luxury Liners - Believe E.P.", Audio CD, label "Echo", Original Release Date 2001, Audio CD dated March 15, 2001) · Amazon MP3 album [B006DHAWXE](https://www.amazon.com/dp/B006DHAWXE) ("other formats" block: MP3 Music, March 1, 2001; page not machine-readable; single-source) · YouTube Music: not resolved.

Notes: the digital ISRCs are 2010 registrations under the USQ7J registrant (the same as David's solo catalogue), which fits the 2010-12-14 Spotify duplicate. The digital edition was probably (re)issued around 2010. "Shake It Up" was also on the SESAC SXSW 2001 promo CD.

### 3.3 *Overbored* (2003)

| Field | Value | Source / confidence |
|---|---|---|
| Public date | **2003-05-01** (Spotify) | P6. Internal: Discogs 2003-04-16; Bandcamp 2003-04-01; Apple and Deezer 2003-05-01; Tidal 2003-01-01 |
| Format | CD; digital | Discogs 14391955 |
| Label / cat. no. | Litterbug Records LLCD1003 | verified-source |
| UPC | 635759145124 | verified-source |
| Recording | Recorded by Doug Nightwine; mixed by Chris Henning. **No producer credit found** | single-source (Discogs) |
| Songwriting | **Per track on Discogs** (read live 2026-10-07; see the tracklist). David Dewese alone wrote 5 of the 10 songs; "Restless" is credited to **David Wilstermann alone**; the other four are co-writes. The round-2 summary ("written by David Dewese, most tracks; exceptions not listed") was wrong and is withdrawn | single-source; ask David (question 4) |
| Personnel | David Dewese (guitar, vocals); David "Larry" Wilstermann (bass); Scott Carpenter (drums); Paul Seykora (keyboards, tracks 3 and 6) | Discogs (live) |
| Cover art | Painting of three upside-down figures in coats. Credit **unknown**: no source credits the painter or designer. Scott Carpenter painted the *Nonetheless* cover (3.4), but that is **not** taken as evidence for this one; it is put to David as a question. Master: `assets/source/covers/overbored.jpg` | gap |
| Copyright | ℗ 2003 The Luxury Liners | verified-source |

| # | Title | Time | ISRC | Writers (Discogs, live) | Note |
|---|---|---|---|---|---|
| 1 | Sunshine | 3:05 | USEC40500231 | Dewese | theme of FOX Sports' *US Youth Soccer Show* (David's site, 2010) |
| 2 | Restless | 3:41 | USEC40500232 | **Wilstermann** | |
| 3 | Dreaming | 4:39 | USEC40500233 | Dewese | keyboards Paul Seykora. Used in *One Tree Hill* S1E15 "Suddenly Everything Has Changed", aired **2004-02-24 on The WB** |
| 4 | Overbored | 4:12 | USEC40500234 | Dewese | |
| 5 | Waiting For The Sun | 3:24 | USEC40500235 | Dewese | live 7/18/02 take was on the band site |
| 6 | Woman | 3:48 | USEC40500236 | Edgington / Dewese | keyboards Paul Seykora |
| 7 | Equasue | 3:35 | USEC40500237 | Edgington / Dewese (+1 further credit **withheld under X1**) | spelled this way everywhere |
| 8 | Fifteen Again | 3:40 | USEC40500238 | Dewese / Wilstermann / Carpenter | Discogs prints "FIfteen Again" |
| 9 | It's You | 3:24 | USEC40500239 | Edgington / Dewese / Carpenter | different recording from the *Believe* EP version |
| 10 | Constellation Invitation | 2:55 | USEC40500240 | Dewese | |

*One Tree Hill* sources: the placement is from dd research/04 line 248 (from David's old site and a YouTube clip); the episode title, number, air date and network are from Wikipedia, [One Tree Hill season 1](https://en.wikipedia.org/wiki/One_Tree_Hill_season_1) (raw page read with `curl` 2026-10-07: episode 15, OriginalAirDate 2004-02-24, network The WB). dd research/04 says "CW", which is anachronistic: The CW did not exist until 2006. Use "The WB".

Track 7 on the site: show "Chad Edgington / David Dewese" only if the team accepts an incomplete credit; otherwise omit writer credits for this track. Do not name the withheld co-writer anywhere (X1).

**Platform IDs:** Spotify [1pRDTqjcjnt4zDm9pPUaEC](https://open.spotify.com/album/1pRDTqjcjnt4zDm9pPUaEC) · Apple [529876344](https://music.apple.com/us/album/overbored/529876344) · Bandcamp 404979016, [overbored](https://daviddewese.bandcamp.com/album/overbored) · Deezer [3230601](https://www.deezer.com/album/3230601) · Tidal [31180536](https://tidal.com/browse/album/31180536) (the 2026-09-28 read found the Tidal listing incomplete) · Discogs [14391955](https://www.discogs.com/release/14391955) · MusicBrainz release group [110c4bd6-6ef3-3297-a99c-a334213cb228](https://musicbrainz.org/release-group/110c4bd6-6ef3-3297-a99c-a334213cb228) (present on the live read), release d9d3ebdd-3f01-4a19-9918-80efaf6aaf6b · YouTube Music: not resolved · Amazon: an amazon.com search (curl, 2026-10-07) returned only name collisions; unknown, not absent.

Archive extras: a one-sheet PDF (`/downloads/luxury_liners_onesheet.pdf`, 2003) and full lyrics and chords (`lyrics.html`, 2003–05) were on the band site.

### 3.4 *Nonetheless* (2006)

| Field | Value | Source / confidence |
|---|---|---|
| Public date | **2006-10-01** (Spotify, live) | P6. Internal: Discogs 2006-10; Bandcamp, Apple, Deezer and Tidal 2006-10-01; Apple track-level 2006-09-01 (live) |
| Format | CD; digital | Discogs 14401612 |
| Label / cat. no. | Litterbug Records LLCD1004 | verified-source |
| UPC | 789577513228 | verified-source |
| Mix / master | Chris Henning, The Den, Ferndale CA. **No producer credit found** | single-source |
| Songwriting | **Not published** in any source read. Discogs 14401612, re-read live 2026-10-07, has no writer credits. No presumption is made | gap |
| Personnel | David Dewese (vocals, guitar); David "Larry" Wilstermann (bass, keyboards, vocals); Scott Carpenter (drums, percussion, vocals); Ryan Gilbert (keyboards, vocals); Gary Ishee (guitar, tracks 2 and 6); Erika Proegler (violin, track 11); Brent Milligan (cello, track 11) | Discogs; 2010 daviddewese.com discography |
| Cover art | Painting of a long dark dress on a hanger. **Paintings: Scott Carpenter; design: David Dewese; band photos: Kristen Barlowe.** Credit block quoted from the 2010 daviddewese.com discography page ("Art: Scott Carpenter (paintings); Kristen Barlowe (band photos); David Dewese (design)"), dd research/04 line 225. Master: `assets/source/covers/nonetheless.jpg` | single-source (2010 daviddewese.com discography, Wayback, read by the dd research worker) |
| Press | Absolute Power Pop, Top 100 Releases of 2006 (#100); Carligula, Top Five Nashville Releases of 2006 (#3) | band site 2007 (single-source) |

| # | Title | Time | ISRC |
|---|---|---|---|
| 1 | Circles | 2:47 | USEC40600624 |
| 2 | Breaking Out | 4:11 | USEC40600625 |
| 3 | Fallen Star | 3:04 | USEC40600626 |
| 4 | Sing A Song For You | 4:02 | USEC40600627 |
| 5 | Bluebonnet Sunrise | 3:56 | USEC40600628 |
| 6 | How It Should Be | 3:15 | USEC40600629 |
| 7 | Disengage Your Doubt | 4:19 | USEC40600630 |
| 8 | Crash And Burn | 3:37 | USEC40600631 |
| 9 | So In Love | 3:28 | USEC40600632 |
| 10 | Just To Dream | 3:56 | USEC40600633 |
| 11 | Sold Out | 3:14 | USEC40600634 |
| 12 | The Cards You Dealt Me | 4:46 | USEC40600635 |

Song history from the band journal: "Breaking Out" was played live from May 2002, and "Circles" debuted in October 2003.

**Platform IDs:** Spotify [05AMwlnQPNb4UpHSpIAna7](https://open.spotify.com/album/05AMwlnQPNb4UpHSpIAna7) · Apple [529282730](https://music.apple.com/us/album/nonetheless/529282730) · Bandcamp 54140699, [nonetheless](https://daviddewese.bandcamp.com/album/nonetheless) · Deezer [8406852](https://www.deezer.com/album/8406852) · Tidal [31180946](https://tidal.com/browse/album/31180946) · Discogs [14401612](https://www.discogs.com/release/14401612) · MusicBrainz release group [f45d4be4-6850-3b8e-aae9-3fe518ad8403](https://musicbrainz.org/release-group/f45d4be4-6850-3b8e-aae9-3fe518ad8403), release 589245ab-ab46-4a7f-af70-e9d6e90b564a · band store page 2008 (Wayback): `/store/product/5/Nonetheless` · YouTube Music: not resolved · Amazon: search returned only name collisions (curl, 2026-10-07).

### 3.5 *Shake It Up (Live at the Texas Music Cafe)* (2021)

| Field | Value |
|---|---|
| Public date | **2021-08-27** (Spotify and Apple re-read live; Tidal per dd read) |
| Label | Texas Music Café (Waco, TX; ℗ 2021 Texas Music Café) |
| UPC / ISRC | 662582233728 / US2762100919 |
| Track | Shake It Up (Live at The Texas Music Cafe), 3:10. Writers Edgington/Dewese/Carpenter, per the *Believe* EP credit |
| Status | **Live version of the band's original** (P27), not a cover |
| Personnel, recording date | **Unknown** |
| Cover art | No master supplied (P28). Spotify image for reference only |
| IDs | Spotify [1G91ruQwVVxJezHwWFox1H](https://open.spotify.com/album/1G91ruQwVVxJezHwWFox1H) · Apple [1581823464](https://music.apple.com/us/album/shake-it-up-live-at-the-texas-music-cafe-single/1581823464) · Tidal [194647039](https://tidal.com/browse/album/194647039) · YouTube Music [MPREb_5KpVxToLXAJ](https://music.youtube.com/browse/MPREb_5KpVxToLXAJ) · Deezer, Bandcamp: not found · Discogs, MusicBrainz: none |

A **different** live recording (ISRC US2762202822, 3:12) is on the 2023 Texas Music Cafe compilation (section 4).

### 3.6 *Great Day* (2026)

| Field | Value |
|---|---|
| Public date | **2026-02-13** (Spotify, Apple and Deezer re-read live; Tidal per dd read). Owner-confirmed (F6) |
| Label | Litterbug Records (Deezer); ℗ 2026 The Luxury Liners |
| UPC / ISRC | 199900557513 / USQ7J2600001 |
| Track | Great Day, 3:22 |
| History | A Luxury Liners **demo of "Great Day"** is track 4 of the 2008 Kool Kat bonus disc (section 4). Discogs times it at **3:22, exactly the length of this single**. Is the 2026 single that demo, released as is or remastered, or a new recording? Open question (D16, question 1) |
| Writers, personnel, producer | **Not published** |
| Cover art | Red kite against a blue sky. Credit unknown. Master `great-day-1-upscale.png` (3000 px, **upscaled**) |
| IDs | Spotify album [7jEU9cDDgHh7IWUAXlJ9RF](https://open.spotify.com/album/7jEU9cDDgHh7IWUAXlJ9RF) (verified-source, dd catalog) · Spotify track [5VN9RMk9n83auNJvD8FF9G](https://open.spotify.com/track/5VN9RMk9n83auNJvD8FF9G) (**verified-source**: track page read live 2026-10-07, "Great Day - song and lyrics by The Luxury Liners", release date 2026-02-13, duration 202 s = 3:22, matching Apple and Deezer) · Apple [1870665916](https://music.apple.com/us/album/great-day-single/1870665916) · Deezer [902290832](https://www.deezer.com/album/902290832) · Tidal [491176925](https://tidal.com/browse/album/491176925) · YouTube Music [MPREb_S37jYFP6dDr](https://music.youtube.com/browse/MPREb_S37jYFP6dDr) · Bandcamp, Discogs, MusicBrainz: none |

### 3.7 *New Beginning* (2026)

| Field | Value |
|---|---|
| Public date | **2026-04-17** (Spotify, Apple album and Deezer, all re-read live). Internal: Tidal and Apple track-level 2026-04-10 (Apple re-read live; possible pre-release). Owner-confirmed (F6) |
| Label | Litterbug Records |
| UPC | 991043318712 |
| Tracks | 1. New Beginning, 2:42 (USQ7J2600002) · 2. Great Day, 3:22 (USQ7J2600001, the **same recording** as the February single) · total 6:04 |
| Writers, personnel, producer | **Not published** |
| Cover art | A hand holding a clear CD case with a sunburst design. Credit unknown. Master `new-beginning-3000x3000-final.jpg` |
| IDs | Spotify [0r4RvQu4V4jKhSAlwBm7Fz](https://open.spotify.com/album/0r4RvQu4V4jKhSAlwBm7Fz) · Apple [1888874973](https://music.apple.com/us/album/new-beginning-single/1888874973) · Deezer [949841901](https://www.deezer.com/album/949841901) · Tidal [511031499](https://tidal.com/browse/album/511031499) · YouTube Music [MPREb_km85fvzVpxe](https://music.youtube.com/browse/MPREb_km85fvzVpxe) |

### 3.8 *Sound As Ever* remastered LP reissue (2026)

| Field | Value |
|---|---|
| Date | **2026-05-27** (Discogs; not a separate Spotify release, so the P6 fallback applies) |
| Label / cat. no. | Sound Asleep Records (Sweden) ZZZ056 |
| Format | LP, limited to 100 copies, marbled maroon vinyl, remastered |
| Remastering | Anders Peterson |
| Producers | Mike Poole on A1–A6, B1 and B4–B6; Mark Montgomery on B2 ("Breezy") and B3 ("Mine"). Same split as the CD |
| Songwriting | Release-level Written-By Chad Edgington and David Dewese (printed "DeWeese"); **B3 "Mine": Brad Miles, Robert Reynolds and Scott Carpenter** |
| Cover / art direction | **Cover: Jim Horan.** Art direction and design: David Dewese and Mark Montgomery (Discogs prints "David DeWeese") |
| Tracklist | A1–A6 = CD tracks 1–6; B1–B6 = CD tracks 7–12. The three hidden tracks are omitted. Discogs gives no durations |
| Notes (Discogs) | "Limited edition of 100 copies on marbled maroon vinyl. Originally released on CD in 2000." |
| IDs | Discogs [37658859](https://www.discogs.com/release/37658859). No UPC listed |
| Confidence | **single-source**: Discogs only, but **read live** via api.discogs.com on 2026-10-07. No label shop page found |

---

## 4. Appearances (compilations and bonus discs)

| Date | Release | Label / cat. | Luxury Liners track(s) | ID | Verif. |
|---|---|---|---|---|---|
| 1998 | VA, *Fireworks Vol. 2: 25 Explosive Tracks* (CD, Sweden) | Sound Asleep ZZZ006; barcode 7320470015902 | 9. Since You Met Me · 10. Think She's Coming Around | [Discogs 6907226](https://www.discogs.com/release/6907226) | verified-source |
| 1998 | VA, *Nashpop (A Nashville Pop Compilation)* (CD) | Not Lame Recordings NL-046; barcode 618403004626 | 12. If I Cry (Edgington/Dewese), **on no LL album** | [Discogs 7044627](https://www.discogs.com/release/7044627) | verified-source |
| 2001 | VA, *SESAC Presents… An Eclectic Evening Of Music* (promo CD, SXSW 2001) | self-released | 2. Shake It Up | [Discogs 8057090](https://www.discogs.com/release/8057090) | verified-source |
| 2001 | Judy Sierra, *Antarctic Antics* (children's read-along CD) | Scholastic / Weston Woods CD391; **ISBN** 9781555929725 (the Discogs "barcode" is the ISBN; there is no UPC) | 6. Penguin's First Swim (credited to Scotty Huff, Robert Reynolds, The Luxury Liners, David Dewese, Chad Edgington; the band's role is not stated). Robert Reynolds is credited with music, production, bass and vocals on tracks 1–11, and he co-wrote "Mine" on *Sound As Ever* | [Discogs 22919255](https://www.discogs.com/release/22919255) | single-source |
| 2005 | VA, *Between Goodlettsville And Murfreesboro* (CD) | Sound Asleep ZZZ014 | 15. Promise Ring, **otherwise unreleased** (David Dewese guitar and lead vocals, Wilstermann bass, Carpenter drums, Ryan Gilbert) | [Discogs 9601921](https://www.discogs.com/release/9601921) | verified-source |
| 2008 | David Dewese, *Make The Best Of It* Kool Kat Musik bonus disc (CD-R, free to buyers) | Litterbug | 4. Great Day (demo) 3:22 · 5. Breakaway (demo) 3:29 · 6. Baby's Waiting (Superdrag cover) 2:35 · 7. Purple Parallelogram (Lemonheads cover) 3:00 · 9. Lead Me On (cover; "Jetpack UK" per Discogs, "Jetpack" per the band site: contested, D7) 2:48. Tracks 1–3 are The Foxymorons, 8 and 10 David Dewese solo | [Discogs 15436127](https://www.discogs.com/release/15436127) | single-source |
| 2023-03-03 | VA, *25 Years of the 99 Cent, Deep Fried, Gravy Smothered, All You Can Eat Texas Music Cafe (Volume One)* | Texas Music Café; UPC 662582887822 | 15. Shake It Up (live), 3:12, ISRC US2762202822 | Tidal [267727835](https://tidal.com/browse/album/267727835) · Spotify [4HcZ87IXLiyVui34xeLHxO](https://open.spotify.com/album/4HcZ87IXLiyVui34xeLHxO) · YTM MPREb_rJxQ6edL9Ot | verified-source |
| 2025-05-27 | VA, *Fireworks Vol. 3* (CD, Sweden) | Sound Asleep ZZZ054 | 12. Precious To My Heart, 3:16 (the *Sound As Ever* hidden track) | [Discogs 34741341](https://www.discogs.com/release/34741341) | verified-source |

Personnel on *Fireworks Vol. 2* (Discogs, read live): the earliest line-up, with David Dewese (bass, vocals), Chad Edgington (guitar, vocals) and Jeff LaFrate (drums; Discogs spells it "Lafrate"); produced by Mike Poole. Writers there: "Since You Met Me" Edgington / Dewese; "Think She's Coming Around" **Edgington alone** (on *Sound As Ever* the same song is Edgington / Dewese; D14). *Nashpop* "If I Cry": Edgington / Dewese (live).

Kool Kat bonus disc, from the Discogs release notes (read live): "CD-r distributed to those who purchased [Make The Best Of It] from the Kool Kat Musik website"; "Tracks 4 and 5 were unreleased demos"; "Track 6 is a Superdrag cover"; "Track 7 is a Lemonheads cover"; "Track 9 is a Jetpack UK cover". Discogs adds uncredited original writers: John Davis ("Baby's Waiting"); Evan Dando and Noel Gallagher ("Purple Parallelogram").

## 5. Archive and Vault items (not commercial releases)

All four come from the band's own website, as read from Wayback captures by the daviddewese.com research worker (research/04 §5.2) and from the CDX index. They are all **single-source**, and none was re-opened this round. On daviddewese.com they belong in The Vault (P29), not on release cards.

| Item | Date | What is known | Tracks known | Wayback source |
|---|---|---|---|---|
| ***Trunk Box*** (live MP3 album) | fall 1998 | Recorded at E-Cleff Studios, Waco, TX; "scott's first offical gig" [sic]; **11 tracks** | Only "Trans-Am Mind" and "Araby" (on no other record). Cover art archived: `/images/trunkbox_cover.jpg`, `trunkbox_big.jpg` (2001) | [history/music.html 20050321225645](https://web.archive.org/web/20050321225645/http://theluxuryliners.com/history/music.html) |
| ***Live Liners*** | 2002-07-18 and 2002-11-17 | 12th & Porter, Nashville: full band in July, acoustic in November | July: at least 8 songs, including **#7 "Waiting For The Sun"** and **#8 "Breaking Out"** (`/mp3/7.18.02/…`, both captured only on 2021-02-14, both **404**). November (`/mp3/20021117/`): CDX rows for **01, 02, 03, 05, 06 and 07** (no 04), all truncated URLs captured 2005-05-25, all **404**; titles not in the CDX. **No Live Liners audio is archived on Wayback** | same; CDX |
| ***From The Vaults 1997–2001*** | c. 2001 | Early recordings | none known | same |
| **Covers and unreleased MP3s** | 2004–05 | Red-splash home page MP3 list | Lead Me On ("Jetpack" on the band site; "Jetpack UK" per Discogs; contested, D7), Baby's Waiting (Superdrag), Purple Parallelogram and Ride With Me (The Lemonheads), Manger Throne (Julie Miller), Jesus Christ (Big Star), Breakaway (`/mp3/misc/luxury_liners_breakaway.mp3`, archived 200) | [20050305090711](https://web.archive.org/web/20050305090711/http://theluxuryliners.com/) |

Other audio in the CDX:
- **Five "Waco" MP3s** captured in June 2001: `/mp3/waco/luxury_liners_be_with_you.mp3`, `_blockbuster`, `_if_i_cry`, `_shake_it_up` (all 200), plus `/web/mp3/waco/luxury_liners_say_goodbye.mp3` (404; note the different `/web/` path). "Be With You" and "Blockbuster" appear on no release. The folder name suggests the Waco session, but tying these to *Trunk Box* is **my inference, unverified**.
- **Album-track MP3s** captured as 200 audio: nine on **2005-11-05** under `www.theluxuryliners.com:80/mp3/` (Believe (Cher), Breezy, Coming Around, Gloucester, It's You, Just A Girl, Restless, Since You Met Me, Sunshine) and **"Breaking Out" on 2007-08-23** under `theluxuryliners.com/mp3/luxury_liners_breaking_out.mp3`. **RealAudio** `.ram` pointer files (2001-06-15, 200): Breezy, Coming Around, Gloucester, It's You; these are small metafiles, so the audio itself is probably not captured. All are album tracks.
- **`/mp3/misc/` rows not covered above** (all captured 2005-05-25, all **404**, truncated at the first space or dot): `Fall`, `Purple`, `Ride`, `01`, `02`, `04`, `07`. "Purple" and "Ride" probably match "Purple Parallelogram" and "Ride With Me" on the 2005 MP3 list (**my inference, unverified**). **"Fall…" matches no known Luxury Liners title**; it is an unidentified file (gap 7, question 6). The only archived playable file in this folder is `luxury_liners_breakaway.mp3` (2005-11-05, 200).
- **Vault implication (P29):** the playable archived audio is the four 2001 Waco MP3s, the ten album-track MP3s and "Breakaway". None of *Trunk Box*, *Live Liners* or *From The Vaults* survives as playable audio on Wayback; those need David's own files.
- **2007 band-site album pages:** `?content=album&album=88761`, `88939`, `88940`, `88941` (four albums; 88761 has 12 song sub-pages, which matches *Nonetheless*). They hold the band's own track pages and probably credits. They need a browser.

**Lead (unverified):** *Superdrag Tribute II* (Bomberpunk, 2004, sold on eBay only). The Foxymorons' site says a Luxury Liners track is on it. Neither Discogs list has it. The track title is unknown; "Baby's Waiting" is the obvious guess, and it is only a guess.

## 6. Platform ID matrix

| Release | Spotify | Apple | Bandcamp | Deezer | Tidal | YT Music | Discogs | MusicBrainz | Amazon | CD Baby |
|---|---|---|---|---|---|---|---|---|---|---|
| Sound As Ever | 6qzUYiUTCQvsgP1NbGY4lD | 529281147 | 2083883374 | 7189504 | 31180549 | MPREb_bzXGIht8w0Q | r6768612 | none (searched live) | CD B00004U073 (live); MP3 B00859ZP5I (single-source) | not found |
| Believe EP | 0b8te1vh6pqC1vcUrzmVD5 | 483219017 | 4159017568 | 1372240 | 31180579 | not resolved | r6768660 | none (searched live) | CD B000065T3A (live); MP3 B006DHAWXE (single-source) | not found |
| Overbored | 1pRDTqjcjnt4zDm9pPUaEC | 529876344 | 404979016 | 3230601 | 31180536 | not resolved | r14391955 | RG 110c4bd6… | not found by search | not found |
| Nonetheless | 05AMwlnQPNb4UpHSpIAna7 | 529282730 | 54140699 | 8406852 | 31180946 | not resolved | r14401612 | RG f45d4be4… | not found by search | not found |
| Shake It Up (Live) | 1G91ruQwVVxJezHwWFox1H | 1581823464 | none | none | 194647039 | MPREb_5KpVxToLXAJ | none | none | ? | n/a |
| Great Day | 7jEU9cDDgHh7IWUAXlJ9RF (track 5VN9RMk9n83auNJvD8FF9G, verified live) | 1870665916 | none | 902290832 | 491176925 | MPREb_S37jYFP6dDr | none | none | ? | n/a |
| New Beginning | 0r4RvQu4V4jKhSAlwBm7Fz | 1888874973 | none | 949841901 | 511031499 | MPREb_km85fvzVpxe | none | none | ? | n/a |
| SAE LP 2026 | n/a | n/a | n/a | n/a | n/a | n/a | r37658859 | none | n/a | n/a |

"?" means not checked. "Not found by search" means an amazon.com search with `curl` on 2026-10-07 returned only name collisions (books, ships); Amazon Music pages render only in a browser, so this is **not** proof of absence. Spotify, Apple and Deezer IDs in this table were all re-read live on 2026-10-07; Bandcamp, Tidal and YouTube Music IDs are from the dd reads of 2026-09-28. "CD Baby: not found" means no WebSearch hit; the UPC prefixes 635759 and 789577 were not identified as CD Baby's.

**Artist-level IDs:** official site https://theluxuryliners.com/ · Spotify artist [3416B3EOd5itWZazwzw9Qc](https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc) · Apple artist [47333263](https://music.apple.com/us/artist/the-luxury-liners/47333263) (Shazam uses the same ID: shazam.com/artist/-/47333263) · Deezer [1518436](https://www.deezer.com/artist/1518436) · Tidal [5748092](https://tidal.com/browse/artist/5748092) · YouTube "Topic" channel UCi2Kheqfw714F4v8bwBbViA · YouTube video linked from the band site: V6h-vFJfRjI (contents not identified) · SoundCloud [theluxuryliners](https://soundcloud.com/theluxuryliners) · Discogs artist [4298743](https://www.discogs.com/artist/4298743-The-Luxury-Liners) · MusicBrainz artist [7af7fd54-1d1b-4353-ab60-4b61bceed337](https://musicbrainz.org/artist/7af7fd54-1d1b-4353-ab60-4b61bceed337) · Last.fm [The Luxury Liners](https://www.last.fm/music/The%20Luxury%20Liners) · iHeart [384637](https://www.iheart.com/artist/the-luxury-liners-384637) · AllMusic [mn0000759673](https://www.allmusic.com/artist/luxury-liners-mn0000759673) (from a search result; 403 to curl, not opened) · Bandcamp: the band's albums are on David's account, daviddewese.bandcamp.com · Instagram/Facebook: theluxuryliners.

**Labels:** Echomusic (also designed and ran the band's 2000–02 site: "design • maintenance • commerce by echomusic") · Litterbug Records (Discogs label 1721608; the Luxury Liners / David Dewese label: LLCD1003, LLCD1004, then David's LLCD1005 *Make The Best Of It*; digital label for the 2026 singles) · Sound Asleep Records (Sweden, Discogs 451138) · Not Lame Recordings · Texas Music Café.

**Name-collision guard.** These are **not** this band: Emmylou Harris, *Luxury Liner* (1977 album); Gram Parsons' song "Luxury Liner" (the band's namesake; the band covered it live in October 2003, but there is no release); "Luxury Liners", the project of Carter Tanton (Spotify 6IkyFyVyUt99P1jjMllZ5m, MusicBrainz 20764777, album *They're Flowers*; Paste's "luxury-liners" artist page is probably this act); "The Liners" (Apple 522057446); the Georgia band "Luxury"; Hampton's "Luxury Liner"; cruise-ship results.

## 7. Cross-check against daviddewese.com `data/releases.json` and the live web

| Check | Result |
|---|---|
| Release set (7 LL releases) | Same seven. **Added here:** the 2026 LP as its own object (on daviddewese.com it is an edition), the Kool Kat bonus disc as an LL appearance, and the four archive items with what the CDX shows |
| Dates | Identical to dd, and **identical to live Spotify** (all 7 album pages read 2026-10-07) |
| UPCs, ISRCs, durations, platform IDs | Identical to dd. Live Apple durations equal Bandcamp's for all 44 album tracks; live Deezer UPCs and totals (3134 s, 535 s, 2183 s, 2675 s, 202 s, 364 s) match. Totals recomputed from track durations; all match |
| Labels and catalog numbers | Identical to dd and to live Discogs |
| **Corrections this round (from live Discogs)** | *Sound As Ever*: writers per track, with "Mine" by Brad Miles / Robert Reynolds / Scott Carpenter (the dd summary "release-level, no per-track split" was wrong); producers per track (Poole 1–7, 10–15; Montgomery 8–9). *Overbored*: writers per track, with "Restless" by Wilstermann (the dd summary "Dewese, most tracks" was wrong). *Believe*: The Luxury Liners added as co-producer; the cover's original writers added |
| New this round | Kool Kat track positions and durations; LP cover credit Jim Horan; Amazon MP3 album ASINs B00859ZP5I and B006DHAWXE; Amazon CD details; *Fireworks Vol. 2* writer credits; "Great Day" Spotify track ID verified |
| Removed this round | The Big Cartel store link (404; kept only as a do-not-link historical note in §3.1) |
| Still from dd only | Bandcamp IDs and dates, Tidal IDs and dates, YouTube Music browse IDs, all ISRCs except those Deezer/Apple expose (the dd values were not contradicted anywhere) |

**Hand-off to the press track (not used here):** WebSearch surfaced `musicstreetjournal.com/cdreviews_display.cfm?id=101483` and `powerpopaholic.com/?p=28851` beside Luxury Liners queries. Both are unconfirmed and unopened leads; they are not cited in this file.

## 8. Gaps (largest first)

1. **Songwriting** is not published for *Nonetheless* (Discogs re-read: no writer credits), *Great Day*, *New Beginning* and the live single. *Sound As Ever* and *Overbored* now have per-track writers, but from one source (Discogs). One *Overbored* co-writer credit is withheld under X1.
2. **Cover-art credits are unknown** for *Believe*, *Overbored*, *Great Day*, *New Beginning* and the live single. The live single also has no supplied master (P28). (*Nonetheless*: paintings Scott Carpenter, design David Dewese, photos Kristen Barlowe, single-source. *Sound As Ever*: design Mark Montgomery; LP cover credit Jim Horan, single-source.) Whether Scott also painted *Overbored* is an open question, not an inference.
3. **Personnel** for the 2021 live single and the 2026 singles is unknown, and so is whether Wilstermann plays on the *Believe* EP.
4. **Producer or studio** is missing for *Overbored* and *Nonetheless* (only engineer and mixer credits), and no studio is credited for *Sound As Ever* or *Believe*.
5. ***Trunk Box*** (9 of 11 titles), ***Live Liners*** (the November titles) and ***From The Vaults*** (everything) lack full tracklists, and **none of their audio is archived as playable files** (every *Live Liners* CDX row is 404). The Vault (P29) depends on David's own copies.
6. **Not re-readable live:** Bandcamp (challenge stub), Tidal (token), YouTube Music, Wayback, AllMusic. Their values rest on the 2026-09-28/29 dd reads.
7. An unidentified `/mp3/misc/Fall…` file (2005, 404) and misc files `01`, `02`, `04`, `07` have no known titles.
8. **Amazon Music** album pages (only MP3 ASINs for *Sound As Ever* and *Believe*), **CD Baby** and **YouTube Music** links are missing for *Believe*, *Overbored* and *Nonetheless*.
9. **MusicBrainz** has no entries for *Sound As Ever*, *Believe* or anything after 2006 (re-checked live). Discogs has none for the four digital-era singles.
10. The *Superdrag Tribute II* track is unidentified.
11. The recording dates of the two Texas Music Café live versions are unknown.
12. The LP has no durations on Discogs.

## 9. Needs a browser (blocked hosts)

| URL | Why |
|---|---|
| https://web.archive.org/web/20050321225645/http://theluxuryliners.com/history/music.html | full *Trunk Box*, *Live Liners* and *From The Vaults* tracklists |
| https://web.archive.org/web/20011212092215/http://theluxuryliners.com/albums.html | 2001 album credits; *Trunk Box* cover |
| https://web.archive.org/web/2007*/theluxuryliners.com/?content=album* (album=88761, 88939, 88940, 88941 and the em1886 song pages) | the band's own 2007 credits and track pages (a second source for the writer credits) |
| https://web.archive.org/web/20080930224438/http://theluxuryliners.com/store/cat/LuxuryLiners | 2008 store: formats and prices in print |
| https://web.archive.org/web/20030414032936/http://theluxuryliners.com/downloads/luxury_liners_onesheet.pdf | *Overbored* one-sheet (credits) |
| https://web.archive.org/web/20050425000737/http://theluxuryliners.com/lyrics.html | writer credits, if printed (a second source for §3.1 and §3.3) |
| https://web.archive.org/web/20010615001544/http://theluxuryliners.com:80/mp3/waco/luxury_liners_be_with_you.mp3 (and _blockbuster, _if_i_cry, _shake_it_up) | listen; identify the session |
| https://web.archive.org/web/20051105015937/http://theluxuryliners.com/mp3/misc/luxury_liners_breakaway.mp3 | Vault re-host candidate |
| https://daviddewese.bandcamp.com/ (each album) | re-read Bandcamp dates, credits and liner text (Bandcamp serves a challenge page to `curl`) |
| https://www.amazon.com/dp/B00859ZP5I, https://www.amazon.com/dp/B006DHAWXE and an Amazon Music search | confirm the MP3 albums; find the later titles |
| https://www.allmusic.com/artist/luxury-liners-mn0000759673 | the bio wording (see D1) and its discography list |

## 10. Discrepancies and open questions

| # | Topic | What conflicts | How it is shown now |
|---|---|---|---|
| D1 | Origin story | **Resolved by F4 (owner): David Dewese and Chad Edgington co-founded the band in 1997 in Nashville.** Historical sources differ: the 2005 band site says Chad formed it for a college talent show and David "joined" in May 1997. AllMusic says it was "originally intended as an alt-country outlet for Foxymorons member David Dewese". Discogs says it "originally formed in 1997 in Texas" | F4 wording is used. The others are recorded here as historical sources only, not quoted as the origin |
| D2 | *Sound As Ever* label | Discogs lists Echomusic **and** Litterbug; the band site (2005) says Litterbug; digital stores say Litterbug | Both, "Echomusic / Litterbug Records" |
| D3 | *Believe* EP date | Spotify, Apple and Deezer 2001-03-01 (live); Bandcamp 2001-01-21; Amazon CD 2001-03-15 | Public: 2001-03-01 (P6). Others internal only. Ask David whether January was a pre-release or show date |
| D4 | *Overbored* date | Spotify, Apple and Deezer 2003-05-01 (live); Apple track-level 2003-04-01; Discogs 2003-04-16; Bandcamp 2003-04-01; Tidal 2003-01-01 | Public: 2003-05-01 (P6). The 1st-of-month values look like distributor placeholders; Discogs' 04-16 may be the real CD date |
| D5 | *New Beginning* date | Spotify and Apple album 2026-04-17; Tidal and Apple track 2026-04-10 (live) | Public: 2026-04-17 (P6) |
| D6 | "It's You" | On both *Believe* (3:28) and *Overbored* (3:24) with different ISRCs | Two recordings, presumably. Is the 2003 one a re-recording by the new trio? Ask David |
| D7 | "Lead Me On" | **Contested.** Discogs 15436127 release notes (read live): "Track 9 is a Jetpack UK cover". Band site (2005): "Lead Me On (Jetpack)" | Shown as "Jetpack (contested)". Argument for the **Nashville** Jetpack: the LL shared Nashville bills with a Jetpack on 2002-06-07 (The End) and 2003-02-21 (dd research/04 lines 399, 407); Jetpack and the LL/Foxymorons kept sharing bills in 2005 (dd research/05 lines 304–308); David wrote in 2005 that he played music "with The Foxymorons, The Luxury Liners, and Jetpack" (dd research/04 line 285). That he was a Jetpack **member** is an **inference** from that wording, not a stated fact. A WebSearch snippet (Wikipedia, *The Nobility*) says the Nashville band "then known as Jetpack" began in 2001 (single-source). Argument for Jetpack UK: Discogs says so explicitly. Unresolved; ask David |
| D8 | "Precious" | Bandcamp "Precious" (3:19) vs Apple/Discogs "Precious To My Heart"; 3:16 on *Fireworks Vol. 3* | Album title per Bandcamp; alt title kept |
| D9 | Digital ISRC years | *Sound As Ever* and *Overbored* ISRCs are 2005 registrations; *Believe* is 2010 (USQ7J) | Shows when the digital editions were set up; not a release-date fact |
| D10 | *Antarctic Antics* | Discogs credits the band on a Scholastic read-along track, but its role is unclear. Robert Reynolds (music, producer) also co-wrote "Mine" | single-source; do not feature until David confirms |
| D11 | Waco MP3s and *Trunk Box* | They may be *Trunk Box* tracks (inference) | Recorded as unverified |
| D12 | *Sound As Ever* cover | Shows four pairs of legs, though the band was a trio in 2000 | No inference drawn. Do not caption it as a line-up |
| D13 | *Sound As Ever* track 9 "Mine" | Discogs: Brad Miles / Robert Reynolds / Scott Carpenter. Round-2 file and the dd summary implied Edgington/Dewese | Discogs per-track credit used (single-source); ask David |
| D14 | "Think She's Coming Around" writers | *Fireworks Vol. 2* (Discogs 6907226): Chad Edgington alone. *Sound As Ever* (Discogs 6768612): Edgington / Dewese | *Sound As Ever* credit used on album pages; discrepancy recorded; ask David |
| D15 | "Think She's Coming Around (Live)" | Deezer (live API) titles *Sound As Ever* track 1 "(Live)"; Apple, Bandcamp, Spotify and Discogs do not; duration 3:13 everywhere | Treated as a Deezer metadata error; not shown publicly. Ask David whether the album take is in fact a live recording |
| D16 | "Great Day": demo or new recording? | The 2008 Kool Kat demo is 3:22 on Discogs; the 2026 single is 3:22 on Spotify, Apple and Deezer | Unknown. Do not call the 2026 single "new" or "the old demo" until David says |
| D17 | "How Do I Say Goodbye" length | Discogs (CD) 4:56; Apple and Bandcamp 4:22 | Probably the CD track includes silence before the hidden tracks. Keep 4:22 for digital |
| D18 | *Overbored* track 7 writers | Discogs lists three writers; one is withheld here | Owner rule X1. The team has the specifics; nothing further is recorded in any project file |

**Questions for David (via Carly):**
1. Who played on *Great Day*, *New Beginning* and the Texas Music Café recordings, who wrote them, and when were the live ones recorded? Is the 2026 "Great Day" the 2008 demo (as is or remastered) or a new recording?
2. Did Scott Carpenter also paint the *Overbored* cover? Who designed it, and who made the *Believe*, *Great Day* and *New Beginning* covers? Is Jim Horan (credited "Cover" on the 2026 LP) the illustrator of the original *Sound As Ever* artwork? (The 2010 daviddewese.com page credits the *Nonetheless* paintings to Scott and the design to David; please confirm.)
3. Who produced *Overbored* and *Nonetheless*? Did Wilstermann play on the *Believe* EP?
4. Discogs gives these writer credits; are they right? *Sound As Ever*: Chad and David on everything except "Mine" (Brad Miles, Robert Reynolds, Scott). "Think She's Coming Around": Chad alone (on *Fireworks Vol. 2*) or Chad and David? *Overbored*: David alone on "Sunshine", "Dreaming", "Overbored", "Waiting For The Sun" and "Constellation Invitation"; Larry alone on "Restless"; Chad and David on "Woman"; David, Larry and Scott on "Fifteen Again"; Chad, David and Scott on "It's You". And who wrote the *Nonetheless* songs?
5. Do you have the *Trunk Box*, *Live Liners* and *From The Vaults* files and tracklists? Are "Be With You", "Blockbuster", "Trans-Am Mind" and "Araby" from that era?
6. Which Luxury Liners song is on *Superdrag Tribute II*? And what was the 2005 `/mp3/misc/` file that began "Fall…"?
7. Do you still sell the *Sound As Ever* CD (or any LL CD) anywhere? (The Big Cartel shop is gone.)
8. What exactly is the *Antarctic Antics* credit?
9. "Lead Me On": was it a cover of the Nashville Jetpack or of Jetpack UK?

## Sources

Local files: `daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md`; `…/data/releases.json`, `catalog-meta.json`, `release-leads.json` (line 46), `covers.json`; `…/site/data/placements.json`, `vault.json`; `…/research/01-discography.md`, `02-artist-story-and-brand.md` (line 203), `04-live-sites-and-archive.md` (§3, §5; lines 225, 248, 285, 399, 407), `05-foxymorons-history.md` (lines 304–308); `…/research/legacy/cdx-theluxuryliners.com.json`; `…/site/src/pages/bands/the-luxury-liners.astro`; `…/critiques/catalog-round2.md`, `catalog-round3.md`, `catalog-fix-round1.md`, `round4-round1.md`; `foxymorons.com/research/01-discography.md`; this project's `research/03-web-archaeology.md` (line 515).

Live reads with `curl`, 2026-10-07:
- Discogs API: [6768612](https://www.discogs.com/release/6768612), [6768660](https://www.discogs.com/release/6768660), [14391955](https://www.discogs.com/release/14391955), [14401612](https://www.discogs.com/release/14401612), [37658859](https://www.discogs.com/release/37658859), [15436127](https://www.discogs.com/release/15436127), [34741341](https://www.discogs.com/release/34741341), [22919255](https://www.discogs.com/release/22919255), [7044627](https://www.discogs.com/release/7044627), [6907226](https://www.discogs.com/release/6907226), [8057090](https://www.discogs.com/release/8057090), [9601921](https://www.discogs.com/release/9601921) (read as `api.discogs.com/releases/<id>`).
- iTunes lookup: `itunes.apple.com/lookup?id=47333263&entity=album` and `?id=<529281147|483219017|529876344|529282730|1581823464|1870665916|1888874973>&entity=song`.
- Deezer API: `api.deezer.com/album/<7189504|1372240|3230601|8406852|902290832|949841901>`.
- Spotify pages: the 7 album IDs in §6, album 4HcZ87IXLiyVui34xeLHxO, track 5VN9RMk9n83auNJvD8FF9G.
- MusicBrainz: `musicbrainz.org/ws/2/release-group?artist=7af7fd54-1d1b-4353-ab60-4b61bceed337&fmt=json`.
- Amazon: [B00004U073](https://www.amazon.com/dp/B00004U073), [B000065T3A](https://www.amazon.com/dp/B000065T3A), plus search pages.
- Wikipedia: [One Tree Hill season 1](https://en.wikipedia.org/wiki/One_Tree_Hill_season_1) (raw wikitext).
- `daviddewese.bigcartel.com` (404) and `theluxuryliners.com` (200, current one-page site).

WebSearch, 2026-10-07 (result pages surfaced; used only as leads): [Wikipedia: The Nobility](https://en.wikipedia.org/wiki/The_Nobility) (Jetpack, D7), [daviddewese.bandcamp.com](https://daviddewese.bandcamp.com/), [Shazam artist bio](https://www.shazam.com/artist/-/47333263), [Last.fm](https://www.last.fm/music/The%20Luxury%20Liners), [iHeart](https://www.iheart.com/artist/the-luxury-liners-384637), [Sound Asleep Records on Discogs](https://www.discogs.com/label/451138-Sound-Asleep-Records), [Paste: luxury liners](https://www.pastemagazine.com/artist/luxury-liners) (collision).

## Revision log

**Round 3 (2026-10-07), answering `critiques/discography-round2.md` (6.5/10):**
- **Blocking 1 fixed:** *Sound As Ever* writers re-read live from Discogs and recorded per track: Edgington / Dewese on 1–8 and 10–15; "Mine" by Brad Miles, Robert Reynolds and Scott Carpenter. Per-track producers added (Poole 1–7, 10–15; Montgomery 8–9). Mirrored on the 2026 LP (B3 "Mine"; Montgomery on B2–B3). JSON `tracklist[].writers`, `producer` and `songwriting` updated. Robert Reynolds / *Antarctic Antics* link noted (D10, question 8).
- **Blocking 2 fixed:** *Overbored* writers recorded per track from live Discogs ("Restless" by Wilstermann alone; four co-writes). The track-7 third co-writer was checked against X1 (`check-dist.mjs` X1 rule and DECISIONS X1) and is **withheld**: shown as "Edgington / Dewese (+1 further credit withheld under X1)" and named nowhere. *Believe*: The Luxury Liners added as co-producer, and the six original writers of "Believe" added.
- **Blocking 3 fixed:** Big Cartel removed from the platform IDs, from JSON `other_links` and `sources`, and from §9. It is kept only as a do-not-link historical note (404 on 2026-10-07). Question 7 reworded to "Do you still sell the CD anywhere?".
- §1 rewritten: `curl` reached Discogs, iTunes, Deezer, Spotify, MusicBrainz, Amazon, Wikipedia and theluxuryliners.com; the still-blocked list is kept. Every Spotify, Apple, Deezer and Discogs value was compared with a live read; all agreed except the credits corrected above. "Great Day" Spotify track ID upgraded to verified; LP labelled "Discogs only, read live". JSON `recheck`, `release_date_basis` and `links_checked.amazon_music` texts updated.
- Kool Kat bonus disc: positions and durations added (4, 5, 6, 7, 9) with the Discogs notes and uncredited original writers. "Great Day" demo = 3:22 = the single (D16, question 1).
- D7 reworked as **contested** (Discogs notes say "Jetpack UK"); Jetpack membership labelled an inference; the JSON archive-item wording "very probably" removed.
- Jim Horan added as the LP "Cover" credit and as a candidate illustrator for *Sound As Ever* (single-source, question 2).
- *Antarctic Antics*: ISBN moved from `upc` to `identifiers.isbn`.
- *Nonetheless* songwriting: one wording in Markdown and JSON ("not published; Discogs has no writer credits"); the presumption was dropped.
- Duration note added (Discogs one second short; "How Do I Say Goodbye" 4:56 vs 4:22).
- *One Tree Hill* air date sourced to Wikipedia; dd "CW" flagged as anachronistic.
- New from live reads: Amazon MP3 ASINs B00859ZP5I and B006DHAWXE; Amazon CD dates (internal); *Fireworks Vol. 2* writer credits (D14); Deezer "(Live)" title oddity (D15).
- CDX nit: `say_goodbye` is under `/web/mp3/waco/` (Markdown and JSON).
- Press leads (musicstreetjournal, powerpopaholic) handed to the press track, not cited.

**Round 2 (2026-10-07), answering `critiques/discography-round1.md` (7.5/10):**
- **Blocking fix:** *Nonetheless* cover credit added (paintings Scott Carpenter; design David Dewese; band photos Kristen Barlowe), from dd research/04 line 225, labelled single-source, in §3.4 and in the JSON `cover_art`. Gap 2 and question 2 updated. *Overbored* is **not** credited to Scott; question 2 now asks whether he painted it.
- §5 CDX inventory corrected against `cdx-theluxuryliners.com.json`: "Breaking Out" MP3 captured 2007-08-23 (not 2005-11-05); November 2002 *Live Liners* rows are 01, 02, 03, 05, 06, 07 (no 04), all 404; the July 2002 rows are 2021 captures, both 404. Stated that no *Live Liners* audio is archived. Added the `/mp3/misc/` rows (`Fall`, `Purple`, `Ride`, `01`, `02`, `04`, `07`, all 404) and the unidentified "Fall…" file to gaps (new gap 7) and questions. Noted the `.ram` files are pointer metafiles.
- D1 relabelled "Resolved by F4 (owner)".
- "Great Day" Spotify track ID labelled `single-source (search snippet)` in §3.6, §6 and the JSON (upgraded to verified in round 3).
- Tidal *Believe* date 2001-01-01 added to the §3.2 internal date list.
- D7 rewritten with cited evidence (dd research/04 lines 285, 399, 407; research/05 lines 304–308) and a new WebSearch lead (Wikipedia, *The Nobility*, formerly Jetpack, Nashville). Unsourced "played with in 2002–03" wording in §7 replaced.
- JSON appearance objects now carry a `tracklist` (position, title, duration where known) as well as `ll_tracks`.
- §2: the LP row says "durations not listed (data gap)".
