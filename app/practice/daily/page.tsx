import { DailySetClient } from "@/components/daily-set/client";
import { Suspense } from "react";

export default function DailySetPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 flex items-center justify-center bg-[#080c16] text-zinc-500">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-t-[#4DD4C4] border-zinc-800 animate-spin" />
                    <p className="text-xs font-medium tracking-widest uppercase">Initializing Environment...</p>
                </div>
            </div>
        }>
            <DailySetClient />
        </Suspense>
    );
}
