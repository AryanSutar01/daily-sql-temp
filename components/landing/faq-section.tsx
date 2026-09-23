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
    answer: "Every submission runs in an isolated sandbox. SQL runs in a temporary PostgreSQL schema created and dropped per request. Python and PySpark run in Docker containers with restricted builtins — no internet access, no OS calls.",
  },
  {
    question: "Is Daily SQL free?",
    answer: "Yes, Daily SQL offers a 100% Free Tier (₹0) with immediate access to daily problems (SQL, Python, PySpark), streak tracking, live code execution, and leaderboards. To unlock the full archive, step-by-step editorial solutions, and advanced interview prep tracks, we offer flexible paid plans.",
  },
  {
    question: "What plans and pricing options are available?",
    answer: "We offer 4 simple options: Free Tier (₹0 forever for daily practice), Monthly Pro (₹899/month for targeted 30-day interview prep), Yearly Pro (₹1,499/year — just ₹125/month for annual mastery), and Lifetime VIP (₹4,999 one-time payment for permanent unlimited access with no recurring fees).",
  },
  {
    question: "Can I practice more than 9 problems per day?",
    answer: "The daily set is 9 fresh problems — this is intentional. It prevents binge-and-quit cycles and builds long-term consistency. You can also use our structured tutorial tracks (SQL, Python, PySpark) for additional learning at any time.",
  },
  {
    question: "What happens if I miss a day?",
    answer: "Your streak resets, but your full solve history, stats, and public profile stay intact. Streaks are a motivational tool, not a punishment — just start a new one!",
  },
  {
    question: "Do you have learning resources, not just problems?",
    answer: "Yes. We have full tutorial tracks for SQL (52 lessons), Python/Pandas (52 lessons), and PySpark (46 lessons). They're structured to complement the daily problems — use tutorials to learn, problems to reinforce.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        padding: "96px 0",
        background: "var(--ls-surface-low)",
        borderTop: "1px solid var(--ls-outline)",
      }}
    >
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: 1280 }}>
        <div className="max-w-2xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-14">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-4"
              style={{ color: "var(--ls-primary)" }}
            >
              FAQ
            </p>
            <h2
              style={{
                fontFamily: "'Overused Grotesk', system-ui, sans-serif",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "var(--ls-on-surface)",
              }}
            >
              Common questions
            </h2>
          </div>

          {/* Accordion */}
          <div className="space-y-2">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    background: isOpen ? "var(--ls-surface)" : "transparent",
                    border: `1px solid ${isOpen ? "var(--ls-outline-variant)" : "var(--ls-outline)"}`,
                    boxShadow: isOpen ? "var(--ls-shadow-sm)" : "none",
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left focus:outline-none"
                  >
                    <span
                      className="text-sm font-medium pr-4"
                      style={{ color: "var(--ls-on-surface)" }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      style={{ color: "var(--ls-on-surface-muted)" }}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p
                      className="px-5 pb-5 text-sm leading-relaxed"
                      style={{ color: "var(--ls-on-surface-muted)" }}
                    >
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
