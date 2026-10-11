import { Cormorant_Garamond } from "next/font/google";
import { Archivo, Instrument_Sans, JetBrains_Mono } from "next/font/google";

// Cormorant : réservée au wordmark du logo (seule face affichée : 400 normal).
export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
});

// Direction « système » : typographie architecturale (Archivo élargi), texte (Instrument Sans), données (JetBrains Mono).

export const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
