"use client";

import { useState } from "react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { GoogleSignIn } from "@/components/waitlist/google-signin";
import { WaitlistFormData } from "@/types/waitlist";

export default function WaitlistPage() {
  const [formData, setFormData] = useState<WaitlistFormData | null>(null);
  const [step, setStep] = useState<"form" | "signin">("form");

  const handleFormSubmit = (data: WaitlistFormData) => {
    setFormData(data);
    setStep("signin");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Join the waitlist
          </h1>
          <p className="text-muted-foreground text-lg">
            {step === "form"
              ? "Customize your Daily SQL experience."
              : "Sign in with Google to complete your registration"}
          </p>
        </div>

        <div className="p-8 rounded-lg border border-border bg-card">
          {step === "form" ? (
            <WaitlistForm onSubmit={handleFormSubmit} />
          ) : formData ? (
            <GoogleSignIn formData={formData} />
          ) : null}
        </div>
      </div>
    </main>
  );
}

