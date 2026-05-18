import type { Metadata } from "next";
import { FAQ } from "@/components/landing/faq";

export const metadata: Metadata = {
  title: "FAQ | Daily SQL",
  description: "Frequently Asked Questions about Daily SQL. Find answers to common queries about our platform.",
  alternates: {
    canonical: 'https://dailysql.in/faq',
  }
};

export default function FAQPage() {
    return (
        <main className="min-h-screen pt-20">
            <FAQ />
        </main>
    );
}
