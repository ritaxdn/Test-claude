// Articles du Journal : le savoir du Dr Dadoun, expliqué aux patients.
// À COMPLÉTER : relecture et validation médicale par le Dr Dadoun avant publication.

export type ArticleSection = { heading: string; paragraphs: string[] };

export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readingTime: string;
  date: string; // AAAA-MM-JJ
  takeaways: string[];
  sections: ArticleSection[];
};

export const expertise = [
  {
    title: "Anatomie du visage",
    text: "Chaque injection repose sur une connaissance fine des plans anatomiques, des vaisseaux et des compartiments graisseux.",
  },
  {
    title: "Vieillissement cutané",
    text: "Comprendre les mécanismes du vieillissement pour traiter la cause, pas seulement le symptôme.",
  },
  {
    title: "Harmonie des proportions",
    text: "Une lecture globale du visage : le résultat se juge sur l'ensemble, jamais sur une ride isolée.",
  },
  {
    title: "Sécurité des actes",
    text: "Prévention, reconnaissance et prise en charge des complications font partie intégrante de la pratique.",
  },
];

export const articles: Article[] = [
  {
    slug: "vieillissement-du-visage",
    category: "Comprendre",
    title: "Comment vieillit un visage ? Ce qui change vraiment",
    excerpt:
      "Les rides ne sont que la partie visible. Os, graisses, muscles et peau évoluent chacun à leur rythme — et c'est leur combinaison qui transforme les traits.",
    readingTime: "6 min",
    date: "2026-09-01",
    takeaways: [
      "Le vieillissement touche quatre couches : os, graisses, muscles et peau.",
      "Un visage « fatigué » est souvent un visage qui a perdu du soutien, pas seulement de l'élasticité.",
      "Traiter la cause (volume, qualité de peau) donne un résultat plus naturel que combler une ride.",
    ],
    sections: [
      {
        heading: "Une affaire de couches",
        paragraphs: [
          "On imagine souvent le vieillissement comme une peau qui se relâche. En réalité, le visage est une architecture en couches superposées : l'os en profondeur, puis des compartiments de graisse, les muscles de l'expression, et enfin la peau. Chacune de ces couches évolue avec le temps, et c'est leur combinaison qui modifie progressivement les traits.",
        ],
      },
      {
        heading: "L'os : la charpente qui se remodèle",
        paragraphs: [
          "Avec l'âge, l'os du visage se résorbe lentement à certains endroits : le pourtour des orbites s'élargit, le relief des pommettes s'estompe, la mâchoire perd de sa définition. Cette perte de charpente est discrète, mais elle prive les tissus situés au-dessus de leur soutien.",
        ],
      },
      {
        heading: "Les graisses : des volumes qui se déplacent",
        paragraphs: [
          "Le visage contient plusieurs compartiments graisseux distincts. Certains fondent (tempes, joues profondes), d'autres ont tendance à descendre ou à s'accumuler (bas du visage). C'est ce qui explique l'apparition du sillon naso-génien, des bajoues ou d'un creux sous les yeux.",
          "C'est aussi pourquoi « remplir une ride » n'est pas toujours la bonne réponse : restaurer un soutien plus haut, au niveau de la pommette par exemple, peut suffire à atténuer un sillon de façon plus naturelle.",
        ],
      },
      {
        heading: "Les muscles et la peau",
        paragraphs: [
          "Les muscles de l'expression, sollicités des milliers de fois par jour, marquent la peau de rides dynamiques (front, lion, pattes d'oie), qui finissent par devenir visibles au repos.",
          "La peau, elle, s'amincit : la production de collagène et d'élastine diminue d'environ 1 % par an à partir de la vingtaine, et le soleil accélère considérablement ce processus. Le teint perd en éclat, les pores se dilatent, des taches apparaissent.",
        ],
      },
      {
        heading: "Ce que cela change dans ma pratique",
        paragraphs: [
          "Comprendre ces mécanismes permet de construire un plan de traitement cohérent : soutenir là où le volume manque, détendre là où le muscle marque trop, et améliorer la qualité de la peau en parallèle. C'est cette lecture globale qui fait la différence entre un visage « traité » et un visage simplement reposé.",
        ],
      },
    ],
  },
  {
    slug: "acide-hyaluronique",
    category: "Soins",
    title: "Acide hyaluronique : comprendre pour mieux choisir",
    excerpt:
      "Molécule naturellement présente dans la peau, l'acide hyaluronique est l'outil de base de la médecine esthétique. Mais tous les produits — et toutes les techniques — ne se valent pas.",
    readingTime: "7 min",
    date: "2026-08-18",
    takeaways: [
      "Il existe de nombreux gels, plus ou moins fermes, choisis selon la zone et l'objectif.",
      "L'acide hyaluronique est résorbable et peut être dissous en cas de besoin.",
      "La connaissance anatomique de l'injecteur est le premier facteur de sécurité.",
    ],
    sections: [
      {
        heading: "Une molécule que le corps connaît",
        paragraphs: [
          "L'acide hyaluronique est un composant naturel de la peau, où il retient l'eau et assure hydratation et souplesse. Les produits injectables sont fabriqués par biofermentation, puis « réticulés » : leurs chaînes sont reliées entre elles pour former un gel plus stable, qui résiste plus longtemps à la dégradation naturelle.",
        ],
      },
      {
        heading: "Un gel pour chaque indication",
        paragraphs: [
          "Plus un gel est réticulé et ferme, plus il a de pouvoir de soutien : on l'utilise en profondeur, au contact de l'os, pour redonner du relief aux pommettes, au menton ou à la ligne de la mâchoire. À l'inverse, les gels souples et fluides conviennent aux lèvres, aux rides fines ou à la vallée des larmes, où le naturel du mouvement est primordial.",
          "Les skinboosters, eux, utilisent un acide hyaluronique peu ou pas réticulé : ils n'apportent pas de volume mais hydratent la peau de l'intérieur et améliorent son éclat.",
        ],
      },
      {
        heading: "Combien de temps dure le résultat ?",
        paragraphs: [
          "Selon le produit, la zone et le métabolisme de chacun, le résultat persiste en général de 9 à 18 mois. Les zones très mobiles (lèvres) résorbent plus vite que les zones profondes et statiques (pommettes). Un entretien léger permet de maintenir le résultat sans jamais « surcharger ».",
        ],
      },
      {
        heading: "La sécurité avant tout",
        paragraphs: [
          "Les effets secondaires les plus fréquents sont bénins et transitoires : rougeur, gonflement, petit hématome. La complication la plus redoutée, rare, est l'injection accidentelle dans un vaisseau. Sa prévention repose sur la connaissance anatomique, le choix de la technique (aiguille ou canule), l'injection lente et en petites quantités.",
          "Un atout majeur de l'acide hyaluronique : il peut être dissous par une enzyme, la hyaluronidase. Tout médecin injecteur doit en disposer au cabinet et savoir l'utiliser.",
        ],
      },
      {
        heading: "Mon conseil",
        paragraphs: [
          "Méfiez-vous des prix « au millilitre » et des promesses de transformation. La bonne question n'est pas « combien de seringues ? » mais « de quoi mon visage a-t-il réellement besoin ? ». Parfois, la réponse honnête est : de rien du tout, ou d'un simple travail sur la qualité de peau.",
        ],
      },
    ],
  },
  {
    slug: "toxine-botulique-idees-recues",
    category: "Soins",
    title: "Toxine botulique : cinq idées reçues",
    excerpt:
      "Visage figé, poison, dépendance… La toxine botulique suscite beaucoup de craintes. Voici ce qu'il en est réellement.",
    readingTime: "5 min",
    date: "2026-07-30",
    takeaways: [
      "Bien dosée, la toxine botulique adoucit l'expression sans la figer.",
      "Elle est utilisée en médecine depuis plus de 40 ans, à des doses infimes.",
      "Son effet est temporaire et entièrement réversible.",
    ],
    sections: [
      {
        heading: "« Ça fige le visage »",
        paragraphs: [
          "Le visage figé est le résultat d'un surdosage, pas du produit lui-même. L'objectif est de réduire l'intensité d'une contraction, pas de la supprimer. Un front traité avec justesse garde sa mobilité : on peut toujours exprimer la surprise, simplement sans creuser de rides profondes.",
        ],
      },
      {
        heading: "« C'est un poison dangereux »",
        paragraphs: [
          "La toxine botulique est une protéine purifiée, utilisée en médecine depuis les années 1980 en neurologie et en ophtalmologie. Les doses utilisées en esthétique sont infimes et très éloignées des doses toxiques. Il s'agit d'un médicament, dont l'injection est réservée aux médecins.",
        ],
      },
      {
        heading: "« Une fois qu'on commence, on ne peut plus arrêter »",
        paragraphs: [
          "Il n'y a aucune dépendance. L'effet s'estompe progressivement en 4 à 6 mois et le muscle retrouve son activité initiale. Si l'on arrête, les rides ne s'aggravent pas : on retrouve simplement le visage que l'on aurait eu sans traitement.",
        ],
      },
      {
        heading: "« L'effet est immédiat »",
        paragraphs: [
          "L'effet apparaît en 3 à 5 jours et atteint son maximum vers le 15e jour. C'est pourquoi une consultation de contrôle vers la deuxième ou troisième semaine permet d'ajuster finement si nécessaire.",
        ],
      },
      {
        heading: "« C'est réservé aux rides »",
        paragraphs: [
          "Au-delà des rides d'expression, la toxine botulique est aussi utilisée pour traiter la transpiration excessive (hyperhidrose), le bruxisme (serrement des dents) ou encore certaines asymétries du sourire. Chaque indication fait l'objet d'une évaluation médicale.",
        ],
      },
    ],
  },
  {
    slug: "routine-peau-fondamentaux",
    category: "Prévention",
    title: "Les trois piliers d'une peau en bonne santé",
    excerpt:
      "Avant tout soin au cabinet, ce que vous faites chaque jour compte le plus. Trois gestes, validés par la science, suffisent à faire la différence.",
    readingTime: "5 min",
    date: "2026-07-10",
    takeaways: [
      "La photoprotection quotidienne est le geste anti-âge le plus efficace.",
      "Les rétinoïdes sont les actifs les mieux documentés contre le vieillissement cutané.",
      "Une routine simple, suivie régulièrement, vaut mieux qu'une routine complexe abandonnée.",
    ],
    sections: [
      {
        heading: "1. Se protéger du soleil, tous les jours",
        paragraphs: [
          "Les ultraviolets sont responsables de la majeure partie du vieillissement visible de la peau : taches, rides fines, perte de fermeté. Un écran solaire à large spectre (SPF 30 à 50), appliqué chaque matin — y compris en ville et par temps couvert —, est le geste anti-âge le plus efficace qui existe.",
          "Pour les peaux sujettes aux taches, une protection teintée, qui filtre aussi la lumière visible, est particulièrement utile.",
        ],
      },
      {
        heading: "2. Stimuler le renouvellement : les rétinoïdes",
        paragraphs: [
          "Dérivés de la vitamine A, les rétinoïdes accélèrent le renouvellement cellulaire et stimulent la production de collagène. Ils améliorent le grain de peau, les ridules et les taches. On les introduit progressivement, le soir, pour limiter les irritations. Ils sont contre-indiqués pendant la grossesse.",
        ],
      },
      {
        heading: "3. Protéger et hydrater",
        paragraphs: [
          "Le matin, un antioxydant comme la vitamine C aide à neutraliser les radicaux libres et unifie le teint. Une crème hydratante adaptée à votre type de peau restaure la barrière cutanée. Inutile de multiplier les produits : la régularité compte davantage que le nombre d'étapes.",
        ],
      },
      {
        heading: "Et au cabinet ?",
        paragraphs: [
          "Les soins médicaux — peelings, skinboosters, lasers — viennent potentialiser ces bases, jamais les remplacer. Lors de la consultation, je vous propose une routine adaptée à votre peau, car un bon résultat se construit aussi à la maison.",
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};
