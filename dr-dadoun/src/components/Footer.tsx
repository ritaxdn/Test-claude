import Link from "next/link";
import { doctor, nav, practice } from "@/content/site";

export function Footer() {
  return (
    <footer className="p-2 md:p-3">
      <div className="rounded-[1.75rem] bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="font-display text-5xl font-medium uppercase tracking-tight md:text-6xl">{doctor.name}</p>
              <p className="mt-2 text-sm text-white/60">{doctor.title}</p>
            </div>
            <nav aria-label="Pied de page">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/75">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <address className="space-y-1 text-sm not-italic text-white/75">
              <p>{practice.addressLine1}</p>
              <p>{practice.addressLine2}</p>
              <p className="pt-2">
                <a href={`tel:${practice.phoneHref}`} className="hover:text-white">{practice.phone}</a>
              </p>
              <p>
                <a href={`mailto:${practice.email}`} className="hover:text-white">{practice.email}</a>
              </p>
            </address>
          </div>

          <p className="mt-12 max-w-3xl text-xs leading-relaxed text-white/50">
            Les informations présentées sur ce site sont délivrées à titre informatif, conformément
            aux règles déontologiques de la profession médicale. Elles ne se substituent pas à une
            consultation. Tout acte de médecine esthétique nécessite une consultation préalable et
            peut comporter des risques et effets secondaires.
          </p>

          <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {doctor.fullName}
              {doctor.ordreNumber && ` · N° Ordre ${doctor.ordreNumber}`}
            </p>
            <Link href="/mentions-legales" className="hover:text-white">
              Mentions légales & confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
