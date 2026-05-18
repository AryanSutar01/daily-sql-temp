import { DailySetClient, DailySetSkeleton } from "@/components/daily-set/client";
import { Suspense } from "react";

export default function DailySetPage() {
    return (
        <Suspense fallback={<DailySetSkeleton />}>
            <DailySetClient />
        </Suspense>
    );
}
