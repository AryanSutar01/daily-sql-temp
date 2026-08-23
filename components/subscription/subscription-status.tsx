"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Gift, CheckCircle2, AlertCircle, Loader2, Crown, ArrowRight, Shield } from "lucide-react";
import { getToken } from "@/lib/auth";

interface Subscription {
  plan_id: string;
  plan_name: string;
  starts_at: string;
  expires_at: string | null;
  is_lifetime: boolean;
  amount_paid?: number;
}

interface SubscriptionData {
  plan: string;
  is_paid: boolean;
  is_trial?: boolean;
  trial_type?: string | null;
  trial_expires_at?: string | null;
  plan_expires_at: string | null;
  is_lifetime: boolean;
  has_access?: boolean;
  subscription: Subscription | null;
}

export default function SubscriptionStatus() {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Coupon redemption states
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSubscription = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/payments/my-subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleCancel = async () => {
    if (!confirm("Cancel your subscription? You'll retain access until the current period ends.")) return;
    const token = getToken();
    if (!token) return;
    setCancelling(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/payments/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "User requested" }),
      });
      await fetchSubscription();
    } catch {
      /* ignore */
    }
    setCancelling(false);
  };

  const handleRedeemCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    const token = getToken();
    if (!token) return;

    setRedeeming(true);
    setCouponMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/coupons/redeem`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: clean }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.detail || "Failed to redeem coupon.");
      }

      setCouponMessage({
        type: "success",
        text: resData.message || "Lifetime VIP Plan unlocked! 🎉",
      });
      setCouponCode("");
      await fetchSubscription();
    } catch (err: any) {
      setCouponMessage({
        type: "error",
        text: err.message || "Failed to redeem coupon.",
      });
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[28px] bg-[#131924]/80 border border-[#202736]/80 p-6 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
        <div className="h-8 bg-white/10 rounded w-1/2 mb-6" />
        <div className="h-4 bg-white/10 rounded w-full" />
      </div>
    );
  }

  const planLabels: Record<string, { label: string; color: string; border: string; bg: string }> = {
    free: {
      label: "Free Tier",
      color: "text-zinc-400",
      border: "border-zinc-700/50",
      bg: "bg-zinc-800/30",
    },
    monthly: {
      label: "Monthly Pro",
      color: "text-[#4DD4C4]",
      border: "border-[#4DD4C4]/30",
      bg: "bg-[#4DD4C4]/10",
    },
    yearly: {
      label: "Yearly Pro",
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
    },
    lifetime: {
      label: "Lifetime VIP",
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
    },
  };

  const plan = data?.plan ?? "free";
  const meta = planLabels[plan] ?? planLabels.free;
  const isPaid = data?.is_paid ?? false;
  const isTrial = data?.is_trial ?? false;
  const sub = data?.subscription;

  return (
    <div className="group relative bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 hover:border-[#4DD4C4]/20 rounded-[28px] p-6 shadow-xl transition-all duration-300 overflow-hidden">
      {/* Top Accent Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          plan === "lifetime"
            ? "bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500"
            : isPaid
            ? "bg-gradient-to-r from-[#4DD4C4] via-teal-400 to-[#30B5A6]"
            : isTrial
            ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"
            : "bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700"
        }`}
      />

      {/* Header Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#4DD4C4]" /> Membership Status
        </span>

        {isPaid && (
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${meta.bg} ${meta.color} border ${meta.border} flex items-center gap-1 uppercase tracking-wider`}>
            {plan === "lifetime" ? <Crown className="w-3 h-3 text-amber-400" /> : <Sparkles className="w-3 h-3 text-[#4DD4C4]" />}
            ACTIVE
          </span>
        )}

        {isTrial && !isPaid && (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 uppercase tracking-wider">
            <Gift className="w-3 h-3 text-emerald-400" />
            {data?.trial_type === "new_signup" ? "7-Day Trial" : "Launch Trial"}
          </span>
        )}

        {!isPaid && !isTrial && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50 uppercase tracking-wider">
            Free Plan
          </span>
        )}
      </div>

      {/* Plan Title */}
      <h3 className={`text-xl font-black tracking-tight mb-1 ${meta.color}`}>
        {isPaid ? meta.label : isTrial ? "Launch Trial (Full Access)" : "Free Tier"}
      </h3>

      {/* Paid Active Subscription Details */}
      {isPaid && sub && (
        <div className="space-y-2 mt-4 pt-3 border-t border-white/5 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">Activated:</span>
            <span className="text-zinc-200 font-medium">
              {new Date(sub.starts_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Validity:</span>
            <span className="text-zinc-200 font-medium">
              {sub.is_lifetime || !sub.expires_at
                ? "Lifetime ♾️ (Permanent)"
                : new Date(sub.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          {sub.amount_paid != null && sub.amount_paid > 0 && (
            <div className="flex justify-between">
              <span className="text-zinc-400">Amount:</span>
              <span className="text-zinc-200 font-medium">₹{sub.amount_paid.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
      )}

      {/* Trial Active Banner */}
      {isTrial && !isPaid && (
        <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> Full Access Unlocked
              </span>
              {data?.trial_expires_at && (
                <span className="text-[11px] text-emerald-300 font-medium">
                  Until {new Date(data.trial_expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              You currently have full unlimited access to all problems across SQL, Python, PySpark, and DSA during the trial period.
            </p>
          </div>
        </div>
      )}

      {/* Free Tier Info */}
      {!isPaid && !isTrial && (
        <div className="mt-3 pt-3 border-t border-white/5 text-xs text-zinc-400">
          <p className="mb-1 text-zinc-300">
            Current access: <span className="text-white font-semibold">First 30 SQL questions</span> + daily practice sets.
          </p>
          <p className="text-[11px] text-zinc-500">
            Upgrade to unlock all premium challenges, company interview sets, Python, PySpark &amp; DSA.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 space-y-2.5">
        {!isPaid && (
          <Link
            href="/payment"
            className="w-full bg-gradient-to-r from-[#4DD4C4] to-[#34b6a5] hover:opacity-90 text-[#080c16] font-bold rounded-xl py-2.5 text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-[#4DD4C4]/20"
          >
            {isTrial ? "Lock In Lifetime VIP Deal →" : "Upgrade to Pro →"}
          </Link>
        )}

        {/* Redeem Coupon Section */}
        {!isPaid && (
          <div className="pt-1">
            {!showCouponInput ? (
              <button
                onClick={() => setShowCouponInput(true)}
                className="w-full text-center text-xs text-zinc-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-1.5 py-1"
              >
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                Have an early user invite code?
              </button>
            ) : (
              <form onSubmit={handleRedeemCoupon} className="space-y-2 bg-[#0b101c] p-3 rounded-2xl border border-[#202736]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-semibold flex items-center gap-1 text-[11px]">
                    <Gift className="w-3 h-3 text-amber-400" /> Enter Invite Code
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCouponInput(false);
                      setCouponMessage(null);
                    }}
                    className="text-zinc-500 hover:text-zinc-300 text-[10px]"
                  >
                    Close
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="DSQL-LT-XXXXXXXX"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#131924] border border-[#202736] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={redeeming || !couponCode.trim()}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-black font-bold px-3 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-1"
                  >
                    {redeeming ? <Loader2 className="w-3 h-3 animate-spin" /> : "Redeem"}
                  </button>
                </div>

                {couponMessage && (
                  <div
                    className={`text-[11px] p-2 rounded-lg flex items-start gap-1.5 ${
                      couponMessage.type === "success"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {couponMessage.type === "success" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    )}
                    <span>{couponMessage.text}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {isPaid && !sub?.is_lifetime && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full bg-[#0b101c] hover:bg-red-500/10 border border-[#202736] hover:border-red-500/30 text-zinc-400 hover:text-red-400 font-medium py-2 rounded-xl text-xs transition-colors disabled:opacity-50"
          >
            {cancelling ? "Cancelling…" : "Cancel Subscription"}
          </button>
        )}
      </div>
    </div>
  );
}
