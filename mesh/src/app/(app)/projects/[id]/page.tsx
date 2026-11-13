import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Inbox, MapPin, MessageSquare, Pencil, Sparkles, XCircle } from "lucide-react";
import { DemoBadge, ProjectMeta } from "@/components/projects/project-card";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { InterestActions } from "@/components/discover/interest-actions";
import { IncomingRequest } from "@/components/requests/request-item";
import { WithdrawButton } from "@/components/requests/request-buttons";
import { Flash } from "@/components/layout/flash";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { AVAILABILITY, COMMITMENT, NEEDED_ROLES, ROLES, labelOf } from "@/lib/constants";
import { requireOnboarded } from "@/lib/auth";
import { getProfilesByIds, getProject, getRequests } from "@/lib/data";
import { timeAgo } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const project = await getProject((await params).id);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
}) {
  const { user } = await requireOnboarded();
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const project = await getProject(id);
  if (!project) notFound();

  const isOwner = project.owner_id === user.id;
  const requests = isOwner
    ? await getRequests({ projectId: project.id })
    : await getRequests({ projectId: project.id, senderId: user.id });
  const profiles = await getProfilesByIds([project.owner_id, ...requests.map((r) => r.sender_id)]);
  const owner = project.owner_id ? profiles.get(project.owner_id) : undefined;
  const myRequest = isOwner ? undefined : requests[0];

  const pending = requests.filter((r) => r.status === "pending");
  const decided = requests.filter((r) => r.status !== "pending");

  return (
    <div className="mx-auto max-w-4xl">
      {sp.created && <Flash message="Project published." />}
      {sp.saved && <Flash message="Changes saved." />}

      <Link
        href={isOwner ? "/projects" : "/discover"}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {isOwner ? "My projects" : "Discover"}
      </Link>

      {project.is_demo && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-dashed border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
          <Sparkles className="mt-0.5 size-4 shrink-0" />
          <p>
            This is a <strong>fictional demo project</strong> included so you can explore MESH. It isn&apos;t run by a
            real person or company and can&apos;t receive requests.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <article className="rounded-3xl border border-border/80 bg-card p-6 shadow-[0_12px_32px_-18px_oklch(0.3_0.1_293/0.22)] sm:p-8">
          <ProjectMeta project={project} />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{project.title}</h1>
          {project.tagline && <p className="mt-2 text-base text-muted-foreground sm:text-lg">{project.tagline}</p>}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {project.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {project.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> Posted {timeAgo(project.created_at)}
            </span>
          </div>

          <div className="mt-8 grid gap-7">
            <Block title="Problem">{project.problem}</Block>
            <Block title="Solution">{project.solution}</Block>
            {project.traction && <Block title="Traction">{project.traction}</Block>}
            <section>
              <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Looking for</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.roles_needed.map((r) => (
                  <span key={r} className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
                    {labelOf(NEEDED_ROLES, r)}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </article>

        <aside className="grid content-start gap-4">
          {isOwner ? (
            <div className="rounded-3xl border border-border/80 bg-card p-5">
              <p className="text-sm font-medium">You own this project</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {project.visibility === "public"
                  ? "It's listed in Discover."
                  : "It's private: only you and your matches can see it, and it doesn't accept new requests."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/projects/${project.id}/edit`}>
                    <Pencil /> Edit
                  </Link>
                </Button>
                <DeleteProjectButton projectId={project.id} />
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border/80 bg-card p-5">
              <MyRequestPanel
                request={myRequest}
                project={project}
              />
            </div>
          )}

          {owner && (
            <div className="rounded-3xl border border-border/80 bg-card p-5">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {isOwner ? "Your public profile" : "Posted by"}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={owner.full_name} seed={owner.id} />
                <div className="min-w-0">
                  <p className="truncate font-medium">{owner.full_name}</p>
                  {owner.headline && <p className="truncate text-xs text-muted-foreground">{owner.headline}</p>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {owner.roles.map((r) => (
                  <Badge key={r}>{labelOf(ROLES, r)}</Badge>
                ))}
              </div>
              <dl className="mt-3 grid gap-1 text-xs text-muted-foreground">
                {owner.availability && <dd>{labelOf(AVAILABILITY, owner.availability)}</dd>}
                {owner.commitment && <dd>{labelOf(COMMITMENT, owner.commitment)}</dd>}
              </dl>
            </div>
          )}
          {project.is_demo && (
            <div className="rounded-3xl border border-dashed border-border bg-card p-5 text-xs text-muted-foreground">
              <DemoBadge />
              <p className="mt-2">Example listing — no owner.</p>
            </div>
          )}
        </aside>
      </div>

      {isOwner && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">
            Requests <span className="text-muted-foreground">({requests.length})</span>
          </h2>
          {requests.length === 0 ? (
            <EmptyState
              className="mt-4"
              icon={<Inbox />}
              title="No requests yet"
              description={
                project.visibility === "public"
                  ? "When someone taps Interested on this project, they'll show up here."
                  : "Private projects don't appear in Discover. Make it public to receive requests."
              }
            />
          ) : (
            <ul className="mt-4 grid gap-3">
              {[...pending, ...decided].map((r) => (
                <IncomingRequest key={r.id} request={r} sender={profiles.get(r.sender_id)} />
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h2>
      <p className="mt-2 leading-relaxed whitespace-pre-line text-foreground/90">{children}</p>
    </section>
  );
}

function MyRequestPanel({
  request,
  project,
}: {
  request?: Awaited<ReturnType<typeof getRequests>>[number];
  project: NonNullable<Awaited<ReturnType<typeof getProject>>>;
}) {
  if (request?.status === "accepted") {
    return (
      <>
        <Badge variant="success">You&apos;re matched</Badge>
        <p className="mt-2 text-sm text-muted-foreground">The owner accepted your request. Start the conversation.</p>
        <Button asChild className="mt-4 w-full">
          <Link href={`/matches/${request.id}`}>
            <MessageSquare /> Open chat
          </Link>
        </Button>
      </>
    );
  }
  if (request?.status === "pending") {
    return (
      <>
        <Badge variant="warning">Request pending</Badge>
        <p className="mt-2 text-sm text-muted-foreground">
          Sent {timeAgo(request.created_at)}. You&apos;ll be able to message once the owner accepts.
        </p>
        <div className="mt-3">
          <WithdrawButton requestId={request.id} />
        </div>
      </>
    );
  }
  if (request?.status === "rejected") {
    return (
      <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
        <XCircle className="mt-0.5 size-4 shrink-0" />
        <p>The owner decided this isn&apos;t the right fit for now. Keep exploring — there are more projects in Discover.</p>
      </div>
    );
  }
  return (
    <>
      <p className="text-sm font-medium">Want in?</p>
      <p className="mt-1 mb-4 text-xs text-muted-foreground">
        The owner sees your profile and note, then decides. Messaging opens after they accept.
      </p>
      <InterestActions projectId={project.id} projectTitle={project.title} isDemo={project.is_demo} size="default" />
    </>
  );
}
