// Accueil Cellulift — textes repris de cellulift.ma (légèrement resserrés pour les cartes).
// Textes de l'accueil.

export const homeSystem = {
  fr: {
    hero: {
      // Ligne de contexte (H1, pour le référencement) puis grand titre de marque.
      seo: "Technologies médico-esthétiques professionnelles",
      title: ["La technologie", "au service de votre développement."],
      titleAccent: "Expertise · Formation · Installation · Support",
      badges: ["Distributeur officiel LGL Expert · Afrique", "Certifiées CE & FDA · Garantie 24 mois"],
      ctaPrimary: "Demander une démonstration",
      ctaSecondary: "Découvrir nos technologies",
    },
    // Chiffres clés (très grand, sans paragraphe). « {s} » = nombre de showrooms. Ne jamais afficher le nombre de technologies.
    stats: [
      { value: "20+", label: "Ans d'expertise" },
      { value: "1000+", label: "Médecins équipés" },
      { value: "24", unit: "mois", label: "De garantie" },
      { value: "{s}", label: "Points de vente" },
    ],
    // Bandeau défilant sous le hero.
    ticker: [
      "Toutes nos machines sont certifiées CE et FDA",
      "Depuis 2002",
      "Technologies • Installation • Formation • Accompagnement • Service après-vente",
      "5 villes",
      "5 pays",
      "+1000 médecins équipés",
    ],
    system: {
      eyebrow: "02 — L'écosystème Cellulift",
      title: "Bien plus qu'une technologie.",
      intro: "",
      pillars: [
        { code: "01", name: "Conseil", title: "Choisir.", text: "Nos experts vous aident à choisir la technologie adaptée à votre activité, du premier échange jusqu'à l'inauguration de votre projet." },
        { code: "02", name: "Installation", title: "Déployer.", text: "Transport adapté, montage et mise en service par nos techniciens, partout au Maroc : vous n'avez rien à gérer côté technique." },
        { code: "03", name: "Academy", title: "Maîtriser.", text: "Formations, protocoles et workshops avec des médecins formateurs pour maîtriser chaque technologie." },
        { code: "04", name: "Support", title: "Continuer.", text: "Garantie 24 mois, déplacement du staff technique et atelier intégré : nous restons présents après l'installation." },
      ],
    },
    why: {
      eyebrow: "03 — Pourquoi Cellulift",
      title: "Pourquoi Cellulift ?",
      intro: "",
      // Preuves, présentées comme des données : la valeur domine, le libellé reste discret.
      items: [
        { value: "LGL Expert", title: "Distributeur officiel · Afrique", text: "" },
        { value: "CE · FDA", title: "Machines certifiées", text: "" },
        { value: "3 marchés", title: "Maroc · France · Sénégal", text: "" },
        { value: "Médical", title: "Médecins, formateurs et experts spécialisés", text: "" },
      ],
    },
    technologies: {
      eyebrow: "01 — Technologies",
      title: "Des technologies",
      titleAccent: "pour chaque indication.",
      intro: "Les dispositifs de dernière génération LGL Expert, dont Cellulift est le distributeur officiel en Afrique, tous certifiés CE Médical et FDA.",
      columns: { ref: "", name: "", category: "", indications: "" },
      viewAll: "Explorer nos technologies",
    },
    academy: {
      eyebrow: "04 — Cellulift Academy",
      title: "La technologie s'acquiert. La maîtrise se construit.",
      text: "Formations · Protocoles · Workshops",
      facultyLabel: "Formateur",
      cta: "Voir les prochaines formations",
    },
    support: {
      eyebrow: "05 — Support",
      title: "Après l'installation, nous restons là.",
      text: "",
      items: [
        { code: "01", title: "Garantie 24 mois", text: "Pièces et main-d'œuvre." },
        { code: "02", title: "Déplacement", text: "Notre staff technique se déplace chez vous." },
        { code: "03", title: "Atelier intégré", text: "Diagnostic et réparation de vos machines." },
        { code: "04", title: "Assistance", text: "Une question technique ? Notre équipe vous répond." },
      ],
      cta: "Contacter le support",
    },
    showrooms: {
      eyebrow: "06 — Implantations",
      title: ["One partner.", "Three markets."],
      markets: ["Maroc", "France", "Sénégal"],
      hq: "Siège",
      onRequest: "Adresse communiquée sur rendez-vous.",
      cta: "Prendre rendez-vous au showroom",
      list: "Points de vente",
    },
    cta: {
      eyebrow: "07 — Votre projet",
      title: "Votre prochaine technologie commence ici.",
      text: "Parlez de votre projet à un expert Cellulift.",
      ctaPrimary: "Parler à un expert",
      ctaSecondary: "Demander une démonstration",
    },
  },
  en: {
    hero: {
      seo: "Medical aesthetic technology for professionals",
      title: ["Medical aesthetic technology.", "Built for growth."],
      titleAccent: "Technology · Training · Installation · Support",
      badges: ["Official LGL Expert distributor · Africa", "CE & FDA certified · 24-month warranty"],
      ctaPrimary: "Request a demonstration",
      ctaSecondary: "Explore our technologies",
    },
    stats: [
      { value: "20+", label: "Years of expertise" },
      { value: "1000+", label: "Physicians equipped" },
      { value: "24", unit: "months", label: "Warranty" },
      { value: "{s}", label: "Points of sale" },
    ],
    ticker: [
      "All our devices are CE and FDA certified",
      "Since 2002",
      "Technology • Installation • Training • Support • After-sales service",
      "5 cities",
      "5 countries",
      "1,000+ physicians equipped",
    ],
    system: {
      eyebrow: "02 — The Cellulift ecosystem",
      title: "Beyond the machine.",
      intro: "",
      pillars: [
        { code: "01", name: "Advice", title: "Choose.", text: "Our experts help you choose the right technology for your practice, from the first conversation to the opening of your project." },
        { code: "02", name: "Installation", title: "Deploy.", text: "Suitable transport, assembly and commissioning by our technicians, everywhere in Morocco: nothing technical to handle on your side." },
        { code: "03", name: "Academy", title: "Master.", text: "Training, protocols and workshops with physician trainers to master every technology." },
        { code: "04", name: "Support", title: "Continue.", text: "24-month warranty, on-site technical staff and an in-house workshop: we stay with you after installation." },
      ],
    },
    why: {
      eyebrow: "03 — Why Cellulift",
      title: "Why Cellulift?",
      intro: "",
      items: [
        { value: "LGL Expert", title: "Official distributor · Africa", text: "" },
        { value: "CE · FDA", title: "Certified devices", text: "" },
        { value: "3 markets", title: "Morocco · France · Senegal", text: "" },
        { value: "Medical", title: "Physicians, trainers and specialist experts", text: "" },
      ],
    },
    technologies: {
      eyebrow: "01 — Technologies",
      title: "Technology",
      titleAccent: "for every indication.",
      intro: "Latest-generation LGL Expert devices, of which Cellulift is the official distributor in Africa, all CE Medical and FDA certified.",
      columns: { ref: "", name: "", category: "", indications: "" },
      viewAll: "Explore our technologies",
    },
    academy: {
      eyebrow: "04 — Cellulift Academy",
      title: "Technology can be acquired. Mastery is built.",
      text: "Training · Protocols · Workshops",
      facultyLabel: "Trainer",
      cta: "See upcoming training",
    },
    support: {
      eyebrow: "05 — Support",
      title: "After installation, we stay with you.",
      text: "",
      items: [
        { code: "01", title: "24-month warranty", text: "Parts and labour." },
        { code: "02", title: "On-site visits", text: "Our technical staff comes to you." },
        { code: "03", title: "In-house workshop", text: "Diagnosis and repair of your devices." },
        { code: "04", title: "Assistance", text: "A technical question? Our team answers." },
      ],
      cta: "Contact support",
    },
    showrooms: {
      eyebrow: "06 — Locations",
      title: ["One partner.", "Three markets."],
      markets: ["Morocco", "France", "Senegal"],
      hq: "Head office",
      onRequest: "Address shared by appointment.",
      cta: "Book a showroom visit",
      list: "Points of sale",
    },
    cta: {
      eyebrow: "07 — Your project",
      title: "Your next technology starts here.",
      text: "Talk to a Cellulift expert about your project.",
      ctaPrimary: "Talk to an expert",
      ctaSecondary: "Request a demonstration",
    },
  },
} as const;
