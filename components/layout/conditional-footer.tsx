"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
    const pathname = usePathname();
    
    // Hide footer on practice and profile pages
    const hideFooter = pathname.startsWith("/practice") || pathname.startsWith("/profile") || pathname.startsWith("/admin") || pathname === "/login" || pathname === "/signup";
    
    if (hideFooter) {
        return null;
    }
    
    return <Footer />;
}
