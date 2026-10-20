import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell, Progress, pct, fmtDate } from "@/components/Shell";
import { CopyField } from "@/components/CopyField";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { doctorRows, trainingStatus } from "@/lib/admin-data";
import { programLessons } from "@/lib/access";
import { addMachine, newLink, removeMachine, setUserStatus } from "../../actions";

export const metadata: Metadata = { title: "Médecin" };

export default async function Medecin({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ lien?: string; envoye?: string; type?: string; info?: string; erreur?: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [u] = await sql<{ id: string; full_name: string; email: string; status: string; specialty: string | null; clinic: string | null; city: string | null; created_at: Date; activated_at: Date | null; last_login_at: Date | null }[]>`
    select id, full_name, email, status, specialty, clinic, city, created_at, activated_at, last_login_at from users where id = ${id} and role = 'doctor'`;
  if (!u) notFound();
  const machines = await sql<{ id: string; name: string; serial_number: string | null; installed_on: Date | null; created_at: Date }[]>`
    select o.id, dm.name, o.serial_number, o.installed_on, o.created_at from device_ownerships o join device_models dm on dm.id = o.device_model_id where o.user_id = ${id} and o.revoked_at is null order by o.created_at`;
  const models = await sql<{ id: string; name: string }[]>`select id, name from device_models order by name`;
  const rows = (await doctorRows(id)).filter((r) => r.program_id);
  const details = await Promise.all(rows.map((r) => programLessons(id, r.program_id!)));
  const accountBadge = u.status === "active" ? <span className="badge ok">Compte actif</span> : u.status === "invited" ? <span className="badge warn">Invitation en attente</span> : <span className="badge lock">Accès désactivé</span>;
  return (
    <Shell user={admin} active="/admin">
      <p className="crumbs mono"><a href="/admin">Médecins</a> / {u.full_name}</p>
      <div className="page-head">
        <div><span className="eyebrow">{[u.specialty, u.clinic, u.city].filter(Boolean).join(" · ") || "Médecin"}</span><h1 className="display h1">{u.full_name}</h1>
          <div className="row wrap" style={{ marginTop: 12 }}>{accountBadge}<span className="small muted">{u.email} · invité le {fmtDate(u.created_at)}{u.activated_at ? ` · compte créé le ${fmtDate(u.activated_at)}` : ""}{u.last_login_at ? ` · dernière connexion le ${fmtDate(u.last_login_at)}` : ""}</span></div>
        </div>
      </div>
      {sp.erreur && <p className="alert err" role="alert" style={{ marginBottom: 16 }}>{sp.erreur}</p>}
      {sp.info && <p className="alert ok" role="status" style={{ marginBottom: 16 }}>{sp.info}</p>}
      {sp.lien && (
        <div className="glass card stack" style={{ marginBottom: 20, gap: 10 }}>
          <b>{sp.type === "reset" ? "Lien de réinitialisation (1 heure)" : "Lien d'invitation (14 jours)"}</b>
          <p className="small muted">{sp.envoye === "1" ? "L'e-mail est parti. Vous pouvez aussi transmettre ce lien directement." : "Aucun e-mail n'a été envoyé (envoi non configuré) : transmettez ce lien au médecin, par e-mail ou WhatsApp."}</p>
          <CopyField value={sp.lien} label="Lien à transmettre" />
        </div>
      )}
      <div className="cols">
        <div className="stack">
          <h2 className="eyebrow">Formation</h2>
          {rows.length === 0 && <div className="glass card"><p className="muted">Aucun parcours assigné. Ajoutez la machine du médecin : le parcours correspondant s'ouvrira.</p></div>}
          {rows.map((r, i) => {
            const st = trainingStatus(r);
            return (
              <section key={r.program_id} className="glass card stack" style={{ gap: 12 }}>
                <div className="row between wrap"><b style={{ fontSize: 17 }}>{r.program_title}</b><span className={`badge ${st.cls}`}>{st.label}</span></div>
                <Progress value={pct(r.done, r.lessons)} />
                <p className="small muted">{r.done} / {r.lessons} leçons{r.last_activity ? ` · dernière activité le ${fmtDate(r.last_activity)}` : ""}{r.finished_at ? ` · terminée le ${fmtDate(r.finished_at)}` : ""}</p>
                <div className="list">
                  {details[i].map((l) => (
                    <div key={l.lesson_id} className="item small">
                      <span className={`dot ${l.completed_at ? "done" : l.unlocked && u.status === "active" ? "cur" : "lock"}`} aria-hidden="true">{l.completed_at ? "✓" : ""}</span>
                      <span style={{ flex: 1 }}>{l.seq}. {l.title}</span>
                      <span className="muted">{l.completed_at ? `vue le ${fmtDate(l.completed_at)}` : l.max_position_sec > 0 && l.duration_sec ? `${pct(Math.round(l.max_position_sec), l.duration_sec)} % regardé` : "—"}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        <aside className="stack">
          <section className="glass card stack" style={{ gap: 10 }}>
            <span className="eyebrow">Machines</span>
            {machines.length === 0 && <p className="small muted">Aucune machine liée.</p>}
            {machines.map((m) => (
              <div key={m.id} className="row between" style={{ alignItems: "flex-start" }}>
                <div><b>{m.name}</b><div className="small muted">{m.serial_number ? `N° ${m.serial_number}` : "N° de série non renseigné"}{m.installed_on ? ` · installée le ${fmtDate(m.installed_on)}` : ""}</div></div>
                <form action={removeMachine}><input type="hidden" name="ownership_id" value={m.id} /><input type="hidden" name="user_id" value={u.id} /><button className="btn sm ghost danger" type="submit">Retirer</button></form>
              </div>
            ))}
            <details>
              <summary className="small" style={{ cursor: "pointer" }}>Ajouter une machine</summary>
              <form action={addMachine} className="stack" style={{ gap: 10, marginTop: 10 }}>
                <input type="hidden" name="user_id" value={u.id} />
                <label className="sr" htmlFor="dm">Machine</label>
                <select className="input" id="dm" name="device_model_id" required defaultValue=""><option value="" disabled>Machine…</option>{models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                <input className="input" name="serial_number" placeholder="N° de série" aria-label="N° de série" />
                <input className="input" name="installed_on" type="date" aria-label="Date d'installation" />
                <button className="btn solid sm" type="submit">Ajouter et ouvrir le parcours</button>
              </form>
            </details>
          </section>
          <section className="glass card stack" style={{ gap: 10 }}>
            <span className="eyebrow">Accès</span>
            {u.status !== "active" && u.status !== "disabled" && <form action={newLink}><input type="hidden" name="user_id" value={u.id} /><input type="hidden" name="kind" value="invite" /><button className="btn sm" type="submit">Nouveau lien d'invitation</button></form>}
            {u.status === "active" && <form action={newLink}><input type="hidden" name="user_id" value={u.id} /><input type="hidden" name="kind" value="reset" /><button className="btn sm" type="submit">Lien de réinitialisation du mot de passe</button></form>}
            <form action={setUserStatus}><input type="hidden" name="user_id" value={u.id} /><input type="hidden" name="status" value={u.status === "disabled" ? "enabled" : "disabled"} /><button className={`btn sm ${u.status === "disabled" ? "" : "danger"}`} type="submit">{u.status === "disabled" ? "Réactiver l'accès" : "Désactiver l'accès"}</button></form>
          </section>
        </aside>
      </div>
    </Shell>
  );
}
