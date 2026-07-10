import type { Metadata } from "next";
import { CatalogueIndex } from "@/components/CatalogueIndex";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
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
          <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">CATALOGUE COMPLET</p>
          <SplitHeadline
            as="h1"
            trigger="mount"
            className="mt-3 max-w-2xl font-display text-4xl text-ink md:text-5xl"
          >
            Plus de 40 technologies LGL Expert, réparties en 15 familles.
          </SplitHeadline>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite">
            Chaque famille regroupe plusieurs machines, du modèle Essentiel au modèle Expert. Survolez ou
            sélectionnez une famille pour découvrir sa raison d&apos;être et les technologies associées.
          </p>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="container-cl">
          <CatalogueIndex />
        </div>
      </section>
    </>
  );
}
