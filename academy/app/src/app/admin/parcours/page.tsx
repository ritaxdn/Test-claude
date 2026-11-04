import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { createProgram } from "../actions";

export const metadata: Metadata = { title: "Parcours" };

export default async function Parcours({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const admin = await requireAdmin();
  const { erreur } = await searchParams;
  const programs = await sql<{ id: string; slug: string; title: string; published: boolean; kind: string; listed: boolean; device: string | null; lessons: number; learners: number }[]>`
    select p.id, p.slug, p.title, p.published, p.kind, p.listed, dm.name as device,
           (select count(*)::int from program_lessons pl where pl.program_id = p.id) as lessons,
           case when p.kind = 'training' then (select count(distinct g.user_id)::int from access_grants g where g.program_id = p.id and g.revoked_at is null and (g.expires_at is null or g.expires_at > now())) else (select count(distinct o.user_id)::int from device_ownerships o where o.device_model_id = p.device_model_id and o.revoked_at is null) end as learners
      from programs p left join device_models dm on dm.id = p.device_model_id order by p.title`;
  const models = await sql<{ id: string; name: string }[]>`select id, name from device_models order by name`;
  return (
    <Shell user={admin} active="/admin/parcours">
      <div className="page-head"><div><span className="eyebrow">Contenus</span><h1 className="display h1">Parcours</h1></div></div>
      {erreur && <p className="alert err" role="alert" style={{ marginBottom: 16 }}>{erreur}</p>}
      <div className="cols">
        <section className="glass" style={{ padding: 0 }}>
          <div className="table-wrap"><table className="t">
            <thead><tr><th>Parcours</th><th>Machine / type</th><th>Leçons</th><th>Inscrits</th><th>Statut</th></tr></thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id}><td><a href={`/admin/parcours/${p.id}`}><b>{p.title}</b></a><div className="mono">/{p.slug}</div></td><td className="small">{p.kind === "training" ? <span className="badge rb">Formation{p.listed ? " · au catalogue" : ""}</span> : p.device ?? "—"}</td><td>{p.lessons}</td><td>{p.learners}</td>
                  <td>{p.published ? <span className="badge ok">Publié</span> : <span className="badge lock">Brouillon</span>}</td></tr>
              ))}
              {programs.length === 0 && <tr><td colSpan={5} className="muted">Aucun parcours. Créez le premier à droite.</td></tr>}
            </tbody>
          </table></div>
        </section>
        <form action={createProgram} className="glass card stack" style={{ gap: 12 }}>
          <span className="eyebrow">Nouveau parcours</span>
          <div className="field"><label htmlFor="title">Titre</label><input className="input" id="title" name="title" required placeholder="HANOVER 5G — Programme opérateur" /></div>
          <div className="field"><label htmlFor="slug">Adresse</label><input className="input" id="slug" name="slug" required placeholder="hanover-5g" /><span className="hint">Lettres, chiffres et tirets.</span></div>
          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}><legend className="small" style={{ marginBottom: 6 }}>Type</legend>
            <label className="row small"><input type="radio" name="kind" value="technology" defaultChecked /> Technologie (ouvert aux clients de la machine)</label>
            <label className="row small"><input type="radio" name="kind" value="training" /> Formation (catalogue, accès acheté ou offert)</label></fieldset>
          <div className="field"><label htmlFor="dm">Machine (technologie seulement)</label><select className="input" id="dm" name="device_model_id" defaultValue=""><option value="">Aucune (parcours fermé à tous les clients)</option>{models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
          <div className="field"><label htmlFor="summary">Résumé</label><textarea className="input" id="summary" name="summary" /></div>
          <button className="btn solid" type="submit">Créer</button>
        </form>
      </div>
    </Shell>
  );
}
