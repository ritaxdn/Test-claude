import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { CategoryIndex } from "@/components/sections/CategoryIndex";
import { ProductTheater } from "@/components/sections/ProductTheater";
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
      <Manifesto />
      <CategoryIndex />
      <ProductTheater />
      <ROISection />
      <TrustBar />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
