import type { Metadata } from "next";
import { PublicShell } from "@/components/PublicShell";
import { confirmRequest } from "./actions";

export const metadata: Metadata = { title: "Confirmer ma demande" };

export default async function Confirmer({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const content = token === "ok"
    ? <><h1 className="display h2">Adresse confirmée.</h1><p className="muted">Votre demande est transmise à l&apos;équipe CELLULIFT Academy, qui vérifie votre qualification puis vous envoie les modalités de paiement.</p></>
    : token === "invalide"
    ? <><h1 className="display h2">Lien expiré ou déjà utilisé.</h1><p className="muted">Si votre adresse n&apos;a pas encore été confirmée, déposez une nouvelle demande depuis la fiche de la formation.</p></>
    : <>
        <h1 className="display h2">Confirmer votre demande d&apos;inscription</h1>
        <p className="muted">Cliquez pour confirmer que cette adresse e-mail est bien la vôtre. Votre demande sera alors transmise à l&apos;équipe CELLULIFT Academy.</p>
        <form action={confirmRequest}><input type="hidden" name="token" value={token} /><button className="btn solid" type="submit">Confirmer ma demande</button></form>
      </>;
  return (
    <PublicShell>
      <div className="glass card stack" style={{ gap: 12, maxWidth: 640 }}>{content}<a className="btn ghost" href="/formations" style={{ alignSelf: "flex-start" }}>Voir les formations</a></div>
    </PublicShell>
  );
}
