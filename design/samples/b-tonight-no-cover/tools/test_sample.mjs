// Sample B checks: axe (WCAG 2.2 AA tags), no horizontal scroll at 375 and 320,
// no third-party requests before a click, facade swaps to youtube-nocookie,
// skip link reaches <main>; then the per-page screenshots.
//
// Uses playwright-core and axe-core from the site's node_modules (nothing is
// installed here) and the preinstalled Chromium:
//   node tools/test_sample.mjs            checks + screenshots
//   node tools/test_sample.mjs --no-shots checks only
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SAMPLE = path.dirname(HERE);
const REPO = path.resolve(SAMPLE, "../../..");
const NM = path.join(REPO, "site/node_modules");
const { chromium } = await import(pathToFileURL(path.join(NM, "playwright-core/index.mjs")).href);
const AXE = fs.readFileSync(path.join(NM, "axe-core/axe.min.js"), "utf8");
const CHROME = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const SHOTS = !process.argv.includes("--no-shots");

const PAGES = [["home", "index.html"], ["overbored", "overbored.html"], ["story", "story-nudie-suits.html"]];
const RUNS = [
  { w: 1440, h: 900, theme: "light", tag: "desktop-light" },
  { w: 1440, h: 900, theme: "dark", tag: "desktop-dark" },
  { w: 375, h: 812, theme: "dark", tag: "375-dark" },
  { w: 375, h: 812, theme: "light", tag: "375-light" },
  { w: 320, h: 640, theme: "light", tag: "320-light" },
  { w: 320, h: 640, theme: "dark", tag: "320-dark" },
];

const browser = await chromium.launch({ executablePath: CHROME });
let failures = 0;
const fail = (m) => { failures++; console.log("FAIL", m); };

async function settle(page) {
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
    await document.fonts.ready;
  });
  await page.waitForTimeout(150);
}

for (const [name, file] of PAGES) {
  for (const run of RUNS) {
    const ctx = await browser.newContext({ viewport: { width: run.w, height: run.h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const external = [];
    page.on("request", (r) => { if (!r.url().startsWith("file:")) external.push(r.url()); });
    await page.goto(pathToFileURL(path.join(SAMPLE, file)).href + "?theme=" + run.theme);
    await settle(page);
    const label = `${name} ${run.tag}`;

    const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme") || "light");
    if (theme !== run.theme) fail(`${label}: theme is ${theme}`);
    if (external.length) fail(`${label}: requests before interaction: ${external.join(", ")}`);

    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 0) fail(`${label}: horizontal scroll ${over}px`);

    await page.addScriptTag({ content: AXE });
    const res = await page.evaluate(async () =>
      axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } })
    );
    for (const v of res.violations) fail(`${label}: axe ${v.id} (${v.nodes.length}) ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
    if (!res.violations.length) console.log(`ok   ${label}: axe 0 violations, ${res.passes.length} rules passed, overflow 0`);

    if (SHOTS && ["desktop-light", "desktop-dark", "375-dark"].includes(run.tag)) {
      fs.mkdirSync(path.join(SAMPLE, "screenshots"), { recursive: true });
      await page.screenshot({ path: path.join(SAMPLE, "screenshots", `${name}-${run.tag}.png`), fullPage: true });
    }
    await ctx.close();
  }
}

// Behaviour: skip link, theme toggle, facade.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const yt = [];
  page.on("request", (r) => { if (/youtube/.test(r.url())) yt.push(r.url()); });
  await page.route(/youtube/, (route) => route.abort());
  await page.goto(pathToFileURL(path.join(SAMPLE, "index.html")).href);
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => document.activeElement.textContent.trim());
  if (first !== "Skip to content") fail(`first tab stop is "${first}"`);
  await page.keyboard.press("Enter");
  const hash = await page.evaluate(() => location.hash);
  if (hash !== "#main") fail("skip link did not move to #main");
  await page.click("[data-theme-toggle]");
  const t = await page.evaluate(() => [document.documentElement.dataset.theme, document.querySelector("[data-theme-toggle]").getAttribute("aria-pressed")]);
  if (t[0] !== "dark" || t[1] !== "true") fail("theme toggle: " + t);
  if (yt.length) fail("YouTube requested before click");
  await page.click("a[data-yt]");
  const src = await page.evaluate(() => document.querySelector("iframe")?.src || "");
  if (!src.startsWith("https://www.youtube-nocookie.com/embed/qjZaiwO7KXI")) fail("facade iframe src " + src);
  else console.log("ok   skip link, theme toggle, facade -> " + src.split("?")[0]);
  await ctx.close();
}

await browser.close();
console.log(failures ? `${failures} failure(s)` : "all checks passed");
process.exit(failures ? 1 : 0);
