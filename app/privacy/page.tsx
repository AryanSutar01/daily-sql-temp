import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Daily SQL",
  description: "Read the Daily SQL Privacy Policy to understand how we collect, use, and protect your personal data.",
  alternates: {
    canonical: 'https://dailysql.in/privacy',
  }
};

export default function PrivacyPolicy() {
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
              <Shield size={13} />
              <span>Data Protection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-zinc-900">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-zinc-500 mt-2">
              Last updated: September 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">1. Overview</h2>
              <p>
                Welcome to Daily SQL (<a href="https://dailysql.in" className="text-[#1f9e8e] hover:underline">dailysql.in</a>). We respect your privacy and are committed to safeguarding your personal data. This privacy policy informs you about how we handle your personal data when you create an account, practice coding challenges, or purchase memberships.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
                <li><strong>Identity &amp; Profile Data:</strong> Name, chosen username, avatar URL, job role, and social profile links (GitHub, LinkedIn).</li>
                <li><strong>Contact Data:</strong> Verified email address provided during authentication.</li>
                <li><strong>Practice &amp; Usage Data:</strong> Questions attempted, submitted code solutions, execution latency, streaks, and platform activity logs.</li>
                <li><strong>Payment Transaction Data:</strong> Order IDs, payment status, and plan subscription identifiers (we do not store credit card numbers or UPI PINs on our servers).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
                <li>To maintain your account, authenticate sessions, and track your daily streak progression.</li>
                <li>To render your personal performance graphs, activity heatmaps, and public profile portfolio.</li>
                <li>To calculate fair ranking positions across the platform leaderboards.</li>
                <li>To provide responsive customer support and service updates.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">4. Data Security</h2>
              <p>
                We implement industry-standard encryption protocols (TLS/SSL) and secure cloud databases (Supabase, PostgreSQL) to safeguard your account credentials and personal information.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">5. Inquiries &amp; Privacy Requests</h2>
              <p>
                If you have questions regarding your data or wish to request data deletion, contact us directly at{" "}
                <a href="mailto:support@dailysql.in" className="text-[#1f9e8e] font-semibold hover:underline">
                  support@dailysql.in
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
