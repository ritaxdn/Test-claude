import type { Metadata } from "next";
import { PublicShell } from "@/components/PublicShell";

export const metadata: Metadata = { title: "Demande reçue" };

export default async function Merci({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <PublicShell>
      <div className="glass card stack" style={{ gap: 12, maxWidth: 640 }}>
        <span className="eyebrow">Demande reçue</span>
        <h1 className="display h2">Merci, votre demande est enregistrée.</h1>
        <p className="muted">L&apos;équipe CELLULIFT Academy vérifie votre qualification professionnelle. Vous recevrez ensuite, par e-mail, les modalités de paiement par virement. Votre accès est ouvert à réception du paiement.</p>
        <div className="row wrap"><a className="btn" href={/^[a-z0-9-]{2,80}$/.test(slug) ? `/formations/${slug}` : "/formations"}>Revenir à la formation</a><a className="btn ghost" href="/formations">Voir les formations</a></div>
      </div>
    </PublicShell>
  );
}
