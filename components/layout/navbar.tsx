"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Flame, User, LogOut, Loader2, ChevronDown, Code2, BookOpen, Database, Server, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isLanding = pathname === "/";
  const isLightNav = isLanding || pathname.startsWith("/problems") || pathname.startsWith("/pricing");

  const practiceHref = user ? "/practice/daily" : "/login";

  const navItems = [
    { name: "Problems", href: "/problems" },
    { name: "Pricing", href: "/#pricing" },
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
      bg: "rgba(31,158,142,0.08)",
    },
    {
      title: "Daily Quest",
      description: "9 fresh problems every day in SQL, Python & PySpark.",
      href: practiceHref,
      icon: Zap,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
    },
    {
      title: "Learn SQL",
      description: "52 lessons — window functions, CTEs, aggregations.",
      href: "/practice/learn/sql",
      icon: BookOpen,
      color: "#d97706",
      bg: "rgba(217,119,6,0.08)",
    },
    {
      title: "Learn Python",
      description: "52 lessons — Pandas, data wrangling, interview prep.",
      href: "/practice/learn/python",
      icon: Code2,
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.08)",
    },
    {
      title: "Learn PySpark",
      description: "46 lessons — distributed data, Spark SQL, window ops.",
      href: "/practice/learn/pyspark",
      icon: Server,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.08)",
    },
  ];

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
    setIsDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  // Light nav: solid at top, liquid-glass when scrolled
  const navStyle = isLightNav
    ? scrolled
      ? {
          // Liquid glass
          backgroundColor: "rgba(247,247,248,0.75)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottomColor: "rgba(0,0,0,0.07)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 4px 24px rgba(0,0,0,0.06)",
        }
      : {
          // Solid / opaque at top
          backgroundColor: "#f7f7f8",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          borderBottomColor: "rgba(0,0,0,0.07)",
          boxShadow: "none",
        }
    : {};

  const linkClass = isLightNav
    ? "text-sm transition-colors duration-150 hover:opacity-70"
    : "text-sm text-zinc-400 hover:text-white transition-colors";

  const linkStyle = isLightNav
    ? { color: "var(--ls-on-surface-muted)" }
    : {};

  return (
    <nav
      className={`w-full overflow-visible transition-all duration-300 ${
        isLightNav
          ? "border-b"
          : "border-b border-white/5 bg-[#0a0f1c]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0f1c]/80"
      }`}
      style={isLightNav ? navStyle : {}}
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
              className="h-7 w-auto object-contain block transition-opacity group-hover:opacity-90"
            />
          </Link>

          {/* Desktop Navigation — Centered */}
          {!isAdmin && (
            <div className="hidden md:flex items-center justify-center flex-1 gap-8">

              {/* Practice Dropdown */}
              <div className="relative overflow-visible" ref={practiceRef}>
                <button
                  onClick={() => setIsPracticeOpen((p) => !p)}
                  className={`flex items-center gap-1 ${linkClass}`}
                  style={linkStyle}
                >
                  Practice
                  <ChevronDown
                    size={13}
                    className={`mt-0.5 transition-transform duration-200 ${isPracticeOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isPracticeOpen && (
                  <div
                    className="absolute top-full mt-3 left-0 rounded-2xl p-3 z-[200] grid grid-cols-2 gap-2"
                    style={{
                      width: 520,
                      maxWidth: "calc(100vw - 2rem)",
                      background: "var(--ls-surface)",
                      border: "1px solid var(--ls-outline)",
                      boxShadow: "var(--ls-shadow-lg)",
                    }}
                  >
                    {practiceOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        onClick={() => setIsPracticeOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl transition-colors group"
                        style={{ background: "transparent" }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.background = "var(--ls-surface-container)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.background = "transparent")
                        }
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: option.bg }}
                        >
                          <option.icon size={15} style={{ color: option.color }} />
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium leading-tight"
                            style={{ color: "var(--ls-on-surface)" }}
                          >
                            {option.title}
                          </p>
                          <p
                            className="text-xs mt-0.5 leading-snug"
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
                  className={linkClass}
                  style={linkStyle}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Right: auth / CTA */}
          {!isAdmin && (
            <div className="hidden md:flex items-center gap-3 relative shrink-0">
              {isAuthLoading ? (
                <Loader2 size={16} className="animate-spin" style={{ color: "var(--ls-on-surface-muted)" }} />
              ) : user ? (
                <>
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
                        className="absolute top-12 right-0 w-52 rounded-2xl overflow-hidden py-1 z-[200]"
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
                          <p className="text-xs truncate" style={{ color: "var(--ls-on-surface-muted)" }}>
                            {user.email}
                          </p>
                        </div>
                        <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                          <div
                            className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-colors"
                            style={{ color: "var(--ls-on-surface-muted)" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--ls-surface-container)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                          >
                            <User size={14} /> My Profile
                          </div>
                        </Link>
                        <button onClick={handleLogout} className="w-full text-left">
                          <div
                            className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-colors"
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
                  {/* Sign in — Fanout-style pill with thin border */}
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
                  {/* Start free — dark charcoal, embossed (Fanout "Start learning free" style) */}
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
            style={{ color: isLightNav ? "var(--ls-on-surface)" : "#fff" }}
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
              borderColor: isLightNav ? "var(--ls-outline)" : "rgba(255,255,255,0.05)",
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
            {user ? (
              <>
                <Link href="/practice/daily" className="block px-3 py-2 text-sm font-medium" style={{ color: "var(--ls-primary)" }} onClick={() => setIsOpen(false)}>
                  Open Practice
                </Link>
                <Link href="/profile" className="block px-3 py-2 text-sm" style={{ color: "var(--ls-on-surface-muted)" }} onClick={() => setIsOpen(false)}>
                  My Profile
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block px-3 py-2 text-sm" style={{ color: "#dc2626" }}>
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
    </nav>
  );
}