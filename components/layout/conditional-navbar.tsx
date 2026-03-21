"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { StandaloneNavbar } from "../auth/standalone-navbar";

export function ConditionalNavbar() {
    const pathname = usePathname();

    // Practice page has its own integrated top bar
    if (pathname.startsWith("/practice")) return null;

    // Profile uses the auth-aware standalone navbar
    if (pathname.startsWith("/profile")) return <StandaloneNavbar />;

    return <Navbar />;
}
