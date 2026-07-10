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
  storyChapters: { title: string; body: string }[];
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
    storyChapters: [
      { title: "Le constat", body: "Vos patientes cherchent un résultat visage visible dès la première séance, sans discours technique interminable — c'est le premier filtre de confiance." },
      { title: "Le geste clinique", body: "Trois têtes combinées travaillent le derme profond, le grain de peau et l'ovale du visage dans une même session, sans multiplier les rendez-vous." },
      { title: "Le résultat en cabinet", body: "Un protocole en 4 à 6 séances se transforme naturellement en forfait, avec un discours de vente déjà prêt pour votre équipe." },
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
    storyChapters: [
      { title: "Le constat", body: "Le corps est le parent pauvre des cabinets qui ne traitent que le visage — pourtant c'est là que se cachent les forfaits les plus longs et les plus rentables." },
      { title: "Le geste clinique", body: "De larges applicateurs couvrent l'abdomen, les cuisses et les bras sans multiplier les passages, pour des séances plus courtes et plus confortables." },
      { title: "Le résultat en cabinet", body: "Combiné à la cryolipolyse ou l'EMS, ce système devient le socle d'un parcours corps complet, vendu en un seul forfait." },
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
    storyChapters: [
      { title: "Le constat", body: "Un seul socle laser, plusieurs indications : c'est le calcul qui permet de rentabiliser un investissement laser sans multiplier les machines." },
      { title: "Le geste clinique", body: "Les modules interchangeables s'adaptent aux lésions pigmentaires, aux rougeurs et au rajeunissement global, avec un système de refroidissement intégré." },
      { title: "Le résultat en cabinet", body: "Une plateforme, plusieurs lignes de soin au catalogue — de quoi diversifier l'offre sans complexifier la formation des équipes." },
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
    storyChapters: [
      { title: "Le constat", body: "L'épilation laser est le volume qui remplit l'agenda — mais seulement si le débit patient et le confort suivent, séance après séance." },
      { title: "Le geste clinique", body: "Une cadence de tir élevée et un refroidissement par contact permettent d'enchaîner les grandes surfaces sans rallonger la séance ni la douleur perçue." },
      { title: "Le résultat en cabinet", body: "Des réglages validés pour les peaux mates ouvrent le service à toute votre patientèle, sans réglages hasardeux ni risque de brûlure." },
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
    storyChapters: [
      { title: "Le constat", body: "Le relâchement de l'ovale du visage est la demande n°1 des patientes de 35 à 55 ans qui refusent la chirurgie mais veulent un effet réel." },
      { title: "Le geste clinique", body: "Quatre profondeurs de tir atteignent le SMAS et le derme profond en une seule séance, là où les technologies de surface ne font qu'effleurer le problème." },
      { title: "Le résultat en cabinet", body: "L'effet progressif sur 8 à 12 semaines crée un rendez-vous de suivi naturel — et une nouvelle occasion de recommandation." },
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
    storyChapters: [
      { title: "Le constat", body: "La fermeté cutanée est le soin d'entrée de gamme le plus simple à vendre — à condition d'offrir un contrôle de température fiable, séance après séance." },
      { title: "Le geste clinique", body: "Le mode mono ou multipolaire cible le derme superficiel ou profond selon la zone, avec des têtes interchangeables visage et corps." },
      { title: "Le résultat en cabinet", body: "Associée à un protocole HIFU ou microneedling, cette technologie devient la brique d'un parcours de fermeté complet, vendu en plusieurs étapes." },
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
    storyChapters: [
      { title: "Le constat", body: "Les amas graisseux localisés résistent au sport et au régime — c'est exactement le discours qui remplit un agenda de cryolipolyse." },
      { title: "Le geste clinique", body: "Un refroidissement contrôlé entre -5°C et -11°C cible les adipocytes sans agresser la peau, avec des applicateurs adaptés à chaque zone du corps." },
      { title: "Le résultat en cabinet", body: "Deux ou quatre applicateurs simultanés permettent de traiter plusieurs zones dans la même séance, doublant le panier moyen sans allonger le rendez-vous." },
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
    storyChapters: [
      { title: "Le constat", body: "Vos patients veulent un ventre plat et des fessiers fermes sans les heures de salle de sport — le renforcement musculaire par EMS répond exactement à cette attente." },
      { title: "Le geste clinique", body: "Des contractions supramaximales sollicitent les fibres musculaires bien au-delà de ce qu'un entraînement volontaire permet, en 20 à 30 minutes." },
      { title: "Le résultat en cabinet", body: "Quatre applicateurs simultanés traitent plusieurs zones à la fois, un argument fort pour vendre des forfaits multi-séances à forte marge." },
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
    storyChapters: [
      { title: "Le constat", body: "Un patient qui voit ses propres taches et pores grossis à l'écran achète un protocole ; un patient qui vous croit sur parole hésite." },
      { title: "Le geste clinique", body: "L'imagerie multi-spectrale UV, polarisée et standard objective l'état de peau en quelques secondes, avant toute recommandation de soin." },
      { title: "Le résultat en cabinet", body: "Un rapport exportable devient la preuve visuelle de vos résultats au fil des séances — et votre meilleur argument de fidélisation." },
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
    storyChapters: [
      { title: "Le constat", body: "C'est le soin qui convertit un visiteur curieux en patient régulier : résultat immédiat, zéro éviction sociale, zéro appréhension." },
      { title: "Le geste clinique", body: "Exfoliation, extraction et hydratation s'enchaînent dans le même dispositif, avec des sérums adaptés à chaque type de peau." },
      { title: "Le résultat en cabinet", body: "Un soin signature à forte fréquence de réachat, qui sert aussi de porte d'entrée vers vos protocoles plus techniques et plus rentables." },
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
    storyChapters: [
      { title: "Le constat", body: "Cicatrices d'acné et vergetures sont des demandes fréquentes que peu de cabinets savent traiter efficacement en une seule technologie." },
      { title: "Le geste clinique", body: "Une profondeur de pénétration ajustable de 0,5 à 3,5 mm, avec cartouches stériles à usage unique, sécurise chaque séance sur visage et corps." },
      { title: "Le résultat en cabinet", body: "Un protocole en plusieurs séances espacées construit un suivi patient dans la durée, avec un vrai résultat visible sur la texture de peau." },
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
    storyChapters: [
      { title: "Le constat", body: "Le resurfaçage profond reste l'indication la plus exigeante — elle demande une technologie fiable et un encadrement médical rigoureux." },
      { title: "Le geste clinique", body: "Les réglages fractionnés ajustent densité et profondeur selon l'indication, en mode ablatif ou non ablatif, avec un scanner de précision." },
      { title: "Le résultat en cabinet", body: "Une formation médicale spécifique et un suivi post-traitement documenté sécurisent chaque protocole, du premier au dernier patient." },
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
    storyChapters: [
      { title: "Le constat", body: "Les cabinets de kinésithérapie cherchent un socle capable de couvrir douleur musculo-squelettique, récupération sportive et rééducation post-traumatique." },
      { title: "Le geste clinique", body: "Électrostimulation, ondes de choc et thérapies complémentaires cohabitent sur un même socle, avec des protocoles validés pour la pratique clinique." },
      { title: "Le résultat en cabinet", body: "Un investissement unique qui couvre plusieurs indications, avec un coût de maintenance maîtrisé sur la durée." },
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
    storyChapters: [
      { title: "Le constat", body: "Le niveau de finition de votre salle de soin parle avant même la première consultation — le mobilier fait partie du diagnostic de confiance." },
      { title: "Le geste clinique", body: "Des réglages électriques multi-positions s'adaptent à chaque protocole, du soin visage à la table d'examen médical." },
      { title: "Le résultat en cabinet", body: "Des revêtements premium faciles à désinfecter et une garantie étendue sécurisent l'investissement sur plusieurs années." },
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
    storyChapters: [
      { title: "Le constat", body: "Une machine sans consommable d'origine perd en performance et en garantie — la fidélité au constructeur protège votre investissement." },
      { title: "Le geste clinique", body: "Chaque consommable est certifié compatible avec sa machine d'origine, pour préserver la performance clinique validée par LGL Expert." },
      { title: "Le résultat en cabinet", body: "Un réassort programmé évite toute rupture de stock en pleine saison, et un support technique réactif limite les arrêts d'activité." },
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
    storyChapters: blueprint.storyChapters,
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
