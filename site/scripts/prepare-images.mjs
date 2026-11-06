// Web copies of the cover masters and the photos the site shows (data/photos.json), made with
// sharp: JPEG and WebP at a few widths, sRGB, no metadata (sharp drops EXIF, XMP, IPTC and GPS
// unless asked to keep them). Masters are never served. Also crops the band's logos out of the
// derived logo sheets (assets/derived/logos/*.svg) by changing only the SVG viewBox: the artwork
// itself is copied byte for byte, never redrawn (the logos are used verbatim). Writes
// data/image-sizes.json (dimensions for width/height attributes) and public/favicon.ico.
// Skips files that are already up to date. Usage: node scripts/prepare-images.mjs [--force]
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(site, '..');
const force = process.argv.includes('--force');
const out = join(site, 'public', 'img');
const sizesFile = join(site, 'data', 'image-sizes.json');
const sizes = existsSync(sizesFile) && !force ? JSON.parse(readFileSync(sizesFile, 'utf8')) : {};

// Keep in step with src/lib/releases.ts COVER_SOURCES.
const COVERS = {
  'sound-as-ever': 'assets/source/covers/soundasever.jpg',
  'believe-ep': 'assets/source/covers/believe.jpg',
  overbored: 'assets/source/covers/overbored.jpg',
  nonetheless: 'assets/source/covers/nonetheless.jpg',
  'shake-it-up-live': 'assets/reference/dsp-artwork/shake-it-up-live-apple-music-3000.jpg',
  'great-day': 'assets/source/covers/great-day-1-upscale.png',
  'new-beginning': 'assets/source/covers/new-beginning-3000x3000-final.jpg',
};
const photos = JSON.parse(readFileSync(join(site, 'data', 'photos.json'), 'utf8')).photos.filter((p) => p.status === 'publish');

async function variants(key, src, widths) {
  const abs = join(root, src);
  if (!existsSync(abs)) throw new Error(`prepare-images: missing master ${src}`);
  const meta = await sharp(abs).metadata();
  const usable = widths.filter((w) => w < meta.width);
  if (!usable.length || usable.at(-1) < Math.min(meta.width, widths.at(-1))) usable.push(Math.min(meta.width, widths.at(-1)));
  const ws = [...new Set(usable)].sort((a, b) => a - b);
  const dir = join(out, dirname(key));
  mkdirSync(dir, { recursive: true });
  const mtime = statSync(abs).mtimeMs;
  for (const w of ws) {
    for (const fmt of ['jpg', 'webp']) {
      const f = join(out, `${key}-${w}.${fmt}`);
      if (!force && existsSync(f) && statSync(f).mtimeMs > mtime) continue;
      const img = sharp(abs).rotate().resize({ width: w, withoutEnlargement: true }).toColorspace('srgb');
      await (fmt === 'jpg' ? img.jpeg({ quality: 82, mozjpeg: true }) : img.webp({ quality: 80 })).toFile(f);
    }
  }
  const h = Math.round((meta.height / meta.width) * ws.at(-1));
  // keep whichever encoding is smaller (audit-qa round 1, M5): when a WebP copy is no smaller than
  // its JPEG, the page offers the JPEG alone (Photo/Cover drop the WebP <source>)
  const webp = ws.every((w) => statSync(join(out, `${key}-${w}.webp`)).size < statSync(join(out, `${key}-${w}.jpg`)).size);
  sizes[key] = { width: ws.at(-1), height: h, widths: ws, webp };
}

// Social cards (audit-seo round 1, S5/S6): 1200x630, the shape summary_large_image shows uncropped.
async function card(key, src) {
  const abs = join(root, src);
  const f = join(out, 'cards', `${key}.jpg`);
  mkdirSync(dirname(f), { recursive: true });
  if (!force && existsSync(f) && statSync(f).mtimeMs > statSync(abs).mtimeMs) return;
  await sharp(abs).rotate().resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention }).toColorspace('srgb').jpeg({ quality: 82, mozjpeg: true }).toFile(f);
}

for (const [slug, src] of Object.entries(COVERS)) await variants(`covers/${slug}`, src, [300, 600, 1200]);
for (const p of photos) await variants(`photos/${p.id}`, p.src, [480, 960, 1600]);
for (const p of photos) await card(p.id, p.src);
writeFileSync(sizesFile, JSON.stringify(sizes, null, 1) + '\n');

// ---- logos: viewBox crops of the derived sheets (verbatim artwork) ----
const LOGOS = {
  // the red "L" roundel with the THE LUXURY LINERS wordmark (logos.ai sheet)
  'roundel-wordmark': { sheet: 'logos-ai-sheet.svg', viewBox: '33 498 331 250' },
  // the stacked wordmark with the slate LXL oval (masters sheet)
  'stacked-lxl': { sheet: 'logo-masters-sheet.svg', viewBox: '188 516 184 216' },
  // the red roundel with the spaced wordmark (masters sheet)
  'roundel-spaced': { sheet: 'logo-masters-sheet.svg', viewBox: '145 62 280 170' },
};
mkdirSync(join(site, 'public', 'logos'), { recursive: true });
for (const [name, { sheet, viewBox }] of Object.entries(LOGOS)) {
  const svg = readFileSync(join(root, 'assets', 'derived', 'logos', sheet), 'utf8');
  const [, , w, h] = viewBox.split(' ').map(Number);
  const cropped = svg.replace(/<svg\b[^>]*>/, (tag) => tag
    .replace(/\swidth="[^"]*"/, ` width="${w}"`).replace(/\sheight="[^"]*"/, ` height="${h}"`)
    .replace(/\sviewBox="[^"]*"/, ` viewBox="${viewBox}"`));
  writeFileSync(join(site, 'public', 'logos', `${name}.svg`), cropped);
}
// a PNG of the roundel wordmark for JSON-LD "logo" and the social card
await sharp(join(site, 'public', 'logos', 'roundel-wordmark.svg'), { density: 300 }).resize({ width: 1200 }).flatten({ background: '#ffffff' }).png().toFile(join(site, 'public', 'logos', 'roundel-wordmark.png'));

// ---- favicon.ico: a 32 px and a 16 px PNG of the red roundel, wrapped in an ICO container ----
const roundel = { sheet: 'logos-ai-sheet.svg', viewBox: '116 499 180 248' };
{
  const svg = readFileSync(join(root, 'assets', 'derived', 'logos', roundel.sheet), 'utf8')
    .replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\swidth="[^"]*"/, ' width="180"').replace(/\sheight="[^"]*"/, ' height="248"').replace(/\sviewBox="[^"]*"/, ` viewBox="${roundel.viewBox}"`))
    // the roundel alone: drop the wordmark paths (black) so only the red L remains
    .replace(/<path[^>]*fill="rgb\(13\.[^"]*"[^>]*\/>/g, '');
  writeFileSync(join(site, 'public', 'favicon.svg'), svg);
  const pngs = [];
  for (const s of [16, 32]) pngs.push([s, await sharp(Buffer.from(svg), { density: 300 }).resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()]);
  const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const dirs = [], bodies = [];
  for (const [s, png] of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8); e.writeUInt32LE(offset, 12); offset += png.length;
    dirs.push(e); bodies.push(png);
  }
  writeFileSync(join(site, 'public', 'favicon.ico'), Buffer.concat([header, ...dirs, ...bodies]));
}
console.log(`prepare-images: ${Object.keys(sizes).length} images, ${Object.keys(LOGOS).length} logos, favicon`);
