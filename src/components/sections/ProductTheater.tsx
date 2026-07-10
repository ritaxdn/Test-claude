import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductBySlug } from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";
import { TechDiagram } from "@/components/illustrations/TechDiagram";
import { HorizontalRail } from "@/components/motion/HorizontalRail";
import { Reveal } from "@/components/motion/Reveal";

const flagshipSlugs = ["liftra-expert", "frigya-pro", "puralaz-pro", "tonis-pro", "thermia-expert"];

export function ProductTheater() {
  const flagships = flagshipSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <section className="border-y border-border bg-ink py-20 text-paper md:py-28">
      <div className="container-cl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-paper/60">TECHNOLOGIES PHARES</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl md:text-4xl">
            Les machines les plus demandées par nos partenaires.
          </h2>
        </Reveal>
      </div>

      <div className="container-cl mt-14">
        <HorizontalRail showArrows>
          {flagships.map((product) => {
            const category = getCategoryBySlug(product.categorySlug);
            return (
              <article
                key={product.slug}
                className="flex w-[85vw] shrink-0 snap-start flex-col justify-between border border-paper/15 bg-paper/[0.03] p-8 sm:w-[440px] md:p-10"
              >
                <div>
                  {category && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium tracking-wide text-paper/50">{category.name}</span>
                      <span className="rounded-full border border-paper/20 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-paper/60">
                        {product.tier}
                      </span>
                    </div>
                  )}

                  <div className="mx-auto mt-6 w-full max-w-[220px]">
                    <TechDiagram motif={category?.motif ?? "wave"} tone="on-ink" />
                  </div>

                  <h3 className="mt-6 font-display text-2xl">{product.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">{product.tagline}</p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/produits/${product.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-paper px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-transform duration-fast hover:scale-[1.02]"
                  >
                    Voir la fiche
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </article>
            );
          })}
        </HorizontalRail>
      </div>
    </section>
  );
}
