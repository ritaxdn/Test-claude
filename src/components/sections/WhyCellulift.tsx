import { Microscope, GraduationCap, LifeBuoy, Globe2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { EditorialIndex } from "@/components/ui/EditorialIndex";
import { cn } from "@/lib/utils";

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
    <section className="py-28 md:py-40">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} className="max-w-xl" />

        <RevealGroup className="mt-16 border-t border-hairline">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            const offset = i % 2 === 0;
            return (
              <RevealItem
                key={item.title}
                className="group grid grid-cols-1 gap-4 border-b border-hairline py-10 md:grid-cols-12 md:items-center md:gap-6"
              >
                <div className="flex items-center gap-4 md:col-span-4">
                  <EditorialIndex index={i + 1} total={items.length} />
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-rainbow-2 transition-transform duration-500 group-hover:rotate-12"
                  />
                  <h3 className="font-heading text-2xl font-light text-ink md:text-3xl">
                    {item.title}
                  </h3>
                </div>

                <p
                  className={cn(
                    "font-body max-w-md text-base font-light leading-relaxed text-ink-soft md:col-span-6",
                    offset ? "md:col-start-7" : "md:col-start-8"
                  )}
                >
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
