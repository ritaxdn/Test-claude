import { Reveal, RevealGroup } from "@/components/motion/Reveal";

/**
 * PLACEHOLDER TESTIMONIALS — illustrative only. Replace with real quotes,
 * names and establishments (with permission) from actual Cellulift clients
 * before launch. Do not publish fabricated attributions.
 */
const testimonials = [
  {
    quote:
      "L'accompagnement ne s'est pas arrêté à la livraison : la formation de nos équipes et le suivi technique ont fait toute la différence dans l'adoption de la machine.",
    role: "Médecin esthétique, cabinet privé",
  },
  {
    quote:
      "Le conseil sur le choix de technologie a été déterminant. On nous a orientés vers la machine adaptée à notre patientèle, pas vers la plus chère.",
    role: "Gérante d'institut premium",
  },
  {
    quote:
      "Le support technique local nous a permis de reprendre l'activité en moins de 48h après un incident, sans dépendre d'un import depuis l'Europe.",
    role: "Responsable de clinique",
  },
];

export function Testimonials() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="container-cl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">TÉMOIGNAGES</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl text-ink md:text-4xl">
            La parole à nos partenaires professionnels.
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Reveal key={testimonial.role} as="div">
              <figure className="flex h-full flex-col justify-between border border-border bg-paper-alt p-7">
                <blockquote className="font-display text-lg leading-snug text-ink">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm text-graphite-soft">{testimonial.role}</figcaption>
              </figure>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
