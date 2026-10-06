import type { LocalizedText } from "./technologies";

/**
 * Fiches machines rédigées à partir des brochures Cellulift / LGL Expert (PDF « Brochures », octobre 2026).
 * Uniquement ce que disent les brochures, reformulé pour le site. Une machine absente d'ici garde la fiche « sur demande ».
 */
export type Sheet = {
  tagline?: LocalizedText;
  description?: LocalizedText;
  indications?: LocalizedText[];
  benefits?: LocalizedText[];
};

const t = (fr: string, en: string): LocalizedText => ({ fr, en });

export const sheets: Record<string, Sheet> = {
  // ——— Amincissement avancé ———
  "bodytech-9": {
    tagline: t("Analyse de la composition corporelle en quelques secondes.", "Body composition analysis in a few seconds."),
    description: t(
      "Impédancemètre bioélectrique de précision : là où une balance ne donne que le poids, BodyTech 9 détaille la composition du corps pour construire et suivre un plan de traitement personnalisé.",
      "Precision bioelectrical impedance analyser: where scales only give weight, BodyTech 9 breaks down body composition to build and track a personalised treatment plan."
    ),
    indications: [
      t("Masse grasse, musculaire et maigre", "Fat, muscle and lean mass"),
      t("Taux d'hydratation corporelle", "Body hydration"),
      t("Graisse viscérale", "Visceral fat"),
      t("Suivi des programmes minceur et sportifs", "Monitoring of slimming and training programmes"),
    ],
    benefits: [
      t("Résultats en %, en kg et par code couleur", "Results in %, kg and colour code"),
      t("Historique des mesures pour chaque patient", "Measurement history for each patient"),
      t("Recommandations personnalisées", "Personalised recommendations"),
      t("Simple à utiliser, sans logiciel", "Easy to use, no software needed"),
    ],
  },
  brasilift: {
    tagline: t("Lifting et volume des fessiers et de la poitrine par vacuum.", "Vacuum lifting and volume for buttocks and chest."),
    description: t(
      "Système de vacuothérapie à ventouses (29 ventouses) : l'aspiration stimule la circulation sanguine et l'étirement contrôlé de la peau améliore la qualité du collagène, pour lifter et redonner du volume.",
      "Cup-based vacuum therapy system (29 cups): suction stimulates blood flow and controlled skin stretching improves collagen quality, to lift and restore volume."
    ),
    indications: [
      t("Lifting et galbe des fessiers", "Buttock lifting and shaping"),
      t("Volume de la poitrine et des pectoraux", "Chest and pectoral volume"),
      t("Fermeté de la peau", "Skin firmness"),
    ],
    benefits: [
      t("Stimulation de la circulation sanguine", "Stimulated blood circulation"),
      t("Meilleure qualité du collagène", "Improved collagen quality"),
      t("Non invasif", "Non-invasive"),
    ],
  },
  elitecolombia: {
    tagline: t("4 technologies en 1 pour le remodelage de la région fessière.", "4-in-1 platform for buttock remodelling."),
    description: t(
      "Elitecolombia associe vacuum, palper-rouler motorisé, électrostimulation (EMS) et radiofréquence tripolaire pour raffermir, galber et lisser les fessiers, ainsi que d'autres zones du corps et le visage.",
      "Elitecolombia combines vacuum, motorised roller massage, electrical muscle stimulation (EMS) and tripolar radiofrequency to firm, shape and smooth the buttocks, as well as other body areas and the face."
    ),
    indications: [
      t("Lifting des régions fessières", "Buttock lifting"),
      t("Relâchement cutané", "Skin laxity"),
      t("Cellulite", "Cellulite"),
      t("Graisse localisée des fesses", "Localised fat on the buttocks"),
      t("Rajeunissement cutané visage et corps", "Face and body skin rejuvenation"),
    ],
    benefits: [
      t("Tonus musculaire comparable à l'exercice (EMS)", "Muscle tone similar to exercise (EMS)"),
      t("Drainage et lissage par palper-rouler", "Drainage and smoothing by roller massage"),
      t("Sans chirurgie ni temps de récupération", "No surgery, no downtime"),
    ],
  },
  "hot-power": {
    tagline: t("Rééducation du plancher pelvien par pression, chaleur et vibrations.", "Pelvic floor rehabilitation with pressure, heat and vibration."),
    description: t(
      "Deux sections de coussins d'air exercent une pression ciblée sur le bassin et les cuisses, ajustée automatiquement à la morphologie, associée à un chauffage infrarouge et à des vibrations.",
      "Two air-cushion sections apply targeted pressure to the pelvis and thighs, automatically adjusted to body shape, combined with infrared heating and vibration."
    ),
    indications: [
      t("Faiblesse du plancher pelvien, prolapsus", "Pelvic floor weakness, prolapse"),
      t("Rééducation après l'accouchement", "Post-partum rehabilitation"),
      t("Fonction urinaire et prostatique", "Urinary and prostate function"),
      t("Affaissement des muscles fessiers", "Sagging buttock muscles"),
    ],
    benefits: [
      t("Tonification dès les premières séances", "Toning from the first sessions"),
      t("Meilleure posture et circulation", "Better posture and circulation"),
      t("Séances confortables et relaxantes", "Comfortable, relaxing sessions"),
    ],
  },
  longchoc: {
    tagline: t("Thérapie par ondes de choc pour la douleur et la cellulite.", "Shockwave therapy for pain and cellulite."),
    description: t(
      "Des ondes de choc physiques, non électriques, agissent jusqu'à environ 12 cm de profondeur : elles améliorent la microcirculation, stimulent le collagène et réduisent tensions musculaires et amas graisseux.",
      "Physical, non-electrical shockwaves work up to about 12 cm deep: they improve microcirculation, stimulate collagen and reduce muscle tension and fat deposits."
    ),
    indications: [
      t("Orthopédie et rééducation", "Orthopaedics and rehabilitation"),
      t("Médecine du sport", "Sports medicine"),
      t("Cellulite et peau d'orange", "Cellulite and orange-peel skin"),
      t("Volumes localisés (culotte de cheval)", "Localised volume (saddlebags)"),
    ],
    benefits: [
      t("Effet antalgique", "Pain relief"),
      t("Décongestion et assouplissement des tissus", "Decongested, softer tissue"),
      t("Réduction durable des volumes ciblés", "Lasting reduction of targeted volume"),
    ],
  },
  longishape: {
    tagline: t("Remodelage corporel : infrarouge, radiofréquence, vacuum et lipocavitation.", "Body contouring: infrared, radiofrequency, vacuum and cavitation."),
    description: t(
      "Longishape chauffe en profondeur la graisse et le collagène par infrarouge et radiofréquence bipolaire, avec aspiration, et intègre la lipocavitation pour faire fondre progressivement les amas graisseux.",
      "Longishape heats fat and collagen deep down with infrared and bipolar radiofrequency, with suction, and includes cavitation to gradually break down fat deposits."
    ),
    indications: [
      t("Cellulite des cuisses, hanches, fesses et ventre", "Cellulite on thighs, hips, buttocks and abdomen"),
      t("Culotte de cheval", "Saddlebags"),
      t("Relâchement cutané", "Skin laxity"),
      t("Remodelage après liposuccion", "Post-liposuction contouring"),
      t("Visage et contour des yeux", "Face and eye area"),
    ],
    benefits: [
      t("Corps galbé en 3 séances en moyenne, optimal en 10", "Visible contour in 3 sessions on average, optimal in 10"),
      t("Séances de 15 à 30 minutes, quasi indolores", "15 to 30-minute, nearly painless sessions"),
      t("Sans convalescence", "No downtime"),
    ],
  },
  pandaslim: {
    tagline: t("Sculpter la silhouette par aspiration, chaleur, infrarouge et rouleaux.", "Body sculpting with suction, heat, infrared and rollers."),
    description: t(
      "Deux poignées complémentaires : une poignée d'aspiration avec énergie thermique et infrarouge pour drainer et sculpter, et une poignée à rouleaux à 360° qui crée une compression pulsatile contre la cellulite.",
      "Two complementary handpieces: a suction handpiece with thermal energy and infrared to drain and sculpt, and a 360° roller handpiece creating pulsed compression against cellulite."
    ),
    indications: [
      t("Cellulite et peau d'orange", "Cellulite and orange-peel skin"),
      t("Raffermissement de la silhouette", "Body firming"),
      t("Drainage lymphatique", "Lymphatic drainage"),
      t("Raideurs musculaires", "Muscle stiffness"),
    ],
    benefits: [
      t("Stimule collagène et élastine", "Stimulates collagen and elastin"),
      t("Améliore circulation et oxygénation des tissus", "Better circulation and tissue oxygenation"),
      t("Non invasif", "Non-invasive"),
    ],
  },
  "pressoligne-5": {
    tagline: t("Pressothérapie professionnelle pour drainer tout le corps.", "Professional pressotherapy for full-body drainage."),
    description: t(
      "Combinaison intégrale ventre et jambes : la pression d'air drainante favorise la circulation, l'élimination des toxines et la réduction de la cellulite, tout en soulageant la fatigue musculaire.",
      "Full suit for abdomen and legs: draining air pressure supports circulation, toxin elimination and cellulite reduction, while relieving muscle fatigue."
    ),
    indications: [
      t("Jambes lourdes et rétention d'eau", "Heavy legs and water retention"),
      t("Cellulite et remodelage du corps", "Cellulite and body contouring"),
      t("Fatigue musculaire", "Muscle fatigue"),
      t("Fermeté de la peau", "Skin firmness"),
    ],
    benefits: [
      t("4 modes et 9 niveaux de pression", "4 modes and 9 pressure levels"),
      t("Écran tactile, 8 sorties", "Touchscreen, 8 outputs"),
      t("Usage thérapeutique et esthétique", "Therapeutic and aesthetic use"),
    ],
  },
  shocsteel: {
    tagline: t("Ondes de choc balistiques contre la douleur chronique et la cellulite.", "Ballistic shockwaves for chronic pain and cellulite."),
    description: t(
      "Une onde de pression générée par air comprimé est transmise au corps par l'applicateur : elle dissout les dépôts calciques, améliore la vascularisation et soulage la douleur.",
      "A pressure wave generated by compressed air is transmitted to the body through the applicator: it dissolves calcium deposits, improves vascularisation and relieves pain."
    ),
    indications: [
      t("Douleurs chroniques des tendons et des muscles", "Chronic tendon and muscle pain"),
      t("Cicatrisation et remodelage osseux", "Bone healing and remodelling"),
      t("Cellulite", "Cellulite"),
    ],
    benefits: [
      t("Effet analgésique", "Pain relief"),
      t("Meilleure circulation et métabolisme", "Better circulation and metabolism"),
      t("Soutien de la production de collagène", "Supports collagen production"),
    ],
  },
  "slimax-lipo-3": {
    tagline: t("3 technologies, 5 têtes : lipocavitation, radiofréquence et palper-rouler.", "3 technologies, 5 heads: cavitation, radiofrequency and roller massage."),
    description: t(
      "La lipocavitation fait fondre progressivement les amas graisseux, la radiofréquence (tripolaire, quadripolaire, multipolaire) remodèle et raffermit, et le palper-rouler avec lames de radiofréquence lisse les capitons.",
      "Cavitation gradually breaks down fat, radiofrequency (tripolar, quadripolar, multipolar) remodels and firms, and the roller head with radiofrequency blades smooths dimpled skin."
    ),
    indications: [
      t("Graisse localisée et cellulite", "Localised fat and cellulite"),
      t("Double menton", "Double chin"),
      t("Relâchement du visage et du corps", "Face and body laxity"),
    ],
    benefits: [
      t("Alternative sans bistouri à la liposuccion", "Scalpel-free alternative to liposuction"),
      t("Visage, double menton et corps", "Face, double chin and body"),
      t("Technique indolore", "Painless technique"),
    ],
  },
  "slimax-lipo-7": {
    tagline: t("4 technologies réunies pour traiter graisse et relâchement.", "4 technologies combined to treat fat and laxity."),
    description: t(
      "Lipolaser 1060 nm, lipocavitation, radiofréquence (bipolaire, quadripolaire, multipolaire) et palper-rouler : la graisse diffuse est éliminée progressivement, avec des résultats visibles dès 6 semaines et stabilisés après 12.",
      "1060 nm lipolaser, cavitation, radiofrequency (bipolar, quadripolar, multipolar) and roller massage: diffuse fat is gradually eliminated, with visible results from 6 weeks, stabilised after 12."
    ),
    indications: [
      t("Abdomen, flancs et dos", "Abdomen, flanks and back"),
      t("Intérieur et extérieur des cuisses", "Inner and outer thighs"),
      t("Région sous-mentonnière", "Under-chin area"),
      t("Relâchement cutané", "Skin laxity"),
    ],
    benefits: [
      t("Laser à 42–47 °C, sans impact sur les tissus voisins", "Laser at 42–47 °C, without affecting surrounding tissue"),
      t("Applicateurs plats, sans aspiration traumatisante", "Flat applicators, no traumatic suction"),
      t("Écran 11,5 pouces", "11.5-inch screen"),
    ],
  },
  tanita: {
    tagline: t("Moniteur de composition corporelle sans fil.", "Wireless body composition monitor."),
    description: t(
      "Le bio-impédancemètre TANITA transmet sans fil (ANT+) poids, masse grasse et masse osseuse au logiciel, qui conserve l'historique et met en évidence les progrès de chaque patient.",
      "The TANITA bio-impedance monitor wirelessly (ANT+) sends weight, fat mass and bone mass to the software, which keeps the history and highlights each patient's progress."
    ),
    indications: [
      t("Bilan de composition corporelle", "Body composition assessment"),
      t("Suivi des programmes minceur", "Slimming programme follow-up"),
      t("Suivi nutritionnel et sportif", "Nutrition and fitness monitoring"),
    ],
    benefits: [
      t("Capacité supérieure à 200 kg", "Capacity over 200 kg"),
      t("Nombre de patients illimité", "Unlimited number of patients"),
      t("Fiche de suivi imprimable", "Printable follow-up sheet"),
    ],
  },

  // ——— Solutions lasers ———
  "alex-yag-ultra": {
    tagline: t("Laser double longueur d'onde Alexandrite 755 nm et Nd:YAG 1064 nm.", "Dual-wavelength Alexandrite 755 nm and Nd:YAG 1064 nm laser."),
    description: t(
      "L'Alexandrite cible la mélanine, le Nd:YAG l'oxyhémoglobine : une seule plateforme pour l'épilation de tous les phototypes et le traitement des lésions pigmentaires et vasculaires, avec un refroidissement puissant.",
      "Alexandrite targets melanin, Nd:YAG targets oxyhaemoglobin: one platform for hair removal on all skin types and for pigmented and vascular lesions, with powerful cooling."
    ),
    indications: [
      t("Épilation définitive, y compris poils fins", "Permanent hair removal, including fine hair"),
      t("Lésions pigmentaires bénignes", "Benign pigmented lesions"),
      t("Rougeurs, vaisseaux du visage, veines des jambes", "Redness, facial vessels, leg veins"),
      t("Angiomes, hémangiomes, lacs veineux", "Angiomas, haemangiomas, venous lakes"),
      t("Pseudo-folliculite de la barbe", "Beard pseudofolliculitis"),
    ],
    benefits: [
      t("Résultats rapides en peu de séances", "Fast results in few sessions"),
      t("Fluences élevées et impulsions courtes", "High fluence and short pulses"),
      t("Tous types de peau", "All skin types"),
    ],
  },
  "frac-cov-4": {
    tagline: t("Laser CO2 fractionné pour le rajeunissement et le resurfaçage.", "Fractional CO2 laser for rejuvenation and resurfacing."),
    description: t(
      "Laser CO2 fractionné 10 600 nm utilisable en mode bistouri, décapage ou chauffant : un outil polyvalent pour la médecine esthétique, la dermatologie et plusieurs spécialités chirurgicales.",
      "10,600 nm fractional CO2 laser usable in cutting, ablative or heating mode: a versatile tool for aesthetic medicine, dermatology and several surgical specialties."
    ),
    indications: [
      t("Rides, ridules, relâchement, élastose solaire", "Wrinkles, fine lines, laxity, solar elastosis"),
      t("Cicatrices en creux (resurfacing)", "Atrophic scars (resurfacing)"),
      t("Remise en tension du visage et du décolleté", "Face and décolleté tightening"),
      t("Verrues, kératoses, xanthélasma, petites excroissances", "Warts, keratoses, xanthelasma, small growths"),
      t("Gynécologie, ORL, proctologie", "Gynaecology, ENT, proctology"),
    ],
    benefits: [
      t("Résultat dès la première séance", "Results from the first session"),
      t("Quasi indolore, sans anesthésie", "Nearly painless, no anaesthesia"),
      t("Cicatrisation rapide, sans éviction sociale", "Fast healing, no social downtime"),
    ],
  },
  "hanover-5g": {
    tagline: t("Laser endolift 980 nm et 1470 nm.", "980 nm and 1470 nm endolift laser."),
    description: t(
      "Le 1470 nm, très absorbé par l'eau, et le 980 nm, absorbé par l'hémoglobine, convertissent la lumière en chaleur : ils dissolvent les cellules graisseuses, ferment les petits vaisseaux et raffermissent la peau.",
      "1470 nm, highly absorbed by water, and 980 nm, absorbed by haemoglobin, turn light into heat: they dissolve fat cells, close small vessels and firm the skin."
    ),
    indications: [
      t("Lipolyse : double menton, bras, corps", "Lipolysis: double chin, arms, body"),
      t("Traitement laser endoveineux (EVLT)", "Endovenous laser treatment (EVLT)"),
      t("Varicosités, télangiectasies, angiomes", "Spider veins, telangiectasia, angiomas"),
      t("Verrues, grains de beauté, lésions pigmentées", "Warts, moles, pigmented lesions"),
      t("Gynécologie", "Gynaecology"),
    ],
    benefits: [
      t("Résultat dès la première séance", "Results from the first session"),
      t("Traitement indolore", "Painless treatment"),
      t("Sans éviction socio-professionnelle", "No time off work"),
    ],
  },
  "la-queen": {
    tagline: t("4 technologies, 4000 W : épilation, vasculaire, pigments et IPL.", "4 technologies, 4000 W: hair removal, vascular, pigment and IPL."),
    description: t(
      "Laser diode 755/808/1064 nm pour l'épilation de tous les phototypes toute l'année, laser vasculaire 980 nm, Nd:YAG Q-switched 532/1064/1320 nm et IPL/OPT à cinq filtres : une plateforme tout-en-un.",
      "755/808/1064 nm diode laser for year-round hair removal on all skin types, 980 nm vascular laser, Q-switched Nd:YAG 532/1064/1320 nm and five-filter IPL/OPT: an all-in-one platform."
    ),
    indications: [
      t("Épilation définitive, tous phototypes", "Permanent hair removal, all skin types"),
      t("Varicosités et télangiectasies", "Spider veins and telangiectasia"),
      t("Mélasma, lentigos, naevus", "Melasma, lentigines, naevi"),
      t("Détatouage toutes couleurs, Carbon Peel", "Multicolour tattoo removal, Carbon Peel"),
      t("Acné, taches, signes du vieillissement", "Acne, spots, signs of ageing"),
    ],
    benefits: [
      t("Fonctionnement continu jusqu'à 18 heures", "Continuous operation up to 18 hours"),
      t("Refroidissement par contact saphir", "Sapphire contact cooling"),
      t("Écran 10 pouces", "10-inch screen"),
    ],
  },
  "laser-shock": {
    tagline: t("Laser Nd:YAG Q-switched pour les pigments et les tatouages.", "Q-switched Nd:YAG laser for pigmentation and tattoos."),
    description: t(
      "Des impulsions de haute énergie de quelques nanosecondes à 1064, 532 et 1320 nm détruisent sélectivement les pigments ciblés en épargnant les tissus voisins.",
      "High-energy pulses lasting a few nanoseconds at 1064, 532 and 1320 nm selectively destroy targeted pigment while sparing surrounding tissue."
    ),
    indications: [
      t("Taches pigmentaires", "Pigmented spots"),
      t("Détatouage", "Tattoo removal"),
      t("Naevus et taches de naissance", "Naevi and birthmarks"),
      t("Carbon Peel (1320 nm)", "Carbon Peel (1320 nm)"),
    ],
    benefits: [
      t("Résultats rapides", "Fast results"),
      t("Paramètres personnalisés sur écran tactile", "Custom settings on a touchscreen"),
      t("Dommages thermiques minimisés", "Minimal thermal damage"),
    ],
  },
  megalight: {
    tagline: t("Épilation laser 755, 808 et 1064 nm dans une seule pièce à main.", "755, 808 and 1064 nm laser hair removal in one handpiece."),
    description: t(
      "Trois longueurs d'onde combinées pour traiter tous les phototypes (I à VI) et toutes les profondeurs de poil, avec une poignée de refroidissement réglable qui soulage la douleur.",
      "Three combined wavelengths to treat all skin types (I to VI) and all hair depths, with an adjustable cooling handle that relieves discomfort."
    ),
    indications: [
      t("Peaux foncées et poils profonds (1064 nm)", "Dark skin and deep hair (1064 nm)"),
      t("Bras, jambes, joues, barbe (808 nm)", "Arms, legs, cheeks, beard (808 nm)"),
      t("Peaux claires et poils fins : sourcils, lèvre (755 nm)", "Fair skin and fine hair: brows, lip (755 nm)"),
      t("Poils résiduels", "Residual hair"),
    ],
    benefits: [
      t("Plus de 80 % de réduction des poils après 3 à 5 séances chez plus de 95 % des patients", "Over 80% hair reduction after 3 to 5 sessions in over 95% of patients"),
      t("Poils plus fins dès 1 à 2 séances", "Finer hair after 1 to 2 sessions"),
      t("Énergie modérée pour limiter les risques", "Moderate energy to limit risks"),
    ],
  },
  "new-epil-light": {
    tagline: t("Lumière pulsée IPL avec technologie SHR.", "IPL with SHR technology."),
    description: t(
      "La technologie SHR multiplie les flashs à plus faible énergie, jusqu'à 10 par seconde : le traitement est plus confortable, plus rapide et plus régulier, avec un refroidissement intégré à la tête.",
      "SHR technology fires more flashes at lower energy, up to 10 per second: treatment is more comfortable, faster and more even, with cooling built into the head."
    ),
    indications: [
      t("Épilation définitive", "Permanent hair removal"),
      t("Rajeunissement facial", "Facial rejuvenation"),
      t("Taches pigmentaires et vasculaires", "Pigmented and vascular spots"),
      t("Acné", "Acne"),
    ],
    benefits: [
      t("Soins sans douleur", "Pain-free treatment"),
      t("Couverture régulière des zones", "Even coverage"),
      t("Écran tactile couleur", "Colour touchscreen"),
    ],
  },
  sevenwaves: {
    tagline: t("4 technologies dans un seul équipement : diode, Nd:YAG, IPL et radiofréquence.", "4 technologies in one system: diode, Nd:YAG, IPL and radiofrequency."),
    description: t(
      "Laser diode 810 nm avec refroidissement F.R.O.S.T., Nd:YAG Q-switched 1064/1320/532 nm, IPL à filtres et radiofréquence bipolaire avec refroidissement CDC : une plateforme compacte pour l'épilation, les pigments et le rajeunissement.",
      "810 nm diode laser with F.R.O.S.T. cooling, Q-switched Nd:YAG 1064/1320/532 nm, filtered IPL and bipolar radiofrequency with CDC cooling: a compact platform for hair removal, pigmentation and rejuvenation."
    ),
    indications: [
      t("Épilation permanente, tous phototypes", "Permanent hair removal, all skin types"),
      t("Taches pigmentaires, détatouage, Carbon Peel", "Pigmented spots, tattoo removal, Carbon Peel"),
      t("Rides fines, érythrose, acné, varicosités", "Fine lines, redness, acne, spider veins"),
      t("Rajeunissement et remodelage visage et corps", "Face and body rejuvenation and contouring"),
    ],
    benefits: [
      t("Moins de douleur et de risques de brûlure", "Less pain and lower burn risk"),
      t("Traitements rapides et adaptables", "Fast, adaptable treatments"),
      t("Résultats dès les premières séances", "Results from the first sessions"),
    ],
  },
  "synergy-plus": {
    tagline: t("Laser diode 808 nm pour l'épilation.", "808 nm diode laser for hair removal."),
  },

  // ——— Réjuvénation cutanée ———
  "biofiller-x7": {
    tagline: t("Gel de comblement autologue préparé à partir du plasma du patient.", "Autologous filler gel made from the patient's own plasma."),
    description: t(
      "Le Biofiller X7 chauffe le plasma pour obtenir un gel biocompatible issu du sang du patient : il comble, lisse les rides et redonne du volume, sans risque de réaction allergique.",
      "Biofiller X7 heats plasma to create a biocompatible gel from the patient's own blood: it fills, smooths wrinkles and restores volume, with no risk of allergic reaction."
    ),
    indications: [
      t("Rides et ridules", "Wrinkles and fine lines"),
      t("Perte de volume du visage", "Facial volume loss"),
      t("Rajeunissement du visage", "Facial rejuvenation"),
    ],
    benefits: [
      t("Gel 100 % autologue", "100% autologous gel"),
      t("Programmes mémorisés, température réglable", "Saved programmes, adjustable temperature"),
      t("Sans préchauffage, simple d'utilisation", "No preheating, easy to use"),
    ],
  },
  centrifugel: {
    tagline: t("Centrifugeuse pour la préparation du plasma et du sérum.", "Centrifuge for plasma and serum preparation."),
    description: t(
      "Centrifugeuse 4000 tr/min à écran LCD, avec contrôle du temps et de la vitesse, pour préparer le plasma (PRP, Biofiller) et le sérum au cabinet.",
      "4000 rpm centrifuge with LCD screen and time and speed control, to prepare plasma (PRP, Biofiller) and serum in clinic."
    ),
    indications: [
      t("Préparation du PRP", "PRP preparation"),
      t("Préparation du plasma pour Biofiller", "Plasma preparation for Biofiller"),
      t("Séparation du sérum", "Serum separation"),
    ],
    benefits: [
      t("12 tubes", "12 tubes"),
      t("Silencieuse", "Quiet operation"),
      t("Couvercle verrouillé, arrêt automatique à l'ouverture", "Locked lid, automatic stop when opened"),
    ],
  },
  dermaplex: {
    tagline: t("Plasma pen : la solution pour le contour de l'œil.", "Plasma pen: the solution for the eye area."),
    description: t(
      "Le Dermaplex vaporise les couches superficielles de la peau, qui se rétracte immédiatement puis encore les jours suivants : une alternative à la blépharoplastie pour un relâchement modéré des paupières, sans bistouri ni laser, sous anesthésie locale.",
      "Dermaplex vaporises the superficial skin layers, which tighten immediately and keep tightening over the following days: an alternative to blepharoplasty for moderate eyelid laxity, without scalpel or laser, under local anaesthesia."
    ),
    indications: [
      t("Relâchement des paupières supérieures et inférieures", "Upper and lower eyelid laxity"),
      t("Rides autour des yeux et de la bouche", "Wrinkles around the eyes and mouth"),
      t("Relâchement du cou, vergetures", "Neck laxity, stretch marks"),
      t("Taches, kératose sénile, verrues, xanthélasma", "Spots, senile keratosis, warts, xanthelasma"),
      t("Cicatrices d'acné", "Acne scars"),
    ],
    benefits: [
      t("Sans chirurgie, sans botox, sans laser", "No surgery, no botox, no laser"),
      t("Sans cicatrice ni saignement", "No scarring, no bleeding"),
      t("Rétraction cutanée immédiate", "Immediate skin tightening"),
    ],
  },
  frequencious: {
    tagline: t("Radiofréquence fractionnée à micro-aiguilles.", "Microneedle fractional radiofrequency."),
    description: t(
      "Une centaine de micro-aiguilles délivrent l'énergie de radiofréquence dans le derme, à profondeur réglable : la chaleur produite raffermit et lisse la peau, pour un teint plus tonique et plus éclatant.",
      "Around a hundred microneedles deliver radiofrequency energy into the dermis at adjustable depth: the heat produced firms and smooths the skin for a toned, radiant complexion."
    ),
    indications: [
      t("Rajeunissement et resurfaçage", "Rejuvenation and resurfacing"),
      t("Rides du visage, du cou et du décolleté", "Face, neck and décolleté wrinkles"),
      t("Pores dilatés", "Enlarged pores"),
      t("Cicatrices d'acné", "Acne scars"),
      t("Vergetures rouges et blanches", "Red and white stretch marks"),
    ],
    benefits: [
      t("Jusqu'à 90 % d'amélioration de la qualité de la peau", "Up to 90% improvement in skin quality"),
      t("Résultats durables 1 à 2 ans", "Results lasting 1 to 2 years"),
      t("Tous phototypes, même les peaux bronzées", "All skin types, even tanned skin"),
    ],
  },
  "mym-dermapen": {
    tagline: t("Microneedling pour stimuler le collagène.", "Microneedling to stimulate collagen."),
    description: t(
      "Le stylo My Pen perce l'épiderme et le derme à profondeur variable, à raison de 8 000 à 9 000 impacts par minute : il déclenche la production d'un nouveau collagène organisé qui épaissit la peau.",
      "The My Pen device punctures the epidermis and dermis at variable depth, 8,000 to 9,000 times per minute: it triggers new, organised collagen that thickens the skin."
    ),
    indications: [
      t("Cicatrices, dont cicatrices d'acné", "Scars, including acne scars"),
      t("Rides", "Wrinkles"),
      t("Grandes surfaces : bras, ventre, cuisses", "Large areas: arms, abdomen, thighs"),
    ],
    benefits: [
      t("Effet « filler » naturel", "Natural filler effect"),
      t("Points de puncture propres", "Clean puncture points"),
      t("Traitement rapide de grandes zones", "Fast treatment of large areas"),
    ],
  },
  "pistor-plus-34": {
    tagline: t("Pistolet injecteur de mésothérapie.", "Mesotherapy injector gun."),
    description: t(
      "Le Pistor +34 injecte les principes actifs avec une profondeur réglable, point par point sur le visage, les yeux et le cuir chevelu, ou en rafales sur le corps.",
      "Pistor +34 injects active ingredients at adjustable depth, point by point on the face, eye area and scalp, or in bursts on the body."
    ),
    indications: [
      t("Peau jeune : pores dilatés, acné", "Young skin: enlarged pores, acne"),
      t("Peau d'âge moyen : mésolift raffermissant", "Middle-aged skin: firming mesolift"),
      t("Peau mature : ridules, acide hyaluronique, antioxydants", "Mature skin: fine lines, hyaluronic acid, antioxidants"),
      t("Corps : cuisses, abdomen", "Body: thighs, abdomen"),
    ],
    benefits: [
      t("Moins de douleur et d'ecchymoses", "Less pain and bruising"),
      t("Injections plus précises", "More precise injections"),
      t("Traitement plus court, récupération plus rapide", "Shorter treatment, faster recovery"),
    ],
  },
  "skin-analyser-g7": {
    tagline: t("Analyseur de diagnostic cutané.", "Skin diagnostic analyser."),
  },
  "skin-bright": {
    tagline: t("Station de soins du visage, 8 technologies.", "Facial care station, 8 technologies."),
  },

  // ——— Photomodulation ———
  "led-bio-light": {
    tagline: t("Panneau LED quatre couleurs pour le visage et le corps.", "Four-colour LED panel for face and body."),
    description: t(
      "Rouge 640 nm pour revitaliser, bleu 423 nm contre les bactéries de l'acné, vert 523 nm pour apaiser, jaune 583 nm contre les rougeurs : une large surface de traitement, jusqu'à 50 × 20 cm.",
      "Red 640 nm to revitalise, blue 423 nm against acne bacteria, green 523 nm to soothe, yellow 583 nm against redness: a large treatment area, up to 50 × 20 cm."
    ),
    indications: [
      t("Acné et contrôle des glandes sébacées", "Acne and sebaceous gland control"),
      t("Rougeurs, érythème, lésions pigmentaires", "Redness, erythema, pigmented lesions"),
      t("Cicatrices d'acné", "Acne scars"),
      t("Peaux sensibles, atopie", "Sensitive skin, atopy"),
      t("Régénération cellulaire", "Cell regeneration"),
    ],
    benefits: [
      t("Lumière froide, non invasive", "Cold, non-invasive light"),
      t("Couleurs selon l'indication", "Colours chosen by indication"),
      t("760 LED par couleur", "760 LEDs per colour"),
    ],
  },
  "led-fotoskin-ultra": {
    tagline: t("LED thérapie visage pour renforcer tous vos soins.", "Facial LED therapy to boost every treatment."),
    description: t(
      "La lumière froide monochromatique complète et renforce les résultats des lasers, de la radiofréquence fractionnée, de la mésothérapie, du PRP, de l'Hydrafacial et du HIFU.",
      "Cold monochromatic light complements and boosts the results of lasers, fractional radiofrequency, mesotherapy, PRP, Hydrafacial and HIFU."
    ),
    indications: [
      t("Vieillissement chronologique et actinique", "Chronological and photo-ageing"),
      t("Acné, rougeurs et inflammations", "Acne, redness and inflammation"),
      t("Atopie", "Atopy"),
      t("Cuir chevelu", "Scalp care"),
      t("Éclat et revitalisation", "Radiance and revitalisation"),
    ],
    benefits: [
      t("Résultats mesurables après 5 à 8 séances de 15 à 30 minutes", "Measurable results after 5 to 8 sessions of 15 to 30 minutes"),
      t("Sans risque de brûlure ni de cicatrice", "No risk of burns or scarring"),
      t("Couleurs combinables", "Combinable colours"),
    ],
  },
  longiflash: {
    tagline: t("LED thérapie quatre couleurs.", "Four-colour LED therapy."),
    description: t(
      "La lumière stimule les fibroblastes et donc la synthèse de collagène et d'élastine. Quatre longueurs d'onde (bleu, vert, jaune, rouge) pour adapter le soin à chaque problème de peau.",
      "Light stimulates fibroblasts and therefore collagen and elastin synthesis. Four wavelengths (blue, green, yellow, red) to tailor the treatment to each skin concern."
    ),
    indications: [
      t("Acné et cicatrices d'acné", "Acne and acne scars"),
      t("Rides et vieillissement cutané", "Wrinkles and skin ageing"),
      t("Vergetures récentes", "Recent stretch marks"),
      t("Rougeurs, taches", "Redness, spots"),
      t("Atopie, soin des cheveux", "Atopy, hair care"),
    ],
    benefits: [
      t("Résultats après 5 à 8 séances de 15 à 30 minutes", "Results after 5 to 8 sessions of 15 to 30 minutes"),
      t("Sans brûlure, sans séquelle", "No burns, no after-effects"),
      t("Non invasif", "Non-invasive"),
    ],
  },

  // ——— HIFU ———
  "perfect-lift": {
    tagline: t("HIFU vaginal : raffermissement intime sans chirurgie.", "Vaginal HIFU: non-surgical intimate tightening."),
    description: t(
      "Les ultrasons focalisés de haute intensité resserrent la paroi vaginale et le tissu conjonctif. La pièce à main tourne à 360° pour traiter toute la zone, en 15 à 20 minutes, au cours d'une simple consultation.",
      "High-intensity focused ultrasound tightens the vaginal wall and connective tissue. The handpiece rotates 360° to treat the whole area in 15 to 20 minutes, during a regular consultation."
    ),
    indications: [
      t("Relâchement vaginal", "Vaginal laxity"),
      t("Sécheresse vaginale", "Vaginal dryness"),
      t("Prévention après l'accouchement", "Post-partum prevention"),
      t("Incontinence urinaire", "Urinary incontinence"),
      t("Rajeunissement de la muqueuse vulvo-vaginale", "Vulvovaginal mucosa rejuvenation"),
    ],
    benefits: [
      t("Sans douleur, sans anesthésie, sans saignement", "No pain, no anaesthesia, no bleeding"),
      t("Résultat visible dès la première séance", "Visible results from the first session"),
      t("Reprise immédiate des activités", "Immediate return to activities"),
    ],
  },
  rejuvskin: {
    tagline: t("Plateforme HIFU : visage, corps et zone intime.", "HIFU platform: face, body and intimate area."),
    description: t(
      "Les ultrasons focalisés agissent de la surface jusqu'à 13 mm de profondeur, selon la tête utilisée, pour retendre les tissus relâchés et éliminer les adipocytes. Les résultats sont visibles dès la première séance et s'optimisent dans les 15 jours.",
      "Focused ultrasound works from the surface down to 13 mm, depending on the head, to tighten lax tissue and eliminate fat cells. Results show from the first session and improve over 15 days."
    ),
    indications: [
      t("Visage : rides, paupières, double menton, ovale, bajoues", "Face: wrinkles, eyelids, double chin, jawline, jowls"),
      t("Corps : relâchement des bras, cuisses, poitrine, bas ventre", "Body: laxity of arms, thighs, chest, lower abdomen"),
      t("Poignées d'amour et surpoids", "Love handles and excess weight"),
      t("Zone intime : sécheresse, incontinence, post-accouchement", "Intimate area: dryness, incontinence, post-partum"),
    ],
    benefits: [
      t("Effet liftant jusqu'à 2 ans", "Lifting effect for up to 2 years"),
      t("Sans cicatrice, sans anesthésie, sans récupération", "No scarring, no anaesthesia, no downtime"),
      t("Tous phototypes, en toute saison", "All skin types, all year round"),
    ],
  },
  vagilase: {
    tagline: t("LED intime pour traiter, soulager et réparer en douceur.", "Intimate LED to gently treat, relieve and repair."),
    description: t(
      "Les longueurs d'onde rouges (633–830 nm) et bleues (455 nm) relancent la production de collagène et d'élastine des tissus intimes. Séances de 20 minutes, sans douleur ni chaleur.",
      "Red (633–830 nm) and blue (455 nm) wavelengths restart collagen and elastin production in intimate tissue. 20-minute sessions, with no pain and no heat."
    ),
    indications: [
      t("Sécheresse et inconfort vaginal", "Vaginal dryness and discomfort"),
      t("Rajeunissement vulvo-vaginal", "Vulvovaginal rejuvenation"),
      t("Vulvites, vaginites, séquelles post-virales et post-mycosiques", "Vulvitis, vaginitis, post-viral and post-fungal after-effects"),
      t("Cicatrisation post-épisiotomie ou post-opératoire", "Healing after episiotomy or surgery"),
      t("Soutien d'une hormonothérapie", "Support during hormone therapy"),
    ],
    benefits: [
      t("Sans douleur et sans chaleur", "No pain, no heat"),
      t("Soulagement souvent immédiat", "Often immediate relief"),
      t("Adapté aux vagins rétrécis ou douloureux", "Suitable for narrow or painful vaginas"),
    ],
  },

  // ——— Thérapie avancée ———
  cryocover: {
    tagline: t("Froid et compression pulsée pour épaules, coudes, genoux et chevilles.", "Cold and pulsed compression for shoulders, elbows, knees and ankles."),
    description: t(
      "Unité portable qui associe le froid à une compression pulsée : le froid pénètre en profondeur dans le tissu blessé et contrôle l'œdème, l'hématome et la douleur articulaire.",
      "Portable unit combining cold with pulsed compression: cold penetrates deep into injured tissue and controls swelling, haematoma and joint pain."
    ),
    indications: [
      t("Douleurs articulaires localisées", "Localised joint pain"),
      t("Œdème et complications post-opératoires", "Swelling and post-operative complications"),
      t("Entorses, contractures, spasmes", "Sprains, contractures, spasms"),
      t("Lésions musculaires, récupération du sportif", "Muscle injuries, athlete recovery"),
    ],
    benefits: [
      t("Effet antalgique et thérapeutique", "Pain-relieving and therapeutic"),
      t("9 modes de pression et de durée", "9 pressure and duration modes"),
      t("Brassards pour chaque articulation", "Cuffs for each joint"),
    ],
  },
  "dreamtech-pro": {
    tagline: t("Table d'examen électrique à 3 moteurs.", "Electric examination table with 3 motors."),
    description: t(
      "Table électrique pour la consultation générale et la médecine esthétique, réglable de 48 à 94 cm par pédale, en trois sections, avec dossier inclinable de 0 à 100°.",
      "Electric table for general consultation and aesthetic medicine, adjustable from 48 to 94 cm by foot pedal, in three sections, with a backrest reclining from 0 to 100°."
    ),
    benefits: [
      t("3 moteurs avec amortisseurs", "3 motors with dampers"),
      t("Sellerie 5 cm résistante au feu, aux taches et à l'eau", "5 cm upholstery resistant to fire, stains and water"),
      t("Châssis époxy, 4 freins, roues rétractables", "Epoxy frame, 4 brakes, retractable wheels"),
    ],
  },
  frequentazia: {
    tagline: t("Radiofréquence intime pour la santé et le confort féminins.", "Intimate radiofrequency for women's health and comfort."),
    description: t(
      "La radiofréquence chauffe en profondeur le derme et les tissus sous-cutanés sans léser la surface : elle contracte le collagène existant, en stimule la formation et améliore la microcirculation et l'hydratation des tissus.",
      "Radiofrequency heats the dermis and subcutaneous tissue deep down without damaging the surface: it contracts existing collagen, stimulates new collagen and improves microcirculation and tissue hydration."
    ),
    indications: [
      t("Laxité vaginale post-partum ou liée à l'âge", "Post-partum or age-related vaginal laxity"),
      t("Sécheresse et manque de lubrification", "Dryness and lack of lubrication"),
      t("Inconfort lors des rapports", "Discomfort during intercourse"),
      t("Incontinence urinaire légère à modérée", "Mild to moderate urinary incontinence"),
    ],
    benefits: [
      t("Sans douleur ni chirurgie", "No pain, no surgery"),
      t("Résultats dès les premières séances", "Results from the first sessions"),
      t("Raffermissement progressif", "Progressive firming"),
    ],
  },
  "physiomedic-a600": {
    tagline: t("Physiothérapie 10 en 1 à stimulation par impulsions.", "10-in-1 pulse-stimulation physiotherapy."),
    description: t(
      "Un seul appareil pour l'électrothérapie, l'ultrasonothérapie, l'infrarouge lointain, la thérapie laser et la stimulation des points d'acupuncture, sur six canaux.",
      "One device for electrotherapy, ultrasound therapy, far infrared, laser therapy and acupoint stimulation, across six channels."
    ),
    indications: [
      t("Douleurs musculaires superficielles et profondes", "Superficial and deep muscle pain"),
      t("Rééducation", "Rehabilitation"),
      t("Soin des yeux et du sommeil", "Eye care and sleep support"),
    ],
    benefits: [
      t("Basse et moyenne fréquence, 24 niveaux", "Low and medium frequency, 24 levels"),
      t("Séances programmables de 5 à 30 minutes", "Programmable 5 to 30-minute sessions"),
      t("Grand écran LCD, compact", "Large LCD screen, compact"),
    ],
  },
  "t-care-6g": {
    tagline: t("Técarthérapie haute fréquence et massage myofascial.", "High-frequency tecar therapy and myofascial massage."),
    description: t(
      "L'énergie haute fréquence pénètre jusqu'à 12 cm pour stimuler la régénération des muscles, tendons et ligaments. Trois modes (athermique, thermique, hyperthermique) et un couteau de fascia complètent le traitement.",
      "High-frequency energy reaches up to 12 cm deep to stimulate regeneration of muscles, tendons and ligaments. Three modes (athermal, thermal, hyperthermal) and a fascia blade complete the treatment."
    ),
    indications: [
      t("Tendinite de l'épaule", "Shoulder tendinitis"),
      t("Entorse de la cheville avec œdème", "Ankle sprain with swelling"),
      t("Épine calcanéenne, fasciite plantaire", "Heel spur, plantar fasciitis"),
      t("Arthrose du genou ou de la hanche", "Knee or hip osteoarthritis"),
      t("Lymphœdème du bras, cellulite et vergetures", "Arm lymphoedema, cellulite and stretch marks"),
    ],
    benefits: [
      t("Drainant, soulage les douleurs", "Draining, relieves pain"),
      t("Favorise la cicatrisation", "Supports healing"),
      t("Usage esthétique et thérapeutique", "Aesthetic and therapeutic use"),
    ],
  },
};
