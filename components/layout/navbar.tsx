"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Flame,
  User,
  LogOut,
  Loader2,
  ChevronDown,
  Code2,
  BookOpen,
  Database,
  Server,
  Zap,
  Gift,
  Crown,
  CreditCard,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { api } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { NavbarTrialPill, TrialWelcomeModal } from "@/components/subscription/trial-experience";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isAdmin = pathname.startsWith("/admin");
  const isLightNav = true;
  const isDark = mounted && theme === "dark";

  const practiceHref = user ? "/practice/daily" : "/login";

  const navItems = [
    { name: "Problems", href: "/problems" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact", href: "/contact" },
  ];

  const practiceOptions = [
    {
      title: "All Problems",
      description: "Complete problemset with filters, tags & company questions.",
      href: "/problems",
      icon: Database,
      color: "#1f9e8e",
      bg: "rgba(31,158,142,0.1)",
    },
    {
      title: "Daily Quest",
      description: "9 fresh problems every day in SQL, Python & PySpark.",
      href: practiceHref,
      icon: Zap,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
    },
    {
      title: "Learn SQL",
      description: "52 lessons — window functions, CTEs & aggregations.",
      href: "/practice/learn/sql",
      icon: BookOpen,
      color: "#d97706",
      bg: "rgba(217,119,6,0.1)",
    },
    {
      title: "Learn Python",
      description: "52 lessons — Pandas, data wrangling & interview prep.",
      href: "/practice/learn/python",
      icon: Code2,
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
    },
    {
      title: "Learn PySpark",
      description: "46 lessons — distributed data, Spark SQL & optimization.",
      href: "/practice/learn/pyspark",
      icon: Server,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Light nav: solid at top, liquid-glass when scrolled
  const navStyle = scrolled
    ? {
        // Liquid glass
        backgroundColor: "var(--ls-nav-glass)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottomColor: "var(--ls-nav-border-glass)",
        boxShadow: "var(--ls-nav-shadow-glass)",
      }
    : {
        // Solid / opaque at top
        backgroundColor: "var(--ls-nav-solid)",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottomColor: "var(--ls-nav-border-solid)",
        boxShadow: "none",
      };

  const linkClass = "text-sm transition-colors duration-150 hover:opacity-70";
  const linkStyle = { color: "var(--ls-on-surface-muted)" };

  return (
    <nav
      className="w-full overflow-visible transition-all duration-300 border-b border-[#dedee2]"
      style={navStyle}
    >
      <div
        className="mx-auto px-6 lg:px-8 overflow-visible"
        style={{ maxWidth: 1280 }}
      >
        <div className="flex h-16 items-center justify-between">

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
              className="dark:invert h-7 w-auto object-contain block transition-opacity group-hover:opacity-90"
            />
          </Link>

          {/* Desktop Navigation — Centered */}
          {!isAdmin && (
            <div className="hidden md:flex items-center justify-center flex-1 gap-8">

              {/* Practice Dropdown */}
              <div className="relative overflow-visible" ref={practiceRef}>
                <button
                  onClick={() => setIsPracticeOpen((p) => !p)}
                  className={`flex items-center gap-1 font-medium ${linkClass}`}
                  style={linkStyle}
                >
                  Practice
                  <ChevronDown
                    size={13}
                    className={`mt-0.5 transition-transform duration-200 ${isPracticeOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isPracticeOpen && (
                  <div
                    className="absolute top-full mt-3 -left-32 sm:-left-48 md:left-1/2 md:-translate-x-1/2 rounded-2xl p-3.5 z-[200] grid grid-cols-1 md:grid-cols-3 gap-2.5 animate-in fade-in-0 zoom-in-95 duration-150"
                    style={{
                      width: 780,
                      maxWidth: "calc(100vw - 2rem)",
                      background: "var(--ls-surface)",
                      border: "1px solid var(--ls-outline)",
                      boxShadow: "var(--ls-shadow-lg)",
                    }}
                  >
                    {practiceOptions.map((option) => (
                      <Link
                        key={option.title}
                        href={option.href}
                        onClick={() => setIsPracticeOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl transition-all duration-150 group border border-transparent hover:border-[#dedee2] hover:bg-zinc-50/80 shadow-2xs dark:hover:bg-white/5"
                        style={{ background: "transparent" }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs transition-transform group-hover:scale-105"
                          style={{ background: option.bg }}
                        >
                          <option.icon size={18} style={{ color: option.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-bold leading-tight group-hover:text-[#1f9e8e] transition-colors"
                            style={{ color: "var(--ls-on-surface)" }}
                          >
                            {option.title}
                          </p>
                          <p
                            className="text-xs mt-1 leading-snug line-clamp-2"
                            style={{ color: "var(--ls-on-surface-muted)" }}
                          >
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
                  className={`font-medium ${linkClass}`}
                  style={linkStyle}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Right: auth / CTA / trial badge */}
          {!isAdmin && (
            <div className="hidden md:flex items-center gap-3 relative shrink-0">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  background: "var(--ls-surface-container)",
                  border: "1px solid var(--ls-outline)",
                  color: "var(--ls-on-surface-muted)",
                }}
                aria-label="Toggle dark mode"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {/* Icons switch via the .dark class (CSS) so the first paint is already correct */}
                <Sun size={16} className="hidden dark:block" />
                <Moon size={16} className="dark:hidden" />
              </button>

              {isAuthLoading ? (
                <Loader2 size={16} className="animate-spin" style={{ color: "var(--ls-on-surface-muted)" }} />
              ) : user ? (
                <>
                  {/* Live Trial / Subscription Pill */}
                  <NavbarTrialPill subscription={subscription} />

                  {/* Streak badge */}
                  <div
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-semibold"
                    style={{
                      background: "rgba(31,158,142,0.08)",
                      color: "var(--ls-primary)",
                      border: "1px solid rgba(31,158,142,0.2)",
                    }}
                  >
                    {streak}
                    <Flame size={13} style={{ color: "#f97316", fill: "#f97316" }} />
                  </div>

                  {/* Avatar dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-9 h-9 rounded-full border-2 flex items-center justify-center overflow-hidden transition-colors focus:outline-none"
                      style={{
                        background: "var(--ls-surface-container)",
                        borderColor: isDropdownOpen ? "var(--ls-primary)" : "var(--ls-outline)",
                      }}
                    >
                      {user.profile?.avatar_url ? (
                        <img src={user.profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-5 h-5 mt-1" fill="currentColor" viewBox="0 0 24 24" style={{ color: "var(--ls-primary)" }}>
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </button>

                    {isDropdownOpen && (
                      <div
                        className="absolute top-12 right-0 w-60 rounded-2xl overflow-hidden py-1 z-[200]"
                        style={{
                          background: "var(--ls-surface)",
                          border: "1px solid var(--ls-outline)",
                          boxShadow: "var(--ls-shadow-lg)",
                        }}
                      >
                        <div
                          className="px-4 py-3 border-b"
                          style={{
                            borderColor: "var(--ls-outline)",
                            background: "var(--ls-surface-low)",
                          }}
                        >
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--ls-on-surface)" }}>
                            {user.profile?.full_name || user.email?.split("@")[0]}
                          </p>
                          <p className="text-xs truncate mb-1.5" style={{ color: "var(--ls-on-surface-muted)" }}>
                            {user.email}
                          </p>
                          {subscription?.is_paid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30 uppercase tracking-wider">
                              <Crown className="w-3 h-3 text-amber-600 dark:text-amber-300" />
                              {subscription.plan === "lifetime" ? "Lifetime VIP" : `${subscription.plan} Pro`}
                            </span>
                          ) : subscription?.is_trial ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 uppercase tracking-wider">
                              <Gift className="w-3 h-3 text-emerald-600 dark:text-emerald-300" />
                              {subscription.trial_type === "new_signup" ? "7-Day Trial" : "Launch Trial"}
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full"
                              style={{ background: "var(--ls-surface-container)", color: "var(--ls-on-surface-muted)" }}
                            >
                              Free Plan
                            </span>
                          )}
                        </div>

                        <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                          <div
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors"
                            style={{ color: "var(--ls-on-surface)" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--ls-surface-container)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                          >
                            <User size={14} style={{ color: "var(--ls-on-surface-muted)" }} /> My Profile
                          </div>
                        </Link>

                        <Link href="/pricing" onClick={() => setIsDropdownOpen(false)}>
                          <div
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors"
                            style={{ color: "var(--ls-primary)" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--ls-surface-container)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                          >
                            <CreditCard size={14} /> Membership &amp; Plans
                          </div>
                        </Link>

                        <Link href="/redeem" onClick={() => setIsDropdownOpen(false)}>
                          <div
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors text-amber-600 font-medium dark:text-amber-300"
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--ls-surface-container)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                          >
                            <Gift size={14} className="text-amber-600 dark:text-amber-300" /> Redeem Invite Code
                          </div>
                        </Link>

                        <div className="my-1 border-t" style={{ borderColor: "var(--ls-outline)" }} />

                        <button onClick={handleLogout} className="w-full text-left">
                          <div
                            className="flex items-center gap-2.5 px-4 py-2 text-sm cursor-pointer transition-colors"
                            style={{ color: "#dc2626" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.06)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                          >
                            <LogOut size={14} /> Log Out
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Sign in */}
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center text-sm font-medium px-4 py-2 rounded-full transition-all duration-150"
                    style={{
                      background: "var(--ls-surface)",
                      color: "var(--ls-on-surface)",
                      border: "1px solid var(--ls-outline)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--ls-outline-variant)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--ls-outline)")}
                  >
                    Sign in
                  </Link>

                  {/* Start free */}
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150 select-none"
                    style={{
                      background: "#1c1c1e",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset, 0 2px 4px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.6)",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#2a2a2e")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#1c1c1e")}
                  >
                    Start free
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            style={{ color: "var(--ls-on-surface)" }}
          >
            <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div
            className="md:hidden py-4 space-y-1 border-t"
            style={{
              borderColor: "var(--ls-outline)",
            }}
          >
            <p
              className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--ls-on-surface-muted)" }}
            >
              Practice
            </p>
            {practiceOptions.map((option) => (
              <Link
                key={option.href}
                href={option.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: "var(--ls-on-surface-muted)" }}
                onClick={() => setIsOpen(false)}
              >
                <option.icon size={14} style={{ color: option.color }} />
                {option.title}
              </Link>
            ))}

            <div className="pt-2" />
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: "var(--ls-on-surface-muted)" }}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-2 border-t" style={{ borderColor: "var(--ls-outline)" }} />

            {/* Mobile theme toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors w-full"
              style={{ color: "var(--ls-on-surface-muted)" }}
            >
              <Sun size={14} className="hidden dark:block" />
              <Moon size={14} className="dark:hidden" />
              <span className="hidden dark:inline">Light Mode</span>
              <span className="dark:hidden">Dark Mode</span>
            </button>

            <div className="pt-1" />
            {user ? (
              <>
                <Link href="/practice/daily" className="block px-3 py-2 text-sm font-medium" style={{ color: "var(--ls-primary)" }} onClick={() => setIsOpen(false)}>
                  Open Practice
                </Link>
                <Link href="/profile" className="block px-3 py-2 text-sm" style={{ color: "var(--ls-on-surface-muted)" }} onClick={() => setIsOpen(false)}>
                  My Profile
                </Link>
                <Link
                  href="/pricing"
                  className="block px-3 py-2 text-sm font-medium"
                  style={{ color: "var(--ls-primary)" }}
                  onClick={() => setIsOpen(false)}
                >
                  Membership &amp; Plans
                </Link>
                <Link
                  href="/redeem"
                  className="block px-3 py-2 text-sm text-amber-600 font-medium dark:text-amber-300"
                  onClick={() => setIsOpen(false)}
                >
                  Redeem Invite Code
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-sm" style={{ color: "#dc2626" }}>
                  Log Out
                </button>
              </>
            ) : (
              <Link href="/signup" className="flex items-center gap-1 px-3 py-2 text-sm font-medium" style={{ color: "var(--ls-primary)" }} onClick={() => setIsOpen(false)}>
                Start free <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>

      <TrialWelcomeModal />
    </nav>
  );
}