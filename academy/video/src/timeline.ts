// Découpage du film (30 i/s, 900 images = 30 s). Les plans se chevauchent de quelques images pour les fondus.
export const FPS = 30;
export const DURATION = 900;

export const SCENES = {
  logo: { from: 0, dur: 100 }, //        0–3 s   logo + tracé ECG
  hook: { from: 92, dur: 123 }, //       3–7 s   accroche
  invitation: { from: 205, dur: 80 }, // 7–9 s   invitation
  dashboard: { from: 275, dur: 93 }, //  9–12 s  tableau de bord
  lesson: { from: 358, dur: 190 }, //    12–18 s page leçon
  progress: { from: 538, dur: 130 }, //  18–22 s documents + progression
  admin: { from: 658, dur: 130 }, //     22–26 s vue admin
  signature: { from: 778, dur: 122 }, // 26–30 s signature
} as const;
