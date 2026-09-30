"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  BookOpen,
  Database,
  Code2,
  Play,
  Flame,
  Trophy,
} from "lucide-react";

export type TourStep = {
  targetId: string | null; // null = centered welcome modal
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  icon?: React.ReactNode;
};

interface WalkthroughTourProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const PADDING = 12; // px padding around spotlight

function getRect(id: string | null): DOMRect | null {
  if (!id) return null;
  const el = document.getElementById(id);
  return el ? el.getBoundingClientRect() : null;
}

function TooltipArrow({ position }: { position: string }) {
  const base = "absolute w-0 h-0";
  const styles: Record<string, string> = {
    top: `${base} bottom-[-8px] left-1/2 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.08)]`,
    bottom: `${base} top-[-8px] left-1/2 -translate-x-1/2 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white drop-shadow-[0_-2px_2px_rgba(0,0,0,0.08)]`,
    left: `${base} right-[-8px] top-1/2 -translate-y-1/2 border-t-[8px] border-b-[8px] border-l-[8px] border-t-transparent border-b-transparent border-l-white drop-shadow-[2px_0_2px_rgba(0,0,0,0.08)]`,
    right: `${base} left-[-8px] top-1/2 -translate-y-1/2 border-t-[8px] border-b-[8px] border-r-[8px] border-t-transparent border-b-transparent border-r-white drop-shadow-[-2px_0_2px_rgba(0,0,0,0.08)]`,
    center: "",
  };
  return <div className={styles[position] || ""} />;
}

export function WalkthroughTour({
  steps,
  isActive,
  onComplete,
  onSkip,
}: WalkthroughTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowPos, setArrowPos] = useState("top");
  const [animKey, setAnimKey] = useState(0);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const TOOLTIP_W = 340;
  const TOOLTIP_H = 220;

  const computeLayout = useCallback(() => {
    if (!step) return;

    const rect = getRect(step.targetId);
    setSpotlightRect(rect);

    if (!rect || step.position === "center" || !step.targetId) {
      // Center modal
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: TOOLTIP_W,
        zIndex: 10001,
      });
      setArrowPos("center");
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = PADDING;
    const gap = 16; // gap between element and tooltip

    // Try positions in order: bottom, top, right, left
    const positions: Array<{ pos: string; style: React.CSSProperties }> = [
      // Bottom
      {
        pos: "top",
        style: {
          position: "fixed",
          top: rect.bottom + pad + gap,
          left: Math.min(
            Math.max(8, rect.left + rect.width / 2 - TOOLTIP_W / 2),
            vw - TOOLTIP_W - 8
          ),
          width: TOOLTIP_W,
          zIndex: 10001,
        },
      },
      // Top
      {
        pos: "bottom",
        style: {
          position: "fixed",
          top: rect.top - pad - TOOLTIP_H - gap,
          left: Math.min(
            Math.max(8, rect.left + rect.width / 2 - TOOLTIP_W / 2),
            vw - TOOLTIP_W - 8
          ),
          width: TOOLTIP_W,
          zIndex: 10001,
        },
      },
      // Right
      {
        pos: "left",
        style: {
          position: "fixed",
          top: Math.min(
            Math.max(8, rect.top + rect.height / 2 - TOOLTIP_H / 2),
            vh - TOOLTIP_H - 8
          ),
          left: rect.right + pad + gap,
          width: TOOLTIP_W,
          zIndex: 10001,
        },
      },
      // Left
      {
        pos: "right",
        style: {
          position: "fixed",
          top: Math.min(
            Math.max(8, rect.top + rect.height / 2 - TOOLTIP_H / 2),
            vh - TOOLTIP_H - 8
          ),
          left: rect.left - pad - TOOLTIP_W - gap,
          width: TOOLTIP_W,
          zIndex: 10001,
        },
      },
    ];

    // Pick the first position that fits
    const chosen = positions.find((p) => {
      const s = p.style as any;
      return (
        s.top >= 0 &&
        (s.left ?? 0) >= 0 &&
        (s.top + TOOLTIP_H) <= vh &&
        ((s.left ?? 0) + TOOLTIP_W) <= vw
      );
    }) || positions[0];

    setTooltipStyle(chosen.style);
    setArrowPos(chosen.pos);
  }, [step]);

  // Recompute when step changes
  useEffect(() => {
    if (!isActive) return;
    setAnimKey((k) => k + 1);
    // Small delay to allow DOM to settle (e.g. sidebar expanding)
    const t = setTimeout(computeLayout, 80);
    return () => clearTimeout(t);
  }, [currentStep, isActive, computeLayout]);

  // Scroll target element into view
  useEffect(() => {
    if (!isActive || !step?.targetId) return;
    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep, isActive, step?.targetId]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
      if (e.key === "ArrowRight" && !isLastStep)
        setCurrentStep((s) => s + 1);
      if (e.key === "ArrowLeft" && !isFirstStep)
        setCurrentStep((s) => s - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isActive, isLastStep, isFirstStep, onSkip]);

  if (!isActive || !step) return null;

  const sp = spotlightRect;
  const spTop = sp ? sp.top - PADDING : 0;
  const spLeft = sp ? sp.left - PADDING : 0;
  const spW = sp ? sp.width + PADDING * 2 : 0;
  const spH = sp ? sp.height + PADDING * 2 : 0;

  return (
    <>
      {/* Dimmed overlay using 4 panels (curtain effect) */}
      {sp ? (
        <>
          {/* Top */}
          <div
            className="fixed inset-x-0 top-0 bg-black/45 z-[10000] pointer-events-none transition-all duration-300"
            style={{ height: Math.max(0, spTop) }}
          />
          {/* Bottom */}
          <div
            className="fixed inset-x-0 bottom-0 bg-black/45 z-[10000] pointer-events-none transition-all duration-300"
            style={{ top: Math.max(0, spTop + spH) }}
          />
          {/* Left */}
          <div
            className="fixed left-0 bg-black/45 z-[10000] pointer-events-none transition-all duration-300"
            style={{
              top: Math.max(0, spTop),
              height: spH,
              width: Math.max(0, spLeft),
            }}
          />
          {/* Right */}
          <div
            className="fixed right-0 bg-black/45 z-[10000] pointer-events-none transition-all duration-300"
            style={{
              top: Math.max(0, spTop),
              height: spH,
              left: Math.max(0, spLeft + spW),
            }}
          />
          {/* Spotlight border ring */}
          <div
            className="fixed z-[10000] pointer-events-none rounded-xl border-2 border-[#1f9e8e] shadow-[0_0_0_4px_rgba(31,158,142,0.25)] transition-all duration-300"
            style={{
              top: spTop,
              left: spLeft,
              width: spW,
              height: spH,
            }}
          />
        </>
      ) : (
        /* Full overlay for centered modal */
        <div className="fixed inset-0 bg-black/45 z-[10000] pointer-events-none" />
      )}

      {/* Click-capture overlay (prevents interacting with underlying content) */}
      <div
        className="fixed inset-0 z-[9999]"
        onClick={onSkip}
        style={{ cursor: "default" }}
      />

      {/* Tooltip Card */}
      <div
        key={animKey}
        style={tooltipStyle}
        className="animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-white border border-[#dedee2] rounded-2xl shadow-[0_12px_40px_rgba(31,158,142,0.18)] overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1f9e8e] to-transparent" />

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                {step.icon && (
                  <div className="p-1.5 rounded-lg bg-[#e6f7f5] border border-[#1f9e8e]/30 text-[#1f9e8e] shrink-0">
                    {step.icon}
                  </div>
                )}
                <h3 className="text-sm font-bold font-mono text-zinc-900 tracking-tight">
                  {step.title}
                </h3>
              </div>
              <button
                onClick={onSkip}
                className="text-zinc-400 hover:text-zinc-700 transition-colors p-1 rounded-lg hover:bg-zinc-100 shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed mb-4">
              {step.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3">
              {/* Step dots */}
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === currentStep
                        ? "w-4 h-1.5 bg-[#1f9e8e]"
                        : "w-1.5 h-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <button
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-zinc-700 hover:text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
                  >
                    <ArrowLeft size={12} /> Back
                  </button>
                )}
                {isLastStep ? (
                  <button
                    onClick={onComplete}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold text-white bg-[#1f9e8e] hover:bg-[#177a6d] rounded-lg transition-all shadow-[0_2px_8px_rgba(31,158,142,0.25)]"
                  >
                    <Sparkles size={12} /> Let's go!
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep((s) => s + 1)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold text-white bg-[#1f9e8e] hover:bg-[#177a6d] rounded-lg transition-all shadow-[0_2px_8px_rgba(31,158,142,0.25)]"
                  >
                    Next <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Skip */}
            <div className="mt-3 text-center">
              <button
                onClick={onSkip}
                className="text-[10px] text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                Skip tour (Esc)
              </button>
            </div>
          </div>

          <TooltipArrow position={arrowPos} />
        </div>
      </div>
    </>
  );
}

// ── Pre-built tour steps for the Daily Practice arena ──────────────────────

export const PRACTICE_TOUR_STEPS: TourStep[] = [
  {
    targetId: null,
    title: "Welcome to Daily SQL! 🎉",
    description:
      "You've joined a community of data professionals. Every day brings 9 fresh problems — SQL, Python & PySpark. Let's take a 60-second tour so you can hit the ground running.",
    position: "center",
    icon: <Sparkles size={14} />,
  },
  {
    targetId: "tour-sidebar-today-tab",
    title: "Today's Daily Set",
    description:
      "These are your 9 challenges for today — 3 SQL, 3 Python, 3 PySpark. Fresh questions drop every day at midnight. Building a daily habit is the secret to mastering data skills.",
    position: "right",
    icon: <Layers size={14} />,
  },
  {
    targetId: "tour-problem-card",
    title: "Pick a Problem",
    description:
      "Click any card to open it. A teal ✓ means it's solved. Each card shows difficulty (Basic / Intermediate / Advanced) and the challenge type.",
    position: "right",
    icon: <BookOpen size={14} />,
  },
  {
    targetId: "tour-problem-description",
    title: "Read the Scenario",
    description:
      "Every problem is a real-world business scenario. Read the context carefully, study the schema and sample data, then craft your solution.",
    position: "right",
    icon: <Database size={14} />,
  },
  {
    targetId: "tour-code-editor",
    title: "Write Your Solution",
    description:
      "This is your workspace. Write SQL, Python (Pandas), or PySpark here. Syntax highlighting and auto-complete are built in. Your draft auto-saves as you type.",
    position: "left",
    icon: <Code2 size={14} />,
  },
  {
    targetId: "tour-run-button",
    title: "Run & Submit",
    description:
      'Hit "Run" to test your query against the real dataset. When the result matches the expected output, the "Submit" button activates — click it to lock in your solve.',
    position: "bottom",
    icon: <Play size={14} />,
  },
  {
    targetId: "tour-streak",
    title: "Build Your Streak 🔥",
    description:
      "Every day you solve at least one problem extends your streak. Your profile tracks your heatmap, solved count, and leaderboard rank. Come back tomorrow — you got this!",
    position: "bottom",
    icon: <Flame size={14} />,
  },
];
