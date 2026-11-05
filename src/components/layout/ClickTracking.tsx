"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Mesure des contacts directs, pour Analytics et Google Ads : clic sur un lien WhatsApp (wa.me)
 * ou sur un numéro (tel:). Jamais le numéro du visiteur : seulement la page et le numéro Cellulift cliqué.
 */
export function ClickTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const page = window.location.pathname;
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) track("whatsapp_click", { page });
      else if (href.startsWith("tel:")) track("phone_click", { page, numero: href.slice(4) });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
