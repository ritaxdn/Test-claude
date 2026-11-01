import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../brand";
import { display, EASE, prog, useFormat } from "../ui/kit";

/** Typo cinétique : chaque lettre monte depuis un masque, en décalé, puis repart vers le haut. */
export function KineticText({ text, start = 0, exit, size, stretch = 118, stagger = 1.1, iri = false, align = "center", lineGap = 0.08 }: {
  text: string; start?: number; exit?: number; size: number; stretch?: number; stagger?: number; iri?: boolean; align?: "center" | "left"; lineGap?: number;
}) {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const total = text.replace(/ /g, "").length;
  let k = 0;
  return (
    <h2 style={{ ...display(size, stretch), textAlign: align, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: "0.28em", rowGap: `${lineGap}em` }}>
      {words.map((w, wi) => (
        <span key={wi} style={{ display: "inline-flex", overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em" }}>
          {[...w].map((ch, ci) => {
            const i = k++;
            const pin = prog(f, start + i * stagger, 18);
            const pout = exit === undefined ? 0 : prog(f, exit + i * stagger * 0.5, 10);
            const y = (1 - pin) * 105 - pout * 105;
            const style: React.CSSProperties = { display: "inline-block", transform: `translateY(${y}%)`, opacity: Math.min(1, pin * 1.4) };
            if (iri) {
              Object.assign(style, {
                background: C.iri, backgroundSize: `${total * 100}% 100%`, backgroundPosition: `${(i / Math.max(1, total - 1)) * 100}% 0`,
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              });
            }
            return <span key={ci} style={style}>{ch}</span>;
          })}
        </span>
      ))}
    </h2>
  );
}

/** Balayage scan : un filet arc-en-ciel traverse l'écran avec un léger voile violet (signature du site). */
export function ScanWipe({ dur = 16, veil = 0.1 }: { dur?: number; veil?: number }) {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [-0.15, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const a = prog(f, 0, 4) * (1 - prog(f, dur - 4, 4));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: a }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: `${t * 100 - 22}%`, height: "22%", background: `linear-gradient(180deg, rgba(123,97,255,0), rgba(123,97,255,${veil}))` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: `${t * 100}%`, height: 2, background: "linear-gradient(90deg, #00BCD4, #7B61FF, #E91E8C, #FF5722, #FFC107)" }} />
    </AbsoluteFill>
  );
}

/** Anneaux fins qui s'ouvrent depuis le centre (révélation). */
export function Rings({ count = 3, gap = 8, max = 1.1 }: { count?: number; gap?: number; max?: number }) {
  const f = useCurrentFrame();
  const { W, H } = useFormat();
  const d = Math.hypot(W, H) * max;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const p = prog(f, i * gap, 50);
        return <div key={i} style={{ position: "absolute", width: d * p, height: d * p, borderRadius: "50%", border: `1px solid rgba(29,27,38,${0.16 * (1 - p)})` }} />;
      })}
    </AbsoluteFill>
  );
}

/** Orbes de verre nacré qui flottent lentement (9–13 s par cycle, comme les objets du site). */
export function Orbs({ strength = 1 }: { strength?: number }) {
  const f = useCurrentFrame();
  const { W, H, v } = useFormat();
  const orbs = [
    { x: 0.82, y: 0.2, r: v ? 0.42 : 0.26, period: 330, c: "rgba(167,151,255,0.32)" },
    { x: 0.12, y: 0.78, r: v ? 0.34 : 0.2, period: 390, c: "rgba(127,227,240,0.28)" },
    { x: 0.7, y: 0.9, r: v ? 0.22 : 0.13, period: 290, c: "rgba(242,155,208,0.26)" },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: strength }}>
      {orbs.map((o, i) => {
        const size = o.r * W;
        const dx = Math.sin((f / o.period) * Math.PI * 2) * W * 0.025;
        const dy = Math.cos((f / o.period) * Math.PI * 2 + i) * H * 0.02;
        return (
          <div key={i} style={{
            position: "absolute", left: o.x * W - size / 2 + dx, top: o.y * H - size / 2 + dy, width: size, height: size, borderRadius: "50%",
            background: `radial-gradient(circle at 38% 34%, rgba(255,255,255,0.7), ${o.c} 42%, rgba(255,255,255,0) 68%)`,
            filter: "blur(2px)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
}

/** Grille de points façon plaque de labo, qui défile doucement. */
export function DotGrid({ opacity = 0.5, speed = 0.6 }: { opacity?: number; speed?: number }) {
  const f = useCurrentFrame();
  const { u } = useFormat();
  const step = 26 * u;
  return (
    <AbsoluteFill style={{
      opacity, pointerEvents: "none",
      backgroundImage: "radial-gradient(rgba(29,27,38,0.22) 1px, transparent 1.4px)", backgroundSize: `${step}px ${step}px`,
      backgroundPosition: `0 ${-f * speed}px`,
      WebkitMaskImage: "radial-gradient(60% 55% at 50% 50%, #000 30%, transparent 75%)", maskImage: "radial-gradient(60% 55% at 50% 50%, #000 30%, transparent 75%)",
    }} />
  );
}

/** Cadre de visée : quatre équerres fines + réticule, et un compteur mono. */
export function Viewfinder({ w, h, label, local }: { w: number; h: number; label: string; local: number }) {
  const { u } = useFormat();
  const p = prog(local, 0, 10);
  const L = 26 * u * p;
  const s = 1.5;
  const col = "rgba(29,27,38,0.55)";
  const corner = (pos: React.CSSProperties, bx: string, by: string): React.ReactNode => (
    <div style={{ position: "absolute", width: L, height: L, ...pos, [bx]: `${s}px solid ${col}`, [by]: `${s}px solid ${col}` }} />
  );
  const gw = w * (1.12 - 0.12 * p);
  const gh = h * (1.12 - 0.12 * p);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ position: "relative", width: gw, height: gh }}>
        {corner({ left: 0, top: 0 }, "borderLeft", "borderTop")}
        {corner({ right: 0, top: 0 }, "borderRight", "borderTop")}
        {corner({ left: 0, bottom: 0 }, "borderLeft", "borderBottom")}
        {corner({ right: 0, bottom: 0 }, "borderRight", "borderBottom")}
        <span style={{ position: "absolute", left: 0, top: -30 * u, fontFamily: F.mono, fontSize: 11 * u, letterSpacing: "0.14em", color: C.deepSoft, opacity: p }}>{label}</span>
      </div>
    </AbsoluteFill>
  );
}

/** Compteur d'étape + filet de progression (01 / 03). */
export function Counter({ index, total, local, dur }: { index: number; total: number; local: number; dur: number }) {
  const { u, v } = useFormat();
  const a = prog(local, 0, 10) * (1 - prog(local, dur - 6, 6));
  const fill = (index + Math.min(1, local / dur)) / total;
  return (
    <div style={{ position: "absolute", left: v ? 70 : 96, right: v ? 70 : 96, top: v ? 130 : 70, display: "flex", alignItems: "center", gap: 18 * u, opacity: a }}>
      <span style={{ fontFamily: F.mono, fontSize: 12 * u, letterSpacing: "0.14em", color: C.deep, fontVariantNumeric: "tabular-nums" }}>
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <div style={{ flex: 1, height: 1, background: "rgba(29,27,38,0.12)" }}>
        <div style={{ width: `${fill * 100}%`, height: 1.5, background: C.rainbow }} />
      </div>
    </div>
  );
}

/** Texte tapé au clavier, avec curseur. */
export function TypeOn({ text, start, cps = 1.4, style }: { text: string; start: number; cps?: number; style?: React.CSSProperties }) {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - start) * cps)));
  const caretOn = f >= start && (n < text.length || Math.floor(f / 8) % 2 === 0);
  return (
    <span style={{ ...style, whiteSpace: "nowrap" }}>
      {text.slice(0, n)}
      <span style={{ display: "inline-block", width: "0.08em", height: "1em", marginLeft: "0.06em", verticalAlign: "-0.12em", background: C.accent, opacity: caretOn ? 1 : 0 }} />
    </span>
  );
}
