// Articles « Conseils » (page /conseils/<slug>) : réponses aux questions que les patients posent à Google.
// BROUILLONS rédigés à partir des connaissances médicales usuelles : rien n'est publié tant que
// `validated` n'est pas passé à true après relecture et correction par le Dr Dadoun.
// Aperçu des brouillons (déploiement de prévisualisation uniquement) : variable FICHES_PREVIEW=1.

export type ArticleSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type Article = {
  slug: string;
  validated: boolean;
  reviewed?: string; // date de relecture par le Dr Dadoun, ex. "2026-11-05"
  title: string; // H1 et titre Google (sans « · Docteur Dadoun », ajouté automatiquement)
  description: string; // description Google, 155 caractères environ
  intro: string;
  sections: ArticleSection[];
  related: string[]; // soins liés (slugs des actes)
  faq: { q: string; a: string }[];
};

export const articles: Article[] = [
  {
    slug: "botox-combien-de-temps-dure-effet",
    validated: false,
    title: "Botox : combien de temps dure l'effet ?",
    description:
      "Délai d'apparition, durée de l'effet, rythme des séances, signes qu'il est temps de refaire : ce qu'il faut savoir sur la toxine botulique (Botox).",
    intro:
      "C'est l'une des questions que l'on me pose le plus souvent en consultation. La toxine botulique, souvent appelée « Botox » du nom d'une marque, agit de façon temporaire : c'est à la fois une limite et une sécurité. Voici ce que l'on peut attendre, et pourquoi la durée varie d'une personne à l'autre.",
    sections: [
      {
        title: "Quand l'effet apparaît-il ?",
        paragraphs: [
          "La toxine botulique n'agit pas immédiatement. Les premiers effets apparaissent en général entre deux et cinq jours après la séance, et le résultat complet s'apprécie vers dix à quinze jours.",
          "C'est pour cette raison que je propose un contrôle autour de deux semaines : c'est le bon moment pour juger le résultat et, si besoin, ajuster une zone.",
        ],
      },
      {
        title: "Combien de temps dure le résultat ?",
        paragraphs: [
          "En moyenne, l'effet dure de trois à six mois. Le muscle retrouve ensuite progressivement son activité, et les rides d'expression réapparaissent peu à peu, sans « effet rebond » : le visage revient simplement à son état d'avant.",
          "Avec des séances régulières, beaucoup de patients constatent que l'effet tend à durer un peu plus longtemps : le muscle, moins sollicité, prend d'autres habitudes.",
        ],
      },
      {
        title: "Ce qui fait varier la durée",
        paragraphs: ["La durée n'est pas la même pour tout le monde. Plusieurs facteurs entrent en jeu :"],
        list: [
          "La zone traitée : le front, les rides du lion et les pattes d'oie n'ont pas la même force musculaire",
          "La force des muscles et l'expressivité de chacun",
          "La dose utilisée, adaptée à chaque visage",
          "Le métabolisme, l'activité physique intense et l'âge",
          "Le nombre de séances déjà réalisées",
        ],
      },
      {
        title: "À quel rythme refaire les séances ?",
        paragraphs: [
          "En général, deux à trois séances par an suffisent. Il n'est pas utile de rapprocher les injections : attendre au moins trois mois entre deux séances est la règle, pour limiter le risque que l'organisme développe une résistance au produit.",
          "Le bon moment pour revenir, c'est quand vous sentez que le mouvement revient et que la ride se remarque à nouveau, sans attendre qu'elle soit redevenue aussi marquée qu'avant.",
        ],
      },
      {
        title: "Un résultat naturel, et réversible",
        paragraphs: [
          "Mon objectif est de détendre les muscles responsables des rides d'expression sans figer le visage : vous devez pouvoir froncer, sourire, exprimer vos émotions. Le dosage et les points d'injection sont choisis pour cela, après une analyse du visage au repos et en mouvement.",
          "Le caractère temporaire de la toxine est aussi une garantie : si un résultat ne vous convient pas, il s'estompe de lui-même.",
        ],
      },
    ],
    related: ["toxine-botulique", "acide-hyaluronique"],
    faq: [
      {
        q: "Le Botox fait-il des rides en plus quand on arrête ?",
        a: "Non. Quand l'effet s'estompe, le visage revient à son état d'avant le traitement. Arrêter ne crée pas de rides supplémentaires.",
      },
      {
        q: "Peut-on faire une retouche avant trois mois ?",
        a: "Un ajustement au contrôle des deux semaines est possible. En revanche, on évite de refaire une séance complète avant trois mois.",
      },
      {
        q: "Combien de temps dure une séance ?",
        a: "Environ quinze à vingt minutes, après la consultation. On peut reprendre ses activités tout de suite.",
      },
    ],
  },

  {
    slug: "fils-tenseurs-ou-endolifting",
    validated: false,
    title: "Fils tenseurs ou endolifting : que choisir pour un visage relâché ?",
    description:
      "Deux techniques sans chirurgie contre le relâchement du visage. Comment elles agissent, pour qui, et pourquoi on les associe parfois.",
    intro:
      "L'ovale moins net, les joues qui descendent, le cou qui perd sa tenue : le relâchement du visage a plusieurs causes, et il n'existe pas une seule réponse. Les fils tenseurs et l'endolifting sont deux techniques médicales sans chirurgie, souvent confondues. Elles n'agissent pourtant pas de la même façon.",
    sections: [
      {
        title: "D'abord, comprendre d'où vient le relâchement",
        paragraphs: [
          "Avec le temps, la peau produit moins de collagène et perd sa fermeté, les volumes du visage diminuent, et de petits amas graisseux peuvent s'installer au niveau des bajoues ou du double menton. Selon ce qui domine, le traitement ne sera pas le même.",
          "C'est tout l'enjeu de la consultation : avant de choisir une technique, j'analyse ce qui, dans votre visage, est responsable du relâchement.",
        ],
      },
      {
        title: "Les fils tenseurs : repositionner",
        paragraphs: [
          "Les fils tenseurs sont des fils fins et résorbables, glissés sous la peau sans incision. Selon leur type, ils soutiennent et remontent les tissus relâchés, ou stimulent surtout la production de collagène.",
          "Ils conviennent bien à un relâchement débutant à modéré des joues, de l'ovale ou des sourcils, quand la peau a encore une bonne épaisseur. L'effet de soutien est visible rapidement, puis s'affine en quelques semaines ; il dure en général douze à dix-huit mois.",
        ],
      },
      {
        title: "L'endolifting : retendre et affiner",
        paragraphs: [
          "L'endolifting utilise une fibre laser très fine, glissée sous la peau. La chaleur provoque une rétraction des tissus et stimule le collagène ; elle réduit aussi les petits amas graisseux localisés.",
          "Il est particulièrement intéressant quand le relâchement s'accompagne de bajoues ou d'un double menton, ou au niveau du cou. Le résultat s'installe progressivement sur trois à six mois, en général après une seule séance.",
        ],
      },
      {
        title: "Comment choisir ?",
        paragraphs: ["Pour résumer, à titre indicatif :"],
        list: [
          "Joues et ovale qui « tombent », peau de bonne qualité : les fils tenseurs sont souvent indiqués",
          "Bajoues, double menton ou cou relâché avec un peu de graisse : l'endolifting est souvent plus adapté",
          "Relâchement associé à une perte de volume : l'acide hyaluronique peut compléter, en restaurant les appuis",
          "Excès de peau important : aucune technique sans chirurgie ne donnera un résultat satisfaisant, et je vous le dis franchement",
        ],
      },
      {
        title: "Pourquoi les associer parfois",
        paragraphs: [
          "Les deux techniques ne s'opposent pas. Sur certains visages, l'endolifting retend et affine la partie basse, tandis que les fils repositionnent les joues. Le plan de traitement est toujours construit en consultation, en fonction de votre visage, de vos attentes et de ce qui est réaliste.",
        ],
      },
    ],
    related: ["fils-tenseurs", "endolifting", "acide-hyaluronique"],
    faq: [
      {
        q: "Les fils tenseurs remplacent-ils un lifting chirurgical ?",
        a: "Non. Ils traitent un relâchement débutant à modéré. Un lifting chirurgical reste la solution quand l'excès de peau est important.",
      },
      {
        q: "Quelle technique a le moins de suites ?",
        a: "Les deux entraînent un gonflement et une sensibilité de quelques jours. Les consignes précises vous sont données après la séance.",
      },
      {
        q: "Peut-on faire les deux le même jour ?",
        a: "C'est possible dans certains cas. Le calendrier dépend du plan de traitement établi en consultation.",
      },
    ],
  },

  {
    slug: "injection-acide-hyaluronique-avant-apres",
    validated: false,
    title: "Injection d'acide hyaluronique : avant, pendant et après",
    description:
      "Préparation, déroulement de la séance, suites et résultat : tout ce qu'il faut savoir avant une injection d'acide hyaluronique (lèvres, sillons, pommettes).",
    intro:
      "L'acide hyaluronique permet de restaurer un volume perdu, d'atténuer un sillon ou de redessiner les lèvres. C'est un geste médical précis, qui demande une bonne préparation. Voici comment se déroule une séance, de la consultation au résultat final.",
    sections: [
      {
        title: "Avant : la consultation",
        paragraphs: [
          "Tout commence par l'analyse de votre visage : ses proportions, les zones qui se sont réellement creusées, et ce que vous souhaitez corriger. L'objectif est de corriger sans transformer : des quantités mesurées, placées selon l'anatomie.",
          "Je vous demande aussi vos antécédents, vos traitements en cours et les injections que vous avez déjà eues. Certains éléments sont importants à signaler :",
        ],
        list: [
          "Un traitement anticoagulant, la prise d'aspirine ou de compléments qui fluidifient le sang",
          "Un antécédent d'herpès, notamment avant une injection des lèvres",
          "Une grossesse ou un allaitement",
          "Un soin dentaire ou un événement important prévu dans les jours qui suivent",
        ],
      },
      {
        title: "Pendant : la séance",
        paragraphs: [
          "La peau est désinfectée, et une crème anesthésiante peut être appliquée. La plupart des produits contiennent eux-mêmes un anesthésique local. Le gel est injecté à l'aiguille ou à la canule, selon la zone.",
          "La séance dure en général trente à quarante-cinq minutes. Les lèvres sont la zone la plus sensible ; ailleurs, la sensation reste supportable.",
        ],
      },
      {
        title: "Après : les suites normales",
        paragraphs: [
          "Un gonflement et une légère rougeur sont normaux pendant quelques jours, parfois avec de petits bleus. Pendant 48 heures, il est conseillé d'éviter :",
        ],
        list: [
          "Le sport intense",
          "La chaleur : sauna, hammam",
          "L'exposition au soleil",
          "Les massages de la zone, sauf indication de ma part",
        ],
      },
      {
        title: "Quand consulter sans attendre",
        paragraphs: [
          "Une douleur importante, une peau qui blanchit ou devient violacée, ou un trouble de la vision après une injection doivent faire consulter immédiatement. Ces complications sont exceptionnelles, mais elles demandent une prise en charge rapide : c'est l'une des raisons pour lesquelles une injection doit toujours être réalisée par un médecin.",
        ],
      },
      {
        title: "Le résultat",
        paragraphs: [
          "Le résultat est visible tout de suite, et définitif une fois le gonflement résorbé, en une à deux semaines. Il dure en général de six à dix-huit mois selon la zone et le produit : les lèvres, qui bougent beaucoup, se résorbent plus vite que les pommettes ou le menton.",
          "L'acide hyaluronique a un avantage important : il est réversible. Une enzyme, la hyaluronidase, permet de le dissoudre si nécessaire.",
        ],
      },
    ],
    related: ["acide-hyaluronique", "skinboosters", "toxine-botulique"],
    faq: [
      {
        q: "Est-ce que ça va se voir ?",
        a: "Le but est un résultat naturel. Les premiers jours, le gonflement peut accentuer le volume ; le résultat se juge après une à deux semaines.",
      },
      {
        q: "Peut-on se maquiller après une injection ?",
        a: "En général dès le lendemain, sur une peau propre.",
      },
      {
        q: "Faut-il une retouche ?",
        a: "Pas toujours. Une petite retouche peut être proposée après deux à quatre semaines si besoin.",
      },
    ],
  },

  {
    slug: "epilation-laser-peau-mate-foncee",
    validated: false,
    title: "Épilation laser sur peau mate ou foncée : est-ce possible ?",
    description:
      "Oui, avec un laser et des réglages adaptés. Ce qu'il faut savoir sur l'épilation laser des peaux mates et foncées : précautions, séances, résultats.",
    intro:
      "Longtemps, on a dit que l'épilation laser était réservée aux peaux claires et aux poils foncés. C'est de moins en moins vrai : les peaux mates et foncées peuvent être traitées, à condition de choisir le bon laser, les bons réglages, et de respecter quelques précautions.",
    sections: [
      {
        title: "Pourquoi la couleur de la peau compte",
        paragraphs: [
          "Le laser vise le pigment du poil, la mélanine, et le transforme en chaleur pour détruire sa racine. Mais la peau contient elle aussi de la mélanine : plus elle est foncée, plus elle risque d'absorber une partie de l'énergie, avec un risque de brûlure ou de taches.",
          "Tout l'enjeu est donc de cibler le poil en épargnant la peau. C'est une question de technologie et de réglages, pas une impossibilité.",
        ],
      },
      {
        title: "Ce qui rend le traitement possible",
        paragraphs: ["Sur une peau mate ou foncée, plusieurs éléments font la différence :"],
        list: [
          "Le choix d'un laser adapté aux peaux foncées",
          "Des réglages prudents, ajustés à chaque séance",
          "Un refroidissement de la peau pendant le tir",
          "Un test sur une petite zone si besoin, avant de traiter toute la surface",
          "Une peau non bronzée au moment de la séance",
        ],
      },
      {
        title: "Les précautions à respecter",
        paragraphs: [
          "Le soleil est le principal ennemi : une peau bronzée augmente fortement le risque de taches. Il faut éviter l'exposition et l'autobronzant pendant les quatre semaines qui précèdent chaque séance, et protéger la peau après.",
          "Entre les séances, le rasoir est autorisé, mais pas la cire, la pince ni l'épilateur : ils retirent la racine que le laser doit atteindre.",
        ],
      },
      {
        title: "Combien de séances ?",
        paragraphs: [
          "En général, six à huit séances, espacées de quatre à huit semaines selon la zone. Les poils ne poussent pas tous en même temps : chaque séance traite ceux qui sont en phase de croissance.",
          "Sur les zones sensibles aux hormones, comme le visage, une séance d'entretien par an peut être utile.",
        ],
      },
      {
        title: "Les limites",
        paragraphs: [
          "Le laser ne reconnaît pas les poils blancs, gris, blonds très clairs ou roux. Et une pilosité qui apparaît ou augmente brutalement mérite d'abord un bilan, avant tout traitement.",
        ],
      },
    ],
    related: ["epilation-laser", "peeling"],
    faq: [
      {
        q: "L'épilation laser est-elle douloureuse sur peau foncée ?",
        a: "La sensation est la même : de petits claquements chauds. Le refroidissement de la peau rend la séance supportable.",
      },
      {
        q: "Peut-on faire le laser en été ?",
        a: "C'est possible sur les zones non exposées au soleil. Les zones exposées se traitent plutôt en dehors des périodes de fort ensoleillement.",
      },
      {
        q: "Le résultat est-il définitif ?",
        a: "La pilosité diminue durablement et de façon très importante. Quelques poils fins peuvent repousser avec le temps.",
      },
    ],
  },

  {
    slug: "skinboosters-mesotherapie-prp-difference",
    validated: false,
    title: "Skinboosters, mésothérapie, PRP : quelle différence ?",
    description:
      "Trois soins pour améliorer la qualité de la peau, souvent confondus. Comment ils agissent, pour quelle peau, et comment choisir.",
    intro:
      "Peau terne, déshydratée, qui a perdu son éclat ou son élasticité : trois soins reviennent souvent quand on cherche à améliorer la qualité de la peau, sans changer les traits. Ils ont un point commun, des micro-injections dans la peau, mais pas le même mode d'action.",
    sections: [
      {
        title: "Les skinboosters : hydrater en profondeur",
        paragraphs: [
          "Les skinboosters sont des gels d'acide hyaluronique très fluides, peu ou pas réticulés. Contrairement à un comblement, ils n'ajoutent pas de volume : ils hydratent la peau de l'intérieur et améliorent son élasticité.",
          "Ils conviennent particulièrement aux peaux déshydratées, aux ridules fines, et aux zones qui se fripent comme le cou, le décolleté ou les mains. Le protocole compte en général deux à trois séances à un mois d'intervalle.",
        ],
      },
      {
        title: "La mésothérapie : revitaliser",
        paragraphs: [
          "La mésothérapie du visage, ou mésolift, apporte à la peau un mélange de vitamines, d'acides aminés, de minéraux et d'acide hyaluronique. Elle revitalise une peau terne, fatiguée ou stressée.",
          "C'est un soin d'éclat, souvent réalisé en cure de trois à cinq séances rapprochées, puis en entretien.",
        ],
      },
      {
        title: "Le PRP : stimuler avec votre propre sang",
        paragraphs: [
          "Le PRP (plasma riche en plaquettes) est préparé à partir d'une petite prise de sang, centrifugée pour concentrer les plaquettes. Leurs facteurs de croissance stimulent le renouvellement de la peau et la production de collagène.",
          "Il améliore l'éclat, la texture et les ridules, et accompagne aussi la cicatrisation après un laser. Comme il provient de votre propre sang, le risque d'allergie est très faible. La réponse varie d'une personne à l'autre.",
        ],
      },
      {
        title: "Comment choisir ?",
        paragraphs: ["À titre indicatif :"],
        list: [
          "Peau déshydratée, qui manque d'élasticité : les skinboosters",
          "Teint terne, peau fatiguée, besoin d'éclat : la mésothérapie",
          "Texture, ridules, ou en complément d'un laser : le PRP",
          "Perte de volume, sillons, rides d'expression : aucun des trois, d'autres soins sont plus adaptés",
        ],
      },
      {
        title: "Peut-on les associer ?",
        paragraphs: [
          "Oui, et c'est souvent intéressant : ces soins sont complémentaires. Le choix et le calendrier dépendent de votre peau ; je vous propose un protocole après l'avoir examinée en consultation.",
        ],
      },
    ],
    related: ["skinboosters", "mesotherapie", "prp-visage", "peeling"],
    faq: [
      {
        q: "Ces soins changent-ils les traits du visage ?",
        a: "Non. Ils améliorent la qualité de la peau, pas les volumes ni les traits.",
      },
      {
        q: "Y a-t-il des suites ?",
        a: "De petites marques ou papules pendant 24 à 48 heures, parfois quelques bleus. On reprend ses activités tout de suite.",
      },
      {
        q: "Quand voit-on le résultat ?",
        a: "Un éclat est souvent visible en quelques jours ; le résultat complet s'apprécie à la fin du protocole.",
      },
    ],
  },

  {
    slug: "bien-preparer-premiere-consultation-esthetique",
    validated: false,
    title: "Bien préparer sa première consultation de médecine esthétique",
    description:
      "Questions à poser, informations à apporter, ce qui se passe pendant la consultation : comment préparer votre premier rendez-vous de médecine esthétique.",
    intro:
      "Une première consultation de médecine esthétique n'engage à rien. C'est un temps pour comprendre votre demande, examiner votre visage ou votre peau, et décider ensemble s'il faut traiter, comment, ou s'il vaut mieux s'abstenir. Quelques éléments vous aideront à en tirer le meilleur.",
    sections: [
      {
        title: "Ce que vous pouvez préparer",
        paragraphs: ["Avant de venir, pensez à rassembler :"],
        list: [
          "La liste de vos traitements en cours, y compris les compléments alimentaires",
          "Vos antécédents médicaux : allergies, herpès, maladies auto-immunes, troubles de la coagulation",
          "Les soins esthétiques déjà réalisés, avec le nom des produits si possible",
          "Des photos de vous plus jeune, si votre demande concerne un changement avec le temps",
        ],
      },
      {
        title: "Ce qui se passe pendant la consultation",
        paragraphs: [
          "J'écoute d'abord ce qui vous gêne, avec vos mots. J'examine ensuite votre visage, au repos et en mouvement, ou la zone concernée. Je vous explique ce que je vois, ce qui est possible, ce qui ne l'est pas, et les différentes options.",
          "Il m'arrive de déconseiller un soin, ou de proposer une autre approche que celle que vous aviez en tête. Poser la bonne indication fait partie du soin.",
        ],
      },
      {
        title: "Les questions à poser",
        paragraphs: ["N'hésitez pas à demander :"],
        list: [
          "Quel résultat puis-je raisonnablement attendre ?",
          "Combien de séances, et à quel rythme ?",
          "Quelles sont les suites, et combien de temps faut-il prévoir ?",
          "Quels sont les risques, et que faire si quelque chose m'inquiète après ?",
          "Le résultat est-il réversible ?",
        ],
      },
      {
        title: "Prendre le temps de décider",
        paragraphs: [
          "Vous n'êtes jamais obligé de faire le soin le jour de la consultation. Pour certains actes, notamment en gynécologie esthétique, un délai de réflexion est même la règle. Une bonne décision est une décision prise sereinement.",
        ],
      },
      {
        title: "Pourquoi consulter un médecin",
        paragraphs: [
          "Les injections, les lasers et les fils sont des actes médicaux. Un médecin connaît l'anatomie, sait reconnaître une contre-indication, et peut prendre en charge une complication si elle survient. C'est une condition de sécurité, pas un détail.",
        ],
      },
    ],
    related: ["toxine-botulique", "acide-hyaluronique", "laser-co2"],
    faq: [
      {
        q: "La consultation oblige-t-elle à faire un soin ?",
        a: "Non. Elle sert à poser une indication et à vous informer. La décision vous appartient.",
      },
      {
        q: "Peut-on faire le soin le jour même ?",
        a: "Pour certains soins simples, c'est possible si l'indication est claire et que vous le souhaitez. Pour d'autres, un délai est préférable.",
      },
      {
        q: "Combien de temps dure une première consultation ?",
        a: "Le temps nécessaire pour comprendre votre demande et répondre à vos questions, en général une vingtaine de minutes à une demi-heure.",
      },
    ],
  },
];

const preview = () => process.env.FICHES_PREVIEW === "1";

/** Articles publiés (validés), ou tous les brouillons si l'aperçu est activé (FICHES_PREVIEW=1). */
export const publishedArticles = () => articles.filter((a) => a.validated || preview());

export const getArticle = (slug: string) => publishedArticles().find((a) => a.slug === slug);
