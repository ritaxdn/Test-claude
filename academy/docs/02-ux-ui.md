# CELLULIFT ACADEMY — Phase 2 · UX / UI

The Academy inherits the cellulift.ma direction **"Nacre & verre"** (pearl and glass). It is the same brand, used as a product: calmer, denser, more readable than the marketing site. The prototype in `academy/prototype/` implements everything below.

## 1. Design principles

1. **Clinical clarity first.** Learners are doctors between consultations. Every screen answers "where am I, what's next" in under 3 seconds.
2. **Rainbow is a signal, not a fill.** The signature gradient appears only on progress, the active navigation marker, the ECG line under the logo, 1 px signal lines and certificate seals. Never on large surfaces, never as body text.
3. **Glass for structure, pearl for air.** Panels are glass on a pearl background with three soft glows. No black-and-gold, no salon pink.
4. **Calm commerce.** Locked content is labelled honestly ("Included with HANOVER 5G") with a quiet link. No countdowns, no pop-ups, no upsell inside the player.
5. **Honest security.** Protection features are shown to users where they matter (watermark notice, active sessions) without threatening language.

## 2. Tokens

### Colour
| Token | Value | Use |
|---|---|---|
| `--pearl` | `#ECEEF3` | App background |
| `--pearl-2` | `#E2E4EB` | Sunken areas, table headers |
| `--white` | `#FFFFFF` | Inputs, player surround (light mode) |
| `--deep` | `#1D1B26` | Primary text, solid buttons |
| `--deep-soft` | `#5D5B6B` | Secondary text |
| `--line` | `rgba(29,27,38,.10)` | Hairlines |
| `--rainbow` | `linear-gradient(90deg,#00BCD4,#7B61FF 25%,#E91E8C 50%,#FF5722 75%,#FFC107)` | Signals only |
| `--iris` | `#7FE3F0 #A797FF #F29BD0 #FFC58F` | Icon halos, CTA ring |
| `--ok` / `--warn` / `--err` | `#1F8A5B` / `#B7791F` / `#C53030` on 10 % tints | Semantic states, separate from brand |
| Access badges | Free = cyan tint, Purchased = violet tint, Included = rainbow hairline, Partner exclusive = deep outline, Locked = grey, Pending = amber | |

### Type
| Role | Face | Spec |
|---|---|---|
| Display | Archivo, width 118 %, 500, uppercase, −0.035em | Page titles, hero, KPI headings |
| UI & body | Instrument Sans 300–600 | Body 15/24, UI 14, card titles 600 −0.01em |
| Data | JetBrains Mono 400/500, 11–12 px, uppercase, +0.14em | Eyebrows, durations, %, IDs, dates, statuses |
| Wordmark | Cormorant Garamond 400, 0.22em tracking, rainbow clip | Logo only |

### Space, radius, depth
- 4-pt grid; page gutter 32 px desktop / 16 px mobile; content max-width 1280 px.
- Radius: cards 28 px, inputs 14 px, pills full.
- Glass: `linear-gradient(145deg, rgba(255,255,255,.78), rgba(255,255,255,.46))`, border white 90 %, `blur(22px) saturate(1.4)`, shadow `0 24px 60px -30px rgba(29,27,38,.25)`.

### Motion
- Enter: fade + rise 12–20 px, 600–800 ms, `cubic-bezier(.16,1,.3,1)`; stagger 40 ms on card grids.
- Hover: lift 2 px, ≥ 200 ms. Progress bars animate width on reveal.
- Signature: ECG draw-in on the logo at load; scan line on course covers on hover.
- `prefers-reduced-motion`: all loops and sweeps disabled.

## 3. Components

App shell (sidebar + top bar) · Course card · Access badge · Progress bar (rainbow) · Progress ring · KPI tile (mono numbers) · Lesson list item (state dot: done / current / locked) · Video player frame with watermark layer · Tabs · Quiz question · Certificate card · Data table · Toggle · Slide-over panel · Toast · Empty state · Simulation notice ("Prototype — simulated").

## 4. Sitemap (screens in the prototype)

```
Auth          /login · /register (3 steps) · /forgot · /verify-email
Learner       /dashboard · /catalog · /course/:id · /learn/:id/:lesson · /quiz/:id
              /certificates · /certificate/:id · /equipment · /sessions · /account
Public        /verify/:certificateId
Admin         /admin · /admin/users · /admin/verification · /admin/courses · /admin/course/:id
              /admin/entitlements · /admin/equipment · /admin/protection · /admin/analytics · /admin/audit
```

## 5. Key layouts

### Login & registration
Split screen. Left (desktop only): pearl glow, logo with ECG line, "One account. Every technology you master." and the two access models as glass chips. Right: glass card form. Registration is 3 steps — *Account* (name, email, password with strength meter) → *Practice* (profession, specialty, organisation, country) → *Verification* (registration number, body, optional document; "Skip for now" allowed, with a note on which courses need it).

### Dashboard
```
┌ Sidebar ─┬───────────────────────────────────────────────────────────┐
│ Logo     │ Good morning, Dr Benali          [search]  [🔔] [avatar]  │
│ ──────── │ ───────── rainbow signal line ─────────                    │
│ Home     │ ┌ Continue learning (hero glass card, cover, %, Resume) ┐ │
│ Catalog  │ └───────────────────────────────────────────────────────┘ │
│ My learn │ ┌ KPI: in progress ┐┌ completed ┐┌ certificates ┐┌ hours ┐  │
│ Certifs  │ My courses (cards with progress)       │ Upcoming training │
│ Equipment│                                        │ Notifications     │
│ Sessions │ Recommended for you (3 cards, calm)    │ My equipment      │
│ ──────── │                                                           │
│ Account  │                                                           │
└──────────┴───────────────────────────────────────────────────────────┘
```
Mobile: sidebar becomes a bottom tab bar (Home, Catalog, Learning, Certificates, Account).

### Catalogue
Search bar + filter pills (Technology family, Level, Access, Format). Results grid of course cards: cover with scan line, access badge top-left, technology tag, title, trainer, duration · modules · level in mono, progress bar if started. Toggle "Show only what I can access".

### Course detail
Header band: breadcrumb, title (display), trainer, mono facts row, access badge, primary CTA by state. Two columns: *Objectives* + *Curriculum* (accordion modules) | sticky glass *Access card* (state, what's included, certificate type, CTA).

### Course player
```
┌ Modules & lessons ──┬ Player (16:9, watermark) ───────────┬ Panel ─────┐
│ Course progress 42% │ Lesson 2.3 · Treatment parameters    │ [Notes]    │
│ ▸ 1 Fundamentals ✓  │ Trainer chip                          │ [Resources]│
│ ▾ 2 Protocols       │ Lesson text / key points              │ [Quiz]     │
│    ● 2.1 ✓          │ ← Previous        Mark complete · Next →│ Progress   │
│    ◉ 2.2 current    │                                       │            │
│    ○ 2.3            │                                       │            │
└─────────────────────┴───────────────────────────────────────┴────────────┘
```
Tablet: right panel moves under the player as tabs. Mobile: player sticky on top, lesson list in a slide-over.

### Admin
Same shell with an "Admin" mode switch and a denser grid. Overview KPIs → tables with inline actions. The **Entitlement matrix** (device models × courses, checkboxes) is the central admin screen, alongside the **Grant access** slide-over and the **Content protection** settings page.
