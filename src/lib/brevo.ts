/**
 * Inscription des abonnés à la newsletter dans Brevo (liste de diffusion).
 * Variables Vercel : BREVO_API_KEY (Brevo › Paramètres › Clés API) et BREVO_LIST_ID (numéro de la liste).
 * Sans clé, rien n'est envoyé. Attributs Brevo utilisés : PRENOM, NOM, SPECIALITE (à créer s'ils n'existent pas).
 */
export type BrevoContact = { email: string; firstName?: string; lastName?: string; specialty?: string };

/** Renvoie true si Brevo a bien enregistré le contact. Ne lève jamais d'erreur. */
export async function addToBrevo(c: BrevoContact): Promise<boolean> {
  const key = process.env.BREVO_API_KEY?.trim();
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!key || !listId) return false;
  const attributes = Object.fromEntries(
    Object.entries({ PRENOM: c.firstName, NOM: c.lastName, SPECIALITE: c.specialty }).filter(([, v]) => v)
  );
  const send = async (withAttributes: boolean) => {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({ email: c.email, listIds: [listId], updateEnabled: true, ...(withAttributes ? { attributes } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[brevo] contact refusé :", res.status, await res.text());
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
