export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div
        className="h-full w-full opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
    </div>
  );
}
