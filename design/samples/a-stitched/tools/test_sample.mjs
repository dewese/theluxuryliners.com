// Browser checks for design sample A, and its screenshots.
//   node tools/test_sample.mjs            checks only
//   node tools/test_sample.mjs --shots    checks, then writes screenshots/
// Needs playwright-core and axe-core (site/node_modules) and the preinstalled Chromium.
// The pages are served over local HTTP: the engraved plates are CSS masks, which
// Chromium will not apply from file:// URLs.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SAMPLE = path.dirname(HERE);
const REPO = path.resolve(SAMPLE, "../../..");
const require = createRequire(path.join(REPO, "site", "package.json"));
const { chromium } = require("playwright-core");
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const CHROME = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const PAGES = ["index.html", "overbored.html", "story-nudie-suits.html"];
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".woff2": "font/woff2", ".png": "image/png" };

const server = http.createServer((req, res) => {
  const p = path.join(SAMPLE, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(SAMPLE) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch({ executablePath: CHROME });
let failures = 0;
const fail = (m) => { failures++; console.log("FAIL " + m); };
const ok = (m) => console.log("ok   " + m);

async function open(page, width, theme, dsf = 1) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: dsf });
  await ctx.addInitScript((t) => { try { localStorage.setItem("ll-theme", t); } catch (e) {} }, theme);
  const external = [];
  await ctx.route("**/*", (route) => {
    const u = route.request().url();
    if (!u.startsWith(BASE)) { external.push(u); return route.abort(); }
    return route.continue();
  });
  const p = await ctx.newPage();
  await p.goto(BASE + page, { waitUntil: "networkidle" });
  // bring lazy images in
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
  });
  await p.waitForLoadState("networkidle");
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(200);
  return { ctx, p, external };
}

for (const pg of PAGES) {
  for (const theme of ["dark", "light"]) {
    const { ctx, p, external } = await open(pg, 1280, theme);
    // axe
    await p.addScriptTag({ content: AXE });
    const r = await p.evaluate(async () => await window.axe.run(document, { resultTypes: ["violations"] }));
    if (r.violations.length) {
      fail(`${pg} [${theme}] axe: ` + r.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`).join("; "));
    } else ok(`${pg} [${theme}] axe: 0 violations`);
    if (external.length) fail(`${pg} [${theme}] requested off-site before any click: ${external.join(", ")}`);
    else ok(`${pg} [${theme}] no off-site requests on load`);
    // no inline styles
    const inline = await p.evaluate(() => document.querySelectorAll("[style], style").length);
    if (inline) fail(`${pg}: ${inline} inline style attributes/elements`); else ok(`${pg}: no inline styles`);
    // all images decoded, fonts loaded
    const broken = await p.evaluate(() => [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src));
    if (broken.length) fail(`${pg}: images not loaded: ${broken}`); else ok(`${pg}: images load`);
    const fonts = await p.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family + " " + f.style));
    ok(`${pg}: fonts loaded: ${[...new Set(fonts)].join(", ")}`);
    await ctx.close();
  }
  for (const w of [375, 320]) {
    for (const theme of ["dark", "light"]) {
      const { ctx, p } = await open(pg, w, theme);
      const [sw, iw] = await p.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      if (sw > iw) {
        const wide = await p.evaluate(() => [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 0.5).slice(0, 5).map((e) => e.tagName + "." + e.className));
        fail(`${pg} @${w} [${theme}]: horizontal scroll ${sw} > ${iw}: ${wide}`);
      } else ok(`${pg} @${w} [${theme}]: no horizontal scroll`);
      // nav wraps without overlap: every link fully inside the viewport and none overlap
      const navOk = await p.evaluate(() => {
        const r = [...document.querySelectorAll(".nav a")].map((a) => a.getBoundingClientRect());
        const inside = r.every((b) => b.left >= 0 && b.right <= window.innerWidth);
        const overlap = r.some((a, i) => r.some((b, j) => i < j && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom));
        return inside && !overlap;
      });
      if (!navOk) fail(`${pg} @${w}: nav links overflow or overlap`); else ok(`${pg} @${w} [${theme}]: nav wraps cleanly`);
      await ctx.close();
    }
  }
}

// Theme switch: state changes, label does not.
{
  const { ctx, p } = await open("index.html", 1280, "dark");
  const sw = p.locator(".theme-switch");
  const before = [await sw.getAttribute("aria-pressed"), (await sw.textContent()).trim(), await p.evaluate(() => document.documentElement.dataset.theme)];
  await sw.click();
  const after = [await sw.getAttribute("aria-pressed"), (await sw.textContent()).trim(), await p.evaluate(() => document.documentElement.dataset.theme)];
  if (before[0] === "false" && after[0] === "true" && before[1] === after[1] && before[2] === "dark" && after[2] === "light") ok(`theme switch: aria-pressed ${before[0]}→${after[0]}, label "${after[1]}" unchanged, theme ${before[2]}→${after[2]}`);
  else fail(`theme switch: ${JSON.stringify({ before, after })}`);
  await ctx.close();
}

// YouTube facade: nothing loads until click; then a youtube-nocookie iframe.
{
  const { ctx, p, external } = await open("overbored.html", 1280, "dark");
  const n0 = await p.locator("iframe").count();
  await p.locator("a.yt").first().click();
  const src = await p.locator(".yt iframe").first().getAttribute("src");
  if (n0 === 0 && src && src.startsWith("https://www.youtube-nocookie.com/embed/")) ok(`video facade: no iframe until click, then ${src}`);
  else fail(`video facade: iframes before click ${n0}, src ${src}`);
  if (external.some((u) => /youtube\.com|ytimg|googlevideo/.test(u) && !/youtube-nocookie/.test(u))) fail("video facade hit youtube.com (not nocookie) " + external);
  await ctx.close();
}

if (process.argv.includes("--shots")) {
  const out = path.join(SAMPLE, "screenshots");
  fs.mkdirSync(out, { recursive: true });
  const names = { "index.html": "home", "overbored.html": "overbored", "story-nudie-suits.html": "story" };
  for (const pg of PAGES) {
    for (const theme of ["dark", "light"]) {
      const { ctx, p } = await open(pg, 1280, theme, 1);
      await p.screenshot({ path: path.join(out, `${names[pg]}-desktop-${theme}.jpg`), fullPage: true, type: "jpeg", quality: 60 });
      await ctx.close();
    }
    const { ctx, p } = await open(pg, 375, "dark", 1);
    await p.screenshot({ path: path.join(out, `${names[pg]}-375-dark.jpg`), fullPage: true, type: "jpeg", quality: 60 });
    await ctx.close();
    const m = await open(pg, 320, "light", 1);
    await m.p.screenshot({ path: path.join(out, `${names[pg]}-320-light.jpg`), fullPage: true, type: "jpeg", quality: 60 });
    await m.ctx.close();
  }
  // overview: the three pages side by side at desktop width (1280 CSS px), deviceScaleFactor 2.
  // Each column is the first OVERVIEW_H CSS px of the page (the full pages are in the
  // per-page shots); tools/shrink_overview.py then palettes the PNG to keep the folder small.
  const OVERVIEW_H = 2000;
  const shots = [];
  for (const [pg, theme] of [["index.html", "dark"], ["overbored.html", "light"], ["story-nudie-suits.html", "dark"]]) {
    const { ctx, p } = await open(pg, 1280, theme, 2);
    await p.setViewportSize({ width: 1280, height: OVERVIEW_H });
    await p.waitForTimeout(200);
    shots.push((await p.screenshot({ clip: { x: 0, y: 0, width: 1280, height: OVERVIEW_H } })).toString("base64"));
    await ctx.close();
  }
  const ctx = await browser.newContext({ viewport: { width: 3 * 1280 + 4 * 48, height: 800 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.setContent(`<!doctype html><body><main>${shots.map((s, i) => `<figure><figcaption>${["Home (dark)", "Overbored (light)", "Story, chapter 2 (dark)"][i]}</figcaption><img src="data:image/png;base64,${s}"></figure>`).join("")}</main></body>`);
  await p.addStyleTag({ content: "body{margin:0;background:#2b0806;font:600 28px system-ui;color:#f7d6c8} main{display:flex;gap:48px;padding:48px;align-items:flex-start} figure{margin:0;width:1280px} img{width:1280px;display:block;box-shadow:0 10px 40px rgba(0,0,0,.5)} figcaption{margin:0 0 16px}" });
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(out, "overview.png"), fullPage: true });
  await ctx.close();
  ok("screenshots written");
}

await browser.close();
server.close();
console.log(failures ? `\n${failures} failure(s)` : "\nall checks passed");
process.exit(failures ? 1 : 0);
