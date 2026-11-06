# Audit: accessibility (WCAG 2.2 AA), round 2

Reviewed 2026-11-06 against commit 3323ed0 ("Round-1 audit fixes, part 2"), design C "Roundel"
(LL-44). Lens: WCAG 2.2 level AA. I did not edit any site file.
Authority: DECISIONS-2026-10-07.md (LL-1..LL-45) > daviddewese.com DECISIONS > plan > research.

**Score: 8.6 / 10. Approved.** Nothing is blocking. Both round-1 blockers (B1, the accessibility
statement, and B2, the Contact form's error handling) are fixed. All of round 1's should-fix and
minor items are fixed except one alt text (m2, on one release). What remains is two forced-colours
problems and a few small items. None of them fails a WCAG 2.2 AA success criterion.

## What I ran

All of it was run in a fresh `git clone` of the branch in my scratchpad. The first `npm test` in
the shared `/home/user/theluxuryliners.com/site` failed: another build rewrote `dist/` while mine
was rendering (`ERR_MODULE_NOT_FOUND .../dist/.prerender/chunks/Base_*.mjs`). See n4.

- **Tests:** `npm ci && npm test`.
  - Every suite passes: data, unit, dist, jsonld, repo and axe (370 of 370 page checks, behaviour
    200 of 200).
  - `node content/check-content.mjs` and `--dist`: 0 errors.
  - `RELEASE=1 node scripts/check-dist.mjs` fails only on the two expected keys:
    `PUBLIC_TURNSTILE_SITE_KEY` and `PUBLIC_CF_ANALYTICS_TOKEN`.
- **Axe sweep (my own):** `@axe-core/playwright` on all 37 pages plus `/404.html`.
  - Tags: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa and best-practice.
  - Light and dark, at **1440, 375 and 320 px**: 222 runs.
  - Result: **0 violations and no horizontal scroll.**
  - The only "incomplete" results are `color-contrast` on the decorative `.oval` numbers (the
    background is a pseudo-element). Round 1 checked these by hand: 6.85 to 18.88:1. Each number
    also has a visually hidden text twin.
- **Keyboard walkthrough (scripted, every page):** I pressed Tab to the end of each page, in light
  and dark, at 1440 and 320 px, under reduced motion: **4,944 focus stops**. For each stop I
  recorded:
  - the outline style and width
  - the outline's contrast against the nearest painted background
  - whether `elementFromPoint` finds the element itself, to catch focus hidden behind something
    (2.4.11)
  - the tab order

  Results:
  - Every stop has a 3 px solid outline with at least 3:1 contrast. Nothing is obscured, and
    nothing receives focus while off-screen.
  - The skip link is the first stop on every page, and `main#main` takes focus.
  - The only "backwards" jumps are the deliberate two-column reading order: `/people/` (left column,
    then the Photographers column) and the release pages (text, then the video column). That
    matches the visual order.
- **Headings, landmarks, titles:** one `<h1>` per page and no skipped levels.
  - Every page has one `main`, one masthead `header` and one `footer`, and every `<nav>` is
    labelled (Main, Breadcrumb, Releases, the chapter list, More). Nothing sits outside a landmark.
  - Every page has a unique `<title>` and `lang="en"`. No links open a new tab, and no link has
    vague text such as "here" or "read more".
  - The home `<h1>` is now visually hidden text plus an `aria-hidden` SVG (round-1 m5 fixed).
- **Alt text:** I listed every `<img>` on every page.
  - The photos describe what is in them.
  - The covers describe their art, except one (m1).
  - Duplicate linked covers are `alt=""` inside `aria-hidden` containers.
  - No alt text says anything about members' lives outside the band (LL-7).
- **Contrast over images:** no text sits on a photograph.
  - The facade label is #111 on a white pill over #111.
  - Collage and chapter captions are white on the red band, below their images: 9.37:1 in dark.
  - The cut-outs (`.jump`) sit above their captions, with margin between them.
- **Contact form, with JavaScript:** I tested `/contact/?topic=accessibility` in light and dark at
  375 px.
  - The topic is preselected.
  - With a nickname in quotes (`David "Larry" Wilstermann`) and a 5-character message:
    - Focus moves to the error summary, and both broken fields get `aria-invalid="true"`.
    - Each field's description reads the hint and then the error.
    - The summary link moves focus to `#email`.
    - Every value is kept, and the nickname is accepted.
    - Axe on the error state: 0 violations.
- **Contact form, without JavaScript:** I loaded the Worker's `fillForm()` output (from
  `worker/api/contact.ts`), built from `dist/contact/index.html` with three errors, with `.js`
  blocked.
  - The title is "Error: Contact | The Luxury Liners".
  - The summary has `role="alert"`, and the errors sit beside their fields.
  - Name, email, topic and message are all restored.
  - Axe: 0 violations in both themes.

  Round-1 B2 is fixed (3.3.1, 3.3.2, 3.3.7).
- **YouTube facade:** with reduced motion, a click swaps in the iframe at once, focus moves into
  it, and its title is "“Great Day” on YouTube (video player)" (round-1 m1 fixed). Without
  JavaScript it is a plain link. At 320 px with text at 200% the "Play …" label still fits inside
  the frame (16–304 / 20–300 px).
- **Reduced motion:** no element has a running animation or transition, and `scroll-behavior` is
  `auto`.
- **Text-only resize to 200%** (`html{font-size:200%}`) at 1280 px: no horizontal scroll and no
  clipped text on any page (round-1 m4 fixed).
- **Text spacing (1.4.12):** the 1.4.12 values injected on every page. No horizontal scroll and no
  clipped text.
- **Forced colours:** screenshots of `/`, `/contact/` and `/music/believe-ep/`, in a light and a
  dark system scheme.
  - The theme knob now shows its state, and the home logo is drawn in `CanvasText` (round-1 M1
    fixed).
  - Two new problems, S1 and S2 below.
- **Theme switch:** `theme.js` always sets `data-theme`, so `aria-pressed` matches the theme shown,
  including when it follows the system setting. The knob now has a ring in the page colour
  (round-1 M2 fixed).
- **Shows table:** `data-label` adds a visible label to each stacked cell, and `datetime` is no
  more precise than the text (`1997` for "Probably autumn 1997 or winter 1998"). Round-1 m3 fixed.
- **The accessibility statement** (`site/src/pages/accessibility.astro`): I checked each claim
  against the build.
  - "Links in running text are underlined": a script found no in-text link without an underline,
    on any page.
  - "Every page works without JavaScript": true when no Turnstile key is set, and the sentence
    changes when one is.
  - "Before each release … The production build stops if a page fails": `build:production` runs
    `node tests/run.mjs axe`, `.github/workflows/ci.yml` runs `npm test`, and `HANDBOOK.md` says to
    deploy only after the checks pass.
  - It has a date, a conformance status ("partially conforms") and a list of known limitations.

  Round-1 B1 is fixed. One small gap remains (m2).
- **Privacy and owner-decision spot checks (this lens):**
  - No email address of any kind is in the built HTML, JSON or text.
  - "Amy Wilstermann" appears only as "Photo: Amy Wilstermann." on the 2003 photos and in the
    People photographer list (LL-45). Nothing implies a relationship.
  - Waco appears only for the live "Shake It Up" recording, which LL-10 and LL-18 allow.
  - No talent show, no newsletter, no MP3 links.

## Blocking

None.

## Should fix

### S1. Forced colours: the "current page" marker in the main nav disappears

Where: `site/src/styles/global.css` (`.nav a { border-bottom: 3px solid transparent }` and
`.nav a[aria-current="page"] { border-bottom-color: var(--head) }`). Seen on every page; the
screenshot was `/music/believe-ep/` with forced colours on.

- In forced colours the browser repaints the transparent border, so every nav link (STORY, MUSIC,
  PEOPLE, VAULT, LISTEN) gets the same underline.
- The red underline that marks the current section is lost.
- `aria-current` still tells screen readers, so this does not fail 1.3.1 or 1.4.1. It is still a
  real loss for Windows High Contrast users.

**Fix:** in the existing `@media (forced-colors: active)` block, add:

```css
.nav a { border-bottom-color: Canvas; }
.nav a:hover, .nav a[aria-current="page"] { border-bottom-color: Highlight; }
```

Then add one assertion to the forced-colours check in `tests/browser/behaviour.mjs`: the current
link's `border-bottom-color` differs from its siblings'.

### S2. Forced colours: the Contact "Send" button has no visible edge

Where: `site/src/styles/global.css` (`.button, button[type="submit"] { border: 0; background: var(--red-fill) }`).
Page: `/contact/`, with forced colours on, in a dark system scheme.

- The background is forced to `ButtonFace`, which matches `Canvas`, and there is no border.
- So "Send" shows as bare text, with nothing to show that it is a button.
- `.button` links (if any are used) have the same problem.

**Fix:** use `border: 2px solid transparent` instead of `border: 0`. Normal rendering does not
change, and forced colours paints the border as `ButtonText`. Alternatively, in the forced-colours
block: `button[type="submit"], .button { border: 2px solid ButtonText; }`.

## Minor

- **m1. One cover alt is still only a name** (round-1 m2, one left).
  - Where: `/music/shake-it-up-live/`, `shake-it-up-live-600.jpg`. The alt is "Sleeve art for
    Shake It Up (Live at the Texas Music Café) by The Luxury Liners."
  - Every other cover now describes its art. This is not a failure, because the release is named
    around the image.
  - **Fix:** describe the art in one phrase, through the cover-alt source the other releases use
    (`data/releases.json` or `site/src/components/Cover.astro`).
- **m2. The accessibility statement gives no reply time.**
  - Where: `site/src/pages/accessibility.astro`, "Tell us about a problem".
  - Round 1 asked for "We aim to reply within <n> days." It is good practice (and expected in
    EN 301 549 and similar statements), not a WCAG requirement.
  - **Fix:** add one sentence with a time the band can keep. Also list S1 and S2 under "Known
    limitations" until they are fixed.
- **m3. The no-JavaScript error page leaves focus at the top of the page.**
  - Where: `worker/api/contact.ts`, `fillForm()`.
  - The summary has `role="alert"`, but some screen readers do not announce an alert that is
    already in the page when it loads. The "Error:" in the title (G200-style) partly covers this.
  - **Fix:** put `id="errors"` on the summary, so the Worker can answer with a URL that ends in
    `#errors`. Or, simpler, add `autofocus` to the first `<a>` in the summary list that
    `fillForm()` writes.
- **m4. A misleading message when Turnstile has not finished.**
  - Where: `src/lib/contact.ts` (`MESSAGES.noToken`) and `public/js/contact.js`.
  - With JavaScript on, if the visitor presses Send before the Turnstile widget has produced a
    token, `contact.js` posts anyway. The Worker then answers "Please turn on JavaScript and send
    it again", but JavaScript is already on.
  - **Fix:** in `contact.js`, when `.cf-turnstile` is on the page and
    `form['cf-turnstile-response']` is empty, show a form-level error before sending: "The spam
    check is still running. Wait a moment and press Send again."
- **m5. The facade label could clip with a long title.**
  - Where: `site/src/styles/global.css`, `.yt__label`.
  - It is `white-space: nowrap` inside an `overflow: hidden` frame. Today's longest label fits at
    320 px with text at 200%, with 4 px to spare. A longer song title would be clipped (1.4.4 or
    1.4.10).
  - **Fix:** `white-space: normal; max-width: calc(100% - 24px); text-align: center;`.

## Notes (not scored)

- **n1. `/admin/` (the Decap shell)** is left out of `allPages()` and is not public content.
  I did not audit Decap's own interface.
- **n2. Bare Worker error pages.** The Worker's plain-text 403, 405 and 415 replies, and the
  last-resort `page()`, are still unstyled. A visitor using the form never sees them, so this is
  acceptable.
- **n3. The `repo` suite needs a git checkout.** It fails in a `git archive` export with
  "not a git repository". It passes in a real clone. If the repository is ever built from a
  tarball, make that suite skip with a message.
- **n4. Shared `dist/`.** Parallel builds in the same working tree overwrite each other's `dist/`.
  For future audit rounds, build in a separate clone.

## Round-1 follow-up

| Round 1 | Status |
|---|---|
| B1 statement accuracy | Fixed |
| B2 form rules, errors, lost input | Fixed (JS and no-JS paths verified) |
| M1 forced colours: switch and logo | Fixed (new S1 and S2 found) |
| M2 knob contrast | Fixed |
| M3 hero pill names Spotify | Fixed ("New Beginning on Spotify") |
| m1 iframe title | Fixed |
| m2 cover alts | Fixed except Shake It Up (m1) |
| m3 stacked table and datetime | Fixed |
| m4 200% text resize | Fixed |
| m5 SVG-only h1 | Fixed |
| m6 mid-word breaks | Not re-checked at length. Axe and the behaviour suite's "headings that break inside a word" check pass |
