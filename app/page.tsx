import { Hero } from "@/components/landing/hero";
import { TargetAudience } from "@/components/landing/target-audience-new";
import { Problem } from "@/components/landing/problem";
import { Comparison } from "@/components/landing/comparison";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ProductPreview } from "@/components/landing/product-preview";
import { BentoGrid } from "@/components/landing/bento-grid";
import { CTASection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { ProfessionAnimation } from "@/components/landing/profession-animation";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Problem />
      <Comparison />
      <HowItWorks />
      <ProductPreview />
      <ProfessionAnimation />
      <BentoGrid />
      <TargetAudience />
      <CTASection />
      <FaqSection />
    </main>
  );
}
