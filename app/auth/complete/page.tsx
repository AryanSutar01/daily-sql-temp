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
                const profile = await api.getProfile().catch(() => ({ exists: false }));
                router.replace(profile.exists ? "/practice/daily" : "/profile");
            } catch {
                router.replace("/practice/daily");
            }
        }
        redirect();
    }, [router]);

    return (
        <div className="fixed inset-0 bg-[#080c16] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-[#4DD4C4] border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-400 text-sm">Signing you in…</p>
            </div>
        </div>
    );
}
