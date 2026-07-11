"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
    {
        question: "What disciplines does Daily SQL cover?",
        answer: "Daily SQL covers three core data skills: SQL (PostgreSQL), Python with Pandas, and PySpark. Every day you get 9 problems total — 3 per discipline — each available in Easy, Medium, and Advanced difficulty.",
    },
    {
        question: "Is this for beginners or experienced professionals?",
        answer: "Both. We offer Easy, Medium, and Advanced problems for each discipline. Beginners can start with Easy to build confidence, while experienced professionals use Medium and Advanced to stay sharp and interview-ready.",
    },
    {
        question: "How much time do I need each day?",
        answer: "Just 15 minutes. You can tackle all 9 problems or focus on one discipline. The format is designed for busy professionals — no binge sessions required.",
    },
    {
        question: "How is code executed? Is it safe?",
        answer: "Every submission runs in an isolated sandbox. SQL runs in a temporary PostgreSQL schema that is created and dropped per request. Python and PySpark run in Docker containers with restricted builtins — no internet access, no OS calls. Your code never touches any real data.",
    },
    {
        question: "Is Daily SQL free?",
        answer: "Yes, Daily SQL is free to start. Sign up with Google or email and get immediate access to the daily problem set, streak tracking, leaderboard, and discussion threads.",
    },
    {
        question: "Can I practice more than 9 problems per day?",
        answer: "The daily set is 9 fresh problems. This is intentional — it prevents binge-and-quit cycles and builds long-term consistency. You can also use our structured tutorial tracks (SQL, Python, PySpark) for additional learning at any time.",
    },
    {
        question: "What happens if I miss a day?",
        answer: "Your streak resets, but your full solve history, stats, and public profile stay intact. Streaks are a motivational tool, not a punishment — just start a new one!",
    },
    {
        question: "Do you have learning resources, not just problems?",
        answer: "Yes. We have full tutorial tracks for SQL (52 lessons), Python/Pandas (52 lessons), and PySpark (46 lessons). They're structured to complement the daily problems — use tutorials to learn, problems to reinforce.",
    },
    {
        question: "Is this interview-focused or job-focused?",
        answer: "Both. Problems are based on real business scenarios — revenue analysis, cohort retention, sessionization, data pipeline transformations. These are exactly what top tech companies ask in interviews and what data teams solve daily at work.",
    },
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24 md:py-32 bg-[#121826]/30">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                            Common questions
                        </h2>
                        <p className="text-lg text-[#7b8ca3]">
                            Everything you need to know
                        </p>
                    </div>

                    <div className="space-y-4">
                        {FAQS.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={index}
                                    className={`border rounded-lg px-6 transition-colors duration-200 ${isOpen
                                            ? "bg-[#121826] border-[#4DD4C4]/30"
                                            : "bg-[#080c16]/50 border-[#202736] hover:border-[#202736]/80"
                                        }`}
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="flex w-full items-center justify-between py-4 text-left font-medium text-white focus:outline-none"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown
                                            className={`h-4 w-4 text-[#7b8ca3] transition-transform duration-200 shrink-0 ml-4 ${isOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100 pb-4" : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <p className="text-sm text-[#7b8ca3] leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
