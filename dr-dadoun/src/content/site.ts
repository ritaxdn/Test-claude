// Toutes les informations du site sont centralisées ici.
// Les valeurs marquées « À COMPLÉTER » sont des exemples à remplacer
// avant la mise en ligne.

export const doctor = {
  name: "Dr Dadoun",
  fullName: "Docteur Dadoun", // À COMPLÉTER : prénom + nom
  title: "Médecin esthétique · Lasériste",
  // À COMPLÉTER : numéro d'inscription à l'Ordre National des Médecins (laisser vide tant qu'il n'est pas fourni)
  ordreNumber: "",
  ordre: "Inscrit à l'Ordre National des Médecins du Maroc",
};

export const practice = {
  addressLine1: "N°02 Rue Savoie, Quartier des Hôpitaux",
  addressLine2: "20250 Casablanca, Maroc",
  city: "Casablanca",
  phone: "05 22 49 01 09",
  phoneHref: "+212522490109",
  email: "contact@dr-dadoun.fr", // À COMPLÉTER
  bookingUrl: "/rendez-vous",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=N%C2%B002+Rue+Savoie+Quartier+des+H%C3%B4pitaux+Casablanca",
  // À COMPLÉTER : indications d'accès (parking, étage…)
  access: [] as string[],
  // Samedi après-midi : formations.
  hours: [
    { day: "Lundi – Vendredi", time: "13h30 – 19h30" },
    { day: "Samedi", time: "9h00 – 14h00" }, // À CONFIRMER : heure d'ouverture du samedi
    { day: "Dimanche", time: "Fermé" },
  ],
};

// Menu de l'espace patients.
export const nav = [
  { href: "/#docteur", label: "Le Docteur" },
  { href: "/#soins", label: "Soins" },
  { href: "/#rendez-vous", label: "Rendez-vous" },
  { href: "/#cabinet", label: "Cabinet" },
];

// Passerelles entre les deux espaces (patients / médecins), séparés.
export const spaces = {
  pro: { href: "/formations", label: "Espace médecins" },
  patients: { href: "/", label: "Espace patients" },
};

export const hero = {
  eyebrow: "Médecine esthétique · Casablanca",
  // Le titre est affiché en 3 lignes ; la vignette photo s'insère au début de la 2e.
  title: ["Améliorer", "sans", "dénaturer"],
  text: "Chaque visage a son anatomie, ses proportions, son identité. Je ne cherche pas à y appliquer un idéal standardisé : je corrige ce qui peut raisonnablement l'être, et je préserve tout le reste.",
  stats: [
    { value: "35+", label: "Années d'expérience" },
    { value: "2", label: "Domaines d'expertise" },
  ],
};

// La philosophie : « Améliorer sans dénaturer »
export const philosophy = {
  title: "Améliorer sans dénaturer",
  intro:
    "Je n'applique pas le même idéal esthétique à tous. Mon point de départ est toujours votre anatomie, vos proportions et ce qui vous convient réellement. Mon objectif : accompagner le vieillissement et corriger ce qui peut l'être, en préservant le naturel et l'identité de votre visage.",
  // Le contre-modèle : la méthode, étape par étape
  method: [
    { title: "Anatomie", text: "La base de tout geste : les repères osseux, les vaisseaux, les plans de la peau." },
    { title: "Indication", text: "Le bon acte, pour la bonne raison. Et parfois, aucun acte." },
    { title: "Précision", text: "Des doses justes et des points d'injection pensés au millimètre." },
    { title: "Naturel", text: "Un visage reposé qui reste le vôtre, jamais un visage « refait »." },
    { title: "Suivi", text: "Un contrôle après le soin, et je reste joignable si vous avez une question." },
  ],
};

// Les trois piliers de l'expertise
export const pillars = [
  {
    id: "science",
    label: "Science",
    title: "Anatomie & sécurité",
    text: "L'anatomie est la base. Comprendre les structures du visage, poser la bonne indication, prévenir les complications.",
  },
  {
    id: "technique",
    label: "Technique",
    title: "Lasers & injectables",
    text: "Deux domaines de maîtrise : les technologies laser et les injections, réalisées avec des protocoles précis.",
  },
  {
    id: "regard",
    label: "Regard esthétique",
    title: "Proportions & harmonie",
    text: "Un sens artistique au service du naturel : juger un résultat sur l'ensemble du visage, jamais sur une ride isolée.",
  },
];

export const about = {
  title: "Médecin, technicien, et un regard d'esthète",
  paragraphs: [
    // À COMPLÉTER : biographie réelle du Dr Dadoun
    "J'exerce la médecine esthétique à l'intersection de trois exigences : la rigueur médicale, la maîtrise technique et le regard esthétique. Pour moi, l'anatomie est le fondement de chaque geste.",
    "Je prends le temps d'observer les détails — asymétries, proportions, qualité de peau — avant de proposer quoi que ce soit. Et je reste présent après le soin : le suivi fait partie intégrante de ma pratique.",
  ],
  // Parcours & diplômes : écoles, diplômes, formations, étapes (du plus récent au plus ancien).
  // Utilisé sur l'accueil (section « Le Dr Dadoun ») et sur /formations.
  // À COMPLÉTER — ex. { period: "1989", title: "Doctorat en médecine", place: "Faculté de médecine de …" }
  education: [] as { period?: string; title: string; place?: string }[],
  quote: "Mon rôle n'est pas de transformer un visage, mais de l'améliorer sans le dénaturer.",
};

export type Treatment = {
  name: string;
  description: string;
  duration: string;
  downtime: string;
};

export type TreatmentCategory = {
  id: string;
  title: string;
  intro: string;
  treatments: Treatment[];
};

// À VALIDER par le Dr Dadoun : descriptions, durées et suites de chaque acte.
export const treatments: TreatmentCategory[] = [
  {
    id: "injections",
    title: "Injections du visage",
    intro: "Adoucir, restaurer, harmoniser — dans le respect des repères anatomiques.",
    treatments: [
      {
        name: "Toxine botulique",
        description:
          "Détend les muscles responsables des rides d'expression (front, lion, pattes d'oie) pour un regard reposé, sans figer le visage.",
        duration: "15 à 20 min",
        downtime: "Aucune éviction sociale",
      },
      {
        name: "Acide hyaluronique",
        description:
          "Restaure les volumes, redessine les lèvres et l'ovale, atténue les sillons — en respectant les proportions naturelles du visage.",
        duration: "30 à 45 min",
        downtime: "Gonflement léger 24–48 h",
      },
    ],
  },
  {
    id: "lasers",
    title: "Lasers & technologies",
    intro: "Des technologies médicales maîtrisées, choisies selon l'indication.",
    treatments: [
      {
        name: "Laser CO₂",
        description:
          "Resurfaçage de la peau : texture, cicatrices, ridules et relâchement cutané. L'intensité est adaptée à chaque peau.",
        duration: "30 à 60 min",
        downtime: "Rougeurs et croûtelles, 5 à 10 jours",
      },
      {
        name: "Endolifting",
        description:
          "Une fibre laser très fine, glissée sous la peau, stimule la rétraction des tissus et le collagène pour raffermir l'ovale et le cou.",
        duration: "45 à 90 min",
        downtime: "Gonflement modéré quelques jours",
      },
      {
        name: "Diode vasculaire",
        description:
          "Traitement ciblé des petits vaisseaux visibles et des rougeurs du visage.",
        duration: "15 à 30 min",
        downtime: "Rougeurs transitoires",
      },
    ],
  },
  {
    id: "gyneco",
    title: "Gynécologie esthétique",
    intro: "Des actes médicaux intimes, abordés avec sérieux, pudeur et confidentialité.",
    treatments: [
      {
        name: "Laser gynécologique",
        description:
          "Prise en charge de certains troubles intimes (sécheresse, relâchement) après bilan médical et vérification de l'indication.",
        duration: "20 à 30 min",
        downtime: "Reprise rapide, selon avis médical",
      },
      {
        name: "Éclaircissement intime",
        description:
          "Atténuation des hyperpigmentations de la zone intime par des protocoles médicaux adaptés à la peau.",
        duration: "20 à 30 min",
        downtime: "Selon le protocole",
      },
      {
        name: "Comblement des grandes lèvres",
        description:
          "Injection d'acide hyaluronique pour restaurer le volume des grandes lèvres, avec un résultat discret.",
        duration: "30 à 45 min",
        downtime: "Gonflement léger quelques jours",
      },
      {
        name: "Nymphoplastie",
        description:
          "Réduction des petites lèvres, réalisée après une consultation approfondie et un temps de réflexion.",
        duration: "Selon le geste",
        downtime: "Précisée lors de la consultation",
      },
      {
        name: "O-Shot & G-Shot",
        description:
          "Injections de plasma riche en plaquettes (PRP) dans la sphère intime. L'indication et les résultats attendus sont discutés en consultation.",
        duration: "30 à 45 min",
        downtime: "Reprise rapide",
      },
    ],
  },
];

// Les deux univers de soins. Chacun regroupe des familles d'actes (ids de `treatments`).
// Page de chaque univers : /soins/<slug>
export const universes = [
  {
    slug: "visage-peau",
    title: "Visage & peau",
    tagline: "Injections et lasers médicaux",
    intro:
      "Rides d'expression, volumes, qualité de peau, relâchement : des traitements fondés sur l'anatomie du visage, pour un résultat qui reste le vôtre.",
    image: "univers-visage.jpg",
    categories: ["injections", "lasers"],
  },
  {
    slug: "gynecologie-esthetique",
    title: "Gynécologie esthétique",
    tagline: "Une médecine de l'intime",
    intro:
      "Des actes médicaux intimes, abordés avec sérieux, pudeur et confidentialité. Chaque demande commence par une consultation, sans obligation de soin.",
    image: "univers-gyneco.jpg",
    categories: ["gyneco"],
    note: "Consultations dans un cadre strictement médical et confidentiel.",
  },
];

export const getUniverse = (slug: string) => universes.find((u) => u.slug === slug);

export const steps = [
  {
    title: "Consultation",
    text: "Écoute de vos attentes, antécédents médicaux et analyse anatomique. Je vous dis ce qui est réellement indiqué — et ce qui ne l'est pas.",
  },
  {
    title: "Plan de traitement",
    text: "Je vous propose un protocole personnalisé, avec un devis détaillé et un temps de réflexion avant tout soin.",
  },
  {
    title: "Le soin",
    text: "Je réalise moi-même chaque soin, au cabinet, dans des conditions d'hygiène et de confort optimales.",
  },
  {
    title: "Suivi",
    text: "Un contrôle après le soin si nécessaire, et je reste joignable pour toute question.",
  },
];

export const faq = [
  {
    q: "Le résultat sera-t-il naturel ?",
    a: "Oui, c'est l'objectif : des doses justes, parfois en plusieurs temps, pour un visage reposé — pas transformé.",
  },
  {
    q: "Pouvez-vous refuser de réaliser un acte ?",
    a: "Oui, lorsqu'un acte ne peut pas donner le résultat attendu ou comporte trop de risques. Je vous explique alors pourquoi, et ce qui serait plus adapté.",
  },
  {
    q: "Comment se déroule une consultation de gynécologie esthétique ?",
    a: "Dans un cadre strictement médical et confidentiel. La première consultation est un temps d'échange et d'examen, sans obligation de soin. Vous pouvez poser toutes vos questions, sans tabou.",
  },
  {
    q: "Les injections sont-elles douloureuses ?",
    a: "La plupart des produits contiennent un anesthésiant local et des aiguilles très fines sont utilisées. Une crème anesthésiante peut être appliquée au préalable.",
  },
  {
    q: "J'ai eu une complication après un soin réalisé ailleurs. Pouvez-vous m'aider ?",
    a: "Une consultation permet d'évaluer la situation (asymétrie, produit mal placé, résultat insatisfaisant) et de vous proposer, si c'est possible, une prise en charge adaptée.",
  },
  {
    q: "Les soins sont-ils remboursés ?",
    a: "Les actes de médecine esthétique ne sont pas pris en charge par l'assurance maladie ni par les mutuelles. Un devis détaillé vous est remis avant toute intervention.",
  },
];

// Formations pour les médecins (B2B)
export const training = {
  title: "Former les praticiens",
  intro:
    "Je transmets ce que je pratique : une approche fondée sur l'indication, la maîtrise technique et la sécurité du patient.",
  audience: "Médecins",
  modules: [
    {
      title: "Injectables",
      text: "Toxine botulique et acide hyaluronique : indications, techniques, dosages, prévention et gestion des complications.",
    },
    {
      title: "Lasers médicaux",
      text: "Choix des paramètres, indications, protocoles et sécurité.",
    },
    {
      title: "Endolifting",
      text: "Approche, indications, paramètres et maîtrise de la technique.",
    },
  ],
  promises: ["Pratique encadrée", "Petits groupes", "Suivi après la formation"],
  contactSubject: "Formations médecins — demande d'information",
};

// Prise de rendez-vous en ligne (calendrier du site).
// Les créneaux proposés découlent de ces horaires ; chaque demande est
// ensuite confirmée par le cabinet.
export const booking = {
  slotMinutes: 30,
  maxDaysAhead: 60,
  // 0 = dimanche … 6 = samedi. Plages au format "HH:MM".
  // Samedi : matin uniquement (l'après-midi est réservé aux formations).
  openings: {
    1: [["13:30", "19:30"]],
    2: [["13:30", "19:30"]],
    3: [["13:30", "19:30"]],
    4: [["13:30", "19:30"]],
    5: [["13:30", "19:30"]],
    6: [["09:00", "14:00"]], // À CONFIRMER : heure d'ouverture du samedi
  } as Record<number, [string, string][]>,
  // À COMPLÉTER : jours de fermeture exceptionnelle (congés, jours fériés)
  // Jours fériés fixes au Maroc (à compléter avec les fêtes religieuses et les congés du cabinet).
  closedDates: ["2026-11-06", "2026-11-18", "2027-01-01", "2027-01-11", "2027-05-01", "2027-07-30", "2027-08-14", "2027-08-20", "2027-08-21"],
  // Besoins proposés à cocher dans le formulaire (pas de texte libre).
  needs: [
    {
      group: "Visage & peau",
      options: [
        "Rides d'expression",
        "Perte de volume",
        "Lèvres",
        "Ovale du visage / relâchement",
        "Qualité de peau / texture",
        "Taches / rougeurs",
        "Cicatrices",
      ],
    },
    {
      group: "Gynécologie esthétique",
      options: [
        "Sécheresse / inconfort intime",
        "Relâchement intime",
        "Volume des grandes lèvres",
        "Petites lèvres",
        "Pigmentation intime",
      ],
    },
    {
      group: "Autre",
      options: ["Avis sur un soin réalisé ailleurs", "Je ne sais pas encore, je souhaite un conseil"],
    },
  ],
  types: [
    {
      id: "premiere",
      label: "Première consultation",
      duration: "30 min",
      text: "Bilan, analyse du visage et plan de traitement personnalisé.",
    },
    {
      id: "suivi",
      label: "Consultation de suivi",
      duration: "20 min",
      text: "Contrôle après un soin ou réévaluation de votre protocole.",
    },
    {
      id: "injection",
      label: "Séance d'injections",
      duration: "30 – 45 min",
      text: "Pour les patients ayant déjà eu leur consultation préalable.",
    },
    {
      id: "laser",
      label: "Séance de laser",
      duration: "30 – 90 min",
      text: "Laser CO₂, endolifting, diode vasculaire… selon le protocole défini.",
    },
    {
      id: "gyneco",
      label: "Consultation de gynécologie esthétique",
      duration: "30 min",
      text: "Un échange médical confidentiel, sans obligation de soin.",
    },
  ],
};
