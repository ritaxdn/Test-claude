// Règles du formulaire de contact, partagées par le formulaire (navigateur) et l'API (serveur) :
// champs affichés et obligatoires selon le parcours, contrôles de format, ville normalisée pour Analytics.

export type Parcours = "demo" | "devis" | "expert" | "masterclass" | "support" | "partenariat" | "autre";

export type ContactField =
  | "name"
  | "organization"
  | "phone"
  | "email"
  | "city"
  | "specialty"
  | "machine"
  | "serial"
  | "session"
  | "message";

type Rule = {
  /** Champs affichés, dans l'ordre du formulaire */
  fields: ContactField[];
  required: ContactField[];
  /** Famille de destinataires (admin@cellulift.ma par défaut, variables Vercel CONTACT_EMAIL_*) */
  inbox: "main" | "academy" | "support" | "partnerships";
  /** Événement Analytics à l'envoi (null = aucun) et valeur « parcours » transmise */
  event: { name: "generate_lead" | "support_request" | "partnership_request"; parcours?: string } | null;
  /** Étiquette en tête d'objet de l'e-mail, ex. [DEVIS] */
  tag: string;
};

const commercial: ContactField[] = ["name", "organization", "phone", "email", "city", "specialty", "machine", "message"];
const commercialRequired: ContactField[] = ["name", "organization", "phone", "email", "city", "specialty"];

export const contactRules: Record<Parcours, Rule> = {
  demo: { fields: commercial, required: commercialRequired, inbox: "main", event: { name: "generate_lead", parcours: "demo" }, tag: "DÉMO" },
  devis: { fields: commercial, required: commercialRequired, inbox: "main", event: { name: "generate_lead", parcours: "devis" }, tag: "DEVIS" },
  expert: { fields: commercial, required: commercialRequired, inbox: "main", event: { name: "generate_lead", parcours: "expert" }, tag: "EXPERT" },
  masterclass: {
    fields: ["name", "organization", "phone", "email", "city", "specialty", "session", "message"],
    required: ["name", "phone", "email", "city", "specialty"],
    inbox: "academy",
    event: { name: "generate_lead", parcours: "academy" },
    tag: "ACADEMY",
  },
  support: {
    fields: ["name", "phone", "email", "city", "specialty", "machine", "serial", "message"],
    required: ["name", "phone", "email", "city", "machine", "message"],
    inbox: "support",
    event: { name: "support_request" },
    tag: "SUPPORT",
  },
  partenariat: {
    fields: ["name", "organization", "phone", "email", "city", "specialty", "message"],
    required: ["name", "organization", "phone", "email", "city", "message"],
    inbox: "partnerships",
    event: { name: "partnership_request" },
    tag: "PARTENARIAT",
  },
  autre: {
    fields: ["name", "phone", "email", "city", "specialty", "message"],
    required: ["name", "phone", "email", "city", "message"],
    inbox: "main",
    event: null,
    tag: "AUTRE",
  },
};

export const isParcours = (value: unknown): value is Parcours =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(contactRules, value);

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Téléphone : chiffres, espaces, +, points, tirets, parenthèses ; 9 à 15 chiffres (06…, +212…, 00212…). */
export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return /^[\d\s+().-]+$/.test(value.trim()) && digits.length >= 9 && digits.length <= 15;
}

/** Numéro au format international pour un lien WhatsApp (wa.me) ; un numéro marocain en 0… devient 212…. */
export function whatsappNumber(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (/^0[5-7]\d{8}$/.test(digits)) digits = `212${digits.slice(1)}`;
  return digits.length >= 9 ? digits : null;
}

// Villes reconnues pour Analytics (variantes d'écriture → nom unique). Toute autre saisie part en « Autre ».
// La ville saisie telle quelle reste dans l'e-mail commercial.
const cityVariants: Record<string, string[]> = {
  Casablanca: ["casablanca", "casa", "dar el beida", "dar al baida", "ddar el beida"],
  Rabat: ["rabat"],
  Marrakech: ["marrakech", "marrakesh", "marakech", "marrakch", "marrakeche"],
  Tanger: ["tanger", "tangier", "tangiers", "tanja"],
  Fès: ["fes", "fez"],
  Agadir: ["agadir"],
  Meknès: ["meknes", "meknas"],
  Oujda: ["oujda"],
  Kénitra: ["kenitra"],
  Tétouan: ["tetouan", "tetuan"],
  "El Jadida": ["el jadida", "eljadida", "jadida"],
  Mohammedia: ["mohammedia", "mohamedia"],
  Salé: ["sale"],
  Témara: ["temara"],
  Nador: ["nador"],
  Safi: ["safi"],
  "Béni Mellal": ["beni mellal", "benimellal"],
  Laâyoune: ["laayoune", "layoune", "el aaiun"],
  Dakhla: ["dakhla"],
  Dakar: ["dakar"],
  Paris: ["paris"],
};

/** Ville saisie librement → nom normalisé pour Analytics (« Autre » si non reconnue). */
export function normalizeCity(value: string) {
  const key = value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .trim();
  if (!key) return "";
  for (const [city, variants] of Object.entries(cityVariants)) if (variants.includes(key)) return city;
  return "Autre";
}

/** Suggestions affichées sous le champ Ville (n'empêchent pas de saisir une autre ville). */
export const citySuggestions = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Fès", "Agadir", "Meknès", "Oujda", "Kénitra", "Tétouan", "El Jadida", "Mohammedia", "Dakar"];
