import Link from "next/link";
import { Plus } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { DesktopNav, MobileNav } from "@/components/layout/nav";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { requireOnboarded } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireOnboarded();
  const supabase = await createClient();
  const { count } = await supabase
    .from("match_requests")
    .select("id", { count: "exact", head: true })
    .eq("project_owner_id", user.id)
    .eq("status", "pending");
  const pending = count ?? 0;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Logo href="/discover" />
            <DesktopNav pendingRequests={pending} />
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/projects/new">
                <Plus /> New project
              </Link>
            </Button>
            <Button asChild size="icon" variant="secondary" className="size-9 sm:hidden" aria-label="New project">
              <Link href="/projects/new">
                <Plus />
              </Link>
            </Button>
            <Link
              href="/profile"
              aria-label="Your profile"
              className="hidden rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 md:block"
            >
              <Avatar name={profile.full_name} seed={profile.id} className="size-9 text-xs" />
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 sm:px-6 sm:pt-10 md:pb-16">{children}</main>
      <MobileNav pendingRequests={pending} />
    </div>
  );
}
