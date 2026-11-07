// screenshots/overview.png: the three pages side by side at desktop width
// (1440 CSS px, deviceScaleFactor 2), each cropped to its first 2000 CSS px,
// light theme; then tools/shrink_shots.py palettes it.  node tools/make_overview.mjs
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SAMPLE = path.dirname(HERE);
const NM = path.resolve(SAMPLE, "../../../site/node_modules");
const { chromium } = await import(pathToFileURL(path.join(NM, "playwright-core/index.mjs")).href);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome" });
const parts = [];
for (const f of ["index.html", "overbored.html", "story-nudie-suits.html"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 2000 }, deviceScaleFactor: 2 });
  await p.goto(pathToFileURL(path.join(SAMPLE, f)).href + "?theme=light");
  await p.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
    await document.fonts.ready;
  });
  const out = path.join(SAMPLE, "screenshots", `.part-${parts.length}.png`);
  await p.screenshot({ path: out, clip: { x: 0, y: 0, width: 1440, height: 2000 } });
  parts.push(out);
}
await b.close();
execFileSync("python3", [path.join(HERE, "shrink_shots.py"), "--overview", ...parts], { stdio: "inherit" });
