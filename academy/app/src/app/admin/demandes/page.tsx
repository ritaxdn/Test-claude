import type { Metadata } from "next";
import { Shell, fmtDate } from "@/components/Shell";
import { requireAdmin } from "@/lib/auth";
import { requestRows, stageOf, stageLabel, STAGES, funnel } from "@/lib/commercial-data";
import { professionLabel, fmtPrice, type Currency } from "@/lib/professions";

export const metadata: Metadata = { title: "Demandes d'inscription" };

export default async function Demandes({ searchParams }: { searchParams: Promise<{ etape?: string; erreur?: string; info?: string }> }) {
  const admin = await requireAdmin();
  const { etape = "toutes", erreur, info } = await searchParams;
  const all = await requestRows();
  const f = await funnel();
  const rows = all.filter((r) => etape === "toutes" || stageOf(r.status, r.order_status) === etape);
  const count = (k: string) => all.filter((r) => stageOf(r.status, r.order_status) === k).length;
  return (
    <Shell user={admin} active="/admin/demandes">
      <div className="page-head"><div><span className="eyebrow">Formations · ventes</span><h1 className="display h1">Demandes d&apos;inscription</h1></div></div>
      {erreur && <p className="alert err" role="alert" style={{ marginBottom: 16 }}>{erreur}</p>}
      {info && <p className="alert ok" role="status" style={{ marginBottom: 16 }}>{info}</p>}
      <div className="grid g4" style={{ marginBottom: 22 }}>
        {[["Demandes", f.demandes], ["Vérifiées", f.verifiees], ["Payées", f.payees], ["Formation commencée", f.commencees]].map(([l, v]) => (
          <div key={String(l)} className="glass card kpi"><span className="eyebrow">{l}</span><div className="v">{v}</div></div>
        ))}
      </div>
      <section className="glass" style={{ padding: 0 }}>
        <nav className="row wrap" style={{ gap: 6, padding: "14px 16px", borderBottom: "1px solid var(--line)" }} aria-label="Étapes">
          {STAGES.map(([k, l]) => <a key={k} className={`btn sm ${etape === k ? "solid" : ""}`} href={`/admin/demandes?etape=${k}`} aria-current={etape === k ? "true" : undefined}>{l}{k !== "toutes" ? ` (${count(k)})` : ""}</a>)}
        </nav>
        {rows.length === 0 ? <p className="muted" style={{ padding: 18 }}>Aucune demande à cette étape.</p> : (
          <div className="table-wrap">
            <table className="t">
              <thead><tr><th>Demandeur</th><th>Formation</th><th>Profession</th><th>Commande</th><th>Étape</th><th>Reçue le</th></tr></thead>
              <tbody>
                {rows.map((r) => {
                  const [label, cls] = stageLabel[stageOf(r.status, r.order_status)];
                  return (
                    <tr key={r.id}>
                      <td><a href={`/admin/demandes/${r.id}`}><b>{r.full_name}</b></a><div className="small muted">{r.email} · {r.country}</div></td>
                      <td className="small">{r.title}</td>
                      <td className="small">{professionLabel(r.profession)}{r.proofs ? " · justificatif" : ""}</td>
                      <td className="small">{r.payment_reference ? <>{r.payment_reference}<div className="muted">{fmtPrice(r.amount, r.currency as Currency)}</div></> : "—"}</td>
                      <td><span className={`badge ${cls}`}>{label}</span></td>
                      <td className="small">{fmtDate(r.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Shell>
  );
}
