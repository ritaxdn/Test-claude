import Link from "next/link";
import { doctor, practice } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-sand/60">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-display text-3xl italic">{doctor.name}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted">{doctor.title}</p>
          </div>
          <p className="text-sm text-ink-soft">
            {practice.addressLine1}, {practice.addressLine2} · {practice.phone}
          </p>
        </div>

        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted">
          Les informations présentées sur ce site sont délivrées à titre informatif, conformément
          aux règles déontologiques de la profession médicale. Elles ne se substituent pas à une
          consultation. Tout acte de médecine esthétique nécessite une consultation préalable et
          peut comporter des risques et effets secondaires.
        </p>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {doctor.fullName} · RPPS {doctor.rpps}
          </p>
          <Link href="/mentions-legales" className="hover:text-ink">
            Mentions légales & confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
}
