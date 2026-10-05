import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { company, whatsappHref } from "@/content/company";
import type { Locale } from "@/lib/i18n/config";

/**
 * Bouton WhatsApp flottant, sur toutes les pages : un toucher ouvre la conversation avec un message prérempli.
 * Sur téléphone, il se place au-dessus de la barre d'onglets. Masqué tant qu'aucun numéro n'est renseigné.
 */
export function WhatsAppButton({ locale }: { locale: Locale }) {
  if (!company.whatsapp) return null;
  const label = locale === "fr" ? "Écrire sur WhatsApp" : "Chat on WhatsApp";
  return (
    <a
      href={whatsappHref(locale)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-12px_rgba(18,140,70,.7)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:px-5 sm:py-3.5"
    >
      <WhatsAppIcon size={24} strokeWidth={1.8} />
      <span className="hidden font-sans text-sm font-medium sm:inline">{label}</span>
    </a>
  );
}
