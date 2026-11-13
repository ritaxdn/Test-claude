"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { respondToRequest, withdrawRequest } from "@/lib/actions/requests";

export function RespondButtons({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [busy, setBusy] = React.useState<"accepted" | "rejected" | null>(null);

  const respond = (decision: "accepted" | "rejected") => {
    setBusy(decision);
    start(async () => {
      const res = await respondToRequest(requestId, decision);
      setBusy(null);
      if (!res.ok) return void toast.error(res.error);
      if (decision === "accepted" && res.data) {
        toast.success(res.message, {
          action: { label: "Say hello", onClick: () => router.push(`/matches/${res.data!.matchId}`) },
        });
      } else {
        toast(res.message);
      }
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => respond("rejected")} loading={busy === "rejected"} disabled={pending}>
        {busy !== "rejected" && <X />} Decline
      </Button>
      <Button size="sm" onClick={() => respond("accepted")} loading={busy === "accepted"} disabled={pending}>
        {busy !== "accepted" && <Check />} Accept
      </Button>
    </div>
  );
}

export function WithdrawButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  return (
    <Button
      size="sm"
      variant="ghost"
      loading={pending}
      onClick={() =>
        start(async () => {
          const res = await withdrawRequest(requestId);
          if (!res.ok) return void toast.error(res.error);
          toast(res.message);
          router.refresh();
        })
      }
    >
      Withdraw
    </Button>
  );
}
