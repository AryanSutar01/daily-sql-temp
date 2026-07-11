"use client";

import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "I've been using Daily SQL for two months straight. The mix of SQL, Python, and PySpark in one place is exactly what I needed. My interview confidence is through the roof.",
    name: "Priya M.",
    role: "Senior Data Analyst",
    company: "Fintech startup",
    avatar: "PM",
    avatarColor: "bg-violet-500",
  },
  {
    quote: "15 minutes a day sounds too simple to work. But after 47 days, I'm writing window functions faster than ever. The streak makes it addictive in the best way.",
    name: "Rahul S.",
    role: "Data Engineer",
    company: "E-commerce scale-up",
    avatar: "RS",
    avatarColor: "bg-sky-500",
  },
  {
    quote: "The PySpark problems are genuinely hard in a good way. They match what we actually do in production. Nothing else I found online came close.",
    name: "Arjun K.",
    role: "Analytics Engineer",
    company: "SaaS company",
    avatar: "AK",
    avatarColor: "bg-amber-500",
  },
];



export function SocialProof() {
  return (
    <section className="py-24 md:py-32 bg-[#080c16]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">


          {/* Heading */}
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
              Loved by data professionals
            </h2>
            <p className="text-base md:text-lg text-[#7b8ca3] max-w-xl mx-auto">
              See what practitioners are saying after building a daily practice habit
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="relative p-6 rounded-xl bg-[#121826] border border-[#202736] hover:border-[#4DD4C4]/25 transition-colors duration-300 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-[#4DD4C4] text-[#4DD4C4]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-zinc-300 text-sm leading-relaxed flex-1 mb-6">
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[#7b8ca3]">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
