import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingCalendar } from "@/components/BookingCalendar";
import { practice } from "@/content/site";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description: "Choisissez le motif, la date et l'heure de votre rendez-vous au cabinet du Dr Dadoun.",
};

export default function RendezVous() {
  return (
    <>
      <Header />
      <main className="bg-sand/60 pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow">Rendez-vous en ligne</p>
              <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-6xl">
                Réservez votre <em className="text-accent-deep">consultation</em>
              </h1>
            </div>
            <p className="max-w-sm text-ink-soft">
              Choisissez un créneau : le cabinet vous confirme le rendez-vous sous 24 h ouvrées. Vous
              préférez appeler ?{" "}
              <a href={`tel:${practice.phoneHref}`} className="inline-flex items-center gap-1 underline decoration-accent underline-offset-4">
                <Phone size={14} /> {practice.phone}
              </a>
            </p>
          </div>
          <div className="mt-12">
            <BookingCalendar />
          </div>
          <p className="mt-6 text-xs text-muted">
            Toute séance de soin est précédée d&apos;une consultation médicale. En cas
            d&apos;empêchement, merci de prévenir le cabinet au moins 48 h à l&apos;avance.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
