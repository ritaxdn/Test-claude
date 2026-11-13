import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ChatThread } from "@/components/messages/chat-thread";
import { Avatar } from "@/components/ui/avatar";
import { requireOnboarded } from "@/lib/auth";
import { getMatch, getMessages, getProfilesByIds, getProject } from "@/lib/data";

export const metadata = { title: "Conversation" };

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireOnboarded();
  const { id } = await params;

  // RLS only returns accepted matches the user participates in; double-check server-side.
  const match = await getMatch(id);
  if (!match || ![match.sender_id, match.project_owner_id].includes(user.id)) notFound();

  const otherId = match.sender_id === user.id ? match.project_owner_id : match.sender_id;
  const [messages, profiles, project] = await Promise.all([
    getMessages(match.id),
    getProfilesByIds([otherId]),
    getProject(match.project_id),
  ]);
  const other = profiles.get(otherId);
  const otherName = other?.full_name || "your match";

  return (
    <div className="-mx-4 -mt-6 flex h-[calc(100dvh-4rem-4.5rem)] flex-col sm:mx-auto sm:mt-0 sm:h-[calc(100dvh-4rem-5rem)] sm:max-w-3xl sm:overflow-hidden sm:rounded-3xl sm:border sm:border-border/80 sm:bg-muted/30 md:h-[calc(100dvh-4rem-6.5rem)]">
      <header className="flex items-center gap-3 border-b border-border/70 bg-card px-4 py-3 sm:px-5">
        <Link href="/matches" aria-label="Back to matches" className="-ml-1 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        <Avatar name={other?.full_name} seed={otherId} className="size-10" />
        <div className="min-w-0">
          <p className="truncate font-semibold">{otherName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {project ? (
              <Link href={`/projects/${project.id}`} className="hover:underline">
                {project.title}
              </Link>
            ) : (
              other?.headline
            )}
          </p>
        </div>
      </header>
      <ChatThread matchId={match.id} userId={user.id} otherName={otherName.split(" ")[0]} initialMessages={messages} />
    </div>
  );
}
