import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Check your email" };

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return (
    <AuthShell
      title="Check your inbox"
      description={
        <>
          We sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{email ?? "your email"}</span>. Open it on this device to finish
          setting up your profile.
        </>
      }
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <MailCheck className="size-6" />
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
