"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function WaitlistCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      // Get the auth code from URL
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setStatus("error");
        setErrorMessage("Failed to authenticate. Please try again.");
        return;
      }

      // Get form data from URL params
      const occupation = searchParams.get("occupation");
      const job_role = searchParams.get("job_role");
      const years_of_experience = searchParams.get("years_of_experience");

      if (!occupation || !job_role || !years_of_experience) {
        setStatus("error");
        setErrorMessage("Missing form data. Please start over.");
        return;
      }

      // Save to waitlist
      try {
        const response = await fetch("/api/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            occupation,
            job_role,
            years_of_experience: parseInt(years_of_experience),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to save waitlist entry");
        }

        setStatus("success");
      } catch (error) {
        console.error("Error saving waitlist:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to save your information. Please try again."
        );
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (status === "loading") {
    return (
      <main className="landing-light min-h-screen flex items-center justify-center px-4 bg-[#fafafa]">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin text-[#1f9e8e] w-8 h-8 mx-auto" />
          <p className="text-zinc-600 font-mono text-xs">Completing your registration...</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="landing-light min-h-screen flex items-center justify-center px-4 bg-[#fafafa]">
        <div className="max-w-md w-full bg-white border border-[#dedee2] rounded-2xl p-8 text-center space-y-6 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
            <AlertCircle size={24} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold font-mono text-zinc-900">Something went wrong</h1>
            <p className="text-xs text-zinc-600">{errorMessage}</p>
          </div>
          <Link
            href="/onboarding"
            className="inline-block px-5 py-2.5 bg-[#1f9e8e] hover:bg-[#177a6d] text-white rounded-xl text-xs font-mono font-bold transition-all shadow-2xs"
          >
            Try Again
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="landing-light min-h-screen flex items-center justify-center px-4 bg-[#fafafa]">
      <div className="max-w-md w-full bg-white border border-[#dedee2] rounded-2xl p-8 text-center space-y-6 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-[#e6f7f5] border border-[#1f9e8e]/30 flex items-center justify-center mx-auto text-[#1f9e8e]">
          <CheckCircle2 size={28} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-mono text-zinc-900">You&apos;re all set!</h1>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Thank you for completing your onboarding. You are ready to start solving daily data challenges.
          </p>
        </div>
        <Link
          href="/practice/daily"
          className="inline-block px-6 py-2.5 bg-[#1f9e8e] hover:bg-[#177a6d] text-white rounded-xl text-xs font-mono font-bold transition-all shadow-2xs"
        >
          Go to Daily Practice
        </Link>
      </div>
    </main>
  );
}

export default function WaitlistCallback() {
  return (
    <Suspense
      fallback={
        <main className="landing-light min-h-screen flex items-center justify-center px-4 bg-[#fafafa]">
          <div className="text-center space-y-3">
            <Loader2 className="animate-spin text-[#1f9e8e] w-8 h-8 mx-auto" />
            <p className="text-zinc-600 font-mono text-xs">Loading...</p>
          </div>
        </main>
      }
    >
      <WaitlistCallbackContent />
    </Suspense>
  );
}
