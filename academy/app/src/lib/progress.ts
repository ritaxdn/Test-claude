import "server-only";
import { sql } from "./db";

/**
 * Enregistre un battement du lecteur. Le « plus loin regardé » n'avance pas plus vite que le temps
 * réellement écoulé (× 1,25 + 5 s de marge) : sauter à la fin de la vidéo ne valide pas la leçon.
 * La leçon est terminée quand 90 % de la durée a été regardée.
 */
export async function recordBeat(userId: string, lessonId: string, duration: number, position: number) {
  position = Math.max(0, Math.min(Number.isFinite(position) ? position : 0, duration));
  const [prev] = await sql<{ max_position_sec: number; last_beat_at: Date | null; completed_at: Date | null }[]>`
    select max_position_sec::float, last_beat_at, completed_at from lesson_progress where user_id = ${userId} and lesson_id = ${lessonId}`;
  const prevMax = prev?.max_position_sec ?? 0;
  const elapsed = prev?.last_beat_at ? (Date.now() - new Date(prev.last_beat_at).getTime()) / 1000 : 0;
  const allowed = prevMax + Math.min(elapsed, 120) * 1.25 + 5;
  const newMax = Math.max(prevMax, Math.min(position, allowed));
  const done = !!prev?.completed_at || newMax >= duration * 0.9;
  const [row] = await sql<{ completed_at: Date | null; max_position_sec: number }[]>`
    insert into lesson_progress (user_id, lesson_id, position_sec, max_position_sec, last_beat_at, completed_at, updated_at)
    values (${userId}, ${lessonId}, ${position}, ${newMax}, now(), ${done ? new Date() : null}, now())
    on conflict (user_id, lesson_id) do update set
      position_sec = excluded.position_sec,
      max_position_sec = greatest(lesson_progress.max_position_sec, excluded.max_position_sec),
      last_beat_at = now(),
      completed_at = coalesce(lesson_progress.completed_at, excluded.completed_at),
      updated_at = now()
    returning completed_at, max_position_sec::float`;
  return { completed: !!row.completed_at, maxPosition: row.max_position_sec };
}
