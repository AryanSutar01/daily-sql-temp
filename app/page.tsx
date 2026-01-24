import { Hero } from "@/components/landing/hero";
import { TrustStrip } from "@/components/landing/trust-strip";
import { TargetAudience } from "@/components/landing/target-audience-new";
import { Problem } from "@/components/landing/problem";
import { Comparison } from "@/components/landing/comparison";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ProductPreview } from "@/components/landing/product-preview";
import { StatCards } from "@/components/landing/stat-cards";
import { BentoGrid } from "@/components/landing/bento-grid";

import { Features } from "@/components/landing/features";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <TrustStrip />
      <TargetAudience />
      <Problem />
      <Comparison />
      <HowItWorks />
      <ProductPreview />
      <StatCards />
      <BentoGrid />
    </main>
  );
}
