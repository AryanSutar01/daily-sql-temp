"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Search, Loader2, Sparkles, User, Briefcase, GraduationCap, History, BarChart2, Flame, X, Code, Camera, CheckCircle2, AlertCircle, Trophy } from "lucide-react";
import { useRef } from "react";
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
    const [viewingCode, setViewingCode] = useState<{ title: string; query: string } | null>(null);
    const [loadingCode, setLoadingCode] = useState(false);
    const [selectedYear, setSelectedYear] = useState<string>('last_12');
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        full_name: "",
        occupation: "",
        job_role: "",
        experience_years: 0,
        avatar_url: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-clear toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        async function loadProfile() {
            // SET USE_MOCK to false to fetch real data
            const USE_MOCK = false;

            if (USE_MOCK) {
                const mockProfile = {
                    exists: true,
                    full_name: "John Doe",
                    email: "john.doe@example.com",
                    occupation: "Professional",
                    job_role: "Senior Data Analyst",
                    avatar_url: null,
                    experience_years: 5
                };
                const mockStats = {
                    easy: { solved: 55, total: 100 },
                    medium: { solved: 32, total: 80 },
                    advanced: { solved: 12, total: 40 }
                };
                const mockSubmissions = [
                    { id: 1, title: "Find Top 3 Sales by Department", difficulty: "Medium", status: "Success" },
                    { id: 2, title: "Calculate Monthly Growth Rate", difficulty: "Hard", status: "Success" },
                    { id: 3, title: "Basic Select and Filter", difficulty: "Easy", status: "Success" },
                    { id: 4, title: "Group by and Having Clause", difficulty: "Medium", status: "Success" },
                ];
                const mockHeatmap = {
                    "2025-03-25": 3,
                    "2025-03-24": 2,
                    "2025-03-23": 5,
                    "2025-03-22": 1,
                    "2025-03-21": 0,
                    "2025-03-20": 4
                };

                setProfile(mockProfile);
                setRealStats(mockStats);
                setSubmissions(mockSubmissions);
                setHeatmapData(mockHeatmap);
                setFormData({
                    full_name: mockProfile.full_name,
                    occupation: mockProfile.occupation,
                    job_role: mockProfile.job_role,
                    experience_years: mockProfile.experience_years,
                    avatar_url: mockProfile.avatar_url || ""
                });
                setIsLoading(false);
                return;
            }

            try {
                const [data, s, sub, h, lb] = await Promise.all([
                    api.getProfile(),
                    api.getStats(),
                    api.getRecentSubmissions(),
                    api.getHeatmap(),
                    api.getLeaderboard().catch(() => [])
                ]);

                setProfile(data);
                setRealStats(s);
                setSubmissions(sub || []);
                setHeatmapData(h || {});
                setLeaderboard(lb || []);

                if (data && data.exists) {
                    setFormData({
                        full_name: data.full_name || "",
                        occupation: data.occupation || "",
                        job_role: data.job_role || "",
                        experience_years: data.experience_years || 0,
                        avatar_url: data.avatar_url || ""
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
            
            // Redirect to practice page after successful onboarding/update
            router.push("/practice/daily");
        } catch (err) {
            console.error("Failed to save profile", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setToast({ type: 'error', message: "Please select a valid image file (PNG, JPG, etc)." });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setToast({ type: 'error', message: "Image is too large. Please select a photo under 2MB." });
            return;
        }

        setIsUploading(true);
        setToast(null);
        try {
            // 1. Get signature from backend
            const sigData = await api.getCloudinarySignature();

            // 2. Upload to Cloudinary
            const fd = new FormData();
            fd.append("file", file);
            fd.append("api_key", sigData.api_key);
            fd.append("timestamp", String(sigData.timestamp));
            fd.append("signature", sigData.signature);
            fd.append("public_id", sigData.public_id);
            fd.append("folder", sigData.folder);

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`, {
                method: "POST",
                body: fd
            });

            if (!uploadRes.ok) throw new Error("Cloudinary upload failed");

            const result = await uploadRes.json();
            const newAvatarUrl = result.secure_url;

            // 3. Update local state and backend
            const updatedFormData = { ...formData, avatar_url: newAvatarUrl };
            setFormData(updatedFormData);
            await api.updateProfile(updatedFormData);
            
            // Update profile state to reflect change immediately
            setProfile((prev: any) => ({ ...prev, avatar_url: newAvatarUrl }));
            setToast({ type: 'success', message: "Profile photo updated successfully!" });
            
        } catch (err) {
            console.error("Upload failed", err);
            setToast({ type: 'error', message: "Failed to upload photo. Please try again." });
        } finally {
            setIsUploading(false);
        }
    };

    const stats = {
        easy: { solved: realStats?.easy?.solved || 0, total: realStats?.easy?.total || 1, color: "#00b8a3" },
        medium: { solved: realStats?.medium?.solved || 0, total: realStats?.medium?.total || 1, color: "#ffc01e" },
        hard: { solved: realStats?.advanced?.solved || 0, total: realStats?.advanced?.total || 1, color: "#ff375f" },
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

    const { heatmapWeeks, monthLabels, heatmapRangeLabel } = useMemo(() => {
        const now = new Date();
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        let endDate: Date;
        let startDate: Date;
        let finalLabel = "";

        if (selectedYear === 'last_12') {
            endDate = new Date(todayMidnight);
            const endDayOfWeek = endDate.getDay();
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - (52 * 7) - endDayOfWeek);
            
            const startStr = startDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase();
            const endStr = endDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase();
            finalLabel = `${startStr} — ${endStr}`;
        } else {
            const year = parseInt(selectedYear, 10);
            startDate = new Date(year, 0, 1); // Jan 1st
            const startDay = startDate.getDay();
            if (startDay !== 0) {
                startDate.setDate(startDate.getDate() - startDay);
            }
            // Always generate full year grid to maintain layout width
            endDate = new Date(year, 11, 31); 
            finalLabel = selectedYear;
        }

        const weeks = [];
        const labels: { name: string, colIndex: number }[] = [];
        let currentMonth = -1;

        let currentDate = new Date(startDate);
        let col = 0;
        
        while (currentDate <= endDate) {
            const week = [];
            for (let row = 0; row < 7; row++) {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const day = currentDate.getDate();
                
                // Labels processing (only push if it belongs to the target year view)
                if ((selectedYear === 'last_12' || year === parseInt(selectedYear)) && 
                   ((month !== currentMonth && row === 0) || (month !== currentMonth && day === 1))) {
                    labels.push({ name: currentDate.toLocaleString('default', { month: 'short' }), colIndex: col });
                    currentMonth = month;
                }

                // Push -1 for future days if "last_12" mode, OR padding days of other years in specific year mode
                if (selectedYear === 'last_12' && currentDate > todayMidnight) {
                    week.push(-1); 
                } else if (selectedYear !== 'last_12' && year !== parseInt(selectedYear, 10)) {
                    week.push(-1); 
                } else {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const activity = heatmapData[dateStr] || 0;
                    week.push(activity);
                }
                
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(week);
            col++;
        }

        return { 
            heatmapWeeks: weeks, 
            monthLabels: labels,
            heatmapRangeLabel: finalLabel 
        };
    }, [heatmapData, selectedYear]);

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

    if (profile && (!profile.onboarding_completed || isEditing)) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-[#080c16] flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full p-8 rounded-3xl border border-[#202736] bg-[#131924] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4DD4C4] to-transparent opacity-50"></div>
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#4DD4C4]/10 flex items-center justify-center mb-4 border border-[#4DD4C4]/20">
                            <Sparkles className="text-[#4DD4C4]" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{profile.onboarding_completed ? "Update Your Profile" : "Complete Your Profile"}</h2>
                        <p className="text-zinc-400 text-sm">
                            {profile.onboarding_completed
                                ? "Update your details below to keep your profile accurate and professional."
                                : "Welcome! Tell us a bit about yourself to unlock practice problems and track your progress."}
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

                        {!isEditing && !profile.exists && (
                            <div className="text-center mt-4">
                                <Link
                                    href="/practice/daily"
                                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1 group"
                                >
                                    Skip for now
                                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                </Link>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="min-h-[calc(100vh-64px)] bg-[#080c16] text-zinc-300 font-sans pb-16 relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4DD4C4]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] bg-[#3b82f6]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] bg-[#8b5cf6]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

            <div className="w-full bg-gradient-to-b from-[#131924]/80 to-transparent h-48 absolute top-0 left-0 pointer-events-none opacity-50 backdrop-blur-sm z-0"></div>

            <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pt-8 lg:pt-12">
                
                {/* --- LEFT COLUMN: Profile & Quick Info --- */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Main Profile Card */}
                    <div className="group relative bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-8 flex flex-col items-center text-center shadow-xl hover:border-[#4DD4C4]/30 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4DD4C4]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div 
                            onClick={handlePhotoClick}
                            className="relative w-[110px] h-[110px] rounded-[32px] mb-6 p-1 border border-[#4DD4C4]/30 bg-[#4DD4C4]/5 group-hover:border-[#4DD4C4]/60 group-hover:bg-[#4DD4C4]/10 transition-all duration-500 shadow-[0_0_15px_rgba(77,212,196,0.1)] group-hover:shadow-[0_0_20px_rgba(77,212,196,0.3)] cursor-pointer overflow-hidden"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/*"
                            />
                            <div className="w-full h-full rounded-[28px] overflow-hidden bg-[#080c16] flex justify-center items-center border border-[#202736]/50 relative group/avatar">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <User size={40} className="text-zinc-600" />
                                )}
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                                    {isUploading ? (
                                        <Loader2 size={24} className="text-[#4DD4C4] animate-spin" />
                                    ) : (
                                        <Camera size={24} className="text-white" />
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">{profile.full_name || 'Member'}</h1>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 text-[#4DD4C4] text-[12px] font-bold tracking-wide">
                            <Flame size={12} /> {profile.job_role || profile.occupation || 'Learner'}
                        </div>
                        <p className="text-[13px] text-zinc-400 mt-3 font-medium">{profile.email}</p>

                        <div className="w-full mt-6 relative z-10 px-2 lg:px-4">
                            <button onClick={() => setIsEditing(true)} className="w-full bg-gradient-to-r from-[#4DD4C4] to-[#34b6a5] hover:opacity-90 text-[#080c16] font-bold rounded-xl py-2.5 text-[13px] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(77,212,196,0.2)] hover:shadow-[0_0_20px_rgba(77,212,196,0.3)] transform hover:-translate-y-0.5">
                                <Edit2 size={14} /> Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Leaderboard Card */}
                    <div className="relative flex-1 bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-6 flex flex-col shadow-xl overflow-hidden group hover:border-[#4DD4C4]/20 transition-all duration-500">
                        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#f59e0b]/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#f59e0b]/10 transition-colors duration-700"></div>
                        
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5 relative z-10">
                            <div className="w-8 h-8 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center border border-[#f59e0b]/20 shrink-0">
                                <Trophy size={14} className="text-[#f59e0b]" />
                            </div>
                            <h3 className="text-[14px] font-bold text-white tracking-wide">Leaderboard</h3>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar relative z-10">
                            {leaderboard.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                                    <Trophy size={28} className="text-zinc-700" />
                                    <p className="text-xs text-zinc-500">No data yet</p>
                                </div>
                            ) : leaderboard.map((entry, idx) => {
                                const isCurrentUser = profile && entry.user_id === profile.user_id;
                                const rankColors = [
                                    'text-[#f59e0b]',   // Gold - 1st
                                    'text-[#94a3b8]',   // Silver - 2nd
                                    'text-[#b45309]',   // Bronze - 3rd
                                ];
                                const rankBg = [
                                    'bg-[#f59e0b]/10 border-[#f59e0b]/30',
                                    'bg-[#94a3b8]/10 border-[#94a3b8]/30',
                                    'bg-[#b45309]/10 border-[#b45309]/30',
                                ];
                                return (
                                    <div
                                        key={entry.user_id}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                                            isCurrentUser
                                                ? 'bg-[#4DD4C4]/8 border-[#4DD4C4]/30 shadow-[0_0_10px_rgba(77,212,196,0.08)]'
                                                : 'bg-[#0b101c]/40 border-[#202736] hover:border-[#202736]/80 hover:bg-[#131924]/60'
                                        }`}
                                    >
                                        {/* Rank */}
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border shrink-0 ${
                                            idx < 3 ? rankBg[idx] + ' ' + rankColors[idx] : 'bg-[#202736]/60 border-[#202736] text-zinc-500'
                                        }`}>
                                            {idx + 1}
                                        </div>

                                        {/* Avatar */}
                                        <div className="w-7 h-7 rounded-lg bg-[#0b101c] border border-[#202736] flex items-center justify-center overflow-hidden shrink-0">
                                            {entry.avatar_url ? (
                                                <img src={entry.avatar_url} alt={entry.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={14} className="text-zinc-600" />
                                            )}
                                        </div>

                                        {/* Name + Role */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-[12px] font-semibold truncate ${
                                                    isCurrentUser ? 'text-[#4DD4C4]' : 'text-zinc-200'
                                                }`}>
                                                    {entry.full_name}
                                                </span>
                                                {isCurrentUser && (
                                                    <span className="text-[9px] font-bold text-[#4DD4C4]/70 bg-[#4DD4C4]/10 px-1.5 py-0.5 rounded-full border border-[#4DD4C4]/20 shrink-0">YOU</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-0 shrink-0">
                                            {entry.current_streak > 0 && (
                                                <>
                                                    <div className="flex items-center gap-1 px-2">
                                                        <Flame size={10} className="text-[#4DD4C4] fill-[#4DD4C4]" />
                                                        <span className="text-[11px] font-bold text-zinc-300 tabular-nums">{entry.current_streak}</span>
                                                    </div>
                                                    <div className="w-px h-3 bg-[#202736]" />
                                                </>
                                            )}
                                            <div className="flex items-baseline gap-0.5 pl-2">
                                                <span className="text-[13px] font-extrabold text-white tabular-nums">{entry.total_solved}</span>
                                                <span className="text-[9px] text-zinc-600 font-medium">sol</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Main Content --- */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Top Row: Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Performance Donut */}
                    <div className="md:col-span-2 bg-[#131924]/60 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-6 flex flex-col shadow-lg relative min-h-[250px]">
                        <div className="w-full flex justify-start items-center mb-4 z-20">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#202736]/50 text-[#00b8a3] border border-[#202736] shadow-sm">
                                    <BarChart2 size={16} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[15px] font-bold text-white tracking-wide">Performance</h3>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="relative w-[160px] h-[160px] flex items-center justify-center group">
                                <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
                                {segments.map(seg => {
                                    // Make sure segment isn't negative
                                    if (seg.end <= seg.start) return null;

                                    const solvedAngle = seg.start + (seg.solved / seg.total) * (seg.end - seg.start);
                                    
                                    return (
                                        <g key={seg.id} 
                                           onMouseEnter={() => setHoveredSegment(seg.id)}
                                           onMouseLeave={() => setHoveredSegment(null)}
                                           className="cursor-pointer"
                                        >
                                            {/* Faint Colored Background Track matching the reference image */}
                                            <path 
                                                d={describeArc(50, 50, 42, seg.start, seg.end)} 
                                                stroke={seg.color} 
                                                strokeWidth="5" 
                                                fill="transparent" 
                                                strokeLinecap="round" 
                                                className="transition-all duration-300"
                                                opacity={hoveredSegment && hoveredSegment !== seg.id ? 0.05 : 0.15}
                                            />
                                            
                                            {/* Bright Progress Track */}
                                            {seg.solved > 0 && (
                                                <path 
                                                    d={describeArc(50, 50, 42, seg.start, solvedAngle)} 
                                                    stroke={seg.color} 
                                                    strokeWidth="5" 
                                                    fill="transparent" 
                                                    strokeLinecap="round" 
                                                    className="transition-all duration-700 ease-out"
                                                    style={{
                                                        opacity: hoveredSegment && hoveredSegment !== seg.id ? 0.3 : 1
                                                    }}
                                                />
                                            )}
                                            {/* Invisible wider path for easier hovering */}
                                            <path d={describeArc(50, 50, 42, seg.start, seg.end)} stroke="transparent" strokeWidth="20" fill="transparent" strokeLinecap="round" />
                                        </g>
                                    );
                                })}
                            </svg>
                            
                            {/* Center Numbers with visual dividers mimicking the target image */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                                {hoveredSegment ? (
                                    <>
                                        <span className="text-[32px] font-bold text-white leading-none tracking-tight group-hover:scale-105 transition-transform">
                                            {segments.find(s=>s.id === hoveredSegment)?.solved}
                                        </span>
                                        <div className="w-8 h-[1px] bg-[#202736] my-2"></div>
                                        <span className="text-[14px] font-medium text-zinc-500">
                                            {segments.find(s=>s.id === hoveredSegment)?.total}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-[32px] font-bold text-white leading-none tracking-tight group-hover:scale-105 transition-transform">
                                            {totalSolved}
                                        </span>
                                        <div className="w-8 h-[1px] bg-[#202736] my-2"></div>
                                        <span className="text-[14px] font-medium text-zinc-500">
                                            {totalQuestions}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Difficulty Stats List (LeetCode Wide Rows style) */}
                    <div className="md:col-span-3 bg-[#131924]/60 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-8 flex flex-col justify-center shadow-lg relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#202736]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 flex flex-col gap-8 w-full px-2 max-w-[320px] mx-auto">
                            {[
                                { id: 'EASY', key: 'easy', val: stats.easy.solved, max: stats.easy.total, color: stats.easy.color },
                                { id: 'MEDIUM', key: 'medium', val: stats.medium.solved, max: stats.medium.total, color: stats.medium.color },
                                { id: 'HARD', key: 'hard', val: stats.hard.solved, max: stats.hard.total, color: stats.hard.color }
                            ].map(s => (
                                <div key={s.id} 
                                     className="relative w-full cursor-pointer flex flex-col"
                                     onMouseEnter={() => setHoveredSegment(s.key)}
                                     onMouseLeave={() => setHoveredSegment(null)}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="px-4 py-1.5 rounded-[20px] border shadow-sm" 
                                             style={{ 
                                                 borderColor: `${s.color}30`, 
                                                 backgroundColor: `${s.color}10`, 
                                                 color: s.color 
                                             }}>
                                            <span className="text-[11px] font-black tracking-widest uppercase">{s.id}</span>
                                        </div>
                                        <div className="flex items-baseline gap-1.5 pr-1">
                                            <span className="text-[18px] font-bold text-white leading-none tracking-tight">{s.val}</span>
                                            <span className="text-[13px] font-bold text-zinc-500">/ {s.max}</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#171e2e] rounded-full overflow-hidden relative" style={{ opacity: 0.8 }}>
                                        {/* Very faint inner track, matching image */}
                                        <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${s.max ? (s.val / s.max) * 100 : 0}%`, backgroundColor: `${s.color}30` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                    
                {/* Middle Row: Heatmap */}
                <div className="bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-8 flex flex-col shadow-lg relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4DD4C4]/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#4DD4C4]/10 transition-colors duration-700"></div>
                        
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#4DD4C4]/10 flex items-center justify-center border border-[#4DD4C4]/20"><BarChart2 size={14} className="text-[#4DD4C4]"/></div>
                                <h3 className="text-[15px] font-bold text-white tracking-wide">Activity Map</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex gap-2 text-[11px] font-semibold tracking-wider uppercase text-zinc-500 bg-[#0b101c] px-3 py-1.5 rounded-lg border border-[#202736]">
                                    {heatmapRangeLabel}
                                </div>
                                <select 
                                    className="bg-[#0b101c] border border-[#202736] text-zinc-300 text-[12px] font-semibold tracking-wider rounded-lg px-3 py-1.5 outline-none focus:border-[#4DD4C4]/50 cursor-pointer hover:bg-[#131924] transition-colors"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    <option value="last_12">LAST YEAR</option>
                                    <option value="2026">2026</option>
                                    <option value="2025">2025</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="w-full overflow-x-auto pb-4 custom-scrollbar lg:pr-4 relative z-10 flex justify-center">
                            <div className="min-w-fit flex flex-col gap-2">
                                {/* Month Labels */}
                                <div className="relative h-[14px] w-full mt-1">
                                    {monthLabels.map((lbl, idx) => {
                                        // 15px is the width of one column (11px + 4px gap)
                                        if (idx > 0 && lbl.colIndex - monthLabels[idx - 1].colIndex < 3) return null;
                                        return (
                                            <span 
                                                key={idx} 
                                                className="absolute text-[10px] text-zinc-500 font-bold uppercase tracking-wider" 
                                                style={{ left: `${lbl.colIndex * 15}px`, transform: 'translateX(-2px)' }}
                                            >
                                                {lbl.name}
                                            </span>
                                        );
                                    })}
                                </div>
                                
                                {/* Grid */}
                                <div className="flex gap-[4px]">
                                    {heatmapWeeks.map((week, wIdx) => (
                                        <div key={wIdx} className="flex flex-col gap-[4px]">
                                            {week.map((dayCount, dIdx) => {
                                                if (dayCount === -1) return <div key={`${wIdx}-${dIdx}`} className="w-[11px] h-[11px]" />;
                                                let bgColor = "bg-[#202736]/60 border border-[#202736]/30";
                                                if (dayCount === 1) { bgColor = "bg-[#4DD4C4]/30 border border-[#4DD4C4]/40"; }
                                                else if (dayCount === 2) { bgColor = "bg-[#4DD4C4]/60 border border-[#4DD4C4]/70"; }
                                                else if (dayCount >= 3) { bgColor = "bg-[#4DD4C4] border border-[#34b6a5] shadow-[0_0_8px_rgba(77,212,196,0.5)]"; }
                                                
                                                return (
                                                    <div 
                                                        key={`${wIdx}-${dIdx}`} 
                                                        className={`w-[11px] h-[11px] rounded-[3px] ${bgColor} transition-all duration-300 cursor-pointer hover:scale-125 hover:z-10`} 
                                                        title={`${dayCount} submissions`} 
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Submissions (Same Width) */}
                    <div className="bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-6 lg:p-8 flex flex-col shadow-lg relative overflow-hidden">
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

                        <div className="relative z-10 overflow-y-auto max-h-[500px] custom-scrollbar pr-2 pb-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredSubmissions.map(p => {
                                    const diffLabels: Record<string, { t: string, b: string, bg: string, icon: string, shadow: string }> = {
                                        easy: { t: 'text-[#4DD4C4]', b: 'border-[#4DD4C4]/30', bg: 'bg-[#4DD4C4]/10', icon: 'bg-[#4DD4C4]', shadow: 'group-hover:shadow-[0_4px_20px_rgba(77,212,196,0.08)]' },
                                        medium: { t: 'text-[#eab308]', b: 'border-[#eab308]/30', bg: 'bg-[#eab308]/10', icon: 'bg-[#eab308]', shadow: 'group-hover:shadow-[0_4px_20px_rgba(234,179,8,0.08)]' },
                                        hard: { t: 'text-[#f87171]', b: 'border-[#f87171]/30', bg: 'bg-[#f87171]/10', icon: 'bg-[#f87171]', shadow: 'group-hover:shadow-[0_4px_20px_rgba(248,113,113,0.08)]' },
                                    };
                                    const st = diffLabels[p.difficulty.toLowerCase()] || { t: 'text-zinc-400', b: 'border-[#202736]', bg: 'bg-[#202736]/30', icon: 'bg-zinc-500', shadow: 'group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]' };

                                    return (
                                        <div key={p.id} onClick={async () => {
                                            setLoadingCode(true);
                                            try {
                                                const sol = await api.getSavedSolution(p.id);
                                                if (sol.submitted_query) setViewingCode({ title: p.title, query: sol.submitted_query });
                                            } catch { /* silent */ } finally { setLoadingCode(false); }
                                        }} className={`p-5 rounded-[24px] bg-[#0b101c]/60 hover:bg-[#131924] border border-[#202736] hover:border-[#4DD4C4]/20 flex flex-col gap-4 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group ${st.shadow}`}>
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
                                                    <span className="text-[11px] font-medium text-zinc-500">
                                                        {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Solved'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 group-hover:text-[#4DD4C4] transition-colors">
                                                    <Code size={11} /> View Code
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Code Viewer Modal */}
        {viewingCode && (
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setViewingCode(null)}
            >
                <div
                    className="bg-[#0d121c] border border-[#202736] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#202736] bg-[#131924] shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 flex items-center justify-center">
                                <Code size={14} className="text-[#4DD4C4]" />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Submitted Solution</p>
                                <h3 className="text-sm font-bold text-white leading-tight line-clamp-1">{viewingCode?.title}</h3>
                            </div>
                        </div>
                        <button
                            onClick={() => setViewingCode(null)}
                            className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#202736]"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto p-6 bg-[#0b101c]">
                        <pre className="text-[13px] text-[#4DD4C4] font-mono leading-relaxed whitespace-pre-wrap break-words">
                            {viewingCode?.query}
                        </pre>
                    </div>
                    <div className="px-6 py-3 border-t border-[#202736] bg-[#0d121c] flex justify-between items-center shrink-0">
                        <span className="text-[10px] text-zinc-600 font-mono">PostgreSQL</span>
                        <button
                            onClick={() => navigator.clipboard.writeText(viewingCode?.query ?? '')}
                            className="text-[11px] font-medium text-zinc-400 hover:text-[#4DD4C4] transition-colors"
                        >
                            Copy to clipboard
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* ══ Auth Toast ══ */}
        {toast && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-bottom-5 duration-300">
                <div className={`bg-[#0d121c] border-2 ${toast.type === 'error' ? 'border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'border-[#4DD4C4]/50 shadow-[0_0_40px_rgba(77,212,196,0.2)]'} rounded-2xl p-4 flex flex-col gap-3 min-w-[320px] backdrop-blur-md`}>
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${toast.type === 'error' ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#4DD4C4]/10 border border-[#4DD4C4]/20'} flex items-center justify-center shrink-0`}>
                            {toast.type === 'error' ? (
                                <AlertCircle className="text-red-500" size={24} />
                            ) : (
                                <CheckCircle2 className="text-[#4DD4C4]" size={24} />
                            )}
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-white font-bold text-sm text-left">{toast.type === 'error' ? 'Upload Failed' : 'Success'}</h3>
                            <p className={`${toast.type === 'error' ? 'text-red-400' : 'text-zinc-400'} text-xs mt-1 text-left leading-relaxed`}>{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white transition-colors pt-1">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

//redep
