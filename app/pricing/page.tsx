import type { Metadata } from "next";
import { PricingTeaser } from "@/components/landing/pricing-teaser";

export const metadata: Metadata = {
  title: "Pricing | Daily SQL",
  description: "View pricing plans for Daily SQL. Choose the best plan to level up your SQL skills.",
  alternates: {
    canonical: 'https://dailysql.in/pricing',
  }
};

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-20">
      <PricingTeaser />
    </main>
  );
}

