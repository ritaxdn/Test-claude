# Cellulift Remotion Example

A pair of Remotion compositions — an animated logo reveal and a full promo —
built with [Remotion](https://remotion.dev), demonstrating the `remotion`
skill installed in `.claude/skills/remotion`. Both follow Cellulift's
**"Editorial Light"** brand charter (`.claude/skills/cellulift-brand-guidelines`):
ivoire chaud grounds, encre-profonde text, the rainbow gradient accent
(`#00BCD4 → #7B61FF → #E91E8C → #FF5722 → #FFC107`), and the Cormorant Garamond
/ Raleway / Space Mono type system.

> Fonts: load Cormorant Garamond, Raleway, and Space Mono via
> `@remotion/google-fonts` for pixel-accurate renders; the code references the
> family names and falls back to serif / sans / mono otherwise.

## Four compositions

Each is registered twice — once landscape, once vertical — sharing the same
component, which reads `useVideoConfig()` to lay itself out per orientation.

| id | file | length | size | what it is |
| --- | --- | --- | --- | --- |
| `CelluliftLogo` | `src/CelluliftLogo.tsx` | 4s (120f) | 1920×1080 | Animated logo reveal |
| `CelluliftLogo-Vertical` | same | 4s (120f) | 1080×1920 | Reels / Stories |
| `CelluliftPromo` | `src/CelluliftPromo.tsx` | 6s (180f) | 1920×1080 | Full promo (logo + pillars + CTA) |
| `CelluliftPromo-Vertical` | same | 6s (180f) | 1080×1920 | Reels / Stories |

### The animated logo (`src/AnimatedLogo.tsx`)

Uses the **real Cellulift logo, unchanged** (`public/cellulift-logo.png`) —
shared by both `CelluliftLogo` and `CelluliftPromo`'s opening scene. Not a
single pixel of the source file is ever redrawn, recolored, or distorted.

The reveal is a **sequenced mask wipe**, not a redraw: four regions were
measured directly off the PNG's alpha channel (as fractions of its 469×271
native size), and each is its own `overflow: hidden` + `clip-path` "window"
onto the *same* image, offset so it lines up pixel-for-pixel. Animating each
window's clip from fully closed to fully open — left to right — reveals that
region of the real artwork progressively:

1. **Arc** (frames 0–30) — draws in left to right. Because the artwork's own
   colour bands run left to right (cyan → magenta → orange → yellow), the wipe
   reads as the arc drawing in **colour by colour**.
2. **ECG** (frames 26–42) — the heartbeat line traces in right after,
   overlapping the arc's tail slightly so it feels like it "follows".
3. **Wordmark** (frames 40–62) — the reveal progress is quantized into 9
   steps (C-E-L-L-U-L-I-F-T), so **CELLULIFT pops in letter by letter**
   instead of sliding in as one smooth wipe.
4. **Tagline** (frames 60–76) — "Metamorphosis Technology" wipes in last.
5. **Pulsation** (from frame 82) — once fully assembled, a slow uniform
   breathe (`Math.sin(frame)`, ±2%) keeps the mark alive.

> **Re-measuring the regions.** If you swap in a different logo file, the
> `BOX` constants in `AnimatedLogo.tsx` (arc/word/ecg/tag, as 0–1 fractions of
> the image) will need updating — they were measured by scanning the current
> PNG's alpha channel for each element's bounding box.

### The full promo (`CelluliftPromo`)

Three scenes stitched with `<TransitionSeries>`:

| Concept | Where |
| --- | --- |
| `useCurrentFrame` / `useVideoConfig` | every scene; drives the portrait/landscape layout switch |
| Sequenced `clip-path` mask reveal | the logo scene (arc → ECG → letters → tagline), shared via `AnimatedLogo.tsx` |
| `spring()` physics entrance | staggered pillar cards, CTA headline — `{ damping: 18, mass: 0.8, stiffness: 120 }` for a consistent, brand-appropriate ~300ms settle |
| `interpolate()` with clamped extrapolation | fades, fade-and-rise, the rainbow-rule wipe |
| Rainbow gradient (never flattened) | section rules, glow, scrub bar |
| `AbsoluteFill` layering | drifting rainbow glow → scene content |
| `TransitionSeries` + `fade`/`slide` | the three scenes stitched together |
| `<Composition>` registration | `src/Root.tsx` → `src/index.ts` |

## Run it

This is a standalone Remotion project (separate from the Next.js site).

```bash
cd remotion
npm install
npm run studio      # preview all four compositions at localhost:3000
npx remotion render src/index.ts CelluliftLogo            out/cellulift-logo.mp4
npx remotion render src/index.ts CelluliftLogo-Vertical    out/cellulift-logo-vertical.mp4
npx remotion render src/index.ts CelluliftPromo            out/cellulift-promo.mp4
npx remotion render src/index.ts CelluliftPromo-Vertical   out/cellulift-promo-vertical.mp4
```

## Structure

```
remotion/
├── package.json
├── public/
│   └── cellulift-logo.png  # the real logo, untouched
├── src/
│   ├── index.ts            # registerRoot
│   ├── Root.tsx             # all four <Composition>s
│   ├── AnimatedLogo.tsx     # shared logo reveal (arc/ECG/letters/tagline)
│   ├── CelluliftLogo.tsx    # standalone logo composition + particles
│   └── CelluliftPromo.tsx   # full promo: 3 scenes, orientation-aware
```
