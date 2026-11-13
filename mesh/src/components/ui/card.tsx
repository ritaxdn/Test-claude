import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl border border-border/80 bg-card text-card-foreground shadow-[0_1px_2px_oklch(0.2_0.05_293/0.04),0_8px_24px_-12px_oklch(0.2_0.05_293/0.08)]",
        className,
      )}
      {...props}
    />
  );
}
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid gap-1.5 p-5 sm:p-6", className)} {...props} />;
}
function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-base font-semibold tracking-tight", className)} {...props} />;
}
function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />;
}
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-2 border-t border-border/70 px-5 py-4 sm:px-6", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
