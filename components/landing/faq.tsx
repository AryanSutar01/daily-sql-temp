"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "Is this for SQL beginners?",
      answer: "No. Daily SQL is designed for professionals and learners who know the basics and want to build real muscle memory. You should understand basic SELECT, JOIN, WHERE, and GROUP BY statements. We focus on advanced concepts like window functions, CTEs, and complex aggregations—the SQL you actually use at work.",
    },
    {
      question: "How much time do I need each day?",
      answer: "Around 15 minutes. We've designed the daily practice routine so that three questions (Easy, Medium, Advanced) can be completed in a single focused session without overwhelming your day.",
    },
    {
      question: "Is this interview-focused or job-focused?",
      answer: "Both. The problems simulate real production schemas and business metrics (churn, retention, funnel conversions, anomaly detection) that you encounter at work and in FAANG/top tech technical rounds.",
    },
    {
      question: "What SQL dialects and languages are supported?",
      answer: "We support PostgreSQL, Python (Pandas/Polars data manipulation), and Apache PySpark. The concepts you practice transfer directly across Snowflake, BigQuery, Redshift, and Databricks.",
    },
    {
      question: "Can I practice past sets?",
      answer: "Yes! Pro and Lifetime members have complete access to the full problem archive, custom topic filters, and self-paced interview paths across SQL, Python, and PySpark.",
    },
    {
      question: "What pricing plans and options do you have?",
      answer: "We have four clear plans: Free Tier (₹0 forever, with 3 SQL questions a day plus the first 30 SQL questions), Monthly Pro (₹899/month for 30-day interview prep), Yearly Pro (₹1,499/year — just ₹125/month for annual mastery), and Lifetime VIP (₹4,999 one-time payment for permanent unlimited access with zero recurring fees).",
    },
    {
      question: "What happens if I miss a day?",
      answer: "Your streak resets, but you can always catch up using the archive. Consistency is the goal, and the platform makes it effortless to jump right back in.",
    },
  ];

  return (
    <section className="landing-light py-20 px-4 sm:px-6 lg:px-8 bg-[#fafafa] text-zinc-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f7f5] border border-[#1f9e8e]/20 text-[#1f9e8e] text-xs font-mono font-bold">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-zinc-900">
            Got Questions? We&apos;ve Got Answers
          </h2>
          <p className="text-sm sm:text-base text-zinc-600">
            Everything you need to know about practicing, subscriptions, and supported technologies.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3.5">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-2xl border border-[#dedee2] bg-white px-6 data-[state=open]:border-[#1f9e8e]/50 data-[state=open]:bg-[#f7fdfc] shadow-xs transition-all duration-200"
            >
              <AccordionTrigger className="text-left font-bold font-mono hover:no-underline text-base py-5 text-zinc-900 hover:text-[#1f9e8e]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-600 leading-relaxed text-sm pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
