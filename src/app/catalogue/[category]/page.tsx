import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { TechDiagram } from "@/components/illustrations/TechDiagram";
import { HorizontalRail } from "@/components/motion/HorizontalRail";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) return {};

  return {
    title: `${category.name} — Catalogue LGL Expert`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", url: "/" },
              { name: "Catalogue", url: "/catalogue" },
              { name: category.name, url: `/catalogue/${category.slug}` },
            ])
          ),
        }}
      />

      <section className="border-b border-border bg-ink py-16 text-paper md:py-24">
        <div className="container-cl grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-paper/60 transition-colors duration-fast hover:text-paper"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Retour au catalogue
            </Link>
            <SplitHeadline as="h1" trigger="mount" className="mt-6 max-w-xl font-display text-4xl md:text-5xl">
              {category.name}
            </SplitHeadline>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/75">{category.narrative}</p>
            <div className="mt-8 flex items-baseline gap-2 border-t border-paper/15 pt-6">
              <span className="font-display text-3xl text-paper">{category.stat.value}</span>
              <span className="text-xs tracking-wide text-paper/60">{category.stat.label}</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[280px] opacity-90">
            <TechDiagram motif={category.motif} tone="on-ink" />
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="container-cl">
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">
            {categoryProducts.length} MACHINE{categoryProducts.length > 1 ? "S" : ""} DANS CETTE FAMILLE
          </p>
          <h2 className="mt-3 max-w-xl font-display text-2xl text-ink md:text-3xl">
            Du modèle Essentiel au modèle Expert.
          </h2>
        </div>

        <div className="container-cl mt-10">
          <HorizontalRail>
            {categoryProducts.map((product) => (
              <div key={product.slug} className="w-[85vw] shrink-0 snap-start sm:w-[360px]">
                <ProductCard product={product} />
              </div>
            ))}
          </HorizontalRail>
        </div>
      </section>

      <section className="border-t border-border bg-paper-alt py-14">
        <div className="container-cl flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-display text-xl text-ink">Une question sur cette famille de technologies ?</p>
            <p className="mt-1.5 text-sm text-graphite">
              Un conseiller vous aide à choisir le modèle adapté à votre activité et votre budget.
            </p>
          </div>
          <Link
            href={`/devis?categorie=${encodeURIComponent(category.name)}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper transition-transform duration-fast hover:scale-[1.02]"
          >
            Demander un devis
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
