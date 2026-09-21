"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Edit2,
    Search,
    Loader2,
    Sparkles,
    User,
    Briefcase,
    GraduationCap,
    History,
    BarChart2,
    Flame,
    X,
    Code,
    Camera,
    CheckCircle2,
    AlertCircle,
    Trophy,
    Share2,
    Check
} from "lucide-react";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useWalkthrough } from "@/hooks/useWalkthrough";
import SubscriptionStatus from "@/components/subscription/subscription-status";

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
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
        largeArcFlag = endAngle + 360.0 - startAngle <= 180 ? "0" : "1";
    }
    return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 1, end.x, end.y].join(" ");
}

export default function ProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="landing-light min-h-screen bg-[#fafafa] flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#1f9e8e]" size={32} />
                </div>
            }
        >
            <ProfileContent />
        </Suspense>
    );
}

function ProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSetupMode = searchParams.get("setup") === "true";
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
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const { navigateAndStart } = useWalkthrough();

    const [formData, setFormData] = useState({
        full_name: "",
        occupation: "",
        job_role: "",
        experience_years: 0,
        avatar_url: "",
        username: "",
        is_public_profile: true,
        bio: "",
        linkedin_url: "",
        github_url: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleShare = () => {
        const url = `https://dailysql.in/u/${profile?.username}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Auto-clear toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        async function loadProfile() {
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
                        avatar_url: data.avatar_url || "",
                        username: data.username || "",
                        is_public_profile: data.is_public_profile ?? true,
                        bio: data.bio || "",
                        linkedin_url: data.linkedin_url || "",
                        github_url: data.github_url || ""
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

    // Set editing mode if in setup mode
    useEffect(() => {
        if (isSetupMode && profile && !isEditing) {
            setIsEditing(true);
        }
    }, [isSetupMode, profile]);

    const handleOnboard = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.updateProfile(formData);
            const updated = await api.getProfile();
            setProfile(updated);
            setIsEditing(false);

            if (isSetupMode || !profile.onboarding_completed) {
                router.push("/practice/daily?welcome=true");
            } else {
                router.push("/practice/daily");
            }
        } catch (err: any) {
            console.error("Failed to save profile", err);
            setToast({ type: "error", message: err.message || "Failed to update profile." });
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

        if (!file.type.startsWith("image/")) {
            setToast({ type: "error", message: "Please select a valid image file (PNG, JPG, etc)." });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setToast({ type: "error", message: "Image is too large. Please select a photo under 2MB." });
            return;
        }

        setIsUploading(true);
        setToast(null);
        try {
            const sigData = await api.getCloudinarySignature();

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

            const updatedFormData = { ...formData, avatar_url: newAvatarUrl };
            setFormData(updatedFormData);
            await api.updateProfile(updatedFormData);

            setProfile((prev: any) => ({ ...prev, avatar_url: newAvatarUrl }));
            setToast({ type: "success", message: "Profile photo updated successfully!" });
        } catch (err) {
            console.error("Upload failed", err);
            setToast({ type: "error", message: "Failed to upload photo. Please try again." });
        } finally {
            setIsUploading(false);
        }
    };

    const stats = {
        easy: { solved: realStats?.easy?.solved || 0, total: realStats?.easy?.total || 1, color: "#1f9e8e" },
        medium: { solved: realStats?.medium?.solved || 0, total: realStats?.medium?.total || 1, color: "#f59e0b" },
        advanced: { solved: realStats?.advanced?.solved || 0, total: realStats?.advanced?.total || 1, color: "#ef4444" }
    };

    const totalQuestions = stats.easy.total + stats.medium.total + stats.advanced.total;
    const totalSolved = stats.easy.solved + stats.medium.solved + stats.advanced.solved;

    const gap = 16;
    const availableAngle = 360 - gap * 3;

    const easyAngle = (stats.easy.total / totalQuestions) * availableAngle;
    const mediumAngle = (stats.medium.total / totalQuestions) * availableAngle;
    const advancedAngle = (stats.advanced.total / totalQuestions) * availableAngle;

    const segments = [
        { id: "easy", start: 0, end: easyAngle, solved: stats.easy.solved, total: stats.easy.total, color: stats.easy.color },
        { id: "medium", start: easyAngle + gap, end: easyAngle + gap + mediumAngle, solved: stats.medium.solved, total: stats.medium.total, color: stats.medium.color },
        { id: "advanced", start: easyAngle + mediumAngle + gap * 2, end: easyAngle + mediumAngle + advancedAngle + gap * 2, solved: stats.advanced.solved, total: stats.advanced.total, color: stats.advanced.color }
    ];

    const filteredSubmissions = submissions.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const { heatmapWeeks, monthLabels, heatmapRangeLabel } = useMemo(() => {
        const now = new Date();
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let endDate: Date;
        let startDate: Date;
        let finalLabel = "";

        if (selectedYear === "last_12") {
            endDate = new Date(todayMidnight);
            const endDayOfWeek = endDate.getDay();
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 52 * 7 - endDayOfWeek);

            const startStr = startDate.toLocaleString("default", { month: "short", year: "numeric" }).toUpperCase();
            const endStr = endDate.toLocaleString("default", { month: "short", year: "numeric" }).toUpperCase();
            finalLabel = `${startStr} — ${endStr}`;
        } else {
            const year = parseInt(selectedYear, 10);
            startDate = new Date(year, 0, 1);
            const startDay = startDate.getDay();
            if (startDay !== 0) {
                startDate.setDate(startDate.getDate() - startDay);
            }
            endDate = new Date(year, 11, 31);
            finalLabel = selectedYear;
        }

        const weeks = [];
        const labels: { name: string; colIndex: number }[] = [];
        let currentMonth = -1;

        let currentDate = new Date(startDate);
        let col = 0;

        while (currentDate <= endDate) {
            const week = [];
            for (let row = 0; row < 7; row++) {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const day = currentDate.getDate();

                if (
                    (selectedYear === "last_12" || year === parseInt(selectedYear)) &&
                    ((month !== currentMonth && row === 0) || (month !== currentMonth && day === 1))
                ) {
                    labels.push({ name: currentDate.toLocaleString("default", { month: "short" }), colIndex: col });
                    currentMonth = month;
                }

                if (selectedYear === "last_12" && currentDate > todayMidnight) {
                    week.push(-1);
                } else if (selectedYear !== "last_12" && year !== parseInt(selectedYear, 10)) {
                    week.push(-1);
                } else {
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
            <div className="landing-light min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#fafafa] text-zinc-900">
                <Loader2 size={32} className="animate-spin text-[#1f9e8e] mb-4" />
                <p className="text-zinc-500 font-mono text-xs">Authenticating Profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="landing-light min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#fafafa] text-zinc-900 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 border border-rose-200">
                    <History className="text-rose-500" size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">Session Expired or Invalid</h2>
                <p className="text-zinc-500 max-w-sm mb-6 text-sm">
                    We couldn't verify your session. Please try logging in again to access your profile.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition-colors"
                    >
                        Retry
                    </button>
                    <Link href="/">
                        <button className="px-5 py-2.5 bg-[#1f9e8e] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#177a6d] transition-colors">
                            Go Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (profile && (!profile.onboarding_completed || isEditing)) {
        return (
            <div className="landing-light min-h-[calc(100vh-64px)] bg-[#fafafa] flex flex-col items-center justify-center p-6 text-zinc-900">
                <div className="max-w-2xl w-full p-8 rounded-2xl border border-[#dedee2] bg-white shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1f9e8e] to-transparent"></div>

                    {/* Close Button */}
                    {!isSetupMode && (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-all z-20"
                            title="Cancel editing"
                        >
                            <X size={16} />
                        </button>
                    )}

                    {toast && (
                        <div
                            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                                toast.type === "error"
                                    ? "bg-rose-50 border-rose-200 text-rose-800"
                                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                            }`}
                        >
                            {toast.type === "error" ? <AlertCircle size={18} className="text-rose-600" /> : <CheckCircle2 size={18} className="text-emerald-600" />}
                            <span className="text-xs font-medium">{toast.message}</span>
                        </div>
                    )}

                    <div className="flex flex-col items-center mb-8 text-center">
                        <div
                            onClick={handlePhotoClick}
                            className="relative w-24 h-24 rounded-2xl mb-4 p-1 border border-[#1f9e8e]/30 bg-[#e6f7f5] hover:border-[#1f9e8e] transition-all cursor-pointer overflow-hidden group/avatar shadow-2xs"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-100 flex justify-center items-center relative">
                                {formData.avatar_url || profile.avatar_url ? (
                                    <img
                                        src={formData.avatar_url || profile.avatar_url}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={32} className="text-zinc-400" />
                                )}

                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200">
                                    {isUploading ? (
                                        <Loader2 size={18} className="text-white animate-spin" />
                                    ) : (
                                        <>
                                            <Camera size={18} className="text-white mb-0.5" />
                                            <span className="text-[10px] font-bold text-white">Change</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold font-mono text-zinc-900 tracking-tight mb-1">
                            {profile.onboarding_completed || isSetupMode ? "Public Profile" : "Update Profile"}
                        </h2>
                        <p className="text-zinc-500 text-xs max-w-sm">
                            {isSetupMode
                                ? "Customize your public profile, bio, and social links."
                                : "Update your details below to keep your stats and profile professional."}
                        </p>
                    </div>

                    <form onSubmit={handleOnboard} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Vedant Sharma"
                                        className="w-full bg-white border border-zinc-300 rounded-xl text-xs py-2.5 pl-9 pr-3 text-zinc-900 outline-none focus:border-[#1f9e8e] transition-all"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                    Username (URL slug)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-mono">@</span>
                                    <input
                                        required
                                        type="text"
                                        placeholder="vedant-sharma"
                                        className="w-full bg-white border border-zinc-300 rounded-xl text-xs py-2.5 pl-8 pr-3 text-zinc-900 outline-none focus:border-[#1f9e8e] transition-all font-mono"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                    Occupation
                                </label>
                                <div className="relative">
                                    <GraduationCap size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <select
                                        required
                                        className="w-full bg-white border border-zinc-300 rounded-xl text-xs py-2.5 pl-9 pr-3 text-zinc-900 outline-none focus:border-[#1f9e8e] transition-all appearance-none cursor-pointer"
                                        value={formData.occupation}
                                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        <option value="student">Student</option>
                                        <option value="professional">Professional</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                    Exp (Years)
                                </label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    max="50"
                                    className="w-full bg-white border border-zinc-300 rounded-xl text-xs py-2.5 px-3 text-zinc-900 outline-none focus:border-[#1f9e8e] transition-all font-mono"
                                    value={formData.experience_years}
                                    onChange={(e) =>
                                        setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                Job Role / Target Role
                            </label>
                            <div className="relative">
                                <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    required
                                    type="text"
                                    placeholder="Data Analyst, Analytics Engineer, etc."
                                    className="w-full bg-white border border-zinc-300 rounded-xl text-xs py-2.5 pl-9 pr-3 text-zinc-900 outline-none focus:border-[#1f9e8e] transition-all"
                                    value={formData.job_role}
                                    onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                Bio
                            </label>
                            <textarea
                                placeholder="Practicing SQL, Python & PySpark every day..."
                                rows={2}
                                className="w-full bg-white border border-zinc-300 rounded-xl text-xs py-2.5 px-3 text-zinc-900 outline-none focus:border-[#1f9e8e] transition-all resize-none"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                    LinkedIn URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    className="w-full bg-white border border-zinc-300 rounded-xl text-xs py-2.5 px-3 text-zinc-900 outline-none focus:border-[#1f9e8e] transition-all"
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://github.com/username"
                                    className="w-full bg-white border border-zinc-300 rounded-xl text-xs py-2.5 px-3 text-zinc-900 outline-none focus:border-[#1f9e8e] transition-all"
                                    value={formData.github_url}
                                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-3">
                            {!isSetupMode && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-white border border-zinc-300 text-zinc-700 font-bold py-2.5 rounded-xl hover:bg-zinc-50 transition-all text-xs"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                disabled={isSaving}
                                type="submit"
                                className={`${
                                    isSetupMode ? "w-full" : "flex-[2]"
                                } bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-2xs`}
                            >
                                {isSaving ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        {profile.exists && isEditing ? "Save Changes" : "Start Journey"}
                                        {profile.exists && isEditing ? (
                                            <Edit2 size={14} />
                                        ) : (
                                            <ArrowLeft size={14} className="rotate-180" />
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="landing-light min-h-[calc(100vh-64px)] bg-[#fafafa] text-zinc-900 font-sans pb-16 relative">
            <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 lg:pt-10">
                {/* --- LEFT COLUMN: Profile & Quick Info --- */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Main Profile Card */}
                    <div className="bg-white border border-[#dedee2] rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center shadow-xs">
                        <div className="relative w-24 h-24 rounded-2xl mb-4 p-1 border border-[#1f9e8e]/30 bg-[#e6f7f5] shadow-2xs overflow-hidden">
                            <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-100 flex justify-center items-center">
                                {profile.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={36} className="text-zinc-400" />
                                )}
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
                            {profile.full_name || "Member"}
                        </h1>
                        {profile.username && (
                            <div className="flex items-center gap-1.5 mt-0.5 text-zinc-500 font-mono text-xs">
                                <span>@{profile.username}</span>
                            </div>
                        )}

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full bg-[#e6f7f5] border border-[#1f9e8e]/30 text-[#1f9e8e] text-[11px] font-bold font-mono tracking-wide">
                            <Flame size={12} className="text-amber-500 fill-amber-500" />
                            {profile.job_role || profile.occupation || "Practitioner"}
                        </div>

                        <p className="text-xs text-zinc-500 mt-2">{profile.email}</p>

                        {profile.bio && (
                            <p className="text-xs text-zinc-600 mt-3 italic leading-relaxed max-w-xs">
                                "{profile.bio}"
                            </p>
                        )}

                        {/* Social Badges */}
                        <div className="flex gap-2.5 mt-4">
                            {profile.github_url && (
                                <a
                                    href={profile.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors border border-zinc-200"
                                    title="GitHub"
                                >
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a
                                    href={profile.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors border border-zinc-200"
                                    title="LinkedIn"
                                >
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a66c2]">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect x="2" y="9" width="4" height="12"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </a>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="w-full mt-6 flex flex-col gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold rounded-xl py-2.5 text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                            >
                                <Edit2 size={13} /> Edit Profile
                            </button>

                            {profile.username && (
                                <button
                                    onClick={handleShare}
                                    className={`w-full border font-semibold rounded-xl py-2 text-xs transition-all flex items-center justify-center gap-1.5 ${
                                        copied
                                            ? "bg-[#e6f7f5] border-[#1f9e8e]/40 text-[#1f9e8e]"
                                            : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700"
                                    }`}
                                >
                                    {copied ? <><Check size={13} /> Link Copied!</> : <><Share2 size={13} /> Share Profile</>}
                                </button>
                            )}

                            <button
                                onClick={navigateAndStart}
                                className="w-full bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-600 font-semibold rounded-xl py-2 text-xs transition-all flex items-center justify-center gap-1.5"
                            >
                                <Sparkles size={13} className="text-[#1f9e8e]" /> Take Platform Tour
                            </button>
                        </div>
                    </div>

                    {/* Subscription & Membership Card */}
                    <SubscriptionStatus />

                    {/* Leaderboard Card */}
                    <div className="bg-white border border-[#dedee2] rounded-2xl p-5 shadow-xs flex flex-col text-zinc-900">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-200 shrink-0">
                                <Trophy size={14} className="text-amber-600" />
                            </div>
                            <h3 className="text-sm font-bold font-mono tracking-tight">Daily Leaderboard</h3>
                        </div>

                        <div className="space-y-1.5 overflow-y-auto max-h-[300px] pr-1">
                            {leaderboard.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 gap-2">
                                    <Trophy size={24} className="text-zinc-300" />
                                    <p className="text-xs text-zinc-400 font-mono">No data yet</p>
                                </div>
                            ) : (
                                leaderboard.slice(0, 10).map((entry, idx) => {
                                    const isCurrentUser = profile && entry.user_id === profile.user_id;
                                    const rankBadges = [
                                        "bg-amber-100 text-amber-900 border-amber-300",
                                        "bg-slate-100 text-slate-800 border-slate-300",
                                        "bg-orange-100 text-orange-900 border-orange-300"
                                    ];

                                    return (
                                        <div
                                            key={entry.user_id}
                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-xs ${
                                                isCurrentUser
                                                    ? "bg-[#e6f7f5] border-[#1f9e8e]/40"
                                                    : "bg-zinc-50 border-zinc-200/80 hover:bg-zinc-100/70"
                                            }`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono border shrink-0 ${
                                                    idx < 3
                                                        ? rankBadges[idx]
                                                        : "bg-white border-zinc-200 text-zinc-500"
                                                }`}
                                            >
                                                {idx + 1}
                                            </div>

                                            <div className="w-6 h-6 rounded-md bg-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {entry.avatar_url ? (
                                                    <img
                                                        src={entry.avatar_url}
                                                        alt={entry.full_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={12} className="text-zinc-500" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    {entry.username ? (
                                                        <Link
                                                            href={`/u/${entry.username}`}
                                                            className={`truncate font-semibold hover:underline ${
                                                                isCurrentUser ? "text-[#1f9e8e]" : "text-zinc-800"
                                                            }`}
                                                        >
                                                            {entry.full_name}
                                                        </Link>
                                                    ) : (
                                                        <span
                                                            className={`truncate font-semibold ${
                                                                isCurrentUser ? "text-[#1f9e8e]" : "text-zinc-800"
                                                            }`}
                                                        >
                                                            {entry.full_name}
                                                        </span>
                                                    )}
                                                    {isCurrentUser && (
                                                        <span className="text-[9px] font-bold text-[#1f9e8e] bg-[#1f9e8e]/10 px-1 py-0.2 rounded border border-[#1f9e8e]/20 shrink-0">
                                                            YOU
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                {entry.current_streak > 0 && (
                                                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                                                        <Flame size={11} className="text-amber-500 fill-amber-500" />
                                                        <span>{entry.current_streak}</span>
                                                    </div>
                                                )}
                                                <div className="font-mono text-zinc-900 font-bold">
                                                    {entry.total_solved}
                                                    <span className="text-[9px] text-zinc-400 font-normal ml-0.5">sol</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Main Content --- */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Top Row: Performance & Difficulty Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {/* Performance Donut */}
                        <div className="md:col-span-2 bg-white border border-[#dedee2] rounded-2xl p-6 flex flex-col shadow-xs">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-lg bg-[#e6f7f5] flex items-center justify-center text-[#1f9e8e] border border-[#1f9e8e]/30">
                                    <BarChart2 size={15} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-sm font-bold font-mono tracking-tight text-zinc-900">Performance</h3>
                            </div>

                            <div className="flex-1 flex items-center justify-center py-2">
                                <div className="relative w-[150px] h-[150px] flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
                                        {segments.map((seg) => {
                                            if (seg.end <= seg.start) return null;
                                            const solvedAngle = seg.start + (seg.solved / seg.total) * (seg.end - seg.start);

                                            return (
                                                <g
                                                    key={seg.id}
                                                    onMouseEnter={() => setHoveredSegment(seg.id)}
                                                    onMouseLeave={() => setHoveredSegment(null)}
                                                    className="cursor-pointer"
                                                >
                                                    <path
                                                        d={describeArc(50, 50, 42, seg.start, seg.end)}
                                                        stroke={seg.color}
                                                        strokeWidth="5"
                                                        fill="transparent"
                                                        strokeLinecap="round"
                                                        className="transition-all duration-200"
                                                        opacity={hoveredSegment && hoveredSegment !== seg.id ? 0.08 : 0.18}
                                                    />
                                                    {seg.solved > 0 && (
                                                        <path
                                                            d={describeArc(50, 50, 42, seg.start, solvedAngle)}
                                                            stroke={seg.color}
                                                            strokeWidth="5"
                                                            fill="transparent"
                                                            strokeLinecap="round"
                                                            className="transition-all duration-500 ease-out"
                                                            style={{
                                                                opacity: hoveredSegment && hoveredSegment !== seg.id ? 0.35 : 1
                                                            }}
                                                        />
                                                    )}
                                                    <path d={describeArc(50, 50, 42, seg.start, seg.end)} stroke="transparent" strokeWidth="16" fill="transparent" strokeLinecap="round" />
                                                </g>
                                            );
                                        })}
                                    </svg>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        {hoveredSegment ? (
                                            <>
                                                <span className="text-3xl font-extrabold font-mono text-zinc-900 leading-none">
                                                    {segments.find((s) => s.id === hoveredSegment)?.solved}
                                                </span>
                                                <div className="w-6 h-[1px] bg-zinc-200 my-1.5"></div>
                                                <span className="text-xs font-medium font-mono text-zinc-400">
                                                    {segments.find((s) => s.id === hoveredSegment)?.total}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-3xl font-extrabold font-mono text-zinc-900 leading-none">
                                                    {totalSolved}
                                                </span>
                                                <div className="w-6 h-[1px] bg-zinc-200 my-1.5"></div>
                                                <span className="text-xs font-medium font-mono text-zinc-400">
                                                    {totalQuestions}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Stats Rows */}
                        <div className="md:col-span-3 bg-white border border-[#dedee2] rounded-2xl p-6 flex flex-col justify-center shadow-xs">
                            <div className="flex flex-col gap-5 w-full">
                                {[
                                    { id: "EASY", key: "easy", val: stats.easy.solved, max: stats.easy.total, color: "#1f9e8e", bg: "bg-[#e6f7f5]", border: "border-[#1f9e8e]/30", text: "text-[#1f9e8e]" },
                                    { id: "MEDIUM", key: "medium", val: stats.medium.solved, max: stats.medium.total, color: "#f59e0b", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800" },
                                    { id: "ADVANCED", key: "advanced", val: stats.advanced.solved, max: stats.advanced.total, color: "#ef4444", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800" }
                                ].map((s) => (
                                    <div
                                        key={s.id}
                                        className="w-full cursor-pointer flex flex-col"
                                        onMouseEnter={() => setHoveredSegment(s.key)}
                                        onMouseLeave={() => setHoveredSegment(null)}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider border ${s.bg} ${s.text} ${s.border}`}>
                                                {s.id}
                                            </span>
                                            <div className="flex items-baseline gap-1 font-mono text-xs">
                                                <span className="font-bold text-zinc-900">{s.val}</span>
                                                <span className="text-zinc-400">/ {s.max}</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden relative">
                                            <div
                                                className="h-full rounded-full transition-all duration-700 ease-out"
                                                style={{
                                                    width: `${s.max ? (s.val / s.max) * 100 : 0}%`,
                                                    backgroundColor: s.color
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Activity Heatmap */}
                    <div className="bg-white border border-[#dedee2] rounded-2xl p-6 flex flex-col shadow-xs">
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-[#e6f7f5] flex items-center justify-center text-[#1f9e8e] border border-[#1f9e8e]/30">
                                    <BarChart2 size={14} />
                                </div>
                                <h3 className="text-sm font-bold font-mono tracking-tight text-zinc-900">Activity Map</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono text-zinc-500 font-semibold uppercase bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
                                    {heatmapRangeLabel}
                                </span>
                                <select
                                    className="bg-white border border-zinc-300 text-zinc-800 text-xs font-semibold rounded-md px-2.5 py-1 outline-none focus:border-[#1f9e8e] cursor-pointer hover:bg-zinc-50 transition-colors font-mono"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    <option value="last_12">LAST YEAR</option>
                                    <option value={String(currentYear)}>{currentYear}</option>
                                    <option value={String(currentYear - 1)}>{currentYear - 1}</option>
                                </select>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto pb-2 flex justify-start sm:justify-center">
                            <div className="min-w-fit flex flex-col gap-2">
                                {/* Month Labels */}
                                <div className="relative h-[14px] w-full">
                                    {monthLabels.map((lbl, idx) => {
                                        if (idx > 0 && lbl.colIndex - monthLabels[idx - 1].colIndex < 3) return null;
                                        return (
                                            <span
                                                key={idx}
                                                className="absolute text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider"
                                                style={{ left: `${lbl.colIndex * 15}px` }}
                                            >
                                                {lbl.name}
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Heatmap Grid */}
                                <div className="flex gap-[4px]">
                                    {heatmapWeeks.map((week, wIdx) => (
                                        <div key={wIdx} className="flex flex-col gap-[4px]">
                                            {week.map((dayCount, dIdx) => {
                                                if (dayCount === -1) return <div key={`${wIdx}-${dIdx}`} className="w-[11px] h-[11px]" />;
                                                let cellColor = "bg-zinc-100 border border-zinc-200/80";
                                                if (dayCount === 1) cellColor = "bg-[#99f6e4] border border-[#5eead4]";
                                                else if (dayCount === 2) cellColor = "bg-[#2dd4bf] border border-[#14b8a6]";
                                                else if (dayCount >= 3) cellColor = "bg-[#0f766e] border border-[#115e59]";

                                                return (
                                                    <div
                                                        key={`${wIdx}-${dIdx}`}
                                                        className={`w-[11px] h-[11px] rounded-[3px] ${cellColor} transition-all duration-150 cursor-pointer hover:scale-125`}
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

                    {/* Recent Submissions */}
                    <div className="bg-white border border-[#dedee2] rounded-2xl p-6 flex flex-col shadow-xs">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold font-mono tracking-tight text-zinc-900">Recent Submissions</h3>
                                <span className="px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-bold font-mono text-zinc-600">
                                    {filteredSubmissions.length}
                                </span>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search solved problems..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 rounded-xl py-2 pl-9 pr-3 outline-none focus:border-[#1f9e8e] transition-all placeholder:text-zinc-400"
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[460px] pr-1">
                            {filteredSubmissions.length === 0 ? (
                                <div className="py-12 text-center text-zinc-400 text-xs font-mono">
                                    No submissions match your query.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {filteredSubmissions.map((p) => {
                                        const diffMeta: Record<string, { badge: string; dot: string }> = {
                                            easy: { badge: "bg-[#e6f7f5] text-[#1f9e8e] border-[#1f9e8e]/30", dot: "bg-[#1f9e8e]" },
                                            medium: { badge: "bg-amber-50 text-amber-800 border-amber-200", dot: "bg-amber-500" },
                                            hard: { badge: "bg-rose-50 text-rose-800 border-rose-200", dot: "bg-rose-500" },
                                        };
                                        const dm = diffMeta[p.difficulty?.toLowerCase()] || { badge: "bg-zinc-100 text-zinc-700 border-zinc-200", dot: "bg-zinc-400" };

                                        return (
                                            <div
                                                key={p.id}
                                                onClick={async () => {
                                                    setLoadingCode(true);
                                                    try {
                                                        const sol = await api.getSavedSolution(p.id);
                                                        if (sol.submitted_query) setViewingCode({ title: p.title, query: sol.submitted_query });
                                                    } catch {
                                                        /* silent */
                                                    } finally {
                                                        setLoadingCode(false);
                                                    }
                                                }}
                                                className="p-4 rounded-xl bg-zinc-50/70 hover:bg-white border border-[#dedee2] hover:border-zinc-300 flex flex-col justify-between gap-3 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs group"
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <span className="text-xs font-semibold text-zinc-900 group-hover:text-[#1f9e8e] transition-colors line-clamp-2 leading-snug">
                                                        {p.title}
                                                    </span>
                                                    <span className={`text-[9px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${dm.badge} shrink-0`}>
                                                        {p.difficulty}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center pt-2 border-t border-zinc-200/70 text-[11px] text-zinc-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                        <span>{p.created_at ? new Date(p.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Solved"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 font-medium text-zinc-600 group-hover:text-[#1f9e8e] transition-colors">
                                                        <Code size={12} /> View Code
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Viewer Modal */}
            {viewingCode && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
                    onClick={() => setViewingCode(null)}
                >
                    <div
                        className="bg-white border border-[#dedee2] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 bg-zinc-50 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-[#e6f7f5] border border-[#1f9e8e]/30 flex items-center justify-center">
                                    <Code size={14} className="text-[#1f9e8e]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Submitted Solution</p>
                                    <h3 className="text-sm font-bold text-zinc-900 leading-tight line-clamp-1">{viewingCode?.title}</h3>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingCode(null)}
                                className="text-zinc-400 hover:text-zinc-700 transition-colors p-1.5 rounded-lg hover:bg-zinc-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-5 bg-[#1c1c1e]">
                            <pre className="text-xs text-emerald-400 font-mono leading-relaxed whitespace-pre-wrap break-words">
                                {viewingCode?.query}
                            </pre>
                        </div>
                        <div className="px-5 py-3 border-t border-zinc-200 bg-zinc-50 flex justify-between items-center shrink-0">
                            <span className="text-[10px] text-zinc-500 font-mono">SQL / PostgreSQL</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(viewingCode?.query ?? "")}
                                className="text-xs font-bold text-[#1f9e8e] hover:text-[#177a6d] transition-colors"
                            >
                                Copy to clipboard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Auth Toast */}
            {toast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-bottom-5 duration-200">
                    <div
                        className={`bg-white border rounded-xl p-4 flex items-center gap-3 shadow-lg min-w-[320px] ${
                            toast.type === "error" ? "border-rose-300" : "border-emerald-300"
                        }`}
                    >
                        <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                toast.type === "error" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                            }`}
                        >
                            {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="font-bold text-xs text-zinc-900">{toast.type === "error" ? "Action Failed" : "Success"}</h4>
                            <p className="text-xs text-zinc-600 mt-0.5">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="text-zinc-400 hover:text-zinc-700">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
