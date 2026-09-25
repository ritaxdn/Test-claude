import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "./Cta";

export function Heading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <Reveal className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
      <div>
        <Pill>{eyebrow}</Pill>
        <h2 className="display mt-6 text-[clamp(2rem,4.8vw,4.2rem)] text-deep">{title}</h2>
      </div>
      {intro && <p className="max-w-md font-sans leading-relaxed text-deep-soft">{intro}</p>}
    </Reveal>
  );
}
