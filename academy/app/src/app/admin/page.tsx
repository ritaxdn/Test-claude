import type { Metadata } from "next";
import { Shell, Progress, pct, fmtDate } from "@/components/Shell";
import { requireAdmin } from "@/lib/auth";
import { doctorRows, trainingStatus } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Médecins" };
const FILTERS: [string, string][] = [["tous", "Tous"], ["non_terminee", "Non terminée"], ["terminee", "Terminée"], ["non_commencee", "Non commencée"], ["invite", "Invitation en attente"]];

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ filtre?: string; q?: string }> }) {
  const admin = await requireAdmin();
  const { filtre = "tous", q = "" } = await searchParams;
  const all = await doctorRows();
  const doctors = new Set(all.map((r) => r.user_id));
  const withProg = all.filter((r) => r.program_id && r.status !== "disabled");
  const count = (k: string) => withProg.filter((r) => trainingStatus(r).key === k).length;
  const needle = q.trim().toLowerCase();
  const rows = all.filter((r) => {
    const k = trainingStatus(r).key;
    if (needle && ![r.full_name, r.email, r.machines, r.clinic, r.city].join(" ").toLowerCase().includes(needle)) return false;
    if (filtre === "non_terminee") return ["en_cours", "non_commencee", "invite"].includes(k) && !!r.program_id;
    return filtre === "tous" || k === filtre;
  });
  return (
    <Shell user={admin} active="/admin">
      <div className="page-head">
        <div><span className="eyebrow">Cellulift · suivi des formations</span><h1 className="display h1">Médecins</h1></div>
        <a className="btn solid" href="/admin/medecins/nouveau">Inviter un médecin</a>
      </div>
      <div className="grid g4" style={{ marginBottom: 22 }}>
        {[["Médecins", doctors.size, ""], ["Formations terminées", count("terminee"), `${pct(count("terminee"), withProg.length)} % des parcours assignés`], ["En cours", count("en_cours"), ""], ["Non commencées", count("non_commencee") + count("invite"), `dont ${count("invite")} invitation${count("invite") > 1 ? "s" : ""} en attente`]].map(([l, v, h]) => (
          <div key={String(l)} className="glass card kpi"><span className="eyebrow">{l}</span><div className="v">{v}</div>{h && <p className="small muted" style={{ marginTop: 6 }}>{h}</p>}</div>
        ))}
      </div>
      <section className="glass" style={{ padding: 0 }}>
        <form className="row wrap" style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)" }} role="search">
          <input type="hidden" name="filtre" value={filtre} />
          <label htmlFor="q" className="sr">Rechercher</label>
          <input id="q" name="q" className="input" defaultValue={q} placeholder="Nom, e-mail, machine, clinique…" style={{ maxWidth: 320 }} />
          <button className="btn sm" type="submit">Rechercher</button>
          <nav className="row wrap" style={{ gap: 6, marginLeft: "auto" }} aria-label="Filtres">
            {FILTERS.map(([k, l]) => <a key={k} className={`btn sm ${filtre === k ? "solid" : ""}`} href={`/admin?filtre=${k}${q ? `&q=${encodeURIComponent(q)}` : ""}`} aria-current={filtre === k ? "true" : undefined}>{l}</a>)}
          </nav>
        </form>
        <div className="table-wrap">
          <table className="t">
            <thead><tr><th>Médecin</th><th>Machine</th><th>Parcours assigné</th><th>Progression</th><th>Statut</th><th>Dernière activité</th></tr></thead>
            <tbody>
              {rows.map((r) => {
                const st = trainingStatus(r);
                return (
                  <tr key={`${r.user_id}-${r.program_id ?? "none"}`}>
                    <td><a href={`/admin/medecins/${r.user_id}`}><b>{r.full_name}</b></a><div className="small muted">{r.email}</div></td>
                    <td className="small">{r.machines ?? <span className="muted">—</span>}</td>
                    <td className="small">{r.program_title ?? <span className="muted">—</span>}</td>
                    <td style={{ minWidth: 150 }}>{r.program_id ? <><Progress value={pct(r.done, r.lessons)} /><span className="small muted">{r.done} / {r.lessons} leçons</span></> : "—"}</td>
                    <td><span className={`badge ${st.cls}`}>{st.label}</span>{r.finished_at && <div className="small muted">le {fmtDate(r.finished_at)}</div>}</td>
                    <td className="small">{fmtDate(r.last_activity ?? r.activated_at)}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={6} className="muted">Aucun médecin dans ce filtre.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  );
}
