import type { CategoryKey } from "@/content/technologies";

/**
 * Visuels immersifs des gammes (SVG animé, sans image) :
 * peau macro + scan biométrique, body scan, faisceau laser, matrice LED, ultrasons focalisés, ondes de thérapie.
 * À remplacer par de vraies photos/vidéos quand elles existent.
 */
export function TechVisual({ kind, className }: { kind: CategoryKey; className?: string }) {
  const id = `tv-${kind}`;
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-iri`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7fe3f0" />
          <stop offset=".4" stopColor="#a797ff" />
          <stop offset=".75" stopColor="#f29bd0" />
          <stop offset="1" stopColor="#ffc58f" />
        </linearGradient>
        <radialGradient id={`${id}-vig`} cx=".5" cy=".45" r=".75">
          <stop offset=".45" stopColor="#0b0d14" stopOpacity="0" />
          <stop offset="1" stopColor="#0b0d14" stopOpacity=".9" />
        </radialGradient>
        <filter id={`${id}-skin`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={kind === "lasers" ? "0.05 0.07" : "0.045 0.06"} numOctaves="4" seed="7" result="n" />
          <feDiffuseLighting in="n" lightingColor={kind === "lasers" ? "#d8a28e" : "#f0c8b4"} surfaceScale="2.4">
            <feDistantLight azimuth="235" elevation="58" />
          </feDiffuseLighting>
        </filter>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {kind === "rejuvenation" && <Rejuvenation id={id} />}
      {kind === "amincissement" && <BodyScan id={id} />}
      {kind === "lasers" && <Laser id={id} />}
      {kind === "photomodulation" && <Leds id={id} />}
      {kind === "hifu" && <Hifu id={id} />}
      {kind === "therapie" && <Therapy id={id} />}
    </svg>
  );
}

/** Peau en macro + scan biométrique (réticule, trame de mesure, ligne de balayage). */
function Rejuvenation({ id }: { id: string }) {
  return (
    <>
      <rect width="400" height="500" filter={`url(#${id}-skin)`} />
      <rect width="400" height="500" fill="#c98b78" opacity=".18" />
      <rect width="400" height="500" fill={`url(#${id}-vig)`} />
      <g stroke="#ffffff" strokeOpacity=".35" strokeWidth="1">
        {Array.from({ length: 5 }, (_, i) =>
          Array.from({ length: 4 }, (_, j) => (
            <path key={`${i}-${j}`} d={`M${90 + i * 55 - 4} ${120 + j * 60}h8M${90 + i * 55} ${120 + j * 60 - 4}v8`} />
          ))
        )}
      </g>
      <g transform="translate(232 206)">
        <circle r="54" fill="none" stroke="#ffffff" strokeOpacity=".7" strokeWidth="1" strokeDasharray="2 6">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="18s" repeatCount="indefinite" />
        </circle>
        <circle r="34" fill="none" stroke={`url(#${id}-iri)`} strokeWidth="1.4" />
        <path d="M-70 0h14M56 0h14M0 -70v14M0 56v14" stroke="#ffffff" strokeOpacity=".8" strokeWidth="1" />
      </g>
      <g>
        <rect x="0" y="-2" width="400" height="2" fill={`url(#${id}-iri)`} opacity=".9" />
        <rect x="0" y="-30" width="400" height="30" fill={`url(#${id}-iri)`} opacity=".12" />
        <animateTransform attributeName="transform" type="translate" values="0 40;0 470;0 40" dur="7s" repeatCount="indefinite" />
      </g>
    </>
  );
}

/** Silhouette en coupes successives (body scan) + plan de mesure qui descend. */
function BodyScan({ id }: { id: string }) {
  // Demi-largeur du corps selon la hauteur (épaules → taille → hanches → cuisses).
  const profile: [number, number][] = [[0, 44], [0.07, 104], [0.2, 96], [0.4, 66], [0.55, 88], [0.68, 100], [0.82, 86], [1, 62]];
  const w = (t: number) => {
    for (let i = 1; i < profile.length; i++) {
      const [t1, w1] = profile[i];
      const [t0, w0] = profile[i - 1];
      if (t <= t1) return w0 + ((t - t0) / (t1 - t0)) * (w1 - w0);
    }
    return profile[profile.length - 1][1];
  };
  const slices = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    return { y: 70 + t * 380, r: w(t) };
  });
  return (
    <>
      <rect width="400" height="500" fill="#101320" />
      <rect width="400" height="500" fill={`url(#${id}-vig)`} />
      <path d={`M${slices.map((s) => `${200 - s.r} ${s.y}`).join(" L")}`} fill="none" stroke="#ffffff" strokeOpacity=".5" strokeWidth="1" />
      <path d={`M${slices.map((s) => `${200 + s.r} ${s.y}`).join(" L")}`} fill="none" stroke="#ffffff" strokeOpacity=".5" strokeWidth="1" />
      {slices.map((s) => (
        <ellipse key={s.y} cx="200" cy={s.y} rx={s.r} ry={s.r * 0.16} fill="none" stroke="#a797ff" strokeOpacity=".45" strokeWidth=".9" />
      ))}
      <g stroke="#ffffff" strokeOpacity=".4">
        {slices.map((s, i) => (
          <path key={s.y} d={`M340 ${s.y}h${i % 4 === 0 ? 18 : 8}`} />
        ))}
      </g>
      <g>
        <ellipse cx="200" cy="0" rx="150" ry="22" fill="none" stroke={`url(#${id}-iri)`} strokeWidth="1.6" />
        <ellipse cx="200" cy="0" rx="150" ry="22" fill={`url(#${id}-iri)`} opacity=".08" />
        <animateTransform attributeName="transform" type="translate" values="0 70;0 450;0 70" dur="6s" repeatCount="indefinite" />
      </g>
    </>
  );
}

/** Détail de peau + faisceau laser qui balaie la surface. */
function Laser({ id }: { id: string }) {
  return (
    <>
      <rect width="400" height="500" filter={`url(#${id}-skin)`} />
      <rect width="400" height="500" fill="#0b0d14" opacity=".35" />
      <rect width="400" height="500" fill={`url(#${id}-vig)`} />
      <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f29bd0" stopOpacity="0" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
      <path d="M0 330H400" stroke={`url(#${id}-iri)`} strokeOpacity=".35" strokeDasharray="2 6" />
      <g>
        <rect x="-10" y="0" width="20" height="330" fill="#f29bd0" opacity=".35" filter={`url(#${id}-glow)`} />
        <rect x="-1" y="0" width="2" height="330" fill={`url(#${id}-beam)`} />
        <circle cy="330" r="26" fill="#f29bd0" opacity=".45" filter={`url(#${id}-glow)`}>
          <animate attributeName="r" values="18;30;18" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cy="330" r="5" fill="#ffffff" />
        <animateTransform attributeName="transform" type="translate" values="90 0;310 0;90 0" dur="6s" repeatCount="indefinite" />
      </g>
    </>
  );
}

/** Matrice de LED qui s'allument en vague depuis le centre. */
function Leds({ id }: { id: string }) {
  const colors = ["#ff4d6d", "#ff8a5b", "#7b61ff"];
  const dots = [];
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 8; c++) {
      const x = 60 + c * 40 + (r % 2) * 20;
      const y = 50 + r * 40;
      const d = Math.hypot(x - 200, y - 250) / 160;
      dots.push({ x, y, d, color: colors[(r + c) % 3] });
    }
  }
  return (
    <>
      <rect width="400" height="500" fill="#110d18" />
      <g filter={`url(#${id}-glow)`}>
        {dots.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="11" fill={p.color} opacity=".2">
            <animate attributeName="opacity" values=".12;.75;.12" dur="3.2s" begin={`${p.d.toFixed(2)}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      {dots.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.2" fill="#ffffff" opacity=".55" />
      ))}
      <rect width="400" height="500" fill={`url(#${id}-vig)`} />
    </>
  );
}

/** Couches de peau et ultrasons qui convergent vers un point focal profond. */
function Hifu({ id }: { id: string }) {
  const fx = 200;
  const fy = 400;
  return (
    <>
      <rect width="400" height="500" fill="#0f1220" />
      <rect y="250" width="400" height="40" fill="#f0c8b4" opacity=".55" />
      <rect y="290" width="400" height="80" fill="#d59a8c" opacity=".35" />
      <rect y="370" width="400" height="130" fill="#8a5a69" opacity=".35" />
      <g stroke="#ffffff" strokeOpacity=".3" strokeDasharray="3 5">
        <path d="M0 250H400M0 290H400M0 370H400" />
      </g>
      <clipPath id={`${id}-cone`}>
        <polygon points={`120,70 280,70 ${fx},${fy}`} />
      </clipPath>
      <g clipPath={`url(#${id}-cone)`} fill="none" stroke={`url(#${id}-iri)`} strokeWidth="1.6">
        {[0, 0.6, 1.2, 1.8, 2.4].map((b) => (
          <circle key={b} cx={fx} cy={fy} r="330">
            <animate attributeName="r" values="330;4" dur="3s" begin={`${b}s`} repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values=".2;1" dur="3s" begin={`${b}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <rect x="130" y="52" width="140" height="20" rx="10" fill="#ffffff" opacity=".85" />
      <circle cx={fx} cy={fy} r="22" fill="#f29bd0" opacity=".6" filter={`url(#${id}-glow)`}>
        <animate attributeName="opacity" values=".3;.9;.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx={fx} cy={fy} r="3.5" fill="#ffffff" />
      <rect width="400" height="500" fill={`url(#${id}-vig)`} />
    </>
  );
}

/** Ondes de choc concentriques + tracé de pouls. */
function Therapy({ id }: { id: string }) {
  return (
    <>
      <rect width="400" height="500" fill="#0e1422" />
      <g fill="none" stroke="#7fe3f0">
        {[0, 1, 2, 3].map((b) => (
          <circle key={b} cx="200" cy="250" r="10" strokeWidth="1.4">
            <animate attributeName="r" values="10;240" dur="4s" begin={`${b}s`} repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values=".9;0" dur="4s" begin={`${b}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <path
        d="M0 250H120l14 -34 16 70 16 -86 14 50h220"
        fill="none"
        stroke={`url(#${id}-iri)`}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeDasharray="600"
        strokeDashoffset="600"
      >
        <animate attributeName="stroke-dashoffset" values="600;0;0;-600" keyTimes="0;.45;.7;1" dur="4s" repeatCount="indefinite" />
      </path>
      <circle cx="200" cy="250" r="30" fill="#7fe3f0" opacity=".25" filter={`url(#${id}-glow)`} />
      <rect width="400" height="500" fill={`url(#${id}-vig)`} />
    </>
  );
}
