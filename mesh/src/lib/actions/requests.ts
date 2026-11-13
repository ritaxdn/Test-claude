"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { messageSchema, noteSchema, uuid } from "@/lib/validation";
import type { ActionResult, Message } from "@/lib/types";

const SESSION_EXPIRED = { ok: false as const, error: "Your session expired. Please sign in again." };
const isUuid = (v: string) => uuid.safeParse(v).success;

/** "Interested": create a pending request for a project. */
export async function expressInterest(projectId: string, rawNote: string | null): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return SESSION_EXPIRED;
  if (!isUuid(projectId)) return { ok: false, error: "Unknown project." };
  const note = noteSchema.safeParse(rawNote ?? "");
  if (!note.success) return { ok: false, error: "Notes are limited to 500 characters." };

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id, owner_id, is_demo, visibility")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) return { ok: false, error: "This project is no longer available." };
  if (project.is_demo) return { ok: false, error: "This is a fictional demo project — it can't receive requests." };
  if (project.owner_id === user.id) return { ok: false, error: "You can't request to join your own project." };
  if (project.visibility !== "public") return { ok: false, error: "This project isn't accepting new requests." };

  const { error } = await supabase.from("match_requests").insert({ project_id: projectId, note: note.data });
  if (error) {
    if (error.code === "23505") return { ok: false, error: "You've already sent a request for this project." };
    return { ok: false, error: "We couldn't send your request. Please try again." };
  }

  // A previous "pass" no longer applies once you're interested.
  await supabase.from("passes").delete().eq("project_id", projectId).eq("user_id", user.id);

  revalidatePath("/discover");
  revalidatePath("/requests");
  revalidatePath(`/projects/${projectId}`);
  return { ok: true, message: "Request sent. You'll be able to chat if the owner accepts." };
}

/** "Pass": hide a project from your Discover feed. */
export async function passProject(projectId: string): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return SESSION_EXPIRED;
  if (!isUuid(projectId)) return { ok: false, error: "Unknown project." };

  const supabase = await createClient();
  const { error } = await supabase.from("passes").insert({ project_id: projectId });
  if (error && error.code !== "23505") {
    return { ok: false, error: "We couldn't hide this project. Please try again." };
  }
  revalidatePath("/discover");
  return { ok: true };
}

export async function undoPass(projectId: string): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return SESSION_EXPIRED;
  if (!isUuid(projectId)) return { ok: false, error: "Unknown project." };

  const supabase = await createClient();
  const { error } = await supabase.from("passes").delete().eq("project_id", projectId).eq("user_id", user.id);
  if (error) return { ok: false, error: "We couldn't undo that. Please try again." };
  revalidatePath("/discover");
  return { ok: true };
}

/** Owner accepts or rejects a pending request. Accepting creates the match. */
export async function respondToRequest(
  requestId: string,
  decision: "accepted" | "rejected",
): Promise<ActionResult<{ matchId: string }>> {
  const user = await getUser();
  if (!user) return SESSION_EXPIRED;
  if (!isUuid(requestId) || !["accepted", "rejected"].includes(decision)) {
    return { ok: false, error: "Invalid request." };
  }

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("match_requests")
    .select("id, project_id, project_owner_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (!request || request.project_owner_id !== user.id) {
    return { ok: false, error: "Only the project owner can respond to this request." };
  }
  if (request.status !== "pending") return { ok: false, error: "This request has already been answered." };

  const { data: updated, error } = await supabase
    .from("match_requests")
    .update({ status: decision })
    .eq("id", requestId)
    .eq("project_owner_id", user.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();
  if (error || !updated) return { ok: false, error: "We couldn't update this request. Please try again." };

  revalidatePath("/requests");
  revalidatePath("/matches");
  revalidatePath(`/projects/${request.project_id}`);
  revalidatePath("/", "layout"); // nav badge
  return decision === "accepted"
    ? { ok: true, data: { matchId: updated.id }, message: "It's a match — you can now message each other." }
    : { ok: true, message: "Request declined." };
}

/** Sender withdraws a request that hasn't been answered yet. */
export async function withdrawRequest(requestId: string): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return SESSION_EXPIRED;
  if (!isUuid(requestId)) return { ok: false, error: "Invalid request." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("match_requests")
    .delete()
    .eq("id", requestId)
    .eq("sender_id", user.id)
    .eq("status", "pending")
    .select("id, project_id");
  if (error || !data?.length) return { ok: false, error: "This request can no longer be withdrawn." };

  revalidatePath("/requests");
  revalidatePath("/discover");
  revalidatePath(`/projects/${data[0].project_id}`);
  return { ok: true, message: "Request withdrawn." };
}

/** Send a text message inside an accepted match. */
export async function sendMessage(matchId: string, rawBody: string): Promise<ActionResult<Message>> {
  const user = await getUser();
  if (!user) return SESSION_EXPIRED;
  if (!isUuid(matchId)) return { ok: false, error: "Unknown conversation." };
  const body = messageSchema.safeParse(rawBody);
  if (!body.success) return { ok: false, error: body.error.issues[0]?.message ?? "Invalid message." };

  const supabase = await createClient();
  const { data: match } = await supabase
    .from("match_requests")
    .select("id, sender_id, project_owner_id, status")
    .eq("id", matchId)
    .maybeSingle();
  if (!match || match.status !== "accepted" || ![match.sender_id, match.project_owner_id].includes(user.id)) {
    return { ok: false, error: "You can only message people you've matched with." };
  }

  const { data: message, error } = await supabase
    .from("messages")
    .insert({ match_id: matchId, body: body.data })
    .select("*")
    .single();
  if (error || !message) return { ok: false, error: "Message not sent. Please try again." };

  revalidatePath("/matches");
  return { ok: true, data: message as Message };
}
