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
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#080c16] relative overflow-hidden text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#4DD4C4]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4DD4C4]/10 text-[#4DD4C4] text-xs font-bold uppercase tracking-wider border border-[#4DD4C4]/20 shadow-sm">
            <span>Membership &amp; Access Plans</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Accelerate Your Career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DD4C4] via-teal-300 to-cyan-400">Daily SQL</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Gain unlimited access to real-world business scenarios, interview questions, Python, PySpark &amp; DSA tracks.
          </p>
        </div>

        {/* Pricing & Gateway Section */}
        <PaymentPlans />
      </div>
    </main>
  );
}
