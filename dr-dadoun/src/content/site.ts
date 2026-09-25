// Toutes les informations du site sont centralisées ici.
// Les valeurs marquées « À COMPLÉTER » sont des exemples à remplacer
// avant la mise en ligne.

export const doctor = {
  name: "Dr Dadoun",
  fullName: "Dr Mohamed Dadoun",
  title: "Médecin esthétique · Lasériste",
  // À COMPLÉTER : numéro d'inscription à l'Ordre National des Médecins (laisser vide tant qu'il n'est pas fourni)
  ordreNumber: "",
  ordre: "Inscrit à l'Ordre National des Médecins du Maroc",
  // Page « entité » du médecin (Google, IA) : parcours, reconnaissances, enseignement.
  path: "/docteur-mohamed-dadoun",
  role: "Médecin esthétique & lasériste",
};

export const practice = {
  addressLine1: "N°02 Rue Savoie, Quartier des Hôpitaux",
  addressLine2: "20250 Casablanca, Maroc",
  city: "Casablanca",
  phone: "05 22 49 01 09",
  phoneHref: "+212522490109",
  // À COMPLÉTER : vraie adresse e-mail (vide = masquée partout, y compris pour Google).
  email: "",
  // Numéro WhatsApp au format international, sans + ni espaces (vide = bouton masqué).
  whatsapp: "212522490109",
  // Horaires structurés pour Google (schema.org).
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "13:30", closes: "19:30" },
    { days: ["Saturday"], opens: "09:00", closes: "14:00" },
  ],
  // À COMPLÉTER : liens officiels (Instagram, Facebook, fiche Google…) pour Google et les IA.
  sameAs: ["https://www.instagram.com/dr_dadoun/"] as string[],
  instagram: { handle: "@dr_dadoun", url: "https://www.instagram.com/dr_dadoun/" },
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
  { href: "/docteur-mohamed-dadoun", label: "Le Docteur" },
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
  text: "Analyse, indication, précision, suivi.",
  stats: [
    { value: "35+", label: "Années d'expérience" },
    { value: "10+", label: "Années à former des médecins" },
  ],
};

// La philosophie : « Améliorer sans dénaturer »
export const philosophy = {
  title: "Améliorer sans dénaturer",
  intro:
    "Chaque visage a son anatomie, ses proportions et son histoire. Avant tout traitement, j'observe, j'analyse et je pose une indication.",
  // Le contre-modèle : la méthode, étape par étape
  method: [
    { title: "Observer", text: "Analyser l'anatomie, les proportions et les besoins." },
    { title: "Indiquer", text: "Choisir le traitement adapté — ou ne pas traiter." },
    { title: "Maîtriser", text: "Un geste précis, guidé par l'anatomie." },
    { title: "Préserver", text: "Corriger sans transformer." },
    { title: "Suivre", text: "Accompagner au-delà du soin." },
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
  title: ["Comprendre", "avant de traiter."],
  // Parcours & diplômes : écoles, diplômes, formations, étapes (du plus récent au plus ancien).
  // Utilisé sur l'accueil (section « Le Dr Dadoun ») et sur /formations.
  // À COMPLÉTER — ex. { period: "1989", title: "Doctorat en médecine", place: "Faculté de médecine de …" }
  education: [] as { period?: string; title: string; place?: string }[],
  // Reconnaissances et rôles de formateur (affichés sur l'accueil, /formations et pour Google).
  affiliations: [
    { role: "Expert & formateur agréé", org: "American Board of Cosmetic Dermatology and Gynecology" },
    { role: "Expert & formateur agréé", org: "American Aesthetic Association (A.A.A)" },
    { role: "Médecin formateur", org: "Académie européenne de médecine et gynéco-esthétique" },
  ],
  // Conférences, congrès, interventions (du plus récent au plus ancien). Affiché seulement si renseigné.
  // À COMPLÉTER — ex. { year: "2025", title: "Le laser CO₂ en pratique", event: "…", place: "Casablanca", url: "https://…" }
  talks: [] as { year: string; title: string; event: string; place?: string; url?: string }[],
  // Autres profils officiels (page équipe Cellulift, Google Business Profile, annuaires…) : aident Google
  // à reconnaître le bon Dr Mohamed Dadoun. Instagram est déjà ajouté automatiquement.
  profiles: [] as string[],
  quote: "Mon rôle n'est pas de transformer un visage, mais de l'améliorer sans le dénaturer.",
};

export type Treatment = {
  name: string;
  motto?: string; // phrase signature propre à l'acte (sinon celle de sa famille)
  description: string;
  duration: string;
  downtime: string;
};

export type TreatmentCategory = {
  id: string;
  title: string;
  intro: string;
  motto: string; // phrase signature : « Comprendre avant de traiter », décliné
  treatments: Treatment[];
};

// À VALIDER par le Dr Dadoun : descriptions, durées et suites de chaque acte.
export const treatments: TreatmentCategory[] = [
  {
    id: "injections",
    title: "Injections du visage",
    intro: "Adoucir, restaurer, harmoniser — dans le respect des repères anatomiques.",
    motto: "Analyser avant d'injecter.",
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
    motto: "Diagnostiquer avant de traiter.",
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
        motto: "Tous les relâchements ne se traitent pas de la même manière.",
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
    motto: "Écouter avant de proposer.",
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
      "Rides d'expression, volumes, qualité de peau, relâchement : chaque traitement part de l'anatomie du visage et d'une indication posée en consultation.",
    image: "univers-visage.jpg",
    categories: ["injections", "lasers"],
  },
  {
    slug: "gynecologie-esthetique",
    title: "Gynécologie esthétique",
    tagline: "Médecine gynécologique & esthétique",
    intro:
      "Des actes médicaux intimes, abordés avec sérieux, pudeur et confidentialité. Chaque demande commence par une consultation, sans obligation de soin.",
    image: "univers-gyneco.jpg",
    categories: ["gyneco"],
    note: "Consultations dans un cadre strictement médical et confidentiel.",
  },
];

export const getUniverse = (slug: string) => universes.find((u) => u.slug === slug);

// Adresse d'un acte à partir de son nom : « Laser CO₂ » → « laser-co2 ».
export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/₂/g, "2").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Chaque acte a sa propre page : /soins/<univers>/<acte>. Générées automatiquement depuis `treatments`.
export const acts = universes.flatMap((u) =>
  treatments
    .filter((c) => u.categories.includes(c.id))
    .flatMap((c) => c.treatments.map((t) => ({ ...t, slug: slugify(t.name), universe: u, category: c }))),
);
export type Act = (typeof acts)[number];

export const getAct = (univers: string, slug: string) => acts.find((a) => a.universe.slug === univers && a.slug === slug);
export const actPath = (a: Act) => `/soins/${a.universe.slug}/${a.slug}`;

export const steps = [
  {
    title: "Consultation",
    text: "Analyse de vos attentes, antécédents et anatomie.",
  },
  {
    title: "Plan de traitement",
    text: "Une indication et un protocole adaptés.",
  },
  {
    title: "Soin",
    text: "Le traitement est réalisé selon le protocole établi.",
  },
  {
    title: "Suivi",
    text: "Contrôle et accompagnement après le soin.",
  },
];

export const faq = [
  {
    q: "Où se trouve le cabinet ?",
    a: "Le cabinet se trouve au N°02 Rue Savoie, dans le Quartier des Hôpitaux, à Casablanca (20250). Il est ouvert du lundi au vendredi de 13h30 à 19h30 et le samedi de 9h00 à 14h00.",
  },
  {
    q: "Quels soins de médecine esthétique proposez-vous à Casablanca ?",
    a: "Au visage : toxine botulique, acide hyaluronique, laser CO₂, endolifting et diode vasculaire. En gynécologie esthétique : laser gynécologique, éclaircissement intime, comblement des grandes lèvres, nymphoplastie, O-Shot et G-Shot. Chaque soin commence par une consultation.",
  },
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
  ageRanges: ["18 – 24 ans", "25 – 34 ans", "35 – 44 ans", "45 – 54 ans", "55 – 64 ans", "65 ans et plus"],
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
      text: "Analyse, indication et plan de traitement. C'est par là que tout commence.",
    },
    {
      id: "gyneco",
      label: "Consultation de gynécologie esthétique",
      duration: "30 min",
      text: "Un échange médical confidentiel, sans obligation de soin.",
    },
    {
      id: "suivi",
      label: "Consultation de suivi",
      duration: "20 min",
      text: "Contrôle après un soin ou réévaluation de votre traitement.",
    },
    // Les soins ne se réservent qu'après une consultation : le protocole décidé fixe le soin et sa durée.
    {
      id: "soin",
      label: "Soin programmé",
      duration: "Selon le protocole",
      text: "Réservé aux patients ayant déjà consulté : pour réaliser le soin indiqué lors de votre consultation.",
    },
  ],
};
