"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/auth";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

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
    monthly: "Monthly Pro",
    yearly: "Yearly Pro",
    lifetime: "Lifetime VIP",
  };

  return (
    <div className="landing-light min-h-screen bg-[#fafafa] text-zinc-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {status === "loading" && (
          <div className="bg-white border border-[#dedee2] rounded-2xl p-8 text-center shadow-xs">
            <Loader2 className="w-10 h-10 animate-spin text-[#1f9e8e] mx-auto mb-4" />
            <h2 className="text-lg font-bold font-mono text-zinc-900">Verifying Payment...</h2>
            <p className="text-zinc-500 text-xs mt-1.5 font-mono">Confirming transaction with Cashfree Gateway</p>
          </div>
        )}

        {status === "pending" && (
          <div className="bg-white border border-[#dedee2] rounded-2xl p-8 text-center shadow-xs">
            <div className="w-12 h-12 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold font-mono text-zinc-900">Payment is being confirmed…</h2>
            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
              Waiting for confirmation from Cashfree. Please keep this tab open.
            </p>
          </div>
        )}

        {status === "success" && subscription && (
          <div className="bg-white border border-[#dedee2] rounded-2xl p-8 text-center shadow-xs">
            <div className="w-16 h-16 bg-[#e6f7f5] border border-[#1f9e8e]/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xs">
              <CheckCircle2 className="w-9 h-9 text-[#1f9e8e]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold font-mono uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Activated
            </div>

            <h1 className="text-2xl font-bold font-mono text-zinc-900 mb-1 tracking-tight">You're all set! 🎉</h1>
            <p className="text-zinc-500 text-xs mb-6">
              Your <strong className="text-zinc-900">{planLabels[subscription.plan_id] || subscription.plan_id}</strong> is now active.
            </p>

            <div className="bg-zinc-50 rounded-xl p-4 mb-6 text-left space-y-2.5 border border-zinc-200 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Plan</span>
                <span className="text-zinc-900 font-bold font-mono">{subscription.plan_name ?? planLabels[subscription.plan_id]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Started</span>
                <span className="text-zinc-900 font-medium font-mono">
                  {new Date(subscription.starts_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Validity</span>
                <span className="text-zinc-900 font-medium font-mono">
                  {subscription.is_lifetime || !subscription.expires_at
                    ? "Lifetime ♾️ (Permanent)"
                    : new Date(subscription.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>

            <Link
              href="/practice/daily"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-2xs text-xs"
            >
              Start Practicing Daily SQL <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === "failed" && (
          <div className="bg-white border border-[#dedee2] rounded-2xl p-8 text-center shadow-xs">
            <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-9 h-9 text-rose-600" />
            </div>

            <h1 className="text-xl font-bold font-mono text-zinc-900 mb-1">Payment Not Confirmed</h1>
            <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
              We couldn't verify your payment. If money was deducted, it will be refunded automatically by your bank.
            </p>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/payment"
                className="w-full inline-flex items-center justify-center bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs shadow-2xs"
              >
                Try Again
              </Link>
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold py-2.5 px-4 rounded-xl transition-all text-xs"
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
    <Suspense
      fallback={
        <div className="landing-light min-h-screen bg-[#fafafa] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1f9e8e]" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
