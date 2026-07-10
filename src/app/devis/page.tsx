import type { Metadata } from "next";
import { ShieldCheck, Clock, Users } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import type { LeadIntent } from "@/lib/validation/lead";

export const metadata: Metadata = {
  title: "Demander un devis",
  description:
    "Demandez un devis ou une démonstration pour une technologie médico-esthétique LGL Expert distribuée par Cellulift en Afrique.",
};

const intentMap: Record<string, { intent: LeadIntent; title: string; description: string; submitLabel: string }> = {
  devis: {
    intent: "devis",
    title: "Demander un devis",
    description: "Décrivez votre projet, un conseiller Cellulift vous recontacte sous 24h ouvrées.",
    submitLabel: "Envoyer ma demande de devis",
  },
  demo: {
    intent: "demo",
    title: "Réserver une démonstration",
    description: "Planifiez une démonstration de la machine de votre choix, sur site ou en showroom.",
    submitLabel: "Réserver ma démonstration",
  },
  rappel: {
    intent: "rappel",
    title: "Être rappelé par un conseiller",
    description: "Laissez vos coordonnées, un conseiller vous rappelle rapidement.",
    submitLabel: "Demander à être rappelé",
  },
  roi: {
    intent: "roi",
    title: "Demander une étude de rentabilité",
    description: "Nous construisons avec vous une projection de rentabilité adaptée à votre activité.",
    submitLabel: "Demander mon étude de rentabilité",
  },
};

export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const intentKey = typeof params.intent === "string" ? params.intent : "devis";
  const config = intentMap[intentKey] ?? intentMap.devis;

  const productParam = typeof params.produit === "string" ? params.produit : undefined;
  const categoryParam = typeof params.categorie === "string" ? params.categorie : undefined;
  const defaultInterestedProduct = productParam ?? categoryParam;

  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-cl grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">CONTACT COMMERCIAL</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">{config.title}</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-graphite">{config.description}</p>

          <ul className="mt-10 space-y-6">
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-bronze-dark" aria-hidden />
              <div>
                <p className="font-medium text-ink">Réponse sous 24h ouvrées</p>
                <p className="text-sm text-graphite">Un conseiller dédié à votre profil vous recontacte rapidement.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-bronze-dark" aria-hidden />
              <div>
                <p className="font-medium text-ink">Conseil personnalisé</p>
                <p className="text-sm text-graphite">Recommandation adaptée à votre activité, votre budget et vos objectifs.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-bronze-dark" aria-hidden />
              <div>
                <p className="font-medium text-ink">Sans engagement</p>
                <p className="text-sm text-graphite">Le devis et l&apos;échange initial ne vous engagent à rien.</p>
              </div>
            </li>
          </ul>
        </div>

        <QuoteForm
          intent={config.intent}
          title={config.title}
          description={config.description}
          submitLabel={config.submitLabel}
          defaultInterestedProduct={defaultInterestedProduct}
        />
      </div>
    </section>
  );
}
