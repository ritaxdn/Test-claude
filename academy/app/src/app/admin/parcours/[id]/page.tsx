import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { SubmitButton } from "@/components/SubmitButton";
import { addModule, deleteDocument, deleteLesson, saveLesson, updateProgram, uploadDocument } from "../../actions";

export const metadata: Metadata = { title: "Modifier le parcours" };
const mmss = (s: number | null) => (s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "");

export default async function EditParcours({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ info?: string; erreur?: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [p] = await sql<{ id: string; slug: string; title: string; summary: string | null; device_model_id: string | null; published: boolean }[]>`select id, slug, title, summary, device_model_id, published from programs where id = ${id}`;
  if (!p) notFound();
  const models = await sql<{ id: string; name: string }[]>`select id, name from device_models order by name`;
  const modules = await sql<{ id: string; position: number; title: string }[]>`select id, position, title from modules where program_id = ${id} order by position`;
  const lessons = await sql<{ id: string; module_id: string; position: number; title: string; video_ref: string | null; duration_sec: number | null; body: string | null; presenter_id: string | null }[]>`
    select l.id, l.module_id, l.position, l.title, l.video_ref, l.duration_sec, l.body, l.presenter_id from lessons l join modules m on m.id = l.module_id where m.program_id = ${id} order by m.position, l.position`;
  const docs = await sql<{ id: string; title: string; lesson_title: string | null; size_bytes: number | null }[]>`
    select d.id, d.title, l.title as lesson_title, d.size_bytes from documents d left join lessons l on l.id = d.lesson_id where d.program_id = ${id} order by d.created_at`;
  const presenters = await sql<{ id: string; name: string; active: boolean }[]>`select id, name, active from presenters order by name`;
  const provider = process.env.VIDEO_PROVIDER ?? "local";
  const lessonFields = (l?: (typeof lessons)[number]) => (
    <>
      <div className="form-grid">
        <div className="field full"><label>Titre de la leçon</label><input className="input" name="title" required defaultValue={l?.title} /></div>
        <div className="field"><label>{provider === "mux" ? "Playback ID Mux" : "Fichier vidéo (private-media/videos)"}</label><input className="input" name="video_ref" defaultValue={l?.video_ref ?? ""} /></div>
        <div className="field"><label>Présenté par</label><select className="input" name="presenter_id" defaultValue={l?.presenter_id ?? ""}><option value="">—</option>{presenters.filter((x) => x.active || x.id === l?.presenter_id).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div className="field"><label>Durée (min:s)</label><input className="input" name="duration" required pattern="\d+(:\d{1,2})?" placeholder="12:30" defaultValue={mmss(l?.duration_sec ?? null)} /></div>
        <div className="field full"><label>Texte sous la vidéo</label><textarea className="input" name="body" defaultValue={l?.body ?? ""} /></div>
      </div>
    </>
  );
  return (
    <Shell user={admin} active="/admin/parcours">
      <p className="crumbs mono"><a href="/admin/parcours">Parcours</a> / {p.title}</p>
      <div className="page-head"><div><span className="eyebrow">Modifier le parcours</span><h1 className="display h1">{p.title}</h1></div>{p.published ? <span className="badge ok">Publié</span> : <span className="badge lock">Brouillon</span>}</div>
      {sp.erreur && <p className="alert err" role="alert" style={{ marginBottom: 16 }}>{sp.erreur}</p>}
      {sp.info && <p className="alert ok" role="status" style={{ marginBottom: 16 }}>{sp.info}</p>}
      <div className="cols">
        <div className="stack">
          {modules.map((m) => (
            <section key={m.id} className="glass card stack" style={{ gap: 12 }}>
              <span className="eyebrow">Module {m.position} · {m.title}</span>
              {lessons.filter((l) => l.module_id === m.id).map((l) => (
                <details key={l.id} style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>
                  <summary className="row between" style={{ cursor: "pointer" }}><span><span className="mono">{m.position}.{l.position}</span> <b>{l.title}</b></span><span className="small muted">{mmss(l.duration_sec)} · {l.video_ref ? "vidéo liée" : "sans vidéo"}{l.presenter_id ? ` · ${presenters.find((x) => x.id === l.presenter_id)?.name ?? ""}` : ""}</span></summary>
                  <form action={saveLesson} className="stack" style={{ gap: 10, marginTop: 10 }}>
                    <input type="hidden" name="program_id" value={p.id} /><input type="hidden" name="lesson_id" value={l.id} />
                    {lessonFields(l)}
                    <div className="row" style={{ justifyContent: "flex-end" }}><SubmitButton className="btn solid sm">Enregistrer</SubmitButton></div>
                  </form>
                  <form action={deleteLesson} style={{ marginTop: 8 }}><input type="hidden" name="program_id" value={p.id} /><input type="hidden" name="lesson_id" value={l.id} /><button className="btn sm ghost danger" type="submit">Supprimer la leçon</button></form>
                </details>
              ))}
              <details style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>
                <summary className="small" style={{ cursor: "pointer" }}>+ Ajouter une leçon</summary>
                <form action={saveLesson} className="stack" style={{ gap: 10, marginTop: 10 }}>
                  <input type="hidden" name="program_id" value={p.id} /><input type="hidden" name="module_id" value={m.id} />
                  {lessonFields()}
                  <div className="row" style={{ justifyContent: "flex-end" }}><SubmitButton className="btn solid sm" pending="Ajout…">Ajouter</SubmitButton></div>
                </form>
              </details>
            </section>
          ))}
          <form action={addModule} className="glass card row wrap"><input type="hidden" name="program_id" value={p.id} /><label className="sr" htmlFor="mt">Titre du module</label><input className="input" id="mt" name="title" placeholder="Titre du nouveau module" style={{ flex: 1, minWidth: 200 }} /><button className="btn" type="submit">Ajouter un module</button></form>
        </div>
        <aside className="stack">
          <form action={updateProgram} className="glass card stack" style={{ gap: 12 }}>
            <span className="eyebrow">Réglages</span>
            <input type="hidden" name="program_id" value={p.id} />
            <div className="field"><label htmlFor="t">Titre</label><input className="input" id="t" name="title" required defaultValue={p.title} /></div>
            <div className="field"><label htmlFor="dm">Machine</label><select className="input" id="dm" name="device_model_id" defaultValue={p.device_model_id ?? ""}><option value="">Aucune (fermé à tous)</option>{models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select><span className="hint">Seuls les clients qui ont acheté cette machine voient ce parcours. Sans machine, il n'est ouvert à personne.</span></div>
            <div className="field"><label htmlFor="s">Résumé</label><textarea className="input" id="s" name="summary" defaultValue={p.summary ?? ""} /></div>
            <label className="row small"><input type="checkbox" name="published" defaultChecked={p.published} style={{ accentColor: "#7b61ff" }} /> Publié (visible des médecins)</label>
            <button className="btn solid" type="submit">Enregistrer</button>
          </form>
          <section className="glass card stack" style={{ gap: 10 }}>
            <span className="eyebrow">Documents</span>
            {docs.map((d) => (
              <div key={d.id} className="row between" style={{ alignItems: "flex-start" }}>
                <a href={`/api/documents/${d.id}`} target="_blank" rel="noopener" className="small"><b>{d.title}</b>{d.lesson_title && <span className="muted" style={{ display: "block" }}>Leçon : {d.lesson_title}</span>}</a>
                <form action={deleteDocument}><input type="hidden" name="program_id" value={p.id} /><input type="hidden" name="document_id" value={d.id} /><button className="btn sm ghost danger" type="submit">Retirer</button></form>
              </div>
            ))}
            <form action={uploadDocument} className="stack" style={{ gap: 8 }}>
              <input type="hidden" name="program_id" value={p.id} />
              <input className="input" name="title" placeholder="Titre (ex. Fiche protocole)" aria-label="Titre du document" />
              <select className="input" name="lesson_id" defaultValue="" aria-label="Leçon liée"><option value="">Tout le parcours</option>{lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}</select>
              <input className="input" type="file" name="file" required accept=".pdf,.jpg,.jpeg,.png,.docx" style={{ paddingTop: 10 }} aria-label="Fichier" />
              <SubmitButton className="btn sm" pending="Envoi du fichier…">Ajouter le document</SubmitButton>
            </form>
          </section>
        </aside>
      </div>
    </Shell>
  );
}
