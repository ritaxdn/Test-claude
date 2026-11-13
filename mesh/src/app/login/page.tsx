import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { safeNext } from "@/lib/auth";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to see who's building what."
      footer={
        <>
          New to MESH?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm mode="signin" next={safeNext(next)} />
    </AuthShell>
  );
}
