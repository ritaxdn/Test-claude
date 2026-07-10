import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CatalogueIndex } from "@/components/CatalogueIndex";
import { Reveal } from "@/components/motion/Reveal";

export function CategoryIndex() {
  return (
    <section className="bg-paper-alt py-20 md:py-28">
      <div className="container-cl">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">CATALOGUE</p>
              <h2 className="mt-3 max-w-xl font-display text-3xl text-ink md:text-4xl">
                15 familles de technologies, plus de 40 machines professionnelles.
              </h2>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-bronze-dark hover:text-ink"
            >
              Explorer le catalogue complet
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="mt-14">
          <CatalogueIndex />
        </div>
      </div>
    </section>
  );
}
