import Link from "next/link";
import { FolderPlus, Inbox, Plus } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { requireOnboarded } from "@/lib/auth";
import { getMyProjects, getRequests } from "@/lib/data";
import { Flash } from "@/components/layout/flash";

export const metadata = { title: "My projects" };

export default async function MyProjectsPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const { user, profile } = await requireOnboarded();
  const [projects, requests, sp] = await Promise.all([
    getMyProjects(user.id),
    getRequests({ ownerId: user.id }),
    searchParams,
  ]);

  const counts = new Map<string, { pending: number; matched: number }>();
  for (const r of requests) {
    const c = counts.get(r.project_id) ?? { pending: 0, matched: 0 };
    if (r.status === "pending") c.pending++;
    if (r.status === "accepted") c.matched++;
    counts.set(r.project_id, c);
  }

  return (
    <>
      {sp.deleted && <Flash message="Project deleted." />}
      <PageHeader
        title="My projects"
        description="Projects you own and the people who want in."
        action={
          projects.length > 0 && (
            <Button asChild>
              <Link href="/projects/new">
                <Plus /> New project
              </Link>
            </Button>
          )
        }
      />
      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderPlus />}
          title="You haven't posted a project yet"
          description="Describe the problem, your solution and who you need. It takes about three minutes."
          action={
            <Button asChild>
              <Link href="/projects/new">
                <Plus /> Post your first project
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const c = counts.get(p.id) ?? { pending: 0, matched: 0 };
            return (
              <ProjectCard
                key={p.id}
                project={p}
                owner={profile}
                footer={
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Inbox className="size-4" />
                      {c.pending > 0 ? (
                        <span className="font-medium text-primary">{c.pending} pending</span>
                      ) : (
                        "No pending requests"
                      )}
                    </span>
                    <span className="text-muted-foreground">{c.matched} matched</span>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </>
  );
}
