"use client";

import { Check, Sparkles, Shield, Zap, ArrowRight, Star, Crown } from "lucide-react";
import Link from "next/link";
import { PracticeLink } from "@/components/landing/practice-link";

export function CTASection() {
  return (
    <section
      id="pricing"
      style={{
        padding: "100px 0 100px",
        background: "var(--ls-bg)",
        borderBottom: "1px solid var(--ls-outline)",
      }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1400 }}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.16em] mb-4"
            style={{
              background: "var(--ls-primary-container)",
              color: "var(--ls-primary)",
              border: "1px solid rgba(31,158,142,0.2)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Pricing & Plans
          </div>
          <h2
            style={{
              fontFamily: "'Overused Grotesk', system-ui, sans-serif",
              fontSize: "clamp(2.1rem, 3.8vw, 3rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              color: "var(--ls-on-surface)",
            }}
          >
            Invest in your data career.
            <br />
            <span style={{ color: "var(--ls-on-surface-muted)", fontWeight: 400 }}>
              Stay sharp, confident, and interview-ready.
            </span>
          </h2>
          <p
            className="mt-4 text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "var(--ls-on-surface-muted)" }}
          >
            Start practicing for free today, or upgrade to unlock complete archives, deep explanations, and interview mastery.
          </p>
        </div>

        {/* Pricing Cards Grid (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto mb-16">

          {/* ────── 1. FREE PLAN ────── */}
          <div
            className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px]"
            style={{
              background: "var(--ls-surface)",
              border: "1px solid var(--ls-outline)",
              boxShadow: "var(--ls-shadow-sm)",
            }}
          >
            <div>
              <div className="mb-6">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider"
                  style={{
                    background: "var(--ls-surface-container)",
                    color: "var(--ls-on-surface-muted)",
                    border: "1px solid var(--ls-outline)",
                  }}
                >
                  Free Forever
                </span>
                <h3 className="text-xl font-semibold mt-3" style={{ color: "var(--ls-on-surface)" }}>
                  Free
                </h3>
                <p className="text-xs mt-1.5 min-h-[32px]" style={{ color: "var(--ls-on-surface-muted)" }}>
                  Perfect for establishing a daily coding habit.
                </p>
              </div>

              <div className="mb-6 pb-6 border-b" style={{ borderColor: "var(--ls-outline)" }}>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-3xl sm:text-4xl font-bold font-mono tracking-tight"
                    style={{ color: "var(--ls-on-surface)" }}
                  >
                    ₹0
                  </span>
                  <span className="text-xs font-medium" style={{ color: "var(--ls-on-surface-subtle)" }}>
                    / forever
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {[
                  "9 new daily problems (SQL, Python & Spark)",
                  "Isolated in-browser code execution",
                  "Instant automated test results",
                  "Daily streak & solve history tracking",
                  "Global weekly leaderboard rank",
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: "var(--ls-on-surface)" }}>
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "var(--ls-surface-container)" }}
                    >
                      <Check className="w-2.5 h-2.5" style={{ color: "var(--ls-on-surface-muted)" }} />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <PracticeLink
                label="Start practicing free"
                showArrow
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-xs font-semibold transition-all duration-150"
                style={{
                  background: "var(--ls-surface-container)",
                  color: "var(--ls-on-surface)",
                  border: "1px solid var(--ls-outline)",
                }}
              />
              <p className="text-[11px] text-center mt-3" style={{ color: "var(--ls-on-surface-subtle)" }}>
                No credit card needed · Instant setup
              </p>
            </div>
          </div>

          {/* ────── 2. MONTHLY PLAN ────── */}
          <div
            className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px]"
            style={{
              background: "var(--ls-surface)",
              border: "1px solid var(--ls-outline)",
              boxShadow: "var(--ls-shadow-sm)",
            }}
          >
            <div>
              <div className="mb-6">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 dark:text-sky-300 dark:bg-sky-500/10 dark:border-sky-500/30"
                >
                  Prep Sprint
                </span>
                <h3 className="text-xl font-semibold mt-3" style={{ color: "var(--ls-on-surface)" }}>
                  Monthly
                </h3>
                <p className="text-xs mt-1.5 min-h-[32px]" style={{ color: "var(--ls-on-surface-muted)" }}>
                  Ideal for targeted 30-day technical interview prep.
                </p>
              </div>

              <div className="mb-6 pb-6 border-b" style={{ borderColor: "var(--ls-outline)" }}>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-3xl sm:text-4xl font-bold font-mono tracking-tight"
                    style={{ color: "var(--ls-on-surface)" }}
                  >
                    ₹899
                  </span>
                  <span className="text-xs font-medium" style={{ color: "var(--ls-on-surface-subtle)" }}>
                    / month
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {[
                  "Access to entire past problem archive",
                  "Step-by-step editorial solutions",
                  "Query optimization & breakdowns",
                  "Unlimited sandbox runs & retries",
                  "Company-wise SQL & data sets",
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: "var(--ls-on-surface)" }}>
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-sky-50 dark:bg-sky-500/10"
                    >
                      <Check className="w-2.5 h-2.5 text-sky-600 dark:text-sky-300" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Link
                href="/payment?plan=monthly"
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-xs font-semibold transition-all duration-150 bg-[#1f9e8e] text-white hover:bg-[#177a6d]"
              >
                Get Monthly Access
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-center mt-3" style={{ color: "var(--ls-on-surface-subtle)" }}>
                Cancel anytime with 1 click
              </p>
            </div>
          </div>

          {/* ────── 3. YEARLY PLAN (RECOMMENDED) ────── */}
          <div
            className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 hover:translate-y-[-4px]"
            style={{
              background: "var(--ls-surface)",
              border: "2px solid var(--ls-primary)",
              boxShadow: "0 12px 36px rgba(31,158,142,0.16)",
            }}
          >
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-xs"
                style={{ background: "var(--ls-primary)" }}
              >
                <Star className="w-3 h-3 fill-white" />
                Best Value • Save 86%
              </span>
            </div>

            <div>
              <div className="mb-6">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider"
                  style={{
                    background: "var(--ls-primary-container)",
                    color: "var(--ls-primary)",
                    border: "1px solid rgba(31,158,142,0.25)",
                  }}
                >
                  Full Mastery
                </span>
                <h3 className="text-xl font-semibold mt-3" style={{ color: "var(--ls-on-surface)" }}>
                  Yearly
                </h3>
                <p className="text-xs mt-1.5 min-h-[32px]" style={{ color: "var(--ls-on-surface-muted)" }}>
                  Year-round consistency for data career growth.
                </p>
              </div>

              <div className="mb-6 pb-6 border-b" style={{ borderColor: "var(--ls-outline)" }}>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-3xl sm:text-4xl font-bold font-mono tracking-tight"
                    style={{ color: "var(--ls-primary)" }}
                  >
                    ₹1,499
                  </span>
                  <span className="text-xs font-medium" style={{ color: "var(--ls-on-surface-subtle)" }}>
                    / yr (₹125/mo)
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Monthly included",
                  "3,200+ new daily interview problems/yr",
                  "Verifiable completion certificates",
                  "Mock tests & advanced scenario paths",
                  "Priority support directly from engineers",
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: "var(--ls-on-surface)" }}>
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: "var(--ls-primary-container)",
                      }}
                    >
                      <Check className="w-2.5 h-2.5" style={{ color: "var(--ls-primary)" }} />
                    </div>
                    <span className={i === 0 ? "font-semibold" : ""}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Link
                href="/payment?plan=annual"
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-xs font-semibold transition-all duration-150 hover:opacity-95 shadow-sm"
                style={{
                  background: "var(--ls-primary)",
                  color: "var(--ls-on-primary)",
                  boxShadow: "0 3px 12px rgba(31,158,142,0.28)",
                }}
              >
                Get Yearly Access
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-center mt-3 font-medium text-emerald-700 dark:text-emerald-300">
                100% money-back in 7 days
              </p>
            </div>
          </div>

          {/* ────── 4. LIFETIME VIP PLAN ────── */}
          <div
            className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 hover:translate-y-[-4px]"
            style={{
              background: "var(--ls-surface)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              boxShadow: "0 8px 24px rgba(245, 158, 11, 0.08)",
            }}
          >
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-950 bg-amber-400 shadow-xs"
              >
                <Crown className="w-3 h-3 fill-amber-950" />
                VIP Deal • Permanent
              </span>
            </div>

            <div>
              <div className="mb-6">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30"
                >
                  Lifetime VIP
                </span>
                <h3 className="text-xl font-semibold mt-3" style={{ color: "var(--ls-on-surface)" }}>
                  Lifetime
                </h3>
                <p className="text-xs mt-1.5 min-h-[32px]" style={{ color: "var(--ls-on-surface-muted)" }}>
                  One single payment. Unlimited access forever.
                </p>
              </div>

              <div className="mb-6 pb-6 border-b" style={{ borderColor: "var(--ls-outline)" }}>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400"
                  >
                    ₹4,999
                  </span>
                  <span className="text-xs font-medium" style={{ color: "var(--ls-on-surface-subtle)" }}>
                    / paid once
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Yearly included",
                  "One payment, permanent access forever",
                  "All future courses, tracks & content releases",
                  "Official Certificate of Completion",
                  "Exclusive VIP community role & support",
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: "var(--ls-on-surface)" }}>
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-amber-50 dark:bg-amber-500/10"
                    >
                      <Check className="w-2.5 h-2.5 text-amber-600 dark:text-amber-300" />
                    </div>
                    <span className={i === 0 || i === 1 ? "font-semibold" : ""}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Link
                href="/payment?plan=lifetime"
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-xs font-semibold transition-all duration-150 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold shadow-xs"
              >
                Get Lifetime Access
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-center mt-3 font-medium text-amber-800 dark:text-amber-300">
                Pay once · Never pay again
              </p>
            </div>
          </div>

        </div>

        {/* Voucher / Coupon Promotion Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-6 bg-[#e6f7f5] rounded-2xl border border-[#1f9e8e]/25 text-xs text-[#135d54]">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-sm">🎟️</span>
              <span>Have an invite voucher code or early access gift pass?</span>
            </div>
            <Link
              href="/redeem"
              className="inline-flex items-center gap-1.5 font-bold text-[#1f9e8e] hover:text-[#177a6d] underline underline-offset-2 transition-colors dark:hover:text-[#4DD4C4]"
            >
              Redeem Code Here <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Value / ROI Callout */}
        <div
          className="rounded-2xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: "var(--ls-surface)",
            border: "1px solid var(--ls-outline)",
            boxShadow: "var(--ls-shadow-sm)",
          }}
        >
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h4 className="text-sm font-semibold" style={{ color: "var(--ls-on-surface)" }}>
                Why practicing daily delivers 100x return
              </h4>
            </div>
            <p className="text-xs leading-relaxed max-w-xl" style={{ color: "var(--ls-on-surface-muted)" }}>
              Senior Data Engineer and Analyst roles in India pay <strong>₹15 LPA to ₹30+ LPA</strong>. Investing ₹1,499 to stay sharp and breeze through live SQL & data pipeline interview rounds is a no-brainer.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0 font-medium" style={{ color: "var(--ls-on-surface-subtle)" }}>
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" /> Secure checkout</span>
            <span>•</span>
            <span>UPI & Cards</span>
          </div>
        </div>

      </div>
    </section>
  );
}

