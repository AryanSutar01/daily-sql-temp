import { Card } from "@/components/learn/card";
import { getTutorialsByCategory } from "@/tutorials/pyspark/manifest";
import { Server, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn PySpark | Daily SQL — Distributed Big Data Processing",
  description: "Master Spark architecture, RDDs, DataFrames, Spark SQL, joins, window functions, Delta Lake, streaming, and performance optimization.",
  alternates: {
    canonical: "https://dailysql.in/practice/learn/pyspark",
  },
};

export default function LearnPySparkPage() {
  const tutorialsByCategory = getTutorialsByCategory();

  return (
    <main className="landing-light min-h-screen bg-[#fafafa] text-zinc-900 font-sans pb-24">
      {/* Hero Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#dedee2] bg-white">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/30 text-[11px] font-mono font-bold uppercase tracking-wider shadow-2xs">
            <Server className="w-3.5 h-3.5" /> 46 Lessons · Distributed Big Data
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-zinc-900">
              Learn <span className="text-[#1f9e8e]">PySpark</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 max-w-2xl leading-relaxed">
              Master Apache Spark architecture, distributed DataFrames, window operations, Catalyst internals, and performance tuning for big data engineering.
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
                Spark architecture, SparkSession, RDDs, DataFrames, lazy evaluation, and reading/writing formats.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.beginner} basePath="pyspark" />
          </section>
        )}

        {tutorialsByCategory.intermediate.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Intermediate PySpark</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                Transformations, filters, groupBy, multi-table joins, built-in functions, and Spark SQL expressions.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.intermediate} basePath="pyspark" />
          </section>
        )}

        {tutorialsByCategory.advance.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Advanced PySpark</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                Distributed window functions, UDFs, partitioning, caching, broadcast joins, and Catalyst optimizer internals.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.advance} basePath="pyspark" />
          </section>
        )}
      </div>
    </main>
  );
}
