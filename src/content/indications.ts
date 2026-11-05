import type { LocalizedText } from "./technologies";

/**
 * Pages par indication (/indications/<clé>) : capter les recherches « machine détatouage maroc », « laser taches »…
 * Les machines listées et leurs indications viennent des fiches existantes (technology-sheets.ts) :
 * `match` repère, dans les indications de chaque machine, celles qui concernent la page.
 */
export type IndicationKey =
  | "epilation-laser"
  | "detatouage"
  | "taches-pigmentaires"
  | "couperose-lesions-vasculaires"
  | "cellulite-graisse-localisee"
  | "relachement-cutane"
  | "acne-cicatrices"
  | "rides-rajeunissement"
  | "gynecologie-esthetique";

export type Indication = {
  name: LocalizedText;
  /** Complément de la question « Quelle machine choisir … ? » */
  forWhat: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  h1: LocalizedText;
  intro: LocalizedText;
  /** Ce qu'il faut regarder pour choisir (sans chiffre inventé) */
  choose: LocalizedText[];
  slugs: string[];
  match: RegExp;
};

const t = (fr: string, en: string): LocalizedText => ({ fr, en });

export const indications: Record<IndicationKey, Indication> = {
  "epilation-laser": {
    name: t("Épilation laser", "Laser hair removal"),
    forWhat: t("pour l'épilation laser", "for laser hair removal"),
    title: t("Machine d'épilation laser professionnelle au Maroc", "Professional laser hair removal machines in Morocco"),
    description: t(
      "Lasers diode, Alexandrite, Nd:YAG et IPL pour l'épilation définitive de tous les phototypes. Démo en agence, installation, formation et SAV au Maroc.",
      "Diode, Alexandrite, Nd:YAG and IPL systems for permanent hair removal on every skin type. Branch demos, installation, training and after-sales in Morocco."
    ),
    h1: t("Machines d'épilation laser professionnelles au Maroc", "Professional laser hair removal machines in Morocco"),
    intro: t(
      "L'épilation laser est l'acte le plus demandé en cabinet. Le bon équipement dépend de votre patientèle : phototypes, couleur et épaisseur des poils, volume de séances. Voici les technologies CELLULIFT pour l'épilation, du laser diode multi-longueurs d'onde à la lumière pulsée.",
      "Laser hair removal is the most requested procedure in practice. The right device depends on your patients: skin types, hair colour and thickness, session volume. Here are the CELLULIFT technologies for hair removal, from multi-wavelength diode lasers to pulsed light."
    ),
    choose: [
      t("Les phototypes de vos patients : le 1064 nm est la référence pour les peaux foncées, le 755 nm pour les poils fins et clairs.", "Your patients' skin types: 1064 nm is the reference for dark skin, 755 nm for fine, light hair."),
      t("Le volume de séances : une plateforme qui tourne toute la journée, avec un refroidissement efficace.", "Session volume: a platform that runs all day, with effective cooling."),
      t("Les autres actes à proposer : certaines plateformes ajoutent le vasculaire, le pigmentaire ou le détatouage.", "Other treatments to offer: some platforms add vascular, pigment or tattoo removal."),
    ],
    slugs: ["la-queen", "megalight", "alex-yag-ultra", "sevenwaves", "synergy-plus", "new-epil-light", "fotokrom"],
    match: /pil|poil|barbe/i,
  },
  detatouage: {
    name: t("Détatouage", "Tattoo removal"),
    forWhat: t("pour le détatouage", "for tattoo removal"),
    title: t("Laser de détatouage professionnel au Maroc", "Professional tattoo removal lasers in Morocco"),
    description: t(
      "Lasers Nd:YAG pour le détatouage toutes couleurs, les pigments et le Carbon Peel. Démo en agence, installation, formation et SAV au Maroc.",
      "Nd:YAG lasers for multicolour tattoo removal, pigment and Carbon Peel. Branch demos, installation, training and after-sales in Morocco."
    ),
    h1: t("Lasers de détatouage professionnels au Maroc", "Professional tattoo removal lasers in Morocco"),
    intro: t(
      "Le détatouage se fait au laser Nd:YAG : des impulsions très courtes fragmentent l'encre en épargnant les tissus voisins, et plusieurs longueurs d'onde permettent de cibler des couleurs différentes. Voici les machines CELLULIFT qui le proposent.",
      "Tattoo removal is done with Nd:YAG lasers: very short pulses break up the ink while sparing surrounding tissue, and several wavelengths target different colours. Here are the CELLULIFT devices that offer it."
    ),
    choose: [
      t("Les longueurs d'onde disponibles : le 1064 nm pour les encres sombres, le 532 nm pour les couleurs plus claires.", "Available wavelengths: 1064 nm for dark inks, 532 nm for lighter colours."),
      t("Les actes associés : taches pigmentaires et Carbon Peel se font souvent avec le même laser.", "Related treatments: pigment spots and Carbon Peel often use the same laser."),
      t("Une machine dédiée ou une plateforme multi-technologies, selon votre volume de détatouage.", "A dedicated device or a multi-technology platform, depending on your tattoo removal volume."),
    ],
    slugs: ["laser-shock", "la-queen", "fotokrom", "sevenwaves"],
    match: /tatou|carbon/i,
  },
  "taches-pigmentaires": {
    name: t("Taches pigmentaires", "Pigmented spots"),
    forWhat: t("pour les taches pigmentaires", "for pigmented spots"),
    title: t("Laser taches pigmentaires et mélasma : machines au Maroc", "Pigmented spot and melasma lasers in Morocco"),
    description: t(
      "Lasers Nd:YAG Q-switched, Alexandrite, IPL et LED pour les taches, le mélasma, les lentigos et les naevus. Démo, formation et SAV au Maroc.",
      "Q-switched Nd:YAG, Alexandrite, IPL and LED for spots, melasma, lentigines and naevi. Demos, training and after-sales in Morocco."
    ),
    h1: t("Machines pour les taches pigmentaires au Maroc", "Machines for pigmented spots in Morocco"),
    intro: t(
      "Taches brunes, mélasma, lentigos, naevus : les lésions pigmentaires se traitent au laser, à la lumière pulsée ou en complément par LED. Voici les technologies CELLULIFT indiquées pour le pigmentaire.",
      "Brown spots, melasma, lentigines, naevi: pigmented lesions are treated with lasers, pulsed light or LED as a complement. Here are the CELLULIFT technologies indicated for pigment."
    ),
    choose: [
      t("Le type de lésion et sa profondeur : laser Nd:YAG Q-switched, Alexandrite ou lumière pulsée ne ciblent pas les mêmes pigments.", "The type and depth of the lesion: Q-switched Nd:YAG, Alexandrite and pulsed light don't target the same pigment."),
      t("Les phototypes de vos patients et le risque d'hyperpigmentation.", "Your patients' skin types and the risk of hyperpigmentation."),
      t("Les autres indications à couvrir avec la même plateforme : épilation, vasculaire, détatouage.", "Other indications to cover with the same platform: hair removal, vascular, tattoo removal."),
    ],
    slugs: ["laser-shock", "la-queen", "alex-yag-ultra", "fotokrom", "sevenwaves", "new-epil-light", "hanover-5g", "dermaplex", "led-bio-light"],
    match: /pigment|tache|mélasma|lentigo|naevus|kératose/i,
  },
  "couperose-lesions-vasculaires": {
    name: t("Couperose et lésions vasculaires", "Rosacea and vascular lesions"),
    forWhat: t("pour la couperose et les lésions vasculaires", "for rosacea and vascular lesions"),
    title: t("Laser vasculaire : couperose, varicosités, angiomes au Maroc", "Vascular lasers: rosacea, spider veins, angiomas in Morocco"),
    description: t(
      "Lasers Nd:YAG 1064 nm, 980 nm et lumière pulsée pour les rougeurs, la couperose, les varicosités et les angiomes. Démo, formation et SAV au Maroc.",
      "Nd:YAG 1064 nm, 980 nm lasers and pulsed light for redness, rosacea, spider veins and angiomas. Demos, training and after-sales in Morocco."
    ),
    h1: t("Machines pour la couperose et les lésions vasculaires au Maroc", "Machines for rosacea and vascular lesions in Morocco"),
    intro: t(
      "Rougeurs diffuses, couperose, télangiectasies, varicosités des jambes, angiomes : les lésions vasculaires se traitent avec des longueurs d'onde absorbées par l'hémoglobine. Voici les technologies CELLULIFT qui les couvrent.",
      "Diffuse redness, rosacea, telangiectasia, leg spider veins, angiomas: vascular lesions are treated with wavelengths absorbed by haemoglobin. Here are the CELLULIFT technologies that cover them."
    ),
    choose: [
      t("La taille et la profondeur des vaisseaux : visage, jambes ou angiomes ne demandent pas la même longueur d'onde.", "Vessel size and depth: face, legs or angiomas don't call for the same wavelength."),
      t("Le refroidissement, pour le confort et la sécurité du patient.", "Cooling, for patient comfort and safety."),
      t("La polyvalence : une plateforme laser qui couvre aussi l'épilation et le pigmentaire.", "Versatility: a laser platform that also covers hair removal and pigment."),
    ],
    slugs: ["alex-yag-ultra", "la-queen", "hanover-5g", "sevenwaves", "new-epil-light", "led-bio-light"],
    match: /vascul|varicos|télangi|rougeur|érythr|angiome|vaisseau|veine/i,
  },
  "cellulite-graisse-localisee": {
    name: t("Cellulite et graisse localisée", "Cellulite and localised fat"),
    forWhat: t("contre la cellulite et la graisse localisée", "for cellulite and localised fat"),
    title: t("Machine amincissement et cellulite professionnelle au Maroc", "Professional slimming and cellulite machines in Morocco"),
    description: t(
      "Lipocavitation, radiofréquence, ondes de choc, pressothérapie, électromagnétique : machines contre la cellulite et la graisse localisée. Démo et SAV au Maroc.",
      "Lipocavitation, radiofrequency, shockwave, pressotherapy, electromagnetic: machines for cellulite and localised fat. Demos and after-sales in Morocco."
    ),
    h1: t("Machines contre la cellulite et la graisse localisée au Maroc", "Machines for cellulite and localised fat in Morocco"),
    intro: t(
      "Cellulite, culotte de cheval, ventre, double menton : le remodelage du corps combine plusieurs technologies (lipocavitation, radiofréquence, vacuum, ondes de choc, électromagnétique, pressothérapie). Voici les machines CELLULIFT pour la cellulite et la graisse localisée.",
      "Cellulite, saddlebags, belly, double chin: body contouring combines several technologies (lipocavitation, radiofrequency, vacuum, shockwave, electromagnetic, pressotherapy). Here are the CELLULIFT machines for cellulite and localised fat."
    ),
    choose: [
      t("Les zones à traiter : visage et double menton, ventre et flancs, cuisses et fessiers.", "The areas to treat: face and double chin, belly and flanks, thighs and buttocks."),
      t("Une machine multi-technologies ou spécialisée, selon votre carte de soins minceur.", "A multi-technology or specialised device, depending on your slimming menu."),
      t("Le suivi des résultats : un analyseur de composition corporelle complète utilement un programme minceur.", "Tracking results: a body composition analyser usefully completes a slimming programme."),
    ],
    slugs: ["slimax-lipo-3", "slimax-lipo-7", "longishape", "pandaslim", "elitecolombia", "steel-muscle", "longchoc", "shocsteel", "pressoligne-5", "hanover-5g", "rejuvskin"],
    match: /cellulite|graisse|gras|culotte|lipo|abdomen|cuisses|menton|poignées|silhouette|volumes/i,
  },
  "relachement-cutane": {
    name: t("Relâchement cutané", "Skin laxity"),
    forWhat: t("contre le relâchement cutané", "for skin laxity"),
    title: t("Lifting sans chirurgie : machines anti-relâchement au Maroc", "Non-surgical lifting: skin tightening machines in Morocco"),
    description: t(
      "HIFU, radiofréquence, laser CO2 fractionné, plasma pen : machines pour le relâchement du visage et du corps. Démo, formation et SAV au Maroc.",
      "HIFU, radiofrequency, fractional CO2 laser, plasma pen: machines for face and body laxity. Demos, training and after-sales in Morocco."
    ),
    h1: t("Machines contre le relâchement cutané au Maroc", "Machines for skin laxity in Morocco"),
    intro: t(
      "Ovale du visage, paupières, cou, bras, ventre : le relâchement cutané se traite sans chirurgie en stimulant le collagène, par ultrasons focalisés (HIFU), radiofréquence, laser fractionné ou plasma. Voici les technologies CELLULIFT indiquées.",
      "Jawline, eyelids, neck, arms, belly: skin laxity is treated without surgery by stimulating collagen with focused ultrasound (HIFU), radiofrequency, fractional laser or plasma. Here are the CELLULIFT technologies indicated."
    ),
    choose: [
      t("La zone et la profondeur : HIFU pour les plans profonds, radiofréquence et laser fractionné pour la peau.", "Area and depth: HIFU for deep layers, radiofrequency and fractional laser for the skin."),
      t("L'éviction sociale acceptée par vos patients : certaines technologies n'en ont pas, d'autres demandent quelques jours.", "The downtime your patients accept: some technologies have none, others need a few days."),
      t("Les combinaisons possibles avec vos autres soins anti-âge.", "Possible combinations with your other anti-ageing treatments."),
    ],
    slugs: ["rejuvskin", "frac-cov-4", "dermaplex", "slimax-lipo-3", "slimax-lipo-7", "longishape", "elitecolombia", "fotokrom", "brasilift"],
    match: /relâch|ferm|tension|lifting|paupière|ovale|bajoue|raffermi/i,
  },
  "acne-cicatrices": {
    name: t("Acné et cicatrices d'acné", "Acne and acne scars"),
    forWhat: t("pour l'acné et les cicatrices d'acné", "for acne and acne scars"),
    title: t("Traitement de l'acné et des cicatrices : machines au Maroc", "Acne and acne scar treatment machines in Morocco"),
    description: t(
      "LED bleue et rouge, radiofréquence fractionnée, microneedling, laser CO2 : machines pour l'acné active et les cicatrices d'acné. Démo, formation et SAV au Maroc.",
      "Blue and red LED, fractional radiofrequency, microneedling, CO2 laser: machines for active acne and acne scars. Demos, training and after-sales in Morocco."
    ),
    h1: t("Machines pour l'acné et les cicatrices d'acné au Maroc", "Machines for acne and acne scars in Morocco"),
    intro: t(
      "L'acné active et ses cicatrices ne se traitent pas de la même façon : la LED et la lumière pulsée agissent sur l'inflammation et les bactéries, la radiofréquence fractionnée, le microneedling et le laser fractionné remodèlent les cicatrices. Voici les technologies CELLULIFT pour l'acné.",
      "Active acne and acne scars are treated differently: LED and pulsed light act on inflammation and bacteria, while fractional radiofrequency, microneedling and fractional laser remodel scars. Here are the CELLULIFT technologies for acne."
    ),
    choose: [
      t("Acné active ou cicatrices : les technologies ne sont pas les mêmes.", "Active acne or scars: the technologies differ."),
      t("Les phototypes de vos patients et la tolérance à l'éviction sociale.", "Your patients' skin types and tolerance for downtime."),
      t("Les combinaisons : une LED en complément d'un soin fractionné accompagne la récupération.", "Combinations: LED alongside a fractional treatment supports recovery."),
    ],
    slugs: ["frequencious", "mym-dermapen", "frac-cov-4", "dermaplex", "led-bio-light", "led-fotoskin-ultra", "longiflash", "new-epil-light", "la-queen", "pistor-plus-34"],
    match: /acné|cicatrice/i,
  },
  "rides-rajeunissement": {
    name: t("Rides et rajeunissement", "Wrinkles and rejuvenation"),
    forWhat: t("contre les rides", "for wrinkles"),
    title: t("Machines anti-âge et rajeunissement cutané au Maroc", "Anti-ageing and skin rejuvenation machines in Morocco"),
    description: t(
      "Laser CO2 fractionné, radiofréquence, microneedling, mésothérapie, plasma, LED : machines contre les rides et pour la qualité de peau. Démo et SAV au Maroc.",
      "Fractional CO2 laser, radiofrequency, microneedling, mesotherapy, plasma, LED: machines for wrinkles and skin quality. Demos and after-sales in Morocco."
    ),
    h1: t("Machines anti-rides et de rajeunissement cutané au Maroc", "Anti-wrinkle and skin rejuvenation machines in Morocco"),
    intro: t(
      "Rides, ridules, texture, éclat, perte de volume : le rajeunissement cutané combine resurfaçage, stimulation du collagène, comblement autologue et soins d'entretien. Voici les technologies CELLULIFT anti-âge.",
      "Wrinkles, fine lines, texture, radiance, volume loss: skin rejuvenation combines resurfacing, collagen stimulation, autologous filling and maintenance treatments. Here are the CELLULIFT anti-ageing technologies."
    ),
    choose: [
      t("L'objectif : resurfaçage de la texture, stimulation du collagène, volume ou entretien de l'éclat.", "The goal: resurfacing texture, stimulating collagen, volume or maintaining radiance."),
      t("L'éviction sociale : des soins sans suites à ceux qui demandent quelques jours de récupération.", "Downtime: from treatments with none to those needing a few days of recovery."),
      t("Une gamme qui permet de proposer des cures et des soins d'entretien.", "A range that lets you offer courses and maintenance treatments."),
    ],
    slugs: ["frac-cov-4", "frequencious", "mym-dermapen", "biofiller-x7", "pistor-plus-34", "rejuvskin", "dermaplex", "fotokrom", "sevenwaves", "longiflash", "led-fotoskin-ultra"],
    match: /ride|rajeuni|vieilliss|resurfa|éclat|volume du visage|perte de volume|ridule/i,
  },
  "gynecologie-esthetique": {
    name: t("Gynécologie esthétique", "Aesthetic gynaecology"),
    forWhat: t("en gynécologie esthétique", "in aesthetic gynaecology"),
    title: t("Gynécologie esthétique : machines laser, HIFU et RF au Maroc", "Aesthetic gynaecology: laser, HIFU and RF machines in Morocco"),
    description: t(
      "HIFU vaginal, radiofréquence intime, laser CO2, LED intime : machines pour la laxité, la sécheresse et l'incontinence. Démo, formation et SAV au Maroc.",
      "Vaginal HIFU, intimate radiofrequency, CO2 laser, intimate LED: machines for laxity, dryness and incontinence. Demos, training and after-sales in Morocco."
    ),
    h1: t("Machines de gynécologie esthétique au Maroc", "Aesthetic gynaecology machines in Morocco"),
    intro: t(
      "Laxité vaginale, sécheresse, incontinence urinaire légère, inconfort, suites d'accouchement : la gynécologie esthétique fait appel au HIFU, à la radiofréquence, au laser et à la LED. Voici les technologies CELLULIFT pour les gynécologues.",
      "Vaginal laxity, dryness, mild urinary incontinence, discomfort, after childbirth: aesthetic gynaecology uses HIFU, radiofrequency, laser and LED. Here are the CELLULIFT technologies for gynaecologists."
    ),
    choose: [
      t("Les indications de votre patientèle : laxité, sécheresse, incontinence, cicatrisation.", "Your patients' indications: laxity, dryness, incontinence, healing."),
      t("Une technologie dédiée à la zone intime ou une plateforme qui couvre aussi le visage et le corps.", "A device dedicated to the intimate area or a platform that also covers face and body."),
      t("La formation : la CELLULIFT Academy organise des masterclasses en gynécologie esthétique.", "Training: CELLULIFT Academy runs masterclasses in aesthetic gynaecology."),
    ],
    slugs: ["perfect-lift", "frequentazia", "vagilase", "rejuvskin", "frac-cov-4", "hanover-5g", "hot-power"],
    match: /vagin|intime|incontinence|accouchement|périné|plancher|gynéco|vulv|épisio|rapports/i,
  },
};

export const indicationKeys = Object.keys(indications) as IndicationKey[];

export const indicationPath = (key: IndicationKey) => `/indications/${key}`;

export const indicationLabels = {
  fr: {
    hub: "Indications",
    hubTitle: "Machines médico-esthétiques par indication",
    hubDescription: "Trouvez la machine adaptée à chaque indication : épilation laser, détatouage, taches, couperose, cellulite, relâchement, acné, rides, gynécologie esthétique.",
    hubIntro: "Choisissez l'indication que vous voulez traiter : chaque page présente les technologies CELLULIFT adaptées, ce qu'il faut regarder pour choisir et les machines à essayer en agence.",
    machines: "Les machines CELLULIFT pour cette indication",
    table: "Comparatif",
    machine: "Machine",
    technology: "Technologie",
    forThis: "Indications concernées",
    choose: "Comment choisir",
    other: "Autres indications",
    faq: (n: string) => `Questions fréquentes : ${n.toLowerCase()}`,
    faqWhich: (f: string) => `Quelle machine choisir ${f} ?`,
    faqWhichA: (list: string) => `Dans le catalogue CELLULIFT : ${list}. Le bon choix dépend de votre patientèle et de vos autres actes : un expert CELLULIFT vous aide à comparer, et vous pouvez essayer les machines en agence.`,
    faqSessions: "Combien de séances faut-il ?",
    faqSessionsA: "Cela dépend de chaque patient et de l'indication. La formation CELLULIFT Academy, incluse à l'achat, vous apprend à construire chaque protocole.",
    faqPrice: "Quel est le prix d'une machine ?",
    faqPriceA: "Le prix dépend de la machine et de sa configuration : il est communiqué sur demande. Des solutions de financement sont disponibles.",
    faqDemo: "Peut-on essayer les machines ?",
    faqDemoA: "Oui. Réservez une démonstration dans l'une de nos agences, à Casablanca, Marrakech ou Tanger.",
  },
  en: {
    hub: "Indications",
    hubTitle: "Medical aesthetic machines by indication",
    hubDescription: "Find the right machine for each indication: laser hair removal, tattoo removal, spots, rosacea, cellulite, laxity, acne, wrinkles, aesthetic gynaecology.",
    hubIntro: "Choose the indication you want to treat: each page presents the suitable CELLULIFT technologies, what to look at when choosing and the devices to try at our branches.",
    machines: "CELLULIFT machines for this indication",
    table: "Comparison",
    machine: "Machine",
    technology: "Technology",
    forThis: "Related indications",
    choose: "How to choose",
    other: "Other indications",
    faq: (n: string) => `FAQ: ${n.toLowerCase()}`,
    faqWhich: (f: string) => `Which machine should I choose ${f}?`,
    faqWhichA: (list: string) => `In the CELLULIFT catalogue: ${list}. The right choice depends on your patients and your other treatments: a CELLULIFT expert helps you compare, and you can try the devices at our branches.`,
    faqSessions: "How many sessions are needed?",
    faqSessionsA: "It depends on each patient and the indication. CELLULIFT Academy training, included with the purchase, teaches you to build each protocol.",
    faqPrice: "How much does a machine cost?",
    faqPriceA: "Pricing depends on the device and its configuration, and is shared on request. Financing options are available.",
    faqDemo: "Can I try the machines?",
    faqDemoA: "Yes. Book a demonstration at one of our branches in Casablanca, Marrakech or Tangier.",
  },
} as const;
