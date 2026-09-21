import type { Metadata } from "next";
import { ProblemsLayout } from "@/components/problems/problems-layout";

export const metadata: Metadata = {
  title: "Problemset — Practice SQL, Python & PySpark | Daily SQL",
  description: "Browse and solve curated SQL, Python (Pandas), and PySpark practice problems with real-world business scenarios, company tags, and instant browser sandboxes.",
  alternates: {
    canonical: "https://dailysql.in/problems",
  },
  openGraph: {
    title: "Daily SQL Problemset — Master Data Questions",
    description: "Browse hundreds of SQL, Python, and PySpark coding problems asked at Google, Amazon, Meta, and top tech companies.",
    url: "https://dailysql.in/problems",
    siteName: "Daily SQL",
  },
};

export default function ProblemsPage() {
  return (
    <main className="landing-light min-h-screen">
      <ProblemsLayout />
    </main>
  );
}
