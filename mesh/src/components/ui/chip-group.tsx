"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { readonly value: string; readonly label: string; readonly hint?: string };

/**
 * Accessible multi/single select rendered as chips. Submits through hidden
 * inputs so it works with plain <form action={serverAction}>.
 */
export function ChipGroup({
  name,
  options,
  defaultValue = [],
  multiple = true,
  max,
  variant = "chip",
  ariaLabel,
  invalid,
}: {
  name: string;
  options: readonly Option[];
  defaultValue?: readonly string[];
  multiple?: boolean;
  max?: number;
  variant?: "chip" | "card";
  ariaLabel: string;
  invalid?: boolean;
}) {
  const [selected, setSelected] = React.useState<string[]>([...defaultValue]);

  const toggle = (v: string) => {
    setSelected((cur) => {
      if (!multiple) return [v];
      if (cur.includes(v)) return cur.filter((x) => x !== v);
      if (max && cur.length >= max) return cur;
      return [...cur, v];
    });
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(variant === "card" ? "grid gap-2 sm:grid-cols-3" : "flex flex-wrap gap-2")}
    >
      {selected.map((v) => (
        <input key={v} type="hidden" name={name} value={v} />
      ))}
      {options.map((o) => {
        const on = selected.includes(o.value);
        return variant === "card" ? (
          <button
            key={o.value}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={on}
            onClick={() => toggle(o.value)}
            className={cn(
              "relative flex flex-col items-start gap-0.5 rounded-xl border bg-card p-3.5 text-left transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
              on ? "border-primary bg-accent/60 shadow-[0_0_0_1px_var(--primary)]" : "border-border hover:border-primary/40",
              invalid && !on && "border-destructive/40",
            )}
          >
            <span className="text-sm font-medium">{o.label}</span>
            {o.hint && <span className="text-xs text-muted-foreground">{o.hint}</span>}
            {on && (
              <span className="absolute top-3 right-3 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" strokeWidth={3} />
              </span>
            )}
          </button>
        ) : (
          <button
            key={o.value}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={on}
            onClick={() => toggle(o.value)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
              on
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-foreground",
            )}
          >
            {on && <Check className="size-3.5" strokeWidth={2.5} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Free-form tag input (skills) with suggestions. */
export function TagInput({
  name,
  defaultValue = [],
  suggestions = [],
  max = 20,
  placeholder,
  id,
}: {
  name: string;
  defaultValue?: readonly string[];
  suggestions?: readonly string[];
  max?: number;
  placeholder?: string;
  id?: string;
}) {
  const [tags, setTags] = React.useState<string[]>([...defaultValue]);
  const [draft, setDraft] = React.useState("");

  const add = (raw: string) => {
    const t = raw.trim().replace(/\s+/g, " ").slice(0, 40);
    if (!t) return;
    setTags((cur) =>
      cur.length >= max || cur.some((c) => c.toLowerCase() === t.toLowerCase()) ? cur : [...cur, t],
    );
    setDraft("");
  };

  const remaining = suggestions.filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()));

  return (
    <div className="grid gap-3">
      {tags.map((t) => (
        <input key={t} type="hidden" name={name} value={t} />
      ))}
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-input bg-card px-2 py-1.5 shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/25">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex h-7 items-center gap-1 rounded-full bg-accent pr-1 pl-2.5 text-[13px] font-medium text-accent-foreground"
          >
            {t}
            <button
              type="button"
              aria-label={`Remove ${t}`}
              onClick={() => setTags((cur) => cur.filter((x) => x !== t))}
              className="flex size-5 items-center justify-center rounded-full hover:bg-primary/15"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && tags.length) {
              setTags((cur) => cur.slice(0, -1));
            }
          }}
          onBlur={() => add(draft)}
          placeholder={tags.length ? "" : placeholder}
          className="h-8 min-w-[8rem] flex-1 bg-transparent px-1.5 text-[15px] outline-none placeholder:text-muted-foreground/70 sm:text-sm"
        />
      </div>
      {remaining.length > 0 && tags.length < max && (
        <div className="flex flex-wrap gap-1.5">
          {remaining.slice(0, 12).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="h-7 rounded-full border border-dashed border-border px-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
