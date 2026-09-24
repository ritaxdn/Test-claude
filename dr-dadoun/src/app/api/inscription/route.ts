import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { formationsPage as f } from "@/content/formations";
import { clean, escapeHtml, sendEmail, sendToPractice } from "@/lib/mail";
import { getSession, registrationEnabled, sessionTitle } from "@/lib/sessions";

// Inscription en ligne à une session de formation.
// Enregistre le participant dans l'onglet « Inscriptions » du Google Sheet (script Google,
// voir docs/inscriptions-apps-script.js), puis prévient le cabinet et le participant par e-mail.

const errors: Record<string, [string, number]> = {
  full: ["Cette session est complète.", 409],
  already: ["Vous êtes déjà inscrit(e) à cette session.", 409],
  not_found: ["Cette session n'existe plus.", 404],
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  if (clean(body.website)) return NextResponse.json({ ok: true });
  if (!registrationEnabled()) {
    return NextResponse.json({ error: "Les inscriptions en ligne ne sont pas encore ouvertes." }, { status: 503 });
  }

  const data = {
    eventId: clean(body.eventId, 60),
    firstName: clean(body.firstName),
    lastName: clean(body.lastName),
    profession: clean(body.profession, 60),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone, 30),
    city: clean(body.city, 60),
    ordre: clean(body.ordre, 30),
  };
  const valid =
    data.eventId &&
    data.firstName &&
    data.lastName &&
    data.phone &&
    f.request.professions.includes(data.profession) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    body.consent;
  if (!valid) return NextResponse.json({ error: "Merci de vérifier les informations saisies." }, { status: 422 });

  const session = await getSession(data.eventId);
  if (!session) return NextResponse.json({ error: errors.not_found[0] }, { status: 404 });
  if (session.status === "full") return NextResponse.json({ error: errors.full[0] }, { status: 409 });

  // Enregistrement dans le Google Sheet (le script vérifie les places et les doublons).
  let result: { ok?: boolean; error?: string; remaining?: number | null };
  try {
    const res = await fetch(process.env.FORMATIONS_SCRIPT_URL!, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ key: process.env.FORMATIONS_SCRIPT_KEY, ...data }),
      cache: "no-store",
    });
    result = await res.json();
  } catch (e) {
    console.error("[inscription] Script Google inaccessible :", e);
    return NextResponse.json({ error: "L'inscription n'a pas pu être enregistrée." }, { status: 502 });
  }
  if (!result.ok) {
    const [message, status] = errors[result.error ?? ""] ?? ["L'inscription n'a pas pu être enregistrée.", 502];
    return NextResponse.json({ error: message }, { status });
  }

  // Les compteurs de places se mettent à jour sur le site.
  revalidatePath("/formations");
  if (session.course) revalidatePath(`/formations/${session.course}`);

  const title = sessionTitle(session);
  await sendToPractice({
    subject: `Inscription formation — ${title} — ${data.firstName} ${data.lastName}`,
    heading: "Nouvelle inscription à une formation",
    rows: [
      ["Formation", title],
      ["Dates", session.date],
      ["Lieu", session.place],
      ["Participant", `${data.firstName} ${data.lastName}`],
      ["Spécialité", data.profession],
      ["E-mail", data.email],
      ["Téléphone", data.phone],
      ["Ville", data.city || "—"],
      ["N° d'Ordre", data.ordre || "—"],
      ["Places restantes", result.remaining == null ? "—" : String(result.remaining)],
    ],
    replyTo: data.email,
    footer: "La liste complète des inscrits est dans l'onglet « Inscriptions » du Google Sheet.",
  });
  await sendEmail({
    to: data.email,
    subject: `Votre inscription — ${title}`,
    html: `<p>Bonjour ${escapeHtml(data.firstName)},</p>
<p>Votre inscription à <strong>${escapeHtml(title)}</strong> (${escapeHtml(session.date)}, ${escapeHtml(session.place)}) est bien enregistrée.</p>
<p>Le cabinet vous contactera pour les modalités pratiques.</p>
<p>Dr Dadoun</p>`,
  });

  return NextResponse.json({ ok: true, remaining: result.remaining ?? null });
}
