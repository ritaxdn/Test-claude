"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteProject } from "@/lib/actions/projects";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  if (!confirming) {
    return (
      <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => setConfirming(true)}>
        <Trash2 /> Delete
      </Button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full bg-destructive/5 py-1 pr-1 pl-4 text-sm">
      <span className="text-destructive">Delete project and its matches?</span>
      <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={pending}>
        Cancel
      </Button>
      <Button
        size="sm"
        variant="destructive"
        loading={pending}
        onClick={() =>
          start(async () => {
            const res = await deleteProject(projectId);
            if (res && !res.ok) toast.error(res.error);
          })
        }
      >
        Delete
      </Button>
    </div>
  );
}
