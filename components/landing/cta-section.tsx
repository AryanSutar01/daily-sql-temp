"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    return (
        <section id="pricing">
            <section className="py-24 md:py-32 bg-[#080c16]">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">

                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4DD4C4]/30 bg-[#4DD4C4]/10 text-sm text-[#4DD4C4] mb-8 font-medium">
                            Early Access
                        </span>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                            Join the early access
                        </h2>

                        <p className="text-lg text-[#7b8ca3] mb-12">
                            We're rolling out access gradually to ensure quality. Join now to lock in early adopter pricing when we launch.
                        </p>

                        <div className="p-8 rounded-2xl bg-[#121826] border border-[#202736] shadow-xl relative overflow-hidden">
                            {/* Card Content */}
                            <div className="mb-6 text-center flex items-center justify-center">
                                <span className="text-4xl font-bold text-white">Free</span>
                                <span className="text-[#7b8ca3] ml-2">during early access</span>
                            </div>

                            <ul className="text-left space-y-3 mb-8">
                                {[
                                    "3 new SQL questions every day",
                                    "Easy, Medium, and Advanced difficulties",
                                    "Streak and progress tracking",
                                    "Real-world business problems",
                                    "Early adopter pricing locked in"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[#7b8ca3]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4DD4C4] shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#4DD4C4] text-[#080c16] font-bold hover:bg-[#3dbdb0] shadow-[0_0_60px_rgba(77,212,196,0.15)] hover:shadow-[0_0_80px_rgba(77,212,196,0.25)] transition-all duration-300 h-14 rounded-lg px-10 text-base w-full">
                                Join early access
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                    </div>
                </div>
            </section>
        </section>
    );
}
