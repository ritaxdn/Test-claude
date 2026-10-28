import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * The Cellulift logo, writing itself in — premium, cinematic pacing.
 *
 * Still never touches a pixel of `cellulift-logo.png`. Each region (arc,
 * ECG, wordmark, tagline) is a CSS mask-image "window" onto the SAME
 * untouched image. Unlike a hard clip-path edge, a mask-image gradient can
 * be FEATHERED — a soft, ink-like edge instead of a sharp cut, which reads
 * as "being painted in" rather than "being revealed by a blind". A bright
 * glint travels along that soft edge, like a pen of light tracing the mark.
 *
 * Sequence: the arc writes in, colour band by colour band, left to right
 * -> the ECG heartbeat traces right after -> CELLULIFT writes itself in,
 * stroke by stroke -> the tagline settles in -> then a slow, barely-there
 * breathing pulsation keeps the assembled mark alive.
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

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const GLINT = "radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(255,214,130,0.55) 38%, transparent 72%)";

const InkWindow: React.FC<{
  box: { l: number; t: number; w: number; h: number };
  logoW: number;
  logoH: number;
  progress: number; // 0..1, already eased
  angleDeg?: number;
  featherFrac?: number; // feather width as a fraction of the region's own width
  glint?: boolean;
}> = ({ box, logoW, logoH, progress, angleDeg = 90, featherFrac = 0.16, glint = true }) => {
  const left = box.l * logoW;
  const top = box.t * logoH;
  const width = box.w * logoW;
  const height = box.h * logoH;

  const feather = Math.max(18, width * featherFrac);
  const edgeX = -feather + progress * (width + feather);
  const maskGradient = `linear-gradient(${angleDeg}deg, rgba(0,0,0,1) 0px, rgba(0,0,0,1) ${edgeX}px, rgba(0,0,0,0) ${edgeX + feather}px, rgba(0,0,0,0) 100%)`;

  const edgeOpacity = progress <= 0.02 || progress >= 0.98 ? 0 : interpolate(progress, [0, 0.08, 0.92, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
      }}
    >
      <Img src={LOGO} style={{ position: "absolute", left: -left, top: -top, width: logoW, height: logoH }} />
      {glint && (
        <div
          style={{
            position: "absolute",
            left: edgeX + feather / 2 - height * 0.55,
            top: -height * 0.25,
            width: height * 1.1,
            height: height * 1.5,
            background: GLINT,
            opacity: edgeOpacity,
            filter: "blur(6px)",
            mixBlendMode: "plus-lighter",
          }}
        />
      )}
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
  const eased = (start: number, end: number, ease: (t: number) => number = easeInOutCubic) =>
    ease(interpolate(frame, [start, end], [0, 1], clamp));

  const arcP = eased(0, 58);
  const ecgP = eased(50, 74);
  const wordP = eased(70, 114, easeOutCubic);
  const tagP = eased(110, 132);

  const introOpacity = interpolate(frame, [0, 8], [0, 1], clamp);
  // A slow, barely-there dolly-in while the mark writes itself.
  const dolly = interpolate(frame, [0, 90], [1.045, 1], clamp);

  const pulseStart = 150;
  const pulse = frame > pulseStart ? Math.sin((frame - pulseStart) / 15) : 0;
  const breathe = 1 + pulse * 0.016;
  const glowBase = interpolate(frame, [0, 24, 110, 150], [0, 0.22, 0.14, 0.14], clamp);
  const glow = glowBase + pulse * 0.05;

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
      <div
        style={{
          position: "relative",
          width: logoW,
          height: logoH,
          opacity: introOpacity,
          transform: `scale(${breathe * dolly})`,
        }}
      >
        <InkWindow box={BOX.arc} logoW={logoW} logoH={logoH} progress={arcP} angleDeg={97} featherFrac={0.17} />
        <InkWindow box={BOX.ecg} logoW={logoW} logoH={logoH} progress={ecgP} angleDeg={92} featherFrac={0.28} />
        <InkWindow box={BOX.word} logoW={logoW} logoH={logoH} progress={wordP} angleDeg={90} featherFrac={0.09} />
        <InkWindow box={BOX.tag} logoW={logoW} logoH={logoH} progress={tagP} angleDeg={90} featherFrac={0.12} glint={false} />
      </div>
    </AbsoluteFill>
  );
};
