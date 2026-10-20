import "server-only";
import { sql } from "./db";

export type DoctorRow = {
  user_id: string; full_name: string; email: string; status: string; clinic: string | null; city: string | null; created_at: Date; activated_at: Date | null;
  machines: string | null; program_id: string | null; program_title: string | null; lessons: number; done: number; last_activity: Date | null; finished_at: Date | null;
};

/** Une ligne par médecin × parcours assigné (ou une ligne sans parcours). */
export async function doctorRows(userId?: string): Promise<DoctorRow[]> {
  return sql<DoctorRow[]>`
    with m as (
      select o.user_id, string_agg(dm.name || coalesce(' · ' || o.serial_number, ''), ', ' order by o.created_at) as machines
        from device_ownerships o join device_models dm on dm.id = o.device_model_id where o.revoked_at is null group by o.user_id
    ), e as (
      select distinct e.user_id, e.program_id from entitlements e where e.revoked_at is null
    ), prog as (
      select e.user_id, e.program_id, count(pl.lesson_id)::int as lessons, count(lp.completed_at)::int as done,
             max(lp.updated_at) as last_activity,
             case when count(pl.lesson_id) > 0 and count(lp.completed_at) = count(pl.lesson_id) then max(lp.completed_at) end as finished_at
        from e join program_lessons pl on pl.program_id = e.program_id
        left join lesson_progress lp on lp.lesson_id = pl.lesson_id and lp.user_id = e.user_id
       group by e.user_id, e.program_id
    )
    select u.id as user_id, u.full_name, u.email, u.status, u.clinic, u.city, u.created_at, u.activated_at, m.machines,
           p.id as program_id, p.title as program_title, coalesce(prog.lessons, 0) as lessons, coalesce(prog.done, 0) as done, prog.last_activity, prog.finished_at
      from users u
      left join m on m.user_id = u.id
      left join e on e.user_id = u.id
      left join programs p on p.id = e.program_id
      left join prog on prog.user_id = u.id and prog.program_id = e.program_id
     where u.role = 'doctor' ${userId ? sql`and u.id = ${userId}` : sql``}
     order by u.full_name, p.title`;
}

export function trainingStatus(r: Pick<DoctorRow, "status" | "program_id" | "lessons" | "done">): { label: string; cls: string; key: string } {
  if (r.status === "disabled") return { label: "Accès désactivé", cls: "lock", key: "desactive" };
  if (r.status === "invited") return { label: "Invitation en attente", cls: "warn", key: "invite" };
  if (!r.program_id) return { label: "Aucun parcours", cls: "lock", key: "aucun" };
  if (r.lessons > 0 && r.done === r.lessons) return { label: "Terminée", cls: "ok", key: "terminee" };
  if (r.done > 0) return { label: "En cours", cls: "", key: "en_cours" };
  return { label: "Non commencée", cls: "warn", key: "non_commencee" };
}
