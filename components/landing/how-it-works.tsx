"use client";

import { Mail, Clock, TrendingUp, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Mail,
      title: "Receive questions",
      description: "3 daily problems delivered every morning—tailored to your skill level.",
    },
    {
      number: "02",
      icon: Clock,
      title: "15 min practice",
      description: "Solve real business scenarios quickly. No fluff, just practical SQL.",
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "Track progress",
      description: "Build streaks and maintain skills. Watch your consistency compound.",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 border-b border-border/50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white pointer-events-none opacity-[0.02]" />
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-96 h-96 bg-[#30B5A6]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#30B5A6]/10 border border-[#30B5A6]/20 mb-4">
            <span className="text-[#30B5A6] text-sm font-semibold uppercase tracking-wider">How it works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Your daily routine for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#30B5A6] to-[#4DD4C4]">SQL mastery</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps. Fifteen minutes a day. Lifelong skills.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-2xl border border-white/10 bg-[#0A0A0B]/80 backdrop-blur-sm hover:border-[#30B5A6]/30 transition-all duration-500 hover:translate-y-[-4px] overflow-hidden">

                  {/* Gradient Glow on Hover */}
                  <div className="absolute inset-0 bg-[#30B5A6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Number Badge */}
                  <div className="relative mb-6">
                    <div className="absolute -top-4 -left-4 text-[120px] font-black text-white/[0.03] leading-none select-none">
                      {step.number}
                    </div>
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#30B5A6] to-[#4DD4C4] p-[2px]">
                      <div className="w-full h-full bg-[#0A0A0B] rounded-2xl flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">
                        {step.title}
                      </h3>
                      <ArrowRight className="w-5 h-5 text-[#30B5A6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#30B5A6] to-[#4DD4C4] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Connecting Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-3 z-20">
                    <div className="w-6 h-6 rounded-full bg-[#30B5A6]/20 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-[#30B5A6]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA hint */}
        <div className="text-center mt-12">
          <p className="text-sm text-zinc-500">
            Ready to start? <a href="/waitlist" className="text-[#30B5A6] hover:text-[#4DD4C4] font-semibold transition-colors">Join the waitlist →</a>
          </p>
        </div>
      </div>
    </section>
  );
}
