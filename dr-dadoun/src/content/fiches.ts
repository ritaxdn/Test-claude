// Fiches détaillées des actes (page /soins/<univers>/<acte>).
// BROUILLONS rédigés à partir des connaissances médicales usuelles : rien n'est publié tant que
// `validated` n'est pas passé à true après relecture et correction par le Dr Dadoun.

export type Fiche = {
  validated: boolean;
  how: string; // comment ça agit
  zones: string[];
  sessions: string;
  relevant: string[]; // quand ce traitement est pertinent
  notBest: { case: string; better?: string }[]; // quand ce n'est pas la meilleure option (+ alternative)
  preparation: string[];
  aftercare: string[];
  risks: string[];
  contraindications: string[];
};

export const fiches: Record<string, Fiche> = {
  "laser-co2": {
    validated: false,
    how: "Le laser CO₂ fractionné crée à la surface de la peau de très fines colonnes de micro-vaporisation, séparées par des zones de peau saine. En cicatrisant, la peau se renouvelle et produit du nouveau collagène : la texture s'affine, les cicatrices et les ridules s'atténuent. L'intensité et la densité sont réglées selon la peau et l'indication.",
    zones: ["Visage", "Contour des yeux et de la bouche", "Cou et décolleté", "Mains", "Cicatrices du corps"],
    sessions: "Une à trois séances selon l'indication, espacées de un à trois mois. Le résultat s'installe progressivement sur trois à six mois.",
    relevant: [
      "Cicatrices d'acné en creux",
      "Texture irrégulière, pores visibles",
      "Ridules installées, notamment autour des yeux et de la bouche",
      "Peau abîmée par le soleil",
      "Relâchement cutané léger",
    ],
    notBest: [
      { case: "Rides d'expression liées aux muscles (front, lion, pattes d'oie)", better: "toxine-botulique" },
      { case: "Perte de volume (joues, sillons, lèvres)", better: "acide-hyaluronique" },
      { case: "Relâchement plus profond de l'ovale et du cou", better: "endolifting" },
      { case: "Rougeurs et petits vaisseaux", better: "diode-vasculaire" },
      { case: "Mélasma : le laser peut l'aggraver" },
      { case: "Exposition solaire impossible à éviter dans les semaines qui suivent" },
      { case: "Impossibilité de prévoir une semaine d'éviction sociale" },
    ],
    preparation: [
      "Consultation préalable : examen de la peau et de son phototype",
      "Éviter le soleil et l'autobronzant pendant les quatre semaines précédentes",
      "Arrêter les rétinoïdes et exfoliants quelques jours avant, selon mes indications",
      "Signaler tout antécédent d'herpès : un traitement préventif peut être prescrit",
      "Crème anesthésiante appliquée avant la séance",
    ],
    aftercare: [
      "Rougeur et gonflement les premiers jours, puis croûtelles pendant cinq à dix jours",
      "Une rougeur légère peut persister quelques semaines",
      "Soins de cicatrisation prescrits, sans maquillage pendant la cicatrisation",
      "Protection solaire stricte pendant plusieurs mois",
    ],
    risks: [
      "Hyperpigmentation transitoire, surtout sur les peaux mates à foncées",
      "Poussée d'herpès",
      "Infection",
      "Rougeur prolongée",
      "Plus rarement : dépigmentation ou cicatrice",
    ],
    contraindications: [
      "Grossesse et allaitement",
      "Infection ou herpès actif sur la zone",
      "Traitement par isotrétinoïne dans les mois précédents",
      "Peau bronzée ou exposition solaire récente",
      "Tendance aux cicatrices chéloïdes",
      "Médicaments photosensibilisants, certaines maladies auto-immunes ou troubles de la cicatrisation",
    ],
  },

  endolifting: {
    validated: false,
    how: "Une fibre laser très fine, de l'épaisseur d'un cheveu à quelques dixièmes de millimètre, est glissée sous la peau par un minuscule point d'entrée, sans incision. L'énergie laser chauffe les tissus en profondeur : ils se rétractent et produisent du nouveau collagène, et les petits amas graisseux localisés diminuent. L'effet tenseur est en partie visible rapidement, puis s'améliore pendant plusieurs mois.",
    zones: ["Ovale du visage et bajoues", "Double menton", "Cou", "Autres zones selon l'indication"],
    sessions: "En général une seule séance. Le résultat s'installe progressivement sur trois à six mois ; une séance complémentaire peut être discutée ensuite.",
    relevant: [
      "Relâchement débutant à modéré de l'ovale",
      "Bajoues qui apparaissent",
      "Double menton ou petit amas graisseux sous le menton",
      "Cou qui perd sa tenue",
      "Souhait d'une alternative non chirurgicale, avec une peau de qualité encore correcte",
    ],
    notBest: [
      { case: "Relâchement très marqué avec excès de peau important : la chirurgie donne un meilleur résultat" },
      { case: "Perte de volume", better: "acide-hyaluronique" },
      { case: "Texture, ridules fines et cicatrices", better: "laser-co2" },
      { case: "Rides d'expression", better: "toxine-botulique" },
      { case: "Surcharge graisseuse importante" },
    ],
    preparation: [
      "Consultation préalable : évaluation du relâchement et de la qualité de la peau",
      "Signaler tout traitement anticoagulant ou antiagrégant, ainsi que la prise d'aspirine ou d'anti-inflammatoires",
      "Signaler les injections, fils ou implants déjà présents dans la zone",
      "Venir sans maquillage",
    ],
    aftercare: [
      "Anesthésie locale pendant la séance",
      "Gonflement modéré pendant quelques jours, parfois des bleus",
      "Zone sensible ou légèrement indurée pendant quelques semaines",
      "Reprise rapide des activités ; une contention peut être conseillée",
    ],
    risks: [
      "Bleus et gonflement",
      "Indurations ou petits nodules transitoires",
      "Asymétrie",
      "Rarement : brûlure, infection, atteinte nerveuse transitoire",
    ],
    contraindications: [
      "Grossesse et allaitement",
      "Troubles de la coagulation ou traitement anticoagulant, selon avis médical",
      "Infection sur la zone",
      "Certaines maladies auto-immunes",
      "Attentes qui dépassent ce que la technique peut apporter",
    ],
  },
};

export const getFiche = (slug: string) => {
  const f = fiches[slug];
  return f?.validated ? f : undefined;
};
