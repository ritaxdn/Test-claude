"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { formToObject, projectSchema, uuid } from "@/lib/validation";
import type { ActionResult } from "@/lib/types";

const SESSION_EXPIRED = { ok: false as const, error: "Your session expired. Please sign in again." };

function parseProject(formData: FormData) {
  return projectSchema.safeParse(formToObject(formData, ["roles_needed"]));
}

/** Server-side ownership check (RLS enforces it too; this gives clear errors). */
async function assertOwner(projectId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("owner_id").eq("id", projectId).maybeSingle();
  return data?.owner_id === userId;
}

export async function createProject(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return SESSION_EXPIRED;

  const parsed = parseProject(formData);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed.data, owner_id: user.id })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "We couldn't create your project. Please try again." };

  revalidatePath("/projects");
  redirect(`/projects/${data.id}?created=1`);
}

export async function updateProject(
  projectId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return SESSION_EXPIRED;
  if (!uuid.safeParse(projectId).success) return { ok: false, error: "Unknown project." };
  if (!(await assertOwner(projectId, user.id))) return { ok: false, error: "Only the project owner can edit it." };

  const parsed = parseProject(formData);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update(parsed.data)
    .eq("id", projectId)
    .eq("owner_id", user.id);
  if (error) return { ok: false, error: "We couldn't save your changes. Please try again." };

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}?saved=1`);
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return SESSION_EXPIRED;
  if (!uuid.safeParse(projectId).success) return { ok: false, error: "Unknown project." };
  if (!(await assertOwner(projectId, user.id))) return { ok: false, error: "Only the project owner can delete it." };

  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("owner_id", user.id);
  if (error) return { ok: false, error: "We couldn't delete this project. Please try again." };

  revalidatePath("/projects");
  redirect("/projects?deleted=1");
}
