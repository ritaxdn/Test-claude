"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Retient la campagne d'arrivée (utm, gclid, fbclid) pour l'attacher aux demandes envoyées au CRM. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
