import type { Metadata } from "next";
import Link from "next/link";
import { Award, HandshakeIcon, Lightbulb, ShieldCheck, TrendingUp, Users2 } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "À propos de Cellulift",
  description:
    "Cellulift est le distributeur et ambassadeur officiel de LGL Expert en Afrique francophone, avec l'ambition de couvrir tout le continent.",
};

const values = [
  { icon: Award, title: "Expertise", description: "Une connaissance fine des technologies médico-esthétiques et de leurs usages cliniques." },
  { icon: Lightbulb, title: "Innovation", description: "Un accès privilégié aux dernières générations de technologies LGL Expert." },
  { icon: ShieldCheck, title: "Excellence", description: "Une exigence de qualité à chaque étape, de la vente au support technique." },
  { icon: HandshakeIcon, title: "Fiabilité", description: "Des engagements tenus, des délais respectés, une garantie constructeur assurée." },
  { icon: Users2, title: "Accompagnement", description: "Un interlocuteur unique du premier contact jusqu'au suivi long terme de votre parc machines." },
  { icon: TrendingUp, title: "Résultats", description: "Des recommandations pensées pour la rentabilité réelle de votre activité." },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-ink py-20 text-paper md:py-28">
        <div className="container-cl">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.16em] text-paper/60">À PROPOS DE CELLULIFT</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">
              Le partenaire de référence pour la médecine esthétique en Afrique.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/75">
              Cellulift est le distributeur et ambassadeur officiel de la marque française LGL Expert en Afrique.
              Nous distribuons des technologies médico-esthétiques haut de gamme destinées aux professionnels
              de la santé et de l&apos;esthétique, avec l&apos;ambition de nous développer sur l&apos;ensemble du continent.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <div className="container-cl grid grid-cols-1 gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl text-ink">Notre positionnement</h2>
            <p className="mt-5 text-base leading-relaxed text-graphite">
              Nous ne vendons pas simplement des machines : nous accompagnons les professionnels dans le
              développement rentable de leur activité grâce à des technologies performantes, une expertise
              technique et un accompagnement complet — de l&apos;installation à la formation, jusqu&apos;au
              suivi de maintenance.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-3xl text-ink">Notre ambition</h2>
            <p className="mt-5 text-base leading-relaxed text-graphite">
              Implantés en Afrique francophone, nous avons l&apos;ambition de devenir le partenaire de référence
              des professionnels de santé et de l&apos;esthétique sur l&apos;ensemble du continent africain,
              en apportant un niveau d&apos;exigence et de service comparable aux standards européens.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-paper-alt py-20 md:py-28">
        <div className="container-cl">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">NOS VALEURS</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl text-ink md:text-4xl">
              Sept valeurs qui guident chaque relation client.
            </h2>
          </Reveal>

          <RevealGroup className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <Reveal key={value.title} as="div">
                <div className="border border-border bg-paper p-7">
                  <value.icon className="h-6 w-6 text-bronze-dark" aria-hidden />
                  <h3 className="mt-4 font-display text-lg text-ink">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <div className="container-cl flex flex-col items-start justify-between gap-8 border border-border bg-paper-alt p-10 md:flex-row md:items-center md:p-14">
          <div>
            <h2 className="font-display text-3xl text-ink">Envie d&apos;échanger avec notre équipe ?</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-graphite">
              Discutons de votre activité, de vos objectifs et de la technologie la plus adaptée.
            </p>
          </div>
          <Link
            href="/devis"
            className="shrink-0 rounded-sm bg-ink px-7 py-3.5 text-sm font-medium tracking-wide text-paper transition-transform duration-fast hover:scale-[1.02]"
          >
            Demander un devis
          </Link>
        </div>
      </section>
    </>
  );
}
