// Génère src/content/photo-sizes.json : largeur et hauteur de chaque photo de machine,
// pour les afficher entières, à leur format d'origine (sans recadrage).
// À relancer après l'ajout de photos : node scripts/photo-sizes.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = "public/images/technologies";
const out = {};
for (const dir of fs.readdirSync(root).sort()) {
  for (const f of fs.readdirSync(path.join(root, dir)).sort()) {
    if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
    const { width, height } = await sharp(path.join(root, dir, f)).metadata();
    out[`/images/technologies/${dir}/${f}`] = [width, height];
  }
}
fs.writeFileSync("src/content/photo-sizes.json", JSON.stringify(out, null, 0).replace(/\],/g, "],\n") + "\n");
console.log(Object.keys(out).length, "photos");
