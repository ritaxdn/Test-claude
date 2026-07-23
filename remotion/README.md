# Cellulift Remotion Example

A 6-second (180-frame @ 30fps, 1920×1080) promo video built with
[Remotion](https://remotion.dev), created to demonstrate the `remotion` skill
installed in `.claude/skills/remotion`. It follows Cellulift's **"Editorial
Light"** brand charter (`.claude/skills/cellulift-brand-guidelines`): ivoire
chaud grounds, encre-profonde text, the rainbow gradient accent
(`#00BCD4 → #7B61FF → #E91E8C → #FF5722 → #FFC107`), and the Cormorant Garamond
/ Raleway / Space Mono type system.

> Fonts: load Cormorant Garamond, Raleway, and Space Mono via
> `@remotion/google-fonts` for pixel-accurate renders; the code references the
> family names and falls back to serif / sans / mono otherwise.

## What it shows

The composition (`src/CelluliftPromo.tsx`) exercises every core Remotion
concept from the skill, on-brand:

| Concept | Where |
| --- | --- |
| `useCurrentFrame` / `useVideoConfig` | every scene |
| `spring()` physics entrance | wordmark + tagline rise, staggered pillar cards, CTA headline |
| `interpolate()` with clamped extrapolation | fades, fade-and-rise, the rainbow-rule wipe |
| SVG `stroke-dashoffset` drawing | the rainbow logo arc + the ECG heartbeat line trace in |
| Rainbow gradient (never flattened) | wordmark text clip, ECG/arc strokes, section rules |
| `AbsoluteFill` layering | drifting rainbow glow → scene content |
| `TransitionSeries` + `fade`/`slide` | the three scenes stitched together |
| `<Composition>` registration | `src/Root.tsx` → `src/index.ts` |

## Run it

This is a standalone Remotion project (separate from the Next.js site).

```bash
cd remotion
npm install
npm run studio      # interactive preview at http://localhost:3000
npm run render      # renders out/cellulift-promo.mp4
npm run still       # renders a single frame to out/frame.png
```

## Structure

```
remotion/
├── package.json
├── src/
│   ├── index.ts            # registerRoot
│   ├── Root.tsx            # <Composition> registration
│   └── CelluliftPromo.tsx  # the video: 3 scenes + particles
```
