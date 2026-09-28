/**
 * Événements Google Analytics. Sans effet tant que GA n'est pas chargé (pas d'identifiant ou cookies refusés).
 * Aucune donnée personnelle n'est envoyée (ni nom, ni e-mail, ni téléphone).
 */
type Gtag = (command: "event", name: string, params?: Record<string, string | number>) => void;

export function track(name: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
