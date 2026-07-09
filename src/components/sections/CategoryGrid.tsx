import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

export function CategoryGrid() {
  const featured = categories.slice(0, 9);

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
              Voir tout le catalogue
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((category) => (
            <Reveal key={category.slug} as="div">
              <Link
                href={`/catalogue/${category.slug}`}
                className="group flex h-full flex-col justify-between bg-paper p-7 transition-colors duration-fast hover:bg-white"
              >
                <div>
                  <CategoryIcon name={category.icon} className="h-6 w-6 text-bronze-dark" />
                  <h3 className="mt-4 font-display text-lg text-ink">{category.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">{category.shortDescription}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors duration-fast group-hover:text-bronze-dark">
                  Découvrir
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
