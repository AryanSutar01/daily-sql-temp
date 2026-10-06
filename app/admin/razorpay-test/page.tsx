import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RazorpayTestClient from "./RazorpayTestClient";

// Read at request time so the page can be switched on/off per environment without a rebuild.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Not Found",
    robots: { index: false, follow: false },
};

export default function RazorpayTestPage() {
    if (process.env.RAZORPAY_HARNESS_PAGE !== "1") notFound();
    return <RazorpayTestClient />;
}
