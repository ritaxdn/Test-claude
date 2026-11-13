"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input, NativeSelect } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { INDUSTRIES, NEEDED_ROLES, STAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const KEYS = ["industry", "stage", "role", "location"] as const;

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const [location, setLocation] = React.useState(params.get("location") ?? "");

  const active = KEYS.filter((k) => params.get(k)).length;

  const update = React.useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      next.delete("welcome");
      start(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
    },
    [params, pathname, router],
  );

  // Debounce the free-text location filter.
  React.useEffect(() => {
    if ((params.get("location") ?? "") === location) return;
    const t = setTimeout(() => update("location", location.trim()), 400);
    return () => clearTimeout(t);
  }, [location, params, update]);

  const clear = () => {
    setLocation("");
    start(() => router.replace(pathname, { scroll: false }));
  };

  return (
    <div className="mb-6 grid gap-3" aria-busy={pending}>
      <div className="flex gap-2 md:hidden">
        <Button variant="outline" className="flex-1 justify-between" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className="flex items-center gap-2">
            <SlidersHorizontal /> Filters
          </span>
          {active > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-foreground">{active}</span>
          )}
        </Button>
        {active > 0 && (
          <Button variant="ghost" size="icon" onClick={clear} aria-label="Clear filters">
            <X />
          </Button>
        )}
      </div>
      <div
        className={cn(
          "grid gap-2.5 rounded-2xl border border-border/80 bg-card p-3 sm:grid-cols-2 md:grid md:grid-cols-[1fr_1fr_1fr_1.2fr_auto] md:items-center",
          open ? "grid" : "hidden",
          pending && "opacity-80",
        )}
      >
        <NativeSelect aria-label="Sector" value={params.get("industry") ?? ""} onChange={(e) => update("industry", e.target.value)}>
          <option value="">All sectors</option>
          {INDUSTRIES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect aria-label="Stage" value={params.get("stage") ?? ""} onChange={(e) => update("stage", e.target.value)}>
          <option value="">All stages</option>
          {STAGES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect aria-label="Role needed" value={params.get("role") ?? ""} onChange={(e) => update("role", e.target.value)}>
          <option value="">Any role</option>
          {NEEDED_ROLES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Location"
            placeholder="Location"
            value={location}
            maxLength={80}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="ghost" onClick={clear} disabled={active === 0} className="hidden md:inline-flex">
          Clear
        </Button>
      </div>
    </div>
  );
}
