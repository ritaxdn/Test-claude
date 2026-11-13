import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground",
        outline: "border border-border text-muted-foreground",
        muted: "bg-muted text-muted-foreground",
        success: "bg-success/12 text-[oklch(0.45_0.12_160)]",
        warning: "bg-amber-100 text-amber-800",
        destructive: "bg-destructive/10 text-destructive",
        demo: "border border-dashed border-amber-400 bg-amber-50 text-amber-800",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
