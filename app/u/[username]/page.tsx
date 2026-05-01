import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Flame, Trophy, MapPin, Briefcase, Github, Linkedin, Calendar, User } from 'lucide-react';

type Props = {
    params: Promise<{ username: string }>;
};

async function getProfileData(username: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
        const res = await fetch(`${apiUrl}/u/${username}`, { next: { revalidate: 60 } });
        if (!res.ok) {
            if (res.status === 404 || res.status === 403) return null;
            throw new Error('Failed to fetch profile');
        }
        return res.json();
    } catch (e) {
        console.error("Error fetching public profile:", e);
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params;
    const profile = await getProfileData(username);
    
    if (!profile) {
        return { title: 'Profile Not Found | DailySQL' };
    }

    // Degradation strategy for OG description
    let description = `Check out ${profile.full_name}'s profile on DailySQL!`;
    if (profile.stats.total_solved > 0 || profile.current_streak > 0) {
        const parts = [];
        if (profile.current_streak > 0) parts.push(`${profile.current_streak} Day Streak`);
        if (profile.stats.total_solved > 0) parts.push(`${profile.stats.total_solved} Problems Solved`);
        description = parts.join(' | ');
    }

    return {
        title: `${profile.full_name} (@${profile.username}) | DailySQL`,
        description,
        openGraph: {
            title: `${profile.full_name}'s DailySQL Profile`,
            description,
            url: `https://dailysql.com/u/${profile.username}`,
            siteName: 'DailySQL',
            images: [
                {
                    url: profile.avatar_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=630',
                    width: 1200,
                    height: 630,
                    alt: `${profile.full_name}'s Profile`,
                }
            ],
            type: 'profile',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${profile.full_name}'s DailySQL Profile`,
            description,
        }
    };
}

export default async function PublicProfilePage({ params }: Props) {
    const { username } = await params;
    const profile = await getProfileData(username);

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#080c16] text-white p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                    <User className="text-red-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                <p className="text-zinc-400 max-w-sm mb-6">This profile doesn't exist or has been made private by the user.</p>
                <Link href="/practice/daily">
                    <button className="px-6 py-2 bg-[#4DD4C4] text-[#080c16] rounded-xl text-sm font-bold">Return Home</button>
                </Link>
            </div>
        );
    }

    const joinedDate = new Date(profile.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-[#080c16] text-zinc-300 font-sans pb-16 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4DD4C4]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] bg-[#8b5cf6]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

            <div className="max-w-[1000px] mx-auto p-4 sm:p-6 lg:p-8 relative z-10 w-full pt-8 lg:pt-12">
                <div className="bg-[#131924]/80 backdrop-blur-xl border border-[#202736]/80 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row gap-8 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4DD4C4]/5 via-transparent to-transparent opacity-100 pointer-events-none"></div>
                    
                    {/* Left side: Avatar & Basic Info */}
                    <div className="flex flex-col items-center md:items-start shrink-0 z-10">
                        <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-3xl overflow-hidden border-2 border-[#4DD4C4]/30 bg-[#0b101c] mb-6 shadow-lg shadow-[#4DD4C4]/10">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User size={50} className="text-zinc-600" />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-3 mb-4">
                            {profile.github_url && (
                                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#202736] flex items-center justify-center hover:bg-[#202736]/80 transition-colors border border-[#202736]/50">
                                    <Github size={18} className="text-zinc-300" />
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#202736] flex items-center justify-center hover:bg-[#202736]/80 transition-colors border border-[#202736]/50">
                                    <Linkedin size={18} className="text-[#0a66c2]" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right side: Details & Stats */}
                    <div className="flex-1 z-10 flex flex-col">
                        <div className="text-center md:text-left mb-6">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{profile.full_name}</h1>
                            <p className="text-zinc-400 text-lg font-medium mb-4">@{profile.username}</p>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-zinc-300">
                                {(profile.job_role || profile.occupation) && (
                                    <div className="flex items-center gap-1.5 bg-[#202736]/50 px-3 py-1.5 rounded-lg border border-[#202736]">
                                        <Briefcase size={14} className="text-[#4DD4C4]" />
                                        {profile.job_role || profile.occupation}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-zinc-500">
                                    <Calendar size={14} />
                                    Joined {joinedDate}
                                </div>
                            </div>
                        </div>

                        {profile.bio && (
                            <div className="mb-8 text-zinc-300 text-sm md:text-base leading-relaxed text-center md:text-left max-w-2xl bg-[#0b101c]/50 p-4 rounded-xl border border-[#202736]/50">
                                {profile.bio}
                            </div>
                        )}

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
                            <div className="bg-[#0b101c] p-4 rounded-2xl border border-[#202736] flex flex-col items-center justify-center shadow-inner">
                                <Flame size={24} className="text-[#4DD4C4] fill-[#4DD4C4]/20 mb-2" />
                                <span className="text-2xl font-black text-white">{profile.current_streak}</span>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Streak</span>
                            </div>
                            <div className="bg-[#0b101c] p-4 rounded-2xl border border-[#202736] flex flex-col items-center justify-center shadow-inner">
                                <Trophy size={24} className="text-[#f59e0b] fill-[#f59e0b]/20 mb-2" />
                                <span className="text-2xl font-black text-white">{profile.stats.total_solved}</span>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Solved</span>
                            </div>
                            <div className="col-span-2 bg-[#0b101c] p-4 rounded-2xl border border-[#202736] flex flex-col justify-center shadow-inner">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 px-2">Difficulty</span>
                                <div className="flex justify-between items-end gap-2 h-10 px-2">
                                    <div className="w-1/3 flex flex-col items-center gap-1">
                                        <span className="text-sm font-bold text-[#00b8a3]">{profile.stats.easy}</span>
                                        <div className="w-full bg-[#00b8a3]/20 rounded-t-sm" style={{ height: `${Math.max((profile.stats.easy / (profile.stats.total_solved || 1)) * 100, 10)}%` }}></div>
                                    </div>
                                    <div className="w-1/3 flex flex-col items-center gap-1">
                                        <span className="text-sm font-bold text-[#ffc01e]">{profile.stats.medium}</span>
                                        <div className="w-full bg-[#ffc01e]/20 rounded-t-sm" style={{ height: `${Math.max((profile.stats.medium / (profile.stats.total_solved || 1)) * 100, 10)}%` }}></div>
                                    </div>
                                    <div className="w-1/3 flex flex-col items-center gap-1">
                                        <span className="text-sm font-bold text-[#ff375f]">{profile.stats.advanced}</span>
                                        <div className="w-full bg-[#ff375f]/20 rounded-t-sm" style={{ height: `${Math.max((profile.stats.advanced / (profile.stats.total_solved || 1)) * 100, 10)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
