// Rend les images d'ouverture de la newsletter (titre Archivo + dégradé irisé) dans public/email/newsletter/.
// Usage : python3 emails/newsletter/hero/jobs.py | node emails/newsletter/hero/render.cjs
// (Playwright avec Chromium ; les polices viennent de Google Fonts.)
const { chromium } = require("playwright");
const path = require("path");
const out = path.join(__dirname, "../../../public/email/newsletter");
let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", async () => {
  const jobs = JSON.parse(input);
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 680 } });
  // Polices chargées via Node (évite les soucis de certificat du navigateur derrière un proxy).
  await ctx.route(/^https:/, async (route) => {
    try {
      const r = await fetch(route.request().url(), { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36" } });
      await route.fulfill({ status: r.status, contentType: r.headers.get("content-type") || "", body: Buffer.from(await r.arrayBuffer()) });
    } catch {
      await route.abort();
    }
  });
  for (const j of jobs) {
    const page = await ctx.newPage();
    await page.goto("file://" + path.join(__dirname, "hero.html") + "?" + new URLSearchParams(j));
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(out, `hero-${j.key}.jpg`), type: "jpeg", quality: 88 });
    console.log(`hero-${j.key}.jpg`);
    await page.close();
  }
  await browser.close();
});
