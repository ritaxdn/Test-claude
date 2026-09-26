// Prochaines formations Cellulift Academy (mêmes sessions que le site du Dr Dadoun, inscriptions Cal.com).
// Une session passée disparaît automatiquement. Champs vides = non affichés.

export type AcademySession = {
  start: string; // AAAA-MM-JJ
  date: { fr: string; en: string };
  title: string;
  subtitle?: string; // intervenant(s), organisateur
  place?: string;
  time?: { fr: string; en: string };
  seats?: number;
  status?: "open" | "full";
  link?: string; // lien d'inscription Cal.com
};

export const academyCalendarUrl = "https://cal.com/celluliftacademy";

export const academySessions: AcademySession[] = [
  {
    start: "2026-10-03",
    date: { fr: "Samedi 3 octobre 2026", en: "Saturday, October 3, 2026" },
    title: "Biofiller vs Acide hyaluronique : volumisation ou régénération tissulaire ?",
    place: "Cellulift, Casablanca",
    time: { fr: "À partir de 14h", en: "From 2 pm" },
    seats: 20,
    link: "https://cal.com/biofiller-vs-acide-hyaluronique-volumisation-ou-regeneration-tissulaire",
  },
  {
    start: "2026-10-10",
    date: { fr: "Samedi 10 octobre 2026", en: "Saturday, October 10, 2026" },
    title: "Endolifting : jusqu'où peut aller le tightening sans chirurgie ?",
    subtitle: "Dr Kahak × Dr Dadoun",
    link: "https://cal.com/endolifting-jusqu-ou-peut-aller-le-tightening-sans-chirurgie",
  },
  {
    start: "2026-10-26",
    date: { fr: "Lundi 26 octobre 2026", en: "Monday, October 26, 2026" },
    title: "Technologie, pricing & protocoles : les 3 leviers d'un centre de bien-être performant",
    subtitle: "Masterclass Excellia Academy · Pourquoi certaines technologies deviennent rentables… et d'autres restent inutilisées ?",
  },
  {
    start: "2026-11-07",
    date: { fr: "Samedi 7 novembre 2026", en: "Saturday, November 7, 2026" },
    title: "Laser × médecine régénérative : l'énergie peut-elle potentialiser la biostimulation ?",
    subtitle: "Dr Dadoun",
    place: "Marrakech",
    link: "https://cal.com/laser-medecine-regenerative-l-energie-peut-elle-potentialiser-la-biostimulation",
  },
];

export const upcomingSessions = () => {
  const today = new Date().toISOString().slice(0, 10);
  return academySessions.filter((s) => s.start >= today).sort((a, b) => a.start.localeCompare(b.start));
};
