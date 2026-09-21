"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { saveToken } from "@/lib/auth";
import { api } from "@/lib/api";
import { Mail, Lock, AlertCircle, X, ArrowRight, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [showLegacy, setShowLegacy] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'not_authorized') {
            setToast({
                type: 'error',
                message: "Email not whitelisted. Please join our waitlist for early access!"
            });
            window.history.replaceState({}, '', window.location.pathname);
        } else if (errorParam === 'auth_failed') {
            setToast({
                type: 'error',
                message: "Authentication failed. Please try again."
            });
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.detail || "Invalid credentials");
            }

            const { access_token } = await res.json();
            saveToken(access_token);

            const redirectUrl = searchParams.get("redirect");
            if (redirectUrl && redirectUrl.startsWith("/")) {
                router.push(redirectUrl);
            } else {
                const profile = await api.getProfile().catch(() => ({ onboarding_completed: false }));
                router.push(profile.onboarding_completed ? "/practice/daily" : "/profile");
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }

    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <div className="w-full space-y-6">
            
            {/* Header */}
            <div className="space-y-1.5 text-left">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-sans">
                    Welcome back
                </h2>
                <p className="text-zinc-500 text-sm">
                    Sign in to continue your daily data practice
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-medium">{error}</p>
                        {(error.toLowerCase().includes("authorized") || error.toLowerCase().includes("whitelist")) && (
                            <Link href="/waitlist" className="inline-block mt-2 font-bold text-rose-900 underline">
                                Join the Waitlist →
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Primary Google Login Button */}
            <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white hover:bg-zinc-50 text-zinc-800 font-bold border border-[#dedee2] h-12 rounded-xl transition-all shadow-2xs hover:border-zinc-300 flex items-center justify-center gap-3 text-sm cursor-pointer"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </Button>

            {/* Legacy Email Section */}
            {!showLegacy ? (
                <div className="text-center pt-1">
                    <button 
                        type="button" 
                        onClick={() => setShowLegacy(true)} 
                        className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
                    >
                        Sign in with Email & Password
                    </button>
                </div>
            ) : (
                <div className="space-y-4 pt-2">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[#dedee2]" />
                        </div>
                        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.16em]">
                            <span className="bg-white px-3 text-zinc-400 font-mono">or email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold text-zinc-700">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-white border-[#dedee2] text-zinc-900 focus:border-[#1f9e8e] focus:ring-[#1f9e8e]/20 h-11 pl-10 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-bold text-zinc-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-white border-[#dedee2] text-zinc-900 focus:border-[#1f9e8e] focus:ring-[#1f9e8e]/20 h-11 pl-10 rounded-xl"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold h-11 rounded-xl shadow-xs transition-all text-sm mt-1"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </div>
            )}

            {/* Bottom link to Sign up */}
            <div className="text-center pt-2 border-t border-[#dedee2]">
                <p className="text-xs text-zinc-500">
                    New to DailySQL?{" "}
                    <Link href="/signup" className="text-[#1f9e8e] hover:text-[#177a6d] font-bold transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
                    <div className="bg-white border border-[#dedee2] rounded-2xl p-4 shadow-lg flex items-start gap-3 max-w-sm">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-zinc-900">Notice</h4>
                            <p className="text-xs text-zinc-600 mt-0.5">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="text-zinc-400 hover:text-zinc-600">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
