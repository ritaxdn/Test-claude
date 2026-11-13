import Link from "next/link";
import { MapPin, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RespondButtons } from "@/components/requests/request-buttons";
import { AVAILABILITY, COMMITMENT, ROLES, labelOf } from "@/lib/constants";
import type { MatchRequest, Project, PublicProfile } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function StatusBadge({ status }: { status: MatchRequest["status"] }) {
  if (status === "accepted") return <Badge variant="success">Matched</Badge>;
  if (status === "rejected") return <Badge variant="muted">Declined</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

/** An incoming request, as seen by the project owner. */
export function IncomingRequest({
  request,
  sender,
  project,
}: {
  request: MatchRequest;
  sender?: PublicProfile;
  project?: Project;
}) {
  return (
    <li className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5">
      <div className="flex items-start gap-3.5">
        <Avatar name={sender?.full_name} seed={request.sender_id} className="size-11" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="font-semibold">{sender?.full_name || "MESH member"}</p>
            {sender?.roles.map((r) => (
              <Badge key={r} variant="default" className="py-0 text-[11px]">
                {labelOf(ROLES, r)}
              </Badge>
            ))}
          </div>
          {sender?.headline && <p className="mt-0.5 text-sm text-muted-foreground">{sender.headline}</p>}
          <p className="mt-1 text-xs text-muted-foreground">
            {project ? (
              <>
                Interested in{" "}
                <Link href={`/projects/${project.id}`} className="font-medium text-foreground hover:underline">
                  {project.title}
                </Link>{" "}
                ·{" "}
              </>
            ) : null}
            {timeAgo(request.created_at)}
          </p>
        </div>
        <div className="hidden sm:block">
          <StatusBadge status={request.status} />
        </div>
      </div>

      {request.note && (
        <blockquote className="mt-4 rounded-xl bg-muted/70 px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-foreground/85">
          {request.note}
        </blockquote>
      )}

      {sender && (
        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          {sender.availability && (
            <div>
              <dt className="inline">Availability: </dt>
              <dd className="inline font-medium text-foreground/80">{labelOf(AVAILABILITY, sender.availability)}</dd>
            </div>
          )}
          {sender.commitment && (
            <div>
              <dt className="inline">Commitment: </dt>
              <dd className="inline font-medium text-foreground/80">{labelOf(COMMITMENT, sender.commitment)}</dd>
            </div>
          )}
          {sender.location && (
            <div className="flex items-center gap-1">
              <MapPin className="size-3" />
              <dd>{sender.location}</dd>
            </div>
          )}
        </dl>
      )}
      {sender && sender.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sender.skills.slice(0, 8).map((s) => (
            <span key={s} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
        <div className="sm:hidden">
          <StatusBadge status={request.status} />
        </div>
        <div className="ml-auto">
          {request.status === "pending" && <RespondButtons requestId={request.id} />}
          {request.status === "accepted" && (
            <Button asChild size="sm" variant="secondary">
              <Link href={`/matches/${request.id}`}>
                <MessageSquare /> Message
              </Link>
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
