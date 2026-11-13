import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/** The verified current user (checked against Supabase Auth), or null. */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (data as Profile | null) ?? null;
});

/** For pages: signed-in and onboarded, otherwise redirect. */
export async function requireOnboarded() {
  const user = await getUser();
  if (!user) redirect("/login");
  const profile = await getProfile();
  if (!profile?.onboarded) redirect("/onboarding");
  return { user, profile };
}

/** Safe in-app redirect target (prevents open redirects). */
export function safeNext(next: string | null | undefined, fallback = "/discover") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
