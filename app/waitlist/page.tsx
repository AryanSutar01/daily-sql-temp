"use client";

import { useState } from "react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { WaitlistFormData } from "@/types/waitlist";
import { createClient } from "@/lib/supabase/client";

export default function WaitlistPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const supabase = createClient();

  const handleFormSubmit = async (data: WaitlistFormData) => {
    setIsRedirecting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/waitlist/callback?occupation=${encodeURIComponent(data.occupation)}&job_role=${encodeURIComponent(data.job_role)}&years_of_experience=${data.years_of_experience}`,
        },
      });

      if (error) {
        console.error("Error signing in:", error);
        alert("Failed to sign in with Google. Please try again.");
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
      setIsRedirecting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Join the waitlist
          </h1>
          <p className="text-muted-foreground text-lg">
            Customize your Daily SQL experience.
          </p>
        </div>

        <div className="p-8 rounded-lg border border-border bg-card">
          <WaitlistForm onSubmit={handleFormSubmit} isLoading={isRedirecting} />
        </div>
      </div>
    </main>
  );
}

