"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WaitlistFormData } from "@/types/waitlist";
import { Mail, User, Phone, Search, Briefcase, GraduationCap, Shield, Users, TrendingUp, MessageCircle, ExternalLink, AtSign, Hash } from "lucide-react";

interface WaitlistFormProps {
  onSubmit: (data: WaitlistFormData) => void;
  isLoading?: boolean;
}

const countryCodes = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+971", name: "UAE" },
  { code: "+65", name: "Singapore" },
  { code: "+61", name: "Australia" },
];

const WHATSAPP_JOIN_LINK = "https://chat.whatsapp.com/LvS1ImX9WwqAFGsCLLtmPA?s=cl&p=a&ilr=1";

type WhatsAppInputMode = "phone" | "username" | "join";

export function WaitlistForm({ onSubmit, isLoading = false }: WaitlistFormProps) {
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: "",
    full_name: "",
    whatsapp_number: "",
    occupation: "",
    job_role: "",
    years_of_experience: 0,
    source: "",
  });

  const [countryCode, setCountryCode] = useState("+91");
  const [whatsappMode, setWhatsappMode] = useState<WhatsAppInputMode>("phone");
  const [errors, setErrors] = useState<Partial<Record<keyof WaitlistFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof WaitlistFormData, string>> = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (whatsappMode !== "join" && !formData.whatsapp_number.trim())
      newErrors.whatsapp_number = "WhatsApp number or username is required";
    if (!formData.occupation) newErrors.occupation = "Please select a category";
    if (!formData.job_role.trim()) newErrors.job_role = "Job title is required";
    if (formData.years_of_experience === 0) newErrors.years_of_experience = "Required";
    if (!formData.source) newErrors.source = "Please tell us how you found us";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      let whatsappValue = formData.whatsapp_number.trim();
      if (whatsappMode === "phone") {
        whatsappValue = `${countryCode}${whatsappValue}`;
      } else if (whatsappMode === "username") {
        whatsappValue = whatsappValue.startsWith("@") ? whatsappValue : `@${whatsappValue}`;
      } else {
        whatsappValue = "joined_via_link";
      }
      onSubmit({ ...formData, whatsapp_number: whatsappValue });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* --- Basic Info Section --- */}
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Full Name (as per Govt ID)</Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#4DD4C4] transition-colors" size={16} />
          <Input
            id="full_name"
            placeholder="Aryan Singh"
            className={`bg-[#0b101c]/50 border-white/5 pl-10 h-12 focus:border-[#4DD4C4]/50 ${errors.full_name ? "border-red-500/50" : ""}`}
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>
      </div>

      {/* --- WhatsApp Community Section --- */}
      <div className="space-y-3">
        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
          WhatsApp Community
        </Label>

        {/* Why we need it — Info card */}
        <div className="rounded-xl bg-[#4DD4C4]/5 border border-[#4DD4C4]/20 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-[#4DD4C4]/10 mt-0.5">
              <MessageCircle size={14} className="text-[#4DD4C4]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#4DD4C4] uppercase tracking-wider mb-1">Why we ask for your WhatsApp</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We add you to the <span className="text-white font-medium">Daily SQL WhatsApp Community</span> — a
                space where data professionals share tips, discuss questions, and grow together. You'll get
                daily challenge reminders and direct peer support.
              </p>
            </div>
          </div>

          {/* Community benefits */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="flex flex-col items-center gap-1 text-center p-2 rounded-lg bg-white/[0.03]">
              <Users size={14} className="text-[#4DD4C4]" />
              <span className="text-[10px] text-zinc-400 leading-tight">Peer<br/>Network</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center p-2 rounded-lg bg-white/[0.03]">
              <TrendingUp size={14} className="text-[#4DD4C4]" />
              <span className="text-[10px] text-zinc-400 leading-tight">Daily<br/>Motivation</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center p-2 rounded-lg bg-white/[0.03]">
              <Shield size={14} className="text-[#4DD4C4]" />
              <span className="text-[10px] text-zinc-400 leading-tight">Zero<br/>Spam</span>
            </div>
          </div>

          {/* Privacy assurance */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/5">
            <Shield size={12} className="text-[#4DD4C4] shrink-0" />
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              <span className="text-zinc-300 font-medium">Your number is never shared or sold.</span>{" "}
              We only use it to add you to our WhatsApp community. That's it.
            </p>
          </div>
        </div>

        {/* Mode selector */}
        {/* Free access disclaimer */}
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20 px-3 py-2.5">
          <span className="text-amber-400 text-base leading-none mt-0.5 shrink-0">⚠️</span>
          <p className="text-[11px] text-amber-200/80 leading-relaxed">
            <span className="font-bold text-amber-300">Free access is exclusively for community members.</span>{" "}
            Sharing your WhatsApp ensures we can add you to the group and verify your membership.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setWhatsappMode("phone")}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
              whatsappMode === "phone"
                ? "border-[#4DD4C4]/50 bg-[#4DD4C4]/10 text-[#4DD4C4]"
                : "border-white/5 bg-[#0b101c]/50 text-zinc-500 hover:border-white/10 hover:text-zinc-400"
            }`}
          >
            <Hash size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">My Number</span>
          </button>
          <button
            type="button"
            onClick={() => setWhatsappMode("username")}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
              whatsappMode === "username"
                ? "border-[#4DD4C4]/50 bg-[#4DD4C4]/10 text-[#4DD4C4]"
                : "border-white/5 bg-[#0b101c]/50 text-zinc-500 hover:border-white/10 hover:text-zinc-400"
            }`}
          >
            <AtSign size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Username</span>
          </button>
          <button
            type="button"
            onClick={() => setWhatsappMode("join")}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
              whatsappMode === "join"
                ? "border-[#4DD4C4]/50 bg-[#4DD4C4]/10 text-[#4DD4C4]"
                : "border-white/5 bg-[#0b101c]/50 text-zinc-500 hover:border-white/10 hover:text-zinc-400"
            }`}
          >
            <ExternalLink size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Join Link</span>
          </button>
        </div>

        {/* Mode-specific input */}
        {whatsappMode === "phone" && (
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[110px] bg-[#0b101c]/50 border-white/5 h-12 focus:border-[#4DD4C4]/50 text-white font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#121826] border-white/10 text-white">
                  {countryCodes.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.code} ({c.name})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1 group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#4DD4C4] transition-colors" size={16} />
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="9876543210"
                  className={`bg-[#0b101c]/50 border-white/5 pl-10 h-12 focus:border-[#4DD4C4]/50 ${errors.whatsapp_number ? "border-red-500/50" : ""}`}
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>
            <p className="text-[11px] text-zinc-600 ml-1">Enter your 10-digit WhatsApp number without the country code.</p>
          </div>
        )}

        {whatsappMode === "username" && (
          <div className="space-y-1.5">
            <div className="relative group">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#4DD4C4] transition-colors" size={16} />
              <Input
                id="whatsapp_username"
                type="text"
                placeholder="yourwhatsappusername"
                className={`bg-[#0b101c]/50 border-white/5 pl-10 h-12 focus:border-[#4DD4C4]/50 ${errors.whatsapp_number ? "border-red-500/50" : ""}`}
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value.replace(/\s/g, '') })}
              />
            </div>
            <p className="text-[11px] text-zinc-600 ml-1">
              Enter your WhatsApp username (without @). Find it in WhatsApp → Settings → Profile → Username.
            </p>
          </div>
        )}

        {whatsappMode === "join" && (
          <div className="rounded-xl bg-[#4DD4C4]/8 border border-[#4DD4C4]/25 p-4 space-y-3">
            <p className="text-sm text-zinc-300 leading-relaxed">
              Prefer not to share your number? No problem — you can join our community directly using the link below:
            </p>
            <a
              href={WHATSAPP_JOIN_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-[#4DD4C4] text-[#080c16] font-bold text-sm hover:bg-[#3dbdb0] transition-colors justify-center shadow-[0_0_20px_rgba(77,212,196,0.15)]"
            >
              <MessageCircle size={16} />
              Join the WhatsApp Community
              <ExternalLink size={14} />
            </a>
            <p className="text-[11px] text-zinc-600 text-center">
              After joining, come back and complete your profile below.
            </p>
          </div>
        )}
      </div>

      {/* --- Career Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="occupation" className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Role Category</Label>
          <Select
            value={formData.occupation}
            onValueChange={(value) => setFormData({ ...formData, occupation: value })}
          >
            <SelectTrigger id="occupation" className={`bg-[#0b101c]/50 border-white/5 h-12 focus:border-[#4DD4C4]/50 text-zinc-300 ${errors.occupation ? "border-red-500/50" : ""}`}>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#121826] border-white/10 text-white">
              <SelectItem value="data_analyst">Data Analyst</SelectItem>
              <SelectItem value="data_engineer">Data Engineer</SelectItem>
              <SelectItem value="analytics_engineer">Analytics Engineer</SelectItem>
              <SelectItem value="backend_engineer">Backend Engineer</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience" className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Experience</Label>
          <Select
            value={formData.years_of_experience.toString()}
            onValueChange={(v) => setFormData({ ...formData, years_of_experience: parseInt(v) })}
          >
            <SelectTrigger id="experience" className={`bg-[#0b101c]/50 border-white/5 h-12 focus:border-[#4DD4C4]/50 text-zinc-300 ${errors.years_of_experience ? "border-red-500/50" : ""}`}>
              <SelectValue placeholder="Select Years" />
            </SelectTrigger>
            <SelectContent className="bg-[#121826] border-white/10 text-white">
              <SelectItem value="1">0-1 years</SelectItem>
              <SelectItem value="3">2-3 years</SelectItem>
              <SelectItem value="5">4-5 years</SelectItem>
              <SelectItem value="10">5+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_role" className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Current Job Title / College Name</Label>
        <div className="relative group">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#4DD4C4] transition-colors" size={16} />
          <Input
            id="job_role"
            placeholder="e.g. Senior Data Scientist or IIT Bombay"
            className={`bg-[#0b101c]/50 border-white/5 pl-10 h-12 focus:border-[#4DD4C4]/50 ${errors.job_role ? "border-red-500/50" : ""}`}
            value={formData.job_role}
            onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
          />
        </div>
      </div>

      {/* --- Source Section --- */}
      <div className="space-y-2">
        <Label htmlFor="source" className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">How did you hear about us?</Label>
        <Select
          value={formData.source}
          onValueChange={(value) => setFormData({ ...formData, source: value })}
        >
          <SelectTrigger id="source" className={`bg-[#0b101c]/50 border-white/5 h-12 focus:border-[#4DD4C4]/50 text-zinc-300 ${errors.source ? "border-red-500/50" : ""}`}>
            <SelectValue placeholder="Select Source" />
          </SelectTrigger>
          <SelectContent className="bg-[#121826] border-white/10 text-white">
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">X / Twitter</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="whatsapp">WhatsApp Group</SelectItem>
            <SelectItem value="friend">Friend / Colleague</SelectItem>
            <SelectItem value="search">Google Search</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#4DD4C4] hover:bg-[#3dbdb0] text-[#080c16] font-extrabold h-14 rounded-xl shadow-[0_0_30px_rgba(77,212,196,0.1)] transition-all transform active:scale-[0.98] mt-4 text-base"
      >
        {isLoading ? "Joining..." : "Start Practicing"}
      </Button>
    </form>
  );
}
