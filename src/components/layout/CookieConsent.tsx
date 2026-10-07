"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import type { Locale } from "@/lib/i18n/config";

const KEY = "cellulift-consent"; // "accepted" | "refused"
// Identifiant Google Analytics 4 de Cellulift (surchargeable par la variable NEXT_PUBLIC_GA_ID).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-0MVP9EQYZ4";
// Identifiant Microsoft Clarity (enregistrements anonymes des visites, cartes de clics).
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "ytopy1tfoy";

// Clics suivis dans Google Analytics : appel, e-mail, WhatsApp, prise de rendez-vous, boutons vers le formulaire.
const CLICK_TRACKING = `document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';var n=h.indexOf('tel:')===0?'clic_telephone':h.indexOf('mailto:')===0?'clic_email':/wa\\.me|whatsapp/.test(h)?'clic_whatsapp':/cal\\.com/.test(h)?'clic_rendez_vous':/[?&]sujet=/.test(h)?'clic_bouton_contact':null;if(n)gtag('event',n,{lien:h,page:location.pathname});},true);`;

const t = {
  fr: {
    text: "Nous utilisons des cookies de mesure d'audience pour améliorer le site, uniquement avec votre accord.",
    accept: "Accepter",
    refuse: "Refuser",
    more: "En savoir plus",
  },
  en: {
    text: "We use analytics cookies to improve the website, only with your consent.",
    accept: "Accept",
    refuse: "Decline",
    more: "Learn more",
  },
} as const;

/** Lit le choix enregistré (le stockage peut être indisponible : navigation privée, etc.). */
function readChoice() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/**
 * Bandeau de consentement aux cookies. Google Analytics (si NEXT_PUBLIC_GA_ID est défini) ne se charge
 * qu'après acceptation. Le lien « Cookies » du pied de page rouvre le bandeau (événement « open-cookie-consent »).
 */
export function CookieConsent({ locale }: { locale: Locale }) {
  const [choice, setChoice] = useState<string | null>("pending");

  useEffect(() => {
    setChoice(readChoice()); // eslint-disable-line react-hooks/set-state-in-effect
    const reopen = () => setChoice(null);
    window.addEventListener("open-cookie-consent", reopen);
    return () => window.removeEventListener("open-cookie-consent", reopen);
  }, []);

  const decide = (value: "accepted" | "refused") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setChoice(value);
  };

  const c = t[locale];
  return (
    <>
      {GA_ID && choice === "accepted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});${CLICK_TRACKING}`}
          </Script>
        </>
      )}
      {CLARITY_ID && choice === "accepted" && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}
      {choice === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookies"
          className="glass-strong fixed inset-x-3 bottom-24 z-50 mx-auto max-w-xl rounded-[1.5rem] p-5 sm:bottom-5"
        >
          <p className="font-sans text-sm leading-relaxed text-deep">
            {c.text}{" "}
            <Link href={`/${locale}/privacy`} className="underline underline-offset-2">
              {c.more}
            </Link>
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => decide("accepted")}
              className="glass-strong relative rounded-full px-5 py-2 font-sans text-sm font-medium text-deep transition-colors hover:bg-white"
            >
              {c.accept}
            </button>
            <button
              type="button"
              onClick={() => decide("refused")}
              className="rounded-full border border-deep/20 px-5 py-2 font-sans text-sm text-deep transition-colors hover:bg-white/70"
            >
              {c.refuse}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Lien du pied de page pour modifier son choix. */
export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("open-cookie-consent"))} className="hover:text-deep">
      {label}
    </button>
  );
}
