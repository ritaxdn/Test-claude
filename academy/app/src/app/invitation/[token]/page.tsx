import type { Metadata } from "next";
import { AuthFrame } from "@/components/AuthFrame";
import { findToken } from "@/lib/auth";
import { acceptInvitation } from "@/app/connexion/actions";

export const metadata: Metadata = { title: "Créer mon accès" };

export default async function Invitation({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ erreur?: string }> }) {
  const { token } = await params;
  const { erreur } = await searchParams;
  const t = await findToken(token, "invite");
  return (
    <AuthFrame>
      <div className="glass auth-card stack">
        <span className="eyebrow">Invitation</span>
        {!t ? (
          <>
            <h2 className="display h2">Lien expiré ou déjà utilisé</h2>
            <p className="muted">Ce lien d'invitation n'est plus valable. Si vous avez déjà créé votre accès, connectez-vous. Sinon, demandez une nouvelle invitation à votre conseiller CELLULIFT.</p>
            <a className="btn solid" href="/connexion">Se connecter</a>
          </>
        ) : (
          <>
            <h2 className="display h2">Bienvenue, {t.full_name}</h2>
            <p className="muted small">Choisissez un mot de passe pour <b>{t.email}</b>. Vous l'utiliserez pour accéder à vos formations.</p>
            {erreur && <p className="alert err" role="alert">{erreur}</p>}
            <form action={acceptInvitation} className="stack" style={{ gap: 14 }}>
              <input type="hidden" name="token" value={token} />
              <input type="email" name="email" value={t.email} autoComplete="username" readOnly hidden />
              <div className="field"><label htmlFor="password">Mot de passe</label><input className="input" id="password" name="password" type="password" minLength={10} autoComplete="new-password" required /><span className="hint">Au moins 10 caractères. Une phrase courte est plus sûre qu'un mot compliqué.</span></div>
              <div className="field"><label htmlFor="password2">Confirmer le mot de passe</label><input className="input" id="password2" name="password2" type="password" minLength={10} autoComplete="new-password" required /></div>
              <label className="row small muted" style={{ alignItems: "flex-start" }}><input type="checkbox" name="cgu" required style={{ marginTop: 4, accentColor: "#7b61ff" }} /> J'accepte les conditions d'utilisation et la politique de confidentialité (loi 09-08). Les vidéos sont personnelles et ne doivent pas être partagées.</label>
              <button className="btn solid" type="submit" style={{ minHeight: 46 }}>Créer mon accès</button>
            </form>
          </>
        )}
      </div>
    </AuthFrame>
  );
}
