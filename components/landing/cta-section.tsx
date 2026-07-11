"use client";

import { PracticeLink } from "@/components/landing/practice-link";
import { Check, Zap } from "lucide-react";

export function CTASection() {
  const features = [
    "9 new problems every day — SQL, Python & PySpark",
    "Easy, Medium, and Advanced difficulties",
    "Live code execution in isolated sandboxes",
    "Streak tracking and public profile",
    "Leaderboard & community discussion per problem",
    "Structured tutorials for all three disciplines",
  ];

  return (
    <section id="pricing">
      <section className="py-16 md:py-24 bg-[#080c16]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4DD4C4]/30 bg-[#4DD4C4]/10 text-sm text-[#4DD4C4] font-medium">
              <Zap className="w-3.5 h-3.5" />
              Free to start
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Start your daily practice today
            </h2>

            <p className="text-lg text-[#7b8ca3] mb-12">
              Join hundreds of data professionals who already practice for 15 minutes every day. No credit card required.
            </p>

            <div className="p-8 rounded-2xl bg-[#121826] border border-[#202736] shadow-xl relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#4DD4C4]/50 to-transparent" />

              {/* Card Content */}
              <div className="mb-6 text-center flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-white">Free</span>
                <span className="text-[#7b8ca3]">to get started</span>
              </div>

              <ul className="text-left space-y-3 mb-8">
                {features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-[#4DD4C4]/10 border border-[#4DD4C4]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#4DD4C4]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <PracticeLink
                label="Start practicing — it's free"
                showArrow
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#4DD4C4] text-[#080c16] font-bold hover:bg-[#3dbdb0] shadow-[0_0_60px_rgba(77,212,196,0.15)] hover:shadow-[0_0_80px_rgba(77,212,196,0.25)] transition-all duration-300 h-14 rounded-lg px-10 text-base w-full"
              />

              <p className="text-xs text-zinc-600 mt-4">
                No credit card required · Sign up with Google or email
              </p>
            </div>

          </div>
        </div>
      </section>
    </section>
  );
}
