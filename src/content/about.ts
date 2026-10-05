// Page À propos — centrée sur le client : vous → votre défi → ce que nous avons compris → le système Cellulift → les preuves → prochaine étape.
export const aboutContent = {
  fr: {
    hero: {
      eyebrow: "À propos de Cellulift",
      title: "Vous investissez dans une technologie. Vous attendez des résultats.",
      subtitle:
        "Médecins, cliniques, centres : votre objectif n'est pas d'acheter une machine, c'est de mieux soigner vos patients et de développer votre activité.",
    },
    problem: {
      eyebrow: "Votre défi",
      title: "Une machine seule ne suffit pas.",
      items: [
        { title: "Choisir sans se tromper", description: "Des dizaines d'appareils, des promesses qui se ressemblent : difficile de savoir lequel convient à votre patientèle." },
        { title: "Maîtriser les protocoles", description: "Mal réglée ou mal utilisée, la meilleure technologie donne des résultats décevants." },
        { title: "Ne jamais rester à l'arrêt", description: "Une panne, ce sont des rendez-vous annulés et des patients déçus." },
        { title: "Rentabiliser l'investissement", description: "Il faut positionner le soin, le présenter et le faire connaître pour qu'il trouve sa place." },
      ],
    },
    shift: {
      eyebrow: "Ce que nous avons compris",
      text: "Depuis 2002, une conviction guide Cellulift : une technologie ne réussit que si l'on construit tout autour d'elle. Le conseil avant l'achat, la formation, l'installation, le SAV et le suivi.",
    },
    system: {
      eyebrow: "Le système Cellulift",
      title: "Notre réponse : un système complet autour de votre technologie.",
      intro: "Nous ne livrons pas simplement une technologie. Nous construisons les conditions de sa réussite.",
      center: "Cellulift",
      poles: [
        { key: "technologie", title: "Technologie", text: "Des équipements professionnels sélectionnés pour leur performance, leur fiabilité et leur conformité." },
        { key: "expertise", title: "Expertise", text: "Des médecins et experts qui vous orientent vers la technologie adaptée à votre activité." },
        { key: "academy", title: "Academy", text: "Formation initiale, protocoles et perfectionnement pour maîtriser chaque technologie." },
        { key: "sav", title: "SAV", text: "Installation, mise en service, maintenance et atelier technique intégré." },
        { key: "business", title: "Business", text: "Un accompagnement pour intégrer, positionner et développer la technologie dans votre activité." },
      ],
    },
    proof: {
      eyebrow: "Les preuves",
      title: "Ce qui nous permet de vous accompagner.",
      items: [
        { value: "2002", title: "Plus de 20 ans d'expertise", description: "Une présence continue auprès des professionnels de la médecine esthétique." },
        { value: "1000+", title: "Médecins équipés", description: "Des cabinets, cliniques et centres qui nous font confiance." },
        { value: "Officiel", title: "Distributeur officiel LGL Expert", description: "Partenaire officiel de la marque en Afrique." },
        { value: "CE · FDA", title: "Technologies certifiées", description: "Toutes nos machines sont certifiées CE et FDA." },
        { value: "24 mois", title: "Garantie pièces et main-d'œuvre", description: "Avec un atelier technique intégré et des interventions sur site." },
        { value: "3 pays", title: "Maroc · France · Sénégal", description: "{s} points de vente pour rester proches de vous." },
      ],
    },
  },
  en: {
    hero: {
      eyebrow: "About Cellulift",
      title: "You invest in technology. You expect results.",
      subtitle:
        "Physicians, clinics, centres: your goal isn't to buy a device, it's to treat your patients better and grow your practice.",
    },
    problem: {
      eyebrow: "Your challenge",
      title: "A device alone isn't enough.",
      items: [
        { title: "Choosing the right one", description: "Dozens of devices, similar promises: hard to know which one fits your patients." },
        { title: "Mastering the protocols", description: "Poorly set up or poorly used, even the best technology disappoints." },
        { title: "Never being out of service", description: "A breakdown means cancelled appointments and disappointed patients." },
        { title: "Making it pay off", description: "The treatment has to be positioned, presented and promoted to find its place." },
      ],
    },
    shift: {
      eyebrow: "What we learned",
      text: "Since 2002, one conviction has guided Cellulift: technology only succeeds when everything around it is built too. Advice before buying, training, installation, after-sales and follow-up.",
    },
    system: {
      eyebrow: "The Cellulift system",
      title: "Our answer: a complete system around your technology.",
      intro: "We don't just deliver technology. We build the conditions for its success.",
      center: "Cellulift",
      poles: [
        { key: "technologie", title: "Technology", text: "Professional devices selected for performance, reliability and compliance." },
        { key: "expertise", title: "Expertise", text: "Physicians and experts who guide you to the right technology for your practice." },
        { key: "academy", title: "Academy", text: "Initial training, protocols and advanced courses to master each technology." },
        { key: "sav", title: "After-sales", text: "Installation, commissioning, maintenance and an in-house technical workshop." },
        { key: "business", title: "Business", text: "Support to integrate, position and grow the technology within your practice." },
      ],
    },
    proof: {
      eyebrow: "The proof",
      title: "What allows us to support you.",
      items: [
        { value: "2002", title: "20+ years of expertise", description: "A continuous presence alongside aesthetic medicine professionals." },
        { value: "1000+", title: "Physicians equipped", description: "Practices, clinics and centres that trust us." },
        { value: "Official", title: "Official LGL Expert distributor", description: "The brand's official partner in Africa." },
        { value: "CE · FDA", title: "Certified technology", description: "All our devices are CE and FDA certified." },
        { value: "24 months", title: "Parts and labour warranty", description: "With an in-house technical workshop and on-site visits." },
        { value: "3 countries", title: "Morocco · France · Senegal", description: "{s} points of sale to stay close to you." },
      ],
    },
  },
} as const;
