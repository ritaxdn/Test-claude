// Single source of truth for the value lists enforced by CHECK constraints in
// supabase/migrations. Keep both in sync.

export const ROLES = [
  { value: "founder", label: "Founder", hint: "Leading a venture or idea" },
  { value: "builder", label: "Builder", hint: "Engineer, designer, operator" },
  { value: "investor", label: "Investor", hint: "Angel, scout or fund" },
] as const;

export const INDUSTRIES = [
  { value: "ai_ml", label: "AI / ML" },
  { value: "climate", label: "Climate" },
  { value: "consumer", label: "Consumer" },
  { value: "devtools", label: "Dev tools" },
  { value: "edtech", label: "Edtech" },
  { value: "fintech", label: "Fintech" },
  { value: "healthtech", label: "Health" },
  { value: "hardware", label: "Hardware" },
  { value: "marketplaces", label: "Marketplaces" },
  { value: "saas", label: "B2B SaaS" },
  { value: "social_impact", label: "Social impact" },
  { value: "other", label: "Other" },
] as const;

export const STAGES = [
  { value: "idea", label: "Idea" },
  { value: "prototype", label: "Prototype" },
  { value: "mvp", label: "MVP" },
  { value: "early_revenue", label: "Early revenue" },
  { value: "scaling", label: "Scaling" },
] as const;

export const NEEDED_ROLES = [
  { value: "technical_cofounder", label: "Technical co-founder" },
  { value: "business_cofounder", label: "Business co-founder" },
  { value: "engineer", label: "Engineer" },
  { value: "designer", label: "Designer" },
  { value: "product", label: "Product" },
  { value: "growth", label: "Growth & marketing" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  { value: "advisor", label: "Advisor" },
  { value: "investor", label: "Investor" },
] as const;

export const AVAILABILITY = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "evenings_weekends", label: "Evenings & weekends" },
  { value: "advisory", label: "Advisory only" },
] as const;

export const COMMITMENT = [
  { value: "exploring", label: "Exploring", hint: "Open to conversations" },
  { value: "side_project", label: "Serious side project", hint: "Ready to commit real hours" },
  { value: "all_in", label: "All in", hint: "Ready to go full-time" },
] as const;

export const VISIBILITY = [
  { value: "public", label: "Public", hint: "Listed in Discover for everyone on MESH" },
  { value: "private", label: "Private", hint: "Only you and accepted matches can see it" },
] as const;

export const SKILL_SUGGESTIONS = [
  "Full-stack", "Frontend", "Backend", "Mobile", "ML", "Data", "DevOps", "Product design",
  "Brand", "Product management", "Growth", "Sales", "Fundraising", "Finance", "Operations",
  "Hardware", "Research", "Community", "Legal ops", "Go-to-market",
];

type Option = { readonly value: string; readonly label: string };
export const values = <T extends readonly Option[]>(opts: T) =>
  opts.map((o) => o.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

export function labelOf(opts: readonly Option[], value: string | null | undefined) {
  return opts.find((o) => o.value === value)?.label ?? value ?? "";
}
