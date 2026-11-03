import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/** Courbe de la marque : cubic-bezier(0.16, 1, 0.3, 1). */
export const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 entre `start` et `start + dur` (en images), avec la courbe de la marque. */
export const prog = (frame: number, start: number, dur = 24) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: ease });

/** Entrée « fondu + montée » de la charte : translateY(20px) → 0. */
export const rise = (frame: number, start: number, dur = 24, dist = 20): React.CSSProperties => {
  const p = prog(frame, start, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};

export const useTall = () => {
  const { width, height } = useVideoConfig();
  return height > width;
};

/** Met en dégradé irisé le mot `iri` dans `text` (insensible à la casse). */
export const Iri: React.FC<{ text: string; iri?: string }> = ({ text, iri }) => {
  if (!iri) return <>{text}</>;
  const i = text.toLowerCase().indexOf(iri.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="iri">{text.slice(i, i + iri.length)}</span>
      {text.slice(i + iri.length)}
    </>
  );
};

const ECG_PATH = "M0 10 H50 L58 10 L64 2 L72 18 L80 6 L86 10 H100 L106 10 L112 4 L118 16 L124 10 H160";

/** Ligne ECG de la marque, tracée de 0 à 1 (`draw`). Signal de marque uniquement. */
export const Ecg: React.FC<{ width: number; draw: number; stroke?: number; id: string }> = ({ width, draw, stroke = 1.2, id }) => (
  <svg width={width} height={(width / 160) * 20} viewBox="0 0 160 20" fill="none" style={{ overflow: "visible", display: "block" }}>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#00BCD4" />
        <stop offset=".25" stopColor="#7B61FF" />
        <stop offset=".5" stopColor="#E91E8C" />
        <stop offset=".75" stopColor="#FF5722" />
        <stop offset="1" stopColor="#FFC107" />
      </linearGradient>
    </defs>
    <path
      d={ECG_PATH}
      stroke={`url(#${id})`}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
  </svg>
);

/** Mot-symbole CELLULIFT + ECG + étiquette. `size` = taille du mot en px. */
export const Logo: React.FC<{ size: number; draw: number; tag?: string; tagOpacity?: number; id: string; spacing?: number }> = ({
  size,
  draw,
  tag,
  tagOpacity = 1,
  id,
  spacing = 0.22,
}) => (
  <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: size * 0.16 }}>
    <span
      className="rbtext"
      style={{ fontFamily: "var(--f-mark)", fontWeight: 400, fontSize: size, letterSpacing: `${spacing}em`, marginRight: `-${spacing}em`, lineHeight: 1, textTransform: "uppercase" }}
    >
      Cellulift
    </span>
    <Ecg width={size * 5.4} draw={draw} stroke={1.1} id={id} />
    {tag && (
      <span className="mono" style={{ fontSize: size * 0.2, letterSpacing: "0.5em", marginRight: "-0.5em", opacity: tagOpacity, color: "var(--deep-soft)" }}>
        {tag}
      </span>
    )}
  </div>
);

/** Fond nacré avec les trois halos (violet, cyan, magenta) qui dérivent lentement. */
export const PearlBg: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = Math.max(width, height);
  const dx = Math.sin(f / 90) * 0.04;
  const dy = Math.cos(f / 110) * 0.04;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(${s * 0.55}px ${s * 0.4}px at ${(0.92 + dx) * 100}% ${(-0.02 + dy) * 100}%, rgba(123, 97, 255, 0.16), transparent 62%),
          radial-gradient(${s * 0.5}px ${s * 0.4}px at ${(-0.04 - dx) * 100}% ${(0.48 + dy) * 100}%, rgba(0, 188, 212, 0.13), transparent 62%),
          radial-gradient(${s * 0.5}px ${s * 0.4}px at ${(1 + dx) * 100}% ${(1 - dy) * 100}%, rgba(233, 30, 140, 0.11), transparent 62%),
          #eceef3`,
      }}
    >
      {/* Orbe nacré flottant (même dessin que l'écran de connexion de l'app). */}
      <div
        style={{
          position: "absolute",
          width: s * 0.42,
          height: s * 0.42,
          borderRadius: "50%",
          left: width * 0.62 + Math.sin(f / 70) * 30,
          top: height * 0.5 - s * 0.21 + Math.cos(f / 80) * 26,
          background: "radial-gradient(circle at 35% 35%, #fff, rgba(167, 151, 255, 0.28) 40%, rgba(242, 155, 208, 0.18) 62%, transparent 70%)",
          opacity: 0.8,
        }}
      />
    </div>
  );
};

/** Barre de progression de l'app (dégradé arc-en-ciel). */
export const Progress: React.FC<{ value: number; height?: number }> = ({ value, height = 5 }) => (
  <div className="row" style={{ gap: 10 }}>
    <div className="progress" style={{ height }}>
      <i style={{ width: `${value}%` }} />
    </div>
    <span className="pct">{Math.round(value)} %</span>
  </div>
);

/** Pastille de leçon : terminée (coche qui se remplit), en cours, ou verrouillée. */
export const Dot: React.FC<{ done: number; current?: boolean }> = ({ done, current }) => {
  if (done > 0) {
    return (
      <span
        className="dot"
        style={{
          background: `rgba(29,27,38,${done})`,
          borderColor: "var(--deep)",
          transform: `scale(${0.8 + 0.2 * done + Math.sin(done * Math.PI) * 0.25})`,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12">
          <path d="M2.5 6.3 L5 8.6 L9.6 3.6" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - done} />
        </svg>
      </span>
    );
  }
  if (current) return <span className="dot" style={{ borderColor: "var(--accent)", boxShadow: "inset 0 0 0 4px #fff, inset 0 0 0 10px var(--accent)" }} />;
  return <span className="dot lock" />;
};

/** Légende de plan : étiquette mono + titre Archivo en majuscules, un mot irisé. */
export const Caption: React.FC<{ step: string; title: readonly string[]; iri: string; start?: number; size: number; align?: "left" | "center" }> = ({
  step,
  title,
  iri,
  start = 0,
  size,
  align = "left",
}) => {
  const f = useCurrentFrame();
  const line = prog(f, start + 4, 30);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", textAlign: align }}>
      <div className="row" style={{ gap: 12, ...rise(f, start, 20) }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent)", boxShadow: `0 0 0 ${4 + Math.sin(f / 6) * 3}px rgba(123,97,255,.15)` }} />
        <span className="mono" style={{ fontSize: size * 0.24, letterSpacing: "0.16em" }}>
          {step}
        </span>
      </div>
      <div style={{ height: 2, width: size * 3.2 * line, background: "var(--rainbow)", opacity: 0.75, margin: `${size * 0.3}px 0 ${size * 0.34}px` }} />
      <h2 className="display" style={{ fontSize: size, lineHeight: 0.98 }}>
        {title.map((t, i) => (
          <div key={i} style={{ ...rise(f, start + 6 + i * 6, 26, 24) }}>
            <Iri text={t} iri={iri} />
          </div>
        ))}
      </h2>
    </div>
  );
};
