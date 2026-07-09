import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #ffffff 0, transparent 45%), radial-gradient(circle at 80% 60%, #ffffff 0, transparent 40%)",
        }}
      />
      <div className="container-cl relative flex min-h-[88vh] flex-col justify-center py-24 sm:min-h-[80vh]">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-1.5 text-xs font-medium tracking-[0.14em] text-paper/80">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            DISTRIBUTEUR &amp; AMBASSADEUR OFFICIEL LGL EXPERT EN AFRIQUE
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-8 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            La technologie médico-esthétique qui fait grandir votre activité.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg">
            Cellulift équipe les médecins esthétiques, dermatologues, cliniques et instituts premium
            d&apos;Afrique francophone avec plus de 40 technologies LGL Expert — et un accompagnement
            complet pour en faire un investissement rentable.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/devis"
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-paper px-7 py-3.5 text-sm font-medium tracking-wide text-ink transition-transform duration-fast hover:scale-[1.02]"
            >
              Demander un devis
              <ArrowRight className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-paper/30 px-7 py-3.5 text-sm font-medium tracking-wide text-paper transition-colors duration-fast hover:bg-paper/10"
            >
              Découvrir le catalogue
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-paper/15 pt-8 sm:grid-cols-4">
            {[
              { value: "40+", label: "Technologies au catalogue" },
              { value: "15", label: "Familles de solutions" },
              { value: "1", label: "Partenariat officiel LGL Expert" },
              { value: "24h", label: "Délai moyen de rappel" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl text-paper">{stat.value}</dt>
                <dd className="mt-1 text-xs tracking-wide text-paper/60">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
