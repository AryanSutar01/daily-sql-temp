"use client";

import {
  LucideIcon,
  Calendar,
  Zap,
  Code2,
  Clock,
  TrendingUp,
  Target
} from "lucide-react";
import { useRef, useState } from "react";

function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(77, 212, 196, 0.15)" // Teal spotlight
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
      title: "New questions every day",
      description: "Fresh problems daily. No recycled content—each morning brings new challenges tailored to real work scenarios.",
      icon: Calendar,
    },
    {
      title: "Three difficulty levels",
      description: "Easy to warm up, medium to practice, advanced to push your limits. Cover the full spectrum every day.",
      icon: Zap,
    },
    {
      title: "Real-world SQL patterns",
      description: "Window functions, CTEs, complex aggregations, date calculations. The patterns you need in production.",
      icon: Code2,
    },
    {
      title: "15 minutes or less",
      description: "Designed for busy schedules. Get in, practice, get out. No time wasted on irrelevant problems.",
      icon: Clock,
    },
    {
      title: "Streak & mastery tracking",
      description: "Build consistency with daily streaks. Track your progress across SQL concepts without competitive pressure.",
      icon: TrendingUp,
    },
    {
      title: "Business-focused problems",
      description: "Analyze revenue, calculate retention, build funnels. Problems that mirror real data team work.",
      icon: Target,
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#080c16]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
            Built for working professionals
          </h2>
          <p className="text-lg text-[#7b8ca3] text-center mb-16 max-w-2xl mx-auto">
            Every feature designed to maximize learning in minimal time
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-[#121826] border border-[#202736] hover:border-[#4DD4C4]/30 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[#4DD4C4]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[#4DD4C4]" />
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

