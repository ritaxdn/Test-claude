import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

const roiPoints = [
  {
    metric: "Forfaits multi-séances",
    detail:
      "Nos technologies sont pensées pour des protocoles en plusieurs séances, favorisant des forfaits récurrents et un panier moyen plus élevé.",
  },
  {
    metric: "Faible coût d'exploitation",
    detail:
      "Consommables maîtrisés et maintenance prévisible : une structure de coûts claire pour calculer votre marge dès le premier devis.",
  },
  {
    metric: "Formation à la vente incluse",
    detail:
      "Vos équipes sont formées non seulement au geste technique, mais aussi à la présentation du soin et à sa valorisation auprès des patients.",
  },
];

export function ROISection() {
  return (
    <section className="bg-ink py-20 text-paper md:py-28">
      <div className="container-cl grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-paper/60">RENTABILITÉ</p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
            Chaque machine est choisie pour son retour sur investissement, pas seulement sa technologie.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper/70">
            Nos conseillers construisent avec vous une projection de rentabilité adaptée à votre patientèle,
            votre zone et vos objectifs de développement — avant même la signature du devis.
          </p>
          <Link
            href="/devis?intent=roi"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-paper px-6 py-3 text-sm font-medium tracking-wide text-ink transition-transform duration-fast hover:scale-[1.02]"
          >
            Demander une étude de rentabilité
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-paper/15 bg-paper/15 sm:grid-cols-1">
          {roiPoints.map((point) => (
            <Reveal key={point.metric} as="div">
              <div className="bg-ink p-7">
                <p className="font-display text-xl text-paper">{point.metric}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-paper/70">{point.detail}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
