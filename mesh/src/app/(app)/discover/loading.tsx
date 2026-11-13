import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div aria-busy aria-label="Loading projects">
      <Skeleton className="mb-2 h-9 w-40" />
      <Skeleton className="mb-8 h-5 w-64" />
      <Skeleton className="mb-6 hidden h-16 w-full rounded-2xl md:block" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-border/80 bg-card p-6">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-5 h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-5 h-16 w-full" />
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Skeleton className="h-8 rounded-full" />
              <Skeleton className="h-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
