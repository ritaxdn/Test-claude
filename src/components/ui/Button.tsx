import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "text" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide transition-all duration-300 ease-out disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-warm-white hover:bg-ink-soft active:scale-[0.98] shadow-[0_1px_0_rgba(0,0,0,0.05)]",
  ghost:
    "border border-light text-ink hover:border-ink hover:bg-ink/[0.03] active:scale-[0.98]",
  text: "text-ink underline-offset-4 hover:underline px-0 py-0",
  // For use on dark/ink-colored sections, where the primary variant's bg-ink fill would be invisible.
  inverse: "bg-warm-white text-ink hover:bg-ivory-2 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-4 py-2.5",
  md: "text-sm px-6 py-3.5",
  lg: "text-sm px-8 py-4",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

interface ButtonAsLink extends CommonProps {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(
    base,
    variant !== "text" && "rounded-full",
    variants[variant],
    variant !== "text" && sizes[size],
    className
  );

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- discard href, keep only DOM-safe props
  const { href: _href, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
