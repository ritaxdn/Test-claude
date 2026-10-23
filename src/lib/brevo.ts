/**
 * Inscription des abonnés à la newsletter dans Brevo (liste de diffusion).
 * Variables Vercel : BREVO_API_KEY (Brevo › Paramètres › Clés API) et BREVO_LIST_ID (numéro de la liste).
 * Sans clé, rien n'est envoyé. Attributs Brevo utilisés : PRENOM, NOM, SPECIALITE et SEGMENT (édition de la newsletter).
 */

// Édition de la newsletter selon l'activité choisie (mêmes valeurs que l'import des contacts du CRM).
const segments: Record<string, "MEDECINS" | "KINES" | "CENTRES"> = {
  "Médecin esthétique": "MEDECINS",
  Dermatologue: "MEDECINS",
  Gynécologue: "MEDECINS",
  "Chirurgien plasticien": "MEDECINS",
  "Chirurgien (autre spécialité)": "MEDECINS",
  "Médecin généraliste": "MEDECINS",
  Clinique: "MEDECINS",
  "Kinésithérapeute / physiothérapeute": "KINES",
  "Nutritionniste / diététicien": "CENTRES",
  "Centre / institut de beauté": "CENTRES",
};
export type BrevoContact = {
  email: string;
  firstName?: string;
  lastName?: string;
  specialty?: string;
};

/** Renvoie true si Brevo a bien enregistré le contact. Ne lève jamais d'erreur. */
export async function addToBrevo(c: BrevoContact): Promise<boolean> {
  const key = process.env.BREVO_API_KEY?.trim();
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!key || !listId) return false;
  const attributes = Object.fromEntries(
    Object.entries({
      PRENOM: c.firstName,
      NOM: c.lastName,
      SPECIALITE: c.specialty,
      SEGMENT: c.specialty ? (segments[c.specialty] ?? "AUTRES") : undefined,
    }).filter(([, v]) => v),
  );
  const send = async (withAttributes: boolean) => {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: c.email,
        listIds: [listId],
        updateEnabled: true,
        ...(withAttributes ? { attributes } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok)
      console.error("[brevo] contact refusé :", res.status, await res.text());
    return res.ok;
  };
  try {
    // Si un attribut manque dans Brevo, le contact est quand même ajouté à la liste.
    return (await send(true)) || (await send(false));
  } catch (e) {
    console.error("[brevo] envoi impossible :", e);
    return false;
  }
}
