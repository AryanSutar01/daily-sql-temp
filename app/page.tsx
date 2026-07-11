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
import { SocialProof } from "@/components/landing/social-proof";
import { LeaderboardSection } from "@/components/landing/leaderboard-section";
import { DisciplinesSection } from "@/components/landing/disciplines-section";

export const metadata: Metadata = {
  title: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
  description: "A daily practice platform for data professionals. 9 curated problems every day — SQL (PostgreSQL), Python (Pandas), and PySpark — each in Easy, Medium, and Advanced. Build consistency, track streaks, and stay interview-ready.",
  keywords: [
    "SQL practice",
    "Daily SQL",
    "PySpark practice",
    "Python Pandas practice",
    "data engineering practice",
    "data analyst SQL",
    "SQL interview preparation",
    "PySpark interview prep",
    "pandas interview questions",
    "daily coding challenge",
    "data skills practice",
    "window functions SQL",
    "SQL for data analysts",
  ],
  alternates: {
    canonical: 'https://dailysql.in',
  },
  openGraph: {
    title: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
    description: "9 problems a day across SQL, Python (Pandas), and PySpark. Built for working data professionals.",
    url: "https://dailysql.in",
    siteName: "Daily SQL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
    description: "9 problems a day across SQL, Python (Pandas), and PySpark. Built for working data professionals.",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Problem />
      <Comparison />
      <HowItWorks />
      <ProductPreview />
      <SocialProof />
      <ProfessionAnimation />
      <DisciplinesSection />
      <LeaderboardSection />
      <BentoGrid />
      <TargetAudience />
      <CTASection />
      <FaqSection />
    </main>
  );
}
