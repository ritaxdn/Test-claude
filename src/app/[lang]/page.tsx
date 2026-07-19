import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { homeContent } from "@/content/home";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { FeaturedTechnologies } from "@/components/sections/FeaturedTechnologies";
import { WhyCellulift } from "@/components/sections/WhyCellulift";
import { SplitHighlight } from "@/components/sections/SplitHighlight";
import { StatsBar } from "@/components/sections/StatsBar";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";
import { GraduationCap, LifeBuoy } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const content = homeContent[lang];

  return (
    <>
      <Hero
        locale={lang}
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        ctaPrimary={content.hero.ctaPrimary}
        ctaSecondary={content.hero.ctaSecondary}
      />

      <Positioning
        eyebrow={content.positioning.eyebrow}
        title={content.positioning.title}
        description={content.positioning.description}
      />

      <FeaturedTechnologies
        locale={lang}
        eyebrow={content.featuredTech.eyebrow}
        title={content.featuredTech.title}
        description={content.featuredTech.description}
        viewAllLabel={dict.common.viewAll}
        readMoreLabel={dict.common.readMore}
      />

      <WhyCellulift
        eyebrow={content.why.eyebrow}
        title={content.why.title}
        items={content.why.items}
      />

      <SplitHighlight
        eyebrow={content.academyHighlight.eyebrow}
        title={content.academyHighlight.title}
        description={content.academyHighlight.description}
        cta={content.academyHighlight.cta}
        href={`/${lang}/academy`}
        icon={GraduationCap}
        tintClassName="bg-rainbow-2"
      />

      <SplitHighlight
        eyebrow={content.supportHighlight.eyebrow}
        title={content.supportHighlight.title}
        description={content.supportHighlight.description}
        cta={content.supportHighlight.cta}
        href={`/${lang}/support`}
        icon={LifeBuoy}
        reverse
        tintClassName="bg-rainbow-4"
      />

      <StatsBar locale={lang} eyebrow={content.stats.eyebrow} title={content.stats.title} />

      <Testimonials
        locale={lang}
        eyebrow={content.testimonials.eyebrow}
        title={content.testimonials.title}
      />

      <FinalCta
        locale={lang}
        title={content.finalCta.title}
        description={content.finalCta.description}
        ctaPrimary={content.finalCta.ctaPrimary}
        ctaSecondary={content.finalCta.ctaSecondary}
      />
    </>
  );
}
