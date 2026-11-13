"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/** Shows a one-off success toast (from a ?flag after redirect) and cleans the URL. */
export function Flash({ message }: { message: string }) {
  const shown = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.success(message);
    const next = new URLSearchParams(params.toString());
    ["created", "saved", "deleted"].forEach((k) => next.delete(k));
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  }, [message, params, pathname, router]);
  return null;
}
