"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Flame, User, LogOut, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export function StandaloneNavbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [streak, setStreak] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                // If profile is fetched successfully, user is logged in
                const profile = await api.getProfile();
                const s = await api.getStreak().catch(() => ({ current_streak: 0 }));
                setUser({ profile, email: profile?.email || 'User' });
                setStreak(s.current_streak);
            } catch (err) {
                // Not logged in or error
                console.error("Auth check failed or not logged in");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Clear token cookie
        document.cookie = "ds_token=; path=/; max-age=0; SameSite=Lax;";
        router.push("/login");
        router.refresh();
    };

    const isAuthPage = pathname === "/login" || pathname === "/signup";

    return (
        <nav className="sticky top-0 relative w-full h-16 border-b border-[#dedee2] bg-[#f7f7f8]/95 backdrop-blur z-[100] px-6 sm:px-12 lg:px-20 flex items-center justify-between shrink-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
                <img
                    src="/dailysql-logo-bg-removed.png"
                    alt="DailySQL Logo"
                    className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                />
                <img
                    src="/dailysql-wordmark-bg-removed.png"
                    alt="DailySQL"
                    className="h-7 w-auto object-contain block transition-opacity group-hover:opacity-90"
                />
            </Link>

            {/* Nav Items - Center (Hidden on Profile) */}
            {!pathname.startsWith('/profile') && (
                <div className="hidden md:flex items-center justify-center flex-1 space-x-12">
                    <Link href="/practice/daily" className={`text-sm font-semibold transition-colors ${pathname === '/practice/daily' ? 'text-[#1f9e8e]' : 'text-zinc-600 hover:text-zinc-900'}`}>Practice</Link>
                </div>
            )}

            {/* Right side CTA or User Menu */}
            <div className={`hidden md:flex items-center gap-4 relative ${!pathname.startsWith('/profile') ? '' : 'flex-1 justify-end gap-8'}`}>
                {pathname.startsWith('/profile') && (
                    <Link href="/practice/daily" className={`text-sm font-semibold transition-colors ${pathname === '/practice/daily' ? 'text-[#1f9e8e]' : 'text-zinc-600 hover:text-zinc-900'}`}>Practice</Link>
                )}
                <div className="flex items-center gap-4 relative">
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin text-zinc-500" />
                ) : user ? (
                    <>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f9e8e]/10 border border-[#1f9e8e]/20 rounded-lg">
                            <span className="text-sm font-bold text-[#1f9e8e]">{streak}</span>
                            <Flame size={14} className="text-[#f97316] fill-[#f97316]" />
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-9 h-9 rounded-full bg-zinc-100 border-2 border-[#dedee2] hover:border-[#1f9e8e] transition-colors flex items-center justify-center overflow-hidden focus:outline-none"
                            >
                                {user.profile?.avatar_url ? (
                                    <img src={user.profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-6 h-6 text-[#1f9e8e] mt-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                )}
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-white border border-[#dedee2] rounded-xl shadow-2xl overflow-hidden py-1 z-[200]">
                                    <div className="px-4 py-3 border-b border-[#dedee2] bg-zinc-50">
                                        <p className="text-xs font-semibold text-zinc-900 truncate">{user.profile?.full_name || user.email?.split('@')[0]}</p>
                                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                                    </div>
                                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                                        <div className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer font-medium">
                                            <User size={14} className="text-zinc-500" /> My Profile
                                        </div>
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="w-full text-left">
                                        <div className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer font-medium">
                                            <LogOut size={14} /> Log Out
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="text-sm text-white bg-[#1f9e8e] hover:bg-[#177a6d] px-4 py-1.5 rounded font-bold transition-colors shadow-2xs"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
                </div>
            </div>
        </nav>
    );
}
