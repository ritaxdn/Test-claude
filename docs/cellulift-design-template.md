# Cellulift — Design brief for sales presentations

This file describes the look of the live Cellulift website (this repo, `src/`),
so that sales presentations built with Claude Code look the same.
It covers **design only**: colors, fonts, layout, components and motion. It does not cover copy.

> **Source of truth:** `src/app/globals.css`, `src/lib/fonts.ts`, `src/components/system/*`,
> `src/components/brand/Logo.tsx`.
>
> ⚠️ The older **"Editorial Light"** brand guide (Cormorant Garamond headings, Raleway body,
> Space Mono labels, ivory `#F5F2EC` background) is **no longer what the site uses**. The site now
> uses the **"Système / Nacre"** direction described below. The **logo, the rainbow gradient
> and the ECG line did not change** between the two.

---

## 1. Overall mood

- **Medical-tech, premium and bright.** Pale pearl backgrounds with faint colored light, frosted
  white glass cards, and very large black uppercase headlines. It feels like a clean clinic or a
  lab instrument, not a spa.
- **The rainbow is a signal, not decoration.** The gradient appears only in thin lines (ECG trace,
  hairlines), in the logo, and in the second half of a headline. It is never used as a large fill.
- **Plenty of empty space and few words.** One idea per block. Numbers are shown very large, as if
  read off an instrument.
- **Data-style labels.** Small monospace uppercase text with wide letter-spacing, and numbering
  like `01 —`, `02 —` everywhere.

---

## 2. Colors

### Backgrounds ("Nacre")
| Token | Hex | Use |
|---|---|---|
| `--pearl` | `#ECEEF3` | Main page/slide background |
| `--pearl-2` | `#E2E4EB` | Alternate background |
| Pearl glow | see below | Always placed on top of `--pearl` |

**Pearl background recipe:** three soft colored glows over the pearl base:
```css
background:
  radial-gradient(60% 50% at 85% 10%, rgba(123,97,255,.10), transparent 70%), /* violet, top right */
  radial-gradient(50% 40% at 10% 60%, rgba(0,188,212,.08),  transparent 70%), /* cyan, left */
  radial-gradient(50% 40% at 90% 90%, rgba(233,30,140,.07), transparent 70%), /* pink, bottom right */
  #ECEEF3;
```

### Text
| Token | Hex | Use |
|---|---|---|
| `--deep` | `#1D1B26` | Headlines, main text (a very dark violet-black, not pure black) |
| `--deep-soft` | `#5D5B6B` | Secondary text, descriptions, labels |
| Lines | `rgba(29,27,38,.15)` | Dividers and table rules (`border-deep/15`) |
| Pill border | `rgba(29,27,38,.15)` | Outline of the small section tags |

### Signature gradient (logo, ECG, hairlines)
`#00BCD4` cyan → `#7B61FF` violet → `#E91E8C` pink → `#FF5722` orange → `#FFC107` gold
```css
linear-gradient(90deg, #00BCD4 0%, #7B61FF 25%, #E91E8C 50%, #FF5722 75%, #FFC107 100%);
```
Always use it as a real gradient. Never pick a single color out of it.

### Iridescent headline text
The accent half of a headline fades from ink into color:
```css
background: linear-gradient(100deg, #1D1B26 0%, #1D1B26 38%, #6B5CFF 55%, #D0469C 72%, #E38A3C 90%);
-webkit-background-clip: text; background-clip: text; color: transparent;
```

### Pastel iridescent (buttons, bullet dots)
A softer version for button rings and bullets:
`#7FE3F0 → #A797FF → #F29BD0 → #FFC58F` (as a `conic-gradient`).

### Photo overlay (on dark machine photos)
`linear-gradient(to top, rgba(11,13,20,.85), rgba(11,13,20,.20), rgba(11,13,20,.30))`, with white text on top.

---

## 3. Typography

All three fonts are free on Google Fonts.

| Role | Font | Settings |
|---|---|---|
| **Display / headlines** | **Archivo** (variable, width axis) | Weight 500, `font-stretch: 118%` (expanded), **UPPERCASE**, letter-spacing `-0.035em`, line-height `0.92` |
| **Body / buttons / nav** | **Instrument Sans** | Weight 400 (500 for emphasis), normal case |
| **Data labels** | **JetBrains Mono** | 11px, UPPERCASE, letter-spacing `0.14em` |
| **Logo only** | **Cormorant Garamond** Light 300 | UPPERCASE, letter-spacing `0.22em` |

Fallbacks if the fonts are missing: Arial Narrow (display), Arial or system sans (body), Courier New (mono).

### Type scale on the website (desktop)
| Element | Size |
|---|---|
| Statement headline ("BIEN PLUS QU'UNE TECHNOLOGIE.") | up to ~106px (`6.6rem`) |
| Hero H1 | up to ~66px |
| Big numbers (20+, 1000+) | up to ~96px, line-height 0.85 |
| Section H2 | ~26–40px |
| Card title | ~21–30px |
| Body | 14–16px, line-height ~1.6 |
| Data label | 11px |

### Suggested scale for 16:9 slides (1920×1080)
| Element | Size |
|---|---|
| Cover / statement title | 110–140px Archivo expanded caps |
| Slide title | 56–72px |
| Key figure | 140–180px |
| Card title | 32–40px |
| Body | 22–26px Instrument Sans |
| Label / eyebrow | 14–16px JetBrains Mono caps, letter-spacing 0.14em |

### Headline pattern (very recognizable)
The headline has two lines. **Line 1 is ink and line 2 is iridescent.**
> LA TECHNOLOGIE
> *AU SERVICE DE VOTRE DÉVELOPPEMENT.* ← iridescent
>
> DES TECHNOLOGIES
> *POUR CHAQUE INDICATION.* ← iridescent

Headlines usually end with a period. They are short and assertive: "Choisir." "Déployer." "Maîtriser." "Continuer."

---

## 4. Logo

- The wordmark **CELLULIFT**: Cormorant Garamond Light, uppercase, letter-spacing `0.22em`,
  **filled with the rainbow gradient**.
- An **ECG line** sits right under it, 1.2px, with a rainbow gradient stroke, about the width of the word.
  SVG path (viewBox `0 0 160 20`):
  `M0 10 H50 L58 10 L64 2 L72 18 L80 6 L86 10 H100 L106 10 L112 4 L118 16 L124 10 H160`
- Optional tagline: **METAMORPHOSIS TECHNOLOGY**, monospace, 7px on web, letter-spacing `0.28em`, gray.
- Use it only on light backgrounds. Never omit the ECG line.
- Reusable files: `src/app/icon.svg`, `src/components/brand/Logo.tsx`.

---

## 5. Components

### Glass card (the main surface)
```css
.glass {
  background: linear-gradient(145deg, rgba(255,255,255,.78), rgba(255,255,255,.46));
  border: 1px solid rgba(255,255,255,.9);
  box-shadow: 0 1px 0 rgba(255,255,255,.9) inset, 0 24px 60px -30px rgba(29,27,38,.25);
  backdrop-filter: blur(22px) saturate(1.4);
  border-radius: 28px;           /* 20px on small cards, 32–40px on big panels */
}
```
Card layout: **number label at the top left** (`01`, mono), **a small round white button at the top
right** (↗ arrow or +), and the **uppercase title at the bottom left**. Everything else is empty space.
The card is square or 5:4.

### "Glass strong" (active and raised elements)
The same card but whiter: `rgba(255,255,255,.92 → .62)` with shadow `0 14px 34px -18px rgba(29,27,38,.35)`.
Use it for the active nav item, badges and the primary button.

### Buttons (always pill-shaped)
- A fully rounded pill with a glass background. Label in Instrument Sans 14px, ink color.
- A **round white icon bubble with an ↗ arrow** sits on the right. The bubble has a thin pastel iridescent ring.
- A **pastel iridescent outline rotates slowly** around the button (conic gradient, 4s loop).
- Hover: the button lifts 2px and the arrow rotates 45°.
- Primary = "glass strong". Secondary = lighter glass. Button labels read like "Demander une démonstration ↗" or "Découvrir nos technologies ↗".

### Section tag (eyebrow pill)
A small outlined pill with a 1px border at `rgba(29,27,38,.15)`, Instrument Sans 12px in `--deep-soft`,
formatted as **`01 — Technologies`**, `02 — L'écosystème Cellulift`, and so on. It always sits above the H2.

### Trust badges
White glass pills, each with a **tiny iridescent dot** in front:
`• Distributeur officiel LGL Expert · Afrique` `• Certifiées CE & FDA · Garantie 24 mois`

### Key figures band
Four columns separated by **thin vertical rules**, with no boxes:
- A huge Archivo number (`20+`, `1000+`, `24 MOIS`, `7`). One number is filled with the iridescent gradient.
- A **small ECG pulse** in gradient under the number.
- A mono uppercase label under the pulse (`ANS D'EXPERTISE`).

### Proof grid ("Pourquoi Cellulift")
Four cells with a hairline grid. Each cell has a **thin rainbow line on top**, a mono label
("DISTRIBUTION OFFICIELLE"), a big value ("LGL EXPERT", "CE · FDA") and a short line of body text.

### Numbered list / table
Rows separated by 1px lines at `rgba(29,27,38,.15)`. Each row has a mono number (`01`), a title in
Instrument Sans (medium, ~18px) and a description in `--deep-soft` placed in the right half.

### Ticker
A long glass pill containing items separated by **tiny ECG glyphs**, with the edges fading out.

### Process path
Steps (Installation → Formation → Protocoles → Maîtrise) are laid on a **horizontal ECG trace**.
Each step sits on one pulse, with a mono number and a label underneath.

### Machine photos
Real product photos on a clean background, in rounded frames. When the photo sits inside a card,
use the dark bottom overlay and white text. The web version also shows a "scanner" line
(a thin rainbow line sweeping down with a faint violet haze). It is optional on slides.

### Header (web only, useful for a slide top bar)
A floating glass pill across the full width. It holds the logo on the left, the nav in the center and a pill CTA
on the right. On scroll, a 1px rainbow line appears under it.

---

## 6. Layout rules

- The content width is 1280px on web. On slides, use a **generous margin of about 96–120px** on 1920px.
- Content is **left-aligned** and titles are never centered, except for step labels.
- A block stacks top to bottom: **eyebrow pill → big headline → (optional) one sentence → cards or figures → CTA**.
- Grids are 2, 3 or 4 columns with small gaps (10–12px on web, about 16–24px on slides).
- Use lines or glass for separation, never heavy borders or solid color blocks.
- Hero: a full-bleed photo or video with a **pearl veil fading from the left** (90% → 0%),
  and the text in the left column.

---

## 7. Motion (for web and animated decks)

- **Fade and rise:** `opacity 0→1`, `translateY(20–24px)→0`, 0.6–0.8s,
  `cubic-bezier(0.16, 1, 0.3, 1)`, with elements staggered by about 80–120ms.
- **ECG draw-in:** the stroke draws with `stroke-dashoffset` over 1.2–3s.
- **Rainbow hairline:** grows from the left (`scaleX 0→1`, 1.1s).
- Hover lifts elements by 2–4px and rotates arrows 45°.
- Nothing moves faster than 200ms, and there is no bounce.

---

## 8. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Pearl backgrounds with faint glows | Pure white or dark backgrounds, or the old ivory `#F5F2EC` |
| Very large, expanded, uppercase Archivo headlines | Serif headlines (Cormorant is for the logo only) |
| Rainbow only in thin lines, the logo and headline accents | Rainbow blocks, fills or big shapes |
| Glass cards with lots of empty space | Heavy shadows, thick borders, saturated fills |
| Mono labels `01 —` and small data captions | Emojis, clip-art icons, stock "spa" imagery |
| Short, assertive sentences ending with "." | Long paragraphs on a slide |
| Pill buttons with an ↗ bubble | Square buttons |

---

## 9. Proposed slide set for the sales team

Each slide uses the pearl background, has a small logo with the ECG line at the top left, and shows the slide number in mono at the bottom right (`03 / 12`).

1. **Cover.** A full-bleed photo with a pearl veil, trust badges, a two-line headline (ink + iridescent) and the client name as a mono label.
2. **Section divider.** An eyebrow pill (`02 — …`) and one monumental statement headline.
3. **Key figures.** The four-column figures band with ECG pulses.
4. **Technology range.** A 3×2 grid of glass cards (`01`–`06`, one range each, with a ↗ bubble).
5. **Product sheet.** The machine photo in a glass frame on the left. On the right: the name in display caps, a mono category, indication pills and a hairline table of specs.
6. **Ecosystem.** Four glass cards: Conseil, Installation, Academy, Support.
7. **Why Cellulift.** A four-cell proof grid with rainbow top lines.
8. **Journey / process.** Steps along an ECG trace.
9. **Offer / numbered list.** A hairline table (`01 / title / description`).
10. **Closing CTA.** A large glass panel with a faint ECG line across the middle, an iridescent headline ("Votre prochaine technologie commence ici."), two pill buttons, and the phone number in mono.

---

## 10. Copy-paste prompt for Claude Code

> Build a 16:9 presentation that follows the Cellulift design system in
> `docs/cellulift-design-template.md`. Use a pearl background (#ECEEF3) with faint violet, cyan and pink
> radial glows, and frosted white glass cards (radius 28px). Headlines are Archivo expanded
> (font-stretch 118%, weight 500, uppercase, tracking −0.035em, line-height 0.92) in #1D1B26,
> and the second line of a headline uses the iridescent gradient (ink → #6B5CFF → #D0469C → #E38A3C).
> Body text is Instrument Sans in #1D1B26 / #5D5B6B. Labels are JetBrains Mono, 11px equivalent, uppercase, tracking 0.14em.
> The logo is "CELLULIFT" in Cormorant Garamond Light, tracking 0.22em, filled with the rainbow gradient
> (#00BCD4 → #7B61FF → #E91E8C → #FF5722 → #FFC107), with an ECG line underneath.
> Use the rainbow only for thin lines and the ECG. Buttons are glass pills with a round ↗ bubble.
> Put an eyebrow pill like "01 — Technologies" above every section title.
