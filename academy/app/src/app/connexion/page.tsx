import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/AuthFrame";
import { currentUser } from "@/lib/auth";
import { login } from "./actions";

export const metadata: Metadata = { title: "Connexion" };
const ERR: Record<string, string> = {
  identifiants: "E-mail ou mot de passe incorrect.",
  bloque: "Trop de tentatives. Réessayez dans 15 minutes ou réinitialisez votre mot de passe.",
};

export default async function Connexion({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  if (await currentUser()) redirect("/");
  const { erreur } = await searchParams;
  return (
    <AuthFrame>
      <div className="glass auth-card stack">
        <span className="eyebrow">Connexion</span>
        <h2 className="display h2">Bon retour</h2>
        {erreur && ERR[erreur] && <p className="alert err" role="alert">{ERR[erreur]}</p>}
        <form action={login} className="stack" style={{ gap: 14 }}>
          <div className="field"><label htmlFor="email">E-mail</label><input className="input" id="email" name="email" type="email" autoComplete="email" required /></div>
          <div className="field"><label htmlFor="password">Mot de passe</label><input className="input" id="password" name="password" type="password" autoComplete="current-password" required /></div>
          <button className="btn solid" type="submit" style={{ minHeight: 46 }}>Se connecter</button>
        </form>
        <p className="small muted"><a href="/mot-de-passe-oublie">Mot de passe oublié ?</a></p>
        <hr className="signal" />
        <p className="small muted">L'accès est réservé aux praticiens invités par CELLULIFT après l'installation de leur machine. Vous n'avez pas reçu d'invitation ? Contactez votre conseiller CELLULIFT.</p>
      </div>
    </AuthFrame>
  );
}
