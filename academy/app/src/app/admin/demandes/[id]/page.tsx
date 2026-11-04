import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell, fmtDate } from "@/components/Shell";
import { CopyField } from "@/components/CopyField";
import { SubmitButton } from "@/components/SubmitButton";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { requestRows, stageOf, stageLabel } from "@/lib/commercial-data";
import { professionLabel, fmtPrice, currencyFor, COUNTRIES, type Currency } from "@/lib/professions";
import { approveRequest, rejectRequest, cancelRequest, markOrderPaid, cancelOrder, refundOrder } from "../../commercial-actions";

export const metadata: Metadata = { title: "Demande d'inscription" };

export default async function Demande({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ erreur?: string; info?: string; lien?: string; envoye?: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [r] = await requestRows(id);
  if (!r) notFound();
  const [d] = await sql<{ phone: string | null; professional_id: string | null; message: string | null; terms_version: string; consent_at: Date; reviewed_at: Date | null; reviewer: string | null; reject_reason: string | null; user_id: string | null;
    price_mad: string | null; price_eur: string | null; price_usd: string | null; eligible: string[] }[]>`
    select r.phone, r.professional_id, r.message, r.terms_version, r.consent_at, r.reviewed_at, u.full_name as reviewer, r.reject_reason, r.user_id,
           p.price_mad, p.price_eur, p.price_usd, p.eligible_professions as eligible
      from enrollment_requests r join programs p on p.id = r.program_id left join users u on u.id = r.reviewed_by where r.id = ${id}`;
  const proofs = await sql<{ id: string; mime_type: string; size_bytes: number; uploaded_at: Date; purge_after: Date | null; purged_at: Date | null }[]>`
    select id, mime_type, size_bytes, uploaded_at, purge_after, purged_at from qualification_documents where request_id = ${id} order by uploaded_at`;
  const [me] = await sql<{ v: boolean }[]>`select can_verify_qualifications as v from users where id = ${admin.id}`;
  const stage = stageOf(r.status, r.order_status);
  const [label, cls] = stageLabel[stage];
  const cur = currencyFor(r.country) as Currency;
  const price = cur === "MAD" ? d.price_mad : cur === "EUR" ? d.price_eur : d.price_usd;
  const page = `/admin/demandes/${id}`;
  return (
    <Shell user={admin} active="/admin/demandes">
      <p className="crumbs mono"><a href="/admin/demandes">Demandes</a> / {r.full_name}</p>
      <div className="page-head">
        <div><span className="eyebrow">{r.title}</span><h1 className="display h1">{r.full_name}</h1>
          <div className="row wrap" style={{ marginTop: 12 }}><span className={`badge ${cls}`}>{label}</span><span className="small muted">reçue le {fmtDate(r.created_at)}</span></div></div>
      </div>
      {sp.erreur && <p className="alert err" role="alert" style={{ marginBottom: 16 }}>{sp.erreur}</p>}
      {sp.info && <p className="alert ok" role="status" style={{ marginBottom: 16 }}>{sp.info}</p>}
      {sp.lien && (
        <div className="glass card stack" style={{ marginBottom: 20, gap: 10 }}>
          <b>Lien de création du mot de passe (14 jours)</b>
          <p className="small muted">{sp.envoye === "1" ? "L'e-mail « accès ouvert » est parti. Vous pouvez aussi transmettre ce lien." : "Aucun e-mail n'a été envoyé (envoi non configuré) : transmettez ce lien au professionnel."}</p>
          <CopyField value={sp.lien} label="Lien à transmettre" />
        </div>
      )}
      <div className="cols">
        <div className="stack">
          <section className="glass card stack" style={{ gap: 8 }}>
            <span className="eyebrow">Demandeur</span>
            <p><b>{r.full_name}</b> · {r.email}{d.phone ? ` · ${d.phone}` : ""}</p>
            <p className="small">{professionLabel(r.profession)} · {COUNTRIES.find(([c]) => c === r.country)?.[1] ?? r.country} · n° d&apos;Ordre : <b>{d.professional_id ?? "—"}</b></p>
            {d.message && <p className="small muted">« {d.message} »</p>}
            <p className="small muted">Consentement donné le {fmtDate(d.consent_at)} (version {d.terms_version}).</p>
            {d.user_id && <p className="small"><a href={`/admin/medecins/${d.user_id}`}>Voir la fiche du professionnel</a></p>}
          </section>
          <section className="glass card stack" style={{ gap: 8 }}>
            <span className="eyebrow">Justificatif</span>
            {proofs.length === 0 && <p className="small muted">Aucun fichier joint : vérifiez le numéro d&apos;Ordre.</p>}
            {proofs.map((p) => (
              <div key={p.id} className="row between wrap small">
                <span>{p.mime_type === "application/pdf" ? "PDF" : "Image"} · {Math.ceil(p.size_bytes / 1024)} Ko · déposé le {fmtDate(p.uploaded_at)}</span>
                {p.purged_at ? <span className="muted">supprimé le {fmtDate(p.purged_at)}</span>
                  : me?.v ? <a className="btn sm" href={`/api/justificatifs/${p.id}`} target="_blank" rel="noopener">Consulter (consultation tracée)</a>
                  : <span className="muted">réservé aux vérificateurs habilités</span>}
                {p.purge_after && !p.purged_at && <span className="muted">suppression prévue le {fmtDate(p.purge_after)}</span>}
              </div>
            ))}
          </section>
          {d.reviewed_at && <p className="small muted">Traitée le {fmtDate(d.reviewed_at)} par {d.reviewer}{d.reject_reason ? ` · motif : ${d.reject_reason}` : ""}.</p>}
        </div>
        <aside className="stack">
          {stage === "nouvelle" && (
            me?.v ? (
              <section className="glass card stack" style={{ gap: 12 }}>
                <span className="eyebrow">Vérification</span>
                <p className="small">Profession autorisée : {d.eligible.includes(r.profession) ? "oui" : <b>non</b>}. Prix ({cur}) : <b>{fmtPrice(price, cur) ?? "non défini"}</b>.</p>
                <form action={approveRequest} className="stack" style={{ gap: 8 }}>
                  <input type="hidden" name="request_id" value={id} />
                  <SubmitButton className="btn solid">Qualification vérifiée · accepter</SubmitButton>
                  <p className="small muted">Crée (ou reprend) le compte, la commande « en attente » et envoie les instructions de paiement.</p>
                </form>
                <form action={rejectRequest} className="stack" style={{ gap: 8 }}>
                  <input type="hidden" name="request_id" value={id} />
                  <label className="small" htmlFor="reason">Motif du refus (envoyé au demandeur)</label>
                  <textarea className="input" id="reason" name="reason" required minLength={3} maxLength={500} />
                  <SubmitButton className="btn danger">Refuser la demande</SubmitButton>
                </form>
              </section>
            ) : <section className="glass card"><p className="small muted">Seul un vérificateur habilité peut accepter ou refuser cette demande.</p></section>
          )}
          {stage === "nouvelle" && (
            <details className="glass card"><summary className="small" style={{ cursor: "pointer" }}>Annuler la demande (doublon, demande retirée…)</summary>
              <form action={cancelRequest} className="stack" style={{ gap: 8, marginTop: 10 }}><input type="hidden" name="request_id" value={id} />
                <input className="input" name="reason" required minLength={3} placeholder="Motif" /><SubmitButton className="btn sm">Annuler la demande</SubmitButton></form></details>
          )}
          {r.order_id && (
            <section className="glass card stack" style={{ gap: 12 }}>
              <span className="eyebrow">Commande</span>
              <p><b>{r.payment_reference}</b> · {fmtPrice(r.amount, r.currency as Currency)}</p>
              {r.order_status === "pending" && (
                <>
                  <form action={markOrderPaid} className="stack" style={{ gap: 8 }}>
                    <input type="hidden" name="order_id" value={r.order_id} /><input type="hidden" name="return_to" value={page} />
                    <label className="small" htmlFor="bank_reference">Référence du virement reçu (relevé bancaire)</label>
                    <input className="input" id="bank_reference" name="bank_reference" required minLength={3} maxLength={200} />
                    <SubmitButton className="btn solid">Paiement vérifié · ouvrir l&apos;accès</SubmitButton>
                  </form>
                  <details><summary className="small" style={{ cursor: "pointer" }}>Annuler la commande</summary>
                    <form action={cancelOrder} className="stack" style={{ gap: 8, marginTop: 10 }}><input type="hidden" name="order_id" value={r.order_id} /><input type="hidden" name="return_to" value={page} />
                      <input className="input" name="reason" required minLength={3} placeholder="Motif" /><SubmitButton className="btn sm">Annuler</SubmitButton></form></details>
                </>
              )}
              {r.order_status === "paid" && (
                <details><summary className="small" style={{ cursor: "pointer" }}>Enregistrer un remboursement intégral</summary>
                  <form action={refundOrder} className="stack" style={{ gap: 8, marginTop: 10 }}><input type="hidden" name="order_id" value={r.order_id} /><input type="hidden" name="return_to" value={page} />
                    <input className="input" name="reason" required minLength={3} placeholder="Motif" />
                    <label className="row small" style={{ gap: 8 }}><input type="checkbox" name="confirm" required /> Le remboursement intégral a été effectué ; l&apos;accès sera révoqué.</label>
                    <SubmitButton className="btn sm danger">Enregistrer le remboursement</SubmitButton></form></details>
              )}
            </section>
          )}
        </aside>
      </div>
    </Shell>
  );
}
