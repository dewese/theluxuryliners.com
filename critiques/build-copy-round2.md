# Critique: build-copy, round 2

Reviewer: independent critic (harsh). Date: 2026-11-06.
Scope: `content/` as committed in 3215db0 ("content: round 2 fixes"). I checked it against `DECISIONS-2026-10-07.md` (LL-1 to LL-43), daviddewese.com `DECISIONS-2026-09-29.md` (F4, F5, F6, P6, P8, P21, P22, P23, P25, P27, X1), `plan/00-master-plan.md` §4.1 and §4.3 (PD6), `data/releases.json`, `research/01`, `02`, `03` and `04`, and dd `research/04` §5.2 (the journal table).

**Score: 7.5 / 10. Not approved: one blocking issue.** The fix is a single sentence, and once it is made this copy clears 8.

## What I ran

- `node content/check-content.mjs`: 0 errors, 0 warnings.
- `node content/check-content.mjs --self-test`: all 42 checks passed. The private literals are now SHA-256 hashes. I grepped `check-content.mjs` and `CHECK.md`: no college name, no founding town, no contact address and no family-page file name appear in plain text.
- I built the site into my scratchpad (`astro build --outDir <scratch>/dist`) and did not touch `site/dist`. 28 pages built. Running `--dist-only` on that build gave 0 errors and 13 warnings: Discogs and "MP3s" mentions on build-track pages (music release pages, the Vault MP3s title page, `sameAs`), not in content copy. A grep found no `david@` anywhere in the build. The only `dewese.com` hits are `daviddewese.com` links.
- I read the rendered Story, People, Facts and EPK pages from that build. They match `content/`, and no source notes, confidence labels or held items leak into visible text.
- `shows.json`: 44 rows in `[sort_key, id]` order. The E-Cleff row is `publish: false`. Doli's `show_id` resolves to `2006-nonetheless-cd-release-show` ✓.

## Round-1 blockers: all four fixed

1. **Privacy literal in the checker:** fixed. The literals are hashed, and the self-test uses synthetic tokens. ✓
2. **Gary Ishee's years:** now "2004–05" in People, Facts (FAQ JSON-LD) and Story ch. 7, with the *Nonetheless* guitar as a separate role. ✓
3. **Two Waco sessions:** Story ch. 2 now tells *Trunk Box* in one neutral sentence, with no "also". The separate E-Cleff Shows row is held. ✓
4. ***Nonetheless* painting credit:** held (`publish: false` in people.json, notes only in facts.json and the EPK), and the checker now forbids it. ✓

The round-1 "should fix" items are almost all done: Chad "in the band again today" (People, Facts, ch. 9); Zanies "Probably"; March 2001 order not claimed; Castner-Knott cut; *Sound As Ever* per-track production; the *Nashville Scene* excerpt dropped; the EP in date order; home roles aligned.

## Known issues from the lost run: rechecked

- No first-person naming quote from David (the earpollution line is held, and `sound-as-ever-name.md` does not say who chose the title). ✓
- No release dates in the home single blurbs. ✓ (Padding is still there: see S1.)
- No "together again", "back together" or "reunion". The LL-17 sentences appear verbatim in ch. 9, Facts and both longer bios. ✓
- Attribution comes before or with the sourced sentence: the 2005-site covers say "posted on the band's website in 2005", and press excerpts carry the publication. ✓
- There are no two-digit years in the copy. The checker enforces U+2019. ✓
- The Nonetheless release-show row points at the right show id. ✓
- The DC "visit" detail is dropped. The row reads only "An outdoor stage … Over the July 4 weekend." ✓

## Blocking

1. **An unverified generalisation on People: Scott "plays on every Luxury Liners record since" August 1998.** `people.json` → `scott-carpenter.line`. No source says this, and the item's own source note claims less: "plays on every record from *Sound As Ever* on (data/releases.json personnel)". The wording "since [August 1998]" also covers records whose drummer is unknown or doubtful:
   - *Nashpop* (Not Lame, 1998; month and line-up unknown).
   - *Antarctic Antics* (2001; Discogs credits the band, but "the band's role is not stated").
   - The SESAC promo CD (only "probably the Believe EP recording").
   - Even within *Sound As Ever*, releases.json says it is unknown whether "Since You Met Me" and "Think She's Coming Around" are the 1998 *Fireworks* recordings, which had Jeff LaFrate on drums.

   The hard rule is that unverified facts never publish. The fix is one line: say what releases.json supports, for example "Joined on drums in August 1998, and plays on every Luxury Liners album and single from *Sound As Ever* on", or simply "Joined on drums in August 1998."

## Should fix (not blocking)

- **S1. The home "Great Day" blurb still pads.** `singles_intro` already says "both written by Chad and David and played by all four forever members". The "Great Day" blurb then repeats "Written by Chad and David, with a cover by David." That is the lost run's "don't pad" problem in a new form. Give the blurb something the intro does not already say, or leave it empty. (The "New Beginning" blurb, "Two tracks, 'New Beginning' and 'Great Day'", is useful and LL-13-safe.)
- **S2. Ch. 9 says "'Precious To My Heart', the hidden track from *Sound As Ever*".** Ch. 3 says, correctly, that the album has three hidden tracks. Use "the first of the hidden tracks on *Sound As Ever*", which matches releases.json ("the first hidden track").
- **S3. "David wrote most of the songs" on *Overbored*** (ch. 6; Facts `writers`). Per the Discogs credits that LL-14 lets stand, David is the sole writer on 5 of 10 tracks and a co-writer on 4 more. "Wrote or co-wrote nearly all of the songs" is accurate. "Wrote most" is loose and reads as sole authorship.
- **S4. "Gram Parsons signed his letters 'Sound as ever'"** (ch. 3, Facts, `sound-as-ever-name.md`). LL-21 confirms the sign-off. The "letters" detail comes from research/01 §2.3, and plan PD6 still treats the letter link as pending. It is well-known Parsons lore and probably fine, but the owner's word is "sign-off". "Parsons's sign-off, 'Sound as ever'" would rest entirely on LL-21.
- **S5. Shows, 2003-06-19 French Quarter Cafe:** the note says "An audience recording of this show is in the Live Music Archive." That collection offers downloadable MP3s (research/03 §5.3). Under LL-27 the site gives away no downloads, so the build must not link it. Keep the sentence as history, or drop it. Add a `notes_internal` line so the build track does not turn it into a link.
- **S6. The dating-note heading is still "How we date things".** The text is now impersonal, but the heading is not. "How dates are given" fits the third-person brief.
- **S7. People intro:** "lists everyone by name, role and years in the band". Producers, engineers and photographers were never "in the band". Use "by name, role and years".
- **S8. Photographers: "Amy Wilstermann".** The credit is band-era and sourced, and the notes say no relationship is stated. But the shared surname invites the inference LL-7 is meant to prevent. Consider asking David whether it should be credited at all before launch. This is not a violation as written.
- **S9 (build track, not this copy).** The rendered EPK "In one line" prints ‘Luxury Liner’ with curly quotes, while `content/` and Facts keep LL-6's straight apostrophes. LL-6 is "verbatim". Tell the build track to render the one-liner byte for byte everywhere.

## Fact check: verified correct (spot list)

LL-4/5 (emails, spring break 1997, no town, no house, Nashville from May 1997, "named in Texas"); the LL-6 one-liner verbatim in Home, Facts and all three EPK bios; LL-7, LL-19 ("spread across Tennessee, Michigan and Texas", never member-to-state); LL-9 (all four on both 2026 singles; Chad "again today"); LL-10/18 ("recorded live in Waco, Texas, in autumn 1998"; Chad guitar, David bass, Scott drums); LL-13 (no talent show; nothing on the "Great Day" recording's history; no bonus disc; the bonus-disc covers are listed only as "posted on the band's website in 2005"); LL-14 writers; LL-15 March 2001; LL-16 SESAC Showcase; LL-17 verbatim; LL-20 (Zanies, "probably autumn 1997 or winter 1998", Emmylou Harris and Phil Kaufman; Manuel at 12th & Porter, July or August 1998, opening for Austin Hanks); LL-21; LL-22 (no title, no "Hot Prospects"); LL-23 (Jim Horan as restorer only; original design credit Mark Montgomery); LL-24 (all eight names, roles and years exact); LL-27/29 (covers by title and original artist only; no audio); LL-31 (contact form only); LL-36; LL-37/38 (Opening Bell Coffee, downtown Dallas, 2008; David's solo CD release; Chad on banjo, David on acoustic guitar); LL-39 (no designer; "logos date from 1999–2002"); LL-40.

Release dates and labels match releases.json and P6 (*Sound As Ever* May 2000, Echomusic/Litterbug; *Believe* March 2001, Echomusic; *Overbored* May 2003 and *Nonetheless* October 2006, Litterbug; live single 2021-08-27, Texas Music Café; 2026-02-13 and 2026-04-17, Litterbug). Production credits match releases.json (Poole 1–7 and 10–15, Montgomery 8–9; Wilson, Milfred; Nightwine, Henning; Henning at The Den, Ferndale). *Nonetheless* personnel matches. The journal rows match dd research/04 §5.2. The [the founding-story town] 2003 solo show, the Los Angeles 2003 solo show and the July 2002 "talent show" are correctly left out. Press excerpts match research/04 §2.2 word for word, mixed reviews carry no pull-quote, and the AllMusic excerpt starts after the "outlet" framing. The Foxymorons answer matches F5 and research/01 §8. *One Tree Hill* S1E15, The WB, 2004-02-24 ✓.

## Tone

Plain, warm and third person throughout. Ch. 5 and ch. 7 now read like a story rather than liner notes ("for a band that had just gone down to three, it was a busy stretch"; "the journal stopped in March 2004, but the band kept playing"). The long bio's "They took the Gram Parsons connection seriously" is a nice touch and is grounded in LL-20/21. Nothing is precious. The prose is a little list-heavy in ch. 2's compilation sentence and in the long bio's journal sentence, but that is acceptable for reference copy.

## Verdict

This is a strong round. All four round-1 blockers are fixed properly, and the checker is now both effective and safe to publish. One unsourced sweeping claim remains on a core page (Scott "plays on every Luxury Liners record since"). Fix that line, plus S1 and S2 ideally, and this should be approved at 8.5 or above.
