"use client";

import Link from "next/link";
import { PracticeLink } from "@/components/landing/practice-link";
import { Users, Flame, Trophy } from "lucide-react";

export function Hero() {
  const disciplines = ["SQL", "Python (Pandas)", "PySpark"];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 -mt-16">
      {/* Explicit Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Strong Top Left Gradient */}
      <div className="absolute top-0 left-0 w-[800px] h-[600px] bg-[#4DD4C4]/40 blur-[100px] rounded-full pointer-events-none z-0 -translate-x-1/4 -translate-y-1/4" />

      {/* Additional Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute right-0 top-1/2 w-[500px] h-[500px] bg-[#30B5A6]/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">



        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Stay sharp in data skills{" "}
            <span className="block mt-1 bg-gradient-to-r from-[#E0F2FE] via-[#4DD4C4] to-[#30B5A6] bg-clip-text text-transparent leading-[1.05]">
              15 minutes a day
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed pt-2">
            9 curated problems every day — SQL, Python (Pandas), and PySpark —{" "}
            <br className="hidden sm:block" />
            each in Easy, Medium, and Advanced. Built for working data professionals.
          </p>
        </div>

        {/* Discipline pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {disciplines.map((d) => (
            <span
              key={d}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm border border-[#4DD4C4]/20 bg-[#4DD4C4]/5 text-[#4DD4C4] font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DD4C4]" />
              {d}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center pt-2">
          <PracticeLink
            label="Start practicing for free"
            showArrow
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#30B5A6] hover:bg-[#2A9D90] text-[#0a0f1c] font-semibold transition-all duration-200 shadow-lg shadow-[#30B5A6]/20 hover:shadow-[#30B5A6]/30 text-sm"
          />
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white font-medium transition-all duration-200 text-sm"
          >
            See how it works
          </Link>
        </div>

        {/* Quick stats row */}
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center pt-4">
          {[
            { icon: Users, value: "100+", label: "Active users" },
            { icon: Flame, value: "20 days", label: "Avg. streak" },
            { icon: Trophy, value: "3", label: "Disciplines" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-zinc-500">
              <Icon className="w-4 h-4 text-[#4DD4C4]" />
              <span className="text-zinc-300 font-semibold">{value}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
