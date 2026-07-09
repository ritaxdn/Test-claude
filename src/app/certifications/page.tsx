import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { certifications } from "@/lib/data/certifications";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Certifications et partenariats",
  description:
    "Cellulift, distributeur officiel LGL Expert, garantit la conformité et la traçabilité de chaque technologie médico-esthétique distribuée en Afrique.",
};

export default function CertificationsPage() {
  return (
    <>
      <section className="border-b border-border bg-paper-alt py-16 md:py-24">
        <div className="container-cl">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">CERTIFICATIONS &amp; PARTENARIATS</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl text-ink md:text-5xl">
              Un partenariat officiel, une conformité vérifiable.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite">
              En tant que distributeur et ambassadeur officiel de LGL Expert, Cellulift s&apos;engage sur la
              conformité, la traçabilité et la garantie de chaque technologie distribuée en Afrique.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="container-cl">
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {certifications.map((cert) => (
              <Reveal key={cert.name} as="div">
                <div className="flex h-full gap-4 border border-border bg-paper-alt p-7">
                  <ShieldCheck className="h-6 w-6 shrink-0 text-bronze-dark" aria-hidden />
                  <div>
                    <p className="font-display text-lg text-ink">{cert.name}</p>
                    <p className="mt-2 text-sm leading-relaxed text-graphite">{cert.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </RevealGroup>

          <Reveal>
            <p className="mt-10 text-xs text-graphite-soft">
              Les certificats officiels (marquage CE, ISO 13485, attestation de distributeur LGL Expert) sont
              disponibles sur simple demande et seront publiés ici au format téléchargeable.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-paper-alt py-16">
        <div className="container-cl flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-display text-xl text-ink">Besoin d&apos;un document de conformité spécifique ?</p>
            <p className="mt-1.5 text-sm text-graphite">
              Nous transmettons les certificats et fiches techniques nécessaires à votre dossier d&apos;installation.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-sm bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper transition-transform duration-fast hover:scale-[1.02]"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </>
  );
}
