import type { Metadata } from "next";
import { AuthFrame } from "@/components/AuthFrame";
import { findToken } from "@/lib/auth";
import { resetPassword } from "@/app/connexion/actions";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

export default async function Reinit({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ erreur?: string }> }) {
  const { token } = await params;
  const { erreur } = await searchParams;
  const t = await findToken(token, "reset");
  return (
    <AuthFrame>
      <div className="glass auth-card stack">
        <span className="eyebrow">Nouveau mot de passe</span>
        {!t ? (
          <><h2 className="display h2">Lien expiré</h2><p className="muted">Demandez un nouveau lien de réinitialisation.</p><a className="btn solid" href="/mot-de-passe-oublie">Nouveau lien</a></>
        ) : (
          <>
            {erreur && <p className="alert err" role="alert">{erreur}</p>}
            <form action={resetPassword} className="stack" style={{ gap: 14 }}>
              <input type="hidden" name="token" value={token} />
              <input type="email" name="email" value={t.email} autoComplete="username" readOnly hidden />
              <div className="field"><label htmlFor="password">Nouveau mot de passe</label><input className="input" id="password" name="password" type="password" minLength={10} autoComplete="new-password" required /></div>
              <div className="field"><label htmlFor="password2">Confirmer</label><input className="input" id="password2" name="password2" type="password" minLength={10} autoComplete="new-password" required /></div>
              <button className="btn solid" type="submit">Enregistrer</button>
            </form>
          </>
        )}
      </div>
    </AuthFrame>
  );
}
