// axe-core on every built page (WCAG 2.0/2.1/2.2 A and AA rules, colour contrast included), at
// 1280 px and 375 px wide, with JavaScript on and off. Any violation fails the suite.
import AxeBuilder from '@axe-core/playwright';
import { serve, launch, allPages } from '../lib/harness.mjs';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const { base, close } = await serve();
const browser = await launch();
let failures = 0, checks = 0;
try {
  const pages = allPages();
  for (const width of [1280, 375]) for (const js of [true, false]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, javaScriptEnabled: true });
    if (!js) await ctx.route('**/*.js', (r) => r.abort());
    const page = await ctx.newPage();
    for (const p of pages) {
      await page.goto(base + p, { waitUntil: 'load' });
      const r = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      checks++;
      // horizontal scroll at phone width is a reflow failure (WCAG 1.4.10)
      const overflow = width === 375 ? await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) : 0;
      if (r.violations.length || overflow > 1) {
        failures++;
        console.log(`FAIL ${p} @${width}px ${js ? 'js' : 'no-js'}`);
        for (const v of r.violations) console.log(`     ${v.id} (${v.impact}): ${v.help}\n       ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('\n       ')}`);
        if (overflow > 1) console.log(`     horizontal scroll: ${overflow}px`);
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  close();
}
console.log(`axe: ${checks - failures} of ${checks} page checks passed`);
process.exit(failures ? 1 : 0);
