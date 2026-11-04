import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell, Progress, pct, fmtDate } from "@/components/Shell";
import { CopyField } from "@/components/CopyField";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { doctorRows, trainingStatus } from "@/lib/admin-data";
import { programLessons } from "@/lib/access";
import { addMachine, newLink, removeMachine, setUserStatus } from "../../actions";
import { markOrderPaid, cancelOrder, refundOrder, offerAccess, revokeAccess } from "../../commercial-actions";
import { professionLabel, fmtPrice, type Currency } from "@/lib/professions";

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
  const [q] = await sql<{ profession: string | null; professional_id: string | null; country: string | null; qualification_status: string; checked_at: Date | null; checker: string | null; qualification_note: string | null }[]>`
    select u.profession, u.professional_id, u.country, u.qualification_status, u.qualification_checked_at as checked_at, c.full_name as checker, u.qualification_note
      from users u left join users c on c.id = u.qualification_checked_by where u.id = ${id}`;
  const orders = await sql<{ id: string; title: string; status: string; payment_reference: string; amount: string; currency: Currency; reference: string | null; created_at: Date; paid_checked_at: Date | null; close_reason: string | null }[]>`
    select o.id, p.title, o.status, o.payment_reference, o.amount, o.currency, o.reference, o.created_at, o.paid_checked_at, o.close_reason
      from orders o join programs p on p.id = o.program_id where o.user_id = ${id} order by o.created_at desc`;
  const grants = await sql<{ id: string; title: string; source: string; reason: string | null; granted_at: Date; expires_at: Date | null; revoked_at: Date | null; revoke_reason: string | null; granter: string | null }[]>`
    select g.id, p.title, g.source, g.reason, g.granted_at, g.expires_at, g.revoked_at, g.revoke_reason, a.full_name as granter
      from access_grants g join programs p on p.id = g.program_id left join users a on a.id = g.granted_by where g.user_id = ${id} order by g.granted_at desc`;
  const trainings = await sql<{ id: string; title: string }[]>`select id, title from programs where kind = 'training' order by title`;
  const qLabel: Record<string, [string, string]> = { none: ["Non renseignée", "lock"], pending: ["En attente de vérification", "warn"], verified: ["Vérifiée", "ok"], rejected: ["Refusée", "lock"] };
  const oLabel: Record<string, [string, string]> = { pending: ["En attente de paiement", "warn"], paid: ["Payée", "ok"], cancelled: ["Annulée", "lock"], refunded: ["Remboursée", "lock"] };
  const page = `/admin/medecins/${id}`;
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
          <section className="glass card stack" style={{ gap: 8 }}>
            <span className="eyebrow">Qualification professionnelle</span>
            <div className="row between wrap"><span className={`badge ${qLabel[q.qualification_status]?.[1] ?? ""}`}>{qLabel[q.qualification_status]?.[0] ?? q.qualification_status}</span><span className="small">{professionLabel(q.profession)}{q.country ? ` · ${q.country}` : ""}</span></div>
            <p className="small muted">N° d&apos;Ordre : {q.professional_id ?? "—"}{q.checked_at ? ` · vérifiée le ${fmtDate(q.checked_at)} par ${q.checker}` : ""}</p>
            {q.qualification_note && <p className="small muted">{q.qualification_note}</p>}
          </section>
          <section className="glass card stack" style={{ gap: 10 }}>
            <span className="eyebrow">Formations : commandes et accès</span>
            {orders.length === 0 && grants.length === 0 && <p className="small muted">Aucune commande ni accès à une formation.</p>}
            {orders.map((o) => (
              <div key={o.id} className="stack" style={{ gap: 6, borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                <div className="row between wrap"><b className="small">{o.title}</b><span className={`badge ${oLabel[o.status][1]}`}>{oLabel[o.status][0]}</span></div>
                <p className="small muted">{o.payment_reference} · {fmtPrice(o.amount, o.currency)} · créée le {fmtDate(o.created_at)}{o.reference ? ` · virement ${o.reference}` : ""}{o.close_reason ? ` · ${o.close_reason}` : ""}</p>
                {o.status === "pending" && (
                  <form action={markOrderPaid} className="row wrap" style={{ gap: 6 }}><input type="hidden" name="order_id" value={o.id} /><input type="hidden" name="return_to" value={page} />
                    <input className="input" name="bank_reference" required minLength={3} placeholder="Référence du virement reçu" aria-label="Référence du virement reçu" style={{ flex: 1, minWidth: 160 }} />
                    <button className="btn sm solid" type="submit">Paiement vérifié</button></form>
                )}
                {o.status === "pending" && (
                  <details><summary className="small" style={{ cursor: "pointer" }}>Annuler</summary>
                    <form action={cancelOrder} className="row wrap" style={{ gap: 6, marginTop: 6 }}><input type="hidden" name="order_id" value={o.id} /><input type="hidden" name="return_to" value={page} />
                      <input className="input" name="reason" required minLength={3} placeholder="Motif" aria-label="Motif" style={{ flex: 1 }} /><button className="btn sm" type="submit">Annuler la commande</button></form></details>
                )}
                {o.status === "paid" && (
                  <details><summary className="small" style={{ cursor: "pointer" }}>Remboursement intégral</summary>
                    <form action={refundOrder} className="stack" style={{ gap: 6, marginTop: 6 }}><input type="hidden" name="order_id" value={o.id} /><input type="hidden" name="return_to" value={page} />
                      <input className="input" name="reason" required minLength={3} placeholder="Motif" aria-label="Motif" />
                      <label className="row small" style={{ gap: 6 }}><input type="checkbox" name="confirm" required /> Remboursement effectué ; l&apos;accès sera révoqué.</label>
                      <button className="btn sm danger" type="submit">Enregistrer</button></form></details>
                )}
              </div>
            ))}
            {grants.map((g) => (
              <div key={g.id} className="row between wrap small" style={{ borderTop: "1px solid var(--line)", paddingTop: 8, alignItems: "flex-start" }}>
                <div><b>{g.title}</b><div className="muted">{g.source === "purchase" ? "Accès acheté" : `Accès offert : ${g.reason}`} · le {fmtDate(g.granted_at)} par {g.granter}{g.expires_at ? ` · jusqu'au ${fmtDate(g.expires_at)}` : ""}</div>
                  {g.revoked_at && <div className="muted">Révoqué le {fmtDate(g.revoked_at)} : {g.revoke_reason}</div>}</div>
                {!g.revoked_at && (
                  <details><summary style={{ cursor: "pointer" }}>Révoquer</summary>
                    <form action={revokeAccess} className="row wrap" style={{ gap: 6, marginTop: 6 }}><input type="hidden" name="grant_id" value={g.id} /><input type="hidden" name="user_id" value={u.id} />
                      <input className="input" name="reason" required minLength={3} placeholder="Motif" aria-label="Motif de la révocation" /><button className="btn sm danger" type="submit">Révoquer</button></form></details>
                )}
              </div>
            ))}
            {trainings.length > 0 && (
              <details><summary className="small" style={{ cursor: "pointer" }}>Offrir l&apos;accès à une formation</summary>
                <form action={offerAccess} className="stack" style={{ gap: 6, marginTop: 6 }}><input type="hidden" name="user_id" value={u.id} />
                  <select className="input" name="program_id" required defaultValue="" aria-label="Formation"><option value="" disabled>Formation…</option>{trainings.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
                  <input className="input" name="reason" required minLength={3} placeholder="Motif (obligatoire, tracé)" aria-label="Motif" />
                  <input className="input" name="months" inputMode="numeric" placeholder="Durée en mois (vide = sans fin)" aria-label="Durée en mois" />
                  <button className="btn sm" type="submit">Offrir l&apos;accès</button></form></details>
            )}
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
