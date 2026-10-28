// Rend les textes de la newsletter (titres, étiquettes, chiffres) en PNG transparents, 2× pour les écrans Retina :
// lit emails/newsletter/text-jobs.json (python3 build.py --collect), écrit public/email/newsletter/t/<clé>.png
// et emails/newsletter/text-manifest.json (dimensions affichées), relu par build.py.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const out = path.join(__dirname, "../../../public/email/newsletter/t");
(async () => {
  const jobs = JSON.parse(fs.readFileSync(path.join(root, "text-jobs.json"), "utf8"));
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const ctx = await browser.newContext({ viewport: { width: 700, height: 400 }, deviceScaleFactor: 2 });
  await ctx.route(/^https:/, async (route) => {
    try {
      const r = await fetch(route.request().url(), { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36" } });
      await route.fulfill({ status: r.status, contentType: r.headers.get("content-type") || "", body: Buffer.from(await r.arrayBuffer()) });
    } catch {
      await route.abort();
    }
  });
  const page = await ctx.newPage();
  const manifest = {};
  for (const [key, job] of Object.entries(jobs)) {
    await page.goto("file://" + path.join(__dirname, "text.html") + "?j=" + encodeURIComponent(JSON.stringify(job)));
    await page.evaluate(() => document.fonts.ready);
    const el = await page.$("#t");
    const box = await el.boundingBox();
    await el.screenshot({ path: path.join(out, `${key}.png`), omitBackground: true });
    manifest[key] = [Math.ceil(box.width), Math.ceil(box.height)];
  }
  fs.writeFileSync(path.join(root, "text-manifest.json"), JSON.stringify(manifest, null, 1));
  console.log(Object.keys(manifest).length, "textes rendus");
  await browser.close();
})();
