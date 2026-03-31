import { SignupForm } from "@/components/auth/signup-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
    return (
        <AuthLayout type="signup">
            <Suspense fallback={
                <div className="h-96 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4DD4C4]" />
                </div>
            }>
                <SignupForm />
            </Suspense>
        </AuthLayout>
    );
}
