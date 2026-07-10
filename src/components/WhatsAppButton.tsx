"use client";

import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { CONTACT } from "@/lib/data/contact";

export function WhatsAppButton() {
  return (
    <a
      href={CONTACT.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent("whatsapp_click", { source: "floating_button", page: typeof window !== "undefined" ? window.location.pathname : "" })
      }
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-paper shadow-lg shadow-black/10 transition-transform duration-base hover:scale-105 focus-visible:scale-105 md:bottom-8 md:right-8"
      aria-label="Discuter avec un conseiller Cellulift sur WhatsApp"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden text-sm font-medium tracking-wide sm:inline">
        Parler à un expert
      </span>
    </a>
  );
}
