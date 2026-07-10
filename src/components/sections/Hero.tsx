"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, ShieldCheck } from "lucide-react";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { TechDiagram } from "@/components/illustrations/TechDiagram";
import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  { value: "40+", label: "Technologies au catalogue" },
  { value: "15", label: "Familles de solutions" },
  { value: "1", label: "Partenariat officiel LGL Expert" },
  { value: "24h", label: "Délai moyen de rappel" },
];

function Stat({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp(value);
  return (
    <div>
      <dt ref={ref} className="font-display text-3xl text-paper">
        {display}
      </dt>
      <dd className="mt-1 text-xs tracking-wide text-paper/60">{label}</dd>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #ffffff 0, transparent 45%), radial-gradient(circle at 80% 60%, #ffffff 0, transparent 40%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 hidden w-[560px] -translate-y-1/2 opacity-[0.35] md:block lg:w-[680px]"
      >
        <TechDiagram motif="wave" tone="on-ink" />
      </div>

      <div className="container-cl relative flex min-h-[92vh] flex-col justify-center py-28 sm:min-h-[85vh]">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-paper/20 px-4 py-1.5 text-xs font-medium tracking-[0.14em] text-paper/80">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          DISTRIBUTEUR &amp; AMBASSADEUR OFFICIEL LGL EXPERT EN AFRIQUE
        </p>

        <SplitHeadline
          as="h1"
          trigger="mount"
          className="mt-8 max-w-4xl font-display text-[13vw] leading-[0.98] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Vos machines sont les héroïnes.
        </SplitHeadline>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg">
          Cellulift équipe les médecins esthétiques, dermatologues, cliniques et instituts premium
          d&apos;Afrique francophone avec plus de 40 technologies LGL Expert — et un accompagnement
          complet pour en faire un investissement rentable.
        </p>

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
            Explorer le catalogue
          </Link>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-8 border-t border-paper/15 pt-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </dl>

        <div className="mt-16 flex items-center gap-2 text-xs tracking-[0.14em] text-paper/50">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
          DÉCOUVRIR NOTRE APPROCHE
        </div>
      </div>
    </section>
  );
}
