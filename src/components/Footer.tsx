import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { CONTACT } from "@/lib/data/contact";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-paper-alt">
      <div className="container-cl grid grid-cols-1 gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-lg tracking-[0.08em] text-ink">CELLULIFT</p>
          <p className="mt-4 text-sm leading-relaxed text-graphite">
            Distributeur et ambassadeur officiel de la marque française LGL Expert en Afrique.
            Des technologies médico-esthétiques haut de gamme, pour des professionnels exigeants.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wide text-ink">Catalogue</p>
          <ul className="mt-4 space-y-2.5">
            {categories.slice(0, 6).map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/catalogue/${category.slug}`}
                  className="text-sm text-graphite transition-colors duration-fast hover:text-bronze-dark"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/catalogue" className="text-sm font-medium text-bronze-dark">
                Voir toutes les catégories →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wide text-ink">Cellulift</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/a-propos" className="text-sm text-graphite transition-colors duration-fast hover:text-bronze-dark">
                À propos
              </Link>
            </li>
            <li>
              <Link href="/certifications" className="text-sm text-graphite transition-colors duration-fast hover:text-bronze-dark">
                Certifications &amp; partenariats
              </Link>
            </li>
            <li>
              <Link href="/ressources" className="text-sm text-graphite transition-colors duration-fast hover:text-bronze-dark">
                Ressources &amp; brochures
              </Link>
            </li>
            <li>
              <Link href="/devis" className="text-sm text-graphite transition-colors duration-fast hover:text-bronze-dark">
                Demander un devis
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wide text-ink">Contact</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={CONTACT.phoneHref} className="flex items-center gap-2 text-sm text-graphite transition-colors duration-fast hover:text-bronze-dark">
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-sm text-graphite transition-colors duration-fast hover:text-bronze-dark">
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-start gap-2 text-sm text-graphite">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {CONTACT.addressLine}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-cl flex flex-col items-center justify-between gap-3 py-6 text-xs text-graphite-soft md:flex-row">
          <p>© {year} Cellulift — Distributeur officiel LGL Expert. Tous droits réservés.</p>
          <div className="flex gap-5">
            <Link href="/mentions-legales" className="hover:text-bronze-dark">
              Mentions légales
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-bronze-dark">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
