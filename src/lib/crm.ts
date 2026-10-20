/**
 * Envoi des demandes du site vers le CRM Cellulift (Supabase, fonction recevoir_lead).
 * La clé de la source « Site web » se crée dans le CRM (Réglages › Leads entrants) et se colle
 * dans Vercel sous CRM_LEADS_KEY. Sans clé, rien n'est envoyé et l'e-mail part comme avant.
 */
const CRM_URL = "https://igfgqfwkhyonptbtrywl.supabase.co";
// Clé publique Supabase (déjà visible dans la page du CRM) : elle n'ouvre que ce que la base autorise.
const CRM_PUBLIC_KEY = "sb_publishable_ITGBRytbM0ve68y6U0TIiw_bTPWQ2xJ";

export type CrmLead = {
  source?: string;
  entree?: string;
  nom?: string;
  organisation?: string;
  telephone?: string;
  email?: string;
  ville?: string;
  specialite?: string;
  machine?: string;
  message?: string;
  parcours?: string;
  parcours_libelle?: string;
  page?: string;
  langue?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  referent?: string;
  consentement_tel?: boolean; // accord explicite pour être recontacté par téléphone / WhatsApp
  consentement_texte?: string;
  consentement_le?: string;
};

function crmKey(): string | undefined {
  const raw = process.env.CRM_LEADS_KEY;
  if (!raw) return undefined;
  return raw.trim().replace(/^["'`]+|["'`]+$/g, "").trim() || undefined;
}

/** Renvoie true si le CRM a bien enregistré la demande. Ne lève jamais d'erreur. */
export async function sendToCrm(lead: CrmLead): Promise<boolean> {
  const key = crmKey();
  if (!key) return false;
  try {
    const res = await fetch(`${CRM_URL}/rest/v1/rpc/recevoir_lead`, {
      method: "POST",
      headers: { apikey: CRM_PUBLIC_KEY, Authorization: `Bearer ${CRM_PUBLIC_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_cle: key, p_lead: lead }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[crm] lead refusé :", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[crm] envoi impossible :", e);
    return false;
  }
}
