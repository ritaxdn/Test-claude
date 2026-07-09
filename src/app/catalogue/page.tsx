import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Catalogue des technologies médico-esthétiques LGL Expert",
  description:
    "Découvrez les 15 familles de technologies médico-esthétiques distribuées par Cellulift en Afrique : visage, corps, HIFU, laser, radiofréquence, cryolipolyse et plus.",
};

export default function CataloguePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", url: "/" },
              { name: "Catalogue", url: "/catalogue" },
            ])
          ),
        }}
      />
      <section className="border-b border-border bg-paper-alt py-16 md:py-24">
        <div className="container-cl">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">CATALOGUE COMPLET</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl text-ink md:text-5xl">
              Plus de 40 technologies LGL Expert, réparties en 15 familles.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite">
              Chaque catégorie regroupe plusieurs machines, du modèle Essentiel au modèle Expert.
              Sélectionnez une famille pour découvrir les technologies adaptées à votre activité.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="container-cl">
          <RevealGroup className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = getProductsByCategory(category.slug).length;
              return (
                <Reveal key={category.slug} as="div">
                  <Link
                    href={`/catalogue/${category.slug}`}
                    className="group flex h-full flex-col justify-between bg-paper p-7 transition-colors duration-fast hover:bg-white"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <CategoryIcon name={category.icon} className="h-6 w-6 text-bronze-dark" />
                        <span className="text-xs font-medium tracking-wide text-graphite-soft">
                          {count} machine{count > 1 ? "s" : ""}
                        </span>
                      </div>
                      <h2 className="mt-4 font-display text-lg text-ink">{category.name}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-graphite">{category.description}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors duration-fast group-hover:text-bronze-dark">
                      Explorer la gamme
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
