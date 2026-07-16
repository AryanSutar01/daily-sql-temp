"use client";

import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "DailySQL has helped me build a consistent habit of practicing SQL every day. The questions are practical, interview-focused, and gradually improve both my SQL knowledge and problem-solving skills. I also like that it motivates me to stay consistent instead of practicing only occasionally.",
    name: "Dheeraj Lakkakula",
    role: "Data Analyst",
    company: "",
    avatar: "DL",
    avatarColor: "from-violet-500 to-purple-700",
    rating: 4,
  },
  {
    quote:
      "This platform is incredible. Solving SQL problems daily has boosted my confidence in SQL problem-solving. Since Python and PySpark questions were added, it has become even more valuable. I've gained a lot of confidence using this platform and have already recommended it to my friends. Truly recommended!",
    name: "Anam Ahsan",
    role: "Data Engineer",
    company: "CTS",
    avatar: "AA",
    avatarColor: "from-emerald-500 to-teal-700",
    rating: 5,
  },
  {
    quote:
      "DailySQL is hands down one of the best platforms for anyone who wants to level up their SQL, Python, and PySpark skills through daily practice. The SQL questions are fresh, non-repetitive, interview-level, and inspired by real-world business scenarios. The confidence boost is real! I'm genuinely obsessed with this platform.",
    name: "Dheeraj S Kulkarni",
    role: "Data Engineer",
    company: "Covalen",
    avatar: "DK",
    avatarColor: "from-sky-500 to-blue-700",
    rating: 5,
  },
  {
    quote:
      "The absolute best site for daily data practice! DailySQL makes learning Python, PySpark, and SQL incredibly structured and habit-building. The Easy, Medium, and Hard difficulty levels make it perfect for both beginners and advanced learners looking to push their limits.",
    name: "Girish Ratnaparkhi",
    role: "Data Engineer",
    company: "Cognizant",
    avatar: "GR",
    avatarColor: "from-amber-500 to-orange-700",
    rating: 5,
  },
  {
    quote:
      "If you want to elevate your SQL skills for data roles, I highly recommend DailySQL. I've been using it consistently for two months, and the quality and variety of the questions are unmatched. It completely transformed how I approach complex SQL problems and gave me the practical edge I was looking for.",
    name: "Divyanshu Tiwari",
    role: "Student",
    company: "",
    avatar: "DT",
    avatarColor: "from-pink-500 to-rose-700",
    rating: 5,
  },
  {
    quote:
      "I have had a great experience with DailySQL. It is one of the best platforms and can compete with many paid platforms.",
    name: "Chaitaly Sen",
    role: "Data Analyst",
    company: "IVY Professional Institute",
    avatar: "CS",
    avatarColor: "from-indigo-500 to-violet-700",
    rating: 5,
  },
  {
    quote: "Practicing with DailySQL has been a good experience.",
    name: "Ganne Alekya",
    role: "Student",
    company: "",
    avatar: "GA",
    avatarColor: "from-cyan-500 to-sky-700",
    rating: 4,
  },
];

// Duplicate to create seamless infinite scroll
const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= rating ? "text-[#4DD4C4]" : "text-zinc-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  return (
    <div className="relative flex-shrink-0 w-[340px] md:w-[380px] p-6 rounded-2xl bg-gradient-to-b from-[#141c2e] to-[#0f1623] border border-[#202736] hover:border-[#4DD4C4]/30 transition-all duration-300 flex flex-col mx-3 group">
      {/* Top accent */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#4DD4C4]/30 to-transparent" />

      {/* Quote mark */}
      <div className="text-5xl font-serif text-[#4DD4C4]/15 leading-none select-none mb-1">"</div>

      {/* Stars */}
      <StarRating rating={t.rating} />

      {/* Quote */}
      <p className="text-zinc-300 text-sm leading-relaxed flex-1 mb-6 group-hover:text-white transition-colors duration-300">
        {t.quote}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#202736]">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg`}
        >
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t.name}</p>
          <p className="text-xs text-zinc-500">
            {t.role}
            {t.company ? ` · ${t.company}` : ""}
          </p>
        </div>
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

    // Width of a single set of cards (half the doubled track)
    const speed = 0.5; // px per frame

    const animate = () => {
      if (!paused) {
        posRef.current += speed;
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) {
          posRef.current = 0;
        }
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
    <section className="py-24 md:py-32 bg-[#080c16] overflow-hidden">
      {/* Heading */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4DD4C4]/20 bg-[#4DD4C4]/5 mb-6">
            <Star className="w-3.5 h-3.5 text-[#4DD4C4] fill-[#4DD4C4]" />
            <span className="text-xs font-medium text-[#4DD4C4] tracking-wide uppercase">Real Reviews</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Loved by data professionals
          </h2>
          <p className="text-base md:text-lg text-zinc-500 max-w-xl mx-auto">
            See what practitioners are saying after building a daily practice habit
          </p>
        </div>
      </div>

      {/* Carousel */}
      <div
        className="relative w-full"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#080c16] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#080c16] to-transparent z-10 pointer-events-none" />

        {/* Track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex will-change-transform py-4"
            style={{ width: "max-content" }}
          >
            {DOUBLED.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
