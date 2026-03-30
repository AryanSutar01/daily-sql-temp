"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveToken } from "@/lib/auth";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { Lock, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

    // OTP state
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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

        if (value && index < 5) {
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
        if (code.length < 6) return;

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

            // New users always go to profile completion first
            router.push("/profile");
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
            setOtp(["", "", "", "", "", ""]);
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
            <div className="w-full">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Verify your Email</h2>
                    <p className="text-zinc-400 text-sm">
                        Enter the 6-digit code sent to <br />
                        <span className="text-white font-medium">{formData.email}</span>
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="flex justify-between gap-2 mb-8">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => { inputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className="w-12 h-14 bg-[#0b101c] border-2 border-[#202736] rounded-xl text-center text-xl font-bold text-white focus:border-[#4DD4C4] focus:ring-1 focus:ring-[#4DD4C4] outline-none transition-all"
                        />
                    ))}
                </div>

                <Button
                    onClick={() => handleOtpSubmit()}
                    disabled={isLoading || otp.join("").length < 6}
                    className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-[#080c16] font-bold h-12 shadow-[0_0_20px_rgba(77,212,196,0.15)] transition-all mb-4"
                >
                    {isLoading ? "Verifying..." : "Create Account"}
                </Button>

                <button
                    onClick={resendCode}
                    className="w-full text-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    Didn't receive code? Resend
                </button>

                <button
                    onClick={() => setStep("form")}
                    className="w-full text-center text-sm text-[#4DD4C4] hover:underline mt-6"
                >
                    ← Back to signup details
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col items-center justify-center mb-8">
                <span className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-[#4DD4C4] to-[#30B5A6] flex items-center justify-center shadow-lg shadow-[#4DD4C4]/20">
                        <svg className="w-5 h-5 text-[#0a0f1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                    </div>
                    DailySQL
                </span>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-400">E-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-[#0b101c] border-[#202736] text-zinc-200 focus:border-[#4DD4C4]/50 h-10"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-zinc-400">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-[#0b101c] border-[#202736] text-zinc-200 focus:border-[#4DD4C4]/50 h-10"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-zinc-400">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="bg-[#0b101c] border-[#202736] text-zinc-200 focus:border-[#4DD4C4]/50 h-10"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#4DD4C4] hover:bg-[#30B5A6] text-[#080c16] font-bold h-12 shadow-[0_0_20px_rgba(77,212,196,0.15)] transition-all mt-6"
                >
                    {isLoading ? "Sending verification..." : "Sign Up"}
                </Button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#202736]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#131924] px-3 text-zinc-500">or</span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full bg-[#0b101c] border-[#202736] text-zinc-300 hover:bg-[#1c2433] hover:text-white h-12"
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </Button>

            {/* ══ Auth Toast ══ */}
            {toast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-[#0d121c] border-2 border-red-500/50 rounded-2xl p-4 shadow-[0_0_40px_rgba(239,68,68,0.2)] flex items-center gap-4 min-w-[320px] backdrop-blur-md">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                            <Lock className="text-red-500 animate-pulse" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-sm">Access Restricted</h3>
                            <p className="text-red-400 text-xs mt-0.5">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
