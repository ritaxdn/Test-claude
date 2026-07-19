import { Target, Eye, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { EditorialIndex } from "@/components/ui/EditorialIndex";
import { cn } from "@/lib/utils";

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
    { ...mission, icon: Target, offset: "" },
    { ...vision, icon: Eye, offset: "md:pt-14" },
    { ...values, icon: Heart, offset: "md:pt-28" },
  ];

  return (
    <section className="border-y border-hairline bg-ink py-28 text-warm-white md:py-36">
      <Container>
        <div className="max-w-lg">
          <Reveal>
            <span
              className="font-label text-light"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-display-3 mt-4 text-warm-white">{title}</h2>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-white/10">
          {items.map((item, i) => (
            <RevealItem
              key={item.title}
              className={cn(
                "border-t border-white/10 py-10 first:border-t-0 md:border-t-0 md:px-10 md:py-0 first:md:pl-0",
                item.offset
              )}
            >
              <EditorialIndex index={i + 1} total={items.length} className="text-light [&>span:first-child]:text-warm-white" />
              <item.icon size={28} strokeWidth={1} className="mt-6 text-rainbow-3" />
              <h3 className="font-heading mt-6 text-2xl font-light text-warm-white">
                {item.title}
              </h3>
              <p className="font-body mt-4 text-sm font-light leading-relaxed text-light">
                {item.description}
              </p>
            </RevealItem>
          ))}
        </div>
      </Container>
    </section>
  );
}
