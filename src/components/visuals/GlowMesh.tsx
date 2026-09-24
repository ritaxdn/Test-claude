export function GlowMesh({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "compact";
}) {
  const size = variant === "hero" ? "h-[70vw] w-[70vw]" : "h-[40vw] w-[40vw]";

  return (
    <div className={className} aria-hidden="true">
      <div
        className={`animate-drift absolute ${size} max-h-[720px] max-w-[720px] rounded-full opacity-30 blur-[110px]`}
        style={{
          background:
            "radial-gradient(circle, var(--rainbow-2) 0%, transparent 70%)",
        }}
      />
      <div
        className={`animate-drift absolute ${size} max-h-[600px] max-w-[600px] rounded-full opacity-25 blur-[110px]`}
        style={{
          background:
            "radial-gradient(circle, var(--rainbow-3) 0%, transparent 70%)",
          animationDelay: "-6s",
          right: 0,
          bottom: 0,
        }}
      />
      <div
        className={`animate-drift absolute ${size} max-h-[500px] max-w-[500px] rounded-full opacity-20 blur-[110px]`}
        style={{
          background:
            "radial-gradient(circle, var(--rainbow-1) 0%, transparent 70%)",
          animationDelay: "-11s",
          top: "30%",
          left: "40%",
        }}
      />
    </div>
  );
}
