# content/: how the copy is kept honest

This folder holds the site copy for theluxuryliners.com, written in the third person. Pages are Markdown with frontmatter, and structured lists are JSON. Every fact traces to `DECISIONS-2026-10-07.md` (LL-1 to LL-43), the daviddewese.com `DECISIONS-2026-09-29.md`, `data/releases.json` or `research/*.md`. The trace is kept in a source note on each item, and source notes are never rendered.

Authority order, highest first: `DECISIONS-2026-10-07.md`, then daviddewese.com `DECISIONS-2026-09-29.md`, then `plan/00-master-plan.md`, then `research/*.md`.

## Files

| File | Page | Notes |
|---|---|---|
| `home.md` | `/` | The LL-6 one-liner (`one_liner`, byte for byte), the status line, the latest-release label, the 2026 singles (no dates in the blurbs), the forever members, three doors and the disambiguation line |
| `story.md`, `story/01…09-*.md` | `/story/` | Nine chapters, one file each, with `chapter`, `title`, `years`, `era` (`powder`, `oxblood` or `sky`, the Direction A era pairs) and `summary` |
| `people.md`, `people.json` | `/people/` | Forever members, early and guest players (LL-24), people on the records, cover-art credits (LL-23) and photographers. Names, roles and years only (LL-7) |
| `facts.md`, `facts.json` | `/facts/` | Questions and answers (plan §5.4), with contested facts handled as in plan §4.3; `faq_jsonld: true` marks answers that may also go into `FAQPage` JSON-LD; the "How dates are given" note |
| `press.md`, `press.json` | `/press/` | Press in date order; positive excerpts only, exactly as printed; TV placements |
| `shows.md`, `shows.json` | `/shows/` | Dated shows with sort keys for partial dates |
| `covers.md`, `covers.json` | Vault, covers list | Known cover songs by title and original artist (LL-29); no audio (LL-27) |
| `epk.md` | `/epk/` | Short, medium and long bios (about 50, 150 and 300 words), each opening with the LL-6 one-liner |
| `sound-as-ever-name.md` | `/music/sound-as-ever/`, Story ch. 3 | Why the first album is called *Sound As Ever* (LL-21) |
| `check-content.mjs` | — | The checker (below) |

## What is rendered and what is not

- **Markdown:** the body is public. In the frontmatter, everything is public **except** these keys and everything nested under them: `sources`, `held`, `notes_internal`, `source`, `confidence`, `contested`, `claim`, `item`, `why`, ids and file paths (the full list is `INTERNAL_KEYS` in `check-content.mjs`).
- **JSON:** every string is public **except** under those keys, keys starting with `_`, and whole records marked `"publish": false` (held items).
- **Held items** (`held:` lists, `"publish": false`) are things we know about but cannot publish yet: unverified, single-source without a clean attribution, or waiting for an owner answer. They stay in the data so nobody re-adds them by mistake.

The build track should render only the public fields. Source notes, confidence labels and decision codes must never reach the page.

## Sort keys for partial dates (`shows.json`, `press.json`)

`sort_key` is `YYYY-MM-DD`, with `00` for an unknown month or day, so a row known only by year (`2006-00-00`) sorts before the dated rows of that year. A season or range sorts by its first possible month: "autumn 1997 or winter 1998" is `1997-10-00`, "July or August 1998" is `1998-07-00`, "autumn 1998" is `1998-09-00`. Where a post says early, mid or late in a month, a representative day (about 05, 15 or 25) stands in, `date_precision` stays `month`, and the visible `date_display` says early, mid or late. Ties sort by `id`. `date_precision` is one of `day`, `approx-day`, `month`, `month-range`, `season`, `season-range` or `year`.

## Running the checker

```sh
node content/check-content.mjs                  # scan content/
node content/check-content.mjs --dist dist      # content/ plus a built site
node content/check-content.mjs --dist-only dist # the built site only
node content/check-content.mjs --self-test      # prove every rule fires
node content/check-content.mjs --json           # machine-readable output
```

The checker exits 1 on any error; warnings never fail. It needs Node 18 or later and has no dependencies.

**Curly quotes.** Before matching, the text is normalised: ‘ ’ ʼ ′ become `'`, “ ” become `"`, non-breaking spaces become spaces, and Markdown `*emphasis*` is unwrapped. So `Chad’s band` and `Chad's band` are both caught. The only rule that reads the raw text is the year-apostrophe rule: `'97` with an ASCII apostrophe fails, and `’97` (U+2019) passes. The LL-6 one-liner is compared after this normalisation in running text, and byte for byte in `home.md`'s `one_liner` field and, in `--dist` mode, in every built file (HTML entities decoded, nothing else changed: a curled ‘Luxury Liner’ fails; rule `one-liner-bytes`).

**In a dist,** it reads HTML (visible text, `alt`, `title`, `aria-label`, `content` and `placeholder` attributes, and JSON-LD), plus `.json`, `.txt` (`llms.txt`), `.xml` and `.webmanifest` files as public text. In `.js` files it runs the privacy rules only. Text inside `<blockquote>`, `<q>` or an element with `data-quote` is a dated quotation: the plan's † rules ("broke up", "reunion", "former member", "one-time", "Nashville-based", single-founder wording) skip it, and every other rule still applies. In Markdown, a paragraph of `> ` lines counts as a quotation, and so do the `excerpt` fields in `press.json`.

## Rules

**Everywhere, internal notes included** (the repository is public): any email address (LL-31), phone numbers, postal addresses, any "X University" / "X College" / "University of X" name, the words "family page", and expired or excluded hosts (isawtheocean, Big Cartel, NoiseTrade, MySpace, SoundCloud).

**Private literals are matched by a keyed digest, never written.** A few literals (LL-7, LL-31) are matched by the HMAC-SHA256 of a lower-cased token under a secret key (`PRIVATE_HASHES` in `content/private-literals.mjs`), with generic labels (`private literal P1`…), so neither the checker nor a public word list can show what it protects. The key is the `PRIVATE_LITERALS_KEY` environment variable (a CI secret) or the git-ignored `data/private/private-literals.key`; the plain literals and what each one is are in the git-ignored `data/private/private-literals.json`. Without the key the check fails closed in CI and release builds and is off (with a warning) on a developer machine. Each word, each dotted or at-sign token, each part split on `. @ / - _`, and each adjacent word pair is digested and compared, so the literal is caught in running text, in a URL path or host and in a `mailto:`. To add one, run `node content/private-literals.mjs --digest 'the token'` and add the digest with the next generic label. Never put the plain token in a commit message, comment, test or critique: **critiques and logs name a private literal by its role ("the contact address", "the founding-story town"), never by its value**, and the `repo` check fails on any tracked file that does. The self-test proves the matcher on synthetic tokens (`zz…@example.test` and the like) for the same reason.

**In rendered text:**

- **Story:** no talent-show story, anywhere (LL-13). Nothing that says or implies "Great Day" is the 2008 demo, and no bonus-disc mention or link (LL-13). "Broke up" only as "never broke up". No "reunion", "together again" or "back together". The reconnection is told only in the LL-17 wording, verbatim. No "former" next to a forever member, no "one-time" and no "Nashville-based". Co-founder wording only (F4, LL-6), and the band was not founded in Nashville (LL-4). Never "the 2002 line-up", and the 2002 caption is exact (P23). Chad left in March 2001, never April (LL-15). David left Nashville in 2009 (LL-17). "Shake It Up" is never a cover, and "Believe" always comes with Cher (P27).
- **Privacy:** nothing about lives outside the band, never which member lives where, no "four states" (LL-7, LL-17, LL-19).
- **Unverified items:** no "Hot Prospects", no Monsters of Pop, and no Jetpack attribution for "Lead Me On". No painting credit next to *Nonetheless* (single-source, held). Gary Ishee's shows are 2004–05, never later (LL-24). Nothing that implies the E-Cleff *Trunk Box* set and the Texas Music Café night were two separate sessions. Warnings: a year next to Emmylou Harris's *Luxury Liner*, the Barlowe spelling, and Hatch Show.
- **Site rules:** no downloads or `.mp3` links (LL-27; a bare "MP3" is a warning). No newsletter, mailing list or sign-up (LL-40). No logo designer credit (LL-39).
- **No sourcing notes in rendered text:** for example "as credited on…", confidence labels or "search snippet". No decision tags (LL-n, X1, [F4]) and no "withheld under". Mentions of Wayback, Flickr or Discogs are warnings, because they are fine only as deliberate links.
- **Exact strings:** any sentence that starts the one-liner must be the full LL-6 text, and `’97` must use U+2019.

**Structure:** every Markdown file has a `sources:` list; every published JSON record has `source` and `confidence`, and none is `unverified`; the EPK bios are within 20% of 50, 150 and 300 words; show ids are unique, with valid sort keys and precisions; every `show_id` in `people.json` exists, and Doli Stepniewski's points at the *Nonetheless* CD release show (`2006-nonetheless-cd-release-show`).

The X1 word list is not in this file or the checker, so that it is never written into a public repository. The build's `check-dist`, ported from daviddewese.com, carries it.

## Decisions applied, and lessons from the lost run

- **LL-4, LL-5, LL-6:** the founding is told as LL-4 tells it (emails, then spring break 1997, then Nashville in May 1997); the place and town are never named. There is no first-person naming quote from David: his 2001 "I named my band" line is held (`press.json` held).
- **LL-17:** "The band never broke up. The four forever members reconnected during the pandemic and started making music again." It appears verbatim in Story ch. 9, Facts and the EPK. No "together again" without a source.
- **LL-13:** the singles copy says nothing about where "Great Day" came from, and the home blurbs carry no release dates and no padding.
- **Attribution:** single-source items are either attributed in the sentence (the 2005-site covers say "posted on the band's website in 2005") or held (the LP label and edition size, Grand Rapids, Codaphonic, the Barlowe credit, "Texas Pop").
- **’97:** typographic apostrophes are used throughout; the checker enforces U+2019 before two-digit years.
- **Personal details:** the July 2002 Washington, DC trip appears only as an outdoor show; the visit is left out.
- **The Nonetheless release show:** `people.json` `doli-stepniewski.show_id` is `2006-nonetheless-cd-release-show`, and the checker verifies the link.
- **LL-20, LL-22, LL-16, LL-10/18, LL-37/38** are told as fact, with exactly the precision the decisions give ("probably autumn 1997 or winter 1998", "July or August 1998", "autumn 1998", "2008"). The Zanies row on Shows keeps "Probably".
- **LL-9:** Chad is "in the band again today" on People, in Story ch. 9 and on Facts; when he rejoined is not dated.
- **LL-24:** Gary Ishee is "2004–05" with *Nonetheless* guitar as a separate role, everywhere (People, Facts, Story ch. 7).
- **Waco, autumn 1998:** Story ch. 2 tells *Trunk Box* in one neutral sentence ("A live set from Waco that autumn, recorded at E-Cleff Studios…"), and the separate E-Cleff row in `shows.json` is held (`publish: false`) until David says whether it is the Texas Music Café night.
- **March 2001:** the SXSW showcase and Chad's last show are told as "the same month", with no order; the Shows row for Chad's last show has `venue: null` (the template omits it) and says the order is not recorded.
- **Round 2 (critic, 2026-11-06):** the checker's private literals are hashed; the *Nonetheless* cover credit is held; the Castner-Knott detail is cut; the *Sound As Ever* production sentence follows the per-track credits; the *Nashville Scene* 2001 item is listed without an excerpt; Shows and the dating note use an impersonal voice; Doug Nightwine is dated 2003 (the release year); the home roles match People.

## Waiting on the owner (held, not published)

The *Billboard* item's title and issue (LL-22); which Jetpack recorded "Lead Me On"; the *Nonetheless* cover credit (Scott's painting, David's design: single-source) and photographer's spelling; whether the E-Cleff *Trunk Box* set is the Texas Music Café night; Jeff Grant's role; the 1998 photo-shoot photographer; the logo designer (LL-39); the venue and month of the *Nonetheless* CD release show; when Chad rejoined; the 2007 Grand Rapids and Nobility shows; Monsters of Pop (1998); the *Sound As Ever* LP's label, edition size and remaster credit (single-source); and "Texas Pop" (its only read source is the 2005 page that LL-13 removes).
