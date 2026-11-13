import * as React from "react";
import { cn } from "@/lib/utils";

export const fieldBase =
  "w-full min-w-0 rounded-xl border border-input bg-card px-3.5 text-[15px] shadow-xs transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 sm:text-sm";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} data-slot="input" className={cn(fieldBase, "h-11", className)} {...props} />;
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea data-slot="textarea" className={cn(fieldBase, "min-h-24 resize-y py-2.5 leading-relaxed", className)} {...props} />
  );
}

function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(fieldBase, "h-11 appearance-none pr-9", className)}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
      >
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export { Input, Textarea, NativeSelect };
