// Screenshots of the built site for review (design/roundel-applied/): home, a release page, a
// Story chapter and People at 1440 px (light) and 375 px (dark), full length, plus overview.png:
// the four pages side by side at 1440 px, light, deviceScaleFactor 2 (the first 2000 CSS px of
// each). Serves dist/ locally and blocks every off-site request.
// Usage: node scripts/screenshots.mjs [outDir]
import { serve, launch } from '../tests/lib/harness.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const out = process.argv[2] ?? join(process.cwd(), '..', 'design', 'roundel-applied');
mkdirSync(out, { recursive: true });
const PAGES = [['home', '/'], ['release-overbored', '/music/overbored/'], ['story-believe', '/story/believe/'], ['people', '/people/']];
const { base, close } = await serve();
const browser = await launch();
const offsite = [];
async function shot(path, file, { width, scheme, dpr = 1, clipHeight }) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: dpr, colorScheme: scheme, reducedMotion: 'reduce' });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : (offsite.push(r.request().url()), r.abort())));
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  // load the lazy images
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(300);
  await page.evaluate(() => document.fonts.ready);
  const opts = clipHeight ? { path: file, clip: { x: 0, y: 0, width, height: clipHeight }, fullPage: true } : { path: file, fullPage: true, type: file.endsWith('.jpg') ? 'jpeg' : 'png', ...(file.endsWith('.jpg') ? { quality: 80 } : {}) };
  await page.screenshot(opts);
  await ctx.close();
}
try {
  for (const [name, path] of PAGES) {
    await shot(path, join(out, `${name}-1440-light.jpg`), { width: 1440, scheme: 'light' });
    await shot(path, join(out, `${name}-375-dark.jpg`), { width: 375, scheme: 'dark' });
  }
  const tiles = [];
  for (const [name, path] of PAGES) {
    const f = join(out, `.tile-${name}.png`);
    await shot(path, f, { width: 1440, scheme: 'light', dpr: 2, clipHeight: 2000 });
    tiles.push(f);
  }
  const W = 2880, H = 4000, gap = 80;
  await sharp({ create: { width: tiles.length * W + (tiles.length + 1) * gap, height: H + 2 * gap, channels: 3, background: '#d9d9d9' } })
    .composite(tiles.map((f, i) => ({ input: f, left: gap + i * (W + gap), top: gap })))
    .png({ compressionLevel: 9, palette: true, colors: 256 }).toFile(join(out, 'overview.png'));
  const { rmSync } = await import('node:fs');
  for (const f of tiles) rmSync(f);
} finally {
  await browser.close();
  close();
}
console.log(`screenshots: written to ${out}; off-site requests blocked: ${offsite.length}${offsite.length ? `\n  ${offsite.join('\n  ')}` : ''}`);
