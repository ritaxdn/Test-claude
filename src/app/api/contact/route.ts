import { NextResponse } from "next/server";
import { resendKey, defaultFrom } from "@/lib/resend";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  subject?: string;
  message?: string;
  website?: string; // champ piège (doit rester vide)
  elapsed?: number; // durée de remplissage, en ms
}

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s = "") =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Demande de contact → e-mail à Cellulift (Resend).
 * Variables Vercel : RESEND_API_KEY (obligatoire pour l'envoi), CONTACT_EMAIL_TO (défaut cellulift@gmail.com),
 * CONTACT_EMAIL_ACADEMY (demandes « Rejoindre une masterclass », défaut cellulift@gmail.com : tant que cellulift.ma n'est pas vérifié dans Resend, seule l'adresse du compte Resend reçoit),
 * CONTACT_EMAIL_PARTNERSHIPS (demandes « Partenariat », défaut cellulift@gmail.com),
 * CONTACT_EMAIL_FROM (défaut « Cellulift <onboarding@resend.dev> », à remplacer par une adresse du domaine vérifié).
 */
// « Rejoindre une masterclass » / « Join a masterclass » → Cellulift Academy ; le reste → Cellulift.
// « Partenariat » / « Partnership » → adresse partenariats. Boîtes Gmail tant que les adresses @cellulift.ma n'existent pas.
function recipients(subject?: string) {
  const s = subject ?? "";
  const list = /masterclass/i.test(s)
    ? process.env.CONTACT_EMAIL_ACADEMY || "cellulift@gmail.com"
    : /partenariat|partnership/i.test(s)
      ? process.env.CONTACT_EMAIL_PARTNERSHIPS || "cellulift@gmail.com"
      : process.env.CONTACT_EMAIL_TO || "cellulift@gmail.com";
  return list.split(",").map((x) => x.trim());
}

async function sendToCellulift(body: ContactPayload) {
  const key = resendKey();
  if (!key) {
    // Pas de faux « Merci » : sans clé, la demande serait perdue sans que personne ne le sache.
    console.error("[contact] RESEND_API_KEY manquante dans cet environnement Vercel : demande non envoyée.");
    return false;
  }
  const rows: [string, string | undefined][] = [
    ["Nom", body.name],
    ["E-mail", body.email],
    ["Téléphone", body.phone],
    ["Activité", body.specialty],
    ["Objet", body.subject],
  ];
  const html = `
    <h2 style="font-family:Arial,sans-serif">Nouvelle demande — site Cellulift</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
        .join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${esc(body.message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: defaultFrom(),
      to: recipients(body.subject),
      reply_to: body.email,
      subject: `${body.subject || "Demande"} — ${body.name}${body.specialty ? ` (${body.specialty})` : ""}`,
      html,
    }),
  });
  if (!res.ok) console.error("[contact] envoi Resend impossible :", res.status, await res.text());
  return res.ok;
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

  const { name, email, message } = body;
  const tooLong =
    String(name ?? "").length > 120 || String(email ?? "").length > 200 || String(message ?? "").length > 5000;

  if (!name || !email || !message || !emailPattern.test(email) || tooLong) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const sent = await sendToCellulift(body);
  if (!sent) return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });

  return NextResponse.json({ ok: true });
}
