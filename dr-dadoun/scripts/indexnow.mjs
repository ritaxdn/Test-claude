// Envoie toutes les pages du sitemap à IndexNow (Bing, Yandex, Seznam…) après une mise en ligne.
// Usage : npm run indexnow  (ou SITE=https://www.docteurdadoun.com npm run indexnow)
// La clé est publique par conception : elle est servie par public/<clé>.txt pour prouver que le site nous appartient.
const KEY = "759b1f8336ca2b1103f0d107512a748e";
const site = (process.env.SITE || "https://www.docteurdadoun.com").replace(/\/$/, "");

const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error("Sitemap vide ou introuvable");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow : ${urlList.length} URL envoyées → HTTP ${res.status}`);
if (res.status >= 400) process.exit(1);
