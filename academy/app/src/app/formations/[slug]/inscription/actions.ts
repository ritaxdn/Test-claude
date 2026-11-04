"use server";
import { createHash, randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { putDocument } from "@/lib/storage";
import { sendMail, notifyTeam } from "@/lib/mail";
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
  if (values.full_name.length < 2 || values.full_name.length > 200) return fail("Indiquez votre nom complet.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email) || values.email.length > 200) return fail("Adresse e-mail invalide.");
  if (values.phone && !/^[\d\s+().-]{6,30}$/.test(values.phone)) return fail("Numéro de téléphone invalide.");
  if (!COUNTRIES.some(([c]) => c === values.country)) return fail("Choisissez votre pays.");
  if (!isProfession(values.profession)) return fail("Choisissez votre profession.");
  if (!p.eligible_professions.includes(values.profession))
    return fail(`Cette formation est réservée aux professions suivantes : ${p.eligible_professions.map(professionLabel).join(", ")}.`);
  if (values.professional_id.length < 3 || values.professional_id.length > 100) return fail("Indiquez votre numéro d'inscription à l'Ordre (ou équivalent).");
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
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "local";
  const ipHash = createHash("sha256").update(`${process.env.SESSION_SECRET ?? "lift"}:${ip}`).digest("hex");
  const [{ byIp }] = await sql<{ byIp: number }[]>`select count(*)::int as "byIp" from enrollment_requests where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'`;
  const [{ byMail }] = await sql<{ byMail: number }[]>`select count(*)::int as "byMail" from enrollment_requests where email = ${values.email} and program_id = ${p.id} and created_at > now() - interval '1 day'`;
  if (byIp >= 5 || byMail >= 3) return fail("Trop de demandes en peu de temps. Merci de réessayer plus tard.");

  const id = await sql.begin(async (tx) => {
    const [r] = await tx<{ id: string }[]>`
      insert into enrollment_requests (program_id, full_name, email, phone, country, profession, professional_id, message, terms_version, ip_hash)
      values (${p.id}, ${values.full_name}, ${values.email}, ${values.phone || null}, ${values.country}, ${values.profession}, ${values.professional_id}, ${values.message || null}, ${TERMS_VERSION}, ${ipHash})
      returning id`;
    if (proof) {
      const key = `${r.id}/${randomUUID()}.${proof.mime === "application/pdf" ? "pdf" : proof.mime === "image/png" ? "png" : "jpg"}`;
      await putDocument(key, proof.data, proof.mime, "proofs");
      await tx`insert into qualification_documents (request_id, storage_key, mime_type, size_bytes, sha256)
               values (${r.id}, ${key}, ${proof.mime}, ${proof.data.length}, ${createHash("sha256").update(proof.data).digest("hex")})`;
    }
    return r.id;
  });

  await sendMail(values.email, "Votre demande d'inscription LIFT", [
    `Bonjour ${values.full_name},`,
    `Nous avons bien reçu votre demande d'inscription à la formation « ${p.title} ».`,
    "L'équipe CELLULIFT Academy vérifie votre qualification professionnelle. Vous recevrez ensuite, par e-mail, les modalités de paiement par virement.",
    "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.",
  ]);
  await notifyTeam(`Nouvelle demande : ${p.title}`, [`${values.full_name} (${professionLabel(values.profession)}, ${values.country}) — ${values.email}`, `Demande ${id}${proof ? " · justificatif joint" : ""}`]);
  redirect(`/formations/${slug}/inscription/merci`);
}
