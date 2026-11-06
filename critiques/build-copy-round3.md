# Critique: build-copy, round 3

Reviewer: independent critic (harsh). Date: 2026-11-06.
Scope: `content/` as committed in fc03c39 ("content: round 3 fixes"). I checked it against `DECISIONS-2026-10-07.md` (LL-1 to LL-43), daviddewese.com `DECISIONS-2026-09-29.md` (F4, F5, P8, P21, P23, P25, P27), `plan/00-master-plan.md` §4.2, §4.3 and §5, `data/releases.json`, and `research/01`, `02`, `03` and `04`. I re-read every public string in all nine Story chapters, Home, People, Facts, EPK, Press, Shows, Covers and the *Sound As Ever* panel. I did not rely on the round-2 review's spot list.

**Score: 7.5 / 10. Not approved: one blocking factual error.** It takes one phrase, in two files, to fix.

## What I ran

- `node content/check-content.mjs`: 0 errors, 0 warnings.
- `node content/check-content.mjs --self-test`: all 42 checks passed.
- I confirmed by hand that the private-literal hashes match the contact address and the founding town. No plain-text private literal appears in the checker or in `CHECK.md`.
- I built the site into my scratchpad (`astro build --outDir <scratchpad>/dist`) without touching `site/dist`. 28 pages built.
  - `--dist-only` on that build: 0 errors and 13 warnings. The warnings are all build-track Discogs `sameAs` and "MP3s" title mentions, none from content copy.
  - `grep david@` over the build found nothing.
- The rendered People, Story and Facts pages show the round-3 wording: the Scott line, "nearly all", "How dates are given" and the sign-off line.
- The rendered Shows page has no `archive.org` link for the French Quarter Cafe row ✓.

## Round-2 blocker and should-fixes

- **Blocker (the Scott line): fixed.** It now reads "plays on every Luxury Liners album and single from *Sound As Ever* on". This is true per releases.json personnel: SAE, *Believe* EP, *Overbored*, *Nonetheless*, the live single (LL-10) and both 2026 singles (LL-9). The source note says what it deliberately leaves out. ✓
- S1, the padded "Great Day" blurb on home: the blurb is now `null`. ✓ (The build still renders its own blurb there; see B-1 below.)
- S2, the hidden track: now "the first of the hidden tracks". ✓
- S3, *Overbored* writers: now "wrote or co-wrote nearly all". Discogs gives David on 9 of 10 tracks. ✓
- S4, the "signed his letters" wording: gone. All three places now rest on LL-21's "sign-off". ✓
- S5, the Live Music Archive row: `notes_internal` forbids the link, and the build does not link it. ✓
- S6, the dating-note heading: now "How dates are given". ✓
- S7, People intro: now "name, role and years". ✓
- S8, Amy Wilstermann: an internal note now asks for David's confirmation before launch. Still published; see S3 below.

## Known issues from the lost run: rechecked

- No first-person naming quote. The earpollution item is held, and the checker bans "I named my band". ✓
- Home single blurbs carry no dates and no padding in `content/`. ✓
- No "together again", "back together" or "reunion" wording. LL-17 appears verbatim in ch. 9, Facts `active` and both longer bios. ✓
- Attribution comes before or with the sourced sentence. The covers say "posted on the band's website in 2005", and the press excerpts carry the publication. ✓
- No two-digit years anywhere, and the checker enforces U+2019. ✓
- The Doli Stepniewski `show_id` is `2006-nonetheless-cd-release-show`, and that row exists. ✓
- No "visit" detail. The DC row is only "An outdoor stage … Over the July 4 weekend." ✓

## Blocking

1. **Factual error: "the name of Parsons's first band"** (Story ch. 3, last sentence of paragraph 2; `sound-as-ever-name.md`, paragraph 2).
   - The International Submarine Band was not Gram Parsons's first band. Before it (formed 1965–66) he played in teenage bands in Florida and in the folk group The Shilos (1963–65).
   - The phrase comes from research/01 §2.3, which is shorthand. research/02 §3.1 words it correctly: "the name of Gram Parsons' 1960s band".
   - This site aims to be the authoritative source that LLMs read (LL-41), so a wrong Parsons fact on the namesake panel is exactly what will get repeated.
   - Fix: "the name of Parsons's 1960s band" (or "of the band Parsons led in the 1960s"), in both files and in the two frontmatter `claim` lines.

## Should fix (not blocking)

- **S1. Checker gap on LL-6 "verbatim".** `one-liner-exact` compares *after* `norm()` folds curly quotes. The build's EPK "In one line" therefore still prints ‘Luxury Liner’ with curly quotes, and the checker passes it. Round 2 flagged this (S9) to the build track, and it is still there in today's build.
  - Add a raw (un-normalised) check in `--dist` mode: wherever "power-pop band co-founded" appears, the raw text must contain the LL-6 string byte for byte, allowing for HTML entities.
  - This is a checker fix inside `content/`, so it is this track's to make.
- **B-1 (for the build track, not this copy).** The rendered home page shows its own "Great Day" blurb: "Written by Chad Edgington and David Dewese, with all four forever members playing." That repeats the singles intro, which is the padding round 2 removed from `content/home.md`. The build should render `blurb: null` as nothing.
- **S2. Shows sort keys don't follow the file's own rule.**
  - The `_about` says a season "sorts by its first possible month". The Texas Music Café autumn 1998 row uses `-09-`, but the Zanies row ("probably autumn 1997 or winter 1998") uses `1997-10-00`.
  - The "late September 2001" row uses day 22, while the rule says "about 25" for "late".
  - The order is unaffected, but the data contradicts its own spec. Use `1997-09-00` and `2001-09-25`.
- **S3. Amy Wilstermann.** The credit is still published, with only an internal "confirm before launch" note. The shared surname invites exactly the inference LL-7 is meant to prevent, so the safe default is `publish: false` until David says yes, not the reverse.
- **S4. Mark Montgomery's years, "1999–2002".** People credits him with the photo behind the "Shake It Up (Live)" cover (LL-23). That photo may date from the 1998 Waco show. Either drop the years for him, or check when the photo was taken. It is minor, but "years" is one of the three public fields LL-7 allows, so it should be right.
- **S5. Facts `chad-2001`: "In March 2001, after his last show with the band."** LL-15 dates only the month. That the last show came *before* he left Nashville is natural but unrecorded. "In March 2001. His last show with the band was that month too." avoids claiming an order, in the same spirit as the careful SXSW/last-show wording in ch. 4 and Shows.

## Fact check: verified this round (my own pass)

- **LL-4/5:** email winter–spring 1997; spring break 1997, place unnamed in the Story; "in Texas" only in Facts (LL-5 and plan §4.3 allow the state); Nashville from May 1997 after Chad's graduation.
- **"Two Texans" / "two friends from Texas":** sourced to *Nashville Rage* 2001 ("Former Texans") and David's 2011 post, per plan §4.2.
- **LL-6:** byte for byte in `home.md` `one_liner`, Facts `what-is` and all three bios.
- **LL-9, LL-14, LL-15, LL-16, LL-17 (verbatim) and LL-18** are all correct.
  - LL-10/18: "recorded live in Waco, Texas, in autumn 1998", with Chad on guitar, David on bass and Scott on drums.
  - LL-19: "spread across Tennessee, Michigan and Texas"; no sentence pairs a member with a state.
- **LL-20:**
  - Zanies, "probably in the autumn of 1997 or the winter of 1998", with Emmylou Harris and Phil Kaufman.
  - Manuel, 12th & Porter, July or August 1998, opening for Austin Hanks.
  - "Western-wear designer" is the editorial gloss in research/04 §2.2 row 7.
- **LL-21:** sign-off only. **LL-22:** no title or issue; "Hot Prospects" is banned by the checker.
- **LL-23:** cover credits are exact, Jim Horan is credited as restorer only, and the *Nonetheless* credit is held.
- **LL-24:** all eight names, roles and years are exact.
- **LL-27, LL-29, LL-31, LL-36, LL-37/38, LL-39 and LL-40** are all respected:
  - LL-27/29: covers by title and artist only.
  - LL-31: form only.
  - LL-37/38: Opening Bell Coffee, downtown Dallas, 2008, Chad on banjo and David on acoustic guitar.
  - LL-39: no designer credit.
  - LL-40: no newsletter.
- **Release data:**
  - The Spotify (P6) dates and labels match releases.json.
  - The *Sound As Ever* LP is real (releases.json `luxury-liners-2026-sound-as-ever-lp`, 2026-05-27). Its Sound Asleep label, 100-copy edition and maroon vinyl are correctly kept off the Story and Facts as single-source.
  - *Believe* EP credits are right: Montgomery produced with the band; Wilson mixed; Milfred mastered; there is an enhanced "It's You" video.
  - *Overbored*: Nightwine recorded it, Henning mixed it and Seykora played keyboards.
  - *Nonetheless* personnel are exact, and "both of them sang too" holds: Larry and Scott are credited with vocals.
- **Compilations and archive items:** the *Fireworks Vol. 2* tracks, *Nashpop* "If I Cry", "Promise Ring" on no album, and "Precious To My Heart" as the first hidden track are all right. *Live Liners* is 12th & Porter both times: research/01 line 278 places the 2002-11-17 acoustic set there.
- **Press excerpts** match research/04 §2.2 rows 4, 5, 11, 12, 14, 15, 19 and 23 word for word. Mixed reviews (*Splendid*, *Lost At Sea*) carry no quote. The Chad profile and the earpollution interview are held.
- **Other facts:** the Foxymorons answer (F5; Poole produced both first albums, research/01 §8) and the *One Tree Hill* placement (S1E15, The WB, 2004-02-24) are right.
- **Bio lengths:** short 47 words (target 50), medium 150 (target 150) and long 284 (target 300) are all within 20%.

## Privacy

- No college name, no town, no addresses, no phone numbers, no family page, no band Gmail and no contact address.
- No member-to-state pairing. No "why Chad left" or "where he went".
- The Kyle Edgington and Amy Wilstermann entries state no relationship (but see S3).
- In the Shows data, the 2002 DC row carries no hint of whom the trip was for.
- `CHECK.md` mentions "the visit is left out" without naming anyone, which is acceptable in a public repo.

## Tone

Plain, warm and third person throughout. Ch. 2's opener ("The band leaned into its namesake.") and ch. 7's "The journal stopped in March 2004, but the band kept playing" read like a story. The copy never turns precious or fannish. Ch. 5's Nashville-venue sentence and the long bio's journal sentence are still list-like, which is acceptable for reference copy.

## Verdict

This copy is careful and close to done. Every round-2 item is fixed properly, and my own line-by-line fact pass found only one real error. That error is a wrong claim about Gram Parsons on the namesake panel, the part of the site most likely to be quoted. Change "first band" to "1960s band" in ch. 3 and `sound-as-ever-name.md`. Ideally also make the checker compare the one-liner raw (S1). With that done, this should be approved at about 8.5.
