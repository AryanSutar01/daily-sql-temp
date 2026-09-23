"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight, Sparkles } from "lucide-react";

interface AnnouncementData {
  is_active: boolean;
  badge_text: string;
  message_text: string;
  link_text: string;
  link_url: string;
}

const DEFAULT_ANNOUNCEMENT: AnnouncementData = {
  is_active: true,
  badge_text: "NEW",
  message_text: "9 fresh problems every day — SQL, Python & PySpark.",
  link_text: "Sign up free",
  link_url: "/signup",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function AnnouncementBanner({ scrolled = false }: { scrolled?: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  const [data, setData] = useState<AnnouncementData>(DEFAULT_ANNOUNCEMENT);

  useEffect(() => {
    let isMounted = true;
    async function fetchAnnouncement() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/announcements/active`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json) {
            setData(json);
          }
        }
      } catch (err) {
        // Fallback to default smoothly if network/server is unreachable
      }
    }
    fetchAnnouncement();
    return () => {
      isMounted = false;
    };
  }, []);

  if (dismissed || !data.is_active) return null;

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
      {data.badge_text && (
        <span
          className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: "var(--ls-primary)",
            color: "var(--ls-on-primary)",
          }}
        >
          {data.badge_text}
        </span>
      )}

      {/* Message & Action Link */}
      <span style={{ color: "var(--ls-on-surface)" }}>
        {data.message_text}{" "}
        {data.link_text && data.link_url && (
          <Link
            href={data.link_url}
            className="inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline transition-all"
            style={{ color: "var(--ls-primary)" }}
          >
            {data.link_text} <ArrowRight className="w-3 h-3" />
          </Link>
        )}
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
