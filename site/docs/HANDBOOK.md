# theluxuryliners.com: the maintainer handbook

For Carly's team, who look after the site. Plain language; no developer needed for chapters 1–6.
It follows the daviddewese.com handbook, so the two sites are run the same way.

> **Status.** The site builds and every check passes on a laptop. It is **not live**: the Cloudflare
> hosting, the contact-form secrets, Turnstile, analytics and the web editor's sign-in are set up
> once, at hosting setup (chapters 7–11), with the developer on a call.

## Contents
1. How the site works
2. Where things live
3. Editing copy
4. Adding or changing a release
5. Adding a photo, with or without a credit
6. Running the checks
7. Setting up on a laptop
8. Cloudflare: hosting, the Worker and the domain
9. The contact form: Turnstile and the secrets
10. Analytics: Cloudflare Web Analytics, Google Search Console, Bing Webmaster Tools
11. The web editor (Decap CMS)
12. Publishing, the release build, and rolling back
13. Old addresses (redirects and 410s)
14. Accounts and dates to remember
15. When to call a developer

---

## 1. How the site works
- Every page is **generated from files**: the release catalogue (`data/releases.json`), the copy the
  writers keep in `content/`, and a few site files in `site/data/`. Nobody edits pages directly.
- The build **checks** everything before anything is published: facts, privacy rules, accessibility,
  links, structured data (chapter 6). A failed check stops the publish.
- Every page works without JavaScript. The only scripts are the contact form's small helper,
  Turnstile (on the contact page) and the cookie-free analytics beacon.
- The design is deliberately plain. Colours, sizes and spacing are **tokens** at the top of
  `site/src/styles/global.css`; the chosen design direction replaces them (and can replace the file).

## 2. Where things live
| What | Where | Notes |
|---|---|---|
| The release catalogue (master for both sites, LL-3) | `data/releases.json` | daviddewese.com copies the band's releases from here. Never put notes meant for the team in public fields |
| Page copy: home, Story chapters, Facts, People, Press, Shows, cover songs, press-kit bios | `content/` (`home.md`, `story/NN-*.md`, `facts.json`, `people.json`, `press.json`, `shows.json`, `covers.json`, `epk.md`) | Written by the copy team. Fields named `source`, `confidence`, `notes_internal`, `held`, and any record with `"publish": false`, are **never shown** |
| Photos shown on the site, with caption and credit | `site/data/photos.json` | One record per photo; the same caption and credit appear everywhere |
| Cover-art credits | `site/data/artwork.json` | Used on release pages |
| Fallback data (used only if a `content/` file is missing) | `site/data/*.json` | |
| The Vault lists (old MP3 titles, old websites) | `site/data/vault.json` | Titles only; the site offers no downloads |
| Short fixed sentences (one-liner, status line fallback, social links) | `site/src/lib/site.ts` | The one-liner is owner-approved word for word |
| Release-page extras (who plays, production, notes, blurbs) | `site/src/lib/releases.ts` | |
| Logos | `assets/derived/logos/` (the band's own artwork) | The site crops them, never redraws them |
| Old addresses | `data/legacy-urls.json` | Chapter 13 |
| The checks | `site/scripts/`, `site/tests/` | Chapter 6 |

## 3. Editing copy
Open the file in `content/` (or use the web editor, chapter 11), change the words, and run the
checks. The house rules, in plain words:
- The one-line description is fixed: "The Luxury Liners are a power-pop band co-founded in 1997 by
  David Dewese and Chad Edgington, who took it to Nashville together. The name comes from the Gram
  Parsons song 'Luxury Liner'."
- "The band never broke up. The four forever members reconnected during the pandemic and started
  making music again." is used word for word. Never "reunion", "broke up", "former member".
- About Chad, Scott and Larry: names, band roles, years and band-era photos only. Nothing about
  anyone's life outside the band, and never which member lives in which state.
- Never mention a college talent show, and never connect the "Great Day" single to any demo or
  to 2008.
- No MP3s or downloads, no newsletter, no logo designer credit, no e-mail addresses.
- No notes about where a fact came from in the public text ("as credited on…"). A fact with only
  one source may be printed only with the source in the sentence ("Discogs lists…").
- No dated news that goes stale. The home status line should still be true in a year.
- Home blurbs for the singles: say something particular about the record, with no date (the date
  is printed beside it). A blurb that is too thin is replaced by the site's own (the build says so).

## 4. Adding or changing a release
1. Add or edit the record in `data/releases.json` (copy an existing one). Public date = the date
   Spotify lists.
2. If it should have its own page, add its id and page name to `SLUGS` in
   `site/src/lib/releases.ts` and to `PAGES` in `site/scripts/validate-data.mjs`, and its cover
   master to `COVER_SOURCES` (and to `COVERS` in `site/scripts/prepare-images.mjs`).
3. Add its cover-art credit to `site/data/artwork.json`.
4. Run the checks (chapter 6). Then tell the daviddewese.com maintainers: their copy must match
   (the LL-3 check fails on either site if the shared fields differ).

## 5. Adding a photo, with or without a credit
1. Put the original in `assets/source/photos/`.
2. Add a record to `site/data/photos.json`: id, file, era, year, caption, a description for screen
   readers (`alt`), and `credit` (the photographer's name) or `null` when the band, family or a
   self-timer took it. Name people only where the band has confirmed who they are.
3. A photographer whose credit is not confirmed yet: set `status` to `pending`. The site will not
   show the photo until the credit is confirmed. (The Amy Wilstermann 2003 set was cleared by LL-45:
   credit line only.)
4. The 2002 photo of the four is always captioned exactly "David Wilstermann, Chad Edgington,
   David Dewese and Scott Carpenter in 2002", never "line-up".

## 6. Running the checks
In `site/`: `npm test` builds the site and runs:
| Suite | What it checks |
|---|---|
| `data` | the release catalogue and site data (real dates, credits, statuses, no e-mail addresses) |
| `unit` | small helpers, the Worker (contact form, old addresses), the LL-3 comparison, and rules over the built pages (writers, credits, shows order, no bonus-disc mention, privacy page…) |
| `dist` | the copy, privacy and owner-decision rules over every built file; plus the copy team's own checker (`content/check-content.mjs --dist-only`) |
| `jsonld` | the structured data search engines read |
| `repo` | no tracked file of this public repository holds a private literal (`content/check-content.mjs --repo`, hashed matcher in `content/private-literals.mjs`) |
| `axe` | accessibility (WCAG 2.2 AA rules) on every page, desktop and phone width, with and without JavaScript; then the contact form's errors, forced colours, headings that break inside a word, the first screen on a phone and text resized to 200% (`tests/browser/behaviour.mjs`) |
A failure names the page and the rule. `node tests/run.mjs axe` runs one suite.

## 7. Setting up on a laptop
1. Install Node.js 22.18 or newer.
2. `cd site && npm ci` (installs the exact versions in `package-lock.json`).
3. `npm run dev` for a live preview at `http://localhost:4321/`; `npm test` for the checks.
4. Browser tests use the Chromium already installed with Playwright; set `CHROMIUM=/path/to/chrome`
   if it lives elsewhere. Never run `playwright install` on the build machines.

## 8. Cloudflare: hosting, the Worker and the domain
The site is a Cloudflare Worker with static assets (free plan), configured in `site/wrangler.jsonc`.
1. **Zone.** Add theluxuryliners.com to the team's Cloudflare account, import the DNS records as
   DNS-only, change the nameservers at GoDaddy, and wait until the zone has been Active 7 days.
2. **Staging.** `npm run build:production` then `npx wrangler deploy --env staging`. This attaches
   `staging.theluxuryliners.com`; every staging response says `noindex`.
3. **Email routing.** Turn on Cloudflare Email Routing for the zone and verify the address the
   contact form sends to (it is the destination for the `send_email` binding).
4. **Cutover** (one window, with the team present): delete the Carrd apex record, run
   `npx wrangler deploy`, attach the apex as the Worker's Custom Domain, add the `www` → apex
   redirect, turn on Always Use HTTPS, run the smoke checks (home, a release page, `/contact/`,
   an old address from `dist/_redirects`, an old image path from `worker/gone.ts` → 410), then
   remove the domain from Carrd. **Do not** put a redirect rule in front of Carrd (Error 1000).
5. The domain renews **2027-03-19**: confirm auto-renew at GoDaddy.
6. **Zone settings that break the site's security policy.** Turn **off** Rocket Loader, Email
   Address Obfuscation (Scrape Shield) and automatic Web Analytics injection (Web Analytics →
   "Enable with JS snippet", never "automatic setup"). Each injects inline scripts, which the
   Content-Security-Policy blocks, so pages would break or log errors. The site adds its own
   analytics beacon when built with the token (chapter 10).
7. **Staging behind Cloudflare Access.** Zero Trust → Access → Applications → add
   `staging.theluxuryliners.com` with a policy for the team's email addresses only, so drafts are
   never public. Every staging response is `noindex` and carries the same security headers as
   production.

## 9. The contact form: Turnstile and the secrets
The form posts to `/api/contact` (the Worker). The address messages go to is **never** in the
repository or a page: it is a Worker secret.
1. **Turnstile.** Cloudflare dashboard → Turnstile → Add site: hostnames `theluxuryliners.com` and
   `staging.theluxuryliners.com`, mode Managed. Copy the **site key** (public) and the **secret key**.
2. Build with the site key: `PUBLIC_TURNSTILE_SITE_KEY=<site key> npm run build:production`
   (a release build fails without it). In the Cloudflare build settings, add it as a build variable.
3. Set the secrets on each environment (they are typed in, never saved in a file):
   - `npx wrangler secret put TURNSTILE_SECRET` (and `--env staging`)
   - `npx wrangler secret put CONTACT_TO` (the address messages go to; the developer and Carly
     enter it together)
4. Test on staging: send a message; it arrives with the subject `[theluxuryliners.com] <topic>`.
   A message sent with JavaScript off arrives marked `[no Turnstile]`.
5. **Turnstile is required.** Production has `"REQUIRE_TURNSTILE": "1"` in `wrangler.jsonc`, and
   the Worker refuses any message without a verified Turnstile token whenever `TURNSTILE_SECRET`
   is set (a script can fake the browser's "sent from this site" header, so that is no longer
   enough). Set `TURNSTILE_SECRET` **before** the first deploy, or the form refuses everything.
   Visitors without JavaScript see the form again with a note asking them to turn JavaScript on;
   the accessibility page says so once the site key is built in. To accept messages without
   JavaScript again (marked `[no Turnstile]`, with the honeypot, timing check and rate limit
   still applied), the owner must decide it: then remove `REQUIRE_TURNSTILE` and add
   `"ALLOW_NO_JS_CONTACT": "1"` to `vars`.
   The rate limit runs before anything else costly, so a flood of bad tokens never reaches
   Cloudflare's siteverify. The form may be sent from `theluxuryliners.com` and
   `www.theluxuryliners.com` (`CONTACT_HOSTNAMES`); the `www` → apex redirect (chapter 8) is
   still the main path.
6. Limits: three messages a minute per connection (`ratelimits` in `wrangler.jsonc`). Check the
   Workers usage chart monthly; the free plan's daily limit is far above what the form needs.

## 10. Analytics: Cloudflare Web Analytics, Google Search Console, Bing Webmaster Tools
- **Cloudflare Web Analytics** (cookie-free, no banner): dashboard → Analytics & Logs → Web
  Analytics → Add a site → theluxuryliners.com → choose the JavaScript snippet and copy its
  **token**. Build with `PUBLIC_CF_ANALYTICS_TOKEN=<token>`. Without the token the beacon is left
  out and the privacy page leaves out the analytics paragraph; a release build fails without it.
- **Google Search Console**: add a **Domain** property for theluxuryliners.com; verify with the
  TXT record Google gives you (add it in Cloudflare DNS). Submit `https://theluxuryliners.com/sitemap-index.xml`.
  For 60 days after launch, check Pages → "Not found (404)" weekly: old addresses that 404 should be
  added to `data/legacy-urls.json` (chapter 13).
- **Bing Webmaster Tools**: sign in, "Import from Google Search Console" (or verify by DNS TXT),
  and submit the same sitemap.
- `robots.txt` allows all crawlers, AI included; `llms.txt` gives answer engines the key facts.

## 11. The web editor (Decap CMS)
`/admin/` is the editor (configured in `site/public/admin/config.yml`). It edits the Story
chapters, the home page, the press-kit bios and the photo records. Every change is a draft:
Draft → In review → Ready; the checks run on it, and a second person publishes it.
That is enforced on GitHub, not just agreed (set it up once, Settings → Branches → Add rule for
`main`):
- require a pull request before merging, with **one approving review**;
- require the status check **`checks`** (`.github/workflows/ci.yml`: `npm ci`, `npm test`, the
  content checker) to pass, and the branch to be up to date;
- do not allow force pushes or deletions; include administrators.
Setup (once): create a GitHub OAuth app for the editor and a small Cloudflare Worker that does the
sign-in (the "Decap GitHub OAuth" helper), then set `base_url` in `config.yml`. Until then, edit
the files directly and run the checks. The helper must:
- hand the token back with `window.opener.postMessage(message, "https://theluxuryliners.com")`,
  naming the site's origin, never `"*"` (`/admin/` allows the sign-in popup to talk back with
  `Cross-Origin-Opener-Policy: same-origin-allow-popups`; every other page keeps `same-origin`);
- ask GitHub for the narrowest scope that works: `public_repo` for this public repository (never
  `repo`), and keep the OAuth app's callback URL to the helper's own address.
The editor's script is pinned (`decap-cms@3.17.1`) with a Subresource Integrity hash in
`public/admin/index.html`, and `/admin/`'s own Content-Security-Policy allows that one file
only. To upgrade, change the version in both places and recompute the hash (the comment in
`index.html` shows how).

## 12. Publishing, the release build, and rolling back
- `npm run build:production` is the build that goes live. It is strict: it fails on any
  PLACEHOLDER copy left on a page, and on a missing Turnstile key or analytics token.
- Publish: `npx wrangler deploy` (after the checks pass).
- Roll back: Cloudflare dashboard → Workers → theluxuryliners-com → Deployments → pick the last
  good one → Rollback. Or `npx wrangler rollback`.

## 13. Old addresses (redirects and 410s)
Every address of the band's old websites (675) has an answer. 670 are in `data/legacy-urls.json`;
the five that name the old family page and its images are kept out of this public repository, in
`data/private/legacy-urls.private.json` (git-ignored; the developer keeps a copy with the other
secrets), and the build merges them when the file is there:
- moved pages go to their new page (301), listed in `dist/_redirects`, generated by
  `site/scripts/build-redirects.mjs` (never edit `_redirects` by hand). Every target must exist;
  addresses whose page does not exist yet (a journal month, the old news) go to the nearest page
  that does, and move to the real page automatically once it exists;
- the 2007–09 site's addresses with `?content=…` are redirected by the Worker;
- old images, styles and private files answer **410 Gone** (`site/worker/gone.ts`, generated);
- bot probes and Cloudflare's own paths answer 404.
To change an answer, edit the row's `action` / `suggested_target` in `data/legacy-urls.json` and
rebuild.

## 14. Accounts and dates to remember
GoDaddy (domain, renews 2027-03-19), Cloudflare (zone, Worker, Turnstile, Web Analytics, Email
Routing), GitHub (the repository; the editor's sign-in), Google Search Console, Bing Webmaster
Tools; Spotify for Artists and Apple Music for Artists (David). Check monthly: the Workers usage
chart, Search Console's "Not found" list.

## 15. When to call a developer
A check fails and the message is unclear; a new kind of page; anything in `wrangler.jsonc`,
`site/worker/` or `site/scripts/`; the cutover; changing the design tokens for the chosen direction.
