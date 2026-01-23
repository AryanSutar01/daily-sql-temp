"use client";

import { useState, useEffect } from "react";
import {
    BarChart3,
    BrainCircuit,
    Database,
    Server,
    Briefcase,
    GraduationCap,
    LineChart,
    PieChart,
    Terminal,
    Sparkles
} from "lucide-react";

export function TargetAudience() {
    const professions = [
        { id: "data_engineer", label: "Data Engineer", icon: Database },
        { id: "data_analyst", label: "Data Analysts", icon: BarChart3 },
        { id: "data_scientist", label: "Data Scientists", icon: BrainCircuit },
        { id: "business_analyst", label: "Business Analyst", icon: LineChart },
        { id: "data_enthusiast", label: "Data Enthusiast", icon: Sparkles },
        { id: "product_analyst", label: "Product Analyst", icon: PieChart },
        { id: "student", label: "Students", icon: GraduationCap },
        { id: "backend_engineer", label: "Backend Engineer", icon: Server },
        { id: "analytics_engineer", label: "Analytics Engineer", icon: Briefcase },
        { id: "sql_developer", label: "SQL Developer", icon: Terminal }
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
        <section className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-border/50 overflow-hidden">
            {/* Background Dot Pattern */}
            <div className="absolute inset-0 bg-dot-white pointer-events-none z-[-1] opacity-30" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">

                    {/* Left: Heading with Hierarchy */}
                    <div className="text-center md:text-left shrink-0">
                        <h2 className="font-bold tracking-tight">
                            <span className="block text-lg text-[#7588A3] mb-0.5">
                                Daily SQL for
                            </span>
                            <span
                                key={activeId}
                                className="block text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-[#30B5A6] to-[#4DD4C4] bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-2 duration-300 pb-1"
                            >
                                {activeProfession.label}
                            </span>
                        </h2>
                    </div>

                    {/* Right: Interactive Icons Row - Single Line on Desktop */}
                    <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-2 sm:gap-3 w-full max-w-4xl">
                        {professions.map((profession) => {
                            const Icon = profession.icon;
                            const isActive = activeId === profession.id;
                            return (
                                <button
                                    key={profession.id}
                                    onMouseEnter={() => setActiveId(profession.id)}
                                    onClick={() => setActiveId(profession.id)}
                                    className={`p-3 rounded-xl transition-all duration-300 ${isActive
                                        ? "bg-[#30B5A6]/10 text-[#30B5A6] scale-110 ring-1 ring-[#30B5A6]/20 shadow-lg shadow-[#30B5A6]/10"
                                        : "text-[#7588A3] hover:text-[#F9FAFB] hover:bg-white/5"
                                        }`}
                                    aria-label={profession.label}
                                >
                                    <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
