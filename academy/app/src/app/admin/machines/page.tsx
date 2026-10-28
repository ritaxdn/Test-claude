import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { createDeviceModel } from "../actions";

export const metadata: Metadata = { title: "Machines" };

export default async function Machines({ searchParams }: { searchParams: Promise<{ info?: string; erreur?: string }> }) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const rows = await sql<{ id: string; name: string; family: string | null; owners: number; programs: string | null }[]>`
    select dm.id, dm.name, dm.family,
           (select count(distinct o.user_id)::int from device_ownerships o where o.device_model_id = dm.id and o.revoked_at is null) as owners,
           (select string_agg(p.title, ', ') from programs p where p.device_model_id = dm.id) as programs
      from device_models dm order by dm.name`;
  return (
    <Shell user={admin} active="/admin/machines">
      <div className="page-head"><div><span className="eyebrow">Catalogue</span><h1 className="display h1">Machines</h1></div></div>
      {sp.info && <p className="alert ok" role="status" style={{ marginBottom: 16 }}>{sp.info}</p>}
      {sp.erreur && <p className="alert err" role="alert" style={{ marginBottom: 16 }}>{sp.erreur}</p>}
      <div className="cols">
        <section className="glass" style={{ padding: 0 }}><div className="table-wrap"><table className="t">
          <thead><tr><th>Machine</th><th>Famille</th><th>Médecins équipés</th><th>Parcours</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.id}><td><b>{r.name}</b></td><td className="small">{r.family ?? "—"}</td><td>{r.owners}</td><td className="small">{r.programs ?? <span className="badge warn">Aucun parcours</span>}</td></tr>)}</tbody>
        </table></div></section>
        <form action={createDeviceModel} className="glass card stack" style={{ gap: 12 }}>
          <span className="eyebrow">Ajouter une machine</span>
          <div className="field"><label htmlFor="n">Nom</label><input className="input" id="n" name="name" required placeholder="HANOVER 5G" /></div>
          <div className="field"><label htmlFor="f">Famille</label><input className="input" id="f" name="family" placeholder="Lasers" /></div>
          <button className="btn solid" type="submit">Ajouter</button>
        </form>
      </div>
    </Shell>
  );
}
