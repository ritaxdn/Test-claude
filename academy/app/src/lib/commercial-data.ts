import "server-only";
import { sql } from "./db";

/** Étape commerciale d'une demande, calculée (jamais stockée deux fois). */
export type Stage = "non_confirmee" | "nouvelle" | "a_payer" | "payee" | "refusee" | "annulee" | "remboursee";
export const STAGES: [Stage | "toutes", string][] = [["toutes", "Toutes"], ["non_confirmee", "E-mail non confirmé"], ["nouvelle", "À vérifier"], ["a_payer", "En attente de paiement"], ["payee", "Payées"], ["refusee", "Refusées"], ["annulee", "Annulées"], ["remboursee", "Remboursées"]];
export const stageOf = (status: string, orderStatus: string | null, confirmed = true): Stage =>
  status === "new" ? (confirmed ? "nouvelle" : "non_confirmee") : status === "rejected" ? "refusee" : status === "cancelled" || orderStatus === "cancelled" ? "annulee"
    : orderStatus === "paid" ? "payee" : orderStatus === "refunded" ? "remboursee" : "a_payer";
export const stageLabel: Record<Stage, [string, string]> = {
  non_confirmee: ["E-mail non confirmé", "lock"], nouvelle: ["À vérifier", "warn"], a_payer: ["En attente de paiement", ""], payee: ["Payée · accès ouvert", "ok"], refusee: ["Refusée", "lock"], annulee: ["Annulée", "lock"], remboursee: ["Remboursée", "lock"],
};

export type RequestRow = { id: string; created_at: Date; full_name: string; email: string; country: string; profession: string; status: string; title: string; program_id: string;
  order_id: string | null; order_status: string | null; payment_reference: string | null; amount: string | null; currency: string | null; proofs: number; confirmed: boolean; marketing: boolean };
export function requestRows(id?: string) {
  return sql<RequestRow[]>`
    select r.id, r.created_at, r.full_name, r.email, r.country, r.profession, r.status, p.title, p.id as program_id,
           o.id as order_id, o.status as order_status, o.payment_reference, o.amount, o.currency,
           (select count(*)::int from qualification_documents d where d.request_id = r.id and d.purged_at is null) as proofs,
           r.email_confirmed_at is not null as confirmed, r.marketing_consent_at is not null as marketing
      from enrollment_requests r join programs p on p.id = r.program_id left join orders o on o.id = r.order_id
     ${id ? sql`where r.id = ${id}` : sql``}
     order by r.created_at desc`;
}

/** Entonnoir de vente (mesure du modèle payant). */
export async function funnel() {
  const [f] = await sql<{ demandes: number; confirmees: number; verifiees: number; payees: number; commencees: number; terminees: number }[]>`
    with r as (select r.*, o.status as os from enrollment_requests r left join orders o on o.id = r.order_id)
    select count(*)::int as demandes,
           count(*) filter (where email_confirmed_at is not null)::int as confirmees,
           count(*) filter (where status = 'approved')::int as verifiees,
           count(*) filter (where os = 'paid')::int as payees,
           count(*) filter (where os = 'paid' and exists (select 1 from lesson_progress lp join program_lessons pl on pl.lesson_id = lp.lesson_id where lp.user_id = r.user_id and pl.program_id = r.program_id))::int as commencees,
           count(*) filter (where os = 'paid' and not exists (select 1 from program_lessons pl left join lesson_progress lp on lp.lesson_id = pl.lesson_id and lp.user_id = r.user_id where pl.program_id = r.program_id and lp.completed_at is null))::int as terminees
      from r`;
  return f;
}
