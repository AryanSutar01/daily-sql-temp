"use client";

import { LucideIcon, Database, Clock, Brain, Trophy, Code2, RefreshCw, Terminal, Layers, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

// --- Spotlight Card Component ---
// Replicates the Supabase hover spotlight effect
function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(120, 119, 198, 0.1)" // Default soft purple/brand
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
      className={`relative overflow-hidden rounded-xl border border-border/10 bg-[#121212] ${className}`}
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

// --- Visual Components for Cards ---
// Abstract visuals to match the Supabase technical/wireframe aesthetic

function DatabaseVisual() {
  return (
    <div className="absolute right-0 bottom-0 p-6 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity duration-500">
      {/* Abstract Database Layers representation */}
      <div className="flex flex-col gap-2 transform skew-y-[-10deg] rotate-[-5deg] translate-x-4 translate-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-48 h-12 rounded-lg border border-brand-base/40 bg-brand-base/5 backdrop-blur-sm flex items-center justify-center">
            <div className="w-full mx-4 h-[1px] bg-brand-base/20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeVisual() {
  return (
    <div className="absolute top-1/2 right-4 -translate-y-1/2 w-[280px] opacity-70 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
      <div className="rounded-md bg-[#000000] border border-border/20 p-4 font-mono text-xs text-muted-foreground shadow-2xl skew-x-[-10deg] skew-y-[-5deg] rotate-[-5deg] hover:skew-x-0 hover:skew-y-0 hover:rotate-0 transition-all duration-500">
        <div className="flex gap-1.5 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
        </div>
        <div className="space-y-1">
          <p><span className="text-purple-400">SELECT</span> customer_id,</p>
          <p className="pl-4"><span className="text-blue-400">SUM</span>(amount) <span className="text-purple-400">AS</span> total_spend</p>
          <p><span className="text-purple-400">FROM</span> orders</p>
          <p><span className="text-purple-400">GROUP BY</span> 1</p>
          <p><span className="text-purple-400">HAVING</span> total_spend {'>'} <span className="text-orange-300">1000</span>;</p>
        </div>
      </div>
    </div>
  );
}

function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}
    >
    </div>
  );
}


export function BentoGrid() {
  const items = [
    {
      title: "Real Business Problems",
      description: "Practice the exact scenarios you'll face at work. Cohort retention, funnel analysis, and revenue modeling—not abstract puzzles.",
      icon: Database,
      colSpan: "md:col-span-2",
      visual: <DatabaseVisual />,
      hasGrid: true
    },
    {
      title: "15 Minutes",
      description: "A daily habit that won't burn you out. Designed for the busy professional schedule.",
      icon: Clock,
      colSpan: "md:col-span-1",
      visual: (
        <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-brand-base flex items-center justify-center animate-spin-slow">
            <div className="w-2 h-2 rounded-full bg-brand-base"></div>
          </div>
        </div>
      )
    },
    {
      title: "Full SQL Support",
      description: "Window functions, CTEs (WITH clauses), and complex joins. Our editor supports standard PostgreSQL syntax.",
      icon: Terminal,
      colSpan: "md:col-span-1",
      visual: (
        <div className="absolute bottom-4 right-4 text-brand-base/20">
          <Terminal size={80} strokeWidth={1} />
        </div>
      )
    },
    {
      title: "Advanced Mastery",
      description: "Move beyond SELECT * FROM. Master lateral joins, recursive queries, and performance optimization techniques.",
      icon: Code2,
      colSpan: "md:col-span-2",
      visual: <CodeVisual />,
      hasGrid: true
    },
    {
      title: "Streak Tracking",
      description: "Visual streaks and progress monitoring to keep you accountable every single day.",
      icon: Trophy,
      colSpan: "md:col-span-1",
      visual: (
        <div className="absolute bottom-0 right-0 p-4 opacity-30">
          <div className="flex gap-1 justify-end items-end">
            <div className="w-4 h-8 bg-brand-base/40 rounded-t"></div>
            <div className="w-4 h-12 bg-brand-base/60 rounded-t"></div>
            <div className="w-4 h-6 bg-brand-base/30 rounded-t"></div>
            <div className="w-4 h-16 bg-brand-base/80 rounded-t"></div>
          </div>
        </div>
      )
    },
    {
      title: "Fresh Daily",
      description: "3 new questions every morning at 6 AM. No browsing deciding what to solve.",
      icon: RefreshCw,
      colSpan: "md:col-span-1",
      visual: (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-base/10 group-hover:rotate-180 transition-transform duration-700">
          <RefreshCw size={80} strokeWidth={1} />
        </div>
      )
    },
    {
      title: "No Setup Required",
      description: "Zero local environment configuration. Just log in and query.",
      icon: Sparkles,
      colSpan: "md:col-span-1",
      visual: (
        <div className="absolute inset-0 bg-brand-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )
    }
  ];

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
            Features designed for <br />
            <span className="text-brand-base">unbreakable consistency</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-zinc-400">
            Every aspect of the platform is engineered to remove friction and help you build a lasting daily habit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <SpotlightCard
              key={index}
              className={`group flex flex-col justify-between p-8 h-full min-h-[240px] z-10 hover:border-brand-base/50 transition-colors duration-300 ${item.colSpan}`}
              spotlightColor="rgba(var(--brand-base-rgb), 0.15)"
            >
              {item.hasGrid && <GridBackground />}
              {item.visual}

              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-zinc-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-[90%]">
                    {item.description}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

