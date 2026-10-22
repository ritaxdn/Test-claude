import { NextResponse } from "next/server";
import { resendKey, defaultFrom } from "@/lib/resend";
import { SITE_URL } from "@/lib/site";
import { sendToCrm, type CrmLead } from "@/lib/crm";
import { contactRules, emailPattern, isParcours, isValidPhone, whatsappNumber, type ContactField, type Parcours } from "@/lib/contact-rules";

type ContactPayload = Partial<Record<ContactField, string>> & {
  parcours?: string;
  subject?: string; // libellé de l'objet, dans la langue du visiteur
  machineSlug?: string; // technologie d'origine (identifiant de la fiche)
  origin?: string; // page d'où vient le visiteur
  lang?: string;
  attribution?: Record<string, unknown>; // campagne d'arrivée (utm_*, gclid, fbclid, référent, page d'entrée)
  website?: string; // champ piège (doit rester vide)
  elapsed?: number; // durée de remplissage, en ms
};

// Limite d'envois par adresse IP (mémoire de l'instance : suffisant contre les rafales de spam).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s = "") =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Boîte de réception selon le parcours (variables Vercel, adresses séparées par des virgules) :
 * CONTACT_EMAIL_TO (démo, devis, expert, autre — défaut cellulift@gmail.com),
 * CONTACT_EMAIL_ACADEMY (masterclass — défaut cellulift.academy1@gmail.com + cellulift@gmail.com),
 * CONTACT_EMAIL_SUPPORT (support technique — défaut cellulift@gmail.com, à remplacer par l'adresse SAV le moment venu),
 * CONTACT_EMAIL_PARTNERSHIPS (partenariat — défaut cellulift@gmail.com).
 * Envoi : RESEND_API_KEY (obligatoire), CONTACT_EMAIL_FROM (défaut « Site Cellulift <contact@cellulift.ma> »).
 */
function recipients(parcours: Parcours) {
  const inbox = contactRules[parcours].inbox;
  const list =
    inbox === "academy"
      ? process.env.CONTACT_EMAIL_ACADEMY || "cellulift.academy1@gmail.com, cellulift@gmail.com"
      : inbox === "support"
        ? process.env.CONTACT_EMAIL_SUPPORT || "cellulift@gmail.com"
        : inbox === "partnerships"
          ? process.env.CONTACT_EMAIL_PARTNERSHIPS || "cellulift@gmail.com"
          : process.env.CONTACT_EMAIL_TO || "cellulift@gmail.com";
  return list.split(",").map((x) => x.trim());
}

async function sendToCellulift(parcours: Parcours, body: ContactPayload) {
  const key = resendKey();
  if (!key) {
    console.error("[contact] RESEND_API_KEY manquante dans cet environnement Vercel : demande non envoyée.");
    return false;
  }
  const rule = contactRules[parcours];
  const wa = body.phone ? whatsappNumber(body.phone) : null;
  // [libellé, texte, lien éventuel]
  const rows: [string, string | undefined, string?][] = [
    ["Parcours", `${rule.tag}${body.subject ? ` (${body.subject})` : ""}`],
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

  // Objet : PARCOURS — Technologie — Ville — Nom (Activité)
  const subject = [rule.tag, body.machine, body.city, `${body.name}${body.specialty ? ` (${body.specialty})` : ""}`]
    .filter(Boolean)
    .join(" — ");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: defaultFrom(),
      to: recipients(parcours),
      reply_to: body.email,
      subject,
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

export async function POST(request: Request) {
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

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const attr = attribution(body);

  // Guide gratuit (page /guide) : seuls le nom et l'e-mail sont demandés.
  if (body.parcours === "guide") {
    const name = String(body.name ?? "").trim().slice(0, 200), email = String(body.email ?? "").trim().slice(0, 200);
    if (!name || !emailPattern.test(email)) return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
    const g: ContactPayload = { name, email, specialty: String(body.specialty ?? "").trim().slice(0, 200) || undefined, subject: "Guide gratuit", message: String(body.message ?? "").slice(0, 1000), lang: body.lang };
    const [mail, crm] = await Promise.all([sendToCellulift("autre", g), sendToCrm(crmLead("guide", g, attr))]);
    return mail || crm ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  // Newsletter de la Cellulift Academy (fenêtre de la page Academy) : prénom, nom et e-mail.
  // L'inscription part vers la boîte de l'Academy et le CRM (parcours « newsletter-academy »).
  if (body.parcours === "newsletter") {
    const name = String(body.name ?? "").trim().slice(0, 200), email = String(body.email ?? "").trim().slice(0, 200);
    if (!name || !emailPattern.test(email)) return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
    const n: ContactPayload = { name, email, subject: "Newsletter Academy", message: "Inscription à la newsletter de la Cellulift Academy.", origin: typeof body.origin === "string" && body.origin.startsWith("/") ? body.origin.slice(0, 300) : undefined, lang: body.lang };
    const [mail, crm] = await Promise.all([sendToCellulift("masterclass", n), sendToCrm(crmLead("newsletter-academy", n, attr))]);
    return mail || crm ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
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
