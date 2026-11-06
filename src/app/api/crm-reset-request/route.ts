import { NextResponse } from "next/server";
import { resendKey, defaultFrom } from "@/lib/resend";
import { guard } from "@/lib/guard";

// Un membre de l'équipe a cliqué sur « Mot de passe oublié ? » dans le CRM : on prévient
// l'administrateur par e-mail. L'admin redéfinit ensuite le mot de passe depuis la fiche du
// membre (bouton « Réinitialiser le mot de passe »). Aucune donnée sensible ici ; on répond
// toujours « ok » pour ne pas révéler si l'email existe, et on limite le débit (anti-abus).
const ADMIN_INBOX = (process.env.CONTACT_EMAIL_TO || "admin@cellulift.ma").split(",").map((s) => s.trim());
const esc = (s = "") =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const refused = guard(request, "crm-reset", 5, 10 * 60 * 1000);
  if (refused) return refused;

  let email = "";
  try {
    email = String((await request.json())?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!emailRe.test(email) || email.length > 200) return NextResponse.json({ ok: false }, { status: 422 });

  const key = resendKey();
  if (!key) {
    console.error("[crm-reset] RESEND_API_KEY manquante : notification non envoyée.");
    return NextResponse.json({ ok: true });
  }

  const html = `
    <h2 style="font-family:Arial,sans-serif">CRM — réinitialisation de mot de passe demandée</h2>
    <p style="font-family:Arial,sans-serif;font-size:14px">Un membre de l'équipe a cliqué sur « Mot de passe oublié ? » dans le CRM.</p>
    <p style="font-family:Arial,sans-serif;font-size:14px">Compte concerné : <b>${esc(email)}</b></p>
    <p style="font-family:Arial,sans-serif;font-size:14px">Pour lui redonner l'accès : ouvre le CRM → <b>Équipe</b> → la fiche de ce membre → bouton <b>« Réinitialiser le mot de passe »</b>, puis communique-lui le nouveau mot de passe.</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: defaultFrom(),
        to: ADMIN_INBOX,
        reply_to: email,
        subject: `[CRM] Réinitialisation demandée — ${email}`,
        html,
      }),
    });
    if (!res.ok) console.error("[crm-reset] envoi Resend impossible :", res.status, await res.text());
  } catch (e) {
    console.error("[crm-reset] envoi Resend impossible :", e);
  }

  return NextResponse.json({ ok: true });
}
