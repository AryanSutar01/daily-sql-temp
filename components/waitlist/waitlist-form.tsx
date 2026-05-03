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
import { Mail, User, Phone, Search, Briefcase, GraduationCap } from "lucide-react";

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
  const [errors, setErrors] = useState<Partial<Record<keyof WaitlistFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof WaitlistFormData, string>> = {};
    // if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.whatsapp_number.trim()) newErrors.whatsapp_number = "WhatsApp number is required";
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
      onSubmit({
        ...formData,
        whatsapp_number: `${countryCode}${formData.whatsapp_number.trim()}`
      });
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

      {/* --- WhatsApp Section --- */}
      <div className="space-y-2">
        <Label htmlFor="whatsapp" className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">WhatsApp Number</Label>
        <div className="flex gap-2">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="w-[100px] bg-[#0b101c]/50 border-white/5 h-12 focus:border-[#4DD4C4]/50 text-white font-medium">
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

