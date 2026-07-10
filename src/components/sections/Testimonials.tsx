"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

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
  const [index, setIndex] = useState(0);
  const testimonial = testimonials[index];

  function go(direction: 1 | -1) {
    setIndex((current) => (current + direction + testimonials.length) % testimonials.length);
  }

  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="container-cl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">TÉMOIGNAGES</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto]">
          <Reveal className="max-w-3xl">
            <blockquote
              key={index}
              className="font-display text-3xl leading-snug text-ink md:text-4xl lg:text-5xl"
            >
              “{testimonial.quote}”
            </blockquote>
            <p className="mt-8 text-sm tracking-wide text-graphite-soft">{testimonial.role}</p>
          </Reveal>

          <div className="flex items-end gap-3 lg:flex-col lg:justify-end">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Témoignage précédent"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink-soft transition-colors duration-fast hover:bg-paper-alt"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Témoignage suivant"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink-soft transition-colors duration-fast hover:bg-paper-alt"
            >
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-10 flex gap-2">
          {testimonials.map((item, i) => (
            <button
              key={item.role}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Aller au témoignage ${i + 1}`}
              className={`h-1 flex-1 max-w-16 rounded-full transition-colors duration-fast ${
                i === index ? "bg-bronze-dark" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
