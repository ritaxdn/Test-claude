// Entrée « Votre préoccupation » : le patient part de ce qu'il ressent, pas du nom d'une technique.
// Chaque préoccupation a sa page : /preoccupations/<slug>.
// Règle : ne relier une préoccupation qu'à des actes réellement pratiqués au cabinet (slugs de site.ts).
// À VALIDER par le Dr Dadoun : textes et correspondances préoccupation → actes.
import { acts } from "@/content/site";

export type Concern = {
  slug: string;
  title: string; // formulation patient
  group: "visage" | "intime";
  short: string; // une ligne, pour la carte
  intro: string; // ce que vit le patient
  assess: string[]; // ce que j'évalue en consultation
  options: { act: string; why: string }[]; // slug d'acte (site.ts) + pourquoi il peut être indiqué
  elsewhere: string; // quand la réponse est ailleurs
};

export const concerns: Concern[] = [
  {
    slug: "cicatrices-acne",
    title: "Cicatrices d'acné",
    group: "visage",
    short: "Creux, marques, relief irrégulier après l'acné.",
    intro:
      "L'acné est finie, mais elle a laissé des marques : petits creux, relief irrégulier, texture que le maquillage ne suffit plus à lisser.",
    assess: [
      "Le type de cicatrices (en creux, en relief, marques pigmentées ou rouges)",
      "Votre type de peau et sa réaction au soleil",
      "L'absence d'acné encore active",
      "Le temps de récupération que vous pouvez accepter",
    ],
    options: [
      { act: "laser-co2", why: "Le resurfaçage retravaille la texture et atténue les cicatrices, séance après séance." },
    ],
    elsewhere:
      "Une acné encore active se traite d'abord. Et certaines marques, rouges ou pigmentées, ne relèvent pas du même traitement que les creux.",
  },
  {
    slug: "relachement-visage",
    title: "Relâchement du visage",
    group: "visage",
    short: "Ovale moins net, bajoues, cou qui se relâche.",
    intro:
      "L'ovale devient moins net, les bajoues apparaissent, le cou perd sa tenue. Le visage paraît fatigué sans que l'on sache vraiment pourquoi.",
    assess: [
      "Le degré de relâchement et la qualité de la peau",
      "La part de relâchement et la part de perte de volume",
      "Les zones concernées : ovale, bajoues, cou",
      "Ce que vous attendez et ce qu'un geste non chirurgical peut réellement apporter",
    ],
    options: [
      { act: "endolifting", why: "Une fibre laser sous la peau stimule la rétraction des tissus pour raffermir l'ovale et le cou." },
      { act: "laser-co2", why: "Lorsque le relâchement est surtout cutané, le resurfaçage améliore la fermeté de la peau." },
      { act: "acide-hyaluronique", why: "Quand le relâchement vient en partie d'une perte de volume, restaurer les appuis redessine l'ovale." },
    ],
    elsewhere:
      "Un relâchement très marqué, avec un excès de peau important, dépasse ce que permettent les techniques non chirurgicales. Je vous le dis alors franchement.",
  },
  {
    slug: "rides-expression",
    title: "Rides d'expression",
    group: "visage",
    short: "Front, rides du lion, pattes d'oie.",
    intro:
      "Rides du front, ride du lion entre les sourcils, pattes d'oie au coin des yeux : elles donnent parfois un air sévère ou fatigué que vous ne ressentez pas.",
    assess: [
      "Les muscles en cause et la dynamique de votre visage",
      "Les rides présentes au repos ou seulement en mouvement",
      "L'expressivité que vous souhaitez conserver",
    ],
    options: [
      { act: "toxine-botulique", why: "Elle détend les muscles responsables des rides d'expression, sans figer le visage." },
      { act: "laser-co2", why: "Pour les ridules fines installées dans la peau, le resurfaçage complète le traitement." },
    ],
    elsewhere:
      "Une ride creusée par une perte de volume ne se corrige pas en détendant un muscle : elle appelle une autre approche.",
  },
  {
    slug: "perte-volume",
    title: "Perte de volume",
    group: "visage",
    short: "Joues, cernes, lèvres, sillons qui se creusent.",
    intro:
      "Avec le temps, le visage perd ses appuis : joues moins pleines, sillons plus marqués, lèvres plus fines. Les traits se creusent.",
    assess: [
      "Les zones où le volume a réellement diminué",
      "Les proportions de votre visage",
      "Le résultat souhaité, pour qu'il reste le vôtre",
    ],
    options: [
      { act: "acide-hyaluronique", why: "Il restaure les volumes et redessine lèvres et ovale, dans le respect des proportions." },
    ],
    elsewhere:
      "Ajouter du volume n'est pas toujours la solution : si le problème est un relâchement de la peau, le traitement est différent.",
  },
  {
    slug: "rougeurs-vaisseaux",
    title: "Rougeurs et petits vaisseaux",
    group: "visage",
    short: "Petits vaisseaux visibles, rougeurs du visage.",
    intro:
      "De petits vaisseaux visibles sur les joues ou le nez, des rougeurs qui persistent : la peau paraît irritée en permanence.",
    assess: [
      "L'origine des rougeurs",
      "L'étendue et la localisation des vaisseaux",
      "Votre type de peau et votre exposition au soleil",
    ],
    options: [
      { act: "diode-vasculaire", why: "Un traitement ciblé des petits vaisseaux visibles et des rougeurs du visage." },
    ],
    elsewhere:
      "Certaines rougeurs relèvent d'une affection de la peau qui se traite d'abord médicalement. Je vous oriente alors en conséquence.",
  },
  {
    slug: "qualite-peau",
    title: "Texture et qualité de peau",
    group: "visage",
    short: "Peau terne, grain irrégulier, ridules.",
    intro:
      "Grain de peau irrégulier, pores visibles, ridules, teint qui a perdu son éclat : la peau paraît moins nette qu'avant.",
    assess: [
      "La qualité de votre peau et ses besoins réels",
      "Votre type de peau et sa réaction au soleil",
      "Le temps de récupération que vous pouvez accepter",
    ],
    options: [
      { act: "laser-co2", why: "Le resurfaçage renouvelle la surface de la peau et améliore texture et ridules." },
    ],
    elsewhere:
      "Une peau terne s'améliore parfois d'abord avec de bons soins quotidiens et une protection solaire. Je vous le dis si c'est le cas.",
  },
  {
    slug: "confort-intime",
    title: "Confort intime",
    group: "intime",
    short: "Sécheresse, relâchement, gêne intime.",
    intro:
      "Sécheresse, sensation de relâchement, gêne au quotidien ou dans l'intimité : des troubles fréquents, dont on parle encore trop peu.",
    assess: [
      "Vos symptômes et leur retentissement",
      "Vos antécédents médicaux et gynécologiques",
      "Les examens nécessaires avant tout soin",
    ],
    options: [
      { act: "laser-gynecologique", why: "Il prend en charge certains troubles intimes, comme la sécheresse ou le relâchement, après bilan médical." },
      { act: "o-shot-g-shot", why: "Des injections de plasma riche en plaquettes, dont l'indication est discutée en consultation." },
    ],
    elsewhere:
      "Certains symptômes nécessitent d'abord un bilan ou un traitement gynécologique classique. La consultation sert aussi à le vérifier.",
  },
  {
    slug: "apparence-intime",
    title: "Apparence de la zone intime",
    group: "intime",
    short: "Pigmentation, volume, petites lèvres.",
    intro:
      "Pigmentation de la zone intime, perte de volume des grandes lèvres, petites lèvres qui gênent : une préoccupation personnelle, qui mérite d'être abordée sans tabou.",
    assess: [
      "Ce qui vous gêne réellement, esthétiquement ou fonctionnellement",
      "L'anatomie et la qualité des tissus",
      "Vos attentes, avec un temps de réflexion avant toute décision",
    ],
    options: [
      { act: "eclaircissement-intime", why: "Il atténue les hyperpigmentations de la zone intime." },
      { act: "comblement-des-grandes-levres", why: "L'acide hyaluronique restaure le volume des grandes lèvres, avec un résultat discret." },
      { act: "nymphoplastie", why: "La réduction des petites lèvres, après une consultation approfondie." },
    ],
    elsewhere:
      "Une anatomie normale n'appelle pas toujours un geste. Si un acte ne vous apporterait rien, je vous le dis.",
  },
];

export const getConcern = (slug: string) => concerns.find((c) => c.slug === slug);

/** Actes liés à une préoccupation (ignore un slug qui ne correspondrait à aucun acte). */
export const concernActs = (c: Concern) =>
  c.options.flatMap((o) => {
    const act = acts.find((a) => a.slug === o.act);
    return act ? [{ ...act, why: o.why }] : [];
  });

/** Préoccupations dans lesquelles un acte est proposé (pour les liens depuis la page de l'acte). */
export const concernsForAct = (slug: string) => concerns.filter((c) => c.options.some((o) => o.act === slug));
