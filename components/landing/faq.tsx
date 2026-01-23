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
      answer: "No. Daily SQL is designed for professionals who already know SQL and want to maintain their skills. You should be comfortable with basic SELECT, JOIN, WHERE, and GROUP BY statements. We focus on advanced concepts like window functions, CTEs, and complex aggregations—the SQL you actually use at work.",
    },
    {
      question: "How much time do I need each day?",
      answer: "Exactly 15 minutes. We've designed the platform so that three questions (Easy, Medium, Advanced) can be completed in about 15 minutes. It fits into your schedule without overwhelming your day.",
    },
    {
      question: "Is this interview-focused or job-focused?",
      answer: "Both. The problems are real business-style scenarios you'd encounter at work, which also happen to be what interviewers ask about. Real work prepares you for real interviews.",
    },
    {
      question: "What SQL dialects are supported?",
      answer: "We primarily support PostgreSQL, the industry standard for modern data stacks. However, the concepts we practice—CTEs, window functions, and complex joins—are applicable to almost all dialects including Snowflake, BigQuery, and Redshift.",
    },
    {
      question: "Can I practice more than 3 questions per day?",
      answer: "By design, no. The philosophy of Daily SQL is 'consistency over intensity'. We deliberately limit it to 3 questions to prevent burnout and ensure you can maintain the habit long-term.",
    },
    {
      question: "What happens if I miss a day?",
      answer: "Your streak resets, but you can always catch up. The platform is designed to be forgiving—you can review past questions in the archive whenever you're ready. Consistency is the goal, but perfection isn't required.",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-border/50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
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
              className="rounded-xl border border-border/40 bg-card/30 px-6 data-[state=open]:border-[#30B5A6]/30 data-[state=open]:bg-[#30B5A6]/5 transition-all duration-300"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline text-lg py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

