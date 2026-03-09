import { SignupForm } from "@/components/auth/signup-form";
import { StandaloneNavbar } from "@/components/auth/standalone-navbar";

export default function SignupPage() {
    return (
        <div className="fixed inset-0 top-0 z-[100] bg-[#080c16] flex flex-col overflow-y-auto w-full min-h-screen">
            <StandaloneNavbar />
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative w-full py-16">
                {/* Ambient background glows matching landing */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0 overflow-hidden">
                    <div className="absolute left-0 top-1/4 w-[400px] h-[400px] bg-[#30B5A6]/10 rounded-full blur-[100px]" />
                    <div className="absolute right-0 bottom-1/4 w-[400px] h-[400px] bg-[#eab308]/5 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-md w-full space-y-8 relative z-10">
                    <div className="p-8 sm:p-10 rounded-2xl border border-[#202736] bg-[#131924] shadow-2xl backdrop-blur-sm">
                        <SignupForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
