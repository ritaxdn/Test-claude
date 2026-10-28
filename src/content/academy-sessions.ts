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

// Inscription à la masterclass Vulva & Vision (formulaire Tally de Cellulift Academy)
const masterclassRegistration = "https://tally.so/r/labEvB?utm_source=cellulift.ma&utm_medium=site&utm_campaign=masterclass_vulva_vision";

export const academySessions: AcademySession[] = [
  {
    start: "2026-11-12",
    date: { fr: "Jeudi 12 novembre 2026", en: "Thursday, November 12, 2026" },
    title: "Masterclass Vulva & Vision : technologie et sensibilité en gynécologie esthétique",
    subtitle: "Dr Dulce Cristina Pereira Henriques (Brésil) · Dr Dadoun · Dr Saheli",
    place: "Kenzi Tower Hotel, Casablanca",
    time: { fr: "De 16h à 21h", en: "4 pm to 9 pm" },
    link: masterclassRegistration,
  },
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
    subtitle: "Dr Dadoun × Dr Kahak",
    link: "https://cal.com/endolifting-jusqu-ou-peut-aller-le-tightening-sans-chirurgie",
  },
];

export const upcomingSessions = () => {
  const today = new Date().toISOString().slice(0, 10);
  return academySessions.filter((s) => s.start >= today).sort((a, b) => a.start.localeCompare(b.start));
};

/**
 * Événement mis en avant (« à la une ») sur l'accueil et la page Academy, jusqu'à sa date.
 * Programme repris du support officiel de la masterclass (PDF, oct. 2026).
 */
export const academyHighlight = {
  start: "2026-11-12",
  kicker: { fr: "Masterclass", en: "Masterclass" },
  title: ["Vulva &", "Vision"],
  subtitle: { fr: "Technologie & sensibilité en gynécologie esthétique", en: "Technology & sensitivity in aesthetic gynaecology" },
  date: { fr: "Jeudi 12 novembre 2026", en: "Thursday, November 12, 2026" },
  time: { fr: "À partir de 16h", en: "From 4 pm" },
  place: "Kenzi Tower Hotel, Casablanca",
  partners: { fr: "Avec LGL Expert et la SMFC (Société Marocaine de Fertilité et de Contraception)", en: "With LGL Expert and the SMFC (Moroccan Society of Fertility and Contraception)" },
  registration: { fr: "Participation sur inscription", en: "Participation by registration" },
  registerUrl: masterclassRegistration,
  speaker: {
    name: "Dr Dulce Cristina Pereira Henriques",
    photo: "/images/academy/dr-dulce-cristina-pereira-henriques.jpg",
    role: { fr: "Gynécologue · Brésil · International Speaker", en: "Gynaecologist · Brazil · International Speaker" },
    expertise: { fr: "Experte en laser gynécologique et gynécologie esthétique", en: "Expert in gynaecological laser and aesthetic gynaecology" },
  },
  programme: [
    { time: "16:00", title: { fr: "Accueil, émargement, badges", en: "Welcome, sign-in, badges" } },
    { time: "16:30", title: { fr: "Ouverture : présentation des intervenants et charte éthique", en: "Opening: speakers and ethics charter" }, by: "CELLULIFT Academy" },
    { time: "16:45", title: { fr: "Innovations & technologies", en: "Innovations & technologies" }, by: "Dr Dadoun Mohamed" },
    { time: "17:00", title: { fr: "Rappels anatomiques", en: "Anatomy refresher" }, detail: { fr: "Anatomie vulvaire et clitoridienne · Structures · Repères chirurgicaux", en: "Vulvar and clitoral anatomy · Structures · Surgical landmarks" }, by: "Dr Brahem Saheli" },
    { time: "17:30", title: { fr: "Intimate zone care / O-Shot / G-Shot", en: "Intimate zone care / O-Shot / G-Shot" }, detail: { fr: "Parcours de soin de la zone intime, rationnel et technique des injections", en: "Intimate care pathway, rationale and injection technique" }, by: "Dr Brahem Saheli" },
    { time: "18:00", title: { fr: "Pause café, échanges avec les intervenants", en: "Coffee break, time with the speakers" }, pause: true },
    { time: "18:30", title: { fr: "Ce que personne ne vous dit sur la labioplastie linéaire", en: "What no one tells you about linear labiaplasty" }, by: "Dr Dulce Cristina" },
    { time: "19:15", title: { fr: "FIT Technology", en: "FIT Technology" }, detail: { fr: "Endolift vaginal : innovations et applications, physique du laser", en: "Vaginal Endolift: innovations and applications, laser physics" }, by: "Dr Dadoun Mohamed" },
    { time: "20:00", title: { fr: "Clitoroplastie vs clitoridectomie", en: "Clitoroplasty vs clitoridectomy" }, detail: { fr: "Les nuances techniques de deux approches aux objectifs distincts", en: "The technical nuances of two approaches with different goals" }, by: "Dr Dulce Cristina" },
    { time: "20:30", title: { fr: "Radiofréquence vaginale & laser CO2", en: "Vaginal radiofrequency & CO2 laser" }, detail: { fr: "Technologie Artemis : choix de la technique selon la patiente", en: "Artemis technology: choosing the technique for each patient" }, by: "Dr Dadoun Mohamed" },
    { time: "21:00", title: { fr: "Clôture & synthèse", en: "Closing & summary" }, pause: true },
  ] as { time: string; title: { fr: string; en: string }; detail?: { fr: string; en: string }; by?: string; pause?: boolean }[],
};

/** L'événement à la une, tant que sa date n'est pas passée */
export const currentHighlight = () => (academyHighlight.start >= new Date().toISOString().slice(0, 10) ? academyHighlight : null);
