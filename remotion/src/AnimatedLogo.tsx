import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * The Cellulift logo, revealed progressively — WITHOUT touching a single
 * pixel of the source file. `cellulift-logo.png` is one flattened, unchanged
 * image; each region below is a "window" (overflow:hidden + clip-path) onto
 * that same image, offset so it lines up, then wiped open left-to-right.
 * Since the artwork's colour bands run left-to-right (cyan -> magenta ->
 * orange -> yellow) and the wordmark reads left-to-right, a straight wipe
 * reads as "draws in colour by colour" / "letters appear one by one" with
 * zero risk of ever distorting the real logo.
 *
 * Sequence: the arc draws in -> the ECG heartbeat traces right after ->
 * the CELLULIFT letters pop in one by one (stepped reveal) -> the tagline
 * fades in -> then a slow, uniform pulsation keeps the mark alive.
 */

const LOGO = staticFile("cellulift-logo.png");
const NATIVE_W = 469;
const NATIVE_H = 271;

// Bounding boxes measured directly from the PNG's alpha channel (fractions
// of the 469x271 native size), so the reveal windows land exactly on the
// real artwork at any render size.
const BOX = {
  arc: { l: 0, t: 0, w: 1, h: 0.7233 },
  word: { l: 0, t: 0.7011, w: 0.6311, h: 0.1845 },
  ecg: { l: 0.6183, t: 0.6827, w: 0.3817, h: 0.203 },
  tag: { l: 0, t: 0.871, w: 1, h: 0.1292 },
};

const LETTER_COUNT = 9; // C-E-L-L-U-L-I-F-T

const RevealWindow: React.FC<{
  box: { l: number; t: number; w: number; h: number };
  logoW: number;
  logoH: number;
  progress: number;
  steps?: number;
}> = ({ box, logoW, logoH, progress, steps }) => {
  const p = steps ? Math.floor(progress * steps) / steps : progress;
  const left = box.l * logoW;
  const top = box.t * logoH;
  const width = box.w * logoW;
  const height = box.h * logoH;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        overflow: "hidden",
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      }}
    >
      <Img src={LOGO} style={{ position: "absolute", left: -left, top: -top, width: logoW, height: logoH }} />
    </div>
  );
};

export const AnimatedLogo: React.FC<{ width?: number }> = ({ width }) => {
  const frame = useCurrentFrame();
  const { width: vw, height: vh } = useVideoConfig();
  const isPortrait = vh > vw;
  const logoW = width ?? (isPortrait ? Math.round(vw * 0.86) : 900);
  const logoH = logoW * (NATIVE_H / NATIVE_W);

  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const arcP = interpolate(frame, [0, 30], [0, 1], clamp);
  const ecgP = interpolate(frame, [26, 42], [0, 1], clamp);
  const wordP = interpolate(frame, [40, 62], [0, 1], clamp);
  const tagP = interpolate(frame, [60, 76], [0, 1], clamp);
  const introOpacity = interpolate(frame, [0, 6], [0, 1], clamp);

  const pulseStart = 82;
  const pulse = frame > pulseStart ? Math.sin((frame - pulseStart) / 13) : 0;
  const breathe = 1 + pulse * 0.02;
  const glow = 0.14 + pulse * 0.07;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          width: logoW * 1.33,
          height: logoW * 0.86,
          borderRadius: "50%",
          opacity: introOpacity,
          background: `radial-gradient(closest-side, rgba(123,97,255,${glow}), rgba(233,30,140,${glow * 0.6}) 45%, transparent 72%)`,
          filter: "blur(20px)",
        }}
      />
      <div style={{ position: "relative", width: logoW, height: logoH, opacity: introOpacity, transform: `scale(${breathe})` }}>
        <RevealWindow box={BOX.arc} logoW={logoW} logoH={logoH} progress={arcP} />
        <RevealWindow box={BOX.ecg} logoW={logoW} logoH={logoH} progress={ecgP} />
        <RevealWindow box={BOX.word} logoW={logoW} logoH={logoH} progress={wordP} steps={LETTER_COUNT} />
        <RevealWindow box={BOX.tag} logoW={logoW} logoH={logoH} progress={tagP} />
      </div>
    </AbsoluteFill>
  );
};
