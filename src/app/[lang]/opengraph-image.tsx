import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Polices du Design System 3.1 (TTF statiques, voir src/assets/og-fonts/README.md)
const fontFile = (name: string) => readFile(join(process.cwd(), "src/assets/og-fonts", name));

// Image de partage (Facebook, LinkedIn, WhatsApp, X…), générée au moment de la construction.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CELLULIFT";

export function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const fr = lang !== "en";
  const [archivo, instrument, instrumentMedium] = await Promise.all([
    fontFile("Archivo-SemiExpanded-Medium.ttf"),
    fontFile("InstrumentSans-Regular.ttf"),
    fontFile("InstrumentSans-Medium.ttf"),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #f4f5f8 0%, #eceef3 55%, #e6e1f3 100%)",
          color: "#1d1b26",
          fontFamily: "Instrument Sans",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, letterSpacing: 18, color: "#1d1b26" }}>CELLULIFT</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#5b5968" }}>
            {fr ? "Technologies médico-esthétiques professionnelles" : "Professional medical aesthetic technology"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 18, fontFamily: "Archivo", fontSize: 76, fontWeight: 500, lineHeight: 1.02 }}>
            <span>{fr ? "La technologie au service" : "Medical aesthetic technology."}</span>
            <span>{fr ? "de votre développement." : "Built for growth."}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#5b5968" }}>
            {fr ? "Distributeur officiel LGL Expert · Afrique" : "Official LGL Expert distributor · Africa"}
          </div>
          <div
            style={{
              display: "flex",
              width: 360,
              height: 6,
              borderRadius: 3,
              background: "linear-gradient(90deg, #00bcd4, #7b61ff, #e91e8c, #ff5722, #ffc107)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: archivo, weight: 500, style: "normal" },
        { name: "Instrument Sans", data: instrument, weight: 400, style: "normal" },
        { name: "Instrument Sans", data: instrumentMedium, weight: 500, style: "normal" },
      ],
    }
  );
}
