import fs from "node:fs";
import path from "node:path";

/**
 * La machine de la page d'accueil.
 * Déposer une photo détourée (fond transparent) dans `public/images/machine.png` : elle remplace
 * automatiquement ce rendu illustratif.
 */
export function Machine({ className }: { className?: string }) {
  const photo = fs.existsSync(path.join(process.cwd(), "public", "images", "machine.png"));
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element -- détourage PNG, dimensions libres
    return <img src="/images/machine.png" alt="Technologie Cellulift" className={className} />;
  }
  return <MachineRender className={className} />;
}

/** Rendu vectoriel d'une plateforme médico-esthétique : console, écran incliné, pièce à main. */
function MachineRender({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 820" className={className} role="img" aria-label="Plateforme médico-esthétique Cellulift">
      <defs>
        {/* Métal blanc satiné, lu comme un cylindre */}
        <linearGradient id="m-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b9bec7" />
          <stop offset=".12" stopColor="#e9ecf0" />
          <stop offset=".32" stopColor="#ffffff" />
          <stop offset=".55" stopColor="#f1f3f6" />
          <stop offset=".82" stopColor="#cdd2d9" />
          <stop offset="1" stopColor="#9da3ad" />
        </linearGradient>
        <linearGradient id="m-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6f7580" />
          <stop offset=".25" stopColor="#d9dde3" />
          <stop offset=".45" stopColor="#ffffff" />
          <stop offset=".7" stopColor="#a8aeb8" />
          <stop offset="1" stopColor="#5e646e" />
        </linearGradient>
        <linearGradient id="m-steel-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f8fa" />
          <stop offset=".5" stopColor="#c3c8d0" />
          <stop offset="1" stopColor="#8d939d" />
        </linearGradient>
        <linearGradient id="m-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f2230" />
          <stop offset="1" stopColor="#0d0f16" />
        </linearGradient>
        <linearGradient id="m-iris" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#00bcd4" />
          <stop offset=".3" stopColor="#7b61ff" />
          <stop offset=".6" stopColor="#e91e8c" />
          <stop offset=".85" stopColor="#ff5722" />
          <stop offset="1" stopColor="#ffc107" />
        </linearGradient>
        <linearGradient id="m-iris-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00bcd4" />
          <stop offset=".35" stopColor="#7b61ff" />
          <stop offset=".7" stopColor="#e91e8c" />
          <stop offset="1" stopColor="#ffc107" />
        </linearGradient>
        <radialGradient id="m-shadow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#1d1b26" stopOpacity=".35" />
          <stop offset="1" stopColor="#1d1b26" stopOpacity="0" />
        </radialGradient>
        <filter id="m-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* Ombre au sol */}
      <ellipse cx="300" cy="792" rx="230" ry="20" fill="url(#m-shadow)" />

      {/* Socle et roulettes */}
      <path d="M150 730 Q150 708 172 706 H428 Q450 708 450 730 V748 Q450 760 438 760 H162 Q150 760 150 748 Z" fill="url(#m-steel-v)" />
      {[178, 250, 350, 422].map((x) => (
        <g key={x}>
          <rect x={x - 9} y="758" width="18" height="16" rx="3" fill="#7d838d" />
          <circle cx={x} cy="780" r="10" fill="#2b2e36" />
          <circle cx={x} cy="780" r="4" fill="#9aa0aa" />
        </g>
      ))}

      {/* Corps de la console */}
      <path
        d="M196 300 Q196 270 226 266 H374 Q404 270 404 300 L420 690 Q421 712 398 714 H202 Q179 712 180 690 Z"
        fill="url(#m-body)"
      />
      {/* Reflet vertical */}
      <path d="M252 290 L246 700" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity=".85" filter="url(#m-soft)" />
      {/* Joint central et signal Cellulift */}
      <path d="M300 300 V700" stroke="#c7ccd4" strokeWidth="1" />
      <rect x="346" y="330" width="4" height="300" rx="2" fill="url(#m-iris-v)" opacity=".9" />
      <rect x="342" y="330" width="12" height="300" rx="6" fill="url(#m-iris-v)" opacity=".18" filter="url(#m-soft)" />
      {/* Grille de ventilation */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x="222" y={600 + i * 12} width="64" height="3" rx="1.5" fill="#b7bcc5" />
      ))}
      {/* Plateau supérieur */}
      <path d="M186 272 Q186 250 210 248 H390 Q414 250 414 272 V284 H186 Z" fill="url(#m-steel-v)" />

      {/* Bras de l'écran */}
      <rect x="286" y="170" width="28" height="84" rx="12" fill="url(#m-steel)" />
      <circle cx="300" cy="170" r="20" fill="url(#m-steel-v)" />
      <circle cx="300" cy="170" r="8" fill="#8b919b" />

      {/* Écran incliné */}
      <g transform="rotate(-10 300 110)">
        <rect x="150" y="40" width="300" height="190" rx="18" fill="url(#m-steel-v)" />
        <rect x="160" y="50" width="280" height="170" rx="12" fill="url(#m-screen)" />
        {/* Interface */}
        <path
          d="M178 150 H250 L262 150 L270 128 L282 172 L292 138 L300 150 H330 L338 150 L346 118 L356 180 L364 150 H422"
          fill="none"
          stroke="url(#m-iris)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="178" y="70" width="70" height="6" rx="3" fill="#ffffff" opacity=".55" />
        <rect x="178" y="84" width="44" height="4" rx="2" fill="#ffffff" opacity=".25" />
        <rect x="360" y="70" width="62" height="22" rx="11" fill="none" stroke="#ffffff" strokeOpacity=".35" />
        <rect x="178" y="192" width="244" height="3" rx="1.5" fill="#ffffff" opacity=".12" />
        <rect x="178" y="192" width="150" height="3" rx="1.5" fill="url(#m-iris)" />
        {/* Reflet de verre */}
        <path d="M160 50 L300 50 L200 220 L160 220 Z" fill="#ffffff" opacity=".06" />
      </g>

      {/* Support de pièce à main */}
      <path d="M404 380 H452 Q466 380 466 394 V420 H404 Z" fill="url(#m-steel-v)" />
      {/* Câble spiralé */}
      <path
        d="M420 470 C 520 500, 540 600, 470 640 C 420 668, 440 700, 404 690"
        fill="none"
        stroke="#d7dbe1"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M420 470 C 520 500, 540 600, 470 640 C 420 668, 440 700, 404 690"
        fill="none"
        stroke="#9ea4ae"
        strokeWidth="9"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      {/* Pièce à main */}
      <g transform="rotate(-8 440 400)">
        <rect x="424" y="300" width="34" height="170" rx="17" fill="url(#m-steel)" />
        <rect x="424" y="410" width="34" height="10" fill="#6f7580" opacity=".5" />
        <rect x="430" y="300" width="22" height="26" rx="8" fill="#2b2e36" />
        <ellipse cx="441" cy="302" rx="9" ry="3" fill="url(#m-iris)" />
        <rect x="438" y="340" width="6" height="48" rx="3" fill="url(#m-iris-v)" opacity=".85" />
      </g>
    </svg>
  );
}
