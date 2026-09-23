import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { doctor, practice } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

// À COMPLÉTER : faire relire ces mentions (hébergeur, RGPD) avant la mise en ligne.
export default function MentionsLegales() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-20 md:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>
        <h1 className="mt-10 font-display font-medium text-5xl">Mentions légales</h1>

        <div className="mt-12 space-y-10 leading-relaxed text-ink-soft [&_h2]:mb-3 [&_h2]:font-display [&_h2]:font-medium [&_h2]:text-2xl [&_h2]:text-ink">
          <section>
            <h2>Éditeur du site</h2>
            <p>
              {doctor.fullName}, {doctor.title.toLowerCase()}
              <br />
              {practice.addressLine1}, {practice.addressLine2}
              <br />
              Téléphone : {practice.phone} · E-mail : {practice.email}
              <br />
              Numéro RPPS : {doctor.rpps}
              <br />
              {doctor.ordre}
            </p>
          </section>

          <section>
            <h2>Hébergement</h2>
            <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
          </section>

          <section>
            <h2>Information médicale</h2>
            <p>
              Le contenu de ce site a une vocation exclusivement informative et ne constitue pas une
              publicité. Il ne remplace en aucun cas une consultation médicale. Les résultats des
              actes de médecine esthétique varient d&apos;une personne à l&apos;autre.
            </p>
          </section>

          <section>
            <h2>Données personnelles</h2>
            <p>
              Les informations saisies dans le formulaire de prise de rendez-vous (nom, prénom,
              téléphone, e-mail, message) sont transmises au cabinet dans le seul but de traiter
              votre demande. Elles ne sont ni cédées ni utilisées à des fins commerciales, et sont
              supprimées une fois la demande traitée. Le site n&apos;utilise pas de cookies de suivi.
              Conformément au RGPD, vous pouvez exercer vos droits d&apos;accès, de rectification et
              de suppression en écrivant à {practice.email}.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
