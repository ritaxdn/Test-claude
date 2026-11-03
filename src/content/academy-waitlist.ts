// Liste d'attente « avant-première » de la plateforme en ligne LIFT by CELLULIFT Academy (cible du teaser vidéo).
// Pas de date annoncée : les inscrits sont prévenus en premier à l'ouverture.
// Rappel de la règle d'accès : les parcours de formation sont réservés aux machines CELLULIFT achetées ;
// rien ici ne promet un accès gratuit ou payant hors machines (prévu plus tard, non encore décidé).

export const waitlistContent = {
  fr: {
    meta: {
      title: "Avant-première LIFT by CELLULIFT Academy : la formation en ligne de vos machines",
      description:
        "Inscrivez-vous à l'avant-première de LIFT by CELLULIFT Academy : parcours vidéo par machine, protocoles et documents. Soyez prévenu(e) en premier à l'ouverture.",
    },
    eyebrow: "LIFT by CELLULIFT Academy · Avant-première",
    title: "La formation de vos machines, sur votre téléphone.",
    subtitle:
      "LIFT by CELLULIFT Academy arrive. Inscrivez-vous à l'avant-première : vous serez parmi les premiers à y entrer.",
    insideTitle: "Ce qui vous attend",
    inside: [
      ["Un parcours par machine", "Les vidéos de prise en main de chaque appareil, dans l'ordre, à votre rythme."],
      ["Présenté par nos experts", "Dr Mohamed Dadoun, Meryem Belkhalfi et Imane Souali."],
      ["Protocoles et documents", "Fiches protocoles, réglages et consignes de sécurité, toujours à portée de main."],
      ["Votre progression", "Reprenez où vous vous êtes arrêté(e) et terminez votre formation."],
    ],
    perksTitle: "En vous inscrivant",
    perks: [
      "Vous êtes prévenu(e) en premier, avant l'ouverture publique.",
      "Clients CELLULIFT : votre accès aux parcours de vos machines dès l'ouverture.",
      "Pas encore client : vous découvrez LIFT et ses nouveautés en avant-première.",
    ],
    note: "Les parcours de formation sont réservés aux machines CELLULIFT que vous possédez.",
    form: {
      title: "Rejoindre l'avant-première",
      text: "Quelques informations, et vous êtes sur la liste.",
      firstName: "Prénom",
      lastName: "Nom",
      email: "E-mail",
      phone: "Téléphone / WhatsApp",
      phoneHint: "Facultatif : pour recevoir l'invitation sur WhatsApp.",
      specialty: "Votre activité",
      specialtyPlaceholder: "Sélectionnez",
      client: "Êtes-vous déjà client CELLULIFT ?",
      clientYes: "Oui, j'ai une machine CELLULIFT",
      clientNo: "Pas encore",
      machine: "Votre machine",
      machinePlaceholder: "Sélectionnez (facultatif)",
      submit: "Je m'inscris",
      submitting: "Un instant…",
      requiredError: "Ce champ est requis.",
      emailError: "Adresse e-mail invalide.",
      phoneError: "Numéro invalide.",
      sendError: "L'inscription n'a pas pu être enregistrée. Réessayez dans un instant.",
      successTitle: "Vous êtes sur la liste.",
      successText: "Merci ! Vous serez prévenu(e) en premier à l'ouverture de LIFT by CELLULIFT Academy.",
      back: "Découvrir nos masterclasses",
      privacy: "Vos coordonnées servent uniquement à vous prévenir de l'ouverture de LIFT. Jamais revendues. Désinscription en un clic.",
    },
  },
  en: {
    meta: {
      title: "LIFT by CELLULIFT Academy early access: online training for your devices",
      description:
        "Join the early-access list for LIFT by CELLULIFT Academy: video courses for each device, protocols and documents. Be the first to know when it opens.",
    },
    eyebrow: "LIFT by CELLULIFT Academy · Early access",
    title: "Training for your devices, on your phone.",
    subtitle: "LIFT by CELLULIFT Academy is coming. Join the early-access list and be among the first to get in.",
    insideTitle: "What's coming",
    inside: [
      ["One course per device", "Hands-on videos for each device, in order, at your own pace."],
      ["Presented by our experts", "Dr Mohamed Dadoun, Meryem Belkhalfi and Imane Souali."],
      ["Protocols and documents", "Protocol sheets, settings and safety guidelines, always at hand."],
      ["Your progress", "Pick up where you left off and complete your training."],
    ],
    perksTitle: "When you sign up",
    perks: [
      "You hear first, before the public opening.",
      "CELLULIFT clients: access to your devices' courses from day one.",
      "Not a client yet: discover LIFT and what's new before anyone else.",
    ],
    note: "Training courses are reserved for the CELLULIFT devices you own.",
    form: {
      title: "Join early access",
      text: "A few details and you're on the list.",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone / WhatsApp",
      phoneHint: "Optional: to receive the invitation on WhatsApp.",
      specialty: "Your practice",
      specialtyPlaceholder: "Select",
      client: "Are you already a CELLULIFT client?",
      clientYes: "Yes, I own a CELLULIFT device",
      clientNo: "Not yet",
      machine: "Your device",
      machinePlaceholder: "Select (optional)",
      submit: "Sign me up",
      submitting: "One moment…",
      requiredError: "This field is required.",
      emailError: "Invalid email address.",
      phoneError: "Invalid number.",
      sendError: "Your sign-up could not be saved. Please try again in a moment.",
      successTitle: "You're on the list.",
      successText: "Thank you! You'll be the first to know when LIFT by CELLULIFT Academy opens.",
      back: "Discover our masterclasses",
      privacy: "Your details are only used to let you know when LIFT opens. Never sold. Unsubscribe in one click.",
    },
  },
} as const;

export type WaitlistFormText = (typeof waitlistContent)["fr"]["form"] | (typeof waitlistContent)["en"]["form"];
