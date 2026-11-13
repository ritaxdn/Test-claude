"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { expressInterest, passProject, undoPass } from "@/lib/actions/requests";
import { cn } from "@/lib/utils";

export function InterestActions({
  projectId,
  projectTitle,
  isDemo,
  onResolved,
  showPass = true,
  size = "default",
}: {
  projectId: string;
  projectTitle: string;
  isDemo?: boolean;
  onResolved?: (kind: "interested" | "passed" | "restored") => void;
  showPass?: boolean;
  size?: "default" | "lg";
}) {
  const router = useRouter();
  const [composing, setComposing] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [pending, start] = React.useTransition();
  const [busy, setBusy] = React.useState<"pass" | "interest" | null>(null);

  const pass = () => {
    setBusy("pass");
    start(async () => {
      const res = await passProject(projectId);
      setBusy(null);
      if (!res.ok) return void toast.error(res.error);
      onResolved?.("passed");
      if (!onResolved) router.push("/discover");
      toast(`Passed on ${projectTitle}`, {
        action: {
          label: "Undo",
          onClick: async () => {
            const undo = await undoPass(projectId);
            if (!undo.ok) return void toast.error(undo.error);
            onResolved?.("restored");
            router.refresh();
          },
        },
      });
    });
  };

  const send = () => {
    setBusy("interest");
    start(async () => {
      const res = await expressInterest(projectId, note);
      setBusy(null);
      if (!res.ok) return void toast.error(res.error);
      toast.success(res.message);
      setComposing(false);
      setNote("");
      if (onResolved) onResolved("interested");
      else router.refresh();
    });
  };

  if (isDemo) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Fictional demo listing — requests are disabled.
        {showPass && (
          <button onClick={pass} disabled={pending} className="ml-1 font-medium text-foreground underline-offset-2 hover:underline">
            Hide it
          </button>
        )}
      </p>
    );
  }

  if (composing) {
    return (
      <div className="grid gap-2.5">
        <label htmlFor={`note-${projectId}`} className="text-xs font-medium text-muted-foreground">
          Add a short note (optional)
        </label>
        <Textarea
          id={`note-${projectId}`}
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Why this project, and what you'd bring…"
          className="min-h-20 text-sm"
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground tabular-nums">{note.length}/500</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setComposing(false)} disabled={pending}>
              Cancel
            </Button>
            <Button size="sm" onClick={send} loading={busy === "interest"}>
              Send request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const btn = size === "lg" ? "lg" : "sm";
  return (
    <div className={cn("grid gap-2", showPass ? "grid-cols-2" : "grid-cols-1")}>
      {showPass && (
        <Button variant="outline" size={btn} onClick={pass} loading={busy === "pass"} disabled={pending}>
          {busy !== "pass" && <X />} Pass
        </Button>
      )}
      <Button size={btn} onClick={() => setComposing(true)} disabled={pending}>
        <Heart /> Interested
      </Button>
    </div>
  );
}
