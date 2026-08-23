"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveToken } from "@/lib/auth";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

import { Mail, Lock, User, AlertCircle, X, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [step, setStep] = useState<"form" | "otp">("form");
    const [stateId, setStateId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.detail || "Signup failed");
            }

            const data = await res.json();
            setStateId(data.state_id);
            setStep("otp");
        } catch (err: any) {
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const code = otp.join("");
        if (code.length < 4) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/auth/register/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    state_id: stateId,
                    otp: code
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.detail || "Invalid code");
            }

            const { access_token } = await res.json();
            saveToken(access_token);

            const redirectUrl = searchParams.get("redirect");
            if (redirectUrl && redirectUrl.startsWith("/")) {
                router.push(redirectUrl);
            } else {
                router.push("/profile");
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }

    };

    const resendCode = async () => {
        setError(null);
        try {
            const res = await fetch(`${API_URL}/auth/otp/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();
            setStateId(data.state_id);
            setOtp(["", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError("Failed to resend code");
        }
    };

    useEffect(() => {
        if (step === "otp" && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [step]);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'not_authorized') {
            setToast({
                type: 'error',
                message: "Email not whitelisted. Please join our waitlist for early access!"
            });
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [searchParams]);

    const handleGoogleSignup = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    if (step === "otp") {
        return (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Verify your mail</h2>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        We've sent a 4-digit verification code to <br />
                        <span className="text-[#4DD4C4] font-semibold">{formData.email}</span>
                    </p>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col gap-3">
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

                <div className="flex justify-between gap-3">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => { inputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className="w-14 h-16 bg-[#0b101c]/50 border-white/5 rounded-xl text-center text-2xl font-bold text-white focus:border-[#4DD4C4]/50 focus:ring-1 focus:ring-[#4DD4C4]/20 outline-none transition-all shadow-lg"
                        />
                    ))}
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={() => handleOtpSubmit()}
                        disabled={isLoading || otp.join("").length < 4}
                        className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-[#080c16] font-extrabold h-14 rounded-xl shadow-[0_0_30px_rgba(77,212,196,0.1)] transition-all transform active:scale-[0.98] text-base"
                    >
                        {isLoading ? "Verifying..." : "Create Account"}
                    </Button>

                    <button
                        onClick={resendCode}
                        className="w-full text-center text-xs font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors"
                    >
                        Didn't receive code? <span className="text-[#4DD4C4]">Resend</span>
                    </button>
                    
                    <button
                        onClick={() => setStep("form")}
                        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors pt-4"
                    >
                        <ArrowLeft size={16} /> Back to details
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">Create your account</h2>
                <p className="text-zinc-400 text-sm">Join the elite query masters today</p>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col gap-3">
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

            {false && (
                <>
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase ml-1">
                                EMAIL ADDRESS
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
                            <Label htmlFor="password" className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase ml-1">
                                CHOOSE PASSWORD
                            </Label>
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

                        <div className="space-y-3">
                            <Label htmlFor="confirmPassword" className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase ml-1">
                                CONFIRM PASSWORD
                            </Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#4DD4C4] transition-colors" size={18} />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="bg-[#0b101c]/50 border-white/5 text-zinc-200 focus:border-[#4DD4C4]/50 h-14 pl-12 rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-[#080c16] font-extrabold h-14 rounded-xl shadow-[0_0_30px_rgba(77,212,196,0.1)] transition-all transform active:scale-[0.98] mt-2 text-base"
                        >
                            {isLoading ? "Preparing..." : "Sign Up"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/5" />
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="bg-[#0b101c] px-4 text-zinc-500">or continue with</span>
                        </div>
                    </div>
                </>
            )}

            <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignup}
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
                    Already have an account? <Link href="/login" className="text-[#4DD4C4] hover:text-[#3dbdb0] font-bold transition-colors">Log In</Link>
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
