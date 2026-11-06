# Build log: theluxuryliners.com (track: build-skeleton)

Rebuild of the approved-then-lost skeleton, 2026-11-06. Authority order: `DECISIONS-2026-10-07.md`
(LL-1..LL-43) > daviddewese.com `DECISIONS-2026-09-29.md` > `plan/00-master-plan.md` > `research/`.
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
  credits always match the captions on Home, Story, Photos and EPK. `content/people.json`
  `photographs` is not rendered. Amy Wilstermann's credit is single-source: her 2003 promo is
  `pending` and `PENDING_CREDITS` blocks it (data gate + dist test).
- **Home blurbs** must say something particular and carry no date. At the time of writing
  `content/home.md` gives "The first of the two." for "Great Day": the build warns and uses the
  site's blurb ("Written by Chad Edgington and David Dewese, with all four forever members
  playing."). Question for the copy track.
- **YAML**: `story/01`, `story/04`, `story/05` and `sound-as-ever-name.md` have front matter that is
  not valid YAML in their `sources` blocks (e.g. `claim: "College friend" wording`). The importer
  drops the internal blocks and reads the public keys, with a build warning. Question for the copy track.
- `content/home.md` body repeats the one-liner and status line; the home page uses the front-matter
  fields only.

Cross-track flags (not changed here; for the copy critic): `content/` credits the *Nonetheless*
cover paintings to Scott Carpenter; that credit is not in LL-23 and rests on the 2010
daviddewese.com discography page (single-source). `data/artwork.json` keeps it `pending`, so the
release page does not print it, but the copy track's People, Facts and bios do.

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
| Privacy (LL-7, plan §2.3) | check-dist refuses e-mail addresses, mailto:, "Mesquite", "lives in", phone numbers, the family page, "Baptist Standard", dead hosts as links. The contact address is only a Worker secret |

## Legacy URLs (`data/legacy-urls.json`, 675 rows)

315 redirect sources (query strings stripped; several `/go/?…` rows collapse into one), 288 paths
answer 410, 9 query redirects in the Worker (`run_worker_first` for `/` and `/index.php`), bot and
plugin probes, `/.well-known/` and `/cdn-cgi/` left as 404. No chains; every internal target is
checked to exist in `dist/`. Targets not in v1.0 fall back to the nearest existing page: 33 journal
months → `/vault/journal/` (they move to their month automatically once a month is published,
LL-25); `/vault/news/`, `/vault/trunk-box/`, `/vault/live-liners/` → `/vault/`; `/lyrics/` →
`/music/overbored/` (the old lyrics page held the Overbored lyrics). `/sitemap.xml` → 301 to
`/sitemap-index.xml`. `/ethan.html` → `/` only (private family page). Nothing is re-hosted (LL-27).

## RELEASE mode

`RELEASE=1 node scripts/check-dist.mjs` (and `npm run build:production`) also fails on PLACEHOLDER
copy and on missing keys (`PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CF_ANALYTICS_TOKEN`). Verified:
with dummy keys and today's `content/` it passes; with `CONTENT_DIR=/nonexistent` it fails on 13
PLACEHOLDER blocks (Story, EPK) while the normal checks and axe still pass on the fallback site.

## Verification (2026-11-06)

`npm ci && npm test`: data PASS; unit 28/28 (helpers, Worker contact/routing/MIME, LL-3, built-page
rules); dist PASS (check-dist + `content/check-content.mjs --dist-only`: 0 errors); jsonld PASS
(29 pages); axe 112/112 (28 pages × 1280/375 px × JS on/off; no horizontal scroll at 375 px).
`wrangler deploy --dry-run` bundles the Worker. Screenshots of home, a release page and People
checked by eye at 1280 px.

## Open / next

- Copy-track questions above (Great Day blurb, YAML in four files, the Nonetheless cover credit).
- Design direction: replace the tokens at the top of `src/styles/global.css`.
- Hosting setup: Turnstile keys, `CONTACT_TO`, Email Routing, analytics token, Decap `base_url`.
- The journal months (LL-25), `/vault/news/`, Trunk Box / Live Liners pages when material clears.
- Contrast/reflow/motion suites beyond axe, Pa11y and Lighthouse are not ported yet (plan §7.4).
