import { Hero } from "@/components/landing/hero";
import { TrustStrip } from "@/components/landing/trust-strip";
import { Problem } from "@/components/landing/problem";
import { Comparison } from "@/components/landing/comparison";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ProductPreview } from "@/components/landing/product-preview";
import { StatCards } from "@/components/landing/stat-cards";
import { BentoGrid } from "@/components/landing/bento-grid";
import { WhyThisWorks } from "@/components/landing/why-this-works";
import { ExampleQuestion } from "@/components/landing/example-question";
import { FounderNote } from "@/components/landing/founder-note";
import { Features } from "@/components/landing/features";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <TrustStrip />
      <Problem />
      <Comparison />
      <HowItWorks />
      <ProductPreview />
      <StatCards />
      <BentoGrid />
      <WhyThisWorks />
      <ExampleQuestion />
      <FounderNote />
      <PricingTeaser />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
