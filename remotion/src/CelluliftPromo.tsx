import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

/**
 * Cellulift brand — "Editorial Light" direction.
 * Fonts should be loaded via @remotion/google-fonts (Cormorant Garamond,
 * Raleway, Space Mono) in Root.tsx or here; the family names below match.
 */
const C = {
  bg: "#F5F2EC", // ivoire chaud
  warm: "#FAF8F4", // warm white / cards
  ink: "#1A1814", // encre profonde
  inkSoft: "#3A3630", // encre douce
  muted: "#8A8680", // muted
  light: "#C4C0B8", // borders
  border: "rgba(26,24,20,0.08)",
};
const FONT = {
  serif: "'Cormorant Garamond', Garamond, 'Times New Roman', serif",
  body: "'Raleway', system-ui, sans-serif",
  mono: "'Space Mono', 'Courier New', monospace",
};
// Rainbow accent — always a true gradient, never flattened.
const GRAD = "linear-gradient(90deg, #00BCD4, #7B61FF, #E91E8C, #FF5722, #FFC107)";

type PromoProps = {
  title: string;
  tagline: string;
};

/** Soft rainbow radial glow, gently drifting — restrained ambient motion. */
const Glow: React.FC = () => {
  const frame = useCurrentFrame();
  const cx = 50 + Math.sin(frame / 90) * 6;
  const cy = 42 + Math.cos(frame / 70) * 5;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(46% 46% at ${cx}% ${cy}%, rgba(123,97,255,0.10), rgba(233,30,140,0.06) 40%, transparent 70%)`,
      }}
    />
  );
};

/** Reusable rainbow-gradient SVG defs for arc + ECG strokes. */
const RainbowDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#00BCD4" />
      <stop offset="0.28" stopColor="#7B61FF" />
      <stop offset="0.55" stopColor="#E91E8C" />
      <stop offset="0.8" stopColor="#FF5722" />
      <stop offset="1" stopColor="#FFC107" />
    </linearGradient>
  </defs>
);

/** Scene 1: logo reveal — arc swoosh draws, wordmark springs, ECG traces. */
const LogoScene: React.FC<PromoProps> = ({ title, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arcDraw = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arcOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  const wordRise = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const wordY = interpolate(wordRise, [0, 1], [20, 0]);
  const wordOp = interpolate(wordRise, [0, 1], [0, 1]);

  const ecgDraw = interpolate(frame, [22, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tagOp = interpolate(frame, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [40, 58], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // three stacked rainbow arcs evoking the Cellulift logo swoosh
  const bands = [
    { r: 300, w: 46, off: 0, op: 0.85 },
    { r: 250, w: 30, off: 0.15, op: 0.67 },
    { r: 355, w: 26, off: 0.3, op: 0.49 },
  ];

  // ECG heartbeat path: flat, small blip, big spike, flat
  const ecgPath =
    "M0,40 L120,40 L150,40 L165,26 L180,40 L300,40 L330,40 L345,8 L360,72 L375,30 L390,40 L520,40 L660,40";
  const ecgTotal = 900;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 150, opacity: arcOp }}>
        <svg viewBox="0 0 960 380" width={960} height={380}>
          <RainbowDefs id="arcGrad" />
          {bands.map((b, i) => {
            const cx = 480;
            const cy = 340;
            const d = `M ${cx - b.r} ${cy} A ${b.r} ${b.r} 0 0 1 ${cx + b.r} ${cy}`;
            const len = Math.PI * b.r;
            const t = Math.max(0, Math.min(1, (arcDraw - b.off) / (1 - b.off)));
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth={b.w}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - t)}
                opacity={b.op}
              />
            );
          })}
        </svg>
      </div>

      <div
        style={{
          opacity: wordOp,
          transform: `translateY(${wordY}px)`,
          marginTop: 120,
          fontFamily: FONT.serif,
          fontWeight: 300,
          fontSize: 150,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          paddingLeft: "0.22em",
          background: GRAD,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {title}
      </div>

      <div style={{ marginTop: 6 }}>
        <svg viewBox="0 0 660 80" width={660} height={80}>
          <RainbowDefs id="ecgGrad" />
          <path
            d={ecgPath}
            fill="none"
            stroke="url(#ecgGrad)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={ecgTotal}
            strokeDashoffset={ecgTotal * (1 - ecgDraw)}
          />
        </svg>
      </div>

      <div
        style={{
          opacity: tagOp,
          transform: `translateY(${tagY}px)`,
          marginTop: 10,
          fontFamily: FONT.mono,
          fontSize: 26,
          letterSpacing: "0.4em",
          color: C.muted,
          textTransform: "uppercase",
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};

/** Scene 2: three editorial cards, staggered fade + rise. */
const PillarsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { k: "PROTOCOLE", t: "Non-invasif" },
    { k: "CLINIQUE", t: "Résultats prouvés" },
    { k: "SUR-MESURE", t: "Chaque peau" },
  ];
  const headOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 56 }}
    >
      <div
        style={{
          opacity: headOp,
          fontFamily: FONT.serif,
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: 56,
          color: C.inkSoft,
        }}
      >
        Une technologie, trois promesses
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 44 }}>
        {items.map((it, i) => {
          const enter = spring({ frame: frame - i * 9, fps, config: { damping: 200 } });
          const y = interpolate(enter, [0, 1], [20, 0]);
          const opacity = interpolate(enter, [0, 1], [0, 1]);
          return (
            <div
              key={it.t}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
                width: 440,
                height: 300,
                borderRadius: 20,
                background: C.warm,
                border: `1px solid ${C.border}`,
                boxShadow: "0 20px 40px -28px rgba(26,24,20,0.3)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 40,
              }}
            >
              <div style={{ fontFamily: FONT.mono, fontSize: 20, letterSpacing: "0.28em", color: C.muted }}>
                {it.k}
              </div>
              <div style={{ height: 2, width: 60, background: GRAD, opacity: 0.7, borderRadius: 2 }} />
              <div style={{ fontFamily: FONT.serif, fontWeight: 300, fontSize: 60, color: C.ink, lineHeight: 1 }}>
                {it.t}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Scene 3: call to action — rainbow rule wipes, primary button rises. */
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headRise = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const hY = interpolate(headRise, [0, 1], [20, 0]);
  const hOp = interpolate(headRise, [0, 1], [0, 1]);
  const ruleW = interpolate(frame, [14, 44], [0, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const btnOp = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const btnY = interpolate(frame, [30, 50], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          opacity: hOp,
          transform: `translateY(${hY}px)`,
          fontFamily: FONT.serif,
          fontWeight: 300,
          fontSize: 110,
          color: C.ink,
          textAlign: "center",
          lineHeight: 1.05,
        }}
      >
        Révélez votre
        <br />
        <em style={{ fontStyle: "italic" }}>métamorphose</em>
      </div>
      <div style={{ marginTop: 34, height: 2, width: ruleW, background: GRAD, opacity: 0.7, borderRadius: 2 }} />
      <div
        style={{
          opacity: btnOp,
          transform: `translateY(${btnY}px)`,
          marginTop: 44,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            background: C.ink,
            color: C.bg,
            fontFamily: FONT.body,
            fontWeight: 400,
            fontSize: 34,
            padding: "22px 46px",
            borderRadius: 999,
          }}
        >
          Prendre rendez-vous
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 30, letterSpacing: "0.22em", color: C.muted }}>
          cellulift.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CelluliftPromo: React.FC<PromoProps> = ({ title, tagline }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Glow />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={70}>
          <LogoScene title={title} tagline={tagline} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={70}>
          <PillarsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={70}>
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
