import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTACT } from "@/lib/data/contact";
import { Reveal } from "@/components/motion/Reveal";

export function FinalCTA() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="container-cl">
        <Reveal>
          <div className="flex flex-col items-start gap-8 border border-border bg-paper-alt p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <div>
              <h2 className="font-display text-3xl text-ink md:text-4xl">
                Prêt à faire grandir votre activité ?
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-graphite">
                Parlons de votre projet : technologie adaptée, budget, formation et accompagnement.
                Réponse sous 24h ouvrées.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/devis"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-7 py-3.5 text-sm font-medium tracking-wide text-paper transition-transform duration-fast hover:scale-[1.02]"
              >
                Demander un devis
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-border px-7 py-3.5 text-sm font-medium text-ink-soft transition-colors duration-fast hover:bg-white"
              >
                Parler sur WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
