# Audit: visual design fidelity and polish, round 3

Reviewed 2026-11-06 at commit `55e62fb`. The site last changed in `37d958e`.

**Lens:** how faithful the site is to the approved Roundel sample (`design/samples/c-roundel/`, LL-44) on every page type. That covers:
- hierarchy, spacing and the type scale
- restraint with the roundel
- image crops
- mobile layouts and the dark theme
- LL-26: the 2026 singles lead the home page, above the fold on mobile
- LL-32: the era collage

**Authority:** DECISIONS-2026-10-07.md > daviddewese.com DECISIONS-2026-09-29.md > plan > research.

**Score: 8.0 / 10. Approved.** No issue in this round is blocking. The round-2 blocker is gone (the full suite is green), and every round-2 serious and polish item was taken on and holds up in the browser.

The round still found one real fidelity defect that rounds 1 and 2 both missed. The signature tilted cover stack in the home hero does not render as designed. The front cover is not tilted and is not inset (S1). The same bug undoes the phone size cap, so the hero cover on phones loads a file that is too small. The hero on landscape phones and small tablets also pushes the 2026 cover below the first screen (S2). Both should be fixed before launch. Neither breaks an owner decision, a WCAG AA rule, a link or a test.

## What I ran

- **Build:** `cd site && npm ci && npm run build` is clean (37 pages, plus 404).
- **`npm test`:** all six stages pass: data, unit, dist, jsonld, repo and axe.
- **Content checks:** `node content/check-content.mjs` and `--dist` both report 0 errors and 0 warnings.
- **`RELEASE=1 check-dist`:** fails only on the two expected keys (Turnstile and analytics).
- **Browser pass:** I served `dist/` with the suite's own harness and drove it with playwright-core on `/opt/pw-browsers/chromium-1243`.
  - Pages: all 37 page URLs, including 404 and 410.
  - Sizes: 1440 light and dark, 375 light and dark, 320 light, 1024 and 800. That is **259 renders**.
- **Probes on every render:**
  - horizontal overflow
  - broken images
  - `object-fit` crop loss over 15%
  - dark body ground
  - headings that break inside a word (the line tops of adjacent letters in every h1–h3 and `.title-xl`)
  - masthead height
  - whether the rendered image width exceeds the width that `sizes` declares
- **Home first-screen measurements:** 320×568, 375×667, 390×844, 414×896, 667×375, 844×390, 768×1024, 1024×768, 1280×800 and 1440×900, in both themes.
- **Sample comparison:** I compared the sample's own screenshots (`design/samples/c-roundel/screenshots/`) and its CSS with the site's CSS rule by rule for the hero.
- **Results:**
  - **0 overflow, 0 broken images, 0 crops over 15%, 0 mid-word heading breaks.**
  - Dark renders `#111` on every page.

## Round-2 re-test

| Round-2 item | Status now |
|---|---|
| B1 `npm test` red (repo) | **Fixed.** The repo stage passes. The critique line is reworded, and the rule is written in `critiques/README.md`. |
| S1 mobile masthead 160–198 px | **Fixed.** The masthead is 97 px at 320, 375 and 414 (two rows: logo and knob, then nav), and 76 px from 1024 up. The New Beginning cover's top edge is at 306 px at 320×568, so 262 px of it is on the first screen. Both are now behaviour tests. |
| S2 home "Great Day" black slab with an empty half-row | **Fixed (option b).** The facade sits in a two-column row beside "Watch “Great Day”" and a link to the record, so the row is full at 1440. The poster was declined with a sound reason: it would show the Great Day cover a third time, against design-c round 1 M3. See m3 for what is left. |
| S3 release "Watch" floating, 192 px dead band | **Fixed.** On `/music/overbored/` the video is on its own cream band (`#1C1C1C` in dark), the head is top-aligned, and "More press" ends short above it. |
| m1 door card heights | **Fixed** on `/vault/` and `/music/`. |
| m2 `/listen/` roundel density | **Fixed.** The per-record pills are plain, and the record names are red `.h3` heads. About 10 roundels remain: the hero pills and the section heads. |
| m3 contact kicker | **Fixed** ("Booking, press and hello"). |
| m4 Nonetheless caption fragment | **Fixed.** |
| m5 2003 frame alone | **Fixed.** The frame sits right, with the "All the photos" pill door in the left cell. |
| m6 phone collage one long column | **Fixed.** At 360–479 px the four small frames are two-up. See m2 for the ragged rows. |
| m7 `sizes` | **Partly fixed.** The collage is right. The hero cover's `sizes` is right for the *intended* layout, but S1 means the layout is not the intended one. |
| m8 ": Review." on release rows | **Fixed.** |

## What is faithful

- **Masthead:** red rule, active-link underline and the knob switch. Mobile is now as compact as the sample's two rows.
- **Home hero:** the sky band with the full lockup as the h1, the LL-6 one-liner verbatim, the status rule pair, and the white primary pill.
- **Release pages:**
  - the "ALBUM · 2003 · THE LUXURY LINERS" kicker, the giant red title and the dotted factline
  - the red-oval track numbers on cream
  - credits with red sub-heads
  - the red press band with Archivo Black quotes
  - the pill pager
- **Story chapters:** the full-red head with the tilted cover and its white frame (this tilt works, because `.chapter__cover` is a block), the drop cap, and the outlined record card. The chapter grid highlights the current card in red.
- **Collage (LL-32):** the cartwheel cut-out in its white ring, the 2002 forever-members anchor at two-thirds width, the three-up row of 1998 suits and c. 2000 studio frames, and the 2003 trio frame. Every frame has a white mat. The 2003 frame is credited "Photo: Amy Wilstermann." and nothing else is said about her (LL-45).
- **Page-head tone rule:** sky for "now", red for history, plain for reference. It is written in `PageHead.astro` and applied consistently on all 37 pages.
- **Dark theme:**
  - a real palette: `#FF8A80` heads, a deep red band, a navy sky band, outlined facades and cards, and a `#1C1C1C` surface band
  - no page falls back to light grounds
  - the white-framed photos stay crisp on the dark red band
- **Roundel restraint:** it is now at or below the sample on every page type: home about 26 (the sample has 25), release pages 8–13, chapters 3–10, and reference pages 2–7.
- **Owner decisions, all met:**
  - LL-26: the singles lead the home page.
  - LL-17: the wording is exact.
  - LL-19: the "spread across Tennessee, Michigan and Texas" line is permitted, and it never says which member lives where.
  - LL-39: there is no logo designer credit, only "logos date from 1999–2002".
  - LL-13: no talent show, and no link from Great Day to the demo.
  - LL-27: no downloads.
  - LL-40: no newsletter.
  - The contact address is absent from dist.

## Blocking

None.

## Should fix (serious)

### S1. The hero cover stack has lost its tilt, its inset and its phone cap (`src/pages/index.astro` lines 49–51; `src/styles/global.css` lines 235 and 251–255)

**What renders:**
- In the sample (`screenshots/home-desktop-light.jpg`), the New Beginning cover is rotated −3° and is 84% of the stack width. The Great Day kite card overlaps only its corner, at +6°.
- On the site the front cover is **straight and full width**:

  | Viewport | Stack width | Front cover width (should be 84% of the stack) |
  |---|---|---|
  | 1440 | 532 px | 532 px |
  | 375 | 343 px | 343 px |

  - `getComputedStyle(.stack__front).display` is `inline`.
  - The kite card therefore covers the cover's "NEW BEGINNING" lettering instead of sitting off its corner.

**Cause:**
- `.stack__front` is an `<a>` wrapping a `<picture>`, and both are inline.
  - `width: 84%` has no effect on an inline box.
  - `transform: rotate(-3deg)` does not apply to a non-replaced inline box either. The computed matrix is there, but nothing rotates.
- In the sample the same class sat on a block.

**Second bug:**
- The phone rule `.stack { width: min(100%, 300px); }` (line 235, inside `@media (max-width: 699.98px)`) comes *before* the base rule `.stack { width: min(100%, 540px); … }` (line 251). The two selectors have equal specificity, so the base rule wins and the phone cap is dead.
- The `sizes` on the hero cover (`min(84vw, 252px)` below 43.7rem) was written for the intended 300 px × 84% layout. As built, the browser picks:
  - the 300w file for a 343 px image at 375 at DPR 1
  - the 600w file for 686 device pixels at DPR 2
  - the **300w file for a 540 px image at 667×375**
- The LL-26 image, the most important picture on the site, is soft on phones.

**Fix:**
- Add `display: block` to `.stack__front`, and `display: block` to `.stack__front picture` (or set the class on the `<picture>`).
- Move the base `.stack`, `.stack__front` and `.stack__back` rules above the `max-width: 699.98px` block, or raise the phone rule's specificity (`.hero .stack`). Then the 300 px cap applies.
- Re-measure. The front cover should be 0.84 × stack width, with a −3° computed rotation that actually renders. The kite card should overlap only the lower-right corner, as in the sample.
- Keep the existing "≥ 250 px of the cover on the first screen at 320×568" test green. At 84% of 288 the cover is 242 px wide, so check the height assertion still holds, or lower the lockup further.
- **Add a behaviour assertion:** the `.stack__front` box width is ≤ 0.86 × the `.stack` width at 1440 and 375. That catches this regression.

### S2. Landscape phones and small tablets push the 2026 cover off the first screen (`global.css` lines 221–236)

The reorder that puts the latest release before the one-liner applies only below 700 px. The two-column hero starts at 900 px. Between them, and on landscape phones, the hero is the desktop order stacked in one column, with a 520 px lockup:

| Viewport | Masthead | New Beginning cover top | On the first screen |
|---|---|---|---|
| 667×375 (phone landscape) | 124 px | 370 px | **none** |
| 844×390 (phone landscape) | 76 px | 784 px | **none** (two screens down) |
| 768×1024 (tablet portrait) | 124 px | 827 px | 197 px of 540 |
| 1024×768 | 76 px | 199 px | all of it |

- The lens for this audit reads LL-26 as "above the fold on mobile". Landscape is still mobile.
- At 768 the 540 px cover is also left-aligned with 160 px of empty sky to its right. The lockup alone is 380 px tall.

**Fix:**
- Start the two-column hero grid at 640 px instead of 900 px (`grid-template-columns: 1fr 1fr` at 640–899 px, with `.logo-full` capped at about 300 px). The sample's desktop composition already works at that width.
- Add a `(max-height: 500px) and (orientation: landscape)` rule that applies the phone ordering and the 150 px lockup.
- Extend the existing first-screen behaviour test to 667×375, 844×390 and 768×1024, with a target of at least 120 px of the cover visible.

## Should fix (polish)

- **m1. `/music/` "Also" cards: the content is vertically centred, so the three titles sit on different lines** (`.doors--list a` in `global.css`, around line 349).
  - The m1 equal-height fix is in, but the card content is now centred in the taller box.
  - At 1440 the three title tops are at about 1215, 1221 and 1216 (scaled screenshot), and the body text at 1266, 1260 and 1248.
  - "Sound As Ever on vinyl" wraps to two lines with a loose leading, which pushes its body text lower still.
  - **Fix:** use `justify-content: flex-start` (top-aligned) in the door cards. Use `line-height: 1.15` on the `.doors--list` titles.
- **m2. The two-up collage rows on phones are ragged** (`global.css` lines 303–308).
  - At 375 the frames in each pair have different aspect ratios: "In coats" against "Backstage", and "Powder-blue suits" against "In the white studio". The bottom edges and the caption starts do not line up.
  - **Fix:** in the 360–479 px block, set `.collage figure:not(.col-1):not(.col-2):not(.col-7) img { aspect-ratio: 4 / 3; object-fit: cover; }`.
  - Check that the crop loss stays under 15% (the four sources are 1.33–1.5).
- **m3. The home "Watch “Great Day”" head breaks the section rhythm** (`src/pages/index.astro`, around line 71).
  - It is a small `.h3`-size red head with no roundel, vertically centred against the 360 px facade, so about 110 px of white sits above it at 1440.
  - On release pages the same block is a section head with a roundel, top-aligned (round-2 S3).
  - **Fix:** top-align the text column (`align-items: start`), as on release pages. Either promote the head to the `SecHead` style or keep it as an h3 under "The 2026 singles", but pin it to the top of its column.
- **m4. The phone collage note is larger than the caption it follows** (`global.css`: `.col-note` 0.875rem against `.collage figcaption` 0.8125rem at 360–479 px).
  - Under the 2002 photo, "Chad had left Nashville in March 2001. All four play on the 2026 singles." is set larger than the caption above it.
  - **Fix:** set `.collage .col-note { font-size: inherit; }`, or put it in the same media block at 0.8125rem.
- **m5. The roundel inside the "All the photos" pill is invisible on the red band** (the home collage, `.col-more`).
  - The red dot sits on a transparent pill over Believe red. The `/listen/` hero pills have the same problem on sky: the red dot on `#0A5A8C` reads as a dark smudge.
  - **Fix:** on band backgrounds, render the pill dot in `currentColor` (white), as the footer roundel does, or use the white-filled primary pill style for the one action in the band.
- **m6. The `/music/overbored/` pager has "All releases" orphaned below it** (`src/pages/music/[slug].astro`, pager block).
  - The plain underlined link hangs under the left pill with nothing beside it, at 1440 in both themes.
  - **Fix:** put it centred between the two pager pills, or make it a third, plain pill.
- **m7. `sizes` understates the rendered width by 4–10% on chapter heads and the EPK grid** (`story/[slug].astro` cover and photo `sizes`; `epk.astro` photo grid).
  - Chapter covers: `29rem` declared, 483 px rendered. Chapter photos: 448 px declared, 496 px rendered. EPK photos: `20rem`, against 373 px at 1440 and 354 px at 800.
  - This is harmless at DPR 2, where larger files are chosen, but it is not exact.
  - **Fix:** declare `min(31rem, 90vw)` for chapter heads and `(min-width: 40rem) 24rem` for the EPK grid.
- **m8. On phones the 2026 single cards leave the cover stranded** (home, "The 2026 singles", at 375).
  - The 160 px cover sits flush left with about 180 px of empty column beside it, and the title and pills follow below.
  - The sample put the meta to the right of the thumbnail from 360 px.
  - **Fix:** keep the two-column card grid (`grid-template-columns: 120px 1fr`) down to 360 px, and stack only below that.

## Not findings (checked)

- **LL-26** on portrait phones: met at every size, and covered by a test. Landscape is S2.
- **LL-32:** met as described above.
- **LL-45:** a credit line only.
- **LL-7 and privacy:**
  - nothing visible beyond names, roles, years and band-era photos
  - no member-to-state mapping
  - nothing about Amy Wilstermann beyond the credit
- **LL-6:** verbatim on home, the EPK and Facts.
- **WCAG AA:** axe is clean at 1280 and 375 in both themes, with JS on and off. Nothing in this round's screenshots looks below AA. The decorative red dots on sky and red in m5 carry no information.
- **No horizontal scroll at 320.** The shows table stacks on phones.

## Re-test checklist for round 4

1. **S1:**
   - At 1440, `.stack__front` is 84% of `.stack` and visibly rotated −3°. The kite card overlaps only its corner.
   - At 375, the stack is at most 300 px wide.
   - The hero cover's `currentSrc` is at least as wide as the rendered width × DPR at 375 (DPR 2 and 3) and at 667×375.
2. **S2:** at least 120 px of the New Beginning cover is on the first screen at 667×375, 844×390 and 768×1024.
3. **m1–m3:** "Also" card titles share a top line. The phone collage pairs are equal height. "Watch “Great Day”" is top-aligned.
4. `npm test` stays fully green.
