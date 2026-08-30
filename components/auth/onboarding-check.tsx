"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";

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
