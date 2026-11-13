import Link from "next/link";
import { Compass, MessagesSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { requireOnboarded } from "@/lib/auth";
import { getLastMessages, getProfilesByIds, getProjectsByIds } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { MatchRequest } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Matches" };

export default async function MatchesPage() {
  const { user } = await requireOnboarded();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("match_requests")
    .select("*")
    .eq("status", "accepted")
    .or(`sender_id.eq.${user.id},project_owner_id.eq.${user.id}`)
    .order("responded_at", { ascending: false });
  if (error) throw error;
  const matches = data as MatchRequest[];

  const otherId = (m: MatchRequest) => (m.sender_id === user.id ? m.project_owner_id : m.sender_id);
  const [profiles, projects, last] = await Promise.all([
    getProfilesByIds(matches.map(otherId)),
    getProjectsByIds(matches.map((m) => m.project_id)),
    getLastMessages(matches.map((m) => m.id)),
  ]);

  const sorted = [...matches].sort((a, b) => {
    const ta = last.get(a.id)?.created_at ?? a.responded_at ?? a.created_at;
    const tb = last.get(b.id)?.created_at ?? b.responded_at ?? b.created_at;
    return tb.localeCompare(ta);
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Matches" description="People who said yes — and you said yes back." />
      {sorted.length === 0 ? (
        <EmptyState
          icon={<MessagesSquare />}
          title="No matches yet"
          description="A match happens when a project owner accepts a request. Send a few requests, or check your incoming ones."
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href="/discover">
                  <Compass /> Discover projects
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/requests">Review requests</Link>
              </Button>
            </div>
          }
        />
      ) : (
        <ul className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/80 bg-card">
          {sorted.map((m) => {
            const other = profiles.get(otherId(m));
            const project = projects.get(m.project_id);
            const msg = last.get(m.id);
            return (
              <li key={m.id}>
                <Link
                  href={`/matches/${m.id}`}
                  className="flex items-center gap-3.5 px-4 py-4 transition-colors hover:bg-muted/60 sm:px-5"
                >
                  <Avatar name={other?.full_name} seed={otherId(m)} className="size-12" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate font-semibold">{other?.full_name ?? "MESH member"}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {timeAgo(msg?.created_at ?? m.responded_at ?? m.created_at)}
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Badge variant={m.project_owner_id === user.id ? "default" : "outline"} className="py-0 text-[10px]">
                        {m.project_owner_id === user.id ? "Your project" : "Joined"}
                      </Badge>
                      <span className="truncate">{project?.title ?? "Project"}</span>
                    </p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {msg ? (
                        <>
                          {msg.sender_id === user.id && <span className="text-foreground/70">You: </span>}
                          {msg.body}
                        </>
                      ) : (
                        <span className="text-primary">New match — say hello 👋</span>
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
