import { Hero } from "@/components/sections/Hero";
import { ValueProps } from "@/components/sections/ValueProps";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { FlagshipTech } from "@/components/sections/FlagshipTech";
import { ROISection } from "@/components/sections/ROISection";
import { TrustBar } from "@/components/sections/TrustBar";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { organizationJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <Hero />
      <ValueProps />
      <CategoryGrid />
      <FlagshipTech />
      <ROISection />
      <TrustBar />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
