import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { savePresenter } from "../actions";
import { SubmitButton } from "@/components/SubmitButton";

export const metadata: Metadata = { title: "Présentateurs" };

export default async function Presentateurs({ searchParams }: { searchParams: Promise<{ info?: string; erreur?: string }> }) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const rows = await sql<{ id: string; name: string; title: string | null; active: boolean; lessons: number }[]>`
    select pr.id, pr.name, pr.title, pr.active, (select count(*)::int from lessons l where l.presenter_id = pr.id) as lessons
      from presenters pr order by pr.active desc, pr.name`;
  return (
    <Shell user={admin} active="/admin/presentateurs">
      <div className="page-head"><div><span className="eyebrow">Contenus</span><h1 className="display h1">Présentateurs</h1></div></div>
      <p className="muted" style={{ maxWidth: 680, marginBottom: 20 }}>Les personnes qui présentent les vidéos. Leur nom (et leur titre, s'il est renseigné) apparaît sous chaque leçon et sur la page du parcours.</p>
      {sp.info && <p className="alert ok" role="status" style={{ marginBottom: 16 }}>{sp.info}</p>}
      {sp.erreur && <p className="alert err" role="alert" style={{ marginBottom: 16 }}>{sp.erreur}</p>}
      <div className="cols">
        <section className="stack" aria-label="Liste des présentateurs">
          {rows.length === 0 && <div className="glass card"><p className="muted">Aucun présentateur. Ajoutez le premier à droite.</p></div>}
          {rows.map((r) => (
            <form key={r.id} action={savePresenter} className="glass card stack" style={{ gap: 10, opacity: r.active ? 1 : 0.7 }}>
              <input type="hidden" name="presenter_id" value={r.id} />
              <div className="row between wrap"><b>{r.name}</b><span className="small muted">{r.lessons} leçon{r.lessons > 1 ? "s" : ""}{r.active ? "" : " · inactif"}</span></div>
              <div className="form-grid">
                <div className="field"><label htmlFor={`n-${r.id}`}>Nom</label><input className="input" id={`n-${r.id}`} name="name" required defaultValue={r.name} /></div>
                <div className="field"><label htmlFor={`t-${r.id}`}>Titre</label><input className="input" id={`t-${r.id}`} name="title" defaultValue={r.title ?? ""} placeholder="À compléter" /></div>
              </div>
              <div className="row between wrap">
                <label className="row small"><input type="checkbox" name="active" defaultChecked={r.active} /> Proposé dans les leçons</label>
                <SubmitButton className="btn sm">Enregistrer</SubmitButton>
              </div>
            </form>
          ))}
        </section>
        <form action={savePresenter} className="glass card stack" style={{ gap: 12 }}>
          <span className="eyebrow">Ajouter</span>
          <div className="field"><label htmlFor="pn">Nom</label><input className="input" id="pn" name="name" required /></div>
          <div className="field"><label htmlFor="pt">Titre</label><input className="input" id="pt" name="title" placeholder="Ex. Formatrice · CELLULIFT Academy" /></div>
          <SubmitButton className="btn solid" pending="Ajout…">Ajouter</SubmitButton>
        </form>
      </div>
    </Shell>
  );
}
