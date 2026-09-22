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
 * 1. Global Celebratory Welcome Modal for New Trial Users (Light Theme)
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
    <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#dedee2] rounded-3xl max-w-lg w-full p-7 md:p-8 space-y-6 shadow-2xl relative overflow-hidden text-center text-zinc-900">
        {/* Top Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1f9e8e] via-amber-400 to-[#1f9e8e]" />

        {/* Close icon */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Badge & Icon */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-[#e6f7f5] border border-[#1f9e8e]/30 flex items-center justify-center shadow-xs">
            <Sparkles className="w-8 h-8 text-[#1f9e8e]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f7f5] border border-[#1f9e8e]/30 text-[#1f9e8e] text-[11px] font-mono font-bold uppercase tracking-wider">
            <Zap size={12} className="fill-[#1f9e8e]" />
            {is7Day ? "7-Day Pro Pass Activated" : "30-Day Launch Access Activated"}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold font-mono text-zinc-900 tracking-tight">
            You Unlocked <span className="text-[#1f9e8e]">{trialDays} Days Free Pro!</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
            Welcome to Daily SQL! You have <strong className="text-zinc-900">full, unrestricted access</strong> to all coding tracks for the next {trialDays} days. Zero credit card needed.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="bg-zinc-50 border border-[#dedee2] rounded-2xl p-4 text-left space-y-2.5">
          <div className="flex items-center gap-3 text-xs text-zinc-700 font-medium">
            <CheckCircle2 size={16} className="text-[#1f9e8e] shrink-0" />
            <span><strong>All 110+ Questions Unlocked:</strong> SQL, Python &amp; PySpark tracks</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-700 font-medium">
            <CheckCircle2 size={16} className="text-[#1f9e8e] shrink-0" />
            <span><strong>Dual SQL Engines:</strong> Run queries in PostgreSQL &amp; MySQL</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-700 font-medium">
            <CheckCircle2 size={16} className="text-[#1f9e8e] shrink-0" />
            <span><strong>Daily Streak &amp; Leaderboards:</strong> Track your interview readiness</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={handleDismiss}
            className="w-full py-3 px-6 rounded-xl bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold font-mono text-xs transition-all shadow-2xs flex items-center justify-center gap-2"
          >
            Start Practicing Challenges 🚀
          </button>
          <p className="text-[11px] text-zinc-500 font-mono">
            Pass expires automatically in {trialDays} days. No surprise charges ever.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Navbar Live Trial Status Chip & Popover (Light Theme)
 */
export function NavbarTrialPill({ subscription }: { subscription?: SubscriptionData | null }) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  if (!subscription) return null;

  // Paid user
  if (subscription.is_paid) {
    return (
      <Link href="/pricing">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold font-mono px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:border-amber-300 transition-colors uppercase tracking-wider shadow-2xs">
          <Crown className="w-3.5 h-3.5 text-amber-600" />
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
          className={`inline-flex items-center gap-1.5 text-xs font-bold font-mono px-3 py-1 rounded-lg border transition-all shadow-2xs ${
            isEndingSoon
              ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
              : "bg-[#e6f7f5] text-[#1f9e8e] border-[#1f9e8e]/40 hover:bg-[#d8f3ef]"
          }`}
        >
          <Zap size={13} className={isEndingSoon ? "text-amber-600 fill-amber-600" : "text-[#1f9e8e] fill-[#1f9e8e]"} />
          <span>{subscription.trial_type === "new_signup" ? "7-Day Pro Pass" : "Pro Pass"}</span>
          <span className="opacity-75 font-mono">({daysLeft}d left)</span>
        </button>

        {popoverOpen && (
          <div className="absolute top-11 right-0 w-72 bg-white border border-[#dedee2] rounded-2xl p-4 shadow-xl z-[300] space-y-3 text-left animate-in fade-in">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#1f9e8e]" />
                <span className="text-xs font-bold font-mono text-zinc-900 uppercase tracking-wider">Free Pro Access</span>
              </div>
              <button onClick={() => setPopoverOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              You currently have full access to all 110+ coding challenges. Your Pro Pass expires in{" "}
              <strong className={isEndingSoon ? "text-amber-700" : "text-[#1f9e8e]"}>{daysLeft} day(s)</strong>.
            </p>

            <div className="pt-1 flex flex-col gap-2">
              <Link
                href="/pricing"
                onClick={() => setPopoverOpen(false)}
                className="w-full py-2 px-3 rounded-xl bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold font-mono text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <span>View Plans &amp; Pricing</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/redeem"
                onClick={() => setPopoverOpen(false)}
                className="w-full text-center text-[11px] font-mono font-medium text-zinc-600 hover:text-[#1f9e8e] transition-colors"
              >
                Have an invite code? Redeem here →
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
      <Link href="/pricing">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold font-mono px-3 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all shadow-2xs">
          <Lock size={12} />
          <span>Pro Expired · Upgrade</span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/pricing">
      <span className="inline-flex items-center gap-1.5 text-xs font-bold font-mono px-3 py-1 rounded-lg bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/30 hover:bg-[#d8f3ef] transition-colors shadow-2xs">
        <Sparkles size={12} className="text-[#1f9e8e]" />
        <span>Upgrade to Pro</span>
      </span>
    </Link>
  );
}

/**
 * 3. In-App Banner on Practice Page (/practice/daily) - Light Editorial Style
 */
export function PracticeTrialBanner({ subscription }: { subscription?: SubscriptionData | null }) {
  if (!subscription) return null;

  // Active Paid User — no banner needed
  if (subscription.is_paid) return null;

  // Trial Expired — Show Clear Paywall Nudge
  if (subscription.trial_expired) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5 text-amber-900">
          <div className="w-6 h-6 rounded-md bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
            <Lock size={12} className="text-amber-800" />
          </div>
          <div>
            <span className="font-bold">Your Pro Pass has expired.</span>{" "}
            <span className="text-amber-800/80 hidden sm:inline">
              Your solved questions and streak are safe! Upgrade or redeem a coupon to unlock all 110+ challenges.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/pricing"
            className="px-3.5 py-1.5 rounded-lg bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <span>Upgrade to Pro</span>
            <ArrowRight size={12} />
          </Link>
          <Link
            href="/redeem"
            className="text-amber-800 hover:text-amber-950 text-[11px] font-mono font-medium underline transition-colors hidden md:inline"
          >
            Redeem voucher
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
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-[#e6f7f5] border-[#1f9e8e]/20 text-[#135d54]"
      }`}>
        <div className="flex items-center gap-2">
          <Zap size={13} className={isEndingSoon ? "text-amber-600 fill-amber-600" : "text-[#1f9e8e] fill-[#1f9e8e]"} />
          <span>
            <strong>Pro Pass Active ({daysLeft} days remaining):</strong> All 110+ SQL, Python &amp; PySpark challenges are unlocked.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className={`font-bold font-mono text-xs hover:underline flex items-center gap-1 ${
              isEndingSoon ? "text-amber-800" : "text-[#1f9e8e]"
            }`}
          >
            {isEndingSoon ? "Lock in Early Pro Rate →" : "View Pro Plans →"}
          </Link>
          <Link
            href="/redeem"
            className="text-zinc-500 hover:text-zinc-800 text-[11px] font-mono underline hidden md:inline"
          >
            Redeem code
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
