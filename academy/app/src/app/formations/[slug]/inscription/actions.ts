"use server";
import { createHash, randomUUID, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { putDocument, deleteDocument } from "@/lib/storage";
import { sendMail } from "@/lib/mail";
import { isProfession, professionLabel, COUNTRIES } from "@/lib/professions";

export type FormState = { error?: string; values?: Record<string, string> };
const TERMS_VERSION = process.env.LIFT_TERMS_VERSION ?? "brouillon-2026-11";
const MAX_PROOF = 5 * 1024 * 1024;

/** Type réel du fichier, d'après ses premiers octets (jamais d'après son nom). */
function sniff(b: Buffer): "application/pdf" | "image/jpeg" | "image/png" | null {
  if (b.subarray(0, 5).toString("latin1") === "%PDF-") return "application/pdf";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  return null;
}

export async function requestEnrollment(_prev: FormState, form: FormData): Promise<FormState> {
  const v = (k: string) => String(form.get(k) ?? "").trim();
  const values = { full_name: v("full_name"), email: v("email").toLowerCase(), phone: v("phone"), country: v("country"), profession: v("profession"), professional_id: v("professional_id"), message: v("message") };
  const fail = (error: string): FormState => ({ error, values });
  const slug = v("slug");

  // Robots : champ piège rempli ou formulaire envoyé en moins de 3 s → réponse « reçue » sans rien enregistrer.
  if (v("website") || Date.now() - Number(v("started")) < 3000) redirect(`/formations/${slug}/inscription/merci`);

  const [p] = await sql<{ id: string; title: string; eligible_professions: string[] }[]>`
    select id, title, eligible_professions from programs where slug = ${slug} and kind = 'training' and published and listed`;
  if (!p) return fail("Cette formation n'est pas ouverte aux inscriptions.");
  // Nom : lettres, espaces et ponctuation de nom uniquement (pas de lien ni de texte libre détourné).
  if (values.full_name.length < 2 || values.full_name.length > 120 || !/^[\p{L}][\p{L}\p{M} .'’-]*$/u.test(values.full_name)) return fail("Indiquez votre nom complet (lettres uniquement).");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email) || values.email.length > 200) return fail("Adresse e-mail invalide.");
  if (values.phone && !/^[\d\s+().-]{6,30}$/.test(values.phone)) return fail("Numéro de téléphone invalide.");
  if (!COUNTRIES.some(([c]) => c === values.country)) return fail("Choisissez votre pays.");
  if (!isProfession(values.profession)) return fail("Choisissez votre profession.");
  if (!p.eligible_professions.includes(values.profession))
    return fail(`Cette formation est réservée aux professions suivantes : ${p.eligible_professions.map(professionLabel).join(", ")}.`);
  if (values.professional_id.length < 3 || values.professional_id.length > 60 || !/^[\p{L}\p{N} ./-]+$/u.test(values.professional_id)) return fail("Indiquez votre numéro d'inscription à l'Ordre (ou équivalent).");
  if (values.message.length > 1000) return fail("Message trop long (1 000 caractères maximum).");
  if (form.get("consent") !== "on") return fail("Merci d'accepter le traitement de votre demande.");

  let proof: { data: Buffer; mime: "application/pdf" | "image/jpeg" | "image/png" } | null = null;
  const file = form.get("proof");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_PROOF) return fail("Justificatif trop lourd (5 Mo maximum).");
    const data = Buffer.from(await file.arrayBuffer());
    const mime = sniff(data);
    if (!mime) return fail("Justificatif : formats acceptés PDF, JPEG ou PNG.");
    proof = { data, mime };
  }

  // Limites de fréquence : 5 demandes par heure et par connexion, 3 par jour pour une même adresse et formation.
  const h = await headers();
  // IP : en-têtes posés par l'hébergeur (non falsifiables) d'abord ; x-forwarded-for en dernier recours.
  const ip = h.get("x-vercel-forwarded-for") ?? h.get("x-real-ip") ?? ((h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local");
  const ipHash = createHash("sha256").update(`${process.env.SESSION_SECRET ?? "lift"}:${ip}`).digest("hex");
  // Plafond global (attaque répartie sur de nombreuses adresses) : 300 demandes par heure. Avant l'ouverture, un
  // test anti-robot (type Turnstile) doit compléter ce plafond, qu'une attaque répartie peut sinon saturer.
  const [{ total }] = await sql<{ total: number }[]>`select count(*)::int as total from enrollment_requests where created_at > now() - interval '1 hour'`;
  if (total >= 300) return fail("Le service reçoit beaucoup de demandes. Merci de réessayer dans une heure.");
  const [{ byIp }] = await sql<{ byIp: number }[]>`select count(*)::int as "byIp" from enrollment_requests where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'`;
  const [{ byMail }] = await sql<{ byMail: number }[]>`select count(*)::int as "byMail" from enrollment_requests where email = ${values.email} and program_id = ${p.id} and created_at > now() - interval '1 day'`;
  if (byIp >= 5 || byMail >= 3) return fail("Trop de demandes en peu de temps. Merci de réessayer plus tard.");
  // Doublon : une demande en cours ou un accès actif pour la même adresse et la même formation.
  const [dup] = await sql<{ x: number }[]>`
    select 1 as x from enrollment_requests r left join orders o on o.id = r.order_id
     where r.email = ${values.email} and r.program_id = ${p.id} and r.created_at > now() - interval '30 days'
       -- une demande non confirmée dont le lien a expiré ne bloque personne (sinon un tiers pourrait
       -- empêcher un prospect de s'inscrire en déposant une demande à son adresse)
       and ((r.status = 'new' and (r.email_confirmed_at is not null or r.confirm_expires_at > now()))
            or (r.status = 'approved' and o.status = 'pending'))
    union all
    select 1 from access_grants g join users u on u.id = g.user_id
     where u.email = ${values.email} and g.program_id = ${p.id} and g.revoked_at is null and (g.expires_at is null or g.expires_at > now())
    limit 1`;
  if (dup) return fail("Une demande est déjà en cours (ou un accès est déjà ouvert) pour cette adresse et cette formation. Vérifiez vos e-mails.");

  // Confirmation de l'adresse : jeton aléatoire (seule son empreinte est stockée), valable 48 h.
  const confirmToken = randomBytes(32).toString("base64url");
  const marketing = form.get("marketing") === "on";
  let uploadedKey: string | null = null;
  try {
    await sql.begin(async (tx) => {
      const [r] = await tx<{ id: string }[]>`
        insert into enrollment_requests (program_id, full_name, email, phone, country, profession, professional_id, message, terms_version, ip_hash,
                                         confirm_token_hash, confirm_expires_at, marketing_consent_at)
        values (${p.id}, ${values.full_name}, ${values.email}, ${values.phone || null}, ${values.country}, ${values.profession}, ${values.professional_id}, ${values.message || null}, ${TERMS_VERSION}, ${ipHash},
                ${createHash("sha256").update(confirmToken).digest("hex")}, now() + interval '48 hours', ${marketing ? new Date() : null})
        returning id`;
      if (proof) {
        const key = `${r.id}/${randomUUID()}.${proof.mime === "application/pdf" ? "pdf" : proof.mime === "image/png" ? "png" : "jpg"}`;
        await putDocument(key, proof.data, proof.mime, "proofs");
        uploadedKey = key;
        await tx`insert into qualification_documents (request_id, storage_key, mime_type, size_bytes, sha256)
                 values (${r.id}, ${key}, ${proof.mime}, ${proof.data.length}, ${createHash("sha256").update(proof.data).digest("hex")})`;
      }
      return r.id;
    });
  } catch (e) {
    // Rien n'a été enregistré : on efface aussi le fichier déjà déposé (pas de justificatif orphelin).
    if (uploadedKey) await deleteDocument(uploadedKey, "proofs").catch(() => {});
    console.error("[inscription] échec d'enregistrement", e instanceof Error ? e.message : e);
    return fail("Votre demande n'a pas pu être enregistrée. Merci de réessayer.");
  }

  // Aucun texte saisi par le visiteur dans cet e-mail : il part vers une adresse non encore vérifiée.
  const base = (process.env.APP_URL ?? "http://localhost:3100").replace(/\/$/, "");
  await sendMail(values.email, "Confirmez votre demande d'inscription LIFT", [
    "Bonjour,",
    `Une demande d'inscription à la formation « ${p.title} » a été faite avec cette adresse e-mail.`,
    "Confirmez-la pour qu'elle soit transmise à l'équipe CELLULIFT Academy (lien valable 48 heures).",
    "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : elle ne sera pas traitée.",
  ], { label: "Confirmer ma demande", href: `${base}/formations/confirmer/${confirmToken}` });
  redirect(`/formations/${slug}/inscription/merci`);
}
