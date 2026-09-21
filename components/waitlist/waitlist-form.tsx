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
import { User, Phone, Briefcase, GraduationCap, Shield, Users, TrendingUp, MessageCircle, ExternalLink, AtSign, Hash, Loader2, ArrowRight } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-5 text-left font-sans">
      
      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="full_name" className="text-xs font-bold text-zinc-700">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <Input
            id="full_name"
            placeholder="e.g. Aryan Singh"
            className={`bg-white border-[#dedee2] text-zinc-900 focus:border-[#1f9e8e] focus:ring-[#1f9e8e]/20 pl-10 h-11 rounded-xl ${
              errors.full_name ? "border-rose-400" : ""
            }`}
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>
        {errors.full_name && <p className="text-[11px] text-rose-600">{errors.full_name}</p>}
      </div>

      {/* WhatsApp Community Section */}
      <div className="space-y-3 pt-1">
        <Label className="text-xs font-bold text-zinc-700">
          WhatsApp Community
        </Label>

        {/* Why we need it — Info card */}
        <div className="rounded-2xl bg-[#e6f7f5]/40 border border-[#1f9e8e]/25 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-[#e6f7f5] text-[#1f9e8e] mt-0.5 shrink-0">
              <MessageCircle size={15} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#135d54] uppercase tracking-wider mb-1 font-mono">
                Daily SQL WhatsApp Community
              </p>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Connect with peer data professionals, receive daily question hints, and discuss solutions directly with engineers.
              </p>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { id: "phone", label: "My Number", icon: Hash },
              { id: "username", label: "Username", icon: AtSign },
              { id: "join", label: "Join Link", icon: ExternalLink },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = whatsappMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setWhatsappMode(tab.id as WhatsAppInputMode)}
                  className={`flex flex-col items-center gap-1 py-2 px-2 rounded-xl text-center transition-all border text-xs font-semibold cursor-pointer ${
                    isSelected
                      ? "bg-white text-[#1f9e8e] border-[#1f9e8e] shadow-2xs font-bold"
                      : "bg-white/60 text-zinc-600 border-[#dedee2] hover:bg-white hover:text-zinc-900"
                  }`}
                >
                  <Icon size={14} />
                  <span className="text-[11px]">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode-specific input */}
        {whatsappMode === "phone" && (
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[110px] bg-white border-[#dedee2] h-11 text-zinc-800 font-medium rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#dedee2] text-zinc-900 shadow-md">
                  {countryCodes.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.code} ({c.name})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="9876543210"
                  className={`bg-white border-[#dedee2] text-zinc-900 focus:border-[#1f9e8e] focus:ring-[#1f9e8e]/20 pl-10 h-11 rounded-xl ${
                    errors.whatsapp_number ? "border-rose-400" : ""
                  }`}
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>
            {errors.whatsapp_number && <p className="text-[11px] text-rose-600">{errors.whatsapp_number}</p>}
          </div>
        )}

        {whatsappMode === "username" && (
          <div className="space-y-1.5">
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <Input
                id="whatsapp_username"
                type="text"
                placeholder="yourwhatsappusername"
                className={`bg-white border-[#dedee2] text-zinc-900 focus:border-[#1f9e8e] focus:ring-[#1f9e8e]/20 pl-10 h-11 rounded-xl ${
                  errors.whatsapp_number ? "border-rose-400" : ""
                }`}
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value.replace(/\s/g, '') })}
              />
            </div>
            {errors.whatsapp_number && <p className="text-[11px] text-rose-600">{errors.whatsapp_number}</p>}
          </div>
        )}

        {whatsappMode === "join" && (
          <div className="rounded-xl bg-[#fafafa] border border-[#dedee2] p-4 space-y-2.5 text-center">
            <p className="text-xs text-zinc-600">
              Join the private community group directly via WhatsApp:
            </p>
            <a
              href={WHATSAPP_JOIN_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f9e8e] text-white font-bold text-xs hover:bg-[#177a6d] transition-colors shadow-2xs"
            >
              <MessageCircle size={15} />
              Join WhatsApp Group
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>

      {/* Role & Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1.5">
          <Label htmlFor="occupation" className="text-xs font-bold text-zinc-700">Role Category</Label>
          <Select
            value={formData.occupation}
            onValueChange={(value) => setFormData({ ...formData, occupation: value })}
          >
            <SelectTrigger id="occupation" className={`bg-white border-[#dedee2] h-11 text-zinc-800 rounded-xl ${errors.occupation ? "border-rose-400" : ""}`}>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#dedee2] text-zinc-900 shadow-md">
              <SelectItem value="data_analyst">Data Analyst</SelectItem>
              <SelectItem value="data_engineer">Data Engineer</SelectItem>
              <SelectItem value="analytics_engineer">Analytics Engineer</SelectItem>
              <SelectItem value="backend_engineer">Backend Engineer</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.occupation && <p className="text-[11px] text-rose-600">{errors.occupation}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="experience" className="text-xs font-bold text-zinc-700">Experience</Label>
          <Select
            value={formData.years_of_experience.toString()}
            onValueChange={(v) => setFormData({ ...formData, years_of_experience: parseInt(v) })}
          >
            <SelectTrigger id="experience" className={`bg-white border-[#dedee2] h-11 text-zinc-800 rounded-xl ${errors.years_of_experience ? "border-rose-400" : ""}`}>
              <SelectValue placeholder="Select Years" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#dedee2] text-zinc-900 shadow-md">
              <SelectItem value="1">0-1 years</SelectItem>
              <SelectItem value="3">2-3 years</SelectItem>
              <SelectItem value="5">4-5 years</SelectItem>
              <SelectItem value="10">5+ years</SelectItem>
            </SelectContent>
          </Select>
          {errors.years_of_experience && <p className="text-[11px] text-rose-600">{errors.years_of_experience}</p>}
        </div>
      </div>

      {/* Current Job Title / College */}
      <div className="space-y-1.5">
        <Label htmlFor="job_role" className="text-xs font-bold text-zinc-700">Current Job Title / College Name</Label>
        <div className="relative">
          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <Input
            id="job_role"
            placeholder="e.g. Senior Data Engineer or IIT Delhi"
            className={`bg-white border-[#dedee2] text-zinc-900 focus:border-[#1f9e8e] focus:ring-[#1f9e8e]/20 pl-10 h-11 rounded-xl ${
              errors.job_role ? "border-rose-400" : ""
            }`}
            value={formData.job_role}
            onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
          />
        </div>
        {errors.job_role && <p className="text-[11px] text-rose-600">{errors.job_role}</p>}
      </div>

      {/* Source */}
      <div className="space-y-1.5">
        <Label htmlFor="source" className="text-xs font-bold text-zinc-700">How did you hear about us?</Label>
        <Select
          value={formData.source}
          onValueChange={(value) => setFormData({ ...formData, source: value })}
        >
          <SelectTrigger id="source" className={`bg-white border-[#dedee2] h-11 text-zinc-800 rounded-xl ${errors.source ? "border-rose-400" : ""}`}>
            <SelectValue placeholder="Select Source" />
          </SelectTrigger>
          <SelectContent className="bg-white border-[#dedee2] text-zinc-900 shadow-md">
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">X / Twitter</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="whatsapp">WhatsApp Group</SelectItem>
            <SelectItem value="friend">Friend / Colleague</SelectItem>
            <SelectItem value="search">Google Search</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.source && <p className="text-[11px] text-rose-600">{errors.source}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold h-12 rounded-xl shadow-xs transition-all text-sm mt-4 flex items-center justify-center gap-2 cursor-pointer"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span>Start Practicing Daily</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}
