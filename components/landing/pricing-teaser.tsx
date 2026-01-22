import { Check, Zap, Globe, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingTeaser() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#09090b] border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-base/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Simple, Transparent <span className="text-brand-base">Pricing</span>
          </h2>
          <div className="bg-brand-base/10 border border-brand-base/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center justify-center gap-2">
              <Zap size={20} className="text-brand-base" /> Free access for all users
            </h3>
            <p className="text-zinc-400 text-sm md:text-base mb-4">
              Sign-up required. Perfect for daily practice and interview preparation.
            </p>
            <p className="text-brand-light text-sm font-medium">
              "This free access helps us build trust, consistency, and excitement around Daily SQL."
            </p>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Basic Plan */}
          <div className="relative rounded-2xl border border-brand-base/30 bg-[#0c0c0e]/80 backdrop-blur-sm p-8 flex flex-col hover:border-brand-base/50 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(var(--brand-base-rgb),0.1)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-base to-transparent opacity-50"></div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Basic Plan</h3>
                <span className="px-3 py-1 rounded-full bg-brand-base/10 text-brand-base text-xs font-semibold border border-brand-base/20">
                  Daily Access
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">Free</span>
                <span className="text-zinc-500 text-sm font-medium">/forever</span>
              </div>
              <p className="text-sm text-zinc-400 mt-2">Best for beginners & quick daily practice.</p>
            </div>

            <div className="flex-1 space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-brand-base shrink-0" />
                  <span>Access to <strong className="text-white">today's SQL questions</strong> only</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-brand-base shrink-0" />
                  <span>Fresh questions updated every day</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Globe className="w-5 h-5 text-brand-base shrink-0" />
                  <span>Pricing optimized for India & USA markets</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <Button asChild className="w-full bg-brand-base hover:bg-brand-light text-white font-semibold">
                <Link href="/waitlist">Start Daily Practice</Link>
              </Button>
            </div>
          </div>

          {/* Advanced Plan */}
          <div className="relative rounded-2xl border border-white/10 bg-[#0c0c0e]/40 p-8 flex flex-col hover:border-white/20 transition-all duration-300">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Advanced Plan</h3>
                <span className="px-3 py-1 rounded-full bg-white/10 text-zinc-400 text-xs font-semibold border border-white/10">
                  Power Users
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-zinc-500">Coming Soon</span>
              </div>
              <p className="text-sm text-zinc-400 mt-2">For working professionals & interview prep.</p>
            </div>

            <div className="flex-1 space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-5 h-5 text-brand-base shrink-0" />
                  <span>Access to <strong className="text-white">last 7 days</strong> of questions</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <FileText className="w-5 h-5 text-brand-base shrink-0" />
                  <span>Weekly PDF of all questions via email</span>
                </li>
              </ul>

              {/* Coming Soon Features */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-3">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Lock size={12} /> Coming Soon
                </div>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> Detailed solutions & explanations
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> Performance tracking
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> Difficulty-based filters
                </li>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white">
                <Link href="/waitlist">Join Waitlist</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

