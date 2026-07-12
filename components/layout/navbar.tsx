"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Flame, User, LogOut, Loader2, ChevronDown, Code2, BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const practiceHref = user ? "/practice/daily" : "/login";

  const navItems = [
    { name: "Pricing", href: "/#pricing" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact", href: "/contact" },
  ];

  const practiceOptions = [
    {
      title: "Coding Questions",
      description: "Practice coding problems in SQL.",
      href: practiceHref,
      icon: Code2,
      iconBg: "bg-[#4DD4C4]/10",
      iconColor: "text-[#4DD4C4]",
    },
    {
      title: "Learn SQL",
      description: "Essential SQL theory.",
      href: "/practice/learn/sql",
      icon: BookOpen,
      iconBg: "bg-amber-400/10",
      iconColor: "text-amber-400",
    },
    // {
    //   title: "Learn Python",
    //   description: "Python fundamentals & interview prep.",
    //   href: "/practice/learn/python",
    //   icon: BookOpen,
    //   iconBg: "bg-blue-400/10",
    //   iconColor: "text-blue-400",
    // },
    // {
    //   title: "Learn PySpark",
    //   description: "Big data processing with PySpark.",
    //   href: "/practice/learn/pyspark",
    //   icon: BookOpen,
    //   iconBg: "bg-orange-400/10",
    //   iconColor: "text-orange-400",
    // }
  ];

  useEffect(() => {
    async function fetchUser() {
      try {
        const profile = await api.getProfile();
        const s = await api.getStreak().catch(() => ({ current_streak: 0 }));
        setUser({ profile, email: profile?.email || "User" });
        setStreak(s.current_streak);
      } catch {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (practiceRef.current && !practiceRef.current.contains(e.target as Node)) {
        setIsPracticeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie = "ds_token=; path=/; max-age=0; SameSite=Lax;";
    setUser(null);
    setIsDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0f1c]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0f1c]/80 overflow-visible">
      <div className="container mx-auto px-12 sm:px-20 lg:px-40 overflow-visible">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">
              DailySQL
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          {!isAdmin && (
            <div className="hidden md:flex items-center justify-center flex-1 space-x-8">

              {/* Practice Interview Question Dropdown */}
              <div className="relative overflow-visible" ref={practiceRef}>
                <button
                  onClick={() => setIsPracticeOpen((prev) => !prev)}
                  className="flex items-center relative gap-1 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Practice Interview Question
                  <ChevronDown
                    size={14}
                    className={`mt-1 transition-transform duration-200 ${isPracticeOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isPracticeOpen && (
                  <div
                      className="absolute top-full mt-3 left-0 bg-[#0f1623] border border-[#202736] rounded-2xl shadow-2xl p-4 z-[200] grid grid-cols-2 gap-3"
                      style={{ width: 580, maxWidth: "calc(100vw - 2rem)" }}
                  >
                    {practiceOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        onClick={() => setIsPracticeOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a2235] transition-colors group"
                      >
                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${option.iconBg} flex items-center justify-center mt-0.5`}>
                          <option.icon size={16} className={option.iconColor} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-[#4DD4C4] transition-colors leading-tight">
                            {option.title}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                            {option.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Right side: auth-aware CTA or profile */}
          {!isAdmin && (
            <div className="hidden md:flex items-center gap-3 relative">
              {isAuthLoading ? (
                <Loader2 size={18} className="animate-spin text-zinc-500" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 rounded-lg">
                    <span className="text-sm font-bold text-[#4DD4C4]">{streak}</span>
                    <Flame size={14} className="text-[#4DD4C4] fill-[#4DD4C4]" />
                  </div>

                  <div className="relative" ref={dropdownRef}>
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
                      <div className="absolute top-12 right-0 w-48 bg-[#131924] border border-[#202736] rounded-xl shadow-2xl overflow-hidden py-1 z-[200]">
                        <div className="px-4 py-3 border-b border-[#202736] bg-[#0b101c]">
                          <p className="text-sm font-semibold text-white truncate">
                            {user.profile?.full_name || user.email?.split("@")[0]}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                          <div className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-[#202736] transition-colors cursor-pointer">
                            <User size={14} /> My Profile
                          </div>
                        </Link>
                        <button onClick={handleLogout} className="w-full text-left">
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
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm text-[#4DD4C4] hover:text-[#30B5A6] transition-colors flex items-center gap-1 group"
                  >
                    Sign up
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-white/5">
            {/* Mobile Practice Section */}
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Practice Interview Question</p>
              {practiceOptions.map((option) => (
                <Link
                  key={option.href}
                  href={option.href}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors pl-2"
                  onClick={() => setIsOpen(false)}
                >
                  <option.icon size={14} className={option.iconColor} />
                  {option.title}
                </Link>
              ))}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/practice/daily"
                  className="block text-sm text-[#4DD4C4] hover:text-white transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Open Practice
                </Link>
                <Link
                  href="/profile"
                  className="block text-sm text-zinc-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/signup"
                className="block text-sm text-[#4DD4C4] hover:text-[#30B5A6] transition-colors flex items-center gap-1"
                onClick={() => setIsOpen(false)}
              >
                Sign up
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}