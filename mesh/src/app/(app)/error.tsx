"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <EmptyState
      icon={<AlertTriangle />}
      title="Something went wrong"
      description={
        <>
          We couldn&apos;t load this page. Check your connection and try again.
          {error.digest && <span className="mt-2 block font-mono text-xs opacity-70">Ref: {error.digest}</span>}
        </>
      }
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
