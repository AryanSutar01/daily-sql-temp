"use client";

import { useEffect, useState } from "react";
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
  price: string;
  numericPrice: number;
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
    price: "₹899",
    numericPrice: 899,
    period: "/month",
    tagline: "Flexible short-term interview preparation.",
    features: [
      "Full access to all SQL interview questions",
      "All Python, PySpark & DSA challenge types",
      "Unlimited query executions & editor access",
      "Company-wise SQL & data engineering question sets",
      "Standard community support",
    ],
  },
  {
    id: "yearly",
    name: "Yearly Pro",
    price: "₹1,499",
    numericPrice: 1499,
    period: "/year",
    tagline: "Most popular choice for consistent career growth.",
    badge: "Best Value",
    highlighted: true,
    features: [
      "Everything in Monthly Plan",
      "Save 86% compared to monthly renewal",
      "Full 12 months of all new question releases",
      "Advanced interview scenario mock tests",
      "Priority resolution & community badge",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime VIP",
    price: "₹4,999",
    numericPrice: 4999,
    period: "one-time",
    tagline: "Unlimited permanent access forever with zero renewals.",
    badge: "VIP Deal",
    features: [
      "Everything in Yearly Plan",
      "One-time payment, permanent lifetime access",
      "All future courses, tracks & content releases included",
      "Exclusive Discord VIP role & priority support",
      "Official Certificate of Completion",
    ],
  },
];

export function PaymentPlans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false);
  const [cashfreeInstance, setCashfreeInstance] = useState<any>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [paymentResult, setPaymentResult] = useState<{
    status: "PAID" | "PENDING" | "FAILED" | "EXPIRED" | "TEST_MODE_WARNING";
    orderId?: string;
    amount?: number;
    planName?: string;
    message?: string;
    details?: any;
  } | null>(null);

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

    // Fetch user subscription if token present

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

  const handlePayment = async (plan: Plan) => {
    setLoadingPlan(plan.id);
    setPaymentResult(null);

    const token = getToken();
    if (!token) {
      window.location.href = "/login?redirect=/payment";
      return;
    }


    try {
      // 1. Call Backend to create order (auth required)
      const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_id: plan.id }),
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

      if (!response.ok || !data.success || !data.payment_session_id) {
        const errDetail = data?.detail?.error || data?.detail?.message || data?.detail;
        throw new Error(
          typeof errDetail === "string"
            ? errDetail
            : JSON.stringify(errDetail) || "Failed to initialize payment order"
        );
      }

      const { payment_session_id, order_id } = data;

      // 2. Open Cashfree Drop-in Checkout Modal
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
        // 3. Redirect to success page for verification
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
    <div className="space-y-10">
      {/* Test Sandbox Alert Banner */}

      <div className="bg-[#30B5A6]/10 border border-[#30B5A6]/30 rounded-2xl p-4 max-w-4xl mx-auto flex items-center justify-between text-xs sm:text-sm text-[#30B5A6] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-bold">Sandbox Mode:</span> Test payments safely with Cashfree test cards (Card: <code className="font-mono text-white bg-black/40 px-1 py-0.5 rounded">4706131211212123</code> / OTP: <code className="font-mono text-white bg-black/40 px-1 py-0.5 rounded">111000</code>) or Test UPI (<code className="font-mono text-white bg-black/40 px-1 py-0.5 rounded">testsuccess@gocash</code>).
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {PLANS.map((plan) => {
          const isLoading = loadingPlan === plan.id;
          const isOwned = isCurrentPlan(plan.id);

          return (
            <div
              key={plan.id}
              className={`relative rounded-[32px] border flex flex-col transition-all duration-300 backdrop-blur-xl p-8 ${
                plan.highlighted
                  ? "border-[#4DD4C4]/50 bg-[#131924]/95 shadow-[0_0_40px_-10px_rgba(77,212,196,0.25)] md:-translate-y-3 z-10"
                  : "border-[#202736]/80 bg-[#131924]/70 hover:border-white/20"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 right-6">
                  <span className="px-3.5 py-1 rounded-full bg-[#4DD4C4] text-[#080C16] text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1">
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
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-zinc-400 text-sm font-medium">
                    {plan.period}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-3 h-8 leading-relaxed">{plan.tagline}</p>
              </div>

              <div className="flex-1 py-4 border-t border-white/5">
                <ul className="space-y-3.5">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-snug"
                    >
                      <Check className="w-4 h-4 text-[#4DD4C4] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                <Button
                  onClick={() => handlePayment(plan)}
                  disabled={isLoading || !cashfreeLoaded || isOwned}
                  className={`w-full h-11 text-sm font-bold rounded-xl transition-all ${
                    isOwned
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                      : plan.highlighted
                      ? "bg-gradient-to-r from-[#4DD4C4] to-[#34b6a5] hover:opacity-90 text-[#080C16] shadow-lg shadow-[#4DD4C4]/25"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
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
                    `Pay ${plan.price}`
                  )}
                </Button>
                <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3 text-[#4DD4C4]" /> 256-bit encrypted • Cashfree Gateway
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Early Adopter Coupon Banner */}
      <div className="max-w-4xl mx-auto bg-amber-500/10 border border-amber-500/20 rounded-[28px] p-6 backdrop-blur-sm shadow-xl shadow-amber-500/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-left flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                Early Adopter or Community Member? <Sparkles className="w-4 h-4 text-amber-400" />
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                If you were granted a unique lifetime coupon code for supporting Daily SQL, redeem it to unlock Lifetime VIP Access for free.
              </p>
            </div>
          </div>
          <Link
            href="/redeem"
            className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs py-3 px-5 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
          >
            Redeem Coupon Code <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Payment Result Status Dialog */}
      {paymentResult && (
        <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-[#131924] p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            {paymentResult.status === "PAID" ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-amber-400 shrink-0" />
            )}
            <div>
              <h4 className="text-lg font-bold text-white">
                {paymentResult.status === "PAID"
                  ? "Payment Completed Successfully!"
                  : "Payment Status / Result"}
              </h4>
              <p className="text-xs text-zinc-400">{paymentResult.message}</p>
            </div>
          </div>

          {paymentResult.orderId && (
            <div className="bg-black/40 rounded-xl p-3 text-xs space-y-1 font-mono text-zinc-300 border border-white/5">
              <div>
                <span className="text-zinc-500">Order ID:</span> {paymentResult.orderId}
              </div>
              {paymentResult.planName && (
                <div>
                  <span className="text-zinc-500">Plan:</span> {paymentResult.planName}
                </div>
              )}
              {paymentResult.amount && (
                <div>
                  <span className="text-zinc-500">Amount:</span> ₹{paymentResult.amount}
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaymentResult(null)}
            className="w-full border-white/10 text-zinc-300 hover:text-white"
          >
            Close Notice
          </Button>
        </div>
      )}

      {/* Security & Features Footer */}
      <div className="max-w-3xl mx-auto text-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <h4 className="text-base font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-[#4DD4C4]" /> Safe & Instant Activation
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Payments are processed securely via Cashfree Payments Payment Gateway. Instant automated order verification & real-time membership activation.
        </p>
      </div>
    </div>
  );
}
