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
import { CompanyCarousel } from "@/components/landing/company-carousel";
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
    description: "9 curated problems every day — SQL (PostgreSQL), Python (Pandas), and PySpark. Built for working data professionals who want to stay interview-ready.",
    url: "https://dailysql.in",
    siteName: "Daily SQL",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dfkbfv9op/image/upload/c_pad,w_1600,h_900,b_rgb:0a0f1e/v1788882180/dailysql/dailysql-og-image.jpg",
        width: 1600,
        height: 900,
        alt: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily SQL — Master SQL, Python & PySpark in 15 Minutes a Day",
    description: "9 curated problems every day — SQL (PostgreSQL), Python (Pandas), and PySpark. Built for working data professionals who want to stay interview-ready.",
    images: ["https://res.cloudinary.com/dfkbfv9op/image/upload/c_pad,w_1600,h_900,b_rgb:0a0f1e/v1788882180/dailysql/dailysql-og-image.jpg"],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CompanyCarousel />
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
