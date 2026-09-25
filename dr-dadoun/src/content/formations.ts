// Contenu de la page /formations (audience : médecins uniquement).
// Règle : n'ajouter ici que des informations vérifiées. Rien n'est inventé.
import { about } from "@/content/site";

export type Course = {
  slug: string; // sert d'adresse : /formations/<slug>
  title: string;
  summary: string;
  // Détails optionnels, à renseigner lorsqu'ils seront disponibles.
  objectives?: string[];
  audience?: string;
  duration?: string;
  media?: { video: string; image?: string; label: string }; // vidéo de la formation (public/videos/)
};

export type Session = {
  id?: string; // identifiant de l'événement (colonne « id » du Google Sheet) : active l'inscription en ligne
  capacity?: number; // nombre de places
  registered?: number; // inscrits (calculé depuis l'onglet « Inscriptions »)
  course?: string; // slug de la formation concernée (vide pour un autre événement)
  title?: string; // titre libre (congrès, masterclass…) ; sinon, le nom de la formation
  start?: string; // AAAA-MM-JJ : sert à trier et à masquer les dates passées
  date: string; // ex. "12 – 13 mars 2027"
  place: string; // ex. "Casablanca"
  format: string; // modalités, ex. "2 jours · théorie + pratique · 8 participants max."
  status?: "open" | "full";
  link?: string; // lien d'inscription externe (formulaire, billetterie…) : prioritaire sur l'inscription du site
};

export type CareerStep = {
  period?: string; // ex. "1990" ou "2015 – aujourd'hui"
  title: string;
  detail?: string;
};

// Menu de l'espace médecins (pages /formations).
export const navPro = [
  { href: "/formations#transmission", label: "Transmission" },
  { href: "/formations#formations", label: "Formations" },
  { href: "/formations#parcours", label: "Parcours" },
  { href: "/formations#sessions", label: "Sessions" },
];
export const proCta = { href: "/formations?demande=programme#demande", label: "Demander le programme" };

export const formationsPage = {
  hero: {
    eyebrow: "Dr Dadoun · Médecin esthétique · Lasériste · Formateur",
    title: ["Apprendre", "à mes", "côtés"],
    facts: [
      { value: "35+", label: "ans d'expérience" },
      { value: "10+", label: "ans de formation" },
    ],
    text: "Je transmets ce que je pratique : une approche fondée sur l'indication, la maîtrise technique et la sécurité du patient.",
    audience: "Réservé aux médecins",
  },

  transmission: {
    title: ["L'expérience", "au service de la transmission"],
    intro:
      "Plus de trente-cinq ans de pratique, plus de dix ans d'enseignement. Je transmets une méthode : comprendre avant d'agir, poser la bonne indication, maîtriser son geste.",
    principles: [
      { title: "Indication", text: "Savoir quand agir, comment — et quand s'abstenir." },
      { title: "Maîtrise technique", text: "Des protocoles précis, reproductibles, adaptés à chaque patient." },
      { title: "Précision", text: "Des gestes et des dosages justes, au millimètre." },
      { title: "Sécurité", text: "Prévenir, reconnaître et prendre en charge les complications." },
    ],
    media: {
      image: "formation-transmission.jpg",
      video: "formation-transmission.mp4",
      label: "Le Dr Dadoun en formation, devant un groupe de médecins",
    },
  },

  // Pour ajouter une formation : ajouter un objet ici. La carte et sa page
  // /formations/<slug> sont créées automatiquement.
  courses: [
    {
      slug: "injectables",
      title: "Injectables",
      summary: "Indications, techniques, dosages, précision et prévention des complications.",
    },
    {
      slug: "lasers-medicaux",
      title: "Lasers médicaux",
      summary: "Choix des paramètres, indications, protocoles et sécurité.",
      media: { video: "formation-laser-co2.mp4", image: "formation-laser-co2.jpg", label: "Formation laser CO₂ fractionné" },
    },
    {
      slug: "endolifting",
      title: "Endolifting",
      summary: "Approche, indications, paramètres et maîtrise de la technique.",
    },
  ] as Course[],

  practice: {
    title: ["Une formation", "axée sur la pratique"],
    text: "L'enseignement théorique est toujours relié au geste. Chaque participant pratique, sous supervision, avant de repartir.",
    points: [
      "Petits groupes",
      "Pratique encadrée",
      "Indication et sécurité au cœur de l'enseignement",
      "Suivi après la formation",
    ],
    // Deux vidéos côte à côte (format vertical).
    media: [
      { video: "formation-pratique.mp4", image: "formation-pratique.jpg", label: "Pratique encadrée sur patient" },
      { video: "formation-pratique-2.mp4", image: "formation-pratique-2.jpg", label: "Démonstration du geste" },
      { video: "formation-laser-co2.mp4", image: "formation-laser-co2.jpg", label: "Cours : laser CO₂ fractionné" },
    ],
  },

  career: {
    title: ["Mon", "parcours"],
    // Informations certaines uniquement.
    facts: [
      { value: "35+", label: "ans d'expérience" },
      { value: "10+", label: "ans de formation" },
      { value: "Médecin", label: "esthétique" },
      { value: "Lasériste", label: "lasers médicaux" },
    ],
    // Parcours partagé avec l'accueil : à compléter dans site.ts (about.education).
    steps: about.education.map((e) => ({ period: e.period, title: e.title, detail: e.place })) as CareerStep[],
    media: { image: "docteur.jpg", label: "Portrait" },
  },

  sessions: {
    title: "Prochaines formations",
    // Les événements se gèrent dans un Google Sheet publié en CSV (voir README) :
    // coller ici son lien de publication, ou le définir dans la variable FORMATIONS_SHEET_CSV.
    sheetCsv: "",
    // Liste de secours, utilisée si aucun Google Sheet n'est configuré.
    list: [
      {
        start: "2026-10-03",
        date: "3 octobre 2026",
        title: "Biofiller vs Acide hyaluronique : volumisation ou régénération tissulaire ?",
        place: "", // À COMPLÉTER : lieu
        format: "", // À COMPLÉTER : durée, format, nombre de places
        link: "https://cal.com/biofiller-vs-acide-hyaluronique-volumisation-ou-regeneration-tissulaire", // Cal.com (partagé avec Cellulift Academy)
      },
    ] as Session[],
    empty: "Les prochaines dates seront annoncées prochainement.",
  },

  final: {
    title: ["Vous souhaitez vous former", "à mes côtés ?"],
    text: "Recevez le programme détaillé d'une formation ou inscrivez-vous à une session.",
  },

  // Newsletter Cellulift Academy : pour rester informé des prochaines sessions.
  newsletter: {
    name: "Cellulift Academy",
    title: "Restez informé des prochaines sessions",
    text: "Inscrivez-vous à la newsletter Cellulift Academy : vous recevrez en priorité les dates, les lieux et les nouvelles formations.",
    consent:
      "J'accepte de recevoir la newsletter de Cellulift Academy. Je peux me désinscrire à tout moment via le lien présent dans chaque e-mail.",
  },

  // Formulaire de demande (médecins) — envoyé au cabinet par e-mail.
  request: {
    title: ["Vous souhaitez vous former", "à mes côtés ?"],
    text: "Choisissez la ou les formations qui vous intéressent : le cabinet vous répond avec le programme et les prochaines dates.",
    kinds: [
      { id: "programme", label: "Recevoir le programme" },
      { id: "inscription", label: "M'inscrire à une session" },
    ],
    professions: [
      "Médecin esthétique",
      "Dermatologue",
      "Dentiste",
      "Gynécologue",
      "Médecin généraliste",
      "Autre spécialité médicale",
    ],
  },

  mail: {
    program: "Formations — demande de programme",
    sessions: "Formations — être informé des prochaines sessions",
  },
};

export const getCourse = (slug: string) => formationsPage.courses.find((c) => c.slug === slug);
