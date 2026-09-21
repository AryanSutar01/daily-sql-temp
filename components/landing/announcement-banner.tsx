"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ArrowRight, Sparkles } from "lucide-react";

export function AnnouncementBanner({ scrolled = false }: { scrolled?: boolean }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="relative w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? "rgba(247,247,248,0.45)"
          : "var(--ls-primary-container)",
        borderBottom: `1px solid ${scrolled ? "rgba(0,0,0,0.07)" : "var(--ls-outline)"}`,
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
      }}
    >
      {/* Sparkle icon */}
      <Sparkles
        className="w-3.5 h-3.5 shrink-0"
        style={{ color: "var(--ls-primary)" }}
      />

      {/* Badge */}
      <span
        className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
        style={{
          backgroundColor: "var(--ls-primary)",
          color: "var(--ls-on-primary)",
        }}
      >
        NEW
      </span>

      {/* Message */}
      <span style={{ color: "var(--ls-on-surface)" }}>
        9 fresh problems every day — SQL, Python &amp; PySpark.{" "}
        <Link
          href="/signup"
          className="inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline transition-all"
          style={{ color: "var(--ls-primary)" }}
        >
          Sign up free <ArrowRight className="w-3 h-3" />
        </Link>
      </span>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        className="absolute right-4 p-1 rounded-md transition-colors hover:opacity-60"
        style={{ color: "var(--ls-on-surface-muted)" }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
