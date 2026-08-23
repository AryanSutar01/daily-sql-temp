"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/auth";

interface SubscriptionData {
  plan_id: string;
  plan_name: string;
  starts_at: string;
  expires_at: string | null;
  is_lifetime: boolean;
}

interface VerifyResponse {
  order_status: string;
  subscription: SubscriptionData | null;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState<"loading" | "success" | "pending" | "failed">("loading");
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify-order/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Verification failed");
        const data: VerifyResponse = await res.json();

        if (data.order_status === "PAID" && data.subscription) {
          setSubscription(data.subscription);
          setStatus("success");
        } else if (data.order_status === "ACTIVE") {
          // Payment still processing — retry
          setStatus("pending");
          setAttempts((a) => a + 1);
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [orderId, router]);

  // Retry polling if payment is still processing (up to 6 times)
  useEffect(() => {
    if (status === "pending" && attempts < 6) {
      const timer = setTimeout(() => {
        const token = getToken();
        if (!token || !orderId) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify-order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

          .then((r) => r.json())
          .then((data: VerifyResponse) => {
            if (data.order_status === "PAID" && data.subscription) {
              setSubscription(data.subscription);
              setStatus("success");
            } else {
              setAttempts((a) => a + 1);
            }
          })
          .catch(() => setAttempts((a) => a + 1));
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (status === "pending" && attempts >= 6) {
      setStatus("failed");
    }
  }, [status, attempts, orderId]);

  const planLabels: Record<string, string> = {
    monthly: "Monthly",
    yearly: "Yearly",
    lifetime: "Lifetime",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {status === "loading" && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-slate-300 text-lg font-medium">Verifying your payment…</p>
            <p className="text-slate-500 text-sm mt-2">This will only take a moment.</p>
          </div>
        )}

        {status === "pending" && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-slate-300 text-lg font-medium">Payment is being confirmed…</p>
            <p className="text-slate-500 text-sm mt-2">
              Waiting for confirmation from Cashfree. Please don't close this tab.
            </p>
          </div>
        )}

        {status === "success" && subscription && (
          <div className="bg-[#12121a] border border-emerald-500/20 rounded-2xl p-8 text-center shadow-2xl shadow-emerald-500/5">
            {/* Success icon */}
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-[pulse_2s_ease-in-out_infinite]">
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">You're all set! 🎉</h1>
            <p className="text-slate-400 mb-6">
              Your <span className="text-violet-400 font-semibold">{planLabels[subscription.plan_id] || subscription.plan_id} Plan</span> is now active.
            </p>

            <div className="bg-[#0a0a0f] rounded-xl p-4 mb-6 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Plan</span>
                <span className="text-white font-medium">{subscription.plan_name ?? planLabels[subscription.plan_id]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Started</span>
                <span className="text-white font-medium">
                  {new Date(subscription.starts_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Expires</span>
                <span className="text-white font-medium">
                  {subscription.is_lifetime || !subscription.expires_at
                    ? "Never (Lifetime)"
                    : new Date(subscription.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>

            <Link
              href="/practice"
              className="block w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5"
            >
              Start Practicing →
            </Link>
          </div>
        )}

        {status === "failed" && (
          <div className="bg-[#12121a] border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Payment Not Confirmed</h1>
            <p className="text-slate-400 mb-6">
              We couldn't verify your payment. If money was deducted, it will be refunded automatically. Please contact support.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/payment"
                className="block w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Try Again
              </Link>
              <Link
                href="/"
                className="block w-full bg-white/5 hover:bg-white/10 text-slate-300 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Go Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
