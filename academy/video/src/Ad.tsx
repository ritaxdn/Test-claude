import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { css } from "./styles";
import { MUSIC_FILE } from "./texts";
import { PearlBg } from "./ui";
import { SceneAdmin, SceneDashboard, SceneHook, SceneLesson, SceneLogo, SceneProgress, SceneSignature } from "./scenes";

export const FPS = 30;

/** Découpage en plans (secondes). Les plans se chevauchent de 0,2 s pour les fondus. */
export const PLANS = [
  { name: "Logo", from: 0, to: 3.2, C: SceneLogo },
  { name: "Accroche", from: 3, to: 7.2, C: SceneHook },
  { name: "Invitation + tableau de bord", from: 7, to: 12.2, C: SceneDashboard },
  { name: "Leçon", from: 12, to: 18.2, C: SceneLesson },
  { name: "PDF + progression", from: 18, to: 22.2, C: SceneProgress },
  { name: "Suivi CELLULIFT", from: 22, to: 26.2, C: SceneAdmin },
  { name: "Signature", from: 26, to: 30, C: SceneSignature },
] as const;

export const DURATION = 30 * FPS;

export const Ad: React.FC = () => (
  <AbsoluteFill className="root">
    <style>{css}</style>
    <PearlBg />
    {PLANS.map(({ name, from, to, C }) => (
      <Sequence key={name} name={name} from={Math.round(from * FPS)} durationInFrames={Math.round((to - from) * FPS)}>
        <C />
      </Sequence>
    ))}
    {MUSIC_FILE && <Audio src={staticFile(MUSIC_FILE)} />}
  </AbsoluteFill>
);
