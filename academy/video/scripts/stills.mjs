// Rend des images fixes de chaque plan (16:9 et 9:16) dans stills/ pour vérification.
// Usage : npm run stills  (ou node scripts/stills.mjs 16x9 210 300 …)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [, , only, ...framesArg] = process.argv;
const FRAMES = framesArg.length ? framesArg.map(Number) : [60, 160, 240, 330, 400, 520, 620, 650, 740, 870];
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const id of ["Academy16x9", "Academy9x16"]) {
  if (only && !id.endsWith(only)) continue;
  const composition = await selectComposition({ serveUrl, id });
  for (const frame of FRAMES) {
    const output = `stills/${id}-${String(frame).padStart(3, "0")}.png`;
    await renderStill({ serveUrl, composition, frame, output, chromiumOptions: { gl: "angle" } });
    console.log(output);
  }
}
