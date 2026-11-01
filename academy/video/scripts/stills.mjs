// Rend une image fixe par plan, dans les deux formats, dans out/stills/ (contrôle avant le rendu vidéo).
// Usage : npm run stills            (REMOTION_BROWSER=/chemin/vers/chrome si le téléchargement de Chrome est impossible)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const frames = {
  "1-logo": 70, "2-accroche": 175, "3a-invitation": 262, "3b-tableau-de-bord": 345,
  "4-lecon-a": 420, "4-lecon-b": 520, "5-progression": 650, "6-admin": 760, "7-signature": 870,
};
const only = process.argv[2]; // ex. « 4-lecon » pour ne rendre que ces plans
const browserExecutable = process.env.REMOTION_BROWSER || null;
const chromeMode = browserExecutable ? "chrome-for-testing" : "headless-shell";

mkdirSync("out/stills", { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const [id, tag] of [["Pub16x9", "16x9"], ["Pub9x16", "9x16"]]) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable, chromeMode });
  for (const [name, frame] of Object.entries(frames)) {
    if (only && !name.startsWith(only)) continue;
    const output = `out/stills/${tag}-${name}.jpg`;
    await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 90, browserExecutable, chromeMode });
    console.log(output);
  }
}
