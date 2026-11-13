import { cn, initials } from "@/lib/utils";

const palettes = [
  "from-violet-500 to-fuchsia-500",
  "from-indigo-500 to-violet-500",
  "from-purple-500 to-pink-500",
  "from-violet-600 to-sky-500",
  "from-fuchsia-500 to-orange-400",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Avatar({ name, seed, className }: { name: string | null | undefined; seed?: string; className?: string }) {
  const p = palettes[hash(seed ?? name ?? "") % palettes.length];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-inner ring-2 ring-card",
        p,
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
