// NOTE: names, categories and image assets below reflect Cellulift's real
// equipment catalogue (client-provided). Taglines, descriptions, indications,
// benefits and certifications are draft marketing copy inferred from each
// machine's name/category — they have not been validated against real
// technical spec sheets and must be reviewed by Cellulift before publishing.

export type LocalizedText = {
  fr: string;
  en: string;
};

export type CategoryKey =
  | "reju-cutanee"
  | "photomodulation"
  | "therapie-avancee"
  | "hifu"
  | "lasers"
  | "amincissement";

export interface Technology {
  slug: string;
  name: string;
  category: CategoryKey;
  image: string;
  tagline: LocalizedText;
  description: LocalizedText;
  indications: LocalizedText[];
  benefits: LocalizedText[];
  certifications: string[];
}

export const categoryPlateClass: Record<CategoryKey, string> = {
  "reju-cutanee": "bg-plate-body",
  photomodulation: "bg-plate-face",
  "therapie-avancee": "bg-plate-hair-removal",
  hifu: "bg-plate-hair-restoration",
  lasers: "bg-plate-face",
  amincissement: "bg-plate-body",
};

export const categories: Record<CategoryKey, LocalizedText> = {
  "reju-cutanee": { fr: "Réjuvénation cutanée", en: "Skin rejuvenation" },
  photomodulation: { fr: "Photomodulation", en: "Photomodulation" },
  "therapie-avancee": { fr: "Thérapie avancée", en: "Advanced therapy" },
  hifu: { fr: "HIFU", en: "HIFU" },
  lasers: { fr: "Lasers", en: "Lasers" },
  amincissement: { fr: "Amincissement", en: "Body slimming" },
};

const img = (slug: string) => `/images/technologies/${slug}.jpg`;

export const technologies: Technology[] = [
  // ─── Réjuvénation cutanée ────────────────────────────────────────────
  {
    slug: "aquapeel",
    name: "AquaPeel",
    category: "reju-cutanee",
    image: img("aquapeel"),
    tagline: {
      fr: "Hydradermabrasion multi-étapes pour une peau nette et hydratée.",
      en: "Multi-step hydradermabrasion for clear, hydrated skin.",
    },
    description: {
      fr: "Plateforme d'hydradermabrasion à têtes interchangeables : nettoyage en profondeur, extraction des impuretés et infusion de sérums actifs en une seule séance.",
      en: "Hydradermabrasion platform with interchangeable tips: deep cleansing, impurity extraction and active serum infusion in a single session.",
    },
    indications: [
      { fr: "Pores dilatés et teint terne", en: "Enlarged pores and dull complexion" },
      { fr: "Points noirs et excès de sébum", en: "Blackheads and excess sebum" },
    ],
    benefits: [
      { fr: "Résultat immédiat, sans éviction sociale", en: "Immediate result, no downtime" },
      { fr: "Protocole 3-en-1 : nettoyer, extraire, infuser", en: "3-in-1 protocol: cleanse, extract, infuse" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "skin-bright",
    name: "SkinBright",
    category: "reju-cutanee",
    image: img("skin-bright"),
    tagline: {
      fr: "Protocole d'éclat pour un teint uniforme et lumineux.",
      en: "Radiance protocol for an even, luminous complexion.",
    },
    description: {
      fr: "Combine oxygénation cutanée et actifs éclaircissants pour atténuer les taches pigmentaires et redonner de la luminosité au teint.",
      en: "Combines skin oxygenation and brightening actives to fade pigmentation and restore radiance to the complexion.",
    },
    indications: [
      { fr: "Taches pigmentaires et teint irrégulier", en: "Pigmentation and uneven skin tone" },
      { fr: "Peau terne, manque d'éclat", en: "Dull skin, lack of radiance" },
    ],
    benefits: [
      { fr: "Compatible avec tous les phototypes", en: "Suitable for all skin phototypes" },
      { fr: "Séances courtes, confortables", en: "Short, comfortable sessions" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "dermabrasif",
    name: "Dermabrasif",
    category: "reju-cutanee",
    image: img("dermabrasif"),
    tagline: {
      fr: "Microdermabrasion mécanique pour renouveler la texture de peau.",
      en: "Mechanical microdermabrasion to renew skin texture.",
    },
    description: {
      fr: "Système de microdermabrasion à pointe diamantée et aspiration réglable, indiqué pour affiner le grain de peau et stimuler le renouvellement cellulaire.",
      en: "Diamond-tip microdermabrasion system with adjustable suction, indicated to refine skin texture and stimulate cellular renewal.",
    },
    indications: [
      { fr: "Grain de peau irrégulier", en: "Uneven skin texture" },
      { fr: "Cicatrices superficielles", en: "Superficial scarring" },
    ],
    benefits: [
      { fr: "Intensité d'aspiration ajustable", en: "Adjustable suction intensity" },
      { fr: "Aucun temps de récupération", en: "No recovery time" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "centrifugel",
    name: "CentrifuGel",
    category: "reju-cutanee",
    image: img("centrifugel"),
    tagline: {
      fr: "Centrifugeuse médicale pour la préparation de PRP/PRF.",
      en: "Medical centrifuge for PRP/PRF preparation.",
    },
    description: {
      fr: "Centrifugeuse de précision dédiée à la préparation de plasma riche en plaquettes et en fibrine, pour les protocoles de régénération cutanée et capillaire.",
      en: "Precision centrifuge dedicated to preparing platelet-rich plasma and fibrin for skin and hair regeneration protocols.",
    },
    indications: [
      { fr: "Préparation PRP / PRF pour mésothérapie", en: "PRP/PRF preparation for mesotherapy" },
      { fr: "Protocoles de régénération capillaire", en: "Hair regeneration protocols" },
    ],
    benefits: [
      { fr: "Programmes de centrifugation calibrés", en: "Calibrated centrifugation programs" },
      { fr: "Traçabilité et sécurité des échantillons", en: "Sample traceability and safety" },
    ],
    certifications: ["CE Medical", "ISO 13485"],
  },
  {
    slug: "biofiller",
    name: "BioFiller",
    category: "reju-cutanee",
    image: img("biofiller"),
    tagline: {
      fr: "Comblement et hydratation profonde sans aiguille.",
      en: "Needle-free deep hydration and volumizing.",
    },
    description: {
      fr: "Système de mésothérapie sans aiguille par électroporation, conçu pour faire pénétrer des actifs hydratants et repulpants dans les couches profondes de l'épiderme.",
      en: "Needle-free electroporation mesotherapy system, designed to drive hydrating and plumping actives into the deep layers of the epidermis.",
    },
    indications: [
      { fr: "Déshydratation cutanée", en: "Skin dehydration" },
      { fr: "Ridules et perte de volume", en: "Fine lines and volume loss" },
    ],
    benefits: [
      { fr: "Sans aiguille, sans douleur", en: "Needle-free, pain-free" },
      { fr: "Absorption optimisée des actifs", en: "Optimized active ingredient absorption" },
    ],
    certifications: ["CE Medical"],
  },

  // ─── Photomodulation ─────────────────────────────────────────────────
  {
    slug: "led-biolight",
    name: "LED BioLight",
    category: "photomodulation",
    image: img("led-biolight"),
    tagline: {
      fr: "Photobiomodulation LED multi-longueurs d'onde.",
      en: "Multi-wavelength LED photobiomodulation.",
    },
    description: {
      fr: "Panneau LED combinant plusieurs longueurs d'onde (rouge, bleu, proche infrarouge) pour stimuler la réparation cutanée, réduire l'inflammation et raffermir la peau.",
      en: "LED panel combining multiple wavelengths (red, blue, near-infrared) to stimulate skin repair, reduce inflammation and firm the skin.",
    },
    indications: [
      { fr: "Peau réactive et inflammée", en: "Reactive, inflamed skin" },
      { fr: "Manque de fermeté cutanée", en: "Lack of skin firmness" },
    ],
    benefits: [
      { fr: "Non invasif, sans effet secondaire", en: "Non-invasive, no side effects" },
      { fr: "Complémentaire à tout protocole", en: "Complements any protocol" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "longiflash",
    name: "LongiFlash",
    category: "photomodulation",
    image: img("longiflash"),
    tagline: {
      fr: "Lumière pulsée pour la photorajeunissement du visage.",
      en: "Pulsed light for facial photorejuvenation.",
    },
    description: {
      fr: "Système à lumière pulsée intense, calibré pour atténuer les taches pigmentaires, la rougeur diffuse et les signes précoces du vieillissement cutané.",
      en: "Intense pulsed light system, calibrated to fade pigmentation, diffuse redness and early signs of skin aging.",
    },
    indications: [
      { fr: "Lentigos et taches solaires", en: "Lentigines and sun spots" },
      { fr: "Rougeurs diffuses, couperose", en: "Diffuse redness, rosacea" },
    ],
    benefits: [
      { fr: "Filtres calibrés par indication", en: "Filters calibrated per indication" },
      { fr: "Protocole progressif et sécurisé", en: "Progressive, safe protocol" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "photoskin",
    name: "PhotoSkin",
    category: "photomodulation",
    image: img("photoskin"),
    tagline: {
      fr: "Photothérapie LED pour l'éclat et la régénération cutanée.",
      en: "LED phototherapy for radiance and skin regeneration.",
    },
    description: {
      fr: "Casque ou panneau de photothérapie LED destiné à accompagner les soins du visage par une stimulation lumineuse ciblée, en cabine ou en complément d'un protocole.",
      en: "LED phototherapy hood or panel designed to support facial treatments with targeted light stimulation, in-clinic or as a protocol add-on.",
    },
    indications: [
      { fr: "Teint fatigué, éclat terni", en: "Tired complexion, dull radiance" },
      { fr: "Post-traitement, apaisement cutané", en: "Post-treatment, skin soothing" },
    ],
    benefits: [
      { fr: "S'intègre à tout protocole existant", en: "Integrates with any existing protocol" },
      { fr: "Séances rapides et relaxantes", en: "Fast, relaxing sessions" },
    ],
    certifications: ["CE Medical"],
  },

  // ─── Thérapie avancée ────────────────────────────────────────────────
  {
    slug: "cryocover",
    name: "CryoCover",
    category: "therapie-avancee",
    image: img("cryocover"),
    tagline: {
      fr: "Cryothérapie locale pour le confort post-traitement.",
      en: "Local cryotherapy for post-treatment comfort.",
    },
    description: {
      fr: "Dispositif de cryothérapie localisée utilisé pour apaiser la peau, réduire l'inflammation et améliorer le confort du patient après un acte médico-esthétique.",
      en: "Localized cryotherapy device used to soothe the skin, reduce inflammation and improve patient comfort after a medical aesthetic procedure.",
    },
    indications: [
      { fr: "Inflammation post-traitement", en: "Post-treatment inflammation" },
      { fr: "Sensibilité cutanée", en: "Skin sensitivity" },
    ],
    benefits: [
      { fr: "Confort patient immédiat", en: "Immediate patient comfort" },
      { fr: "Complémentaire à tout protocole énergétique", en: "Complements any energy-based protocol" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "tcare-new",
    name: "TCare New",
    category: "therapie-avancee",
    image: img("tcare-new"),
    tagline: {
      fr: "Plateforme multi-fonction pour protocoles combinés.",
      en: "Multi-function platform for combined protocols.",
    },
    description: {
      fr: "Plateforme de thérapie combinée réunissant plusieurs têtes de traitement, pensée pour adapter le protocole aux besoins spécifiques de chaque patient.",
      en: "Combined-therapy platform bringing together several treatment heads, designed to tailor the protocol to each patient's specific needs.",
    },
    indications: [
      { fr: "Protocoles corps et visage combinés", en: "Combined body and face protocols" },
      { fr: "Suivi de traitement personnalisé", en: "Personalized treatment follow-up" },
    ],
    benefits: [
      { fr: "Têtes de traitement interchangeables", en: "Interchangeable treatment heads" },
      { fr: "Un seul appareil, plusieurs indications", en: "One device, multiple indications" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "frequenzia",
    name: "Frequenzia",
    category: "therapie-avancee",
    image: img("frequenzia"),
    tagline: {
      fr: "Radiofréquence multipolaire pour le raffermissement cutané.",
      en: "Multipolar radiofrequency for skin firming.",
    },
    description: {
      fr: "Générateur de radiofréquence multipolaire délivrant une chaleur contrôlée dans le derme pour stimuler la production de collagène et raffermir la peau.",
      en: "Multipolar radiofrequency generator delivering controlled heat into the dermis to stimulate collagen production and firm the skin.",
    },
    indications: [
      { fr: "Relâchement cutané léger à modéré", en: "Mild to moderate skin laxity" },
      { fr: "Perte de fermeté du visage et du corps", en: "Loss of firmness, face and body" },
    ],
    benefits: [
      { fr: "Contrôle thermique en temps réel", en: "Real-time thermal control" },
      { fr: "Sans douleur, sans éviction sociale", en: "Pain-free, no downtime" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "gate-care",
    name: "Gate Care",
    category: "therapie-avancee",
    image: img("gate-care"),
    tagline: {
      fr: "Électrostimulation ciblée pour le tonus musculaire et cutané.",
      en: "Targeted electrostimulation for muscle and skin tone.",
    },
    description: {
      fr: "Système d'électrostimulation médicale utilisé pour tonifier les tissus musculaires superficiels et accompagner les protocoles de fermeté corporelle.",
      en: "Medical electrostimulation system used to tone superficial muscle tissue and support body-firming protocols.",
    },
    indications: [
      { fr: "Tonus musculaire diminué", en: "Reduced muscle tone" },
      { fr: "Accompagnement des protocoles de fermeté", en: "Support for firming protocols" },
    ],
    benefits: [
      { fr: "Intensités et programmes réglables", en: "Adjustable intensities and programs" },
      { fr: "Séances courtes et actives", en: "Short, active sessions" },
    ],
    certifications: ["CE Medical"],
  },

  // ─── HIFU ────────────────────────────────────────────────────────────
  {
    slug: "rejuvskin",
    name: "RejuvSkin",
    category: "hifu",
    image: img("rejuvskin"),
    tagline: {
      fr: "HIFU facial pour un effet lifting progressif.",
      en: "Facial HIFU for a progressive lifting effect.",
    },
    description: {
      fr: "Système HIFU multi-profondeur délivrant une énergie ultrasonique focalisée dans le derme et le SMAS pour stimuler le collagène et raffermir l'ovale du visage.",
      en: "Multi-depth HIFU system delivering focused ultrasound energy into the dermis and SMAS to stimulate collagen and firm the facial contour.",
    },
    indications: [
      { fr: "Relâchement du visage et du cou", en: "Facial and neck laxity" },
      { fr: "Perte de définition de l'ovale", en: "Loss of facial contour definition" },
    ],
    benefits: [
      { fr: "Effet lifting sans chirurgie", en: "Lifting effect without surgery" },
      { fr: "Cartouches multi-profondeur", en: "Multi-depth cartridges" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "vagilase",
    name: "VagiLase",
    category: "hifu",
    image: img("vagilase"),
    tagline: {
      fr: "HIFU dédié au bien-être intime féminin.",
      en: "HIFU dedicated to feminine intimate wellness.",
    },
    description: {
      fr: "Technologie HIFU spécifiquement calibrée pour les protocoles de bien-être intime, utilisée sous encadrement médical pour restaurer tonicité et confort.",
      en: "HIFU technology specifically calibrated for intimate wellness protocols, used under medical supervision to restore tone and comfort.",
    },
    indications: [
      { fr: "Relâchement tissulaire post-partum", en: "Post-partum tissue laxity" },
      { fr: "Confort et tonicité intime", en: "Intimate comfort and tone" },
    ],
    benefits: [
      { fr: "Protocole non chirurgical", en: "Non-surgical protocol" },
      { fr: "Encadrement médical strict", en: "Strict medical supervision" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "perfectlift",
    name: "PerfectLift",
    category: "hifu",
    image: img("perfectlift"),
    tagline: {
      fr: "HIFU haute précision pour le lifting du visage et du corps.",
      en: "High-precision HIFU for face and body lifting.",
    },
    description: {
      fr: "Plateforme HIFU haute puissance combinant plusieurs cartouches de profondeur, indiquée pour le lifting facial ainsi que le raffermissement de zones corporelles ciblées.",
      en: "High-power HIFU platform combining several depth cartridges, indicated for facial lifting as well as firming targeted body areas.",
    },
    indications: [
      { fr: "Relâchement facial et corporel", en: "Facial and body laxity" },
      { fr: "Raffermissement bras et abdomen", en: "Arm and abdomen firming" },
    ],
    benefits: [
      { fr: "Puissance ajustable par zone", en: "Power adjustable per zone" },
      { fr: "Résultats progressifs sur 3 mois", en: "Progressive results over 3 months" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "sculptface",
    name: "SculptFace",
    category: "hifu",
    image: img("sculptface"),
    tagline: {
      fr: "HIFU de précision pour la sculpture du visage.",
      en: "Precision HIFU for facial sculpting.",
    },
    description: {
      fr: "Système HIFU à transducteurs fins, conçu pour redessiner les contours du visage — pommettes, mâchoire, sourcils — avec une précision millimétrique.",
      en: "HIFU system with fine transducers, designed to redefine facial contours — cheekbones, jawline, brows — with millimetric precision.",
    },
    indications: [
      { fr: "Contours du visage à redéfinir", en: "Facial contours to redefine" },
      { fr: "Sourcils tombants, ovale affaissé", en: "Drooping brows, sagging contour" },
    ],
    benefits: [
      { fr: "Transducteurs de précision millimétrique", en: "Millimetric precision transducers" },
      { fr: "Séance unique, effet progressif", en: "Single session, progressive effect" },
    ],
    certifications: ["CE Medical"],
  },

  // ─── Lasers ──────────────────────────────────────────────────────────
  {
    slug: "fotokrom",
    name: "FotoKrom",
    category: "lasers",
    image: img("fotokrom"),
    tagline: {
      fr: "Laser Q-switch pour le traitement des taches pigmentaires.",
      en: "Q-switched laser for pigmentation treatment.",
    },
    description: {
      fr: "Laser Q-switch multi-longueurs d'onde, indiqué pour fragmenter les pigments cutanés responsables des taches solaires, lentigos et certains tatouages.",
      en: "Multi-wavelength Q-switched laser, indicated to fragment skin pigments responsible for sun spots, lentigines and certain tattoos.",
    },
    indications: [
      { fr: "Lentigos et taches pigmentaires", en: "Lentigines and pigmentation" },
      { fr: "Détatouage partiel", en: "Partial tattoo removal" },
    ],
    benefits: [
      { fr: "Longueurs d'onde ciblées par pigment", en: "Wavelengths targeted per pigment type" },
      { fr: "Protocole encadré et progressif", en: "Supervised, progressive protocol" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "7-waves",
    name: "7 Waves",
    category: "lasers",
    image: img("7-waves"),
    tagline: {
      fr: "Plateforme laser multi-longueurs d'onde tout-en-un.",
      en: "All-in-one multi-wavelength laser platform.",
    },
    description: {
      fr: "Plateforme laser regroupant sept longueurs d'onde complémentaires, pensée pour couvrir un large spectre d'indications esthétiques avec un seul appareil.",
      en: "Laser platform combining seven complementary wavelengths, designed to cover a wide range of aesthetic indications with a single device.",
    },
    indications: [
      { fr: "Pigmentation, vascularisation, texture", en: "Pigmentation, vascularity, texture" },
      { fr: "Cabinets multi-spécialités", en: "Multi-specialty practices" },
    ],
    benefits: [
      { fr: "Un appareil, sept indications", en: "One device, seven indications" },
      { fr: "Optimisation de l'espace en cabine", en: "Optimized treatment room space" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "hanover",
    name: "Hanover",
    category: "lasers",
    image: img("hanover"),
    tagline: {
      fr: "Laser picoseconde pour un rajeunissement de précision.",
      en: "Picosecond laser for precision rejuvenation.",
    },
    description: {
      fr: "Laser à impulsions picosecondes, conçu pour traiter la pigmentation et stimuler le renouvellement du collagène avec un impact thermique minimal sur les tissus environnants.",
      en: "Picosecond pulse laser, designed to treat pigmentation and stimulate collagen renewal with minimal thermal impact on surrounding tissue.",
    },
    indications: [
      { fr: "Pigmentation résistante", en: "Resistant pigmentation" },
      { fr: "Texture et pores dilatés", en: "Texture and enlarged pores" },
    ],
    benefits: [
      { fr: "Impact thermique minimal", en: "Minimal thermal impact" },
      { fr: "Récupération rapide", en: "Fast recovery" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "megalight",
    name: "MegaLight",
    category: "lasers",
    image: img("megalight"),
    tagline: {
      fr: "IPL haute puissance pour épilation et photorajeunissement.",
      en: "High-power IPL for hair removal and photorejuvenation.",
    },
    description: {
      fr: "Système à lumière pulsée intense haute puissance, adapté à l'épilation sur grandes surfaces ainsi qu'au photorajeunissement du visage et du corps.",
      en: "High-power intense pulsed light system, suited to hair removal on large surfaces as well as facial and body photorejuvenation.",
    },
    indications: [
      { fr: "Épilation grandes surfaces", en: "Hair removal, large surfaces" },
      { fr: "Photorajeunissement visage et corps", en: "Facial and body photorejuvenation" },
    ],
    benefits: [
      { fr: "Cadence de traitement rapide", en: "Fast treatment pace" },
      { fr: "Filtres interchangeables", en: "Interchangeable filters" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "epilight",
    name: "EpiLight",
    category: "lasers",
    image: img("epilight"),
    tagline: {
      fr: "IPL dédiée à l'épilation confort.",
      en: "IPL dedicated to comfortable hair removal.",
    },
    description: {
      fr: "Système IPL optimisé pour l'épilation, associant un système de refroidissement intégré pour un traitement confortable sur peaux sensibles.",
      en: "IPL system optimized for hair removal, with an integrated cooling system for comfortable treatment on sensitive skin.",
    },
    indications: [
      { fr: "Épilation visage et corps", en: "Facial and body hair removal" },
      { fr: "Peaux sensibles", en: "Sensitive skin" },
    ],
    benefits: [
      { fr: "Refroidissement intégré", en: "Integrated cooling" },
      { fr: "Confort patient renforcé", en: "Enhanced patient comfort" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "new-synergy",
    name: "New Synergy+",
    category: "lasers",
    image: img("new-synergy"),
    tagline: {
      fr: "Plateforme combinée laser et lumière pulsée.",
      en: "Combined laser and pulsed-light platform.",
    },
    description: {
      fr: "Plateforme réunissant plusieurs technologies laser et lumière pulsée sur un même châssis, pensée pour les cabinets souhaitant élargir leur offre sans multiplier les appareils.",
      en: "Platform combining several laser and pulsed-light technologies on a single chassis, designed for practices looking to expand their offering without multiplying devices.",
    },
    indications: [
      { fr: "Pigmentation, vascularisation, épilation", en: "Pigmentation, vascularity, hair removal" },
      { fr: "Cabinets en développement", en: "Growing practices" },
    ],
    benefits: [
      { fr: "Plusieurs technologies, un seul socle", en: "Several technologies, one base unit" },
      { fr: "Évolutif selon les besoins du cabinet", en: "Scalable to practice needs" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "queen",
    name: "Queen",
    category: "lasers",
    image: img("queen"),
    tagline: {
      fr: "Laser diode pour une épilation définitive rapide.",
      en: "Diode laser for fast permanent hair reduction.",
    },
    description: {
      fr: "Laser diode haute cadence, conçu pour des séances d'épilation rapides et confortables sur l'ensemble des zones corporelles.",
      en: "High-repetition diode laser, designed for fast, comfortable hair removal sessions across all body areas.",
    },
    indications: [
      { fr: "Épilation définitive corps entier", en: "Full-body permanent hair reduction" },
      { fr: "Cabinets à forte affluence", en: "High-volume practices" },
    ],
    benefits: [
      { fr: "Cadence de tir élevée", en: "High shot repetition rate" },
      { fr: "Grande surface de traitement", en: "Large treatment spot size" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "laser-shock",
    name: "Laser Shock",
    category: "lasers",
    image: img("laser-shock"),
    tagline: {
      fr: "Laser combiné à des ondes de choc pour la peau et la silhouette.",
      en: "Laser combined with shockwaves for skin and silhouette.",
    },
    description: {
      fr: "Système hybride associant émission laser et ondes de choc mécaniques, utilisé pour renforcer les protocoles anti-âge et de fermeté corporelle.",
      en: "Hybrid system combining laser emission and mechanical shockwaves, used to reinforce anti-aging and body-firming protocols.",
    },
    indications: [
      { fr: "Relâchement cutané associé à la cellulite", en: "Skin laxity associated with cellulite" },
      { fr: "Protocoles combinés visage et corps", en: "Combined face and body protocols" },
    ],
    benefits: [
      { fr: "Deux technologies, un seul protocole", en: "Two technologies, one protocol" },
      { fr: "Effet synergique renforcé", en: "Enhanced synergistic effect" },
    ],
    certifications: ["CE Medical"],
  },

  // ─── Amincissement ───────────────────────────────────────────────────
  {
    slug: "pandaslim",
    name: "PandaSlim",
    category: "amincissement",
    image: img("pandaslim"),
    tagline: {
      fr: "Plateforme multi-technologies pour l'amincissement corporel.",
      en: "Multi-technology platform for body slimming.",
    },
    description: {
      fr: "Appareil combinant cavitation, radiofréquence et vacuum, conçu pour cibler la graisse localisée et raffermir la peau en un seul protocole.",
      en: "Device combining cavitation, radiofrequency and vacuum, designed to target localized fat and firm the skin in a single protocol.",
    },
    indications: [
      { fr: "Graisse localisée abdomen et flancs", en: "Localized fat, abdomen and flanks" },
      { fr: "Peau relâchée post-amincissement", en: "Loose skin after slimming" },
    ],
    benefits: [
      { fr: "Trois technologies combinées", en: "Three combined technologies" },
      { fr: "Protocole sans éviction sociale", en: "No-downtime protocol" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "longishape",
    name: "LongiShape",
    category: "amincissement",
    image: img("longishape"),
    tagline: {
      fr: "Radiofréquence et vacuum pour le remodelage corporel.",
      en: "Radiofrequency and vacuum for body reshaping.",
    },
    description: {
      fr: "Système associant radiofréquence multipolaire et vacuum thérapeutique pour remodeler la silhouette et améliorer l'aspect de la peau d'orange.",
      en: "System combining multipolar radiofrequency and therapeutic vacuum to reshape the silhouette and improve the appearance of orange-peel skin.",
    },
    indications: [
      { fr: "Cellulite et capitons", en: "Cellulite and dimpling" },
      { fr: "Remodelage silhouette", en: "Silhouette reshaping" },
    ],
    benefits: [
      { fr: "Sans douleur, sans éviction sociale", en: "Pain-free, no downtime" },
      { fr: "Protocoles adaptés à chaque zone", en: "Protocols adapted per treatment area" },
    ],
    certifications: ["CE Medical", "ISO 13485"],
  },
  {
    slug: "bodytech",
    name: "BodyTech",
    category: "amincissement",
    image: img("bodytech"),
    tagline: {
      fr: "Plateforme corps polyvalente pour cabinets exigeants.",
      en: "Versatile body platform for demanding practices.",
    },
    description: {
      fr: "Plateforme modulaire réunissant plusieurs têtes de traitement corporel, pensée pour construire des protocoles sur mesure selon les objectifs du patient.",
      en: "Modular platform bringing together several body treatment heads, designed to build tailor-made protocols around patient goals.",
    },
    indications: [
      { fr: "Objectifs silhouette variés", en: "Varied body-shaping goals" },
      { fr: "Suivi de protocole personnalisé", en: "Personalized protocol tracking" },
    ],
    benefits: [
      { fr: "Têtes de traitement modulaires", en: "Modular treatment heads" },
      { fr: "Un socle, plusieurs indications", en: "One base unit, multiple indications" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "elite-colombia",
    name: "Elite Colombia",
    category: "amincissement",
    image: img("elite-colombia"),
    tagline: {
      fr: "Protocole de sculpture corporelle inspiré des standards latino-américains.",
      en: "Body sculpting protocol inspired by Latin American standards.",
    },
    description: {
      fr: "Système de radiofréquence et vacuum dédié aux protocoles de sculpture corporelle, notamment sur les zones fessiers et hanches.",
      en: "Radiofrequency and vacuum system dedicated to body-sculpting protocols, particularly on the glute and hip areas.",
    },
    indications: [
      { fr: "Sculpture fessiers et hanches", en: "Glute and hip sculpting" },
      { fr: "Fermeté et galbe corporel", en: "Body firmness and shape" },
    ],
    benefits: [
      { fr: "Applicateurs dédiés aux zones courbes", en: "Applicators dedicated to curved areas" },
      { fr: "Résultats progressifs et naturels", en: "Progressive, natural results" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "shocksteel",
    name: "ShockSteel",
    category: "amincissement",
    image: img("shocksteel"),
    tagline: {
      fr: "Ondes de choc pour la fermeté et l'aspect de la cellulite.",
      en: "Shockwaves for firmness and the appearance of cellulite.",
    },
    description: {
      fr: "Générateur d'ondes de choc radiales, utilisé pour améliorer la microcirculation locale et l'aspect de la cellulite fibreuse.",
      en: "Radial shockwave generator, used to improve local microcirculation and the appearance of fibrous cellulite.",
    },
    indications: [
      { fr: "Cellulite fibreuse et capitons tenaces", en: "Fibrous cellulite and stubborn dimpling" },
      { fr: "Microcirculation locale", en: "Local microcirculation" },
    ],
    benefits: [
      { fr: "Intensité réglable par zone", en: "Adjustable intensity per zone" },
      { fr: "Effet drainant immédiat", en: "Immediate draining effect" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "tanita",
    name: "Tanita",
    category: "amincissement",
    image: img("tanita"),
    tagline: {
      fr: "Analyse de la composition corporelle pour un suivi objectif.",
      en: "Body composition analysis for objective progress tracking.",
    },
    description: {
      fr: "Analyseur de composition corporelle par bio-impédance, utilisé pour mesurer objectivement les résultats des protocoles d'amincissement dans le temps.",
      en: "Bio-impedance body composition analyzer, used to objectively measure slimming protocol results over time.",
    },
    indications: [
      { fr: "Suivi de protocole d'amincissement", en: "Slimming protocol follow-up" },
      { fr: "Bilan initial et objectifs patient", en: "Initial assessment and patient goals" },
    ],
    benefits: [
      { fr: "Données chiffrées et objectives", en: "Objective, data-driven measurements" },
      { fr: "Renforce l'adhésion au protocole", en: "Strengthens protocol adherence" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "slimaxlipo-7",
    name: "SlimaxLipo 7",
    category: "amincissement",
    image: img("slimaxlipo-7"),
    tagline: {
      fr: "Lipolyse laser 7 diodes pour une réduction graisseuse ciblée.",
      en: "7-diode laser lipolysis for targeted fat reduction.",
    },
    description: {
      fr: "Système de lipolyse laser à sept diodes, conçu pour fragmenter les cellules graisseuses superficielles sur des zones étendues.",
      en: "Seven-diode laser lipolysis system, designed to break down superficial fat cells over extended areas.",
    },
    indications: [
      { fr: "Graisse localisée, zones étendues", en: "Localized fat, extended areas" },
      { fr: "Silhouette abdomen, cuisses, bras", en: "Abdomen, thigh and arm contouring" },
    ],
    benefits: [
      { fr: "Sept diodes, couverture large", en: "Seven diodes, wide coverage" },
      { fr: "Séance non invasive", en: "Non-invasive session" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "pressoligne-5",
    name: "Pressoligne 5",
    category: "amincissement",
    image: img("pressoligne-5"),
    tagline: {
      fr: "Pressothérapie 5 chambres pour le drainage lymphatique.",
      en: "5-chamber pressotherapy for lymphatic drainage.",
    },
    description: {
      fr: "Système de pressothérapie à 5 chambres de compression séquentielle, indiqué pour stimuler le drainage lymphatique et soulager la sensation de jambes lourdes.",
      en: "Sequential 5-chamber compression pressotherapy system, indicated to stimulate lymphatic drainage and relieve heavy-leg sensation.",
    },
    indications: [
      { fr: "Rétention d'eau, jambes lourdes", en: "Water retention, heavy legs" },
      { fr: "Drainage post-traitement corporel", en: "Post body-treatment drainage" },
    ],
    benefits: [
      { fr: "Pressions et cycles réglables", en: "Adjustable pressure and cycles" },
      { fr: "Séance relaxante et complémentaire", en: "Relaxing, complementary session" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "slimaxlipo-3",
    name: "SlimaxLipo 3",
    category: "amincissement",
    image: img("slimaxlipo-3"),
    tagline: {
      fr: "Lipolyse laser compacte pour zones ciblées.",
      en: "Compact laser lipolysis for targeted zones.",
    },
    description: {
      fr: "Version compacte à trois diodes de la gamme SlimaxLipo, adaptée aux protocoles ciblés sur de petites zones ou aux cabinets démarrant l'offre lipolyse.",
      en: "Compact three-diode version of the SlimaxLipo range, suited to targeted protocols on smaller areas or practices starting out with lipolysis.",
    },
    indications: [
      { fr: "Petites zones de graisse localisée", en: "Small areas of localized fat" },
      { fr: "Menton et genoux", en: "Chin and knees" },
    ],
    benefits: [
      { fr: "Format compact, installation simple", en: "Compact format, simple setup" },
      { fr: "Idéal pour débuter la lipolyse laser", en: "Ideal entry point for laser lipolysis" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "longilyse",
    name: "LongiLyse",
    category: "amincissement",
    image: img("longilyse"),
    tagline: {
      fr: "Cavitation ultrasonique pour la lipolyse non invasive.",
      en: "Ultrasonic cavitation for non-invasive lipolysis.",
    },
    description: {
      fr: "Générateur de cavitation ultrasonique, utilisé pour fragmenter les cellules graisseuses par effet mécanique, sans chirurgie ni temps de récupération.",
      en: "Ultrasonic cavitation generator, used to break down fat cells through mechanical effect, without surgery or downtime.",
    },
    indications: [
      { fr: "Graisse localisée résistante", en: "Resistant localized fat" },
      { fr: "Silhouette abdomen et hanches", en: "Abdomen and hip contouring" },
    ],
    benefits: [
      { fr: "Technique non invasive éprouvée", en: "Proven non-invasive technique" },
      { fr: "Combinable au drainage post-séance", en: "Combinable with post-session drainage" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "steel-muscle",
    name: "Steel Muscle",
    category: "amincissement",
    image: img("steel-muscle"),
    tagline: {
      fr: "Électrostimulation musculaire haute intensité.",
      en: "High-intensity muscle electrostimulation.",
    },
    description: {
      fr: "Système d'électrostimulation musculaire haute intensité, conçu pour renforcer et tonifier les groupes musculaires ciblés en complément de l'activité physique.",
      en: "High-intensity muscle electrostimulation system, designed to strengthen and tone targeted muscle groups alongside physical activity.",
    },
    indications: [
      { fr: "Tonus musculaire abdominal et fessier", en: "Abdominal and glute muscle tone" },
      { fr: "Renforcement post-partum encadré", en: "Supervised post-partum strengthening" },
    ],
    benefits: [
      { fr: "Applicateurs multi-zones", en: "Multi-zone applicators" },
      { fr: "Séance sans effort physique", en: "No physical effort required" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "perfect-cool",
    name: "Perfect Cool",
    category: "amincissement",
    image: img("perfect-cool"),
    tagline: {
      fr: "Cryolipolyse pour une réduction graisseuse ciblée.",
      en: "Cryolipolysis for targeted fat reduction.",
    },
    description: {
      fr: "Système de cryolipolyse à contrôle thermique précis, destiné à réduire durablement les amas graisseux localisés résistants au régime et au sport.",
      en: "Cryolipolysis system with precise thermal control, designed to durably reduce localized fat deposits resistant to diet and exercise.",
    },
    indications: [
      { fr: "Amas graisseux localisés", en: "Localized fat deposits" },
      { fr: "Zones abdominale, flancs, cuisses", en: "Abdomen, flanks, thighs" },
    ],
    benefits: [
      { fr: "Contrôle thermique de sécurité", en: "Safety thermal control" },
      { fr: "Résultats durables, sans chirurgie", en: "Lasting results, without surgery" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "longchoc",
    name: "LongChoc",
    category: "amincissement",
    image: img("longchoc"),
    tagline: {
      fr: "Ondes de choc pour la fermeté corporelle.",
      en: "Shockwaves for body firmness.",
    },
    description: {
      fr: "Générateur d'ondes de choc focalisées, utilisé en protocole corporel pour stimuler la production de collagène et améliorer la fermeté de la peau.",
      en: "Focused shockwave generator, used in body protocols to stimulate collagen production and improve skin firmness.",
    },
    indications: [
      { fr: "Relâchement cutané corporel", en: "Body skin laxity" },
      { fr: "Cellulite associée au relâchement", en: "Cellulite associated with laxity" },
    ],
    benefits: [
      { fr: "Ondes focalisées, action ciblée", en: "Focused waves, targeted action" },
      { fr: "Complémentaire aux protocoles minceur", en: "Complements slimming protocols" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "brasilift",
    name: "Brasilift",
    category: "amincissement",
    image: img("brasilift"),
    tagline: {
      fr: "Protocole de fermeté et galbe fessier non chirurgical.",
      en: "Non-surgical protocol for glute firmness and shape.",
    },
    description: {
      fr: "Système combinant radiofréquence et vacuum, spécialement conçu pour raffermir et galber la zone fessière sans chirurgie.",
      en: "System combining radiofrequency and vacuum, specifically designed to firm and shape the glute area without surgery.",
    },
    indications: [
      { fr: "Relâchement et manque de galbe fessier", en: "Glute laxity and lack of shape" },
      { fr: "Fermeté post-amincissement", en: "Firmness after slimming" },
    ],
    benefits: [
      { fr: "Applicateur dédié à la zone fessière", en: "Applicator dedicated to the glute area" },
      { fr: "Protocole non chirurgical", en: "Non-surgical protocol" },
    ],
    certifications: ["CE Medical"],
  },
];

export function getTechnologyBySlug(slug: string) {
  return technologies.find((t) => t.slug === slug);
}
