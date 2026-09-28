import { ImageResponse } from "next/og";

// Icône d'écran d'accueil iPhone/iPad (même dessin que icon.svg).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1A1814" }}>
        <svg width="140" height="140" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="g" x1="2" y1="16" x2="30" y2="16" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00BCD4" />
              <stop offset="25%" stopColor="#7B61FF" />
              <stop offset="50%" stopColor="#E91E8C" />
              <stop offset="75%" stopColor="#FF5722" />
              <stop offset="100%" stopColor="#FFC107" />
            </linearGradient>
          </defs>
          <path d="M4 16H11L13 11L16 21L19 13L21 16H28" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size
  );
}
