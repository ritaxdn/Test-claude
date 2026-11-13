import Link from "next/link";
import { EyeOff, MapPin, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { INDUSTRIES, NEEDED_ROLES, STAGES, labelOf } from "@/lib/constants";
import type { Project, PublicProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

const stageTone: Record<string, string> = {
  idea: "bg-sky-50 text-sky-700",
  prototype: "bg-indigo-50 text-indigo-700",
  mvp: "bg-violet-50 text-violet-700",
  early_revenue: "bg-emerald-50 text-emerald-700",
  scaling: "bg-fuchsia-50 text-fuchsia-700",
};

export function StageBadge({ stage }: { stage: string }) {
  return <Badge className={cn(stageTone[stage] ?? "bg-muted text-muted-foreground")}>{labelOf(STAGES, stage)}</Badge>;
}

export function DemoBadge() {
  return (
    <Badge variant="demo" title="Fictional example project seeded for demonstration">
      <Sparkles /> Fictional demo
    </Badge>
  );
}

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <StageBadge stage={project.stage} />
      <Badge variant="outline">{labelOf(INDUSTRIES, project.industry)}</Badge>
      {project.is_demo && <DemoBadge />}
      {project.visibility === "private" && (
        <Badge variant="muted">
          <EyeOff /> Private
        </Badge>
      )}
    </div>
  );
}

export function ProjectCard({
  project,
  owner,
  footer,
  className,
}: {
  project: Project;
  owner?: PublicProfile | null;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col rounded-3xl border border-border/80 bg-card shadow-[0_1px_2px_oklch(0.2_0.05_293/0.04),0_12px_32px_-18px_oklch(0.3_0.1_293/0.22)] transition-shadow hover:shadow-[0_1px_2px_oklch(0.2_0.05_293/0.04),0_18px_40px_-18px_oklch(0.3_0.1_293/0.32)]",
        project.is_demo && "border-dashed",
        className,
      )}
    >
      <Link
        href={`/projects/${project.id}`}
        className="flex flex-1 flex-col gap-4 rounded-t-3xl p-5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:p-6"
      >
        <ProjectMeta project={project} />
        <div>
          <h3 className="text-lg leading-snug font-semibold tracking-tight group-hover:text-primary">{project.title}</h3>
          {project.tagline && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.tagline}</p>}
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-foreground/80">{project.problem}</p>
        <div className="mt-auto grid gap-3">
          <div>
            <p className="mb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Looking for</p>
            <div className="flex flex-wrap gap-1.5">
              {project.roles_needed.slice(0, 4).map((r) => (
                <span key={r} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {labelOf(NEEDED_ROLES, r)}
                </span>
              ))}
              {project.roles_needed.length > 4 && (
                <span className="px-1 py-0.5 text-xs text-muted-foreground">+{project.roles_needed.length - 4}</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            {owner ? (
              <span className="flex min-w-0 items-center gap-2">
                <Avatar name={owner.full_name} seed={owner.id} className="size-6 text-[10px] ring-1" />
                <span className="truncate">{owner.full_name}</span>
              </span>
            ) : project.is_demo ? (
              <span>Example listing</span>
            ) : (
              <span />
            )}
            {project.location && (
              <span className="flex shrink-0 items-center gap-1">
                <MapPin className="size-3.5" />
                <span className="max-w-[10rem] truncate">{project.location}</span>
              </span>
            )}
          </div>
        </div>
      </Link>
      {footer && <div className="border-t border-border/70 px-4 py-3 sm:px-5">{footer}</div>}
    </article>
  );
}
