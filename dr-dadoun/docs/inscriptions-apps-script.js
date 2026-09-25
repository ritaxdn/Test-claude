/**
 * Inscriptions aux formations — script Google Apps Script
 *
 * À coller dans le Google Sheet des formations : Extensions → Apps Script.
 * Le Sheet contient deux onglets :
 *   « Événements »   : id | debut | dates | formation | titre | lieu | modalites | places | statut | lien
 *   « Inscriptions » : rempli automatiquement par le site (une ligne par participant)
 *
 * 1. Remplacer CLE_SECRETE ci-dessous par un mot de passe long (le même que FORMATIONS_SCRIPT_KEY dans Vercel).
 * 2. Déployer → Nouveau déploiement → Application Web
 *      Exécuter en tant que : Moi · Qui a accès : Tout le monde
 * 3. Copier l'URL de l'application Web dans Vercel : FORMATIONS_SCRIPT_URL.
 */

const CLE_SECRETE = "remplacer-par-un-mot-de-passe-long";
const FUSEAU = "Africa/Casablanca";
const COLONNES_INSCRIPTIONS = [
  "date_inscription", "evenement_id", "evenement", "dates", "prenom", "nom",
  "specialite", "email", "telephone", "ville", "numero_ordre", "statut",
];

function doGet(e) {
  if (e.parameter.key !== CLE_SECRETE) return json({ error: "unauthorized" });
  return json({ events: listerEvenements() });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  if (body.key !== CLE_SECRETE) return json({ error: "unauthorized" });

  // Un seul enregistrement à la fois : évite de dépasser le nombre de places.
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const evt = listerEvenements().find((x) => String(x.id) === String(body.eventId));
    if (!evt) return json({ error: "not_found" });
    if (evt.complet) return json({ error: "full" });

    const feuille = onglet("Inscriptions", COLONNES_INSCRIPTIONS);
    const email = String(body.email || "").toLowerCase();
    const deja = lignes(feuille).some(
      (r) => String(r.evenement_id) === String(evt.id) && String(r.email).toLowerCase() === email && !annule(r),
    );
    if (deja) return json({ error: "already" });

    feuille.appendRow([
      Utilities.formatDate(new Date(), FUSEAU, "yyyy-MM-dd HH:mm"),
      evt.id, evt.titre || evt.formation, evt.dates,
      body.firstName, body.lastName, body.profession, email, body.phone, body.city, body.ordre || "",
      "inscrit",
    ]);
    const restantes = evt.places ? Number(evt.places) - evt.inscrits - 1 : null;
    return json({ ok: true, remaining: restantes });
  } finally {
    lock.releaseLock();
  }
}

function listerEvenements() {
  const inscrits = {};
  lignes(onglet("Inscriptions", COLONNES_INSCRIPTIONS)).forEach((r) => {
    if (!annule(r)) inscrits[r.evenement_id] = (inscrits[r.evenement_id] || 0) + 1;
  });
  return lignes(onglet("Événements"))
    .filter((r) => r.id !== "" && r.id !== undefined)
    .map((r) => {
      const n = inscrits[r.id] || 0;
      const places = r.places === "" ? null : Number(r.places);
      return {
        id: String(r.id),
        debut: r.debut instanceof Date ? Utilities.formatDate(r.debut, FUSEAU, "yyyy-MM-dd") : String(r.debut || ""),
        dates: String(r.dates || ""),
        formation: String(r.formation || ""),
        titre: String(r.titre || ""),
        lieu: String(r.lieu || ""),
        modalites: String(r.modalites || ""),
        places: places,
        inscrits: n,
        complet: String(r.statut || "").toLowerCase().indexOf("complet") === 0 || (places !== null && n >= places),
        lien: String(r.lien || ""),
      };
    });
}

function annule(r) {
  return String(r.statut || "").toLowerCase().indexOf("annul") === 0;
}

function onglet(nom, entetes) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let f = ss.getSheetByName(nom);
  if (!f) {
    f = ss.insertSheet(nom);
    if (entetes) f.appendRow(entetes);
  }
  return f;
}

function lignes(feuille) {
  const valeurs = feuille.getDataRange().getValues();
  if (valeurs.length < 2) return [];
  const cles = valeurs[0].map((h) =>
    String(h).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(),
  );
  return valeurs.slice(1).map((ligne) => {
    const o = {};
    cles.forEach((k, i) => (o[k] = ligne[i]));
    return o;
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
