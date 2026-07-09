import type { Metadata } from "next";
import { CONTACT } from "@/lib/data/contact";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-cl max-w-3xl">
        <h1 className="font-display text-4xl text-ink">Politique de confidentialité</h1>
        <p className="mt-4 text-sm text-graphite-soft">
          Ce document est un cadre générique. Il doit être révisé par un juriste avant publication, en tenant
          compte de la réglementation applicable dans chaque pays où Cellulift opère.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-graphite">
          <div>
            <h2 className="font-display text-xl text-ink">1. Données collectées</h2>
            <p className="mt-2">
              Lorsque vous remplissez un formulaire (devis, démonstration, rappel, brochure, étude de
              rentabilité, contact), nous collectons : nom, société, pays, profession, téléphone, email, type
              d&apos;établissement, machine(s) d&apos;intérêt, budget estimatif et message.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">2. Finalité du traitement</h2>
            <p className="mt-2">
              Ces données sont utilisées exclusivement pour qualifier votre demande, vous recontacter et vous
              proposer une offre adaptée à votre activité. Elles peuvent être transmises à notre outil de
              gestion de la relation client (CRM) pour assurer le suivi commercial.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">3. Mesure d&apos;audience et cookies</h2>
            <p className="mt-2">
              Le site peut utiliser des outils de mesure d&apos;audience et de suivi marketing (Google
              Analytics 4, Google Tag Manager, Meta Pixel, LinkedIn Insight Tag, Microsoft Clarity) afin de
              comprendre l&apos;usage du site et d&apos;optimiser nos campagnes. Ces outils ne sont activés que
              si vous y consentez, conformément à la réglementation applicable.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">4. Durée de conservation</h2>
            <p className="mt-2">
              Les données sont conservées pour la durée nécessaire au traitement commercial de votre demande,
              conformément à la réglementation applicable.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">5. Vos droits</h2>
            <p className="mt-2">
              Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.
              Pour l&apos;exercer, contactez-nous à {CONTACT.email}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
