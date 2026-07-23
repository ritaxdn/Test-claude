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
 * Uses the REAL Cellulift logo (remotion/public/cellulift-logo.png), unchanged.
 * The image is a single, untouched asset; every animation happens *around* it.
 * Orientation-aware: the same component drives both the 1920×1080 landscape
 * and the 1080×1920 vertical (reels/stories) compositions.
 *
 * Rhythm is punchy for social: a marked entrance zoom (0.82 → 1) and a
 * pronounced but uniform pulsation (±2.5%) — the logo is never distorted.
 *
 * All motion is a pure function of useCurrentFrame() — deterministic.
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
  const { fps, width, height } = useVideoConfig();

  const isPortrait = height > width;
  const logoWidth = isPortrait ? Math.round(width * 0.86) : 900;
  const glowW = logoWidth * 1.33;
  const glowH = logoWidth * 0.86;

  // Punchy entrance: marked fade + zoom (0.82 -> 1), snappy settle.
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.8, stiffness: 120 } });
  const enterScale = interpolate(enter, [0, 1], [0.82, 1]);
  const opacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pronounced pulsation once settled — still uniform, so no distortion.
  const pulseStart = 26;
  const pulse = frame > pulseStart ? Math.sin((frame - pulseStart) / 13) : 0;
  const scale = enterScale * (1 + pulse * 0.025);
  const glowStrength = 0.16 + pulse * 0.08;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Particles />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            width: glowW,
            height: glowH,
            borderRadius: "50%",
            opacity,
            background: `radial-gradient(closest-side, rgba(123,97,255,${glowStrength}), rgba(233,30,140,${glowStrength * 0.6}) 45%, transparent 72%)`,
            filter: "blur(20px)",
          }}
        />
        {/* THE LOGO — unchanged, animated only as a whole */}
        <Img
          src={LOGO}
          style={{ width: logoWidth, height: "auto", opacity, transform: `scale(${scale})` }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
