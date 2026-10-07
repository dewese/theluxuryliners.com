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
