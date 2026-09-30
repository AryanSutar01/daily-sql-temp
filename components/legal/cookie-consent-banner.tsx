"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { getCookieConsent, setCookieConsent, onCookieConsentChange } from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  // useSyncExternalStore (not useState+useEffect): the server snapshot assumes consent is
  // already decided (banner hidden), so SSR/hydration never flashes it; once mounted, React
  // re-checks localStorage and shows it if no choice has been made yet — and Accept/Decline
  // (which dispatch the same event this subscribes to) hide it again immediately.
  const hasDecided = useSyncExternalStore(
    onCookieConsentChange,
    () => getCookieConsent() !== null,
    () => true
  );

  if (hasDecided) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[999] p-3 sm:p-5 pointer-events-none">
      <div
        role="dialog"
        aria-label="Cookie preferences"
        className="pointer-events-auto max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white dark:bg-[#0F1419] border border-zinc-200 dark:border-[#20283C] rounded-2xl shadow-xl p-4 sm:p-5"
      >
        <div className="w-9 h-9 rounded-xl bg-[#1f9e8e]/10 flex items-center justify-center shrink-0">
          <Cookie size={18} className="text-[#1f9e8e]" />
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 flex-1 leading-relaxed">
          We use essential cookies to keep you signed in, and optional analytics cookies (Google
          Analytics) to understand how the site is used. See our{" "}
          <Link href="/privacy#cookies" className="underline text-[#1f9e8e] font-semibold">
            Cookie Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setCookieConsent("declined")}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => setCookieConsent("accepted")}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-[#1f9e8e] hover:bg-[#177a6d] text-white transition-colors shadow-2xs"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
