import Link from "next/link";
import { Compass, Inbox, MessageSquare, Send } from "lucide-react";
import { IncomingRequest, StatusBadge } from "@/components/requests/request-item";
import { WithdrawButton } from "@/components/requests/request-buttons";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { requireOnboarded } from "@/lib/auth";
import { getProfilesByIds, getProjectsByIds, getRequests } from "@/lib/data";
import { cn, timeAgo } from "@/lib/utils";

export const metadata = { title: "Requests" };

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { user } = await requireOnboarded();
  const tab = (await searchParams).tab === "sent" ? "sent" : "incoming";

  const [incoming, sent] = await Promise.all([getRequests({ ownerId: user.id }), getRequests({ senderId: user.id })]);
  const list = tab === "incoming" ? incoming : sent;
  const [projects, profiles] = await Promise.all([
    getProjectsByIds(list.map((r) => r.project_id)),
    getProfilesByIds(list.map((r) => (tab === "incoming" ? r.sender_id : r.project_owner_id))),
  ]);
  const ordered = [...list.filter((r) => r.status === "pending"), ...list.filter((r) => r.status !== "pending")];
  const pendingIncoming = incoming.filter((r) => r.status === "pending").length;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Requests" description="Decide who joins your projects, and track the ones you've asked to join." />

      <div role="tablist" className="mb-6 inline-flex rounded-full border border-border bg-card p-1">
        {[
          { key: "incoming", label: "Incoming", icon: Inbox, count: pendingIncoming },
          { key: "sent", label: "Sent", icon: Send, count: 0 },
        ].map(({ key, label, icon: Icon, count }) => (
          <Link
            key={key}
            role="tab"
            aria-selected={tab === key}
            href={key === "incoming" ? "/requests" : "/requests?tab=sent"}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors",
              tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" /> {label}
            {count > 0 && (
              <span className={cn("rounded-full px-1.5 text-[11px]", tab === key ? "bg-white/25" : "bg-accent text-accent-foreground")}>
                {count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {ordered.length === 0 ? (
        tab === "incoming" ? (
          <EmptyState
            icon={<Inbox />}
            title="No incoming requests"
            description="When people tap Interested on your public projects, they'll appear here for you to accept or decline."
            action={
              <Button asChild variant="outline">
                <Link href="/projects">View my projects</Link>
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Send />}
            title="You haven't sent any requests"
            description="Find a project you'd like to help build and tap Interested."
            action={
              <Button asChild>
                <Link href="/discover">
                  <Compass /> Discover projects
                </Link>
              </Button>
            }
          />
        )
      ) : tab === "incoming" ? (
        <ul className="grid gap-3">
          {ordered.map((r) => (
            <IncomingRequest key={r.id} request={r} sender={profiles.get(r.sender_id)} project={projects.get(r.project_id)} />
          ))}
        </ul>
      ) : (
        <ul className="grid gap-3">
          {ordered.map((r) => {
            const project = projects.get(r.project_id);
            const owner = profiles.get(r.project_owner_id);
            return (
              <li key={r.id} className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={r.status} />
                    <span className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
                  </div>
                  {project ? (
                    <Link href={`/projects/${project.id}`} className="mt-1.5 block truncate font-semibold hover:text-primary">
                      {project.title}
                    </Link>
                  ) : (
                    <p className="mt-1.5 font-semibold text-muted-foreground">Project no longer visible</p>
                  )}
                  {owner && <p className="text-xs text-muted-foreground">by {owner.full_name}</p>}
                </div>
                <div className="flex shrink-0 justify-end">
                  {r.status === "pending" && <WithdrawButton requestId={r.id} />}
                  {r.status === "accepted" && (
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/matches/${r.id}`}>
                        <MessageSquare /> Message
                      </Link>
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
