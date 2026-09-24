import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RegistrationForm } from "@/components/formations/RegistrationForm";
import { practice } from "@/content/site";
import { formationsPage as f } from "@/content/formations";
import { getSession, placesLeft, registrationEnabled, sessionTitle } from "@/lib/sessions";

type Props = { params: Promise<{ id: string }> };

// Places restantes à jour : la page se régénère au plus toutes les minutes.
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getSession((await params).id);
  return {
    title: s ? `Inscription — ${sessionTitle(s)}` : "Inscription",
    robots: { index: false },
  };
}

export default async function RegistrationPage({ params }: Props) {
  const s = await getSession((await params).id);
  if (!s || !registrationEnabled()) notFound();
  const left = placesLeft(s);

  return (
    <>
      <Header variant="pro" />
      <main className="pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Link href="/formations#sessions" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
              <ArrowLeft size={16} /> Toutes les sessions
            </Link>
            <p className="eyebrow mt-10">Inscription · {f.hero.audience}</p>
            <h1 className="mt-4 font-display text-4xl font-medium uppercase leading-[0.95] sm:text-5xl">{sessionTitle(s)}</h1>
            <div className="mt-8 space-y-4 border-t border-line pt-6 text-sm">
              <div className="flex items-start gap-3">
                <CalendarDays size={16} className="mt-0.5 shrink-0 text-accent-deep" />
                <p className="font-medium">{s.date}</p>
              </div>
              {s.place && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent-deep" />
                  <p>{s.place}</p>
                </div>
              )}
              {s.format && <p className="pl-7 text-ink-soft">{s.format}</p>}
              {left !== undefined && (
                <div className="flex items-start gap-3">
                  <Users size={16} className="mt-0.5 shrink-0 text-accent-deep" />
                  <p>{left > 0 ? `${left} place${left > 1 ? "s" : ""} restante${left > 1 ? "s" : ""}` : "Complet"}</p>
                </div>
              )}
            </div>
          </div>
          <RegistrationForm
            eventId={s.id!}
            professions={f.request.professions}
            phone={practice.phone}
            full={s.status === "full"}
          />
        </div>
      </main>
      <Footer variant="pro" />
    </>
  );
}
