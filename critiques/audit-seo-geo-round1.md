# Audit: SEO and GEO authority, round 1

Date: 2026-11-06. Auditor: independent, harsh. Lens: titles, meta descriptions, canonicals, sitemap,
robots (LL-41), JSON-LD, `llms.txt`, Facts page, internal linking, OG/Twitter images, redirects and
410s, lang, headings. Site files were not edited.

**Score: 8.0 / 10. Approved: yes** (no blocking issues; the should-fixes below are real and
worth doing before launch, because LL-41 asks for theluxuryliners.com to be *the* authoritative
source).

## How it was checked

- Built and tested from a clean `git archive HEAD` copy (commit `be29089`) in a scratch directory:
  `npm ci && npm test` passes (data, unit, dist, jsonld: "38 pages; 3 MusicGroup, 7 MusicAlbum,
  1 FAQPage", axe 370/370). `node content/check-content.mjs` and `--dist`: 0 errors, 0 warnings.
  `check-dist` passes; `RELEASE=1` fails only on the Turnstile key and the analytics token, as
  expected.
- Environment note, not a site defect: `npm run build` in the shared checkout
  (`/home/user/theluxuryliners.com/site`) failed twice at the same moment with a sharp "corrupt
  header" on `public/logos/roundel-wordmark.svg` and a missing `dist/.prerender` chunk. Both are
  the signature of several agents building into the same `public/` and `dist/` at once; the clean
  copy builds every time. Auditors and builders running in parallel should build in their own copy.
- Served `dist/` locally; every page, `llms.txt`, `robots.txt`, the sitemaps, the logo PNG and
  the default OG image answer 200 with the right content type.
- Scripted checks over all 38 HTML files: one `<title>`, description, canonical, OG and `lang` per
  page; one H1 per page and no skipped heading levels; every internal `href`/`src`/`srcset` and
  every `#fragment` resolves; every `_redirects` target exists, no chains, no loops, no
  duplicates, all 315 rows are 301; the 410 list and query-string redirects are generated from
  `data/legacy-urls.json`.
- Privacy and owner-decision sweep of `dist/` (HTML, JSON-LD, `llms.txt`, sitemap): no
  `david@dewese.com`, no Gmail, no college name, no Mesquite, no member-by-state mapping, no
  talent show, no 2008 bonus disc tied to "Great Day" (LL-13), no MP3 or download links (LL-27),
  LL-6 one-liner and LL-17 sentence verbatim, no logo designer credit (LL-39), no newsletter
  (LL-40). "Photo: Amy Wilstermann" appears as a credit line only (LL-45); see S10 for one nearby
  sentence.

## What is good

- `robots.txt` is `User-agent: * / Allow: /` with the sitemap, as LL-41 asks; staging gets a
  Disallow-all robots and `noindex, nofollow` from the Worker; `/admin/` is `noindex` by meta and
  `X-Robots-Tag`; 404/410/contact-sent are `noindex` and left out of the sitemap.
- Absolute, self-referencing, trailing-slash canonicals on every indexable page; sitemap URLs match
  them exactly (34 URLs).
- Titles are unique and in a consistent "Page | The Luxury Liners" pattern; the home title leads
  with the band name.
- JSON-LD parses everywhere. The MusicGroup node is strong: `@id`, `alternateName`,
  `disambiguatingDescription` (a real GEO win against Emmylou Harris and Carter Tanton), founders,
  four `OrganizationRole` members with start dates, logo, image and nine `sameAs`. Every release
  page has a MusicAlbum with release type, production type (`LiveAlbum` for the 2021 single),
  label, GTIN, cover and tracks with ISRC, duration and composers.
- The Facts page answers the questions people and engines ask (founders, date, place, name origin,
  members, Larry, Chad's departure and return, releases, labels, TV, producers, writers, SXSW,
  Billboard, Foxymorons, cover art, vinyl), mirrors them as FAQPage, and states its date
  policy. Dates follow the P6 rule in `data/releases.json`.
- `llms.txt` opens with the LL-6 one-liner and the LL-17 sentence, lists members with roles and
  years, every release with links, the TV uses and the disambiguation.
- Legacy URL handling is careful: 315 single-hop 301s, 410 Gone for dead files, 301s for the
  2007–09 `?content=` addresses.

## Blocking issues

None found.

## Should fix

**S1. Entity graph: the band does not link to its records, and album pages carry a bare
reference to it.** Album pages (`dist/music/*/index.html`) emit `byArtist: {"@id":
".../#band"}` and `isPartOf: {"@id": ".../#website"}` without defining those nodes on the
page, so a parser that reads one page at a time sees an artist with no name. The MusicGroup
node (home, Facts, People) has no `album` property, so the band never points at its releases.
Fix (in the JSON-LD builder under `site/src/`): on every page that does not carry the full
MusicGroup, emit a typed reference `{"@type":"MusicGroup","@id":"https://theluxuryliners.com/#band","name":"The Luxury Liners"}`
(daviddewese.com already does this with its "typed reference nodes"); add
`album: [{"@id": ".../music/<slug>/#album"}, …]` to the full MusicGroup; add `byArtist` (the
same reference) and `inAlbum` to each MusicRecording.

**S2. MusicGroup has no home location.** LL-19 makes Nashville the band's home town and the
one-liner says the band was taken there, but the JSON-LD has only `foundingLocation: Texas`.
Fix: add `"location": {"@type":"Place","name":"Nashville, Tennessee","address":{"@type":"PostalAddress","addressLocality":"Nashville","addressRegion":"TN","addressCountry":"US"}}`
to the MusicGroup node (band-level only; never per member, LL-7/LL-19).

**S3. Two labels collapsed into one fake organisation.** `music/sound-as-ever/` has
`recordLabel: {"@type":"Organization","name":"Echomusic / Litterbug Records"}`. That is an
organisation that does not exist. Fix: emit an array of two Organization nodes (Echomusic,
Litterbug Records) when `data/releases.json` lists two labels; keep the "Echomusic / Litterbug
Records" text in visible copy and `llms.txt` if wanted.

**S4. One identity split across the two sites.** daviddewese.com describes the band as
`https://daviddewese.com/bands/the-luxury-liners/#group`
(`/home/user/daviddewese.com/daviddewese-com/site/src/lib/jsonld.ts`, line 20), and this site
calls it `https://theluxuryliners.com/#band`, with no `sameAs` between them. Engines may see two
entities. Fix: under LL-41, theluxuryliners.com is the authority, so daviddewese.com's band
reference should use `https://theluxuryliners.com/#band` (or at least carry
`sameAs: "https://theluxuryliners.com/"`), and this site's MusicGroup `sameAs` should list
`https://daviddewese.com/bands/the-luxury-liners/`. Coordinate through daviddewese.com's
process; do not edit that repo from here.

**S5. Social cards crop badly and have no alt text.** Every page uses
`twitter:card = summary_large_image` (about 1.91:1), but the default image
`img/photos/four-2002-1096.jpg` is 1096×848 (1.29:1) and album pages use 1200×1200 square covers,
so X, LinkedIn and Slack crop heads and cover text. No page has `og:image:alt`,
`og:image:width/height` or `twitter:image:alt`. Fix (in the layout `<head>` under `site/src/`):
generate 1200×630 card images in `scripts/prepare-images.mjs` (the band photo, and each cover
centred on the roundel red), or use `twitter:card = summary` for the square covers; add
`og:image:width`, `og:image:height`, `og:image:alt` and `twitter:image:alt` from the same alt text
the page already uses for the image. Optionally set `og:type` to `music.album` /
`music.song` on release pages.

**S6. Story chapters: thin descriptions, generic share image, and titles that compete with the
album pages.** All nine chapter descriptions are a template ("Chapter 6 of the story of The
Luxury Liners: Overbored (2003).", 62–89 characters), every chapter shares the 2002 band photo
as `og:image` even when the chapter has its own lead photo (for example
`story/quiet-years/` has a 2008 photo), and `Overbored: chapter 6`, `Nonetheless: chapter 7`,
`Sound As Ever: chapter 3`, `Great Day: chapter 9` share their main keyword and H1 with the
release pages. Fix: write a one-sentence summary for each chapter in the chapter front matter
(`content/story/*.md`, 120–155 characters, from that chapter's own text), use the chapter's lead
photo as `og:image`, and title them as story pages, for example
"Overbored (2003): the story, chapter 6 | The Luxury Liners". Optionally type the chapter node as
`Article` with `headline`, `isPartOf` the story page and `about` the album's `#album` node.

**S7. `llms.txt` is not yet the complete authoritative source.** It lacks the Listen page (the
first thing an assistant should cite for "where can I hear them"), the nine story chapters,
People/credits, Photos, Vault, Compilations (`/music/appearances/`) and Contact; the Press and
Shows lines have no descriptions; there is no "last updated" date; and there is no fuller
companion file. Fix (in `site/src/pages/llms.txt.ts`): add those links with one-line descriptions;
add a "Last updated: YYYY-MM-DD" line from build time; add a "Facts" section with the Facts
questions and answers in plain text (same source as `content/facts.json`), or publish
`/llms-full.txt` with the Facts answers, the members and the release tracklists with writers,
and link it from `llms.txt`.

**S8. Facts answers cannot be linked to.** The 27 `<dt>` questions on `/facts/` have no `id`, so
neither people nor answer engines can cite one answer (`/facts/#who-founded`). Fix: give each
`<dt>` a stable slug `id` from `content/facts.json` (add an `id` field there) and, if wanted, a
small self-link; use the same anchors in `llms.txt`.

**S9. Error pages declare canonicals that do not exist.** `dist/404.html` has
`<link rel="canonical" href="https://theluxuryliners.com/404/">`, a URL that is itself a 404
(the only internal link check failure in the build); `410/` and `contact/sent/` also carry
canonicals although they are `noindex`. Fix: in the layout, omit the canonical (and `og:url`)
when the page is `noindex`.

**S10. "By family" on the People page (privacy-adjacent; outside this lens but found in the
sweep).** `site/src/pages/people.astro`, line 66, hard-codes "Photos without a credit line were
taken by the band, by family or with a self-timer." It sits directly under the
"Amy Wilstermann (2003)" credit line, it is about members' lives outside the band (LL-7), it has
no source in `content/` or the decisions, and next to a shared surname it invites a
relationship reading LL-45 rules out. Fix: change it to "Photos without a credit line were taken
by the band or with a self-timer." or drop the sentence, and move whatever text remains into
`content/people.md` so the content checker covers it.

**S11. Length and thin-description cleanups.** `music/shake-it-up-live/` has a 69-character
title and a 207-character description (both truncated in results). Fix: title
"Shake It Up (Live, 2021) | The Luxury Liners" and a description under 160 characters.
`music/appearances/` has a 47-character description and the title "Compilations" while its URL
says "appearances": fix the description to about 140 characters naming the compilations and the
label, and either rename the URL to `/music/compilations/` with a 301 or keep the URL and leave
the title. `404`, `410` and `contact/sent/` reuse the home description: harmless (noindex), but
give them their own.

## Nice to have

- Add `<lastmod>` to the sitemap (from the content file's git date or the build date) through the
  `@astrojs/sitemap` `serialize` option in `site/astro.config.mjs`.
- Align language: `<html lang="en">` against `WebSite.inLanguage: "en-US"`; pick `en-US` for
  both.
- Add MusicBrainz release-group URLs to each album's `sameAs` when `data/releases.json` has
  them, and Wikidata/AllMusic/Last.fm to the MusicGroup `sameAs` after the LL-8 off-site fixes
  land.
- On `/photos/`, emit `ImageObject` nodes with `creditText` (for example
  "Photo: Amy Wilstermann") and `creator` for credited photos, so image search carries the
  credit.
- Add an `apple-touch-icon` (180×180 PNG of the roundel) in `prepare-images.mjs`.
- The three Vault sub-pages (`/vault/covers/`, `/vault/journal/`, `/vault/mp3s/`) have one
  internal link each (from `/vault/`). Link the covers list from the relevant album pages and
  the journal from story chapter 5 (`/story/journal-years/`).
- For the 2026 Sound As Ever LP, consider a `MusicRelease` node (`releaseOf` the album,
  `musicReleaseFormat: VinylFormat`, `datePublished: 2026-05-27`) on `music/sound-as-ever/`.

## Score rationale

The base is very good: crawlable, canonical, clean redirects, valid and rich JSON-LD, a real Facts
page and an `llms.txt`, all checked by tests. It is not yet 9+ because the entity graph is not
connected (S1, S4), the band's home is missing from the machine-readable record (S2), one
structured-data fact is malformed (S3), share cards crop (S5), the story section is thin for
search (S6), and `llms.txt` is not yet complete enough to be "the authoritative source" LL-41
asks for (S7, S8).
