"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { whatsappHref } from "@/content/company";
import type { Locale } from "@/lib/i18n/config";
import { machineFromLocation } from "@/lib/machine";

/**
 * Lien WhatsApp qui cite la machine consultée dans le message prérempli
 * (fiche machine, ou formulaire ouvert avec ?machine=…). Ailleurs : message général.
 */
export function WhatsAppLink({
  locale,
  machines,
  className,
  ariaLabel,
  children,
}: {
  locale: Locale;
  machines: Record<string, string>;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [href, setHref] = useState(() => whatsappHref(locale));

  useEffect(() => {
    const machine = machineFromLocation(pathname, window.location.search, machines);
    setHref(whatsappHref(locale, machine?.name)); // eslint-disable-line react-hooks/set-state-in-effect -- adresse lue après le rendu serveur
  }, [pathname, locale, machines]);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className={className}>
      {children}
    </a>
  );
}
