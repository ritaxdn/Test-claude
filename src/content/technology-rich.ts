import type { LocalizedText } from "./technologies";

/**
 * Fiches machines enrichies (pages produit qui rankent : technologies, pour quel cabinet, protocole, FAQ, vidéo).
 * Uniquement des informations de la brochure LGL Expert ou validées par Cellulift.
 * Prix : toujours « sur demande » (choix Cellulift, ne pas publier de prix).
 */
export type RichSheet = {
  /** Suite du H1 après le nom de la machine (« La Queen : … ») */
  h1: LocalizedText;
  /** Accroche sous le H1 (remplace la phrase courte de la fiche) */
  hook: LocalizedText;
  /** Marque (données Product), si elle figure sur la brochure */
  brand?: string;
  /** Titre de la section des modules (par défaut « N technologies dans une seule plateforme ») */
  modulesTitle?: LocalizedText;
  /** Les modules de la machine : nom, caractéristique clé, à quoi il sert */
  modules: { name: string | LocalizedText; spec: string | LocalizedText; text: LocalizedText }[];
  /** Pour quel type de cabinet */
  forWho: LocalizedText[];
  /** Comment se construit un protocole */
  protocol: LocalizedText;
  /** Tableau indication → technologie */
  indications: { indication: LocalizedText; tech: string | LocalizedText }[];
  /** Pourquoi c'est rentable (sans chiffre inventé) */
  profit: LocalizedText;
  /** Caractéristiques techniques (brochure) */
  specs: [LocalizedText, LocalizedText][];
  /** Maillage : fiches proches */
  related: string[];
  faq: { q: LocalizedText; a: LocalizedText }[];
  /** Vidéo Instagram de la machine (reel) */
  instagram?: string;
};

const t = (fr: string, en: string): LocalizedText => ({ fr, en });

/** Texte simple ou traduit, dans la langue de la page */
export const loc = (x: string | LocalizedText, lang: "fr" | "en") => (typeof x === "string" ? x : x[lang]);

/** Questions communes à toutes les fiches enrichies (prix, formation, garantie, inclus, démo) */
const commonFaq = (fr: string, en: string): RichSheet["faq"] => [
  {
    q: t(`Quel est le prix de ${fr}\u00a0?`, `How much does ${en} cost?`),
    a: t(
      "Le prix dépend de la configuration et est communiqué sur demande. Des solutions de financement sont disponibles ; un expert Cellulift vous fait une proposition personnalisée.",
      "Pricing depends on the configuration and is shared on request. Financing options are available; a Cellulift expert makes you a tailored proposal."
    ),
  },
  {
    q: t("Quelle formation est incluse\u00a0?", "What training is included?"),
    a: t(
      "La formation CELLULIFT Academy est incluse : prise en main, sécurité et protocoles par indication.",
      "CELLULIFT Academy training is included: getting started, safety and protocols for each indication."
    ),
  },
  {
    q: t("Que couvre la garantie\u00a0?", "What does the warranty cover?"),
    a: t(
      "24 mois main-d'œuvre, avec déplacement de nos techniciens et diagnostic en atelier.",
      "24 months of labour, with on-site visits by our technicians and diagnosis in our workshop."
    ),
  },
  {
    q: t("Qu'est-ce qui est inclus à l'achat\u00a0?", "What is included with the purchase?"),
    a: t(
      "L'installation et la mise en service par nos techniciens, la formation CELLULIFT Academy, les protocoles de traitement, la garantie de 24 mois main-d'œuvre et le service après-vente.",
      "Installation and commissioning by our technicians, CELLULIFT Academy training, treatment protocols, the 24-month labour warranty and after-sales service."
    ),
  },
  {
    q: t("Peut-on voir la machine avant d'acheter\u00a0?", "Can I see the device before buying?"),
    a: t(
      "Oui. Réservez une démonstration dans l'une de nos agences, à Casablanca, Marrakech ou Tanger.",
      "Yes. Book a demonstration at one of our branches in Casablanca, Marrakech or Tangier."
    ),
  },
];

export const richSheets: Record<string, RichSheet> = {
  "la-queen": {
    h1: t("plateforme laser 4-en-1 pour cabinets et centres médico-esthétiques", "4-in-1 laser platform for aesthetic practices and centres"),
    hook: t(
      "Épilation tous phototypes, vasculaire, pigments, détatouage et IPL : 4 technologies et 4 000 W dans une seule machine. Une plateforme pensée pour élargir votre carte de soins sans multiplier les équipements.",
      "Hair removal for all skin types, vascular, pigment, tattoo removal and IPL: 4 technologies and 4,000 W in a single device. A platform built to widen your treatment menu without multiplying equipment."
    ),
    brand: "LGL Expert",
    indications: [
      { indication: t("Épilation définitive, tous phototypes", "Permanent hair removal, all skin types"), tech: "Diode 755 / 808 / 1064 nm" },
      { indication: t("Varicosités, télangiectasies", "Spider veins, telangiectasia"), tech: "Vasculaire 980 nm" },
      { indication: t("Mélasma, lentigos, naevus", "Melasma, lentigines, naevi"), tech: "Nd:YAG Q-switched" },
      { indication: t("Détatouage toutes couleurs", "Multicolour tattoo removal"), tech: "Nd:YAG Q-switched" },
      { indication: t("Carbon Peel", "Carbon Peel"), tech: "Nd:YAG Q-switched 1320 nm" },
      { indication: t("Acné, taches, vieillissement cutané", "Acne, spots, skin ageing"), tech: "IPL / OPT" },
    ],
    profit: t(
      "Une seule machine couvre l'acte le plus demandé en médecine esthétique, l'épilation laser, et des actes complémentaires à plus forte valeur : pigments, vasculaire, détatouage. Vous amortissez un investissement unique sur plusieurs lignes de revenus.",
      "A single device covers the most requested aesthetic procedure, laser hair removal, plus higher-value complementary treatments: pigment, vascular, tattoo removal. You pay off one investment across several revenue streams."
    ),
    specs: [
      [t("Puissance", "Power"), t("4 000 W", "4,000 W")],
      [t("Diode", "Diode"), t("755 / 808 / 1064 nm", "755 / 808 / 1064 nm")],
      [t("Vasculaire", "Vascular"), t("980 nm", "980 nm")],
      [t("Nd:YAG Q-switched", "Q-switched Nd:YAG"), t("532 / 1064 / 1320 nm", "532 / 1064 / 1320 nm")],
      [t("IPL / OPT", "IPL / OPT"), t("5 filtres", "5 filters")],
      [t("Refroidissement", "Cooling"), t("Contact saphir", "Sapphire contact")],
      [t("Autonomie de travail", "Working time"), t("Jusqu'à 18 h en continu", "Up to 18 h continuous")],
      [t("Écran", "Screen"), t("Tactile 10 pouces", "10-inch touchscreen")],
      [t("Certification", "Certification"), t("CE · FDA", "CE · FDA")],
      [t("Fabricant", "Manufacturer"), t("LGL Expert", "LGL Expert")],
    ],
    related: ["alex-yag-ultra", "new-epil-light"],
    modules: [
      {
        name: "Laser diode",
        spec: "755 · 808 · 1064 nm",
        text: t(
          "Trois longueurs d'onde combinées pour l'épilation définitive de tous les phototypes, toute l'année, y compris sur peau mate ou bronzée.",
          "Three combined wavelengths for permanent hair removal on all skin types, all year round, including darker or tanned skin."
        ),
      },
      {
        name: "Laser vasculaire",
        spec: "980 nm",
        text: t(
          "Traitement ciblé des varicosités et des télangiectasies du visage et des jambes.",
          "Targeted treatment of spider veins and telangiectasia on the face and legs."
        ),
      },
      {
        name: "Nd:YAG Q-switched",
        spec: "532 · 1064 · 1320 nm",
        text: t(
          "Pigments (mélasma, lentigos, naevus), détatouage toutes couleurs et Carbon Peel à 1320 nm.",
          "Pigmentation (melasma, lentigines, naevi), multicolour tattoo removal and Carbon Peel at 1320 nm."
        ),
      },
      {
        name: "IPL / OPT",
        spec: t("5 filtres", "5 filters"),
        text: t(
          "Acné, taches et signes du vieillissement cutané, pour compléter vos soins visage.",
          "Acne, spots and signs of skin ageing, to round out your facial treatments."
        ),
      },
    ],
    forWho: [
      t(
        "Les centres d'épilation laser qui veulent traiter tous les phototypes et ajouter le vasculaire, le pigmentaire et le détatouage sans acheter quatre machines.",
        "Laser hair removal centres that want to treat every skin type and add vascular, pigment and tattoo removal without buying four devices."
      ),
      t(
        "Les cabinets de dermatologie et de médecine esthétique qui cherchent une plateforme unique pour la majorité des demandes laser de leurs patients.",
        "Dermatology and aesthetic medicine practices looking for a single platform for most of their patients' laser requests."
      ),
      t(
        "Les cliniques à fort volume : la machine fonctionne en continu jusqu'à 18 heures, avec un refroidissement par contact saphir.",
        "High-volume clinics: the device runs continuously for up to 18 hours, with sapphire contact cooling."
      ),
    ],
    protocol: t(
      "Le nombre de séances dépend de chaque patient : phototype, zone traitée, nature du poil ou de la lésion. Les paramètres se règlent sur l'écran tactile de 10 pouces, et la formation CELLULIFT Academy vous apprend à construire et ajuster chaque protocole, indication par indication.",
      "The number of sessions depends on each patient: skin type, treatment area, type of hair or lesion. Settings are adjusted on the 10-inch touchscreen, and CELLULIFT Academy training teaches you to build and adjust each protocol, indication by indication."
    ),
    faq: [
      {
        q: t("La Queen convient-elle aux peaux foncées ?", "Is La Queen suitable for dark skin?"),
        a: t(
          "Oui. La combinaison 755/808/1064 nm permet d'adapter le traitement à tous les phototypes, le 1064 nm étant la longueur d'onde de référence pour les peaux foncées.",
          "Yes. The 755/808/1064 nm combination lets you adapt treatment to every skin type, 1064 nm being the reference wavelength for dark skin."
        ),
      },
      {
        q: t("Peut-on faire de l'épilation en été ?", "Can hair removal be done in summer?"),
        a: t(
          "Oui, l'épilation diode peut être réalisée toute l'année, à condition de respecter les protocoles enseignés en formation.",
          "Yes, diode hair removal can be performed all year round, provided the protocols taught in training are followed."
        ),
      },
      {
        q: t("Que peut-on traiter avec La Queen, en dehors de l'épilation ?", "What can La Queen treat besides hair removal?"),
        a: t(
          "Les varicosités et télangiectasies (laser 980 nm), le mélasma, les lentigos et les naevus, le détatouage toutes couleurs et le Carbon Peel (Nd:YAG Q-switched), ainsi que l'acné, les taches et les signes du vieillissement (IPL/OPT à 5 filtres).",
          "Spider veins and telangiectasia (980 nm laser), melasma, lentigines and naevi, multicolour tattoo removal and Carbon Peel (Q-switched Nd:YAG), plus acne, spots and signs of ageing (five-filter IPL/OPT)."
        ),
      },
      {
        q: t("La Queen est-elle certifiée ?", "Is La Queen certified?"),
        a: t("Oui. La Queen est certifiée CE et FDA.", "Yes. La Queen is CE and FDA certified."),
      },
      {
        q: t("Combien de séances faut-il ?", "How many sessions are needed?"),
        a: t(
          "Cela dépend du patient : phototype, zone, nature du poil ou de la lésion. La formation CELLULIFT Academy vous apprend à adapter le protocole à chaque cas.",
          "It depends on the patient: skin type, area, type of hair or lesion. CELLULIFT Academy training teaches you to adapt the protocol to each case."
        ),
      },
      {
        q: t("La machine supporte-t-elle une forte cadence ?", "Can the device handle a high patient volume?"),
        a: t(
          "Oui. La Queen fonctionne en continu jusqu'à 18 heures, avec un refroidissement par contact saphir.",
          "Yes. La Queen runs continuously for up to 18 hours, with sapphire contact cooling."
        ),
      },
      {
        q: t("Quel est le prix de La Queen ?", "How much does La Queen cost?"),
        a: t(
          "Le prix dépend de la configuration et des pièces à main choisies : il est communiqué sur demande. Des solutions de financement sont disponibles ; un expert Cellulift vous fait une proposition personnalisée.",
          "Pricing depends on the configuration and the handpieces chosen, and is shared on request. Financing options are available; a Cellulift expert makes you a tailored proposal."
        ),
      },
      {
        q: t("Quelle formation est incluse ?", "What training is included?"),
        a: t(
          "La formation CELLULIFT Academy est incluse : prise en main, sécurité laser et protocoles par indication.",
          "CELLULIFT Academy training is included: getting started, laser safety and protocols for each indication."
        ),
      },
      {
        q: t("Que couvre la garantie ?", "What does the warranty cover?"),
        a: t(
          "24 mois main-d'œuvre, avec déplacement de nos techniciens et diagnostic en atelier.",
          "24 months of labour, with on-site visits by our technicians and diagnosis in our workshop."
        ),
      },      {
        q: t("Qu'est-ce qui est inclus à l'achat ?", "What is included with the purchase?"),
        a: t(
          "L'installation et la mise en service par nos techniciens, la formation CELLULIFT Academy, les protocoles de traitement, une garantie de 24 mois main-d'œuvre et le service après-vente.",
          "Installation and commissioning by our technicians, CELLULIFT Academy training, treatment protocols, a 24-month labour warranty and after-sales service."
        ),
      },
      {
        q: t("Peut-on voir La Queen avant d'acheter ?", "Can I see La Queen before buying?"),
        a: t(
          "Oui, La Queen est en démonstration à notre showroom de Casablanca, N°02 Rue Savoie, Quartier des Hôpitaux, sur rendez-vous.",
          "Yes, La Queen is on demonstration at our Casablanca showroom, N°02 Rue Savoie, Quartier des Hôpitaux, by appointment."
        ),
      },
    ],
    instagram: "https://www.instagram.com/reel/C9-ZIWAt0Go/",
  },
  "alex-yag-ultra": {
    h1: t("laser Alexandrite 755 nm et Nd:YAG 1064 nm pour l'épilation et les lésions vasculaires", "Alexandrite 755 nm and Nd:YAG 1064 nm laser for hair removal and vascular lesions"),
    hook: t(
      "Deux longueurs d'onde de référence dans une seule plateforme : l'Alexandrite 755 nm pour la mélanine, le Nd:YAG 1064 nm pour l'oxyhémoglobine. Épilation de tous les phototypes, lésions pigmentaires et vasculaires, avec des résultats rapides en un minimum de séances.",
      "Two reference wavelengths in a single platform: Alexandrite 755 nm for melanin, Nd:YAG 1064 nm for oxyhaemoglobin. Hair removal on all skin types, pigmented and vascular lesions, with fast results in a minimum of sessions."
    ),
    brand: "LGL Expert",
    modulesTitle: t("2 longueurs d'onde dans une seule plateforme", "2 wavelengths in a single platform"),
    modules: [
      {
        name: "Alexandrite",
        spec: "755 nm",
        text: t(
          "La référence pour la mélanine : épilation définitive, y compris des poils plus fins ou plus clairsemés, et lésions pigmentaires bénignes.",
          "The reference for melanin: permanent hair removal, including finer or sparser hair, and benign pigmented lesions."
        ),
      },
      {
        name: "Nd:YAG",
        spec: "1064 nm",
        text: t(
          "La référence pour l'oxyhémoglobine : rougeurs, vaisseaux du visage, veines des jambes, angiomes et lacs veineux, et épilation des peaux foncées.",
          "The reference for oxyhaemoglobin: redness, facial vessels, leg veins, angiomas and venous lakes, and hair removal on dark skin."
        ),
      },
    ],
    forWho: [
      t(
        "Les cabinets de dermatologie qui traitent à la fois l'épilation, les lésions pigmentaires et les lésions vasculaires.",
        "Dermatology practices treating hair removal, pigmented lesions and vascular lesions alike."
      ),
      t(
        "Les centres d'épilation laser qui reçoivent tous les phototypes, y compris des patients aux poils fins ou clairsemés.",
        "Laser hair removal centres seeing every skin type, including patients with fine or sparse hair."
      ),
      t(
        "Les médecins esthétiques qui veulent ajouter le vasculaire (couperose, varicosités, angiomes) à leur carte de soins.",
        "Aesthetic physicians who want to add vascular treatments (rosacea, spider veins, angiomas) to their menu."
      ),
    ],
    protocol: t(
      "Le nombre de séances dépend de chaque patient : phototype, zone, nature du poil ou de la lésion. Fluences élevées, impulsions courtes et refroidissement puissant se règlent selon l'indication, et la formation CELLULIFT Academy vous apprend à construire chaque protocole.",
      "The number of sessions depends on each patient: skin type, area, type of hair or lesion. High fluence, short pulses and powerful cooling are set by indication, and CELLULIFT Academy training teaches you to build each protocol."
    ),
    indications: [
      { indication: t("Épilation définitive, tous types de peau, poils fins", "Permanent hair removal, all skin types, fine hair"), tech: "Alexandrite 755 / Nd:YAG 1064 nm" },
      { indication: t("Lésions pigmentaires bénignes", "Benign pigmented lesions"), tech: "Alexandrite 755 nm" },
      { indication: t("Rougeur diffuse et vaisseaux du visage", "Diffuse redness and facial vessels"), tech: "Nd:YAG 1064 nm" },
      { indication: t("Veines stellaires et veines des jambes", "Spider veins and leg veins"), tech: "Nd:YAG 1064 nm" },
      { indication: t("Angiomes, hémangiomes, lacs veineux", "Angiomas, haemangiomas, venous lakes"), tech: "Nd:YAG 1064 nm" },
      { indication: t("Rides", "Wrinkles"), tech: "Alexandrite / Nd:YAG" },
      { indication: t("Pseudo-folliculite de la barbe", "Beard pseudofolliculitis"), tech: "Alexandrite / Nd:YAG" },
    ],
    profit: t(
      "L'épilation laser est l'acte le plus demandé en cabinet ; l'Alex Yag Ultra y ajoute les lésions pigmentaires et vasculaires, des actes à plus forte valeur, sur la même plateforme. Des résultats rapides en un minimum de séances fidélisent les patients.",
      "Laser hair removal is the most requested procedure in practice; the Alex Yag Ultra adds pigmented and vascular lesions, higher-value treatments, on the same platform. Fast results in a minimum of sessions keep patients coming back."
    ),
    specs: [
      [t("Longueurs d'onde", "Wavelengths"), t("Alexandrite 755 nm · Nd:YAG 1064 nm", "Alexandrite 755 nm · Nd:YAG 1064 nm")],
      [t("Impulsions", "Pulses"), t("Courtes, fluences élevées", "Short, high fluence")],
      [t("Refroidissement", "Cooling"), t("Système de refroidissement puissant", "Powerful cooling system")],
      [t("Phototypes", "Skin types"), t("Tous", "All")],
      [t("Fabricant", "Manufacturer"), t("LGL Expert", "LGL Expert")],
    ],
    related: ["la-queen", "megalight"],
    faq: [
      {
        q: t("L'Alex Yag Ultra convient-il aux peaux foncées ?", "Is the Alex Yag Ultra suitable for dark skin?"),
        a: t(
          "Oui. L'épilation est possible sur tous les types de peau : le Nd:YAG 1064 nm est la longueur d'onde de référence pour les peaux foncées.",
          "Yes. Hair removal is possible on all skin types: Nd:YAG 1064 nm is the reference wavelength for dark skin."
        ),
      },
      {
        q: t("Pourquoi deux longueurs d'onde ?", "Why two wavelengths?"),
        a: t(
          "L'Alexandrite 755 nm cible la mélanine (poils, taches), le Nd:YAG 1064 nm cible l'oxyhémoglobine (vaisseaux). Une seule plateforme couvre ainsi l'épilation, le pigmentaire et le vasculaire.",
          "Alexandrite 755 nm targets melanin (hair, spots), Nd:YAG 1064 nm targets oxyhaemoglobin (vessels). One platform thus covers hair removal, pigment and vascular work."
        ),
      },
      {
        q: t("Traite-t-il les poils fins ?", "Does it treat fine hair?"),
        a: t("Oui, y compris les poils plus fins ou plus clairsemés.", "Yes, including finer or sparser hair."),
      },
      {
        q: t("Combien de séances faut-il ?", "How many sessions are needed?"),
        a: t(
          "Cela dépend du patient et de l'indication. La formation CELLULIFT Academy vous apprend à adapter le protocole à chaque cas.",
          "It depends on the patient and the indication. CELLULIFT Academy training teaches you to adapt the protocol to each case."
        ),
      },
      ...commonFaq("l'Alex Yag Ultra", "the Alex Yag Ultra"),
    ],
  },
  "laser-shock": {
    h1: t("laser Nd:YAG Q-switched pour le détatouage et les lésions pigmentaires", "Q-switched Nd:YAG laser for tattoo removal and pigmented lesions"),
    hook: t(
      "Des impulsions de haute énergie de quelques nanosecondes à 1064, 532 et 1320 nm : les pigments ciblés sont détruits sélectivement, en épargnant les tissus voisins. Détatouage, taches pigmentaires, naevus et Carbon Peel.",
      "High-energy pulses of a few nanoseconds at 1064, 532 and 1320 nm: targeted pigment is destroyed selectively while sparing surrounding tissue. Tattoo removal, pigmented spots, naevi and Carbon Peel."
    ),
    brand: "LGL Expert",
    modulesTitle: t("3 longueurs d'onde dans une seule machine", "3 wavelengths in a single device"),
    modules: [
      {
        name: "1064 nm",
        spec: "Nd:YAG Q-switched",
        text: t("Pénètre profondément pour cibler les pigments des couches profondes de la peau : tatouages sombres, taches.", "Penetrates deep to target pigment in the deeper skin layers: dark tattoos, spots."),
      },
      {
        name: "532 nm",
        spec: "Nd:YAG Q-switched",
        text: t("Pour les pigments plus superficiels et les couleurs de tatouage plus claires.", "For more superficial pigment and lighter tattoo colours."),
      },
      {
        name: "1320 nm",
        spec: "Carbon Peel",
        text: t("Le peeling au carbone : un soin visage à fort taux de retour patient.", "Carbon peel: a facial treatment with a high patient return rate."),
      },
    ],
    forWho: [
      t("Les cabinets de dermatologie et de médecine esthétique qui traitent le détatouage et les lésions pigmentaires.", "Dermatology and aesthetic medicine practices treating tattoo removal and pigmented lesions."),
      t("Les centres qui veulent ajouter le Carbon Peel à leur carte de soins visage.", "Centres that want to add Carbon Peel to their facial treatment menu."),
      t("Les praticiens qui veulent personnaliser chaque traitement : les paramètres se règlent sur un écran tactile.", "Practitioners who want to tailor each treatment: settings are adjusted on a touchscreen."),
    ],
    protocol: t(
      "Le nombre de séances dépend de chaque patient : type de pigment, profondeur, couleurs du tatouage, phototype. L'écran tactile permet de régler les paramètres selon les besoins de chaque patient, et la formation CELLULIFT Academy vous apprend à construire chaque protocole.",
      "The number of sessions depends on each patient: type of pigment, depth, tattoo colours, skin type. The touchscreen lets you set parameters for each patient, and CELLULIFT Academy training teaches you to build each protocol."
    ),
    indications: [
      { indication: t("Détatouage", "Tattoo removal"), tech: "1064 / 532 nm" },
      { indication: t("Taches pigmentaires", "Pigmented spots"), tech: "1064 / 532 nm" },
      { indication: t("Naevus et taches de naissance", "Naevi and birthmarks"), tech: "1064 / 532 nm" },
      { indication: t("Carbon Peel", "Carbon Peel"), tech: "1320 nm" },
    ],
    profit: t(
      "Le détatouage et les taches pigmentaires se traitent en plusieurs séances : chaque patient revient. Le Carbon Peel ajoute un soin visage à proposer à votre patientèle existante. Une machine facile à utiliser, avec des résultats rapides et efficaces.",
      "Tattoo and pigment removal take several sessions: every patient comes back. Carbon Peel adds a facial treatment to offer your existing patients. An easy-to-use device with fast, effective results."
    ),
    specs: [
      [t("Type de laser", "Laser type"), t("Nd:YAG Q-switched", "Q-switched Nd:YAG")],
      [t("Longueurs d'onde", "Wavelengths"), t("1064 / 532 / 1320 nm", "1064 / 532 / 1320 nm")],
      [t("Largeur d'impulsion", "Pulse width"), t("0 à 10 ns", "0 to 10 ns")],
      [t("Énergie d'impulsion", "Pulse energy"), t("0 à 2000 mJ", "0 to 2000 mJ")],
      [t("Puissance de sortie", "Output power"), t("500 W", "500 W")],
      [t("Écran", "Screen"), t("Tactile", "Touchscreen")],
      [t("Fabricant", "Manufacturer"), t("LGL Expert", "LGL Expert")],
    ],
    related: ["la-queen", "fotokrom"],
    faq: [
      {
        q: t("Le Laser Shock enlève-t-il toutes les couleurs de tatouage ?", "Does the Laser Shock remove every tattoo colour?"),
        a: t(
          "Ses deux longueurs d'onde de détatouage, 1064 nm et 532 nm, ciblent des pigments différents : le 1064 nm les encres sombres et profondes, le 532 nm les pigments plus superficiels et les couleurs plus claires.",
          "Its two tattoo-removal wavelengths, 1064 nm and 532 nm, target different pigments: 1064 nm for dark, deep inks, 532 nm for more superficial pigment and lighter colours."
        ),
      },
      {
        q: t("Comment le laser agit-il sans abîmer la peau ?", "How does the laser work without damaging the skin?"),
        a: t(
          "Le faisceau est absorbé sélectivement par le pigment ciblé. La destruction se produit en quelques nanosecondes, ce qui minimise les dommages thermiques aux tissus environnants.",
          "The beam is selectively absorbed by the targeted pigment. Destruction happens within nanoseconds, which minimises thermal damage to surrounding tissue."
        ),
      },
      {
        q: t("Qu'est-ce que le Carbon Peel ?", "What is Carbon Peel?"),
        a: t(
          "Un soin visage réalisé à 1320 nm sur une fine couche de carbone appliquée sur la peau. Il complète la carte de soins visage du cabinet.",
          "A facial treatment performed at 1320 nm over a thin layer of carbon applied to the skin. It rounds out the practice's facial treatment menu."
        ),
      },
      {
        q: t("Combien de séances faut-il ?", "How many sessions are needed?"),
        a: t(
          "Cela dépend du patient : type de pigment, profondeur, couleurs du tatouage. La formation CELLULIFT Academy vous apprend à adapter le protocole à chaque cas.",
          "It depends on the patient: type of pigment, depth, tattoo colours. CELLULIFT Academy training teaches you to adapt the protocol to each case."
        ),
      },
      ...commonFaq("le Laser Shock", "the Laser Shock"),
    ],
  },
  "led-bio-light": {
    h1: t("panneau LED 4 couleurs pour la photomodulation du visage et du corps", "4-colour LED panel for face and body photomodulation"),
    hook: t(
      "Rouge, bleu, vert et jaune : une lumière froide et non invasive, choisie selon l'indication, sur une surface de traitement jusqu'à 50 × 20 cm. Acné, rougeurs, régénération cellulaire et peaux sensibles, en complément de vos protocoles.",
      "Red, blue, green and yellow: cold, non-invasive light chosen by indication, over a treatment area of up to 50 × 20 cm. Acne, redness, cell regeneration and sensitive skin, alongside your protocols."
    ),
    brand: "LGL Expert",
    modulesTitle: t("4 couleurs de LED, 4 actions", "4 LED colours, 4 actions"),
    modules: [
      {
        name: t("Rouge", "Red"),
        spec: "640 nm",
        text: t("Revitaliser la peau, accélérer la circulation sanguine, soulager les cicatrices d'acné.", "Revitalise the skin, boost blood circulation, soothe acne scars."),
      },
      {
        name: t("Bleu", "Blue"),
        spec: "423 nm",
        text: t("Agir contre les bactéries de l'acné, contrôler les glandes sébacées, apaiser l'inflammation.", "Act against acne bacteria, control sebaceous glands, calm inflammation."),
      },
      {
        name: t("Vert", "Green"),
        spec: "523 nm",
        text: t("Effets apaisants, sur peau sensible ; relaxation.", "Soothing effects on sensitive skin; relaxation."),
      },
      {
        name: t("Jaune", "Yellow"),
        spec: "583 nm",
        text: t("Taches rouges, rougissement du visage, lésions pigmentaires.", "Red spots, facial flushing, pigmented lesions."),
      },
    ],
    forWho: [
      t("Les cabinets de dermatologie qui traitent l'acné, les rougeurs et les peaux sensibles.", "Dermatology practices treating acne, redness and sensitive skin."),
      t("Les médecins esthétiques qui veulent accompagner leurs traitements (laser, peelings, microneedling) d'une phase de récupération.", "Aesthetic physicians who want to support their treatments (laser, peels, microneedling) with a recovery phase."),
      t("Les centres qui cherchent un soin visage et corps non invasif, sur une grande surface de traitement.", "Centres looking for a non-invasive face and body treatment over a large area."),
    ],
    protocol: t(
      "La couleur et la puissance (10 niveaux) se choisissent selon l'indication, et le nombre de séances dépend de chaque patient. La formation CELLULIFT Academy vous apprend à intégrer la LED à vos protocoles.",
      "Colour and power (10 levels) are chosen by indication, and the number of sessions depends on each patient. CELLULIFT Academy training teaches you to build LED into your protocols."
    ),
    indications: [
      { indication: t("Acné, contrôle des glandes sébacées", "Acne, sebaceous gland control"), tech: t("Bleu 423 nm", "Blue 423 nm") },
      { indication: t("Cicatrices d'acné, revitalisation", "Acne scars, revitalisation"), tech: t("Rouge 640 nm", "Red 640 nm") },
      { indication: t("Rougeurs, érythème, lésions pigmentaires", "Redness, erythema, pigmented lesions"), tech: t("Jaune 583 nm", "Yellow 583 nm") },
      { indication: t("Peaux sensibles, atopie", "Sensitive skin, atopy"), tech: t("Vert 523 nm", "Green 523 nm") },
      { indication: t("Régénération cellulaire", "Cell regeneration"), tech: t("Rouge 640 nm", "Red 640 nm") },
    ],
    profit: t(
      "La LED se propose seule ou en complément d'un autre soin, sans éviction sociale : elle valorise vos protocoles existants (après laser, peeling ou microneedling) et s'ajoute facilement à la séance.",
      "LED can be offered alone or alongside another treatment, with no downtime: it adds value to your existing protocols (after laser, peels or microneedling) and fits easily into the session."
    ),
    specs: [
      [t("Couleurs", "Colours"), t("Rouge 640 · bleu 423 · vert 523 · jaune 583 nm", "Red 640 · blue 423 · green 523 · yellow 583 nm")],
      [t("LED", "LEDs"), t("760 par couleur", "760 per colour")],
      [t("Puissance lumineuse", "Light power"), t("10 niveaux", "10 levels")],
      [t("Surface de traitement", "Treatment area"), t("Jusqu'à 50 × 20 cm", "Up to 50 × 20 cm")],
      [t("Commande", "Control"), t("Numérique", "Digital")],
      [t("Dimensions", "Dimensions"), t("70 × 45 × 142 cm", "70 × 45 × 142 cm")],
      [t("Poids", "Weight"), t("18 kg", "18 kg")],
      [t("Alimentation", "Power supply"), t("110–240 V, 50/60 Hz", "110–240 V, 50/60 Hz")],
      [t("Fabricant", "Manufacturer"), t("LGL Expert", "LGL Expert")],
    ],
    related: ["led-fotoskin-ultra", "longiflash"],
    faq: [
      {
        q: t("Quelle couleur pour quelle indication ?", "Which colour for which indication?"),
        a: t(
          "Bleu 423 nm contre les bactéries de l'acné, rouge 640 nm pour revitaliser et soulager les cicatrices, vert 523 nm pour apaiser les peaux sensibles, jaune 583 nm contre les rougeurs et les taches.",
          "Blue 423 nm against acne bacteria, red 640 nm to revitalise and soothe scars, green 523 nm to calm sensitive skin, yellow 583 nm against redness and spots."
        ),
      },
      {
        q: t("La LED est-elle douloureuse ou invasive ?", "Is LED painful or invasive?"),
        a: t("Non. C'est une lumière froide et non invasive.", "No. It is cold, non-invasive light."),
      },
      {
        q: t("Peut-on traiter le corps ?", "Can the body be treated?"),
        a: t("Oui : le panneau couvre une surface de traitement jusqu'à 50 × 20 cm, pour le visage et le corps.", "Yes: the panel covers a treatment area of up to 50 × 20 cm, for face and body."),
      },
      {
        q: t("Combien de séances faut-il ?", "How many sessions are needed?"),
        a: t(
          "Cela dépend du patient et de l'indication. La formation CELLULIFT Academy vous apprend à construire les protocoles.",
          "It depends on the patient and the indication. CELLULIFT Academy training teaches you to build the protocols."
        ),
      },
      ...commonFaq("la LED Bio-Light", "the LED Bio-Light"),
    ],
  },
  brasilift: {
    h1: t("vacuothérapie pour le lifting des fessiers et le volume de la poitrine", "vacuum therapy for buttock lifting and chest volume"),
    hook: t(
      "Un système de vacuothérapie à ventouses : l'aspiration stimule la circulation sanguine et l'étirement contrôlé de la peau améliore la qualité du collagène, pour lifter et redonner du volume, sans chirurgie.",
      "A cup-based vacuum therapy system: suction stimulates blood flow and controlled skin stretching improves collagen quality, to lift and restore volume without surgery."
    ),
    modulesTitle: t("Comment agit Brasilift", "How Brasilift works"),
    modules: [
      {
        name: t("Circulation", "Circulation"),
        spec: t("Action du vide", "Vacuum action"),
        text: t(
          "Le vide stimule la vasodilatation périphérique : une augmentation d'environ 2 °C de la température locale est notée, signe d'un débit sanguin accru.",
          "The vacuum stimulates peripheral vasodilation: a local temperature rise of about 2 °C is noted, a sign of increased blood flow."
        ),
      },
      {
        name: t("Collagène", "Collagen"),
        spec: t("Étirement de la peau", "Skin stretching"),
        text: t(
          "L'étirement de la peau à l'intérieur de la ventouse agit sur les fibres de collagène du derme, pour une peau plus ferme.",
          "Skin stretching inside the cup acts on the collagen fibres of the dermis, for firmer skin."
        ),
      },
    ],
    forWho: [
      t("Les centres esthétiques et cabinets qui proposent le remodelage du corps sans chirurgie.", "Aesthetic centres and practices offering non-surgical body contouring."),
      t("Les praticiens qui veulent une offre fessiers et poitrine, très demandée par les patients.", "Practitioners who want a buttock and chest offer, in high patient demand."),
      t("Les cabinets qui cherchent un appareil compact : la machine pèse 2,28 kg.", "Practices looking for a compact device: the machine weighs 2.28 kg."),
    ],
    protocol: t(
      "Le temps d'aspiration, le temps de relâchement et la durée de séance se règlent sur le panneau de commande ; le nombre de séances dépend de chaque patient. La formation CELLULIFT Academy vous apprend à construire chaque protocole.",
      "Suction time, release time and session length are set on the control panel; the number of sessions depends on each patient. CELLULIFT Academy training teaches you to build each protocol."
    ),
    indications: [
      { indication: t("Lifting et galbe des fessiers", "Buttock lifting and shaping"), tech: t("Ventouses fessiers", "Buttock cups") },
      { indication: t("Volume de la poitrine et des pectoraux", "Chest and pectoral volume"), tech: t("Ventouses poitrine", "Chest cups") },
      { indication: t("Fermeté de la peau", "Skin firmness"), tech: t("Étirement contrôlé", "Controlled stretching") },
    ],
    profit: t(
      "Un appareil compact pour une demande patient forte : le galbe des fessiers et de la poitrine sans chirurgie. Les séances se répètent sur un programme, ce qui fidélise la patientèle.",
      "A compact device for strong patient demand: buttock and chest shaping without surgery. Sessions are repeated over a programme, which builds patient loyalty."
    ),
    specs: [
      [t("Modèle", "Model"), t("Brasilift FX032", "Brasilift FX032")],
      [t("Puissance", "Power"), t("150 W", "150 W")],
      [t("Dimensions de la machine", "Machine size"), t("17 × 23 × 25,5 cm", "17 × 23 × 25.5 cm")],
      [t("Poids de la machine", "Machine weight"), t("2,28 kg", "2.28 kg")],
      [t("Réglages", "Settings"), t("Temps de travail, aspiration, relâchement", "Working time, suction, release")],
    ],
    related: ["pandaslim", "elitecolombia"],
    faq: [
      {
        q: t("Comment Brasilift lifte-t-il les fessiers ?", "How does Brasilift lift the buttocks?"),
        a: t(
          "Par deux actions : l'aspiration stimule la circulation sanguine, et l'étirement contrôlé de la peau dans la ventouse agit sur la qualité du collagène.",
          "Through two actions: suction stimulates blood flow, and controlled stretching of the skin in the cup acts on collagen quality."
        ),
      },
      {
        q: t("Brasilift traite-t-il aussi la poitrine ?", "Does Brasilift also treat the chest?"),
        a: t("Oui : volume de la poitrine et des pectoraux, avec des ventouses adaptées.", "Yes: chest and pectoral volume, with dedicated cups."),
      },
      {
        q: t("Est-ce invasif ?", "Is it invasive?"),
        a: t("Non. Brasilift est une technique non invasive, sans chirurgie.", "No. Brasilift is a non-invasive technique, without surgery."),
      },
      {
        q: t("Combien de séances faut-il ?", "How many sessions are needed?"),
        a: t(
          "Cela dépend de chaque patient. La formation CELLULIFT Academy vous apprend à construire le programme de séances.",
          "It depends on each patient. CELLULIFT Academy training teaches you to build the session programme."
        ),
      },
      ...commonFaq("Brasilift", "Brasilift"),
    ],
  },
};
