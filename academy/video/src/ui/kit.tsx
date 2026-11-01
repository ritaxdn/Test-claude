import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, ECG_PATH, F, RAINBOW_STOPS } from "../brand";

/* ---------- format ---------- */
export type Format = { v: boolean; u: number; W: number; H: number };
export const FormatCtx = createContext<Format>({ v: false, u: 1.45, W: 1920, H: 1080 });
export const useFormat = () => useContext(FormatCtx);

/* ---------- motion (globals.css : --ease = cubic-bezier(0.16, 1, 0.3, 1)) ---------- */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const prog = (f: number, start: number, dur: number, ease = EASE) =>
  interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing: ease });

/** Fondu + montée (translateY 20px → 0), comme les apparitions du site. */
export function rise(f: number, start: number, dur = 24, dist = 28): React.CSSProperties {
  const p = prog(f, start, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
}
/** Sortie douce d'un plan entier. */
export function exitStyle(f: number, start: number, dur = 14): React.CSSProperties {
  const p = prog(f, start, dur, Easing.in(Easing.cubic));
  return { opacity: 1 - p, transform: `translateY(${-p * 18}px)`, filter: p > 0 ? `blur(${p * 6}px)` : undefined };
}

/* ---------- background ---------- */
export function Pearl() {
  const f = useCurrentFrame();
  const d = Math.sin(f / 90) * 3;
  return (
    <AbsoluteFill
      style={{
        background: [
          `radial-gradient(60% 55% at ${92 + d}% ${-5 + d}%, rgba(123, 97, 255, 0.11), transparent 62%)`,
          `radial-gradient(55% 55% at ${-5 - d}% 45%, rgba(0, 188, 212, 0.09), transparent 62%)`,
          `radial-gradient(55% 55% at 100% ${100 - d}%, rgba(233, 30, 140, 0.08), transparent 62%)`,
          C.pearl,
        ].join(","),
      }}
    />
  );
}

/* ---------- text ---------- */
export const eyebrow = (u: number): React.CSSProperties => ({
  fontFamily: F.mono, fontSize: 11 * u, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.deepSoft,
});
export const display = (size: number, stretch = 118): React.CSSProperties => ({
  fontFamily: F.display, fontStretch: `${stretch}%`, fontWeight: 500, textTransform: "uppercase", letterSpacing: "-0.035em",
  lineHeight: 0.95, fontSize: size, color: C.deep, margin: 0, textWrap: "balance" as React.CSSProperties["textWrap"],
});
export function Iri({ children, shift = 0 }: { children: React.ReactNode; shift?: number }) {
  return (
    <span style={{ background: C.iri, backgroundSize: "160% 100%", backgroundPosition: `${100 - shift * 100}% 0`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
      {children}
    </span>
  );
}

/* ---------- surfaces ---------- */
export function Glass({ children, style, pad = 22 }: { children: React.ReactNode; style?: React.CSSProperties; pad?: number }) {
  const { u } = useFormat();
  return (
    <div style={{ background: C.glass, border: "1px solid rgba(255,255,255,0.9)", boxShadow: C.shadow, borderRadius: 26 * u, padding: pad * u, ...style }}>
      {children}
    </div>
  );
}

export function Progress({ value, showPct = true, height = 5 }: { value: number; showPct?: boolean; height?: number }) {
  const { u } = useFormat();
  const v = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 * u, width: "100%" }}>
      <div style={{ flex: 1, height: height * u, borderRadius: height * u, background: "rgba(29,27,38,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${v}%`, height: "100%", background: C.rainbow, backgroundSize: `${v > 0 ? 10000 / v : 100}% 100%`, borderRadius: "inherit" }} />
      </div>
      {showPct && <span style={{ fontFamily: F.mono, fontSize: 12 * u, fontVariantNumeric: "tabular-nums", minWidth: 44 * u, textAlign: "right" }}>{Math.round(v)} %</span>}
    </div>
  );
}

export function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  const { u } = useFormat();
  return (
    <span style={{
      width: size * u, height: size * u, borderRadius: "50%", display: "grid", placeItems: "center", flex: "none",
      fontFamily: F.sans, fontWeight: 600, fontSize: (size * 0.36) * u,
      background: `linear-gradient(#fff, #fff) padding-box, ${C.rainbow} border-box`, border: `${1.5 * u}px solid transparent`,
    }}>{initials}</span>
  );
}

export function Btn({ children, solid, press = 0, style }: { children: React.ReactNode; solid?: boolean; press?: number; style?: React.CSSProperties }) {
  const { u } = useFormat();
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 * u, minHeight: 42 * u, padding: `0 ${18 * u}px`,
      borderRadius: 999, border: `1px solid ${solid ? C.deep : C.line2}`, background: solid ? C.deep : "rgba(255,255,255,0.7)",
      color: solid ? "#fff" : C.deep, fontFamily: F.sans, fontSize: 14 * u, fontWeight: 500, whiteSpace: "nowrap",
      transform: `scale(${1 - press * 0.04})`, boxShadow: press ? "none" : C.shadowSm, ...style,
    }}>{children}</span>
  );
}

/** Pastille d'état d'une leçon (globals.css .dot) : terminée / à suivre / verrouillée. */
export function LessonDot({ state, fill = 1 }: { state: "done" | "cur" | "lock"; fill?: number }) {
  const { u } = useFormat();
  const s = 20 * u;
  if (state === "done") {
    return (
      <span style={{ width: s, height: s, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", position: "relative", border: `${1.5 * u}px solid ${C.line2}` }}>
        <span style={{ position: "absolute", inset: -1.5 * u, borderRadius: "50%", background: C.deep, transform: `scale(${fill})` }} />
        <svg width={11 * u} height={11 * u} viewBox="0 0 12 12" style={{ position: "relative" }}>
          <path d="M2.5 6.4 L5 8.8 L9.6 3.6" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={12} strokeDashoffset={12 * (1 - Math.min(1, Math.max(0, fill * 1.3 - 0.3)))} />
        </svg>
      </span>
    );
  }
  if (state === "cur") {
    return <span style={{ width: s, height: s, borderRadius: "50%", flex: "none", border: `${1.5 * u}px solid ${C.accent}`, boxShadow: `inset 0 0 0 ${4 * u}px #fff, inset 0 0 0 ${10 * u}px ${C.accent}` }} />;
  }
  return <span style={{ width: s, height: s, borderRadius: "50%", flex: "none", border: `${1.5 * u}px solid ${C.line2}`, background: C.pearl2 }} />;
}

export function DocRow({ title, style }: { title: string; style?: React.CSSProperties }) {
  const { u } = useFormat();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 * u, padding: 12 * u, borderRadius: 14 * u, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.6)", ...style }}>
      <span style={{ width: 36 * u, height: 36 * u, borderRadius: 10 * u, display: "grid", placeItems: "center", background: C.docIc, fontFamily: F.mono, fontSize: 10 * u, flex: "none" }}>PDF</span>
      <b style={{ fontFamily: F.sans, fontSize: 13 * u, fontWeight: 600 }}>{title}</b>
    </div>
  );
}

/* ---------- logo ---------- */
export function EcgLine({ width, draw = 1, stroke = 1.4, id = "ecg" }: { width: number; draw?: number; stroke?: number; id?: string }) {
  const h = (width / 160) * 20;
  return (
    <svg width={width} height={h} viewBox="0 0 160 20" fill="none" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
          {RAINBOW_STOPS.map((c, i) => <stop key={c} offset={i / 4} stopColor={c} />)}
        </linearGradient>
      </defs>
      <path d={ECG_PATH} stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    </svg>
  );
}

/** Logo CELLULIFT : mot en dégradé arc-en-ciel + ligne ECG + mention (Logo.tsx). */
export function Logo({ size = 21, tag = "Academy", draw = 1, tagOpacity = 1, id = "ecg-logo" }: { size?: number; tag?: string; draw?: number; tagOpacity?: number; id?: string }) {
  const wordW = size * 7.6;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: size * 0.15 }}>
      <span style={{ fontFamily: F.mark, fontSize: size, letterSpacing: "0.22em", textTransform: "uppercase", lineHeight: 1, background: C.rainbow, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", whiteSpace: "nowrap" }}>Cellulift</span>
      <EcgLine width={wordW * 0.92} draw={draw} stroke={1.4} id={id} />
      {tag && <span style={{ fontFamily: F.mono, fontSize: Math.max(8, size * 0.38), letterSpacing: "0.28em", textTransform: "uppercase", color: C.deepSoft, opacity: tagOpacity }}>{tag}</span>}
    </div>
  );
}

/* ---------- app chrome (Shell.tsx) ---------- */
export function TopBar({ admin, user, initials }: { admin?: boolean; user: string; initials: string }) {
  const { u, v } = useFormat();
  const links = admin ? ["Médecins", "Parcours", "Présentateurs", "Machines"] : ["Ma formation"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22 * u, padding: `${12 * u}px ${18 * u}px`, borderBottom: `1px solid ${C.line}`, background: "rgba(240,241,246,0.96)", position: "relative", zIndex: 2, flex: "none" }}>
      <Logo size={16 * u} tag={admin ? "Academy · Admin" : "Academy"} id={admin ? "ecg-top-a" : "ecg-top"} />
      {!v && (
        <div style={{ display: "flex", gap: 18 * u, fontFamily: F.sans, fontSize: 14 * u }}>
          {links.map((l, i) => (
            <span key={l} style={{ color: i === 0 ? C.deep : C.deepSoft, fontWeight: i === 0 ? 500 : 400, paddingBottom: 4 * u, borderBottom: i === 0 ? `${1.5 * u}px solid ${C.deep}` : "none" }}>{l}</span>
          ))}
        </div>
      )}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 * u }}>
        {!v && <span style={{ fontFamily: F.sans, fontSize: 13 * u, color: C.deepSoft }}>{user}</span>}
        <Avatar initials={initials} />
      </div>
    </div>
  );
}

/** Fenêtre d'application en verre (cadre de l'interface montrée dans la vidéo). */
export function AppWindow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { u } = useFormat();
  return (
    <div style={{
      display: "flex", flexDirection: "column", borderRadius: 30 * u, overflow: "hidden", border: "1px solid rgba(255,255,255,0.95)", background: "rgba(236,238,243,0.72)",
      boxShadow: `0 1px 0 rgba(255,255,255,0.9) inset, 0 ${50 * u}px ${110 * u}px -${50 * u}px rgba(29,27,38,0.38)`, ...style,
    }}>{children}</div>
  );
}

/** Repère d'étape : texte JetBrains Mono + filet arc-en-ciel (pas de pastille). */
export function StepCaption({ text, f, start, end }: { text: string; f: number; start: number; end: number }) {
  const { u, v } = useFormat();
  const a = prog(f, start, 20) * (1 - prog(f, end - 12, 12));
  const line = prog(f, start + 4, 30);
  return (
    <div style={{ position: "absolute", left: v ? 70 : 96, top: v ? 120 : 64, display: "flex", flexDirection: "column", gap: 10 * u, opacity: a, transform: `translateY(${(1 - prog(f, start, 20)) * 16}px)` }}>
      <span style={{ ...eyebrow(u), fontSize: (v ? 13 : 11) * u, color: C.deep }}>{text}</span>
      <span style={{ height: 1.5, width: (v ? 120 : 110) * u * line, background: C.rainbow }} />
    </div>
  );
}
