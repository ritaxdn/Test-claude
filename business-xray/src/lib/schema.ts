import { z } from "zod";

/**
 * Une affirmation du rapport. Chaque affirmation dit si elle est un fait sourcé,
 * une estimation ou une hypothèse, et quelles sources (numérotées) l'appuient.
 */
export const ClaimSchema = z.object({
  text: z.string().describe("L'affirmation, en une ou deux phrases."),
  kind: z
    .enum(["fait", "estimation", "hypothese"])
    .describe(
      "fait = affirmé par au moins une source ; estimation = chiffre déduit ou approximé à partir des sources ; hypothese = inférence non vérifiée.",
    ),
  confidence: z.enum(["haute", "moyenne", "faible"]),
  sources: z
    .array(z.number().int())
    .describe("Numéros des sources du dossier qui appuient l'affirmation. Vide pour une hypothèse sans appui direct."),
});

export const CompetitorSchema = z.object({
  name: z.string(),
  website: z.string().describe("Domaine ou URL, ou chaîne vide si inconnu."),
  type: z.enum(["direct", "indirect", "substitut"]),
  positioning: z.string().describe("Positionnement en une phrase."),
  edgeOverCompany: z.string().describe("Ce que ce concurrent fait mieux que l'entreprise analysée."),
  weaknessVsCompany: z.string().describe("Là où l'entreprise analysée a l'avantage."),
  sources: z.array(z.number().int()),
});

export const OpportunitySchema = z.object({
  title: z.string(),
  description: z.string().describe("Ce qu'il faudrait faire, concrètement."),
  rationale: z.string().describe("Pourquoi c'est une opportunité, en s'appuyant sur le dossier."),
  impact: z.enum(["fort", "moyen", "faible"]),
  effort: z.enum(["fort", "moyen", "faible"]),
  horizon: z.enum(["court terme", "moyen terme", "long terme"]),
  sources: z.array(z.number().int()),
});

export const HypothesisSchema = z.object({
  statement: z.string(),
  rationale: z.string().describe("Sur quels indices repose l'hypothèse."),
  howToVerify: z.string().describe("Comment la confirmer ou l'infirmer (donnée, entretien, test)."),
  confidence: z.enum(["haute", "moyenne", "faible"]),
  sources: z.array(z.number().int()),
});

export const ReportSchema = z.object({
  company: z.object({
    name: z.string(),
    website: z.string(),
    sector: z.string(),
    headquarters: z.string().describe("Siège, ou « Inconnu »."),
    founded: z.string().describe("Année de création, ou « Inconnu »."),
    size: z.string().describe("Effectif, chiffre d'affaires ou levées connues, ou « Inconnu »."),
  }),
  summary: z.string().describe("Synthèse en 3 à 5 phrases : ce que fait l'entreprise, comment elle gagne de l'argent, où elle se situe."),
  businessModel: z.object({
    customerSegments: z.array(ClaimSchema),
    revenueStreams: z.array(ClaimSchema),
    pricing: z.array(ClaimSchema),
    channels: z.array(ClaimSchema),
    costStructure: z.array(ClaimSchema),
    keyResources: z.array(ClaimSchema),
    keyPartners: z.array(ClaimSchema),
  }),
  valueProposition: z.object({
    statement: z.string().describe("La proposition de valeur en une phrase."),
    painsRelieved: z.array(ClaimSchema),
    gainsCreated: z.array(ClaimSchema),
    differentiators: z.array(ClaimSchema),
  }),
  competitors: z.array(CompetitorSchema),
  swot: z.object({
    strengths: z.array(ClaimSchema),
    weaknesses: z.array(ClaimSchema),
    opportunities: z.array(ClaimSchema),
    threats: z.array(ClaimSchema),
  }),
  opportunities: z.array(OpportunitySchema),
  hypotheses: z.array(HypothesisSchema),
  openQuestions: z.array(z.string()).describe("Ce que le dossier ne permet pas de savoir."),
});

export type Claim = z.infer<typeof ClaimSchema>;
export type Competitor = z.infer<typeof CompetitorSchema>;
export type Opportunity = z.infer<typeof OpportunitySchema>;
export type Hypothesis = z.infer<typeof HypothesisSchema>;
export type Report = z.infer<typeof ReportSchema>;

export type Source = { id: number; url: string; title: string; cited: boolean };

/** Événements envoyés par /api/analyze, un objet JSON par ligne. */
export type StreamEvent =
  | { type: "status"; message: string }
  | { type: "search"; query: string }
  | { type: "fetch"; url: string }
  | { type: "notes"; text: string }
  | { type: "report"; report: Report; sources: Source[] }
  | { type: "error"; message: string };
