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
| `CelluliftLogo` | `src/CelluliftLogo.tsx` | 5.7s (170f) | 1920×1080 | Animated logo reveal |
| `CelluliftLogo-Vertical` | same | 5.7s (170f) | 1080×1920 | Reels / Stories |
| `CelluliftPromo` | `src/CelluliftPromo.tsx` | 8s (240f) | 1920×1080 | Full promo (logo + pillars + CTA) |
| `CelluliftPromo-Vertical` | same | 8s (240f) | 1080×1920 | Reels / Stories |

### The animated logo (`src/AnimatedLogo.tsx`)

Uses the **real Cellulift logo, unchanged** (`public/cellulift-logo.png`) —
shared by both `CelluliftLogo` and `CelluliftPromo`'s opening scene. Not a
single pixel of the source file is ever redrawn, recolored, or distorted.

The logo **writes itself in** — a premium, cinematic pace rather than a
mechanical wipe. Four regions were measured directly off the PNG's alpha
channel (as fractions of its 469×271 native size); each is a `mask-image`
gradient "window" onto the *same* image, offset so it lines up pixel-for-pixel.
Unlike a hard `clip-path` edge, a mask gradient can be **feathered** — a soft,
ink-like boundary instead of a sharp cut, which reads as "being painted in"
rather than "revealed by a blind". A warm light glint travels along that soft
edge as each region writes in, like a pen of light tracing the mark:

1. **Arc** (frames 0–58, eased) — writes in left to right with a ~17%-wide
   feathered edge. Because the artwork's own colour bands run left to right
   (cyan → magenta → orange → yellow), this reads as the arc writing itself in
   **colour by colour**.
2. **ECG** (frames 50–74) — the heartbeat line traces in right after,
   overlapping the arc's tail so it feels like it "follows".
3. **Wordmark** (frames 70–114, eased out) — a continuous soft-edged reveal;
   the natural gaps between letters make **CELLULIFT read as writing itself
   in stroke by stroke** without a hard quantized stair-step.
4. **Tagline** (frames 110–132) — "Metamorphosis Technology" settles in last,
   no glint (kept quiet so it doesn't compete with the wordmark).
5. **Pulsation** (from frame 150) — once fully assembled, a slow, barely-there
   breathe (`Math.sin(frame)`, ±1.6%) keeps the mark alive, plus a subtle
   dolly-in (`scale(1.045 → 1)`) across the whole write-in for depth.

> **Re-measuring the regions.** If you swap in a different logo file, the
> `BOX` constants in `AnimatedLogo.tsx` (arc/word/ecg/tag, as 0–1 fractions of
> the image) will need updating — they were measured by scanning the current
> PNG's alpha channel for each element's bounding box.

### The full promo (`CelluliftPromo`)

Three scenes stitched with `<TransitionSeries>`:

| Concept | Where |
| --- | --- |
| `useCurrentFrame` / `useVideoConfig` | every scene; drives the portrait/landscape layout switch |
| Feathered `mask-image` ink reveal + travelling glint | the logo scene (arc → ECG → wordmark → tagline), shared via `AnimatedLogo.tsx` |
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
