"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

/**
 * Intermediate page after Google OAuth completes.
 * The cookie is already set by /auth/callback/route.ts.
 * This page checks profile state and redirects to the right place.
 */
export default function AuthCompletePage() {
    const router = useRouter();

    useEffect(() => {
        async function redirect() {
            try {
                const profile = await api.getProfile().catch(() => ({ onboarding_completed: false }));
                router.replace(profile.onboarding_completed ? "/practice/daily" : "/profile");
            } catch {
                router.replace("/profile");
            }
        }
        redirect();
    }, [router]);

    return (
        <div className="landing-light fixed inset-0 bg-[#fafafa] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#1f9e8e] border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-600 font-mono text-xs">Signing you in…</p>
            </div>
        </div>
    );
}
