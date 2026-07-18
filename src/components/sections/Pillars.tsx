import { Target, Eye, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Pillars({
  eyebrow,
  title,
  mission,
  vision,
  values,
}: {
  eyebrow: string;
  title: string;
  mission: { title: string; description: string };
  vision: { title: string; description: string };
  values: { title: string; description: string };
}) {
  const items = [
    { ...mission, icon: Target },
    { ...vision, icon: Eye },
    { ...values, icon: Heart },
  ];

  return (
    <section className="bg-ivory-2 py-20 md:py-28">
      <Container>
        <SectionHeading align="center" eyebrow={eyebrow} title={title} className="max-w-2xl" />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <RevealItem
              key={item.title}
              className="border border-hairline bg-warm-white p-8 text-center"
            >
              <item.icon
                size={24}
                strokeWidth={1.5}
                className="mx-auto text-rainbow-3"
              />
              <h3 className="font-heading mt-5 text-xl font-light text-ink">{item.title}</h3>
              <p className="font-body mt-3 text-sm font-light leading-relaxed text-ink-soft">
                {item.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
