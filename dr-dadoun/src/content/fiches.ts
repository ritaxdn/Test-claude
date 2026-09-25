// Fiches détaillées des actes (page /soins/<univers>/<acte>).
// BROUILLONS rédigés à partir des connaissances médicales usuelles : rien n'est publié tant que
// `validated` n'est pas passé à true après relecture et correction par le Dr Dadoun.
// Aperçu des brouillons (déploiement de prévisualisation uniquement) : variable FICHES_PREVIEW=1.

export type Fiche = {
  validated: boolean;
  reviewed?: string; // date de relecture par le Dr Dadoun, ex. "2026-10-01" (affichée sur la page)
  how: string; // comment ça agit
  zones: string[];
  sessions: string;
  relevant: string[]; // quand ce traitement est pertinent
  notBest: { case: string; better?: string }[]; // quand ce n'est pas la meilleure option (+ alternative)
  preparation: string[];
  aftercare: string[];
  risks: string[];
  contraindications: string[];
  pain: string; // ressenti pendant et après la séance
  results: string; // quand le résultat apparaît, combien de temps il dure
  phototypes?: string; // peaux claires / mates / foncées
  faq: { q: string; a: string }[];
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
    pain: "Une crème anesthésiante est appliquée avant la séance. Pendant le soin, on ressent de la chaleur et des picotements, en général bien supportés. Les heures suivantes, la sensation ressemble à un coup de soleil.",
    results: "La peau s'affine dès la fin de la cicatrisation, puis le résultat continue de s'améliorer pendant trois à six mois, le temps que le nouveau collagène se forme. Il est durable, mais la peau continue de vieillir : une séance d'entretien peut être discutée.",
    phototypes:
      "Les peaux claires sont les plus faciles à traiter. Sur les peaux mates à foncées, fréquentes au Maroc, le risque de taches brunes après le soin est plus élevé : les réglages sont plus doux, la peau est préparée avant la séance et la protection solaire est renforcée. Parfois, une autre technique est plus adaptée.",
    faq: [
      {
        q: "Combien de temps faut-il prévoir avant de reprendre une vie sociale ?",
        a: "En général cinq à dix jours, le temps que les croûtelles tombent. Une rougeur légère peut persister quelques semaines, et se camoufle avec du maquillage une fois la peau cicatrisée.",
      },
      {
        q: "Quelle est la meilleure période pour un laser CO₂ ?",
        a: "Idéalement l'automne et l'hiver, quand l'exposition au soleil est plus facile à éviter. La protection solaire reste indispensable pendant plusieurs mois après la séance.",
      },
      {
        q: "Le laser CO₂ est-il possible sur une peau mate ?",
        a: "Souvent oui, avec des précautions : réglages adaptés, préparation de la peau et protection solaire stricte. La consultation permet d'évaluer le risque de taches et, si besoin, de proposer une autre option.",
      },
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
    pain: "La séance se fait sous anesthésie locale. On ressent surtout la piqûre de l'anesthésie, puis une sensation de chaleur. La zone reste sensible quelques jours.",
    results: "Un premier effet tenseur est visible dans les jours qui suivent, puis le résultat s'améliore pendant trois à six mois. Sa durée varie selon l'âge, la qualité de la peau et l'hygiène de vie.",
    phototypes:
      "L'énergie est délivrée sous la peau et non à sa surface : la technique convient en général à tous les types de peau, y compris les peaux mates à foncées.",
    faq: [
      {
        q: "Endolifting ou lifting chirurgical ?",
        a: "L'endolifting s'adresse aux relâchements débutants à modérés. Quand l'excès de peau est important, la chirurgie donne un meilleur résultat, et je vous le dis en consultation.",
      },
      {
        q: "Reste-t-il des cicatrices ?",
        a: "La fibre passe par un point d'entrée minuscule, sans incision. Il ne laisse en général pas de marque visible une fois cicatrisé.",
      },
      {
        q: "Peut-on associer l'endolifting à d'autres soins ?",
        a: "Oui, selon l'indication : il agit sur le relâchement, alors que l'acide hyaluronique restaure un volume et le laser CO₂ travaille la surface de la peau. Le plan de traitement est établi en consultation.",
      },
    ],
  },

  "toxine-botulique": {
    validated: false,
    how: "La toxine botulique relâche de façon ciblée et temporaire les muscles responsables des rides d'expression. La peau au-dessus se lisse. Quand la dose et les points d'injection sont adaptés à chaque visage, l'expression reste naturelle.",
    zones: ["Front", "Rides du lion (entre les sourcils)", "Pattes d'oie", "Autres zones selon l'indication"],
    sessions:
      "Une séance, avec un contrôle possible vers deux semaines. L'effet dure en moyenne trois à six mois ; les séances se répètent en général deux à trois fois par an.",
    relevant: [
      "Rides du front",
      "Rides du lion, entre les sourcils",
      "Pattes d'oie au coin des yeux",
      "Rides d'expression qui commencent à se marquer au repos",
    ],
    notBest: [
      { case: "Sillon ou creux lié à une perte de volume", better: "acide-hyaluronique" },
      { case: "Ridules fines, texture de peau, cicatrices", better: "laser-co2" },
      { case: "Relâchement de l'ovale et du cou", better: "endolifting" },
      { case: "Recherche d'un résultat définitif : l'effet est temporaire" },
    ],
    preparation: [
      "Consultation préalable : analyse du visage au repos et en mouvement",
      "Signaler tout traitement en cours, notamment anticoagulants et certains antibiotiques",
      "Signaler toute maladie neuromusculaire",
      "Éviter si possible aspirine et anti-inflammatoires quelques jours avant, selon mes indications",
      "Venir sans maquillage",
    ],
    aftercare: [
      "Petites marques de piqûre qui disparaissent en quelques minutes à quelques heures",
      "Ne pas masser ni appuyer sur les zones traitées le jour même",
      "Éviter le sport intense, le sauna et le hammam le jour de la séance",
      "Maquillage possible dès le lendemain",
    ],
    risks: [
      "Petits bleus aux points d'injection",
      "Maux de tête transitoires",
      "Légère asymétrie, qui peut être corrigée au contrôle",
      "Rarement : chute temporaire de la paupière ou du sourcil, qui disparaît en quelques semaines",
    ],
    contraindications: [
      "Grossesse et allaitement",
      "Maladies neuromusculaires (myasthénie, par exemple)",
      "Infection sur la zone à traiter",
      "Allergie connue à l'un des composants",
      "Certains médicaments, à évaluer en consultation",
    ],
    pain: "Quelques piqûres avec une aiguille très fine : une gêne brève, bien tolérée. Aucune anesthésie n'est en général nécessaire.",
    results: "L'effet apparaît en trois à sept jours et devient complet vers deux semaines. Il s'estompe progressivement en trois à six mois.",
    faq: [
      {
        q: "Est-ce que je vais avoir l'air figé ?",
        a: "Non, ce n'est pas le but. Les doses et les points sont choisis pour adoucir les rides tout en gardant l'expression : corriger sans transformer.",
      },
      {
        q: "Que se passe-t-il si j'arrête ?",
        a: "Les muscles retrouvent progressivement leur activité et les rides reviennent à leur état d'origine. Arrêter n'aggrave pas les rides.",
      },
      {
        q: "À partir de quel âge ?",
        a: "Il n'y a pas d'âge fixe : c'est l'indication qui compte. En consultation, j'évalue si les rides sont réellement liées à l'activité des muscles.",
      },
    ],
  },

  "acide-hyaluronique": {
    validated: false,
    how: "L'acide hyaluronique est une molécule naturellement présente dans la peau. Sous forme de gel injectable, il restaure un volume perdu, soutient une zone qui s'est creusée ou atténue un sillon. Le choix du produit, plus ou moins dense, et la profondeur d'injection dépendent de la zone et de l'anatomie. Il se résorbe naturellement avec le temps.",
    zones: ["Pommettes et joues", "Sillons nasogéniens", "Lèvres", "Menton et ligne de la mâchoire", "Cernes, selon l'indication"],
    sessions:
      "Une séance, parfois complétée par une retouche après deux à quatre semaines. La durée varie selon la zone et le produit, en général de six à dix-huit mois.",
    relevant: [
      "Perte de volume des pommettes ou des tempes",
      "Sillons nasogéniens ou plis d'amertume marqués",
      "Lèvres qui s'affinent ou se déshydratent",
      "Menton ou ligne de la mâchoire à redéfinir",
      "Cernes creux, selon la qualité de la peau",
    ],
    notBest: [
      { case: "Rides d'expression liées aux muscles", better: "toxine-botulique" },
      { case: "Relâchement cutané : trop remplir alourdit le visage", better: "endolifting" },
      { case: "Texture, ridules fines et cicatrices", better: "laser-co2" },
      { case: "Souhait de changer ses traits : l'objectif est de corriger sans transformer" },
    ],
    preparation: [
      "Consultation préalable : analyse des volumes et des proportions du visage",
      "Signaler tout traitement anticoagulant, la prise d'aspirine ou de compléments qui fluidifient le sang",
      "Signaler les injections déjà réalisées, avec le nom du produit si possible",
      "Signaler tout antécédent d'herpès, notamment avant une injection des lèvres",
      "Prévoir la séance à distance d'un soin dentaire ou d'un événement important",
    ],
    aftercare: [
      "Gonflement et rougeur pendant quelques jours, parfois des bleus",
      "Ne pas masser la zone, sauf indication de ma part",
      "Éviter le sport intense, la chaleur (sauna, hammam) et le soleil pendant 48 heures",
      "Consulter immédiatement en cas de douleur importante ou de changement de couleur de la peau",
    ],
    risks: [
      "Bleus et gonflement",
      "Petites irrégularités ou nodules, le plus souvent transitoires",
      "Asymétrie, qui peut être corrigée",
      "Rarement : infection ou réaction inflammatoire retardée",
      "Exceptionnel mais grave : obstruction d'un vaisseau, qui demande une prise en charge immédiate",
    ],
    contraindications: [
      "Grossesse et allaitement",
      "Infection ou herpès actif sur la zone",
      "Allergie connue à l'un des composants",
      "Antécédent de réaction à un produit de comblement",
      "Certaines maladies auto-immunes, à évaluer en consultation",
    ],
    pain: "Les piqûres sont fines, et la plupart des produits contiennent un anesthésique local. Une crème anesthésiante peut être appliquée avant. Les lèvres sont la zone la plus sensible.",
    results: "Le résultat est visible tout de suite, et définitif une fois le gonflement résorbé, en une à deux semaines. Il dure en général de six à dix-huit mois selon la zone et le produit.",
    faq: [
      {
        q: "L'effet est-il réversible ?",
        a: "Oui. Une enzyme, la hyaluronidase, permet de dissoudre l'acide hyaluronique si le résultat ne convient pas ou en cas de complication.",
      },
      {
        q: "Est-ce que ça va se voir ?",
        a: "Le but est un résultat naturel : des quantités mesurées, placées selon l'anatomie, pour un visage reposé, pas transformé.",
      },
      {
        q: "Combien de temps dure le résultat ?",
        a: "En général de six à dix-huit mois. Les zones qui bougent beaucoup, comme les lèvres, se résorbent plus vite que les pommettes ou le menton.",
      },
    ],
  },
};

/** Fiche publiée (validée), ou brouillon si l'aperçu est activé (FICHES_PREVIEW=1). */
export const getFiche = (slug: string) => {
  const f = fiches[slug];
  return f && (f.validated || process.env.FICHES_PREVIEW === "1") ? f : undefined;
};
