"use client";

import { useState } from "react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { WaitlistFormData } from "@/types/waitlist";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function WaitlistPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/waitlist/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           email: data.email,
           full_name: data.full_name,
           whatsapp_number: data.whatsapp_number,
           occupation: data.occupation,
           job_role: data.job_role,
           experience_years: data.years_of_experience,
           source: (data as any).source
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Failed to join waitlist");
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Waitlist error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#080c16] flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full bg-[#121826] border border-[#4DD4C4]/20 p-10 rounded-2xl text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-[#4DD4C4]/10 rounded-full flex items-center justify-center mx-auto border border-[#4DD4C4]/20">
            <CheckCircle2 className="text-[#4DD4C4]" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white italic tracking-tight">You're on the list!</h2>
            <p className="text-zinc-400 leading-relaxed">
              We've reserved your spot. We'll reach out on <span className="text-[#4DD4C4] font-semibold">WhatsApp</span> as soon as we're ready for your cohort!
            </p>
          </div>
          <Link href="/" className="block">
            <Button className="w-full bg-[#4DD4C4]/10 hover:bg-[#4DD4C4]/20 text-[#4DD4C4] border border-[#4DD4C4]/30 font-bold h-12 rounded-xl transition-all">
              Return to Home
            </Button>
          </Link>
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
            Limited Access
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter leading-tight">
            JOIN THE <br /> <span className="text-[#4DD4C4] drop-shadow-[0_0_15px_rgba(77,212,196,0.2)]">WAITLIST</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-sm mx-auto font-medium">
            Customize your experience and get early access to the elite SQL practice arena.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-white/5 bg-[#121826]/50 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in duration-300">
              {error}
            </div>
          )}
          <WaitlistForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />
        </div>

        <div className="text-center pt-4">
          <Link href="/login" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 group">
            Already have access? <span className="text-[#4DD4C4] font-bold">Log in here</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}

