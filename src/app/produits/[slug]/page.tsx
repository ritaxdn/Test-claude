import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { products, getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";
import { TechDiagram } from "@/components/illustrations/TechDiagram";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { ScrollStory } from "@/components/motion/ScrollStory";
import { HorizontalRail } from "@/components/motion/HorizontalRail";
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
  const motif = category?.motif ?? "wave";

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

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-ink py-20 text-paper md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-1/2 hidden w-[420px] -translate-y-1/2 opacity-[0.4] lg:block"
        >
          <TechDiagram motif={motif} tone="on-ink" />
        </div>

        <div className="container-cl relative">
          {category && (
            <Link
              href={`/catalogue/${category.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-paper/60 transition-colors duration-fast hover:text-paper"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {category.name}
            </Link>
          )}

          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full border border-paper/25 px-2.5 py-0.5 text-xs font-medium tracking-wide text-paper/70">
              Modèle {product.tier}
            </span>
            {category && (
              <span className="font-mono text-xs tracking-wide text-paper/50">{category.stat.value}</span>
            )}
          </div>

          <SplitHeadline
            as="h1"
            trigger="mount"
            className="mt-5 max-w-2xl font-display text-5xl leading-[1.02] md:text-7xl"
          >
            {product.name}
          </SplitHeadline>

          <p className="mt-6 max-w-lg text-lg text-paper/75">{product.tagline}</p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={`/devis?produit=${encodeURIComponent(product.name)}`}
              className="inline-flex items-center justify-center rounded-sm bg-paper px-7 py-3.5 text-sm font-medium tracking-wide text-ink transition-transform duration-fast hover:scale-[1.02]"
            >
              Demander un devis
            </Link>
            <a
              href="#fiche-technique"
              className="inline-flex items-center justify-center rounded-sm border border-paper/30 px-7 py-3.5 text-sm font-medium tracking-wide text-paper transition-colors duration-fast hover:bg-paper/10"
            >
              Voir la fiche technique
            </a>
          </div>
        </div>
      </section>

      {/* Scroll story */}
      {product.storyChapters.length > 0 && (
        <section className="bg-paper py-20 md:py-28">
          <div className="container-cl">
            <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">POURQUOI CETTE MACHINE</p>
            <ScrollStory
              chapters={product.storyChapters}
              visual={<TechDiagram motif={motif} className="w-full max-w-sm" />}
              className="mt-8"
            />
          </div>
        </section>
      )}

      {/* Indications & features */}
      <section className="border-t border-border bg-paper-alt py-16 md:py-20">
        <div className="container-cl grid grid-cols-1 gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl text-ink">Indications principales</h2>
            <ul className="mt-6 space-y-3">
              {product.indications.map((indication) => (
                <li key={indication} className="flex items-start gap-2.5 text-sm text-graphite">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" aria-hidden />
                  {indication}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-2xl text-ink">Points clés</h2>
            <ul className="mt-6 space-y-3">
              {product.keyFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-graphite">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bronze-dark" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Spec sheet + quote form */}
      <section id="fiche-technique" className="scroll-mt-24 bg-paper py-16 md:py-24">
        <div className="container-cl grid grid-cols-1 gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="font-display text-2xl text-ink">Fiche technique</h2>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              {product.technicalHighlights.map((highlight) => (
                <div key={highlight.label} className="flex items-center justify-between gap-4 py-4">
                  <dt className="text-sm text-graphite-soft">{highlight.label}</dt>
                  <dd className="font-mono text-sm text-ink">{highlight.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-graphite-soft">
              Caractéristiques indicatives — fiche technique complète transmise avec le devis.
            </p>

            <h2 className="mt-12 font-display text-2xl text-ink">Idéal pour</h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {product.idealFor.map((target) => (
                <span
                  key={target}
                  className="rounded-full border border-border bg-paper-alt px-3.5 py-1.5 text-xs font-medium text-ink-soft"
                >
                  {target}
                </span>
              ))}
            </div>
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
          </div>
          <div className="container-cl mt-8">
            <HorizontalRail>
              {related.map((item) => (
                <div key={item.slug} className="w-[85vw] shrink-0 snap-start sm:w-[340px]">
                  <ProductCard product={item} />
                </div>
              ))}
            </HorizontalRail>
          </div>
        </section>
      )}
    </>
  );
}
