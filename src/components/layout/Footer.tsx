import Link from "next/link";
import { InstagramIcon, LinkedinIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/content/company";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/technologies`, label: dict.nav.technologies },
    { href: `/${locale}/academy`, label: dict.nav.academy },
    { href: `/${locale}/support`, label: dict.nav.support },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];
  const socials = [
    { href: company.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: company.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: company.social.facebook, label: "Facebook", Icon: FacebookIcon },
  ];
  const offices = company.showrooms.filter((s) => s.address);

  return (
    <footer className="px-3 pb-3 pt-2 md:px-5 md:pb-5">
      <div className="glass rounded-[2rem] px-6 py-10 md:rounded-[2.5rem] md:px-12 md:py-12">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Logo locale={locale} size="md" tagline={dict.footer.tagline} />
            <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-deep-soft">{dict.footer.description}</p>
            <div className="mt-6 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="glass-soft flex h-10 w-10 items-center justify-center rounded-full text-deep transition-colors hover:bg-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={dict.footer.pages}>
            <p className="data-label text-deep-soft">{dict.footer.pages}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-sans text-sm text-deep transition-colors hover:text-deep-soft">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="data-label text-deep-soft">{dict.footer.contact}</p>
            <ul className="mt-4 space-y-2.5 font-sans text-sm text-deep">
              <li>
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-deep-soft">{company.phone}</a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="hover:text-deep-soft">{company.email}</a>
              </li>
            </ul>
            <ul className="mt-5 space-y-2 border-t border-deep/10 pt-5">
              {offices.map((o) => (
                <li key={o.id} className="font-sans text-sm text-deep-soft">
                  <span className="text-deep">{o.city[locale]}</span> · {o.address}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-2 border-t border-deep/10 pt-5 md:flex-row">
          <p className="data-label text-deep-soft">
            © {year} {company.legalName}. {dict.footer.rights}
          </p>
          <p className="data-label flex gap-5 text-deep-soft">
            <span>{dict.footer.legal}</span>
            <span>{dict.footer.privacy}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
