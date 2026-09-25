"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { takePendingPlan } from "@/lib/pending-plan";

export function OnboardingCheck() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // List of paths that don't require onboarding completion
    const publicPaths = ["/", "/login", "/signup", "/onboarding", "/privacy", "/terms", "/faq", "/contact", "/team"];
    const isPublicPath = publicPaths.includes(pathname);

    if (isLoggedIn() && !isPublicPath) {
      async function checkOnboarding() {
        try {
          const profile = await api.getProfile();
          if (profile && profile.onboarding_completed === false) {
            router.push("/onboarding");
            return;
          }
          // Signed in and onboarded: resume a checkout the visitor started on /pricing before signing up
          if (!pathname.startsWith("/payment")) {
            const plan = takePendingPlan();
            if (plan) router.replace(`/payment?plan=${plan}`);
          }
        } catch (err: any) {
          if (!err?.message?.includes("token") && !err?.message?.includes("401")) {
            console.error("Failed to check onboarding status:", err);
          }
        }
      }
      checkOnboarding();
    }
  }, [pathname, router]);

  return null;
}
