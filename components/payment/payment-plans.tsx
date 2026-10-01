"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Shield,
  Star,
  Zap,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Crown,
  Gift,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/auth";
import { isPlanId, takePendingPlan, type PlanId } from "@/lib/pending-plan";
import { DEFAULT_PLANS, fetchPlans, formatINR, type PlanMap } from "@/lib/plans";

declare global {
  interface Window {
    Cashfree?: any;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Plan {
  id: "monthly" | "yearly" | "lifetime";
  name: string;
  period: string;
  tagline: string;
  badge?: string;
  highlighted?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Monthly Pro",
    period: "/month",
    tagline: "Flexible short-term interview preparation.",
    features: [
      "Full access to all SQL interview questions",
      "All Python, PySpark & DSA challenge tracks",
      "Unlimited query executions & editor access",
      "Company-wise SQL & data engineering sets",
      "Standard community support",
    ],
  },
  {
    id: "yearly",
    name: "Yearly Pro",
    period: "/year",
    tagline: "Most popular choice for consistent career growth.",
    badge: "Best Value",
    highlighted: true,
    features: [
      "Everything in Monthly Plan",
      "Save 86% compared to buying Monthly for 12 months",
      "Full 12 months of all new question releases",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime VIP",
    period: "one-time",
    tagline: "One payment, lifetime access, zero renewals.",
    badge: "VIP Deal",
    features: [
      "Everything in Yearly Plan",
      "One-time payment, lifetime access",
      "New problems and tracks added to the platform",
      "Exclusive VIP community role",
    ],
  },
];

// Only "production" turns on live payments; anything else (unset, "sandbox", a typo) stays
// sandboxed — the same fail-safe direction as the Cashfree SDK's own `mode` default below.
const IS_SANDBOX = process.env.NEXT_PUBLIC_CASHFREE_ENV !== "production";

export function PaymentPlans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false);
  const [cashfreeInstance, setCashfreeInstance] = useState<any>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [livePlans, setLivePlans] = useState<PlanMap>(DEFAULT_PLANS);
  const [needsPhone, setNeedsPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [paymentResult, setPaymentResult] = useState<{
    status: "PAID" | "PENDING" | "FAILED" | "EXPIRED" | "TEST_MODE_WARNING";
    orderId?: string;
    amount?: number;
    planName?: string;
    message?: string;
    details?: any;
    scrollTo?: "phone" | "terms";
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const phoneBoxRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLLabelElement>(null);

  // Bring every notice into view: the result card sits below the plans, so without this a failed
  // click on "Pay" looks like nothing happened.
  useEffect(() => {
    if (!paymentResult) return;
    const frame = requestAnimationFrame(() => {
      if (paymentResult.scrollTo === "phone" && phoneBoxRef.current) {
        phoneBoxRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        phoneInputRef.current?.focus({ preventScroll: true });
      } else if (paymentResult.scrollTo === "terms" && termsRef.current) {
        termsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [paymentResult]);

  // Dynamically load Cashfree.js SDK and fetch user subscription state
  useEffect(() => {
    if (window.Cashfree) {
      setCashfreeLoaded(true);
      setCashfreeInstance(
        window.Cashfree({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox",
        })
      );
    } else {
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => {
        setCashfreeLoaded(true);
        if (window.Cashfree) {
          const cf = window.Cashfree({
            mode: process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox",
          });
          setCashfreeInstance(cf);
        }
      };
      document.body.appendChild(script);
    }

    const token = getToken();
    if (token) {
      fetch(`${API_BASE_URL}/api/payments/my-subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => setUserSubscription(d))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    fetchPlans({ cache: "no-store" }).then(setLivePlans);
  }, []);

  // Preselect the plan chosen on /pricing (?plan=…) or remembered through signup/login
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("plan");
    const chosen = isPlanId(fromUrl) ? fromUrl : takePendingPlan();
    if (isPlanId(fromUrl)) takePendingPlan(); // drop any stale remembered pick
    if (chosen) setSelectedPlanId(chosen);
  }, []);

  useEffect(() => {
    if (!selectedPlanId) return;
    document.getElementById(`plan-${selectedPlanId}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selectedPlanId]);

  const handlePayment = async (plan: Plan) => {
    if (!agreedToTerms) {
      setPaymentResult({
        status: "FAILED",
        message: "Please agree to the Terms of Service, Privacy Policy and Refund Policy before paying.",
        scrollTo: "terms",
      });
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (needsPhone && phoneDigits.length < 10) {
      setPaymentResult({
        status: "FAILED",
        message: "Please enter a valid 10-digit phone number for your payment receipt.",
        scrollTo: "phone",
      });
      return;
    }

    setLoadingPlan(plan.id);
    setPaymentResult(null);

    const token = getToken();
    if (!token) {
      window.location.href = `/login?plan=${plan.id}&redirect=${encodeURIComponent(`/payment?plan=${plan.id}`)}`;
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan_id: plan.id,
          ...(needsPhone && phoneDigits ? { customer_phone: phoneDigits } : {}),
        }),
      });

      const data = await response.json();

      if (response.status === 409 || data?.detail === "already_subscribed") {
        setPaymentResult({
          status: "PAID",
          planName: plan.name,
          message: "You already have an active subscription for this account.",
        });
        setLoadingPlan(null);
        return;
      }

      if (response.status === 400 && (data?.detail === "phone_required" || data?.detail === "invalid_phone")) {
        setNeedsPhone(true);
        setPaymentResult({
          status: "FAILED",
          message: "Please enter your phone number below (needed for the payment receipt), then click Pay again.",
          scrollTo: "phone",
        });
        setLoadingPlan(null);
        return;
      }

      if (!response.ok || !data.success || !data.payment_session_id) {
        const errDetail = data?.detail?.error || data?.detail?.message || data?.detail;
        throw new Error(
          typeof errDetail === "string"
            ? errDetail
            : JSON.stringify(errDetail) || "Failed to initialize payment order"
        );
      }

      const { payment_session_id, order_id } = data;

      if (!cashfreeInstance) {
        throw new Error("Cashfree Web SDK is not ready yet. Please try again.");
      }

      const result = await cashfreeInstance.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal",
      });

      if (result.error) {
        setPaymentResult({
          status: "FAILED",
          orderId: order_id,
          planName: plan.name,
          message:
            result.error.message ||
            "Payment window was closed or interrupted before completion.",
        });
        return;
      }

      if (result.paymentDetails) {
        window.location.href = `/payment/success?order_id=${order_id}`;
      }
    } catch (err: any) {
      setPaymentResult({
        status: "FAILED",
        message: err.message || "An unexpected error occurred during payment.",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const isCurrentPlan = (planId: string) => userSubscription?.plan === planId && userSubscription?.is_paid;

  return (
    <div className="space-y-10 text-zinc-900">
      {/* Test Sandbox Alert Banner — sandbox/dev only; must never show real customers a "use this
          fake card" message once NEXT_PUBLIC_CASHFREE_ENV=production is set and deployed. */}
      {IS_SANDBOX && (
        <div className="bg-[#e6f7f5] border border-[#1f9e8e]/30 rounded-2xl p-4 max-w-4xl mx-auto flex items-center justify-between text-xs sm:text-sm text-[#135d54] shadow-2xs">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 shrink-0 text-[#1f9e8e]" />
            <div>
              <span className="font-bold">Sandbox Mode:</span> Test payments safely with Cashfree test cards (Card: <code className="font-mono text-zinc-900 bg-white/80 px-1 py-0.5 rounded border border-zinc-200 dark:bg-[#0F1419]/80">4706131211212123</code> / OTP: <code className="font-mono text-zinc-900 bg-white/80 px-1 py-0.5 rounded border border-zinc-200 dark:bg-[#0F1419]/80">111000</code>) or Test UPI (<code className="font-mono text-zinc-900 bg-white/80 px-1 py-0.5 rounded border border-zinc-200 dark:bg-[#0F1419]/80">testsuccess@gocash</code>).
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto flex items-start gap-2 text-xs text-zinc-600 bg-white border border-zinc-200 rounded-2xl p-4 shadow-2xs dark:bg-[#0F1419] dark:border-[#20283C] dark:text-zinc-400">
        <span>🌐</span>
        <span>
          All prices are in INR. <strong>Outside India?</strong> Choose PayPal at checkout. PayPal converts the INR amount to your currency at its own exchange rate, so the final amount may differ slightly.
        </span>
      </div>

      {needsPhone && (
        <div ref={phoneBoxRef} className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded-2xl p-4 shadow-2xs dark:bg-[#0F1419] dark:border-[#20283C]">
          <label htmlFor="billing-phone" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Phone number (for your payment receipt)
          </label>
          <input
            id="billing-phone"
            ref={phoneInputRef}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-[#1f9e8e] dark:bg-[#080C16] dark:border-[#20283C] dark:text-white"
          />
        </div>
      )}

      {/* Terms Acceptance — required before any plan can be paid for */}
      <label ref={termsRef} className="max-w-4xl mx-auto flex items-start gap-3 bg-white border border-zinc-200 rounded-2xl p-4 shadow-2xs cursor-pointer dark:bg-[#0F1419] dark:border-[#20283C]">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-[#1f9e8e] focus:ring-[#1f9e8e] shrink-0 accent-[#1f9e8e]"
        />
        <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          I agree to the{" "}
          <Link href="/terms" target="_blank" className="underline text-[#1f9e8e] font-semibold">
            Terms of Service
          </Link>
          ,{" "}
          <Link href="/privacy" target="_blank" className="underline text-[#1f9e8e] font-semibold">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/refund" target="_blank" className="underline text-[#1f9e8e] font-semibold">
            Refund Policy
          </Link>
          , including that Monthly and Yearly plans are non-refundable once activated.
        </span>
      </label>

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {PLANS.map((plan) => {
          const isLoading = loadingPlan === plan.id;
          const isOwned = isCurrentPlan(plan.id);
          const isSelected = selectedPlanId === plan.id;
          // When the visitor arrived with a chosen plan, that card leads; otherwise the default "Best Value" one does
          const emphasized = selectedPlanId ? isSelected : !!plan.highlighted;

          return (
            <div
              key={plan.id}
              id={`plan-${plan.id}`}
              className={`relative rounded-2xl border flex flex-col transition-all duration-200 p-7 sm:p-8 bg-white ${
                emphasized
                  ? `border-[#1f9e8e] ${isSelected ? "ring-2 ring-[#1f9e8e]" : "ring-1 ring-[#1f9e8e]/40"} shadow-md md:-translate-y-2 z-10`
                  : "border-[#dedee2] shadow-xs hover:border-zinc-300"
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-0.5 rounded-full bg-zinc-900 text-zinc-50 text-[11px] font-bold uppercase tracking-wider font-mono shadow-xs flex items-center gap-1">
                    <Check className="w-3 h-3" /> Your selection
                  </span>
                </div>
              )}
              {plan.badge && (
                <div className="absolute -top-3 right-6">
                  <span className="px-3 py-0.5 rounded-full bg-[#1f9e8e] text-white text-[11px] font-bold uppercase tracking-wider font-mono shadow-xs flex items-center gap-1">
                    {plan.id === "lifetime" ? (
                      <Crown className="w-3.5 h-3.5 inline" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 inline" />
                    )}
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold font-mono text-zinc-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-mono text-zinc-900 tracking-tight">
                    {formatINR(livePlans[plan.id].price)}
                  </span>
                  <span className="text-zinc-500 text-xs font-medium">
                    {plan.period}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-2.5 h-8 leading-relaxed">{plan.tagline}</p>
              </div>

              <div className="flex-1 py-4 border-t border-zinc-100">
                <ul className="space-y-3">
                  {plan.features.map((rawFeature, idx) => {
                    const savePct = Math.max(0, Math.round((1 - livePlans.yearly.price / (livePlans.monthly.price * 12)) * 100));
                    const feature = rawFeature.replace(/Save \d+%/, `Save ${savePct}%`);
                    return (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-zinc-700 leading-snug font-medium"
                    >
                      <Check className="w-4 h-4 text-[#1f9e8e] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{feature}</span>
                    </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-zinc-100 space-y-2.5">
                <Button
                  onClick={() => handlePayment(plan)}
                  disabled={isLoading || !cashfreeLoaded || isOwned || !agreedToTerms}
                  title={!agreedToTerms && !isOwned ? "Please agree to the Terms of Service, Privacy Policy and Refund Policy first" : undefined}
                  className={`w-full h-11 text-xs font-bold rounded-xl transition-all ${
                    isOwned
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
                      : emphasized
                      ? "bg-[#1f9e8e] hover:bg-[#177a6d] text-white shadow-2xs"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white"
                  }`}
                >
                  {isOwned ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Current Active Plan
                    </span>
                  ) : isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Preparing Checkout...
                    </span>
                  ) : (
                    `Pay ${formatINR(livePlans[plan.id].price)}`
                  )}
                </Button>
                <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1 font-mono">
                  <Shield className="w-3 h-3 text-[#1f9e8e]" /> 256-bit encrypted • Cashfree Gateway
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Early Adopter Coupon Banner */}
      <div className="max-w-4xl mx-auto bg-amber-50/80 border border-amber-200 rounded-2xl p-6 shadow-xs dark:bg-amber-500/5 dark:border-amber-500/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-left flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-300">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 mb-0.5 flex items-center gap-1.5">
                Early Adopter or Community Member? <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-300" />
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-xl">
                If you were granted a unique lifetime coupon code for supporting Daily SQL, redeem it to activate your Lifetime VIP Pass for free.
              </p>
            </div>
          </div>
          <Link
            href="/redeem"
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            Redeem Invite Code <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Payment Result Status Dialog */}
      {paymentResult && (
        <div ref={resultRef} className="max-w-xl mx-auto rounded-2xl border border-zinc-300 bg-white p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            {paymentResult.status === "PAID" ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 dark:text-emerald-300" />
            ) : (
              <AlertCircle className="w-7 h-7 text-amber-600 shrink-0 dark:text-amber-300" />
            )}
            <div>
              <h4 className="text-base font-bold text-zinc-900">
                {paymentResult.status === "PAID"
                  ? "Payment Completed Successfully!"
                  : "Payment Status"}
              </h4>
              <p className="text-xs text-zinc-600">{paymentResult.message}</p>
            </div>
          </div>

          {paymentResult.orderId && (
            <div className="bg-zinc-50 rounded-xl p-3 text-xs space-y-1 font-mono text-zinc-700 border border-zinc-200">
              <div>
                <span className="text-zinc-400">Order ID:</span> {paymentResult.orderId}
              </div>
              {paymentResult.planName && (
                <div>
                  <span className="text-zinc-400">Plan:</span> {paymentResult.planName}
                </div>
              )}
              {paymentResult.amount && (
                <div>
                  <span className="text-zinc-400">Amount:</span> ₹{paymentResult.amount}
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaymentResult(null)}
            className="w-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-bold"
          >
            Close Notice
          </Button>
        </div>
      )}

      {/* Security & Features Footer */}
      <div className="max-w-3xl mx-auto text-center bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
        <h4 className="text-xs font-bold font-mono text-zinc-700 mb-1 flex items-center justify-center gap-1.5 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-[#1f9e8e]" /> Safe & Instant Activation
        </h4>
        <p className="text-xs text-zinc-500 leading-relaxed max-w-xl mx-auto">
          Payments are processed securely via Cashfree Payments Payment Gateway. Instant automated order verification and real-time membership activation.
        </p>
      </div>
    </div>
  );
}
