import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Daily SQL - Master SQL in 15 Minutes a Day",
  description: "A daily SQL practice platform for professionals who already know SQL and want to stay sharp. Exactly 3 SQL questions every day with real business-style problems.",
  keywords: ["SQL", "Daily SQL", "SQL practice", "learn SQL", "SQL interview preparation", "database queries", "data analytics"],
  alternates: {
    canonical: 'https://dailysql.in',
  }
};

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
