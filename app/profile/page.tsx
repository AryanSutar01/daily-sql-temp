"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Share2, Search, Filter } from "lucide-react";
import { StandaloneNavbar } from "@/components/auth/standalone-navbar";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

    const stats = {
        easy: { solved: 8, total: 346, color: "#4DD4C4" },
        medium: { solved: 13, total: 476, color: "#eab308" },
        hard: { solved: 7, total: 254, color: "#f87171" },
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

    const MOCK_SUBMISSIONS = [
        { id: 2, title: "Monthly Revenue", difficulty: "basic" },
        { id: 3, title: "Second Highest Salary", difficulty: "basic" },
        { id: 4, title: "Department Top Three Salaries", difficulty: "intermediate" },
        { id: 5, title: "Consecutive Numbers", difficulty: "advanced" },
    ];

    const getDiffStyle = (level: string) => {
        switch (level) {
            case "basic": return { color: "text-[#4DD4C4]", bg: "bg-[#4DD4C4]/10", border: "border-[#4DD4C4]/20", label: "BASIC" };
            case "intermediate": return { color: "text-[#eab308]", bg: "bg-[#eab308]/10", border: "border-[#eab308]/20", label: "INTERMEDIATE" };
            case "advanced": return { color: "text-[#f87171]", bg: "bg-[#f87171]/10", border: "border-[#f87171]/20", label: "ADVANCED" };
            default: return { color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", label: "UNKNOWN" };
        }
    };

    const filteredSubmissions = MOCK_SUBMISSIONS.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery));

    // Generate mock heatmap grouped by month (March 2025 - Feb 2026) to match the Striver-style visual gaps
    const heatmapMonths = useMemo(() => {
        const data = [];
        const startYear = 2025;
        const startMonth = 2; // March (0-indexed)

        for (let i = 0; i < 12; i++) {
            const date = new Date(startYear, startMonth + i, 1);
            const year = date.getFullYear();
            const month = date.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDay = date.getDay(); // 0 = Sunday

            const weeks = [];
            let currentWeek = Array(7).fill(-1);

            for (let day = 1; day <= daysInMonth; day++) {
                const dayOfWeek = (startDay + day - 1) % 7;

                let activity = 0;

                // Add dummy activity for recent months (Jan / Feb) to show the glowing blocks
                if (i === 10 && day === 15) activity = 3;
                if (i === 10 && day === 16) activity = 4;
                if (i === 10 && day === 18) activity = 1;
                if (i === 11 && day === 5) activity = 2;
                if (i === 11 && Math.random() > 0.8) {
                    activity = Math.floor(Math.random() * 3) + 1;
                }

                currentWeek[dayOfWeek] = activity;

                if (dayOfWeek === 6 || day === daysInMonth) {
                    weeks.push([...currentWeek]);
                    currentWeek = Array(7).fill(-1);
                }
            }
            data.push({
                name: date.toLocaleString('default', { month: 'short' }),
                weeks
            });
        }
        return data;
    }, []);

    return (
        <div className="fixed inset-0 top-0 z-[100] flex flex-col overflow-y-auto bg-[#080c16] text-zinc-200">
            <StandaloneNavbar />
            <div className="py-12 px-4 sm:px-6 lg:px-8 shrink-0">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Header / Nav */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/practice/daily">
                            <button className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                                <ArrowLeft size={16} /> Back to Practice
                            </button>
                        </Link>
                        <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            DailySQL
                        </div>
                    </div>

                    {/* Top Row: User Info & Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Profile Card */}
                        <div className="p-6 rounded-2xl border border-[#202736] bg-[#131924] flex justify-between items-start shadow-xl">
                            <div className="flex gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-[#4DD4C4] flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
                                    <svg className="w-16 h-16 text-[#080c16]/30 mt-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                                <div className="space-y-1 mt-1">
                                    <h2 className="text-2xl font-bold text-white tracking-tight">Name</h2>
                                    <p className="text-sm font-medium text-zinc-400">user_name</p>
                                    <div className="pt-2 space-y-0.5">
                                        <p className="text-sm text-zinc-300">Rank: <span className="font-bold text-white">1549</span></p>
                                        <p className="text-sm text-zinc-400">vedant@example.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Link href="/profile/edit">
                                    <button className="p-2 rounded bg-[#0b101c] border border-[#202736] text-zinc-400 hover:text-white hover:border-[#4DD4C4]/50 transition-colors shadow-sm" title="Edit Profile">
                                        <Edit2 size={16} />
                                    </button>
                                </Link>
                                <button className="p-2 rounded bg-[#0b101c] border border-[#202736] text-zinc-400 hover:text-white hover:border-[#4DD4C4]/50 transition-colors shadow-sm" title="Share Profile">
                                    <Share2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="p-6 rounded-2xl border border-[#202736] bg-[#131924] flex flex-col sm:flex-row items-center justify-center gap-10 shadow-xl">
                            <div className="relative w-40 h-40 shrink-0">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle strokeWidth="2" cx="50" cy="50" r="36" fill="transparent" stroke="currentColor" className="text-zinc-800" opacity="0.3"></circle>

                                    {segments.map((seg) => {
                                        const solvedRatio = seg.total > 0 ? seg.solved / seg.total : 0;
                                        // Reduce the progress angle slightly so it doesn't touch the start of the next segment
                                        let progressAngle = solvedRatio * (seg.end - seg.start - 2);
                                        if (seg.solved > 0 && progressAngle < 0.1) progressAngle = 0.1;
                                        const progressEnd = seg.start + progressAngle;
                                        const isHovered = hoveredSegment === seg.id;

                                        return (
                                            <g key={seg.id}
                                                onMouseEnter={() => setHoveredSegment(seg.id)}
                                                onMouseLeave={() => setHoveredSegment(null)}
                                            >
                                                {/* Hit area */}
                                                <path
                                                    d={describeArc(50, 50, 36, seg.start, seg.end)}
                                                    stroke="transparent"
                                                    strokeWidth="26"
                                                    strokeLinecap="round"
                                                    fill="none"
                                                    className="cursor-pointer pointer-events-stroke"
                                                />
                                                {/* Base track */}
                                                <path
                                                    d={describeArc(50, 50, 34, seg.start, seg.end)}
                                                    stroke={seg.color}
                                                    strokeLinecap="round"
                                                    fill="none"
                                                    strokeWidth="6"
                                                    opacity={isHovered ? 0.4 : 0.2}
                                                    className="transition-all duration-300 pointer-events-none"
                                                    style={{ filter: isHovered ? `drop-shadow(0 0 6px ${seg.color})` : 'none' }}
                                                />
                                                {/* Progress track */}
                                                {seg.solved > 0 && (
                                                    <path
                                                        d={describeArc(50, 50, 36, seg.start, progressEnd)}
                                                        stroke={seg.color}
                                                        strokeLinecap="round"
                                                        fill="none"
                                                        strokeWidth="2"
                                                        className="transition-all duration-300 pointer-events-none"
                                                        style={{ filter: isHovered ? `drop-shadow(0 0 6px ${seg.color}) drop-shadow(0 0 4px ${seg.color})` : `drop-shadow(0 0 2px ${seg.color})` }}
                                                    />
                                                )}
                                            </g>
                                        );
                                    })}
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-bold text-white leading-none">{totalSolved}</span>
                                        <hr className="w-8 border-t border-zinc-600 my-1" />
                                        <span className="text-xs text-zinc-400 font-medium">{totalQuestions}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-5 w-full sm:w-auto">
                                {segments.map(seg => {
                                    const isHovered = hoveredSegment === seg.id;
                                    return (
                                        <div
                                            key={seg.id}
                                            className="flex items-center justify-between gap-6 cursor-pointer group"
                                            onMouseEnter={() => setHoveredSegment(seg.id)}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full transition-all duration-300"
                                                    style={{
                                                        backgroundColor: seg.color,
                                                        boxShadow: isHovered ? `0 0 10px ${seg.color}` : (seg.solved > 0 ? `0 0 6px ${seg.color}60` : 'none')
                                                    }}
                                                />
                                                <span className={`text-sm font-medium capitalize transition-colors duration-300 ${isHovered ? 'text-zinc-200' : 'text-zinc-400'}`}>
                                                    {seg.id}
                                                </span>
                                            </div>
                                            <span className={`text-sm font-semibold flex items-center gap-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-zinc-200'}`}>
                                                <span>{seg.solved}</span>
                                                <span className="font-normal">/ {seg.total}</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Heatmap Section */}
                    <div className="p-6 rounded-2xl border border-[#202736] bg-[#131924] shadow-xl">
                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-zinc-200 font-medium flex items-center gap-2">
                                <span className="text-xl font-bold text-white">7</span> submissions in the past one year <span className="text-zinc-600 text-sm cursor-pointer">ⓘ</span>
                            </h3>
                            <div className="flex gap-4 text-xs">
                                <span className="text-zinc-400">Total active days: <span className="font-bold text-white">3</span></span>
                                <span className="text-zinc-400">Max streak: <span className="font-bold text-white">1</span></span>
                            </div>
                        </div>

                        <div className="relative w-full overflow-x-auto pb-4 custom-scrollbar">
                            <div className="min-w-[700px]">
                                <div className="flex gap-4">
                                    {heatmapMonths.map((month, mIdx) => (
                                        <div key={mIdx} className="flex flex-col gap-2">
                                            <div className="flex gap-[3px]">
                                                {month.weeks.map((week, wIdx) => (
                                                    <div key={wIdx} className="flex flex-col gap-[3px]">
                                                        {week.map((dayCount, dIdx) => {
                                                            if (dayCount === -1) {
                                                                return <div key={`${wIdx}-${dIdx}`} className="w-[10px] h-[10px] bg-transparent" />;
                                                            }
                                                            let bgColor = "bg-[#202736]";
                                                            if (dayCount === 1) bgColor = "bg-[#4DD4C4]/30";
                                                            else if (dayCount === 2) bgColor = "bg-[#4DD4C4]/60";
                                                            else if (dayCount >= 3) bgColor = "bg-[#4DD4C4]";

                                                            return (
                                                                <div key={`${wIdx}-${dIdx}`} className={`w-[10px] h-[10px] rounded-[2px] ${bgColor} transition-all cursor-pointer`} title={`${dayCount} submissions`} />
                                                            )
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-zinc-500 font-medium text-center block mt-1">{month.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submissions List Section */}
                    <div className="p-6 rounded-2xl border border-[#202736] bg-[#131924] shadow-xl min-h-[400px]">
                        <h3 className="text-lg font-mono font-medium text-white mb-6 tracking-tight">My Submissions</h3>

                        <div className="flex mb-6">
                            <div className="w-full flex gap-2">
                                <div className="flex-1 relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="Search Questions..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full bg-[#0b101c] border border-[#202736] rounded text-xs py-2.5 pl-9 pr-3 text-zinc-300 outline-none focus:border-[#4DD4C4]/50 transition-colors"
                                    />
                                </div>
                                <button className="p-2.5 bg-[#0b101c] border border-[#202736] rounded text-[#4DD4C4] hover:bg-[#1a2230] transition-colors"><Filter size={14} /></button>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="w-full space-y-2">
                                {filteredSubmissions.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-3 rounded bg-[#0b101c] border border-[#202736] hover:border-[#4DD4C4]/30 cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="text-sm font-medium text-zinc-300 group-hover:text-white shrink-0 w-[20px]">{p.id}.</span>
                                            <span className="text-sm font-medium text-zinc-300 group-hover:text-white truncate">{p.title}</span>
                                        </div>
                                        <div className="w-[100px] flex justify-center shrink-0">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getDiffStyle(p.difficulty).color} ${getDiffStyle(p.difficulty).bg} ${getDiffStyle(p.difficulty).border}`}>
                                                {getDiffStyle(p.difficulty).label}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {filteredSubmissions.length === 0 && <div className="text-center text-xs text-zinc-500 mt-8">No matching submissions.</div>}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
