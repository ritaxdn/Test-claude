import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { catalogItem } from "@/lib/catalog";
import { PROFESSIONS, COUNTRIES } from "@/lib/professions";
import { InscriptionForm } from "./InscriptionForm";

export const metadata: Metadata = { title: "Demande d'inscription" };
export const dynamic = "force-dynamic";

export default async function Inscription({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{2,80}$/.test(slug)) notFound();
  const p = await catalogItem(slug);
  if (!p) notFound();
  return (
    <PublicShell>
      <p className="crumbs mono"><a href="/formations">Formations</a> / <a href={`/formations/${p.slug}`}>{p.title}</a> / Inscription</p>
      <div className="page-head"><div><span className="eyebrow">Demande d&apos;inscription</span><h1 className="display h1">{p.title}</h1></div></div>
      <div className="cols">
        <section className="glass card"><InscriptionForm slug={p.slug} professions={PROFESSIONS.filter(([c]) => p.eligible_professions.includes(c))} countries={COUNTRIES} /></section>
        <aside className="glass card stack small" style={{ gap: 10 }}>
          <span className="eyebrow">Comment ça se passe</span>
          <ol className="stack" style={{ gap: 6, margin: 0, paddingLeft: 18 }}>
            <li>Vous envoyez votre demande.</li>
            <li>L&apos;équipe vérifie votre qualification professionnelle.</li>
            <li>Vous recevez les modalités de paiement par virement, avec une référence unique.</li>
            <li>À réception du paiement, votre accès est ouvert et vous recevez votre lien de connexion.</li>
          </ol>
        </aside>
      </div>
    </PublicShell>
  );
}
