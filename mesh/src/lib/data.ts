import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { MatchRequest, Message, Project, PublicProfile } from "@/lib/types";

const PROFILE_COLUMNS = "id, full_name, headline, roles, skills, location, availability, commitment, bio, interests";

export async function getProfilesByIds(ids: (string | null | undefined)[]) {
  const unique = Array.from(new Set(ids.filter((x): x is string => Boolean(x))));
  if (unique.length === 0) return new Map<string, PublicProfile>();
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select(PROFILE_COLUMNS).in("id", unique);
  if (error) throw error;
  return new Map((data as PublicProfile[]).map((p) => [p.id, p]));
}

export async function getProject(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error && error.code !== "22P02") throw error; // 22P02 = invalid uuid → treat as not found
  return (data as Project | null) ?? null;
}

export type DiscoverFilters = { industry?: string; stage?: string; role?: string; location?: string };

export async function discoverProjects(filters: DiscoverFilters, limit = 24, offset = 0) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("discover_projects", {
    p_industry: filters.industry || null,
    p_stage: filters.stage || null,
    p_role: filters.role || null,
    p_location: filters.location?.trim() || null,
    p_limit: limit,
    p_offset: offset,
  });
  if (error) throw error;
  return data as Project[];
}

export async function getMyProjects(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Project[];
}

/** Requests where the current user is sender or project owner (RLS-scoped). */
export async function getRequests(filter: { ownerId?: string; senderId?: string; projectId?: string; status?: string }) {
  const supabase = await createClient();
  let q = supabase.from("match_requests").select("*").order("created_at", { ascending: false });
  if (filter.ownerId) q = q.eq("project_owner_id", filter.ownerId);
  if (filter.senderId) q = q.eq("sender_id", filter.senderId);
  if (filter.projectId) q = q.eq("project_id", filter.projectId);
  if (filter.status) q = q.eq("status", filter.status);
  const { data, error } = await q;
  if (error) throw error;
  return data as MatchRequest[];
}

export async function getProjectsByIds(ids: string[]) {
  const unique = Array.from(new Set(ids));
  if (unique.length === 0) return new Map<string, Project>();
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").in("id", unique);
  if (error) throw error;
  return new Map((data as Project[]).map((p) => [p.id, p]));
}

export async function getMatch(matchId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("match_requests")
    .select("*")
    .eq("id", matchId)
    .eq("status", "accepted")
    .maybeSingle();
  if (error && error.code !== "22P02") throw error;
  return (data as MatchRequest | null) ?? null;
}

export async function getMessages(matchId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true })
    .limit(500);
  if (error) throw error;
  return data as Message[];
}

export async function getLastMessages(matchIds: string[]) {
  if (matchIds.length === 0) return new Map<string, Message>();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .in("match_id", matchIds)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  const map = new Map<string, Message>();
  for (const m of data as Message[]) if (!map.has(m.match_id)) map.set(m.match_id, m);
  return map;
}
