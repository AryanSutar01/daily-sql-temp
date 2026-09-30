"use client";

import { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    quote: "DailySQL has helped me build a consistent habit of practicing SQL every day. The questions are practical, interview-focused, and gradually improve both my SQL knowledge and problem-solving skills.",
    name: "Dheeraj Lakkakula",
    handle: "@dheeraj_lakk",
    role: "Data Analyst",
    avatar: "DL",
    color: "#7c3aed",
    replyTo: "@dailysql_in",
    likes: 12,
    time: "9:14 AM · Aug 18, 2026",
  },
  {
    quote: "This platform is incredible. Since Python and PySpark questions were added, it has become even more valuable. I've gained a lot of confidence and have already recommended it to my friends.",
    name: "Anam Ahsan",
    handle: "@anamahsan_de",
    role: "Data Engineer · CTS",
    avatar: "AA",
    color: "#1f9e8e",
    replyTo: null,
    likes: 24,
    time: "5:44 PM · Aug 17, 2026",
  },
  {
    quote: "DailySQL is hands down one of the best platforms for SQL, Python, and PySpark. The questions are fresh, non-repetitive, interview-level, and inspired by real-world business scenarios.",
    name: "Dheeraj S Kulkarni",
    handle: "@dheerajsk_data",
    role: "Data Engineer · Covalen",
    avatar: "DK",
    color: "#2563eb",
    replyTo: "@dailysql_in",
    likes: 8,
    time: "2:30 PM · Aug 16, 2026",
  },
  {
    quote: "The absolute best site for daily data practice! Easy, Medium, and Hard difficulty levels make it perfect for both beginners and advanced learners looking to push their limits.",
    name: "Girish Ratnaparkhi",
    handle: "@girishrp",
    role: "Data Engineer · Cognizant",
    avatar: "GR",
    color: "#d97706",
    replyTo: null,
    likes: 31,
    time: "11:02 PM · Aug 17, 2026",
  },
  {
    quote: "If you want to elevate your SQL skills for data roles, I highly recommend DailySQL. It completely transformed how I approach complex SQL problems and gave me the practical edge I was looking for.",
    name: "Divyanshu Tiwari",
    handle: "@divyanshu_tw",
    role: "Student",
    avatar: "DT",
    color: "#dc2626",
    replyTo: "@dailysql_in",
    likes: 5,
    time: "3:20 AM · Aug 18, 2026",
  },
  {
    quote: "I have had a great experience with DailySQL. It is one of the best platforms and can compete with many paid platforms. Lifetime subscriber here 🔥",
    name: "Chaitaly Sen",
    handle: "@chaitaly_sen",
    role: "Data Analyst · IVY Institute",
    avatar: "CS",
    color: "#4f46e5",
    replyTo: null,
    likes: 18,
    time: "5:44 PM · Aug 17, 2026",
  },
];

const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS];

/* ── X (Twitter) logo ── */
function XLogo() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" style={{ color: "var(--ls-heading)", flexShrink: 0 }}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function TweetCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  return (
    <div
      className="flex-shrink-0 mx-3"
      style={{
        width: 300,
        background: "var(--ls-surface)",
        border: "1px solid var(--ls-outline)",
        borderRadius: 16,
        padding: "16px 16px 12px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.15s",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: t.color, display: "flex", alignItems: "center",
            justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700,
          }}>
            {t.avatar}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ls-heading)", lineHeight: 1.2 }}>{t.name}</span>
              {/* Verified blue tick */}
              <svg viewBox="0 0 22 22" width={14} height={14} style={{ flexShrink: 0 }}>
                <path fill="#1d9bf0" d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
              <span style={{ fontSize: 12, color: "var(--ls-on-surface-muted)" }}>{t.handle} · <span style={{ color: "var(--ls-on-surface-muted)" }}>Follow</span></span>
            </div>
          </div>
        </div>
        <XLogo />
      </div>

      {/* Reply-to */}
      {t.replyTo && (
        <p style={{ fontSize: 12, color: "var(--ls-on-surface-muted)", marginBottom: 6 }}>
          Replying to <span style={{ color: "#1d9bf0" }}>{t.replyTo}</span>
        </p>
      )}

      {/* Tweet text */}
      <p style={{
        fontSize: 14, lineHeight: 1.55, color: "var(--ls-heading)",
        marginBottom: 10, flex: 1,
        display: "-webkit-box", WebkitLineClamp: 5,
        WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {t.quote}
      </p>

      {/* Timestamp */}
      <p style={{ fontSize: 12, color: "var(--ls-on-surface-muted)", marginBottom: 10 }}>{t.time}</p>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--ls-outline)", marginBottom: 10 }} />

      {/* Engagement row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 14 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--ls-on-surface-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <HeartIcon /> {t.likes}
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--ls-on-surface-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <ReplyIcon /> Reply
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--ls-on-surface-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <LinkIcon /> Copy link
          </button>
        </div>
        <a href="#" style={{ fontSize: 12, color: "#1d9bf0", textDecoration: "none", fontWeight: 500 }}>
          Read more on X
        </a>
      </div>
    </div>
  );
}

export function SocialProof() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const posRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const speed = 0.45;
    const animate = () => {
      if (!paused) {
        posRef.current += speed;
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, [paused]);

  return (
    <section
      style={{
        padding: "96px 0",
        background: "var(--ls-surface)",
        overflow: "hidden",
        borderBottom: "1px solid var(--ls-outline)",
      }}
    >
      {/* Heading */}
      <div className="mx-auto px-6 mb-14 text-center" style={{ maxWidth: 1280 }}>
        <p
          className="text-xs font-semibold uppercase tracking-[0.18em] mb-4"
          style={{ color: "var(--ls-primary)" }}
        >
          What practitioners say
        </p>
        <h2
          style={{
            fontFamily: "'Overused Grotesk', system-ui, sans-serif",
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--ls-on-surface)",
          }}
        >
          Loved by data professionals
        </h2>
      </div>

      {/* Carousel */}
      <div
        className="relative w-full"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Edge fades */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--ls-surface), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--ls-surface), transparent)" }}
        />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex will-change-transform py-4"
            style={{ width: "max-content" }}
          >
            {DOUBLED.map((t, i) => (
              <TweetCard key={i} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
