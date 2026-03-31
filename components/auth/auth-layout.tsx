import React from "react";
import Link from "next/link";
import { Database, Zap, BarChart3, Target, LayoutDashboard } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  type: "login" | "signup";
}

export function AuthLayout({ children, type }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#080c16] text-white font-sans selection:bg-[#4DD4C4]/30">
      {/* Left Panel: Brand & Info */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-16 border-r border-white/5">
        
        {/* Tech Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/auth/final-bg.png" 
            alt="New Tech Background" 
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#080c16] via-[#080c16]/30 to-transparent" />
          <div className="absolute inset-0 bg-[#080c16]/5 backdrop-blur-[1px]" />
        </div>
        
        {/* Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#4DD4C4]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#30B5A6]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex-col flex h-full items-end pr-12">
          <div className="max-w-md w-full flex flex-col h-full">
            <div className="space-y-6 mt-20 mb-auto">
              <div className="space-y-6">
                <h1 className="text-7xl font-black tracking-tight leading-[1.05] animate-in fade-in slide-in-from-left-8 duration-700">
                  Welcome to <br />
                  <span className="bg-gradient-to-r from-[#4DD4C4] via-white to-[#30B5A6] bg-clip-text text-transparent animate-gradient-x px-1">
                    DailySQL
                  </span>
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed font-medium animate-in fade-in slide-in-from-left-12 duration-1000">
                  Practice SQL daily and level up your database skills with our 
                  precision-engineered mastery platform.
                </p>
              </div>
            </div>

            {/* Feature Cards: Vertical Left-Aligned Stack */}
            <div className="flex flex-col gap-5 relative mb-24 w-full">
               {/* Card 1 */}
               <div className="p-4 rounded-2xl bg-[#0b101c]/60 border border-white/5 backdrop-blur-xl shadow-2xl flex items-center gap-4 group hover:border-[#4DD4C4]/30 transition-all duration-500 animate-in fade-in slide-in-from-left-8 duration-700 delay-300 animate-float" style={{ animationDelay: '0s' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 flex items-center justify-center text-[#4DD4C4]">
                    <Zap size={20} fill="currentColor" className="fill-[#4DD4C4]/20" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mastery</p>
                    <p className="text-sm font-extrabold text-white">Daily Challenges</p>
                  </div>
               </div>

               {/* Card 2 */}
               <div className="p-4 rounded-2xl bg-[#0b101c]/60 border border-white/5 backdrop-blur-xl shadow-2xl flex items-center gap-4 group hover:border-[#4DD4C4]/30 transition-all duration-500 animate-in fade-in slide-in-from-left-12 duration-700 delay-500 animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#60a5fa]/10 border border-[#60a5fa]/20 flex items-center justify-center text-[#60a5fa]">
                    <BarChart3 size={20} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Retention</p>
                    <p className="text-sm font-extrabold text-white">Streaks & Consistency</p>
                  </div>
               </div>

               {/* Card 3 */}
               <div className="p-4 rounded-2xl bg-[#0b101c]/60 border border-white/5 backdrop-blur-xl shadow-2xl flex items-center gap-4 group hover:border-[#4DD4C4]/30 transition-all duration-500 animate-in fade-in slide-in-from-left-16 duration-700 delay-700 animate-float" style={{ animationDelay: '3s' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#eab308]/10 border border-[#eab308]/20 flex items-center justify-center text-[#eab308]">
                    <Target size={20} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Impact</p>
                    <p className="text-sm font-extrabold text-white">Career Growth</p>
                  </div>
               </div>
            </div>

            <div className="pb-4" />
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#0a0f1c]/30 backdrop-blur-3xl relative">
        <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10 w-full font-sans">
          <div 
            className="w-full max-w-md animate-premium-entry"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#0b101c]/40 border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors duration-500">
              {/* Subtle inner glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4DD4C4]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#4DD4C4]/10 transition-colors" />
              
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </div>
        </main>
        
        {/* Mobile background grid */}
        <div className="lg:hidden absolute inset-0 z-0 bg-grid-white opacity-10 pointer-events-none" />
      </div>
    </div>
  );
}
