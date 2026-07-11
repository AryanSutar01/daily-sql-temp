"use client";

import {
  LucideIcon,
  Calendar,
  Zap,
  Code2,
  TrendingUp,
  Users,
  MessageSquare,
  Database,
  Server,
  Trophy
} from "lucide-react";
import { useRef, useState } from "react";

function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(77, 212, 196, 0.15)"
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-[#202736] bg-[#121826]/50 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function BentoGrid() {
  const features = [
    {
      title: "SQL + Python + PySpark",
      description: "One platform for all three core data skills. SQL in PostgreSQL, Python via Pandas, and PySpark with a warm SparkSession — each running in real isolated sandboxes.",
      icon: Database,
      accent: "text-sky-400",
      accentBg: "bg-sky-400/10",
    },
    {
      title: "9 new problems every day",
      description: "3 problems per discipline every morning. Easy to warm up, Medium to practice, Advanced to push limits. No recycled content — fresh challenges every day.",
      icon: Calendar,
      accent: "text-[#4DD4C4]",
      accentBg: "bg-[#4DD4C4]/10",
    },
    {
      title: "Real-world data patterns",
      description: "Window functions, CTEs, cohort retention, sessionization, Spark transformations. The patterns that appear in real data team work — not toy puzzles.",
      icon: Code2,
      accent: "text-amber-400",
      accentBg: "bg-amber-400/10",
    },
    {
      title: "Streak & progress tracking",
      description: "Build a daily habit with streak tracking and solve history. Your public profile shows your heatmap and stats across all three disciplines.",
      icon: TrendingUp,
      accent: "text-[#4DD4C4]",
      accentBg: "bg-[#4DD4C4]/10",
    },
    {
      title: "Leaderboard & community",
      description: "See where you stand on the weekly leaderboard. Every problem has a discussion thread — share your approach, read alternatives, and learn from peers.",
      icon: Trophy,
      accent: "text-violet-400",
      accentBg: "bg-violet-400/10",
    },
    {
      title: "15 minutes is enough",
      description: "Designed for busy schedules. Three disciplines, three difficulties — one focused session. No decision fatigue, no overwhelm.",
      icon: Zap,
      accent: "text-rose-400",
      accentBg: "bg-rose-400/10",
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#080c16]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
            Built for working data professionals
          </h2>
          <p className="text-lg text-[#7b8ca3] text-center mb-16 max-w-2xl mx-auto">
            Every feature designed to maximize learning across SQL, Python, and PySpark — in minimal time
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-[#121826] border border-[#202736] hover:border-[#4DD4C4]/30 transition-colors duration-300"
              >
                <div className={`w-10 h-10 rounded-lg ${feature.accentBg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-5 h-5 ${feature.accent}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-[#7b8ca3] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
