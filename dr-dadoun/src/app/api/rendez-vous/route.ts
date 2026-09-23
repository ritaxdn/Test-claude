import { NextResponse } from "next/server";
import { booking } from "@/content/site";

// Reçoit les demandes du calendrier et les transmet au cabinet par e-mail.
// Configuration (variables d'environnement) :
//   RESEND_API_KEY     clé API https://resend.com
//   BOOKING_EMAIL_TO   adresse du secrétariat qui reçoit les demandes
//   BOOKING_EMAIL_FROM expéditeur vérifié chez Resend (ex. "Site <rdv@dr-dadoun.fr>")
// Sans configuration, la demande est seulement journalisée côté serveur.

const clean = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const allNeeds = new Set(booking.needs.flatMap((g) => g.options));

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ piège rempli : robot. On répond OK sans rien envoyer.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const data = {
    type: clean(body.type),
    date: clean(body.date, 10),
    time: clean(body.time, 5),
    firstName: clean(body.firstName),
    lastName: clean(body.lastName),
    phone: clean(body.phone, 30),
    email: clean(body.email),
    // Seuls les besoins de la liste proposée sont acceptés.
    needs: Array.isArray(body.needs)
      ? body.needs.filter((n: unknown): n is string => typeof n === "string" && allNeeds.has(n)).slice(0, 20)
      : [],
  };

  const validType = booking.types.some((t) => t.label === data.type);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(data.date) && !booking.closedDates.includes(data.date);
  const validTime = /^\d{2}:\d{2}$/.test(data.time);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!validType || !validDate || !validTime || !validEmail || !data.firstName || !data.lastName || !data.phone || !body.consent) {
    return NextResponse.json({ error: "Merci de vérifier les informations saisies." }, { status: 422 });
  }

  const [y, m, d] = data.date.split("-").map(Number);
  const when = `${new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })} à ${data.time.replace(":", "h")}`;

  const { RESEND_API_KEY, BOOKING_EMAIL_TO, BOOKING_EMAIL_FROM } = process.env;
  if (!RESEND_API_KEY || !BOOKING_EMAIL_TO || !BOOKING_EMAIL_FROM) {
    console.log("[rendez-vous] Nouvelle demande (e-mail non configuré) :", { ...data, when });
    return NextResponse.json({ ok: true });
  }

  const rows: [string, string][] = [
    ["Motif", data.type],
    ["Date souhaitée", when],
    ["Patient", `${data.firstName} ${data.lastName}`],
    ["Téléphone", data.phone],
    ["E-mail", data.email],
    ["Besoins", data.needs.length ? data.needs.join(", ") : "—"],
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: BOOKING_EMAIL_FROM,
      to: BOOKING_EMAIL_TO,
      reply_to: data.email,
      subject: `Demande de RDV — ${data.firstName} ${data.lastName} — ${when}`,
      html: `<h2>Nouvelle demande de rendez-vous</h2><table>${rows
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#8d7c72">${k}</td><td>${escape(v)}</td></tr>`)
        .join("")}</table><p>À confirmer auprès du patient.</p>`,
    }),
  });

  if (!res.ok) {
    console.error("[rendez-vous] Échec d'envoi Resend :", res.status, await res.text());
    return NextResponse.json({ error: "L'envoi a échoué." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
