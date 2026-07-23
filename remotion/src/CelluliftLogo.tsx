import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Cellulift animated logo — "Editorial Light" brand.
 *
 * IMPORTANT: this uses the REAL Cellulift logo, unchanged. Drop the file at
 * `remotion/public/cellulift-logo.png` (transparent PNG or SVG preferred).
 * The logo is treated as a single, untouched image — every animation happens
 * *around* it (fade, gentle scale entrance, subtle pulsation, particles). The
 * logo's own pixels are never redrawn or distorted.
 *
 * All motion is a pure function of useCurrentFrame() — deterministic, no
 * Math.random(), no wall-clock time.
 */

const C = { bg: "#F5F2EC" }; // ivoire chaud
const RAINBOW = ["#00BCD4", "#7B61FF", "#E91E8C", "#FF5722", "#FFC107"];
const LOGO = staticFile("cellulift-logo.png");

/** Fine luminous particles, seeded and drifting — deterministic. */
const Particles: React.FC<{ count?: number }> = ({ count = 18 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const seed = `spark-${i}`;
        const baseX = random(seed + "-x") * width;
        const baseY = random(seed + "-y") * height;
        const size = 3 + random(seed + "-s") * 7;
        const speed = 0.2 + random(seed + "-v") * 0.5;
        const color = RAINBOW[Math.floor(random(seed + "-c") * RAINBOW.length)];
        let y = (baseY - frame * speed) % height;
        if (y < 0) y += height;
        const x = baseX + Math.sin(frame / 40 + i) * 14;
        const twinkle = interpolate(Math.sin(frame / 18 + i * 1.7), [-1, 1], [0.05, 0.32]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: twinkle,
              filter: "blur(1.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const CelluliftLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance: fade + gentle scale-up (0.9 -> 1), settles with a soft spring.
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 90 } });
  const enterScale = interpolate(enter, [0, 1], [0.9, 1]);
  const enterOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsation: begins after the entrance, a very subtle uniform breathing.
  const pulseStart = 30;
  const pulse = frame > pulseStart ? Math.sin((frame - pulseStart) / 16) : 0;
  const breathe = 1 + pulse * 0.012; // ±1.2% — the logo is not distorted
  const scale = enterScale * breathe;

  // A soft rainbow glow BEHIND the logo that pulses with it (never on top).
  const glowStrength = 0.12 + pulse * 0.05;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Particles />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* pulsing glow, sits under the logo */}
        <div
          style={{
            position: "absolute",
            width: 1200,
            height: 780,
            borderRadius: "50%",
            opacity: enterOpacity,
            background: `radial-gradient(closest-side, rgba(123,97,255,${glowStrength}), rgba(233,30,140,${glowStrength * 0.6}) 45%, transparent 72%)`,
            filter: "blur(20px)",
          }}
        />

        {/* THE LOGO — unchanged, animated only as a whole */}
        <Img
          src={LOGO}
          style={{
            width: 900,
            height: "auto",
            opacity: enterOpacity,
            transform: `scale(${scale})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
