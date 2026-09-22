import type { Metadata } from "next";
import Link from "next/link";
import { RefreshCw, ArrowLeft, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy | Daily SQL",
  description: "Read the Daily SQL Refund Policy. Understand our terms for subscription payments, passes, and cancellations.",
  alternates: {
    canonical: 'https://dailysql.in/refund',
  }
};

export default function RefundPolicy() {
  return (
    <main className="landing-light min-h-screen pt-12 pb-24 bg-[#fafafa] text-zinc-900 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500 hover:text-[#1f9e8e] transition-colors mb-6"
        >
          <ArrowLeft size={13} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white border border-[#dedee2] rounded-2xl p-8 sm:p-12 shadow-xs space-y-8">
          <div className="border-b border-zinc-200 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f7f5] border border-[#1f9e8e]/20 text-[#1f9e8e] text-xs font-mono font-bold mb-3">
              <RefreshCw size={13} />
              <span>Billing &amp; Guarantees</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-zinc-900">
              Refund &amp; Cancellation Policy
            </h1>
            <p className="text-xs font-mono text-zinc-500 mt-2">
              Last updated: September 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
            <p>
              Thank you for practicing with Daily SQL. We want you to have an exceptional experience while mastering SQL, Python, and PySpark. Please review our policies regarding memberships, digital access, and refunds.
            </p>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">1. Access Passes &amp; Lifetime Memberships</h2>
              <p>
                Daily SQL offers one-time and recurring access passes (such as the 7-Day Pro Pass and Lifetime VIP access). Because digital benefits and full historical challenge archives are provisioned immediately upon successful transaction confirmation, standard digital product guidelines apply.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">2. Refund Eligibility Window</h2>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600">
                <li>
                  <strong>Lifetime VIP Plans:</strong> If you purchased a Lifetime VIP membership and encounter critical platform issues or find the platform does not meet your expectations, you may request a full refund within <strong>7 days</strong> of your initial purchase date.
                </li>
                <li>
                  <strong>Short-Term Passes (7-Day Pass):</strong> Short-term passes are non-refundable once activated and utilized, except in cases of accidental duplicate billing or verifiable platform outage.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">3. Exceptional Circumstances &amp; Duplicate Billing</h2>
              <p>
                If you were charged twice due to a network timeout or payment gateway error, our team will immediately verify the transaction logs and process a full reversal of the duplicate payment within 3-5 business days.
              </p>
            </div>

            <div className="pt-2">
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-3">4. How to Request Assistance</h2>
              <p className="mb-4">
                To submit a refund inquiry, please include your registered email address and Cashfree Order ID in an email to:
              </p>
              <a
                href="mailto:support@dailysql.in"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1f9e8e] hover:bg-[#177a6d] text-white rounded-xl text-xs font-mono font-bold transition-all shadow-2xs"
              >
                <Mail size={14} />
                <span>support@dailysql.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
