"use client";

import { useState, useEffect } from "react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { WaitlistFormData } from "@/types/waitlist";
import { CheckCircle2, ArrowRight, Loader2, Sparkles, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function OnboardingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const profile = await api.getProfile();
        if (profile?.onboarding_completed) {
          router.push("/practice/daily");
        }
      } catch (err) {
        // Not logged in or error
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }
    checkOnboarding();
  }, [router]);

  const handleFormSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.updateProfile({
        full_name: data.full_name,
        whatsapp_number: data.whatsapp_number,
        occupation: data.occupation,
        job_role: data.job_role,
        experience_years: data.years_of_experience,
        source: (data as any).source
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/practice/daily");
      }, 1500);
    } catch (err: any) {
      console.error("Onboarding error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1f9e8e]" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <main className="landing-light min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-24 font-sans">
        <div className="max-w-md w-full bg-white border border-[#dedee2] p-10 rounded-3xl text-center space-y-6 shadow-sm animate-in zoom-in-95 duration-500">
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <img
              src="/mascot-complete-bg-removed.png"
              alt="DailySQL Mascot"
              className="w-20 h-20 object-contain animate-bounce"
            />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={14} /> Profile Complete
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">You're all set!</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Welcome to the community. Redirecting you to today's practice arena...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="landing-light min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden font-sans text-zinc-900 antialiased selection:bg-[#1f9e8e]/20 selection:text-[#1f9e8e]">
      
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-dot-light opacity-50 pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(31,158,142,0.2) 0%, transparent 70%)" }}
      />

      <div className="max-w-xl w-full space-y-8 relative z-10">
        
        {/* Brand Logo & Progress Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 group mb-2">
            <img
              src="/dailysql-logo-bg-removed.png"
              alt="DailySQL Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <img
              src="/dailysql-wordmark-bg-removed.png"
              alt="DailySQL"
              className="h-7 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/30 shadow-2xs">
              <Sparkles className="w-3 h-3" />
              Quick Setup · 1 Minute
            </div>
          </div>

          <h1
            style={{
              fontFamily: "'Overused Grotesk', system-ui, sans-serif",
              fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
            className="text-zinc-900"
          >
            Personalize your practice profile
          </h1>
          <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
            Tell us about your background so we can calibrate your practice benchmarks.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="p-8 sm:p-10 rounded-3xl border border-[#dedee2] bg-white shadow-sm">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-in fade-in duration-300">
              {error}
            </div>
          )}
          <WaitlistForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-zinc-400">
          Your information is private and used only for community leaderboard and problem calibration.
        </p>

      </div>
    </main>
  );
}
