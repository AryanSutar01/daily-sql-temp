import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { CompanyCarousel } from "@/components/landing/company-carousel";
import { PickYourPath } from "@/components/landing/pick-your-path";
import { ProductPreview } from "@/components/landing/product-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SocialProof } from "@/components/landing/social-proof";
import { LeaderboardSection } from "@/components/landing/leaderboard-section";
import { CTASection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";

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
    <div className="landing-light">
      {/* Hero — editorial headline + floating cards */}
      <Hero />

      {/* Social proof logos */}
      <CompanyCarousel />

      {/* Pick your path — SQL / PySpark / Python */}
      <PickYourPath />

      {/* Testimonials — build trust before showing the product */}
      <SocialProof />

      {/* Interactive editor demo */}
      <ProductPreview />

      {/* How it works */}
      <HowItWorks />

      {/* Community / leaderboard */}
      <LeaderboardSection />

      {/* Pricing CTA */}
      <CTASection />

      {/* FAQ */}
      <FaqSection />
    </div>
  );
}
