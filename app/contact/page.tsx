"use client";

import { useState } from "react";
import { Mail, MessageSquare, Twitter, Send } from "lucide-react";
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
    <main className="min-h-screen bg-[#080c16]">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-[#30B5A6]/5 rounded-full blur-[120px]" />
      </div>

      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left Column: Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                  Get in <span className="text-[#30B5A6]">touch</span>
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed max-w-md">
                  Have a question about the platform? Want to suggest a feature?
                  Or just want to say hi? We'd love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                {/* Email Card */}
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#30B5A6]/30 transition-colors">
                  <div className="p-3 rounded-lg bg-[#30B5A6]/10 text-[#30B5A6]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email Support</h3>
                    <p className="text-zinc-400 text-sm mb-3">
                      For technical issues and general inquiries.
                    </p>
                    <Link href="mailto:support@dailysql.in" className="text-[#30B5A6] hover:text-[#4DD4C4] font-medium transition-colors">
                      support@dailysql.in
                    </Link>
                  </div>
                </div>

                {/* Social Card */}
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#30B5A6]/30 transition-colors">
                  <div className="p-3 rounded-lg bg-[#30B5A6]/10 text-[#30B5A6]">
                    <Twitter size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Social Media</h3>
                    <p className="text-zinc-400 text-sm mb-3">
                      Follow us for daily tips and updates.
                    </p>
                    <Link href="https://twitter.com/dailysql" target="_blank" className="text-[#30B5A6] hover:text-[#4DD4C4] font-medium transition-colors">
                      @dailysql
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="relative">
              <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0c0e]/80 backdrop-blur-xl shadow-2xl">
                {isSuccess ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                    <p className="text-zinc-400">Thanks for reaching out. We'll get back to you shortly.</p>
                    <Button
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      className="mt-6 border-white/10 text-white hover:bg-white/5"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input name="name" id="name" placeholder="John Doe" required className="bg-white/5 border-white/10 focus:border-[#30B5A6]/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" id="email" type="email" placeholder="john@example.com" required className="bg-white/5 border-white/10 focus:border-[#30B5A6]/50" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input name="subject" id="subject" placeholder="How can we help?" required className="bg-white/5 border-white/10 focus:border-[#30B5A6]/50" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        name="message"
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        required
                        className="min-h-[150px] bg-white/5 border-white/10 focus:border-[#30B5A6]/50 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#30B5A6] hover:bg-[#2A9D90] text-[#080c16] font-semibold py-6 text-lg shadow-lg shadow-[#30B5A6]/20 transition-all duration-200"
                    >
                      {isSubmitting ? "Sending..." : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message <Send size={18} />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

