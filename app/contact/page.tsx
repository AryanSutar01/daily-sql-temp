"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Twitter,
  Send,
  CheckCircle2,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  HelpCircle,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert([data]);

      if (error) throw error;

      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="landing-light min-h-screen bg-[#f4f6f8] text-zinc-900 font-sans pb-24">
      {/* Hero Header with Teal Grid & Diagonal Gradient Atmosphere */}
      <section className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#1f9e8e]/20 bg-gradient-to-br from-[#dcf4f1] via-[#ebf8f6] to-[#f4f6f8] overflow-hidden">
        {/* Subtle Teal Geometric Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-75"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(31, 158, 142, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(31, 158, 142, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 90% 80% at 20% 30%, black 40%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 20% 30%, black 40%, transparent 90%)",
          }}
        />

        {/* Ambient Teal Radial Glow shifted diagonally */}
        <div className="absolute top-0 left-0 w-[600px] h-[350px] bg-gradient-to-br from-[#1f9e8e]/25 via-[#1f9e8e]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur text-[#1f9e8e] border border-[#1f9e8e]/35 text-xs font-mono font-bold uppercase tracking-wider shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5" /> Support &amp; Community
          </div>

          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-zinc-900">
              Get in <span className="text-[#1f9e8e] underline decoration-[#1f9e8e]/40 underline-offset-4">Touch</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
              Have a question about subscriptions, corporate invoice requests, college cohorts, or feature feedback? Our team is always here to assist.
            </p>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur border border-[#1f9e8e]/25 text-xs font-medium text-zinc-700 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#1f9e8e]" />
              <span>Average response: <strong className="text-zinc-900 font-mono">&lt; 2 hours</strong></span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur border border-[#1f9e8e]/25 text-xs font-medium text-zinc-700 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct engineer &amp; founder support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="pt-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cards */}
          <div className="lg:col-span-5 space-y-5">

            {/* Email Support Card */}
            <div className="bg-white border border-[#dedee2] rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:border-[#1f9e8e]/40 transition-all">
              <div className="p-3 rounded-xl bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/25 shrink-0 shadow-2xs">
                <Mail size={20} />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-mono text-zinc-900">Direct Email</h3>
                  <span className="text-[11px] font-mono text-zinc-400">Primary</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  For corporate billing, tax invoices, technical bugs, or team accounts.
                </p>
                <Link
                  href="mailto:contact@dailysql.in"
                  className="inline-flex items-center gap-1.5 pt-1 text-xs font-bold font-mono text-[#1f9e8e] hover:text-[#177a6d] transition-colors"
                >
                  contact@dailysql.in <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Social Channels */}
            <div className="bg-white border border-[#dedee2] rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:border-sky-300 transition-all">
              <div className="p-3 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shrink-0 shadow-2xs">
                <Twitter size={20} />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-mono text-zinc-900">X / Twitter Community</h3>
                  <span className="text-[11px] font-mono text-sky-600 font-semibold">@dailysqlin</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Daily question discussions, problem hints, and platform release announcements.
                </p>
                <Link
                  href="https://twitter.com/dailysqlin"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 pt-1 text-xs font-bold font-mono text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Follow &amp; Message on X <ExternalLink size={12} />
                </Link>
              </div>
            </div>

            {/* Quick FAQ / Knowledge Card */}
            <div className="bg-gradient-to-br from-white via-white to-amber-50/40 border border-amber-200/80 rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0 shadow-2xs">
                <HelpCircle size={20} />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm font-bold font-mono text-zinc-900">Frequently Asked Questions</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Looking for quick answers about plans, billing, or free trials?
                </p>
                <Link
                  href="/#faq"
                  className="inline-flex items-center gap-1.5 pt-1 text-xs font-bold font-mono text-amber-700 hover:text-amber-800 transition-colors"
                >
                  Browse FAQs <ArrowRight size={13} />
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#dedee2] rounded-3xl p-7 sm:p-9 shadow-sm overflow-hidden relative">
              
              {/* Form Top Header Strip */}
              <div className="border-b border-[#dedee2] bg-[#f8f9fa] -mx-7 -mt-7 sm:-mx-9 sm:-mt-9 px-7 py-5 sm:px-9 mb-7 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-mono text-zinc-900">Send us a Message</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Fill in the details below and we'll get back to you shortly.</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#e6f7f5] text-[#1f9e8e] text-[11px] font-mono font-bold border border-[#1f9e8e]/30">
                  <Zap size={12} /> Fast Response
                </span>
              </div>

              {isSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-mono text-zinc-900">Message Received! 🎉</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out. A team member will reply directly to your email address within 2 hours.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="mt-4 border-[#dedee2] bg-[#f8f9fa] hover:bg-white text-zinc-800 text-xs font-bold rounded-xl h-10 px-5 shadow-2xs"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4.5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-mono font-semibold text-zinc-700">
                        Your Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        name="name"
                        id="name"
                        placeholder="Vedant Sharma"
                        required
                        className="bg-[#f8f9fa] border-[#dedee2] text-zinc-900 text-xs rounded-xl focus:bg-white focus:border-[#1f9e8e] focus:ring-2 focus:ring-[#1f9e8e]/10 h-10 transition-all shadow-2xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-mono font-semibold text-zinc-700">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        name="email"
                        id="email"
                        type="email"
                        placeholder="vedant@example.com"
                        required
                        className="bg-[#f8f9fa] border-[#dedee2] text-zinc-900 text-xs rounded-xl focus:bg-white focus:border-[#1f9e8e] focus:ring-2 focus:ring-[#1f9e8e]/10 h-10 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-xs font-mono font-semibold text-zinc-700">
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="subject"
                      id="subject"
                      placeholder="e.g. Corporate invoice, plan upgrade query, or bug report"
                      required
                      className="bg-[#f8f9fa] border-[#dedee2] text-zinc-900 text-xs rounded-xl focus:bg-white focus:border-[#1f9e8e] focus:ring-2 focus:ring-[#1f9e8e]/10 h-10 transition-all shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-mono font-semibold text-zinc-700">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      name="message"
                      id="message"
                      placeholder="Tell us what you are trying to achieve or how we can assist you..."
                      required
                      rows={5}
                      className="bg-[#f8f9fa] border-[#dedee2] text-zinc-900 text-xs rounded-xl focus:bg-white focus:border-[#1f9e8e] focus:ring-2 focus:ring-[#1f9e8e]/10 resize-none transition-all shadow-2xs leading-relaxed"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold py-3 h-11 text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    {isSubmitting ? "Sending message..." : (
                      <>
                        Send Message <Send size={14} />
                      </>
                    )}
                  </Button>

                  {/* Trust indicator */}
                  <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">🔒 256-bit SSL encrypted</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">🛡️ No spam promise</span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
