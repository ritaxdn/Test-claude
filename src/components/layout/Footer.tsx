import Link from "next/link";
import { InstagramIcon, LinkedinIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
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

  return (
    <footer className="border-t border-hairline bg-ivory-2">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-4 md:py-20">
        <div className="md:col-span-2">
          <Logo locale={locale} size="md" tagline={dict.footer.tagline} />
          <p className="font-body mt-6 max-w-sm text-sm font-light leading-relaxed text-ink-soft">
            {dict.footer.description}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <a
              href={company.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-ink-soft transition-colors hover:text-ink"
            >
              <InstagramIcon />
            </a>
            <a
              href={company.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-ink-soft transition-colors hover:text-ink"
            >
              <LinkedinIcon />
            </a>
            <a
              href={company.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-ink-soft transition-colors hover:text-ink"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <h3
            className="font-label text-muted"
            style={{ fontSize: "11px", letterSpacing: "0.15em" }}
          >
            {dict.footer.pages.toUpperCase()}
          </h3>
          <ul className="mt-5 flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3
            className="font-label text-muted"
            style={{ fontSize: "11px", letterSpacing: "0.15em" }}
          >
            {dict.footer.contact.toUpperCase()}
          </h3>
          <ul className="mt-5 flex flex-col gap-3 font-body text-sm text-ink-soft">
            <li>
              <a href={`mailto:${company.email}`} className="hover:text-ink">
                {company.email}
              </a>
            </li>
            <li>
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-ink">
                {company.phone}
              </a>
            </li>
            <li>{company.address[locale]}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-hairline">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 md:flex-row">
          <p className="font-label text-muted" style={{ fontSize: "10px" }}>
            © {year} {company.legalName}. {dict.footer.rights}
          </p>
          <div className="flex gap-6 font-label text-muted" style={{ fontSize: "10px" }}>
            <span className="cursor-default">{dict.footer.legal}</span>
            <span className="cursor-default">{dict.footer.privacy}</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
