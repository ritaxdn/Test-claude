"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { formToObject, profileSchema } from "@/lib/validation";
import type { ActionResult } from "@/lib/types";

export async function saveProfile(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Your session expired. Please sign in again." };

  const parsed = profileSchema.safeParse(formToObject(formData, ["roles", "interests", "skills"]));
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed.data, onboarded: true })
    .eq("id", user.id);
  if (error) return { ok: false, error: "We couldn't save your profile. Please try again." };

  revalidatePath("/", "layout");
  if (formData.get("mode") === "onboarding") redirect("/discover?welcome=1");
  return { ok: true, message: "Profile saved." };
}
