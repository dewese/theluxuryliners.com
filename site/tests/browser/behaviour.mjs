// Browser checks for the round-1 audits (critiques/audit-*-round1.md), on the built site:
//   - contact form (a11y B2, qa S4): the rules are stated, an empty or bad submit shows an error
//     summary, aria-invalid and per-field messages tied with aria-describedby, and nothing typed
//     is lost; a nickname in quotes is accepted
//   - forced colours (a11y M1): the theme switch's knob is visible and changes place when pressed;
//     the home wordmark is drawn in the system text colour
//   - headings (design S3, a11y m6): no h1-h3 breaks inside a word, at 1440, 1024, 375 and 320 px
//   - LL-26 on phones (design S1): the New Beginning cover starts on the first screen at 375x667
//   - text-only resize (a11y m4): at 1280 px with the text at 200%, no horizontal scroll
// Run by `node tests/run.mjs axe` (so `npm test` and `npm run build:production` run it too).
import { serve, launch, allPages } from '../lib/harness.mjs';

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
