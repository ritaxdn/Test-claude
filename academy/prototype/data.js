// CELLULIFT ACADEMY — données d'exemple du prototype.
// Les noms de machines et les dates de sessions viennent de cellulift.ma ; les structures de cours,
// les apprenants et les chiffres sont illustratifs. Les présentateurs sont les vrais (Dr Dadoun, Meryem Belkhalfi,
// Imane Souali) ; leur attribution à chaque cours d'exemple est illustrative.

window.ACADEMY_DATA = (() => {
  const trainers = {
    dadoun: { id: "dadoun", name: "Dr Mohamed Dadoun", title: "Médecin esthétique & lasériste · Casablanca", initials: "MD" },
    belkhalfi: { id: "belkhalfi", name: "Meryem Belkhalfi", title: "Présentatrice · CELLULIFT Academy", initials: "MB" },
    souali: { id: "souali", name: "Imane Souali", title: "Présentatrice · CELLULIFT Academy", initials: "IS" },
  };

  const devices = [
    { id: "hanover-5g", name: "HANOVER 5G", family: "Lasers" },
    { id: "la-queen", name: "LA QUEEN", family: "Lasers" },
    { id: "sevenwaves", name: "SEVENWAVES", family: "Lasers" },
    { id: "synergy-plus", name: "SYNERGY+", family: "Lasers" },
    { id: "dermabrasif-6g", name: "DERMABRASIF 6G", family: "Rajeunissement" },
    { id: "centrifugel", name: "CENTRIFUGEL", family: "Rajeunissement" },
    { id: "led-bio-light", name: "LED BIO-LIGHT", family: "Photomodulation" },
    { id: "slimax-lipo-7", name: "SLIMAX LIPO 7", family: "Remodelage corporel" },
    { id: "longishape", name: "LONGISHAPE", family: "Remodelage corporel" },
  ];

  // Titres de modules → leçons. Durées en minutes.
  const M = (title, lessons) => ({ title, lessons: lessons.map(([t, d, kind = "video"]) => ({ title: t, min: d, kind })) });

  const courses = [
    {
      id: "hanover-5g-operator", title: "HANOVER 5G — Programme opérateur certifié", img: "hanover-5g",
      family: "Lasers", device: "HANOVER 5G", trainer: "dadoun", level: "Avancé", format: "Programme machine",
      summary: "De la physique au protocole : des traitements sûrs et reproductibles avec la plateforme HANOVER 5G, y compris le choix des paramètres selon le phototype et l'indication.",
      objectives: ["Expliquer l'interaction laser–tissu propre à chaque pièce à main", "Choisir les paramètres selon le phototype de Fitzpatrick et l'indication", "Réaliser la check-list pré-traitement et le spot test", "Reconnaître et prendre en charge les effets indésirables", "Documenter les traitements et le suivi"],
      access: { rules: ["equipment"], devices: ["hanover-5g"], verifiedOnly: true, professions: ["doctor"] },
      certificate: "completion", passing: 80,
      modules: [
        M("Fondamentaux", [["Bienvenue & fonctionnement du programme", 4], ["Physique du laser pour praticiens", 14], ["Sécurité, lunettes et préparation de la salle", 11]]),
        M("Maîtrise de la machine", [["Présentation de la plateforme et des pièces à main", 12], ["Calibration et contrôles quotidiens", 8], ["Prise en main de l'interface", 9]]),
        M("Protocoles cliniques", [["Sélection des patients et contre-indications", 13], ["Paramètres par phototype", 16], ["Spot test et critères de fin de traitement", 10], ["Fiches protocoles", 3, "resource"]]),
        M("Complications", [["Reconnaître les effets indésirables", 12], ["Prise en charge et orientation", 10]]),
        M("Évaluation", [["Quiz final", 15, "quiz"]]),
      ],
    },
    {
      id: "la-queen-diode", title: "LA QUEEN — Protocoles d'épilation au laser diode", img: "la-queen",
      family: "Lasers", device: "LA QUEEN", trainer: "souali", level: "Intermédiaire", format: "Programme machine",
      summary: "Planification des séances, réglages de fluence et de durée d'impulsion, refroidissement et communication patient pour des résultats d'épilation réguliers.",
      objectives: ["Planifier un cycle complet de séances", "Adapter fluence et durée d'impulsion au poil et à la peau", "Utiliser correctement le refroidissement par contact", "Fixer des attentes réalistes avec le patient"],
      access: { rules: ["equipment"], devices: ["la-queen"] }, certificate: "completion", passing: 75,
      modules: [
        M("Prise en main", [["La technologie diode en pratique", 10], ["Préparation de la salle et de la machine", 8]]),
        M("Protocoles", [["Consultation et consentement", 9], ["Réglages par zone", 14], ["Rythme des séances", 7]]),
        M("Évaluation", [["Quiz final", 10, "quiz"]]),
      ],
    },
    {
      id: "sevenwaves-mastery", title: "SEVENWAVES — Maîtrise clinique multi-longueurs d'onde", img: "sevenwaves",
      family: "Lasers", device: "SEVENWAVES", trainer: "dadoun", level: "Expert", format: "Programme machine",
      summary: "Combiner les longueurs d'onde pour les indications pigmentaires, vasculaires et de rajeunissement sur une seule plateforme.",
      objectives: ["Choisir la longueur d'onde selon le chromophore", "Construire des protocoles combinés", "Traiter les phototypes foncés en sécurité"],
      access: { rules: ["equipment", "manual_only"], devices: ["sevenwaves"], verifiedOnly: true, professions: ["doctor"] }, certificate: "completion", passing: 80,
      modules: [M("Bases", [["Chromophores et longueurs d'onde", 15], ["Présentation de la plateforme", 10]]), M("Protocoles", [["Pigmentaire", 14], ["Vasculaire", 13], ["Rajeunissement", 12]]), M("Évaluation", [["Quiz final", 12, "quiz"]])],
    },
    {
      id: "hydra-6g-facial", title: "DERMABRASIF 6G — Protocoles visage", img: "dermabrasif-6g",
      family: "Rajeunissement", device: "DERMABRASIF 6G", trainer: "belkhalfi", level: "Fondamental", format: "Programme machine",
      summary: "Protocoles visage en six étapes, choix des sérums et association avec la LED pour cliniques et centres esthétiques.",
      objectives: ["Réaliser le protocole en 6 étapes", "Choisir les sérums selon le type de peau", "Associer la photomodulation LED", "Gérer l'hygiène et les consommables"],
      access: { rules: ["equipment", "paid"], devices: ["dermabrasif-6g"], price: 1900 }, certificate: "completion", passing: 70,
      modules: [M("Bases", [["Diagnostic de peau", 9], ["Machine et consommables", 8]]), M("Protocoles", [["Le soin visage en 6 étapes", 16], ["Peaux à tendance acnéique", 10], ["Association avec la LED", 8]]), M("Évaluation", [["Quiz final", 8, "quiz"]])],
    },
    {
      id: "led-fundamentals", title: "Photomodulation LED — Les fondamentaux", img: "led-bio-light",
      family: "Photomodulation", device: "LED BIO-LIGHT", trainer: "souali", level: "Fondamental", format: "Module",
      summary: "Ce que la lumière produit sur les cellules de la peau, les longueurs d'onde qui comptent et comment intégrer la LED aux soins existants.",
      objectives: ["Expliquer simplement la photobiomodulation", "Associer longueur d'onde et indication", "Construire des protocoles complémentaires simples"],
      access: { rules: ["free"] }, certificate: "completion", passing: 70,
      modules: [M("Lumière et peau", [["Introduction", 5], ["Longueurs d'onde et cibles", 11]]), M("En pratique", [["Protocoles complémentaires", 9], ["Communication patient", 6]]), M("Vérification", [["Quiz court", 5, "quiz"]])],
    },
    {
      id: "laser-safety", title: "Sécurité laser & phototypes cutanés", img: "synergy-plus",
      family: "Lasers", device: "Toutes technologies à énergie", trainer: "belkhalfi", level: "Fondamental", format: "Module",
      summary: "L'essentiel à connaître avant d'utiliser une technologie à énergie : phototypes, lunettes de protection, contre-indications, traçabilité.",
      objectives: ["Classer les phototypes de Fitzpatrick", "Appliquer les règles de protection oculaire", "Dépister les contre-indications", "Documenter le consentement"],
      access: { rules: ["free"] }, certificate: "completion", passing: 70,
      modules: [M("L'essentiel", [["Pourquoi la sécurité d'abord", 4], ["Phototypes de Fitzpatrick", 10], ["Lunettes et salle", 8]]), M("Dépistage", [["Contre-indications", 9], ["Consentement et dossier", 7]]), M("Vérification", [["Quiz court", 6, "quiz"]])],
    },
    {
      id: "body-contouring", title: "Remodelage corporel — Associer cryolipolyse & radiofréquence", img: "slimax-lipo-7",
      family: "Remodelage corporel", device: "SLIMAX LIPO 7", trainer: "souali", level: "Intermédiaire", format: "Masterclass",
      summary: "Concevoir des programmes de remodelage combinés, enchaîner les séances et mesurer objectivement les résultats.",
      objectives: ["Enchaîner cryolipolyse et RF", "Mesurer les résultats (photos, périmètres, composition corporelle)", "Concevoir des programmes de 6 et 10 séances"],
      access: { rules: ["paid", "equipment"], devices: ["slimax-lipo-7", "longishape"], price: 1500 }, certificate: "completion", passing: 75,
      modules: [M("Science", [["Bases du tissu adipeux", 12], ["Mode d'action de chaque technologie", 13]]), M("Programmes", [["Logique d'association", 14], ["Mesurer les résultats", 9]]), M("Évaluation", [["Quiz final", 10, "quiz"]])],
    },
    {
      id: "biofiller-vs-ha", title: "Biofiller vs acide hyaluronique : volumisation ou régénération tissulaire ?", img: "centrifugel",
      family: "Régénératif", device: "CENTRIFUGEL", trainer: "dadoun", level: "Avancé", format: "Masterclass",
      summary: "Masterclass enregistrée comparant la préparation d'un biofiller autologue et l'acide hyaluronique : indications, limites et approches combinées.",
      objectives: ["Comparer les mécanismes d'action", "Choisir selon l'indication et le profil patient", "Préparer un biofiller autologue en sécurité"],
      access: { rules: ["paid"], price: 2400, verifiedOnly: true, professions: ["doctor"] }, certificate: "completion", passing: 80,
      modules: [M("Masterclass", [["Mécanismes comparés", 22], ["Indications et limites", 18], ["Protocole de préparation", 16]]), M("Évaluation", [["Quiz final", 10, "quiz"]])],
    },
    {
      id: "profitable-centre", title: "Technologie, pricing & protocoles : piloter un centre performant", img: "longishape",
      family: "Gestion de centre", device: "Gestion de cabinet", trainer: "belkhalfi", level: "Intermédiaire", format: "Masterclass",
      summary: "Pourquoi certaines technologies deviennent rentables et d'autres restent inutilisées : positionnement, prix, protocoles et formation des équipes.",
      objectives: ["Calculer le coût par séance et le seuil de rentabilité", "Fixer le prix des forfaits", "Planifier la formation de l'équipe et l'utilisation des machines"],
      access: { rules: ["paid"], price: 900 }, certificate: "completion", passing: 70,
      modules: [M("Économie", [["Le taux d'utilisation fait tout", 12], ["Coût par séance", 11]]), M("Offre", [["Construire des forfaits", 13], ["Le protocole comme produit", 10]]), M("Vérification", [["Quiz court", 6, "quiz"]])],
    },
    {
      id: "rf-physics", title: "Physique de la radiofréquence pour praticiens", img: "frequentazia",
      family: "Radiofréquence", device: "Plateformes RF", trainer: "souali", level: "Intermédiaire", format: "Module",
      summary: "RF monopolaire, bipolaire et multipolaire expliquées clairement, avec les critères de température et la sécurité.",
      objectives: ["Distinguer les configurations RF", "Utiliser les critères de température", "Éviter brûlures et points chauds"],
      access: { rules: ["free"], verifiedOnly: true }, certificate: "completion", passing: 70,
      modules: [M("Physique", [["Courant, impédance, chaleur", 12], ["Configurations", 10]]), M("Pratique", [["Critères cliniques", 9], ["Sécurité", 8]]), M("Vérification", [["Quiz court", 6, "quiz"]])],
    },
  ];

  // Identifiants de leçons stables
  courses.forEach((c) => {
    let n = 0;
    c.modules.forEach((m, mi) => m.lessons.forEach((l, li) => { l.id = `${mi + 1}.${li + 1}`; l.n = n++; }));
    c.lessonCount = n;
    c.duration = c.modules.reduce((s, m) => s + m.lessons.reduce((a, l) => a + l.min, 0), 0);
  });

  const quizBank = [
    { q: "Avant de traiter un nouveau patient avec une technologie à énergie, quelle étape est obligatoire ?", o: ["Un spot test avec réponse documentée", "Doubler la fluence à la première séance", "Se passer de lunettes pour les séances courtes", "Traiter sans consentement écrit"], a: 0, e: "Le spot test, lu au délai adapté, est la base d'un choix de paramètres sûr." },
    { q: "Une peau de phototype V–VI de Fitzpatrick demande en général…", o: ["Une fluence plus élevée et des impulsions plus courtes", "Des réglages plus prudents et des longueurs d'onde plus longues", "Aucun refroidissement", "Les mêmes réglages qu'un phototype I"], a: 1, e: "La mélanine plus abondante augmente l'absorption épidermique : les réglages doivent être plus prudents." },
    { q: "Quel élément doit figurer dans le dossier de traitement ?", o: ["La machine, la pièce à main et les paramètres utilisés", "Seulement le nom du patient", "Le prix payé", "Rien si la séance s'est bien passée"], a: 0, e: "Les paramètres et critères de fin doivent être documentés pour le suivi et la sécurité." },
    { q: "Qui doit porter des lunettes de protection pendant un traitement laser ?", o: ["Uniquement le patient", "Uniquement l'opérateur", "Toutes les personnes présentes, avec des lunettes adaptées à la longueur d'onde", "Personne, si la salle est sombre"], a: 2, e: "Les lunettes doivent correspondre à la longueur d'onde et être portées par toutes les personnes présentes." },
    { q: "Un certificat CELLULIFT Academy de fin de formation est…", o: ["Un diplôme médical accrédité", "La preuve qu'un programme de formation fabricant/distributeur a été suivi", "Une autorisation d'exercer", "L'équivalent de crédits de FMC"], a: 1, e: "Il atteste le suivi d'une formation. Ce n'est ni une qualification médicale ni une FMC accréditée." },
  ];

  const personas = {
    partner: {
      id: "u-4821", key: "partner", name: "Dr Salma Benali", first: "Salma", title: "Dr", initials: "SB", email: "s.benali@clinique-sample.ma",
      profession: "doctor", specialty: "Dermatologie", org: "Clinique Lumière (exemple)", city: "Casablanca", country: "MA",
      verification: "verified", registration: "CNOM · 12345 (exemple)", since: "2025-03-14",
      devices: [{ device: "hanover-5g", serial: "HN5G-24-0187", date: "2025-03-10", clinic: "Clinique Lumière" }, { device: "dermabrasif-6g", serial: "DB6G-23-0412", date: "2024-11-02", clinic: "Clinique Lumière" }],
      entitlements: [
        { course: "hanover-5g-operator", source: "equipment", ref: "HANOVER 5G" },
        { course: "hydra-6g-facial", source: "equipment", ref: "DERMABRASIF 6G" },
        { course: "biofiller-vs-ha", source: "purchase", ref: "Commande AC-2026-0193" },
        { course: "laser-safety", source: "free" },
        { course: "led-fundamentals", source: "free" },
      ],
      progress: { "hanover-5g-operator": 6, "hydra-6g-facial": 9, "laser-safety": 7, "led-fundamentals": 2 },
      completed: ["hydra-6g-facial", "laser-safety"],
      pending: [],
    },
    open: {
      id: "u-5307", key: "open", name: "Youssef Amrani", first: "Youssef", title: "", initials: "YA", email: "y.amrani@sample.ma",
      profession: "physiotherapist", specialty: "Kinésithérapie", org: "Cabinet Kiné Atlas (exemple)", city: "Marrakech", country: "MA",
      verification: "unverified", registration: "", since: "2026-09-02",
      devices: [],
      entitlements: [{ course: "led-fundamentals", source: "free" }],
      progress: { "led-fundamentals": 3 },
      completed: [],
      pending: [{ course: "profitable-centre", reason: "Virement bancaire en attente de confirmation" }],
    },
  };

  const certificates = [
    { code: "CA-2026-7F3K-91QD", user: "u-4821", course: "hydra-6g-facial", date: "2026-02-18", score: 92, hours: 1.0 },
    { code: "CA-2026-2M8P-44XA", user: "u-4821", course: "laser-safety", date: "2026-01-09", score: 88, hours: 0.7 },
  ];

  // Sessions réelles de cellulift.ma (academy-sessions.ts) + un atelier d'exemple.
  const sessions = [
    { date: "2026-10-26", title: "Technologie, pricing & protocoles : les 3 leviers d'un centre de bien-être performant", sub: "Masterclass Excellia Academy", place: "Casablanca", kind: "Masterclass", seats: null },
    { date: "2026-11-07", title: "Laser × médecine régénérative : l'énergie peut-elle potentialiser la biostimulation ?", sub: "Dr Dadoun", place: "Marrakech", kind: "Atelier", seats: null },
    { date: "2026-11-21", title: "Journée pratique HANOVER 5G (exemple)", sub: "Atelier partenaires · propriétaires HANOVER 5G", place: "CELLULIFT, Casablanca", kind: "Partenaire", seats: 8, partner: "hanover-5g" },
  ];

  const notifications = {
    partner: [
      { t: "Nouvelle leçon disponible", b: "HANOVER 5G · Complications — Prise en charge et orientation", when: "2 h", unread: true, link: "#/course/hanover-5g-operator" },
      { t: "Invitation à un atelier", b: "Journée pratique HANOVER 5G · 21 nov.", when: "1 j", unread: true, link: "#/sessions" },
      { t: "Certificat délivré", b: "DERMABRASIF 6G — Protocoles visage", when: "févr.", unread: false, link: "#/certificates" },
    ],
    open: [
      { t: "Paiement en attente", b: "Le virement pour « Piloter un centre performant » attend sa confirmation", when: "3 h", unread: true, link: "#/account" },
      { t: "Faites vérifier votre statut professionnel", b: "Certains cours l'exigent (ex. Physique de la radiofréquence).", when: "2 j", unread: true, link: "#/account" },
    ],
  };

  // Données d'exemple de l'administration
  const users = [
    { id: "u-4821", name: "Dr Salma Benali", email: "s.benali@clinique-sample.ma", prof: "Médecin · Dermatologie", city: "Casablanca", type: "Partenaire", status: "verified", courses: 5, last: "Aujourd'hui" },
    { id: "u-5307", name: "Youssef Amrani", email: "y.amrani@sample.ma", prof: "Kinésithérapeute", city: "Marrakech", type: "Open Academy", status: "unverified", courses: 1, last: "Aujourd'hui" },
    { id: "u-5122", name: "Dr Omar Tazi", email: "o.tazi@sample.ma", prof: "Médecin · Médecine esthétique", city: "Rabat", type: "Partenaire", status: "verified", courses: 4, last: "Hier" },
    { id: "u-5290", name: "Dr Hind Alaoui", email: "h.alaoui@sample.ma", prof: "Médecin · Médecine générale", city: "Tanger", type: "Open Academy", status: "pending", courses: 2, last: "2 j" },
    { id: "u-5301", name: "Nora Chraibi", email: "n.chraibi@sample.ma", prof: "Esthéticienne", city: "Agadir", type: "Open Academy", status: "unverified", courses: 3, last: "3 j" },
    { id: "u-5018", name: "Dr Rachid Fassi", email: "r.fassi@sample.ma", prof: "Médecin · Chirurgie plastique", city: "Fès", type: "Partenaire", status: "verified", courses: 6, last: "5 j" },
    { id: "u-5311", name: "Dr Aminata Diallo", email: "a.diallo@sample.sn", prof: "Médecin · Dermatologie", city: "Dakar", type: "Open Academy", status: "pending", courses: 1, last: "1 j" },
    { id: "u-4977", name: "Sofia Kettani", email: "s.kettani@sample.ma", prof: "Infirmière", city: "Casablanca", type: "Partenaire", status: "verified", courses: 2, last: "1 sem." },
  ];

  const verificationQueue = [
    { user: "u-5290", name: "Dr Hind Alaoui", prof: "Médecin · Médecine générale", reg: "CNOM · 48211 (exemple)", doc: "carte-ordre.pdf", submitted: "il y a 2 j" },
    { user: "u-5311", name: "Dr Aminata Diallo", prof: "Médecin · Dermatologie", reg: "ONMS · 2219 (exemple)", doc: "attestation.pdf", submitted: "il y a 1 j" },
  ];

  const sales = [
    { client: "Clinique Lumière", device: "hanover-5g", serial: "HN5G-24-0187", date: "2025-03-10", user: "u-4821", status: "linked", src: "crm", rep: "Yassine B." },
    { client: "Clinique Lumière", device: "dermabrasif-6g", serial: "DB6G-23-0412", date: "2024-11-02", user: "u-4821", status: "linked", src: "crm", rep: "Yassine B." },
    { client: "Centre Esthétique Tazi", device: "sevenwaves", serial: "SW7-25-0033", date: "2025-06-21", user: "u-5122", status: "linked", src: "crm", rep: "Salma K." },
    { client: "Polyclinique du Nord", device: "la-queen", serial: "LQ-26-0102", date: "2026-10-12", user: null, status: "invite_sent", email: "contact@pdn-sample.ma", src: "crm", rep: "Mehdi R." },
    { client: "Spa Médical Atlas", device: "slimax-lipo-7", serial: "SL7-26-0098", date: "2026-10-15", user: null, status: "unlinked", src: "manual" },
  ];

  // Installations en attente côté CRM : arrivent au prochain « Synchroniser » (exemples).
  const crmIncoming = [
    { client: "Cabinet Dr Alaoui", device: "la-queen", serial: "LQ-26-0117", date: "2026-10-19", email: "h.alaoui@sample.ma", src: "crm", rep: "Mehdi R." },
    { client: "Centre Beauté Oasis", device: "led-bio-light", serial: "LBL-26-0240", date: "2026-10-20", email: "", src: "crm", rep: "Salma K." },
    { client: "Clinique Ibn Rochd (exemple)", device: "hanover-5g", serial: "HN5G-26-0201", date: "2026-10-20", email: "direction@ibnrochd-sample.ma", src: "crm", rep: "Yassine B." },
  ];

  const audit = [
    { at: "2026-10-20 10:42", actor: "Admin (exemple)", action: "entitlement.grant", target: "Dr Omar Tazi → programme SEVENWAVES", note: "Groupe pilote" },
    { at: "2026-10-20 09:15", actor: "Système", action: "protection.alert", target: "u-5018 · 3 pays en 24 h", note: "Ouverte" },
    { at: "2026-10-19 17:03", actor: "Yassine (sales_ops)", action: "device.link", target: "SW7-25-0033 → Dr Omar Tazi", note: "" },
    { at: "2026-10-19 11:28", actor: "Admin (exemple)", action: "user.verify", target: "Sofia Kettani", note: "Inscription vérifiée" },
    { at: "2026-10-18 15:50", actor: "Ghita (content_manager)", action: "course.publish", target: "Photomodulation LED — Les fondamentaux v2", note: "" },
    { at: "2026-10-18 09:01", actor: "Système", action: "order.paid", target: "AC-2026-0193 · 2 400 MAD", note: "Retour CMI" },
  ];

  const alerts = [
    { user: "Dr Rachid Fassi", id: "u-5018", kind: "Déplacement impossible", detail: "Fès 08:12 → Paris 09:40 → Fès 10:05", score: "Élevée", when: "Aujourd'hui 09:15" },
    { user: "Nora Chraibi", id: "u-5301", kind: "Trop d'appareils", detail: "5 appareils différents en 30 jours (limite : 3)", score: "Moyenne", when: "Hier" },
  ];

  return { trainers, devices, courses, quizBank, personas, certificates, sessions, notifications, users, verificationQueue, sales, crmIncoming, audit, alerts };
})();
