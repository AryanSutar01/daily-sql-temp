"use client";

import { useState } from "react";
import { Mail, MessageSquare, Twitter, Send, CheckCircle2, Sparkles, Clock } from "lucide-react";
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
    <main className="landing-light min-h-screen bg-[#fafafa] text-zinc-900 font-sans pb-24">
      {/* Hero Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#dedee2] bg-white">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/30 text-[11px] font-mono font-bold uppercase tracking-wider shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5" /> Support &amp; Community
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-zinc-900">
              Get in <span className="text-[#1f9e8e]">Touch</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 max-w-xl leading-relaxed">
              Have a question about subscriptions, invoice requests, college cohorts, or feature feedback? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="pt-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info & Mascot Support */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mascot Help Card */}
            <div className="bg-white border border-[#dedee2] rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src="/mascot-complete-bg-removed.png"
                  alt="DailySQL Mascot"
                  className="w-16 h-16 object-contain"
                />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold font-mono text-zinc-900">Rapid Response Team</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  We reply to inquiries in <strong className="text-[#1f9e8e]">&lt; 2 hours</strong> on business days.
                </p>
              </div>
            </div>

            {/* Email Support Card */}
            <div className="bg-white border border-[#dedee2] rounded-2xl p-6 shadow-xs flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/25 shrink-0">
                <Mail size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-mono text-zinc-900">Direct Email</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  For corporate billing, invoices, technical bugs, and account queries.
                </p>
                <Link
                  href="mailto:contact@dailysql.in"
                  className="inline-block pt-1 text-xs font-bold font-mono text-[#1f9e8e] hover:text-[#177a6d] transition-colors"
                >
                  contact@dailysql.in →
                </Link>
              </div>
            </div>

            {/* Social Channels */}
            <div className="bg-white border border-[#dedee2] rounded-2xl p-6 shadow-xs flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/25 shrink-0">
                <Twitter size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-mono text-zinc-900">X / Twitter Community</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Daily question discussions, hints, and platform release announcements.
                </p>
                <Link
                  href="https://twitter.com/dailysqlin"
                  target="_blank"
                  className="inline-block pt-1 text-xs font-bold font-mono text-[#1f9e8e] hover:text-[#177a6d] transition-colors"
                >
                  @dailysqlin →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#dedee2] rounded-2xl p-7 sm:p-9 shadow-xs">
              {isSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-[#e6f7f5] text-[#1f9e8e] border border-[#1f9e8e]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-mono text-zinc-900">Message Received! 🎉</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out. A team member will reply directly to your email address within 2 hours.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="mt-4 border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-xs font-bold"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold font-mono text-zinc-900 mb-4">Send us a Message</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs font-mono text-zinc-600">Your Name</Label>
                      <Input
                        name="name"
                        id="name"
                        placeholder="Vedant Sharma"
                        required
                        className="bg-zinc-50 border-zinc-300 text-zinc-900 text-xs rounded-xl focus:border-[#1f9e8e]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs font-mono text-zinc-600">Email Address</Label>
                      <Input
                        name="email"
                        id="email"
                        type="email"
                        placeholder="vedant@example.com"
                        required
                        className="bg-zinc-50 border-zinc-300 text-zinc-900 text-xs rounded-xl focus:border-[#1f9e8e]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="subject" className="text-xs font-mono text-zinc-600">Subject</Label>
                    <Input
                      name="subject"
                      id="subject"
                      placeholder="e.g. Corporate invoice, plan upgrade query, or feedback"
                      required
                      className="bg-zinc-50 border-zinc-300 text-zinc-900 text-xs rounded-xl focus:border-[#1f9e8e]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="message" className="text-xs font-mono text-zinc-600">Message</Label>
                    <Textarea
                      name="message"
                      id="message"
                      placeholder="Tell us what you are trying to achieve or how we can assist you..."
                      required
                      rows={5}
                      className="bg-zinc-50 border-zinc-300 text-zinc-900 text-xs rounded-xl focus:border-[#1f9e8e] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold py-3 text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        Send Message <Send size={14} />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
