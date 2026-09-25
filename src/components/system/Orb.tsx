import { cn } from "@/lib/utils";

/**
 * Sphère de verre irisée, entièrement en CSS : le dégradé Cellulift devient une matière,
 * pas un aplat de couleur.
 */
export function Orb({ className, size = 320 }: { className?: string; size?: number }) {
  return (
    <div className={className} style={{ width: size, height: size }} aria-hidden="true">
      <div className="relative h-full w-full">
      {/* Aura */}
      <div
        className="absolute -inset-[18%] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 35% 40%, rgba(0,188,212,.45), transparent 55%), radial-gradient(circle at 70% 35%, rgba(123,97,255,.5), transparent 55%), radial-gradient(circle at 55% 75%, rgba(233,30,140,.35), transparent 55%), radial-gradient(circle at 30% 80%, rgba(255,193,7,.28), transparent 50%)",
        }}
      />
      {/* Matière irisée */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div
          className="iris-spin absolute -inset-1/4"
          style={{
            background:
              "conic-gradient(from 120deg, #7fe3f0, #a797ff, #f29bd0, #ffc58f, #fff3c4, #9fe7f2, #b8a8ff, #7fe3f0)",
            filter: "blur(18px)",
          }}
        />
        {/* Profondeur */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 55%, transparent 45%, rgba(29,27,38,.22) 100%), radial-gradient(circle at 30% 25%, rgba(255,255,255,.95) 0 6%, rgba(255,255,255,.35) 16%, transparent 34%)",
          }}
        />
      </div>
      {/* Liseré de verre */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,.8),inset_0_-18px_40px_rgba(255,255,255,.35)]" />
      </div>
    </div>
  );
}

/** Anneau de verre, comme une lentille vue de biais. */
export function Lens({ className, size = 220 }: { className?: string; size?: number }) {
  return (
    <div
      className={cn("rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,.55), rgba(255,255,255,.08) 60%)",
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.95), inset 0 0 30px rgba(255,255,255,.6), 0 20px 50px -20px rgba(29,27,38,.25)",
        backdropFilter: "blur(6px)",
      }}
      aria-hidden="true"
    />
  );
}
