import type { LocalizedText } from "./technologies";

/**
 * Fiches machines enrichies (pages produit qui rankent : technologies, pour quel cabinet, protocole, FAQ, vidéo).
 * Uniquement des informations de la brochure LGL Expert ou validées par Cellulift.
 * Prix : toujours « sur demande » (choix Cellulift, ne pas publier de prix).
 */
export type RichSheet = {
  /** Les modules de la machine : nom, caractéristique clé, à quoi il sert */
  modules: { name: string; spec: string | LocalizedText; text: LocalizedText }[];
  /** Pour quel type de cabinet */
  forWho: LocalizedText[];
  /** Comment se construit un protocole */
  protocol: LocalizedText;
  faq: { q: LocalizedText; a: LocalizedText }[];
  /** Vidéo Instagram de la machine (reel) */
  instagram?: string;
};

const t = (fr: string, en: string): LocalizedText => ({ fr, en });

export const richSheets: Record<string, RichSheet> = {
  "la-queen": {
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
        q: t("La Queen peut-elle traiter tous les phototypes ?", "Can La Queen treat every skin type?"),
        a: t(
          "Oui. Le laser diode combine 755, 808 et 1064 nm pour l'épilation de tous les phototypes, toute l'année.",
          "Yes. The diode laser combines 755, 808 and 1064 nm for hair removal on all skin types, all year round."
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
          "Le prix est communiqué sur demande, selon la configuration. Des solutions de financement sont disponibles : demandez un devis à un conseiller Cellulift.",
          "Pricing is shared on request, depending on the configuration. Financing options are available: ask a Cellulift advisor for a quote."
        ),
      },
      {
        q: t("Qu'est-ce qui est inclus à l'achat ?", "What is included with the purchase?"),
        a: t(
          "L'installation et la mise en service par nos techniciens, la formation CELLULIFT Academy, les protocoles de traitement, une garantie de 24 mois main-d'œuvre et le service après-vente.",
          "Installation and commissioning by our technicians, CELLULIFT Academy training, treatment protocols, a 24-month labour warranty and after-sales service."
        ),
      },
      {
        q: t("Peut-on voir La Queen avant d'acheter ?", "Can I see La Queen before buying?"),
        a: t(
          "Oui. Réservez une démonstration dans l'une de nos agences, à Casablanca, Marrakech ou Tanger.",
          "Yes. Book a demonstration at one of our branches in Casablanca, Marrakech or Tangier."
        ),
      },
    ],
    instagram: "https://www.instagram.com/reel/C9-ZIWAt0Go/",
  },
};
