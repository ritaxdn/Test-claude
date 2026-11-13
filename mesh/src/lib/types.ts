// Row types mirroring supabase/migrations. Regenerate with `supabase gen types`
// if you prefer generated types; these are kept small and hand-written.

export type Profile = {
  id: string;
  full_name: string;
  headline: string | null;
  bio: string | null;
  roles: string[];
  interests: string[];
  skills: string[];
  location: string | null;
  availability: string | null;
  commitment: string | null;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  owner_id: string | null;
  is_demo: boolean;
  title: string;
  tagline: string | null;
  problem: string;
  solution: string;
  industry: string;
  stage: string;
  roles_needed: string[];
  traction: string | null;
  location: string | null;
  visibility: "public" | "private";
  created_at: string;
  updated_at: string;
};

export type RequestStatus = "pending" | "accepted" | "rejected";

export type MatchRequest = {
  id: string;
  project_id: string;
  sender_id: string;
  project_owner_id: string;
  note: string | null;
  status: RequestStatus;
  created_at: string;
  responded_at: string | null;
};

export type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type PublicProfile = Pick<
  Profile,
  "id" | "full_name" | "headline" | "roles" | "skills" | "location" | "availability" | "commitment" | "bio" | "interests"
>;

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };
