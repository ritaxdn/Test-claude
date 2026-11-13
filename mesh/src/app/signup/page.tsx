import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Join MESH"
      description="Meet the founders, builders and investors you've been looking for."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
