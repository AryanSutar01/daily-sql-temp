import React from "react";
import Link from "next/link";
import { Database, Zap, BarChart3, Target, ArrowLeft, CheckCircle2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  type: "login" | "signup";
}

export function AuthLayout({ children, type }: AuthLayoutProps) {
  return (
    <div className="landing-light flex min-h-screen w-full bg-[#fafafa] text-zinc-900 font-sans antialiased selection:bg-[#1f9e8e]/20 selection:text-[#1f9e8e]">
      
      {/* Left Panel: Brand, Social Proof & Features (Desktop) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-16 border-r border-[#dedee2] bg-[#f7f7f8]">
        
        {/* Background Subtle Dot Pattern & Teal Ambient Glow */}
        <div className="absolute inset-0 bg-dot-light opacity-60 pointer-events-none" />
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(31,158,142,0.3) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-0 w-80 h-80 rounded-full pointer-events-none opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(77,212,196,0.25) 0%, transparent 70%)" }}
        />

        {/* Top Header: Logo + Back to Home */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img
              src="/dailysql-logo-bg-removed.png"
              alt="DailySQL Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <img
              src="/dailysql-wordmark-bg-removed.png"
              alt="DailySQL"
              className="h-7 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Center Content: Headline & Value Prop */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.16em] mb-6 bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/30">
            <Zap className="w-3.5 h-3.5" />
            Daily Practice Platform
          </div>

          <h1
            style={{
              fontFamily: "'Overused Grotesk', system-ui, sans-serif",
              fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.035em",
            }}
            className="text-zinc-900 mb-5"
          >
            Master SQL, Python & PySpark in{" "}
            <span className="text-[#1f9e8e]">15 minutes a day.</span>
          </h1>

          <p className="text-base text-zinc-600 leading-relaxed mb-8">
            9 curated problems every morning across SQL (PostgreSQL), Python (Pandas), and distributed PySpark. Build streaks, isolate execution in the browser, and stay interview-ready.
          </p>

          {/* Feature Highlights Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              { title: "9 Daily Problems", desc: "Easy, Med & Hard sets", icon: Database, bg: "bg-[#e6f7f5]", color: "text-[#1f9e8e]" },
              { title: "Browser Sandbox", desc: "Instant test feedback", icon: Zap, bg: "bg-amber-50", color: "text-amber-700" },
              { title: "Daily Streaks", desc: "Build lasting consistency", icon: BarChart3, bg: "bg-sky-50", color: "text-sky-700" },
              { title: "Real Interview Questions", desc: "Inspired by FAANG & top tech", icon: Target, bg: "bg-purple-50", color: "text-purple-700" },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white border border-[#dedee2] shadow-2xs flex items-start gap-3 transition-all hover:border-zinc-300"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${feat.bg} ${feat.color}`}>
                  <feat.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">{feat.title}</h4>
                  <p className="text-[11px] text-zinc-500">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="relative z-10 pt-4 border-t border-[#dedee2] flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-zinc-700">10,000+ data practitioners learning daily</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
            <span>Postgres 16</span> · <span>Spark 3.5</span>
          </div>
        </div>

      </div>

      {/* Right Panel: Clean Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#fafafa]">
        
        {/* Mobile Header */}
        <div className="lg:hidden w-full max-w-md mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <img
              src="/dailysql-logo-bg-removed.png"
              alt="DailySQL Logo"
              className="h-8 w-auto object-contain"
            />
            <img
              src="/dailysql-wordmark-bg-removed.png"
              alt="DailySQL"
              className="h-6 w-auto object-contain"
            />
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
          >
            ← Home
          </Link>
        </div>

        {/* Card Frame */}
        <div className="w-full max-w-md">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#dedee2] shadow-sm relative overflow-hidden">
            {children}
          </div>
        </div>

      </div>

    </div>
  );
}
