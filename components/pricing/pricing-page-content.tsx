"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { isLoggedIn as hasSessionToken } from "@/lib/auth";
import { DEFAULT_PLANS, formatINR, type PlanMap } from "@/lib/plans";
import {
    Check,
    ArrowRight,
    ChevronDown,
    MessageSquare,
    Users,
    CreditCard,
    Heart,
    Database,
    Code2,
    Server
} from "lucide-react";

export function PricingPageContent({ plans = DEFAULT_PLANS }: { plans?: PlanMap }) {
    const [openFaq, setOpenFaq] = useState<number | null>(0); // First open by default
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (!hasSessionToken()) return;                    // no session cookie: logged out, nothing to verify
        queueMicrotask(() => setIsLoggedIn(true));         // cookie present: link straight to /payment (no wrong-page race)
        api.getProfile().catch(() => setIsLoggedIn(false)); // …and fall back if the token turns out to be invalid
    }, []);

    const getPlanUrl = (plan: string) => {
        return isLoggedIn ? `/payment?plan=${plan}` : `/signup?plan=${plan}`;
    };

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const { monthly, yearly, lifetime } = plans;
    const fmt = formatINR;
    const prices = {
        lifetime: {
            original: lifetime.original_price ? fmt(lifetime.original_price) : "",
            discounted: fmt(lifetime.price),
            billing: "paid once",
            note: "One payment, no renewal · Full access forever"
        },
        annual: {
            original: yearly.original_price ? fmt(yearly.original_price) : "",
            discounted: fmt(yearly.price),
            period: "/year",
            monthlyEquivalent: `just ${fmt(Math.round(yearly.price / 12))}/mo`,
            todayText: `${fmt(yearly.price)} one-time · 12 months of access`
        },
        monthly: {
            original: monthly.original_price ? fmt(monthly.original_price) : "",
            discounted: fmt(monthly.price),
            period: "/month",
            monthlyEquivalent: "",
            todayText: `${fmt(monthly.price)} one-time · 30 days of access`
        }
    };

    // Real DailySQL Testimonials
    const TESTIMONIALS = [
        {
            name: "Anam Ahsan",
            handle: "@anamahsan_de",
            role: "Data Engineer · CTS",
            avatar: "AA",
            color: "#1f9e8e",
            verified: true,
            replyTo: null,
            quote: "This platform is incredible. Since Python and PySpark questions were added, it has become even more valuable. I've gained a lot of confidence and have already recommended it to my team.",
            time: "5:44 PM · Aug 17, 2026",
            likes: 24,
            replies: 4
        },
        {
            name: "Dheeraj Lakkakula",
            handle: "@dheeraj_lakk",
            role: "Data Analyst",
            avatar: "DL",
            color: "#7c3aed",
            verified: true,
            replyTo: "@dailysql_in",
            quote: "DailySQL has helped me build a consistent habit of practicing SQL every day. The questions are practical, interview-focused, and gradually improve both my SQL knowledge and problem-solving skills.",
            time: "9:14 AM · Aug 18, 2026",
            likes: 12,
            replies: 2
        },
        {
            name: "Chaitaly Sen",
            handle: "@chaitaly_sen",
            role: "Data Analyst · IVY Institute",
            avatar: "CS",
            color: "#4f46e5",
            verified: true,
            replyTo: null,
            quote: "I have had a great experience with DailySQL. It is one of the best platforms and easily outperforms traditional courses. Lifetime subscriber here 🔥 Best daily 15-min routine.",
            time: "5:44 PM · Aug 17, 2026",
            likes: 18,
            replies: 3
        },
        {
            name: "Dheeraj S Kulkarni",
            handle: "@dheerajsk_data",
            role: "Data Engineer · Covalen",
            avatar: "DK",
            color: "#2563eb",
            verified: true,
            replyTo: "@dailysql_in",
            quote: "DailySQL is hands down one of the best platforms for SQL, Python, and PySpark. The questions are fresh, non-repetitive, interview-level, and inspired by real-world business scenarios.",
            time: "2:30 PM · Aug 16, 2026",
            likes: 8,
            replies: 1
        },
        {
            name: "Girish Ratnaparkhi",
            handle: "@girishrp",
            role: "Data Engineer · Cognizant",
            avatar: "GR",
            color: "#d97706",
            verified: true,
            replyTo: null,
            quote: "The absolute best site for daily data practice! Easy, Medium, and Hard difficulty levels make it perfect for both beginners and advanced engineers looking to push their limits.",
            time: "11:02 PM · Aug 17, 2026",
            likes: 31,
            replies: 5
        },
        {
            name: "Divyanshu Tiwari",
            handle: "@divyanshu_tw",
            role: "Student · Data Science",
            avatar: "DT",
            color: "#dc2626",
            verified: false,
            replyTo: "@dailysql_in",
            quote: "If you want to elevate your SQL skills for data roles, I highly recommend DailySQL. It completely transformed how I approach complex window functions and CTEs.",
            time: "3:20 AM · Aug 18, 2026",
            likes: 5,
            replies: 2
        }
    ];

    // Real DailySQL FAQs
    const faqs = [
        {
            q: "What plans and pricing options are available?",
            a: `We offer four straightforward tiers: Free Tier (₹0 forever for daily habit building), Monthly Pro (${fmt(monthly.price)}/month for targeted interview sprints), Yearly Pro (${fmt(yearly.price)}/year at just ${fmt(Math.round(yearly.price / 12))}/month for comprehensive year-round mastery), and Lifetime VIP (${fmt(lifetime.price)} one-time payment for permanent unlimited access with zero renewals forever). Prices are in INR; customers outside India can pay with PayPal at checkout.`,
        },
        {
            q: "What disciplines and skills does DailySQL cover?",
            a: "DailySQL covers the three indispensable technical pillars of modern data engineering and analytics: SQL, Python with Pandas/NumPy, and distributed PySpark. Every morning, you get 9 curated problems — 3 per discipline in Easy, Medium, and Advanced difficulties."
        },
        {
            q: "How does the in-browser sandbox code execution work?",
            a: "Every submission runs in a secure, isolated sandbox. SQL runs against a real database with temporary schemas created and torn down automatically. Python and PySpark run inside dedicated compute containers with zero latency and instant automated test validation."
        },
        {
            q: "What does the Lifetime Plan include?",
            a: `Lifetime gives you access to the complete DailySQL platform for ${fmt(lifetime.price)} paid once, for as long as we operate it. This includes every current problem track, the new problems and tracks we add to the platform, and the VIP community role, with no renewal fees. Separately priced products or add-ons are not included. See the Terms of Service for details.`,
        },
        {
            q: "Do Free, Monthly, Yearly, and Lifetime unlock different content?",
            a: `Free Tier (₹0) includes 3 SQL questions every day (today's daily set) and the first 30 SQL questions of the archive, plus leaderboard rank, streak tracking, and community discussions. All paid plans (Monthly ${fmt(monthly.price)}, Yearly ${fmt(yearly.price)}, and Lifetime ${fmt(lifetime.price)}) unlock every question across SQL, Python, PySpark and DSA, plus step-by-step editorial solutions and execution breakdowns.`,
        },
        {
            q: "How much time do I need each day?",
            a: "Just 15 minutes. DailySQL is intentionally structured to build strong, consistent problem-solving habits for busy working professionals and students without causing burnout or cramming fatigue."
        },
        {
            q: "I'm outside India. How do I pay?",
            a: "All prices are in Indian rupees (INR). If you are outside India, choose PayPal at checkout: PayPal converts the INR amount to your currency at its own exchange rate, so the amount shown in your currency can differ slightly from day to day."
        },
        {
            q: "Can I expense DailySQL through my company's learning budget?",
            a: "Yes! Most working data professionals expense DailySQL. Company L&D (Learning & Development) budgets typically reimburse technical training subscriptions. You receive an instant tax-compliant invoice upon checkout."
        }
    ];

    return (
        <div className="landing-light min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased selection:bg-[#1f9e8e]/20 selection:text-[#1f9e8e] pb-24">

            {/* 1. TOP ACCESS PILLS & HERO HEADER */}
            <div className="pt-10 pb-6 text-center max-w-5xl mx-auto px-4">
                <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-zinc-500 mb-3 font-mono">
                    Unlock full access to
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                    {[
                        { label: "SQL", icon: Database },
                        { label: "PYTHON", icon: Code2 },
                        { label: "PYSPARK", icon: Server },
                    ].map((badge, idx) => {
                        const Icon = badge.icon;
                        return (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/30 shadow-2xs"
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {badge.label}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* 2. INTERNATIONAL PAYMENT NOTE */}
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 mb-4">
                <div className="flex items-center gap-2 py-3 px-5 bg-white rounded-xl border border-[#dedee2] shadow-2xs text-xs text-zinc-700 font-medium">
                    <span className="text-sm">🌐</span>
                    <span>
                        All prices are in INR. <strong>Outside India?</strong> Pay with PayPal at checkout. PayPal converts the INR amount to your currency at its own rate, so the final amount in your currency may differ slightly.
                    </span>
                </div>
            </div>

            {/* 2.1 COUPON REDEMPTION PROMO BANNER */}
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-5 bg-[#e6f7f5] rounded-xl border border-[#1f9e8e]/25 text-xs text-[#135d54]">
                    <div className="flex items-center gap-2 font-medium">
                        <span className="text-sm">🎟️</span>
                        <span>Have an early access invite code or gift coupon?</span>
                    </div>
                    <Link
                        href="/redeem"
                        className="inline-flex items-center gap-1.5 font-bold text-[#1f9e8e] hover:text-[#177a6d] underline underline-offset-2 transition-colors dark:hover:text-[#4DD4C4]"
                    >
                        Redeem Code Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* 3. MAIN 2-COLUMN SECTION: Plans on Left, Twitter Wall on Right */}
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: PRICING PLANS (7 Cols) */}
                    <div className="lg:col-span-7 space-y-4">

                        {/* ── CARD 1: LIFETIME PLAN (HERO) ── */}
                        <div className="bg-white rounded-2xl border border-[#dedee2] p-6 sm:p-7 shadow-xs">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                                {/* Left Sub-column: Price & CTA */}
                                <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#dedee2] pb-6 md:pb-0 md:pr-6">
                                    <div>
                                        <h3 className="text-xl font-bold font-mono tracking-tight text-zinc-900 mb-3">
                                            Lifetime plan
                                        </h3>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm line-through text-zinc-400 font-mono">
                                                {prices.lifetime.original}
                                            </span>
                                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30">
                                                Save 34%
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-1.5 mb-1">
                                            <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight font-mono">
                                                {prices.lifetime.discounted}
                                            </span>
                                            <span className="text-xs text-zinc-500 font-medium">
                                                {prices.lifetime.billing}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 mb-6">
                                            {prices.lifetime.note}
                                        </p>
                                    </div>

                                    <div>
                                        <Link
                                            href={getPlanUrl("lifetime")}
                                            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-xs bg-[#1f9e8e] text-white hover:bg-[#177a6d]"
                                        >
                                            Get lifetime access
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>

                                        {/* Avatar stack */}
                                        <div className="mt-4 flex items-center gap-2.5">
                                            <div className="flex -space-x-1.5 overflow-hidden">
                                                <div className="w-6 h-6 rounded-full bg-[#1f9e8e] text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">AA</div>
                                                <div className="w-6 h-6 rounded-full bg-[#7c3aed] text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">DL</div>
                                                <div className="w-6 h-6 rounded-full bg-[#2563eb] text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">DK</div>
                                                <div className="w-6 h-6 rounded-full bg-[#d97706] text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">GR</div>
                                            </div>
                                            <p className="text-[11px] text-zinc-500 leading-tight">
                                                The practitioners posting about DailySQL are members. <strong className="text-zinc-800">10K+ already practice here.</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Sub-column: Features & Guarantee */}
                                <div className="md:col-span-7 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight leading-snug mb-4">
                                            Get every DailySQL problem with one payment, including the new tracks we add
                                        </h4>
                                        <ul className="space-y-2.5 mb-6">
                                            {[
                                                "Every current DailySQL track (SQL, Python & PySpark)",
                                                "New problems and tracks we add to the Platform",
                                                "All past archives, editorial solutions, and test suites",
                                                "One payment, no renewal fees"
                                            ].map((feat, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-zinc-700 leading-relaxed font-medium">
                                                    <Check className="w-3.5 h-3.5 text-[#1f9e8e] shrink-0 mt-0.5 stroke-[2.5]" />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <p className="text-[11px] text-zinc-400 leading-relaxed border-t border-[#dedee2] pt-3">
                                        Lifetime is attached to your DailySQL account. It does not renew and it is not removed when subscription prices change later. Anything included on your purchase date stays included, at no extra cost, for as long as you hold the plan. Lifetime purchases can be refunded within 7 days (see our Refund Policy).
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* ── CARD 2: ANNUAL PLAN (RECOMMENDED) ── */}
                        <div className="bg-white rounded-xl border border-[#dedee2] p-5 sm:p-6 shadow-2xs hover:border-zinc-300 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-lg font-bold font-mono text-zinc-900">
                                            Annual plan
                                        </h4>
                                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30">
                                            Recommended · Best Value
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        The lowest monthly cost ({prices.annual.monthlyEquivalent}) for year-round consistency.
                                    </p>
                                </div>

                                <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-center gap-3">
                                    <div className="text-left sm:text-right">
                                        <div className="flex items-center sm:justify-end gap-1.5">
                                            <span className="text-xs line-through text-zinc-400 font-mono">
                                                {prices.annual.original}
                                            </span>
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded dark:text-emerald-300 dark:bg-emerald-500/10">
                                                Save 30%
                                            </span>
                                        </div>
                                        <div className="flex items-baseline sm:justify-end gap-1">
                                            <span className="text-2xl font-extrabold font-mono text-zinc-900">
                                                {prices.annual.discounted}
                                            </span>
                                            <span className="text-xs text-zinc-500 font-medium">
                                                {prices.annual.period}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 font-mono">
                                            {prices.annual.todayText}
                                        </p>
                                    </div>

                                    <Link
                                        href={getPlanUrl("yearly")}
                                        className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-lg text-xs font-bold transition-all bg-white border border-[#1f9e8e]/50 text-[#1f9e8e] hover:bg-[#e6f7f5] shadow-2xs shrink-0"
                                    >
                                        Get full access
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── CARD 4: MONTHLY PLAN ── */}
                        <div className="bg-white rounded-xl border border-[#dedee2] p-5 sm:p-6 shadow-2xs hover:border-zinc-300 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-lg font-bold font-mono text-zinc-900 mb-1">
                                        Monthly plan
                                    </h4>
                                    <p className="text-xs text-zinc-500">
                                        Full access with the shortest 30-day interview prep commitment.
                                    </p>
                                </div>

                                <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-center gap-3">
                                    <div className="text-left sm:text-right">
                                        <div className="flex items-center sm:justify-end gap-1.5">
                                            <span className="text-xs line-through text-zinc-400 font-mono">
                                                {prices.monthly.original}
                                            </span>
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded dark:text-emerald-300 dark:bg-emerald-500/10">
                                                Save 30%
                                            </span>
                                        </div>
                                        <div className="flex items-baseline sm:justify-end gap-1">
                                            <span className="text-2xl font-extrabold font-mono text-zinc-900">
                                                {prices.monthly.discounted}
                                            </span>
                                            <span className="text-xs text-zinc-500 font-medium">
                                                {prices.monthly.period}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 font-mono">
                                            {prices.monthly.todayText}
                                        </p>
                                    </div>

                                    <Link
                                        href={getPlanUrl("monthly")}
                                        className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-lg text-xs font-bold transition-all bg-white border border-[#dedee2] text-zinc-800 hover:bg-zinc-50 shadow-2xs shrink-0"
                                    >
                                        Get full access
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── CARD 4: FREE TIER ── */}
                        <div className="bg-zinc-50/70 rounded-xl border border-dashed border-[#dedee2] p-5 sm:p-6 shadow-2xs hover:border-zinc-300 transition-all dark:bg-white/5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-lg font-bold font-mono text-zinc-900">
                                            Free tier
                                        </h4>
                                        <span className="text-[10px] font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                                            Free Forever
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        Get 3 SQL questions every day plus the first 30 SQL questions, and build streaks at zero cost.
                                    </p>
                                </div>

                                <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-center gap-3">
                                    <div className="text-left sm:text-right">
                                        <div className="flex items-baseline sm:justify-end gap-1">
                                            <span className="text-2xl font-extrabold font-mono text-zinc-900">
                                                ₹0
                                            </span>
                                            <span className="text-xs text-zinc-500 font-medium">
                                                / forever
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 font-mono">
                                            No credit card required
                                        </p>
                                    </div>

                                    <Link
                                        href="/practice/daily"
                                        className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-lg text-xs font-bold transition-all bg-white border border-[#dedee2] text-zinc-800 hover:bg-zinc-100 shadow-2xs shrink-0"
                                    >
                                        Start practicing
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── "EVERY SUBSCRIPTION INCLUDES" ── */}
                        <div className="pt-6 pb-2">
                            <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-1.5">
                                Every Subscription Includes
                                <span className="text-zinc-400 cursor-help" title="Standard features included in all paid subscriptions">ⓘ</span>
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {[
                                    "Access to entire past problem archive (SQL, Python, PySpark)",
                                    "Step-by-step editorial solutions & query optimization breakdowns",
                                    "Isolated sandbox executions with automated test suite",
                                    "One-time payment with no auto-renewal"
                                ].map((inc, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-700">
                                        <Check className="w-3.5 h-3.5 text-[#1f9e8e] shrink-0 mt-0.5" />
                                        <span>{inc}</span>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
                                Full catalogue on every plan, no usage limits. Checkout supports UPI, Netbanking, and domestic & international cards (Visa, Mastercard, Amex).
                            </p>

                            {/* Expensing Box */}
                            <div className="bg-zinc-50 border border-[#dedee2] rounded-xl p-4 flex items-start gap-3">
                                <CreditCard className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-zinc-700 leading-relaxed">
                                    <strong>Most members expense DailySQL.</strong> Company learning & development budgets usually cover it. The invoice and receipt from checkout are all you need to submit.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: TWITTER / X TESTIMONIALS (5 Cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold font-mono">𝕏</span>
                            <h3 className="text-lg font-bold font-sans text-zinc-900 tracking-tight">
                                Loved by data professionals
                            </h3>
                        </div>

                        {/* Testimonial Feed Cards */}
                        {TESTIMONIALS.map((t, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-[#dedee2] p-4 shadow-2xs hover:border-zinc-300 transition-all">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs"
                                            style={{ backgroundColor: t.color }}
                                        >
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-bold text-zinc-900">{t.name}</span>
                                                {t.verified && (
                                                    <span className="text-sky-500 text-xs">✓</span>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-zinc-400 font-mono">{t.role}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-zinc-400 font-bold font-mono">𝕏</span>
                                </div>
                                {t.replyTo && (
                                    <p className="text-[11px] text-zinc-500 font-mono mb-1.5">
                                        Replying to <span className="text-[#1f9e8e]">{t.replyTo}</span>
                                    </p>
                                )}
                                <p className="text-xs text-zinc-800 leading-relaxed mb-3">
                                    {t.quote}
                                </p>
                                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
                                    <span>{t.time}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer">
                                            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> {t.likes}
                                        </span>
                                        <span className="text-zinc-700 font-semibold cursor-pointer hover:underline">Read on X</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            </div>

            {/* 4. SOCIAL PROOF / LEARNER ORGANIZATIONS & COMPANIES (DailySQL Community) */}
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 mb-20">
                <div className="rounded-2xl border border-[#dedee2] bg-white overflow-hidden shadow-xs">

                    {/* Header Bar — Light & Crisp Theme */}
                    <div className="bg-[#e6f7f5] border-b border-[#1f9e8e]/20 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                        <div className="flex items-center gap-2 text-[#135d54]">
                            <Users className="w-4 h-4 text-[#1f9e8e]" />
                            <span className="font-bold">800+ data engineers, analysts, and students practice with DailySQL</span>
                        </div>
                        <span className="text-[#1f9e8e] font-mono text-[11px] uppercase tracking-wider font-bold bg-white/70 px-2.5 py-0.5 rounded-md border border-[#1f9e8e]/20 dark:bg-[#0F1419]/70">
                            A GLOBAL LEARNING COMMUNITY
                        </span>
                    </div>

                    {/* Subhead & Logo Matrix */}
                    <div className="p-8 sm:p-10 text-center">
                        <p className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-zinc-400 mb-8">
                            PRACTITIONERS FROM LEADING COMPANIES AND INSTITUTIONS INCLUDING
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 items-center justify-items-center opacity-85">
                            {[
                                { name: "Google", font: "font-sans font-bold text-sm text-zinc-800" },
                                { name: "Microsoft", font: "font-sans font-semibold text-sm text-zinc-700" },
                                { name: "Amazon", font: "font-sans font-bold text-sm text-zinc-800" },
                                { name: "Meta", font: "font-sans font-bold text-sm text-blue-600 dark:text-blue-300" },
                                { name: "Snowflake", font: "font-sans font-bold text-sm text-sky-600 dark:text-sky-300" },
                                { name: "Databricks", font: "font-sans font-bold text-sm text-rose-600 dark:text-rose-300" },
                                { name: "Cognizant", font: "font-sans font-bold text-sm text-indigo-700 dark:text-indigo-300" },
                                { name: "CTS", font: "font-mono font-bold text-xs text-zinc-800" },
                                { name: "TCS", font: "font-sans font-bold text-sm text-zinc-800" },
                                { name: "Infosys", font: "font-sans font-semibold text-sm text-zinc-700" },
                                { name: "Accenture", font: "font-sans font-bold text-sm text-purple-700 dark:text-purple-300" },
                                { name: "Deloitte", font: "font-sans font-bold text-sm text-zinc-900" },
                                { name: "IVY Institute", font: "font-serif font-bold text-xs text-zinc-800" },
                                { name: "Covalen", font: "font-mono font-semibold text-xs text-zinc-800" },
                                { name: "LinkedIn", font: "font-bold text-base text-[#0077b5]" },
                                { name: "Uber", font: "font-sans font-bold text-base text-zinc-900" }
                            ].map((brand, idx) => (
                                <span
                                    key={idx}
                                    className={`${brand.font} hover:opacity-100 transition-opacity cursor-default`}
                                >
                                    {brand.name}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* 5. FAQ SECTION (DailySQL Specific) */}
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Sticky Header */}
                    <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-3">
                        <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-zinc-500">
                            COMMON QUESTIONS
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                            Pricing without hidden plan rules
                        </h2>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            Start for free today or upgrade to unlock complete past problem archives, step-by-step editorial solutions, and execution breakdowns.
                        </p>
                    </div>

                    {/* Right Accordions */}
                    <div className="lg:col-span-8 divide-y divide-[#dedee2] border-t border-b border-[#dedee2]">
                        {faqs.map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <div key={index} className="py-4">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between text-left gap-4 font-semibold text-sm sm:text-base text-zinc-900 hover:text-zinc-700 transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-zinc-900" : ""
                                                }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed pr-8 animate-in fade-in-50 duration-200">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* 6. "HAVE A QUESTION?" CALLOUT BANNER -> CONNECTED TO /contact */}
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
                <div className="relative overflow-hidden bg-white rounded-2xl border border-[#dedee2] p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    
                    <div className="space-y-2 max-w-xl relative z-10">
                        <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-zinc-400">
                            HAVE A QUESTION?
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                            Tell us what you are trying to learn
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                            We can help with a grandfathered plan, corporate team invoice, college cohort, or a custom billing query the standard checkout does not cover.
                        </p>
                    </div>

                    <div className="flex items-center gap-5 relative z-10 shrink-0">
                        {/* Interactive Mascot with Speech Bubble */}
                        <div className="hidden sm:flex items-center gap-2 group cursor-pointer">
                            <div className="relative">
                                <img
                                    src="/mascot-complete-bg-removed.png"
                                    alt="DailySQL Mascot"
                                    className="w-16 h-16 object-contain transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300"
                                />
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                            </div>
                            <div className="hidden lg:block bg-[#e6f7f5] text-[#135d54] text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-[#1f9e8e]/30 shadow-2xs font-mono">
                                We reply in &lt; 2 hrs! ⚡
                            </div>
                        </div>

                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#1f9e8e] text-white hover:bg-[#177a6d] shadow-xs shrink-0 transition-all group"
                        >
                            <span className="text-white font-bold">Send a question</span>
                            <MessageSquare className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}
