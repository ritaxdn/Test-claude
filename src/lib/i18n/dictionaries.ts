import type { Locale } from "./config";

export interface Dictionary {
  nav: {
    home: string;
    about: string;
    technologies: string;
    academy: string;
    support: string;
    contact: string;
    requestDemo: string;
  };
  footer: {
    tagline: string;
    description: string;
    pages: string;
    contact: string;
    followUs: string;
    rights: string;
    legal: string;
    privacy: string;
  };
  common: {
    requestDemo: string;
    speakToExpert: string;
    exploreTechnologies: string;
    joinMasterclass: string;
    contactUs: string;
    learnMore: string;
    viewAll: string;
    readMore: string;
    sendMessage: string;
    viewProgram: string;
    indications: string;
    benefits: string;
    certifications: string;
    backTo: string;
  };
  langSwitch: {
    fr: string;
    en: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      technologies: "Technologies",
      academy: "Academy",
      support: "Support",
      contact: "Contact",
      requestDemo: "Demander une démo",
    },
    footer: {
      tagline: "Metamorphosis Technology",
      description:
        "Partenaire de référence des professionnels de l'esthétique médicale en Afrique — technologies, formation et accompagnement long terme.",
      pages: "Pages",
      contact: "Contact",
      followUs: "Suivez-nous",
      rights: "Tous droits réservés.",
      legal: "Mentions légales",
      privacy: "Confidentialité",
    },
    common: {
      requestDemo: "Demander une démo",
      speakToExpert: "Parler à un expert",
      exploreTechnologies: "Explorer les technologies",
      joinMasterclass: "Rejoindre une masterclass",
      contactUs: "Contacter Cellulift",
      learnMore: "En savoir plus",
      viewAll: "Voir tout",
      readMore: "Découvrir",
      sendMessage: "Envoyer le message",
      viewProgram: "Voir le programme",
      indications: "Indications",
      benefits: "Bénéfices",
      certifications: "Certifications",
      backTo: "Retour",
    },
    langSwitch: {
      fr: "FR",
      en: "EN",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      technologies: "Technologies",
      academy: "Academy",
      support: "Support",
      contact: "Contact",
      requestDemo: "Request a demo",
    },
    footer: {
      tagline: "Metamorphosis Technology",
      description:
        "The reference partner for medical aesthetics professionals across Africa — technology, education and long-term support.",
      pages: "Pages",
      contact: "Contact",
      followUs: "Follow us",
      rights: "All rights reserved.",
      legal: "Legal notice",
      privacy: "Privacy",
    },
    common: {
      requestDemo: "Request a demo",
      speakToExpert: "Speak to an expert",
      exploreTechnologies: "Explore technologies",
      joinMasterclass: "Join a masterclass",
      contactUs: "Contact Cellulift",
      learnMore: "Learn more",
      viewAll: "View all",
      readMore: "Discover",
      sendMessage: "Send message",
      viewProgram: "View program",
      indications: "Indications",
      benefits: "Benefits",
      certifications: "Certifications",
      backTo: "Back",
    },
    langSwitch: {
      fr: "FR",
      en: "EN",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
