# Critique: build-copy, round 1

Reviewer: independent critic (harsh). Date: 2026-11-06.
Scope: `content/` as committed in 45de4f2. I checked it against `DECISIONS-2026-10-07.md` (LL-1 to LL-43), daviddewese.com `DECISIONS-2026-09-29.md` (F4, F5, F6, P6, P8, P21, P22, P23, P25, P27), `plan/00-master-plan.md` §4.2 and §4.3, `data/releases.json` and `research/01`–`05`, plus dd `research/04` §5.2 (the journal table).

**Score: 6.5 / 10. Not approved: four blocking issues.**

## What I ran

- `node content/check-content.mjs`: 0 errors, 0 warnings.
- `node content/check-content.mjs --self-test`: all 37 checks passed.
- I fed the checker a hostile probe page (curly-apostrophe talent show, "reunited", "back together", "re-formed", `david&#64;dewese.com`, a Great Day demo/bonus-disc line, `'98` with an ASCII apostrophe, "Larry lives in Michigan", MP3 download, mailing list, logo designer, a college name, the founding town, "one-time", a truncated one-liner). It caught **17 of 17**. The checker is good.
- `--dist-only site/dist` (the existing build; I did not rebuild over another track's output): 0 errors, 13 warnings (Discogs and MP3 mentions on build-track pages, not content copy). No contact address anywhere in dist. The only `dewese.com` hits are `https://daviddewese.com/` links.
- `shows.json`: 44 rows in `[sort_key, id]` order. `press.json` is in date order, though ties are not in id order (cosmetic).
- Known issues from the lost run: no first-person naming quote ✓; no release dates in the home blurbs ✓; no "together again" ✓; attribution comes before or with the sourced sentence ✓; no `'97` ✓; Doli's `show_id` points at `2006-nonetheless-cd-release-show` ✓; the DC "visit" is dropped ✓.

## Blocking

1. **Privacy: the checker names a specific college in a public repo.** `content/check-content.mjs` line 71: the `college-name` rule hard-codes `\bBaylor\b`. Plan RD5 records that Chad's college name was removed from this repository on purpose. A privacy rule that singles out one named college tells any reader which college it is protecting. Remove the literal: the generic `University|College` pattern is enough, or match a hash. The same caution applies to `ethan.html` (line 68) and the literal contact address in the self-test (line 341). Both already appear elsewhere in the repo, so they are not new leaks, but they should not be added again. Split or hash them.

2. **LL-24 years changed for Gary Ishee.** LL-24 says "several shows, **2004–05**; also guitar on *Nonetheless*". `people.json` gives `"years": "2004–06"` and `facts.json` `line-ups` says "Gary Ishee (2004–06)". The Facts answer is also flagged for FAQPage JSON-LD. That claims he was with the band in 2006, which the owner did not say. It also contradicts Story ch. 7 ("several shows in 2004 and 2005"). Use 2004–05 and keep the *Nonetheless* guitar as a separate role.

3. **The Texas Music Café recording and the *Trunk Box* (E-Cleff) session are presented as two separate events, and that is not verified.** Story ch. 2 says: "In Waco that autumn they **also** recorded a live set at E-Cleff Studios". `shows.json` has two separate autumn-1998 Waco rows. The research ties *Trunk Box* to "scott's first offical gig" in Waco in fall 1998, and the archived `/mp3/waco/` folder contains a "Shake It Up". The worker's own `notes_internal` admits "the relationship (if any) … is unknown". "Also" and two Shows rows assert that the two are distinct, which is an unverified fact. Word it neutrally in one sentence that does not claim two sessions (for example, "A live set from Waco that autumn, recorded at E-Cleff Studios, later went up on the band's website as *Trunk Box*"), and merge or hedge the Shows rows. Alternatively, hold one until David answers.

4. **A single-source credit is published without attribution and relabelled.** The *Nonetheless* painting credit (Scott Carpenter) comes only from the 2010 daviddewese.com discography page. `data/releases.json` marks it `"confidence": "single-source"`, and LL-23, the owner's cover-art round, does not cover *Nonetheless*. The copy labels it `verified-source` and states it flatly in four places: Story ch. 7, `people.json` (Scott's line and `cover_art`), `facts.json` `cover-art`, and the EPK long bio. The hard rule is that single-source facts appear only with attribution in the sentence. Either get David to confirm it (add a decision reference) or hold it. Also fix the wording: the cover is one painting (a dress on a hanger), so "painted the pictures on the cover" is wrong. The credit reads "paintings" for the artwork as a whole.

## Should fix (not blocking)

- **The home "Great Day" blurb is padding.** "The first of the two." says nothing and reads oddly on its own. That is exactly the lost run's "don't pad" issue. Give it a real line, or leave the blurb empty and let the card carry the title.
- **Chad's status undersells LL-9 and plan §4.3.** The People years "1997–2001; on the 2026 singles" and the Story never say that Chad **is in the band again today**, which is the plan's §4.3 wording. Facts says it, People should too. For example: "1997–2001, and again today" (the rejoining date stays open).
- **Shows, Zanies row:** LL-20 says "**probably** autumn 1997 or winter 1998", but `date_display` drops "probably". The Story keeps it.
- **Shows, March 2001:** Chad's last show sorts before SXSW only because of the id tiebreak. Readers will take that as the order of events, which nobody knows. The Story tells them in the opposite order. Add an explicit tiebreak or an "order unknown" note. The visible venue "Venue not recorded" is ugly. Use null and let the template omit it.
- **Castner-Knott slacks (Story ch. 4):** this is a single-source photo description presented as fact in a parenthetical. It is harmless, but either attribute it ("in a photo David posted, …") or cut it.
- ***Sound As Ever* production (Story ch. 3):** "Mike Poole produced it with Mark Montgomery, recording and mixing in Nashville". Montgomery produced only tracks 8–9 (releases.json), and the dangling participle implies that both men recorded and mixed it. Suggest: "Mike Poole produced most of it and recorded and mixed it in Nashville; Mark Montgomery produced two tracks and designed the sleeve."
- **Press:** the July 2001 *Nashville Scene* excerpt is David's own "Luxury Liners gets the cheesy hits". It is not a positive press excerpt about the band (the quote policy), and it echoes the "outlet" framing that plan §4.3 keeps off the main pages. List the item without the excerpt.
- **Voice:** "Shows we can date…" and "How we date things… we give the month" use a first-person site voice. The brief asks for third person. The dating note's heading comes from the plan, but the sentences can be impersonal.
- **People:** Doug Nightwine's years "2002–03" have no source for 2002. Larry's role on Home ("bass") differs from People ("bass, keyboards, vocals").
- **Tone:** most of it is plain and warm and reads well (ch. 3's "the four forever members were all in the band at once" is good). Ch. 5 and the second paragraph of ch. 7 read like liner-note dumps. One human sentence each would help. The medium bio's "made the albums … (2006) and the *Believe* EP (2001)" is clumsy; put the EP in date order.

## Verified correct (spot list)

LL-4/5 founding (no town; spring break 1997; Nashville May 1997); the LL-6 one-liner verbatim, including in the EPK, Facts and Home; LL-9 (all four on both singles); LL-10/18 wording ("recorded live in Waco, Texas, in autumn 1998"); LL-13 (no talent show, no demo or bonus disc, Great Day history held); LL-14 writers; LL-15 March 2001; LL-16 SESAC; LL-17 sentences verbatim in ch. 9, Facts and the EPK; LL-19 "spread across Tennessee, Michigan and Texas" with no member mapped to a state; LL-20 Manuel / 12th & Porter / Austin Hanks / Zanies / Emmylou and Phil Kaufman; LL-21; LL-22 (no "Hot Prospects"); LL-23 credits (Jim Horan as restorer only); LL-24 names; LL-27/29 covers as a list only; LL-31 (no address in copy); LL-36; LL-37/38 (Opening Bell Coffee, downtown Dallas, 2008; David's solo CD release; Chad on banjo); LL-39 (designer held); LL-40. Release dates match releases.json and P6. *Sound As Ever* LP (2026-05-27) "came out on vinyl in 2026" ✓. The *One Tree Hill* air date matches research/02 and plan RD2. Journal rows match the dd research/04 §5.2 table, and the Mesquite 2003 show and the 2002 "talent show" / battle of the bands row are correctly left out.

## Verdict

The copy is close: accurate, restrained, and the checker is strong. But it has one privacy slip in a public file, one owner-decision deviation (Ishee's years, which also reaches JSON-LD), one unverified implication (two Waco sessions) and one unattributed single-source credit spread across four pages. Fix those four and the score should clear 8.
