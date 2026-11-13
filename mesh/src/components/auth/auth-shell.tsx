import { Logo } from "@/components/brand/logo";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center px-4 pt-10 pb-12 sm:justify-center sm:pt-0">
      <div aria-hidden className="mesh-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <div aria-hidden className="mesh-grid pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <div className="relative w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-[0_24px_60px_-24px_oklch(0.3_0.1_293/0.25)] backdrop-blur sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
  );
}
