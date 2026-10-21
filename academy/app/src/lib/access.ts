import "server-only";
import { sql } from "./db";

export type ProgramRow = { id: string; slug: string; title: string; summary: string | null; device_name: string | null; lessons: number; done: number; completed: boolean; last_activity: Date | null; presenters: string | null };
export type LessonRow = { lesson_id: string; module_id: string; module_position: number; module_title: string; lesson_position: number; title: string; duration_sec: number | null; video_ref: string | null; seq: number; completed_at: Date | null; position_sec: number; max_position_sec: number; presenter_name: string | null; presenter_title: string | null; unlocked: boolean };

/**
 * Règle d'accès unique : un client (médecin, kiné…) n'a accès qu'aux parcours des machines qu'il a
 * achetées. Le droit est recalculé à chaque requête à partir de ses machines actives : retirer une
 * machine, ou rattacher un parcours à une autre machine, coupe l'accès immédiatement.
 */
const ownsMachineOf = (userId: string) => sql`
  p.published and p.device_model_id is not null
  and exists (select 1 from device_ownerships o
               where o.user_id = ${userId} and o.revoked_at is null and o.device_model_id = p.device_model_id)`;

/** Parcours ouverts à l'utilisateur (machines achetées, parcours publiés), avec la progression. */
export async function myPrograms(userId: string): Promise<ProgramRow[]> {
  return sql<ProgramRow[]>`
    select p.id, p.slug, p.title, p.summary, dm.name as device_name,
           count(pl.lesson_id)::int as lessons,
           count(lp.completed_at)::int as done,
           (count(pl.lesson_id) > 0 and count(lp.completed_at) = count(pl.lesson_id)) as completed,
           max(lp.updated_at) as last_activity,
           string_agg(distinct pl.presenter_name, ', ') as presenters
      from programs p
      left join device_models dm on dm.id = p.device_model_id
      left join program_lessons pl on pl.program_id = p.id
      left join lesson_progress lp on lp.lesson_id = pl.lesson_id and lp.user_id = ${userId}
     where ${ownsMachineOf(userId)}
     group by p.id, dm.name
     order by p.title`;
}

export async function canAccessProgram(userId: string, programId: string): Promise<boolean> {
  const [r] = await sql`select 1 from programs p where p.id = ${programId} and ${ownsMachineOf(userId)}`;
  return !!r;
}

/** Leçons dans l'ordre ; une leçon est ouverte si toutes les précédentes sont terminées. */
export async function programLessons(userId: string, programId: string): Promise<LessonRow[]> {
  const rows = await sql<Omit<LessonRow, "unlocked">[]>`
    select pl.lesson_id, pl.module_id, pl.module_position, pl.module_title, pl.lesson_position, pl.title, pl.duration_sec, pl.video_ref, pl.seq::int,
           lp.completed_at, coalesce(lp.position_sec, 0)::float as position_sec, coalesce(lp.max_position_sec, 0)::float as max_position_sec,
           pl.presenter_name, pl.presenter_title
      from program_lessons pl
      left join lesson_progress lp on lp.lesson_id = pl.lesson_id and lp.user_id = ${userId}
     where pl.program_id = ${programId}
     order by pl.seq`;
  let open = true;
  return rows.map((r) => {
    const row = { ...r, unlocked: open };
    if (!r.completed_at) open = false;
    return row;
  });
}

/** Leçon + parcours, si l'utilisateur y a droit et que la leçon est débloquée. */
export async function lessonForUser(userId: string, lessonId: string) {
  const [l] = await sql<{ program_id: string; slug: string }[]>`
    select p.id as program_id, p.slug from lessons l join modules m on m.id = l.module_id join programs p on p.id = m.program_id where l.id = ${lessonId}`;
  if (!l || !(await canAccessProgram(userId, l.program_id))) return null;
  const lessons = await programLessons(userId, l.program_id);
  const lesson = lessons.find((x) => x.lesson_id === lessonId);
  if (!lesson) return null;
  return { ...l, lesson, lessons };
}
