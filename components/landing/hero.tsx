"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BarChart3,
  BrainCircuit,
  Database,
  Server,
  LineChart,
  Briefcase,
  GraduationCap
} from "lucide-react";

export function Hero() {
  const professions = [
    { id: "data_analyst", label: "Data Analysts", icon: BarChart3 },
    { id: "data_scientist", label: "Data Scientists", icon: BrainCircuit },
    { id: "analytics_engineer", label: "Analytics Engineers", icon: Database },
    { id: "backend_engineer", label: "Backend Engineers", icon: Server },
    { id: "product_manager", label: "Product Managers", icon: Briefcase },
    { id: "student", label: "Students", icon: GraduationCap }
  ];

  const [activeId, setActiveId] = useState(professions[0].id);
  const activeProfession = professions.find((p) => p.id === activeId) || professions[0];

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = professions.findIndex((p) => p.id === activeId);
      const nextIndex = (currentIndex + 1) % professions.length;
      setActiveId(professions[nextIndex].id);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeId]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20">
      {/* Premium Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-[-1]">
        <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-brand-light/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-brand-base/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-12">

        {/* Main Heading Group */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Daily SQL for
            </h1>

            {/* Interactive Profession Selector */}
            <div className="h-24 flex items-center justify-center overflow-hidden">
              <span
                key={activeId}
                className="block text-brand-base bg-gradient-to-r from-brand-base to-brand-light bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out"
              >
                {activeProfession.label}
              </span>
            </div>

            {/* Icons Row */}
            <div className="flex justify-center gap-3 pt-2 pb-6">
              {professions.map((profession) => {
                const Icon = profession.icon;
                const isActive = activeId === profession.id;
                return (
                  <button
                    key={profession.id}
                    onMouseEnter={() => setActiveId(profession.id)}
                    onClick={() => setActiveId(profession.id)}
                    className={`p-3 rounded-lg transition-all duration-300 ${isActive
                      ? "bg-brand-base/10 text-brand-base scale-110 ring-1 ring-brand-base/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    aria-label={profession.label}
                  >
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Stay sharp in SQL with just 15 minutes a day. <br className="hidden sm:block" />
            Real business problems. Consistent practice. No grind.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="bg-brand-base hover:bg-brand-dark text-white font-semibold px-10 py-7 text-lg shadow-lg shadow-brand-base/20 hover:shadow-brand-base/30 transition-all duration-200">
            <Link href="/waitlist">Start your daily practice</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-2 border-border/50 px-10 py-7 text-lg hover:bg-accent/50 transition-all duration-200">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


