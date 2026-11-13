import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";

export default function NotFound() {
  return (
    <EmptyState
      icon={<SearchX />}
      title="Not found"
      description="This page doesn't exist, or you don't have access to it."
      action={
        <Button asChild>
          <Link href="/discover">Back to Discover</Link>
        </Button>
      }
    />
  );
}
