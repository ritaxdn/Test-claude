import type { Metadata } from "next";
import { FileText, LineChart } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Ressources & brochures",
  description:
    "Téléchargez le catalogue complet des technologies LGL Expert distribuées par Cellulift, ou demandez une étude de rentabilité personnalisée.",
};

export default function RessourcesPage() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-cl grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">RESSOURCES</p>
          <Reveal>
            <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
              Catalogue &amp; ressources commerciales
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-graphite">
              Recevez le catalogue complet LGL Expert, ou demandez une étude de rentabilité adaptée à votre
              activité — un conseiller vous transmet le document par email sous 24h ouvrées.
            </p>
          </Reveal>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4 border border-border bg-paper-alt p-6">
              <FileText className="mt-0.5 h-6 w-6 shrink-0 text-bronze-dark" aria-hidden />
              <div>
                <p className="font-medium text-ink">Catalogue complet des technologies</p>
                <p className="mt-1.5 text-sm text-graphite">
                  Les 15 familles de technologies, leurs indications et leurs niveaux de gamme (Essentiel, Pro, Expert).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 border border-border bg-paper-alt p-6">
              <LineChart className="mt-0.5 h-6 w-6 shrink-0 text-bronze-dark" aria-hidden />
              <div>
                <p className="font-medium text-ink">Étude de rentabilité personnalisée</p>
                <p className="mt-1.5 text-sm text-graphite">
                  Une projection basée sur votre patientèle, votre zone et la technologie envisagée.
                </p>
              </div>
            </div>
          </div>
        </div>

        <QuoteForm
          intent="brochure"
          title="Recevoir le catalogue par email"
          description="Indiquez vos coordonnées, le catalogue complet vous est envoyé par email."
          submitLabel="Recevoir le catalogue"
          successMessage="Votre demande a été transmise à notre équipe, qui vous envoie le catalogue complet par email sous 24h ouvrées."
        />
      </div>
    </section>
  );
}
