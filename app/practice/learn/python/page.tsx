import { Card } from "@/components/learn/card";
import { getTutorialsByCategory } from "@/tutorials/python/manifest";
import { Code2, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Python | Daily SQL — Data Fundamentals to Advanced",
  description: "Master Python fundamentals, OOP, async patterns, collections, and interview concepts with interactive lessons and practical exercises.",
  alternates: {
    canonical: "https://dailysql.in/practice/learn/python",
  },
};

export default function LearnPythonPage() {
  const tutorialsByCategory = getTutorialsByCategory();

  return (
    <main className="landing-light min-h-screen bg-[#fafafa] text-zinc-900 font-sans pb-24">
      {/* Hero Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#dedee2] bg-white">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/30 text-[11px] font-mono font-bold uppercase tracking-wider shadow-2xs">
            <Code2 className="w-3.5 h-3.5" /> 52 Lessons · Data &amp; Core Patterns
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-zinc-900">
              Learn <span className="text-[#1f9e8e]">Python</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 max-w-2xl leading-relaxed">
              Master Python from core variables and collections to advanced decorators, OOP, async pipelines, and interview algorithms.
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
                Variables, data types, strings, lists, dicts, loops, and functions — the essential building blocks.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.beginner} basePath="python" />
          </section>
        )}

        {tutorialsByCategory.intermediate.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Core Python</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                Comprehensions, lambdas, generators, decorators, OOP, and magic methods.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.intermediate} basePath="python" />
          </section>
        )}

        {tutorialsByCategory.advance.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Advanced Python</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                Metaclasses, context managers, async/await, memory management, and typing.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.advance} basePath="python" />
          </section>
        )}

        {tutorialsByCategory.dataAndPerformance.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Data &amp; Performance</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                Pandas, NumPy, working with APIs, and high-performance data processing.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.dataAndPerformance} basePath="python" />
          </section>
        )}

        {tutorialsByCategory.bonus.length > 0 && (
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="h-5 w-1 rounded-full bg-[#1f9e8e]" />
                <h2 className="text-xl font-bold font-mono text-zinc-900">Bonus &amp; Pitfalls</h2>
              </div>
              <p className="text-xs text-zinc-500 ml-3.5">
                Memory optimization, slots, common interview pitfalls, and production tricks.
              </p>
            </div>
            <Card tutorials={tutorialsByCategory.bonus} basePath="python" />
          </section>
        )}
      </div>
    </main>
  );
}
