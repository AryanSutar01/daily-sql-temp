import type { Metadata } from "next";
import { PaymentPlans } from "@/components/payment/payment-plans";

export const metadata: Metadata = {
  title: "Pricing & Membership Plans | Daily SQL",
  description: "Unlock full permanent access to all SQL, Python, PySpark, and DSA interview questions.",
  alternates: {
    canonical: "https://dailysql.in/payment",
  },
};

export default function PaymentPage() {
  return (
    <main className="landing-light min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-[#fafafa] relative text-zinc-900">
      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f7f5] text-[#1f9e8e] text-[11px] font-bold font-mono uppercase tracking-wider border border-[#1f9e8e]/30 shadow-2xs">
            <span>Membership &amp; Access Plans</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-zinc-900 leading-tight">
            Accelerate Your Career with <span className="text-[#1f9e8e]">DailySQL</span>
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            Unlimited access to real-world business scenarios, interview questions, Python, PySpark &amp; DSA tracks.
          </p>
        </div>

        {/* Pricing & Gateway Section */}
        <PaymentPlans />
      </div>
    </main>
  );
}
