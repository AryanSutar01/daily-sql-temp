import { Card } from "@/components/learn/card";
import { getTutorialsByCategory } from "@/tutorials/sql/manifest";
import { Database, BookOpen, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn SQL | Daily SQL — Comprehensive Interactive Course",
  description: "Master essential SQL theory and patterns for interviews — window functions, CTEs, aggregations, schema design, and query optimization.",
  alternates: {
    canonical: "https://dailysql.in/practice/learn/sql",
  },
};

export default function LearnSQLPage() {
  const tutorialsByCategory = getTutorialsByCategory();

  return (
    <main className="landing-light min-h-screen bg-[#fafafa] text-zinc-900 font-sans pb-24">
      {/* Hero Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#dedee2] bg-white">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/30 text-[11px] font-mono font-bold uppercase tracking-wider shadow-2xs">
            <Database className="w-3.5 h-3.5" /> 52 Lessons · Interactive Curriculum
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-zinc-900">
              Learn <span className="text-[#1f9e8e]">SQL</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 max-w-2xl leading-relaxed">
              Master core database concepts with focused explanations, practical examples, and interview-proven query patterns.
            </p>
          </div>
        </div>
      </section>

      {/* Content Curriculum Categories */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {tutorialsByCategory.beginner.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Foundation</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                Core SQL syntax and concepts every beginner must know before writing their first query.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.beginner} basePath="sql" />
          </section>
        )}

        {tutorialsByCategory.intermediate.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Core Querying</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                The bread and butter of SQL interviews — aggregations, joins, and filtering logic.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.intermediate} basePath="sql" />
          </section>
        )}

        {tutorialsByCategory.advance.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Advanced Topics</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                Window functions, common table expressions (CTEs), and recursive queries that separate top candidates.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.advance} basePath="sql" />
          </section>
        )}

        {tutorialsByCategory.designAndPerformance.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Design &amp; Performance</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                Schema design, indexes, performance tuning, and query execution planning.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.designAndPerformance} basePath="sql" />
          </section>
        )}

        {tutorialsByCategory.bonus.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Real-World &amp; Analytics</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                Practical analytics patterns for data analysts, analytics engineers, and data warehouse practitioners.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.bonus} basePath="sql" />
          </section>
        )}
      </div>
    </main>
  );
}
