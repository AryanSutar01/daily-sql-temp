"use client";

import { Check, X } from "lucide-react";

export function TargetAudience() {
    return (
        <section className="py-24 md:py-32 bg-[#121826]/30 border-y border-[#202736]">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                            Is this for you?
                        </h2>
                        <p className="text-lg text-[#7b8ca3] max-w-2xl mx-auto">
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
                                SQLDaily is for you if you're...
                            </h3>
                            <ul className="space-y-4 pl-2">
                                {[
                                    "Data Analysts who write SQL daily",
                                    "Data Engineers building pipelines",
                                    "Analytics Engineers working with dbt",
                                    "Backend Engineers with database work",
                                    "Professionals preparing for interviews",
                                    "Anyone who knows SQL but wants to stay sharp"
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
                                    "Complete SQL beginners",
                                    "People looking for certification prep",
                                    "Those who prefer competitive leaderboards",
                                    "Anyone wanting to binge-learn in one weekend"
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
