// Browser checks for the round-1 audits (critiques/audit-*-round1.md), on the built site:
//   - contact form (a11y B2, qa S4): the rules are stated, an empty or bad submit shows an error
//     summary, aria-invalid and per-field messages tied with aria-describedby, and nothing typed
//     is lost; a nickname in quotes is accepted
//   - forced colours (a11y M1): the theme switch's knob is visible and changes place when pressed;
//     the home wordmark is drawn in the system text colour
//   - headings (design S3, a11y m6): no h1-h3 breaks inside a word, at 1440, 1024, 375 and 320 px
//   - LL-26 on phones (design S1): the New Beginning cover starts on the first screen at 375x667
//   - text-only resize (a11y m4): at 1280 px with the text at 200%, no horizontal scroll
// Round 2 (critiques/audit-*-round2.md):
//   - forced colours (a11y S1): only the current page's nav link keeps its underline; the submit
//     button keeps an edge (a11y S2)
//   - the masthead is two rows, at most 110 px, at 320, 375 and 414 px, and the New Beginning
//     cover shows at least 250 px on the first screen at 320x568 (design S1)
//   - the video label wraps inside the facade at 320 px with text at 200% (a11y m5)
// Round 3 (critiques/audit-design-round3.md): the hero cover stack keeps its inset and tilt (S1),
//   and at least 120 px of the cover is on the first screen at 667x375, 844x390 and 768x1024 (S2)
//   - /admin/ (security B2): with the real pinned Decap file and the admin CSP, the editor renders
//     its sign-in and throws nothing (needs the network for unpkg.com; the dist test that the
//     script is at the end of <body> runs either way)
// Run by `node tests/run.mjs axe` (so `npm test` and `npm run build:production` run it too).
import { serve, launch, allPages } from '../lib/harness.mjs';
import { ADMIN_CSP } from '../../worker/headers.ts';

const { base, close } = await serve();
const browser = await launch();
let failures = 0, checks = 0;
const check = (ok, msg) => { checks++; if (!ok) { failures++; console.log(`FAIL ${msg}`); } };

/** Words of h1-h3 that wrap inside the word: two adjacent letters on different lines. */
const brokenWords = () => {
  const out = [];
  for (const h of document.querySelectorAll('h1, h2, h3')) {
    if (!h.offsetParent && getComputedStyle(h).position !== 'fixed') continue;
    if (h.closest('.visually-hidden')) continue;
    const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = n.textContent;
      for (const m of t.matchAll(/[\p{L}\p{N}’']{2,}/gu)) {
        let prev = null;
        for (let i = m.index; i < m.index + m[0].length; i++) {
          const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
          const rect = r.getBoundingClientRect();
          if (!rect.width) continue;
          if (prev !== null && rect.top > prev + rect.height / 2) { out.push(m[0]); break; }
          prev = rect.top;
        }
      }
    }
  }
  return out;
};

try {
  // ---- contact form, with JavaScript
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${base}/contact/`);
    const stated = await page.textContent('form[data-contact]');
    check(/All fields are required/.test(stated), 'contact: "All fields are required" is stated');
    check(/At least 10 characters/.test(stated) && /no more than 3 links/.test(stated), 'contact: the message rules are stated');
    check((await page.locator('label .req').count()) === 4, 'contact: every field is marked (required)');
    await page.fill('#name', 'David "Larry" Wilstermann');
    await page.fill('#email', 'not-an-address');
    await page.fill('#message', 'short');
    await page.click('button[type="submit"]');
    const summary = page.locator('[data-contact-errors]');
    check(await summary.isVisible(), 'contact: the error summary shows');
    check(await page.evaluate(() => document.activeElement?.hasAttribute('data-contact-errors')), 'contact: focus moves to the summary');
    check((await page.getAttribute('#email', 'aria-invalid')) === 'true', 'contact: aria-invalid on the email field');
    check((await page.getAttribute('#name', 'aria-invalid')) === null, 'contact: a nickname in quotes is a valid name');
    check((await page.getAttribute('#topic', 'aria-invalid')) === 'true', 'contact: no topic chosen is an error');
    const described = await page.evaluate(() => (document.querySelector('#message').getAttribute('aria-describedby') ?? '').split(' ').map((id) => document.getElementById(id)?.textContent ?? '').join(' '));
    check(/at least 10 characters/i.test(described), 'contact: the message error is tied to the field');
    check((await page.inputValue('#message')) === 'short' && (await page.inputValue('#name')) === 'David "Larry" Wilstermann', 'contact: nothing typed is lost');
    check((await summary.locator('a[href="#email"]').count()) === 1, 'contact: the summary links to the field');
    await ctx.close();
  }
  // ---- forced colours (Windows high contrast)
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, forcedColors: 'active', colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(`${base}/`);
    const knob = () => page.evaluate(() => {
      const k = document.querySelector('.theme-switch__knob');
      const a = getComputedStyle(k, '::after');
      return { track: getComputedStyle(k).backgroundColor, dot: a.backgroundColor, x: a.transform };
    });
    const off = await knob();
    check(off.track !== off.dot, `forced colours: knob and track differ (${off.track} / ${off.dot})`);
    await page.click('.theme-switch');
    const on = await knob();
    check(on.x !== off.x, 'forced colours: the knob moves when the switch is pressed');
    const logo = await page.evaluate(() => [getComputedStyle(document.querySelector('.logo-full')).color, getComputedStyle(document.body).color]);
    check(logo[0] === logo[1], `forced colours: the wordmark uses the text colour (${logo[0]} vs ${logo[1]})`);
    // a11y r2 S1: on /story/ only the Story link is underlined (its border differs from the page colour)
    await page.goto(`${base}/story/`);
    const marks = await page.evaluate(() => [...document.querySelectorAll('.nav a')].map((a) => ({ cur: a.getAttribute('aria-current') === 'page', b: getComputedStyle(a).borderBottomColor, bg: getComputedStyle(document.body).backgroundColor })));
    check(marks.some((m) => m.cur), 'forced colours: /story/ has a current nav link');
    check(marks.every((m) => m.cur ? m.b !== m.bg : m.b === m.bg), `forced colours: only the current nav link is underlined (${JSON.stringify(marks.map((m) => [m.cur, m.b]))})`);
    // a11y r2 S2: the Send button has a visible edge
    await page.goto(`${base}/contact/`);
    const edge = await page.evaluate(() => { const b = getComputedStyle(document.querySelector('button[type="submit"]')); return { w: parseFloat(b.borderTopWidth), c: b.borderTopColor, bg: getComputedStyle(document.body).backgroundColor }; });
    check(edge.w >= 1 && edge.c !== edge.bg, `forced colours: the Send button has an edge (${edge.w}px ${edge.c})`);
    await ctx.close();
  }
  // ---- headings never break inside a word
  for (const width of [1440, 1024, 375, 320]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    for (const p of allPages()) {
      await page.goto(base + p, { waitUntil: 'load' });
      const broken = await page.evaluate(brokenWords);
      check(!broken.length, `${p} @${width}px: a heading breaks inside ${broken.join(', ')}`);
    }
    await ctx.close();
  }
  // ---- LL-26: a 2026 cover on the first screen of a phone
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await ctx.newPage();
    await page.goto(`${base}/`);
    const top = await page.evaluate(() => document.querySelector('.stack__front img').getBoundingClientRect().top);
    check(top < 667, `home @375x667: the New Beginning cover starts at ${Math.round(top)}px (first screen ends at 667)`);
    await ctx.close();
  }
  // ---- design r2 S1: a two-row masthead on phones, and more of the cover on a small screen
  for (const [width, height] of [[320, 568], [375, 667], [414, 896]]) {
    for (const js of [true, false]) {
      const ctx = await browser.newContext({ viewport: { width, height }, javaScriptEnabled: js });
      const page = await ctx.newPage();
      await page.goto(`${base}/`);
      const m = await page.evaluate(() => {
        const head = document.querySelector('.masthead').getBoundingClientRect();
        const links = [...document.querySelectorAll('.nav a')].map((a) => a.getBoundingClientRect().top);
        const img = document.querySelector('.stack__front img').getBoundingClientRect();
        return { h: head.height, navRows: new Set(links.map((t) => Math.round(t))).size, coverTop: img.top };
      });
      const tag = `@${width}x${height}${js ? '' : ' no JS'}`;
      check(m.h <= 110, `masthead ${tag}: ${Math.round(m.h)}px tall (at most 110)`);
      check(m.navRows === 1, `masthead ${tag}: the nav is on ${m.navRows} rows (one)`);
      if (width === 320) check(height - m.coverTop >= 250, `home ${tag}: ${Math.round(height - m.coverTop)}px of the New Beginning cover on the first screen (at least 250)`);
      await ctx.close();
    }
  }
  // ---- design r3 S1: the cover stack as in the sample: the front cover is a block, at most 0.86
  // of the stack wide and really tilted; on phones the stack is capped at 300 px
  for (const [width, height] of [[1440, 900], [375, 667]]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    const page = await ctx.newPage();
    await page.goto(`${base}/`);
    const m = await page.evaluate(() => {
      const stack = document.querySelector('.stack'), front = document.querySelector('.stack__front');
      return { stack: stack.getBoundingClientRect().width, front: front.offsetWidth, display: getComputedStyle(front).display, tilt: getComputedStyle(front).transform };
    });
    check(m.front <= 0.86 * m.stack, `home @${width}: the front cover is ${Math.round(m.front)}px of a ${Math.round(m.stack)}px stack (at most 0.86)`);
    check(m.display === 'block' && m.tilt !== 'none', `home @${width}: the front cover is a tilted block (display ${m.display}, transform ${m.tilt})`);
    if (width === 375) check(m.stack <= 300, `home @375: the cover stack is ${Math.round(m.stack)}px wide (at most 300)`);
    await ctx.close();
  }
  // ---- design r3 S2: landscape phones and small tablets show at least 120 px of the cover
  for (const [width, height] of [[667, 375], [844, 390], [768, 1024]]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    const page = await ctx.newPage();
    await page.goto(`${base}/`);
    const top = await page.evaluate(() => document.querySelector('.stack__front img').getBoundingClientRect().top);
    check(height - top >= 120, `home @${width}x${height}: ${Math.round(height - top)}px of the New Beginning cover on the first screen (at least 120)`);
    await ctx.close();
  }
  // ---- a11y r2 m5: the video label never clips at 320 px with text at 200%
  {
    const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } });
    const page = await ctx.newPage();
    for (const p of ['/', '/music/overbored/', '/music/great-day/']) {
      await page.goto(base + p);
      await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
      const fit = await page.evaluate(() => { const l = document.querySelector('.yt__label'); const y = document.querySelector('.yt'); if (!l) return null; const a = l.getBoundingClientRect(), b = y.getBoundingClientRect(); return { inside: a.left >= b.left - 0.5 && a.right <= b.right + 0.5, clipped: l.scrollWidth > l.clientWidth + 1 }; });
      check(fit === null || (fit.inside && !fit.clipped), `${p} @320px, text 200%: the video label stays inside the facade (${JSON.stringify(fit)})`);
    }
    await ctx.close();
  }
  // ---- security r2 B2: /admin/ renders the editor (real pinned bundle, admin CSP)
  {
    const html = (await import('node:fs')).readFileSync(new URL('../../public/admin/index.html', import.meta.url), 'utf8');
    const src = /<script src="(https:\/\/unpkg\.com\/decap-cms@[^"]+)"/.exec(html)[1];
    let bundle = null;
    try { const r = await fetch(src, { signal: AbortSignal.timeout(20000) }); if (r.ok) bundle = Buffer.from(await r.arrayBuffer()); } catch { /* offline */ }
    if (!bundle) console.log(`NOTE /admin/ browser check not run: ${src} unreachable (the dist test of the script's place still ran)`);
    else {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage();
      const errors = [], csp = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => { if (/Content Security Policy|Refused to/i.test(m.text())) csp.push(m.text()); });
      await page.route(src, (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: bundle, headers: { 'access-control-allow-origin': '*' } }));
      await page.route(`${base}/admin/config.yml`, (route) => route.continue());
      await page.route(`${base}/admin/`, async (route) => { const r = await route.fetch(); await route.fulfill({ response: r, headers: { ...r.headers(), 'content-security-policy': ADMIN_CSP } }); });
      await page.goto(`${base}/admin/`);
      const login = await page.getByText(/Login with GitHub/i).first().waitFor({ timeout: 20000 }).then(() => true).catch(() => false);
      check(login, `/admin/: the editor shows its sign-in (errors: ${errors.join(' | ') || 'none'})`);
      check(!errors.length, `/admin/: no script errors (${errors.join(' | ')})`);
      check(!csp.length, `/admin/: no CSP violations (${csp.join(' | ')})`);
      await ctx.close();
    }
  }
  // ---- text-only resize to 200% at 1280 px (WCAG 1.4.4): no horizontal scroll
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    for (const p of allPages()) {
      await page.goto(base + p, { waitUntil: 'load' });
      // a larger default text size, as a browser's text-only zoom sets it (rem and em scale)
      await page.addStyleTag({ content: 'html { font-size: 200% !important; }' }).catch(() => {});
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(overflow <= 1, `${p} @1280px, text 200%: horizontal scroll ${overflow}px`);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  close();
}
console.log(`behaviour: ${checks - failures} of ${checks} checks passed`);
process.exit(failures ? 1 : 0);
