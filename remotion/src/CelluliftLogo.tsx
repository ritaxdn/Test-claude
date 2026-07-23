import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedLogo } from "./AnimatedLogo";

/**
 * Cellulift animated logo — "Editorial Light" brand.
 * The reveal choreography (arc draws in -> ECG traces -> letters pop in
 * one by one -> tagline fades -> pulsation) lives in AnimatedLogo.tsx and
 * is shared with CelluliftPromo's opening scene.
 */

const C = { bg: "#F5F2EC" };
const RAINBOW = ["#00BCD4", "#7B61FF", "#E91E8C", "#FF5722", "#FFC107"];

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
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Particles />
      <AnimatedLogo />
    </AbsoluteFill>
  );
};
