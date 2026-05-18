import { Metadata } from 'next';
import { DailySetClient, DailySetSkeleton } from "@/components/daily-set/client";
import { Suspense } from "react";

type Props = {
    params: Promise<{ problemId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { problemId } = await params;
    
    // Default metadata if fetch fails
    const defaultMeta: Metadata = {
        title: 'DailySQL Practice',
        description: 'Practice SQL interview questions.',
    };

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/problems/${problemId}`, { next: { revalidate: 3600 } });
        
        if (!res.ok) return defaultMeta;
        
        const problem = await res.json();
        const difficultyStr = problem.difficulty ? problem.difficulty.toUpperCase() : 'SQL';
        
        return {
            title: `${problem.title} | ${difficultyStr} SQL Interview Question | DailySQL`,
            description: `Practice the ${problem.title} SQL interview question. Difficulty: ${problem.difficulty}. Estimated time: ${problem.estimated_time_minutes} minutes.`,
            openGraph: {
                title: `${problem.title} | ${difficultyStr} SQL Interview Question`,
                description: `Practice the ${problem.title} SQL interview question. Enhance your data skills on DailySQL.`,
                url: `https://dailysql.in/practice/daily/${problemId}`,
                siteName: 'DailySQL',
                // Using a placeholder image for now, replace with an actual OG image later
                images: [
                    {
                        url: '/og-image.jpeg',
                        width: 1200,
                        height: 630,
                        alt: 'DailySQL Interview Question',
                    }
                ],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${problem.title} | ${difficultyStr} SQL Interview Question`,
                description: `Crush this ${problem.difficulty} SQL interview question on DailySQL!`,
                images: ['/og-image.jpeg'],
            }
        };
    } catch (error) {
        console.error("Failed to fetch problem for metadata:", error);
        return defaultMeta;
    }
}

export default function DailyProblemPage() {
    return (
        <Suspense fallback={<DailySetSkeleton />}>
            <DailySetClient />
        </Suspense>
    );
}
