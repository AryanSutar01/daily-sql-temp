"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { AnnouncementBanner } from "../landing/announcement-banner";

export function ConditionalNavbar() {
    const pathname = usePathname();
    const isLanding = pathname === "/";
    const isProblems = pathname.startsWith("/problems");
    const isPricing = pathname.startsWith("/pricing");
    const showAnnouncement = isLanding || isProblems || isPricing;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Practice editor page has its own integrated top bar
    if (pathname.startsWith("/practice/daily")) return null;

    // Login, signup, admin, onboarding have their own layouts or no global navbar
    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/onboarding")
    ) {
        return null;
    }

    return (
        <div
            className="landing-light sticky top-0 z-50"
            style={{ isolation: "isolate" }}
        >
            {showAnnouncement && <AnnouncementBanner scrolled={scrolled} />}
            <Navbar />
        </div>
    );
}


