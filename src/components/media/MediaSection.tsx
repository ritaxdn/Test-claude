import type { Locale } from "@/lib/i18n/config";
import { Heading } from "@/components/system/Heading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { LiteYouTube } from "./LiteYouTube";
import { mediaContent, mediaVideos } from "@/content/media";

/**
 * Cellulift en vidéo. Grand écran : deux vidéos 16:9 et un format vertical, tous à la même hauteur
 * (largeur du vertical = 9/16 × 9/16 ≈ 0,316 d'une vidéo 16:9).
 */
export function MediaSection({ locale }: { locale: Locale }) {
  const c = mediaContent[locale];
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.316fr] lg:gap-4">
          {mediaVideos.map((v) => (
            <RevealItem key={v.id} className={v.vertical ? "mx-auto w-3/5 sm:col-span-2 sm:w-1/3 lg:col-span-1 lg:w-full" : ""}>
              <LiteYouTube id={v.id} title={v.title[locale]} playLabel={c.play} vertical={v.vertical} />
              <p className="mt-3 font-sans text-sm font-medium text-deep">{v.title[locale]}</p>
              <p className="data-label mt-1 text-deep-soft">{v.source}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
