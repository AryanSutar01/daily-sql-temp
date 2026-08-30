"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Flame, User, LogOut, Loader2, ChevronDown, Code2, BookOpen, Gift, Crown, CreditCard, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";

import { NavbarTrialPill, TrialWelcomeModal } from "@/components/subscription/trial-experience";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const practiceHref = user ? "/practice/daily" : "/login";

  const navItems = [
    { name: "Pricing", href: "/payment" },
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
    {
      title: "Learn Python",
      description: "Python fundamentals & interview prep.",
      href: "/practice/learn/python",
      icon: BookOpen,
      iconBg: "bg-blue-400/10",
      iconColor: "text-blue-400",
    },
    {
      title: "Learn PySpark",
      description: "Big data processing with PySpark.",
      href: "/practice/learn/pyspark",
      icon: BookOpen,
      iconBg: "bg-orange-400/10",
      iconColor: "text-orange-400",
    }
  ];

  useEffect(() => {
    async function fetchUser() {
      try {
        const profile = await api.getProfile();
        const s = await api.getStreak().catch(() => ({ current_streak: 0 }));
        setUser({ profile, email: profile?.email || "User" });
        setStreak(s.current_streak);

        // Fetch subscription details
        const sub = await api.getMySubscription().catch(() => null);
        if (sub) setSubscription(sub);
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
    setSubscription(null);
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
            <div className="hidden md:flex items-center space-x-8">
              {/* Practice Dropdown */}
              <div className="relative" ref={practiceRef}>
                <button
                  onClick={() => setIsPracticeOpen(!isPracticeOpen)}
                  className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors group py-2"
                >
                  <span>Practice</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isPracticeOpen ? "rotate-180 text-[#4DD4C4]" : "text-zinc-400"
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isPracticeOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-[#0d1424] border border-white/10 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in-0 zoom-in-95 duration-100">
                    {practiceOptions.map((opt, i) => {
                      const Icon = opt.icon;
                      return (
                        <Link
                          key={i}
                          href={opt.href}
                          onClick={() => setIsPracticeOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                        >
                          <div
                            className={`p-2 rounded-lg ${opt.iconBg} ${opt.iconColor} shrink-0 mt-0.5`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white group-hover:text-[#4DD4C4] transition-colors">
                              {opt.title}
                            </div>
                            <div className="text-xs text-zinc-400 mt-0.5">
                              {opt.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Right Section - CTA / Profile */}
          {!isAdmin && (
            <div className="hidden md:flex items-center space-x-4">
              {isAuthLoading ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                </div>
              ) : user ? (
                <>
                  <NavbarTrialPill subscription={subscription} />

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
                      <div className="absolute top-12 right-0 w-56 bg-[#131924] border border-[#202736] rounded-2xl shadow-2xl overflow-hidden py-1 z-[200]">
                        <div className="px-4 py-3 border-b border-[#202736] bg-[#0b101c]">
                          <p className="text-sm font-semibold text-white truncate">
                            {user.profile?.full_name || user.email?.split("@")[0]}
                          </p>
                          <p className="text-xs text-zinc-400 truncate mb-1.5">{user.email}</p>
                          {subscription?.is_paid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                              <Crown className="w-3 h-3 text-amber-400" />
                              {subscription.plan === "lifetime" ? "Lifetime VIP" : `${subscription.plan} Pro`}
                            </span>
                          ) : subscription?.is_trial ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                              <Gift className="w-3 h-3 text-emerald-400" />
                              {subscription.trial_type === "new_signup" ? "7-Day Trial" : "Launch Trial"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                              Free Plan
                            </span>
                          )}
                        </div>
                        <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                          <div className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#202736] transition-colors cursor-pointer">
                            <User size={14} className="text-zinc-400" /> My Profile
                          </div>
                        </Link>
                        <Link href="/payment" onClick={() => setIsDropdownOpen(false)}>
                          <div className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#202736] transition-colors cursor-pointer">
                            <CreditCard size={14} className="text-[#4DD4C4]" /> Membership &amp; Plans
                          </div>
                        </Link>
                        <Link href="/redeem" onClick={() => setIsDropdownOpen(false)}>
                          <div className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-[#202736] transition-colors cursor-pointer">
                            <Gift size={14} className="text-amber-400" /> Redeem Invite Code
                          </div>
                        </Link>
                        <div className="border-t border-[#202736] my-1" />
                        <button onClick={handleLogout} className="w-full text-left">
                          <div className="flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer">
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
                <Link
                  href="/payment"
                  className="block text-sm text-zinc-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Membership &amp; Plans
                </Link>
                <Link
                  href="/redeem"
                  className="block text-sm text-amber-400 hover:text-amber-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Redeem Coupon Code
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block text-sm text-red-400 hover:text-red-300 transition-colors text-left"
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

      <TrialWelcomeModal />
    </nav>
  );
}