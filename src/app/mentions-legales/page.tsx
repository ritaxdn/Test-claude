import type { Metadata } from "next";
import { CONTACT } from "@/lib/data/contact";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-cl max-w-3xl">
        <h1 className="font-display text-4xl text-ink">Mentions légales</h1>
        <p className="mt-4 text-sm text-graphite-soft">
          Contenu à compléter avec les informations juridiques réelles de Cellulift (forme sociale, numéro
          d&apos;immatriculation, capital social, hébergeur) avant mise en ligne.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-graphite">
          <div>
            <h2 className="font-display text-xl text-ink">Éditeur du site</h2>
            <p className="mt-2">
              {CONTACT.companyName} — {CONTACT.addressFull}
              <br />
              Email : {CONTACT.email} — Téléphone : {CONTACT.phoneDisplay}
              <br />
              Forme juridique, numéro d&apos;immatriculation et capital social : à compléter.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">Directeur de la publication</h2>
            <p className="mt-2">À compléter.</p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">Hébergement</h2>
            <p className="mt-2">Nom de l&apos;hébergeur, adresse et contact à compléter.</p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">Propriété intellectuelle</h2>
            <p className="mt-2">
              L&apos;ensemble des contenus présents sur ce site (textes, visuels, marques) est la propriété de
              Cellulift ou de ses partenaires, dont LGL Expert, et ne peut être reproduit sans autorisation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
