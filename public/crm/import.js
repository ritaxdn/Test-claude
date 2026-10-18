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
      const rows = chunk.map((r) => { const id = idByEmail.get(r.creatorEmail) || null; return { ...r.compte, import_ref: r.import_ref, commercial_id: id, ...(id ? { createur_id: id } : {}) }; });
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


  /* ---------- Opportunités et devis de l'ancien CRM ---------- */
  // Clé de rapprochement d'un nom : sans accents, sans titre (Dr, Mme…), mots triés.
  // Clé insensible aux voyelles, aux lettres doublées et à l'ordre des mots (Fatema/Fatima, Zahra/Zahraa)
  const sonKey = (s) => { const w = (nameKey(s) || "").split(" ").filter((x) => x.length >= 2).map((x) => (x[0] + x.slice(1).replace(/[aeiouyh]/g, "")).replace(/(.)\1+/g, "$1")); return w.length >= 2 && w.join("").length >= 5 ? w.sort().join(" ") : ""; };
  const nameKey = (s) => strip(clean(s)).replace(/\b(dr|pr|docteur|mme|mlle|mr|m|madame|monsieur)\b\.?/g, " ").match(/[a-z0-9]+/g)?.sort().join(" ") || "";
  const ETAPE = { qualification: "Qualification", proposition: "Proposition", negociation: "Negociation", closing: "Fermeture", fermeture: "Fermeture" };
  const PROBA = { Qualification: 20, Proposition: 40, Negociation: 65, Fermeture: 85 };
  function segmentFromName(n) {
    const k = strip(n);
    if (/clinique|centre (medical|medico|laser|d.?esthetique medic)|medico|polyclinique/.test(k)) return "A_clinique";
    if (/salon|spa\b|beaut|coiff|nail|ongl|hammam|institut|massage|lounge|studio|room|esthetique|bien.?etre|lash|brow|make ?up/.test(k)) return "C_salon";
    return "B_cabinet";
  }
  function titreOpp(detail, client) {
    const d = clean(detail).replace(/^OPPO-\d+\s*[—–-]?\s*/i, "");
    if (!d || nameKey(d) === nameKey(client) || nameKey(d).split(" ").every((w) => nameKey(client).includes(w))) return "Prospection";
    return d.length > 90 ? d.slice(0, 87).trim() + "…" : d[0].toUpperCase() + d.slice(1);
  }
  const num = (v) => {
    let t = String(v ?? "").replace(/[\s\u00a0\u202f]/g, "").replace(/(MAD|DH)$/i, "");
    if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) t = t.replace(/,/g, "");        // 270,000.00
    else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, "").replace(",", "."); // 270.000,00
    else t = t.replace(",", ".");
    const n = parseFloat(t); return isFinite(n) ? n : null;
  };
  const isoDate = (v) => { const s = clean(v); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[1]}-${m[2]}-${m[3]}T09:00:00Z` : null; };

  /** sheets : { nomFeuille: lignes }, comptes / equipe : données actuelles du CRM. */
  function mapOpportunites(sheets, comptes, equipe) {
    const names = Object.keys(sheets);
    const oppRows = sheets[names.find((n) => /opportunit/i.test(n))] || [];
    const devRows = sheets[names.find((n) => /devis/i.test(n))] || [];
    // Comptes existants : par nom + ville, puis par nom seul s'il est unique.
    const byNameCity = new Map(), byName = new Map(), bySon = new Map();
    for (const c of comptes) {
      const k = nameKey(c.nom); if (!k) continue;
      byNameCity.set(k + "|" + strip(c.ville || ""), c.id);
      byName.set(k, byName.has(k) ? null : c.id);
      const sk = sonKey(c.nom); if (sk) { const kk = sk + "|" + strip(c.ville || ""); bySon.set(kk, bySon.has(kk) ? null : c.id); }
    }
    const memberKey = (n) => nameKey(n);
    const members = new Map(equipe.map((e) => [memberKey(e.nom), e.id]));
    // « Admin » de l'export = « Admin (mariamlahlou) » importé avec les contacts.
    const admin = equipe.find((e) => /^admin\b/i.test(e.nom)); if (admin) members.set("admin", admin.id);
    const newMembers = new Map();
    const memberRef = (n) => { const k = memberKey(n); if (!k) return null; if (members.has(k)) return { id: members.get(k) }; if (!newMembers.has(k)) newMembers.set(k, { nom: nameCase(n), role: "commercial", actif: false }); return { key: k }; };

    const newComptes = new Map(); let matched = 0;
    const compteRef = (client, villeRaw, comKey) => {
      const { ville, quartier } = normCity(villeRaw);
      const k = nameKey(client); const vk = strip(ville || "");
      const id = byNameCity.get(k + "|" + vk) || (byName.get(k) || null) || (sonKey(client) && bySon.get(sonKey(client) + "|" + vk)) || null;
      if (id) { matched++; return { id }; }
      const ref = "opp:" + k + "|" + vk;
      if (!newComptes.has(ref)) newComptes.set(ref, { import_ref: ref, nom: nameCase(client), segment: segmentFromName(client), ville, adresse: quartier, statut: "prospect", source: "Ancien CRM (opportunités)", commercialRef: comKey });
      return { ref };
    };

    const opps = []; const etapes = {};
    for (const r of oppRows) {
      const client = clean(r["Client"]); if (!client) continue;
      const com = memberRef(r["Commercial d'origine"] ?? r["Commercial"]);
      const cpt = compteRef(client, r["Ville"], com);
      const etape = ETAPE[strip(clean(r["Étape"] ?? r["Etape"]))] || "Qualification";
      etapes[etape] = (etapes[etape] || 0) + 1;
      const ht = num(r["Montant HT"]);
      const created = isoDate(r["Date"]);
      opps.push({ import_ref: "oppo:" + clean(r["Réf. ancien CRM"] ?? r["Ref"] ?? (client + "|" + r["Date"])), cpt, com,
        row: { titre: titreOpp(r["Détail"], client), description: clean(r["Détail"]) || null, etape, issue: "en_cours", montant_mad: ht, probabilite: PROBA[etape],
               created_at: created || undefined, updated_at: created || undefined } });
    }
    const devis = [];
    for (const r of devRows) {
      const client = clean(r["Client"]); if (!client) continue;
      const ref = clean(r["Détail"]) || clean(r["Réf. devis"]).replace(/^DEVIS:/i, "");
      const ht = num(r["Montant HT"]), ttc = num(r["Montant TTC"]);
      const com = memberRef(r["Commercial d'origine"] ?? r["Commercial"]);
      const cpt = compteRef(client, r["Ville"], com);
      devis.push({ cpt, com, oppKey: nameKey(client), row: { reference: ref, import_ref: "devis:" + ref, montant_mad: ht ?? 0, tva_pct: ht && ttc ? Math.round((ttc / ht - 1) * 1000) / 10 : 20, statut: "envoye",
        date_envoi: (isoDate(r["Date"]) || "").slice(0, 10) || null, created_at: isoDate(r["Date"]) || undefined, notes: "Repris de l'ancien CRM (détail des lignes non disponible)." } });
    }
    return { kind: "opportunites", opps, devis, newComptes: [...newComptes.values()], newMembers: [...newMembers.entries()].map(([k, m]) => ({ key: k, ...m })),
      stats: { opps: opps.length, devis: devis.length, matched, nouveaux: newComptes.size, etapes, avecMontant: opps.filter((o) => o.row.montant_mad).length, commerciaux: newMembers.size } };
  }

  async function runOpportunites(sb, plan, onProgress) {
    // 1. Commerciaux absents de l'équipe : ajoutés sans accès (sans email).
    const memberId = new Map();
    const { data: team, error: e0 } = await sb.from("equipe").select("id,nom"); if (e0) throw e0;
    (team || []).forEach((t) => memberId.set(nameKey(t.nom), t.id));
    for (const m of plan.newMembers) {
      if (memberId.has(m.key)) continue;
      const { data, error } = await sb.from("equipe").insert({ nom: m.nom, role: m.role, actif: false }).select("id").single();
      if (error) throw error; memberId.set(m.key, data.id);
    }
    const comId = (ref) => (ref ? ref.id || memberId.get(ref.key) || null : null);
    // 2. Nouveaux comptes (relance sans doublon grâce à import_ref).
    const N = 200; let done = 0; const total = plan.newComptes.length + plan.opps.length + plan.devis.length;
    const idByRef = new Map();
    for (let i = 0; i < plan.newComptes.length; i += N) {
      const chunk = plan.newComptes.slice(i, i + N);
      const rows = chunk.map(({ commercialRef, ...c }) => { const id = comId(commercialRef); return { ...c, commercial_id: id, ...(id ? { createur_id: id } : {}) }; });
      const { error } = await sb.from("comptes").upsert(rows, { onConflict: "import_ref", ignoreDuplicates: true });
      if (error) throw error;
      const { data, error: e2 } = await sb.from("comptes").select("id,import_ref").in("import_ref", chunk.map((c) => c.import_ref));
      if (e2) throw e2; data.forEach((x) => idByRef.set(x.import_ref, x.id));
      done += chunk.length; onProgress && onProgress(done, total);
    }
    const cid = (cpt) => cpt.id || idByRef.get(cpt.ref) || null;
    // 3. Opportunités.
    let created = 0; const oppByCompte = new Map();
    for (let i = 0; i < plan.opps.length; i += N) {
      const chunk = plan.opps.slice(i, i + N).filter((o) => cid(o.cpt));
      const rows = chunk.map((o) => { const r = { ...o.row, import_ref: o.import_ref, compte_id: cid(o.cpt), commercial_id: comId(o.com) }; if (r.commercial_id) r.createur_id = r.commercial_id; if (!r.created_at) { delete r.created_at; delete r.updated_at; } return r; });
      const { data, error } = await sb.from("opportunites").upsert(rows, { onConflict: "import_ref", ignoreDuplicates: true }).select("id");
      if (error) throw error; created += (data || []).length;
      done += plan.opps.slice(i, i + N).length; onProgress && onProgress(done, total);
    }
    const { data: allOpps } = await sb.from("opportunites").select("id,compte_id,import_ref").like("import_ref", "oppo:%");
    (allOpps || []).forEach((o) => oppByCompte.set(o.compte_id, o.id));
    // 4. Devis (montants repris, une ligne de synthèse).
    let devisCrees = 0;
    for (const d of plan.devis) {
      const compte_id = cid(d.cpt); if (!compte_id) continue;
      const row = { ...d.row, compte_id, commercial_id: comId(d.com), opportunite_id: oppByCompte.get(compte_id) || null };
      if (!row.created_at) delete row.created_at;
      const { data, error } = await sb.from("devis").upsert(row, { onConflict: "import_ref", ignoreDuplicates: true }).select("id");
      if (error) throw error;
      if (data && data.length) {
        devisCrees++;
        const { error: e3 } = await sb.from("devis_lignes").insert({ devis_id: data[0].id, position: 1, designation: "Devis " + d.row.reference + " repris de l'ancien CRM", quantite: 1, prix_unitaire_mad: d.row.montant_mad || 0, remise_pct: 0 });
        if (e3) throw e3;
      }
      done++; onProgress && onProgress(done, total);
    }
    return { comptes: idByRef.size, opps: created, oppsDeja: plan.opps.length - created, devis: devisCrees, membres: plan.newMembers.length };
  }

  async function readSheets(files, XLSX) {
    const out = {};
    for (const f of files) {
      const wb = XLSX.read(await f.arrayBuffer(), { type: "array" });
      for (const name of wb.SheetNames) out[name] = (out[name] || []).concat(XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: null, raw: false }));
    }
    return out;
  }

  /* ---------- Export complet d'un commercial (Contacts, Opportunités, Activités, Devis) ---------- */
  const MOIS = { "janv": 1, "fevr": 2, "mars": 3, "avr": 4, "mai": 5, "juin": 6, "juil": 7, "aout": 8, "sept": 9, "oct": 10, "nov": 11, "dec": 12 };
  // « nov. 7, 2025 11:37:28 » ou « 2025-11-07 » → ISO (heure du Maroc ≈ UTC+1)
  function frDate(v) {
    const t = clean(v); if (!t) return null;
    const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/); if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}T${iso[4] || "09"}:${iso[5] || "00"}:00+01:00`;
    const m = strip(t).match(/^([a-z]+)\.?\s+(\d{1,2}),\s*(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (!m || !MOIS[m[1]]) return null;
    const pad = (n) => String(n).padStart(2, "0");
    return `${m[3]}-${pad(MOIS[m[1]])}-${pad(m[2])}T${pad(m[4] || 9)}:${m[5] || "00"}:00+01:00`;
  }
  const TYPE_ACT = { "tache": "tache", "appel": "appel", "evenement": "evenement", "email": "email", "whatsapp": "whatsapp", "rdv": "rdv", "visite": "visite", "demo": "demo" };
  const STATUT_DEVIS = { "envoye": "envoye", "accepte": "accepte", "refuse": "refuse", "signe": "signe", "brouillon": "brouillon", "negociation": "envoye" };

  function mapExportCommercial(sheets, comptes, equipe) {
    const resume = sheets["Résumé"] || sheets["Resume"] || [];
    const head = clean((resume[0] && Object.keys(resume[0])[0]) || "");
    const hm = head.match(/:\s*(.+?)\s*\(([^,)]+@[^,)]+)(?:,\s*([^)]+))?\)/);
    const owner = hm ? { nom: nameCase(hm[1]), email: hm[2].trim().toLowerCase(), role: /admin/i.test(hm[3] || "") ? "superviseur" : "commercial" } : null;
    const ownerTag = owner ? `${owner.nom} (${owner.email}) - Roles: ${owner.role === "superviseur" ? "super_admin" : "BIZ DEV"}` : null;

    // Contacts : même traitement que l'export « contacts », créateur = le commercial de l'export.
    const contactRows = (sheets["Contacts"] || []).map((r) => ({ ...r, "Créateur": r["Créateur"] || ownerTag }));
    const contactsPlan = mapRows(contactRows);

    // Membres cités dans les activités (créateur / responsable) absents de l'équipe.
    const known = new Map(equipe.map((e) => [nameKey(e.nom), e]));
    const extra = new Map();
    const memberKey = (n) => { const k = nameKey(n); if (!k) return null; if (owner && k === nameKey(owner.nom)) return "owner"; if (!known.has(k) && !extra.has(k)) extra.set(k, { key: k, nom: nameCase(n), role: "commercial", actif: false }); return k; };

    const refByName = new Map();
    for (const rec of contactsPlan.records) { const k = nameKey([rec.contact.nom, rec.contact.prenom].filter(Boolean).join(" ")); if (k) refByName.set(k, refByName.has(k) ? null : rec.import_ref); }
    const telRef = (v, nom) => { const d = normPhone(v); return realPhone(d) ? "tel:" + d : (refByName.get(nameKey(nom)) || null); };
    const opps = (sheets["Opportunités"] || sheets["Opportunites"] || []).filter((r) => clean(r["Identifiant"] || r["Titre"])).map((r, i) => {
      const statut = strip(clean(r["Statut"]));
      const etape = ETAPE[strip(clean(r["Étape Pipeline"] ?? r["Etape Pipeline"]))] || "Qualification";
      const issue = /gagn/.test(statut) ? "gagnee" : /annul|perdu/.test(statut) ? "perdue" : "en_cours";
      const montant = num(r["Montant reel"]) ?? num(r["Montant estime"]);
      return { import_ref: "oppo:" + clean(r["Site"] || "x") + ":" + clean(r["Identifiant"] || i), tel: telRef(r["Téléphone Contact"] ?? r["Telephone Contact"], r["Contact"]), contact: clean(r["Contact"]),
        row: { titre: clean(r["Titre"]) || "Prospection", etape: issue === "gagnee" ? "Fermeture" : etape, issue, raison_perte: issue === "perdue" ? clean(r["Statut"]) : null,
          montant_mad: montant, probabilite: issue === "gagnee" ? 100 : (num(r["Probabilite"]) ?? PROBA[etape]),
          date_cloture_prevue: (frDate(r["Date echeance"]) || "").slice(0, 10) || null, description: clean(r["Source"]) ? "Source : " + clean(r["Source"]) : null,
          created_at: frDate(r["Date de création"]) || undefined, updated_at: frDate(r["Date de modification"]) || frDate(r["Date de création"]) || undefined } };
    });
    const telByContact = new Map(opps.filter((o) => o.tel && o.contact).map((o) => [nameKey(o.contact), o.tel]));

    const seen = new Map();
    const acts = (sheets["Activités"] || sheets["Activites"] || []).filter((r) => ["Label", "Type", "Date début", "Date de création", "opportunité", "Créateur", "Responsable"].some((k) => clean(r[k]))).map((r) => {
      const type = TYPE_ACT[strip(clean(r["Type"])).replace(/[^a-z]/g, "")] || "autre";
      const quand = frDate(r["Date début"]) || frDate(r["Date de création"]);
      const base = ["act", clean(r["Site"]), clean(r["Date de création"]), clean(r["Label"]), type, clean(r["opportunité"])].join("|");
      const n = (seen.get(base) || 0) + 1; seen.set(base, n);
      return { import_ref: base + (n > 1 ? "#" + n : ""), createur: memberKey(r["Créateur"]), responsable: memberKey(r["Responsable"]),
        row: { type, label: clean(r["Label"]) || null, statut: /termin|fait/.test(strip(clean(r["Statut"]))) ? "fait" : "a_faire", prioritaire: /oui|true|1/.test(strip(clean(r["prioritaire"]))),
          date_activite: quand || new Date().toISOString(), resume: clean(r["opportunité"]) && !/^(visite terrain|appel+e? telephonique)$/.test(strip(clean(r["opportunité"]))) ? clean(r["opportunité"]) : null,
          fait_le: /termin|fait/.test(strip(clean(r["Statut"]))) ? (frDate(r["Date de modification"]) || quand) : null } };
    });

    const devis = (sheets["Devis"] || []).filter((r) => clean(r["Numéro de Devis"])).map((r) => {
      const ref = clean(r["Numéro de Devis"]); const ht = num(r["Total ht"]) ?? 0;
      return { tel: telByContact.get(nameKey(r["Contact"])) || refByName.get(nameKey(r["Contact"])) || null, contact: clean(r["Contact"]),
        row: { reference: ref, import_ref: "devis:" + ref, montant_mad: ht, tva_pct: num(r["Tva"]) ?? 20, remise_pct: num(r["Remise"]) ?? 0,
          statut: STATUT_DEVIS[strip(clean(r["Status"] ?? r["Statut"])).replace(/[^a-z]/g, "")] || "brouillon",
          date_envoi: (frDate(r["Date emission"]) || "").slice(0, 10) || null, created_at: frDate(r["Date devis"]) || undefined,
          notes: "Repris de l'ancien CRM" + (clean(r["Produit"]) && clean(r["Produit"]) !== "N/A" ? " — " + clean(r["Produit"]) : "") + " (détail des lignes non disponible)." } };
    });

    return { kind: "export", owner, contactsPlan, opps, acts, devis, extraMembers: [...extra.values()],
      stats: { owner: owner && owner.nom, contacts: contactsPlan.stats.unique, opps: opps.length, gagnees: opps.filter((o) => o.row.issue === "gagnee").length,
        perdues: opps.filter((o) => o.row.issue === "perdue").length, acts: acts.length, aFaire: acts.filter((a) => a.row.statut === "a_faire").length, devis: devis.length,
        extra: extra.size } };
  }

  async function runExportCommercial(sb, plan, onProgress) {
    const total = plan.contactsPlan.records.length + plan.opps.length + plan.acts.length + plan.devis.length; let base = 0;
    const prog = (d) => onProgress && onProgress(base + d, total);
    // 0. Le commercial existe peut-être déjà (sans email, ajouté par l'import des opportunités) : on complète son email.
    const { data: team0, error: e0 } = await sb.from("equipe").select("id,nom,email"); if (e0) throw e0;
    if (plan.owner) {
      const same = team0.find((t) => nameKey(t.nom) === nameKey(plan.owner.nom));
      if (same && !same.email) { const { error } = await sb.from("equipe").update({ email: plan.owner.email }).eq("id", same.id); if (error) throw error; }
    }
    // 1. Contacts (crée le commercial s'il n'existe pas).
    const r1 = await run(sb, plan.contactsPlan, (d) => prog(d)); base += plan.contactsPlan.records.length;
    // 2. Membres de l'équipe.
    const { data: team, error: e1 } = await sb.from("equipe").select("id,nom,email"); if (e1) throw e1;
    const byKey = new Map(team.map((t) => [nameKey(t.nom), t.id]));
    const ownerId = plan.owner ? (team.find((t) => (t.email || "").toLowerCase() === plan.owner.email) || {}).id || byKey.get(nameKey(plan.owner.nom)) : null;
    for (const m of plan.extraMembers) if (!byKey.has(m.key)) { const { data, error } = await sb.from("equipe").insert({ nom: m.nom, role: m.role, actif: false }).select("id").single(); if (error) throw error; byKey.set(m.key, data.id); }
    const mid = (k) => (k === "owner" ? ownerId : k ? byKey.get(k) || null : null);
    // 3. Comptes des opportunités et devis, par téléphone.
    const refs = [...new Set([...plan.opps, ...plan.devis].map((o) => o.tel).filter(Boolean))];
    const idByRef = new Map();
    for (let i = 0; i < refs.length; i += 200) {
      const { data, error } = await sb.from("comptes").select("id,import_ref").in("import_ref", refs.slice(i, i + 200)); if (error) throw error;
      data.forEach((x) => idByRef.set(x.import_ref, x.id));
    }
    // 4. Opportunités.
    let opps = 0;
    for (let i = 0; i < plan.opps.length; i += 200) {
      const rows = plan.opps.slice(i, i + 200).filter((o) => idByRef.has(o.tel)).map((o) => { const r = { ...o.row, import_ref: o.import_ref, compte_id: idByRef.get(o.tel), commercial_id: ownerId, ...(ownerId ? { createur_id: ownerId } : {}) }; for (const k of ["created_at", "updated_at"]) if (!r[k]) delete r[k]; return r; });
      if (rows.length) { const { data, error } = await sb.from("opportunites").upsert(rows, { onConflict: "import_ref", ignoreDuplicates: true }).select("id"); if (error) throw error; opps += (data || []).length; }
      prog(Math.min(plan.opps.length, i + 200)); 
    }
    base += plan.opps.length;
    // 5. Activités (sans client : l'export ne le précise pas).
    let acts = 0;
    for (let i = 0; i < plan.acts.length; i += 200) {
      const rows = plan.acts.slice(i, i + 200).map((a) => { const resp = mid(a.responsable) || ownerId, crea = mid(a.createur) || ownerId; return { ...a.row, import_ref: a.import_ref, commercial_id: resp, ...(crea ? { createur_id: crea } : {}) }; });
      const { data, error } = await sb.from("activites").upsert(rows, { onConflict: "import_ref", ignoreDuplicates: true }).select("id"); if (error) throw error;
      acts += (data || []).length; prog(Math.min(plan.acts.length, i + 200));
    }
    base += plan.acts.length;
    // 6. Devis.
    const { data: oppList } = await sb.from("opportunites").select("id,compte_id").like("import_ref", "oppo:%");
    const oppByCompte = new Map((oppList || []).map((o) => [o.compte_id, o.id]));
    let devis = 0;
    for (const [i, d] of plan.devis.entries()) {
      const compte_id = idByRef.get(d.tel); if (!compte_id) { prog(i + 1); continue; }
      const row = { ...d.row, compte_id, commercial_id: ownerId, opportunite_id: oppByCompte.get(compte_id) || null }; if (!row.created_at) delete row.created_at;
      const { data, error } = await sb.from("devis").upsert(row, { onConflict: "import_ref", ignoreDuplicates: true }).select("id"); if (error) throw error;
      if (data && data.length) {
        devis++;
        const { error: e3 } = await sb.from("devis_lignes").insert({ devis_id: data[0].id, position: 1, designation: "Devis " + d.row.reference + " repris de l'ancien CRM", quantite: 1, prix_unitaire_mad: d.row.montant_mad || 0, remise_pct: 0 });
        if (e3) throw e3;
      }
      prog(i + 1);
    }
    return { contacts: r1.created, opps, acts, devis, devisSansClient: plan.devis.filter((d) => !idByRef.get(d.tel)).length };
  }

  /* ---------- Migration complète de l'ancien CRM (fichier « Cellulift_CRM_Migration_COMPLET ») ---------- */
  const TEST_RE = /^\s*(test|tes|test v)\s*$/i;
  const GENERIQUE = /^(visite?r? (de )?te?rr?ai?n|appel+e? (t[eé]l[eé]phonique)?|app pour dmd de rdv au showroom|prospection|rendez-vous au show-?room)$/;
  // « août 31, 2026 10:37:12 » (export d'un commercial) → « 2026-08-31 10:37:12 »
  const dateSec = (v) => { const m = strip(clean(v)).match(/^([a-z]+)\.?\s+(\d{1,2}),\s*(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/); if (!m || !MOIS[m[1]]) return null; const p2 = (n) => String(n).padStart(2, "0"); return `${m[3]}-${p2(MOIS[m[1]])}-${p2(m[2])} ${p2(m[4])}:${m[5]}:${m[6]}`; };
  function typeAct(libelle, type) {
    const l = strip(clean(libelle)), t = strip(clean(type));
    if (/whats/.test(l)) return "whatsapp";
    if (/rendez|rdv|show/.test(l)) return "rdv";
    if (/visit|terrain|terain/.test(l)) return "visite";
    if (/appel|tel|phone/.test(l)) return "appel";
    if (/demo/.test(l)) return "demo";
    if (/formation/.test(l)) return "formation";
    return t.startsWith("appel") ? "appel" : t.startsWith("ev") ? "evenement" : "tache";
  }
  const fr = (v) => { const t = clean(v); const m = t.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}:\d{2}))?/); return m ? `${m[3]}/${m[2]}/${m[1]}${m[4] ? " " + m[4] : ""}` : t; };

  function mapMigration(sheets, comptes) {
    const S = (n) => sheets[n] || [];
    const contactsRaw = S("Contacts"), tests = new Set();
    const comptesRows = [];
    for (const r of contactsRaw) {
      const nom = nameCase(r.nom), prenom = nameCase(r.prenom), titre = clean(r.titre);
      if (TEST_RE.test(nom) || TEST_RE.test(prenom) || TEST_RE.test(nom + " " + prenom)) { tests.add(clean(r.legacy_id)); continue; }
      const isDr = /^(dr|prof|pr)\.?$/i.test(titre) && !/^(dr|pr|prof)\b/i.test(nom);
      const display = clean((isDr ? (titre.toLowerCase().startsWith("pr") ? "Pr " : "Dr ") : "") + [nom, prenom].filter(Boolean).join(" "));
      const tel = normPhone(r.telephone_normalise || r.telephone), telAff = normPhone(r.telephone);
      const { ville, quartier } = normCity(r.ville);
      const spec = clean(r.specialite), unite = clean(r.unite_commerciale), service = clean(r.service);
      comptesRows.push({ legacy: clean(r.legacy_id), nom: display || fmtPhone(telAff) || "Sans nom", tel: realPhone(tel) ? tel : "", telephone: telAff ? fmtPhone(telAff) : "",
        email: clean(r.email).toLowerCase(), site_web: clean(r.site_web), adresse: [clean(r.adresse), quartier].filter(Boolean).join(", "), ville: ville || "",
        specialite: spec ? spec[0].toUpperCase() + spec.slice(1) : "", source: normSource(r.source) || "", unite: unite || service, statut: statutOf(r.type_contact),
        segment: segmentOf(unite, service, spec), commercial: clean(r.commercial), c_nom: nom, c_prenom: prenom });
    }
    const ETP = { qualification: "Qualification", proposition: "Proposition", negociation: "Negociation", fermeture: "Fermeture" };
    const opps = S("Opportunites").filter((r) => !tests.has(clean(r.contact_legacy_id)) && !TEST_RE.test(clean(r.titre))).map((r) => {
      const st = strip(clean(r.statut));
      const issue = /gagn/.test(st) ? "gagnee" : /ferm|annul|perdu/.test(st) ? "perdue" : "en_cours";
      const etape = issue === "gagnee" ? "Fermeture" : ETP[strip(clean(r.etape_pipeline))] || "Qualification";
      const devise = clean(r.devise) || "MAD", m = num(r.montant_reel) || num(r.montant_estime);
      const titre = clean(r.titre);
      const desc = [clean(r.note), clean(r.source) && "Source : " + clean(r.source), [clean(r.business_unit), clean(r.service)].filter(Boolean).join(" · "),
        m && devise !== "MAD" ? `Montant dans l’ancien CRM : ${m} ${devise}` : "", clean(r.pieces_jointes) && "Pièces jointes (ancien CRM) : " + clean(r.pieces_jointes),
        "Réf. ancien CRM : " + (clean(r.reference) || clean(r.legacy_id)).replace(/\s+/g, "")].filter(Boolean).join("\n");
      return { legacy: clean(r.legacy_id), num: clean(r.legacy_num), contact: clean(r.contact_legacy_id),
        titre: !titre || GENERIQUE.test(strip(titre)) ? "" : (titre.length > 90 ? titre.slice(0, 87).trim() + "…" : titre),
        etape, issue, raison: issue === "perdue" ? (/annul/.test(st) ? "Annulée (ancien CRM)" : "Fermée (ancien CRM)") : "",
        montant: m && devise === "MAD" ? String(m) : "", proba: issue === "gagnee" ? "100" : (num(r.probabilite_pct) != null ? String(Math.round(num(r.probabilite_pct))) : ""),
        echeance: clean(r.date_echeance), description: desc, commercial: clean(r.commercial), cree: clean(r.date_creation), modifie: clean(r.date_modification) };
    });
    const acts = S("Activites").filter((r) => clean(r.legacy_id) && !tests.has(clean(r.contact_legacy_id))).map((r) => {
      const st = strip(clean(r.statut));
      return { legacy: clean(r.legacy_id), opp: clean(r.opportunite_legacy_id), contact: clean(r.contact_legacy_id), type: typeAct(r.libelle, r.type),
        label: clean(r.libelle), statut: /termin/.test(st) ? "fait" : "a_faire", debut: clean(r.date_debut), fin: clean(r.date_fin), cree: clean(r.date_creation), modifie: clean(r.date_modification),
        createur: clean(r.createur), responsable: clean(r.responsable), _k: clean(r.date_creation).slice(0, 19) };
    });
    const coms = S("Commentaires").filter((r) => clean(r.commentaire) && !tests.has(clean(r.contact_legacy_id))).map((r) => ({
      ref: clean(r.opportunite_legacy_id) + "|" + clean(r.ordre), opp: clean(r.opportunite_legacy_id), contact: clean(r.contact_legacy_id), auteur: clean(r.auteur), date: clean(r.date), texte: String(r.commentaire).trim() }));
    const hist = S("Historique_actions").filter((r) => !tests.has(clean(r.contact_legacy_id))).map((r) => {
      const ech = clean(r.date_echeance_ou_appel), resp = clean(r.responsable), aut = clean(r.auteur);
      const resume = [`${clean(r.action) || "Action"} — ${clean(r.evenement) || "modifié"}`, clean(r.statut), ech && "échéance " + fr(ech), resp && resp !== aut ? "pour " + nameCase(resp) : "", clean(r.autres)].filter(Boolean).join(" · ");
      return { ref: "H|" + clean(r.opportunite_legacy_id) + "|" + clean(r.ordre_affichage), opp: clean(r.opportunite_legacy_id), contact: clean(r.contact_legacy_id), auteur: aut,
        evenement: clean(r.evenement), resume, quand: clean(r.debut) || ech,
        details: { action: clean(r.action), evenement: clean(r.evenement), statut: clean(r.statut), echeance: ech, debut: clean(r.debut), fin: clean(r.fin), responsable: resp, autres: clean(r.autres) } };
    });
    const DV = { envoye: "envoye", brouillon: "brouillon", accepte: "accepte", refuse: "refuse", negociation: "envoye", signe: "signe" };
    const devis = S("Devis").filter((r) => clean(r.numero) && !tests.has(clean(r.contact_legacy_id))).map((r) => ({
      numero: clean(r.numero), contact: clean(r.contact_legacy_id), statut: DV[strip(clean(r.statut)).replace(/[^a-z]/g, "")] || "brouillon",
      ht: num(r.total_ht) != null ? String(num(r.total_ht)) : "", tva: num(r.tva_pct) != null ? String(num(r.tva_pct)) : "", remise: num(r.remise_pct) != null ? String(num(r.remise_pct)) : "",
      validite: num(r.validite_jours) != null ? String(Math.round(num(r.validite_jours))) : "", date: clean(r.date_devis), emission: clean(r.date_emission), pdf: clean(r.pdf_url),
      commercial: clean(r.commercial),
      notes: ["Repris de l’ancien CRM", clean(r.produit) && clean(r.produit) !== "N/A" ? "Produit : " + clean(r.produit) : "", clean(r.devise) && clean(r.devise) !== "MAD" ? "Devise : " + clean(r.devise) : "",
        clean(r.note), clean(r.pieces_jointes) && "Pièces jointes : " + clean(r.pieces_jointes)].filter(Boolean).join("\n") }));
    const membres = S("Commerciaux").filter((r) => clean(r.commercial) && ["contacts", "opportunites", "activites_creees", "commentaires", "devis"].some((k) => num(r[k]) > 0)).map((r) => {
      const email = clean(r.email).toLowerCase(); let nom = nameCase(r.commercial);
      if (/^admin$/i.test(nom)) nom = "Admin (" + email.split("@")[0] + ")";
      return { nom, email, role: /admin|directeur/i.test(clean(r.role)) ? "superviseur" : "commercial" };
    });
    const telsExist = new Set(); comptes.forEach((c) => [c.telephone, c.telephone_2].forEach((t) => { const d = String(t || "").replace(/\D/g, ""); if (d.length >= 8) telsExist.add(d.slice(-9)); }));
    const deja = comptesRows.filter((c) => c.tel && telsExist.has(c.tel.slice(-9))).length;
    const telsVus = new Set(); let memeNumero = 0; comptesRows.forEach((c) => { if (!c.tel) return; if (telsVus.has(c.tel)) memeNumero++; telsVus.add(c.tel); });
    return { kind: "migration", membres, comptes: comptesRows, opps, acts, coms, hist, devis,
      stats: { contacts: comptesRows.length, tests: tests.size, deja, memeNumero, opps: opps.length, gagnees: opps.filter((o) => o.issue === "gagnee").length, perdues: opps.filter((o) => o.issue === "perdue").length,
        acts: acts.length, aFaire: acts.filter((a) => a.statut === "a_faire").length, coms: coms.length, hist: hist.length, devis: devis.length, membres: membres.length } };
  }

  async function runMigration(sb, plan, onProgress) {
    const total = plan.membres.length + plan.comptes.length + plan.opps.length + plan.acts.length + plan.coms.length + plan.hist.length + plan.devis.length;
    let done = 0; const res = {};
    const lots = async (fn, rows, size, cle) => {
      for (let i = 0; i < rows.length; i += size) {
        const lot = rows.slice(i, i + size).map(({ _k, ...x }) => x);
        let data, error;
        for (let essai = 0; essai < 3; essai++) { ({ data, error } = await sb.rpc(fn, { p: lot })); if (!error) break; await new Promise((ok) => setTimeout(ok, 1500 * (essai + 1))); }
        if (error) throw error;
        for (const [k, v] of Object.entries(data || {})) res[cle + "." + k] = (res[cle + "." + k] || 0) + v;
        done += lot.length; onProgress && onProgress(done, total, cle);
      }
    };
    await lots("mig_equipe", plan.membres, 100, "equipe");
    await lots("mig_comptes", plan.comptes, 200, "comptes");
    await lots("mig_opportunites", plan.opps, 200, "opps");
    // Activités déjà importées depuis l'export d'un commercial : on les complète au lieu de les dupliquer.
    const anciennes = new Map();
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb.from("activites").select("id,import_ref").like("import_ref", "act|%").range(from, from + 999);
      if (error) throw error;
      for (const a of data) { const k = dateSec(String(a.import_ref || "").split("|")[2]); if (k) (anciennes.get(k) || anciennes.set(k, []).get(k)).push(a.id); }
      if (data.length < 1000) break;
    }
    for (const a of plan.acts) { const l = anciennes.get(a._k); if (l && l.length) a.old_id = l.shift(); }
    await lots("mig_activites", plan.acts, 300, "acts");
    await lots("mig_devis", plan.devis, 100, "devis");
    await lots("mig_commentaires", plan.coms, 300, "coms");
    await lots("mig_historique", plan.hist, 400, "hist");
    return res;
  }

  root.CRMImport = { mapMigration, runMigration, mapRows, readFiles, run, readSheets, mapOpportunites, runOpportunites, mapExportCommercial, runExportCommercial, _test: { realPhone, normPhone, normCity, segmentOf, nameCase, parseCreator } };
})(typeof window !== "undefined" ? window : globalThis);
