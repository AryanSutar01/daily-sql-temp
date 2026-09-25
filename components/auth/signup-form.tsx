"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveToken } from "@/lib/auth";
import { Mail, Lock, User, AlertCircle, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const handleGoogleSignup = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    if (step === "otp") {
        return (
            <div className="w-full space-y-6">
                <div className="space-y-1.5 text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-sans">
                        Verify your email
                    </h2>
                    <p className="text-zinc-500 text-xs sm:text-sm">
                        Enter the 4-digit code sent to <strong className="text-zinc-800">{formData.email}</strong>
                    </p>
                </div>

                {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 dark:text-rose-300" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <div className="flex justify-between gap-3 my-4">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => { inputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className="w-14 h-16 bg-white border border-[#dedee2] rounded-xl text-center text-2xl font-bold text-zinc-900 focus:border-[#1f9e8e] focus:ring-2 focus:ring-[#1f9e8e]/20 outline-none transition-all shadow-xs"
                        />
                    ))}
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => handleOtpSubmit()}
                        disabled={isLoading || otp.join("").length < 4}
                        className="w-full bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold h-12 rounded-xl shadow-xs transition-all text-sm"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Complete Verification"}
                    </Button>

                    <button
                        onClick={resendCode}
                        className="w-full text-center text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
                    >
                        Didn't receive code? <span className="text-[#1f9e8e] font-bold">Resend Code</span>
                    </button>
                    
                    <button
                        onClick={() => setStep("form")}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors pt-2"
                    >
                        <ArrowLeft size={14} /> Back to details
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="space-y-1.5 text-left">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-sans">
                    Create your account
                </h2>
                <p className="text-zinc-500 text-sm">
                    Start your 15-minute daily data practice
                </p>
            </div>

            {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 dark:text-rose-300" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Primary Google Signup Button */}
            <Button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full bg-white hover:bg-zinc-50 text-zinc-800 font-bold border border-[#dedee2] h-12 rounded-xl transition-all shadow-2xs hover:border-zinc-300 flex items-center justify-center gap-3 text-sm cursor-pointer"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
            </Button>

            <div className="text-center pt-2 border-t border-[#dedee2]">
                <p className="text-xs text-zinc-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#1f9e8e] hover:text-[#177a6d] font-bold transition-colors dark:hover:text-[#4DD4C4]">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
