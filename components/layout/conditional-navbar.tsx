"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { StandaloneNavbar } from "../auth/standalone-navbar";

export function ConditionalNavbar() {
    const pathname = usePathname();
    
    // Pages that should use the profile-centric navbar
    const useStandalone = pathname.startsWith("/practice") || pathname.startsWith("/profile");
    
    if (useStandalone) {
        return <StandaloneNavbar />;
    }
    
    return <Navbar />;
}
