"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
    {
        question: "Is this for SQL beginners?",
        answer: "Yes! We offer three difficulty levels: Basic, Intermediate, and Advanced. Beginners can start with Basic questions to build confidence before moving up.",
    },
    {
        question: "How much time do I need each day?",
        answer: "Just 15 minutes. Our problems are designed to be solved quickly so you can build a consistent habit without burning out.",
    },
    {
        question: "Is this interview-focused or job-focused?",
        answer: "Both. The problems are based on real-world business scenarios (like revenue analysis, retention, etc.) which are exactly what top tech companies ask in interviews.",
    },
    {
        question: "What SQL dialects are supported?",
        answer: "We support standard PostgreSQL syntax, which is the most widely used and transferable dialect in the industry.",
    },
    {
        question: "Can I practice more than 3 questions per day?",
        answer: "Currently, we release exactly 3 new questions daily to prevent 'binge-and-quit' cycles/decision fatigue. The goal is long-term consistency.",
    },
    {
        question: "What happens if I miss a day?",
        answer: "Your streak will reset, but your mastery progress and solved history remain safe. Consistency is key!",
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
                                            className={`h-4 w-4 text-[#7b8ca3] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0"
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
