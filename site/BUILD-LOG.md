# Build log: theluxuryliners.com (track: build-skeleton)

Rebuild of the approved-then-lost skeleton, 2026-11-06. Authority order: `DECISIONS-2026-10-07.md`
(LL-1..LL-45) > daviddewese.com `DECISIONS-2026-09-29.md` > `plan/00-master-plan.md` > `research/`.
Nothing is deployed.

## What exists

| Area | Files | Notes |
|---|---|---|
| Astro site (static, trailing slashes, one folder per page) | `astro.config.mjs`, `src/` | Astro ~7.3.5 (as daviddewese.com), sitemap integration, no inline scripts or styles |
| Pages (plan §5.1, v1.0) | `src/pages/` | `/`, `/story/`, `/music/`, `/music/<7 releases>/`, `/music/appearances/`, `/people/`, `/facts/`, `/press/`, `/shows/`, `/photos/`, `/vault/`, `/vault/mp3s/`, `/vault/covers/`, `/vault/journal/`, `/epk/`, `/listen/`, `/contact/`, `/contact/sent/`, `/accessibility/`, `/privacy/`, `/404`, `/410/`, `/llms.txt`, `/robots.txt`, sitemap, `/admin/` (Decap) |
| Release pages | `src/lib/releases.ts`, `src/pages/music/[slug].astro` | Generated from the master `data/releases.json` (LL-3). Writers LL-14 (overrides: Nonetheless = David; Great Day / New Beginning = Chad and David; Duke Of Gloucester = David). Cover credits LL-23 (`data/artwork.json`). Month-and-year dates. Believe EP and the live single carry "Writers as Discogs credits them" (single-source, attributed in the sentence) |
| Content import | `src/lib/content.ts`, `src/lib/views.ts`, `src/lib/copy.ts` | Reads the copy track's `content/` (see below); falls back to `site/data/*.json` and PLACEHOLDER blocks. `CONTENT_DIR=/path` overrides |
| Data | `data/*.json` | people, photos, artwork, press, shows, facts, vault, story (fallbacks + the build's own gates), `image-sizes.json` (generated) |
| Images | `scripts/prepare-images.mjs` | sharp: JPEG + WebP at 3 widths, metadata stripped; covers from `assets/source/covers` (LL-30: live single from the 3000 px Apple copy). Logos: viewBox crops of `assets/derived/logos/*.svg`, artwork byte-for-byte (never redrawn); favicon.svg/.ico from the red roundel |
| JSON-LD | `src/lib/jsonld.ts` | MusicGroup (home, People, Facts), WebSite, WebPage on every page, MusicAlbum per release, FAQPage on Facts (visible answers only) |
| Worker | `worker/`, `wrangler.jsonc` | `/api/contact` (Turnstile, honeypot, origin/Sec-Fetch-Site, size cap, rate limit, send_email to the `CONTACT_TO` secret), 410s, old query-string redirects, staging noindex. Bundles with `npm run worker:check` (wrangler dry run, verified) |
| Redirects | `scripts/build-redirects.mjs` → `dist/_redirects`, `worker/gone.ts` | From `data/legacy-urls.json` after the build |
| Headers | `worker/headers.ts`, `scripts/build-headers.mjs` → `dist/_headers` | One CSP for static and Worker responses; `/admin/*` gets its own |
| Analytics | `src/layouts/Base.astro` | Cloudflare Web Analytics beacon only when `PUBLIC_CF_ANALYTICS_TOKEN` is set at build |
| Decap CMS | `public/admin/` | Story chapters, home, EPK bios, photo records; editorial workflow; `base_url` set at hosting setup |
| Checks | `scripts/validate-data.mjs`, `scripts/check-dist.mjs`, `scripts/check-jsonld.mjs`, `tests/` | `npm test` = build + data, unit, dist (+ `content/check-content.mjs --dist-only`), jsonld, axe |
| Handbook | `docs/HANDBOOK.md` | Setup, Cloudflare, Turnstile, analytics (Search Console, Bing), editor, release build, rollback, redirects |

## Content import (the copy track's `content/`)

`content/` appeared while this track was building (parallel copy track). The site reads:

| content file | used for | fallback |
|---|---|---|
| `home.md` front matter | status line, single blurbs, members list, "Larry" line, disambiguation | `src/lib/site.ts`, `BLURBS` |
| `story.md` + `story/NN-*.md` | Story intro, chapter titles, years, narrative | `data/story.json` facts + PLACEHOLDER |
| `facts.json`, `facts.md` | Facts Q&A, FAQPage, dating note | `data/facts.json` |
| `people.json`, `people.md` | members, early/guest players, records, cover art | `data/people.json`, `data/artwork.json` |
| `press.json` | coverage, TV placements | `data/press.json` |
| `shows.json` | the shows table | `data/shows.json` |
| `covers.json` | `/vault/covers/` (LL-29) | `data/vault.json` |
| `epk.md` | the three bios (`## Short bio` …) | PLACEHOLDER |

Only public fields are read; `source`, `confidence`, `contested`, `notes_internal`, `held` and
`"publish": false` records never render. Gates the build applies whatever a copy file says:
- **Photographers on /people/** come only from the photos the site shows (`data/photos.json`), so
  credits always match the captions on Home, Story, Photos and EPK, and their years are the years
  of those photos. `content/people.json` `photographs` is not rendered. Amy Wilstermann is credited
  on the 2003 shoot since LL-45 (see "Design C" below).
- **Home blurbs** render the copy track's value exactly; `null` renders no blurb. A thin, padded,
  track-list-only or dated blurb fails the build (`blurbProblem`); the site never substitutes its own.
- **YAML**: `story/04` and `story/05` still have front matter that is not valid YAML in their
  `sources` blocks. The importer drops the internal blocks and reads the public keys, with a build
  warning. Question for the copy track.
- `content/home.md` body repeats the one-liner and status line; the home page uses the front-matter
  fields only.

**Cover credits** are gated by `data/artwork.json` whatever a copy file says: a release whose
credit is `pending` there gets no row in People › Artwork (`PENDING_COVER_SLUGS`), and check-dist
fails on the pending name next to "painted"/"cover art"/"the cover", or "painted" next to the
release title, on any page, in llms.txt or in JSON-LD (round 2).

**Members**: `src/lib/members.ts` is the one source for the four forever members' roles and years
(content/people.json, else data/people.json) used by home, /people/, the MusicGroup JSON-LD
(`roleName` = the roles without "co-founder", which is the `founder` property) and llms.txt.

## Owner decisions and the lost run's critic notes: how each is met

| Item | How |
|---|---|
| LL-6 one-liner verbatim | `ONE_LINER` in `site.ts` (curly quotes); check-dist requires it word for word on home (quote glyphs normalised); JSON-LD `description` checked exactly; default meta description |
| LL-17 wording exactly | `NEVER_BROKE_UP`; check-dist fails on "reconnected" anywhere outside the exact sentence |
| LL-13 | no talent-show text; "Great Day" never near "demo"/"2008" (check-dist); the 2008 bonus disc is not listed on /music/appearances/ at all (its Discogs page lists the demo) and its Discogs id 15436127 fails the build; "Great Day"/"New Beginning" left off the old-MP3 list |
| LL-27 no MP3s | no audio files or `.mp3` links (check-dist, dist test); old MP3 URLs 301 to `/vault/mp3s/`; the word "download" avoided (copy checker) |
| `/vault/mp3s/` | titles only; each links to the release page where it streams, else nothing; intro points to /listen/; never "not released" (dist test) |
| LL-29 | `/vault/covers/`, title + original artist; "Lead Me On" held (which Jetpack is contested) |
| LL-39, LL-40 | colophon "The band's logos date from 1999–2002"; no newsletter; both checked |
| LL-41 | robots.txt `Allow: /` for all; llms.txt |
| LL-5, LL-9 JSON-LD | `foundingDate` 1997, `foundingLocation` Texas (no town), founders David (`daviddewese.com/#person`) and Chad; members the four forever members with **no endDate** (LL-9 supersedes plan §8.2's Chad endDate 2001: the four are the band today; Chad's 2001 departure is in the Story and Facts) |
| sameAs and Bandcamp | Allow-list of plan §8.3 (Spotify, Apple, YouTube, Instagram, Facebook (LL-36), MusicBrainz, Discogs, Deezer, Tidal). **Bandcamp is not in sameAs**: daviddewese.bandcamp.com is David's account (LL-36), so as `sameAs` it would assert the band entity *is* David's page; it is linked from /listen/ and as each album's `sameAs`/listen link instead (plan §8.2). AllMusic, Last.fm, Wikidata wait for the human check / creation. check-jsonld refuses any Bandcamp URL in the band's sameAs |
| People › Artwork names the release | each credit is "<release link>: <credit>" (dist test) |
| No doubled parentheses; no "Photo: Cover art" | covers never use the photo component; check-dist + dist test |
| Photo credits consistent; Amy Wilstermann pending | see "Content import" |
| No Discogs link for the 2008 bonus disc row | the row is dropped entirely (stricter; the copy checker forbids naming the disc) |
| `/shows/` notes, null venue, partial dates | `where()` joins only non-empty parts; rows sort by an ISO key padded with 00 (content `sort_key`, or `sort` in the fallback); unit + dist tests |
| Privacy page describes what ships | analytics paragraph only when the beacon is built in, Turnstile paragraph only when the widget is; no embeds, cookies or storage exist; dist test compares page and build |
| LL-3 test stub | `scripts/compare-releases.mjs` + `tests/unit/ll3-sync.test.mjs`: compares shared fields with daviddewese.com's `data/releases.json` (passes today; skipped where the file is absent; `DD_RELEASES` overrides) |
| No sourcing notes in public copy | check-dist refuses "as credited on", "Source:", "per the 2005 site"; single-source facts carry attribution in the sentence ("Discogs lists…") |
| Privacy (LL-7, plan §2.3) | check-dist refuses e-mail addresses, mailto:, "[the founding-story town]", "lives in", phone numbers, the family page, "[a later-life profile]", dead hosts as links. The contact address is only a Worker secret |

## Legacy URLs (`data/legacy-urls.json`, 675 rows)

315 redirect sources (query strings stripped; several `/go/?…` rows collapse into one), 288 paths
answer 410, 9 query redirects in the Worker (`run_worker_first` for `/` and `/index.php`), bot and
plugin probes, `/.well-known/` and `/cdn-cgi/` left as 404. No chains; every internal target is
checked to exist in `dist/`. Targets not in v1.0 fall back to the nearest existing page: 33 journal
months → `/vault/journal/` (they move to their month automatically once a month is published,
LL-25); `/vault/news/`, `/vault/trunk-box/`, `/vault/live-liners/` → `/vault/`; `/lyrics/` →
`/music/overbored/` (the old lyrics page held the Overbored lyrics). `/sitemap.xml` → 301 to
`/sitemap-index.xml`. `/[the private family page]` → `/` only (private family page). Nothing is re-hosted (LL-27).

## RELEASE mode

`RELEASE=1 node scripts/check-dist.mjs` (and `npm run build:production`) also fails on PLACEHOLDER
copy and on missing keys (`PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CF_ANALYTICS_TOKEN`). Verified:
with dummy keys and today's `content/` it passes; with `CONTENT_DIR=/nonexistent` it fails on 13
PLACEHOLDER blocks (Story, EPK) while the normal checks and axe still pass on the fallback site.

## Verification (2026-11-06)

`npm ci && npm test`: data PASS; unit 35/35 (round 2) (helpers, Worker contact/routing/MIME, LL-3, built-page
rules); dist PASS (check-dist + `content/check-content.mjs --dist-only`: 0 errors); jsonld PASS
(29 pages); axe 112/112 (28 pages × 1280/375 px × JS on/off; no horizontal scroll at 375 px).
`wrangler deploy --dry-run` bundles the Worker. Screenshots of home, a release page and People
checked by eye at 1280 px.

## Round 2 (critiques/build-skeleton-round1.md, score 7)

| Critique item | Fix | Guard |
|---|---|---|
| 1 (blocking) *Nonetheless* painting credit printed on People, Story, Facts (+FAQPage), EPK | copy track now holds it (`publish: false`, rewritten ch. 7, Facts, EPK); the build drops any cover row whose release is `pending` in `data/artwork.json` | check-dist rule per pending artwork row (raw, so JSON-LD and llms.txt too); dist test |
| 2 (blocking) LL-9: Chad "1997–2001; on the 2026 singles" on People and llms.txt | one members source; Chad "1997–2001, and again today" (People, llms.txt, fallback data); llms.txt gives "(<year> to today)" for the others | dist test on /people/ and llms.txt |
| 3 cover captions | "Cover art: David Dewese, from a photo by Mark Montgomery."; rights line is plain "All rights reserved by the rights holders." | dist test: "Cover art" once per release page |
| 4 `/vault/mp3s/` "Shake It Up (live): on Believe EP" | every row reads "the song is on …" (an old demo or live MP3 is not the album recording) | dist test |
| 5 `/shows/` "Ohio and Michigan, Ohio and Michigan" | `where()` drops the place when the venue contains it or ends with one of its parts | unit tests (incl. "The Canada Club, Toronto, Canada" kept); check-dist "place repeated" |
| 6 no space before photo credits | `Photo.astro` emits a space; the credit ends with a full stop | dist test |
| 7 unread Wayback links on `/vault/` | not rendered; kept in `data/vault.json` as `wayback_unchecked` until the human browser pass (plan §11) clears each | check-dist fails on any web.archive.org link |
| 8 Turnstile skippable via Sec-Fetch-Site | `REQUIRE_TURNSTILE="1"` Worker var closes the no-token path; handbook §9 item 5 records the spam route and the switch | unit test |
| 9 roles differ home / People / JSON-LD | `members.ts` (above) | dist test compares all three |
| 10 Gary Ishee years | early players render the years after the first role only: "several shows, 2004–05; guitar on *Nonetheless*" | dist test |
| 11 "address since 1998" | "has been at theluxuryliners.com since at least 2000" (1998 is only the registration) | dist test |
| 12 privacy "keeps nothing in your browser" | with Turnstile built in, the page says the contact-page check, run by Cloudflare, may keep a little data in the browser | existing privacy test (paragraphs follow the build) |
| 13 "catalogue" warning | dropped from the British-spelling warning: an accepted US spelling, and here part of a shop's own description ("shop catalogue listing") | none needed |

## Open / next

- Copy-track question above (YAML in two story files). B10: if Carly confirms the *Nonetheless*
  cover credit, set it to `publish` in `data/artwork.json` and `publish: true` in content/people.json.
- Hosting setup: Turnstile keys, `CONTACT_TO`, Email Routing, analytics token, Decap `base_url`.
- The journal months (LL-25), `/vault/news/`, Trunk Box / Live Liners pages when material clears.
- Contrast/reflow/motion suites beyond axe, Pa11y and Lighthouse are not ported yet (plan §7.4).

## Design C "Roundel" applied (LL-44, 2026-11-06)

Ported from `design/samples/c-roundel/` (approved, `critiques/design-c-round1.md`, 8.0) to every
page type. Screenshots: `design/roundel-applied/` (home, Overbored, Story ch. 4, People at 1440 px
light and 375 px dark; `overview.png` at deviceScaleFactor 2), made by `scripts/screenshots.mjs`
with every off-site request blocked (0 attempted).

| Part | Where |
|---|---|
| Tokens, light and dark themes, type, components | `src/styles/global.css` (sample palette and contrast figures unchanged; dark also follows `prefers-color-scheme` without JavaScript) |
| Fonts (Archivo, Archivo Black, OFL, self-hosted) | `public/fonts/` (+ licences) |
| Logo sprite, paths verbatim from the masters | `public/art/sprite.svg` (copied from the sample; dist test compares every `d` with `assets/derived/logos/`) |
| Theme set before paint; switch, video facade, cut-out jump | `public/js/theme.js`, `public/js/site.js` (external files; the CSP still allows no inline script) |
| Header (roundel + wordmark, nav, "Dark theme" toggle: aria-pressed only, hidden without JS) and footer (white roundel, links, colophon) | `src/layouts/Base.astro`, `src/components/Footer.astro` |
| Roundel motifs | `Dot`, `SecHead`, `PageHead`, `Listen` (pills), `YouTube` (facade), `Cutout` (the c. 2000 cartwheel cut-out from the sample, `public/art/`) |
| Templates | home (sky hero with the full mark as h1, singles, red collage, members, doors); release page (cover, factline, red-oval tracks, credits, red press band, video, pager); Story index + **one page per chapter** at `/story/<slug>/` (red chapter head with the record cover or photo, drop cap, record card aside, chapter list + pager); People, Facts, Press, Shows (stacked table on phones), Photos, Music, Compilations, Vault, MP3s, Covers, Journal, EPK, Listen, Contact, Accessibility, Privacy, 404, 410 |

Critique design-c round 1 fixes: M1 the Overbored video block is about "Equasue" only (no TV copy;
dist test); M2 the collage leads with the 1998 suits and the coats frame fills the left column (no
red hole); M3 no video poster (plain roundel facade), one 2003 photo on Overbored, each single's
cover at most twice on home; m1 "Chad had left Nashville in March 2001"; m2 the unused Hard Rock
image is not shipped; m3 the theme switch is in the header; m4 chapter cards align on fixed rows;
m5 nav "Music" goes to `/music/`. The YouTube facade loads nothing until pressed, then
youtube-nocookie.com only (`frame-src` added to the CSP). Privacy now describes the theme memory
(localStorage) and the click-to-load video; Accessibility mentions the themes and reduced motion.

Should-fix items from the last critiques:

| Item | Fix | Guard |
|---|---|---|
| Home blurbs thin/padded (skeleton r2 #1, copy r3 B-1) | content's value or nothing; `content/home.md` New Beginning blurb set to `null` (it was only a track list) | build error on a bad blurb; dist test compares the card with the content |
| /photos/ order (skeleton r2 #3) | `sortPhotos()` by year within each era (also People photographers) | dist test |
| Curly quotes (skeleton r2 #4) | `src/lib/typo.ts` curls quotes in all copy, titles from releases.json and covers; the LL-6 one-liner is now byte for byte as approved (straight 'Luxury Liner') everywhere, JSON-LD and llms.txt included | dist test (no straight quote in visible text outside the one-liner); `content/check-content.mjs --dist` rule `one-liner-bytes` (+3 self-test probes); check-dist home check no longer folds quotes |
| Empty Where cell, March 2001 (skeleton r2 #5) | "Place not recorded" | dist test |
| "If I Cry" (skeleton r2 #6) | `appearance` in `data/vault.json` → `/music/appearances/#ll-appearance-1998-nashpop` | validate-data + dist test |
| Mark Montgomery years (skeleton r2 #7, copy r3 S4) | `content/people.json` 2000–2002 (both rows); photographers' years computed from the dated photos | dist test |
| EPK logo links (skeleton r2 #8) | "Roundel wordmark (SVG)" etc.; photo links carry the caption | dist test |
| shows.json sort keys (copy r3 S2) | Zanies `1997-09-00`; late September `2001-09-25` | dist test (Zanies datetime) |
| Facts chad-2001 (copy r3 S5) | "In March 2001. His last show with the band was that month too." | dist test |
| Amy Wilstermann (LL-45) | credited "Photo: Amy Wilstermann" on the 2003 shoot: `overbored-promo-2003` published, `recesses-2003` added (Overbored page, collage, EPK, Photos, People › Photographers "(2003)"); `PENDING_CREDITS` emptied | dist test: every mention is a credit line or the People row, and no text ties her to anyone |

**Journal quotes removed pending David's approval (LL-25).** These lines from the band's 2001–04
journal had not had the privacy pass; the quotes are gone and the facts stay, paraphrased. For
David to approve (or not) when the months are reviewed:

| Where | Quote removed | Now reads |
|---|---|---|
| /shows/, 2001-08-12, 12th & Porter | "The new three piece configuration." | One of the first shows as a trio. |
| /shows/, late September 2001, Ohio and Michigan | "We lost a little money." | The first trip out of the region. |
| /shows/, 2002-05-31, House of Blues, Las Vegas | "All of nevada was rocked last friday night." | A conference showcase. |
| /shows/, mid-June 2003 | venue "“Our detroit tour”" | A Detroit tour |
| /shows/, 2003-02-20 | "Part of “three shows in one week”." | Part of three shows in one week. |
| Story ch. 4 (`content/story/04-believe.md`) | “the new three piece configuration” | By August the band was playing as a three-piece. |
| Story ch. 5 (`content/story/05-journal-years.md`) | “all of nevada was rocked last friday night” | (sentence ends at the showcase) |

Both story files record the held quotes in their `held:` blocks; a dist test keeps them off /shows/
and the Story.

Tests changed with owner decisions, not weakened: the Amy Wilstermann test now checks LL-45 (credit
present on the 2003 photos, nothing more); the home-blurb test now checks the content's value or
nothing; the collage test counts figures inside the collage. Added: `tests/dist/design.test.mjs`
(14 tests); axe now runs in both themes (light and dark, JS on and off, 1280 and 375 px) plus a
320 px reflow pass in both themes, and checks that the dark scheme really renders dark; check-dist
skips only its "null as text" rule for the two OFL licence files ("null and void").

Verification (2026-11-06): `npm run build` + `node tests/run.mjs`: data PASS; unit + dist tests
PASS (pages 23, design 14, unit); dist PASS (check-dist 0 errors; content checker `--dist-only` 0
errors, 13 deliberate warnings); jsonld PASS (38 pages); axe 370/370 (37 pages × 8 contexts, 0
violations, no horizontal scroll at 375 or 320 px). `RELEASE=1` check-dist fails only on the two
missing keys. `content/check-content.mjs`: 0 errors; self-test 45/45.

## Round 1 audits: fixes (2026-11-06)

Reports: `critiques/audit-{a11y,copy,security,design,qa,seo-geo}-round1.md`. Owner decisions applied:
LL-44 (design C "Roundel"), LL-45 (Amy Wilstermann credited for the 2003 photos, credit line only).

### Blocking

| Finding | Fix | Guard |
|---|---|---|
| a11y B1: the statement claimed axe runs on every build and that links are underlined | `build:production` now runs `node tests/run.mjs axe`; the statement says "before each release", "links in running text are underlined", and has a review date, a status (partially conforms, WCAG 2.2 AA) and known limitations; "works without JavaScript" is qualified when Turnstile is built in | dist test `a11y B1` |
| a11y B2 / qa S4: unstated rules, no client checks, errors on a bare page that lost the text | rules stated on the page ("All fields are required", "(required)" on each label, the name and message rules); `public/js/contact.js` validates on submit (error summary with links, focus, `aria-invalid`, messages tied with `aria-describedby`, input kept) and sends with fetch (JSON errors shown the same way); the Worker answers a refused no-JS post with the built `/contact/` page, errors filled in and the visitor's text put back (`fillForm()`); a nickname in quotes (David "Larry") is now a valid name; the topic starts on an empty "Choose a topic" | unit tests (fillForm, JSON errors, nickname); browser suite `tests/browser/behaviour.mjs` |
| copy B1/B2: Discogs sourcing notes | vinyl line reworded; both "Writers as Discogs credits them" notes deleted | `check-content --dist` rule `source-sentence` (a visible sentence naming Discogs, Wayback or Flickr outside a link; 3 self-test probes); dist test |
| security B1: private literals in the public repository | one hashed matcher, `content/private-literals.mjs`, used by `check-content`, `check-dist`, the dist tests and `validate-data` (the Python sample checkers carry the same hashes); plain regexes removed; docs, data, research and critiques redacted (`[the founding-story town]`, `[a later-life profile]`, `[a college]`, `[the private family page]`, `[the contact address]`); the Flickr record's title, description and era made neutral; the five legacy rows that name the family page or its images moved to the git-ignored `data/private/legacy-urls.private.json` (merged by `build-redirects` when present; the generator writes them there), and three asset leads to `data/private/assets.private.json`; two more family-name hashes added | `check-content --repo` (every tracked file, also with regex escapes removed) in `npm test` as suite `repo`; `validate-data` refuses a private literal in `legacy-urls.json` |
| design B1: no cover-rights line on home and /music/ | "Cover art: all rights reserved by the rights holders." in `.foot__meta` on every page | dist test: every page with `/img/covers/` carries it |

Also found and fixed: the root `.gitignore` line `dist/` ignored `site/tests/dist/`, so `design.test.mjs`
(round 2) was never committed. `!site/tests/dist/` re-includes the folder; both test files are now
in the repository.

### Should fix: done

- **SEO.** S1 typed `MusicGroup` reference with its name everywhere, an `album` list on the band,
  `byArtist` and `inAlbum` on every recording; S2 band-level `location` Nashville, TN (never per
  member); S3 "Echomusic / Litterbug Records" is two `Organization`s; S4 this site's `sameAs` adds
  `https://daviddewese.com/bands/the-luxury-liners/` (the other half is for daviddewese.com's own
  process: its band reference should point at `https://theluxuryliners.com/#band`); S5 1200x630
  card images (`public/img/cards/`, from `prepare-images`), `og:image:alt/width/height` and
  `twitter:image:alt`, the summary card for square covers; S6 a 120–155-character `description`
  per chapter (content/story), the chapter's own photo or cover as its card, titles like
  "Overbored (2003): the story, chapter 6"; S7 `llms.txt` has a last-updated date, every section
  with a description, the chapters and the Facts Q&A; S8 Facts `<dt>` ids from `content/facts.json`;
  S9 no canonical or `og:url` on noindex pages; S10 the uncredited-photos line is content
  (`content/people.md`), "from the band's own collection"; S11 a short title tag and description
  for the live single, a fuller description for Compilations.
- **Accessibility.** M1 forced-colours block (knob in CanvasText/Canvas, wordmark in CanvasText)
  and a forced-colours browser test; M2 the knob has a ring in the page colour (3:1+ in both
  themes); M3 "New Beginning on Spotify"; m1 iframe title "“Song” on YouTube (video player)";
  m2 cover alt texts describe the art; m3 stacked table cells show their column names and
  `<time datetime>` is no more precise than the text (Zanies is `1997`; the sort key is unchanged);
  m4 `.people` uses `minmax(0, 1fr)`, the story grid an em breakpoint and a capped text column,
  long names wrap at 200% text; m5 the home h1 has visually hidden text and the SVG is hidden;
  m6/design S3 no `overflow-wrap: anywhere`: big headings are size containers and `fit-N`
  classes (src/lib/typo.ts) size the longest word to the column; long titles step down.
- **QA.** S1 `safeDecode()` (malformed escapes give a 404, not a 500); S2/security S4 the rate
  limit runs right after the content-type and size checks; S3/security S1 `REQUIRE_TURNSTILE="1"`
  in production vars, and a token-less post is refused whenever `TURNSTILE_SECRET` is set unless
  `ALLOW_NO_JS_CONTACT="1"` (owner opt-in); S5 tests for hostname and action mismatches, a
  siteverify failure, a missing secret, `respond()` (404, 410, fallback, query redirects) and the
  staging path; S6 the test server never crashes on a missing `404.html` or a bad escape;
  M1 as SEO S9; M3/M4 `fetchpriority="high"` on the page's main cover, the first images on
  /photos/ and /music/ eager, `sizes` matched to the rendered widths; M5 a WebP copy is offered
  only when it is smaller than the JPEG (`four-2002`'s is not); M6 empty first topic.
- **Security.** S2 a top-level try/catch returns a 500 page with the security headers; S3 staging
  responses get the security headers too (Cloudflare Access for staging is in the handbook, §8);
  S5 `/admin/*` uses `Cross-Origin-Opener-Policy: same-origin-allow-popups`, and the handbook
  requires the OAuth helper to `postMessage` to the site origin with the narrowest scope; S6 the
  Decap script has an SRI hash and `crossorigin`, `ADMIN_CSP` allows only that file and adds
  `object-src 'none'` and `base-uri 'self'`; S7 `.github/workflows/ci.yml` (`contents: read`;
  `npm ci`, `npm test`, `check-content --dist`; uses the runner's own Chrome) and branch
  protection for `main` documented (handbook §11); S8 `browsing-topics=()`, `payment=()`,
  `usb=()`, HSTS `includeSubDomains`, `X-Frame-Options: DENY`, and the handbook tells operators
  to turn off Rocket Loader, Email Obfuscation and automatic analytics injection. Minor: `remoteip`
  only when Cloudflare gives one; the stale test reference in `mime.ts`; `www` added to
  `CONTACT_HOSTNAMES`; the contact address redacted from the critiques.
- **Copy.** "Mike Poole recorded both bands’ first albums" (daviddewese.com credits him as
  recorder on *Calcutta*; David can restore "produced" if he prefers); "Precious To My Heart …
  listed there as “Precious”"; ch. 9 summary "A 1998 live recording released in 2021, and two
  singles in 2026."; /vault/mp3s/ also links the 2021 live single without saying it is the same
  take; "Powder-blue suits about 1998" everywhere (alt texts too); the second Larry line removed
  from home; EPK "1997 in Texas … based in Nashville from May 1997"; Facts labels add Sound Asleep
  Records; "Six compilations"; the Billboard row no longer repeats itself; member years read
  "1997 to today" on both pages.
- **Design.** S1 below 700 px the latest single comes before the one-liner and the lockup is
  190 px wide; under 480 px the theme switch shows only its knob (label kept for screen readers);
  browser test: the New Beginning cover starts on the first screen at 375x667. S2 the 2002 photo
  is the collage's two-thirds anchor (12-column grid), small frames two-up from 480 px. S4 the
  video facade is capped at 640 px with an edge in dark. Polish: page-head rule written in
  `PageHead.astro` (Vault children red, Compilations sky); /music/ "Also" cards on a grid (dot and
  title on one row, text at the card edge); members in sentence case on home, People, JSON-LD and
  llms.txt ("Co-founder. Guitar, bass, …"), no name linked on either page, years beside the name;
  scan borders trimmed by per-photo `trim` boxes in `data/photos.json` (four photos); portrait
  photos span two rows on /photos/ with dense packing; Overbored press dated, "Review of
  Overbored" shortened to "Review", place outside the italic title, "More press" left-aligned;
  space above NOTES; the factline separator trails each item; long release titles step down;
  ch. 4 record card and home single cards show Tidal and Deezer; home cards show the exact
  release date; Jim Horan's line no longer repeats 2026.

### Skipped, with reasons

- **Copy, LL-25 (journal-derived show details on /shows/ and ch. 5):** I cannot record an
  approval David has not given, and holding every 2001–04 row would empty /shows/ and ch. 5 on
  my own judgment. LL-25 governs publishing the journal months in the Vault; the derived facts
  (dates, venues, paraphrased notes; the quotes were already held last round) stay until David
  answers. Listed under "Owner decisions needed".
- **SEO S4, daviddewese.com side:** that repository has its own process; not edited from here.
- **Design S4 poster crop:** chose the other two fixes the audit offered (640 px cap, an edge in
  dark) rather than a new poster image.
- **Design polish 3, roundels on People:** People keeps its list beside the 2002 photo; names,
  roles and years now match home in wording and style.
- **Design polish 13, "Two tracks" line:** the card already lists the record's kind and date;
  not added.
- **Tests changed (not weakened):** the "Cover art once" test now counts inside `<main>` and
  separately checks the footer line once; the Zanies test checks the first row and
  `datetime="1997"` (the old assertion pinned the over-precise value a11y m3 asked to fix); the
  /shows/ regexes accept `<td data-label>`; the legacy test checks every private row goes home
  through the hashed matcher instead of a plain file name; the "good message" Worker test opts in
  with `ALLOW_NO_JS_CONTACT`, and new tests prove a token-less post is refused otherwise.

### Owner decisions needed

1. **Private literals already in public history** (security B1): accept them, approve a history
   purge (`git filter-repo`, which needs a force-push and invalidates clones), or make the
   repository private. Nothing in the current tree names them.
2. **`DECISIONS-2026-10-07.md`**: LL-4 names the founding-story town and the LL-31 row names the
   contact address. Only the owner edits that file; `check-content --repo` exempts it
   (`REPO_EXCEPTIONS`) until it is reworded.
3. **LL-25**: approve (or hold) the journal-derived details on /shows/ and in Story ch. 5.
4. **Contact without JavaScript**: production now requires Turnstile. To accept no-JS messages
   again, set `ALLOW_NO_JS_CONTACT="1"` and drop `REQUIRE_TURNSTILE`.
5. **GitHub**: turn on the branch protection described in handbook §11; **Cloudflare**: put
   staging behind Access (handbook §8).

Verification (2026-11-06): `npm test`: data, unit, dist, jsonld, repo and axe all PASS (axe
370/370; behaviour 200/200). `node content/check-content.mjs --dist dist`: 0 errors.
`node content/check-content.mjs --repo`: 0 errors. `--self-test`: all checks passed.
