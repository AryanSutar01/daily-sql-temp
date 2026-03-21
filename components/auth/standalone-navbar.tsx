"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Flame, User, Settings, LogOut, ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export function StandaloneNavbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [streak, setStreak] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

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

    const handleLogout = () => {
        // Clear token cookie
        document.cookie = "ds_token=; path=/; max-age=0; SameSite=Lax;";
        router.push("/login");
        router.refresh();
    };

    const isAuthPage = pathname === "/login" || pathname === "/signup";

    return (
        <nav className="w-full h-16 border-b border-white/5 bg-[#0a0f1c]/95 backdrop-blur z-50 px-12 sm:px-20 lg:px-40 flex items-center justify-between shrink-0">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">DailySQL</span>
            </Link>

            {/* Nav Items */}
            <div className="hidden md:flex items-center justify-center flex-1 space-x-12">
                <Link href="/practice/daily" className={`text-sm font-semibold transition-colors ${pathname === '/practice/daily' ? 'text-[#4DD4C4]' : 'text-zinc-400 hover:text-white'}`}>Practice</Link>
                <Link href="#" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Leaderboard</Link>
            </div>

            {/* Right side CTA or User Menu */}
            <div className="hidden md:flex items-center gap-4 relative">
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin text-zinc-500" />
                ) : user ? (
                    <>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 rounded-lg">
                            <span className="text-sm font-bold text-[#4DD4C4]">{streak}</span>
                            <Flame size={14} className="text-[#4DD4C4] fill-[#4DD4C4]" />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-9 h-9 rounded-full bg-[#131924] border-2 border-[#202736] hover:border-[#4DD4C4] transition-colors flex items-center justify-center overflow-hidden focus:outline-none"
                            >
                                {user.profile?.avatar_url ? (
                                    <img src={user.profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-6 h-6 text-[#4DD4C4] mt-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                )}
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-[#131924] border border-[#202736] rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                                    <div className="px-4 py-3 border-b border-[#202736] bg-[#0b101c]">
                                        <p className="text-sm font-semibold text-white truncate">{user.profile?.full_name || user.email?.split('@')[0]}</p>
                                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                                    </div>
                                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-[#202736] transition-colors cursor-pointer">
                                            <User size={14} /> My Profile
                                        </div>
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="w-full text-left">
                                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer">
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
                            className="text-sm text-zinc-400 hover:text-white font-medium transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="text-sm text-[#0a0f1c] bg-[#4DD4C4] hover:bg-[#3dbdb0] px-4 py-1.5 rounded font-bold transition-colors shadow-lg shadow-[#4DD4C4]/20"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
