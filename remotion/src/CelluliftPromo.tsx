import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
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

const BRAND = {
  bg: "#0d1b17",
  accent: "#5ec6a8",
  accentSoft: "#a7e8d4",
  text: "#f4fbf8",
};

type PromoProps = {
  title: string;
  tagline: string;
};

/**
 * Deterministic floating "particle" field. Every value is derived from a
 * seeded random(), so the same frame always renders identically — no
 * Math.random(), no Date.now(). This is the core Remotion rule.
 */
const Particles: React.FC<{ count?: number }> = ({ count = 24 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const seed = `p-${i}`;
        const baseX = random(`${seed}-x`) * width;
        const baseY = random(`${seed}-y`) * height;
        const size = 4 + random(`${seed}-s`) * 10;
        const speed = 0.3 + random(`${seed}-v`) * 0.9;
        // drift upward and wrap around the canvas height
        const y = (baseY - frame * speed) % height;
        const twinkle = interpolate(
          Math.sin((frame / 15) * speed + i),
          [-1, 1],
          [0.15, 0.6]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: baseX,
              top: y < 0 ? y + height : y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: BRAND.accentSoft,
              opacity: twinkle,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Scene 1: brand name springs in, tagline fades up beneath it. */
const TitleScene: React.FC<PromoProps> = ({ title, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.7, stiffness: 120 } });
  const scale = interpolate(pop, [0, 1], [0.7, 1]);

  const taglineOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [20, 45], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${scale})`,
          fontSize: 160,
          fontWeight: 800,
          letterSpacing: -4,
          color: BRAND.text,
          textShadow: `0 8px 60px ${BRAND.accent}55`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          marginTop: 12,
          fontSize: 42,
          fontWeight: 400,
          color: BRAND.accentSoft,
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};

/** Scene 2: three pillars slide/stagger in. */
const PillarsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pillars = ["Non-invasif", "Résultats prouvés", "Sur-mesure"];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 48,
      }}
    >
      {pillars.map((label, i) => {
        // stagger each card by 8 frames using its own spring
        const enter = spring({
          frame: frame - i * 8,
          fps,
          config: { damping: 200 },
        });
        const y = interpolate(enter, [0, 1], [120, 0]);
        const opacity = interpolate(enter, [0, 1], [0, 1]);
        return (
          <div
            key={label}
            style={{
              opacity,
              transform: `translateY(${y}px)`,
              width: 420,
              height: 260,
              borderRadius: 28,
              background: "rgba(94,198,168,0.10)",
              border: `1px solid ${BRAND.accent}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 32,
              fontSize: 44,
              fontWeight: 700,
              color: BRAND.text,
              backdropFilter: "blur(4px)",
            }}
          >
            {label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Scene 3: call to action, an underline wipes in. */
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [10, 40], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontSize: 96, fontWeight: 800, color: BRAND.text }}>
        Prenez rendez-vous
      </div>
      <div
        style={{
          marginTop: 16,
          height: 8,
          width: `${width * 6}px`,
          maxWidth: 640,
          borderRadius: 8,
          background: BRAND.accent,
        }}
      />
      <div style={{ marginTop: 28, fontSize: 40, color: BRAND.accentSoft }}>
        cellulift.com
      </div>
    </AbsoluteFill>
  );
};

export const CelluliftPromo: React.FC<PromoProps> = ({ title, tagline }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      {/* radial glow background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 60% at 50% 40%, ${BRAND.accent}22, transparent)`,
        }}
      />
      <Particles />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={70}>
          <TitleScene title={title} tagline={tagline} />
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
