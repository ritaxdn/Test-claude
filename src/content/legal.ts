// Pages légales. Modèles à faire valider juridiquement ; les champs « À COMPLÉTER » sont à renseigner par Cellulift.
type Section = { h: string; p: string[] };
type Doc = { title: string; updated: string; intro: string; sections: Section[] };

const email = "cellulift@gmail.com";
const address = "N°02 Rue Savoie, Quartier des Hôpitaux, Casablanca, Maroc";

export const privacy: Record<"fr" | "en", Doc> = {
  fr: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : septembre 2026",
    intro:
      "Cellulift attache une grande importance à la protection de vos données personnelles. Cette politique explique quelles données nous collectons sur ce site, pourquoi, et quels sont vos droits, conformément à la loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.",
    sections: [
      { h: "Responsable du traitement", p: [`Cellulift, ${address}. Contact : ${email}.`] },
      {
        h: "Données collectées",
        p: [
          "Formulaire de contact : nom, adresse e-mail, téléphone, activité, objet et contenu de votre message.",
          "Mesure d'audience : statistiques de visite anonymes (pages vues, type d'appareil, pays), sans cookie publicitaire.",
          "Cookies de mesure d'audience détaillée : uniquement si vous les acceptez dans le bandeau cookies.",
        ],
      },
      {
        h: "Finalités",
        p: [
          "Répondre à vos demandes (information, devis, démonstration, formation, support).",
          "Améliorer le site et comprendre comment il est utilisé.",
          "Aucune donnée n'est vendue ni cédée à des tiers à des fins commerciales.",
        ],
      },
      {
        h: "Destinataires",
        p: [
          "Les équipes Cellulift et Cellulift Academy concernées par votre demande.",
          "Nos prestataires techniques, uniquement pour faire fonctionner le site : hébergement (Vercel) et envoi des e-mails du formulaire (Resend).",
        ],
      },
      {
        h: "Durée de conservation",
        p: [
          "Les demandes de contact sont conservées le temps nécessaire à leur traitement et au suivi de la relation commerciale, puis supprimées. À COMPLÉTER : durée précise retenue par Cellulift.",
        ],
      },
      {
        h: "Vos droits",
        p: [
          `Vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données. Pour l'exercer, écrivez-nous à ${email}.`,
          "Vous pouvez également saisir la Commission nationale de contrôle de la protection des données à caractère personnel (CNDP).",
        ],
      },
      {
        h: "Cookies",
        p: [
          "Le site mémorise votre choix concernant les cookies dans votre navigateur. Vous pouvez le modifier à tout moment via le lien « Cookies » en bas de page.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    updated: "Last updated: September 2026",
    intro:
      "Cellulift takes the protection of your personal data seriously. This policy explains what data we collect on this website, why, and your rights, in accordance with Moroccan law no. 09-08 on the protection of individuals with regard to the processing of personal data.",
    sections: [
      { h: "Data controller", p: [`Cellulift, ${address}. Contact: ${email}.`] },
      {
        h: "Data collected",
        p: [
          "Contact form: name, email address, phone, activity, subject and message.",
          "Audience measurement: anonymous visit statistics (pages viewed, device type, country), without advertising cookies.",
          "Detailed analytics cookies: only if you accept them in the cookie banner.",
        ],
      },
      {
        h: "Purposes",
        p: [
          "Answering your requests (information, quote, demonstration, training, support).",
          "Improving the website and understanding how it is used.",
          "No data is sold or transferred to third parties for commercial purposes.",
        ],
      },
      {
        h: "Recipients",
        p: [
          "The Cellulift and Cellulift Academy teams concerned by your request.",
          "Our technical providers, only to run the website: hosting (Vercel) and delivery of contact form emails (Resend).",
        ],
      },
      {
        h: "Retention period",
        p: ["Contact requests are kept as long as needed to handle them and follow up the business relationship, then deleted."],
      },
      {
        h: "Your rights",
        p: [
          `You have the right to access, rectify and object to the processing of your data. To exercise it, write to ${email}.`,
          "You may also contact the Moroccan data protection authority (CNDP).",
        ],
      },
      {
        h: "Cookies",
        p: ["The website stores your cookie choice in your browser. You can change it at any time via the “Cookies” link in the footer."],
      },
    ],
  },
};

export const terms: Record<"fr" | "en", Doc> = {
  fr: {
    title: "Conditions d'utilisation et mentions légales",
    updated: "Dernière mise à jour : septembre 2026",
    intro: "Les présentes conditions encadrent l'utilisation du site Cellulift. En naviguant sur ce site, vous les acceptez.",
    sections: [
      {
        h: "Éditeur du site",
        p: [
          `Cellulift — ${address}.`,
          "À COMPLÉTER : forme juridique, capital, RC, ICE, IF et nom du directeur de la publication.",
          `Contact : ${email} · +212 5 22 49 01 09.`,
        ],
      },
      { h: "Hébergement", p: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis."] },
      {
        h: "Objet du site",
        p: [
          "Le site présente l'offre de Cellulift aux professionnels de santé et de l'esthétique : technologies, formation, installation et support. Les informations sont données à titre indicatif et ne constituent ni une offre contractuelle, ni un avis médical.",
          "Les caractéristiques, indications et conditions de vente de chaque technologie sont précisées sur devis.",
        ],
      },
      {
        h: "Propriété intellectuelle",
        p: [
          "Les textes, visuels, logos et éléments graphiques du site sont la propriété de Cellulift ou de leurs titulaires respectifs, notamment la marque LGL Expert. Toute reproduction sans autorisation écrite est interdite.",
        ],
      },
      {
        h: "Responsabilité",
        p: [
          "Cellulift s'efforce d'assurer l'exactitude des informations publiées, sans pouvoir garantir l'absence d'erreur ou d'interruption du site. Les liens vers des sites tiers n'engagent pas Cellulift.",
        ],
      },
      { h: "Données personnelles", p: ["Voir notre politique de confidentialité."] },
      { h: "Droit applicable", p: ["Les présentes conditions sont soumises au droit marocain. Tout litige relève des tribunaux compétents de Casablanca."] },
    ],
  },
  en: {
    title: "Terms of use and legal notice",
    updated: "Last updated: September 2026",
    intro: "These terms govern the use of the Cellulift website. By browsing this website, you accept them.",
    sections: [
      { h: "Publisher", p: [`Cellulift — ${address}.`, `Contact: ${email} · +212 5 22 49 01 09.`] },
      { h: "Hosting", p: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States."] },
      {
        h: "Purpose of the website",
        p: [
          "The website presents Cellulift's offer to healthcare and aesthetic professionals: technologies, training, installation and support. Information is provided for guidance only and constitutes neither a contractual offer nor medical advice.",
          "Specifications, indications and terms of sale of each technology are provided on quotation.",
        ],
      },
      {
        h: "Intellectual property",
        p: [
          "Texts, visuals, logos and graphic elements of the website are the property of Cellulift or their respective owners, including the LGL Expert brand. Any reproduction without written permission is prohibited.",
        ],
      },
      {
        h: "Liability",
        p: [
          "Cellulift strives to ensure the accuracy of published information but cannot guarantee the absence of errors or interruptions. Links to third-party websites do not engage Cellulift.",
        ],
      },
      { h: "Personal data", p: ["See our privacy policy."] },
      { h: "Governing law", p: ["These terms are governed by Moroccan law. Any dispute falls under the competent courts of Casablanca."] },
    ],
  },
};
