import type { ProductCategory } from "@/lib/types";

/**
 * Product categories requested by Cellulift. Copy is illustrative and should
 * be reviewed against LGL Expert's official positioning before launch.
 */
export const categories: ProductCategory[] = [
  {
    slug: "technologies-visage",
    name: "Technologies visage",
    shortDescription: "Rajeunissement, fermeté et éclat du visage",
    description:
      "Plateformes dédiées aux traitements du visage : fermeté, rajeunissement, éclat et texture de peau, pour des résultats visibles dès les premières séances.",
    icon: "Sparkles",
  },
  {
    slug: "technologies-corps",
    name: "Technologies corps",
    shortDescription: "Remodelage, fermeté et raffermissement corporel",
    description:
      "Solutions pour le remodelage corporel, la fermeté cutanée et le traitement de la cellulite, pensées pour des protocoles rentables en institut ou clinique.",
    icon: "PersonStanding",
  },
  {
    slug: "lasers-medicaux-esthetiques",
    name: "Lasers médicaux et esthétiques",
    shortDescription: "Plateformes laser multi-indications",
    description:
      "Lasers de dernière génération pour un large spectre d'indications médico-esthétiques, combinant précision clinique et confort patient.",
    icon: "Zap",
  },
  {
    slug: "epilation-laser",
    name: "Épilation laser",
    shortDescription: "Épilation définitive tous phototypes",
    description:
      "Systèmes d'épilation laser haute cadence conçus pour les instituts et cliniques à fort volume, avec confort renforcé et sécurité optimale sur tous types de peau.",
    icon: "Waves",
  },
  {
    slug: "hifu",
    name: "HIFU",
    shortDescription: "Ultrasons focalisés de haute intensité",
    description:
      "Technologie HIFU pour le lifting non invasif du visage et du corps, ciblant les plans profonds sans temps de récupération.",
    icon: "Radar",
  },
  {
    slug: "radiofrequence",
    name: "Radiofréquence",
    shortDescription: "Fermeté cutanée et stimulation du collagène",
    description:
      "Plateformes de radiofréquence mono et multipolaire pour le raffermissement du visage et du corps, seules ou en protocoles combinés.",
    icon: "AudioLines",
  },
  {
    slug: "cryolipolyse",
    name: "Cryolipolyse",
    shortDescription: "Réduction ciblée des amas graisseux",
    description:
      "Solutions de cryolipolyse pour le traitement non invasif des amas graisseux localisés, avec applicateurs adaptés à toutes les zones du corps.",
    icon: "Snowflake",
  },
  {
    slug: "ems-renforcement-musculaire",
    name: "EMS / Renforcement musculaire",
    shortDescription: "Stimulation musculaire électromagnétique",
    description:
      "Technologies EMS pour le renforcement musculaire et la sculpture corporelle, très recherchées en complément des protocoles minceur.",
    icon: "Dumbbell",
  },
  {
    slug: "analyse-de-peau",
    name: "Analyse de peau",
    shortDescription: "Diagnostic cutané haute précision",
    description:
      "Systèmes de diagnostic cutané pour objectiver l'état de peau, personnaliser les protocoles et démontrer les résultats aux patients dans le temps.",
    icon: "ScanFace",
  },
  {
    slug: "hydrafacial-hydrodermabrasion",
    name: "Hydrafacial et hydrodermabrasion",
    shortDescription: "Nettoyage profond et hydratation",
    description:
      "Soins d'hydra-nettoyage pour un teint éclatant immédiat, parfaits en soin signature ou en complément de protocoles plus techniques.",
    icon: "Droplets",
  },
  {
    slug: "microneedling-rf-fractionnee",
    name: "Microneedling / RF fractionnée",
    shortDescription: "Régénération cutanée fractionnée",
    description:
      "Systèmes de microneedling et RF fractionnée pour le remodelage de la texture de peau, les cicatrices et le relâchement modéré.",
    icon: "CircuitBoard",
  },
  {
    slug: "co2-fractionne",
    name: "CO₂ fractionné",
    shortDescription: "Resurfaçage laser fractionné",
    description:
      "Lasers CO₂ fractionnés pour le resurfaçage cutané, les cicatrices et le rajeunissement profond, en usage médical encadré.",
    icon: "Flame",
  },
  {
    slug: "physiotherapie-reeducation",
    name: "Physiothérapie et rééducation",
    shortDescription: "Équipements de rééducation fonctionnelle",
    description:
      "Gamme d'équipements pour la kinésithérapie et la rééducation fonctionnelle, pensée pour les centres de soins et cabinets spécialisés.",
    icon: "Activity",
  },
  {
    slug: "tables-equipements-medicaux",
    name: "Tables et équipements médicaux",
    shortDescription: "Mobilier technique et équipements de cabinet",
    description:
      "Tables de soin, mobilier technique et équipements complémentaires pour équiper intégralement un cabinet ou une clinique.",
    icon: "Layers",
  },
  {
    slug: "consommables-accessoires",
    name: "Consommables et accessoires",
    shortDescription: "Consommables certifiés pour chaque technologie",
    description:
      "Consommables, pièces à main et accessoires certifiés, garantissant la performance et la longévité de vos équipements LGL Expert.",
    icon: "PackageCheck",
  },
];

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return categories.find((category) => category.slug === slug);
}
