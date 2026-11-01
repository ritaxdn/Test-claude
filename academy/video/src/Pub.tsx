import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Sequence, staticFile } from "remotion";
import "./styles.css";
import { MUSIC_FILE } from "./content";
import { SCENES } from "./timeline";
import { FormatCtx, Pearl, type Format } from "./ui/kit";
import { HookScene, LogoScene } from "./scenes/Intro";
import { DashboardScene, InvitationScene } from "./scenes/Onboarding";
import { LessonScene } from "./scenes/Lesson";
import { AdminScene, ProgressScene, SignatureScene } from "./scenes/Outcome";

/** Attend que les polices locales soient prêtes avant de rendre la moindre image. */
function useFonts() {
  const [handle] = useState(() => delayRender("Chargement des polices"));
  useEffect(() => {
    const faces = [
      '500 40px "Archivo Variable"', '400 20px "Instrument Sans"', '500 20px "Instrument Sans"', '600 20px "Instrument Sans"',
      '400 12px "JetBrains Mono"', '500 12px "JetBrains Mono"', '400 40px "Cormorant Garamond"',
    ];
    Promise.all(faces.map((f) => document.fonts.load(f, "AÉéçà%·—")))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
}

export function Pub({ vertical }: { vertical: boolean }) {
  useFonts();
  const fmt: Format = vertical ? { v: true, u: 1.75, W: 1080, H: 1920 } : { v: false, u: 1.45, W: 1920, H: 1080 };
  const S = SCENES;
  return (
    <FormatCtx.Provider value={fmt}>
      <AbsoluteFill style={{ background: "#eceef3", overflow: "hidden" }}>
        <Pearl />
        <Sequence from={S.logo.from} durationInFrames={S.logo.dur} name="1 · Logo"><LogoScene dur={S.logo.dur} /></Sequence>
        <Sequence from={S.hook.from} durationInFrames={S.hook.dur} name="2 · Accroche"><HookScene dur={S.hook.dur} /></Sequence>
        <Sequence from={S.invitation.from} durationInFrames={S.invitation.dur} name="3a · Invitation"><InvitationScene dur={S.invitation.dur} /></Sequence>
        <Sequence from={S.dashboard.from} durationInFrames={S.dashboard.dur} name="3b · Tableau de bord"><DashboardScene dur={S.dashboard.dur} /></Sequence>
        <Sequence from={S.lesson.from} durationInFrames={S.lesson.dur} name="4 · Leçon"><LessonScene dur={S.lesson.dur} /></Sequence>
        <Sequence from={S.progress.from} durationInFrames={S.progress.dur} name="5 · Documents et progression"><ProgressScene dur={S.progress.dur} /></Sequence>
        <Sequence from={S.admin.from} durationInFrames={S.admin.dur} name="6 · Admin"><AdminScene dur={S.admin.dur} /></Sequence>
        <Sequence from={S.signature.from} durationInFrames={S.signature.dur} name="7 · Signature"><SignatureScene dur={S.signature.dur} /></Sequence>
        {MUSIC_FILE && <Audio src={staticFile(MUSIC_FILE)} />}
      </AbsoluteFill>
    </FormatCtx.Provider>
  );
}
