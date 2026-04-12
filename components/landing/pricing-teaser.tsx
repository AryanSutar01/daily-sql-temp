"use client";

import { Check, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PracticeLink } from "@/components/landing/practice-link";

export function PricingTeaser() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#09090b] border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#30B5A6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Get Interview-Ready with <span className="text-[#30B5A6]">Daily SQL Premium</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Invest in your career with plans designed for consistency and mastery.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">

          {/* Free Plan */}
          <div className="relative rounded-2xl border border-white/10 bg-[#0c0c0e]/60 backdrop-blur-sm p-8 flex flex-col hover:border-white/20 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">₹0</span>
                <span className="text-zinc-500 text-sm font-medium">/forever</span>
              </div>
              <p className="text-sm text-zinc-400 mt-4 h-10">Perfect for building a daily habit.</p>
            </div>

            <div className="flex-1">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-[#30B5A6] shrink-0" />
                  <span>Access to today's questions</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-[#30B5A6] shrink-0" />
                  <span>Basic progress tracking</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <PracticeLink
                label="Start for Free"
                className="w-full inline-flex items-center justify-center rounded-md border border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white text-sm font-medium h-10 px-4 py-2 transition-colors"
              />
            </div>
          </div>

          {/* Monthly Plan */}
          <div className="relative rounded-2xl border border-[#30B5A6]/30 bg-[#0c0c0e]/80 backdrop-blur-sm p-8 flex flex-col hover:border-[#30B5A6]/50 transition-all duration-300 shadow-[0_0_30px_-10px_rgba(48,181,166,0.15)] transform md:-translate-y-4 z-10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#30B5A6] to-transparent"></div>
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-[#30B5A6]/10 text-[#30B5A6] text-xs font-bold border border-[#30B5A6]/20 uppercase tracking-wide">
                Popular
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Monthly</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">₹899</span>
                <span className="text-zinc-500 text-sm font-medium">/month</span>
              </div>
              <p className="text-sm text-zinc-400 mt-4 h-10">Best for quick interview prep.</p>
            </div>

            <div className="flex-1">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-[#30B5A6] shrink-0" />
                  <span>Access to <strong>all content</strong></span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-[#30B5A6] shrink-0" />
                  <span>Unlimited practice questions</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-[#30B5A6] shrink-0" />
                  <span>Advanced interview questions</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-[#30B5A6] shrink-0" />
                  <span>Detailed solutions & explanations</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-[#30B5A6] shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
              <Button asChild className="w-full bg-[#30B5A6] hover:bg-[#2A9D90] text-[#080C16] font-bold">
                <Link href="/waitlist">Proceed To Payment</Link>
              </Button>
              <p className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
                <Shield size={10} /> Cancel anytime • Secure payments
              </p>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="relative rounded-2xl border border-white/10 bg-[#0c0c0e]/60 backdrop-blur-sm p-8 flex flex-col hover:border-[#30B5A6]/30 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Yearly</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">₹1,999</span>
                <span className="text-zinc-500 text-sm font-medium">/year</span>
              </div>
              <p className="text-sm text-zinc-400 mt-4 h-10">Best value for long-term mastery.</p>
            </div>

            <div className="flex-1">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Star className="w-5 h-5 text-[#30B5A6] shrink-0 fill-[#30B5A6]/20" />
                  <span><strong>Everything in Monthly</strong></span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-[#30B5A6] shrink-0" />
                  <span>Lowest monthly cost (Save 60%)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-[#30B5A6] shrink-0" />
                  <span>Full year of updates</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
              <Button asChild variant="outline" className="w-full border-[#30B5A6]/30 text-[#30B5A6] hover:bg-[#30B5A6]/10 hover:text-[#30B5A6] font-semibold">
                <Link href="/waitlist">Proceed To Payment</Link>
              </Button>
              <p className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
                <Shield size={10} /> No hidden fees
              </p>
            </div>
          </div>

        </div>

        {/* Why Worth It Section */}
        <div className="max-w-3xl mx-auto text-center bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Zap className="text-[#30B5A6]" /> Why Daily SQL Premium is worth it
          </h3>
          <p className="text-zinc-300 leading-relaxed mb-6">
            Data engineering and analytics roles in India often pay over <strong>₹12 LPA</strong>, and at top-tier tech companies,
            total compensation can easily shoot past <strong>₹20 LPA</strong>.
          </p>
          <p className="text-zinc-400 text-sm">
            So yeah—spending just <strong>₹1,999</strong> to get better at SQL, ace your interviews, and level up your career?
            <br className="hidden sm:block" />
            <span className="text-white font-medium">Kind of a no-brainer.</span>
          </p>
        </div>

      </div>
    </section>
  );
}
