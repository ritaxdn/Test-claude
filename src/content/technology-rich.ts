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
  /** Marque (données Product) */
  brand: string;
  /** Les modules de la machine : nom, caractéristique clé, à quoi il sert */
  modules: { name: string; spec: string | LocalizedText; text: LocalizedText }[];
  /** Pour quel type de cabinet */
  forWho: LocalizedText[];
  /** Comment se construit un protocole */
  protocol: LocalizedText;
  /** Tableau indication → technologie */
  indications: { indication: LocalizedText; tech: string }[];
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
};
