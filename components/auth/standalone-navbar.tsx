"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Flame, User, Settings, LogOut, ArrowRight } from "lucide-react";

export function StandaloneNavbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();

    // The standalone routes overlay the main landing layout `app/page.tsx`
    // We lock the HTML body scroll to prevent a double scrollbar from showing.
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "unset"; };
    }, []);

    const isAuthPage = pathname === "/login" || pathname === "/signup";

    return (
        <nav className="w-full h-16 border-b border-white/5 bg-[#0a0f1c]/95 backdrop-blur z-50 px-12 sm:px-20 lg:px-40 flex items-center justify-between shrink-0">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">DailySQL</span>
            </Link>

            {/* Nav Items */}
            <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
                <Link href="/practice/daily" className="text-sm text-zinc-400 hover:text-white transition-colors">Practice</Link>
                <Link href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link>
                <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Leaderboard</Link>
                <Link href="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors">Contact</Link>
            </div>

            {/* Right side CTA or User Menu */}
            <div className="hidden md:flex items-center gap-4 relative">
                {isAuthPage ? (
                    <>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 rounded-lg">
                            <span className="text-sm font-bold text-[#4DD4C4]">18</span>
                            <Flame size={14} className="text-[#4DD4C4] fill-[#4DD4C4]" />
                        </div>
                        <Link
                            href="/login"
                            className="text-sm text-[#0a0f1c] bg-[#4DD4C4] hover:bg-[#30B5A6] px-4 py-1.5 rounded font-bold transition-colors"
                        >
                            Log In
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 rounded-lg">
                            <span className="text-sm font-bold text-[#4DD4C4]">18</span>
                            <Flame size={14} className="text-[#4DD4C4] fill-[#4DD4C4]" />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-9 h-9 rounded-full bg-[#4DD4C4] border-2 border-[#202736] hover:border-[#4DD4C4] transition-colors flex items-center justify-center overflow-hidden focus:outline-none"
                            >
                                <svg className="w-6 h-6 text-[#080c16]/30 mt-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-[#131924] border border-[#202736] rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                                    <div className="px-4 py-3 border-b border-[#202736] bg-[#0b101c]">
                                        <p className="text-sm font-semibold text-white truncate">Vedant</p>
                                        <p className="text-xs text-zinc-400 truncate">vedant@example.com</p>
                                    </div>
                                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-[#202736] transition-colors cursor-pointer">
                                            <User size={14} /> My Profile
                                        </div>
                                    </Link>
                                    <Link href="/profile/edit" onClick={() => setIsDropdownOpen(false)}>
                                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-[#202736] transition-colors cursor-pointer">
                                            <Settings size={14} /> Edit Info
                                        </div>
                                    </Link>
                                    <div className="h-px w-full bg-[#202736] my-1" />
                                    <Link href="/login" onClick={() => setIsDropdownOpen(false)}>
                                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer">
                                            <LogOut size={14} /> Log Out
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}
