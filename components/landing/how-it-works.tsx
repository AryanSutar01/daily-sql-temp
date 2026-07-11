"use client";

import { Database, Code2, Server } from "lucide-react";

export function HowItWorks() {
  const disciplines = [
    { icon: Database, label: "SQL", description: "PostgreSQL — window functions, CTEs, aggregations", color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20" },
    { icon: Code2, label: "Python (Pandas)", description: "Data wrangling, groupby, merges, time-series", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
    { icon: Server, label: "PySpark", description: "Distributed transformations, Spark SQL, window ops", color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20" },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">How it works</h2>
          <p className="text-lg text-[#7b8ca3] text-center mb-16 max-w-2xl mx-auto">
            A simple daily flow designed for busy data professionals
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Step 01 */}
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-full w-full h-px bg-[#202736] -translate-x-4"></div>
              <div className="text-5xl font-bold text-[#4DD4C4]/20 mb-4">01</div>
              <h3 className="text-xl font-semibold text-white mb-3">Pick your discipline</h3>
              <p className="text-[#7b8ca3]">
                Every day, 9 fresh problems are waiting — 3 SQL, 3 Python, and 3 PySpark. Each in Easy, Medium, and Advanced. Work through all three or focus on what you need most.
              </p>
            </div>

            {/* Step 02 */}
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-full w-full h-px bg-[#202736] -translate-x-4"></div>
              <div className="text-5xl font-bold text-[#4DD4C4]/20 mb-4">02</div>
              <h3 className="text-xl font-semibold text-white mb-3">Solve real problems</h3>
              <p className="text-[#7b8ca3]">
                Write code in the browser editor. Your submission runs in an isolated sandbox — real PostgreSQL for SQL, real Python for Pandas, real Spark for PySpark. Instant graded feedback.
              </p>
            </div>

            {/* Step 03 */}
            <div className="relative">
              <div className="text-5xl font-bold text-[#4DD4C4]/20 mb-4">03</div>
              <h3 className="text-xl font-semibold text-white mb-3">Build streak & reputation</h3>
              <p className="text-[#7b8ca3]">
                Track your daily streak and solve history. Share your public profile, check the leaderboard, and discuss solutions with the community — all in one place.
              </p>
            </div>
          </div>

          {/* Disciplines row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {disciplines.map(({ icon: Icon, label, description, color, bg, border }) => (
              <div key={label} className={`flex items-start gap-4 p-4 rounded-xl border ${border} ${bg}`}>
                <div className={`w-9 h-9 rounded-lg ${bg} border ${border} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${color} mb-0.5`}>{label}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
