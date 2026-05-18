import type { Metadata } from "next";
import { DailySetClient, DailySetSkeleton } from "@/components/daily-set/client";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Daily Practice | Daily SQL",
  description: "Solve today's SQL problems. Practice 3 real-world business scenarios every day and track your streak.",
  alternates: {
    canonical: 'https://dailysql.in/practice/daily',
  }
};

export default function DailySetPage() {
    return (
        <Suspense fallback={<DailySetSkeleton />}>
            <DailySetClient />
        </Suspense>
    );
}
