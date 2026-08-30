"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Gift, Crown, ArrowRight, X, Clock, CheckCircle2, Shield, Zap, Flame, Lock } from "lucide-react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface SubscriptionData {
  has_access: boolean;
  plan: string;
  is_paid: boolean;
  is_trial: boolean;
  trial_type: string | null;
  trial_expires_at: string | null;
  trial_days_remaining: number;
  trial_hours_remaining: number;
  trial_expired: boolean;
  plan_expires_at: string | null;
  is_lifetime: boolean;
}

/**
 * 1. Global Celebratory Welcome Modal for New Trial Users
 * Displays once upon signup/login when the user has an active 7-day trial.
 */
export function TrialWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [trialInfo, setTrialInfo] = useState<SubscriptionData | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    // Check if user has already seen the welcome popup
    const seen = localStorage.getItem("dsql_trial_welcome_v1");
    if (seen) return;

    api.getMySubscription().then((sub) => {
      if (sub && sub.is_trial && !sub.is_paid) {
        setTrialInfo(sub);
        setIsOpen(true);
      }
    }).catch(() => {});
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("dsql_trial_welcome_v1", "true");
    setIsOpen(false);
  };

  if (!isOpen || !trialInfo) return null;

  const is7Day = trialInfo.trial_type === "new_signup" || trialInfo.trial_days_remaining <= 7;
  const trialDays = is7Day ? (trialInfo.trial_days_remaining || 7) : (trialInfo.trial_days_remaining || 30);

  return (
    <div className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f1420] border border-[#4DD4C4]/30 rounded-3xl max-w-lg w-full p-7 md:p-8 space-y-6 shadow-[0_0_60px_-15px_rgba(77,212,196,0.3)] relative overflow-hidden text-center">
        {/* Glow accent */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#4DD4C4]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close icon */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Badge & Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4DD4C4]/20 via-[#4DD4C4]/10 to-amber-500/20 border border-[#4DD4C4]/40 flex items-center justify-center shadow-lg shadow-[#4DD4C4]/20">
            <Sparkles className="w-8 h-8 text-[#4DD4C4] animate-pulse" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4DD4C4]/10 border border-[#4DD4C4]/30 text-[#4DD4C4] text-[11px] font-extrabold uppercase tracking-widest">
            <Zap size={12} className="fill-[#4DD4C4]" />
            {is7Day ? "7-Day Pro Pass Activated" : "30-Day Launch Access Activated"}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            You Unlocked <span className="bg-gradient-to-r from-[#4DD4C4] via-emerald-400 to-amber-300 bg-clip-text text-transparent">{trialDays} Days Free Pro!</span>
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Welcome to DailySQL! As our welcome gift, you have <strong className="text-white">full, unrestricted access</strong> to the entire platform for the next {trialDays} days. Zero credit card needed.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="bg-[#141b2b] border border-[#202736] rounded-2xl p-4 text-left space-y-2.5">
          <div className="flex items-center gap-3 text-xs text-zinc-200">
            <CheckCircle2 size={16} className="text-[#4DD4C4] shrink-0" />
            <span><strong>All 110 Questions Unlocked:</strong> SQL, Python &amp; PySpark tracks</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-200">
            <CheckCircle2 size={16} className="text-[#4DD4C4] shrink-0" />
            <span><strong>Dual SQL Engines:</strong> Run queries in PostgreSQL &amp; MySQL</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-200">
            <CheckCircle2 size={16} className="text-[#4DD4C4] shrink-0" />
            <span><strong>Daily Streak &amp; Leaderboards:</strong> Track your interview readiness</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={handleDismiss}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#4DD4C4] to-[#30B5A6] hover:from-[#3dbdb0] hover:to-[#27988b] text-[#080c16] font-extrabold text-sm transition-all shadow-lg shadow-[#4DD4C4]/25 hover:shadow-[#4DD4C4]/40 flex items-center justify-center gap-2"
          >
            Start Practicing Challenges 🚀
          </button>
          <p className="text-[11px] text-zinc-500">
            Access expires automatically in {trialDays} days. No surprise charges ever.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Navbar Live Trial Status Chip & Popover
 */
export function NavbarTrialPill({ subscription }: { subscription?: SubscriptionData | null }) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  if (!subscription) return null;

  // Paid user
  if (subscription.is_paid) {
    return (
      <Link href="/payment">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:border-amber-400 transition-colors uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          {subscription.plan === "lifetime" ? "VIP Lifetime" : `${subscription.plan} Pro`}
        </span>
      </Link>
    );
  }

  // Active Trial user
  if (subscription.is_trial) {
    const daysLeft = subscription.trial_days_remaining ?? 7;
    const isEndingSoon = daysLeft <= 2;

    return (
      <div className="relative">
        <button
          onClick={() => setPopoverOpen(!popoverOpen)}
          className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-lg border transition-all ${
            isEndingSoon
              ? "bg-amber-500/15 text-amber-400 border-amber-500/40 hover:bg-amber-500/25 animate-pulse"
              : "bg-[#4DD4C4]/15 text-[#4DD4C4] border-[#4DD4C4]/40 hover:bg-[#4DD4C4]/25"
          }`}
        >
          <Zap size={13} className={isEndingSoon ? "text-amber-400 fill-amber-400" : "text-[#4DD4C4] fill-[#4DD4C4]"} />
          <span>{subscription.trial_type === "new_signup" ? "7-Day Pro Pass" : "Pro Pass"}</span>
          <span className="opacity-70 font-mono">({daysLeft}d left)</span>
        </button>

        {popoverOpen && (
          <div className="absolute top-11 right-0 w-72 bg-[#121826] border border-[#202736] rounded-2xl p-4 shadow-2xl z-[300] space-y-3 text-left animate-in fade-in">
            <div className="flex justify-between items-center border-b border-[#202736] pb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#4DD4C4]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Free Pro Access</span>
              </div>
              <button onClick={() => setPopoverOpen(false)} className="text-zinc-500 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              You currently have full access to all 110 coding challenges. Your Pro Pass expires in{" "}
              <strong className={isEndingSoon ? "text-amber-400" : "text-[#4DD4C4]"}>{daysLeft} day(s)</strong>.
            </p>

            <div className="pt-1 flex flex-col gap-2">
              <Link
                href="/payment"
                onClick={() => setPopoverOpen(false)}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                Lock in Pro Rate (₹899) <ArrowRight size={13} />
              </Link>
              <Link
                href="/redeem"
                onClick={() => setPopoverOpen(false)}
                className="w-full text-center text-[11px] text-zinc-400 hover:text-white transition-colors"
              >
                Have an invite code? Redeem here
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Expired trial user
  if (subscription.trial_expired) {
    return (
      <Link href="/payment">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/40 hover:bg-rose-500/25 transition-all animate-pulse">
          <Lock size={12} />
          <span>Pro Expired · Upgrade</span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/payment">
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-white/5 text-zinc-300 border border-zinc-700 hover:border-[#4DD4C4] transition-colors">
        <Sparkles size={12} className="text-[#4DD4C4]" />
        <span>Upgrade to Pro</span>
      </span>
    </Link>
  );
}

/**
 * 3. In-App Banner on Practice Page (/practice/daily)
 */
export function PracticeTrialBanner({ subscription }: { subscription?: SubscriptionData | null }) {
  if (!subscription) return null;

  // Active Paid User — no banner needed
  if (subscription.is_paid) return null;

  // Trial Expired — Show Urgent & Clear Paywall Nudge
  if (subscription.trial_expired) {
    return (
      <div className="bg-gradient-to-r from-[#181124] via-[#1b152b] to-[#181124] border-b border-violet-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2.5 text-zinc-300">
          <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center shrink-0">
            <Lock size={12} className="text-violet-400" />
          </div>
          <div>
            <span className="font-bold text-white">Your 7-Day Pro Pass has expired.</span>{" "}
            <span className="text-zinc-400 hidden sm:inline">
              Your solved questions and streak are safe! Upgrade to unlock all 110 SQL, Python &amp; PySpark challenges.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/payment"
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-violet-500/25"
          >
            Upgrade to Pro <ArrowRight size={12} />
          </Link>
          <Link
            href="/redeem"
            className="text-zinc-400 hover:text-white text-[11px] underline transition-colors hidden md:inline"
          >
            Redeem code
          </Link>
        </div>
      </div>
    );
  }

  // Active Trial — Slim Motivational Indicator
  if (subscription.is_trial) {
    const daysLeft = subscription.trial_days_remaining ?? 7;
    const isEndingSoon = daysLeft <= 2;

    return (
      <div className={`border-b px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors ${
        isEndingSoon
          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
          : "bg-[#4DD4C4]/5 border-[#4DD4C4]/20 text-zinc-300"
      }`}>
        <div className="flex items-center gap-2">
          <Zap size={13} className={isEndingSoon ? "text-amber-400 fill-amber-400" : "text-[#4DD4C4] fill-[#4DD4C4]"} />
          <span>
            <strong>Pro Pass Active ({daysLeft} days remaining):</strong> All 110 SQL, Python &amp; PySpark challenges are unlocked.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/payment"
            className={`font-bold text-xs hover:underline flex items-center gap-1 ${
              isEndingSoon ? "text-amber-400 font-extrabold" : "text-[#4DD4C4]"
            }`}
          >
            {isEndingSoon ? "Lock in Early Pro Rate →" : "View Pro Plans →"}
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
