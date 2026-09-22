import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Daily SQL",
  description: "Read the Daily SQL Terms of Service. Understand your rights and responsibilities when using our platform.",
  alternates: {
    canonical: 'https://dailysql.in/terms',
  }
};

export default function TermsOfService() {
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
              <FileText size={13} />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-zinc-900">
              Terms of Service
            </h1>
            <p className="text-xs font-mono text-zinc-500 mt-2">
              Last updated: September 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Daily SQL (<a href="https://dailysql.in" className="text-[#1f9e8e] hover:underline">dailysql.in</a>), you accept and agree to be bound by the terms and provisions of this agreement. When using this website&apos;s particular services (including practice exercises for SQL, Python, and PySpark), you agree to comply with all posted rules and guidelines.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">2. Use License</h2>
              <p className="mb-3">
                Permission is granted to temporarily access and practice with the materials (data challenges, execution playground, and editorial solutions) on Daily SQL for personal, non-commercial technical training. Under this license, you may not:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
                <li>Systematically scrape, mirror, or redistribute challenge datasets and proprietary questions.</li>
                <li>Use automated bots to solve questions, inflate streaks, or manipulate leaderboards.</li>
                <li>Attempt to decompile or reverse engineer any sandbox execution environments.</li>
                <li>Transfer or share your individual account access with multiple third parties.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">3. Subscriptions &amp; Payments</h2>
              <p>
                Certain features (such as historical archives, Pro passes, and Lifetime VIP memberships) are offered as paid upgrades. All financial transactions are securely processed via certified payment gateways (Cashfree). You agree to provide accurate billing information and acknowledge that subscriptions grant immediate access to digital content.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">4. Disclaimer of Warranty</h2>
              <p>
                The materials on Daily SQL are provided on an &quot;as is&quot; basis. Daily SQL makes no warranties, expressed or implied, regarding uptime, specific interview outcomes, or fitness for a particular purpose.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold font-mono text-zinc-900 mb-2">5. Contact Information</h2>
              <p>
                Questions regarding these Terms of Service should be directed to our support team at{" "}
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
