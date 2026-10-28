"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Shield,
  Zap,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Crown,
  Gift,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/auth";
import { isPlanId, takePendingPlan, type PlanId } from "@/lib/pending-plan";
import {
  DEFAULT_PLANS,
  fetchPlanCatalog,
  formatPrice,
  isCurrency,
  planPrice,
  readCurrencyCookie,
  saveCurrencyCookie,
  type Currency,
  type PlanMap,
} from "@/lib/plans";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

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

function loadCheckoutScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(!!window.Razorpay));
    script.addEventListener("error", () => resolve(false));
    if (!existing) {
      script.src = CHECKOUT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export function PaymentPlans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [livePlans, setLivePlans] = useState<PlanMap>(DEFAULT_PLANS);
  const [isTestMode, setIsTestMode] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>("INR");
  const [paymentResult, setPaymentResult] = useState<{
    status: "PAID" | "PENDING" | "FAILED";
    orderId?: string;
    amount?: number;
    currency?: Currency;
    planName?: string;
    message?: string;
    scrollTo?: "terms";
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const termsRef = useRef<HTMLLabelElement>(null);

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    saveCurrencyCookie(next);
  };

  // Bring every notice into view: the result card sits below the plans, so without this a failed
  // click on "Pay" looks like nothing happened.
  useEffect(() => {
    if (!paymentResult) return;
    const frame = requestAnimationFrame(() => {
      if (paymentResult.scrollTo === "terms" && termsRef.current) {
        termsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [paymentResult]);

  // Load Razorpay Checkout and fetch user subscription state
  useEffect(() => {
    loadCheckoutScript().then(setCheckoutReady);

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
    fetchPlanCatalog({ cache: "no-store" }).then(({ plans, paymentMode }) => {
      setLivePlans(plans);
      setIsTestMode(paymentMode === "test");
    });
  }, []);

  // Preselect the plan chosen on /pricing (?plan=…) or remembered through signup/login, and the currency
  // (?currency=…, else the choice remembered from /pricing or the visitor's region)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("plan");
    const chosen = isPlanId(fromUrl) ? fromUrl : takePendingPlan();
    if (isPlanId(fromUrl)) takePendingPlan(); // drop any stale remembered pick
    if (chosen) setSelectedPlanId(chosen);

    const currencyParam = params.get("currency")?.toUpperCase();
    const initial = isCurrency(currencyParam) ? currencyParam : readCurrencyCookie();
    if (initial) setCurrencyState(initial);
  }, []);

  useEffect(() => {
    if (!selectedPlanId) return;
    document.getElementById(`plan-${selectedPlanId}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selectedPlanId]);

  const priceOf = (planId: PlanId) => planPrice(livePlans[planId], currency);

  const handlePayment = async (plan: Plan) => {
    if (!agreedToTerms) {
      setPaymentResult({
        status: "FAILED",
        message: "Please agree to the Terms of Service, Privacy Policy and Refund Policy before paying.",
        scrollTo: "terms",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      window.location.href = `/login?plan=${plan.id}&redirect=${encodeURIComponent(`/payment?plan=${plan.id}&currency=${currency}`)}`;
      return;
    }

    setLoadingPlan(plan.id);
    setPaymentResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_id: plan.id, currency }),
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

      if (!response.ok || !data.success || !data.razorpay_order_id) {
        const errDetail = data?.detail?.error || data?.detail?.message || data?.detail;
        throw new Error(
          typeof errDetail === "string"
            ? errDetail
            : JSON.stringify(errDetail) || "Failed to initialize payment order"
        );
      }

      if (!window.Razorpay && !(await loadCheckoutScript())) {
        throw new Error("Razorpay Checkout could not be loaded. Please check your connection and try again.");
      }

      const orderId: string = data.order_id;
      const orderCurrency: Currency = data.currency;
      let settled = false;

      const rzp = new window.Razorpay({
        key: data.key_id,
        order_id: data.razorpay_order_id,
        amount: data.amount,
        currency: orderCurrency,
        name: "DailySQL",
        description: data.plan_name,
        prefill: data.prefill,
        notes: { dsql_order_id: orderId },
        theme: { color: "#1f9e8e" },
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          settled = true;
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ order_id: orderId, ...resp }),
            });
            const verified = await verifyRes.json().catch(() => ({}));
            if (verifyRes.ok && verified.order_status === "FAILED") {
              setPaymentResult({
                status: "FAILED",
                orderId,
                planName: plan.name,
                message: "We could not confirm this payment. If money was deducted, contact support with your order ID.",
              });
              setLoadingPlan(null);
              return;
            }
          } catch {
            /* the success page re-checks the order with Razorpay, so a network blip here is harmless */
          }
          window.location.href = `/payment/success?order_id=${orderId}`;
        },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
            if (!settled) {
              setPaymentResult((prev) => prev ?? {
                status: "FAILED",
                orderId,
                planName: plan.name,
                message: "Payment window was closed before the payment was completed.",
              });
            }
          },
        },
      });

      rzp.on("payment.failed", (resp: { error?: { description?: string } }) => {
        // Checkout lets the user retry inside the same window; this records the last failure reason.
        setPaymentResult({
          status: "FAILED",
          orderId,
          amount: data.order_amount,
          currency: orderCurrency,
          planName: plan.name,
          message: resp?.error?.description || "The payment failed. You can try again with another method.",
        });
      });

      rzp.open();
    } catch (err: any) {
      setPaymentResult({
        status: "FAILED",
        message: err.message || "An unexpected error occurred during payment.",
      });
      setLoadingPlan(null);
    }
  };

  const isCurrentPlan = (planId: string) => userSubscription?.plan === planId && userSubscription?.is_paid;

  const monthlyNow = priceOf("monthly");
  const yearlyNow = priceOf("yearly");
  const savePct = monthlyNow && yearlyNow ? Math.max(0, Math.round((1 - yearlyNow / (monthlyNow * 12)) * 100)) : null;

  return (
    <div className="space-y-10 text-zinc-900">
      {/* Test-mode notice — shown only while the backend runs Razorpay test keys, so real customers never
          see a "use this test card" message once live keys are deployed. */}
      {isTestMode && (
        <div className="bg-[#e6f7f5] border border-[#1f9e8e]/30 rounded-2xl p-4 max-w-4xl mx-auto flex items-center justify-between text-xs sm:text-sm text-[#135d54] shadow-2xs">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 shrink-0 text-[#1f9e8e]" />
            <div>
              <span className="font-bold">Test Mode:</span> No real money is charged. Pay with Razorpay test UPI (<code className="font-mono text-zinc-900 bg-white/80 px-1 py-0.5 rounded border border-zinc-200 dark:bg-[#0F1419]/80">success@razorpay</code>) or any Razorpay test card from their docs (international test cards for USD).
            </div>
          </div>
        </div>
      )}

      {/* Currency */}
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600 bg-white border border-zinc-200 rounded-2xl p-4 shadow-2xs dark:bg-[#0F1419] dark:border-[#20283C] dark:text-zinc-400">
        <span className="flex items-center gap-2">
          <span>🌐</span>
          <span>
            Paying in <strong>{currency === "INR" ? "Indian rupees (INR)" : "US dollars (USD)"}</strong>
            {currency === "INR" ? " · UPI, netbanking & cards" : " · international cards"}
          </span>
        </span>
        <div className="inline-flex p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 font-semibold dark:bg-[#080C16] dark:border-[#20283C]" role="group" aria-label="Currency">
          {(["INR", "USD"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              disabled={!!loadingPlan}
              aria-pressed={currency === c}
              className={`px-3 py-1 rounded-md transition-all ${currency === c
                ? "bg-white text-zinc-900 shadow-2xs font-bold dark:bg-[#0F1419] dark:text-white"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
            >
              {c === "INR" ? "INR (₹)" : "USD ($)"}
            </button>
          ))}
        </div>
      </div>

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
          const amount = priceOf(plan.id);
          const available = amount !== null;
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
                    {available ? formatPrice(amount, currency) : "—"}
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
                    const feature = savePct !== null ? rawFeature.replace(/Save \d+%/, `Save ${savePct}%`) : rawFeature;
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
                  disabled={isLoading || !!loadingPlan || !checkoutReady || isOwned || !agreedToTerms || !available}
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
                  ) : available ? (
                    `Pay ${formatPrice(amount, currency)}`
                  ) : (
                    `Not available in ${currency}`
                  )}
                </Button>
                <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1 font-mono">
                  <Shield className="w-3 h-3 text-[#1f9e8e]" /> 256-bit encrypted • Razorpay Secure
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
              {paymentResult.amount && paymentResult.currency && (
                <div>
                  <span className="text-zinc-400">Amount:</span> {formatPrice(paymentResult.amount, paymentResult.currency)}
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
          Payments are processed securely by Razorpay. Instant automated order verification and real-time membership activation.
        </p>
      </div>
    </div>
  );
}
