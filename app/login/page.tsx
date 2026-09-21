import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <AuthLayout type="login">
      <Suspense fallback={
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1f9e8e]" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
