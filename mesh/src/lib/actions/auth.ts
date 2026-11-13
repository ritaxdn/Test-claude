"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth";
import { siteUrl } from "@/lib/env";
import type { ActionResult } from "@/lib/types";

const credentials = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters.").max(72, "Use at most 72 characters."),
});

export async function signUp(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = credentials.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { emailRedirectTo: `${siteUrl()}/auth/confirm?next=/onboarding` },
  });
  if (error) return { ok: false, error: error.message };

  // If email confirmation is disabled in Supabase, a session exists right away.
  if (data.session) redirect("/onboarding");
  redirect(`/check-email?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function signIn(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = credentials
    .extend({ password: z.string().min(1, "Enter your password.") })
    .safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    const msg = /confirm/i.test(error.message)
      ? "Please confirm your email first — check your inbox for the link."
      : "Incorrect email or password.";
    return { ok: false, error: msg };
  }
  redirect(safeNext(formData.get("next")?.toString()));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
