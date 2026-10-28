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
  "diode-vasculaire": {
    validated: false,
    how: "Le laser diode vasculaire émet une lumière absorbée par le sang contenu dans les petits vaisseaux dilatés. L'énergie chauffe la paroi du vaisseau, qui se referme puis est éliminée naturellement par l'organisme. La peau autour n'est pas abîmée : les réglages sont adaptés au calibre du vaisseau et au type de peau.",
    zones: ["Ailes du nez", "Joues", "Menton", "Autres petits vaisseaux visibles du visage"],
    sessions:
      "Une à trois séances selon le nombre et la taille des vaisseaux, espacées d'environ quatre semaines. De nouveaux vaisseaux peuvent apparaître avec le temps : une séance d'entretien est alors possible.",
    relevant: [
      "Petits vaisseaux rouges visibles sur le nez ou les joues (couperose)",
      "Points rubis et petites taches vasculaires",
      "Rougeurs localisées liées à des vaisseaux dilatés",
    ],
    notBest: [
      { case: "Rougeurs diffuses d'une rosacée inflammatoire active : elle se traite d'abord médicalement" },
      { case: "Texture de peau, pores et cicatrices", better: "laser-co2" },
      { case: "Peau bronzée ou exposition solaire prévue dans les semaines qui suivent" },
      { case: "Varices et grosses veines des jambes : elles relèvent d'un bilan veineux" },
    ],
    preparation: [
      "Consultation préalable : examen des vaisseaux et du type de peau",
      "Éviter le soleil, les UV et l'autobronzant pendant les quatre semaines précédentes",
      "Signaler tout médicament qui rend la peau sensible au soleil",
      "Venir sans maquillage",
    ],
    aftercare: [
      "Rougeur et léger gonflement pendant quelques heures à quelques jours",
      "Les vaisseaux traités peuvent paraître plus foncés avant de s'estomper",
      "Éviter la chaleur (hammam, sauna, sport intense) pendant 48 heures",
      "Protection solaire stricte pendant plusieurs semaines",
    ],
    risks: [
      "Rougeur et gonflement transitoires",
      "Petites croûtes, rares, à ne pas gratter",
      "Modification temporaire de la couleur de la peau, plus fréquente sur les peaux mates",
      "Rarement : petite cicatrice",
    ],
    contraindications: [
      "Peau bronzée ou exposition solaire récente",
      "Grossesse",
      "Infection ou lésion de peau sur la zone",
      "Médicaments photosensibilisants ou traitement récent par isotrétinoïne, à évaluer en consultation",
    ],
    pain: "La sensation est celle de petits picotements chauds, brefs. Une crème anesthésiante n'est en général pas nécessaire ; le refroidissement de la peau rend la séance plus confortable.",
    results:
      "Certains vaisseaux disparaissent dès la séance, d'autres s'estompent en deux à quatre semaines. Un vaisseau traité ne revient pas, mais la tendance à en développer de nouveaux persiste.",
    phototypes:
      "Les peaux claires répondent le mieux. Sur les peaux mates, les réglages sont plus prudents pour limiter le risque de taches. Sur les peaux foncées, l'indication est discutée au cas par cas.",
    faq: [
      {
        q: "La couperose peut-elle revenir ?",
        a: "Les vaisseaux traités ne reviennent pas, mais d'autres peuvent apparaître avec le temps, le soleil ou la chaleur. Une protection solaire régulière limite ce risque, et une séance d'entretien reste possible.",
      },
      {
        q: "Peut-on se maquiller après la séance ?",
        a: "En général dès le lendemain, une fois la rougeur estompée. Je vous le confirme à la fin de la séance.",
      },
      {
        q: "Combien de séances faut-il ?",
        a: "Le plus souvent une à trois. Le nombre dépend de l'étendue et de la taille des vaisseaux ; je vous l'indique dès la consultation.",
      },
    ],
  },

  // Gynécologie esthétique : chaque fiche rappelle que la consultation commence par un bilan médical.
  "laser-gynecologique": {
    validated: false,
    how: "Une sonde laser introduite dans le vagin, ou appliquée sur la vulve, délivre une énergie contrôlée qui stimule la muqueuse et la production de collagène. L'objectif est d'améliorer, chez certaines patientes, la sécheresse ou la sensation de relâchement. L'indication est posée seulement après un bilan gynécologique.",
    zones: ["Muqueuse vaginale", "Vulve, selon l'indication"],
    sessions:
      "En général deux à trois séances espacées de quatre à six semaines. Une séance d'entretien peut être proposée après un an, selon le résultat.",
    relevant: [
      "Sécheresse vaginale, notamment après la ménopause ou un accouchement",
      "Sensation de relâchement vaginal",
      "Inconfort pendant les rapports lié à une muqueuse fragilisée",
      "Certaines fuites urinaires légères à l'effort, après bilan",
    ],
    notBest: [
      { case: "Infection ou douleur inexpliquée : elle demande d'abord un diagnostic" },
      { case: "Descente d'organes (prolapsus) importante : elle relève d'une autre prise en charge" },
      { case: "Fuites urinaires importantes : un bilan urologique est nécessaire" },
      { case: "Apparence des petites lèvres", better: "nymphoplastie" },
    ],
    preparation: [
      "Consultation et bilan gynécologique préalables",
      "Frottis cervico-utérin à jour",
      "Aucune infection en cours",
      "Séance programmée en dehors des règles",
    ],
    aftercare: [
      "Légère sensation de chaleur ou petites pertes pendant quelques jours",
      "Pas de rapports sexuels pendant quelques jours, selon mes indications",
      "Éviter le bain, la piscine et le hammam pendant quelques jours",
      "Reprise des activités habituelles le jour même",
    ],
    risks: [
      "Inconfort, chaleur ou pertes légères pendant quelques jours",
      "Rarement : infection, irritation ou petite brûlure de la muqueuse",
      "Résultat variable d'une patiente à l'autre",
    ],
    contraindications: [
      "Grossesse",
      "Infection génitale ou urinaire en cours",
      "Frottis anormal non exploré",
      "Saignements inexpliqués",
      "Antécédent de cancer gynécologique, à évaluer avec votre médecin",
    ],
    pain: "La séance est en général peu douloureuse : une sensation de chaleur ou de vibration. Une crème anesthésiante peut être appliquée sur la vulve.",
    results:
      "Une amélioration est souvent ressentie dès les premières semaines et se poursuit après la dernière séance. La durée de l'effet varie : un entretien peut être utile.",
    faq: [
      {
        q: "La séance est-elle confidentielle ?",
        a: "Oui. La consultation et le soin se déroulent dans un cadre strictement médical et confidentiel, au cabinet.",
      },
      {
        q: "Peut-on reprendre le travail le jour même ?",
        a: "Oui, la plupart des patientes reprennent leurs activités tout de suite. Seuls les rapports, le bain et la piscine sont à éviter quelques jours.",
      },
      {
        q: "Le laser convient-il après la ménopause ?",
        a: "La sécheresse liée à la ménopause est une indication fréquente, après bilan gynécologique. D'autres traitements existent : nous en parlons en consultation pour choisir le plus adapté.",
      },
    ],
  },

  "eclaircissement-intime": {
    validated: false,
    how: "La peau de la zone intime peut foncer avec les hormones, les frottements, l'épilation ou l'âge. L'éclaircissement associe, selon la peau, des soins dépigmentants, des peelings doux adaptés à cette zone ou certaines technologies. L'objectif est d'unifier le teint de la zone, progressivement et sans agresser la peau.",
    zones: ["Aine et pli de l'aine", "Grandes lèvres", "Zone périnéale et périanale", "Intérieur des cuisses"],
    sessions:
      "Plusieurs séances, souvent trois à six, espacées de deux à quatre semaines, avec des soins à poursuivre à domicile entre les séances.",
    relevant: [
      "Peau plus foncée dans le pli de l'aine ou sur les grandes lèvres",
      "Hyperpigmentation après des épilations répétées",
      "Teint irrégulier de la zone intime, source de gêne",
    ],
    notBest: [
      { case: "Tache qui change de forme ou de couleur : elle doit d'abord être examinée" },
      { case: "Peau irritée ou infection en cours : elle se soigne d'abord" },
      { case: "Perte de volume des grandes lèvres", better: "comblement-des-grandes-levres" },
      { case: "Recherche d'un blanchiment complet : le but est d'unifier, pas de décolorer" },
    ],
    preparation: [
      "Consultation préalable : examen de la peau et recherche de la cause de la pigmentation",
      "Pas d'épilation à la cire ni au rasoir quelques jours avant la séance",
      "Signaler tout traitement en cours et toute allergie",
    ],
    aftercare: [
      "Légère rougeur ou desquamation pendant quelques jours, selon le protocole",
      "Sous-vêtements en coton, éviter les frottements",
      "Pas d'épilation ni de hammam pendant quelques jours",
      "Soins prescrits à appliquer à domicile",
    ],
    risks: [
      "Irritation, rougeur ou picotements transitoires",
      "Hyperpigmentation réactionnelle, surtout sur les peaux foncées si la peau est trop sollicitée",
      "Résultat progressif, variable selon la peau",
    ],
    contraindications: [
      "Grossesse et allaitement",
      "Infection, irritation ou lésion sur la zone",
      "Allergie connue à un produit du protocole",
    ],
    pain: "Les soins sont en général bien tolérés : picotements ou sensation de chaleur pendant quelques minutes.",
    results:
      "L'éclaircissement est progressif, visible au fil des séances. Le résultat se maintient mieux en limitant les frottements et en poursuivant les soins conseillés.",
    phototypes:
      "Les peaux mates et foncées sont les plus concernées par cette demande, et aussi les plus sensibles : le protocole est volontairement progressif pour éviter les taches réactionnelles.",
    faq: [
      {
        q: "Le résultat est-il définitif ?",
        a: "Le résultat se maintient, mais la peau de cette zone peut refoncer avec les frottements, les épilations ou les variations hormonales. Des soins d'entretien aident à le conserver.",
      },
      {
        q: "Est-ce compatible avec l'épilation laser ?",
        a: "Oui, en espaçant les séances. Je vous indique le bon calendrier en consultation.",
      },
      {
        q: "Peut-on faire le soin pendant les règles ?",
        a: "Il est plus confortable de programmer la séance en dehors des règles.",
      },
    ],
  },

  "comblement-des-grandes-levres": {
    validated: false,
    how: "Avec l'âge, l'accouchement ou une perte de poids, les grandes lèvres peuvent perdre leur volume et paraître relâchées. Un gel d'acide hyaluronique, injecté en petites quantités, restaure ce volume. Le produit est choisi pour cette zone, et se résorbe naturellement avec le temps.",
    zones: ["Grandes lèvres"],
    sessions: "Une séance, parfois complétée par une retouche après quelques semaines. Le résultat dure en général douze à dix-huit mois.",
    relevant: [
      "Grandes lèvres qui ont perdu leur volume",
      "Aspect relâché ou fripé après une grossesse ou une perte de poids",
      "Inconfort lié à des frottements",
    ],
    notBest: [
      { case: "Petites lèvres longues ou gênantes", better: "nymphoplastie" },
      { case: "Peau plus foncée de la zone", better: "eclaircissement-intime" },
      { case: "Sécheresse ou relâchement vaginal", better: "laser-gynecologique" },
    ],
    preparation: [
      "Consultation préalable : examen et discussion du résultat souhaité",
      "Signaler tout traitement anticoagulant ou la prise d'aspirine",
      "Signaler tout antécédent d'herpès génital",
      "Aucune infection en cours",
    ],
    aftercare: [
      "Gonflement et parfois bleus pendant quelques jours",
      "Pas de rapports sexuels, de sport intense ni de hammam pendant quelques jours",
      "Vêtements amples les premiers jours",
      "Consulter rapidement en cas de douleur importante ou de changement de couleur de la peau",
    ],
    risks: [
      "Gonflement, bleus",
      "Petites irrégularités, le plus souvent transitoires",
      "Rarement : infection ou réaction inflammatoire",
      "Exceptionnel mais grave : obstruction d'un vaisseau, qui demande une prise en charge immédiate",
    ],
    contraindications: [
      "Grossesse et allaitement",
      "Infection génitale ou herpès actif",
      "Allergie connue à l'un des composants",
      "Certaines maladies auto-immunes, à évaluer en consultation",
    ],
    pain: "Une crème anesthésiante est appliquée avant la séance, et le produit contient un anesthésique local. La sensation reste supportable.",
    results:
      "Le résultat est visible tout de suite, et définitif une fois le gonflement résorbé, en une à deux semaines. Il dure en général douze à dix-huit mois.",
    faq: [
      {
        q: "Le résultat est-il naturel ?",
        a: "Oui : la quantité injectée est mesurée pour restaurer un volume, pas pour transformer la zone.",
      },
      {
        q: "Est-ce réversible ?",
        a: "Oui. L'acide hyaluronique peut être dissous par une enzyme, la hyaluronidase, si nécessaire.",
      },
      {
        q: "Quand peut-on reprendre les rapports ?",
        a: "Après quelques jours, une fois le gonflement passé. Je vous donne le délai précis après la séance.",
      },
    ],
  },

  nymphoplastie: {
    validated: false,
    how: "La nymphoplastie réduit la taille des petites lèvres lorsqu'elles sont longues, asymétriques ou gênantes. C'est un acte chirurgical, réalisé sous anesthésie locale : l'excédent est retiré et la cicatrice est refermée avec des fils qui se résorbent seuls. La décision est prise après une consultation approfondie et un délai de réflexion.",
    zones: ["Petites lèvres"],
    sessions: "Un seul geste. Une consultation de contrôle est prévue après la cicatrisation.",
    relevant: [
      "Petites lèvres qui dépassent et frottent dans les vêtements",
      "Gêne pendant le sport, le vélo ou les rapports",
      "Asymétrie marquée, source de gêne",
    ],
    notBest: [
      { case: "Perte de volume des grandes lèvres", better: "comblement-des-grandes-levres" },
      { case: "Sécheresse ou relâchement vaginal", better: "laser-gynecologique" },
      { case: "Demande qui vient d'une pression extérieure, ou d'une image « standard » : on en parle d'abord" },
      { case: "Patiente mineure" },
    ],
    preparation: [
      "Consultation approfondie, puis délai de réflexion avant de fixer la date",
      "Signaler tout traitement anticoagulant ou la prise d'aspirine",
      "Aucune infection en cours",
      "Intervention programmée en dehors des règles",
      "Arrêt du tabac conseillé, pour une meilleure cicatrisation",
    ],
    aftercare: [
      "Gonflement et inconfort pendant une à deux semaines",
      "Soins locaux et toilette douce selon l'ordonnance",
      "Sous-vêtements en coton, vêtements amples",
      "Pas de rapports sexuels, de bain ni de sport pendant plusieurs semaines, selon mes indications",
    ],
    risks: [
      "Gonflement, bleus",
      "Petit hématome",
      "Infection ou ouverture partielle de la cicatrice",
      "Asymétrie ou résultat imparfait, parfois à reprendre",
      "Modification transitoire de la sensibilité",
    ],
    contraindications: [
      "Grossesse",
      "Infection génitale en cours",
      "Patiente mineure",
      "Troubles de la coagulation non équilibrés",
    ],
    pain: "L'intervention se fait sous anesthésie locale : elle n'est pas douloureuse. Les suites sont inconfortables quelques jours et soulagées par les antalgiques prescrits.",
    results:
      "Le résultat se juge après la disparition du gonflement, en général après quatre à six semaines. Il est définitif.",
    faq: [
      {
        q: "Combien de temps faut-il pour récupérer ?",
        a: "Le travail de bureau est en général possible après quelques jours. Le sport et les rapports reprennent après plusieurs semaines : je vous donne les délais précis à la consultation.",
      },
      {
        q: "La cicatrice se voit-elle ?",
        a: "Elle est placée le long du bord des petites lèvres et devient en général très discrète une fois la cicatrisation terminée.",
      },
      {
        q: "Pourquoi un délai de réflexion ?",
        a: "Parce qu'il s'agit d'un geste définitif sur une zone intime. Je veux que la décision soit la vôtre, prise sereinement.",
      },
    ],
  },

  // À VALIDER : le site présente le G-Shot comme une injection de PRP. Selon les praticiens, il désigne parfois une injection
  // d'acide hyaluronique : le Dr Dadoun précise sa pratique avant publication.
  "o-shot-g-shot": {
    validated: false,
    how: "Le PRP (plasma riche en plaquettes) est préparé à partir d'une petite prise de votre propre sang, centrifugée pour concentrer les plaquettes et leurs facteurs de croissance. Il est ensuite injecté dans la sphère intime : au niveau du clitoris et de la paroi vaginale pour l'O-Shot, d'une zone précise de la paroi vaginale antérieure pour le G-Shot. L'objectif est de stimuler les tissus. Les données scientifiques restent limitées et les résultats varient d'une patiente à l'autre : nous en parlons franchement en consultation.",
    zones: ["Clitoris et paroi vaginale (O-Shot)", "Paroi vaginale antérieure (G-Shot)"],
    sessions: "Une à trois séances espacées d'environ un mois, selon la réponse.",
    relevant: [
      "Baisse de la sensibilité ou de la lubrification",
      "Certaines fuites urinaires légères à l'effort, après bilan",
      "En complément d'autres soins de la sphère intime, selon l'indication",
    ],
    notBest: [
      { case: "Troubles du désir d'origine psychologique ou relationnelle : un autre accompagnement est plus adapté" },
      { case: "Sécheresse ou relâchement vaginal marqué", better: "laser-gynecologique" },
      { case: "Infection ou douleur inexpliquée : elle demande d'abord un diagnostic" },
      { case: "Recherche d'un résultat garanti : la réponse au PRP est variable" },
    ],
    preparation: [
      "Consultation et bilan gynécologique préalables",
      "Frottis cervico-utérin à jour",
      "Éviter aspirine et anti-inflammatoires quelques jours avant, selon mes indications",
      "Bien boire et manger normalement avant la prise de sang",
    ],
    aftercare: [
      "Légère sensibilité ou gonflement pendant un à deux jours",
      "Reprise des activités le jour même",
      "Rapports possibles après quelques jours, selon mes indications",
    ],
    risks: [
      "Douleur ou bleu au point de prise de sang",
      "Sensibilité ou gonflement transitoire de la zone injectée",
      "Rarement : infection",
      "Absence d'amélioration chez certaines patientes",
    ],
    contraindications: [
      "Grossesse",
      "Infection génitale ou urinaire en cours",
      "Troubles de la coagulation ou baisse des plaquettes",
      "Cancer en cours de traitement",
    ],
    pain: "Une crème anesthésiante est appliquée avant les injections. La gêne est brève.",
    results:
      "Quand le PRP agit, l'amélioration apparaît progressivement, sur quelques semaines, et peut durer plusieurs mois. Elle n'est pas garantie.",
    faq: [
      {
        q: "Le PRP est-il sûr ?",
        a: "Il est préparé à partir de votre propre sang, ce qui limite le risque d'allergie. Il est réalisé dans des conditions d'asepsie stricte, après un bilan médical.",
      },
      {
        q: "Les résultats sont-ils prouvés ?",
        a: "Les études sont encore peu nombreuses et les résultats varient. Je vous explique honnêtement ce que l'on peut en attendre dans votre situation.",
      },
      {
        q: "Combien de temps dure la séance ?",
        a: "Environ trente à quarante-cinq minutes, prise de sang et préparation du PRP comprises.",
      },
    ],
  },
  "fils-tenseurs": {
    validated: false,
    how: "Des fils fins et résorbables, le plus souvent en polydioxanone (PDO), sont glissés sous la peau à l'aide d'une aiguille ou d'une canule, sans incision. Selon leur type, ils soutiennent et repositionnent les tissus relâchés, ou servent surtout à stimuler la production de collagène. Ils se résorbent en quelques mois, et l'effet de soutien se prolonge grâce au collagène formé autour.",
    zones: ["Ovale du visage et bajoues", "Joues et pommettes", "Sourcils", "Cou", "Autres zones selon l'indication"],
    sessions: "En général une séance. Le résultat peut être entretenu par une nouvelle séance après douze à dix-huit mois.",
    relevant: [
      "Relâchement débutant à modéré des joues et de l'ovale",
      "Sourcil qui tombe légèrement",
      "Peau qui a perdu de sa fermeté, sans excès de peau important",
    ],
    notBest: [
      { case: "Rides d'expression liées aux muscles", better: "toxine-botulique" },
      { case: "Perte de volume des pommettes ou des sillons", better: "acide-hyaluronique" },
      { case: "Relâchement associé à des petits amas graisseux de l'ovale", better: "endolifting" },
      { case: "Relâchement très marqué avec un excès de peau : il relève de la chirurgie" },
      { case: "Peau très fine : les fils peuvent devenir visibles" },
    ],
    preparation: [
      "Consultation préalable : analyse du relâchement et de la qualité de la peau",
      "Signaler tout traitement anticoagulant, la prise d'aspirine ou de compléments qui fluidifient le sang",
      "Signaler tout soin dentaire prévu dans les semaines qui suivent",
      "Prévoir la séance à distance d'un événement important",
    ],
    aftercare: [
      "Gonflement, sensibilité et parfois bleus pendant quelques jours",
      "Petites irrégularités ou sensation de tiraillement, qui s'estompent en général en une à deux semaines",
      "Éviter de grandes ouvertures de bouche, les massages du visage et les soins dentaires pendant quelques semaines",
      "Dormir sur le dos les premiers jours, éviter le sport intense, le sauna et le hammam",
    ],
    risks: [
      "Bleus et gonflement",
      "Asymétrie ou petites fossettes, le plus souvent transitoires",
      "Fil palpable ou visible sous la peau",
      "Rarement : infection ou extrusion d'un fil, qui demande de le retirer",
    ],
    contraindications: [
      "Grossesse et allaitement",
      "Infection ou lésion de peau sur la zone",
      "Troubles de la coagulation",
      "Certaines maladies auto-immunes, à évaluer en consultation",
    ],
    pain: "La séance se fait sous anesthésie locale. On ressent surtout des pressions et des tiraillements. Les jours suivants, une sensibilité est fréquente, soulagée par des antalgiques simples.",
    results:
      "Un effet de soutien est visible tout de suite, puis s'affine à mesure que le gonflement disparaît. La stimulation du collagène améliore la fermeté sur plusieurs mois ; l'effet dure en général douze à dix-huit mois.",
    faq: [
      {
        q: "Les fils tenseurs remplacent-ils un lifting chirurgical ?",
        a: "Non. Ils conviennent à un relâchement débutant à modéré. Quand l'excès de peau est important, seule la chirurgie donne un résultat satisfaisant, et je vous le dis franchement.",
      },
      {
        q: "Les fils restent-ils dans la peau ?",
        a: "Non. Ils se résorbent en quelques mois. Le collagène formé autour prolonge l'effet.",
      },
      {
        q: "Peut-on associer les fils à d'autres soins ?",
        a: "Oui, souvent : l'acide hyaluronique restaure un volume, la toxine botulique détend un muscle, les fils repositionnent. Le plan est établi en consultation.",
      },
    ],
  },

  "epilation-laser": {
    validated: false,
    how: "La lumière du laser est absorbée par le pigment du poil et transformée en chaleur, qui détruit la racine du poil en phase de croissance. Comme tous les poils ne poussent pas en même temps, plusieurs séances sont nécessaires. Les réglages sont adaptés à la couleur de la peau et du poil.",
    zones: ["Visage (lèvre supérieure, menton)", "Aisselles", "Maillot", "Jambes et bras", "Dos et torse"],
    sessions:
      "En général six à huit séances, espacées de quatre à huit semaines selon la zone. Une séance d'entretien par an peut être utile, notamment sur les zones sensibles aux hormones.",
    relevant: [
      "Poils bruns ou foncés, sur toutes les zones du corps",
      "Pilosité gênante du visage",
      "Poils incarnés et irritations liées au rasage ou à la cire",
    ],
    notBest: [
      { case: "Poils blancs, gris, blonds très clairs ou roux : le laser ne les reconnaît pas" },
      { case: "Peau bronzée ou exposition solaire prévue dans les semaines qui suivent" },
      { case: "Pilosité qui apparaît ou augmente brutalement : elle demande d'abord un bilan hormonal" },
    ],
    preparation: [
      "Consultation préalable : type de peau, couleur du poil, traitements en cours",
      "Raser la zone la veille ; ni cire, ni pince, ni crème dépilatoire pendant les quatre semaines précédentes",
      "Éviter le soleil et l'autobronzant pendant les quatre semaines précédentes",
      "Signaler tout médicament qui rend la peau sensible au soleil",
    ],
    aftercare: [
      "Rougeur et petits boutons autour des poils pendant quelques heures",
      "Pas de hammam, de sauna ni de gommage pendant 48 heures",
      "Protection solaire stricte sur les zones exposées",
      "Ni cire ni pince entre les séances : le rasoir reste possible",
    ],
    risks: [
      "Rougeur et gonflement transitoires",
      "Taches claires ou foncées temporaires, surtout sur les peaux mates à foncées",
      "Rarement : brûlure superficielle ou petite cloque",
      "Rarement : repousse paradoxale de poils fins à proximité des zones traitées",
    ],
    contraindications: [
      "Peau bronzée ou exposition solaire récente",
      "Grossesse",
      "Infection ou lésion de peau sur la zone",
      "Médicaments photosensibilisants ou traitement récent par isotrétinoïne, à évaluer en consultation",
    ],
    pain: "On ressent de petits claquements chauds, comme un élastique sur la peau. Le refroidissement de la peau rend la séance supportable ; les zones fines comme le maillot ou la lèvre supérieure sont plus sensibles.",
    results:
      "Les poils traités tombent dans les deux à trois semaines. La pilosité diminue nettement au fil des séances ; quelques poils fins peuvent persister, et les zones sensibles aux hormones demandent parfois un entretien.",
    phototypes:
      "Le laser et ses réglages sont choisis selon la peau : les peaux mates et foncées peuvent être traitées, avec des paramètres adaptés et prudents pour éviter les taches.",
    faq: [
      {
        q: "L'épilation laser est-elle définitive ?",
        a: "Elle réduit durablement la pilosité, de façon très importante sur la plupart des zones. Quelques poils fins peuvent repousser avec le temps, d'où une séance d'entretien éventuelle.",
      },
      {
        q: "Peut-on faire l'épilation laser sur peau mate ou foncée ?",
        a: "Oui, avec un laser et des réglages adaptés. Le type de peau est évalué en consultation et un test peut être réalisé.",
      },
      {
        q: "Peut-on se raser entre les séances ?",
        a: "Oui, le rasoir est autorisé. En revanche, la cire, la pince et l'épilateur sont à éviter, car ils retirent la racine que le laser doit atteindre.",
      },
    ],
  },

  skinboosters: {
    validated: false,
    how: "Les skinboosters sont des gels d'acide hyaluronique peu ou non réticulé, très fluides, injectés en multiples petits points dans la peau. Contrairement à un comblement, ils n'ajoutent pas de volume : ils hydratent la peau en profondeur et stimulent sa qualité, pour plus d'éclat, d'élasticité et un grain de peau plus fin.",
    zones: ["Visage", "Cou", "Décolleté", "Mains"],
    sessions:
      "Un protocole de deux à trois séances espacées d'environ un mois, puis une séance d'entretien tous les six à neuf mois.",
    relevant: [
      "Peau déshydratée, terne ou fatiguée",
      "Perte d'élasticité et ridules fines",
      "Peau du cou, du décolleté ou des mains qui se fripe",
    ],
    notBest: [
      { case: "Perte de volume des pommettes ou des sillons", better: "acide-hyaluronique" },
      { case: "Rides d'expression liées aux muscles", better: "toxine-botulique" },
      { case: "Cicatrices d'acné en creux", better: "laser-co2" },
      { case: "Relâchement de l'ovale", better: "fils-tenseurs" },
    ],
    preparation: [
      "Consultation préalable : analyse de la qualité de la peau",
      "Signaler tout traitement anticoagulant ou la prise d'aspirine",
      "Signaler tout antécédent d'herpès",
      "Venir sans maquillage, à distance d'un événement important",
    ],
    aftercare: [
      "Petites papules aux points d'injection pendant 24 à 48 heures",
      "Parfois quelques bleus",
      "Pas de maquillage le jour même",
      "Éviter le sport intense, le sauna, le hammam et le soleil pendant 48 heures",
    ],
    risks: [
      "Papules, rougeurs et bleus transitoires",
      "Rarement : petits nodules, infection ou réaction inflammatoire",
    ],
    contraindications: [
      "Grossesse et allaitement",
      "Infection ou herpès actif sur la zone",
      "Allergie connue à l'un des composants",
      "Certaines maladies auto-immunes, à évaluer en consultation",
    ],
    pain: "Une crème anesthésiante est appliquée avant la séance. Les piqûres sont nombreuses mais très fines.",
    results:
      "La peau paraît plus fraîche dès que les papules disparaissent. L'amélioration de la qualité de peau se construit sur le protocole complet et se maintient avec l'entretien.",
    faq: [
      {
        q: "Les skinboosters changent-ils les traits du visage ?",
        a: "Non. Ils n'ajoutent pas de volume : ils améliorent la qualité de la peau, pas les traits.",
      },
      {
        q: "Quelle différence avec la mésothérapie ?",
        a: "Les deux améliorent la qualité de peau. Les skinboosters reposent sur l'acide hyaluronique, la mésothérapie sur un cocktail de vitamines et d'actifs. Le choix dépend de votre peau.",
      },
      {
        q: "Quand voit-on le résultat ?",
        a: "Un éclat est souvent visible en quelques jours ; le résultat complet s'apprécie après le protocole de deux à trois séances.",
      },
    ],
  },

  mesotherapie: {
    validated: false,
    how: "La mésothérapie du visage, ou mésolift, consiste à injecter dans la peau, par micro-injections, un mélange d'actifs : vitamines, acides aminés, minéraux et acide hyaluronique non réticulé. Elle revitalise une peau terne ou fatiguée et améliore son éclat. Le mélange est choisi selon les besoins de la peau.",
    zones: ["Visage", "Cou", "Décolleté", "Mains"],
    sessions:
      "Un protocole de trois à cinq séances espacées de deux à quatre semaines, puis un entretien tous les trois à six mois.",
    relevant: [
      "Teint terne, peau fatiguée ou stressée",
      "Peau déshydratée",
      "Préparation de la peau avant un événement",
      "Entretien de la qualité de peau",
    ],
    notBest: [
      { case: "Perte de volume", better: "acide-hyaluronique" },
      { case: "Rides d'expression liées aux muscles", better: "toxine-botulique" },
      { case: "Taches pigmentaires installées", better: "peeling" },
      { case: "Cicatrices d'acné en creux", better: "laser-co2" },
    ],
    preparation: [
      "Consultation préalable : analyse de la peau",
      "Signaler tout traitement anticoagulant ou la prise d'aspirine",
      "Signaler toute allergie",
      "Venir sans maquillage",
    ],
    aftercare: [
      "Petites marques et rougeurs pendant quelques heures à 24 heures",
      "Pas de maquillage le jour même",
      "Éviter le soleil, le sauna et le hammam pendant 24 à 48 heures",
    ],
    risks: [
      "Rougeurs, petites papules ou bleus transitoires",
      "Rarement : réaction allergique ou infection",
    ],
    contraindications: [
      "Grossesse et allaitement",
      "Infection ou herpès actif sur la zone",
      "Allergie connue à l'un des composants",
    ],
    pain: "Les micro-injections sont très superficielles ; une crème anesthésiante peut être appliquée pour plus de confort.",
    results:
      "Le teint est souvent plus lumineux dès les jours qui suivent. L'effet se renforce au fil du protocole et s'entretient dans le temps.",
    faq: [
      {
        q: "Combien de séances faut-il ?",
        a: "En général trois à cinq séances rapprochées, puis un entretien. Je vous propose un protocole selon votre peau.",
      },
      {
        q: "Peut-on reprendre ses activités tout de suite ?",
        a: "Oui. Les petites marques disparaissent en quelques heures ; le maquillage est possible dès le lendemain.",
      },
      {
        q: "La mésothérapie convient-elle aux peaux sensibles ?",
        a: "Le plus souvent oui : le mélange est adapté à la peau, et la tolérance est vérifiée en consultation.",
      },
    ],
  },

  "prp-visage": {
    validated: false,
    how: "Le PRP (plasma riche en plaquettes) est préparé à partir d'une petite prise de votre propre sang, centrifugée pour concentrer les plaquettes. Ces plaquettes libèrent des facteurs de croissance qui stimulent le renouvellement de la peau et la production de collagène. Le plasma est réinjecté par micro-injections, ou appliqué en association avec un laser ou un microneedling.",
    zones: ["Visage", "Contour des yeux", "Cou et décolleté", "Cuir chevelu, selon l'indication"],
    sessions: "Trois séances espacées d'environ un mois, puis un entretien tous les six à douze mois.",
    relevant: [
      "Peau terne, manque d'éclat",
      "Ridules et texture irrégulière",
      "Cernes et contour des yeux fatigué, selon l'indication",
      "En complément d'un laser, pour accompagner la cicatrisation",
    ],
    notBest: [
      { case: "Perte de volume marquée", better: "acide-hyaluronique" },
      { case: "Rides d'expression liées aux muscles", better: "toxine-botulique" },
      { case: "Cicatrices d'acné en creux profondes, seul", better: "laser-co2" },
      { case: "Recherche d'un résultat immédiat : l'effet est progressif" },
    ],
    preparation: [
      "Consultation préalable",
      "Bien boire et manger normalement avant la séance",
      "Éviter aspirine et anti-inflammatoires quelques jours avant, selon mes indications",
      "Venir sans maquillage",
    ],
    aftercare: [
      "Rougeurs et petites marques pendant 24 à 48 heures, parfois quelques bleus",
      "Ne pas laver le visage pendant quelques heures",
      "Éviter le maquillage le jour même, le soleil, le sauna et le hammam pendant 48 heures",
    ],
    risks: [
      "Bleus aux points d'injection ou de prise de sang",
      "Rougeurs et gonflement transitoires",
      "Rarement : infection",
      "Résultat variable d'une personne à l'autre",
    ],
    contraindications: [
      "Grossesse et allaitement",
      "Troubles de la coagulation ou baisse des plaquettes",
      "Infection ou herpès actif sur la zone",
      "Cancer en cours de traitement",
    ],
    pain: "Une crème anesthésiante est appliquée avant les injections. La prise de sang est celle d'un bilan classique.",
    results:
      "L'effet est progressif : la peau gagne en éclat et en texture au fil des semaines et des séances. La réponse varie selon les personnes.",
    faq: [
      {
        q: "Le PRP présente-t-il un risque d'allergie ?",
        a: "Il est préparé à partir de votre propre sang, ce qui limite fortement le risque d'allergie.",
      },
      {
        q: "Combien de temps dure la séance ?",
        a: "Environ quarante-cinq minutes, prise de sang et préparation du plasma comprises.",
      },
      {
        q: "Peut-on associer le PRP au laser ?",
        a: "Oui, c'est une association fréquente : le PRP accompagne la cicatrisation et renforce le renouvellement de la peau après un laser.",
      },
    ],
  },

  peeling: {
    validated: false,
    how: "Un peeling médical consiste à appliquer sur la peau une solution exfoliante (acide glycolique, acide salicylique, TCA…) qui élimine les couches superficielles de l'épiderme. La peau se renouvelle : le teint s'unifie, les taches s'atténuent, le grain de peau s'affine. Le type d'acide et sa concentration sont choisis selon la peau et l'objectif, du peeling superficiel au peeling moyen.",
    zones: ["Visage", "Cou et décolleté", "Mains", "Dos, selon l'indication"],
    sessions:
      "Les peelings superficiels se font en cure de trois à six séances espacées de deux à quatre semaines. Un peeling moyen est en général réalisé en une séance.",
    relevant: [
      "Teint terne ou irrégulier",
      "Taches pigmentaires et taches solaires",
      "Acné légère et marques rouges ou brunes laissées par l'acné",
      "Pores dilatés, grain de peau épais",
    ],
    notBest: [
      { case: "Cicatrices d'acné en creux", better: "laser-co2" },
      { case: "Perte de volume", better: "acide-hyaluronique" },
      { case: "Rides d'expression liées aux muscles", better: "toxine-botulique" },
      { case: "Peau bronzée ou exposition solaire prévue dans les semaines qui suivent" },
    ],
    preparation: [
      "Consultation préalable : type de peau et choix du peeling",
      "Préparation de la peau à domicile pendant deux à quatre semaines, selon le peeling",
      "Arrêter les rétinoïdes et exfoliants quelques jours avant, selon mes indications",
      "Signaler tout antécédent d'herpès : un traitement préventif peut être prescrit",
      "Éviter le soleil avant la séance",
    ],
    aftercare: [
      "Rougeurs, tiraillements puis desquamation pendant deux à sept jours selon le peeling",
      "Ne pas arracher les peaux qui se détachent",
      "Crème hydratante et cicatrisante prescrite",
      "Protection solaire stricte pendant plusieurs semaines",
    ],
    risks: [
      "Rougeur et sensibilité transitoires",
      "Taches réactionnelles, surtout sur les peaux mates à foncées si le soleil n'est pas évité",
      "Poussée d'herpès chez les personnes prédisposées",
      "Rarement, pour les peelings moyens : cicatrice",
    ],
    contraindications: [
      "Grossesse et allaitement, selon le type de peeling",
      "Peau bronzée ou exposition solaire récente",
      "Herpès actif ou lésion sur la zone",
      "Traitement récent par isotrétinoïne",
    ],
    pain: "On ressent des picotements ou une sensation de chaleur pendant quelques minutes, plus marqués pour les peelings moyens.",
    results:
      "La peau est plus lumineuse dès la fin de la desquamation. Le résultat sur les taches et le grain de peau se construit sur plusieurs séances, et se maintient avec une protection solaire régulière.",
    phototypes:
      "Les peaux mates et foncées peuvent être traitées, avec des peelings choisis pour limiter le risque de taches, une préparation de la peau et une protection solaire stricte.",
    faq: [
      {
        q: "Peut-on travailler après un peeling ?",
        a: "Après un peeling superficiel, oui, le plus souvent dès le lendemain. Un peeling moyen demande quelques jours d'éviction sociale.",
      },
      {
        q: "En quelle saison faire un peeling ?",
        a: "De préférence en dehors des périodes de fort ensoleillement. Avec une protection solaire stricte, certains peelings superficiels restent possibles toute l'année.",
      },
      {
        q: "Le peeling efface-t-il le mélasma ?",
        a: "Il peut l'atténuer, dans le cadre d'un traitement global, mais le mélasma a tendance à revenir. Nous en parlons en consultation.",
      },
    ],
  },
};

/** Fiche publiée (validée), ou brouillon si l'aperçu est activé (FICHES_PREVIEW=1). */
export const getFiche = (slug: string) => {
  const f = fiches[slug];
  return f && (f.validated || process.env.FICHES_PREVIEW === "1") ? f : undefined;
};
