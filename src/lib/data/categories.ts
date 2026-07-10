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
    motif: "wave",
    narrative:
      "Le visage est la première demande de toute patientèle esthétique — et le terrain où se joue la confiance dans votre expertise dès la première consultation.",
    stat: { value: "4-6", label: "séances par protocole signature" },
  },
  {
    slug: "technologies-corps",
    name: "Technologies corps",
    shortDescription: "Remodelage, fermeté et raffermissement corporel",
    description:
      "Solutions pour le remodelage corporel, la fermeté cutanée et le traitement de la cellulite, pensées pour des protocoles rentables en institut ou clinique.",
    icon: "PersonStanding",
    motif: "flow",
    narrative:
      "Le corps est le segment le moins exploité des cabinets esthétiques — et celui qui offre les forfaits les plus longs, donc les plus rentables sur la durée.",
    stat: { value: "6-10", label: "séances par forfait corps" },
  },
  {
    slug: "lasers-medicaux-esthetiques",
    name: "Lasers médicaux et esthétiques",
    shortDescription: "Plateformes laser multi-indications",
    description:
      "Lasers de dernière génération pour un large spectre d'indications médico-esthétiques, combinant précision clinique et confort patient.",
    icon: "Zap",
    motif: "beam",
    narrative:
      "Un socle laser modulaire, plusieurs indications : la logique qui permet de rentabiliser un investissement laser sans multiplier les machines en salle de soin.",
    stat: { value: "1", label: "socle, plusieurs indications" },
  },
  {
    slug: "epilation-laser",
    name: "Épilation laser",
    shortDescription: "Épilation définitive tous phototypes",
    description:
      "Systèmes d'épilation laser haute cadence conçus pour les instituts et cliniques à fort volume, avec confort renforcé et sécurité optimale sur tous types de peau.",
    icon: "Waves",
    motif: "beam",
    narrative:
      "L'épilation laser est le volume qui remplit l'agenda toute l'année — à condition d'offrir cadence, confort et sécurité sur tous les phototypes.",
    stat: { value: "I-VI", label: "phototypes traités en sécurité" },
  },
  {
    slug: "hifu",
    name: "HIFU",
    shortDescription: "Ultrasons focalisés de haute intensité",
    description:
      "Technologie HIFU pour le lifting non invasif du visage et du corps, ciblant les plans profonds sans temps de récupération.",
    icon: "Radar",
    motif: "wave",
    narrative:
      "Le relâchement de l'ovale du visage est la première demande des patientes qui refusent la chirurgie mais veulent un effet réellement mesurable.",
    stat: { value: "8-12", label: "semaines pour l'effet complet" },
  },
  {
    slug: "radiofrequence",
    name: "Radiofréquence",
    shortDescription: "Fermeté cutanée et stimulation du collagène",
    description:
      "Plateformes de radiofréquence mono et multipolaire pour le raffermissement du visage et du corps, seules ou en protocoles combinés.",
    icon: "AudioLines",
    motif: "pulse",
    narrative:
      "La fermeté cutanée est le soin d'appel le plus simple à recommander — à condition de maîtriser précisément la température délivrée à chaque passage.",
    stat: { value: "2", label: "modes : mono et multipolaire" },
  },
  {
    slug: "cryolipolyse",
    name: "Cryolipolyse",
    shortDescription: "Réduction ciblée des amas graisseux",
    description:
      "Solutions de cryolipolyse pour le traitement non invasif des amas graisseux localisés, avec applicateurs adaptés à toutes les zones du corps.",
    icon: "Snowflake",
    motif: "thermal",
    narrative:
      "Les amas graisseux résistants au sport et au régime sont le discours qui remplit un agenda de cryolipolyse, saison après saison.",
    stat: { value: "-11°C", label: "refroidissement contrôlé" },
  },
  {
    slug: "ems-renforcement-musculaire",
    name: "EMS / Renforcement musculaire",
    shortDescription: "Stimulation musculaire électromagnétique",
    description:
      "Technologies EMS pour le renforcement musculaire et la sculpture corporelle, très recherchées en complément des protocoles minceur.",
    icon: "Dumbbell",
    motif: "pulse",
    narrative:
      "Un ventre plat et des fessiers fermes sans les heures de salle de sport : l'EMS répond à une attente que peu de cabinets savent adresser aujourd'hui.",
    stat: { value: "20-30", label: "minutes par séance" },
  },
  {
    slug: "analyse-de-peau",
    name: "Analyse de peau",
    shortDescription: "Diagnostic cutané haute précision",
    description:
      "Systèmes de diagnostic cutané pour objectiver l'état de peau, personnaliser les protocoles et démontrer les résultats aux patients dans le temps.",
    icon: "ScanFace",
    motif: "scan",
    narrative:
      "Un patient qui voit ses propres taches et pores grossis à l'écran achète un protocole ; un patient qui vous croit sur parole hésite.",
    stat: { value: "3", label: "modes d'imagerie combinés" },
  },
  {
    slug: "hydrafacial-hydrodermabrasion",
    name: "Hydrafacial et hydrodermabrasion",
    shortDescription: "Nettoyage profond et hydratation",
    description:
      "Soins d'hydra-nettoyage pour un teint éclatant immédiat, parfaits en soin signature ou en complément de protocoles plus techniques.",
    icon: "Droplets",
    motif: "flow",
    narrative:
      "Le soin qui convertit un visiteur curieux en patient régulier : résultat immédiat, zéro éviction sociale, zéro appréhension.",
    stat: { value: "0", label: "jour d'éviction sociale" },
  },
  {
    slug: "microneedling-rf-fractionnee",
    name: "Microneedling / RF fractionnée",
    shortDescription: "Régénération cutanée fractionnée",
    description:
      "Systèmes de microneedling et RF fractionnée pour le remodelage de la texture de peau, les cicatrices et le relâchement modéré.",
    icon: "CircuitBoard",
    motif: "grid",
    narrative:
      "Cicatrices d'acné et vergetures sont des demandes fréquentes que peu de cabinets savent traiter efficacement avec une seule technologie.",
    stat: { value: "0,5-3,5mm", label: "profondeur ajustable" },
  },
  {
    slug: "co2-fractionne",
    name: "CO₂ fractionné",
    shortDescription: "Resurfaçage laser fractionné",
    description:
      "Lasers CO₂ fractionnés pour le resurfaçage cutané, les cicatrices et le rajeunissement profond, en usage médical encadré.",
    icon: "Flame",
    motif: "beam",
    narrative:
      "Le resurfaçage profond reste l'indication la plus exigeante — elle impose une technologie fiable et un encadrement médical rigoureux.",
    stat: { value: "2", label: "modes : ablatif et non ablatif" },
  },
  {
    slug: "physiotherapie-reeducation",
    name: "Physiothérapie et rééducation",
    shortDescription: "Équipements de rééducation fonctionnelle",
    description:
      "Gamme d'équipements pour la kinésithérapie et la rééducation fonctionnelle, pensée pour les centres de soins et cabinets spécialisés.",
    icon: "Activity",
    motif: "pulse",
    narrative:
      "Douleur musculo-squelettique, récupération sportive, rééducation post-traumatique : un socle capable de couvrir les trois usages du quotidien.",
    stat: { value: "3", label: "usages cliniques couverts" },
  },
  {
    slug: "tables-equipements-medicaux",
    name: "Tables et équipements médicaux",
    shortDescription: "Mobilier technique et équipements de cabinet",
    description:
      "Tables de soin, mobilier technique et équipements complémentaires pour équiper intégralement un cabinet ou une clinique.",
    icon: "Layers",
    motif: "mechanical",
    narrative:
      "Le niveau de finition de votre salle de soin parle avant même la première consultation — le mobilier fait partie du diagnostic de confiance.",
    stat: { value: "100%", label: "cabinet équipé de bout en bout" },
  },
  {
    slug: "consommables-accessoires",
    name: "Consommables et accessoires",
    shortDescription: "Consommables certifiés pour chaque technologie",
    description:
      "Consommables, pièces à main et accessoires certifiés, garantissant la performance et la longévité de vos équipements LGL Expert.",
    icon: "PackageCheck",
    motif: "mechanical",
    narrative:
      "Une machine sans consommable d'origine perd en performance et en garantie — la fidélité au constructeur protège durablement votre investissement.",
    stat: { value: "100%", label: "compatibilité garantie" },
  },
];

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return categories.find((category) => category.slug === slug);
}
