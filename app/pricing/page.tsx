import type { Metadata } from "next";
import { cookies } from "next/headers";
import { fetchPlans, CURRENCY_COOKIE } from "@/lib/plans";
import { PricingPageContent } from "@/components/pricing/pricing-page-content";

export const metadata: Metadata = {
  title: "Pricing | Daily SQL — Master SQL, Python & PySpark",
  description: "Simple, transparent pricing for data engineering and analytics mastery. Lifetime access, annual, quarterly, and monthly plans with localized purchasing power.",
  alternates: {
    canonical: 'https://dailysql.in/pricing',
  }
};

export default async function PricingPage() {
  const plans = await fetchPlans({ next: { revalidate: 60 } });
  // middleware.ts sets this from the visitor's country on first visit, or from their own toggle choice
  // thereafter. Read server-side so the right currency renders on the very first paint.
  const cookieStore = await cookies();
  const initialCurrency = cookieStore.get(CURRENCY_COOKIE)?.value === "USD" ? "USD" : "INR";

  return (
    <main className="landing-light min-h-screen bg-[#fafafa]">
      <PricingPageContent plans={plans} initialCurrency={initialCurrency} />
    </main>
  );
}
