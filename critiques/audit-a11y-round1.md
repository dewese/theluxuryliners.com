# Audit: accessibility (WCAG 2.2 AA), round 1

Reviewed 2026-11-06 against commit be29089 (design C "Roundel", LL-44, applied to every page).
Lens: WCAG 2.2 level AA only. I did not edit any site file.
Authority: DECISIONS-2026-10-07.md (LL-1..LL-45) > daviddewese.com DECISIONS > plan > research.

**Score: 6.5 / 10. Not approved.** There are 2 blocking items:

- **B1.** The accessibility statement makes claims that are not true.
- **B2.** The Contact form hides its input rules, and its error path throws away what the visitor
  typed (WCAG 3.3.2 and 3.3.7, both level A).

Everything machine-testable is clean: axe finds 0 violations and every page reflows. The
blocking items come from the form flow and the statement. Automated tools do not cover either.

## What I ran

- **Build and tests.** In `site/`: `npm ci && npm run build`, then `node tests/run.mjs`.
  - Result: PASS for data, unit, dist, jsonld and axe (370 of 370 page checks).
  - `node content/check-content.mjs`: 0 errors.
- **Axe sweep** (my own, run from the scratchpad): `@axe-core/playwright` on all 37 built pages
  plus `/404.html`.
  - Tags: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa and best-practice.
  - Light and dark (`colorScheme`), at **1440, 375 and 320 px**: 228 runs in all.
  - Result: **0 violations and no horizontal scroll** at any width.
  - Axe left 134 "incomplete" items, all `color-contrast` on the `.oval` track and chapter numbers
    (the background is a pseudo-element). I checked these by hand:
    - White on #b5121b is 6.85:1, and white on #8f0e15 is 9.37:1.
    - The current chapter (#111 on white) is 18.88:1.
    - Every number also has a visually hidden "1. " text twin.
  - No text sits on top of a photo anywhere. The video label is #111 on a white pill on black.
- **Keyboard walkthrough.** I tabbed through every page in light and dark at 1440 and 320 px,
  recording each focus stop's outline, its contrast against the nearest painted background, its
  visibility and its order.
  - Every stop has a 3 px solid `:focus-visible` ring with at least 3:1 contrast, including white
    rings on the red and sky bands and in the footer.
  - There are no backwards jumps in the tab order and no hidden focus targets.
  - The skip link is the first stop, appears at `top:12px`, and moves focus into `<main>`.
  - Nothing sticky covers focus (2.4.11).
- **YouTube facade.** Enter on `a.yt` swaps in the iframe, which has `title="Great Day"`, and
  focus moves into it. Under `prefers-reduced-motion` the swap is immediate and nothing spins.
  Without JavaScript the facade is a plain link.
- **Reduced motion.** The `.jump` cut-out has `animation-name: none`, and the hover transforms are
  cancelled. There is no smooth scrolling.
- **Forced colours.** Screenshots of home, Believe EP and Story with `forcedColors: 'active'`, in a
  light and a dark system scheme. See M1.
- **Text spacing (1.4.12).** I injected the 1.4.12 spacing values on every page: nothing clipped,
  and no horizontal scroll at 1280 px.
- **Text-only resize to 200%** (`html{font-size:200%}`) at 1280 px: horizontal scroll on 6 pages.
  See m4.
- **Headings and landmarks.** I dumped them for every page: one `<h1>` per page, no skipped
  levels, and every `<nav>` is labelled (Main, Breadcrumb, Releases, chapter list, footer "More").
- **Source review:**
  - `src/layouts/Base.astro`, `src/styles/global.css` and `public/js/{theme,site,contact}.js`
  - `src/pages/contact/index.astro`, `src/lib/contact.ts` and `worker/api/contact.ts`
  - `src/pages/accessibility.astro` and `docs/HANDBOOK.md`
- **Privacy and owner-decision spot checks for this lens:**
  - `david@dewese.com` is in no built file.
  - Amy Wilstermann appears only as "Photo: Amy Wilstermann." on 2003 photos and in the People
    photographer list (LL-45). Nothing implies a relationship.
  - Alt text names no member's life outside the band (LL-7).

## Blocking

### B1. The accessibility statement is not accurate (factual error in public copy)

File: `site/src/pages/accessibility.astro`, page `/accessibility/`.

1. **The axe claim.** The page says: *"Every page is checked with the axe accessibility engine, in
   both themes, each time the site is built, and a page that fails is not published."* That is
   false today:
   - axe runs only in `npm test` / `npm run test:a11y`.
   - `npm run build` and `npm run build:production` (`site/package.json`) do not run it.
   - There is no CI (no `.github/`).
   - Publishing is a manual `npx wrangler deploy` (`site/docs/HANDBOOK.md`, steps at lines 116–121
     and 176). Nothing stops a failing page from going out.
2. **The underline claim.** The page says: *"Links are underlined"*. Several kinds of link are
   not underlined, on purpose:
   - nav (`.nav a`), pills (`.pill`) and chapter cards (`.chapters a`)
   - the pager (`.pager a`), single titles (`.single h3 a`) and the brand
   - the YouTube facade

   Underlining is only required for links inside running text. Those are underlined, so this is
   not a 1.4.1 failure. The statement still says something untrue.
3. **Missing parts.** The statement has no date, no conformance status ("partially conforms" or
   "fully conforms"), no known limitations, and no idea of when a reader will hear back.
   - Known limitations to list now: the forced-colours issues in M1, and the Worker's error page
     being unstyled.

**Fix:**

- For (1), pick one:
  - Make the claim true: add `&& node tests/run.mjs axe` to `build:production` in
    `site/package.json`, and make `HANDBOOK.md` say to deploy only after `npm run build:production`
    passes.
  - Or reword: "Every page is checked with the axe accessibility engine, in both themes, before
    we publish changes."
- For (2), reword: "Links in text are underlined; the keyboard focus is always visible."
- For (3), add:
  - "Last reviewed: <month year>."
  - "We believe the site meets WCAG 2.2 AA except as listed below."
  - A short "Known limitations" list.
  - "We aim to reply within <n> days."

### B2. Contact form: hidden input rules, and an error path that loses the message (WCAG 3.3.2 A, 3.3.7 A, 3.3.1 A)

Files: `site/src/pages/contact/index.astro`, `site/src/lib/contact.ts`,
`site/worker/api/contact.ts` (the `page()` helper), `site/public/js/contact.js`.

1. **Rules nobody is told about (3.3.2).** `validate()` enforces several rules the form never
   states:
   - Name: no `"`, `<`, `>` or `` ` ``. Ironically, this rejects a nickname written the way the site
     itself writes David "Larry" Wilstermann.
   - Message: at least 10 characters, and no more than 3 links.
   - All four fields are required, but none is marked as required and the form has no "all fields
     are required" line.
2. **No error in context (3.3.1).** The form has `novalidate`, and `contact.js` does no checking.
   An empty or short message therefore always goes to the Worker. With or without JavaScript, the
   reply is the bare HTML page from `page()`:
   - It has no site styles and no field association.
   - It lists the messages (they are good: "Enter a message of at least 10 characters.").
   - It has one link: `<a href="/contact/">Back to the contact form</a>`.
3. **Everything typed is lost (3.3.7 Redundant Entry).** That link loads `/contact/` fresh, so the
   name, email, topic and message are gone and must be typed again.
   - The code comment says "the browser keeps the form's text". That is true only for the Back
     button, and only if the browser kept the page in its back-forward cache. It is not true for
     the link the page offers.
   - For a long message, this is the failure 3.3.7 exists to prevent.

**Fix (all in the files above):**

- Say the rules up front:
  - Add a line above the form: "All fields are required."
  - Name: add a hint tied with `aria-describedby`, or better, drop the `"` and `` ` `` ban. Header
    safety already comes from `clean()` / `headerSafe()`, and the name never reaches a header
    unencoded.
  - Message: add a hint, "At least 10 characters; up to 3 links."
- Check before sending, with the same `validate()` rules:
  - In `contact.js`, validate on submit.
  - On error: show an error summary at the top of the form (`role="alert"` or focus moved to it),
    with links to each field.
  - Per field: put the message in a `<p class="error" id="x-error">`, referenced from
    `aria-describedby`, and set `aria-invalid="true"`.
  - Keep the input.
- Without JavaScript, have the Worker's `page()` show the form again with the submitted values
  filled in and the errors beside their fields. Failing that, make the link `history.back()`-safe,
  with honest wording: "Use your browser's Back button: your message is still there."
  - Also give that page the site stylesheet, a skip link and the site's `<title>` pattern.
- Add a unit test, or a browser test in `tests/browser/`, that submits an invalid form and checks:
  the errors are announced, they are tied to their fields, and the typed values survive.

## Should fix

### M1. Forced colours / Windows High Contrast: the theme switch loses its state, and the home `<h1>` logo vanishes on a light system theme

- **Theme switch.** File: `site/src/styles/global.css` (`.theme-switch__knob` and its `::after`).
  - With forced colours on, both backgrounds are forced to `Canvas`, so the knob and the track
    disappear completely. The pressed and unpressed button look the same: compare the screenshots
    with and without `aria-pressed="true"`.
  - The visible label never changes ("Dark theme"). A high-contrast user cannot see whether the
    choice is on.
- **Home logo.** File: `site/src/styles/global.css` (`.logo-full { color: #ffffff }`), page `/`.
  - The `<h1>` logo's wordmark is drawn in `currentColor` and fixed to white. SVG fills are not
    forced.
  - In forced colours on a light system theme, "THE LUXURY LINERS" is white on white: only the
    red roundel remains.
- **Fix:**

  ```css
  @media (forced-colors: active) {
    .theme-switch__knob { forced-color-adjust: none; background: CanvasText; }
    .theme-switch__knob::after { background: Canvas; }
    .logo-full { color: CanvasText; }
  }
  ```

  Add one forced-colours browser check to `tests/browser/axe.mjs` (for example, the knob's
  `::after` is not the same colour as the knob).

### M2. Theme switch: the state indicator has less than 3:1 contrast (1.4.11, borderline)

File: `site/src/styles/global.css` (lines ~143–148).

- The knob shows the state by its position, but it is hard to see against the track:
  - Light theme: #b5121b on #111 is 2.76:1.
  - Dark theme: #ff8a80 on #fff is 2.28:1.
- I count this as borderline, not blocking: the page's own theme also shows which state is on.
- **Fix**, either:
  - Give the knob a 2 px ring in `var(--bg)`.
  - Or use a white knob in light and a #111 knob in dark, keeping the red and pink only as an
    inner dot.

  Either gives at least 3:1 against the track.

### M3. Home hero: the first listen pill hides where it goes (2.4.4 advisory)

File: `site/src/pages/index.astro` (line 22: `label: \`Listen to ${LATEST.title}\``).

- The first pill reads "Listen to New Beginning" and opens Spotify. The second one does say
  "Apple Music".
- A screen-reader user moving by links gets no hint that the first link leaves the site for
  Spotify.
- **Fix:** label it "Spotify" (the list already has `aria-label="Listen to New Beginning"`), or
  "Listen to New Beginning on Spotify".

## Minor

- **m1. YouTube iframe title.** File: `site/public/js/site.js`.
  - The iframe title is just the song ("Great Day").
  - **Fix:** use `"“" + title + "” on YouTube (video player)"`, so a list of frames is clear.
  - Also: the facade is a link, so Space scrolls the page instead of playing. That is expected for
    a link and fine, but worth noting in the statement's "Videos" line.
- **m2. Cover alt text** on release pages (`site/src/components/Cover.astro`).
  - "Sleeve art for Believe EP by The Luxury Liners." names the cover but does not describe it.
  - Every release page already says who and what next to it, so this is not a failure.
  - **Fix:** describe the art in one short phrase, for example "Believe EP sleeve: a black
    silhouette of a guitarist leaping across the red L roundel."
- **m3. Stacked shows table at phone width.** File: `site/src/styles/global.css`, `.table--stack`,
  page `/shows/`.
  - Under 640 px the column headers are visually hidden. Cells are `display:block`, which strips
    the table's meaning in some browsers (Safari).
  - **Fix:** add a visible label per cell, using `data-label` plus `td::before{content:attr(data-label)}`,
    or keep the table and allow it to scroll in `.table-scroll` with `tabindex="0"` and
    `role="region"` `aria-label`.
  - Separately, `<time datetime="1997-09">` contains "Probably autumn 1997 or winter 1998". Make
    the `datetime` no more precise than the text (`1997`), or drop it.
- **m4. Text-only resize to 200%** at 1280 px scrolls sideways on these pages:

  | Page | Horizontal scroll |
  |---|---|
  | `/` | 168 px |
  | `/story/nonetheless/` | 165 px |
  | `/story/overbored/` | 103 px |
  | `/story/great-day/` | 80 px |
  | `/story/sound-as-ever/` | 49 px |
  | `/story/believe/` | 6 px |

  - Causes:
    - On `/`: `.people` uses `repeat(4, 1fr)`, and "WILSTERMANN" will not shrink.
    - On the story pages: the `.story` grid uses `minmax(0,66ch) minmax(260px,1fr)`.
  - Browser zoom (the normal way to resize) reflows correctly at 320 px, so 1.4.4 is met.
  - **Fix:** use `repeat(4, minmax(0,1fr))` and `overflow-wrap:anywhere` on `.people h3`. Set the
    `.story` breakpoint in `em` (`@media (min-width: 60em)`) so the two columns start only when
    there is room.
- **m5. Home `<h1>` is an SVG only** (`role="img"` with `<title>`). It works in current browsers and
  screen readers.
  - **Fix**, more robust: `<h1><span class="visually-hidden">The Luxury Liners</span><svg aria-hidden="true">…</svg></h1>`.
- **m6. `.title-xl` uses `overflow-wrap:anywhere; hyphens:auto`.** At 320 px, long single words
  ("ACCESSIBILITY", "WILSTERMANN") break mid-word without a hyphen in uppercase Archivo Black.
  - It is readable, but `overflow-wrap: break-word` (not `anywhere`) together with a slightly
    smaller clamp minimum keeps words whole more often.

## Verified OK (no action)

- **Landmarks.** One `main` (`#main`, `tabindex=-1`) and one masthead `header`. Hero `section`s
  are labelled by their headings. The story `aside` is labelled ("Alongside this chapter").
- **Page titles.** Every page has a unique, descriptive `<title>`, and `lang="en"` is set.
- **Track numbers.** The decorative `.oval` numbers are `aria-hidden`, and each has a visually
  hidden "N. " text twin inside an `<ol>`.
- **Home single covers.** The linked covers are duplicates (`aria-hidden="true"`, `tabindex="-1"`,
  `alt=""`), and the heading link next to each carries the name.
- **Theme switch semantics.** A real `<button>` with `aria-pressed`, a constant label, and Space
  and Enter both work. It is hidden without JavaScript, and the CSS then follows the system
  setting.
- **Target size (2.5.8).** Passes axe at every width. Pills and buttons are 40–48 px tall.
- **Reduced motion.** `prefers-reduced-motion` turns off every animation and transition, including
  the video spin. The cut-out "jump" plays once, for 0.7 s.
- **Contact form labels.** Every field has a visible `<label for>`. The email hint is tied with
  `aria-describedby`, and `autocomplete` is set on name and email. The honeypot is
  `aria-hidden` and `tabindex=-1`.
- **No new-tab links**, and nothing changes on focus or on input.
