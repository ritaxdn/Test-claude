# Cellulift Remotion Example

A 6-second (180-frame @ 30fps, 1920×1080) promo video built with
[Remotion](https://remotion.dev), created to demonstrate the `remotion` skill
installed in `.claude/skills/remotion`.

## What it shows

The composition (`src/CelluliftPromo.tsx`) exercises every core Remotion
concept from the skill:

| Concept | Where |
| --- | --- |
| `useCurrentFrame` / `useVideoConfig` | every scene |
| `spring()` physics entrance | brand title pop, staggered pillar cards |
| `interpolate()` with clamped extrapolation | fades, slide-ups, the CTA underline wipe |
| Deterministic `random(seed)` | the floating particle field — **no `Math.random()`** |
| `AbsoluteFill` layering | background glow → particles → scene content |
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
