import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { products, getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProductCard } from "@/components/ProductCard";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return {};

  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const related = getRelatedProducts(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productJsonLd({
              name: product.name,
              tagline: product.tagline,
              description: product.description,
              slug: product.slug,
              categoryName: category?.name ?? "",
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", url: "/" },
              { name: "Catalogue", url: "/catalogue" },
              ...(category ? [{ name: category.name, url: `/catalogue/${category.slug}` }] : []),
              { name: product.name, url: `/produits/${product.slug}` },
            ])
          ),
        }}
      />

      <section className="border-b border-border bg-paper-alt py-14 md:py-20">
        <div className="container-cl">
          {category && (
            <Link
              href={`/catalogue/${category.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-graphite transition-colors duration-fast hover:text-bronze-dark"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {category.name}
            </Link>
          )}

          <Reveal>
            <div className="mt-6 flex items-center gap-3">
              {category && <CategoryIcon name={category.icon} className="h-6 w-6 text-bronze-dark" />}
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium tracking-wide text-graphite-soft">
                Modèle {product.tier}
              </span>
            </div>
            <h1 className="mt-4 max-w-2xl font-display text-4xl text-ink md:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-graphite">{product.tagline}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <div className="container-cl grid grid-cols-1 gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal>
              <p className="text-base leading-relaxed text-graphite">{product.description}</p>
            </Reveal>

            <Reveal>
              <h2 className="mt-10 font-display text-2xl text-ink">Indications principales</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {product.indications.map((indication) => (
                  <li key={indication} className="flex items-start gap-2 text-sm text-graphite">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" aria-hidden />
                    {indication}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="mt-10 font-display text-2xl text-ink">Points clés</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2.5">
                {product.keyFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-graphite">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="mt-10 font-display text-2xl text-ink">Caractéristiques techniques</h2>
              <dl className="mt-4 divide-y divide-border border-y border-border">
                {product.technicalHighlights.map((highlight) => (
                  <div key={highlight.label} className="flex items-center justify-between gap-4 py-3.5 text-sm">
                    <dt className="text-graphite-soft">{highlight.label}</dt>
                    <dd className="font-medium text-ink">{highlight.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-graphite-soft">
                Caractéristiques indicatives — fiche technique complète transmise avec le devis.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="mt-10 font-display text-2xl text-ink">Idéal pour</h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {product.idealFor.map((target) => (
                  <span
                    key={target}
                    className="rounded-full border border-border bg-paper-alt px-3.5 py-1.5 text-xs font-medium text-ink-soft"
                  >
                    {target}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <QuoteForm
              intent="devis"
              title="Demander un devis pour cette machine"
              description="Précisez votre projet, un conseiller vous recontacte sous 24h ouvrées."
              submitLabel="Demander mon devis"
              defaultInterestedProduct={product.name}
              compact
            />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-paper-alt py-16 md:py-20">
          <div className="container-cl">
            <h2 className="font-display text-2xl text-ink">Autres machines de la même famille</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
