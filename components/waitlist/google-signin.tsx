"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface GoogleSignInProps {
  formData: {
    occupation: string;
    job_role: string;
    years_of_experience: number;
  };
}

export function GoogleSignIn({ formData }: GoogleSignInProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/waitlist/callback?occupation=${encodeURIComponent(formData.occupation)}&job_role=${encodeURIComponent(formData.job_role)}&years_of_experience=${formData.years_of_experience}`,
        },
      });

      if (error) {
        console.error("Error signing in:", error);
        alert("Failed to sign in with Google. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      size="lg"
      className="w-full bg-brand-base hover:bg-brand-dark text-white font-semibold shadow-lg shadow-brand-base/20 hover:shadow-brand-base/30 transition-all duration-200"
    >
      Sign in with Google
    </Button>
  );
}

