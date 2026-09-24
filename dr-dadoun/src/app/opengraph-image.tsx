import { ImageResponse } from "next/og";

// Image d'aperçu lors du partage du site (WhatsApp, Instagram, LinkedIn, Google…).
export const alt = "Dr Dadoun — Médecin esthétique & lasériste à Casablanca";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 85% 20%, #7fd0dc 0%, rgba(127,208,220,0) 45%), linear-gradient(135deg, #0a1b21 0%, #0a4f5a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>DR DADOUN</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>AMÉLIORER</div>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1, letterSpacing: -3, color: "#7fd8e4" }}>SANS DÉNATURER</div>
        </div>
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.8)" }}>Médecin esthétique · Lasériste · Casablanca</div>
      </div>
    ),
    size,
  );
}
