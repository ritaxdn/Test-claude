import type { LocalizedText } from "./technologies";
import type { IndicationKey } from "./indications";

/**
 * Pages par technologie (silos SEO) : « laser esthétique » et « radiofréquence esthétique ».
 * Capter les recherches « laser diode maroc », « laser alexandrite », « laser CO2 fractionné », « prix … »,
 * « … ou … » (comparaisons), et renvoyer vers les machines CELLULIFT qui utilisent la technologie.
 * Machines : uniquement celles dont la fiche mentionne la technologie. Aucun prix publié (choix Cellulift).
 */
export type TopicKey =
  | "laser-esthetique"
  | "laser-diode"
  | "alexandrite"
  | "nd-yag"
  | "co2-fractionne"
  | "ipl"
  | "endolift"
  | "radiofrequence-esthetique"
  | "radiofrequence-microneedling";

export type Topic = {
  /** Silo et adresse : /<silo> pour la page mère, /<silo>/<slug> pour les pages filles */
  silo: "laser-esthetique" | "radiofrequence-esthetique";
  slug?: string;
  name: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  h1: LocalizedText;
  intro: LocalizedText;
  /** Ce qu'il faut savoir sur la technologie (connaissances générales, sans chiffre de performance inventé) */
  points: [LocalizedText, LocalizedText][];
  /** Comparaisons « X ou Y ? » (recherches de décision) */
  compare: { q: LocalizedText; a: LocalizedText }[];
  slugs: string[];
  indications: IndicationKey[];
};

const t = (fr: string, en: string): LocalizedText => ({ fr, en });
const N = " ";

export const topics: Record<TopicKey, Topic> = {
  "laser-esthetique": {
    silo: "laser-esthetique",
    name: t("Laser esthétique", "Aesthetic laser"),
    title: t("Laser esthétique professionnel au Maroc : diode, Nd:YAG, CO2", "Professional aesthetic lasers in Morocco: diode, Nd:YAG, CO2"),
    description: t(
      "Lasers médicaux et esthétiques professionnels au Maroc : diode, Alexandrite, Nd:YAG, CO2 fractionné, IPL, endolift. Démo en agence, installation, formation et SAV.",
      "Professional medical and aesthetic lasers in Morocco: diode, Alexandrite, Nd:YAG, fractional CO2, IPL, endolift. Branch demos, installation, training and after-sales."
    ),
    h1: t("Lasers esthétiques et médicaux professionnels au Maroc", "Professional aesthetic and medical lasers in Morocco"),
    intro: t(
      "Chaque laser agit sur une cible précise (mélanine, hémoglobine, eau) selon sa longueur d'onde. Le bon choix dépend de vos indications et des phototypes de vos patients : au Maroc, beaucoup de peaux sont méditerranéennes ou mates, ce qui compte pour l'épilation et le pigmentaire. Voici les technologies laser distribuées par CELLULIFT, et les machines qui les utilisent.",
      "Each laser acts on a specific target (melanin, haemoglobin, water) depending on its wavelength. The right choice depends on your indications and your patients' skin types: in Morocco many skins are Mediterranean or olive, which matters for hair removal and pigment work. Here are the laser technologies CELLULIFT distributes, and the devices that use them."
    ),
    points: [
      [t("Épilation", "Hair removal"), t("Laser diode, Alexandrite et Nd:YAG : on combine souvent plusieurs longueurs d'onde pour traiter tous les phototypes.", "Diode, Alexandrite and Nd:YAG lasers: several wavelengths are often combined to treat every skin type.")],
      [t("Pigments et tatouages", "Pigment and tattoos"), t("Laser Nd:YAG Q-switched : des impulsions très courtes fragmentent le pigment.", "Q-switched Nd:YAG laser: very short pulses break up the pigment.")],
      [t("Rides, cicatrices, texture", "Wrinkles, scars, texture"), t("Laser CO2 fractionné : resurfaçage par micro-zones, en préservant la peau saine autour.", "Fractional CO2 laser: resurfacing in micro-zones, sparing the healthy skin around them.")],
      [t("Lipolyse et remise en tension", "Lipolysis and tightening"), t("Endolift : une fibre laser agit sous la peau, sans incision chirurgicale.", "Endolift: a laser fibre works under the skin, without a surgical incision.")],
    ],
    compare: [
      {
        q: t(`Laser ou lumière pulsée (IPL)${N}?`, "Laser or intense pulsed light (IPL)?"),
        a: t(
          "Le laser émet une seule longueur d'onde, très ciblée ; l'IPL émet un large spectre filtré, plus polyvalent mais moins sélectif. Pour un fort volume d'épilation, le laser est généralement préféré ; l'IPL complète bien une carte de soins (taches, rougeurs, rajeunissement).",
          "A laser emits a single, highly targeted wavelength; IPL emits a filtered broad spectrum, more versatile but less selective. For high hair-removal volume, lasers are generally preferred; IPL nicely complements a treatment menu (spots, redness, rejuvenation)."
        ),
      },
    ],
    slugs: ["la-queen", "alex-yag-ultra", "megalight", "sevenwaves", "synergy-plus", "laser-shock", "fotokrom", "frac-cov-4", "hanover-5g", "new-epil-light"],
    indications: ["epilation-laser", "detatouage", "taches-pigmentaires", "couperose-lesions-vasculaires", "rides-rajeunissement"],
  },
  "laser-diode": {
    silo: "laser-esthetique",
    slug: "laser-diode",
    name: t("Laser diode", "Diode laser"),
    title: t("Laser diode professionnel au Maroc : épilation 808, 755, 1064 nm", "Professional diode lasers in Morocco: 808, 755, 1064 nm hair removal"),
    description: t(
      "Lasers diode d'épilation professionnels au Maroc : 808 nm et plateformes 755/808/1064 nm pour tous les phototypes. Prix sur demande, démo en agence, formation et SAV.",
      "Professional diode hair removal lasers in Morocco: 808 nm and 755/808/1064 nm platforms for every skin type. Price on request, branch demos, training and after-sales."
    ),
    h1: t("Lasers diode professionnels au Maroc", "Professional diode lasers in Morocco"),
    intro: t(
      "Le laser diode est la technologie d'épilation la plus répandue en cabinet. Le 808 nm offre un bon compromis entre efficacité et sécurité ; les plateformes multi-longueurs d'onde (755, 808 et 1064 nm) permettent d'adapter le traitement aux peaux claires comme aux peaux mates et foncées.",
      "The diode laser is the most widespread hair removal technology in practice. 808 nm offers a good balance of efficacy and safety; multi-wavelength platforms (755, 808 and 1064 nm) let you adapt treatment to light skin as well as olive and dark skin."
    ),
    points: [
      [t("808 nm", "808 nm"), t("La longueur d'onde de référence de l'épilation diode, polyvalente sur la plupart des phototypes.", "The reference wavelength for diode hair removal, versatile across most skin types.")],
      [t("755 + 808 + 1064 nm", "755 + 808 + 1064 nm"), t("Le 755 nm cible mieux les poils fins et clairs, le 1064 nm sécurise les peaux foncées : utile pour une patientèle marocaine variée.", "755 nm better targets fine, light hair, 1064 nm makes dark skin safer: useful for a varied Moroccan patient base.")],
      [t("Refroidissement", "Cooling"), t("Un refroidissement par contact protège l'épiderme et améliore le confort pendant la séance.", "Contact cooling protects the epidermis and improves comfort during the session.")],
    ],
    compare: [
      {
        q: t(`Laser diode ou Alexandrite${N}?`, "Diode or Alexandrite laser?"),
        a: t(
          "L'Alexandrite (755 nm) est très efficace sur les peaux claires et les poils fins ; la diode 808 nm est plus polyvalente sur les phototypes intermédiaires. Les plateformes qui combinent 755, 808 et 1064 nm couvrent les deux besoins, et le 1064 nm sécurise les peaux foncées.",
          "Alexandrite (755 nm) is very effective on light skin and fine hair; 808 nm diode is more versatile on intermediate skin types. Platforms combining 755, 808 and 1064 nm cover both needs, with 1064 nm making dark skin safer."
        ),
      },
      {
        q: t(`Laser diode ou IPL pour l'épilation${N}?`, "Diode laser or IPL for hair removal?"),
        a: t(
          "Le laser diode est plus ciblé et généralement préféré pour un centre d'épilation à fort volume ; l'IPL est plus polyvalent (taches, rougeurs, rajeunissement) mais moins sélectif sur le poil.",
          "The diode laser is more targeted and generally preferred for a high-volume hair removal centre; IPL is more versatile (spots, redness, rejuvenation) but less selective on hair."
        ),
      },
    ],
    slugs: ["la-queen", "sevenwaves", "synergy-plus"],
    indications: ["epilation-laser"],
  },
  alexandrite: {
    silo: "laser-esthetique",
    slug: "alexandrite",
    name: t("Laser Alexandrite", "Alexandrite laser"),
    title: t("Laser Alexandrite 755 nm professionnel au Maroc", "Professional 755 nm Alexandrite lasers in Morocco"),
    description: t(
      "Laser Alexandrite 755 nm et Nd:YAG 1064 nm pour l'épilation, les taches et le vasculaire, tous phototypes. Prix sur demande, démo en agence, formation et SAV au Maroc.",
      "755 nm Alexandrite and 1064 nm Nd:YAG laser for hair removal, spots and vascular work, all skin types. Price on request, branch demos, training and after-sales in Morocco."
    ),
    h1: t("Laser Alexandrite professionnel au Maroc", "Professional Alexandrite lasers in Morocco"),
    intro: t(
      "L'Alexandrite émet à 755 nm, une longueur d'onde très absorbée par la mélanine : c'est une référence pour l'épilation des peaux claires et des poils fins, et pour les lésions pigmentaires. Associée au Nd:YAG 1064 nm, elle permet aussi de traiter en sécurité les peaux mates et foncées, fréquentes au Maroc.",
      "Alexandrite emits at 755 nm, a wavelength strongly absorbed by melanin: a reference for hair removal on light skin and fine hair, and for pigmented lesions. Combined with 1064 nm Nd:YAG, it can also safely treat olive and dark skin, common in Morocco."
    ),
    points: [
      [t("755 nm", "755 nm"), t("Forte absorption par la mélanine : poils fins et clairs, lésions pigmentaires bénignes.", "Strong melanin absorption: fine, light hair, benign pigmented lesions.")],
      [t("Avec le Nd:YAG 1064 nm", "With 1064 nm Nd:YAG"), t("Le 1064 nm pénètre plus profondément et cible l'hémoglobine : peaux foncées, vaisseaux, angiomes.", "1064 nm penetrates deeper and targets haemoglobin: dark skin, vessels, angiomas.")],
    ],
    compare: [
      {
        q: t(`Alexandrite ou Nd:YAG${N}?`, "Alexandrite or Nd:YAG?"),
        a: t(
          "L'Alexandrite 755 nm est la plus efficace sur les peaux claires et les poils fins ; le Nd:YAG 1064 nm est la référence pour les peaux foncées et le vasculaire. Une plateforme double longueur d'onde évite de choisir.",
          "755 nm Alexandrite is the most effective on light skin and fine hair; 1064 nm Nd:YAG is the reference for dark skin and vascular work. A dual-wavelength platform means you don't have to choose."
        ),
      },
      {
        q: t(`Alexandrite ou laser diode${N}?`, "Alexandrite or diode laser?"),
        a: t(
          "L'Alexandrite est plus sélective sur la mélanine, la diode 808 nm plus polyvalente sur les phototypes intermédiaires. Le choix dépend de votre patientèle et des autres actes à proposer (pigmentaire, vasculaire).",
          "Alexandrite is more selective on melanin, 808 nm diode more versatile on intermediate skin types. The choice depends on your patients and the other treatments you offer (pigment, vascular)."
        ),
      },
    ],
    slugs: ["alex-yag-ultra"],
    indications: ["epilation-laser", "taches-pigmentaires", "couperose-lesions-vasculaires"],
  },
  "nd-yag": {
    silo: "laser-esthetique",
    slug: "nd-yag",
    name: t("Laser Nd:YAG", "Nd:YAG laser"),
    title: t("Laser Nd:YAG professionnel au Maroc : Q-switched, 1064 nm", "Professional Nd:YAG lasers in Morocco: Q-switched, 1064 nm"),
    description: t(
      "Lasers Nd:YAG 1064 nm et Q-switched 532/1064/1320 nm : détatouage, taches, Carbon Peel, épilation des peaux foncées, vasculaire. Prix sur demande, démo et SAV au Maroc.",
      "1064 nm and Q-switched 532/1064/1320 nm Nd:YAG lasers: tattoo removal, spots, Carbon Peel, hair removal on dark skin, vascular. Price on request, demos and after-sales in Morocco."
    ),
    h1: t("Lasers Nd:YAG professionnels au Maroc", "Professional Nd:YAG lasers in Morocco"),
    intro: t(
      "Le Nd:YAG est le laser le plus polyvalent en médecine esthétique. En impulsions longues à 1064 nm, il épile les peaux foncées et traite le vasculaire ; en mode Q-switched (impulsions de quelques nanosecondes), il fragmente les pigments et les encres de tatouage, et réalise le Carbon Peel.",
      "Nd:YAG is the most versatile laser in aesthetic medicine. In long pulses at 1064 nm it removes hair on dark skin and treats vessels; in Q-switched mode (pulses of a few nanoseconds) it breaks up pigment and tattoo ink, and performs Carbon Peel."
    ),
    points: [
      [t("1064 nm", "1064 nm"), t("La pénétration la plus profonde et la plus faible absorption par la mélanine : référence pour les peaux foncées.", "The deepest penetration and the lowest melanin absorption: the reference for dark skin.")],
      [t("Q-switched", "Q-switched"), t("Impulsions de quelques nanosecondes : détatouage, taches, naevus, en épargnant les tissus voisins.", "Pulses of a few nanoseconds: tattoo removal, spots, naevi, sparing surrounding tissue.")],
      [t("532 et 1320 nm", "532 and 1320 nm"), t("Le 532 nm cible les pigments superficiels et les couleurs claires, le 1320 nm sert au Carbon Peel.", "532 nm targets superficial pigment and lighter colours, 1320 nm is used for Carbon Peel.")],
    ],
    compare: [
      {
        q: t(`Nd:YAG Q-switched ou picoseconde${N}?`, "Q-switched or picosecond Nd:YAG?"),
        a: t(
          "Les deux fragmentent le pigment par des impulsions ultra-courtes : nanosecondes pour le Q-switched, picosecondes pour le picoseconde. Demandez à un expert CELLULIFT quelle configuration correspond à votre volume de détatouage et de pigmentaire.",
          "Both break up pigment with ultra-short pulses: nanoseconds for Q-switched, picoseconds for picosecond lasers. Ask a CELLULIFT expert which configuration fits your tattoo and pigment volume."
        ),
      },
    ],
    slugs: ["laser-shock", "alex-yag-ultra", "la-queen", "fotokrom", "sevenwaves"],
    indications: ["detatouage", "taches-pigmentaires", "couperose-lesions-vasculaires", "epilation-laser"],
  },
  "co2-fractionne": {
    silo: "laser-esthetique",
    slug: "co2-fractionne",
    name: t("Laser CO2 fractionné", "Fractional CO2 laser"),
    title: t("Laser CO2 fractionné professionnel au Maroc : resurfaçage, cicatrices", "Professional fractional CO2 lasers in Morocco: resurfacing, scars"),
    description: t(
      "Laser CO2 fractionné 10 600 nm pour les rides, les cicatrices d'acné, la texture et la gynécologie. Prix sur demande, démo en agence, formation et SAV au Maroc.",
      "10,600 nm fractional CO2 laser for wrinkles, acne scars, texture and gynaecology. Price on request, branch demos, training and after-sales in Morocco."
    ),
    h1: t("Laser CO2 fractionné professionnel au Maroc", "Professional fractional CO2 lasers in Morocco"),
    intro: t(
      "Le laser CO2 émet à 10 600 nm, une longueur d'onde absorbée par l'eau des tissus. En mode fractionné, il crée des micro-zones d'ablation entourées de peau saine, ce qui stimule fortement le collagène : c'est une référence pour le resurfaçage, les rides et les cicatrices.",
      "The CO2 laser emits at 10,600 nm, a wavelength absorbed by tissue water. In fractional mode it creates micro-zones of ablation surrounded by healthy skin, strongly stimulating collagen: a reference for resurfacing, wrinkles and scars."
    ),
    points: [
      [t("Resurfaçage", "Resurfacing"), t("Rides, ridules, élastose solaire, texture et pores.", "Wrinkles, fine lines, solar elastosis, texture and pores.")],
      [t("Cicatrices", "Scars"), t("Cicatrices d'acné en creux et autres cicatrices.", "Atrophic acne scars and other scars.")],
      [t("Au-delà du visage", "Beyond the face"), t("Verrues, kératoses, xanthélasma, et applications en gynécologie, ORL et proctologie.", "Warts, keratoses, xanthelasma, and applications in gynaecology, ENT and proctology.")],
    ],
    compare: [
      {
        q: t(`Laser CO2 fractionné ou radiofréquence microneedling${N}?`, "Fractional CO2 or RF microneedling?"),
        a: t(
          "Le CO2 fractionné est ablatif : résultats marqués sur les rides et cicatrices, avec quelques jours de récupération. La radiofréquence microneedling est non ablative : moins de suites, souvent préférée sur les peaux mates à risque d'hyperpigmentation. Les deux se complètent.",
          "Fractional CO2 is ablative: marked results on wrinkles and scars, with a few days of recovery. RF microneedling is non-ablative: less downtime, often preferred on olive skin prone to hyperpigmentation. The two complement each other."
        ),
      },
    ],
    slugs: ["frac-cov-4"],
    indications: ["rides-rajeunissement", "acne-cicatrices", "relachement-cutane", "gynecologie-esthetique"],
  },
  ipl: {
    silo: "laser-esthetique",
    slug: "ipl",
    name: t("Lumière pulsée (IPL)", "Intense pulsed light (IPL)"),
    title: t("Appareil IPL professionnel au Maroc : épilation, taches, rajeunissement", "Professional IPL devices in Morocco: hair removal, spots, rejuvenation"),
    description: t(
      "Lumière pulsée IPL / OPT / SHR pour l'épilation, les taches, les rougeurs, l'acné et le rajeunissement. Prix sur demande, démo en agence, formation et SAV au Maroc.",
      "IPL / OPT / SHR pulsed light for hair removal, spots, redness, acne and rejuvenation. Price on request, branch demos, training and after-sales in Morocco."
    ),
    h1: t("Appareils IPL professionnels au Maroc", "Professional IPL devices in Morocco"),
    intro: t(
      "La lumière pulsée intense (IPL) émet un large spectre, filtré selon l'indication. Ce n'est pas un laser, mais elle est très polyvalente : épilation, taches, rougeurs, acné et photorajeunissement. On la trouve seule ou intégrée à des plateformes multi-technologies.",
      "Intense pulsed light (IPL) emits a broad spectrum, filtered by indication. It isn't a laser, but it is very versatile: hair removal, spots, redness, acne and photorejuvenation. It comes on its own or built into multi-technology platforms."
    ),
    points: [
      [t("Filtres", "Filters"), t("Chaque filtre sélectionne une plage de longueurs d'onde adaptée à l'indication.", "Each filter selects a wavelength range suited to the indication.")],
      [t("SHR / OPT", "SHR / OPT"), t("Des modes d'impulsion qui améliorent le confort et la régularité de l'énergie délivrée.", "Pulse modes that improve comfort and the consistency of the energy delivered.")],
    ],
    compare: [
      {
        q: t(`IPL ou laser diode${N}?`, "IPL or diode laser?"),
        a: t(
          "Pour l'épilation à fort volume, le laser diode est plus ciblé. L'IPL est plus polyvalent : il ajoute les taches, les rougeurs, l'acné et le rajeunissement à la même machine.",
          "For high-volume hair removal, the diode laser is more targeted. IPL is more versatile: it adds spots, redness, acne and rejuvenation to the same device."
        ),
      },
    ],
    slugs: ["new-epil-light", "la-queen", "sevenwaves", "fotokrom"],
    indications: ["epilation-laser", "taches-pigmentaires", "couperose-lesions-vasculaires", "acne-cicatrices"],
  },
  endolift: {
    silo: "laser-esthetique",
    slug: "endolift",
    name: t("Endolift", "Endolift"),
    title: t("Laser endolift professionnel au Maroc : lipolyse et remise en tension", "Professional endolift lasers in Morocco: lipolysis and tightening"),
    description: t(
      "Laser endolift 980 et 1470 nm : lipolyse (double menton, bras, corps), remise en tension, endoveineux (EVLT), vasculaire. Prix sur demande, démo, formation et SAV au Maroc.",
      "980 and 1470 nm endolift laser: lipolysis (double chin, arms, body), tightening, endovenous (EVLT), vascular. Price on request, demos, training and after-sales in Morocco."
    ),
    h1: t("Laser endolift professionnel au Maroc", "Professional endolift lasers in Morocco"),
    intro: t(
      "L'endolift utilise une fibre laser très fine introduite sous la peau : l'énergie agit directement sur la graisse et les tissus, sans incision chirurgicale. Les longueurs d'onde 980 et 1470 nm couvrent la lipolyse, la remise en tension et le traitement endoveineux.",
      "Endolift uses a very fine laser fibre introduced under the skin: the energy acts directly on fat and tissue, without a surgical incision. The 980 and 1470 nm wavelengths cover lipolysis, tightening and endovenous treatment."
    ),
    points: [
      [t("Lipolyse", "Lipolysis"), t("Double menton, bras, zones du corps.", "Double chin, arms, body areas.")],
      [t("Endoveineux (EVLT)", "Endovenous (EVLT)"), t("Traitement laser des veines, varicosités et télangiectasies.", "Laser treatment of veins, spider veins and telangiectasia.")],
    ],
    compare: [
      {
        q: t(`Endolift ou HIFU${N}?`, "Endolift or HIFU?"),
        a: t(
          "L'endolift agit de l'intérieur avec une fibre laser, le HIFU agit de l'extérieur par ultrasons focalisés, sans aiguille. Ils répondent à des indications proches (relâchement, graisse localisée) avec des protocoles différents.",
          "Endolift works from the inside with a laser fibre, HIFU from the outside with focused ultrasound, without needles. They address similar indications (laxity, localised fat) with different protocols."
        ),
      },
    ],
    slugs: ["hanover-5g"],
    indications: ["cellulite-graisse-localisee", "couperose-lesions-vasculaires", "relachement-cutane"],
  },
  "radiofrequence-esthetique": {
    silo: "radiofrequence-esthetique",
    name: t("Radiofréquence esthétique", "Aesthetic radiofrequency"),
    title: t("Appareil de radiofréquence esthétique professionnel au Maroc", "Professional aesthetic radiofrequency devices in Morocco"),
    description: t(
      "Radiofréquence esthétique professionnelle au Maroc : raffermissement, remodelage du corps, radiofréquence fractionnée micro-aiguilles, radiofréquence intime. Démo et SAV.",
      "Professional aesthetic radiofrequency in Morocco: firming, body contouring, fractional microneedle RF, intimate RF. Demos and after-sales."
    ),
    h1: t("Appareils de radiofréquence esthétique au Maroc", "Aesthetic radiofrequency devices in Morocco"),
    intro: t(
      "La radiofréquence chauffe le derme de façon contrôlée pour stimuler le collagène : la peau se raffermit et la silhouette se remodèle. On la trouve en machines dédiées au corps, en radiofréquence fractionnée à micro-aiguilles pour le visage, et en radiofréquence intime pour la gynécologie esthétique.",
      "Radiofrequency heats the dermis in a controlled way to stimulate collagen: skin firms up and the silhouette is reshaped. It comes in body-contouring devices, in fractional microneedle RF for the face, and in intimate RF for aesthetic gynaecology."
    ),
    points: [
      [t("Corps", "Body"), t("Associée à la lipocavitation, au vacuum ou au palper-rouler : cellulite, graisse localisée, relâchement.", "Combined with lipocavitation, vacuum or roller massage: cellulite, localised fat, laxity.")],
      [t("Visage", "Face"), t("En fractionné à micro-aiguilles : rides, pores, cicatrices d'acné, vergetures.", "Fractional with microneedles: wrinkles, pores, acne scars, stretch marks.")],
      [t("Zone intime", "Intimate area"), t("Laxité, sécheresse, incontinence légère.", "Laxity, dryness, mild incontinence.")],
    ],
    compare: [
      {
        q: t(`HIFU ou radiofréquence${N}?`, "HIFU or radiofrequency?"),
        a: t(
          "Le HIFU concentre l'énergie en profondeur, en un point précis ; la radiofréquence chauffe le derme de façon plus diffuse et superficielle. Le HIFU est souvent choisi pour un effet lifting, la radiofréquence pour la fermeté et la qualité de peau : ils se combinent bien.",
          "HIFU concentrates energy deep down at a precise point; radiofrequency heats the dermis more diffusely and superficially. HIFU is often chosen for a lifting effect, RF for firmness and skin quality: they combine well."
        ),
      },
      {
        q: t(`Cryolipolyse ou radiofréquence${N}?`, "Cryolipolysis or radiofrequency?"),
        a: t(
          "La cryolipolyse agit par le froid sur la graisse, la radiofréquence par la chaleur sur la graisse et la fermeté de la peau. CELLULIFT propose des solutions de remodelage par radiofréquence, lipocavitation et énergie électromagnétique.",
          "Cryolipolysis works on fat with cold, radiofrequency with heat on fat and skin firmness. CELLULIFT offers body contouring solutions using radiofrequency, lipocavitation and electromagnetic energy."
        ),
      },
    ],
    slugs: ["frequencious", "slimax-lipo-3", "slimax-lipo-7", "longishape", "elitecolombia", "fotokrom", "sevenwaves", "frequentazia"],
    indications: ["relachement-cutane", "cellulite-graisse-localisee", "acne-cicatrices", "gynecologie-esthetique"],
  },
  "radiofrequence-microneedling": {
    silo: "radiofrequence-esthetique",
    slug: "microneedling",
    name: t("Radiofréquence microneedling", "RF microneedling"),
    title: t("Radiofréquence fractionnée microneedling au Maroc : machine pro", "Fractional RF microneedling in Morocco: professional device"),
    description: t(
      "Radiofréquence fractionnée à micro-aiguilles : cicatrices d'acné, pores, rides, vergetures. Prix sur demande, démo en agence, formation et SAV au Maroc.",
      "Fractional microneedle radiofrequency: acne scars, pores, wrinkles, stretch marks. Price on request, branch demos, training and after-sales in Morocco."
    ),
    h1: t("Radiofréquence microneedling professionnelle au Maroc", "Professional RF microneedling in Morocco"),
    intro: t(
      "La radiofréquence microneedling associe des micro-aiguilles et une énergie de radiofréquence délivrée dans le derme. Le remodelage du collagène est puissant, sans ablation de la surface de la peau : c'est une technologie très utilisée pour les cicatrices d'acné, les pores dilatés et les rides.",
      "RF microneedling combines microneedles with radiofrequency energy delivered into the dermis. Collagen remodelling is powerful, without ablating the skin surface: a widely used technology for acne scars, enlarged pores and wrinkles."
    ),
    points: [
      [t("Indications", "Indications"), t("Cicatrices d'acné, pores dilatés, rides du visage, du cou et du décolleté, vergetures.", "Acne scars, enlarged pores, wrinkles of the face, neck and décolleté, stretch marks.")],
      [t("Non ablatif", "Non-ablative"), t("La surface de la peau est préservée, ce qui limite les suites.", "The skin surface is preserved, which limits downtime.")],
    ],
    compare: [
      {
        q: t(`Radiofréquence microneedling ou laser CO2${N}?`, "RF microneedling or CO2 laser?"),
        a: t(
          "La radiofréquence microneedling est non ablative, avec moins de suites, et souvent préférée sur les peaux mates. Le laser CO2 fractionné est ablatif, plus intense sur les rides profondes et les cicatrices marquées. Les deux se complètent.",
          "RF microneedling is non-ablative, with less downtime, and often preferred on olive skin. Fractional CO2 laser is ablative, more intense on deep wrinkles and marked scars. The two complement each other."
        ),
      },
      {
        q: t(`Radiofréquence microneedling ou microneedling simple${N}?`, "RF microneedling or plain microneedling?"),
        a: t(
          "Le microneedling simple crée des micro-perforations qui stimulent le collagène ; la radiofréquence ajoute une chaleur délivrée en profondeur, pour un remodelage plus marqué.",
          "Plain microneedling creates micro-perforations that stimulate collagen; radiofrequency adds heat delivered in depth, for more marked remodelling."
        ),
      },
    ],
    slugs: ["frequencious", "mym-dermapen"],
    indications: ["acne-cicatrices", "rides-rajeunissement"],
  },
};

export const topicKeys = Object.keys(topics) as TopicKey[];
export const topicPath = (k: TopicKey) => {
  const tp = topics[k];
  return tp.slug ? `/${tp.silo}/${tp.slug}` : `/${tp.silo}`;
};
export const siloChildren = (silo: Topic["silo"]) => topicKeys.filter((k) => topics[k].silo === silo && topics[k].slug);
export const topicBySlug = (silo: Topic["silo"], slug: string) => topicKeys.find((k) => topics[k].silo === silo && topics[k].slug === slug);
