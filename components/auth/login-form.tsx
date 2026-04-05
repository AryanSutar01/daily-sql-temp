"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { saveToken } from "@/lib/auth";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

import { Mail, Lock, AlertCircle, X, CheckCircle2 } from "lucide-react";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
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

            const profile = await api.getProfile().catch(() => ({ onboarding_completed: false }));
            router.push(profile.onboarding_completed ? "/practice/daily" : "/profile");
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
        <div className="w-full space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">Sign in to your account</h2>
                <p className="text-zinc-400 text-sm">Enter your credentials to access the engine</p>
            </div>

            {error && (
                <div className="animate-in fade-in zoom-in-95 duration-300 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                        <div className="flex-1">
                            <p className="text-red-400 text-sm font-medium leading-relaxed">{error}</p>
                            {(error.toLowerCase().includes("authorized") || error.toLowerCase().includes("whitelist")) && (
                                <div className="mt-3">
                                    <Link href="/waitlist" className="block w-full">
                                        <Button type="button" className="w-full bg-[#4DD4C4]/10 hover:bg-[#4DD4C4]/20 text-[#4DD4C4] border border-[#4DD4C4]/30 font-bold h-10 rounded-xl transition-all text-sm">
                                            Join the Waitlist
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.1em] font-bold text-zinc-500 ml-1">
                        Email Address
                    </Label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#4DD4C4] transition-colors" size={18} />
                        <Input
                            id="email"
                            type="email"
                            required
                            placeholder="master@sql-engine.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-[#0b101c]/50 border-white/5 text-zinc-200 focus:border-[#4DD4C4]/50 h-14 pl-12 rounded-xl transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">PASSWORD</Label>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#4DD4C4] transition-colors" size={18} />
                        <Input
                            id="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-[#0b101c]/50 border-white/5 text-zinc-200 focus:border-[#4DD4C4]/50 h-14 pl-12 rounded-xl transition-all"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-[#080c16] font-extrabold h-14 rounded-xl shadow-[0_0_30px_rgba(77,212,196,0.1)] transition-all transform active:scale-[0.98] mt-2 text-base"
                >
                    {isLoading ? "Validating..." : "Log In"}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="bg-[#0a0f1c] px-4 text-zinc-500">or continue with</span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white h-14 rounded-xl font-bold transition-all"
            >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
            </Button>

            <div className="text-center pt-4">
                <p className="text-sm font-medium text-zinc-500">
                    New to DailySQL? <Link href="/signup" className="text-[#4DD4C4] hover:text-[#3dbdb0] font-bold transition-colors">Sign Up</Link>
                </p>
            </div>

            {/* ══ Auth Toast ══ */}
            {toast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-[#0d121c] border-2 border-red-500/50 rounded-2xl p-4 shadow-[0_0_40px_rgba(239,68,68,0.2)] flex flex-col gap-3 min-w-[380px] backdrop-blur-md">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                                <Lock className="text-red-500 animate-pulse" size={24} />
                            </div>
                            <div className="flex-1 pt-1">
                                <h3 className="text-white font-bold text-sm text-left">Access Restricted</h3>
                                <p className="text-red-400 text-xs mt-1 text-left leading-relaxed">{toast.message}</p>
                            </div>
                            <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white transition-colors pt-1">
                                <X size={16} />
                            </button>
                        </div>
                        {toast.type === 'error' && toast.message.toLowerCase().includes("waitlist") && (
                            <div className="pt-2 border-t border-red-500/20 mt-1">
                                <Link href="/waitlist" className="block w-full">
                                    <Button type="button" className="w-full bg-[#4DD4C4]/10 hover:bg-[#4DD4C4]/20 text-[#4DD4C4] border border-[#4DD4C4]/30 font-bold h-10 rounded-xl transition-all text-sm">
                                        Join the Waitlist
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


