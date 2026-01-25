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

export function ProfessionAnimation() {
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
        }, 2000);

        return () => clearInterval(interval);
    }, [activeId]);

    return (
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden bg-black/20">
            {/* Background Dot Pattern */}
            <div className="absolute inset-0 bg-dot-white pointer-events-none z-[-1] opacity-20" />

            {/* Decorative Circles - Left Side */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 hidden md:block">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-[#30B5A6]/10 blur-2xl" />
                    <div className="absolute top-16 left-8 w-20 h-20 rounded-full bg-[#4DD4C4]/5 blur-xl" />
                </div>
            </div>

            {/* Decorative Circles - Right Side */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 hidden md:block">
                <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-[#4DD4C4]/10 blur-3xl" />
                    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#30B5A6]/5 blur-2xl" />
                </div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col items-center gap-10">

                    {/* Centered Heading */}
                    <div className="text-center space-y-2">
                        <h2 className="font-bold tracking-tight">
                            <span className="block text-base sm:text-lg text-zinc-500 mb-1">
                                Daily SQL for
                            </span>
                            <span
                                key={activeId}
                                className="block text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-[#30B5A6] to-[#4DD4C4] bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-2 duration-300 pb-2"
                            >
                                {activeProfession.label}
                            </span>
                        </h2>
                    </div>

                    {/* Centered Interactive Icons Grid */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-3xl">
                        {professions.map((profession) => {
                            const Icon = profession.icon;
                            const isActive = activeId === profession.id;
                            return (
                                <button
                                    key={profession.id}
                                    onMouseEnter={() => setActiveId(profession.id)}
                                    onClick={() => setActiveId(profession.id)}
                                    className={`relative p-3 rounded-xl transition-all duration-300 ${isActive
                                        ? "bg-[#30B5A6]/10 text-[#30B5A6] ring-1 ring-[#30B5A6]/20"
                                        : "text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02]"
                                        }`}
                                    aria-label={profession.label}
                                >
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
