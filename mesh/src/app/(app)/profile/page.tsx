import { LogOut } from "lucide-react";
import { ProfileForm } from "@/components/profile/profile-form";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/misc";
import { requireOnboarded } from "@/lib/auth";
import { signOut } from "@/lib/actions/auth";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { user, profile } = await requireOnboarded();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" description="This is what project owners see when you reach out." />
      <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={profile.full_name} seed={profile.id} className="size-12" />
          <div className="min-w-0">
            <p className="truncate font-semibold">{profile.full_name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email} · only visible to you</p>
          </div>
        </div>
        <form action={signOut}>
          <Button variant="outline" size="sm" type="submit">
            <LogOut /> Sign out
          </Button>
        </form>
      </div>
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8">
        <ProfileForm profile={profile} mode="edit" />
      </div>
    </div>
  );
}
