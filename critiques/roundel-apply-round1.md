# Critique: applying design C "Roundel" to the real site, round 1

Reviewed 2026-11-06 against commit 9d0ae3f ("site: apply design C "Roundel" (LL-44) to every page; …").
Authority: DECISIONS-2026-10-07.md (LL-44, LL-45 and the rest) > daviddewese.com DECISIONS > plan > research.

**Score: 8.0 / 10. Approved** (threshold 8, no blocking items). Fix the should-fix items in the next pass.

## What I ran

- `npm ci && npm test` in `site/`: PASS (data, unit, dist, jsonld; axe 370/370 page checks, 0 violations).
- `RELEASE=1 node scripts/check-dist.mjs`: fails only on `PUBLIC_TURNSTILE_SITE_KEY` and
  `PUBLIC_CF_ANALYTICS_TOKEN`, as expected.
- `node content/check-content.mjs`: 0 errors. `--dist site/dist`: 0 errors, 13 deliberate warnings
  (sameAs/Listen host names, MP3s listed as history). The new `one-liner-bytes` rule exists, and its
  self-test probes catch curled quotes and pass entity-encoded text.
- My own Playwright sweep (served `dist/`, every off-site request recorded). Pages covered: home,
  Overbored, Great Day, Music, Appearances, Story index, Story ch. 4 and ch. 5, People, Facts, Press,
  Shows, Photos, Vault, Covers, MP3s, Journal, EPK, Contact, Contact/sent, Listen, Accessibility,
  Privacy, 410, 404. Each at 1440 and 375 px in light and dark, plus 320 px light.
  - Horizontal scroll: none at any width.
  - Off-site requests on load: 0 on every page.
  - JS errors: none, apart from the deliberate 404 status on the 404 page.
  - Dark scheme renders dark (#111) both with the switch and with JavaScript off
    (`prefers-color-scheme`). The switch is hidden when JavaScript is off.
- Keyboard: the skip link is the first tab stop, and every stop has a 3 px solid focus ring.
  - The "Dark theme" button toggles `aria-pressed` on Space. The choice persists across pages
    (one localStorage key, which the Privacy page discloses).
  - The YouTube facade is an `<a>` to youtube.com, so it still works without JavaScript. Enter swaps
    in a `youtube-nocookie.com` iframe with a title and moves focus into it. Nothing loads from
    YouTube before the press. `frame-src` in the CSP allows only Turnstile and youtube-nocookie.
- Privacy and facts, checked in dist:
  - `[the contact address]` is absent, and no `.mp3` files ship.
  - No talent show, and nothing ties "Great Day" to the 2008 demo.
  - The LL-17 sentence is verbatim, and the LL-6 one-liner is byte for byte (straight
    'Luxury Liner') everywhere.
  - "Spread across Tennessee, Michigan and Texas" is the form LL-19 approves, with no member mapped
    to a state.
  - Amy Wilstermann appears only as "Photo: Amy Wilstermann." on the two 2003 shoot photos (Overbored,
    home collage, Photos, EPK) and as "Amy Wilstermann (2003)" under People › Photographers. Nothing
    relates her to anyone, and a dist test guards that.
- Test diffs read line by line. `pages.test.mjs` was changed only where an owner decision changed
  (LL-45, content-driven blurbs), and the new assertions are stricter. `check-dist.mjs` gains one
  narrow skip: the "null as text" rule is skipped for the two shipped OFL licence files ("null and
  void"). That is justified. No test was weakened or disabled.

## Against the approved sample

The port is faithful:

- Same tokens and palette, and the self-hosted Archivo and Archivo Black.
- The sprite comes verbatim from the masters, and a dist test compares every `d`.
- Red rule header with the roundel wordmark, and the black footer with the white roundel.
- Sky-blue hero carrying the full mark as the h1.
- Red-oval track numbers, the red press band, the red Story chapter head with the cover and a drop
  cap, and the record-card aside.
- Pill "doors" and roundel section bullets.

Every page type in the brief has a template and looks like one site. Story chapters are now real
pages with a pager and a chapter grid, and the m4 row alignment holds. The 375 px dark layouts are
clean: the Shows table stacks, and the header wraps to nav plus switch. The design-c critique items
M1–M3 and m1–m5 are addressed as the BUILD-LOG says. On Overbored, the "Equasue" block is about
Equasue only, and only one 2003 photo remains. The collage leads with the 1998 suits, and the left
column has no red hole.

## Earlier should-fix items: verified in dist

- **Home blurbs:** rendered only from `content/home.md`. Both are `null` now, so no blurb is
  rendered and no padded line appears.
- **/photos/ order:** sorted by year within each era.
- **Curly quotes:** curled everywhere in visible copy and titles, with the LL-6 one-liner as the
  single verbatim exception. That is a defensible reading of "byte for byte", and the checker
  enforces it.
- **March 2001 Shows row:** reads "Place not recorded".
- **"If I Cry":** links to `/music/appearances/#ll-appearance-1998-nashpop`.
- **Mark Montgomery:** 2000–2002, matching his dated photos (2000, 2001, 2002).
- **EPK logo links:** "Roundel wordmark (SVG)" and similar labels.
- **shows.json:** Zanies `datetime="1997-09"`, and late September 2001 sorts at day 25.
- **Facts chad-2001:** "In March 2001. …"
- **Journal quotes (LL-25):** removed from /shows/ and Story chapters 4 and 5. Each is listed in
  BUILD-LOG for David, and the quotes are held in the story files' `held:` blocks. The remaining
  quoted strings on /shows/ ("12@12th", "Dancin' in the District") are event names, not journal
  lines.

## Blocking

None.

## Should fix

1. **Headings break mid-word.** `overflow-wrap: anywhere` on headings splits words with no hyphen:
   - On /people/ at **1440 px**, the "Photographers" h2 renders as "PHOTOGRAPHER / S" in its
     463 px column at 44 px. This shows in the worker's own `people-1440-light.jpg`.
   - At 320 px, "Compilations" (/music/appearances/) and "Accessibility" (/accessibility/) break
     the same way.

   Fix: use `overflow-wrap: break-word` (it breaks only when a word cannot fit a line on its own),
   size the two-column section heads down, or add `hyphens: auto` with `lang="en"`. Add a check
   that no h1–h3 breaks inside a word at 1440, 375 and 320 px. My probe compares the line tops of
   successive word characters, so this is easy to automate.
2. **The home video facade is the heaviest thing in the singles section.** Without a poster (M3), it
   is a full 960 px black block holding a giant roundel. It outweighs the two single cards and
   departs from the sample's rhythm. M3 offered "a tighter, smaller facade" as the alternative. Cap
   it at about 640 px (or put it beside the Great Day card at 1440), or use a distinct band-era
   still if one is cleared.
3. **design-c m6 is not addressed.** The Believe EP record card in Story ch. 4 shows only Spotify,
   Apple Music and Bandcamp. `releases.json` also has Tidal and Deezer, and the /music/believe-ep/
   page shows them. BUILD-LOG lists M1–M3 and m1–m5 as fixed and is silent on m6–m8: say what was
   decided.
4. **`overview.png` is still a 256-colour palette PNG** (mode P, 11920×4160), so the photos band
   (design-c m8). Save it as RGB, or as high-quality JPEG/WebP, so reviewers judge the real
   colours.
5. **Smaller polish items:**
   - Member role lines on home and People are lower-case run-ons ("co-founder, guitar, bass, lead
     vocals, songs"), where the sample had "Co-founder. Guitar, bass, lead vocals; writes songs."
     Pick one style and apply it everywhere.
   - People › On the records: "Jim Horan: restored the *Sound As Ever* art for the 2026 vinyl,
     2026" repeats the year.
   - /shows/ opens with "Shows from 2001 to 2004 come from the band's journal." This reads close
     to a sourcing note. Consider folding it into the intro as context ("…as the band logged them
     at the time").

## Notes for the record (not defects)

- Full-page captures of lazy images can show empty frames if they are taken before decode. My first
  sweep did this. The Overbored 2003 photo renders correctly when scrolled into view (checked:
  `currentSrc` set, `naturalWidth` 480).
- Facts says "his college friend Chad Edgington". This predates this round and comes from
  daviddewese.com DECISIONS P21. It names no college, so it is within LL-7.
