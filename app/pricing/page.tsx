import type { Metadata } from "next";
import { PricingPageContent } from "@/components/pricing/pricing-page-content";

export const metadata: Metadata = {
  title: "Pricing | Daily SQL — Master SQL, Python & PySpark",
  description: "Simple, transparent pricing for data engineering and analytics mastery. Lifetime access, annual, quarterly, and monthly plans with localized purchasing power.",
  alternates: {
    canonical: 'https://dailysql.in/pricing',
  }
};

export default function PricingPage() {
  return (
    <main className="landing-light min-h-screen bg-[#fafafa]">
      <PricingPageContent />
    </main>
  );
}

