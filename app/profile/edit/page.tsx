"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { StandaloneNavbar } from "@/components/auth/standalone-navbar";

export default function ProfileEditPage() {
    const router = useRouter();
    const [isSavingAvatar, setIsSavingAvatar] = useState(false);
    const [isSavingPersonal, setIsSavingPersonal] = useState(false);
    const [isSavingWork, setIsSavingWork] = useState(false);

    const [avatarColor, setAvatarColor] = useState("bg-[#1f9e8e]");

    const [personal, setPersonal] = useState({
        name: "",
        email: "",
        mobile: "+1",
        mobileNum: "",
        birthDate: "",
        country: "",
    });

    const [work, setWork] = useState({
        category: "",
        company: "",
        jobTitle: "",
        experience: "",
        location: "",
        description: "",
    });

    const handleSaveAvatar = () => {
        setIsSavingAvatar(true);
        setTimeout(() => setIsSavingAvatar(false), 600);
    };
    const handleSavePersonal = () => {
        setIsSavingPersonal(true);
        setTimeout(() => setIsSavingPersonal(false), 600);
    };
    const handleSaveWork = () => {
        setIsSavingWork(true);
        setTimeout(() => {
            setIsSavingWork(false);
            router.push("/profile");
        }, 600);
    };

    const presetColors = ["bg-[#1f9e8e]", "bg-teal-500", "bg-sky-500", "bg-amber-500"];

    return (
        <div className="landing-light min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col">
            <StandaloneNavbar />
            <div className="py-10 px-4 sm:px-6 lg:px-8 shrink-0 flex-1">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <Link href="/profile">
                            <Button variant="outline" className="bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50 shadow-2xs gap-2 h-9 px-4 text-xs font-bold">
                                <ArrowLeft size={14} /> Back to Profile
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Picture Section */}
                        <section>
                            <h2 className="text-sm font-mono font-bold text-zinc-500 mb-2 uppercase tracking-wider">Profile Picture</h2>
                            <div className="p-6 rounded-2xl border border-[#dedee2] bg-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={`w-24 h-24 rounded-2xl ${avatarColor} flex items-center justify-center relative shadow-sm shrink-0`}>
                                        <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-zinc-500">Pick an avatar accent</p>
                                        <div className="flex gap-2.5">
                                            {presetColors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setAvatarColor(color)}
                                                    className={`w-8 h-8 rounded-lg ${color} transition-transform hover:scale-110 active:scale-95 ${avatarColor === color ? 'ring-2 ring-zinc-900 ring-offset-2' : 'opacity-80'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleSaveAvatar}
                                    className="bg-[#1f9e8e] hover:bg-[#177a6d] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs"
                                >
                                    {isSavingAvatar ? "Saving..." : "Save Picture"}
                                </Button>
                            </div>
                        </section>

                        {/* Personal Info */}
                        <section>
                            <h2 className="text-sm font-mono font-bold text-zinc-500 mb-2 uppercase tracking-wider">Personal Information</h2>
                            <div className="p-6 rounded-2xl border border-[#dedee2] bg-white shadow-xs space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-mono text-zinc-600">Full Name</Label>
                                        <Input
                                            value={personal.name}
                                            onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                                            placeholder="Vedant Sharma"
                                            className="bg-zinc-50 border-zinc-300 text-zinc-900 text-xs rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-mono text-zinc-600">Email Address</Label>
                                        <Input
                                            value={personal.email}
                                            onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                                            placeholder="you@example.com"
                                            className="bg-zinc-50 border-zinc-300 text-zinc-900 text-xs rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button
                                        onClick={handleSavePersonal}
                                        className="bg-[#1f9e8e] hover:bg-[#177a6d] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs"
                                    >
                                        {isSavingPersonal ? "Saving..." : "Save Info"}
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Work & Role Info */}
                        <section>
                            <h2 className="text-sm font-mono font-bold text-zinc-500 mb-2 uppercase tracking-wider">Professional Info</h2>
                            <div className="p-6 rounded-2xl border border-[#dedee2] bg-white shadow-xs space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-mono text-zinc-600">Job Title / Role</Label>
                                        <Input
                                            value={work.jobTitle}
                                            onChange={(e) => setWork({ ...work, jobTitle: e.target.value })}
                                            placeholder="Data Engineer"
                                            className="bg-zinc-50 border-zinc-300 text-zinc-900 text-xs rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-mono text-zinc-600">Company / Organization</Label>
                                        <Input
                                            value={work.company}
                                            onChange={(e) => setWork({ ...work, company: e.target.value })}
                                            placeholder="TechCorp"
                                            className="bg-zinc-50 border-zinc-300 text-zinc-900 text-xs rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-mono text-zinc-600">Bio & Goals</Label>
                                    <Textarea
                                        value={work.description}
                                        onChange={(e) => setWork({ ...work, description: e.target.value })}
                                        placeholder="Practicing advanced window functions, CTEs, PySpark distributed pipelines..."
                                        rows={3}
                                        className="bg-zinc-50 border-zinc-300 text-zinc-900 text-xs rounded-xl"
                                    />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button
                                        onClick={handleSaveWork}
                                        className="bg-[#1f9e8e] hover:bg-[#177a6d] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs"
                                    >
                                        {isSavingWork ? "Saving..." : "Save Professional Details"}
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
