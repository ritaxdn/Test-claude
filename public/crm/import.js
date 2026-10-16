/* Import des exports de l'ancien CRM (fichiers « contacts - export.xlsx »).
   Lecture des colonnes, nettoyage, segments A/B/C élargis, dédoublonnage par téléphone.
   Chargé à la demande par /crm (aucune donnée ne quitte le navigateur avant l'import). */
(function (root) {
  "use strict";

  const clean = (v) => (v == null ? "" : String(v).replace(/\s+/g, " ").trim());
  const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // Met en forme uniquement les mots tout en majuscules ou tout en minuscules.
  function nameCase(s) {
    return clean(s).split(" ").map((w) => {
      if (!w) return w;
      if (/^(dr|pr|prof)\.?$/i.test(w)) return w[0].toUpperCase() + w.slice(1).toLowerCase();
      const up = w === w.toUpperCase(), low = w === w.toLowerCase();
      if (!(up || low) || w.length <= 1) return w;
      return w.toLowerCase().replace(/(^|[-'’])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
    }).join(" ");
  }

  function normPhone(v) {
    let d = clean(v).replace(/\D/g, "");
    if (d.startsWith("00212")) d = d.slice(5);
    else if (d.startsWith("212") && d.length >= 11) d = d.slice(3);
    if (d.length === 10 && d[0] === "0" && d[1] === "0") d = d.slice(1);
    if (d.length === 9 && /^[5-7]/.test(d)) d = "0" + d;
    if (d.length === 10 && d[0] === "0" && d[1] === "0") d = d.slice(1);
    return d;
  }
  // Numéro exploitable pour dédoublonner : 10 chiffres marocains, pas un numéro bidon (0600000000, 0666666666…).
  const realPhone = (d) => /^0[5-8]\d{8}$/.test(d) && !/(\d)\1{5,}/.test(d) && !/^0[5-8](0{4,}|12345)/.test(d);
  const fmtPhone = (d) => (d.length === 10 ? d.replace(/(\d{2})(?=\d)/g, "$1 ").trim() : d);

  const CITY = {
    "casa": "Casablanca", "casa anfa": "Casablanca", "casablanca hay mohammedi": "Casablanca", "casablanca maarif": "Casablanca",
    "marrakech medina": "Marrakech", "rabat agdal": "Rabat", "fes vn": "Fès", "fes": "Fès", "sale": "Salé",
    "khourigba": "Khouribga", "khouribga": "Khouribga", "laayoune": "Laâyoune", "temara": "Témara", "assilah": "Asilah",
    "meknes": "Meknès", "tetouan": "Tétouan", "kenitra": "Kénitra", "el jadida": "El Jadida", "al hoceima": "Al Hoceïma",
    "beni mellal": "Béni Mellal", "kelaat sraghna": "El Kelâa des Sraghna", "oued zem": "Oued Zem", "tanger": "Tanger",
  };
  const QUARTIER = { "casa anfa": "Anfa", "casablanca hay mohammedi": "Hay Mohammadi", "casablanca maarif": "Maârif", "marrakech medina": "Médina", "rabat agdal": "Agdal", "fes vn": "Ville nouvelle" };
  function normCity(v) {
    const c = clean(v); if (!c) return { ville: null, quartier: null };
    const k = strip(c);
    return { ville: CITY[k] || nameCase(c.toLowerCase()), quartier: QUARTIER[k] || null };
  }

  function normSource(v) {
    const s = clean(v); if (!s) return null;
    const k = strip(s);
    if (k === "visite terrain" || k === "prospection terrain") return "Visite terrain";
    if (k === "congres") return "Congrès";
    if (k === "site" || k === "site web") return "Site web";
    if (k === "appel telephonique") return "Appel téléphonique";
    return s[0].toUpperCase() + s.slice(1);
  }

  // Segments A/B/C élargis :
  // A = centres médico-esthétiques · B = médecins, kinés, pros de santé · C = esthétique, coiffure, spa, parapharmacie.
  function segmentOf(unite, service, spec) {
    const u = strip(unite), s = strip(service), p = strip(spec);
    if (u.includes("medico") || s.includes("medico")) return "A_clinique";
    if (/esthetique et coiffure|soins et bien|parapharmacie/.test(u)) return "C_salon";
    if (/medecin|kinesitherapie|professionnel de sante|data/.test(u)) return "B_cabinet";
    if (/estheticienne|spa|parapharmacie/.test(s)) return "C_salon";
    if (/medecin|kinesitherapeute|professionnel de sante/.test(s)) return "B_cabinet";
    if (/centre d.?esthetique|medico|clinique|laser/.test(p)) return "A_clinique";
    if (/beaut|spa|coiff|onglerie|nail|bien-etre|para|esthetic|massage|hammam/.test(p)) return "C_salon";
    return "B_cabinet";
  }

  function statutOf(t) {
    const k = strip(t);
    return k === "client" ? "client" : k === "personnel" ? "personnel" : "prospect";
  }

  function parseCreator(v) {
    const m = clean(v).match(/^(.*?)\s*\(([^)]+@[^)]+)\)\s*(?:-\s*Roles?:\s*(.*))?$/i);
    if (!m) return null;
    const email = m[2].trim().toLowerCase();
    let nom = nameCase(m[1]);
    if (!nom || /^admin$/i.test(nom)) nom = "Admin (" + email.split("@")[0] + ")";
    const role = /super_?admin/i.test(m[3] || "") ? "superviseur" : "commercial";
    return { nom, email, role };
  }

  const filled = (r) => Object.values(r).filter((x) => x != null && x !== "").length;

  /** rows: objets {Titre, Nom, Prenom, Email, Telephone, Type, ...} (une ligne Excel = un objet). */
  function mapRows(rows) {
    const byRef = new Map(), creators = new Map();
    let read = 0, skipped = 0;
    for (const r of rows) {
      read++;
      const nom = nameCase(r["Nom"]), prenom = nameCase(r["Prenom"] ?? r["Prénom"]);
      const tel = normPhone(r["Telephone"] ?? r["Téléphone"]);
      if (!nom && !prenom && !tel) { skipped++; continue; }
      const titre = clean(r["Titre"]);
      const isDr = /^(dr|prof|pr)\.?$/i.test(titre) && !/^(dr|pr|prof)\b/i.test(nom);
      const display = clean((isDr ? (titre.toLowerCase().startsWith("pr") ? "Pr " : "Dr ") : "") + [nom, prenom].filter(Boolean).join(" "));
      const { ville, quartier } = normCity(r["Ville"]);
      const spec = clean(r["Spécialité"] ?? r["Specialite"]);
      const unite = clean(r["Unité Commerciale"] ?? r["Unite Commerciale"]);
      const service = clean(r["Service"]);
      const creator = parseCreator(r["Créateur"] ?? r["Createur"]);
      if (creator && !creators.has(creator.email)) creators.set(creator.email, creator);
      const email = clean(r["Email"]).toLowerCase() || null;
      const adresse = [clean(r["Adresse"]), quartier].filter(Boolean).join(", ") || null;
      const ref = realPhone(tel) ? "tel:" + tel : "nom:" + strip(display + "|" + (ville || "") + "|" + tel);
      const rec = {
        import_ref: ref,
        compte: {
          nom: display || fmtPhone(tel), segment: segmentOf(unite, service, spec), ville, adresse,
          telephone: tel ? fmtPhone(tel) : null, email, site_web: clean(r["Site Web"]) || null,
          specialite: spec ? spec[0].toUpperCase() + spec.slice(1) : null, statut: statutOf(r["Type"]),
          source: normSource(r["Source"]), unite_commerciale: unite || service || null,
        },
        contact: {
          prenom: prenom || null, nom: nom || prenom || display, fonction: spec || null,
          telephone: tel ? fmtPhone(tel) : null, email, decideur: true,
        },
        creatorEmail: creator ? creator.email : null,
        extraContacts: [],
      };
      const prev = byRef.get(ref);
      if (!prev) { byRef.set(ref, rec); continue; }
      // Doublon : on garde la fiche la plus complète, client l'emporte sur prospect.
      const keep = filled(rec.compte) > filled(prev.compte) ? rec : prev, other = keep === rec ? prev : rec;
      for (const k of Object.keys(keep.compte)) if (keep.compte[k] == null && other.compte[k] != null) keep.compte[k] = other.compte[k];
      if (rec.compte.statut === "client" || prev.compte.statut === "client") keep.compte.statut = "client";
      keep.creatorEmail = keep.creatorEmail || other.creatorEmail;
      // Même numéro mais autre personne (ex. deux praticiens d'un même centre) : on garde l'autre comme contact du compte.
      const names = new Set([keep.contact, ...keep.extraContacts].map((c) => strip((c.prenom || "") + (c.nom || ""))));
      for (const c of [other.contact, ...other.extraContacts]) if (!names.has(strip((c.prenom || "") + (c.nom || "")))) { keep.extraContacts.push(c); names.add(strip((c.prenom || "") + (c.nom || ""))); }
      byRef.set(ref, keep);
    }
    const records = [...byRef.values()];
    const count = (f) => records.reduce((m, x) => ((m[f(x)] = (m[f(x)] || 0) + 1), m), {});
    return {
      records, creators: [...creators.values()],
      stats: { read, skipped, unique: records.length, duplicates: read - skipped - records.length,
        contacts: records.reduce((n, r) => n + 1 + r.extraContacts.length, 0),
        bySegment: count((x) => x.compte.segment), byStatut: count((x) => x.compte.statut),
        byVille: count((x) => x.compte.ville || "Non renseignée") },
    };
  }

  /** Lit des fichiers .xlsx/.csv (objets File) avec SheetJS et renvoie toutes les lignes. */
  async function readFiles(files, XLSX) {
    const out = [];
    for (const f of files) {
      const wb = XLSX.read(await f.arrayBuffer(), { type: "array" });
      for (const name of wb.SheetNames) out.push(...XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: null, raw: false }));
    }
    return out;
  }

  /** Envoie l'import à Supabase par lots. onProgress(fait, total). Relançable sans doublons (import_ref). */
  async function run(sb, plan, onProgress) {
    const { records, creators } = plan;
    // 1. Commerciaux de l'ancien CRM : ajoutés inactifs (sans accès) s'ils n'existent pas.
    const { data: team, error: e0 } = await sb.from("equipe").select("id,email");
    if (e0) throw e0;
    const known = new Set((team || []).map((t) => (t.email || "").toLowerCase()));
    const toAdd = creators.filter((c) => !known.has(c.email)).map((c) => ({ nom: c.nom, email: c.email, role: c.role, actif: false }));
    if (toAdd.length) { const { error } = await sb.from("equipe").insert(toAdd); if (error) throw error; }
    const { data: team2, error: e1 } = await sb.from("equipe").select("id,email");
    if (e1) throw e1;
    const idByEmail = new Map(team2.map((t) => [(t.email || "").toLowerCase(), t.id]));

    // 2. Comptes puis contacts, par lots de 400.
    let done = 0, created = 0;
    const N = 200;
    for (let i = 0; i < records.length; i += N) {
      const chunk = records.slice(i, i + N);
      const rows = chunk.map((r) => ({ ...r.compte, import_ref: r.import_ref, commercial_id: idByEmail.get(r.creatorEmail) || null }));
      const { data: ins, error } = await sb.from("comptes").upsert(rows, { onConflict: "import_ref", ignoreDuplicates: true }).select("id,import_ref");
      if (error) throw error;
      created += (ins || []).length;
      const { data: ids, error: e2 } = await sb.from("comptes").select("id,import_ref").in("import_ref", chunk.map((r) => r.import_ref));
      if (e2) throw e2;
      const idByRef = new Map(ids.map((x) => [x.import_ref, x.id]));
      const contacts = chunk.filter((r) => idByRef.has(r.import_ref)).flatMap((r) => [r.contact, ...r.extraContacts].map((c, k) => ({ ...c, compte_id: idByRef.get(r.import_ref), import_ref: k ? r.import_ref + "#" + (k + 1) : r.import_ref })));
      const { error: e3 } = await sb.from("contacts").upsert(contacts, { onConflict: "import_ref", ignoreDuplicates: true });
      if (e3) throw e3;
      done += chunk.length;
      if (onProgress) onProgress(done, records.length);
    }
    return { created, already: records.length - created, newMembers: toAdd.length };
  }

  root.CRMImport = { mapRows, readFiles, run, _test: { realPhone, normPhone, normCity, segmentOf, nameCase, parseCreator } };
})(typeof window !== "undefined" ? window : globalThis);
