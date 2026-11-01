// Tous les textes de la vidéo. Modifiez ici, puis relancez le rendu (voir README).
// Médecins et clients : personnes fictives. Présentateur : réel, titre connu (cellulift.ma).

export const MUSIC_FILE: string | null = null; // ex. "musique.mp3" placé dans public/ (musique libre de droits fournie par Cellulift)

export const T = {
  logoTag: "Academy",
  hook: { line1: "Votre machine est installée.", before: "Votre ", iri: "formation", after: " commence." },

  steps: {
    invitation: "01 — Invitation",
    dashboard: "02 — Vos machines, vos parcours",
    lesson: "03 — Des vidéos, dans l'ordre",
    progress: "04 — Protocoles et progression",
    admin: "05 — CELLULIFT suit chaque médecin",
  },

  doctor: { name: "Dr Salma Benali", email: "s.benali@exemple.ma", initials: "SB" },

  machine: { family: "Lasers", name: "HANOVER 5G", meta: "N° de série HN5G-0427 · Cabinet Benali, Rabat · installée le 14 oct. 2026" },

  program: {
    title: "HANOVER 5G — Programme opérateur",
    summary: "De la physique au protocole : des traitements sûrs et reproductibles avec la plateforme HANOVER 5G.",
  },

  presenter: { name: "Dr Mohamed Dadoun", title: "Médecin esthétique & lasériste · Casablanca", initials: "MD" },

  modules: [
    { pos: 1, title: "Prise en main" },
    { pos: 2, title: "Protocoles" },
  ],
  lessons: [
    { module: 1, seq: 1, title: "Bienvenue et déroulé du parcours", dur: "6 min" },
    { module: 1, seq: 2, title: "Sécurité et préparation de la salle", dur: "9 min" },
    { module: 2, seq: 3, title: "Protocole et paramètres par phototype", dur: "12 min" },
  ],
  currentLesson: 2,

  docs: ["Fiche protocole HANOVER 5G", "Consignes de sécurité laser"],
  done: "Formation terminée",
  doneNote: "Bravo, vous avez terminé le parcours. CELLULIFT en est informé et vous proposera la suite.",

  admin: {
    eyebrow: "Cellulift · suivi des formations",
    title: "Médecins",
    kpis: [
      { label: "Médecins", value: "24", hint: "" },
      { label: "Formations terminées", value: "9", hint: "41 % des parcours assignés" },
      { label: "En cours", value: "8", hint: "" },
      { label: "Non commencées", value: "5", hint: "dont 2 invitations en attente" },
    ],
    rows: [
      { name: "Dr Youssef Alaoui", email: "y.alaoui@exemple.ma", machine: "DERMABRASIF 6G", program: "DERMABRASIF 6G — Programme opérateur", done: 2, total: 4, status: "En cours", tone: "plain", last: "28 oct. 2026" },
      { name: "Dr Salma Benali", email: "s.benali@exemple.ma", machine: "HANOVER 5G", program: "HANOVER 5G — Programme opérateur", done: 3, total: 3, status: "Terminée", tone: "ok", last: "31 oct. 2026", highlight: true },
      { name: "Dr Karim Idrissi", email: "k.idrissi@exemple.ma", machine: "SEVENWAVES", program: "SEVENWAVES — Programme opérateur", done: 1, total: 5, status: "En cours", tone: "plain", last: "26 oct. 2026" },
      { name: "Dr Nadia Tazi", email: "n.tazi@exemple.ma", machine: "HANOVER 5G", program: "HANOVER 5G — Programme opérateur", done: 0, total: 3, status: "Non commencée", tone: "warn", last: "22 oct. 2026" },
      { name: "Dr Leila Berrada", email: "l.berrada@exemple.ma", machine: "LA QUEEN", program: "LA QUEEN — Programme opérateur", done: 0, total: 4, status: "Invitation en attente", tone: "warn", last: "—" },
    ],
  },

  signature: { line1: "La technologie s'acquiert.", iri: "La maîtrise", after: " se construit.", url: "academy.cellulift.ma" },
};
