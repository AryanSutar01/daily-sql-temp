"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
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
        {/* "Now in early access" Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#30B5A6]/20 bg-[#30B5A6]/5 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[#4DD4C4]" />
            <span className="text-sm text-zinc-400">Now in early access</span>
          </div>
        </div>

        {/* Main Heading with Gradient Effect - Tighter spacing */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.0]">
            Stay sharp in SQL with{" "}
            <span className="block mt-1 bg-gradient-to-r from-[#E0F2FE] via-[#4DD4C4] to-[#30B5A6] bg-clip-text text-transparent leading-[1.0]">
              15 minutes a day
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed pt-2">
            Three real-world SQL problems every day. No grinding, no overload.{" "}
            <br className="hidden sm:block" />
            Just consistent practice designed for working data professionals.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Link
            href="/practice/daily"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#30B5A6] hover:bg-[#2A9D90] text-[#0a0f1c] font-medium transition-all duration-200 shadow-lg shadow-[#30B5A6]/20 hover:shadow-[#30B5A6]/30"
          >
            Start your daily practice
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white font-medium transition-all duration-200"
          >
            See how it works
          </Link>
        </div>

        {/* Trust indicator */}
        <p className="text-sm text-zinc-500 pt-4">
          Trusted by data professionals at top companies
        </p>
      </div>
    </section>
  );
}

