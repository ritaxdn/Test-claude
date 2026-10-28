// Accueil Cellulift — textes repris de cellulift.ma (légèrement resserrés pour les cartes).
// Textes de l'accueil.

export const homeSystem = {
  fr: {
    hero: {
      // H1 unique (ce que vend Cellulift, où), puis l'accroche de marque en paragraphe et la ligne de réassurance.
      title: ["Lasers et équipements médico-esthétiques", "professionnels au Maroc"],
      subtitle:
        "On ne vend pas de la beauté. On vend de la performance : la bonne technologie, la formation pour la maîtriser et un SAV qui reste à vos côtés.",
      reassurance: "Distributeur officiel LGL Expert · Installation · Formation CELLULIFT Academy · SAV 13 techniciens",
      badges: ["Marquées CE · Garantie 24 mois main-d'œuvre"],
      ctaPrimary: "Réserver une démo au showroom",
      ctaSecondary: "Recevoir le guide : 7 questions avant d'investir",
    },
    // Chiffres clés (très grand, sans paragraphe). Ne jamais afficher le nombre de technologies.
    stats: [
      { value: "20+", label: "Ans d'expertise" },
      { value: "4 400+", label: "Professionnels équipés" },
      { value: "24", unit: "mois", label: "De garantie" },
      { value: "3", label: "Agences au Maroc" },
    ],
    // Bloc de positionnement sous les chiffres (validé par Cellulift)
    positioning: {
      title: "Votre fournisseur d'équipements médico-esthétiques au Maroc.",
      text: "Depuis 2002, CELLULIFT sélectionne et distribue des lasers esthétiques, des appareils d'amincissement et de remodelage corporel, des technologies HIFU et de réjuvénation cutanée pour les médecins esthétiques, dermatologues, cliniques et centres au Maroc. Chaque machine est livrée installée, avec une formation CELLULIFT Academy et un service après-vente assuré par nos 13 techniciens depuis Casablanca, Marrakech et Tanger.",
    },
    // Bandeau défilant sous le hero.
    ticker: [
      "Équipements marqués CE",
      "Depuis 2002",
      "Technologies • Installation • Formation • Accompagnement • Service après-vente",
      "3 agences au Maroc",
      "Représentation à Rabat, Agadir, Paris et Dakar",
      "+4 400 professionnels équipés",
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
        { label: "Distribution officielle", value: "LGL Expert", title: "Partenaire officiel en Afrique", text: "" },
        { label: "Équipements certifiés", value: "CE", title: "Certifications de chaque machine sur demande", text: "" },
        { label: "Implantations", value: "3 agences au Maroc", title: "Représentation à Rabat, Agadir, Paris et Dakar", text: "" },
        { label: "Expertise médicale", value: "Médecins · Formateurs · Experts", title: "Protocoles et accompagnement clinique", text: "" },
      ],
    },
    technologies: {
      eyebrow: "01 — Technologies",
      title: "Des technologies",
      titleAccent: "pour chaque indication.",
      intro: "Les dispositifs de dernière génération LGL Expert, dont Cellulift est le distributeur officiel en Afrique, marqués CE.",
      columns: { ref: "", name: "", category: "", indications: "" },
      viewAll: "Explorer nos technologies",
      // Deux lignes sous chaque gamme + libellé du lien (la carte entière mène à la page de la gamme).
      pitch: {
        amincissement: ["Appareils de remodelage corporel et de réduction des graisses localisées pour cabinets et centres. Des protocoles rentables, à forte demande patient.", "Voir les appareils d'amincissement"],
        lasers: ["Lasers esthétiques professionnels pour l'épilation, le détatouage, les lésions pigmentaires et vasculaires. Choisis pour leur fiabilité et leur rendement en cabinet.", "Voir les lasers esthétiques"],
        rejuvenation: ["Technologies anti-âge et de qualité de peau : texture, rides, éclat. Des soins à fort taux de retour patient.", "Voir les technologies de réjuvénation"],
        photomodulation: ["LED médicales pour accompagner les traitements, accélérer la récupération et compléter vos protocoles anti-âge et anti-acné.", "Voir la photomodulation"],
        hifu: ["Lifting non chirurgical du visage et du corps. Une alternative recherchée par les patients, sans éviction sociale.", "Voir les appareils HIFU"],
        therapie: ["", "Voir les thérapies avancées"],
      } as Record<string, [string, string]>,
    },
    academy: {
      eyebrow: "02 — Cellulift Academy",
      title: "La technologie s'acquiert. La maîtrise se construit.",
      subtitle: "De l'installation à la maîtrise clinique.",
      text: "Formation initiale · Protocoles · Workshops · Perfectionnement",
      steps: ["Installation", "Formation", "Protocoles", "Maîtrise"],
      facultyLabel: "Formateur",
      cta: "Choisir ma prochaine formation",
    },
    support: {
      eyebrow: "03 — Support",
      title: "Après l'installation, nous restons là.",
      text: "",
      items: [
        { code: "01", title: "Garantie 24 mois", text: "Main-d'œuvre." },
        { code: "02", title: "Déplacement", text: "Notre staff technique se déplace chez vous." },
        { code: "03", title: "Atelier intégré", text: "Diagnostic et réparation de vos machines." },
        { code: "04", title: "Assistance", text: "Une question technique ? Notre équipe vous répond." },
      ],
      cta: "Obtenir de l'aide technique",
      phoneLabel: "Ligne support",
    },
    showrooms: {
      eyebrow: "04 — Implantations",
      title: ["Un partenaire.", "Partout au Maroc."],
      markets: ["3 agences au Maroc", "Représentation à Rabat, Agadir, Paris et Dakar"],
      hq: "Siège",
      onRequest: "Adresse communiquée sur rendez-vous.",
      cta: "Voir les machines au showroom",
      list: "Agences et représentations",
    },
    cta: {
      eyebrow: "05 — Votre projet",
      title: "Votre prochaine technologie commence ici.",
      text: "Parlez de votre projet à un expert Cellulift.",
      ctaPrimary: "Parler à un expert",
      ctaSecondary: "Voir la technologie en action",
    },
  },
  en: {
    hero: {
      title: ["Professional lasers and medical aesthetic", "equipment in Morocco"],
      subtitle:
        "We don't sell beauty. We sell performance: the right technology, the training to master it and an after-sales service that stays by your side.",
      reassurance: "Official LGL Expert distributor · Installation · CELLULIFT Academy training · After-sales: 13 technicians",
      badges: ["CE marked · 24-month labour warranty"],
      ctaPrimary: "Book a showroom demo",
      ctaSecondary: "Get the guide: 7 questions before investing",
    },
    stats: [
      { value: "20+", label: "Years of expertise" },
      { value: "4,400+", label: "Professionals equipped" },
      { value: "24", unit: "months", label: "Warranty" },
      { value: "3", label: "Branches in Morocco" },
    ],
    positioning: {
      title: "Your medical aesthetic equipment supplier in Morocco.",
      text: "Since 2002, CELLULIFT has selected and distributed aesthetic lasers, body slimming and contouring devices, HIFU and skin rejuvenation technology for aesthetic physicians, dermatologists, clinics and centres in Morocco. Every device is delivered installed, with CELLULIFT Academy training and after-sales service by our 13 technicians from Casablanca, Marrakech and Tangier.",
    },
    ticker: [
      "CE-marked equipment",
      "Since 2002",
      "Technology • Installation • Training • Support • After-sales service",
      "3 branches in Morocco",
      "Representation in Rabat, Agadir, Paris and Dakar",
      "4,400+ professionals equipped",
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
        { label: "Official distribution", value: "LGL Expert", title: "Official partner in Africa", text: "" },
        { label: "Certified equipment", value: "CE", title: "Each device's certifications on request", text: "" },
        { label: "Locations", value: "3 branches in Morocco", title: "Representation in Rabat, Agadir, Paris and Dakar", text: "" },
        { label: "Medical expertise", value: "Physicians · Trainers · Experts", title: "Protocols and clinical guidance", text: "" },
      ],
    },
    technologies: {
      eyebrow: "01 — Technologies",
      title: "Technology",
      titleAccent: "for every indication.",
      intro: "Latest-generation LGL Expert devices, of which Cellulift is the official distributor in Africa, CE marked.",
      columns: { ref: "", name: "", category: "", indications: "" },
      viewAll: "Explore our technologies",
      pitch: {
        amincissement: ["Body contouring and localised fat reduction devices for practices and centres. Profitable protocols in high patient demand.", "See the slimming devices"],
        lasers: ["Professional aesthetic lasers for hair removal, tattoo removal, pigmented and vascular lesions. Chosen for their reliability and in-clinic return.", "See the aesthetic lasers"],
        rejuvenation: ["Anti-ageing and skin quality technology: texture, wrinkles, radiance. Treatments with a high patient return rate.", "See the rejuvenation technology"],
        photomodulation: ["Medical LEDs to support treatments, speed up recovery and complete your anti-ageing and anti-acne protocols.", "See photomodulation"],
        hifu: ["Non-surgical lifting of the face and body. An alternative patients seek out, with no downtime.", "See the HIFU devices"],
        therapie: ["", "See advanced therapy"],
      } as Record<string, [string, string]>,
    },
    academy: {
      eyebrow: "02 — Cellulift Academy",
      title: "Technology can be acquired. Mastery is built.",
      subtitle: "From installation to clinical mastery.",
      text: "Initial training · Protocols · Workshops · Advanced courses",
      steps: ["Installation", "Training", "Protocols", "Mastery"],
      facultyLabel: "Trainer",
      cta: "Pick my next training",
    },
    support: {
      eyebrow: "03 — Support",
      title: "After installation, we stay with you.",
      text: "",
      items: [
        { code: "01", title: "24-month warranty", text: "Labour." },
        { code: "02", title: "On-site visits", text: "Our technical staff comes to you." },
        { code: "03", title: "In-house workshop", text: "Diagnosis and repair of your devices." },
        { code: "04", title: "Assistance", text: "A technical question? Our team answers." },
      ],
      cta: "Get technical help",
      phoneLabel: "Support line",
    },
    showrooms: {
      eyebrow: "04 — Locations",
      title: ["One partner.", "All over Morocco."],
      markets: ["3 branches in Morocco", "Representation in Rabat, Agadir, Paris and Dakar"],
      hq: "Head office",
      onRequest: "Address shared by appointment.",
      cta: "See the devices at the showroom",
      list: "Branches and representation",
    },
    cta: {
      eyebrow: "05 — Your project",
      title: "Your next technology starts here.",
      text: "Talk to a Cellulift expert about your project.",
      ctaPrimary: "Talk to an expert",
      ctaSecondary: "See it in action",
    },
  },
} as const;
