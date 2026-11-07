# Critique: design sample C "Roundel", round 1

Critic: independent, harsh. Date: 2026-11-06. Folder under review: `design/samples/c-roundel/`.

**Score: 8.0 / 10. Approved: yes. No blocking issues found.**

I re-ran every check myself and did not rely on the worker's claims. I served the folder with `python3 -m http.server` on a dedicated port (127.0.0.1:18743) and confirmed it was this sample: the footer reads "Design sample C, “Roundel”". I drove the preinstalled Chromium through playwright-core and ran axe-core from `site/node_modules`.

## What I verified

| Check | Method | Result |
|---|---|---|
| axe-core (wcag2a/aa, 21a/aa, 22aa, best-practice) | 3 pages × light/dark (via `prefers-color-scheme`, which the theme script follows) × 1440, 768, 375 and 320 = 24 runs | **0 violations** in all 24. The only "incomplete" results are 10 nodes on Overbored and 9 on the Story page: the track and chapter numbers, whose red oval is a `::before` pseudo-element. I checked them by hand: white on `#B5121B` is 6.85:1, and `#111` on white in the current-chapter oval passes. They are also `aria-hidden` duplicates of real text. |
| Theme actually applied | `data-theme` after load | Matches the emulated scheme in every run. Light is the default, a stored choice wins, and the toggle sets `aria-pressed`. |
| Horizontal overflow | `scrollWidth` compared with `clientWidth`, plus a scan for any element past the right edge | none at 1440, 768, 375 or 320, in either theme |
| Broken images, fonts | `naturalWidth` after scrolling; `document.fonts` | 0 broken. All three self-hosted faces report `loaded`. |
| Requests on load | any request not to the local origin; any 4xx | **0** in every run. A roundel favicon is declared, so there is no `/favicon.ico` 404. |
| YouTube facade | click on Overbored | 0 off-site requests before the click. After it, the iframe is `youtube-nocookie.com/embed/M0FOgNUWHlw`. Without JavaScript the link falls back to `youtube.com/watch`. The video IDs are the same ones verified in the design-b critique (Great Day Topic art track; Equasue on @theluxuryliners). |
| Keyboard | Tab through every page in both themes | 39, 33 and 38 stops. Every stop has a visible outline or ring. "Skip to content" is the first stop, and after Enter the next Tab lands inside `<main>`. |
| Logos | every `d` in `logos/*.svg`, `logos/web/*.svg` and `logos/sprite.svg`, compared with `assets/derived/logos/*.svg` | All paths are byte-identical (0 missing out of 49 in the sprite). |
| Banned content | `python3 check_sample.py` (+ `--self-test`: 19 probes fired); `node content/check-content.mjs --dist-only .`; my own grep of the HTML/CSS/JS/SVG for the contact address, Gmail, mailto, talent show, demo, bonus disc, Kool Kat, downloads, MP3, newsletter, college, parents, the founding town, member states and designer | all clear. 0 errors, 0 warnings, 0 hits. The README and tools mention these terms only as rules. |
| Size | `du` | 6.7 MB (screenshots are 5.0 MB of that), under 8 MB |
| Screenshots | `overview.png` | 8064×4292, so it was taken at deviceScaleFactor 2 and shows the three pages side by side. Per-page JPEGs are present. |

## Facts and owner decisions (all pass)

- **LL-6** is verbatim in the hero and the meta description, with straight quotes as in the decision. **LL-17** is verbatim in the singles intro. **LL-26:** the hero is the 2026 singles ("Latest release: New Beginning, April 2026", both covers, listen links), and the full singles section comes straight after it. **LL-9 / LL-14:** "written by Chad and David and played by all four forever members" is correct.
- **LL-32:** the collage is present and includes the forever-members photo with the exact P23 caption. See M2 for how it is weighted.
- **LL-13:** "Great Day" is described only as "The first of the two." No page or link says or implies it is the demo. **LL-27:** there are no downloads. **LL-39:** there is no designer credit; the colophon reads "The band’s logos date from 1999–2002." **LL-40:** there is no newsletter. **LL-31:** the contact address is not printed. **LL-36:** Instagram, Facebook and David's Bandcamp are linked, and SoundCloud is not.
- **Releases** (checked against `data/releases.json`):
  - New Beginning: 2026-04-17, Litterbug.
  - Great Day: 2026-02-13.
  - All DSP URLs match.
  - Overbored: May 2003, LLCD1003, 10 tracks, 36:23. All ten titles and durations match. Paul Seykora on "Dreaming" and "Woman" matches the track-level `keyboards` fields. Personnel roles match.
  - One Tree Hill S1E15, The WB, 2004-02-24, and the FOX Sports theme are both correct.
  - Believe EP: March 2001, Echomusic. Durations 3:28 / 2:37 / 2:50. "Believe" is credited to Cher (P27).
  - Pager order: Believe EP → Overbored → Nonetheless is correct.
- **Story chapter 4** is word for word from `content/story/04-believe.md`. The Overbored lede is word for word from `06-overbored.md`. The chapter index titles and years match all nine front-matter blocks.
- **Press:** all three excerpts, writers and dates match `content/press.json` exactly.
- **Photo credits** follow `credit_status`: Mark Montgomery appears only on `named-credit-confirmed` c. 2000 frames, and Amy Wilstermann only on the 2003 promos. Uncredited photos carry no credit. Nobody is named in a photo whose positions are unconfirmed. "Chad's last show with the band, March 2001." is supported by LL-15.
- **People** text and roles are exactly as in `content/people.json`.
- **Privacy (LL-7, plan §2.3):** clean. There are no states, no town, nothing about family and nothing about later lives.

## Design judgement

This is the strongest of the three directions on brand. The full condensed-over-roundel lockup as the `h1` on a sky-blue band, with the tilted New Beginning cover and a kite card overlapping it, is a confident first screen. It reads as "now", and it is unmistakably this band's logo. The roundel used as a system (section marks, pill icons, play button, favicon, white-on-red footer mark) is disciplined and never redrawn. The Believe-cover idea, a real cartwheel cut-out leaping out of a ring, is the best single device across the samples, and the matte is clean at display size. The Story chapter head, with the real Believe cover on full red, is excellent and very on-concept. The Overbored page is clear and scannable: tracks as red-oval numbers with the placements attached, credits as a ruled list, and quotes in big Archivo Black on red. The dark theme is a considered palette (`#FF8A80` heads, a deeper red band and a deep sky band), not an inversion. Mobile at 375 and 320 is tidy.

## Major issues (should fix; not blocking)

- **M1. The known design-b mistake is repeated on Overbored.** The section headed "“Equasue” on YouTube" has body copy that is entirely about the two TV songs ("Two of its songs went to television…"), placed next to the Equasue player. The heading softens it, but the juxtaposition still suggests Equasue was one of them, and the TV facts already appear in the track list directly above. This was a "known issue to avoid". Fix: give the Equasue block its own copy (for example, that it is on the band's channel and that *Nashville Rage* singled it out), or use the One Tree Hill or FOX Sports clip here (LL-35).
- **M2. The collage's weighting works against LL-32, and it has a hole.** The largest photo in the collage is the 2002 green-T-shirt shot against concrete, which is the least dressed-up frame. The 1998 pale-blue suits, the "cooler earlier eras" the owner asked the collage to favour, are the two smallest cards. At 1440 px there is also a dead block of red about 330 px tall under the cartwheel in the left column, while the right column runs on. Rebalance: make a 1998 suit photo or the dance frame the large one, keep the 2002 photo medium, and fill the left column (the coats frame, or the unused `1998-hard-rock` white-suit stage shot, would do it).
- **M3. Photo and cover repetition.** On the home page, the Great Day cover appears three times above the fold-and-a-half: in the hero stack, on the single card, and as a 960 px video poster. The New Beginning cover appears twice. On Overbored, two near-identical 2003 trio promos are captioned "The trio in 2003" twice, and the full-width one is mostly blank pavement. Use a distinct image for the video poster (or a tighter, smaller facade), and drop one of the two trio photos from Overbored or crop it hard.

## Minor issues

- m1. The 2002 caption's context line says "Chad left Nashville in March 2001, a year before this photo". The asset is dated only "2002", so "a year before" is an inference. Say "Chad had left Nashville in March 2001" and leave it there.
- m2. `img/1998-hard-rock.webp` is built but unused (dead weight in a public repo). Either use it (see M2) or drop it.
- m3. The theme toggle is only in the footer. That is fine for a sample, but a reader on a dark-scheme device who wants light has to scroll to the bottom.
- m4. Story chapter cards: titles that wrap to one line and to two lines sit at different vertical offsets (cards 2, 3, 5 and 6 compared with 7, 8 and 9), so the grid looks slightly uneven.
- m5. On the home page the "Hear the records" door points at `overbored.html`, and the nav's "Music" link is marked current on the album page. That is acceptable for a three-page sample, but in the build "Music" should go to `/music/`, which the breadcrumb already does.
- m6. The Believe EP card leaves out the Tidal and Deezer links that `releases.json` has. (Overbored's Tidal listing is flagged in the data as incomplete, so consider leaving that one off.)
- m7. The cut-out is built from a 604 px Flickr derivative. It holds at the current size, but it must not be scaled up. The original is still to be fetched (assets.json flag).
- m8. The overview PNG uses a 256-colour palette, so photos band in it. This only affects reviewers.

## Verdict

There are no owner-decision violations, privacy leaks, factual errors or accessibility failures. All checks pass as the README claims, and the logos are verbatim. The direction is distinctive and the best expression of the band's own marks so far. Points come off for repeating design-b's Equasue/TV juxtaposition (a listed known issue), a collage that undersells the best-dressed eras and leaves a gap, and repeated imagery. **8.0/10, approved.**
