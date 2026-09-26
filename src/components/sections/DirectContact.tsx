import { Phone, Mail, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/content/company";
import type { Locale } from "@/lib/i18n/config";

function WhatsAppIcon({ size = 18, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6.5 17.5 5 21l3.6-1.4A8 8 0 1 0 6.5 17.5Z" />
      <path d="M9 9.8c0 3 2.7 5.6 5.6 5.6.5 0 1-.2 1-.7v-1c0-.3-.3-.6-.6-.6h-1.2c-.3 0-.5-.1-.6-.4L12.6 11c-.1-.3 0-.6.2-.8l.5-.5c.2-.2.2-.5 0-.8L12 7.4c-.2-.3-.5-.3-.8-.2-1.7.8-2.2 1.7-2.2 2.6Z" />
    </svg>
  );
}

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
      href: `https://wa.me/${company.whatsapp.replace(/\D/g, "")}`,
    },
    {
      icon: Phone,
      label: labels.call,
      value: company.phone,
      href: `tel:${company.phone.replace(/\s/g, "")}`,
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
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-3 font-sans text-sm text-deep-soft transition-colors hover:text-deep"
            >
              <span className="glass-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-deep transition-colors group-hover:bg-white">
                <item.icon size={18} />
              </span>
              <span>
                <span className="data-label block text-deep-soft">
                  {item.label.toUpperCase()}
                </span>
                <span className="block">{item.value}</span>
              </span>
            </a>
          </li>
        ))}
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
