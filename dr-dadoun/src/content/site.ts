// Toutes les informations du site sont centralisées ici.
// Les valeurs marquées « À COMPLÉTER » sont des exemples à remplacer
// avant la mise en ligne.

export const doctor = {
  name: "Dr Dadoun",
  fullName: "Docteur Dadoun", // À COMPLÉTER : prénom + nom
  title: "Médecin esthétique",
  rpps: "10000000000", // À COMPLÉTER : numéro RPPS
  ordre: "Inscrit(e) au Conseil de l'Ordre des médecins de Paris", // À COMPLÉTER
};

export const practice = {
  addressLine1: "12 avenue Victor Hugo", // À COMPLÉTER
  addressLine2: "75016 Paris", // À COMPLÉTER
  phone: "01 23 45 67 89", // À COMPLÉTER
  phoneHref: "+33123456789", // À COMPLÉTER
  email: "contact@dr-dadoun.fr", // À COMPLÉTER
  bookingUrl: "/rendez-vous",
  mapsUrl: "https://maps.google.com/?q=12+avenue+Victor+Hugo+75016+Paris", // À COMPLÉTER
  access: [
    "Métro : Victor Hugo (ligne 2)",
    "Parking : Parking Victor Hugo à 2 min",
    "Cabinet accessible aux personnes à mobilité réduite",
  ],
  hours: [
    { day: "Lundi – Vendredi", time: "9h00 – 19h30" },
    { day: "Samedi", time: "9h00 – 13h00" },
    { day: "Dimanche", time: "Fermé" },
  ],
};

export const nav = [
  { href: "/#docteur", label: "Le Docteur" },
  { href: "/#soins", label: "Soins" },
  { href: "/#approche", label: "Approche" },
  { href: "/#parcours", label: "Parcours" },
  { href: "/journal", label: "Journal" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#cabinet", label: "Cabinet" },
];

export const hero = {
  eyebrow: "Médecine esthétique · Paris",
  title: ["Révéler votre beauté,", "sans la transformer."],
  text: "Des soins médicaux sur mesure, pensés pour un résultat naturel, harmonieux et durable — dans le respect de votre visage et de votre histoire.",
  facts: [
    { value: "Consultation", label: "d'évaluation personnalisée" },
    { value: "Produits", label: "certifiés CE, traçabilité complète" },
    { value: "Suivi", label: "médical après chaque soin" },
  ],
};

export const about = {
  title: "Une médecine esthétique de la justesse",
  paragraphs: [
    // À COMPLÉTER : biographie réelle du Dr Dadoun
    "Docteur en médecine, le Dr Dadoun consacre sa pratique à la médecine esthétique du visage et de la peau. Sa conviction : un beau résultat est celui que l'on ne remarque pas, mais qui se ressent — un visage reposé, lumineux, fidèle à lui-même.",
    "Chaque consultation commence par l'écoute et une analyse précise de votre visage : structure osseuse, qualité de peau, expressions. Le plan de traitement proposé est toujours progressif, expliqué et adapté à vos attentes comme à votre budget.",
  ],
  credentials: [
    // À COMPLÉTER : diplômes et formations réels
    "Doctorat en médecine — Faculté de médecine de Paris",
    "Diplôme Inter-Universitaire de médecine morphologique et anti-âge",
    "Formations continues en injections et lasers médicaux",
    "Membre de sociétés savantes de médecine esthétique",
  ],
  quote: "Mon rôle n'est pas de changer un visage, mais de lui rendre son éclat.",
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

export const treatments: TreatmentCategory[] = [
  {
    id: "injections",
    title: "Injections",
    intro: "Restaurer les volumes, adoucir les rides, harmoniser les traits.",
    treatments: [
      {
        name: "Acide hyaluronique",
        description:
          "Redonne du volume aux pommettes, redessine l'ovale et les lèvres, comble les sillons tout en respectant l'expression naturelle.",
        duration: "30 à 45 min",
        downtime: "Rougeurs légères 24–48 h",
      },
      {
        name: "Toxine botulique",
        description:
          "Détend les muscles responsables des rides d'expression (front, lion, pattes d'oie) pour un regard reposé et lisse.",
        duration: "15 à 20 min",
        downtime: "Aucune éviction sociale",
      },
      {
        name: "Skinboosters",
        description:
          "Micro-injections d'acide hyaluronique non réticulé pour hydrater la peau en profondeur et lui rendre son éclat.",
        duration: "30 min",
        downtime: "Petites papules 24 h",
      },
    ],
  },
  {
    id: "peau",
    title: "Qualité de peau",
    intro: "Éclat, texture, taches : des protocoles pour une peau saine.",
    treatments: [
      {
        name: "Peelings médicaux",
        description:
          "Exfoliation contrôlée pour atténuer taches, cicatrices d'acné et ridules, et unifier le teint.",
        duration: "20 à 30 min",
        downtime: "Selon la profondeur, 0 à 7 jours",
      },
      {
        name: "Mésothérapie & PRP",
        description:
          "Cocktails revitalisants ou plasma riche en plaquettes pour stimuler la régénération cutanée et capillaire.",
        duration: "30 à 45 min",
        downtime: "Rougeurs légères quelques heures",
      },
      {
        name: "Microneedling",
        description:
          "Micro-perforations stimulant la production de collagène : pores, cicatrices et relâchement léger.",
        duration: "45 min",
        downtime: "Rougeurs 24–72 h",
      },
    ],
  },
  {
    id: "technologies",
    title: "Lasers & technologies",
    intro: "Des technologies médicales de dernière génération.",
    treatments: [
      {
        name: "Laser pigmentaire & vasculaire",
        description:
          "Traitement ciblé des taches brunes, rougeurs diffuses et petits vaisseaux visibles du visage.",
        duration: "15 à 30 min",
        downtime: "Croûtelles 5–7 jours",
      },
      {
        name: "Épilation laser",
        description:
          "Réduction durable de la pilosité, adaptée à chaque phototype, réalisée sous contrôle médical.",
        duration: "Selon la zone",
        downtime: "Aucune éviction sociale",
      },
      {
        name: "Radiofréquence & HIFU",
        description:
          "Raffermissement sans aiguille de l'ovale du visage, du cou et du décolleté par stimulation du collagène.",
        duration: "45 à 60 min",
        downtime: "Aucune éviction sociale",
      },
    ],
  },
];

export const principles = [
  {
    title: "Écoute",
    text: "Comprendre vos attentes avant toute proposition. Une consultation dédiée, sans engagement.",
  },
  {
    title: "Naturel",
    text: "Des doses justes et une approche progressive, pour un résultat harmonieux qui vous ressemble.",
  },
  {
    title: "Sécurité",
    text: "Actes réalisés par un médecin, produits certifiés CE, asepsie rigoureuse et traçabilité systématique.",
  },
  {
    title: "Transparence",
    text: "Un devis détaillé, des explications claires sur les bénéfices, limites et effets secondaires possibles.",
  },
];

export const steps = [
  {
    title: "Consultation",
    text: "Échange sur vos attentes, antécédents médicaux et analyse du visage. Le médecin vous indique ce qui est réellement indiqué — et ce qui ne l'est pas.",
  },
  {
    title: "Plan de traitement",
    text: "Proposition d'un protocole personnalisé, remise d'un devis détaillé et d'un temps de réflexion avant tout soin.",
  },
  {
    title: "Le soin",
    text: "Réalisation de l'acte au cabinet, dans des conditions d'hygiène et de confort optimales.",
  },
  {
    title: "Suivi",
    text: "Contrôle à 2–3 semaines si nécessaire, et un médecin joignable pour toute question après le soin.",
  },
];

export const faq = [
  {
    q: "Les injections sont-elles douloureuses ?",
    a: "La plupart des produits contiennent un anesthésiant local et des aiguilles très fines sont utilisées. Une crème anesthésiante peut être appliquée au préalable. La sensation est généralement bien tolérée.",
  },
  {
    q: "Le résultat sera-t-il naturel ?",
    a: "C'est la priorité du cabinet. Les traitements sont dosés avec mesure et peuvent être réalisés en plusieurs temps. L'objectif est que l'on vous trouve reposé(e), pas « refait(e) ».",
  },
  {
    q: "Combien de temps durent les résultats ?",
    a: "Cela dépend du soin : environ 4 à 6 mois pour la toxine botulique, 9 à 18 mois pour l'acide hyaluronique selon la zone et le produit. Le médecin vous précisera la durée attendue lors de la consultation.",
  },
  {
    q: "Y a-t-il des contre-indications ?",
    a: "Oui, notamment la grossesse, l'allaitement, certaines maladies auto-immunes, infections cutanées en cours ou traitements anticoagulants. Un questionnaire médical complet est systématiquement réalisé.",
  },
  {
    q: "Les soins sont-ils remboursés ?",
    a: "Les actes de médecine esthétique ne sont pas pris en charge par l'Assurance Maladie. Un devis détaillé vous est remis avant toute intervention.",
  },
  {
    q: "Comment prendre rendez-vous ?",
    a: "En ligne via Doctolib, 24h/24, ou par téléphone aux horaires d'ouverture du cabinet.",
  },
];

// Prise de rendez-vous en ligne (calendrier du site).
// Les créneaux proposés découlent de ces horaires ; chaque demande est
// ensuite confirmée par le cabinet.
export const booking = {
  slotMinutes: 30,
  maxDaysAhead: 60,
  // 0 = dimanche … 6 = samedi. Plages au format "HH:MM".
  openings: {
    1: [["09:00", "12:30"], ["14:00", "19:30"]],
    2: [["09:00", "12:30"], ["14:00", "19:30"]],
    3: [["09:00", "12:30"], ["14:00", "19:30"]],
    4: [["09:00", "12:30"], ["14:00", "19:30"]],
    5: [["09:00", "12:30"], ["14:00", "19:30"]],
    6: [["09:00", "13:00"]],
  } as Record<number, [string, string][]>,
  // À COMPLÉTER : jours de fermeture exceptionnelle (congés, jours fériés)
  closedDates: ["2026-11-01", "2026-11-11", "2026-12-25", "2027-01-01"],
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
      id: "peau-laser",
      label: "Soin de peau ou laser",
      duration: "30 – 60 min",
      text: "Peeling, microneedling, laser… selon le protocole défini.",
    },
  ],
};
