"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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
      <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-base mx-auto"></div>
          <p className="text-muted-foreground">Completing your registration...</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-destructive">Something went wrong</h1>
            <p className="text-muted-foreground">{errorMessage}</p>
          </div>
          <Button asChild>
            <Link href="/waitlist">Try again</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="text-6xl mb-4 text-brand-base">✓</div>
          <h1 className="text-4xl font-bold text-brand-base">You're on the list!</h1>
          <p className="text-muted-foreground text-lg">
            Thanks for joining the waitlist. We'll notify you as soon as Daily SQL is ready.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}

export default function WaitlistCallback() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-base mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      }
    >
      <WaitlistCallbackContent />
    </Suspense>
  );
}

