"use client";

import * as React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { InterestActions } from "@/components/discover/interest-actions";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import type { Project, PublicProfile } from "@/lib/types";

export function DiscoverGrid({
  projects,
  owners,
  filtered,
}: {
  projects: Project[];
  owners: Record<string, PublicProfile>;
  filtered: boolean;
}) {
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());
  // Reset local state when the server sends a new list (filters changed, refresh).
  const key = projects.map((p) => p.id).join(",");
  const [lastKey, setLastKey] = React.useState(key);
  if (key !== lastKey) {
    setLastKey(key);
    setHidden(new Set());
  }

  const visible = projects.filter((p) => !hidden.has(p.id));

  if (visible.length === 0) {
    return filtered ? (
      <EmptyState
        icon={<Compass />}
        title="No projects match these filters"
        description="Try a different sector, stage or role — or clear the filters."
        action={
          <Button asChild variant="outline">
            <Link href="/discover">Clear filters</Link>
          </Button>
        }
      />
    ) : (
      <EmptyState
        icon={<Compass />}
        title="You're all caught up"
        description="You've seen every project for now. New projects appear here as people publish them."
        action={
          <Button asChild>
            <Link href="/projects/new">Post your own project</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((p) => (
        <ProjectCard
          key={p.id}
          project={p}
          owner={p.owner_id ? owners[p.owner_id] : null}
          className="animate-in fade-in zoom-in-95 duration-300"
          footer={
            <InterestActions
              projectId={p.id}
              projectTitle={p.title}
              isDemo={p.is_demo}
              onResolved={(kind) =>
                setHidden((cur) => {
                  const next = new Set(cur);
                  if (kind === "restored") next.delete(p.id);
                  else next.add(p.id);
                  return next;
                })
              }
            />
          }
        />
      ))}
    </div>
  );
}
