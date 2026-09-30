"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
    const pathname = usePathname();
    
    // Hide footer on practice editor, admin, auth, and profile pages
    const hideFooter = pathname.startsWith("/practice/daily") || pathname.startsWith("/profile") || pathname.startsWith("/admin") || pathname === "/login" || pathname === "/signup";
    
    if (hideFooter) {
        return null;
    }
    
    // Apply landing-light scope so footer inherits identical --ls-* tokens and styling
    return (
        <div className="landing-light">
            <Footer />
        </div>
    );
}
