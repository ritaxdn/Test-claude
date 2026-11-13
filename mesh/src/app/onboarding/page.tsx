import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { ProfileForm } from "@/components/profile/profile-form";
import { getProfile, getUser } from "@/lib/auth";
import { signOut } from "@/lib/actions/auth";

export const metadata = { title: "Set up your profile" };

export default async function OnboardingPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  const profile = await getProfile();
  if (!profile) {
    // The auth trigger should always create a profile; surface a clear error if it didn't.
    throw new Error("Your profile could not be loaded. Make sure the MESH migration has been applied.");
  }
  if (profile.onboarded) redirect("/profile");

  return (
    <main className="relative min-h-dvh px-4 pt-6 pb-16">
      <div aria-hidden className="mesh-glow pointer-events-none absolute inset-x-0 top-0 h-[360px]" />
      <div className="relative mx-auto max-w-xl">
        <div className="mb-10 flex items-center justify-between">
          <Logo href="/onboarding" />
          <form action={signOut}>
            <button className="text-sm text-muted-foreground hover:text-foreground">Sign out</button>
          </form>
        </div>
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-[0_24px_60px_-24px_oklch(0.3_0.1_293/0.25)] sm:p-8">
          <ProfileForm profile={profile} mode="onboarding" />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Signed in as {user.email}. Your email is never shown to other members.
        </p>
      </div>
    </main>
  );
}
