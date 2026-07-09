"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "@/lib/data/contact";
import { trackEvent } from "@/lib/analytics";

export function ContactLinks() {
  return (
    <ul className="mt-10 space-y-5">
      <li>
        <a
          href={CONTACT.phoneHref}
          className="flex items-center gap-3 text-ink transition-colors duration-fast hover:text-bronze-dark"
          onClick={() => trackEvent("phone_click", { source: "contact_page" })}
        >
          <Phone className="h-5 w-5 text-bronze-dark" aria-hidden />
          {CONTACT.phoneDisplay}
        </a>
      </li>
      <li>
        <a
          href={CONTACT.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-ink transition-colors duration-fast hover:text-bronze-dark"
          onClick={() => trackEvent("whatsapp_click", { source: "contact_page" })}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-bronze-dark" fill="currentColor" aria-hidden>
            <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.26 4.9L2 22l5.25-1.38A9.94 9.94 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.18c-1.6 0-3.13-.43-4.46-1.24l-.32-.19-3.11.82.83-3.03-.2-.31A8.15 8.15 0 0 1 3.86 12c0-4.5 3.67-8.17 8.18-8.17 4.5 0 8.17 3.67 8.17 8.17 0 4.51-3.67 8.18-8.17 8.18Zm4.48-6.13c-.24-.12-1.44-.71-1.67-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.02-.38-1.95-1.21-.72-.64-1.21-1.43-1.35-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
          </svg>
          WhatsApp Business
        </a>
      </li>
      <li>
        <a
          href={`mailto:${CONTACT.email}`}
          className="flex items-center gap-3 text-ink transition-colors duration-fast hover:text-bronze-dark"
          onClick={() => trackEvent("email_click", { source: "contact_page" })}
        >
          <Mail className="h-5 w-5 text-bronze-dark" aria-hidden />
          {CONTACT.email}
        </a>
      </li>
      <li className="flex items-start gap-3 text-ink">
        <MapPin className="mt-0.5 h-5 w-5 text-bronze-dark" aria-hidden />
        {CONTACT.addressFull}
      </li>
    </ul>
  );
}
