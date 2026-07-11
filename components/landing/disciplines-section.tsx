"use client";

import Link from "next/link";
import { Database, Code2, Server, BookOpen, ChevronRight } from "lucide-react";

const DISCIPLINES = [
  {
    icon: Database,
    label: "SQL",
    color: "text-sky-400",
    border: "border-sky-400/20",
    bg: "bg-sky-400/5",
    iconBg: "bg-sky-400/10",
    lessons: 52,
    href: "/practice/learn/sql",
    topics: ["Window functions & CTEs", "Complex aggregations", "Cohort & retention queries", "Date & time calculations", "Query optimization"],
  },
  {
    icon: Code2,
    label: "Python (Pandas)",
    color: "text-amber-400",
    border: "border-amber-400/20",
    bg: "bg-amber-400/5",
    iconBg: "bg-amber-400/10",
    lessons: 52,
    href: "/practice/learn/python",
    topics: ["DataFrame operations", "GroupBy & aggregations", "Merges & joins", "Time-series manipulation", "Data cleaning patterns"],
  },
  {
    icon: Server,
    label: "PySpark",
    color: "text-violet-400",
    border: "border-violet-400/20",
    bg: "bg-violet-400/5",
    iconBg: "bg-violet-400/10",
    lessons: 46,
    href: "/practice/learn/pyspark",
    topics: ["Spark DataFrames & SQL", "Window functions", "Partitioning & bucketing", "RDD transformations", "Performance tuning"],
  },
];

export function DisciplinesSection() {
  return (
    <section className="py-24 md:py-32 bg-[#080c16]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4DD4C4]/30 bg-[#4DD4C4]/10 text-sm text-[#4DD4C4] font-medium mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              Practice + Learn
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
              Three disciplines. One platform.
            </h2>
            <p className="text-base md:text-lg text-[#7b8ca3] max-w-2xl mx-auto">
              Daily problems keep you sharp. Structured tutorials help you fill the gaps. Both — in the same place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DISCIPLINES.map(({ icon: Icon, label, color, border, bg, iconBg, lessons, href, topics }) => (
              <div
                key={label}
                className={`relative p-6 rounded-xl border ${border} ${bg} hover:shadow-lg transition-all duration-300 group flex flex-col`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-lg ${iconBg} border ${border} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${color}`}>{label}</h3>
                    <p className="text-xs text-zinc-500">{lessons} tutorials</p>
                  </div>
                </div>

                {/* Topics */}
                <ul className="space-y-2 flex-1">
                  {topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2 text-sm text-zinc-400">
                      <ChevronRight className={`w-3.5 h-3.5 ${color} shrink-0`} />
                      {topic}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={href}
                  className={`mt-6 flex items-center gap-1.5 text-sm font-medium ${color} hover:opacity-80 transition-opacity`}
                >
                  Start learning →
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-zinc-600 mt-10">
            150 tutorials total · All free · Pick up where you left off anytime
          </p>
        </div>
      </div>
    </section>
  );
}
