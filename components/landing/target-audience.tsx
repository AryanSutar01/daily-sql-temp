"use client";

import { useState } from "react";
import {
  BarChart3,
  BrainCircuit,
  Database,
  Server,
  LineChart,
  Briefcase,
  GraduationCap
} from "lucide-react";

export function TargetAudience() {
  const professions = [
    {
      id: "data_analyst",
      label: "Data Analysts",
      icon: BarChart3,
      description: "Keep your querying skills sharp for ad-hoc analysis and reporting."
    },
    {
      id: "data_scientist",
      label: "Data Scientists",
      icon: BrainCircuit,
      description: "Master complex joins and aggregations for feature engineering."
    },
    {
      id: "analytics_engineer",
      label: "Analytics Engineers",
      icon: Database,
      description: "Practice data modeling and transformation logic (dbt style)."
    },
    {
      id: "backend_engineer",
      label: "Backend Engineers",
      icon: Server,
      description: "Optimize your application queries and understand execution plans."
    },
    {
      id: "business_analyst",
      label: "Business Analysts",
      icon: LineChart,
      description: "Translate business questions into SQL queries with confidence."
    },
    {
      id: "product_manager",
      label: "Product Managers",
      icon: Briefcase,
      description: "Pull your own data without waiting on the data team."
    },
    {
      id: "student",
      label: "Students",
      icon: GraduationCap,
      description: "Prepare for technical interviews with real-world scenarios."
    }
  ];

  const [activeId, setActiveId] = useState(professions[0].id);
  const activeProfession = professions.find((p) => p.id === activeId) || professions[0];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white">
      <div className="max-w-4xl mx-auto text-center space-y-12">

        {/* Dynamic Heading */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-muted-foreground">
            Daily SQL for{" "}
            <span className="block mt-2 text-white font-bold animate-in fade-in slide-in-from-bottom-2 duration-300 key={activeId}">
              {activeProfession.label}
            </span>
          </h2>
          <p className="text-lg text-zinc-400 h-8 transition-opacity duration-300">
            {activeProfession.description}
          </p>
        </div>

        {/* Icon Selector */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
          {professions.map((profession) => {
            const Icon = profession.icon;
            const isActive = activeId === profession.id;

            return (
              <button
                key={profession.id}
                onClick={() => setActiveId(profession.id)}
                onMouseEnter={() => setActiveId(profession.id)}
                className={`relative group p-4 rounded-xl transition-all duration-300 outline-none
                  ${isActive
                    ? "bg-white/10 text-brand-base scale-110 shadow-[0_0_20px_-5px_rgba(var(--brand-base-rgb),0.3)] ring-1 ring-brand-base/50"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5 hover:scale-105"
                  }
                `}
                aria-label={`Select ${profession.label}`}
              >
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-transform duration-300"
                />

                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-base animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}

