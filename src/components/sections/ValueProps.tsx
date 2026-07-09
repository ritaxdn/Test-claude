import { HandCoins, LineChart, ShieldCheck, Wrench } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

const values = [
  {
    icon: ShieldCheck,
    title: "Expertise clinique",
    description:
      "Une équipe formée aux technologies LGL Expert, capable d'accompagner vos équipes médicales sur chaque protocole.",
  },
  {
    icon: LineChart,
    title: "Rentabilité mesurable",
    description:
      "Chaque recommandation s'appuie sur une logique de retour sur investissement : volume de séances, forfaits, fidélisation.",
  },
  {
    icon: Wrench,
    title: "Accompagnement complet",
    description:
      "Installation, formation, maintenance et consommables : un interlocuteur unique du premier contact au suivi long terme.",
  },
  {
    icon: HandCoins,
    title: "Confiance &amp; transparence",
    description:
      "Distributeur officiel LGL Expert, garanties constructeur et support technique local basé en Afrique francophone.",
  },
];

export function ValueProps() {
  return (
    <section className="border-b border-border bg-paper py-20 md:py-28">
      <div className="container-cl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">POURQUOI CELLULIFT</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink md:text-4xl">
            Plus qu&apos;un fournisseur de machines, un partenaire de croissance.
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Reveal key={value.title} as="div">
              <value.icon className="h-7 w-7 text-bronze-dark" aria-hidden />
              <h3 className="mt-5 font-display text-lg text-ink">{value.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-graphite">{value.description}</p>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
