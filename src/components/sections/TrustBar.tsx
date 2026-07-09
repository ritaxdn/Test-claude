import { ShieldCheck } from "lucide-react";
import { certifications } from "@/lib/data/certifications";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

export function TrustBar() {
  return (
    <section className="border-y border-border bg-paper-alt py-20 md:py-28">
      <div className="container-cl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">CONFIANCE &amp; CONFORMITÉ</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl text-ink md:text-4xl">
            Un partenariat officiel, des garanties vérifiables.
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <Reveal key={cert.name} as="div">
              <div className="flex h-full gap-4 border border-border bg-paper p-6">
                <ShieldCheck className="h-6 w-6 shrink-0 text-bronze-dark" aria-hidden />
                <div>
                  <p className="font-medium text-ink">{cert.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite">{cert.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
