# Owner decisions: 2026-10-07

Carly's answers to the first Tier 1 questions in `QUESTIONS-FOR-CARLY.md`. **Authoritative**, the same way `daviddewese.com/daviddewese-com/DECISIONS-2026-09-29.md` is: where any file in this repository disagrees with a row below, the row wins. Codes start with `LL-` so they never collide with the daviddewese.com codes (F4, P8 and so on, which still apply here).

| # | Question | Decision |
|---|---|---|
| LL-1 | A1. Launch strategy | **Yes: launch the authoritative core first**, then add depth in layers (plan §9). |
| LL-2 | A3. Timing | **Sooner than March 2027.** The six-month plan only queued this site behind daviddewese.com's launch; the build itself is about six weeks because it reuses daviddewese.com's code. New proposed target: **launch Friday 2026-11-20**, with gates, not dates, deciding (plan §9). |
| LL-3 | A11. Master release data | **Yes: this repository is the master for The Luxury Liners' releases.** daviddewese.com copies the band's releases from `data/releases.json` here, and a check on both sites fails if they differ. |
| LL-4 | A7. Founding story and place | Carly, 2026-10-07: Chad and David corresponded by email in the winter and spring of 1997, while Chad was finishing college and David was living in **Mesquite, Texas**. They came up with the band name over **spring break 1997**, when they met up at Chad's parents' house to record a ton of songs together on a 4-track. They **moved to Nashville in May 1997**, after Chad's graduation. |
| LL-5 | A7b. Founding place for search data | **Texas.** Chad's parents' house, where the name was chosen over spring break 1997, was in Texas. The search data on both sites says the band was **founded in Texas in 1997** (`foundingLocation`: Texas; the town is never named), and the text says Nashville was the band's home from May 1997. |
| LL-6 | A8. The one-line description | **Approved without the sentence about Chad leaving.** The canonical one-liner is: "The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together. The name comes from the Gram Parsons song 'Luxury Liner'." Use it on the site and in the Spotify bio, Wikidata, Discogs and Last.fm. Chad's 2001 departure stays in the Story and the Facts page, not in the one-liner. |

## What LL-4 changes

- **The story:** the band was conceived in Texas in the spring of 1997 (email, then the spring-break 4-track sessions, where the name was chosen) and became a working band in Nashville from May 1997. It refines F4's "1997 (Nashville)": Nashville is where the band was based and played, but not where the idea or the name began.
- **The talent-show story** on the band's 2005 site (Chad's college talent-show band "named The Luxury Liners", which "did indeed win the contest") does not match LL-4's account of how the name was chosen. It stays out of the Story; if it is used at all, it goes in the Vault only as a dated quotation from the 2005 site (question B1 is still open).
- **Privacy:** "Chad's parents' house" is never located on the site. The site says "over spring break 1997" without naming a place.
- **Structured data:** settled by LL-5: `foundingDate` 1997, `foundingLocation` Texas, on both sites.

## Round 2: 2026-11-06

| # | Question | Decision |
|---|---|---|
| LL-7 | C1. Chad, Scott and Larry on the site | **Names, band roles, years and band-era photos go on the site.** No quotes from them unless they offer one. **Nothing about their lives outside the band, ever.** |
| LL-8 | E1. Fixing other websites | **Yes**, and ideally the project team does all of it (Wikidata item, AllMusic correction, MusicBrainz, Discogs, Last.fm), after launch, in the band's name, with the LL-6 one-liner. Where an edit needs a login, the team prepares it and the account holder submits it. |
| LL-9 | B2. Who is in the band now | **The four forever members are the band today:** David Dewese, Chad Edgington, Scott Carpenter and David "Larry" Wilstermann. **All four play on "Great Day" and "New Beginning" (2026).** This reverses the plan's earlier rule that the site never says all four play together today; Chad left Nashville in March 2001 (LL-15) and is in the band again now. |
| LL-10 | B2. The live "Shake It Up" (2021 single) | Recorded live at the **Texas Music Café in Waco, Texas**, with **Chad on guitar, David on bass and Scott on drums**. (Carly wrote "The Music Music Cafe"; the release and the 2023 compilation name the Texas Music Café, so that name is used.) The line-up places the recording in the Chad-and-Scott years (about 1998–2001); the exact date is still open. |
| LL-11 | A5. Where the site is built | **In this repository** (dewese/theluxuryliners.com), reusing daviddewese.com's components, checks, editor and handbook. |
| LL-12 | A6. The old redirect pack | **Not used.** The new site redirects old links to its own pages. |
| LL-13 | B1 and B3. Talent show; "Great Day" demo | **The college talent-show story is left out entirely** (not in the Story, not in the Vault). **The 2026 "Great Day" single is the same recording as the demo on the 2008 bonus disc; the site does not mention it.** |
| LL-14 | B4. Songwriting | *Nonetheless*: **David**. "Great Day" and "New Beginning": **Chad and David**. "The Duke Of Gloucester": **David** (possibly shared with Jerry James; not confirmed, so the site credits David until Jerry's share is confirmed). The Discogs credits for *Sound As Ever* and *Overbored* stand otherwise. |
| LL-15 | B12. When Chad left | **March 2001.** The site says "March 2001" (David's Flickr photo "Chad's Last Show – March 2001"); the 2005 site's "April 2001" is corrected. |
| LL-16 | B5. SXSW 2001 | **The band played the SESAC Showcase at SXSW 2001.** |
