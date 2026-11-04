import type { Metadata } from "next";
import { Shell, fmtDate } from "@/components/Shell";
import { requireUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { professionLabel, COUNTRIES, fmtPrice, type Currency } from "@/lib/professions";

export const metadata: Metadata = { title: "Mon compte" };
const Q: Record<string, [string, string, string]> = {
  none: ["Non renseignée", "lock", "Votre profession sera vérifiée lors de votre première demande d'inscription à une formation."],
  pending: ["En cours de vérification", "warn", "L'équipe CELLULIFT Academy vérifie votre qualification."],
  verified: ["Vérifiée", "ok", ""],
  rejected: ["Non validée", "lock", "Votre qualification n'a pas pu être validée. Contactez l'équipe CELLULIFT Academy ou déposez une nouvelle demande d'inscription avec un justificatif."],
};

export default async function MonCompte() {
  const user = await requireUser();
  const [u] = await sql<{ email: string; profession: string | null; professional_id: string | null; country: string | null; qualification_status: string; qualification_checked_at: Date | null }[]>`
    select email, profession, professional_id, country, qualification_status, qualification_checked_at from users where id = ${user.id}`;
  const orders = await sql<{ title: string; status: string; payment_reference: string; amount: string; currency: Currency; created_at: Date }[]>`
    select p.title, o.status, o.payment_reference, o.amount, o.currency, o.created_at from orders o join programs p on p.id = o.program_id where o.user_id = ${user.id} order by o.created_at desc`;
  const [label, cls, help] = Q[u.qualification_status] ?? Q.none;
  const O: Record<string, string> = { pending: "En attente de votre virement", paid: "Payée", cancelled: "Annulée", refunded: "Remboursée" };
  return (
    <Shell user={user} active="/mon-compte">
      <div className="page-head"><div><span className="eyebrow">Mon compte</span><h1 className="display h1">{user.full_name}</h1></div></div>
      <div className="grid g2">
        <section className="glass card stack" style={{ gap: 8 }}>
          <span className="eyebrow">Profil professionnel</span>
          <p className="small">{u.email}</p>
          <p className="small">{professionLabel(u.profession)}{u.country ? ` · ${COUNTRIES.find(([c]) => c === u.country)?.[1] ?? u.country}` : ""}{u.professional_id ? ` · n° ${u.professional_id}` : ""}</p>
          <div className="row wrap"><span className={`badge ${cls}`}>Qualification : {label}</span>{u.qualification_checked_at && u.qualification_status === "verified" && <span className="small muted">le {fmtDate(u.qualification_checked_at)}</span>}</div>
          {help && <p className="small muted">{help}</p>}
        </section>
        <section className="glass card stack" style={{ gap: 8 }}>
          <span className="eyebrow">Mes commandes</span>
          {orders.length === 0 ? <p className="small muted">Aucune commande.</p> : orders.map((o) => (
            <div key={o.payment_reference} className="small" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
              <b>{o.title}</b><div className="muted">{o.payment_reference} · {fmtPrice(o.amount, o.currency)} · {O[o.status] ?? o.status} · {fmtDate(o.created_at)}</div>
            </div>
          ))}
        </section>
      </div>
    </Shell>
  );
}
