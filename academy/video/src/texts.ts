/**
 * Tous les textes de la vidéo. Modifiez-les ici puis relancez le rendu.
 * Les médecins affichés sont des personnes fictives ; les présentateurs et
 * les machines sont réels (voir academy/CLAUDE.md).
 */
export const T = {
  logoTag: "Academy",

  hook: {
    line1: ["Votre machine", "est installée."],
    line2: ["Votre formation", "commence."],
    /** Mot affiché en dégradé irisé dans la 2e phrase. */
    iri: "formation",
  },

  doctor: {
    name: "Dr Salma Benali",
    initials: "SB",
    email: "s.benali@exemple.ma",
  },

  machine: {
    name: "HANOVER 5G",
    family: "Lasers",
    detail: "N° de série HN5-0412 · installée le 14 oct. 2026",
    photo: "img/hanover-5g.jpg",
  },

  program: {
    title: "HANOVER 5G — Programme opérateur",
    summary: "De la physique au protocole : des traitements sûrs et reproductibles.",
    lessons: [
      { module: "Module 1 · Prise en main", title: "Bienvenue et déroulé du parcours", duration: "6 min 30" },
      { module: "Module 1 · Prise en main", title: "Sécurité et préparation de la salle", duration: "8 min" },
      { module: "Module 2 · Protocoles", title: "Protocole et paramètres par phototype", duration: "11 min" },
    ],
    documents: ["Fiche protocole HANOVER 5G", "Check-list sécurité de la salle"],
  },

  presenter: {
    name: "Dr Mohamed Dadoun",
    initials: "MD",
    title: "Médecin esthétique & lasériste · Casablanca",
  },

  captions: {
    invite: { step: "01 · Invitation", title: ["Une invitation", "dès l'installation"], iri: "invitation" },
    dashboard: { step: "02 · Mes machines", title: ["Chaque machine,", "son parcours"], iri: "parcours" },
    lesson: { step: "03 · Vidéos", title: ["Des leçons", "dans l'ordre"], iri: "l'ordre" },
    progress: { step: "04 · Protocoles", title: ["PDF et", "progression"], iri: "progression" },
    admin: { step: "05 · Équipe CELLULIFT", title: ["Chaque médecin", "accompagné"], iri: "accompagné" },
  },

  admin: {
    eyebrow: "Cellulift · suivi des formations",
    kpis: [
      { label: "Médecins", value: "18" },
      { label: "Formations terminées", value: "11" },
      { label: "En cours", value: "5" },
      { label: "Non commencées", value: "2" },
    ],
    rows: [
      { name: "Dr Karim Alaoui", email: "k.alaoui@exemple.ma", machine: "DERMABRASIF 6G", program: "DERMABRASIF 6G — Programme opérateur", pct: 50, done: "2 / 4", status: "En cours", cls: "" },
      { name: "Dr Salma Benali", email: "s.benali@exemple.ma", machine: "HANOVER 5G", program: "HANOVER 5G — Programme opérateur", pct: 100, done: "3 / 3", status: "Terminée", cls: "ok", highlight: true },
      { name: "Dr Nadia Tazi", email: "n.tazi@exemple.ma", machine: "SLIMAX LIPO 7", program: "SLIMAX LIPO 7 — Programme opérateur", pct: 0, done: "0 / 3", status: "Invitation en attente", cls: "warn" },
    ],
  },

  signature: {
    brand: "CELLULIFT Academy",
    line1: "La technologie s'acquiert.",
    line2: "La maîtrise se construit.",
    iri: "maîtrise",
    url: "academy.cellulift.ma",
  },
} as const;

/**
 * Musique : par défaut, la nappe synthétisée public/audio/music.wav (scripts/make-audio.py).
 * Pour la remplacer par une musique libre de droits fournie par CELLULIFT, déposez le fichier
 * dans public/audio/ et indiquez son nom ici (ex. "audio/musique.mp3"). Idéalement 120 BPM :
 * les changements de plan tombent alors sur les temps.
 */
export const MUSIC_FILE: string | null = null;
