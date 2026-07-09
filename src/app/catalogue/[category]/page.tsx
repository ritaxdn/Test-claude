import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
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
      <section className="border-b border-border bg-paper-alt py-16 md:py-20">
        <div className="container-cl">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-graphite transition-colors duration-fast hover:text-bronze-dark"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour au catalogue
          </Link>
          <Reveal>
            <h1 className="mt-6 max-w-2xl font-display text-4xl text-ink md:text-5xl">{category.name}</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite">{category.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <div className="container-cl">
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product) => (
              <Reveal key={product.slug} as="div">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </RevealGroup>
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
            className="shrink-0 rounded-sm bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper transition-transform duration-fast hover:scale-[1.02]"
          >
            Demander un devis
          </Link>
        </div>
      </section>
    </>
  );
}
