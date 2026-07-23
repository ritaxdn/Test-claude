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

## Two compositions

| id | file | length | what it is |
| --- | --- | --- | --- |
| `CelluliftLogo` | `src/CelluliftLogo.tsx` | 4s (120f) | Focused animated logo reveal |
| `CelluliftPromo` | `src/CelluliftPromo.tsx` | 6s (180f) | Full promo (logo scene + pillars + CTA) |

### The animated logo (`CelluliftLogo`)

Uses the **real Cellulift logo, unchanged**. The image is treated as a single,
untouched asset — every animation happens *around* it:

1. **Entrance** — the logo fades in with a gentle scale-up (0.9 → 1) via `spring()`.
2. **Pulsation** — a very subtle uniform breathe (`Math.sin(frame)`, ±1.2%),
   so the mark feels alive without ever being distorted.
3. **Glow** — a soft rainbow radial glow sits *behind* the logo and pulses with it.
4. **Fine luminous particles** — seeded `random()`, drifting continuously.

> **Add your logo first.** Drop the file at `remotion/public/cellulift-logo.png`
> (transparent PNG or SVG preferred). It's loaded with `staticFile("cellulift-logo.png")`
> and rendered via `<Img>` — the pixels are never redrawn. Nothing to recolor or
> rebuild; the exact file appears as-is.

## Run it

This is a standalone Remotion project (separate from the Next.js site).

```bash
cd remotion
npm install
npm run studio                                    # preview both comps at localhost:3000
npx remotion render src/index.ts CelluliftLogo  out/cellulift-logo.mp4
npx remotion render src/index.ts CelluliftPromo out/cellulift-promo.mp4
```

## Structure

```
remotion/
├── package.json
├── src/
│   ├── index.ts            # registerRoot
│   ├── Root.tsx            # both <Composition>s
│   ├── CelluliftLogo.tsx   # animated logo reveal (4s)
│   └── CelluliftPromo.tsx  # full promo: 3 scenes (6s)
```
