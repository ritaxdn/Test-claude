import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductBySlug } from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

const flagshipSlugs = ["liftra-expert", "frigya-pro", "puralaz-pro", "tonis-pro"];

export function FlagshipTech() {
  const flagships = flagshipSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <section className="border-y border-border bg-paper py-20 md:py-28">
      <div className="container-cl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">TECHNOLOGIES PHARES</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl text-ink md:text-4xl">
            Les solutions les plus demandées par nos partenaires.
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {flagships.map((product) => {
            const category = getCategoryBySlug(product.categorySlug);
            return (
              <Reveal key={product.slug} as="div">
                <div className="flex h-full flex-col justify-between border border-border bg-paper-alt p-8">
                  <div>
                    {category && (
                      <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-graphite-soft">
                        <CategoryIcon name={category.icon} className="h-4 w-4 text-bronze-dark" />
                        {category.name}
                      </div>
                    )}
                    <h3 className="mt-4 font-display text-2xl text-ink">{product.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-graphite">{product.description}</p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={`/produits/${product.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium tracking-wide text-paper transition-transform duration-fast hover:scale-[1.02]"
                    >
                      Voir la fiche
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                      href={`/devis?produit=${encodeURIComponent(product.name)}`}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-border px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors duration-fast hover:bg-white"
                    >
                      Demander un devis
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
