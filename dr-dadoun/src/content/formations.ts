// Contenu de la page /formations (audience : médecins et professionnels de santé habilités).
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
};

export type Session = {
  course: string; // slug de la formation concernée
  date: string; // ex. "12 – 13 mars 2027"
  place: string; // ex. "Casablanca"
  format: string; // modalités, ex. "2 jours · théorie + pratique · 8 participants max."
  status?: "open" | "full";
};

export type CareerStep = {
  period?: string; // ex. "1990" ou "2015 – aujourd'hui"
  title: string;
  detail?: string;
};

export const formationsPage = {
  hero: {
    eyebrow: "Médecin esthétique · Lasériste · Formateur",
    title: ["Apprendre", "auprès du Dr", "Dadoun"],
    facts: [
      { value: "35+", label: "ans d'expérience" },
      { value: "10+", label: "ans de formation" },
    ],
    text: "Le Dr Dadoun transmet ce qu'il pratique : une approche fondée sur l'anatomie, la maîtrise technique et la sécurité du patient.",
    audience: "Réservé aux médecins et professionnels de santé habilités",
  },

  transmission: {
    title: ["L'expérience", "au service de la transmission"],
    intro:
      "Plus de trente-cinq ans de pratique, plus de dix ans d'enseignement. Le Dr Dadoun transmet une méthode : comprendre avant d'agir, poser la bonne indication, maîtriser son geste.",
    principles: [
      { title: "Anatomie", text: "Le fondement de chaque geste : repères, plans, zones à risque." },
      { title: "Indication", text: "Savoir quand agir, comment — et quand s'abstenir." },
      { title: "Maîtrise technique", text: "Des protocoles précis, reproductibles, adaptés à chaque patient." },
      { title: "Sécurité", text: "Prévenir, reconnaître et prendre en charge les complications." },
    ],
    media: {
      image: "formation-transmission.jpg",
      video: "formation-transmission.mp4",
      label: "Le Dr Dadoun en formation",
    },
  },

  // Pour ajouter une formation : ajouter un objet ici. La carte et sa page
  // /formations/<slug> sont créées automatiquement.
  courses: [
    {
      slug: "anatomie-appliquee",
      title: "Anatomie appliquée",
      summary: "Fondamentaux anatomiques appliqués aux gestes de médecine esthétique.",
    },
    {
      slug: "injectables",
      title: "Injectables",
      summary: "Indications, techniques, dosages, précision et prévention des complications.",
    },
    {
      slug: "lasers-medicaux",
      title: "Lasers médicaux",
      summary: "Choix des paramètres, indications, protocoles et sécurité.",
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
      "Anatomie au cœur de l'enseignement",
      "Suivi après la formation",
    ],
    media: { image: "formation-pratique.jpg", label: "Pratique encadrée" },
  },

  career: {
    title: ["Le parcours", "du Dr Dadoun"],
    // Informations certaines uniquement.
    facts: [
      { value: "35+", label: "ans d'expérience" },
      { value: "10+", label: "ans de formation" },
      { value: "Médecin", label: "esthétique" },
      { value: "Lasériste", label: "lasers médicaux" },
    ],
    // Parcours partagé avec l'accueil : à compléter dans site.ts (about.education).
    steps: about.education.map((e) => ({ period: e.period, title: e.title, detail: e.place })) as CareerStep[],
    pendingNote: "Diplômes, formations et étapes du parcours : bientôt disponibles.",
    media: { image: "docteur.jpg", label: "Portrait du Dr Dadoun" },
  },

  sessions: {
    title: "Prochaines formations",
    // À COMPLÉTER : ajouter les sessions dès qu'elles sont programmées.
    list: [] as Session[],
    empty: "Les prochaines dates seront annoncées prochainement.",
  },

  final: {
    title: ["Vous souhaitez vous former", "auprès du Dr Dadoun ?"],
    text: "Recevez le programme détaillé des formations, ou soyez informé dès l'ouverture des prochaines sessions.",
  },

  // Formulaire de demande (professionnels) — envoyé au cabinet par e-mail.
  request: {
    title: ["Vous souhaitez vous former", "auprès du Dr Dadoun ?"],
    text: "Choisissez la ou les formations qui vous intéressent : le cabinet vous répond avec le programme et les prochaines dates.",
    kinds: [
      { id: "programme", label: "Recevoir le programme" },
      { id: "sessions", label: "Être informé des prochaines sessions" },
      { id: "inscription", label: "M'inscrire à une session" },
    ],
    professions: [
      "Médecin esthétique",
      "Dermatologue",
      "Chirurgien",
      "Gynécologue",
      "Médecin généraliste",
      "Autre professionnel de santé",
    ],
  },

  mail: {
    program: "Formations — demande de programme",
    sessions: "Formations — être informé des prochaines sessions",
  },
};

export const getCourse = (slug: string) => formationsPage.courses.find((c) => c.slug === slug);
