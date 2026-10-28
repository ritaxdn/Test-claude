import postgres from "postgres";

// Un seul client par processus (le serveur de dev recharge les modules : on le garde sur globalThis).
const g = globalThis as unknown as { __academySql?: postgres.Sql };

export const sql: postgres.Sql =
  g.__academySql ??
  postgres(process.env.DATABASE_URL ?? "", {
    max: 5,
    idle_timeout: 20,
    prepare: false, // compatible avec le pooler Supabase (mode transaction)
    transform: { undefined: null },
  });

if (process.env.NODE_ENV !== "production") g.__academySql = sql;

export async function audit(actorId: string | null, action: string, target: string, details?: Record<string, unknown>) {
  await sql`insert into audit_log (actor_id, action, target, details) values (${actorId}, ${action}, ${target}, ${details ? sql.json(details as postgres.JSONValue) : null})`;
}
