import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { homeContent } from "@/content/home";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { Timeline } from "@/components/sections/Timeline";
import { FlagshipMachines } from "@/components/sections/FlagshipMachines";
import { FeaturedTechnologies } from "@/components/sections/FeaturedTechnologies";
import { MetierSelector } from "@/components/sections/MetierSelector";
import { WhyCellulift } from "@/components/sections/WhyCellulift";
import { SplitHighlight } from "@/components/sections/SplitHighlight";
import { StatsBar } from "@/components/sections/StatsBar";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { ResultsShowcase } from "@/components/sections/ResultsShowcase";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";
import { Container } from "@/components/ui/Container";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { GraduationCap, LifeBuoy } from "lucide-react";

function Separator() {
  return (
    <Container className="py-1">
      <SectionSeparator />
    </Container>
  );
}

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

      <Separator />

      <Positioning
        eyebrow={content.positioning.eyebrow}
        title={content.positioning.title}
        description={content.positioning.description}
      />

      <Timeline
        locale={lang}
        eyebrow={content.timeline.eyebrow}
        title={content.timeline.title}
        description={content.timeline.description}
      />

      <WhyCellulift
        eyebrow={content.why.eyebrow}
        title={content.why.title}
        items={content.why.items}
      />

      <Separator />

      <div id="machines" className="scroll-mt-24">
        <FlagshipMachines
          locale={lang}
          eyebrow={content.flagshipMachines.eyebrow}
          title={content.flagshipMachines.title}
          description={content.flagshipMachines.description}
          allLabel={content.flagshipMachines.allLabel}
        />
      </div>

      <Separator />

      <FeaturedTechnologies
        locale={lang}
        eyebrow={content.featuredTech.eyebrow}
        title={content.featuredTech.title}
        description={content.featuredTech.description}
        viewAllLabel={dict.common.viewAll}
        readMoreLabel={dict.common.readMore}
      />

      <div id="metiers" className="scroll-mt-24">
        <MetierSelector
          locale={lang}
          eyebrow={content.metiers.eyebrow}
          title={content.metiers.title}
          description={content.metiers.description}
          cta={content.metiers.cta}
          contactHref={`/${lang}/contact`}
        />
      </div>

      <Separator />

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

      <RoiCalculator
        eyebrow={content.roi.eyebrow}
        title={content.roi.title}
        description={content.roi.description}
        sessionsCopy={{ label: content.roi.sessionsLabel, unit: content.roi.sessionsUnit }}
        occupancyCopy={{ label: content.roi.occupancyLabel, unit: content.roi.occupancyUnit }}
        resultLabel={content.roi.resultLabel}
        disclaimer={content.roi.disclaimer}
      />

      <ResultsShowcase
        eyebrow={content.beforeAfter.eyebrow}
        title={content.beforeAfter.title}
        description={content.beforeAfter.description}
        beforeLabel={content.beforeAfter.beforeLabel}
        afterLabel={content.beforeAfter.afterLabel}
      />

      <Separator />

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
