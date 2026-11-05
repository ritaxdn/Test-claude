import "server-only";
import { cookies } from "next/headers";

// Lien de création / réinitialisation du mot de passe à montrer une fois à l'admin.
// Jamais dans l'adresse de la page (elle finit dans l'historique du navigateur et les journaux
// du serveur) : cookie httpOnly, limité à /admin, valable 2 minutes.
const NAME = "lift_flash_link";
export async function flashLink(link: string) {
  (await cookies()).set(NAME, link, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: 120 });
}
export async function readFlashLink(): Promise<string | null> {
  const v = (await cookies()).get(NAME)?.value;
  return v && /^https?:\/\/[^\s]+\/(invitation|reinitialiser)\/[\w-]{20,}$/.test(v) ? v : null;
}
