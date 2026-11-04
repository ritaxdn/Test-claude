import "server-only";
import { sql } from "./db";

/** Ce qu'un visiteur (non connecté) peut voir d'une formation : jamais le contenu des leçons. */
export type CatalogItem = {
  id: string; slug: string; title: string; tagline: string | null; summary: string | null; audience: string | null; prerequisites: string | null;
  objectives: string[]; eligible_professions: string[]; access_months: number | null;
  price_mad: string | null; price_eur: string | null; price_usd: string | null;
  lessons: number; duration_sec: number; presenters: { name: string; title: string | null }[];
};

const base = (where: ReturnType<typeof sql>) => sql<CatalogItem[]>`
  select p.id, p.slug, p.title, p.tagline, p.summary, p.audience, p.prerequisites, p.objectives, p.eligible_professions, p.access_months,
         p.price_mad, p.price_eur, p.price_usd,
         count(pl.lesson_id)::int as lessons, coalesce(sum(pl.duration_sec), 0)::int as duration_sec,
         coalesce((select json_agg(distinct jsonb_build_object('name', pr.name, 'title', pr.title))
                     from program_lessons x join lessons l on l.id = x.lesson_id join presenters pr on pr.id = l.presenter_id
                    where x.program_id = p.id), '[]') as presenters
    from programs p left join program_lessons pl on pl.program_id = p.id
   where p.kind = 'training' and p.published and p.listed ${where}
   group by p.id order by p.title`;

export const catalog = () => base(sql``);
export async function catalogItem(slug: string): Promise<CatalogItem | null> {
  const [p] = await base(sql`and p.slug = ${slug}`);
  return p ?? null;
}

/** Programme public : titres des modules et des leçons, durées. */
export function syllabus(programId: string) {
  return sql<{ module_position: number; module_title: string; title: string; duration_sec: number | null }[]>`
    select module_position, module_title, title, duration_sec from program_lessons where program_id = ${programId} order by seq`;
}

export const fmtDuration = (sec: number) => {
  if (!sec) return null;
  if (sec < 60) return "< 1 min";
  const m = Math.round(sec / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`;
};
