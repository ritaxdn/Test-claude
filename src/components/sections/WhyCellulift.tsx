import { Microscope, GraduationCap, LifeBuoy, Globe2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const icons = [Microscope, GraduationCap, LifeBuoy, Globe2];

export function WhyCellulift({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: readonly { title: string; description: string }[];
}) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading align="center" eyebrow={eyebrow} title={title} className="max-w-2xl" />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-hairline bg-[rgba(26,24,20,0.08)] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <RevealItem key={item.title} className="bg-warm-white p-8">
                <Icon size={22} strokeWidth={1.5} className="text-rainbow-2" />
                <h3 className="font-heading mt-5 text-xl font-light text-ink">{item.title}</h3>
                <p className="font-body mt-3 text-sm font-light leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
