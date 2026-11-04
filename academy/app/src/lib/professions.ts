// Professions (codes stables en base, libellés affichés). La liste des professions AUTORISÉES
// est fixée formation par formation par Cellulift (programs.eligible_professions).
export const PROFESSIONS: [code: string, label: string][] = [
  ["medecin_esthetique", "Médecin esthétique"],
  ["dermatologue", "Dermatologue"],
  ["gynecologue", "Gynécologue"],
  ["chirurgien_plasticien", "Chirurgien plasticien"],
  ["chirurgien_autre", "Chirurgien (autre spécialité)"],
  ["medecin_generaliste", "Médecin généraliste"],
  ["kinesitherapeute", "Kinésithérapeute / physiothérapeute"],
  ["autre_sante", "Autre profession de santé"],
  ["centre_institut", "Centre / institut"],
];
export const professionLabel = (code: string | null | undefined) => PROFESSIONS.find(([c]) => c === code)?.[1] ?? code ?? "—";
export const isProfession = (code: string) => PROFESSIONS.some(([c]) => c === code);

// Pays proposés au formulaire (le pays fixe la devise : Maroc → MAD, sinon EUR, ou USD hors zone euro).
export const COUNTRIES: [code: string, label: string][] = [
  ["MA", "Maroc"], ["FR", "France"], ["BE", "Belgique"], ["CH", "Suisse"], ["SN", "Sénégal"], ["CI", "Côte d'Ivoire"],
  ["TN", "Tunisie"], ["DZ", "Algérie"], ["CA", "Canada"], ["AE", "Émirats arabes unis"], ["US", "États-Unis"], ["XX", "Autre pays"],
];
const EURO = ["FR", "BE", "DE", "ES", "IT", "PT", "NL", "LU", "IE", "AT", "FI", "GR"];
export type Currency = "MAD" | "EUR" | "USD";
export const currencyFor = (country: string): Currency => (country === "MA" ? "MAD" : EURO.includes(country) || country === "CH" ? "EUR" : "USD");
export const fmtPrice = (amount: number | string | null | undefined, currency: Currency) =>
  amount == null ? null : `${Number(amount).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency === "MAD" ? "MAD" : currency === "EUR" ? "€" : "$"}`;
