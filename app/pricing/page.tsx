import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PricingPageContent } from "@/components/pricing/pricing-page-content";

export const metadata: Metadata = {
  title: "Pricing | Daily SQL — Master SQL, Python & PySpark",
  description: "Simple, transparent pricing for data engineering and analytics mastery. Lifetime access, annual, quarterly, and monthly plans with localized purchasing power.",
  alternates: {
    canonical: 'https://dailysql.in/pricing',
  }
};

export default async function PricingPage() {
  // middleware.ts sets this from Vercel's edge geolocation (India -> INR, else USD) on first
  // visit, or from the visitor's own toggle choice thereafter. Read server-side so the right
  // currency renders on the very first paint — no flash of the wrong one before a client effect runs.
  const cookieStore = await cookies();
  const initialCurrency = cookieStore.get("dsql_currency")?.value === "USD" ? "USD" : "INR";

  return (
    <main className="landing-light min-h-screen bg-[#fafafa]">
      <PricingPageContent initialCurrency={initialCurrency} />
    </main>
  );
}

