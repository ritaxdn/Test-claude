export type VisualMotif =
  | "wave"
  | "beam"
  | "thermal"
  | "scan"
  | "flow"
  | "grid"
  | "pulse"
  | "mechanical";

export type ProductCategory = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  motif: VisualMotif;
  narrative: string;
  stat: { value: string; label: string };
};

export type ProductTier = "Essentiel" | "Pro" | "Expert";

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  tier: ProductTier;
  tagline: string;
  description: string;
  indications: string[];
  keyFeatures: string[];
  technicalHighlights: { label: string; value: string }[];
  idealFor: string[];
  storyChapters: { title: string; body: string }[];
};

export type Certification = {
  name: string;
  description: string;
};

export type EstablishmentType =
  | "Cabinet de médecine esthétique"
  | "Clinique privée"
  | "Institut de beauté premium"
  | "Cabinet de dermatologie"
  | "Cabinet de chirurgie plastique"
  | "Centre de kinésithérapie / physiothérapie"
  | "Pharmacie / parapharmacie"
  | "Hôpital / établissement de santé"
  | "Autre";
