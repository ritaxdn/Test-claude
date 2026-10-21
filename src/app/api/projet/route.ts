import { NextResponse } from "next/server";
import { resendKey, defaultFrom } from "@/lib/resend";
import { SITE_URL } from "@/lib/site";
import { sendToCrm, type CrmLead } from "@/lib/crm";
import { emailPattern, isValidPhone, whatsappNumber } from "@/lib/contact-rules";
import { isJourneyChoice, journeyLabel, journeyMode, type ProjectLeadInput } from "@/lib/project-journey";

// Parcours « Développons votre projet ensemble ».
// Mode prototype (par défaut) : la demande est validée et la notification préparée, mais rien n'est envoyé
// (ni e-mail, ni CRM). L'envoi réel n'est actif qu'avec NEXT_PUBLIC_PROJECT_JOURNEY_MODE=live, après validation.

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

const esc = (s = "") => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "referent", "entree"] as const;
function attribution(a: unknown) {
  const out: Record<string, string> = {};
  if (!a || typeof a !== "object") return out;
  for (const k of ATTR_KEYS) {
    const v = (a as Record<string, unknown>)[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 200);
  }
  return out;
}

/** Source lisible pour le CRM (même logique que le formulaire de contact). */
function source(a: Record<string, string>) {
  const s = (a.utm_source || "").toLowerCase();
  if (a.fbclid || /facebook|instagram|meta|^fb$|^ig$/.test(s)) return /instagram|^ig$/.test(s) ? "Instagram (site)" : "Meta Ads (site)";
  if (a.gclid || /google/.test(s)) return (a.utm_medium || "").toLowerCase().includes("cpc") || a.gclid ? "Google Ads (site)" : "Google (site)";
  if (s) return `Site web · ${a.utm_source}`;
  return "Site web";
}

/** Demande validée et normalisée, ou null si invalide. */
function validate(body: ProjectLeadInput) {
  const lead = {
    profil: body.profil,
    besoin: body.besoin,
    domaine: body.domaine,
    name: str(body.name),
    phone: str(body.phone, 40),
    email: str(body.email),
    city: str(body.city),
    organization: str(body.organization) || undefined,
    origin: str(body.origin, 300),
    lang: body.lang === "en" ? ("en" as const) : ("fr" as const),
  };
  if (!isJourneyChoice("profil", lead.profil) || !isJourneyChoice("besoin", lead.besoin) || !isJourneyChoice("domaine", lead.domaine)) return null;
  if (!lead.name || !lead.city || !emailPattern.test(lead.email) || !isValidPhone(lead.phone)) return null;
  if (body.consent !== true) return null;
  if (lead.origin && !lead.origin.startsWith("/")) return null;
  return lead as typeof lead & { profil: string; besoin: string; domaine: string };
}

export async function POST(request: Request) {
  let body: ProjectLeadInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Robots : champ piège rempli ou parcours terminé en moins de 4 secondes → « ok » sans traitement.
  if (body.website || (typeof body.elapsed === "number" && body.elapsed < 4000)) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const lead = validate(body);
  if (!lead) return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });

  // Libellés en français pour l'équipe, quelle que soit la langue du visiteur.
  const profil = journeyLabel("profil", lead.profil, "fr");
  const besoin = journeyLabel("besoin", lead.besoin, "fr");
  const domaine = journeyLabel("domaine", lead.domaine, "fr");
  const attr = attribution(body.attribution);
  const wa = whatsappNumber(lead.phone);

  // Fiche CRM (fonction recevoir_lead existante) : statut initial « nouveau », source et page d'origine.
  const crm: CrmLead = {
    nom: lead.name,
    organisation: lead.organization,
    telephone: lead.phone,
    email: lead.email,
    ville: lead.city,
    specialite: profil,
    parcours: "projet",
    parcours_libelle: `${besoin} · ${domaine}`,
    message: `Profil : ${profil}\nBesoin : ${besoin}\nDomaine : ${domaine}`,
    page: lead.origin || attr.entree,
    langue: lead.lang,
    ...attr,
    source: source(attr),
  };

  // E-mail à l'équipe : objet « PROJET — Besoin — Domaine — Ville — Nom (Profil) ».
  const subject = ["PROJET", besoin, domaine, lead.city, `${lead.name} (${profil})`].join(" — ");
  const rows: [string, string | undefined, string?][] = [
    ["Profil", profil],
    ["Besoin", besoin],
    ["Domaine", domaine],
    ["Nom", lead.name],
    ["Établissement", lead.organization],
    ["Téléphone", lead.phone, `tel:${lead.phone.replace(/[^\d+]/g, "")}`],
    ["WhatsApp", wa ? `wa.me/${wa}` : undefined, wa ? `https://wa.me/${wa}` : undefined],
    ["E-mail", lead.email, `mailto:${lead.email}`],
    ["Ville", lead.city],
    ["Page d'origine", lead.origin ? `${SITE_URL}${lead.origin}` : undefined],
    ["Source", crm.source],
    ["Langue", lead.lang],
  ];
  const html = `<h2 style="font-family:Arial,sans-serif">Nouveau projet — site Cellulift</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
      .filter(([, v]) => v)
      .map(([k, v, href]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0">${href ? `<a href="${esc(href)}">${esc(v)}</a>` : esc(v)}</td></tr>`)
      .join("")}</table>`;

  if (journeyMode !== "live") {
    // Prototype : aucun envoi. L'aperçu permet de valider le contenu de la notification et de la fiche CRM.
    return NextResponse.json({ ok: true, mode: "prototype", preview: { subject, fields: rows.filter(([, v]) => v).map(([k, v]) => [k, v]), crm } });
  }

  const key = resendKey();
  const mail = key
    ? fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: defaultFrom(),
          to: (process.env.CONTACT_EMAIL_TO || "cellulift@gmail.com").split(",").map((x) => x.trim()),
          reply_to: lead.email,
          subject,
          html,
        }),
      })
        .then((r) => r.ok)
        .catch(() => false)
    : Promise.resolve(false);
  const [sent, saved] = await Promise.all([mail, sendToCrm(crm)]);
  if (!sent && !saved) return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true, mode: "live" });
}
