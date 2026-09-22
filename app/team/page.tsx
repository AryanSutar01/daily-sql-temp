import type { Metadata } from "next";
import { Zap, Terminal, Cpu, Users, Sparkles, ArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Team | Daily SQL",
  description: "Meet the team behind Daily SQL. Built by developers and educators obsessed with making SQL mastery accessible.",
  alternates: {
    canonical: 'https://dailysql.in/team',
  }
};

export default function TeamPage() {
  return (
    <main className="landing-light min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#1f9e8e]/20 selection:text-[#1f9e8e]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f5] border border-[#1f9e8e]/30 text-[#1f9e8e] text-xs font-mono font-bold tracking-wide">
            <Terminal size={14} />
            <span>Behind the Code</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-mono tracking-tight text-zinc-900 leading-[1.1]">
            Built for Developers <br />
            <span className="text-[#1f9e8e]">by Practitioners</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto">
            We are a focused team of engineers and educators obsessed with making SQL, Python, and PySpark mastery accessible, consistent, and genuinely rewarding.
          </p>

          <div className="pt-2 flex justify-center">
            <div className="relative w-36 h-36 md:w-44 md:h-44">
              <Image
                src="/mascot-complete-bg-removed.png"
                alt="Daily SQL Team Mascot"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Values Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#dedee2] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 tracking-tight">
              Our Core Principles
            </h2>
            <p className="text-sm text-zinc-600">
              The foundational values that guide how we design curriculum, build developer tools, and shape community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Value 1 */}
            <div className="p-8 rounded-2xl bg-zinc-50/70 border border-[#dedee2] hover:border-[#1f9e8e]/40 transition-all hover:shadow-xs group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#e6f7f5] border border-[#1f9e8e]/30 flex items-center justify-center mb-6 text-[#1f9e8e] group-hover:scale-105 transition-transform">
                  <Cpu size={24} />
                </div>
                <h3 className="text-lg font-bold font-mono text-zinc-900 mb-3">Craftsmanship</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  We sweat the details. From responsive syntax execution to real-time schema validation, developer tools should feel instantaneous and reliable.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="p-8 rounded-2xl bg-zinc-50/70 border border-[#dedee2] hover:border-[#1f9e8e]/40 transition-all hover:shadow-xs group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-6 text-amber-600 group-hover:scale-105 transition-transform">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-bold font-mono text-zinc-900 mb-3">Consistency</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  We believe in daily compounding. Intensity fades, but solving one thoughtful problem every single day builds unshakeable confidence and mastery.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="p-8 rounded-2xl bg-zinc-50/70 border border-[#dedee2] hover:border-[#1f9e8e]/40 transition-all hover:shadow-xs group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-105 transition-transform">
                  <Users size={24} />
                </div>
                <h3 className="text-lg font-bold font-mono text-zinc-900 mb-3">Community</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Learning shouldn&apos;t feel isolated. We&apos;re building a peer environment where analysts and engineers compare solutions, share optimizations, and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#dedee2] relative overflow-hidden bg-[#fafafa]">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f7f5] border border-[#1f9e8e]/20 text-[#1f9e8e] text-xs font-mono font-bold">
            <Sparkles size={13} />
            <span>Join Our Mission</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold font-mono text-zinc-900 tracking-tight">
            Want to build with us?
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
            We are always excited to collaborate with passionate curriculum writers, database instructors, and full-stack builders.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="mailto:careers@dailysql.in"
              className="px-6 py-3 bg-[#1f9e8e] hover:bg-[#177a6d] text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-2xs"
            >
              <Mail size={14} />
              <span>Email Us</span>
            </a>

            <a
              href="https://twitter.com/dailysqlin"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white border border-[#dedee2] hover:bg-zinc-50 text-zinc-800 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-2xs"
            >
              <span>Follow @dailysqlin</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
