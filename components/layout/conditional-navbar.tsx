"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { StandaloneNavbar } from "../auth/standalone-navbar";
import { AnnouncementBanner } from "../landing/announcement-banner";

export function ConditionalNavbar() {
    const pathname = usePathname();
    const isLanding = pathname === "/";
    const isProblems = pathname.startsWith("/problems");
    const isLightPage = isLanding || isProblems || pathname.startsWith("/pricing");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (!isLightPage) return;
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isLightPage]);

    // Practice editor page has its own integrated top bar
    if (pathname.startsWith("/practice/daily")) return null;

    if (pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/admin") || pathname.startsWith("/onboarding")) return null;

    // Profile uses the auth-aware standalone navbar
    if (pathname.startsWith("/profile")) return <StandaloneNavbar />;

    // On landing page, problems page, and pricing page: announcement banner + nav both sticky as one unit
    if (isLanding || isProblems || pathname.startsWith("/pricing")) {
        return (
            <div
                className="landing-light sticky top-0 z-50"
                style={{ isolation: "isolate" }}
            >
                <AnnouncementBanner scrolled={scrolled} />
                <Navbar />
            </div>
        );
    }

    return <Navbar />;
}


