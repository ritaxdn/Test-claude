import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
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
 *
 * The brand mark is the REAL Cellulift logo, unchanged, loaded from
 * `remotion/public/cellulift-logo.png` and animated only as a whole.
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
const LOGO = staticFile("cellulift-logo.png");

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

/** Scene 1: the real logo reveals — fade + gentle scale, then a subtle breathe. */
const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 90 } });
  const enterScale = interpolate(enter, [0, 1], [0.9, 1]);
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = frame > 30 ? Math.sin((frame - 30) / 16) : 0;
  const scale = enterScale * (1 + pulse * 0.012);
  const glow = 0.12 + pulse * 0.05;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 780,
          borderRadius: "50%",
          opacity,
          background: `radial-gradient(closest-side, rgba(123,97,255,${glow}), rgba(233,30,140,${glow * 0.6}) 45%, transparent 72%)`,
          filter: "blur(20px)",
        }}
      />
      {/* THE LOGO — unchanged */}
      <Img src={LOGO} style={{ width: 900, height: "auto", opacity, transform: `scale(${scale})` }} />
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

export const CelluliftPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Glow />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={70}>
          <LogoScene />
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
