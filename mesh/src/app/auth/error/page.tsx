import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Link expired" };

export default function AuthErrorPage() {
  return (
    <AuthShell title="That link didn't work" description="Confirmation links expire and can only be used once.">
      <div className="grid gap-3">
        <Button asChild size="lg">
          <Link href="/login">Go to sign in</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/signup">Create a new account</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
