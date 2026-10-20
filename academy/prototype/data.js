// CELLULIFT ACADEMY — prototype sample data.
// Device names and session dates come from cellulift.ma content; course structures,
// learners, figures and most trainers are illustrative.

window.ACADEMY_DATA = (() => {
  const trainers = {
    dadoun: { id: "dadoun", name: "Dr Mohamed Dadoun", title: "Aesthetic physician & laser specialist · Casablanca", initials: "MD" },
    mansouri: { id: "mansouri", name: "Dr Leïla Mansouri", title: "Dermatologist · Rabat (sample trainer)", initials: "LM" },
    idrissi: { id: "idrissi", name: "Karim El Idrissi", title: "Clinical application specialist, CELLULIFT (sample)", initials: "KI" },
    berrada: { id: "berrada", name: "Nadia Berrada", title: "Aesthetic centre consultant (sample)", initials: "NB" },
  };

  const devices = [
    { id: "hanover-5g", name: "HANOVER 5G", family: "Lasers" },
    { id: "la-queen", name: "LA QUEEN", family: "Lasers" },
    { id: "sevenwaves", name: "SEVENWAVES", family: "Lasers" },
    { id: "synergy-plus", name: "SYNERGY+", family: "Lasers" },
    { id: "dermabrasif-6g", name: "DERMABRASIF 6G", family: "Rejuvenation" },
    { id: "centrifugel", name: "CENTRIFUGEL", family: "Rejuvenation" },
    { id: "led-bio-light", name: "LED BIO-LIGHT", family: "Photomodulation" },
    { id: "slimax-lipo-7", name: "SLIMAX LIPO 7", family: "Body contouring" },
    { id: "longishape", name: "LONGISHAPE", family: "Body contouring" },
  ];

  // Module titles → lessons. Durations in minutes.
  const M = (title, lessons) => ({ title, lessons: lessons.map(([t, d, kind = "video"]) => ({ title: t, min: d, kind })) });

  const courses = [
    {
      id: "hanover-5g-operator", title: "HANOVER 5G — Certified Operator Programme", img: "hanover-5g",
      family: "Lasers", device: "HANOVER 5G", trainer: "dadoun", level: "Advanced", format: "Device programme",
      summary: "From physics to protocol: safe, reproducible treatments with the HANOVER 5G platform, including parameter selection by phototype and indication.",
      objectives: ["Explain the laser–tissue interaction behind each handpiece", "Select parameters by Fitzpatrick phototype and indication", "Run the pre-treatment checklist and test spot", "Recognise and manage adverse reactions", "Document treatments and follow-up"],
      access: { rules: ["equipment"], devices: ["hanover-5g"], verifiedOnly: true, professions: ["doctor"] },
      certificate: "completion", passing: 80,
      modules: [
        M("Fundamentals", [["Welcome & how this programme works", 4], ["Laser physics for practitioners", 14], ["Safety, eyewear and treatment room setup", 11]]),
        M("Device mastery", [["Platform tour and handpieces", 12], ["Calibration and daily checks", 8], ["Interface walkthrough", 9]]),
        M("Clinical protocols", [["Patient selection and contraindications", 13], ["Parameters by phototype", 16], ["Test spot and endpoints", 10], ["Protocol sheets", 3, "resource"]]),
        M("Complications", [["Recognising adverse reactions", 12], ["Management and escalation", 10]]),
        M("Assessment", [["Final quiz", 15, "quiz"]]),
      ],
    },
    {
      id: "la-queen-diode", title: "LA QUEEN — Diode Laser Hair Removal Protocols", img: "la-queen",
      family: "Lasers", device: "LA QUEEN", trainer: "idrissi", level: "Intermediate", format: "Device programme",
      summary: "Session planning, fluence and pulse settings, cooling and patient communication for consistent hair removal results.",
      objectives: ["Plan a full course of sessions", "Adapt fluence and pulse width to hair and skin", "Use contact cooling correctly", "Set realistic patient expectations"],
      access: { rules: ["equipment"], devices: ["la-queen"] }, certificate: "completion", passing: 75,
      modules: [
        M("Getting started", [["Diode technology in practice", 10], ["Room and device preparation", 8]]),
        M("Protocols", [["Consultation and consent", 9], ["Settings by zone", 14], ["Session cadence", 7]]),
        M("Assessment", [["Final quiz", 10, "quiz"]]),
      ],
    },
    {
      id: "sevenwaves-mastery", title: "SEVENWAVES — Multi-wavelength Clinical Mastery", img: "sevenwaves",
      family: "Lasers", device: "SEVENWAVES", trainer: "dadoun", level: "Expert", format: "Device programme",
      summary: "Combining wavelengths for pigment, vascular and rejuvenation indications on one platform.",
      objectives: ["Choose wavelength by chromophore", "Build combined protocols", "Treat darker phototypes safely"],
      access: { rules: ["equipment", "manual_only"], devices: ["sevenwaves"], verifiedOnly: true, professions: ["doctor"] }, certificate: "completion", passing: 80,
      modules: [M("Foundations", [["Chromophores and wavelengths", 15], ["Platform overview", 10]]), M("Protocols", [["Pigment", 14], ["Vascular", 13], ["Rejuvenation", 12]]), M("Assessment", [["Final quiz", 12, "quiz"]])],
    },
    {
      id: "hydra-6g-facial", title: "DERMABRASIF 6G — Facial Protocols", img: "dermabrasif-6g",
      family: "Rejuvenation", device: "DERMABRASIF 6G", trainer: "mansouri", level: "Foundation", format: "Device programme",
      summary: "Six-step facial protocols, serum selection and combination with LED for clinics and aesthetic centres.",
      objectives: ["Run the 6-step protocol", "Choose serums by skin type", "Combine with LED photomodulation", "Hygiene and consumables management"],
      access: { rules: ["equipment", "paid"], devices: ["dermabrasif-6g"], price: 1900 }, certificate: "completion", passing: 70,
      modules: [M("Basics", [["Skin assessment", 9], ["Device and consumables", 8]]), M("Protocols", [["The 6-step facial", 16], ["Acne-prone skin", 10], ["Combining with LED", 8]]), M("Assessment", [["Final quiz", 8, "quiz"]])],
    },
    {
      id: "led-fundamentals", title: "LED Photomodulation — Fundamentals", img: "led-bio-light",
      family: "Photomodulation", device: "LED BIO-LIGHT", trainer: "idrissi", level: "Foundation", format: "Module",
      summary: "What light does to skin cells, which wavelengths matter, and how to integrate LED into existing treatments.",
      objectives: ["Explain photobiomodulation in plain terms", "Match wavelength to indication", "Build simple add-on protocols"],
      access: { rules: ["free"] }, certificate: "completion", passing: 70,
      modules: [M("Light and skin", [["Introduction", 5], ["Wavelengths and targets", 11]]), M("In practice", [["Add-on protocols", 9], ["Patient communication", 6]]), M("Check", [["Short quiz", 5, "quiz"]])],
    },
    {
      id: "laser-safety", title: "Laser Safety & Skin Phototypes", img: "synergy-plus",
      family: "Lasers", device: "All energy-based devices", trainer: "mansouri", level: "Foundation", format: "Module",
      summary: "The essentials every practitioner should know before using energy-based devices: phototypes, eyewear, contraindications, documentation.",
      objectives: ["Classify Fitzpatrick phototypes", "Apply eye-safety rules", "Screen contraindications", "Document consent"],
      access: { rules: ["free"] }, certificate: "completion", passing: 70,
      modules: [M("Essentials", [["Why safety comes first", 4], ["Fitzpatrick phototypes", 10], ["Eyewear and room", 8]]), M("Screening", [["Contraindications", 9], ["Consent and records", 7]]), M("Check", [["Short quiz", 6, "quiz"]])],
    },
    {
      id: "body-contouring", title: "Body Contouring — Combining Cryolipolysis & Radiofrequency", img: "slimax-lipo-7",
      family: "Body contouring", device: "SLIMAX LIPO 7", trainer: "idrissi", level: "Intermediate", format: "Masterclass",
      summary: "Designing combined body-contouring programmes, sequencing sessions and measuring results objectively.",
      objectives: ["Sequence cryolipolysis and RF", "Measure results (photos, circumference, composition)", "Design 6- and 10-session programmes"],
      access: { rules: ["paid", "equipment"], devices: ["slimax-lipo-7", "longishape"], price: 1500 }, certificate: "completion", passing: 75,
      modules: [M("Science", [["Adipose tissue basics", 12], ["How each technology acts", 13]]), M("Programmes", [["Combination logic", 14], ["Measuring results", 9]]), M("Assessment", [["Final quiz", 10, "quiz"]])],
    },
    {
      id: "biofiller-vs-ha", title: "Biofiller vs Hyaluronic Acid: Volumisation or Tissue Regeneration?", img: "centrifugel",
      family: "Regenerative", device: "CENTRIFUGEL", trainer: "dadoun", level: "Advanced", format: "Masterclass",
      summary: "Recorded masterclass comparing autologous biofiller preparation with hyaluronic acid: indications, limits and combined approaches.",
      objectives: ["Compare mechanisms of action", "Choose by indication and patient profile", "Prepare autologous biofiller safely"],
      access: { rules: ["paid"], price: 2400, verifiedOnly: true, professions: ["doctor"] }, certificate: "completion", passing: 80,
      modules: [M("Masterclass", [["Mechanisms compared", 22], ["Indications and limits", 18], ["Preparation workflow", 16]]), M("Assessment", [["Final quiz", 10, "quiz"]])],
    },
    {
      id: "profitable-centre", title: "Technology, Pricing & Protocols: Running a High-performing Centre", img: "longishape",
      family: "Business", device: "Practice management", trainer: "berrada", level: "Intermediate", format: "Masterclass",
      summary: "Why some technologies become profitable and others sit unused: positioning, pricing, protocols and team training.",
      objectives: ["Calculate cost per session and break-even", "Price treatment packages", "Plan team training and utilisation"],
      access: { rules: ["paid"], price: 900 }, certificate: "completion", passing: 70,
      modules: [M("Economics", [["Utilisation is everything", 12], ["Cost per session", 11]]), M("Offer", [["Pricing packages", 13], ["Protocols as a product", 10]]), M("Check", [["Short quiz", 6, "quiz"]])],
    },
    {
      id: "rf-physics", title: "Radiofrequency Physics for Practitioners", img: "frequentazia",
      family: "Radiofrequency", device: "RF platforms", trainer: "idrissi", level: "Intermediate", format: "Module",
      summary: "Monopolar, bipolar and multipolar RF explained clearly, with temperature endpoints and safety.",
      objectives: ["Distinguish RF configurations", "Use temperature endpoints", "Avoid burns and hot spots"],
      access: { rules: ["free"], verifiedOnly: true }, certificate: "completion", passing: 70,
      modules: [M("Physics", [["Current, impedance, heat", 12], ["Configurations", 10]]), M("Practice", [["Endpoints", 9], ["Safety", 8]]), M("Check", [["Short quiz", 6, "quiz"]])],
    },
  ];

  // Stable lesson ids
  courses.forEach((c) => {
    let n = 0;
    c.modules.forEach((m, mi) => m.lessons.forEach((l, li) => { l.id = `${mi + 1}.${li + 1}`; l.n = n++; }));
    c.lessonCount = n;
    c.duration = c.modules.reduce((s, m) => s + m.lessons.reduce((a, l) => a + l.min, 0), 0);
  });

  const quizBank = [
    { q: "Before treating a new patient with an energy-based device, which step is mandatory?", o: ["A test spot with documented response", "Doubling the fluence for the first session", "Skipping eyewear for short sessions", "Treating without written consent"], a: 0, e: "A test spot, read at the appropriate interval, is the basis for safe parameter selection." },
    { q: "Fitzpatrick phototype V–VI skin generally requires…", o: ["Higher fluence and shorter pulses", "More conservative settings and longer wavelengths", "No cooling", "The same settings as phototype I"], a: 1, e: "Higher melanin content increases epidermal absorption; settings must be more conservative." },
    { q: "Which item belongs in the treatment record?", o: ["Device, handpiece and parameters used", "Only the patient's name", "The price paid", "Nothing if the session went well"], a: 0, e: "Parameters and endpoints must be documented for follow-up and safety." },
    { q: "Who may wear protective eyewear during laser treatment?", o: ["Only the patient", "Only the operator", "Everyone in the room, with eyewear rated for the wavelength", "Nobody, if the room is dark"], a: 2, e: "Eyewear must match the wavelength and be worn by everyone present." },
    { q: "A CELLULIFT Academy completion certificate is…", o: ["An accredited medical diploma", "Proof of completion of a manufacturer/distributor training programme", "A licence to practise", "Equivalent to CME credits"], a: 1, e: "It attests completion of training. It is not a medical qualification or accredited CME." },
  ];

  const personas = {
    partner: {
      id: "u-4821", key: "partner", name: "Dr Salma Benali", first: "Salma", title: "Dr", initials: "SB", email: "s.benali@clinique-sample.ma",
      profession: "doctor", specialty: "Dermatology", org: "Clinique Lumière (sample)", city: "Casablanca", country: "MA",
      verification: "verified", registration: "CNOM · 12345 (sample)", since: "2025-03-14",
      devices: [{ device: "hanover-5g", serial: "HN5G-24-0187", date: "2025-03-10", clinic: "Clinique Lumière" }, { device: "dermabrasif-6g", serial: "DB6G-23-0412", date: "2024-11-02", clinic: "Clinique Lumière" }],
      entitlements: [
        { course: "hanover-5g-operator", source: "equipment", ref: "HANOVER 5G" },
        { course: "hydra-6g-facial", source: "equipment", ref: "DERMABRASIF 6G" },
        { course: "biofiller-vs-ha", source: "purchase", ref: "Order AC-2026-0193" },
        { course: "laser-safety", source: "free" },
        { course: "led-fundamentals", source: "free" },
      ],
      progress: { "hanover-5g-operator": 6, "hydra-6g-facial": 9, "laser-safety": 7, "led-fundamentals": 2 },
      completed: ["hydra-6g-facial", "laser-safety"],
      pending: [],
    },
    open: {
      id: "u-5307", key: "open", name: "Youssef Amrani", first: "Youssef", title: "", initials: "YA", email: "y.amrani@sample.ma",
      profession: "physiotherapist", specialty: "Physiotherapy", org: "Cabinet Kiné Atlas (sample)", city: "Marrakech", country: "MA",
      verification: "unverified", registration: "", since: "2026-09-02",
      devices: [],
      entitlements: [{ course: "led-fundamentals", source: "free" }],
      progress: { "led-fundamentals": 3 },
      completed: [],
      pending: [{ course: "profitable-centre", reason: "Bank transfer awaiting confirmation" }],
    },
  };

  const certificates = [
    { code: "CA-2026-7F3K-91QD", user: "u-4821", course: "hydra-6g-facial", date: "2026-02-18", score: 92, hours: 1.0 },
    { code: "CA-2026-2M8P-44XA", user: "u-4821", course: "laser-safety", date: "2026-01-09", score: 88, hours: 0.7 },
  ];

  // Real upcoming sessions from cellulift.ma (academy-sessions.ts) + one sample workshop.
  const sessions = [
    { date: "2026-10-26", title: "Technology, pricing & protocols: the 3 levers of a high-performing wellness centre", sub: "Masterclass · Excellia Academy", place: "Casablanca", kind: "Masterclass", seats: null },
    { date: "2026-11-07", title: "Laser × regenerative medicine: can energy potentiate biostimulation?", sub: "Dr Dadoun", place: "Marrakech", kind: "Workshop", seats: null },
    { date: "2026-11-21", title: "HANOVER 5G hands-on practical day (sample)", sub: "Partner workshop · HANOVER 5G owners", place: "CELLULIFT, Casablanca", kind: "Partner", seats: 8, partner: "hanover-5g" },
  ];

  const notifications = {
    partner: [
      { t: "New lesson available", b: "HANOVER 5G · Complications — Management and escalation", when: "2 h", unread: true, link: "#/course/hanover-5g-operator" },
      { t: "Workshop invitation", b: "HANOVER 5G hands-on practical day · 21 Nov", when: "1 d", unread: true, link: "#/sessions" },
      { t: "Certificate issued", b: "DERMABRASIF 6G — Facial Protocols", when: "Feb", unread: false, link: "#/certificates" },
    ],
    open: [
      { t: "Payment pending", b: "Bank transfer for “Running a High-performing Centre” is awaiting confirmation", when: "3 h", unread: true, link: "#/account" },
      { t: "Verify your professional status", b: "Some courses require verification (e.g. RF Physics).", when: "2 d", unread: true, link: "#/account" },
    ],
  };

  // Admin sample data
  const users = [
    { id: "u-4821", name: "Dr Salma Benali", email: "s.benali@clinique-sample.ma", prof: "Doctor · Dermatology", city: "Casablanca", type: "Partner", status: "verified", courses: 5, last: "Today" },
    { id: "u-5307", name: "Youssef Amrani", email: "y.amrani@sample.ma", prof: "Physiotherapist", city: "Marrakech", type: "Open Academy", status: "unverified", courses: 1, last: "Today" },
    { id: "u-5122", name: "Dr Omar Tazi", email: "o.tazi@sample.ma", prof: "Doctor · Aesthetic medicine", city: "Rabat", type: "Partner", status: "verified", courses: 4, last: "Yesterday" },
    { id: "u-5290", name: "Dr Hind Alaoui", email: "h.alaoui@sample.ma", prof: "Doctor · General practice", city: "Tangier", type: "Open Academy", status: "pending", courses: 2, last: "2 d" },
    { id: "u-5301", name: "Imane Chraibi", email: "i.chraibi@sample.ma", prof: "Aesthetician", city: "Agadir", type: "Open Academy", status: "unverified", courses: 3, last: "3 d" },
    { id: "u-5018", name: "Dr Rachid Fassi", email: "r.fassi@sample.ma", prof: "Doctor · Plastic surgery", city: "Fès", type: "Partner", status: "verified", courses: 6, last: "5 d" },
    { id: "u-5311", name: "Dr Aminata Diallo", email: "a.diallo@sample.sn", prof: "Doctor · Dermatology", city: "Dakar", type: "Open Academy", status: "pending", courses: 1, last: "1 d" },
    { id: "u-4977", name: "Sofia Kettani", email: "s.kettani@sample.ma", prof: "Nurse", city: "Casablanca", type: "Partner", status: "verified", courses: 2, last: "1 w" },
  ];

  const verificationQueue = [
    { user: "u-5290", name: "Dr Hind Alaoui", prof: "Doctor · General practice", reg: "CNOM · 48211 (sample)", doc: "registration-card.pdf", submitted: "2 d ago" },
    { user: "u-5311", name: "Dr Aminata Diallo", prof: "Doctor · Dermatology", reg: "ONMS · 2219 (sample)", doc: "attestation.pdf", submitted: "1 d ago" },
  ];

  const sales = [
    { client: "Clinique Lumière", device: "hanover-5g", serial: "HN5G-24-0187", date: "2025-03-10", user: "u-4821", status: "linked" },
    { client: "Clinique Lumière", device: "dermabrasif-6g", serial: "DB6G-23-0412", date: "2024-11-02", user: "u-4821", status: "linked" },
    { client: "Centre Esthétique Tazi", device: "sevenwaves", serial: "SW7-25-0033", date: "2025-06-21", user: "u-5122", status: "linked" },
    { client: "Polyclinique du Nord", device: "la-queen", serial: "LQ-26-0102", date: "2026-10-12", user: null, status: "invite_sent", email: "contact@pdn-sample.ma" },
    { client: "Spa Médical Atlas", device: "slimax-lipo-7", serial: "SL7-26-0098", date: "2026-10-15", user: null, status: "unlinked" },
  ];

  const audit = [
    { at: "2026-10-20 10:42", actor: "Meryem (admin)", action: "entitlement.grant", target: "Dr Omar Tazi → SEVENWAVES programme", note: "Pilot group" },
    { at: "2026-10-20 09:15", actor: "System", action: "protection.alert", target: "u-5018 · 3 countries in 24 h", note: "Open" },
    { at: "2026-10-19 17:03", actor: "Yassine (sales_ops)", action: "device.link", target: "SW7-25-0033 → Dr Omar Tazi", note: "" },
    { at: "2026-10-19 11:28", actor: "Meryem (admin)", action: "user.verify", target: "Sofia Kettani", note: "Registration checked" },
    { at: "2026-10-18 15:50", actor: "Ghita (content_manager)", action: "course.publish", target: "LED Photomodulation — Fundamentals v2", note: "" },
    { at: "2026-10-18 09:01", actor: "System", action: "order.paid", target: "AC-2026-0193 · 2 400 MAD", note: "CMI callback" },
  ];

  const alerts = [
    { user: "Dr Rachid Fassi", id: "u-5018", kind: "Impossible travel", detail: "Fès 08:12 → Paris 09:40 → Fès 10:05", score: "High", when: "Today 09:15" },
    { user: "Imane Chraibi", id: "u-5301", kind: "Too many devices", detail: "5 distinct devices in 30 days (limit 3)", score: "Medium", when: "Yesterday" },
  ];

  return { trainers, devices, courses, quizBank, personas, certificates, sessions, notifications, users, verificationQueue, sales, audit, alerts };
})();
