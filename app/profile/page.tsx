"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Share2, Search, Filter, Loader2, Sparkles, User, Briefcase, GraduationCap, History, BarChart2, Flame, Calendar, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x: number, y: number, r: number, startAngle: number, endAngle: number) {
    if (Math.abs(endAngle - startAngle) < 0.1) endAngle = startAngle + 0.1;
    const start = polarToCartesian(x, y, r, startAngle);
    const end = polarToCartesian(x, y, r, endAngle);
    let largeArcFlag = "0";
    if (endAngle >= startAngle) {
        largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    } else {
        largeArcFlag = (endAngle + 360.0) - startAngle <= 180 ? "0" : "1";
    }
    return [
        "M", start.x, start.y,
        "A", r, r, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
    const [realStats, setRealStats] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        full_name: "",
        occupation: "",
        job_role: "",
        experience_years: 0
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            try {
                const [data, s, sub, h] = await Promise.all([
                    api.getProfile(),
                    api.getStats(),
                    api.getRecentSubmissions(),
                    api.getHeatmap()
                ]);

                setProfile(data);
                setRealStats(s);
                setSubmissions(sub || []);
                setHeatmapData(h || {});

                if (data && data.exists) {
                    setFormData({
                        full_name: data.full_name || "",
                        occupation: data.occupation || "",
                        job_role: data.job_role || "",
                        experience_years: data.experience_years || 0
                    });
                }
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);

    const handleOnboard = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.updateProfile(formData);
            const updated = await api.getProfile();
            setProfile(updated);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save profile", err);
        } finally {
            setIsSaving(false);
        }
    };

    const stats = {
        easy: { solved: realStats?.easy?.solved || 0, total: realStats?.easy?.total || 1, color: "#4DD4C4" },
        medium: { solved: realStats?.medium?.solved || 0, total: realStats?.medium?.total || 1, color: "#eab308" },
        hard: { solved: realStats?.advanced?.solved || 0, total: realStats?.advanced?.total || 1, color: "#f87171" },
    };

    const totalQuestions = stats.easy.total + stats.medium.total + stats.hard.total;
    const totalSolved = stats.easy.solved + stats.medium.solved + stats.hard.solved;

    const gap = 16;
    const availableAngle = 360 - gap * 3;

    const easyAngle = (stats.easy.total / totalQuestions) * availableAngle;
    const mediumAngle = (stats.medium.total / totalQuestions) * availableAngle;
    const hardAngle = (stats.hard.total / totalQuestions) * availableAngle;

    const segments = [
        { id: 'easy', start: 0, end: easyAngle, solved: stats.easy.solved, total: stats.easy.total, color: stats.easy.color },
        { id: 'medium', start: easyAngle + gap, end: easyAngle + gap + mediumAngle, solved: stats.medium.solved, total: stats.medium.total, color: stats.medium.color },
        { id: 'hard', start: easyAngle + mediumAngle + gap * 2, end: easyAngle + mediumAngle + hardAngle + gap * 2, solved: stats.hard.solved, total: stats.hard.total, color: stats.hard.color }
    ];

    const getDiffStyle = (level: string) => {
        const l = level.toLowerCase();
        switch (l) {
            case "easy":
            case "basic": return { color: "text-[#4DD4C4]", bg: "bg-[#4DD4C4]/10", border: "border-[#4DD4C4]/20", label: "BASIC" };
            case "medium":
            case "intermediate": return { color: "text-[#eab308]", bg: "bg-[#eab308]/10", border: "border-[#eab308]/20", label: "INTERMEDIATE" };
            case "advanced":
            case "hard": return { color: "text-[#f87171]", bg: "bg-[#f87171]/10", border: "border-[#f87171]/20", label: "ADVANCED" };
            default: return { color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", label: "UNKNOWN" };
        }
    };

    const filteredSubmissions = submissions.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const heatmapMonths = useMemo(() => {
        const data = [];
        const startYear = 2025;
        const startMonth = 2; // March (0-indexed)

        for (let i = 0; i < 12; i++) {
            const date = new Date(startYear, startMonth + i, 1);
            const year = date.getFullYear();
            const month = date.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDay = date.getDay();

            const weeks = [];
            let currentWeek = Array(7).fill(-1);

            for (let day = 1; day <= daysInMonth; day++) {
                const dayOfWeek = (startDay + day - 1) % 7;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                let activity = heatmapData[dateStr] || 0;
                currentWeek[dayOfWeek] = activity;
                if (dayOfWeek === 6 || day === daysInMonth) {
                    weeks.push([...currentWeek]);
                    currentWeek = Array(7).fill(-1);
                }
            }
            data.push({ name: date.toLocaleString('default', { month: 'short' }), weeks });
        }
        return data;
    }, [heatmapData]);

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#080c16] text-white">
                <Loader2 size={32} className="animate-spin text-[#4DD4C4] mb-4" />
                <p className="text-zinc-500 font-mono text-sm">Authenticating Profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#080c16] text-white p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                    <History className="text-red-400" size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">Session Expired or Invalid</h2>
                <p className="text-zinc-400 max-w-sm mb-6">We couldn't verify your session. Please try logging in again to access your profile.</p>
                <div className="flex gap-4">
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#131924] border border-[#202736] rounded-xl text-sm font-bold">Retry</button>
                    <Link href="/"><button className="px-6 py-2 bg-[#4DD4C4] text-[#080c16] rounded-xl text-sm font-bold">Go Home</button></Link>
                </div>
            </div>
        );
    }

    if (profile && (!profile.exists || isEditing)) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-[#080c16] flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full p-8 rounded-3xl border border-[#202736] bg-[#131924] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4DD4C4] to-transparent opacity-50"></div>
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#4DD4C4]/10 flex items-center justify-center mb-4 border border-[#4DD4C4]/20">
                            <Sparkles className="text-[#4DD4C4]" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{profile.exists && isEditing ? "Update Your Profile" : "Complete Your Profile"}</h2>
                        <p className="text-zinc-400 text-sm">
                            {profile.exists && isEditing
                                ? "Update your details below to keep your profile accurate and professional."
                                : "Welcome back! Tell us a bit about yourself to unlock practice problems and track your progress."}
                        </p>
                    </div>

                    <form onSubmit={handleOnboard} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Full Name</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                                <input
                                    required
                                    type="text"
                                    placeholder="Vedant Sharma"
                                    className="w-full bg-[#0b101c] border border-[#202736] rounded-xl text-sm py-2.5 pl-10 pr-4 text-white outline-none focus:border-[#4DD4C4]/50 transition-all"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Occupation</label>
                                <div className="relative">
                                    <GraduationCap size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                                    <select
                                        required
                                        className="w-full bg-[#0b101c] border border-[#202736] rounded-xl text-sm py-2.5 pl-10 pr-4 text-white outline-none focus:border-[#4DD4C4]/50 transition-all appearance-none inline-block align-middle cursor-pointer"
                                        value={formData.occupation}
                                        onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        <option value="student">Student</option>
                                        <option value="professional">Professional</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Exp (Years)</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    max="50"
                                    className="w-full bg-[#0b101c] border border-[#202736] rounded-xl text-sm py-2.5 px-4 text-white outline-none focus:border-[#4DD4C4]/50 transition-all"
                                    value={formData.experience_years}
                                    onChange={e => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Job Role / Interest</label>
                            <div className="relative">
                                <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                                <input
                                    required
                                    type="text"
                                    placeholder="Data Analyst, Student, etc."
                                    className="w-full bg-[#0b101c] border border-[#202736] rounded-xl text-sm py-2.5 pl-10 pr-4 text-white outline-none focus:border-[#4DD4C4]/50 transition-all"
                                    value={formData.job_role}
                                    onChange={e => setFormData({ ...formData, job_role: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={isSaving}
                            type="submit"
                            className="w-full bg-[#4DD4C4] text-[#080c16] font-bold py-3 rounded-xl mt-6 hover:bg-[#3dbdb0] transition-colors flex items-center justify-center gap-2 group shadow-xl shadow-[#4DD4C4]/20"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <>{profile.exists && isEditing ? "Save Changes" : "Start Journey"} {profile.exists && isEditing ? <Edit2 size={18} /> : <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />}</>}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#080c16] text-zinc-300 font-sans pb-16 relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4DD4C4]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] bg-[#3b82f6]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] bg-[#8b5cf6]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

            <div className="w-full bg-gradient-to-b from-[#131924]/80 to-transparent h-48 absolute top-0 left-0 pointer-events-none opacity-50 backdrop-blur-sm z-0"></div>

            <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pt-8 lg:pt-12">
                
                {/* --- LEFT COLUMN: Profile & Quick Info --- */}
                <div className="lg:col-span-4 lg:row-span-2 flex flex-col gap-6">
                    
                    {/* Main Profile Card */}
                    <div className="group relative bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-8 flex flex-col items-center text-center shadow-xl hover:border-[#4DD4C4]/30 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4DD4C4]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative w-[110px] h-[110px] rounded-[32px] mb-6 p-1 border border-[#4DD4C4]/30 bg-[#4DD4C4]/5 group-hover:border-[#4DD4C4]/60 group-hover:bg-[#4DD4C4]/10 transition-all duration-500 shadow-[0_0_15px_rgba(77,212,196,0.1)] group-hover:shadow-[0_0_20px_rgba(77,212,196,0.3)]">
                            <div className="w-full h-full rounded-[28px] overflow-hidden bg-[#080c16] flex justify-center items-center border border-[#202736]/50">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <User size={40} className="text-zinc-600" />
                                )}
                            </div>
                        </div>
                        
                        <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">{profile.full_name || 'Member'}</h1>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 text-[#4DD4C4] text-[12px] font-bold tracking-wide">
                            <Flame size={12} /> {profile.job_role || profile.occupation || 'Learner'}
                        </div>
                        <p className="text-[13px] text-zinc-400 mt-3 font-medium">{profile.email}</p>

                        <div className="w-full mt-6 flex gap-2.5 relative z-10 px-2 lg:px-4">
                            <button onClick={() => setIsEditing(true)} className="flex-1 bg-gradient-to-r from-[#4DD4C4] to-[#34b6a5] hover:opacity-90 text-[#080c16] font-bold rounded-xl py-2.5 text-[13px] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(77,212,196,0.2)] hover:shadow-[0_0_20px_rgba(77,212,196,0.3)] transform hover:-translate-y-0.5">
                                <Edit2 size={14} /> Edit Profile
                            </button>
                            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Copied!"); }} className="w-[42px] h-[42px] bg-[#202736]/40 hover:bg-[#202736]/80 backdrop-blur-md text-zinc-300 rounded-xl flex items-center justify-center transition-all duration-300 border border-[#202736] hover:border-[#4DD4C4]/50 hover:text-[#4DD4C4] shadow-sm shrink-0">
                                <Share2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats Overview */}
                    <div className="bg-[#131924]/60 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-8 flex flex-col gap-6 shadow-lg hover:border-[#202736] transition-colors duration-300">
                        <div className="space-y-5">
                            <div className="group flex items-center justify-between p-3 rounded-2xl hover:bg-[#202736]/40 transition-colors cursor-pointer border border-transparent hover:border-[#202736]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-orange-400 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(249,115,22,0.1)] group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                                        <Flame size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[15px] font-bold text-white tracking-wide">24 Days</span>
                                        <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Max Streak</span>
                                    </div>
                                </div>
                                <ChevronRight className="text-zinc-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" size={16}/>
                            </div>
                        </div>
                    </div>

                    {/* Pro Upgrade Card */}
                    <Link href="/pricing" className="group bg-[#131924]/60 backdrop-blur-xl border border-[#202736]/80 hover:border-[#4DD4C4]/40 rounded-[32px] p-6 flex flex-col gap-4 shadow-lg transition-all duration-300 relative overflow-hidden block cursor-pointer">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4DD4C4]/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#4DD4C4]/15 transition-colors duration-500"></div>
                        <div className="flex items-center justify-between relative z-10 w-full pl-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[18px] bg-[#4DD4C4]/10 text-[#4DD4C4] flex items-center justify-center border border-[#4DD4C4]/20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(77,212,196,0.1)] group-hover:shadow-[0_0_20px_rgba(77,212,196,0.3)]">
                                    <Sparkles size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[15px] font-bold text-white tracking-wide group-hover:text-[#4DD4C4] transition-colors">DailySQL Pro</span>
                                    <span className="text-[11px] text-zinc-500 font-semibold tracking-wider mt-0.5 uppercase">Unlock all features</span>
                                </div>
                            </div>
                            <ChevronRight className="text-zinc-600 group-hover:text-[#4DD4C4] group-hover:translate-x-1 transition-all mr-2" size={18}/>
                        </div>
                    </Link>
                </div>

                {/* --- RIGHT COLUMN: Stats & Data --- */}
                {/* Stats Row */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Performance Donut */}
                    <div className="md:col-span-2 bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-8 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                        <div className="flex items-center gap-2 absolute top-8 left-8 w-full">
                            <div className="w-5 h-5 rounded flex items-center justify-center bg-[#34d399]/20 text-[#34d399]">
                                <BarChart2 size={12} strokeWidth={3} />
                            </div>
                            <h3 className="text-[13px] font-bold text-white tracking-wide">Performance</h3>
                        </div>
                        
                        <div className="relative w-48 h-48 mt-6 z-10 transition-transform duration-700 hover:scale-105">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Background Thick Track */}
                                <circle cx="50" cy="50" r="38" stroke="#1c2333" strokeWidth="4" fill="transparent" />
                                
                                {/* Inner Decorative Dashed Ring */}
                                <circle cx="50" cy="50" r="28" stroke="#202736" strokeWidth="1" fill="transparent" strokeDasharray="3 4" opacity="0.6" />

                                {/* Mint Progress Ring */}
                                <circle 
                                    cx="50" cy="50" r="38" 
                                    stroke="#34d399" 
                                    strokeWidth="4" 
                                    fill="transparent" 
                                    strokeDasharray="238.76"
                                    strokeDashoffset={totalQuestions > 0 ? 238.76 - (238.76 * (totalSolved / totalQuestions)) : 238.76}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                                <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest leading-none mb-1.5">Solved</span>
                                <span className="text-[44px] font-black text-white leading-none tracking-tight">{totalSolved}</span>
                            </div>
                        </div>
                    </div>

                    {/* Difficulty Stats List */}
                    <div className="md:col-span-3 bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-8 flex flex-col justify-center shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#202736]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 space-y-7 w-full px-2">
                            {[
                                { id: 'EASY', val: stats.easy.solved, max: stats.easy.total, color: '#34d399' },
                                { id: 'MEDIUM', val: stats.medium.solved, max: stats.medium.total, color: '#fbbf24' },
                                { id: 'HARD', val: stats.hard.solved, max: stats.hard.total, color: '#f87171' }
                            ].map(s => (
                                <div key={s.id} className="relative w-full">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="px-3 py-1 rounded-full border" style={{ borderColor: `${s.color}40`, backgroundColor: `${s.color}10` }}>
                                            <span className="text-[10px] font-extrabold tracking-widest" style={{ color: s.color }}>{s.id}</span>
                                        </div>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-[18px] font-bold text-white leading-none tracking-tight">{s.val}</span>
                                            <span className="text-[13px] font-bold text-[#6B7280]">/ {s.max}</span>
                                        </div>
                                    </div>
                                    <div className="w-[85%] h-1.5 bg-[#1c2333] rounded-full overflow-hidden relative">
                                        <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${s.max ? (s.val / s.max) * 100 : 0}%`, backgroundColor: s.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Heatmap Layout */}
                <div className="lg:col-span-8 bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-8 flex flex-col shadow-lg relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4DD4C4]/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#4DD4C4]/10 transition-colors duration-700"></div>
                    
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-[#4DD4C4]/10 flex items-center justify-center border border-[#4DD4C4]/20"><BarChart2 size={14} className="text-[#4DD4C4]"/></div>
                            <h3 className="text-[15px] font-bold text-white tracking-wide">Activity Map</h3>
                        </div>
                        <div className="flex gap-2 text-[11px] font-semibold tracking-wider uppercase text-zinc-500 bg-[#0b101c] px-3 py-1.5 rounded-lg border border-[#202736]">
                            <span>Mar 2025</span>
                            <span className="text-zinc-700">•</span>
                            <span>Mar 2026</span>
                        </div>
                    </div>
                    
                    <div className="w-full overflow-x-auto pb-6 custom-scrollbar lg:pr-4 relative z-10">
                        <div className="min-w-[700px]">
                            <div className="flex gap-[7px]">
                                {heatmapMonths.map((month, mIdx) => (
                                    <div key={mIdx} className="flex flex-col gap-2">
                                        {mIdx % 2 === 0 ? <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{month.name}</span> : <div className="h-[14px] mb-1"></div>}
                                        <div className="flex gap-[7px]">
                                            {month.weeks.map((week, wIdx) => (
                                                <div key={wIdx} className="flex flex-col gap-[7px]">
                                                    {week.map((dayCount, dIdx) => {
                                                        if (dayCount === -1) return <div key={`${wIdx}-${dIdx}`} className="w-[13px] h-[13px]" />;
                                                        let bgColor = "bg-[#202736]/60 border border-transparent";
                                                        if (dayCount === 1) { bgColor = "bg-[#4DD4C4]/30 border border-[#4DD4C4]/40"; }
                                                        else if (dayCount === 2) { bgColor = "bg-[#4DD4C4]/60 border border-[#4DD4C4]/70"; }
                                                        else if (dayCount >= 3) { bgColor = "bg-[#4DD4C4] border border-[#34b6a5] shadow-[0_0_8px_rgba(77,212,196,0.6)]"; }
                                                        
                                                        return <div key={`${wIdx}-${dIdx}`} className={`w-[13px] h-[13px] rounded-[4px] ${bgColor} transition-all duration-300 cursor-pointer hover:scale-125 hover:z-10`} title={`${dayCount} submissions`} />;
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FULL WIDTH: Submissions --- */}
                <div className="lg:col-span-12 bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-6 lg:p-8 flex flex-col shadow-lg mt-2 relative overflow-hidden">
                    <div className="absolute bottom-[-20%] left-[10%] w-[50%] h-[50%] bg-[#0ea5e9]/5 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 relative z-10">
                        <div className="flex items-center gap-3 pl-2">
                            <h3 className="text-[17px] font-bold text-white tracking-wide">Recent Submissions</h3>
                            <div className="px-2 py-0.5 rounded-full bg-[#202736] text-[10px] font-bold text-zinc-400">{filteredSubmissions.length}</div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-72 group">
                                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#4DD4C4] transition-colors" />
                                <input type="text" placeholder="Search history..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#0b101c]/80 border border-[#202736] text-sm text-zinc-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-[#4DD4C4]/50 focus:shadow-[0_0_15px_rgba(77,212,196,0.1)] transition-all placeholder:text-zinc-600" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 relative z-10">
                        {filteredSubmissions.map(p => {
                            const diffLabels: Record<string, { t: string, b: string, bg: string, icon: string, shadow: string }> = {
                                easy: { t: 'text-[#4DD4C4]', b: 'border-[#4DD4C4]/30', bg: 'bg-[#4DD4C4]/10', icon: 'bg-[#4DD4C4]', shadow: 'group-hover:shadow-[0_4px_20px_rgba(77,212,196,0.08)]' },
                                medium: { t: 'text-[#eab308]', b: 'border-[#eab308]/30', bg: 'bg-[#eab308]/10', icon: 'bg-[#eab308]', shadow: 'group-hover:shadow-[0_4px_20px_rgba(234,179,8,0.08)]' },
                                hard: { t: 'text-[#f87171]', b: 'border-[#f87171]/30', bg: 'bg-[#f87171]/10', icon: 'bg-[#f87171]', shadow: 'group-hover:shadow-[0_4px_20px_rgba(248,113,113,0.08)]' },
                            };
                            const st = diffLabels[p.difficulty.toLowerCase()] || { t: 'text-zinc-400', b: 'border-[#202736]', bg: 'bg-[#202736]/30', icon: 'bg-zinc-500', shadow: 'group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]' };

                            return (
                                <div key={p.id} className={`p-5 rounded-[24px] bg-[#0b101c]/60 hover:bg-[#131924] border border-[#202736] hover:border-[#202736] flex flex-col gap-4 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group ${st.shadow}`}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <div className={`w-2 h-2 rounded-full ${st.icon} shadow-[0_0_8px_${st.icon.replace('bg-', '')}]`}></div>
                                            </div>
                                            <span className="text-[14px] font-semibold text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">{p.title}</span>
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-[8px] border ${st.b} ${st.t} ${st.bg} shrink-0`}>
                                            {p.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#202736]/50">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            <span className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors">Success • Yesterday</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#202736]/50 group-hover:bg-[#202736] transition-colors">
                                            <span className="text-[10px] font-mono font-medium text-zinc-400">42ms</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
