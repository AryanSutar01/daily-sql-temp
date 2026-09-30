"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Gift, CheckCircle2, AlertCircle, Loader2, Crown, ArrowRight, Shield, Zap } from "lucide-react";
import { getToken } from "@/lib/auth";

interface Subscription {
  plan_id: string;
  plan_name: string;
  starts_at: string;
  expires_at: string | null;
  is_lifetime: boolean;
  amount_paid?: number;
  /** "active", or "cancelled" (will not renew, access continues until expires_at) */
  status?: string;
}

interface SubscriptionData {
  plan: string;
  is_paid: boolean;
  is_trial?: boolean;
  trial_type?: string | null;
  trial_expires_at?: string | null;
  trial_days_remaining?: number;
  trial_hours_remaining?: number;
  trial_expired?: boolean;
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
      <div className="rounded-2xl bg-white border border-[#dedee2] p-6 shadow-xs animate-pulse">
        <div className="h-4 bg-zinc-200 rounded w-1/3 mb-3 dark:bg-zinc-700" />
        <div className="h-7 bg-zinc-200 rounded w-1/2 mb-5 dark:bg-zinc-700" />
        <div className="h-4 bg-zinc-100 rounded w-full" />
      </div>
    );
  }

  const planLabels: Record<string, { label: string; color: string; border: string; bg: string }> = {
    free: {
      label: "Free Tier",
      color: "text-zinc-600",
      border: "border-zinc-200",
      bg: "bg-zinc-100",
    },
    monthly: {
      label: "Monthly Pro",
      color: "text-[#1f9e8e]",
      border: "border-[#1f9e8e]/30",
      bg: "bg-[#e6f7f5]",
    },
    yearly: {
      label: "Yearly Pro",
      color: "text-[#1f9e8e]",
      border: "border-[#1f9e8e]/30",
      bg: "bg-[#e6f7f5]",
    },
    lifetime: {
      label: "Lifetime VIP",
      color: "text-amber-800 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-500/30",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
  };

  const plan = data?.plan ?? "free";
  const meta = planLabels[plan] ?? planLabels.free;
  const isPaid = data?.is_paid ?? false;
  const isTrial = data?.is_trial ?? false;
  const sub = data?.subscription;

  return (
    <div className="group relative bg-white border border-[#dedee2] hover:border-zinc-300 rounded-2xl p-6 shadow-xs transition-all duration-300 overflow-hidden text-zinc-900">
      {/* Top Accent Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          plan === "lifetime"
            ? "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500"
            : isPaid
            ? "bg-gradient-to-r from-[#1f9e8e] via-teal-400 to-[#135d54]"
            : isTrial
            ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500"
            : "bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-300"
        }`}
      />

      {/* Header Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#1f9e8e]" /> Membership Status
        </span>

        {isPaid && (
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${meta.bg} ${meta.color} border ${meta.border} flex items-center gap-1 uppercase tracking-wider`}>
            {plan === "lifetime" ? <Crown className="w-3 h-3 text-amber-600 dark:text-amber-300" /> : <Sparkles className="w-3 h-3 text-[#1f9e8e]" />}
            ACTIVE
          </span>
        )}

        {isTrial && !isPaid && (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 uppercase tracking-wider dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30">
            <Gift className="w-3 h-3 text-emerald-600 dark:text-emerald-300" />
            {data?.trial_type === "new_signup" ? `7-Day Pro Pass (${data?.trial_days_remaining ?? 7}d left)` : "30-Day Launch Access"}
          </span>
        )}

        {!isPaid && !isTrial && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            data?.trial_expired ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
          }`}>
            {data?.trial_expired ? "Trial Expired" : "Free Tier"}
          </span>
        )}
      </div>

      {/* Plan Title */}
      <h3 className="text-xl font-bold font-mono tracking-tight text-zinc-900 mb-1">
        {isPaid ? meta.label : isTrial ? (data?.trial_type === "new_signup" ? "7-Day Pro Pass" : "Launch Trial") : "Free Tier"}
      </h3>

      {/* Paid Active Subscription Details */}
      {isPaid && sub && (
        <div className="space-y-2 mt-4 pt-3 border-t border-zinc-100 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500 font-medium">Activated:</span>
            <span className="text-zinc-900 font-semibold font-mono">
              {new Date(sub.starts_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 font-medium">Validity:</span>
            <span className="text-zinc-900 font-semibold font-mono">
              {sub.is_lifetime || !sub.expires_at
                ? "Lifetime ♾️ (Permanent)"
                : new Date(sub.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          {sub.amount_paid != null && sub.amount_paid > 0 && (
            <div className="flex justify-between">
              <span className="text-zinc-500 font-medium">Amount:</span>
              <span className="text-zinc-900 font-semibold font-mono">₹{sub.amount_paid.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
      )}

      {/* Trial Active Banner */}
      {isTrial && !isPaid && (
        <div className="mt-3 pt-3 border-t border-zinc-100 space-y-2">
          <div className="p-3.5 bg-[#e6f7f5] border border-[#1f9e8e]/30 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#135d54] font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-[#1f9e8e] text-[#1f9e8e]" /> All Challenges Unlocked
              </span>
              {data?.trial_expires_at && (
                <span className="text-[11px] text-zinc-600 font-mono font-medium">
                  {data?.trial_days_remaining ?? 0} days remaining
                </span>
              )}
            </div>
            <p className="text-zinc-600 text-[11px] leading-relaxed">
              Enjoy unrestricted access across all SQL, Python &amp; PySpark tracks. Access ends automatically with zero hidden fees.
            </p>
          </div>
        </div>
      )}

      {/* Free Tier Info */}
      {!isPaid && !isTrial && (
        <div className="mt-3 pt-3 border-t border-zinc-100 text-xs text-zinc-500 space-y-2">
          {data?.trial_expired ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300">
              <strong>Your Pro Pass has expired.</strong> Upgrade to continue solving advanced SQL, Python &amp; PySpark questions.
            </div>
          ) : (
            <p className="mb-1 text-zinc-700">
              Current access: <span className="text-zinc-900 font-semibold">First 30 SQL questions</span> + daily practice sets.
            </p>
          )}
          <p className="text-[11px] text-zinc-500">
            Upgrade to unlock all premium challenges, company interview sets, Python, PySpark &amp; DSA tracks.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 space-y-2.5">
        {!isPaid && (
          <Link
            href="/pricing"
            className="w-full bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold rounded-xl py-2.5 text-xs transition-all duration-150 flex items-center justify-center gap-1.5 shadow-2xs"
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
                className="w-full text-center text-xs text-zinc-500 hover:text-amber-600 transition-colors flex items-center justify-center gap-1.5 py-1 dark:hover:text-amber-200"
              >
                <Gift className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                Have an early user invite code?
              </button>
            ) : (
              <form onSubmit={handleRedeemCoupon} className="space-y-2 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-800 font-semibold flex items-center gap-1 text-[11px]">
                    <Gift className="w-3 h-3 text-amber-600 dark:text-amber-300" /> Enter Invite Code
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCouponInput(false);
                      setCouponMessage(null);
                    }}
                    className="text-zinc-400 hover:text-zinc-700 text-[10px]"
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
                    className="flex-1 bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 font-mono placeholder:text-zinc-400 focus:outline-none focus:border-[#1f9e8e] uppercase"
                  />
                  <button
                    type="submit"
                    disabled={redeeming || !couponCode.trim()}
                    className="bg-[#1f9e8e] hover:bg-[#177a6d] disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-1 shadow-2xs"
                  >
                    {redeeming ? <Loader2 className="w-3 h-3 animate-spin" /> : "Redeem"}
                  </button>
                </div>

                {couponMessage && (
                  <div
                    className={`text-[11px] p-2 rounded-lg flex items-start gap-1.5 ${
                      couponMessage.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
                        : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30"
                    }`}
                  >
                    {couponMessage.type === "success" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-300" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-300" />
                    )}
                    <span>{couponMessage.text}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {isPaid && !sub?.is_lifetime && sub?.status === "cancelled" && (
          <p className="w-full text-center text-xs text-zinc-500 py-2">
            Cancelled. Your plan will not renew, and you keep full access until{" "}
            {sub?.expires_at
              ? new Date(sub.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : "the end of your paid period"}
            .
          </p>
        )}

        {isPaid && !sub?.is_lifetime && sub?.status !== "cancelled" && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 text-zinc-600 hover:text-rose-700 font-medium py-2 rounded-xl text-xs transition-colors disabled:opacity-50 dark:hover:bg-rose-500/10 dark:hover:border-rose-500/30 dark:hover:text-rose-200"
          >
            {cancelling ? "Cancelling…" : "Cancel Subscription"}
          </button>
        )}
      </div>
    </div>
  );
}
