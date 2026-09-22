import type { Metadata } from "next";
import { FAQ } from "@/components/landing/faq";
import Link from "next/link";
import { Mail, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ | Daily SQL",
  description: "Frequently Asked Questions about Daily SQL. Find answers to common queries about our platform.",
  alternates: {
    canonical: 'https://dailysql.in/faq',
  }
};

export default function FAQPage() {
  return (
    <main className="landing-light min-h-screen bg-[#fafafa] pt-12 pb-24 text-zinc-900 font-sans">
      <FAQ />

      {/* Still need help? */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="rounded-2xl border border-[#dedee2] bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#e6f7f5] border border-[#1f9e8e]/30 flex items-center justify-center text-[#1f9e8e] shrink-0">
              <HelpCircle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-zinc-900">Have a question not listed here?</h3>
              <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
                Our support team is always ready to assist you with payments, account settings, or bug reports.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-[#1f9e8e] hover:bg-[#177a6d] text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 shadow-2xs"
          >
            <Mail size={14} />
            <span>Contact Support</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
