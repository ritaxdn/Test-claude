import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function RootNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">The link may be broken or the page may have moved.</p>
      </div>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </main>
  );
}
