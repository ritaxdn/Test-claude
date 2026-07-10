import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { ContactLinks } from "@/components/ContactLinks";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Cellulift, distributeur officiel LGL Expert en Afrique, par téléphone, WhatsApp, email ou via notre formulaire.",
};

export default function ContactPage() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-cl grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">CONTACT</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">Parlons de votre projet.</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-graphite">
            Notre équipe basée en Afrique francophone vous répond directement, sans intermédiaire.
          </p>
          <ContactLinks />
        </div>

        <QuoteForm
          intent="contact"
          title="Nous contacter"
          description="Une question générale, un partenariat, une demande spécifique ? Écrivez-nous."
          submitLabel="Envoyer mon message"
        />
      </div>
    </section>
  );
}
