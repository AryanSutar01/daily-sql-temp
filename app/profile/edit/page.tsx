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

    const [avatarColor, setAvatarColor] = useState("bg-[#4DD4C4]");

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
            // Optional: route back to profile after entirely saving
            router.push("/profile");
        }, 600);
    };

    const presetColors = ["bg-[#4DD4C4]", "bg-emerald-300", "bg-blue-300", "bg-amber-300"];

    return (
        <div className="fixed inset-0 top-0 z-[100] flex flex-col overflow-y-auto bg-[#080c16] text-zinc-200">
            <StandaloneNavbar />
            <div className="py-12 px-4 sm:px-6 lg:px-8 shrink-0">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <Link href="/profile">
                            <Button variant="outline" className="bg-[#60a5fa]/10 text-[#60a5fa] border-[#60a5fa]/30 hover:bg-[#60a5fa]/20 shadow-[0_0_10px_rgba(96,165,250,0.1)] gap-2 h-10 px-6">
                                <ArrowLeft size={16} /> Back
                            </Button>
                        </Link>
                        <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            DailySQL
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Top Section: Profile Picture */}
                        <section>
                            <h2 className="text-lg font-mono font-medium text-zinc-400 mb-3 tracking-tight">Profile Picture</h2>
                            <div className="p-6 rounded-2xl border border-[#202736] bg-[#131924] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group">
                                <div className="flex items-center gap-8">
                                    <div className={`w-28 h-28 rounded-2xl ${avatarColor} flex items-center justify-center relative shadow-xl shrink-0 transition-colors duration-300`}>
                                        <svg className="w-16 h-16 text-[#080c16]/30" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                        <button className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#131924] border border-[#202736] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#4DD4C4] transition-colors shadow-lg">
                                            <Edit2 size={14} />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-zinc-500">or Use an avatar instead</p>
                                        <div className="flex gap-3">
                                            {presetColors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setAvatarColor(color)}
                                                    className={`w-10 h-10 rounded-xl ${color} shadow-lg transition-transform hover:scale-110 active:scale-95 ${avatarColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#131924]' : 'opacity-80'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleSaveAvatar}
                                    disabled={isSavingAvatar}
                                    className="bg-[#4DD4C4]/10 text-[#4DD4C4] hover:bg-[#4DD4C4]/20 border border-[#4DD4C4]/20 transition-all font-semibold w-full sm:w-auto"
                                >
                                    {isSavingAvatar ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </section>

                        {/* Middle Section: Personal Details */}
                        <section>
                            <h2 className="text-lg font-mono font-medium text-zinc-400 mb-3 tracking-tight">Personal Details</h2>
                            <div className="p-6 rounded-2xl border border-[#202736] bg-[#131924] relative overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Name</Label>
                                        <Input value={personal.name} onChange={e => setPersonal({ ...personal, name: e.target.value })} className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50 max-w-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">E-mail</Label>
                                        <Input value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} type="email" className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Mobile Number</Label>
                                        <div className="flex gap-2">
                                            <Input value={personal.mobile} onChange={e => setPersonal({ ...personal, mobile: e.target.value })} className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50 w-20 text-center" />
                                            <Input value={personal.mobileNum} onChange={e => setPersonal({ ...personal, mobileNum: e.target.value })} className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50 flex-1" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Birth Date</Label>
                                        <Input type="date" value={personal.birthDate} onChange={e => setPersonal({ ...personal, birthDate: e.target.value })} className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50 max-w-[200px]" style={{ colorScheme: 'dark' }} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Country</Label>
                                        <Input value={personal.country} onChange={e => setPersonal({ ...personal, country: e.target.value })} className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50 max-w-[200px]" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSavePersonal}
                                        disabled={isSavingPersonal}
                                        className="bg-[#4DD4C4]/10 text-[#4DD4C4] hover:bg-[#4DD4C4]/20 border border-[#4DD4C4]/20 transition-all font-semibold w-full sm:w-auto"
                                    >
                                        {isSavingPersonal ? "Saving..." : "Save"}
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Bottom Section: Work Experience */}
                        <section>
                            <h2 className="text-lg font-mono font-medium text-zinc-400 mb-3 tracking-tight">Work Experience</h2>
                            <div className="p-6 rounded-2xl border border-[#202736] bg-[#131924] relative overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Role Category</Label>
                                        <Input value={work.category} onChange={e => setWork({ ...work, category: e.target.value })} className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Company/College Name</Label>
                                        <Input value={work.company} onChange={e => setWork({ ...work, company: e.target.value })} className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Job title</Label>
                                        <Input value={work.jobTitle} onChange={e => setWork({ ...work, jobTitle: e.target.value })} className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Years of Experience</Label>
                                        <Input value={work.experience} onChange={e => setWork({ ...work, experience: e.target.value })} className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50 max-w-[200px]" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Location</Label>
                                        <Input value={work.location} onChange={e => setWork({ ...work, location: e.target.value })} className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50 max-w-[200px]" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2 relative">
                                        <Label className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Description</Label>
                                        <div className="relative">
                                            <Textarea
                                                value={work.description}
                                                onChange={e => setWork({ ...work, description: e.target.value })}
                                                className="bg-[#0b101c] border-[#202736] focus:border-[#4DD4C4]/50 min-h-[100px] pt-8"
                                            />
                                            <Edit2 size={12} className="absolute top-3 left-3 text-zinc-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSaveWork}
                                        disabled={isSavingWork}
                                        className="bg-[#4DD4C4]/10 text-[#4DD4C4] hover:bg-[#4DD4C4]/20 border border-[#4DD4C4]/20 transition-all font-semibold w-full sm:w-auto"
                                    >
                                        {isSavingWork ? "Saving..." : "Save"}
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
