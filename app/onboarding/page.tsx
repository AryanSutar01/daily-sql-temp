"use client";

import { useState, useEffect } from "react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { WaitlistFormData } from "@/types/waitlist";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

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
        router.push("/profile?setup=true");
      }, 2000);
    } catch (err: any) {
      console.error("Onboarding error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080c16] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4DD4C4]" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#080c16] flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full bg-[#121826] border border-[#4DD4C4]/20 p-10 rounded-2xl text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-[#4DD4C4]/10 rounded-full flex items-center justify-center mx-auto border border-[#4DD4C4]/20">
            <CheckCircle2 className="text-[#4DD4C4]" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white italic tracking-tight">You're all set!</h2>
            <p className="text-zinc-400 leading-relaxed">
              Welcome to the community. Redirecting you to the practice arena...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080c16] flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4DD4C4]/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4DD4C4]/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-xl w-full space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 text-[#4DD4C4] text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4DD4C4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4DD4C4]"></span>
            </span>
            Step into the arena
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
            Finish your <span className="text-[#4DD4C4]">onboarding.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
            Join the community and start your daily SQL ritual.
          </p>

          {/* Progress Stepper */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#4DD4C4] text-[#080c16] flex items-center justify-center font-black text-xs shadow-[0_0_15px_rgba(77,212,196,0.3)]">1</div>
              <span className="text-[10px] font-bold text-[#4DD4C4] uppercase tracking-widest">Basics</span>
            </div>
            <div className="w-12 h-px bg-[#202736]"></div>
            <div className="flex flex-col items-center gap-2 opacity-30">
              <div className="w-8 h-8 rounded-full bg-[#121826] border border-[#202736] text-zinc-500 flex items-center justify-center font-black text-xs">2</div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Profile</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl border border-white/5 bg-[#121826]/50 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in duration-300">
              {error}
            </div>
          )}
          <WaitlistForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />
        </div>
      </div>
    </main>
  );
}

