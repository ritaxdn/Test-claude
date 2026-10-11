import { Phone, Mail, MapPin, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/content/company";
import { machineNames } from "@/content/technologies";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import type { Locale } from "@/lib/i18n/config";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";


export function DirectContact({
  locale,
  title,
  labels,
}: {
  locale: Locale;
  title: string;
  labels: { whatsapp: string; call: string; email: string; address: string };
}) {
  const items = [
    company.whatsapp && {
      icon: WhatsAppIcon,
      label: labels.whatsapp,
      value: company.whatsapp,
      href: "",
      whatsapp: true,
    },
    {
      icon: Phone,
      label: labels.call,
      value: company.phone,
      href: `tel:${company.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Wrench,
      label: locale === "fr" ? "Support technique" : "Technical support",
      value: company.supportPhone,
      href: `tel:${company.supportPhone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: labels.email,
      value: company.email,
      href: `mailto:${company.email}`,
    },
  ].filter((x) => !!x);

  return (
    <Reveal className="glass rounded-[1.75rem] p-7 md:p-9">
      <h2 className="display text-2xl text-deep">{title}</h2>
      <ul className="mt-6 flex flex-col gap-5">
        {items.map((item) => {
          const className = "group flex items-center gap-3 font-sans text-sm text-deep-soft transition-colors hover:text-deep";
          const content = (
            <>
              <span className="glass-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-deep transition-colors group-hover:bg-white">
                <item.icon size={18} />
              </span>
              <span>
                <span className="data-label block text-deep-soft">
                  {item.label.toUpperCase()}
                </span>
                <span className="block">{item.value}</span>
              </span>
            </>
          );
          return (
            <li key={item.label}>
              {"whatsapp" in item ? (
                // Arrivée depuis une fiche (?machine=…) : le message WhatsApp cite la machine.
                <WhatsAppLink locale={locale} machines={machineNames} className={className}>
                  {content}
                </WhatsAppLink>
              ) : (
                <a href={item.href} className={className}>
                  {content}
                </a>
              )}
            </li>
          );
        })}
        <li className="flex items-center gap-3 font-sans text-sm text-deep-soft">
          <span className="glass-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-deep">
            <MapPin size={18} />
          </span>
          <span>
            <span className="data-label block text-deep-soft">
              {labels.address.toUpperCase()}
            </span>
            <span className="block">{company.address[locale]}</span>
          </span>
        </li>
      </ul>
    </Reveal>
  );
}
