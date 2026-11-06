# Audit: visual design fidelity and polish, round 1

Reviewed 2026-11-06 against commit 0d2423e (site last changed in 9d0ae3f).
Lens: fidelity to the approved Roundel sample (`design/samples/c-roundel/`, LL-44) on every page type.
That covers hierarchy, spacing, type scale, restraint with the roundel, image crops, mobile, dark theme,
LL-26 (the 2026 singles lead the home page) and LL-32 (the era collage).
Authority: DECISIONS-2026-10-07.md > daviddewese.com DECISIONS-2026-09-29.md > plan > research.

**Score: 7.0 / 10. Not approved.** One item is blocking (B1). Several regressions against the sample
are not blocking but are serious (S1–S4).

## What I ran

- `cd site && npm ci && npm test`: PASS (data, unit, dist, jsonld; axe 370/370).
- I served `dist/` and the sample side by side and drove both with playwright-core on the pinned Chromium.
  I captured 30 page types at 1440 light, 1440 dark, 375 light, 375 dark and 320 light (full page plus
  first screen), plus 800 and 1024 for home, People and Shake It Up.
- Probes:
  - horizontal overflow
  - broken images
  - `object-fit` crop loss over 15%
  - body background in dark
  - headings that break inside a word: I compare the line tops of adjacent letters in every h1–h3
  - the y position of the hero blocks against the sample, at 320×568, 375×667, 390×844, 1280×720 and
    1440×900
- Results:
  - No horizontal overflow and no broken images at any width.
  - No `object-fit` crop over 15%.
  - Dark renders `#111` on every page.
  - No privacy, LL-13, LL-27, LL-39 or LL-40 problem was visible in any screenshot.
  - The 2003 photos are credited "Photo: Amy Wilstermann." and nothing else is said about her (LL-45).

## What is faithful

- Tokens, palette and type: Archivo Black for heads in capitals, Archivo for text.
- The red-rule masthead, the sky hero with the full lockup as the h1, and the tilted New Beginning and
  kite cover stack.
- The red-oval track numbers, the red press band on Overbored, and the full-red Story chapter head
  with the tilted *Believe* cover and a drop cap.
- The record-card aside, the pill doors, and the black footer with the white roundel.
- The dark theme is a real palette, not an inversion. The `#FF8A80` heads, the deep red band and the
  dark surface all hold up at 1440 and 375.
- The cartwheel cut-out in its white ring is intact and is still the best device on the site.

## Blocking

### B1. The cover-rights line is missing wherever covers appear outside a release or chapter page

`dist/index.html` shows six cover images: the hero stack and both single cards. `dist/music/index.html`
shows seven covers (21 srcset entries). Neither page prints "Cover art: all rights reserved by the
rights holders." anywhere.

- The plan (§ line 58, P14/P17/R1/P40) says covers carry the line, and P40 makes it the default.
- The approved sample put the line in the footer, so every page with a cover had it.
- The port moved it into each release figcaption and dropped it from the footer (`site/src/components/Footer.astro`).
  That leaves the home page, the most-viewed page and the one that leads with covers, with no line.

**Fix:** add `<p class="small">Cover art: all rights reserved by the rights holders.</p>` to `.foot__meta` in
`Footer.astro`, as in the sample. Alternatively, add it under the hero stack and the music grid. Then add a dist
test: any page with `/img/covers/` must contain the line.

## Should fix (serious)

### S1. LL-26 on mobile: no 2026 single is visible on the first screen

Measured on `/`:

| Viewport | Masthead height | Kicker top | Cover stack top |
|---|---|---|---|
| 320×568 | | 809 px | |
| 375×667 | 162 px | 760 px | 821 px |
| 390×844 | | 772 px | 833 px |

At 390×844 only the kicker text reaches the screen. The first screen is the masthead, the logo
(about 270 px) and the one-liner. The status line ("Two new singles in 2026") is the only hint of the singles.

The sample has the same order, but the port is 42 px worse because the "Dark theme" switch now wraps onto
its own row in the mobile masthead (`.masthead__right`). In the sample the switch was in the footer.

**Fix** (`src/pages/index.astro` and the `.hero` rules in `global.css`):
- Below 700 px, either put `.hero__latest` (kicker, stack, pills) before the one-liner, or cap the h1 lockup at
  about 150 px tall and the stack at about 60vw.
- Make the theme switch icon-only (keep the visible text for screen readers) or move it back to the footer.
  Either way the masthead stays at about 120 px.
- Target: the New Beginning cover's top edge sits above 667 px at 375×667.

### S2. LL-32 collage: the forever-members photo is demoted and the grid leaves red holes (`global.css` `.collage`, ≥1000 px)

- **The demotion.** In the sample the 2002 forever-members photo is the largest frame in the collage, at
  about two-thirds width. In the port it is a one-third tile in the middle column. Its two-row grid area
  (`"c3 c4 c5" "c6 c4 c7"`) leaves about 270 px of empty red under its caption, at about y 2850–3120 at
  1440. The left column also has a gap of about 110 px between the coats caption and the white-studio
  frame. LL-32 names this photo explicitly. It should read as the anchor, not as filler.
- **The fix.** Use areas like `"c1 c2 c2" "c3 c2 c2" "c4 c4 c5" "c4 c4 c7"` and move c6 next to c3, or
  restore the sample's grid. Then check that no column has a gap over 60 px at 1000, 1280 and 1440.
- **Mobile.** At 375 the collage is a single column of seven framed photos, over 2,000 px of scroll. From
  480 px up, put the four small frames in a two-up grid. Keep the cut-out and the 2002 photo full width.

### S3. Headings still break mid-word, now on a release-page h1

This was flagged in roundel-apply round 1 and is still not fixed. My probe found:

- `/music/nonetheless/` h1 "NONETHELE / SS" at **1440** (light and dark). This is the page title.
- `/people/` "PHOTOGRAPHER / S" at 1024 and 1440.
- `/accessibility/` "ACCESSIBILIT / Y" at 320.
- `/music/appearances/` "COMPILATION / S" at 320.

The cause is `overflow-wrap: anywhere` on headings (`global.css` lines 110 and 156).

**Fix:**
- Change it to `overflow-wrap: break-word` and add `hyphens: manual`.
- Size `.title-xl` with `clamp()` so the longest single word fits the release text column: the column is
  about 650 px at 1440 and "NONETHELESS" is 11 capitals in Archivo Black. Shrink the two-column section
  heads on People.
- Add the word-break probe to the dist/axe Playwright run at 1440, 1024, 375 and 320, so this cannot
  come back silently.

### S4. The video facade is a dead black slab, and in dark mode it disappears

- **Light theme.** On home, "Great Day" is a 960×540 `#111` block with a roundel in a ring. It is the
  largest element in the singles section and outweighs both single cards. The sample used a kite poster
  crop (`poster-great-day.webp`) at the same size, which reads as content. This was raised in
  roundel-apply round 1 (#2) and design-c M3 and is still not addressed.
- **Dark theme.** The same `#111` facade sits on the `#111` page ground, so it has no edge at all
  (`/` and `/music/overbored/` at 1440 dark). The ring and the "Play" pill float in the void.
- **Fix:**
  - Cap `.video` at about 640 px on home, or set it beside the Great Day card at ≥1000 px.
  - Give `.yt` a `1px solid var(--line)` border, or in dark use `background: var(--surface)` (`#1C1C1C`)
    with a lighter ring.
  - Or use a cleared poster crop, as the sample did.

## Should fix (polish)

1. **Page-head treatment is inconsistent.** The page heads come in three styles with no stated rule:
   - Red band: 404, 410, EPK, Story, Vault.
   - Sky band: Music, People, Listen, Contact.
   - Plain white with a red title: Photos, Facts, Press, Privacy, Shows, Accessibility, Compilations,
     Covers, Journal, MP3s.

   Siblings disagree: Vault is red, but its children Covers, Journal and MP3s are white. **Fix:** write a
   rule in `PageHead.astro` (for example, sky for "now" and section hubs, red for Story and Vault hubs,
   white for leaf and reference pages) and apply it everywhere. At least make each hub's children share
   the hub's treatment.
2. **The /music/ "Also" cards are broken** (`src/pages/music/index.astro` § also, `.card`):
   - "Sound As Ever on Vinyl" puts the roundel on its own line, with the title wrapped underneath.
   - In all three cards the body text is indented to the title's text edge, not the card edge.

   **Fix:** use the same flex row as `.doors`, with the dot and the title together and the body at the card's
   left padding. Or drop the roundel from these cards: restraint.
3. **Member presentation varies by page.**
   - Home uses a roundel per member, h3 names and lower-case run-on roles ("co-founder, guitar, bass,
     lead vocals, songs").
   - People uses plain bold names with no roundel, and only "David Dewese" is a blue link.

   The sample's style was "Co-founder. Guitar, bass, lead vocals; writes songs." **Fix:** use one member
   component on both pages, with sentence-case roles as in the sample. Either link every name or none.
4. **The Larry line is duplicated on home.** The card says "The band already had a David, so he became Larry."
   The paragraph under the grid repeats "He's Larry because the band already had a David." Drop the second one
   (`content/home.md`, members outro).
5. **The suits are named inconsistently on home.** The intro says "Pale-blue suits in 1998". The caption says
   "Powder-blue suits, about 1998", and /photos/ uses the same caption. Pick one colour word (the intro is in `site/src/pages/index.astro`; the caption comes from the asset data).
6. **Scan borders are left on the photos.**
   - `1998-pale-blue-trio` has a white strip and a black edge on the right.
   - The 1998 backstage photo and the Hard Rock photo have a white or scalloped band at the top.
   - The `c2000-white-studio-dance` photo has a dark edge on the right.

   These show on home and /photos/ at 1440. **Fix:** trim 1–3% in `scripts/prepare-images.mjs` (per-asset
   crop boxes in `data/assets.json`), and never use `object-fit` to hide the borders.
7. **/photos/ grid holes.** `align-items: start` with mixed aspect ratios leaves about 300 px of white under
   the row-1 side tiles, next to the tall Hard Rock photo. **Fix:** use CSS columns (masonry), or give the
   portrait photo a two-row span with the landscape tiles stacked beside it.
8. **Overbored press.**
   - The sample's quotes were dated. The port drops the dates, and "Review of Overbored" repeats on
     all three quotes and all five "More press" rows. Show the year and drop the redundant "Review of
     Overbored" on the album's own page.
   - "(Albany, New York)" is set inside the italic `<cite>`. Move it outside.
   - "More press" uses a centred `.measure`, so its head jumps from x=132 to x=361. Left-align it with
     the other sections.
9. **"NOTES" butts against the tracklist** on release pages: there is no space above the h3 after
   `ol.tracks`. Add `margin-top: 1.5em` to `.tracks + .h3`.
10. **The factline wraps with a leading bullet at 375** (`/music/nonetheless/`): "● LLCD1004" starts the
    second line. Draw the separator as `::before` on all but the first item, with the gap on the item, or
    use `column-gap` with no leading dot.
11. **The release h1 is overweight for long titles.** "SHAKE IT UP (LIVE AT THE TEXAS MUSIC CAFÉ)" runs to
    5 lines at 1440. Scale `.title-xl` by title length (a `data-long` class over 24 characters), or set the
    parenthetical as a kicker line.
12. **The /story/believe/ record card** still shows only Spotify, Apple Music and Bandcamp, while the
    release page has Tidal and Deezer (design-c m6). It is also still unexplained in BUILD-LOG. Decide
    and record it.
13. **The single cards dropped detail the sample had:** the full date ("April 17, 2026"), the "Two tracks"
    line and the Tidal and Deezer pills. If the trim was deliberate, keep the exact dates. They are in
    `releases.json`, and LL-26 wants the 2026 singles to lead.
14. **People › On the records:** "Jim Horan: restored the *Sound As Ever* art for the 2026 vinyl, 2026"
    still repeats the year (roundel-apply round 1, #5).

## Re-test checklist for round 2

- Home at 375×667: the New Beginning cover's top edge is above 667 px.
- The collage at 1000, 1280 and 1440 has no column gap over 60 px, and the 2002 photo is the largest frame.
- The word-break probe is clean on every page at 1440, 1024, 375 and 320.
- In dark, the `.yt` facade has a visible edge.
- Every page with `/img/covers/` carries the rights line.
