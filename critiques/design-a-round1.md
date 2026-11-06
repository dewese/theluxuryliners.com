# Critique: design sample A, "Stitched" (round 1)

Reviewer: independent critic. Date: 2026-11-06.
Under review: `design/samples/a-stitched/` (commit 58043fe).

**Score: 8 / 10. Approved: yes. Blocking issues: none.**

I checked everything myself, without relying on the worker's test script. I served the folder with `python3 -m http.server` and drove the preinstalled Chromium through `playwright-core` with my own scripts. I also read every line of visible copy against the decisions file, `data/releases.json`, `data/assets.json`, `content/*.md` and `content/people.json`, and against the known-issues list.

## What I verified

| Check | Result |
|---|---|
| axe-core (wcag2a/aa, 2.1, 2.2 AA **and best-practice**), 3 pages × light/dark × 1440/375 | 0 violations everywhere |
| Horizontal scroll at 1440/375/320, both themes | none (scrollWidth = clientWidth; no element past the right edge) |
| Broken images / 4xx responses / console errors | none |
| Off-site requests on load (all 18 combinations) | 0 |
| Fonts | Archivo Display + Inter roman/italic, self-hosted, all loaded |
| Inline `style=` attributes | 0 |
| Skip link | first tab stop, moves focus to `<main id="main">` |
| Focus rings | 3 px solid in the ink colour on every stop (white in the deep-sky band) |
| Theme toggle | label stays "Light theme"; only `aria-pressed` and `data-theme` change (false/dark → true/light) |
| YouTube facade | nothing loaded before click; after click only `www.youtube-nocookie.com` loads; iframe has a title and gets focus. No-JS fallback is a plain link |
| Video IDs | `qjZaiwO7KXI` = "Great Day" on The Luxury Liners Topic channel (the art track); `M0FOgNUWHlw` = "The Luxury Liners - Equasue" on @theluxuryliners (checked via oEmbed) |
| Mobile nav at 375/320 | wraps cleanly onto two rows (Story Music People Shows / Vault Facts), 41 px tap height, no overlap |
| Logos | every `d` in `logos/*.svg` and `logos/web/*.svg` occurs byte for byte in `assets/derived/logos/*.svg`; the only change is near-black → `currentColor` in `logos/web/`, and the README notes it |
| `check_sample.py` | 0 errors; `--self-test` shows all 15 probes fire; `content/check-content.mjs --dist-only` gives 0 errors and 0 warnings |
| Folder size | 7.6 MB (under the limit, but only just; 4.5 MB of it is screenshots) |
| Page weight | home ≈1.1 MB, Overbored ≈0.7 MB, story ≈0.23 MB. Only the current theme's plate is fetched |

## Owner decisions, privacy and facts

All pass:

- **LL-6:** the one-liner is verbatim, in the page and in the meta description.
- **LL-17:** the status line is "Founded in 1997. Two new singles in 2026. The band never broke up." This is `content/home.md` verbatim. There's no reunion wording, and the reconnection sentence isn't used in a partial form.
- **LL-13:** no talent show, demo, bonus disc or *Make The Best Of It* anywhere. "Great Day" is described only as "The first of the two". No link goes to a page that lists the demo; the footer Bandcamp link is the artist root, as LL-36 says.
- **LL-27 / LL-40 / LL-39:** no downloads, no newsletter and no designer credit. The colophon says "The band's logos date from 1999–2002."
- **LL-7 / LL-19 / LL-31:** names, roles, years and band-era photos only. No state-per-member wording, no college, no addresses or phones, and no email address in any HTML, JS or CSS (I grepped for it).
- **People:** the role lines follow `people.json`. David and Chad's lines say "writes songs" (known issue fixed). The context line under the 2002 plate is right: "Chad left Nashville in March 2001, a year before this photo. All four play on the 2026 singles." The P23 caption is exact.
- **Overbored:**
  - The facts match the data: May 2003 (Spotify P6 date), Litterbug LLCD1003, 10 tracks and 36:23, every track duration, the TV placements (with the One Tree Hill air date and the FOX Sports theme), and the credits (Seykora on 3 and 6, Nightwine, Henning, and LL-23 cover art).
  - The lede avoids "ten songs by the trio" (known issue fixed).
  - The songwriting sentence matches the Discogs per-track credits endorsed by LL-14, and the withheld X1 credit isn't exposed.
  - The press excerpts are exactly as printed in `press.json`, and the one-sheet quote is from story 06.
- **Story ch. 2:** the copy is `02-nudie-suits.md` verbatim (LL-20, LL-22, LL-24, LL-18). The dek is reworded from "Emmylou Harris in the audience" to "Emmylou Harris at Zanies". That's actually closer to LL-20, which says they *met* her, but the README's "unchanged" claim is then not quite true. The Manuel/Nudie quotation isn't used at all (known issue avoided). The Shake It Up caption follows LL-18 and LL-23.
- **Cover-rights line:** shown only on pages with a cover, and all three pages have one (known issue fixed).
- **No sourcing notes in public copy.** The single-source Discogs writer credits are owner-endorsed by LL-14.

## Design judgement

### Strong

- **The engraved plates are the best thing in the sample.** They're large (about 1040 CSS px), drawn in long line work with 20 or more lines across each face, and nothing like the mushy small engravings flagged last time. Using an alpha mask in the ink colour means the plate re-inks instantly with the theme. In both themes the plate reads as a positive image: highlights in dark, shadows in light.
- **The type has a real point of view.** Condensed ExtraBold Archivo capitals echo the crossed-X wordmark well, and Inter keeps the body calm. The oxblood/blush pair is rich, and the navy/powder story era and deep-sky 2026 band give the site a sense of time without losing the anchor.
- **The rose spray is one bold element, not dashed patches.** The rhinestones and the per-petal stitch direction are a nice idea. Using it once per page is disciplined.
- **The Overbored page is a clean, credible release page.** Cover, meta row, streaming pills, tracklist with placements, credits, press, video and plate are all in a sensible order.

### Weak (should fix next round; not blocking)

1. **On a phone, the home page doesn't lead with the 2026 singles.** At 375 px the first screen shows the large stacked logo, the one-liner, the status line and two buttons. The rose, the "Latest release" label and the New Beginning cover all start below the fold (y ≈ 830 or lower). LL-26 says the home page *leads* with the singles. Move the latest-release block above the one-liner on narrow screens, or shrink the stacked logo there.
2. **The "Great Day" cover appears three times on the home page:** hero inset, singles card, and the video poster at about 760 px wide. The big kite poster is the weakest panel on the page. Use a smaller facade, or a different frame, or put the video facade beside the cards.
3. **The "collage" is a plain 3-column grid on desktop and a single stacked column on mobile.** It doesn't overlap, vary in scale or tilt at all. LL-32 asks for a collage that celebrates the best-dressed eras. Right now the 1998 suits and the c. 2000 studio shots are no bigger than the 2003 snapshot. Give the pale-blue backstage photo and one white-studio shot the hero scale.
4. **The pale-blue-suit photo sits right beside "They wore Nudie suits on stage … Manuel suited them up"** on the story page. The caption is neutral, but the layout implies that these plain pale-blue suits are the Manuel/Nudie suits, and nothing says so. Move it beside the rhythm-section or Billboard paragraph, or open the chapter with the embroidered *Shake It Up* artwork instead, which actually shows Western suits.
5. **Scan borders aren't cropped.** There are white strips on the 1998 backstage photo (top), the Hard Rock photo (top and bottom) and the story's pale-blue trio (right edge). They look unfinished against oxblood and navy.
6. **The rose reads more as a flat vector sticker than as satin stitch at 1x.** The thread hatching is too fine and too low in contrast to see. Coarser, higher-contrast thread lines, or a sheen gradient per petal, would sell the embroidery.
7. **The Overbored credits block is cramped.** The songwriting sentence sits right under "Cover art David Dewese" with no space, in small type. It also leaves a large empty area below the credits column at 1440. The story page has the same lopsided empty left column at the bottom of the body.
8. **There's no `forced-colors` fallback for the mask plates.** In Windows High Contrast the masked background is forced to Canvas, so the engravings disappear. Only the aria-label survives. Add `@media (forced-colors: active)` with `forced-color-adjust: none`, or an `<img>` fallback.
9. **Housekeeping:**
   - `img/2002-four.webp` (185 KB) is built but never referenced.
   - "Album · 2003" and "May 2003" repeat each other on the release page, and the big "2" repeats "Chapter 2" on the story page.
   - The chain-stitch rule ends in a clipped half-link at the right edge.
   - The README says the story copy is "unchanged", but the dek was reworded.
10. **The Hard Rock alt says "white suits"** (from `assets.json`), while the collage intro groups both 1998 photos as "Pale-blue suits in 1998". Make them agree.

## Verdict

There are no owner-decision violations, no privacy leaks, no factual errors and no failing a11y or overflow checks. Every known issue from the lost run has been handled. The design is coherent and the engravings are excellent. It loses points for the mobile hero order (item 1), the repetitive Great Day imagery and a timid collage (items 2 and 3), and the implied claim about the pale suits (item 4). **8/10, approved.** Items 1–4 should be fixed if this direction is chosen.
