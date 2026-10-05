import { NextResponse } from "next/server";
import { resendKey, resendKeyInfo, defaultFrom } from "@/lib/resend";

export const dynamic = "force-dynamic";

// Un test d'envoi au maximum toutes les 2 minutes par instance.
let lastTest = 0;

/**
 * Diagnostic de l'envoi des formulaires (Resend). N'affiche jamais la clé.
 * GET /api/contact/diagnostic          → état de la clé et réponse de Resend
 * GET /api/contact/diagnostic?test=1   → envoie en plus un e-mail de test et affiche la réponse exacte de Resend
 */
export async function GET(request: Request) {
  const info = resendKeyInfo();
  const key = resendKey();
  const to = (process.env.CONTACT_EMAIL_TO || "cellulift@gmail.com").split(",").map((x) => x.trim());
  const result: Record<string, unknown> = {
    environnement: process.env.VERCEL_ENV ?? "local",
    cle: {
      presente: info.present,
      commence_par_re: info.startsWithRe,
      longueur: info.length,
      espaces_ou_guillemets_retires: info.neededCleanup,
    },
    expediteur: defaultFrom(),
    destinataires: to,
  };

  if (!key) {
    result.verdict = "RESEND_API_KEY absente de cet environnement Vercel (ou déploiement non relancé après l'ajout).";
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  }

  // Validité de la clé : /domains répond 401 « validation_error » si la clé est fausse,
  // « restricted_api_key » si elle est valide mais limitée à l'envoi.
  const check = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${key}` } });
  const checkBody = await check.json().catch(() => ({}));
  const name = (checkBody as { name?: string }).name;
  if (check.ok) {
    const domains = ((checkBody as { data?: { name: string; status: string }[] }).data ?? []).map((d) => `${d.name} (${d.status})`);
    result.cle_resend = "valide (accès complet)";
    result.domaines_resend = domains.length ? domains : "aucun domaine ajouté";
  } else if (name === "restricted_api_key") {
    result.cle_resend = "valide (accès « envoi » uniquement)";
  } else {
    result.cle_resend = `refusée par Resend : ${check.status} ${name ?? ""}`.trim();
    result.verdict = "La clé enregistrée dans Vercel n'est pas une clé Resend valide : recréez-la dans Resend et recollez-la dans Vercel, puis redéployez.";
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  }

  if (new URL(request.url).searchParams.get("test") === "1") {
    if (Date.now() - lastTest < 120_000) {
      result.test_envoi = "Patientez 2 minutes entre deux tests.";
    } else {
      lastTest = Date.now();
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: defaultFrom(),
          to,
          subject: "Test — formulaire du site Cellulift",
          html: "<p>Ceci est un e-mail de test envoyé depuis la page de diagnostic du site Cellulift.</p>",
        }),
      });
      result.test_envoi = { statut: res.status, reponse_resend: await res.json().catch(() => null) };
      if (res.status === 403) {
        result.verdict =
          "Clé valide, mais Resend refuse l'envoi : domaine non vérifié. Vérifiez cellulift.ma dans Resend (Domains), ou envoyez temporairement vers l'adresse du compte Resend (CONTACT_EMAIL_TO / _ACADEMY / _PARTNERSHIPS).";
      } else if (res.ok) {
        result.verdict = "Tout fonctionne : l'e-mail de test est parti.";
      }
    }
  } else {
    result.verdict = "Clé valide. Ajoutez ?test=1 à l'adresse pour envoyer un e-mail de test et voir la réponse exacte de Resend.";
  }
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
