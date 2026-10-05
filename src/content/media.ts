// Cellulift en vidéo : salons et reportages (vidéos YouTube, lues uniquement au clic).
export type MediaVideo = {
  id: string;
  vertical?: boolean;
  title: { fr: string; en: string };
  source: string;
};

export const mediaVideos: MediaVideo[] = [
  {
    id: "y5FTeORzn2Q",
    title: { fr: "Cellulift au Morocco Medical Expo 2025", en: "Cellulift at Morocco Medical Expo 2025" },
    source: "LODJ",
  },
  {
    id: "ttoN8SRPdcA",
    title: { fr: "Cellulift au salon Cosmetista, Casablanca", en: "Cellulift at Cosmetista, Casablanca" },
    source: "Cosmetista Expo",
  },
  {
    id: "V91s4U29gKs",
    vertical: true,
    title: { fr: "Cosmetista Expo 2022", en: "Cosmetista Expo 2022" },
    source: "Cosmetista Expo",
  },
];

export const mediaContent = {
  fr: {
    eyebrow: "Cellulift en vidéo",
    title: "Sur le terrain, aux côtés des professionnels.",
    intro: "Salons, démonstrations, rencontres : retrouvez Cellulift sur les grands rendez-vous de la médecine esthétique.",
    play: "Lire la vidéo",
  },
  en: {
    eyebrow: "Cellulift on video",
    title: "On the ground, alongside professionals.",
    intro: "Trade shows, demonstrations, meetings: see Cellulift at the major aesthetic medicine events.",
    play: "Play video",
  },
} as const;
