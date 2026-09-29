/**
 * Clé Resend lue depuis Vercel, nettoyée des erreurs de collage fréquentes
 * (espaces, retours à la ligne, guillemets autour de la valeur).
 */
export function resendKey(): string | undefined {
  const raw = process.env.RESEND_API_KEY;
  if (!raw) return undefined;
  const key = raw.trim().replace(/^["'`]+|["'`]+$/g, "").trim();
  return key || undefined;
}

/** Diagnostic sans jamais exposer la clé : présence, forme, et nettoyage nécessaire. */
export function resendKeyInfo() {
  const raw = process.env.RESEND_API_KEY;
  const key = resendKey();
  return {
    present: !!raw,
    startsWithRe: !!key?.startsWith("re_"),
    length: key?.length ?? 0,
    neededCleanup: !!raw && raw !== key,
  };
}

export const defaultFrom = () => process.env.CONTACT_EMAIL_FROM || "Cellulift <onboarding@resend.dev>";
