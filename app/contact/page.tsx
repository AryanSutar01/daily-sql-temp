"use client";

import { useState } from "react";
import { Mail, MessageSquare, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form or show success message logic here
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#09090b]">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-brand-base/5 rounded-full blur-[120px]" />
      </div>

      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left Column: Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                  Get in <span className="text-brand-base">touch</span>
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed max-w-md">
                  Have a question about the platform? Want to suggest a feature?
                  Or just want to say hi? We'd love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                {/* Email Card */}
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-brand-base/30 transition-colors">
                  <div className="p-3 rounded-lg bg-brand-base/10 text-brand-base">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email Support</h3>
                    <p className="text-zinc-400 text-sm mb-3">
                      For technical issues and general inquiries.
                    </p>
                    <Link href="mailto:support@dailysql.com" className="text-brand-base hover:text-brand-light font-medium transition-colors">
                      support@dailysql.com
                    </Link>
                  </div>
                </div>

                {/* Social Card */}
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-brand-base/30 transition-colors">
                  <div className="p-3 rounded-lg bg-brand-base/10 text-brand-base">
                    <Twitter size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Social Media</h3>
                    <p className="text-zinc-400 text-sm mb-3">
                      Follow us for daily tips and updates.
                    </p>
                    <Link href="https://twitter.com/dailysql" target="_blank" className="text-brand-base hover:text-brand-light font-medium transition-colors">
                      @dailysql
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="relative">
              <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0c0e]/80 backdrop-blur-xl shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="John Doe" className="bg-white/5 border-white/10 focus:border-brand-base/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 focus:border-brand-base/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" className="bg-white/5 border-white/10 focus:border-brand-base/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[150px] bg-white/5 border-white/10 focus:border-brand-base/50 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-base hover:bg-brand-light text-white font-semibold py-6 text-lg shadow-lg shadow-brand-base/20"
                  >
                    {isSubmitting ? "Sending..." : (
                      <span className="flex items-center gap-2">
                        Send Message <Send size={18} />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

