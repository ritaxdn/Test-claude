import { ImageResponse } from "next/og";

// Icône d'écran d'accueil iPhone/iPad (même dessin que icon.svg : fond nacré, ECG arc-en-ciel).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #FFFFFF 0%, #E2E4EB 100%)" }}>
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
          <path d="M4 16H10.5L13 10.5L16 21.5L19 12.5L21 16H28" stroke="url(#g)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size
  );
}
