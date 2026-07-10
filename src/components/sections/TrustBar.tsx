import { ShieldCheck } from "lucide-react";
import { certifications } from "@/lib/data/certifications";
import { Reveal } from "@/components/motion/Reveal";

export function TrustBar() {
  return (
    <section className="border-y border-border bg-paper-alt py-16 md:py-20">
      <div className="container-cl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">CONFIANCE &amp; CONFORMITÉ</p>
        </Reveal>
      </div>

      <div className="mt-10 overflow-hidden">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-16 pl-8 hover:[animation-play-state:paused]">
          {[...certifications, ...certifications].map((cert, index) => (
            <div key={`${cert.name}-${index}`} className="flex shrink-0 items-center gap-3 whitespace-nowrap">
              <ShieldCheck className="h-5 w-5 shrink-0 text-bronze-dark" aria-hidden />
              <span className="font-display text-lg text-ink">{cert.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-cl mt-8">
        <p className="max-w-xl text-sm text-graphite-soft">
          {certifications[0].description} — détails complets sur la page{" "}
          <a href="/certifications" className="font-medium text-bronze-dark hover:text-ink">
            Certifications &amp; partenariats
          </a>
          .
        </p>
      </div>
    </section>
  );
}
