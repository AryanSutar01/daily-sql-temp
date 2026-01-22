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
      question: "Is this for beginners?",
      answer: "No. Daily SQL is designed for professionals who already know SQL and want to maintain their skills. You should be comfortable with basic SELECT, JOIN, WHERE, and GROUP BY statements. We focus on advanced concepts like window functions, CTEs, and complex aggregations—the SQL you actually use at work.",
    },
    {
      question: "How much time per day?",
      answer: "Exactly 15 minutes. We've designed the platform so that three questions (Easy, Medium, Advanced) can be completed in about 15 minutes. This fits into a busy professional's schedule without feeling overwhelming or requiring significant time commitment.",
    },
    {
      question: "Is this interview-focused or job-focused?",
      answer: "Both. The problems are real business-style scenarios you'd encounter at work, which also happen to be what interviewers ask about. By practicing with realistic problems, you're preparing for both your current role and future opportunities. Real work prepares you for real interviews.",
    },
    {
      question: "What if I miss a day?",
      answer: "Your streak resets, but you can always catch up. We understand that life happens. The platform is designed to be forgiving—you can review past questions and get back on track whenever you're ready. Consistency matters more than perfection.",
    },
  ];

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Daily SQL
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm px-6 data-[state=open]:border-brand-base/20 data-[state=open]:bg-card/70 transition-all duration-300"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

