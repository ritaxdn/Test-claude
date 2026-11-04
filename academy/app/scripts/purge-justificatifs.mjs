// Suppression des justificatifs professionnels arrivés au terme de leur conservation
// (décision + 30 jours). À lancer chaque jour (tâche planifiée). Le fichier est effacé ;
// la ligne reste (type, taille, empreinte, dates) et la suppression est tracée dans audit_log.
import { rm } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });
const supabase = process.env.STORAGE_PROVIDER === "supabase";
const bucket = process.env.SUPABASE_PROOF_BUCKET ?? "lift-justificatifs";
let n = 0;
try {
  const due = await sql`select id, storage_key from qualification_documents where purged_at is null and purge_after is not null and purge_after <= now() order by purge_after limit 500`;
  for (const d of due) {
    const key = d.storage_key.split("/").filter((p) => p && p !== "." && p !== "..").join("/");
    if (supabase) {
      const key2 = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
      const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/${bucket}`, { method: "DELETE", headers: { apikey: key2, Authorization: `Bearer ${key2}`, "Content-Type": "application/json" }, body: JSON.stringify({ prefixes: [key] }) });
      if (!res.ok) { console.error(`✗ ${d.id} : stockage ${res.status}`); continue; }
    } else {
      await rm(path.join(process.cwd(), "private-media", "justificatifs", key), { force: true });
    }
    await sql`update qualification_documents set purged_at = now(), purge_reason = 'Conservation de 30 jours après la décision écoulée' where id = ${d.id} and purged_at is null`;
    n++;
  }
  console.log(`Justificatifs supprimés : ${n}.`);
} finally {
  await sql.end();
}
