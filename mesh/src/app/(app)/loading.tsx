import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl" aria-busy aria-label="Loading">
      <Skeleton className="mb-2 h-9 w-44" />
      <Skeleton className="mb-8 h-5 w-72" />
      <div className="grid gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-5">
            <Skeleton className="size-11 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-3 w-64" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
