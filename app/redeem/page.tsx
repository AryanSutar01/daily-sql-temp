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

    // Fetch user profile and subscription
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
    <div className="min-h-screen bg-[#080c16] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[350px] h-[350px] bg-[#4DD4C4]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Early Adopter Reward
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Redeem Coupon Code
          </h1>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Enter your unique invite code below to unlock permanent, unrestricted Lifetime Access to all questions.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#131924]/90 backdrop-blur-xl border border-[#202736]/90 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Top accent gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-[#4DD4C4]" />

          {/* Already Lifetime Notice */}
          {userPlan === "lifetime" && result.status !== "success" && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
              <Sparkles className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <p className="font-bold">You already have Lifetime VIP Access!</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">Your account has full permanent access to all problems.</p>
              </div>
            </div>
          )}

          {result.status === "success" ? (
            <div className="text-center py-4 space-y-5">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-[pulse_2s_ease-in-out_infinite] shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight">Lifetime Access Unlocked! 🎉</h2>
                <p className="text-xs text-zinc-300 leading-relaxed max-w-xs mx-auto">
                  Your coupon was successfully verified and redeemed. You now have full permanent access to all SQL, Python, PySpark, and DSA questions forever.
                </p>
              </div>

              <div className="p-3.5 bg-black/40 rounded-2xl border border-white/5 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Granted Plan:</span>
                  <span className="text-amber-400 font-bold">Lifetime VIP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Account:</span>
                  <span className="text-zinc-200 font-mono">{userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Expiry:</span>
                  <span className="text-emerald-400 font-semibold">Never (Permanent)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  href="/practice/daily"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 text-sm"
                >
                  Start Practicing Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/profile"
                  className="w-full bg-[#0b101c] hover:bg-[#202736] border border-[#202736] text-zinc-300 font-semibold py-2.5 px-4 rounded-xl transition-colors text-xs text-center"
                >
                  View Profile &amp; Membership
                </Link>
              </div>
            </div>
          ) : isAuth ? (
            <form onSubmit={handleRedeem} className="space-y-4">
              {/* Logged in email badge */}
              {userEmail && (
                <div className="text-xs text-zinc-400 bg-[#0b101c] p-3 rounded-2xl border border-[#202736] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <UserCheck className="w-3.5 h-3.5 text-[#4DD4C4]" /> Authenticated as:
                  </span>
                  <span className="text-white font-mono font-medium truncate max-w-[170px]" title={userEmail}>
                    {userEmail}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
                  <span>Invite Coupon Code</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Format: DSQL-LT-XXXXXXXX</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="DSQL-LT-XXXXXXXX"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    disabled={loading}
                    className="w-full bg-[#0b101c] border border-[#202736] rounded-2xl px-4 py-3.5 text-sm text-white font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60 transition-all uppercase pl-10"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {result.status === "error" && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{result.message}</p>
                    {result.message?.includes("different email") && (
                      <p className="text-[11px] text-zinc-400">
                        This coupon was issued for a different account. Please log in with the correct email address.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold rounded-2xl transition-all shadow-lg shadow-amber-500/20 text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Code...
                  </span>
                ) : (
                  "Unlock Lifetime Plan →"
                )}
              </Button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Each coupon is single-use and locked to your registered email address.
                </p>
              </div>
            </form>
          ) : (
            /* Unauthenticated State: Show friendly sign-in prompt while preserving the coupon code */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-300 space-y-2">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" /> Authentication Required
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  Each lifetime coupon is tied to a specific early-adopter email address. Please sign in or create an account with your registered email to claim this code.
                </p>
              </div>

              {code && (
                <div className="p-3 bg-[#0b101c] rounded-2xl border border-[#202736] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500 font-sans text-[11px]">Coupon Code:</span>
                  <span className="text-amber-400 font-bold tracking-widest">{code.toUpperCase()}</span>
                </div>
              )}

              <div className="space-y-2.5 pt-2">
                <Link
                  href={loginRedirectUrl}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold rounded-2xl h-12 flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 text-sm"
                >
                  <LogIn className="w-4 h-4" /> Sign In with Registered Email
                </Link>

                <Link
                  href={signupRedirectUrl}
                  className="w-full bg-[#0b101c] hover:bg-[#202736] border border-[#202736] text-zinc-200 font-bold rounded-2xl h-11 flex items-center justify-center gap-2 transition-colors text-xs"
                >
                  <UserPlus className="w-4 h-4 text-[#4DD4C4]" /> Create New Account
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/payment"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
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
        <div className="min-h-screen bg-[#080c16] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      }
    >
      <RedeemContent />
    </Suspense>
  );
}
