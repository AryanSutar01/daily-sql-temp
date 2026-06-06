"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, User, Briefcase, History, BarChart2, Flame, X, Code, Trophy, Github, Linkedin, Calendar } from "lucide-react";
import { api } from "@/lib/api";

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

export default function PublicProfileClient({ profile: initialProfile }: { profile: any }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
    const [viewingCode, setViewingCode] = useState<{ title: string; query: string } | null>(null);
    const [loadingCode, setLoadingCode] = useState(false);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        async function loadLeaderboard() {
            try {
                const lb = await api.getLeaderboard().catch(() => []);
                setLeaderboard(lb || []);
            } catch (err) {
                console.error("Failed to load leaderboard", err);
            }
        }
        loadLeaderboard();
    }, []);

    const profile = initialProfile;
    const stats = {
        easy: { solved: profile.stats.easy.solved || 0, total: profile.stats.easy.total || 1, color: "#00b8a3" },
        medium: { solved: profile.stats.medium.solved || 0, total: profile.stats.medium.total || 1, color: "#ffc01e" },
        hard: { solved: profile.stats.advanced.solved || 0, total: profile.stats.advanced.total || 1, color: "#ff375f" },
    };

    const totalQuestions = stats.easy.total + stats.medium.total + stats.hard.total;
    const totalSolved = stats.easy.solved + stats.medium.solved + stats.hard.solved;

    const gap = 16;
    const availableAngle = 360 - gap * 3;

    const easyAngle = (stats.easy.total / (totalQuestions || 1)) * availableAngle;
    const mediumAngle = (stats.medium.total / (totalQuestions || 1)) * availableAngle;
    const hardAngle = (stats.hard.total / (totalQuestions || 1)) * availableAngle;

    const segments = [
        { id: 'easy', start: 0, end: easyAngle, solved: stats.easy.solved, total: stats.easy.total, color: stats.easy.color },
        { id: 'medium', start: easyAngle + gap, end: easyAngle + gap + mediumAngle, solved: stats.medium.solved, total: stats.medium.total, color: stats.medium.color },
        { id: 'hard', start: easyAngle + mediumAngle + gap * 2, end: easyAngle + mediumAngle + hardAngle + gap * 2, solved: stats.hard.solved, total: stats.hard.total, color: stats.hard.color }
    ];

    const submissions = profile.submissions || [];
    const heatmapData = profile.heatmap || {};
    const filteredSubmissions = submissions.filter((p: any) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

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
            startDate = new Date(year, 0, 1); 
            const startDay = startDate.getDay();
            if (startDay !== 0) {
                startDate.setDate(startDate.getDate() - startDay);
            }
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
                
                if ((selectedYear === 'last_12' || year === parseInt(selectedYear)) && 
                   ((month !== currentMonth && row === 0) || (month !== currentMonth && day === 1))) {
                    labels.push({ name: currentDate.toLocaleString('default', { month: 'short' }), colIndex: col });
                    currentMonth = month;
                }

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

    const joinedDate = new Date(profile.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <>
        <div className="min-h-screen bg-[#080c16] text-zinc-300 font-sans pb-16 relative overflow-hidden">
            
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
                        
                        <div className="relative w-[110px] h-[110px] rounded-[32px] mb-6 p-1 border border-[#4DD4C4]/20 bg-[#4DD4C4]/5 shadow-[0_0_15px_rgba(77,212,196,0.05)] overflow-hidden">
                            <div className="w-full h-full rounded-[28px] overflow-hidden bg-[#080c16] flex justify-center items-center border border-[#202736]/50">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <User size={40} className="text-zinc-600" />
                                )}
                            </div>
                        </div>
                        
                        <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">{profile.full_name || 'Member'}</h1>
                        {profile.username && (
                            <div className="flex items-center gap-1.5 mt-1 text-zinc-400 font-medium">
                                <span className="text-sm">@{profile.username}</span>
                            </div>
                        )}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-[#4DD4C4]/10 border border-[#4DD4C4]/20 text-[#4DD4C4] text-[12px] font-bold tracking-wide">
                            <Flame size={12} /> {profile.job_role || profile.occupation || 'Learner'}
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs mt-3 font-medium">
                            <Calendar size={12} /> Joined {joinedDate}
                        </div>

                        <div className="flex gap-3 mt-4">
                            {profile.github_url && (
                                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-[#202736]/50 flex items-center justify-center hover:bg-[#202736] transition-colors border border-[#202736]">
                                    <Github size={16} className="text-zinc-300" />
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-[#202736]/50 flex items-center justify-center hover:bg-[#202736] transition-colors border border-[#202736]">
                                    <Linkedin size={16} className="text-[#0a66c2]" />
                                </a>
                            )}
                        </div>

                        {profile.bio && (
                            <p className="text-[13px] text-zinc-400 mt-6 leading-relaxed max-w-xs">{profile.bio}</p>
                        )}
                    </div>

                    {/* Leaderboard Card */}
                    <div className="relative flex-1 bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-6 flex flex-col shadow-xl overflow-hidden group hover:border-[#4DD4C4]/20 transition-all duration-500">
                        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#f59e0b]/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#f59e0b]/10 transition-colors duration-700"></div>
                        
                        <div className="flex items-center gap-3 mb-5 relative z-10">
                            <div className="w-8 h-8 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center border border-[#f59e0b]/20 shrink-0">
                                <Trophy size={14} className="text-[#f59e0b]" />
                            </div>
                            <h3 className="text-[14px] font-bold text-white tracking-wide">Leaderboard</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar relative z-10">
                            {leaderboard.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                                    <Trophy size={28} className="text-zinc-700" />
                                    <p className="text-xs text-zinc-500">No data yet</p>
                                </div>
                            ) : leaderboard.map((entry, idx) => {
                                const isCurrentProfile = entry.username === profile.username;
                                const rankColors = ['text-[#f59e0b]', 'text-[#94a3b8]', 'text-[#b45309]'];
                                const rankBg = ['bg-[#f59e0b]/10 border-[#f59e0b]/30', 'bg-[#94a3b8]/10 border-[#94a3b8]/30', 'bg-[#b45309]/10 border-[#b45309]/30'];
                                
                                return (
                                    <div
                                        key={entry.user_id || idx}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                                            isCurrentProfile
                                                ? 'bg-[#4DD4C4]/8 border-[#4DD4C4]/30 shadow-[0_0_10px_rgba(77,212,196,0.08)]'
                                                : 'bg-[#0b101c]/40 border-[#202736] hover:border-[#202736]/80 hover:bg-[#131924]/60'
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border shrink-0 ${
                                            idx < 3 ? rankBg[idx] + ' ' + rankColors[idx] : 'bg-[#202736]/60 border-[#202736] text-zinc-500'
                                        }`}>
                                            {idx + 1}
                                        </div>

                                        <div className="w-7 h-7 rounded-lg bg-[#0b101c] border border-[#202736] flex items-center justify-center overflow-hidden shrink-0">
                                            {entry.avatar_url ? (
                                                <img src={entry.avatar_url} alt={entry.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={14} className="text-zinc-600" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                {entry.username ? (
                                                    <Link href={`/u/${entry.username}`} className={`text-[12px] font-semibold truncate hover:underline ${
                                                        isCurrentProfile ? 'text-[#4DD4C4]' : 'text-zinc-200 hover:text-white'
                                                    }`}>
                                                        {entry.full_name}
                                                    </Link>
                                                ) : (
                                                    <span className={`text-[12px] font-semibold truncate ${
                                                        isCurrentProfile ? 'text-[#4DD4C4]' : 'text-zinc-200'
                                                    }`}>
                                                        {entry.full_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

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
                                            if (seg.end <= seg.start) return null;
                                            const solvedAngle = seg.start + (seg.solved / (seg.total || 1)) * (seg.end - seg.start);
                                            return (
                                                <g key={seg.id} 
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
                                                        className="transition-all duration-300"
                                                        opacity={hoveredSegment && hoveredSegment !== seg.id ? 0.05 : 0.15}
                                                    />
                                                    {seg.solved > 0 && (
                                                        <path 
                                                            d={describeArc(50, 50, 42, seg.start, solvedAngle)} 
                                                            stroke={seg.color} 
                                                            strokeWidth="5" 
                                                            fill="transparent" 
                                                            strokeLinecap="round" 
                                                            className="transition-all duration-700 ease-out"
                                                            style={{ opacity: hoveredSegment && hoveredSegment !== seg.id ? 0.3 : 1 }}
                                                        />
                                                    )}
                                                    <path d={describeArc(50, 50, 42, seg.start, seg.end)} stroke="transparent" strokeWidth="20" fill="transparent" strokeLinecap="round" />
                                                </g>
                                            );
                                        })}
                                    </svg>
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

                        {/* Difficulty Stats List */}
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
                                                 style={{ borderColor: `${s.color}30`, backgroundColor: `${s.color}10`, color: s.color }}>
                                                <span className="text-[11px] font-black tracking-widest uppercase">{s.id}</span>
                                            </div>
                                            <div className="flex items-baseline gap-1.5 pr-1">
                                                <span className="text-[18px] font-bold text-white leading-none tracking-tight">{s.val}</span>
                                                <span className="text-[13px] font-bold text-zinc-500">/ {s.max}</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-1.5 bg-[#171e2e] rounded-full overflow-hidden relative" style={{ opacity: 0.8 }}>
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
                                    <option value={String(currentYear)}>{currentYear}</option>
                                    <option value={String(currentYear - 1)}>{currentYear - 1}</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="w-full overflow-x-auto pb-4 custom-scrollbar lg:pr-4 relative z-10 flex justify-center">
                            <div className="min-w-fit flex flex-col gap-2">
                                <div className="relative h-[14px] w-full mt-1">
                                    {monthLabels.map((lbl, idx) => {
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

                    {/* Bottom Row: Submissions */}
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
                                {filteredSubmissions.map((p: any) => {
                                    const diffLabels: Record<string, any> = {
                                        easy: { t: 'text-[#4DD4C4]', b: 'border-[#4DD4C4]/30', bg: 'bg-[#4DD4C4]/10', icon: 'bg-[#4DD4C4]', shadow: 'group-hover:shadow-[0_4px_20px_rgba(77,212,196,0.08)]' },
                                        medium: { t: 'text-[#eab308]', b: 'border-[#eab308]/30', bg: 'bg-[#eab308]/10', icon: 'bg-[#eab308]', shadow: 'group-hover:shadow-[0_4px_20px_rgba(234,179,8,0.08)]' },
                                        hard: { t: 'text-[#f87171]', b: 'border-[#f87171]/30', bg: 'bg-[#f87171]/10', icon: 'bg-[#f87171]', shadow: 'group-hover:shadow-[0_4px_20px_rgba(248,113,113,0.08)]' },
                                        advanced: { t: 'text-[#f87171]', b: 'border-[#f87171]/30', bg: 'bg-[#f87171]/10', icon: 'bg-[#f87171]', shadow: 'group-hover:shadow-[0_4px_20px_rgba(248,113,113,0.08)]' },
                                    };
                                    const st = diffLabels[p.difficulty.toLowerCase()] || { t: 'text-zinc-400', b: 'border-[#202736]', bg: 'bg-[#202736]/30', icon: 'bg-zinc-500', shadow: 'group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]' };

                                    return (
                                        <div key={p.id} onClick={async () => {
                                            setLoadingCode(true);
                                            try {
                                                const sol = await api.getPublicSavedSolution(profile.username, p.id);
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
        </>
    );
}
