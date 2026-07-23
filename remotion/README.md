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

### The animated logo (`CelluliftLogo`)

Uses the **real Cellulift logo, unchanged**. The image is a single, untouched
asset — every animation happens *around* it. Tuned for a punchy, social-ready
rhythm:

1. **Entrance** — marked fade + zoom (0.82 → 1) via `spring({ damping: 18, mass: 0.8, stiffness: 120 })`,
   settling in ~10 frames (~330ms) — snappy but never brusque, within the
   brand's 300–900ms transition window.
2. **Pulsation** — a pronounced but uniform breathe (`Math.sin(frame)`, ±2.5%),
   so the mark feels alive without ever being distorted.
3. **Glow** — a soft rainbow radial glow sits *behind* the logo and pulses with it.
4. **Fine luminous particles** — seeded `random()`, drifting continuously.

> **Add your logo first.** Drop the file at `remotion/public/cellulift-logo.png`
> (transparent PNG or SVG preferred). It's loaded with `staticFile("cellulift-logo.png")`
> and rendered via `<Img>` — the pixels are never redrawn. Nothing to recolor or
> rebuild; the exact file appears as-is.

### The full promo (`CelluliftPromo`)

Three scenes stitched with `<TransitionSeries>`:

| Concept | Where |
| --- | --- |
| `useCurrentFrame` / `useVideoConfig` | every scene; drives the portrait/landscape layout switch |
| `spring()` physics entrance | logo reveal, staggered pillar cards, CTA headline — all `{ damping: 18, mass: 0.8, stiffness: 120 }` for a consistent, brand-appropriate settle |
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
│   ├── CelluliftLogo.tsx    # animated logo reveal, orientation-aware
│   └── CelluliftPromo.tsx   # full promo: 3 scenes, orientation-aware
```
