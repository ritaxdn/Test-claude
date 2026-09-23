import { NextResponse } from "next/server";
import { formationsPage as f } from "@/content/formations";
import { clean, sendToPractice } from "@/lib/mail";

// Inscription à la newsletter Cellulift Academy.
// Les contacts sont ajoutés à une « Audience » Resend (base de données des inscrits) :
//   RESEND_AUDIENCE_ID  identifiant de l'audience « Cellulift Academy » (Resend → Audiences)
//   RESEND_API_KEY      clé avec l'accès « Full access » (une clé « Sending access » ne peut pas gérer les contacts)
// Sans audience configurée, l'inscription est envoyée par e-mail au cabinet pour ne perdre aucun contact.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (clean(body.website)) return NextResponse.json({ ok: true }); // champ piège anti-spam

  const data = {
    firstName: clean(body.firstName, 60),
    lastName: clean(body.lastName, 60),
    email: clean(body.email).toLowerCase(),
    specialty: f.request.professions.includes(clean(body.specialty)) ? clean(body.specialty) : "",
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !body.consent) {
    return NextResponse.json({ error: "Merci de vérifier votre adresse e-mail." }, { status: 422 });
  }

  const { RESEND_API_KEY, RESEND_AUDIENCE_ID } = process.env;
  if (RESEND_API_KEY && RESEND_AUDIENCE_ID) {
    const res = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        first_name: data.firstName || undefined,
        last_name: data.lastName || undefined,
        unsubscribed: false,
      }),
    });
    // Un contact déjà inscrit n'est pas une erreur pour le visiteur.
    if (res.ok || res.status === 409) return NextResponse.json({ ok: true });
    console.error("[newsletter] Échec d'ajout du contact Resend :", res.status, await res.text());
  }

  // Repli : l'inscription est transmise au cabinet par e-mail.
  const ok = await sendToPractice({
    subject: `Newsletter ${f.newsletter.name} — nouvelle inscription — ${data.email}`,
    heading: `Nouvelle inscription à la newsletter ${f.newsletter.name}`,
    replyTo: data.email,
    rows: [
      ["E-mail", data.email],
      ["Nom", `${data.firstName} ${data.lastName}`.trim() || "—"],
      ["Spécialité", data.specialty || "—"],
    ],
    footer: "À ajouter à la liste des inscrits Cellulift Academy.",
  });
  if (!ok) return NextResponse.json({ error: "L'inscription a échoué." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
