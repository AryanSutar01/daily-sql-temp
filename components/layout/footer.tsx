"use client";

import Link from "next/link";
import { Heart, Terminal, Database, Code2, Server } from "lucide-react";
import { PracticeLink } from "@/components/landing/practice-link";

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--ls-surface, #ffffff)",
        borderTop: "1px solid var(--ls-outline, #dedee2)",
      }}
      className="font-sans"
    >
      {/* Final CTA band */}
      <div
        className="relative overflow-hidden text-center px-6 py-20 md:py-24"
        style={{ borderBottom: "1px solid var(--ls-outline, #dedee2)" }}
      >
        <div className="max-w-2xl mx-auto relative z-10">
          <h2
            className="mb-3"
            style={{
              fontFamily: "'Overused Grotesk', system-ui, sans-serif",
              fontSize: "clamp(2rem, 3.8vw, 2.75rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "var(--ls-on-surface, #18181b)",
            }}
          >
            Start building your{" "}
            <span style={{ color: "var(--ls-primary, #1f9e8e)" }}>daily practice habit.</span>
          </h2>
          <p
            className="mb-8 text-sm sm:text-base leading-relaxed"
            style={{ color: "var(--ls-on-surface-muted, #6e6e6e)" }}
          >
            15 minutes a day. 9 fresh problems. Consistent improvement across SQL, Python & PySpark.
          </p>
          <div className="flex flex-col items-center gap-3">
            <PracticeLink
              label="Start your daily practice"
              showArrow
              className="inline-flex items-center justify-center gap-2 font-bold text-sm h-12 rounded-xl px-8 transition-all duration-150 shadow-xs hover:opacity-95"
              style={{
                background: "var(--ls-primary, #1f9e8e)",
                color: "var(--ls-on-primary, #ffffff)",
                boxShadow: "0 3px 12px rgba(31,158,142,0.25)",
              }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--ls-on-surface-subtle, #a1a1aa)" }}
            >
              Free to start · No credit card required
            </span>
          </div>
        </div>

        {/* Mascot decoration on bottom corner of CTA band */}
        <div className="hidden md:block absolute right-12 bottom-4 pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
          <img
            src="/mascot-complete-bg-removed.png"
            alt="DailySQL Mascot"
            className="w-24 h-auto object-contain transform hover:scale-110 transition-transform duration-300 pointer-events-auto"
          />
        </div>
      </div>

      {/* Main Multi-column Links Section */}
      <div className="mx-auto px-6 lg:px-10 py-16" style={{ maxWidth: 1340 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">

          {/* Brand Column (4 Cols on desktop) */}
          <div className="lg:col-span-4 space-y-4 pr-0 lg:pr-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img
                src="/dailysql-logo-bg-removed.png"
                alt="DailySQL Logo"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <img
                src="/dailysql-wordmark-bg-removed.png"
                alt="DailySQL"
                className="dark:invert h-7 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
            </Link>
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: "var(--ls-on-surface-muted, #6e6e6e)", maxWidth: 320 }}
            >
              Technical learning through guided daily practice, isolated sandbox executions, and real-world interview problem sets.
            </p>
            <div className="pt-1">
              <Link
                href="mailto:contact@dailysql.in"
                className="inline-flex items-center text-xs font-mono font-medium transition-colors hover:underline"
                style={{ color: "var(--ls-primary, #1f9e8e)" }}
              >
                contact@dailysql.in
              </Link>
            </div>
          </div>

          {/* Column 1: Platform (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3
              className="text-[11px] font-mono font-bold uppercase tracking-[0.16em]"
              style={{ color: "var(--ls-on-surface, #18181b)" }}
            >
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { label: "Daily Problems", href: "/practice/daily" },
                { label: "All Problems", href: "/problems" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Pricing", href: "/pricing" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-zinc-950 block"
                    style={{ color: "var(--ls-on-surface-muted, #6e6e6e)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Curriculum / Tracks (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3
              className="text-[11px] font-mono font-bold uppercase tracking-[0.16em]"
              style={{ color: "var(--ls-on-surface, #18181b)" }}
            >
              Curriculum
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { label: "SQL", href: "/problems?discipline=sql" },
                { label: "Python & Pandas", href: "/problems?discipline=python" },
                { label: "PySpark Engine", href: "/problems?discipline=pyspark" },
                { label: "SQL Tutorials", href: "/practice/learn/sql" },
                { label: "Python Tutorials", href: "/practice/learn/python" },
                { label: "PySpark Tutorials", href: "/practice/learn/pyspark" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-zinc-950 block"
                    style={{ color: "var(--ls-on-surface-muted, #6e6e6e)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Account (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3
              className="text-[11px] font-mono font-bold uppercase tracking-[0.16em]"
              style={{ color: "var(--ls-on-surface, #18181b)" }}
            >
              Account
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { label: "Sign In", href: "/login" },
                { label: "Sign Up", href: "/signup" },
                { label: "Dashboard", href: "/profile" },
                { label: "Solve History", href: "/profile" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-zinc-950 block"
                    style={{ color: "var(--ls-on-surface-muted, #6e6e6e)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal & Help (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3
              className="text-[11px] font-mono font-bold uppercase tracking-[0.16em]"
              style={{ color: "var(--ls-on-surface, #18181b)" }}
            >
              Legal & Support
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Refund Policy", href: "/refund" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-zinc-950 block"
                    style={{ color: "var(--ls-on-surface-muted, #6e6e6e)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--ls-outline, #dedee2)" }}
        >
          <p
            className="text-xs sm:text-sm flex items-center gap-1.5 font-medium"
            style={{ color: "var(--ls-on-surface-subtle, #71717a)" }}
          >
            Made with <Heart size={13} style={{ color: "var(--ls-primary, #1f9e8e)", fill: "var(--ls-primary, #1f9e8e)" }} /> by engineers, for engineers.
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--ls-on-surface-subtle, #a1a1aa)" }}>
            © {new Date().getFullYear()} DailySQL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
