import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Cellulift animated logo — "Editorial Light" brand.
 *
 * A focused, loop-friendly logo reveal built from the moves requested by the
 * brand team:
 *  1. the colour "M" arc draws in (stroke-dashoffset) then gently pulses,
 *  2. CELLULIFT appears letter by letter (fade + rise), rainbow gradient,
 *  3. the ECG heartbeat line traces under it,
 *  4. "METAMORPHOSIS TECHNOLOGY" fades in,
 *  5. fine luminous particles drift around the mark.
 *
 * Every value is derived from useCurrentFrame() — deterministic, no
 * Math.random(), no wall-clock time.
 *
 * Fonts: load Cormorant Garamond, Raleway & Space Mono via
 * @remotion/google-fonts for exact renders; family names are referenced below.
 */

const C = {
  bg: "#F5F2EC",
  ink: "#1A1814",
  muted: "#8A8680",
};
const FONT = {
  serif: "'Cormorant Garamond', Garamond, 'Times New Roman', serif",
  mono: "'Space Mono', 'Courier New', monospace",
};
const GRAD = "linear-gradient(90deg, #00BCD4, #7B61FF, #E91E8C, #FF5722, #FFC107)";
const RAINBOW = ["#00BCD4", "#7B61FF", "#E91E8C", "#FF5722", "#FFC107"];

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
        // slow upward drift, wrap around
        let y = (baseY - frame * speed) % height;
        if (y < 0) y += height;
        const x = baseX + Math.sin(frame / 40 + i) * 14;
        const twinkle = interpolate(
          Math.sin(frame / 18 + i * 1.7),
          [-1, 1],
          [0.05, 0.32]
        );
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

  // 1. Arc draw-in
  const arcDraw = interpolate(frame, [0, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arcOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  // Arc pulsation begins once it is drawn — subtle scale + shimmer.
  const pulseStart = 42;
  const pulse = frame > pulseStart ? Math.sin((frame - pulseStart) / 14) : 0;
  const arcScale = 1 + pulse * 0.018;
  const arcShimmer = 0.9 + pulse * 0.08;

  // 2. Wordmark, letter by letter
  const letters = "CELLULIFT".split("");
  const wordStart = 12;
  const perLetter = 3;

  // 3. ECG trace
  const ecgDraw = interpolate(frame, [30, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ecgPath =
    "M0,40 L120,40 L150,40 L165,26 L180,40 L300,40 L330,40 L345,8 L360,72 L375,30 L390,40 L520,40 L660,40";
  const ecgTotal = 900;

  // 4. Tagline fade-in
  const tagOp = interpolate(frame, [58, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [58, 78], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bands = [
    { r: 300, w: 46, off: 0, op: 0.85 },
    { r: 250, w: 30, off: 0.15, op: 0.67 },
    { r: 355, w: 26, off: 0.3, op: 0.49 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Particles />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* 1. Colour "M" arc */}
        <div
          style={{
            position: "absolute",
            top: 150,
            opacity: arcOp * arcShimmer,
            transform: `scale(${arcScale})`,
          }}
        >
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

        {/* 2. CELLULIFT — letter by letter, continuous rainbow gradient */}
        <div
          style={{
            marginTop: 120,
            display: "flex",
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
          {letters.map((ch, i) => {
            const enter = spring({
              frame: frame - (wordStart + i * perLetter),
              fps,
              config: { damping: 200 },
            });
            const y = interpolate(enter, [0, 1], [24, 0]);
            const op = interpolate(enter, [0, 1], [0, 1]);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: op,
                  transform: `translateY(${y}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* 3. ECG heartbeat */}
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

        {/* 4. Tagline */}
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
          Metamorphosis Technology
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
