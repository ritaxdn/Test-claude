import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";

/** Attend que les polices locales soient prêtes avant de rendre la moindre image. */
export function useFonts() {
  const [handle] = useState(() => delayRender("Chargement des polices"));
  useEffect(() => {
    const faces = [
      '500 40px "Archivo Variable"', '400 20px "Instrument Sans"', '500 20px "Instrument Sans"', '600 20px "Instrument Sans"',
      '400 12px "JetBrains Mono"', '500 12px "JetBrains Mono"', '400 40px "Cormorant Garamond"',
    ];
    Promise.all(faces.map((f) => document.fonts.load(f, "AÉéçà%·—")))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
}
