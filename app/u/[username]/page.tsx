import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicProfileClient from './PublicProfileClient';

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
            url: `https://dailysql.in/u/${profile.username}`,
            siteName: 'DailySQL',
            images: [
                {
                    url: profile.avatar_url || '/og-image.jpeg',
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
                    <svg className="text-red-400 w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                <p className="text-zinc-400 max-w-sm mb-6">This profile doesn't exist or has been made private by the user.</p>
                <a href="/practice/daily">
                    <button className="px-6 py-2 bg-[#4DD4C4] text-[#080c16] rounded-xl text-sm font-bold">Return Home</button>
                </a>
            </div>
        );
    }

    return <PublicProfileClient profile={profile} />;
}
