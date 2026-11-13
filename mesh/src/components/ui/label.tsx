import * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label data-slot="label" className={cn("text-sm font-medium leading-none", className)} {...props} />;
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: string | string[];
  children: React.ReactNode;
  className?: string;
}) {
  const message = Array.isArray(error) ? error[0] : error;
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {message ? (
        <p className="text-[13px] text-destructive" role="alert">
          {message}
        </p>
      ) : hint ? (
        <p className="text-[13px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export { Label, Field };
