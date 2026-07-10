import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/data/categories";
import { TechDiagram } from "@/components/illustrations/TechDiagram";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategoryBySlug(product.categorySlug);

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex h-full flex-col justify-between border border-border bg-paper p-7 transition-colors duration-fast hover:border-bronze/50 hover:bg-white"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium tracking-wide text-graphite-soft">{category?.name}</span>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-graphite-soft">
            {product.tier}
          </span>
        </div>
        <div className="mx-auto mt-4 w-full max-w-[160px] opacity-90 transition-opacity duration-fast group-hover:opacity-100">
          <TechDiagram motif={category?.motif ?? "wave"} active={false} />
        </div>
        <h3 className="mt-4 font-display text-lg text-ink">{product.name}</h3>
        <p className="mt-1.5 text-sm text-graphite">{product.tagline}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors duration-fast group-hover:text-bronze-dark">
        Voir la fiche technique
        <ArrowUpRight className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </span>
    </Link>
  );
}
