import Link from "next/link";
import { Suspense } from "react";
import { PartyPopper } from "lucide-react";
import { DiscoverGrid } from "@/components/discover/discover-grid";
import { FilterBar } from "@/components/discover/filter-bar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/misc";
import { INDUSTRIES, NEEDED_ROLES, STAGES } from "@/lib/constants";
import { discoverProjects, getProfilesByIds } from "@/lib/data";
import { requireOnboarded } from "@/lib/auth";

export const metadata = { title: "Discover" };

const PAGE_SIZE = 24;
const pick = (v: string | string[] | undefined, allowed?: readonly { value: string }[]) => {
  const s = (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
  if (!s) return undefined;
  if (allowed && !allowed.some((o) => o.value === s)) return undefined;
  return s.slice(0, 80);
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { profile } = await requireOnboarded();
  const sp = await searchParams;
  const filters = {
    industry: pick(sp.industry, INDUSTRIES),
    stage: pick(sp.stage, STAGES),
    role: pick(sp.role, NEEDED_ROLES),
    location: pick(sp.location),
  };
  const page = Math.max(1, Number.parseInt(pick(sp.page) ?? "1", 10) || 1);
  const projects = await discoverProjects(filters, PAGE_SIZE + 1, (page - 1) * PAGE_SIZE);
  const hasMore = projects.length > PAGE_SIZE;
  const shown = projects.slice(0, PAGE_SIZE);
  const owners = await getProfilesByIds(shown.map((p) => p.owner_id));
  const filtered = Object.values(filters).some(Boolean);

  const pageHref = (n: number) => {
    const q = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && q.set(k, v));
    if (n > 1) q.set("page", String(n));
    return `/discover${q.size ? `?${q}` : ""}`;
  };

  return (
    <>
      {sp.welcome && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-accent/60 p-4 text-sm">
          <PartyPopper className="mt-0.5 size-5 shrink-0 text-primary" />
          <p>
            <span className="font-medium">Welcome to MESH, {profile.full_name.split(" ")[0]}.</span> Tap{" "}
            <span className="font-medium">Interested</span> on projects you&apos;d like to join, or{" "}
            <Link href="/projects/new" className="font-medium text-primary underline-offset-2 hover:underline">
              post your own
            </Link>
            .
          </p>
        </div>
      )}
      <PageHeader title="Discover" description="Projects looking for people like you." />
      <Suspense>
        <FilterBar />
      </Suspense>
      <DiscoverGrid
        projects={shown}
        owners={Object.fromEntries(owners)}
        filtered={filtered}
      />
      {(page > 1 || hasMore) && (
        <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
          {page > 1 && (
            <Button asChild variant="outline">
              <Link href={pageHref(page - 1)}>Previous</Link>
            </Button>
          )}
          {hasMore && (
            <Button asChild variant="outline">
              <Link href={pageHref(page + 1)}>More projects</Link>
            </Button>
          )}
        </nav>
      )}
    </>
  );
}
