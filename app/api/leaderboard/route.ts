import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Public leaderboard proxy — no auth token forwarded, no private data exposed.
// We only return the fields needed for the landing page preview (top 5).
export async function GET() {
  try {
    const res = await fetch(`${API_URL}/leaderboard`, {
      // Cache for 5 minutes on the server — leaderboard doesn't need real-time updates
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: res.status });
    }

    const data: any[] = await res.json();

    // Only expose safe public fields — never forward email, user_id, or internal fields
    const safe = data.slice(0, 5).map((entry, idx) => ({
      rank: idx + 1,
      username: entry.username ?? null,
      full_name: entry.full_name ?? "Anonymous",
      avatar_url: entry.avatar_url ?? null,
      current_streak: entry.current_streak ?? 0,
      total_solved: entry.total_solved ?? 0,
    }));

    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
