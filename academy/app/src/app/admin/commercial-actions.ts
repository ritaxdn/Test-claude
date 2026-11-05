"use server";
// Lot 2 — parcours commercial : demandes, vérification, commandes, paiement, accès, vérificateurs.
// Chaque action vérifie le rôle côté serveur ; la base revérifie (déclencheurs) et trace l'auteur.
import { redirect } from "next/navigation";
import { requireAdmin, issueToken, type User } from "@/lib/auth";
import { sql, withActor } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { flashLink } from "@/lib/flash";
import { currencyFor, fmtPrice, isProfession, type Currency } from "@/lib/professions";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const isUuid = (v: string) => /^[0-9a-f-]{36}$/i.test(v);
const back = (path: string, params: Record<string, string>): never => redirect(`${path}?${new URLSearchParams(params)}`);
/** Message lisible à partir d'un refus de la base (garde-fous) ; jamais de détail technique brut. */
const dbMessage = (e: unknown) => {
  const m = e instanceof Error ? e.message : String(e);
  if (/orders_bank_reference_once/.test(m)) return "Cette référence de virement a déjà servi à valider une autre commande : vérifiez le relevé.";
  if (/access_grants_one_active/.test(m)) return "Ce professionnel a déjà un accès actif à cette formation.";
  if (/violates|syntax|relation|column|duplicate key/.test(m)) { console.error("[admin] refus de la base :", m); return "Opération refusée par les règles de LIFT."; }
  return m;
};
const appUrl = () => process.env.APP_URL ?? "http://localhost:3100";

async function requireVerifier(): Promise<User> {
  const admin = await requireAdmin();
  const [r] = await sql<{ ok: boolean }[]>`select can_verify_qualifications as ok from users where id = ${admin.id}`;
  if (!r?.ok) back("/admin/demandes", { erreur: "Seul un vérificateur habilité peut accepter ou refuser une demande." });
  return admin;
}

type Req = { id: string; status: string; program_id: string; title: string; slug: string; full_name: string; email: string; country: string; profession: string; professional_id: string | null;
  price_mad: string | null; price_eur: string | null; price_usd: string | null };
async function loadRequest(id: string): Promise<Req> {
  if (!isUuid(id)) back("/admin/demandes", { erreur: "Demande introuvable." });
  const [r] = await sql<Req[]>`
    select r.id, r.status, r.program_id, p.title, p.slug, r.full_name, r.email, r.country, r.profession, r.professional_id, p.price_mad, p.price_eur, p.price_usd
      from enrollment_requests r join programs p on p.id = r.program_id where r.id = ${id}`;
  if (!r) back("/admin/demandes", { erreur: "Demande introuvable." });
  return r;
}

/* ── Demandes ── */

/** Accepter : qualification vérifiée, compte créé (ou repris), commande « en attente », e-mail de paiement. */
export async function approveRequest(form: FormData) {
  const admin = await requireVerifier();
  const r = await loadRequest(s(form, "request_id"));
  const page = `/admin/demandes/${r.id}`;
  if (r.status !== "new") back(page, { erreur: "Cette demande a déjà été traitée." });
  if (!isProfession(r.profession)) back(page, { erreur: "Profession inconnue." });
  const currency: Currency = currencyFor(r.country);
  const amount = currency === "MAD" ? r.price_mad : currency === "EUR" ? r.price_eur : r.price_usd;
  if (amount == null) back(page, { erreur: `Définissez d'abord le prix en ${currency} de la formation (fiche formation).` });
  let order: { id: string; payment_reference: string } | undefined;
  try {
    order = await withActor(admin.id, async (tx) => {
      const [existing] = await tx<{ id: string; role: string; profession: string | null; professional_id: string | null; qualification_status: string }[]>`
        select id, role, profession, professional_id, qualification_status from users where email = ${r.email} for update`;
      if (existing?.role === "admin") throw new Error("Cette adresse appartient à un compte administrateur.");
      if (existing?.id === admin.id) throw new Error("On ne vérifie pas sa propre qualification.");
      // Une demande (formulaire public) ne remplace jamais en silence l'identité professionnelle déjà vérifiée d'un compte.
      if (existing?.qualification_status === "verified" && (existing.profession !== r.profession || (existing.professional_id ?? "").toLowerCase() !== (r.professional_id ?? "").toLowerCase()))
        throw new Error("Un compte existant porte une qualification vérifiée différente : acceptation bloquée. Vérifiez l'identité du demandeur.");
      if (existing) {
        const [busy] = await tx`select 1 from orders where user_id = ${existing.id} and program_id = ${r.program_id} and status in ('pending', 'paid') limit 1`;
        if (busy) throw new Error("Ce professionnel a déjà une commande en cours ou payée pour cette formation.");
      }
      const userId = existing?.id ?? (await tx<{ id: string }[]>`insert into users (email, full_name) values (${r.email}, ${r.full_name}) returning id`)[0].id;
      // Deux temps : une nouvelle profession remet la vérification à zéro, puis le vérificateur la valide.
      await tx`update users set profession = ${r.profession}, professional_id = ${r.professional_id}, country = ${r.country}, qualification_status = 'pending' where id = ${userId}`;
      await tx`update users set qualification_status = 'verified', qualification_checked_by = ${admin.id}, qualification_checked_at = now(),
                 qualification_note = ${`Demande d'inscription ${r.id} : n° ${r.professional_id ?? "—"}`} where id = ${userId}`;
      const [o] = await tx<{ id: string; payment_reference: string }[]>`
        insert into orders (user_id, program_id, currency, amount, method, created_by, note)
        values (${userId}, ${r.program_id}, ${currency}, ${amount}, 'virement', ${admin.id}, ${`Demande ${r.id}`}) returning id, payment_reference`;
      const done = await tx`update enrollment_requests set status = 'approved', reviewed_by = ${admin.id}, reviewed_at = now(), user_id = ${userId}, order_id = ${o.id} where id = ${r.id} and status = 'new'`;
      if (done.count !== 1) throw new Error("Cette demande a déjà été traitée.");
      await tx`update qualification_documents set purge_after = now() + interval '30 days' where request_id = ${r.id} and purged_at is null`;
      return o;
    });
  } catch (e) {
    back(page, { erreur: dbMessage(e) });
  }
  const sent = await sendMail(r.email, `Inscription validée : ${r.title}`, [
    `Bonjour ${r.full_name},`,
    `Votre qualification a été vérifiée : votre inscription à « ${r.title} » est validée.`,
    `Montant : ${fmtPrice(amount, currency)}. Référence à indiquer sur votre virement : ${order!.payment_reference}.`,
    process.env.LIFT_PAYMENT_INSTRUCTIONS ?? "Les coordonnées bancaires vous sont communiquées par l'équipe CELLULIFT Academy.",
    "Votre accès est ouvert dès réception du paiement ; vous recevrez alors votre lien de connexion.",
  ]);
  back(page, { info: `Demande acceptée. Commande ${order!.payment_reference} créée (${fmtPrice(amount, currency)}).${sent ? " E-mail de paiement envoyé." : " E-mail non envoyé (envoi non configuré) : transmettez la référence au professionnel."}` });
}

export async function rejectRequest(form: FormData) {
  const admin = await requireVerifier();
  const r = await loadRequest(s(form, "request_id"));
  const page = `/admin/demandes/${r.id}`;
  const reason = s(form, "reason");
  if (reason.length < 3) back(page, { erreur: "Indiquez le motif du refus (il est envoyé au demandeur)." });
  try {
    await withActor(admin.id, async (tx) => {
      await tx`update enrollment_requests set status = 'rejected', reviewed_by = ${admin.id}, reviewed_at = now(), reject_reason = ${reason} where id = ${r.id} and status = 'new'`;
      await tx`update qualification_documents set purge_after = now() + interval '30 days' where request_id = ${r.id} and purged_at is null`;
    });
  } catch (e) {
    back(page, { erreur: dbMessage(e) });
  }
  await sendMail(r.email, `Votre demande d'inscription : ${r.title}`, [
    `Bonjour ${r.full_name},`,
    `Nous ne pouvons pas valider votre demande d'inscription à « ${r.title} ».`,
    `Motif : ${reason}`,
    "Vous pouvez nous répondre ou déposer une nouvelle demande avec les éléments complémentaires.",
  ]);
  back(page, { info: "Demande refusée ; le motif a été envoyé au demandeur (si l'envoi est configuré)." });
}

export async function cancelRequest(form: FormData) {
  const admin = await requireAdmin();
  const r = await loadRequest(s(form, "request_id"));
  const reason = s(form, "reason");
  if (reason.length < 3) back(`/admin/demandes/${r.id}`, { erreur: "Indiquez le motif de l'annulation." });
  try {
    await withActor(admin.id, async (tx) => {
      await tx`update enrollment_requests set status = 'cancelled', reviewed_by = ${admin.id}, reviewed_at = now(), reject_reason = ${reason} where id = ${r.id} and status = 'new'`;
      await tx`update qualification_documents set purge_after = least(purge_after, now() + interval '30 days') where request_id = ${r.id} and purged_at is null`;
    });
  } catch (e) {
    back(`/admin/demandes/${r.id}`, { erreur: dbMessage(e) });
  }
  back(`/admin/demandes/${r.id}`, { info: "Demande annulée." });
}

/* ── Commandes ── */

type Ord = { id: string; status: string; user_id: string; program_id: string; payment_reference: string; currency: Currency; amount: string; email: string; full_name: string; password_hash: string | null; title: string; access_months: number | null };
async function loadOrder(id: string): Promise<Ord> {
  if (!isUuid(id)) back("/admin/demandes", { erreur: "Commande introuvable." });
  const [o] = await sql<Ord[]>`
    select o.id, o.status, o.user_id, o.program_id, o.payment_reference, o.currency, o.amount, u.email, u.full_name, u.password_hash, p.title, p.access_months
      from orders o join users u on u.id = o.user_id join programs p on p.id = o.program_id where o.id = ${id}`;
  if (!o) back("/admin/demandes", { erreur: "Commande introuvable." });
  return o;
}
const returnTo = (f: FormData, fallback: string) => { const r = s(f, "return_to"); return /^\/admin\/[a-z0-9/-]*$/i.test(r) ? r : fallback; };

/** Paiement reçu et vérifié : commande « payée », accès ouvert (durée de la formation), e-mail. */
export async function markOrderPaid(form: FormData) {
  const admin = await requireAdmin();
  const o = await loadOrder(s(form, "order_id"));
  const page = returnTo(form, `/admin/medecins/${o.user_id}`);
  const bankRef = s(form, "bank_reference");
  if (bankRef.length < 3) back(page, { erreur: "Indiquez la référence du virement reçu (relevé bancaire)." });
  const received = Number(s(form, "amount_received").replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(received) || received <= 0) back(page, { erreur: "Indiquez le montant effectivement reçu sur le compte." });
  if (received.toFixed(2) !== Number(o.amount).toFixed(2)) back(page, { erreur: `Montant reçu (${received}) différent du montant dû (${Number(o.amount)} ${o.currency}) : paiement non validé. En cas de virement partiel, contactez le professionnel.` });
  try {
    await withActor(admin.id, async (tx) => {
      const upd = await tx`update orders set status = 'paid', paid_checked_by = ${admin.id}, paid_checked_at = now(), reference = ${bankRef}, amount_received = ${received.toFixed(2)}
                            where id = ${o.id} and status = 'pending'`;
      if (upd.count !== 1) throw new Error("Cette commande n'est plus en attente de paiement (déjà validée ou annulée).");
      await tx`insert into access_grants (user_id, program_id, source, order_id, granted_by, expires_at)
               values (${o.user_id}, ${o.program_id}, 'purchase', ${o.id}, ${admin.id},
                       case when ${o.access_months}::int is null then null else now() + make_interval(months => ${o.access_months}::int) end)`;
    });
  } catch (e) {
    back(page, { erreur: dbMessage(e) });
  }
  const link = o.password_hash ? `${appUrl()}/connexion` : await issueToken(o.user_id, "invite", admin.id);
  const sent = await sendMail(o.email, `Votre accès est ouvert : ${o.title}`, [
    `Bonjour ${o.full_name},`,
    `Nous avons bien reçu votre paiement (référence ${o.payment_reference}). Votre accès à « ${o.title} » est ouvert${o.access_months ? ` pour ${o.access_months} mois` : ""}.`,
    o.password_hash ? "Connectez-vous avec votre adresse e-mail habituelle." : "Créez votre mot de passe avec ce lien personnel (valable 14 jours).",
  ], { label: o.password_hash ? "Me connecter" : "Créer mon accès", href: link });
  if (!o.password_hash) await flashLink(link);
  back(page, o.password_hash ? { info: `Paiement enregistré, accès ouvert.${sent ? " E-mail envoyé." : ""}` } : { info: "Paiement enregistré, accès ouvert.", lien: "1", envoye: sent ? "1" : "0" });
}

export async function cancelOrder(form: FormData) {
  const admin = await requireAdmin();
  const o = await loadOrder(s(form, "order_id"));
  const page = returnTo(form, `/admin/medecins/${o.user_id}`);
  const reason = s(form, "reason");
  if (reason.length < 3) back(page, { erreur: "Indiquez le motif de l'annulation." });
  try {
    await withActor(admin.id, (tx) => tx`update orders set status = 'cancelled', closed_by = ${admin.id}, closed_at = now(), close_reason = ${reason} where id = ${o.id}`);
  } catch (e) {
    back(page, { erreur: dbMessage(e) });
  }
  back(page, { info: "Commande annulée." });
}

/** Remboursement intégral confirmé : l'accès acheté est révoqué par la base (tracé). */
export async function refundOrder(form: FormData) {
  const admin = await requireAdmin();
  const o = await loadOrder(s(form, "order_id"));
  const page = returnTo(form, `/admin/medecins/${o.user_id}`);
  const reason = s(form, "reason");
  if (reason.length < 3) back(page, { erreur: "Indiquez le motif du remboursement." });
  if (form.get("confirm") !== "on") back(page, { erreur: "Confirmez que le remboursement intégral a bien été effectué." });
  try {
    await withActor(admin.id, (tx) => tx`update orders set status = 'refunded', closed_by = ${admin.id}, closed_at = now(), close_reason = ${reason} where id = ${o.id}`);
  } catch (e) {
    back(page, { erreur: dbMessage(e) });
  }
  await sendMail(o.email, `Remboursement confirmé : ${o.title}`, [`Bonjour ${o.full_name},`, `Le remboursement intégral de votre commande ${o.payment_reference} est confirmé. L'accès à « ${o.title} » est clôturé.`]);
  back(page, { info: "Remboursement enregistré ; l'accès acheté est révoqué." });
}

/* ── Accès offerts, révocation ── */

export async function offerAccess(form: FormData) {
  const admin = await requireAdmin();
  const userId = s(form, "user_id"), programId = s(form, "program_id"), reason = s(form, "reason");
  const page = `/admin/medecins/${userId}`;
  if (!isUuid(userId) || !isUuid(programId)) back(page, { erreur: "Formation à choisir." });
  if (reason.length < 3) back(page, { erreur: "Indiquez le motif de l'accès offert." });
  const months = Number(s(form, "months")) || null;
  try {
    await withActor(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, reason, granted_by, expires_at)
      values (${userId}, ${programId}, 'offered', ${reason}, ${admin.id}, case when ${months}::int is null then null else now() + make_interval(months => ${months}::int) end)`);
  } catch (e) {
    back(page, { erreur: dbMessage(e) });
  }
  back(page, { info: "Accès offert (tracé). Il s'ouvre si la qualification est vérifiée et la profession autorisée." });
}

export async function revokeAccess(form: FormData) {
  const admin = await requireAdmin();
  const grantId = s(form, "grant_id"), userId = s(form, "user_id"), reason = s(form, "reason");
  const page = `/admin/medecins/${userId}`;
  if (reason.length < 3) back(page, { erreur: "Indiquez le motif de la révocation." });
  try {
    await withActor(admin.id, (tx) => tx`update access_grants set revoked_at = now(), revoked_by = ${admin.id}, revoke_reason = ${reason} where id = ${grantId} and revoked_at is null`);
  } catch (e) {
    back(page, { erreur: dbMessage(e) });
  }
  back(page, { info: "Accès révoqué (définitif, tracé)." });
}

/* ── Vérificateurs ── */

export async function setVerifier(form: FormData) {
  const admin = await requireAdmin();
  const target = s(form, "user_id"), on = s(form, "on") === "1";
  if (target === admin.id) back("/admin/verificateurs", { erreur: "On ne modifie pas son propre droit de vérification." });
  try {
    await withActor(admin.id, (tx) => tx`update users set can_verify_qualifications = ${on} where id = ${target} and role = 'admin'`);
  } catch (e) {
    back("/admin/verificateurs", { erreur: dbMessage(e) });
  }
  back("/admin/verificateurs", { info: on ? "Droit de vérification accordé." : "Droit de vérification retiré." });
}

/* ── Fiche commerciale d'une formation ── */

export async function updateTraining(form: FormData) {
  const admin = await requireAdmin();
  const id = s(form, "program_id");
  const page = `/admin/parcours/${id}`;
  const professions = form.getAll("eligible_professions").map(String).filter(isProfession);
  const price = (k: string) => { const v = s(form, k).replace(",", "."); return v === "" ? null : Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v).toFixed(2) : NaN; };
  const [mad, eur, usd] = [price("price_mad"), price("price_eur"), price("price_usd")];
  if ([mad, eur, usd].some((x) => typeof x === "number")) back(page, { erreur: "Prix invalide." }); // NaN = saisie invalide
  const months = s(form, "access_months") ? Number(s(form, "access_months")) : null;
  if (months !== null && !(Number.isInteger(months) && months >= 1 && months <= 120)) back(page, { erreur: "Durée d'accès : entre 1 et 120 mois." });
  const objectives = s(form, "objectives").split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 12);
  const listed = form.get("listed") === "on";
  try {
    await withActor(admin.id, (tx) => tx`
      update programs set eligible_professions = ${professions}, tagline = ${s(form, "tagline") || null}, objectives = ${objectives},
             audience = ${s(form, "audience") || null}, prerequisites = ${s(form, "prerequisites") || null},
             price_mad = ${mad}, price_eur = ${eur}, price_usd = ${usd}, access_months = ${months}, listed = ${listed}
       where id = ${id} and kind = 'training'`);
  } catch (e) {
    back(page, { erreur: /programs_kind_rules/.test(String(e)) ? "Une formation publiée doit autoriser au moins une profession." : /programs_commercial_ok/.test(String(e)) ? "Pour apparaître au catalogue, la formation doit être publiée." : dbMessage(e) });
  }
  back(page, { info: "Fiche commerciale enregistrée." });
}
