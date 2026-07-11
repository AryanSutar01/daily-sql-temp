"use client";

import { Check, X } from "lucide-react";

export function TargetAudience() {
    return (
        <section className="py-24 md:py-32 bg-[#121826]/30 border-y border-[#202736]">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10 md:mb-16 text-center">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
                            Is this for you?
                        </h2>
                        <p className="text-base md:text-lg text-[#7b8ca3] max-w-2xl mx-auto">
                            We're opinionated about who we build for
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Pros Column */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold flex items-center gap-3 text-white">
                                <div className="w-8 h-8 rounded-full bg-[#4DD4C4]/10 flex items-center justify-center border border-[#4DD4C4]/20">
                                    <Check className="w-4 h-4 text-[#4DD4C4]" />
                                </div>
                                Daily SQL is for you if you're...
                            </h3>
                            <ul className="space-y-4 pl-2">
                                {[
                                    "Data Analysts who write SQL and Python daily",
                                    "Data Engineers building pipelines with Spark or Python",
                                    "Analytics Engineers working with dbt and SQL",
                                    "Data Scientists who want to stay sharp on querying",
                                    "Backend Engineers with regular database work",
                                    "Professionals preparing for data interviews",
                                    "Anyone who knows these tools but wants to stay sharp",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-zinc-300">
                                        <Check className="w-5 h-5 text-[#4DD4C4] mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cons Column */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold flex items-center gap-3 text-[#7b8ca3]">
                                <div className="w-8 h-8 rounded-full bg-[#202736] flex items-center justify-center border border-[#202736]">
                                    <X className="w-4 h-4 text-[#7b8ca3]" />
                                </div>
                                This might not be for you if you're...
                            </h3>
                            <ul className="space-y-4 pl-2">
                                {[
                                    "Complete beginners to SQL and programming",
                                    "Looking for certification prep (AWS, Google, etc.)",
                                    "Wanting to binge-learn a topic in one weekend",
                                    "Looking for a passive video course",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[#7b8ca3]">
                                        <X className="w-5 h-5 text-[#7b8ca3] mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
