"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Light/dark switch for layouts that don't render the main navbar
 * (practice workspace, auth pages). Uses the same next-themes state as the navbar toggle.
 * The icon swaps via the `.dark` class (CSS), so it is correct on the very first paint.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border transition-colors duration-200 hover:scale-105 ${className}`}
      style={{
        background: "var(--ls-surface-container)",
        borderColor: "var(--ls-outline)",
        color: "var(--ls-on-surface-muted)",
      }}
    >
      <Sun size={15} className="hidden dark:block" />
      <Moon size={15} className="dark:hidden" />
    </button>
  );
}
