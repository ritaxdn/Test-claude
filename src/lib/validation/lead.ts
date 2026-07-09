import { z } from "zod";

export const leadIntents = [
  "devis",
  "demo",
  "rappel",
  "brochure",
  "roi",
  "contact",
] as const;

export type LeadIntent = (typeof leadIntents)[number];

export const budgetRanges = [
  "Moins de 10 000 €",
  "10 000 € - 30 000 €",
  "30 000 € - 60 000 €",
  "Plus de 60 000 €",
  "Je ne sais pas encore",
] as const;

export const professions = [
  "Médecin esthétique",
  "Dermatologue",
  "Chirurgien(ne) plasticien(ne)",
  "Kinésithérapeute / physiothérapeute",
  "Gérant(e) d'institut",
  "Pharmacien(ne)",
  "Responsable achats (hôpital/clinique)",
  "Autre",
] as const;

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Merci d'indiquer votre nom complet."),
  company: z.string().trim().optional(),
  country: z.string().trim().min(1, "Merci de sélectionner votre pays."),
  profession: z.string().trim().min(1, "Merci de sélectionner votre profession."),
  phone: z.string().trim().min(6, "Merci d'indiquer un numéro de téléphone valide."),
  email: z.string().trim().email("Merci d'indiquer un email valide."),
  establishmentType: z.string().trim().min(1, "Merci de sélectionner votre type d'établissement."),
  interestedProduct: z.string().trim().optional(),
  budget: z.string().trim().optional(),
  message: z.string().trim().optional(),
  intent: z.enum(leadIntents),
  sourcePage: z.string().trim().optional(),
  consent: z.literal(true, {
    error: "Merci d'accepter d'être recontacté pour envoyer votre demande.",
  }),
});

export type LeadPayload = z.infer<typeof leadSchema>;

export const leadStepOneFields = [
  "fullName",
  "phone",
  "email",
  "country",
] as const;
