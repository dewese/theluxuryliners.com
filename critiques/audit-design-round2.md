# Audit: visual design fidelity and polish, round 2

Reviewed 2026-11-06 at commit `a1478df` (the site last changed in `3323ed0`).
Lens: how faithful the site is to the approved Roundel sample (`design/samples/c-roundel/`, LL-44) on every
page type. That covers hierarchy, spacing, type scale, restraint with the roundel, image crops, mobile, the
dark theme, LL-26 (the 2026 singles lead the home page and are on the first screen on mobile) and LL-32 (the
era collage).
Authority: DECISIONS-2026-10-07.md > daviddewese.com DECISIONS-2026-09-29.md > plan > research.

**Score: 8.0 / 10. Not approved.** The design work is now at the approval bar: every round-1 blocker and
serious item that was taken on is fixed and holds up in the browser. One blocking item remains: `npm test`
is red. The cause is not in `site/`, but the rules count any failing test as blocking. Fix the one line
named in B1 and this round passes. None of the remaining findings is blocking.

## What I ran

- `cd site && npm ci && npm run build`: clean (37 pages, plus 404).
- `npm test`:
  - data, unit (67/67), dist, jsonld and axe (370/370 page checks, 200/200 behaviour) all PASS.
  - **repo FAILS** (B1).
- I served `dist/` and the sample side by side and drove both with playwright-core on the pinned Chromium.
  - Every page type (31 URLs, including 404 and 410) at 1440 light and dark, 375 light and dark, and 320 light.
  - The same 31 URLs again at 1024, 800 and 414.
- Probes:
  - horizontal overflow
  - broken images
  - `object-fit` crop loss over 15%
  - dark body ground
  - headings that break inside a word: I compare the line tops of adjacent letters in every h1–h3 and
    `.title-xl`
  - the y position of the hero images at 320×568, 375×667, 390×844, 1000, 1280 and 1440
  - the collage frame boxes
  - door and card heights
  - the roundel count per page
- **Results: 0 problems on all 248 page renders.**
  - No overflow, no broken image and no crop over 15%.
  - No mid-word heading break at any width. Round-1 S3 is fixed, including "NONETHELESS" at 1440 and
    "PHOTOGRAPHERS" at 1024.
  - Dark renders `#111` on every page.

## Round-1 re-test

| Round-1 item | Status now |
|---|---|
| B1 cover-rights line | **Fixed.** The footer carries "Cover art: all rights reserved by the rights holders." on all 37 pages, and the release and chapter figcaptions keep it. |
| S1 LL-26 on mobile | **Fixed** to the target. The New Beginning cover's top edge is at 426 px at 375×667, 426 px at 390×844 and 464 px at 320×568, so the cover starts on the first screen at every phone size. The latest release now comes before the one-liner below 700 px. See S1 below for what is still costing height. |
| S2 LL-32 collage | **Fixed.** The 2002 forever-members photo is the anchor (785×670 at 1440, about two-thirds width). No column gap is over 60 px at 1000, 1280 or 1440. The collage leads with the 1998 suits and the c. 2000 studio shots, as LL-32 asks. |
| S3 mid-word heading breaks | **Fixed** and checked at 1440, 1024, 800, 414, 375 and 320. |
| S4 video facade | **Half fixed.** The facade is capped at 640 px and has an edge in dark. It is still a black slab with a roundel, and on home it now leaves the right half of the row empty (S2 below). |
| Polish 1 page-head rule | **Fixed.** The rule is written in `PageHead.astro` and applied: Vault children are red, and Compilations is sky under Music. |
| Polish 2 /music/ "Also" cards | **Fixed** (dot and title on one row, text at the card edge). Equal heights are still broken (m1). |
| Polish 3–5, 8–10, 13, 14 | **Fixed** as described in BUILD-LOG. |
| Polish 6 scan borders | **Fixed.** No white strip or dark edge is visible on home or /photos/ at 1440. |
| Polish 7 /photos/ holes | **Mostly fixed.** Portrait photos span two rows with dense packing. The 1997–2000 era ends on a two-photo row with one empty column, which is acceptable. |
| Polish 11 long release titles | **Fixed.** Shake It Up (Live) is now 3 lines at 1440, down from 5. |
| Polish 12 ch. 4 record card | **Fixed** (Tidal and Deezer are added). |

## What is faithful

- The masthead with its red rule, the sky hero with the full lockup as the h1, and the tilted New Beginning
  and kite cover stack. These match the sample almost pixel for pixel at 1440.
- The red-oval track numbers, the red press band, and the full-red chapter head with the tilted *Believe*
  cover and drop cap.
- The record-card aside, the pill doors, and the black footer with the white roundel.
- The dark theme:
  - It is a real palette: `#FF8A80` heads, a deep red band, a navy sky band and outlined facades.
  - It holds up on every page type.
  - The red press band and the collage keep their white-framed photos legible.
- The cartwheel cut-out in its white ring is still the best device on the site.
- Roundel restraint is about the same as the sample on home (23 roundels against the sample's 25), the
  release pages (11 against 13) and the chapters.

## Blocking

### B1. `npm test` fails: the repo check flags a tracked critique file

`node tests/run.mjs` ends with `FAIL repo`:

```
ERROR [private-literal-repo] critiques/audit-copy-round2.md line 5: A private literal is in a tracked
file of this public repository: the contact address (LL-31: Worker config only).
```

- The copy round-2 auditor wrote the contact address into line 5 of `critiques/audit-copy-round2.md`
  (commit `5eaab60`), in the sentence that says the address is not in dist.
- The site is not at fault: `check-dist` and `check-content --dist` are clean.
- But the suite is red. The address is now in the public repository's tip, against LL-31 and the hard rule
  that it never appear outside Worker config.

**Fix:**
- Reword line 5 of `critiques/audit-copy-round2.md` to say "The contact address does not appear anywhere
  in …" without the literal.
- Re-run `npm test` and check that repo passes.
- The literal stays in history. Add it to BUILD-LOG's "Owner decisions needed" item 1 (private literals in
  history) rather than rewriting history.
- Do not add the file to `REPO_EXCEPTIONS`.

## Should fix (serious)

### S1. The mobile masthead spends 160–198 px on three rows (`global.css` lines 136–161 and 560–561; `src/layouts/*` masthead markup)

- At 375 and 414 the masthead is 160 px tall:
  - the logo on row 1
  - the nav on row 2
  - the theme switch, now only its 40 px knob, alone on row 3
- At 320 it is **198 px**, because "LISTEN" also wraps onto its own row. That is 35% of a 568 px screen
  before the hero starts.
- LL-26 is met, but only about 100 px of the New Beginning cover shows on the first screen at 320×568.
- At 600–800 the masthead is 124 px.
- The sample's mobile masthead was two rows: it had no switch, because the switch was in the footer.

**Fix:**
- Below 480 px, take the knob out of `.masthead__right` and pin it to the right end of the logo row (for
  example `.masthead__bar { display: grid; grid-template-columns: 1fr auto; }`, with the nav spanning both
  columns on row 2).
- Below 360 px, drop the nav `letter-spacing` from 0.14em to about 0.08em and the gap from 18 px to 12 px,
  so all five items fit on one row at 320.
- Target: the masthead is at most 110 px at 320–414. Add that as a behaviour assertion beside the existing
  "cover on first screen at 375×667" test, and add a 320×568 case.

### S2. The "Great Day" facade on home is an unbalanced black slab (`src/pages/index.astro` line 71; `.video` and `.yt` in `global.css` lines 257–276)

- At 1440 the facade is 640 px wide inside a 1240 px row. To its right is 600 px of empty white, under two
  balanced single cards.
- It is still a `#111` box with a ringed roundel and no content. The sample used the kite poster crop at
  this point, and that read as the song.
- The same black box repeats on every release page that has a video.
- In dark (`/`, `/music/overbored/` at 1440 dark) it is only an outline on the page ground.
- Round 1 offered three fixes, and the builder chose the cap and the edge. That removed the defect but
  left the composition worse than the sample.

**Fix** (either is enough):
- (a) Use the *Great Day* cover crop (`great-day-1200.webp`, already built) as the `.yt` background with a
  dark scrim, as the sample did. Keep the roundel play button.
- (b) At ≥1000 px, place the facade in the right column next to the "2026 singles" intro text (the
  `two-col--media` layout the release pages use), so the row is full.

### S3. Release pages: the "Watch" section floats, with a 192 px dead band above it (`src/pages/music/[slug].astro` lines 147–171)

On `/music/overbored/` at 1440:

- The last "More press" row ends 192 px above the top of the video. That is two section paddings back to
  back on the same white ground.
- The "WATCH “EQUASUE”" head is vertically centred against the 360 px facade (head top 230 px into the
  section, facade top 96 px), so it sits low beside an empty column.
- In dark the two sections merge into one undifferentiated `#111` field.
- The sample put the video head at the top of its column, with a short paragraph about the TV placements,
  on its own band.

**Fix:**
- Give the video section `class="band surface"` (the cream band, `#1C1C1C` in dark), so it separates from
  "More press".
- Add `align-items: start` to `.two-col--media` for this section.
- Either drop the "More press" bottom padding when a video follows, or merge "More press" into the press
  band.

## Should fix (polish)

- **m1. The door cards have unequal heights** (`global.css` line 349, `.doors--list a`).
  - On `/vault/` the cards measure 147, 147 and **121** px. On `/music/` "Also" they measure 157, **121** and 147.
  - The `li` items stretch but the links inside do not, so the shorter card's border ends 26–36 px higher
    than its neighbours' at 1440 (both themes).
  - **Fix:** add `height: 100%` to `.doors--list a` and make the `li` `display: flex`.
- **m2. The Listen page uses roundels without restraint** (`src/pages/listen.astro`, the `Listen.astro`
  pills).
  - The page has **44** roundels: six in the hero pills, 37 in the "Record by record" pills, and the
    section heads.
  - No sample page has more than 25. At this density the roundel becomes a bullet point.
  - The record titles are also blue, underlined Archivo Black links, which the sample never used for a
    heading.
  - **Fix:**
    - Render the per-record pills without the dot (add a `plain` prop to the pill component). Keep the dot
      on the six hero pills.
    - Set the record names as `.h3` in `--head`, with the link on the name only and the underline on hover.
- **m3. The contact page head has no kicker** (`src/pages/contact/index.astro`).
  - Every other page head has a small spaced kicker above the h1 (for example "STREAMING AND BANDCAMP" and
    "THE ARCHIVE"). Contact goes straight to "CONTACT", so its band is shorter and looks unfinished next to
    its siblings.
  - **Fix:** add a kicker such as "Booking, press and hello".
- **m4. The Nonetheless cover caption is a fragment.**
  - `/music/nonetheless/` and `/story/nonetheless/` caption the cover with only "All rights reserved by the
    rights holders." Every other cover reads "Cover art: <name>. All rights reserved…".
  - The artist is not known (LL-23 does not name one), so do not invent one.
  - **Fix:** in the caption builder, write "Cover art: all rights reserved by the rights holders." when
    there is no credit, matching the footer line.
- **m5. The 2003 trio frame sits alone in the collage.**
  - At ≥1000 px `recesses-2003` is centred by itself on the last collage row (784 px wide, with about 200 px
    of red on each side).
  - "All the photos" hangs at the far left below it, cut off from the grid.
  - **Fix:** align the frame to the right edge (`grid-column: 2 / -1`) and put the "All the photos" link in
    the freed left cell as a pill door. Or let the frame span the full width, as the 2002 anchor's partner.
- **m6. The collage on phones is one long column.**
  - At 375 it runs seven full-width frames from y 2888 to 5301 (about 2,400 px).
  - The two-up grid only starts at 480 px.
  - **Fix:** at 360–479 px, put the four smaller landscape frames (backstage, blue suits, studio, coats) in
    a two-up grid with 14 px gaps. Keep the cut-out and the 2002 anchor full width.
- **m7. The `sizes` attribute understates the rendered width** for the home hero cover (`28rem` against
  532 px rendered) and the collage anchor and 2003 frames (`40rem` against 784 px).
  - At device pixel ratio 1–1.5 the browser can pick a candidate below the rendered width, which softens the
    two largest images on the page.
  - **Fix:** set `sizes` from the real layout. The cover is about `min(37vw, 532px)` at ≥56rem, and the
    collage frames are `(min-width: 62rem) 55vw`.
- **m8. "More press" rows end with ": Review."** on all five Overbored rows.
  - The kind adds nothing on the album's own page.
  - **Fix:** omit `kind()` when it is "Review" on release pages (`[slug].astro` line 153). Keep it on /press/.

## Not findings (checked)

- **LL-26:** the 2026 singles lead the home page at every width: the hero cover stack, then "THE 2026
  SINGLES" directly below it.
- **LL-32:** the collage is present, era-ordered, anchored on the forever-members photo, and favours the
  1998 suits and the c. 2000 studio sessions.
- **LL-45:** the 2003 frames are credited "Photo: Amy Wilstermann." and nothing else is said about her.
- **LL-6:** the one-liner is verbatim in the hero.
- **LL-17:** the wording is exact on home.
- **LL-39:** there is no logo designer credit. The footer says only that the logos date from 1999–2002.
- **LL-13, LL-27, LL-40:**
  - No talent show and no Great Day demo.
  - No download links. The Vault lists the old MP3s by title as history.
  - No newsletter.
- **Privacy:** nothing visible in any screenshot goes beyond names, roles, years and band-era photos.
- **Contact address:** absent from dist (`check-dist` passes).

## Re-test checklist for round 3

1. `npm test` is fully green, repo included.
2. The masthead is at most 110 px at 320, 375 and 414, and the New Beginning cover shows at least 250 px on
   the first screen at 320×568.
3. The home "Great Day" row has no empty half-row at 1440, and the facade reads as the song (it has the
   poster), in light and dark.
4. On `/music/overbored/` at 1440 the gap between the last press row and the video section is 120 px or
   less, and the "Watch" head is top-aligned.
5. Door cards are equal height on `/vault/` and `/music/`.
6. `/listen/` has 15 or fewer roundels.
