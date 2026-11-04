import type { Metadata } from "next";
import { Shell, fmtDate } from "@/components/Shell";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { setVerifier } from "../commercial-actions";

export const metadata: Metadata = { title: "Vérificateurs" };

export default async function Verificateurs({ searchParams }: { searchParams: Promise<{ erreur?: string; info?: string }> }) {
  const admin = await requireAdmin();
  const { erreur, info } = await searchParams;
  const admins = await sql<{ id: string; full_name: string; email: string; status: string; can_verify_qualifications: boolean; last_login_at: Date | null }[]>`
    select id, full_name, email, status, can_verify_qualifications, last_login_at from users where role = 'admin' order by full_name`;
  const log = await sql<{ at: Date; actor: string | null; target: string; on: string }[]>`
    select a.at, u.full_name as actor, t.full_name as target, a.details->'after'->>'can_verify_qualifications' as on
      from audit_log a left join users u on u.id = a.actor_id left join users t on t.id::text = a.target
     where a.action = 'users.update' and (a.details->'before'->>'can_verify_qualifications') is distinct from (a.details->'after'->>'can_verify_qualifications')
     order by a.at desc limit 20`;
  return (
    <Shell user={admin} active="/admin/verificateurs">
      <div className="page-head"><div><span className="eyebrow">Qualifications professionnelles</span><h1 className="display h1">Vérificateurs</h1>
        <p className="muted small" style={{ marginTop: 10, maxWidth: 640 }}>Seuls les administrateurs habilités peuvent accepter ou refuser une demande et consulter les justificatifs. Le droit s&apos;accorde par un autre administrateur, jamais à soi-même, et chaque changement est tracé.</p></div></div>
      {erreur && <p className="alert err" role="alert" style={{ marginBottom: 16 }}>{erreur}</p>}
      {info && <p className="alert ok" role="status" style={{ marginBottom: 16 }}>{info}</p>}
      <section className="glass" style={{ padding: 0 }}>
        <div className="table-wrap"><table className="t">
          <thead><tr><th>Administrateur</th><th>Droit de vérification</th><th>Dernière connexion</th><th></th></tr></thead>
          <tbody>{admins.map((a) => (
            <tr key={a.id}>
              <td><b>{a.full_name}</b><div className="small muted">{a.email}{a.status !== "active" ? " · compte inactif" : ""}</div></td>
              <td>{a.can_verify_qualifications ? <span className="badge ok">Habilité</span> : <span className="badge lock">Non habilité</span>}</td>
              <td className="small">{fmtDate(a.last_login_at)}</td>
              <td>{a.id === admin.id ? <span className="small muted">Votre compte</span> : (
                <form action={setVerifier}><input type="hidden" name="user_id" value={a.id} /><input type="hidden" name="on" value={a.can_verify_qualifications ? "0" : "1"} />
                  <button className={`btn sm ${a.can_verify_qualifications ? "ghost danger" : ""}`} type="submit">{a.can_verify_qualifications ? "Retirer le droit" : "Accorder le droit"}</button></form>)}</td>
            </tr>))}</tbody>
        </table></div>
      </section>
      <section className="glass card stack" style={{ gap: 6, marginTop: 20 }}>
        <span className="eyebrow">Historique</span>
        {log.length === 0 ? <p className="small muted">Aucun changement enregistré.</p> : log.map((l, i) => <p key={i} className="small">{fmtDate(l.at)} · {l.actor ?? "Compte propriétaire de la base"} → {l.target} : {l.on === "true" ? "droit accordé" : "droit retiré"}</p>)}
      </section>
    </Shell>
  );
}
