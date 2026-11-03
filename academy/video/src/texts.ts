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
    done: { step: "05 · Accompagnement", title: ["Formé", "et accompagné"], iri: "accompagné" },
  },

  /** Message affiché par l'app quand le médecin termine son parcours (texte réel de l'app). */
  done: {
    alert: "Bravo, vous avez terminé le parcours « HANOVER 5G — Programme opérateur ». CELLULIFT en est informé et vous proposera la suite (atelier pratique, suivi).",
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
