import { staticFile } from "remotion";

/**
 * Jetons et classes repris tels quels de academy/app/src/app/globals.css
 * (direction « Nacre & verre »), plus les polices embarquées en local.
 */
export const css = `
@font-face { font-family: "Archivo"; src: url(${staticFile("fonts/archivo.woff2")}) format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; font-display: block; }
@font-face { font-family: "Instrument Sans"; src: url(${staticFile("fonts/instrument-sans.woff2")}) format("woff2"); font-weight: 400 700; font-display: block; }
@font-face { font-family: "JetBrains Mono"; src: url(${staticFile("fonts/jetbrains-mono.woff2")}) format("woff2"); font-weight: 400 600; font-display: block; }
@font-face { font-family: "Cormorant Garamond"; src: url(${staticFile("fonts/cormorant.woff2")}) format("woff2"); font-weight: 300 500; font-display: block; }

:root {
  --pearl: #eceef3; --pearl-2: #e2e4eb; --surface: #ffffff;
  --deep: #1d1b26; --deep-soft: #5d5b6b; --muted: #77758a;
  --line: rgba(29, 27, 38, 0.1); --line-2: rgba(29, 27, 38, 0.16);
  --accent: #7b61ff;
  --rainbow: linear-gradient(90deg, #00bcd4 0%, #7b61ff 25%, #e91e8c 50%, #ff5722 75%, #ffc107 100%);
  --glass: linear-gradient(145deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.55));
  --ok: #11845b; --ok-bg: rgba(17, 132, 91, 0.1);
  --warn: #9a5b00; --warn-bg: rgba(178, 106, 0, 0.11);
  --shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 24px 60px -30px rgba(29, 27, 38, 0.25);
  --shadow-sm: 0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 10px 24px -16px rgba(29, 27, 38, 0.3);
  --f-display: "Archivo", "Arial Narrow", sans-serif;
  --f-sans: "Instrument Sans", system-ui, sans-serif;
  --f-mono: "JetBrains Mono", ui-monospace, monospace;
  --f-mark: "Cormorant Garamond", Georgia, serif;
}
* { box-sizing: border-box; }
.root { font-family: var(--f-sans); font-size: 15px; line-height: 1.55; color: var(--deep); -webkit-font-smoothing: antialiased; }
p, h1, h2, h3 { margin: 0; }
.display { font-family: var(--f-display); font-stretch: 118%; font-weight: 500; text-transform: uppercase; letter-spacing: -0.035em; line-height: 0.95; }
.h1 { font-size: 2.6rem; }
.h2 { font-size: 1.5rem; }
.eyebrow, .mono { font-family: var(--f-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--deep-soft); }
.muted { color: var(--deep-soft); }
.small { font-size: 13px; }
.iri { background: linear-gradient(100deg, #1d1b26 0%, #1d1b26 38%, #6b5cff 55%, #d0469c 72%, #e38a3c 90%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.rbtext { background: var(--rainbow); -webkit-background-clip: text; background-clip: text; color: transparent; }
.glass { background: var(--glass); border: 1px solid rgba(255, 255, 255, 0.9); box-shadow: var(--shadow); backdrop-filter: blur(22px) saturate(1.4); border-radius: 26px; }
.card { padding: 22px; }
.stack { display: flex; flex-direction: column; gap: 16px; }
.row { display: flex; align-items: center; gap: 12px; }
.between { justify-content: space-between; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 42px; padding: 0 18px; border-radius: 999px; border: 1px solid var(--line-2); background: rgba(255, 255, 255, 0.7); font-size: 14px; font-weight: 500; white-space: nowrap; }
.btn.solid { background: var(--deep); color: #fff; border-color: var(--deep); }
.badge { display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px; border-radius: 999px; font-family: var(--f-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(255, 255, 255, 0.85); border: 1px solid var(--line); white-space: nowrap; }
.badge.ok { background: var(--ok-bg); color: var(--ok); border-color: transparent; }
.badge.warn { background: var(--warn-bg); color: var(--warn); border-color: transparent; }
.badge.rb { position: relative; border-color: transparent; background: #fff; }
.badge.rb::before { content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; background: var(--rainbow); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
.progress { height: 5px; border-radius: 5px; background: rgba(29, 27, 38, 0.08); overflow: hidden; flex: 1; min-width: 60px; }
.progress > i { display: block; height: 100%; background: var(--rainbow); border-radius: inherit; }
.pct { font-family: var(--f-mono); font-size: 12px; font-variant-numeric: tabular-nums; }
.kpi .v { font-family: var(--f-display); font-stretch: 112%; font-weight: 500; font-size: 32px; letter-spacing: -0.03em; line-height: 1; margin-top: 10px; font-variant-numeric: tabular-nums; }
.input { width: 100%; min-height: 44px; padding: 0 14px; border-radius: 14px; border: 1px solid var(--line-2); background: rgba(255, 255, 255, 0.9); font-size: 15px; display: flex; align-items: center; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; font-weight: 500; }
.avatar { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; font-weight: 600; font-size: 13px; background: linear-gradient(#fff, #fff) padding-box, var(--rainbow) border-box; border: 1.5px solid transparent; flex: none; }
.lesson { display: flex; align-items: center; gap: 12px; padding: 12px 8px; border-radius: 12px; }
.lesson.current { background: #fff; box-shadow: var(--shadow-sm); }
.dot { width: 20px; height: 20px; border-radius: 50%; flex: none; display: grid; place-items: center; border: 1.5px solid var(--line-2); font-size: 11px; color: #fff; }
.dot.lock { background: var(--pearl-2); }
.doc { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 14px; border: 1px solid var(--line); background: rgba(255, 255, 255, 0.6); }
.doc .ic { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; background: linear-gradient(135deg, rgba(127, 227, 240, 0.45), rgba(167, 151, 255, 0.4)); font-family: var(--f-mono); font-size: 10px; flex: none; }
table.t { width: 100%; border-collapse: collapse; font-size: 14px; }
table.t th { text-align: left; font-family: var(--f-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--deep-soft); padding: 12px 14px; border-bottom: 1px solid var(--line); white-space: nowrap; }
table.t td { padding: 13px 14px; border-bottom: 1px solid var(--line); vertical-align: middle; }
table.t tr:last-child td { border-bottom: 0; }
`;
