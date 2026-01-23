"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white pointer-events-none z-[-1]" />

      {/* Premium Background Glow - Teal Theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-[-2]">
        <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-[#30B5A6]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-[#30B5A6]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-12">
        {/* Main Heading with Gradient Effect */}
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Stay sharp in SQL with{" "}
            <span className="block mt-2 bg-gradient-to-r from-[#E0F2FE] via-[#4DD4C4] to-[#30B5A6] bg-clip-text text-transparent pb-4 leading-tight">
              15 minutes a day
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Three real-world SQL problems every day. No grinding, no overload.{" "}
            <br className="hidden sm:block" />
            Just consistent practice designed for working data professionals.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="bg-[#30B5A6] hover:bg-[#2A9D90] text-[#080C16] font-semibold px-10 py-7 text-lg shadow-lg shadow-[#30B5A6]/20 hover:shadow-[#30B5A6]/30 transition-all duration-200">
            <Link href="/waitlist">Start your daily practice</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-2 border-border/50 px-10 py-7 text-lg hover:bg-accent/50 transition-all duration-200">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


