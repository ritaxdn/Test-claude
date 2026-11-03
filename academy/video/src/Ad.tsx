import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { css } from "./styles";
import { MUSIC_FILE } from "./texts";
import { PearlBg, Wipe } from "./ui";
import { SceneAdmin, SceneDashboard, SceneHook, SceneInvite, SceneLesson, SceneLogo, SceneProgress, SceneSignature } from "./scenes";

export const FPS = 30;

/** Découpage en plans (secondes). Les plans se chevauchent de 0,1 s pour les fondus. */
export const PLANS = [
  { name: "Logo", from: 0, to: 2.6, C: SceneLogo },
  { name: "Accroche", from: 2.5, to: 5.2, C: SceneHook },
  { name: "Invitation", from: 5, to: 9.6, C: SceneInvite },
  { name: "Tableau de bord", from: 9.5, to: 13.6, C: SceneDashboard },
  { name: "Leçon", from: 13.5, to: 18.6, C: SceneLesson },
  { name: "PDF + progression", from: 18.5, to: 22.6, C: SceneProgress },
  { name: "Suivi CELLULIFT", from: 22.5, to: 26.6, C: SceneAdmin },
  { name: "Signature", from: 26.5, to: 30, C: SceneSignature },
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
    {/* Motion graphic de transition à chaque changement de plan */}
    {PLANS.slice(1).map(({ name, from }) => (
      <Sequence key={`wipe-${name}`} name={`Transition → ${name}`} from={Math.round(from * FPS) - 7} durationInFrames={16}>
        <Wipe />
      </Sequence>
    ))}
    {/* Son : musique (générée, ou fichier fourni par CELLULIFT) + bruitages calés sur l'image */}
    <Audio src={staticFile(MUSIC_FILE ?? "audio/music.wav")} volume={0.5} />
    <Audio src={staticFile("audio/sfx.wav")} volume={1} />
  </AbsoluteFill>
);
