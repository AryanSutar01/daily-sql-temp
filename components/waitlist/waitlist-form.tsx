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

interface WaitlistFormProps {
  onSubmit: (data: WaitlistFormData) => void;
  isLoading?: boolean;
}

export function WaitlistForm({ onSubmit, isLoading = false }: WaitlistFormProps) {
  const [formData, setFormData] = useState<WaitlistFormData>({
    occupation: "",
    job_role: "",
    years_of_experience: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WaitlistFormData, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof WaitlistFormData, string>> = {};

    if (!formData.occupation) {
      newErrors.occupation = "Please select your role category";
    }
    if (!formData.job_role.trim()) {
      newErrors.job_role = "Please enter your job title";
    }
    if (!formData.years_of_experience || formData.years_of_experience === 0) {
      newErrors.years_of_experience = "Please select your years of experience";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="occupation">Role Category</Label>
        <Select
          value={formData.occupation}
          onValueChange={(value) => setFormData({ ...formData, occupation: value })}
        >
          <SelectTrigger id="occupation" className={errors.occupation ? "border-destructive" : ""}>
            <SelectValue placeholder="Select your role category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data_analyst">Data Analyst</SelectItem>
            <SelectItem value="data_engineer">Data Engineer</SelectItem>
            <SelectItem value="analytics_engineer">Analytics Engineer</SelectItem>
            <SelectItem value="backend_engineer">Backend Engineer</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.occupation && (
          <p className="text-sm text-destructive">{errors.occupation}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_role">Current Job Title</Label>
        <Input
          id="job_role"
          placeholder="e.g., Senior Data Analyst"
          value={formData.job_role}
          onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
          className={errors.job_role ? "border-destructive" : ""}
        />
        {errors.job_role && (
          <p className="text-sm text-destructive">{errors.job_role}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="years_of_experience">Years of Experience</Label>
        <Select
          value={formData.years_of_experience.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, years_of_experience: parseInt(value) })
          }
        >
          <SelectTrigger id="years_of_experience" className={errors.years_of_experience ? "border-destructive" : ""}>
            <SelectValue placeholder="Select years of experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">0-1 years</SelectItem>
            <SelectItem value="2">2-3 years</SelectItem>
            <SelectItem value="4">4-5 years</SelectItem>
            <SelectItem value="6">6-10 years</SelectItem>
            <SelectItem value="11">10+ years</SelectItem>
          </SelectContent>
        </Select>
        {errors.years_of_experience && (
          <p className="text-sm text-destructive">{errors.years_of_experience}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-[#30B5A6] hover:bg-[#2A9D90] text-[#080C16] font-semibold text-lg py-6 shadow-lg shadow-[#30B5A6]/20 hover:shadow-[#30B5A6]/30 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Sign in with Google"}
      </Button>
    </form>
  );
}

