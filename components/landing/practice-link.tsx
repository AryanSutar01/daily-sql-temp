"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { ArrowRight } from "lucide-react";

interface PracticeLinkProps {
    /** Text to display on the button */
    label?: string;
    /** Extra Tailwind classes to apply to the anchor */
    className?: string;
    /** Whether to render an arrow icon after the label */
    showArrow?: boolean;
}

/**
 * A smart CTA that sends logged-in users directly to /practice/daily
 * and unauthenticated visitors to /login.
 */
export function PracticeLink({
    label = "Start your daily practice",
    className = "",
    showArrow = false,
}: PracticeLinkProps) {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (isLoggedIn()) {
            router.push("/practice/daily");
        } else {
            router.push("/login");
        }
    };

    return (
        <a href="/practice/daily" onClick={handleClick} className={className}>
            {label}
            {showArrow && <ArrowRight className="w-4 h-4" />}
        </a>
    );
}
