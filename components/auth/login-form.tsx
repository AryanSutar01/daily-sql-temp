"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            router.push("/profile");
        }, 600);
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push("/profile");
        }, 600);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col items-center justify-center mb-8">
                <span className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    {/* Mock Logo Mark */}
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-[#4DD4C4] to-[#30B5A6] flex items-center justify-center shadow-lg shadow-[#4DD4C4]/20">
                        <svg className="w-5 h-5 text-[#0a0f1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                    </div>
                    DailySQL
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="identifier" className="text-zinc-400">Username or E-mail</Label>
                    <Input
                        id="identifier"
                        type="text"
                        required
                        value={formData.identifier}
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        className="bg-[#0b101c] border-[#202736] text-zinc-200 focus:border-[#4DD4C4]/50 h-11"
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
                        className="bg-[#0b101c] border-[#202736] text-zinc-200 focus:border-[#4DD4C4]/50 h-11"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-[#080c16] font-bold h-12 shadow-[0_0_20px_rgba(77,212,196,0.15)] transition-all mt-4"
                >
                    {isLoading ? "Logging in..." : "Log In"}
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
                onClick={handleGoogleLogin}
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

            <div className="mt-8 text-center text-sm text-zinc-400">
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#202736]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#131924] px-3 text-zinc-500">New User</span>
                    </div>
                </div>
                <Link href="/signup">
                    <Button variant="secondary" className="w-full bg-[#60a5fa]/10 hover:bg-[#60a5fa]/20 text-[#60a5fa] border border-[#60a5fa]/20 h-12 font-semibold">
                        Sign Up
                    </Button>
                </Link>
            </div>
        </div>
    );
}
