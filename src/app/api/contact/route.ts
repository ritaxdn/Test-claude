import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  subject?: string;
  message?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s = "") =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Demande de contact → e-mail à Cellulift (Resend).
 * Variables Vercel : RESEND_API_KEY (obligatoire pour l'envoi), CONTACT_EMAIL_TO (défaut cellulift@gmail.com),
 * CONTACT_EMAIL_FROM (défaut « Cellulift <onboarding@resend.dev> », à remplacer par une adresse du domaine vérifié).
 */
async function sendToCellulift(body: ContactPayload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[contact] RESEND_API_KEY manquante : demande non envoyée par e-mail", body);
    return true;
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
      from: process.env.CONTACT_EMAIL_FROM || "Cellulift <onboarding@resend.dev>",
      to: (process.env.CONTACT_EMAIL_TO || "cellulift@gmail.com").split(",").map((s) => s.trim()),
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

  const { name, email, message } = body;

  if (!name || !email || !message || !emailPattern.test(email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const sent = await sendToCellulift(body);
  if (!sent) return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });

  return NextResponse.json({ ok: true });
}
