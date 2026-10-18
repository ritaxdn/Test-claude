// Campagne d'arrivée du visiteur (utm_*, gclid, fbclid, référent externe, page d'entrée),
// gardée pour la session dans le navigateur et jointe aux formulaires : le CRM sait d'où vient chaque demande.
const KEY = "cl_attribution";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;

export function captureAttribution() {
  try {
    const url = new URL(window.location.href);
    const found: Record<string, string> = {};
    for (const p of PARAMS) {
      const v = url.searchParams.get(p);
      if (v) found[p] = v.slice(0, 200);
    }
    const stored = sessionStorage.getItem(KEY);
    // Une nouvelle campagne remplace l'ancienne ; sinon on garde la première arrivée de la session.
    if (stored && !Object.keys(found).length) return;
    let referent = "";
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin !== window.location.origin) referent = ref.hostname;
    } catch {}
    sessionStorage.setItem(KEY, JSON.stringify({ ...found, referent, entree: url.pathname }));
  } catch {}
}

export function readAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
