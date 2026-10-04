"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
    Flame,
    X,
    Code,
    Camera,
    CheckCircle2,
    AlertCircle,
    Trophy,
    Share2,
    Check,
    Target,
    CalendarDays,
    Mail,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useWalkthrough } from "@/hooks/useWalkthrough";
import SubscriptionStatus from "@/components/subscription/subscription-status";
import { appToday, addDays, dateKey } from "@/lib/app-day";

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

// Shared surface styles (theme tokens, so light and dark both work)
const CARD = "rounded-2xl border border-[var(--ls-outline)] bg-[var(--ls-surface)] shadow-[var(--ls-shadow-sm)]";
const HEADING = "text-[var(--ls-heading)]";
const MUTED = "text-[var(--ls-on-surface-muted)]";
const SUBTLE = "text-[var(--ls-on-surface-subtle)]";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type HeatCell = { key: string; count: number; kind: "pad" | "day" | "future" };

const HEAT_LEVELS = [
    "bg-[var(--ls-surface-container)] border border-[var(--ls-outline)]",
    "bg-[#99f6e4] border border-[#5eead4] dark:bg-[#115e59] dark:border-[#0f766e]",
    "bg-[#2dd4bf] border border-[#14b8a6] dark:bg-[#14b8a6] dark:border-[#2dd4bf]",
    "bg-[#0f766e] border border-[#115e59] dark:bg-[#5eead4] dark:border-[#99f6e4]"
];
const heatLevel = (n: number) => (n <= 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : 3);

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
    const [streakCount, setStreakCount] = useState(0);
    const [activeToday, setActiveToday] = useState(false);
    const [tab, setTab] = useState<"overview" | "submissions" | "leaderboard">("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [viewingCode, setViewingCode] = useState<{ title: string; query: string } | null>(null);
    const [loadingCode, setLoadingCode] = useState(false);
    const currentYear = appToday().getUTCFullYear();
    const [selectedYear, setSelectedYear] = useState<string>("last_12");
    const LEADERBOARD_PAGE_SIZE = 20;
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [leaderboardTotal, setLeaderboardTotal] = useState(0);
    const [leaderboardPage, setLeaderboardPage] = useState(1);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const [myRank, setMyRank] = useState<{ rank: number; total_solved: number; current_streak: number } | null>(null);
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
    const heatScrollRef = useRef<HTMLDivElement>(null);

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
                // The profile itself is required; everything else is optional so one failing
                // widget never turns the whole page into "session expired".
                const [data, s, sub, h, st, rank] = await Promise.all([
                    api.getProfile(),
                    api.getStats().catch(() => null),
                    api.getRecentSubmissions().catch(() => []),
                    api.getHeatmap().catch(() => ({})),
                    api.getStreak().catch(() => null),
                    api.getMyLeaderboardRank().catch(() => null)
                ]);

                setProfile(data);
                setRealStats(s);
                setSubmissions(sub || []);
                setHeatmapData(h || {});
                setMyRank(rank);
                if (st) {
                    setStreakCount(st.current_streak || 0);
                    setActiveToday(!!st.active_today);
                }

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

    const loadLeaderboardPage = useCallback(async (page: number) => {
        setLeaderboardLoading(true);
        try {
            const res = await api.getLeaderboard(LEADERBOARD_PAGE_SIZE, (page - 1) * LEADERBOARD_PAGE_SIZE);
            setLeaderboard(res.entries || []);
            setLeaderboardTotal(res.total || 0);
        } catch (err) {
            console.error("Failed to load leaderboard", err);
        } finally {
            setLeaderboardLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLeaderboardPage(leaderboardPage);
    }, [leaderboardPage, loadLeaderboardPage]);

    const jumpToMyRank = () => {
        if (!myRank) return;
        setLeaderboardPage(Math.ceil(myRank.rank / LEADERBOARD_PAGE_SIZE));
    };

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

    // ── Progress numbers (real totals; no fake "1" fallbacks) ──
    const stats = {
        easy: { solved: realStats?.easy?.solved || 0, total: realStats?.easy?.total || 0, color: "#1f9e8e" },
        medium: { solved: realStats?.medium?.solved || 0, total: realStats?.medium?.total || 0, color: "#f59e0b" },
        advanced: { solved: realStats?.advanced?.solved || 0, total: realStats?.advanced?.total || 0, color: "#ef4444" }
    };

    const totalQuestions = stats.easy.total + stats.medium.total + stats.advanced.total;
    const totalSolved = stats.easy.solved + stats.medium.solved + stats.advanced.solved;

    const gap = 16;
    const availableAngle = 360 - gap * 3;
    const share = (n: number) => (totalQuestions > 0 ? (n / totalQuestions) * availableAngle : 0);
    const easyAngle = share(stats.easy.total);
    const mediumAngle = share(stats.medium.total);
    const advancedAngle = share(stats.advanced.total);

    const segments = [
        { id: "easy", start: 0, end: easyAngle, solved: stats.easy.solved, total: stats.easy.total, color: stats.easy.color },
        { id: "medium", start: easyAngle + gap, end: easyAngle + gap + mediumAngle, solved: stats.medium.solved, total: stats.medium.total, color: stats.medium.color },
        { id: "advanced", start: easyAngle + mediumAngle + gap * 2, end: easyAngle + mediumAngle + advancedAngle + gap * 2, solved: stats.advanced.solved, total: stats.advanced.total, color: stats.advanced.color }
    ];

    const filteredSubmissions = submissions.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // ── Activity map (app-day / IST clock, UTC date math so the browser timezone never shifts a cell) ──
    const heat = useMemo(() => {
        const today = appToday();
        let start: Date;
        let end: Date;
        let rangeLabel: string;

        if (selectedYear === "last_12") {
            end = today;
            start = addDays(today, -52 * 7 - today.getUTCDay());
            const s = addDays(today, -364);
            rangeLabel = `${MONTH_SHORT[s.getUTCMonth()]} ${s.getUTCFullYear()} — ${MONTH_SHORT[today.getUTCMonth()]} ${today.getUTCFullYear()}`;
        } else {
            const year = parseInt(selectedYear, 10);
            const jan1 = new Date(Date.UTC(year, 0, 1));
            start = addDays(jan1, -jan1.getUTCDay());
            end = new Date(Date.UTC(year, 11, 31));
            rangeLabel = selectedYear;
        }

        const isYearView = selectedYear !== "last_12";
        const year = parseInt(selectedYear, 10);
        const todayTime = today.getTime();

        const weeks: HeatCell[][] = [];
        const labels: { name: string; colIndex: number }[] = [];
        let lastMonth = -1;

        let cursor = start;
        let col = 0;
        while (cursor.getTime() <= end.getTime()) {
            const week: HeatCell[] = [];
            for (let row = 0; row < 7; row++) {
                const key = dateKey(cursor);
                const outside = isYearView ? cursor.getUTCFullYear() !== year : cursor.getTime() > todayTime;
                if (outside) {
                    week.push({ key, count: 0, kind: "pad" });
                } else if (cursor.getTime() > todayTime) {
                    week.push({ key, count: 0, kind: "future" });
                } else {
                    week.push({ key, count: heatmapData[key] || 0, kind: "day" });
                }
                cursor = addDays(cursor, 1);
            }
            const firstReal = week.find((c) => c.kind !== "pad");
            if (firstReal) {
                const m = parseInt(firstReal.key.slice(5, 7), 10) - 1;
                if (m !== lastMonth) {
                    labels.push({ name: MONTH_SHORT[m], colIndex: col });
                    lastMonth = m;
                }
            }
            weeks.push(week);
            col++;
        }

        // Summary over the days that have actually happened, in date order
        const played = weeks.flat().filter((c) => c.kind === "day");
        const activeDays = played.filter((c) => c.count > 0).length;
        const totalSolves = played.reduce((sum, c) => sum + c.count, 0);
        let longest = 0;
        let run = 0;
        for (const c of played) {
            run = c.count > 0 ? run + 1 : 0;
            if (run > longest) longest = run;
        }

        return { weeks, labels, rangeLabel, activeDays, totalSolves, longest };
    }, [heatmapData, selectedYear]);

    // On narrow screens keep the most recent weeks in view
    useEffect(() => {
        const el = heatScrollRef.current;
        if (el) el.scrollLeft = selectedYear === "last_12" ? el.scrollWidth : 0;
    }, [selectedYear, tab, isLoading, isEditing]);

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
                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 border border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30">
                    <History className="text-rose-500" size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">Session Expired or Invalid</h2>
                <p className="text-zinc-500 max-w-sm mb-6 text-sm">
                    We couldn&apos;t verify your session. Please try logging in again to access your profile.
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
                                    ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300"
                                    : "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300"
                            }`}
                        >
                            {toast.type === "error" ? <AlertCircle size={18} className="text-rose-600 dark:text-rose-300" /> : <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-300" />}
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

    const displayName = profile.full_name || "Member";
    const roleLabel = profile.job_role || (profile.occupation ? profile.occupation.charAt(0).toUpperCase() + profile.occupation.slice(1) : "Practitioner");
    const initial = displayName.charAt(0).toUpperCase();
    const leaderboardTotalPages = Math.max(1, Math.ceil(leaderboardTotal / LEADERBOARD_PAGE_SIZE));

    const TABS: { id: typeof tab; label: string; count?: number }[] = [
        { id: "overview", label: "Overview" },
        { id: "submissions", label: "Submissions", count: submissions.length },
        { id: "leaderboard", label: "Leaderboard" }
    ];

    const kpis = [
        {
            label: "Solved",
            value: totalSolved,
            sub: totalQuestions > 0 ? `of ${totalQuestions} problems` : "problems",
            icon: <CheckCircle2 size={16} />,
            tone: "text-[#1f9e8e] bg-[#1f9e8e]/10"
        },
        {
            label: "Current streak",
            value: streakCount,
            sub: streakCount === 0 ? "solve one to start" : activeToday ? "done for today ✓" : "solve today to keep it",
            icon: <Flame size={16} className={streakCount > 0 ? "fill-amber-500" : ""} />,
            tone: "text-amber-600 bg-amber-500/10 dark:text-amber-300"
        },
        {
            label: "Active days",
            value: heat.activeDays,
            sub: selectedYear === "last_12" ? "in the last year" : `in ${selectedYear}`,
            icon: <CalendarDays size={16} />,
            tone: "text-sky-600 bg-sky-500/10 dark:text-sky-300"
        },
        {
            label: "Leaderboard",
            value: myRank ? `#${myRank.rank}` : "—",
            sub: myRank ? "current rank" : "not ranked yet",
            icon: <Trophy size={16} />,
            tone: "text-violet-600 bg-violet-500/10 dark:text-violet-300"
        }
    ];

    return (
        <div className="landing-light min-h-[calc(100vh-64px)] font-sans pb-16 relative" style={{ background: "var(--ls-bg)", color: "var(--ls-on-surface)" }}>
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 flex flex-col gap-6">
                {/* ═══════════════ HERO ═══════════════ */}
                <section className={`${CARD} overflow-hidden`}>
                    <div className="relative h-28 sm:h-36 bg-gradient-to-br from-[#1f9e8e] via-teal-500 to-emerald-600">
                        <div
                            className="absolute inset-0 opacity-25"
                            style={{
                                backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
                                backgroundSize: "18px 18px"
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                    </div>

                    <div className="px-5 sm:px-8 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-14">
                            <div
                                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 shrink-0 shadow-[var(--ls-shadow-md)]"
                                style={{ background: "var(--ls-surface)", border: "1px solid var(--ls-outline)" }}
                            >
                                <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#1f9e8e] to-emerald-600 text-white text-4xl font-bold font-mono">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        initial
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 sm:pb-1">
                                <h1 className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight truncate ${HEADING}`}>{displayName}</h1>
                                <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-mono ${MUTED}`}>
                                    {profile.username && <span>@{profile.username}</span>}
                                    <span className="inline-flex items-center gap-1">
                                        <Mail size={12} /> {profile.email}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:pb-1">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-[#1f9e8e] hover:bg-[#177a6d] text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-all flex items-center gap-1.5 shadow-2xs"
                                >
                                    <Edit2 size={13} /> Edit profile
                                </button>
                                {profile.username && (
                                    <button
                                        onClick={handleShare}
                                        className={`border font-semibold rounded-xl px-4 py-2.5 text-xs transition-all flex items-center gap-1.5 ${
                                            copied
                                                ? "bg-[#1f9e8e]/10 border-[#1f9e8e]/40 text-[#1f9e8e]"
                                                : `border-[var(--ls-outline)] bg-[var(--ls-surface)] hover:bg-[var(--ls-surface-container)] ${HEADING}`
                                        }`}
                                    >
                                        {copied ? <><Check size={13} /> Link copied</> : <><Share2 size={13} /> Share</>}
                                    </button>
                                )}
                                <button
                                    onClick={navigateAndStart}
                                    className={`border border-[var(--ls-outline)] bg-[var(--ls-surface)] hover:bg-[var(--ls-surface-container)] font-semibold rounded-xl px-4 py-2.5 text-xs transition-all flex items-center gap-1.5 ${HEADING}`}
                                >
                                    <Sparkles size={13} className="text-[#1f9e8e]" /> Tour
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="min-w-0 max-w-2xl">
                                {profile.bio ? (
                                    <p className={`text-sm leading-relaxed ${MUTED}`}>{profile.bio}</p>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className={`text-sm italic ${SUBTLE} hover:underline`}>
                                        Add a short bio so others know what you&apos;re working on
                                    </button>
                                )}
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f9e8e]/10 border border-[#1f9e8e]/30 text-[#1f9e8e] text-[11px] font-bold font-mono">
                                        <Briefcase size={11} /> {roleLabel}
                                    </span>
                                    {profile.occupation && (
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--ls-outline)] text-[11px] font-mono capitalize ${MUTED}`}>
                                            <GraduationCap size={11} /> {profile.occupation}
                                        </span>
                                    )}
                                    {profile.experience_years > 0 && (
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--ls-outline)] text-[11px] font-mono ${MUTED}`}>
                                            {profile.experience_years} yr{profile.experience_years === 1 ? "" : "s"} experience
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2.5 shrink-0">
                                {profile.github_url && (
                                    <a
                                        href={profile.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center border border-[var(--ls-outline)] bg-[var(--ls-surface-low)] hover:bg-[var(--ls-surface-container)] transition-colors"
                                        title="GitHub"
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={HEADING}>
                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                        </svg>
                                    </a>
                                )}
                                {profile.linkedin_url && (
                                    <a
                                        href={profile.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center border border-[var(--ls-outline)] bg-[var(--ls-surface-low)] hover:bg-[var(--ls-surface-container)] transition-colors"
                                        title="LinkedIn"
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a66c2] dark:text-[#5aa9f0]">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                            <rect x="2" y="9" width="4" height="12"></rect>
                                            <circle cx="4" cy="4" r="2"></circle>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════ KPI STRIP ═══════════════ */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {kpis.map((k) => (
                        <div key={k.label} className={`${CARD} p-4 sm:p-5`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${SUBTLE}`}>{k.label}</span>
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.tone}`}>{k.icon}</span>
                            </div>
                            <div className={`mt-2 text-3xl font-extrabold font-mono leading-none ${HEADING}`}>{k.value}</div>
                            <p className={`mt-1.5 text-[11px] ${MUTED}`}>{k.sub}</p>
                        </div>
                    ))}
                </section>

                {/* ═══════════════ MAIN GRID ═══════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* ---------- Main column with tabs ---------- */}
                    <div className="lg:col-span-8 flex flex-col gap-5 min-w-0">
                        <div className="flex items-center gap-1 p-1 rounded-xl self-start" style={{ background: "var(--ls-surface-container)" }}>
                            {TABS.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                        tab === t.id
                                            ? `bg-[var(--ls-surface)] shadow-[var(--ls-shadow-sm)] ${HEADING}`
                                            : `${MUTED} hover:text-[var(--ls-heading)]`
                                    }`}
                                >
                                    {t.label}
                                    {t.count !== undefined && t.count > 0 && (
                                        <span className="px-1.5 rounded-full text-[10px] font-mono bg-[#1f9e8e]/10 text-[#1f9e8e]">{t.count}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* ===== OVERVIEW ===== */}
                        {tab === "overview" && (
                            <>
                                <div className={`${CARD} p-5 sm:p-6`}>
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className={`text-sm font-bold font-mono tracking-tight ${HEADING}`}>Problem progress</h3>
                                        <Link href="/problems" className="text-[11px] font-semibold text-[#1f9e8e] hover:underline inline-flex items-center gap-0.5">
                                            Browse problems <ChevronRight size={12} />
                                        </Link>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                                        <div className="relative w-[150px] h-[150px] shrink-0 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
                                                {totalQuestions === 0 && (
                                                    <circle cx="50" cy="50" r="42" fill="none" strokeWidth="5" stroke="currentColor" className={SUBTLE} opacity="0.25" />
                                                )}
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
                                                                opacity={hoveredSegment && hoveredSegment !== seg.id ? 0.08 : 0.2}
                                                            />
                                                            {seg.solved > 0 && (
                                                                <path
                                                                    d={describeArc(50, 50, 42, seg.start, solvedAngle)}
                                                                    stroke={seg.color}
                                                                    strokeWidth="5"
                                                                    fill="transparent"
                                                                    strokeLinecap="round"
                                                                    className="transition-all duration-500 ease-out"
                                                                    style={{ opacity: hoveredSegment && hoveredSegment !== seg.id ? 0.35 : 1 }}
                                                                />
                                                            )}
                                                            <path d={describeArc(50, 50, 42, seg.start, seg.end)} stroke="transparent" strokeWidth="16" fill="transparent" strokeLinecap="round" />
                                                        </g>
                                                    );
                                                })}
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                {(() => {
                                                    const hs = segments.find((s) => s.id === hoveredSegment);
                                                    return (
                                                        <>
                                                            <span className={`text-3xl font-extrabold font-mono leading-none ${HEADING}`}>{hs ? hs.solved : totalSolved}</span>
                                                            <div className="w-6 h-[1px] my-1.5 bg-[var(--ls-outline-variant)]"></div>
                                                            <span className={`text-xs font-medium font-mono ${SUBTLE}`}>{hs ? hs.total : totalQuestions}</span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-5 w-full">
                                            {[
                                                { id: "Easy", key: "easy", val: stats.easy.solved, max: stats.easy.total, color: "#1f9e8e", text: "text-[#1f9e8e]" },
                                                { id: "Medium", key: "medium", val: stats.medium.solved, max: stats.medium.total, color: "#f59e0b", text: "text-amber-600 dark:text-amber-300" },
                                                { id: "Hard", key: "advanced", val: stats.advanced.solved, max: stats.advanced.total, color: "#ef4444", text: "text-rose-600 dark:text-rose-300" }
                                            ].map((s) => (
                                                <div
                                                    key={s.key}
                                                    className="w-full cursor-pointer"
                                                    onMouseEnter={() => setHoveredSegment(s.key)}
                                                    onMouseLeave={() => setHoveredSegment(null)}
                                                >
                                                    <div className="flex justify-between items-baseline mb-1.5">
                                                        <span className={`text-xs font-bold font-mono ${s.text}`}>{s.id}</span>
                                                        <span className="font-mono text-xs">
                                                            <span className={`font-bold ${HEADING}`}>{s.val}</span>
                                                            <span className={SUBTLE}> / {s.max}</span>
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--ls-surface-container)]">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700 ease-out"
                                                            style={{ width: `${s.max ? (s.val / s.max) * 100 : 0}%`, backgroundColor: s.color }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Activity map */}
                                <div className={`${CARD} p-5 sm:p-6`}>
                                    <div className="flex flex-wrap justify-between items-start gap-3 mb-5">
                                        <div>
                                            <h3 className={`text-sm font-bold font-mono tracking-tight ${HEADING}`}>Activity</h3>
                                            <p className={`text-[11px] mt-1 ${MUTED}`}>
                                                <span className={`font-semibold ${HEADING}`}>{heat.totalSolves}</span> solves ·{" "}
                                                <span className={`font-semibold ${HEADING}`}>{heat.activeDays}</span> active days · longest run{" "}
                                                <span className={`font-semibold ${HEADING}`}>{heat.longest}</span> day{heat.longest === 1 ? "" : "s"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[11px] font-mono font-semibold uppercase px-2.5 py-1 rounded-md border border-[var(--ls-outline)] bg-[var(--ls-surface-container)] ${MUTED}`}>
                                                {heat.rangeLabel}
                                            </span>
                                            <select
                                                className={`bg-[var(--ls-surface)] border border-[var(--ls-outline)] text-xs font-semibold rounded-md px-2.5 py-1 outline-none focus:border-[#1f9e8e] cursor-pointer font-mono ${HEADING}`}
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(e.target.value)}
                                            >
                                                <option value="last_12">Last year</option>
                                                <option value={String(currentYear)}>{currentYear}</option>
                                                <option value={String(currentYear - 1)}>{currentYear - 1}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div ref={heatScrollRef} className="w-full overflow-x-auto pb-2 flex justify-start sm:justify-center">
                                        <div className="min-w-fit flex flex-col gap-2">
                                            <div className="relative h-[14px] w-full">
                                                {heat.labels.map((lbl, idx) => {
                                                    if (idx > 0 && lbl.colIndex - heat.labels[idx - 1].colIndex < 3) return null;
                                                    return (
                                                        <span
                                                            key={idx}
                                                            className={`absolute text-[10px] font-mono font-bold uppercase tracking-wider ${SUBTLE}`}
                                                            style={{ left: `${lbl.colIndex * 15}px` }}
                                                        >
                                                            {lbl.name}
                                                        </span>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex gap-[4px]">
                                                {heat.weeks.map((week, wIdx) => (
                                                    <div key={wIdx} className="flex flex-col gap-[4px]">
                                                        {week.map((cell) => {
                                                            if (cell.kind === "pad") return <div key={cell.key} className="w-[11px] h-[11px]" />;
                                                            return (
                                                                <div
                                                                    key={cell.key}
                                                                    className={`w-[11px] h-[11px] rounded-[3px] transition-transform duration-150 hover:scale-125 ${HEAT_LEVELS[heatLevel(cell.count)]} ${cell.kind === "future" ? "opacity-40" : ""}`}
                                                                    title={
                                                                        cell.kind === "future"
                                                                            ? cell.key
                                                                            : `${cell.count} solve${cell.count === 1 ? "" : "s"} on ${cell.key}`
                                                                    }
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-mono ${SUBTLE}`}>
                                                Less
                                                {HEAT_LEVELS.map((cls, i) => (
                                                    <span key={i} className={`w-[11px] h-[11px] rounded-[3px] ${cls}`} />
                                                ))}
                                                More
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ===== SUBMISSIONS ===== */}
                        {tab === "submissions" && (
                            <div className={`${CARD} p-5 sm:p-6`}>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                                    <h3 className={`text-sm font-bold font-mono tracking-tight ${HEADING}`}>
                                        Solved problems <span className={`font-normal ${SUBTLE}`}>({filteredSubmissions.length})</span>
                                    </h3>
                                    <div className="relative w-full sm:w-64">
                                        <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${SUBTLE}`} />
                                        <input
                                            type="text"
                                            placeholder="Search solved problems..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={`w-full bg-[var(--ls-surface-low)] border border-[var(--ls-outline)] text-xs rounded-xl py-2 pl-9 pr-3 outline-none focus:border-[#1f9e8e] transition-all placeholder:text-[var(--ls-on-surface-subtle)] ${HEADING}`}
                                        />
                                    </div>
                                </div>

                                {filteredSubmissions.length === 0 ? (
                                    <div className="py-14 text-center space-y-3">
                                        <p className={`text-xs font-mono ${SUBTLE}`}>
                                            {submissions.length === 0 ? "You haven't solved anything yet." : "No solved problems match your search."}
                                        </p>
                                        {submissions.length === 0 && (
                                            <Link href="/practice/daily" className="inline-flex px-4 py-2 rounded-xl bg-[#1f9e8e] text-white text-xs font-bold hover:bg-[#177a6d] transition-colors">
                                                Start today&apos;s set
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[var(--ls-outline)] max-h-[560px] overflow-y-auto -mx-2 px-2">
                                        {filteredSubmissions.map((p) => {
                                            const diff = (p.difficulty || "").toLowerCase();
                                            const badge =
                                                diff === "easy"
                                                    ? "bg-[#1f9e8e]/10 text-[#1f9e8e] border-[#1f9e8e]/30"
                                                    : diff === "medium"
                                                    ? "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300"
                                                    : "bg-rose-500/10 text-rose-700 border-rose-500/30 dark:text-rose-300";
                                            return (
                                                <button
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
                                                    className="w-full flex items-center gap-3 py-3 text-left group rounded-lg hover:bg-[var(--ls-surface-low)] px-2 transition-colors"
                                                >
                                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-semibold truncate group-hover:text-[#1f9e8e] transition-colors ${HEADING}`}>{p.title}</p>
                                                        <p className={`text-[11px] mt-0.5 ${SUBTLE}`}>
                                                            {p.created_at
                                                                ? new Date(p.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                                                                : "Solved"}
                                                        </p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${badge}`}>
                                                        {p.difficulty}
                                                    </span>
                                                    <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-medium shrink-0 ${MUTED} group-hover:text-[#1f9e8e] transition-colors`}>
                                                        {loadingCode ? <Loader2 size={12} className="animate-spin" /> : <Code size={12} />} View code
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== LEADERBOARD ===== */}
                        {tab === "leaderboard" && (
                            <div className={`${CARD} p-5 sm:p-6`}>
                                <div className="flex items-center justify-between gap-2.5 mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                            <Trophy size={16} className="text-amber-600 dark:text-amber-300" />
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-bold font-mono tracking-tight ${HEADING}`}>Leaderboard</h3>
                                            <p className={`text-[11px] ${MUTED}`}>
                                                {leaderboardTotal > 0 ? `${leaderboardTotal} solvers ranked` : "Top solvers across DailySQL"}
                                            </p>
                                        </div>
                                    </div>
                                    {myRank && (
                                        <button
                                            onClick={jumpToMyRank}
                                            className="text-[11px] font-bold font-mono text-[#1f9e8e] bg-[#1f9e8e]/10 hover:bg-[#1f9e8e]/20 border border-[#1f9e8e]/30 rounded-lg px-2.5 py-1.5 transition-colors shrink-0"
                                        >
                                            Jump to my rank (#{myRank.rank})
                                        </button>
                                    )}
                                </div>

                                {leaderboardLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 size={20} className={`animate-spin ${SUBTLE}`} />
                                    </div>
                                ) : leaderboard.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-2">
                                        <Trophy size={24} className={SUBTLE} />
                                        <p className={`text-xs font-mono ${SUBTLE}`}>No data yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        {leaderboard.map((entry) => {
                                            const rank = entry.rank;
                                            const isYou = entry.user_id === profile.user_id;
                                            const medals = ["bg-amber-400/20 text-amber-700 border-amber-400/50 dark:text-amber-300", "bg-slate-400/20 text-slate-600 border-slate-400/50 dark:text-slate-300", "bg-orange-400/20 text-orange-700 border-orange-400/50 dark:text-orange-300"];
                                            return (
                                                <div
                                                    key={entry.user_id}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs transition-colors ${
                                                        isYou
                                                            ? "bg-[#1f9e8e]/10 border-[#1f9e8e]/40"
                                                            : "border-transparent hover:bg-[var(--ls-surface-low)]"
                                                    }`}
                                                >
                                                    <div
                                                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold font-mono border shrink-0 ${
                                                            rank <= 3 ? medals[rank - 1] : `border-[var(--ls-outline)] ${MUTED}`
                                                        }`}
                                                    >
                                                        {rank}
                                                    </div>
                                                    <div className="w-7 h-7 rounded-lg bg-[var(--ls-surface-container)] flex items-center justify-center overflow-hidden shrink-0">
                                                        {entry.avatar_url ? (
                                                            <img src={entry.avatar_url} alt={entry.full_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User size={13} className={SUBTLE} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0 flex items-center gap-1.5">
                                                        {entry.username ? (
                                                            <Link href={`/u/${entry.username}`} className={`truncate font-semibold hover:underline ${isYou ? "text-[#1f9e8e]" : HEADING}`}>
                                                                {entry.full_name}
                                                            </Link>
                                                        ) : (
                                                            <span className={`truncate font-semibold ${isYou ? "text-[#1f9e8e]" : HEADING}`}>{entry.full_name}</span>
                                                        )}
                                                        {isYou && (
                                                            <span className="text-[9px] font-bold text-[#1f9e8e] bg-[#1f9e8e]/10 px-1.5 py-0.5 rounded border border-[#1f9e8e]/20 shrink-0">YOU</span>
                                                        )}
                                                    </div>
                                                    {entry.current_streak > 0 && (
                                                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-300 shrink-0">
                                                            <Flame size={12} className="fill-amber-500 text-amber-500" />
                                                            {entry.current_streak}
                                                        </div>
                                                    )}
                                                    <div className={`font-mono font-bold shrink-0 ${HEADING}`}>
                                                        {entry.total_solved}
                                                        <span className={`text-[9px] font-normal ml-0.5 ${SUBTLE}`}>solved</span>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Pagination */}
                                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--ls-outline)]">
                                            <button
                                                onClick={() => setLeaderboardPage((p) => Math.max(1, p - 1))}
                                                disabled={leaderboardPage <= 1}
                                                className={`flex items-center gap-1 text-[11px] font-bold font-mono px-2.5 py-1.5 rounded-lg border transition-colors ${
                                                    leaderboardPage <= 1
                                                        ? `border-transparent ${SUBTLE} opacity-40 cursor-not-allowed`
                                                        : `border-[var(--ls-outline)] ${HEADING} hover:bg-[var(--ls-surface-low)]`
                                                }`}
                                            >
                                                <ChevronLeft size={13} /> Prev
                                            </button>
                                            <span className={`text-[11px] font-mono ${MUTED}`}>
                                                Page {leaderboardPage} of {leaderboardTotalPages}
                                            </span>
                                            <button
                                                onClick={() => setLeaderboardPage((p) => Math.min(leaderboardTotalPages, p + 1))}
                                                disabled={leaderboardPage >= leaderboardTotalPages}
                                                className={`flex items-center gap-1 text-[11px] font-bold font-mono px-2.5 py-1.5 rounded-lg border transition-colors ${
                                                    leaderboardPage >= leaderboardTotalPages
                                                        ? `border-transparent ${SUBTLE} opacity-40 cursor-not-allowed`
                                                        : `border-[var(--ls-outline)] ${HEADING} hover:bg-[var(--ls-surface-low)]`
                                                }`}
                                            >
                                                Next <ChevronRight size={13} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ---------- Side column ---------- */}
                    <aside className="lg:col-span-4 flex flex-col gap-5 min-w-0">
                        <SubscriptionStatus />

                        <div className={`${CARD} p-5`}>
                            <h3 className={`text-sm font-bold font-mono tracking-tight mb-3 ${HEADING}`}>Keep going</h3>
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/practice/daily"
                                    className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl bg-[#1f9e8e]/10 border border-[#1f9e8e]/25 hover:border-[#1f9e8e]/60 transition-colors group"
                                >
                                    <span className="flex items-center gap-2.5 min-w-0">
                                        <Target size={16} className="text-[#1f9e8e] shrink-0" />
                                        <span className="min-w-0">
                                            <span className={`block text-xs font-bold ${HEADING}`}>Today&apos;s daily set</span>
                                            <span className={`block text-[11px] ${MUTED}`}>{activeToday ? "You've solved today — go again" : "Solve one to keep your streak"}</span>
                                        </span>
                                    </span>
                                    <ChevronRight size={14} className="text-[#1f9e8e] group-hover:translate-x-0.5 transition-transform shrink-0" />
                                </Link>
                                <Link
                                    href="/problems"
                                    className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border border-[var(--ls-outline)] hover:bg-[var(--ls-surface-low)] transition-colors group"
                                >
                                    <span className={`text-xs font-semibold ${HEADING}`}>Browse all problems</span>
                                    <ChevronRight size={14} className={`${MUTED} group-hover:translate-x-0.5 transition-transform`} />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Code Viewer Modal */}
            {viewingCode && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
                    onClick={() => setViewingCode(null)}
                >
                    <div
                        className="border border-[var(--ls-outline)] bg-[var(--ls-surface)] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--ls-outline)] bg-[var(--ls-surface-low)] shrink-0">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-[#1f9e8e]/10 border border-[#1f9e8e]/30 flex items-center justify-center shrink-0">
                                    <Code size={14} className="text-[#1f9e8e]" />
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-[10px] font-mono uppercase tracking-wider ${MUTED}`}>Submitted solution</p>
                                    <h3 className={`text-sm font-bold leading-tight line-clamp-1 ${HEADING}`}>{viewingCode.title}</h3>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingCode(null)}
                                className={`transition-colors p-1.5 rounded-lg hover:bg-[var(--ls-surface-container)] ${MUTED}`}
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-5 bg-[#1c1c1e]">
                            <pre className="text-xs text-emerald-400 font-mono leading-relaxed whitespace-pre-wrap break-words">{viewingCode.query}</pre>
                        </div>
                        <div className="px-5 py-3 border-t border-[var(--ls-outline)] bg-[var(--ls-surface-low)] flex justify-between items-center shrink-0">
                            <span className={`text-[10px] font-mono ${MUTED}`}>SQL / PostgreSQL</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(viewingCode.query ?? "")}
                                className="text-xs font-bold text-[#1f9e8e] hover:text-[#177a6d] transition-colors dark:hover:text-[#4DD4C4]"
                            >
                                Copy to clipboard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-bottom-5 duration-200">
                    <div
                        className={`border bg-[var(--ls-surface)] rounded-xl p-4 flex items-center gap-3 shadow-lg min-w-[320px] ${
                            toast.type === "error" ? "border-rose-300 dark:border-rose-500/30" : "border-emerald-300 dark:border-emerald-500/30"
                        }`}
                    >
                        <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                toast.type === "error" ? "bg-rose-500/10 text-rose-600 dark:text-rose-300" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                            }`}
                        >
                            {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className={`font-bold text-xs ${HEADING}`}>{toast.type === "error" ? "Action failed" : "Success"}</h4>
                            <p className={`text-xs mt-0.5 ${MUTED}`}>{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className={MUTED} aria-label="Dismiss">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
