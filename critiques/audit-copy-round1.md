# Audit: copy and facts, round 1

Auditor: independent, harsh. Lens: every visible sentence in `site/dist` (plus meta descriptions, alt text, FAQ JSON-LD and `llms.txt`) checked against LL-1..LL-45, `data/releases.json`, the daviddewese.com decisions and `research/*.md`; tone; typos; consistency of names, dates and quotes; privacy (LL-7, LL-25).

Build and checks on this commit (`0f1a6b3`): `npm ci && npm run build` clean (37 pages). `npm test` passes: data, unit, dist, jsonld (38 pages) and axe (370 of 370 page checks). `node content/check-content.mjs` and `--dist`: 0 errors. Internal links: none broken (scripted check of every `href` in dist).

## Score: 7.5 / 10. Not approved

There are two blocking items, both the same kind: sourcing notes in public copy, which `content/CHECK.md` ("as credited on…") and the hard rules forbid. Everything else is accurate and in the right voice, and the owner decisions are followed closely. Fix B1 and B2 and this round would pass.

## Confirmed correct (no action)

- **LL-6** one-liner is verbatim on Home, Facts, EPK (all three bios), `llms.txt` and the meta descriptions. It keeps its straight quotes, as the decision gives it.
- **LL-17** wording is exact everywhere it appears: Home, Facts, EPK status, Story index, chapter 9 and `llms.txt`.
- **LL-13**: no talent show anywhere, and nothing ties "Great Day" to a demo or to 2008. "Breakaway" and the covers are listed without mentioning the Kool Kat bonus disc. Good.
- **LL-27**: no `.mp3`, `.zip` or `download` links. The Vault lists the old MP3s by title only.
- **LL-39**: no logo designer is named. **LL-40**: no newsletter.
- **LL-45**: Amy Wilstermann is credited as "Photo: Amy Wilstermann" on the two 2003 shots and in People › Photographers. No relationship is stated.
- **LL-7 / LL-19 / LL-4 / LL-5**: grep of dist found no [the founding-story town], college name, parents, Gmail, phone numbers, addresses, "dads with careers" or any member-to-state mapping. "College friend" is approved wording (daviddewese.com P21). `foundingLocation` is Texas, with no town. Person JSON-LD for Chad, Scott and Larry is name only (LL-33). No EXIF found in the photo derivatives.
- **`[the contact address]`** does not appear anywhere in dist (HTML, JS, JSON-LD, `llms.txt`).
- **International Submarine Band fix confirmed**: chapter 3 reads "…'The International Submarine Band', the name of Parsons's 1960s band." No "first band" anywhere in dist. The Vault covers page correctly credits "Luxury Liner" to Gram Parsons (The International Submarine Band).
- **Matches LL-9, 10, 14, 15, 16, 18, 20, 21, 22, 23, 24, 37 and 38**: dates, line-ups, songwriting and cover-art credits all agree with the decisions and with `releases.json`. The 2002 photo is never called a line-up (P23).
- **Press quotes** match the research text character for character. That includes "tongue-in cheek" (as printed), "drop-dead perfect pop-rock", the one-sheet's "up the 5 from San Diego to L.A." and the 2000 bio's "caricature lunch box".
- **Tone**: plain, warm, third person for the band. "We" appears only on the policy pages (Privacy, Accessibility, Contact), which is acceptable.

## Blocking

### B1. Sourcing note on the Sound As Ever page (vinyl section)
- **Page:** `/music/sound-as-ever/` ("On vinyl (2026)"). **Source:** `site/src/pages/music/[slug].astro` line ~117.
- **Text:** "Discogs lists the pressing as 100 copies on Sweden's Sound Asleep Records."
- **Why blocking:** this is a sourcing note in public copy (hard rule; `content/CHECK.md` "No sourcing notes in rendered text").
- **Fix:** "The pressing is a limited edition of 100 copies on Sweden's Sound Asleep Records." `releases.json` `luxury-liners-2026-sound-as-ever-lp` supports this. You can add "on marbled maroon vinyl" if wanted.

### B2. "Writers as Discogs credits them" on two release pages
- **Pages:** `/music/believe-ep/` ("Writers as Discogs credits them.") and `/music/shake-it-up-live/` ("Writers as Discogs credits them on the Believe EP."). **Source:** `site/src/lib/releases.ts` lines 44–45.
- **Why blocking:** this is exactly the "as credited on…" sourcing note that CHECK.md forbids. LL-14 already says the Discogs credits stand, so the site should state them plainly.
- **Fix:** delete both notes. If the Shake It Up page needs context, use "Written by Chad Edgington, David Dewese and Scott Carpenter, as on the Believe EP." Also check why `check-content --dist` does not raise `source-host-mention` for visible "Discogs" body text outside links. It flagged only a JSON-LD `sameAs`. Tighten that rule so it catches this kind of sentence (this is not a weakening).

## Should fix

1. **"Mike Poole produced both bands' first albums" may overstate his role.** Page: `/facts/` (visible answer and FAQPage JSON-LD); source `content/facts.json` id `foxymorons`. On the Foxymorons' *Calcutta*, the daviddewese.com master data and its Foxymorons research credit Poole as "Recorded by" (Kleenex Box-Head, Nashville, Winter 1999). Only `research/01` here calls him its producer. **Fix:** "…and Mike Poole recorded both bands' first albums." That is true under both sources. Alternatively, confirm the producer credit with David.
2. **"Precious" and "Precious To My Heart" are the same track under two names.** The Sound As Ever tracklist on `/music/sound-as-ever/` and chapter 3 says "Precious". Chapter 9 (`content/story/09-great-day.md`) and `/music/appearances/` (`site/src/lib/releases.ts:175`) say "'Precious To My Heart' is the first hidden track of Sound As Ever". A reader cannot match them. **Fix:** in chapter 9 and on the Fireworks Vol. 3 note, write "'Precious To My Heart' (listed as 'Precious' on Sound As Ever), the first of its hidden tracks…".
3. **Chapter 9 summary, "A live single from 1998, and two singles in 2026."** Pages: `/story/great-day/` and the `/story/` index; source `content/story/09-great-day.md` front matter. The single came out in 2021. Only the recording is from 1998. **Fix:** "A 1998 live recording released in 2021, and two singles in 2026."
4. **The "Shake It Up (live)" old MP3 points to the studio version.** Page: `/vault/mp3s/`. The old MP3 was the 1998 Waco live take (`research/03` §5.1, `mp3/waco/…shake_it_up.mp3`), but the row says "the song is on Believe EP". **Fix:** "the song is on Believe EP; a live version from Waco, autumn 1998, is the 2021 single", linking `/music/shake-it-up-live/`. Do not claim it is the same recording (CHECK.md: the E-Cleff and Texas Music Café sets are unconfirmed as the same night).
5. **Suit colour named two ways.** Home "Through the years" intro (`site/src/pages/index.astro:76`) and two alt texts say "pale-blue". The captions on Home, Photos and chapter 2 say "Powder-blue suits, about 1998", and the intro says "in 1998" where the captions say "about 1998". **Fix:** use one term (the caption's "powder-blue"). Change the intro to "Powder-blue suits about 1998…".
6. **Larry's name explained twice in a row on Home.** The card says "The band already had a David, so he became Larry." Directly below it, `content/home.md` `members_note` says "He's Larry because the band already had a David." **Fix:** make the note "Nashville is the band's home town; the four are now spread across Tennessee, Michigan and Texas."
7. **People › Photographers: "Photos without a credit line were taken by the band, by family or with a self-timer."** (`site/src/pages/people.astro:66`). This is unverified (the 2002 photo has no known source; P22), and "by family" reaches outside the band (LL-7). Sitting right under the Amy Wilstermann credit, it also invites readers to guess at relationships (LL-45). **Fix:** "Photos without a credit line come from the band's own collection."
8. **The Accessibility page over-claims.** "Every page works without JavaScript" will be false on `/contact/` once the Turnstile key is set, because Turnstile needs JavaScript. **Fix:** "Every page except the contact form's spam check works without JavaScript", or make the sentence conditional on `PUBLIC_TURNSTILE_SITE_KEY`, as `privacy.astro` already does.
9. **EPK fact sheet "Founded" leaves out Texas.** It reads "1997, by David Dewese and Chad Edgington; Nashville from May 1997", while Facts and `llms.txt` say founded in Texas (LL-5). **Fix:** "1997 in Texas, by David Dewese and Chad Edgington; based in Nashville from May 1997."
10. **Facts › "Which labels released their records?" leaves out the 2026 LP label.** **Fix:** add "Sound Asleep Records released the 2026 Sound As Ever LP."
11. **LL-25 process.** `/shows/` ("Shows from 2001 to 2004 come from the band's journal") and chapter 5 publish dated details from the journal: venues, a benefit, a July 4 DC-area trip, Michigan dates. Nothing private shows, but LL-25 says David approves journal material. **Fix:** record in `content/CHECK.md` or `QUESTIONS-FOR-CARLY.md` that David has approved the show-list and chapter 5 extracts, or hold the 2001–04 rows until he does.
12. **Small style items:**
    - `/music/` reads "6 compilations with Luxury Liners songs". Use "Six compilations" (`site/src/pages/music/index.astro:32`).
    - `/press/` 1998 Billboard entry repeats itself: "Billboard, feature. The band was featured in Billboard." Drop the second sentence until the clipping turns up (LL-22).
    - Member years are written "1997 to today" on Home and "(1997–)" on People. Pick one style.
