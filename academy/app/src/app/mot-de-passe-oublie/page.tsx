import type { Metadata } from "next";
import { AuthFrame } from "@/components/AuthFrame";
import { requestReset } from "@/app/connexion/actions";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default async function Oubli({ searchParams }: { searchParams: Promise<{ envoye?: string }> }) {
  const { envoye } = await searchParams;
  return (
    <AuthFrame>
      <div className="glass auth-card stack">
        <span className="eyebrow">Mot de passe oublié</span>
        <h2 className="display h2">Réinitialiser</h2>
        {envoye ? (
          <p className="alert ok" role="status">Si un compte existe pour cette adresse, un lien valable 1 heure vient d'être envoyé.</p>
        ) : (
          <form action={requestReset} className="stack" style={{ gap: 14 }}>
            <div className="field"><label htmlFor="email">E-mail</label><input className="input" id="email" name="email" type="email" autoComplete="email" required /></div>
            <button className="btn solid" type="submit">Recevoir un lien</button>
          </form>
        )}
        <p className="small"><a href="/connexion">Retour à la connexion</a></p>
      </div>
    </AuthFrame>
  );
}
