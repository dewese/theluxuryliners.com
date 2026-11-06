# Critique: design sample B "Tonight, No Cover", round 1

Critic: independent, harsh. Date: 2026-11-06. Folder under review: `design/samples/b-tonight-no-cover/`.

**Score: 8.0 / 10. Approved: yes. No blocking issues found.**

I re-ran everything myself and did not rely on the worker's claims. I served the folder on a dedicated port (127.0.0.1:18732) and confirmed it was this sample: the footer reads "Design sample B, “Tonight, No Cover”".

## What I verified

| Check | Method | Result |
|---|---|---|
| axe-core (wcag2a/aa, 21a/aa, 22aa, best-practice) | my own Playwright run of 3 pages × light/dark × 1440, 768, 375 and 320 = 24 runs | **0 violations** in all 24. The only "incomplete" items are color-contrast on text over images and facades, which I checked by eye and found fine. |
| Horizontal overflow | `scrollWidth` compared with `clientWidth`, plus a scan for any element past the right edge | none at any width |
| Broken images | `naturalWidth === 0` after scrolling through each page | 0 |
| Network requests on load | any request not to the local origin | **0** in every run. The fonts are self-hosted. The one 404 is `/favicon.ico`: no favicon is declared (minor). |
| YouTube facade | click, then inspect the iframe and the hosts it contacts | Nothing is requested before the click. After the click the iframe is `youtube-nocookie.com/embed/<id>`. Without JavaScript the link falls back to `youtube.com/watch`. |
| Video IDs | YouTube oEmbed, fetched live | `qjZaiwO7KXI` = "Great Day" on The Luxury Liners - Topic channel. `M0FOgNUWHlw` = "The Luxury Liners - Equasue" on @theluxuryliners, the band's own channel. Both correct. |
| Keyboard | Tab through every page in both themes | 38, 28 and 28 tab stops, each with a visible 3 px outline. "Skip to content" is the first stop. After Enter, the next Tab lands on the first link inside `<main>`. |
| Theme | OS dark preference, no stored choice | Light, as the plan says (B is light by default). The toggle flips the theme and `aria-pressed`, and the choice persists across pages. Without JavaScript the toggle is hidden. |
| Logos | every `d` in `logos/*.svg` compared with `assets/derived/logos/*.svg` | All 36 path strings are byte-identical. Only the fill colour is changed (see M3). |
| Banned content | `python3 check_sample.py` (and `--self-test`), `node content/check-content.mjs --dist-only …` | all clear. 0 errors, 0 warnings. |
| Size | du / checker | 7.21 MB, under 8 MB |
| Contact address / Gmail / phone / college / towns / states-per-member | grep of every file in the folder, including the README and tools | absent |

## Facts and owner decisions (all pass)

- **LL-6:** the one-liner is verbatim. The single quotes around 'Luxury Liner' are curled (‘ ’) in the page, the meta description and the copy, which is a typographic difference only. See m1.
- **LL-17:** the wording is verbatim and appears in two places (status line and band panel). **LL-26:** the 2026 singles are the first content after the identity bill, and the order follows plan §5.3. **LL-32:** the era collage leads with the 1998 suits and the c. 2000 Mark Montgomery studio shots, and includes the 2002 photo with the exact P23 caption.
- **LL-13:** nothing about the history of "Great Day" appears. The blurbs are "Two tracks, “New Beginning” and “Great Day”." and "The first of the two." Nothing links to a page that lists the song as a demo. **LL-27:** no downloads. **LL-39:** no designer credit; the colophon says the logos date from 1999–2002. **LL-40:** no newsletter. **LL-36:** Instagram, Facebook and David's Bandcamp are linked, and SoundCloud is not.
- **Releases** (checked against `data/releases.json`): New Beginning 2026-04-17, Litterbug, two tracks. Great Day 2026-02-13. Overbored 2003-05-01, LLCD1003, CD and digital, 10 tracks, 36:23; all ten titles and durations match. One Tree Hill S1E15 "Suddenly Everything Has Changed", The WB, 2004-02-24. FOX Sports *US Youth Soccer Show*. Shake It Up 2021-08-27, recorded in Waco in autumn 1998 (LL-18), cover credit as in LL-23 and the Apple Music 3000 px cover (LL-30). Credits match the personnel and production fields.
- **Story chapter 2:** word for word from `content/story/02-nudie-suits.md`. The "On the bill" sidebar repeats only facts that are in the chapter (LL-20, LL-10, LL-18).
- **Press:** both excerpts match `content/press.json` exactly.
- **Photos:** the credits follow `credit_status` exactly (Mark Montgomery and Amy Wilstermann only). No one is named in photos whose positions are unconfirmed. Flyers carry transcriptions. Inferred dates are marked "Probably 1999", and Sept 15 was a Wednesday in 1999. Cover art carries the P40 rights line. Nothing comes from `do_not_use_ids`.
- **Privacy (LL-7, plan §2.3):** clean. People appear only with names, roles and years. No states, no town, no family, no later lives.

## Design judgement

This is a strong, coherent direction. The big Big Shoulders capitals, the two flat inks on paper, the printer's double rule and the slightly tilted taped flyer cards read as a gig poster without any fake grain, which respects plan rule 4. The real marks are used confidently: the condensed wordmark over the red roundel makes a striking bill. The release page is the best of the three. The track list as a set list, the TV placements attached to their songs and the credits as a ruled list are clear, scannable and on-concept. The story chapter's "On the bill" sidebar is a smart, content-true poster device. The dark "after hours" theme is a real design, not an inversion, and the blue sections give the long home page rhythm.

## Major issues (should fix; not blocking)

- **M1. The Equasue video sits inside "As seen on TV / Two songs went to television".** Placing it there implies that "Equasue" was one of the TV songs. It was not; "Dreaming" and "Sunshine" were. The caption corrects this, but the layout says otherwise. Fix: move the Equasue video to its own block (for example "On the band's channel"), or use the One Tree Hill or FOX Sports clip here as LL-35 allows, with captions.
- **M2. The poster that names this direction is buried.** Plan §6 B says "Real flyers and posters as the hero material." At 1440×900 the first screen is a bordered logo box with a lot of empty paper, and no singles are visible above the fold. The "Texas Pop / Tonight No Cover" poster is a small card at the bottom of column 1. The source is only 350 px, so it cannot be large. Even so, the bill could share the first screen with the latest-release card, or pull a flyer up beside it, so the first screen is less of an empty frame.
- **M3. The logos are recoloured.** Paths are verbatim, but in the `--oxblood` and `--paper` variants the black ink is swapped for theme ink, and those variants are the only ones the pages use. The plain variants ship unused. This is not redrawing, and the dark theme needs it, but it does change the marks. Record it as a question for Carly ("may the black of the marks print in oxblood or paper on the site?") rather than treating it as settled. In the dark theme the red roundel on the oxblood ground and the slate LXL oval in the masthead have weak graphic contrast and blur together.

## Minor issues

- m1. LL-6 straight quotes versus curly quotes: decide once, site-wide, and make the checker compare exactly rather than after normalising.
- m2. There is no favicon (a 404 on every page). Plan direction C proposes the roundel as the favicon, and B could use it too.
- m3. The CSS multi-column collage breaks chronology. Column 2 runs c. 2000, c. 2000, then "Probably 1999", and the README admits the wall reads by column. Use a row-ordered grid, or reorder.
- m4. `img/1998-pale-blue-trio.webp` ("Classic Chad", among the best-dressed early photos that LL-32 favours) is exported but unused, and the three plain logo SVGs are unused. Either use them or drop them to save weight.
- m5. The Nudie's label photo is from the 2003 "Memorial Day Weekend" Flickr album but sits in the 1997–1999 chapter without a date. That placement implies it is from a 1998 suit. Give it a date, or caption it neutrally as a later photo.
- m6. The Shake It Up card omits the YouTube Music link that `releases.json` has.
- m7. The Overbored Tidal listing was noted as incomplete in the data (tracks missing). Consider leaving Tidal off until it is complete.
- m8. The skip link works through sequential focus, but `<main>` has no `tabindex="-1"`, so `document.activeElement` stays on `body`. Add it for robustness with assistive technology.
- m9. The per-page screenshots are reduced to 256-colour palettes, so photos band in them. This only affects reviewers, but it undersells the photos. The overview is fine.
- m10. The release page has no link to Story chapter 6, and the story page has no "listen" link to the chapter 3 album. These cross-links help the "authoritative source" goal.

## Verdict

There are no owner-decision violations, privacy leaks, factual errors or accessibility failures, and the pages and checks work as claimed. The design is distinctive and well made. Points come off for the misleading juxtaposition of the TV section with the Equasue video, an under-used poster hero, and the unconfirmed logo recolouring. **8.0/10, approved.**
