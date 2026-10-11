import { NextResponse } from "next/server";
import { resendKey, defaultFrom } from "@/lib/resend";
import { SITE_URL } from "@/lib/site";
import { contactRules, emailPattern, isParcours, isValidPhone, whatsappNumber, type ContactField, type Parcours } from "@/lib/contact-rules";

type ContactPayload = Partial<Record<ContactField, string>> & {
  parcours?: string;
  subject?: string; // libellé de l'objet, dans la langue du visiteur
  machineSlug?: string; // technologie d'origine (identifiant de la fiche)
  origin?: string; // page d'où vient le visiteur
  lang?: string;
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

  const sent = await sendToCellulift(parcours, clean);
  if (!sent) return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });

  return NextResponse.json({ ok: true });
}
