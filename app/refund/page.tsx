import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Daily SQL",
  description: "Read the Daily SQL Refund Policy. Understand our terms for subscription payments, trials, and cancellations.",
  alternates: {
    canonical: 'https://dailysql.in/refund',
  }
};

export default function RefundPolicy() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#080c16]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>

        <div className="prose prose-invert max-w-none text-[#7b8ca3] space-y-6">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <p>
            Thank you for practicing with Daily SQL. We want to ensure you have a stellar experience while sharpening your data skills. 
            Please read this policy carefully regarding refunds, subscription billing, and cancellations.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Subscription Plans &amp; Billing</h2>
          <p>
            Daily SQL offers subscription plans for accessing premium problems, custom datasets, and detailed execution analysis. 
            By purchasing a premium plan, you agree to recurring subscription billing cycles (e.g., monthly or annually) which 
            will automatically renew unless cancelled.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Cancellation &amp; Refund Window</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Monthly Plans:</strong> You can cancel your monthly subscription at any time. Once cancelled, your premium access 
              will remain active until the end of the current billing cycle. We do not offer partial refunds or prorated credits for 
              unused days in a monthly billing cycle.
            </li>
            <li>
              <strong>Annual Plans:</strong> If you signed up for an annual plan and find it doesn't suit your needs, you can request 
              a full refund within 7 days of your initial purchase or renewal date. To request a refund, please contact support@dailysql.in.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Exceptional Circumstances</h2>
          <p>
            We review refund requests outside our standard windows on a case-by-case basis. If you experienced technical disruptions, 
            service unavailability, or billing discrepancies, please reach out to us with details so we can make it right.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Contact Us</h2>
          <p>
            If you have any questions, feedback, or would like to request a cancellation or refund, please email us at support@dailysql.in.
          </p>
        </div>
      </div>
    </main>
  );
}
