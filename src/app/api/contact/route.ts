import { NextResponse } from "next/server";
import { resendKey, defaultFrom } from "@/lib/resend";
import { SITE_URL } from "@/lib/site";
import { sendToCrm, type CrmLead } from "@/lib/crm";
import { addToBrevo } from "@/lib/brevo";
import { contactPageContent } from "@/content/contact-page";
import { contactRules, emailPattern, isParcours, isValidPhone, whatsappNumber, type ContactField, type Parcours } from "@/lib/contact-rules";
import { guard, oneLine } from "@/lib/guard";

type ContactPayload = Partial<Record<ContactField, string>> & {
  parcours?: string;
  subject?: string; // libellé de l'objet, dans la langue du visiteur
  machineSlug?: string; // technologie d'origine (identifiant de la fiche)
  origin?: string; // page d'où vient le visiteur
  lang?: string;
  attribution?: Record<string, unknown>; // campagne d'arrivée (utm_*, gclid, fbclid, référent, page d'entrée)
  website?: string; // champ piège (doit rester vide)
  elapsed?: number; // durée de remplissage, en ms
  firstName?: string; // newsletter : prénom et nom séparés (attributs Brevo)
  lastName?: string;
};


const esc = (s = "") =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Toutes les demandes arrivent sur admin@cellulift.ma, rangées par l'étiquette en tête d'objet
 * ([DEVIS], [DÉMO], [SUPPORT], [NEWSLETTER]…) pour les filtres de la boîte de réception.
 * Une variable Vercel (adresses séparées par des virgules) redirige une famille ailleurs si besoin :
 * CONTACT_EMAIL_TO (démo, devis, expert, guide, autre), CONTACT_EMAIL_ACADEMY (masterclass),
 * CONTACT_EMAIL_SUPPORT (support technique), CONTACT_EMAIL_PARTNERSHIPS (partenariat),
 * CONTACT_EMAIL_NEWSLETTER (newsletter de l'Academy).
 * Envoi : RESEND_API_KEY (obligatoire), CONTACT_EMAIL_FROM (défaut « Site Cellulift <contact@cellulift.ma> »).
 */
const ADMIN_INBOX = "admin@cellulift.ma";
const inboxEnv = {
  main: "CONTACT_EMAIL_TO",
  academy: "CONTACT_EMAIL_ACADEMY",
  support: "CONTACT_EMAIL_SUPPORT",
  partnerships: "CONTACT_EMAIL_PARTNERSHIPS",
  newsletter: "CONTACT_EMAIL_NEWSLETTER",
} as const;

function recipients(inbox: keyof typeof inboxEnv) {
  return (process.env[inboxEnv[inbox]] || ADMIN_INBOX).split(",").map((x) => x.trim());
}

async function sendToCellulift(
  parcours: Parcours,
  body: ContactPayload,
  { to = recipients(contactRules[parcours].inbox), tag = contactRules[parcours].tag }: { to?: string[]; tag?: string } = {}
) {
  const key = resendKey();
  if (!key) {
    console.error("[contact] RESEND_API_KEY manquante dans cet environnement Vercel : demande non envoyée.");
    return false;
  }
  const wa = body.phone ? whatsappNumber(body.phone) : null;
  // [libellé, texte, lien éventuel]
  const rows: [string, string | undefined, string?][] = [
    ["Parcours", `${tag}${body.subject ? ` (${body.subject})` : ""}`],
    ["Nom", body.name],
    ["Établissement", body.organization],
    ["Téléphone", body.phone, body.phone ? `tel:${body.phone.replace(/[^\d+]/g, "")}` : undefined],
    ["WhatsApp", wa ? `wa.me/${wa}` : undefined, wa ? `https://wa.me/${wa}` : undefined],
    ["E-mail", body.email, body.email ? `mailto:${body.email}` : undefined],
    ["Ville", body.city],
    ["Activité", body.specialty],
    ["Technologie", body.machine],
    ["Fiche", body.machineSlug ? `${SITE_URL}/fr/technologies/${body.machineSlug}` : undefined, body.machineSlug ? `${SITE_URL}/fr/technologies/${body.machineSlug}` : undefined],
    ["N° de série", body.serial],
    ["Session", body.session],
    ["Page d'origine", body.origin ? `${SITE_URL}${body.origin}` : undefined],
    ["Langue", body.lang],
  ];
  const html = `
    <h2 style="font-family:Arial,sans-serif">Nouvelle demande — site Cellulift</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .filter(([, v]) => v)
        .map(
          ([k, v, href]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0">${
              href ? `<a href="${esc(href)}">${esc(v)}</a>` : esc(v)
            }</td></tr>`
        )
        .join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${esc(body.message)}</p>`;

  // Objet : [PARCOURS] Technologie — Ville — Nom (Activité)
  const subject = `[${tag}] ` + [body.machine, body.city, `${body.name}${body.specialty ? ` (${body.specialty})` : ""}`]
    .filter(Boolean)
    .join(" — ");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: defaultFrom(),
      to,
      reply_to: body.email,
      subject: oneLine(subject).slice(0, 200),
      html,
    }),
  });
  if (!res.ok) console.error("[contact] envoi Resend impossible :", res.status, await res.text());
  return res.ok;
}

const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "referent", "entree"] as const;
function attribution(body: ContactPayload) {
  const out: Record<string, string> = {};
  const a = body.attribution && typeof body.attribution === "object" ? body.attribution : {};
  for (const k of ATTR_KEYS) {
    const v = (a as Record<string, unknown>)[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 200);
  }
  return out;
}

/** Source lisible pour le CRM : la campagne quand il y en a une, sinon « Site web ». */
function sourceCrm(a: Record<string, string>) {
  const s = (a.utm_source || "").toLowerCase();
  if (a.fbclid || /facebook|instagram|meta|^fb$|^ig$/.test(s)) return /instagram|^ig$/.test(s) ? "Instagram (site)" : "Meta Ads (site)";
  if (a.gclid || /google/.test(s)) return (a.utm_medium || "").toLowerCase().includes("cpc") || a.gclid ? "Google Ads (site)" : "Google (site)";
  if (/tiktok/.test(s)) return "TikTok (site)";
  if (/linkedin/.test(s)) return "LinkedIn (site)";
  if (s) return `Site web · ${a.utm_source}`;
  return "Site web";
}

function crmLead(parcours: string, body: ContactPayload, a: Record<string, string>): CrmLead {
  return {
    nom: body.name, organisation: body.organization, telephone: body.phone, email: body.email, ville: body.city,
    specialite: body.specialty, machine: body.machine, parcours, parcours_libelle: body.subject,
    message: [body.message, body.serial ? `N° de série : ${body.serial}` : "", body.session ? `Session : ${body.session}` : ""].filter(Boolean).join("\n") || undefined,
    page: a.entree || body.origin, langue: body.lang, ...a,
    source: sourceCrm(a), // libellé de la source dans le CRM
  };
}

/** Mêmes règles que le formulaire : champs obligatoires du parcours, formats, longueurs. */
function invalid(parcours: Parcours, body: ContactPayload) {
  const rule = contactRules[parcours];
  for (const f of rule.required) if (!String(body[f] ?? "").trim()) return true;
  for (const f of rule.fields) {
    const max = f === "message" ? 5000 : 200;
    if (String(body[f] ?? "").length > max) return true;
  }
  if (!emailPattern.test(String(body.email ?? ""))) return true;
  if (!isValidPhone(String(body.phone ?? ""))) return true;
  if (!/^[a-z0-9-]{0,80}$/.test(String(body.machineSlug ?? ""))) return true;
  if (body.origin && (!String(body.origin).startsWith("/") || String(body.origin).length > 300)) return true;
  if (String(body.subject ?? "").length > 120 || String(body.lang ?? "").length > 5) return true;
  return false;
}

const newsletterSpecialties: readonly string[] = contactPageContent.fr.form.specialtyOptions;

export async function POST(request: Request) {
  const refused = guard(request, "contact");
  if (refused) return refused;

  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Robots : champ piège rempli, ou formulaire envoyé en moins de 3 secondes → réponse « ok » sans envoi.
  if (body.website || (typeof body.elapsed === "number" && body.elapsed < 3000)) {
    return NextResponse.json({ ok: true });
  }


  const attr = attribution(body);

  // Guide gratuit (page /guide) : seuls le nom et l'e-mail sont demandés.
  if (body.parcours === "guide") {
    const name = String(body.name ?? "").trim().slice(0, 200), email = String(body.email ?? "").trim().slice(0, 200);
    if (!name || !emailPattern.test(email)) return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
    const g: ContactPayload = { name, email, specialty: String(body.specialty ?? "").trim().slice(0, 200) || undefined, subject: "Guide gratuit", message: String(body.message ?? "").slice(0, 1000), lang: body.lang };
    const [mail, crm] = await Promise.all([sendToCellulift("autre", g, { tag: "GUIDE" }), sendToCrm(crmLead("guide", g, attr))]);
    return mail || crm ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  // Newsletter de la Cellulift Academy (fenêtre de la page Academy) : prénom, nom, e-mail et activité.
  // L'inscription part en [NEWSLETTER] vers admin@cellulift.ma, le CRM et la liste Brevo (parcours « newsletter-academy »),
  // l'activité dans le champ « specialite » du CRM pour segmenter les envois.
  if (body.parcours === "newsletter") {
    const name = String(body.name ?? "").trim().slice(0, 200), email = String(body.email ?? "").trim().slice(0, 200);
    const specialty = String(body.specialty ?? "").trim();
    if (!name || !emailPattern.test(email) || !newsletterSpecialties.includes(specialty)) return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
    const n: ContactPayload = { name, email, specialty, subject: "Newsletter Academy", message: "Inscription à la newsletter de la Cellulift Academy.", origin: typeof body.origin === "string" && body.origin.startsWith("/") ? body.origin.slice(0, 300) : undefined, lang: body.lang };
    const part = (v: unknown) => String(v ?? "").trim().slice(0, 100) || undefined;
    const [mail, crm, brevo] = await Promise.all([
      sendToCellulift("masterclass", n, { to: recipients("newsletter"), tag: "NEWSLETTER" }),
      sendToCrm(crmLead("newsletter-academy", n, attr)),
      addToBrevo({ email, firstName: part(body.firstName), lastName: part(body.lastName), specialty }),
    ]);
    return mail || crm || brevo ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  const parcours: Parcours = isParcours(body.parcours) ? body.parcours : "autre";
  // Seuls les champs du parcours sont gardés (un champ masqué ne part pas dans l'e-mail).
  const clean: ContactPayload = { ...body };
  for (const f of ["name", "organization", "phone", "email", "city", "specialty", "machine", "serial", "session", "message"] as ContactField[]) {
    clean[f] = contactRules[parcours].fields.includes(f) ? String(body[f] ?? "").trim() || undefined : undefined;
  }
  if (!clean.machine) clean.machineSlug = undefined;

  if (invalid(parcours, clean)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  // E-mail à l'équipe et fiche dans le CRM, en parallèle : l'un suffit pour ne rien perdre.
  const [sent, crm] = await Promise.all([sendToCellulift(parcours, clean), sendToCrm(crmLead(parcours, clean, attr))]);
  if (!sent && !crm) return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });

  return NextResponse.json({ ok: true });
}
