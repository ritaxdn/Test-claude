import { z } from "zod";
import { AVAILABILITY, COMMITMENT, INDUSTRIES, NEEDED_ROLES, ROLES, STAGES, VISIBILITY, values } from "@/lib/constants";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep it under ${max} characters.`)
    .transform((v) => (v === "" ? null : v))
    .nullable();

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

export const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Tell us your name.").max(80),
  headline: optionalText(120),
  bio: optionalText(1000),
  location: optionalText(80),
  roles: z.array(z.enum(values(ROLES))).min(1, "Pick at least one role.").transform(uniq),
  interests: z.array(z.enum(values(INDUSTRIES))).max(12).transform(uniq),
  skills: z
    .array(z.string().trim().min(1).max(40))
    .max(20, "Up to 20 skills.")
    .transform(uniq),
  availability: z.enum(values(AVAILABILITY), { message: "Choose your availability." }),
  commitment: z.enum(values(COMMITMENT), { message: "Choose your commitment level." }),
});

export const projectSchema = z.object({
  title: z.string().trim().min(3, "At least 3 characters.").max(80),
  tagline: optionalText(140),
  problem: z.string().trim().min(10, "Describe the problem in a sentence or two.").max(2000),
  solution: z.string().trim().min(10, "Describe your solution in a sentence or two.").max(2000),
  industry: z.enum(values(INDUSTRIES), { message: "Choose a sector." }),
  stage: z.enum(values(STAGES), { message: "Choose a stage." }),
  roles_needed: z
    .array(z.enum(values(NEEDED_ROLES)))
    .min(1, "Pick at least one role you're looking for.")
    .max(10)
    .transform(uniq),
  traction: optionalText(1000),
  location: optionalText(80),
  visibility: z.enum(values(VISIBILITY)),
});

export const uuid = z.string().uuid();

export const noteSchema = optionalText(500);
export const messageSchema = z.string().trim().min(1, "Write a message.").max(2000, "Messages are limited to 2000 characters.");

/** Turn FormData into a plain object, collecting repeated keys into arrays. */
export function formToObject(fd: FormData, arrayKeys: string[]) {
  const out: Record<string, unknown> = {};
  for (const key of new Set(fd.keys())) {
    out[key] = arrayKeys.includes(key) ? fd.getAll(key).map(String) : String(fd.get(key) ?? "");
  }
  for (const k of arrayKeys) if (!(k in out)) out[k] = [];
  return out;
}
