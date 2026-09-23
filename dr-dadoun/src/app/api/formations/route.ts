import { NextResponse } from "next/server";
import { formationsPage as f } from "@/content/formations";
import { clean, sendToPractice } from "@/lib/mail";

// Reçoit les demandes des médecins (page /formations) et les transmet au cabinet.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (clean(body.website)) return NextResponse.json({ ok: true }); // champ piège anti-spam

  const courseTitles = new Map(f.courses.map((c) => [c.slug, c.title]));
  const kind = f.request.kinds.find((k) => k.id === clean(body.kind));
  const courses: string[] = Array.isArray(body.courses)
    ? body.courses.filter((c: unknown): c is string => typeof c === "string" && courseTitles.has(c))
    : [];
  const data = {
    firstName: clean(body.firstName),
    lastName: clean(body.lastName),
    profession: f.request.professions.includes(clean(body.profession)) ? clean(body.profession) : "",
    city: clean(body.city, 80),
    email: clean(body.email),
    phone: clean(body.phone, 30),
    message: clean(body.message, 800),
  };

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!kind || courses.length === 0 || !data.firstName || !data.lastName || !data.profession || !validEmail || !body.consent) {
    return NextResponse.json({ error: "Merci de vérifier les informations saisies." }, { status: 422 });
  }

  const names = courses.map((c) => courseTitles.get(c)!).join(", ");
  const ok = await sendToPractice({
    subject: `Formation — ${kind.label} — ${data.firstName} ${data.lastName}`,
    heading: "Nouvelle demande de formation",
    replyTo: data.email,
    rows: [
      ["Demande", kind.label],
      ["Formation(s)", names],
      ["Nom", `${data.firstName} ${data.lastName}`],
      ["Profession", data.profession],
      ["Ville / pays", data.city || "—"],
      ["E-mail", data.email],
      ["Téléphone", data.phone || "—"],
      ["Message", data.message || "—"],
    ],
    footer: "Répondre directement à cet e-mail pour contacter le médecin.",
  });
  if (!ok) return NextResponse.json({ error: "L'envoi a échoué." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
