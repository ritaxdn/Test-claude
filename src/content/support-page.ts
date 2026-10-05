export const supportPageContent = {
  fr: {
    hero: {
      eyebrow: "Support & Après-vente",
      title: "Après l'installation, nous restons là.",
      subtitle:
        "Garantie 24 mois, techniciens qui se déplacent, atelier intégré et ligne support directe : votre technologie reste opérationnelle, et votre activité avec.",
    },
    status: {
      eyebrow: "Statut du service",
      title: "Un SAV qui fonctionne comme un système.",
      live: "En service",
      rows: [
        { label: "Garantie", value: "24 mois · pièces et main-d'œuvre", state: "Actif" },
        { label: "Ligne support", value: "{phone}", state: "En ligne" },
        { label: "Intervention sur site", value: "Notre staff technique se déplace", state: "Disponible" },
        { label: "Atelier intégré", value: "Diagnostic et réparation", state: "Opérationnel" },
      ],
    },
    exploded: {
      eyebrow: "Atelier intégré",
      title: "Chaque pièce, maîtrisée.",
      intro: "Notre atelier diagnostique, répare et remplace chaque composant de vos machines.",
      machineAlt: "Machine Brasilift, vue d'ensemble",
      parts: [
        { code: "01", title: "Panneau de contrôle", text: "Diagnostic électronique et calibrage des réglages." },
        { code: "02", title: "Connectique", text: "Contrôle des câbles et connecteurs, remplacement si nécessaire." },
        { code: "03", title: "Pièces à main", text: "Vérification et remplacement des pièces à main." },
      ],
    },
    processEyebrow: "Le parcours SAV",
    processTitle: "De la livraison au long terme",
    steps: [
      {
        title: "Installation & mise en service",
        description: "Transport adapté, montage et mise en service de votre équipement par nos techniciens.",
      },
      {
        title: "Formation de vos équipes",
        description: "Prise en main avec Cellulift Academy avant la première séance patient.",
      },
      {
        title: "Suivi & maintenance",
        description: "Des contrôles pour garder votre technologie performante dans la durée.",
      },
      {
        title: "Assistance & atelier",
        description: "Une question ou une panne : la ligne support répond, l'atelier intégré diagnostique et répare.",
      },
    ],
    reliability: {
      eyebrow: "Ce qui est inclus",
      title: "Ce que vous obtenez avec chaque technologie",
      items: [
        { title: "Garantie 24 mois", description: "Pièces et main-d'œuvre, sur toutes nos machines." },
        { title: "Déplacement du staff technique", description: "Nos techniciens interviennent directement chez vous." },
        { title: "Atelier intégré", description: "Diagnostic et réparation de vos machines par notre équipe." },
        { title: "Ligne support directe", description: "Un numéro dédié pour toute question technique." },
      ],
    },
    cta: {
      title: "Une question sur votre équipement ?",
      description:
        "Installation, maintenance ou panne : notre équipe technique vous répond et intervient.",
      ctaPrimary: "Obtenir de l'aide technique",
      ctaSecondary: "Parler à un expert",
    },
  },
  en: {
    hero: {
      eyebrow: "Support & After-sales",
      title: "After installation, we stay with you.",
      subtitle:
        "24-month warranty, technicians who come to you, an in-house workshop and a direct support line: your technology stays operational, and so does your practice.",
    },
    status: {
      eyebrow: "Service status",
      title: "After-sales that runs like a system.",
      live: "In service",
      rows: [
        { label: "Warranty", value: "24 months · parts and labour", state: "Active" },
        { label: "Support line", value: "{phone}", state: "Online" },
        { label: "On-site visits", value: "Our technical staff comes to you", state: "Available" },
        { label: "In-house workshop", value: "Diagnosis and repair", state: "Operational" },
      ],
    },
    exploded: {
      eyebrow: "In-house workshop",
      title: "Every part, mastered.",
      intro: "Our workshop diagnoses, repairs and replaces every component of your devices.",
      machineAlt: "Brasilift device, overview",
      parts: [
        { code: "01", title: "Control panel", text: "Electronic diagnosis and settings calibration." },
        { code: "02", title: "Connectors", text: "Cable and connector checks, replaced when needed." },
        { code: "03", title: "Hand pieces", text: "Inspection and replacement of hand pieces." },
      ],
    },
    processEyebrow: "The after-sales journey",
    processTitle: "From delivery to the long term",
    steps: [
      {
        title: "Installation & commissioning",
        description: "Suitable transport, assembly and commissioning of your device by our technicians.",
      },
      {
        title: "Team training",
        description: "Hands-on onboarding with Cellulift Academy before the first patient session.",
      },
      {
        title: "Follow-up & maintenance",
        description: "Checks to keep your technology performing over time.",
      },
      {
        title: "Assistance & workshop",
        description: "A question or a breakdown: the support line answers, the in-house workshop diagnoses and repairs.",
      },
    ],
    reliability: {
      eyebrow: "What's included",
      title: "What you get with every technology",
      items: [
        { title: "24-month warranty", description: "Parts and labour, on all our devices." },
        { title: "On-site technical staff", description: "Our technicians come directly to you." },
        { title: "In-house workshop", description: "Diagnosis and repair of your devices by our team." },
        { title: "Direct support line", description: "A dedicated number for any technical question." },
      ],
    },
    cta: {
      title: "A question about your equipment?",
      description: "Installation, maintenance or breakdown: our technical team answers and steps in.",
      ctaPrimary: "Get technical help",
      ctaSecondary: "Talk to an expert",
    },
  },
} as const;
