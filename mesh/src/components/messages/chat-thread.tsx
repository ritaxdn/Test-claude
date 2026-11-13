"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { sendMessage } from "@/lib/actions/requests";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

type UiMessage = Message & { pending?: boolean };

const timeFmt = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" });
const dayFmt = new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric" });

export function ChatThread({
  matchId,
  userId,
  otherName,
  initialMessages,
}: {
  matchId: string;
  userId: string;
  otherName: string;
  initialMessages: Message[];
}) {
  const router = useRouter();
  // Server-rendered history + rows received live + optimistic sends, merged at render.
  const [live, setLive] = React.useState<Message[]>([]);
  const [pendingMsgs, setPendingMsgs] = React.useState<UiMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const messages = React.useMemo<UiMessage[]>(() => {
    const byId = new Map<string, Message>();
    for (const m of [...initialMessages, ...live]) byId.set(m.id, m);
    const confirmed = [...byId.values()].sort((a, b) => a.created_at.localeCompare(b.created_at));
    return [...confirmed, ...pendingMsgs];
  }, [initialMessages, live, pendingMsgs]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  // Realtime: new rows arrive via Postgres changes (RLS-filtered). Polling is a fallback.
  React.useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload: { new: Record<string, unknown> }) => {
          const row = payload.new as unknown as Message;
          setLive((cur) => (cur.some((m) => m.id === row.id) ? cur : [...cur, row]));
        },
      )
      .subscribe();
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 20000);
    return () => {
      clearInterval(poll);
      supabase.removeChannel(channel);
    };
  }, [matchId, router]);

  const submit = async () => {
    const body = draft.trim();
    if (!body || sending) return;
    const temp: UiMessage = {
      id: `tmp-${Date.now()}`,
      match_id: matchId,
      sender_id: userId,
      body,
      created_at: new Date().toISOString(),
      pending: true,
    };
    setPendingMsgs((cur) => [...cur, temp]);
    setDraft("");
    setSending(true);
    const res = await sendMessage(matchId, body);
    setSending(false);
    setPendingMsgs((cur) => cur.filter((m) => m.id !== temp.id));
    if (!res.ok) {
      setDraft(body);
      toast.error(res.error);
      return;
    }
    if (res.data) setLive((cur) => (cur.some((m) => m.id === res.data!.id) ? cur : [...cur, res.data!]));
    textareaRef.current?.focus();
  };

  const days = messages.map((m) => dayFmt.format(new Date(m.created_at)));
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6" aria-live="polite">
        {messages.length === 0 ? (
          <div className="mx-auto mt-10 max-w-xs text-center">
            <p className="text-sm font-medium">You matched with {otherName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Break the ice — introduce yourself and suggest a time to talk.
            </p>
          </div>
        ) : (
          <ol className="grid gap-1.5">
            {messages.map((m, i) => {
              const mine = m.sender_id === userId;
              const day = days[i];
              const showDay = i === 0 || day !== days[i - 1];
              const grouped = i > 0 && messages[i - 1].sender_id === m.sender_id && !showDay;
              return (
                <React.Fragment key={m.id}>
                  {showDay && (
                    <li className="my-3 text-center text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                      {day}
                    </li>
                  )}
                  <li className={cn("flex", mine ? "justify-end" : "justify-start", !grouped && "mt-2")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2 text-[15px] leading-relaxed break-words whitespace-pre-wrap sm:max-w-[70%] sm:text-sm",
                        mine
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md border border-border/70 bg-card text-foreground",
                        m.pending && "opacity-60",
                      )}
                    >
                      {m.body}
                      <span
                        className={cn(
                          "mt-0.5 block text-right text-[10px]",
                          mine ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        {m.pending ? "Sending…" : timeFmt.format(new Date(m.created_at))}
                      </span>
                    </div>
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        )}
        <div ref={endRef} />
      </div>

      <form
        className="border-t border-border/70 bg-card/95 p-3 backdrop-blur sm:p-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="flex items-end gap-2 rounded-3xl border border-input bg-background p-1.5 pl-4 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20">
          <label htmlFor="message" className="sr-only">
            Message {otherName}
          </label>
          <textarea
            ref={textareaRef}
            id="message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder={`Message ${otherName}…`}
            className="max-h-36 min-h-9 flex-1 resize-none bg-transparent py-2 text-[15px] outline-none placeholder:text-muted-foreground/70 sm:text-sm [field-sizing:content]"
          />
          <Button type="submit" size="icon" className="size-9" disabled={!draft.trim() || sending} aria-label="Send message">
            {sending ? <Loader2 className="animate-spin" /> : <ArrowUp />}
          </Button>
        </div>
      </form>
    </div>
  );
}
