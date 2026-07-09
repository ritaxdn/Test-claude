import type { Product, ProductTier } from "@/lib/types";

/**
 * PLACEHOLDER CATALOG DATA
 * ------------------------------------------------------------------
 * These 45 references give Cellulift a realistic, fully structured
 * catalog (names, taglines, specs, indications) across every category
 * requested. They are NOT the real LGL Expert model names or specs.
 * Replace each entry with the official LGL Expert reference, technical
 * datasheet values and product photography before going live.
 * ------------------------------------------------------------------
 */

type TierSpec = {
  tier: ProductTier;
  suffix: string;
  highlights: { label: string; value: string }[];
  idealFor: string[];
};

type CategoryBlueprint = {
  categorySlug: string;
  family: string;
  tagline: string;
  description: string;
  indications: string[];
  keyFeatures: string[];
  tiers: TierSpec[];
};

const defaultTiers = (
  power: string,
  handles: string
): TierSpec[] => [
  {
    tier: "Essentiel",
    suffix: "Essentiel",
    highlights: [
      { label: "Puissance", value: power },
      { label: "Pièces à main", value: "1 pièce à main" },
      { label: "Écran", value: "Écran tactile 10\"" },
      { label: "Idéal pour", value: "Démarrage d'activité" },
    ],
    idealFor: ["Institut premium", "Cabinet en développement"],
  },
  {
    tier: "Pro",
    suffix: "Pro",
    highlights: [
      { label: "Puissance", value: power },
      { label: "Pièces à main", value: handles },
      { label: "Écran", value: "Écran tactile 15\" HD" },
      { label: "Idéal pour", value: "Cabinets à volume établi" },
    ],
    idealFor: ["Cabinet de médecine esthétique", "Clinique privée"],
  },
  {
    tier: "Expert",
    suffix: "Expert",
    highlights: [
      { label: "Puissance", value: power },
      { label: "Pièces à main", value: handles },
      { label: "Écran", value: "Écran tactile 21\" + logiciel protocoles" },
      { label: "Idéal pour", value: "Structures multi-praticiens" },
    ],
    idealFor: ["Clinique privée", "Centre de médecine esthétique"],
  },
];

const blueprints: CategoryBlueprint[] = [
  {
    categorySlug: "technologies-visage",
    family: "Facia",
    tagline: "Fermeté, éclat et rajeunissement du visage",
    description:
      "Plateforme multi-technologies dédiée au rajeunissement facial : elle combine stimulation du collagène, amélioration du grain de peau et effet lifting immédiat, pour des protocoles signature à forte valeur perçue.",
    indications: ["Relâchement cutané léger à modéré", "Teint terne", "Rides fines", "Contour du visage"],
    keyFeatures: [
      "Protocoles pré-réglés modifiables",
      "Suivi patient et avant/après intégré",
      "Consommables à faible coût d'exploitation",
      "Formation clinique incluse à l'installation",
    ],
    tiers: defaultTiers("3 technologies combinées", "3 pièces à main"),
  },
  {
    categorySlug: "technologies-corps",
    family: "Corpus",
    tagline: "Remodelage corporel et fermeté cutanée",
    description:
      "Système corps polyvalent associant raffermissement cutané et remodelage silhouette, conçu pour bâtir des forfaits récurrents et fidéliser une patientèle sur plusieurs séances.",
    indications: ["Relâchement cutané corporel", "Peau d'orange", "Perte de fermeté post-partum ou post-amaigrissement"],
    keyFeatures: [
      "Applicateurs larges pour zones étendues",
      "Protocoles combinables avec cryolipolyse et EMS",
      "Confort patient optimisé, faible échauffement cutané",
      "Rentabilité calculée sur forfaits de 6 à 10 séances",
    ],
    tiers: defaultTiers("2 modes de traitement", "2 pièces à main"),
  },
  {
    categorySlug: "lasers-medicaux-esthetiques",
    family: "Lumis",
    tagline: "Plateforme laser multi-indications",
    description:
      "Plateforme laser modulaire couvrant plusieurs indications médico-esthétiques courantes sur un socle unique, pour mutualiser l'investissement et diversifier l'offre de soins.",
    indications: ["Lésions pigmentaires", "Rougeurs diffuses", "Rajeunissement cutané global"],
    keyFeatures: [
      "Modules interchangeables selon indication",
      "Refroidissement intégré pour le confort patient",
      "Compatible peaux mates avec réglages dédiés",
      "Maintenance et pièces disponibles localement",
    ],
    tiers: defaultTiers("Modulaire, 2 longueurs d'onde", "2 pièces à main"),
  },
  {
    categorySlug: "epilation-laser",
    family: "Puralaz",
    tagline: "Épilation définitive haute cadence",
    description:
      "Système d'épilation laser pensé pour un débit patient élevé sans compromis sur le confort ni la sécurité, avec des réglages validés pour tous phototypes, y compris les peaux mates.",
    indications: ["Épilation corps entier", "Zones sensibles", "Tous phototypes I à VI"],
    keyFeatures: [
      "Répétition rapide pour les grandes surfaces",
      "Système de refroidissement par contact intégré",
      "Réglages dédiés peaux mates et bronzées",
      "Sécurité oculaire renforcée patient et praticien",
    ],
    tiers: defaultTiers("Diode/Alexandrite haute cadence", "1 pièce à main grande surface"),
  },
  {
    categorySlug: "hifu",
    family: "Liftra",
    tagline: "Lifting non invasif par ultrasons focalisés",
    description:
      "Technologie HIFU ciblant les plans profonds du visage et du corps pour un effet lifting progressif, sans éviction sociale, avec des résultats évolutifs sur 8 à 12 semaines.",
    indications: ["Relâchement ovale du visage", "Double menton", "Fermeté du cou et du décolleté"],
    keyFeatures: [
      "Cartouches multi-profondeurs (1,5 / 3 / 4,5 / 8 mm)",
      "Visualisation échographique en temps réel (selon modèle)",
      "Protocole en une séance avec effet progressif",
      "Faible taux de consommables par rapport aux concurrents",
    ],
    tiers: defaultTiers("4 profondeurs de tir", "1 sonde multi-cartouches"),
  },
  {
    categorySlug: "radiofrequence",
    family: "Thermia",
    tagline: "Fermeté cutanée par radiofréquence",
    description:
      "Plateforme de radiofréquence mono et multipolaire pour stimuler la production de collagène, en soin seul ou en complément d'un protocole HIFU ou microneedling.",
    indications: ["Relâchement cutané léger", "Perte d'éclat", "Cernes et contour des yeux (selon modèle)"],
    keyFeatures: [
      "Contrôle précis de la température cutanée",
      "Têtes interchangeables visage et corps",
      "Compatible protocoles combinés",
      "Retour sur investissement rapide sur soins signature",
    ],
    tiers: defaultTiers("Mono et multipolaire", "2 têtes interchangeables"),
  },
  {
    categorySlug: "cryolipolyse",
    family: "Frigya",
    tagline: "Réduction ciblée des amas graisseux",
    description:
      "Solution de cryolipolyse pour le traitement non invasif des amas graisseux résistants, avec applicateurs adaptés à l'abdomen, aux poignées d'amour et aux zones plus fines.",
    indications: ["Amas graisseux localisés", "Poignées d'amour", "Culotte de cheval", "Double menton (petit applicateur)"],
    keyFeatures: [
      "Double ou quadruple applicateurs simultanés",
      "Plage de température sécurisée et contrôlée",
      "Applicateurs de tailles multiples inclus",
      "Protocoles de vente en forfaits corps entier",
    ],
    tiers: defaultTiers("Refroidissement contrôlé -5°C à -11°C", "2 applicateurs simultanés"),
  },
  {
    categorySlug: "ems-renforcement-musculaire",
    family: "Tonis",
    tagline: "Renforcement musculaire par électromagnétisme",
    description:
      "Technologie EMS haute intensité pour stimuler des contractions musculaires supramaximales, très demandée en complément des protocoles minceur pour un résultat silhouette visible.",
    indications: ["Renforcement abdominal", "Fessiers", "Bras et mollets (selon applicateurs)"],
    keyFeatures: [
      "Applicateurs multiples pour traiter plusieurs zones",
      "Intensité progressive et protocoles personnalisables",
      "Séances courtes à forte valeur perçue",
      "Combinable avec cryolipolyse pour un protocole complet",
    ],
    tiers: defaultTiers("Jusqu'à 100% intensité EMS", "4 applicateurs simultanés"),
  },
  {
    categorySlug: "analyse-de-peau",
    family: "Derma Scan",
    tagline: "Diagnostic cutané professionnel",
    description:
      "Système d'analyse de peau haute précision pour objectiver rides, taches, pores et hydratation, renforcer la crédibilité du diagnostic et démontrer l'évolution des résultats au patient.",
    indications: ["Diagnostic avant/après", "Suivi de protocole", "Aide à la vente de soins personnalisés"],
    keyFeatures: [
      "Imagerie multi-spectrale (UV, polarisée, standard)",
      "Rapport patient exportable en un clic",
      "Base de données patient sécurisée",
      "Argument de vente différenciant en consultation",
    ],
    tiers: defaultTiers("Imagerie multi-spectrale", "1 module d'acquisition"),
  },
  {
    categorySlug: "hydrafacial-hydrodermabrasion",
    family: "Aqualux",
    tagline: "Nettoyage profond et hydratation immédiate",
    description:
      "Soin d'hydra-nettoyage en trois étapes (exfoliation, extraction, hydratation) offrant un résultat immédiat et une excellente satisfaction patient dès la première séance.",
    indications: ["Teint terne", "Pores obstrués", "Déshydratation cutanée"],
    keyFeatures: [
      "Système d'aspiration et de sérums intégrés",
      "Résultat visible immédiat, sans éviction sociale",
      "Soin signature à forte fréquence de réachat",
      "Consommables sérums disponibles en gamme complète",
    ],
    tiers: defaultTiers("3 étapes en 1 dispositif", "1 pièce à main multi-embouts"),
  },
  {
    categorySlug: "microneedling-rf-fractionnee",
    family: "Regenis",
    tagline: "Régénération cutanée fractionnée",
    description:
      "Système de microneedling et RF fractionnée pour remodeler la texture de peau, atténuer les cicatrices d'acné et traiter le relâchement modéré, avec des aiguilles à usage unique.",
    indications: ["Cicatrices d'acné", "Vergetures", "Relâchement modéré", "Pores dilatés"],
    keyFeatures: [
      "Profondeur de pénétration ajustable",
      "Cartouches d'aiguilles stériles à usage unique",
      "Compatible visage et corps",
      "Protocoles combinables avec PRP (selon réglementation locale)",
    ],
    tiers: defaultTiers("Profondeur 0,5 à 3,5 mm", "1 pièce à main + cartouches"),
  },
  {
    categorySlug: "co2-fractionne",
    family: "Vulcan",
    tagline: "Resurfaçage laser fractionné",
    description:
      "Laser CO₂ fractionné pour le resurfaçage cutané médical, les cicatrices et le rajeunissement profond, à utiliser exclusivement sous encadrement médical qualifié.",
    indications: ["Cicatrices", "Rajeunissement profond", "Vergetures matures"],
    keyFeatures: [
      "Réglages fractionnés ajustables (densité, profondeur)",
      "Mode ablatif et non ablatif selon protocole",
      "Formation médicale spécifique fournie",
      "Suivi post-traitement documenté",
    ],
    tiers: defaultTiers("Mode fractionné ajustable", "1 scanner + pièce à main"),
  },
  {
    categorySlug: "physiotherapie-reeducation",
    family: "Kinera",
    tagline: "Rééducation fonctionnelle et récupération",
    description:
      "Gamme d'équipements pour la kinésithérapie et la rééducation fonctionnelle, associant électrostimulation, ondes de choc et thérapies complémentaires pour les centres de soins.",
    indications: ["Douleurs musculo-squelettiques", "Récupération sportive", "Rééducation post-traumatique"],
    keyFeatures: [
      "Modes thérapeutiques multiples sur un socle",
      "Protocoles validés pour la pratique clinique",
      "Adapté cabinets libéraux et centres spécialisés",
      "Faible coût de maintenance",
    ],
    tiers: defaultTiers("Multi-thérapies", "2 applicateurs"),
  },
  {
    categorySlug: "tables-equipements-medicaux",
    family: "Confort Line",
    tagline: "Mobilier technique de cabinet",
    description:
      "Tables de soin électriques et mobilier technique conçus pour équiper intégralement un cabinet ou une clinique, avec un haut niveau de finition adapté à un environnement premium.",
    indications: ["Équipement de cabinet", "Salle de soin", "Salle de consultation"],
    keyFeatures: [
      "Réglages électriques multi-positions",
      "Revêtements premium faciles à désinfecter",
      "Compatible avec tous les protocoles esthétiques et médicaux",
      "Garantie étendue sur la structure",
    ],
    tiers: defaultTiers("Réglage électrique multi-position", "Accoudoirs et têtière inclus"),
  },
  {
    categorySlug: "consommables-accessoires",
    family: "Care Line",
    tagline: "Consommables certifiés pour chaque technologie",
    description:
      "Gamme complète de consommables, pièces à main de rechange et accessoires certifiés d'origine, garantissant la performance et la longévité de chaque plateforme LGL Expert.",
    indications: ["Maintenance préventive", "Renouvellement de consommables", "Extension de garantie"],
    keyFeatures: [
      "Compatibilité garantie avec chaque machine du catalogue",
      "Livraison régulière programmable",
      "Support technique réactif",
      "Tarifs préférentiels pour les clients sous contrat",
    ],
    tiers: [
      {
        tier: "Essentiel",
        suffix: "Starter Kit",
        highlights: [
          { label: "Contenu", value: "Kit de démarrage" },
          { label: "Compatibilité", value: "1 famille de machines" },
          { label: "Réassort", value: "Sur devis" },
          { label: "Idéal pour", value: "Nouvelle installation" },
        ],
        idealFor: ["Institut premium", "Cabinet en développement"],
      },
      {
        tier: "Pro",
        suffix: "Pack Fidélité",
        highlights: [
          { label: "Contenu", value: "Pack trimestriel" },
          { label: "Compatibilité", value: "Multi-machines" },
          { label: "Réassort", value: "Programmé" },
          { label: "Idéal pour", value: "Cabinets à volume établi" },
        ],
        idealFor: ["Cabinet de médecine esthétique", "Clinique privée"],
      },
      {
        tier: "Expert",
        suffix: "Contrat Maintenance+",
        highlights: [
          { label: "Contenu", value: "Consommables + maintenance" },
          { label: "Compatibilité", value: "Parc multi-machines" },
          { label: "Réassort", value: "Automatique" },
          { label: "Idéal pour", value: "Structures multi-praticiens" },
        ],
        idealFor: ["Clinique privée", "Hôpital / établissement de santé"],
      },
    ],
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const products: Product[] = blueprints.flatMap((blueprint) =>
  blueprint.tiers.map((tierSpec) => ({
    slug: slugify(`${blueprint.family}-${tierSpec.suffix}`),
    name: `${blueprint.family} ${tierSpec.suffix}`,
    categorySlug: blueprint.categorySlug,
    tier: tierSpec.tier,
    tagline: blueprint.tagline,
    description: blueprint.description,
    indications: blueprint.indications,
    keyFeatures: blueprint.keyFeatures,
    technicalHighlights: tierSpec.highlights,
    idealFor: tierSpec.idealFor,
  }))
);

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug)
    .slice(0, limit);
}
