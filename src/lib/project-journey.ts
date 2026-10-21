// Parcours « Développons votre projet ensemble » : qualification des prospects B2B en 4 étapes.
// Partagé par le parcours (navigateur) et l'API (serveur) : options, mode, délai de réponse, format de la demande.

import type { Locale } from "@/lib/i18n/config";
import type { CategoryKey } from "@/content/technologies";

type L = { fr: string; en: string };

/**
 * Mode du parcours. « prototype » (par défaut) : rien n'est envoyé, ni e-mail ni CRM ; l'API valide la demande
 * et renvoie un aperçu de la notification. « live » seulement après validation du backend, de la sécurité,
 * des notifications et des consentements (variable Vercel NEXT_PUBLIC_PROJECT_JOURNEY_MODE=live).
 */
export const journeyMode: "prototype" | "live" = process.env.NEXT_PUBLIC_PROJECT_JOURNEY_MODE === "live" ? "live" : "prototype";

/**
 * Délai de rappel annoncé dans la confirmation. À valider avant publication.
 * null = aucune promesse de délai (phrase neutre).
 */
export const journeyResponseDelay: L | null = { fr: "24 heures ouvrées", en: "24 business hours" };

export type JourneyOption = { id: string; label: L; hint?: L; icon: string };

export const journeyProfiles: JourneyOption[] = [
  { id: "medecin", label: { fr: "Médecin", en: "Physician" }, hint: { fr: "Médecine esthétique, généraliste…", en: "Aesthetic or general medicine" }, icon: "Stethoscope" },
  { id: "dermatologue", label: { fr: "Dermatologue", en: "Dermatologist" }, icon: "ScanFace" },
  { id: "kinesitherapeute", label: { fr: "Kinésithérapeute", en: "Physiotherapist" }, icon: "Activity" },
  { id: "centre-esthetique", label: { fr: "Centre esthétique", en: "Aesthetic centre" }, hint: { fr: "Institut, spa médical…", en: "Beauty institute, medical spa" }, icon: "Sparkles" },
  { id: "clinique", label: { fr: "Clinique", en: "Clinic" }, icon: "Building2" },
  { id: "autre", label: { fr: "Autre", en: "Other" }, icon: "Ellipsis" },
];

export const journeyNeeds: JourneyOption[] = [
  { id: "equipement", label: { fr: "Acquérir un équipement", en: "Acquire equipment" }, icon: "PackagePlus" },
  { id: "developper-offre", label: { fr: "Développer mon offre", en: "Grow my offer" }, hint: { fr: "Ajouter un nouveau soin", en: "Add a new treatment" }, icon: "TrendingUp" },
  { id: "accompagnement", label: { fr: "Être accompagné", en: "Get personalised support" }, hint: { fr: "Un expert pour mon projet", en: "An expert for my project" }, icon: "Handshake" },
  { id: "demonstration", label: { fr: "Voir une démonstration", en: "See a demonstration" }, icon: "Presentation" },
  { id: "formation", label: { fr: "Suivre une formation", en: "Attend a training" }, hint: { fr: "CELLULIFT Academy", en: "CELLULIFT Academy" }, icon: "GraduationCap" },
  { id: "autre", label: { fr: "Autre", en: "Other" }, icon: "MessageCircle" },
];

export const journeyDomains: JourneyOption[] = [
  { id: "epilation-laser", label: { fr: "Épilation laser", en: "Laser hair removal" }, icon: "Zap" },
  { id: "soins-peau", label: { fr: "Soins de la peau", en: "Skin care" }, hint: { fr: "Taches, cicatrices, éclat…", en: "Spots, scars, radiance" }, icon: "Droplets" },
  { id: "remodelage-corporel", label: { fr: "Remodelage corporel", en: "Body contouring" }, hint: { fr: "Amincissement, cellulite…", en: "Slimming, cellulite" }, icon: "Waves" },
  { id: "anti-age", label: { fr: "Anti-âge", en: "Anti-ageing" }, hint: { fr: "Rides, relâchement…", en: "Wrinkles, laxity" }, icon: "Hourglass" },
  { id: "autre", label: { fr: "Autre", en: "Other" }, icon: "Ellipsis" },
];

export type JourneyStepKey = "profil" | "besoin" | "domaine";
export const journeyChoices: Record<JourneyStepKey, JourneyOption[]> = {
  profil: journeyProfiles,
  besoin: journeyNeeds,
  domaine: journeyDomains,
};

export const isJourneyChoice = (step: JourneyStepKey, id: unknown): id is string =>
  typeof id === "string" && journeyChoices[step].some((o) => o.id === id);

export const journeyLabel = (step: JourneyStepKey, id: string, locale: Locale) =>
  journeyChoices[step].find((o) => o.id === id)?.label[locale] ?? id;

// Machines d'épilation (le domaine se déduit de la fiche plutôt que de la gamme, qui mélange plusieurs usages).
const hairRemovalSlugs = ["la-queen", "megalight", "synergy-plus", "new-epil-light", "sevenwaves", "alex-yag-ultra"];

/** Domaine présélectionné selon la page visitée (fiche machine, gamme), ou undefined. */
export function domainForContext(ctx: { category?: CategoryKey; slug?: string }): string | undefined {
  if (ctx.slug && hairRemovalSlugs.includes(ctx.slug)) return "epilation-laser";
  switch (ctx.category) {
    case "amincissement":
      return "remodelage-corporel";
    case "rejuvenation":
    case "photomodulation":
      return "soins-peau";
    case "hifu":
      return "anti-age";
    default:
      return undefined;
  }
}

/** Demande telle que l'API la reçoit (coordonnées + choix + contexte). */
export type ProjectLeadInput = {
  profil?: string;
  besoin?: string;
  domaine?: string;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  organization?: string;
  consent?: boolean;
  origin?: string; // page où le parcours a été rempli
  lang?: string;
  attribution?: Record<string, unknown>;
  website?: string; // champ piège
  elapsed?: number; // durée de remplissage (ms)
};

/** Statuts du suivi commercial côté CRM (proposition, à aligner sur le CRM Cellulift). */
export const leadStatuses = ["nouveau", "a-rappeler", "contacte", "qualifie", "demo-planifiee", "devis-envoye", "gagne", "perdu"] as const;
export type LeadStatus = (typeof leadStatuses)[number];
