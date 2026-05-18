import type { Metadata } from "next";
import { Code2, Heart, Zap, Terminal, Cpu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <main className="min-h-screen bg-[#09090b]">
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-base/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-base/10 border border-brand-base/20 text-brand-base text-sm font-medium mb-4">
            <Terminal size={16} />
            <span>Behind the Code</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Built for Developers <br />
            <span className="text-brand-base">by Developers</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We are a small team of engineers and educators obsessed with making SQL mastery
            accessible, consistent, and actually enjoyable.
          </p>
        </div>
      </section>

      {/* Mission / Values Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#0c0c0e]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-brand-base/30 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-brand-base/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="text-brand-base" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Craftsmanship</h3>
              <p className="text-zinc-400 leading-relaxed">
                We sweat the details. From the syntax highlighting to the query execution speed,
                we believe developer tools should feel premium and responsive.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-brand-base/30 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-brand-base/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-brand-base" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Consistency</h3>
              <p className="text-zinc-400 leading-relaxed">
                We believe in the power of habit. Intensity is overrated; consistency is where
                real mastery happens. We build for the long game.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-brand-base/30 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-brand-base/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-brand-base" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Community</h3>
              <p className="text-zinc-400 leading-relaxed">
                Learning is hard when you're alone. We're building a space where data professionals
                can challenge, support, and grow with each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-base/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Want to build with us?
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            We're always looking for talented engineers and content creators to help us define the future of technical education.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200">
              <Link href="mailto:careers@dailysql.in">Email Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/10">
              <a href="https://twitter.com/dailysql" target="_blank" rel="noopener noreferrer">Follow Lifecycle</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

