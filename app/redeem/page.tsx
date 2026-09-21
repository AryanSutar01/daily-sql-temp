"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Gift,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  UserCheck,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/auth";

function RedeemContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCode = searchParams.get("code") || "";

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [result, setResult] = useState<{
    status: "idle" | "success" | "error";
    message?: string;
    details?: any;
  }>({ status: "idle" });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsAuth(false);
      return;
    }

    setIsAuth(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/me/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.email) setUserEmail(d.email);
      })
      .catch(() => {});

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/payments/my-subscription`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.plan) setUserPlan(d.plan);
      })
      .catch(() => {});
  }, []);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    const token = getToken();
    if (!token) {
      router.push(`/login?redirect=/redeem?code=${cleanCode}`);
      return;
    }

    setLoading(true);
    setResult({ status: "idle" });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/coupons/redeem`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: cleanCode }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Unable to redeem coupon code.");
      }

      setResult({
        status: "success",
        message: data.message || "Lifetime VIP Plan activated successfully! 🎉",
        details: data,
      });
      setUserPlan("lifetime");
    } catch (err: any) {
      setResult({
        status: "error",
        message: err.message || "Failed to redeem coupon.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loginRedirectUrl = `/login?redirect=/redeem${code ? `?code=${code.trim().toUpperCase()}` : ""}`;
  const signupRedirectUrl = `/signup?redirect=/redeem${code ? `?code=${code.trim().toUpperCase()}` : ""}`;

  return (
    <div className="landing-light min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col items-center justify-center p-4 sm:p-6 relative">
      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Header Badge */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold font-mono uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Early Adopter Reward
          </div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-zinc-900">
            Redeem Invite Code
          </h1>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Enter your unique invite coupon code below to unlock permanent, unrestricted Lifetime Access to all questions.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-[#dedee2] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Top accent gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-[#1f9e8e]" />

          {/* Already Lifetime Notice */}
          {userPlan === "lifetime" && result.status !== "success" && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">You already have Lifetime VIP Access!</p>
                <p className="text-zinc-600 text-[11px]">Your account has full permanent access to all problems.</p>
              </div>
            </div>
          )}

          {result.status === "success" ? (
            <div className="text-center py-3 space-y-5">
              <div className="w-16 h-16 bg-[#e6f7f5] border border-[#1f9e8e]/30 rounded-2xl flex items-center justify-center mx-auto text-[#1f9e8e] shadow-2xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold font-mono text-zinc-900 tracking-tight">Lifetime Access Unlocked! 🎉</h2>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                  Your coupon was successfully verified and redeemed. You now have full permanent access to all SQL, Python, PySpark, and DSA questions forever.
                </p>
              </div>

              <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Granted Plan:</span>
                  <span className="text-amber-800 font-bold font-mono">Lifetime VIP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Account:</span>
                  <span className="text-zinc-900 font-mono font-medium">{userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Expiry:</span>
                  <span className="text-[#1f9e8e] font-bold font-mono">Never (Permanent)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/practice/daily"
                  className="w-full bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs text-xs"
                >
                  Start Practicing Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/profile"
                  className="w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold py-2 px-4 rounded-xl transition-colors text-xs text-center"
                >
                  View Profile &amp; Membership
                </Link>
              </div>
            </div>
          ) : isAuth ? (
            <form onSubmit={handleRedeem} className="space-y-4">
              {userEmail && (
                <div className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <UserCheck className="w-3.5 h-3.5 text-[#1f9e8e]" /> Account:
                  </span>
                  <span className="text-zinc-900 font-mono font-medium truncate max-w-[180px]" title={userEmail}>
                    {userEmail}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center justify-between">
                  <span>Invite Coupon Code</span>
                  <span className="text-[10px] text-zinc-400 font-normal">DSQL-LT-XXXXXXXX</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="DSQL-LT-XXXXXXXX"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    disabled={loading}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-400 focus:outline-none focus:border-[#1f9e8e] transition-all uppercase pl-9"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {result.status === "error" && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div className="space-y-0.5">
                    <p className="font-semibold">{result.message}</p>
                    {result.message?.includes("different email") && (
                      <p className="text-[11px] text-zinc-500">
                        This coupon was issued for a different account. Please log in with the correct email.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full h-10 bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold rounded-xl transition-all shadow-2xs text-xs"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying Code...
                  </span>
                ) : (
                  "Unlock Lifetime Plan →"
                )}
              </Button>

              <p className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1 pt-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-[#1f9e8e]" /> Single-use & locked to registered email
              </p>
            </form>
          ) : (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-zinc-700 space-y-1">
                <p className="font-bold text-amber-900 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" /> Authentication Required
                </p>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Lifetime coupons are tied to specific early-adopter email accounts. Please sign in or create an account to claim your access.
                </p>
              </div>

              {code && (
                <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500 font-sans text-[11px]">Code:</span>
                  <span className="text-zinc-900 font-bold tracking-widest">{code.toUpperCase()}</span>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <Link
                  href={loginRedirectUrl}
                  className="w-full bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold rounded-xl h-10 flex items-center justify-center gap-1.5 transition-all shadow-2xs text-xs"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In with Registered Email
                </Link>

                <Link
                  href={signupRedirectUrl}
                  className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl h-9 flex items-center justify-center gap-1.5 transition-colors text-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-zinc-600" /> Create New Account
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors inline-flex items-center gap-1 font-medium"
          >
            ← View Pricing Plans &amp; Features
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RedeemPage() {
  return (
    <Suspense
      fallback={
        <div className="landing-light min-h-screen bg-[#fafafa] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1f9e8e]" />
        </div>
      }
    >
      <RedeemContent />
    </Suspense>
  );
}
