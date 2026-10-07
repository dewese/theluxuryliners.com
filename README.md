# theluxuryliners.com: project index

The working folder for a new website for **The Luxury Liners**, the power-pop band David Dewese and Chad Edgington co-founded in 1997 and took to Nashville (owner decision F4). The current site is a one-page Carrd (live since 2024-10-15). This project researches the band's whole history and plans its replacement.

It runs in the same **multi-agent gauntlet** format as daviddewese.com, foxymorons.com and normaltownusa.com: every deliverable is written by a worker and reviewed by a harsh critic before anyone relies on it.

**Status (2026-10-07):** research complete (5 tracks, all approved). The master plan scored 7.5/10 in round 1 (1 blocking issue: it implied Chad is still in the band); Draft 2 fixes that and every non-blocking item and is back with the critic, then goes to Carly. No site code yet. Nothing in this folder has been committed to git.

---

## What's here

| Path | What it is |
|---|---|
| `plan/00-master-plan.md` | **Start here.** Mission and success measures, ground rules, state of research, the story spine, information architecture and page list, three design directions, technology, authority and AI visibility, launch phases with exit criteria, risks, discrepancies |
| `QUESTIONS-FOR-CARLY.md` | Every owner question, in priority order (4 tiers), each with why it matters and a proposed default |
| `research/01-band-history-and-people.md` | History 1997–2026: origin under F4, the name, eras, line-ups, people tables (with a public-OK column), year-by-year timeline, labels, shows, the Nashville scene, links to The Foxymorons, anecdotes, "needs a browser" list |
| `research/02-discography.md` | Every release, appearance and archive item, with per-track writers, ISRCs, UPCs, platform IDs; all public dates checked live against Spotify (P6) |
| `research/03-web-archaeology.md` | The old theluxuryliners.com, 2000–2026: seven design eras, old copy, free audio, the band journal, newsletters, other web presences, the legacy-URL plan, privacy flags |
| `research/04-press-and-digital-footprint.md` | 26 press items, platform bios and where they come from, knowledge-graph state, name collisions, prioritised off-site corrections, `sameAs` list and JSON-LD sketch |
| `research/05-assets-and-photos.md` | Covers, 274 Flickr photos (248 usable), engraved portraits, logos, flyers, credit and caption rules, wish-list |
| `research/legacy/live-status-2026-10-07.tsv` | Live HTTP status of all 675 archived URLs, checked 2026-10-07 |
| `research/tools/gen_legacy_urls.py` | Regenerates `data/legacy-urls.json` (rules in `classify()`) |
| `data/releases.json` | 21 release objects: 7 releases, 1 reissue, 8 appearances, 4 archive items, 1 lead |
| `data/legacy-urls.json` | 675 legacy URLs, each with a status, era, category, action and suggested target |
| `data/assets.json` | 310 image records with size, SHA-256, credit status, alt text and caption rules |
| `assets/source/covers/` | 6 owner cover masters (byte-identical copies of the daviddewese.com masters) |
| `assets/source/photos/` | The 2002 photo of all four; 2 Kristin Barlowe portraits of David (`solo-archive/`); 98 Flickr originals (`flickr/`) and 150 web-size copies (`flickr-web/`) |
| `assets/reference/` | Distributor and Bandcamp cover copies (`dsp-artwork/`, 12) and Discogs packaging scans (`discogs/`, 9; research only, never publish) |
| `assets/derived/daviddewese-portraits/` | The daviddewese.com engraved portraits of the 2002 photo (6 files) |
| `scripts/fetch-flickr-originals.sh` | Slow, one-at-a-time fetch of the 150 Flickr originals that were rate-limited |
| `critiques/` | Every critic report, `<track>-round<N>.md` |

The richest outside sources are in the sister projects: `/home/user/daviddewese.com/daviddewese-com/` (owner decisions `DECISIONS-2026-09-29.md`, research, architecture, the built band page) and `/home/user/foxymorons.com/` (The Foxymorons, David's other band).

---

## Deliverables and critic verdicts

| Deliverable | Track | Rounds (scores) | Final | Verdict | Latest critique |
|---|---|---|---|---|---|
| `research/01-band-history-and-people.md` | history | 1 (8.5) | **8.5/10** | APPROVED | `critiques/history-round1.md` |
| `research/02-discography.md` + `data/releases.json` | discography | 3 (7.5, 6.5, 8.5) | **8.5/10** | APPROVED | `critiques/discography-round3.md` |
| `research/03-web-archaeology.md` + `data/legacy-urls.json` | archaeology | 2 (7.5, 8.6) | **8.6/10** | APPROVED | `critiques/archaeology-round2.md` |
| `research/04-press-and-digital-footprint.md` | footprint | 2 (6, 8.5) | **8.5/10** | APPROVED | `critiques/footprint-round2.md` |
| `research/05-assets-and-photos.md` + `data/assets.json` | assets | 2 (7.5, 8.5) | **8.5/10** | APPROVED | `critiques/assets-round2.md` |
| `plan/00-master-plan.md`, `QUESTIONS-FOR-CARLY.md`, `README.md` | plan | 1 (7.5), round 2 submitted | — | **NOT YET APPROVED** (round 2 awaiting critic) | `critiques/plan-round1.md` |

Each approved file still has non-blocking items from its critic. The plan collects them as research debt RD1–RD15 (`plan/00-master-plan.md` §3.2); they are fixed before any passage becomes site copy, and the table's "Blocks" column says which page each one holds up (RD5, the private URL, comes first).

---

## How the gauntlet loop works

1. **Brief.** The orchestrator gives a worker one track (for example "discography"), the sources to read, the owner decisions that apply, and the output path.
2. **Worker draft.** The worker researches (files on disk first, then the web), and writes the deliverable. Every fact carries a source and a confidence label: **confirmed-owner** (Carly's decisions), **verified-source** (read first-hand, or two independent sources agree), **single-source**, or **unverified** (a lead; never published). Every file ends with discrepancies and open questions.
3. **Critic.** A separate critic re-checks a sample of claims against the files and live sources, checks every owner decision and the privacy rules, and writes `critiques/<track>-round<N>.md` with a **score out of 10**, **blocking issues** and **non-blocking issues**.
4. **Bar.** **8/10 or more, with no blocking issues**, is APPROVED. Anything less goes back to the worker with the critique, and the loop repeats (the discography took three rounds; footprint went from 6 to 8.5).
5. **Owner.** Approved work goes to Carly (speaking for David). Her answers become numbered owner decisions, which override every research file.

**Rules every deliverable follows:** owner decisions are authoritative; X1 (one excluded side project and person) never appears anywhere; private people appear in their public band roles only; search-engine summaries are leads, not facts; contested facts are shown as contested; isawtheocean.com is never linked; nothing is committed to git by the agents.

---

## Next steps

1. **Critic review of plan Draft 2** (round 2). Round 1's fixes are listed in the plan's revision log.
2. **Send `QUESTIONS-FOR-CARLY.md` to Carly**, Tier 1 first (A1, A3, C1, E1, A11, A7, A8, B2, A5, A6, B1).
3. **Research tidy:** each track fixes its critic's non-blocking items (RD1–RD15), including moving one private URL out of this repository (RD5).
4. **Browser pass** (a person with a normal browser, about half a day): open the Wayback pages that this environment could not reach, starting with the band's own concert history page (`/history/concerts.html`, 2003), the three unread journal months, the lyrics page and the one-sheet PDF (`research/03` §11; `research/04` §9). Save them under `research/legacy/wayback/`.
5. **Asset requests** to Carly and David: a recent photo, logo files, the *Shake It Up (Live)* cover master, original photo sessions (`research/05` §11).
6. **Phase 1 design samples** (after the answers): three sample pages in each design direction (`plan/00-master-plan.md` §6), then Phase 2 build from the daviddewese.com template.
