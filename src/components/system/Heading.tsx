import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "./Cta";

export function Heading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <Reveal className="grid gap-4 sm:gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
      <div>
        <Pill>{eyebrow}</Pill>
        <h2 className="display mt-4 text-[clamp(1.7rem,3.3vw,2.9rem)] text-deep">{title}</h2>
      </div>
      {intro && <p className="hidden max-w-md font-sans leading-relaxed text-deep-soft sm:block">{intro}</p>}
    </Reveal>
  );
}
