// CELLULIFT ACADEMY — administration du prototype. Les chiffres sont des données d'exemple.
(() => {
  const A = window.ACADEMY, D = window.ACADEMY_DATA;
  const { icon, esc, course, device, fmtMAD, bar, simNote, toast, overlay, closeOverlay, audit, save, today } = A;
  const S = () => A.S();
  const personaOf = (uid) => (uid === D.personas.partner.id ? "partner" : uid === D.personas.open.id ? "open" : S().custom?.profile.id === uid ? "custom" : null);
  const stateOf = (uid) => { const k = personaOf(uid); return k === "custom" ? S().custom.state : k ? S().people[k] : null; };
  const userName = (uid) => S().users.find((u) => u.id === uid)?.name || "—";
  const statusBadge = (s) => ({ verified: `<span class="badge ok">Vérifié</span>`, pending: `<span class="badge pending">En attente</span>`, unverified: `<span class="badge locked">Non vérifié</span>`, rejected: `<span class="badge err">Refusé</span>`, suspended: `<span class="badge err">Suspendu</span>` }[s] || s);
  const ruleLabel = { free: "Gratuit", equipment: "Équipement" };
  const rulesOf = (c) => {
    const r = [...c.access.rules];
    const eq = D.devices.filter((d) => S().equipRules[`${d.id}|${c.id}`]);
    if (eq.length && !r.includes("equipment")) r.push("equipment");
    return r.map((x) => `<span class="badge ${x === "free" ? "free" : x === "paid" ? "purchased" : x === "equipment" ? "included" : "exclusive"}">${x === "paid" ? fmtMAD(c.access.price) : x === "manual_only" ? "Sur invitation" : ruleLabel[x] || x}</span>`).join(" ");
  };
  // Chiffres d'exemple par cours (stables)
  const stats = (c, i) => ({ enrolled: [212, 96, 41, 158, 634, 702, 88, 57, 120, 301][i % 10], completion: [71, 64, 58, 77, 52, 69, 61, 74, 48, 55][i % 10] });
  const initials = (n) => n.replace("Dr ", "").split(" ").map((w) => w[0]).join("").slice(0, 2);

  window.ADMIN_NAV = [
    ["admin", "home", "Vue d'ensemble"],
    ["admin/users", "users", "Utilisateurs"],
    ["admin/verification", "shield", "Vérification", () => S().queue.length],
    ["admin/courses", "layers", "Cours"],
    ["admin/entitlements", "key", "Accès & droits"],
    ["admin/equipment", "cpu", "Ventes & CRM", () => (S().crm?.incoming.length || 0) + S().sales.filter((x) => x.status === "no_email").length],
    ["admin/protection", "lock", "Protection des contenus", () => S().alerts.length],
    ["admin/analytics", "chart", "Analyses"],
    ["admin/audit", "log", "Journal d'audit"],
  ].map((x) => (x[3] ? [x[0], x[1], x[2], x[3]] : x));

  const head = (eyebrow, title, right = "") => `<div class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1 class="display h1">${title}</h1></div><div class="row wrap">${right}</div></div>`;
  const kpi = (l, v, d, down) => `<div class="glass kpi"><span class="eyebrow">${l}</span><div class="v">${v}</div>${d ? `<div class="d ${down ? "down" : ""}">${d}</div>` : ""}</div>`;
  const sampleTag = `<span class="badge">Chiffres d'exemple</span>`;

  /* ── Vue d'ensemble ── */
  function overview() {
    const months = [["Mai", 62], ["Juin", 74], ["Juil.", 58], ["Août", 49], ["Sept.", 96], ["Oct.", 118]];
    const max = Math.max(...months.map((m) => m[1]));
    return `${head("Administration · " + new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }), `<span class="iridescent">Vue d'ensemble</span> de l'Academy`, sampleTag)}
    <div class="grid g4 kpis stagger" style="margin-bottom:22px">
      ${kpi("Professionnels inscrits", "1 284", "+86 ce mois-ci")}${kpi("Vérifiés", "812", "63 % des inscrits")}${kpi("Apprenants actifs · 30 j", "437", "+12 % vs sept.")}${kpi("Taux d'achèvement", "64 %", "+3 pts")}
    </div>
    <div class="cols-main">
      <div class="stack">
        <section class="glass card"><div class="row between"><span class="eyebrow">Inscriptions par mois</span><span class="mono">2026</span></div>
          <div class="bars">${months.map(([m, v]) => `<div><span>${v}</span><i style="height:${(v / max) * 100}%"></i><span>${m}</span></div>`).join("")}</div></section>
        <section class="glass card"><div class="row between" style="margin-bottom:14px"><span class="eyebrow">Entonnoir Open Academy · 2026</span><span class="mono">Gratuit → payant → client</span></div>
          <div class="funnel">${[["Inscrits", 702, 100], ["Inscrits à un cours gratuit", 488, 70], ["Ont acheté un cours payant", 131, 19], ["Devenus clients CELLULIFT", 23, 3.3]].map(([l, v, p]) => `<div class="f"><span>${l}</span>${bar(p)}<span class="mono">${v}</span></div>`).join("")}</div></section>
        <section class="glass card"><div class="row between" style="margin-bottom:6px"><span class="eyebrow">Activité récente</span><a class="small" href="#/admin/audit" style="text-decoration:underline">Journal d'audit</a></div>
          <div class="list">${S().audit.slice(0, 5).map((a) => `<div class="item"><span class="mono" style="width:120px">${a.at.slice(5)}</span><span class="badge">${a.action}</span><span class="small" style="flex:1">${esc(a.target)}</span><span class="small muted">${esc(a.actor)}</span></div>`).join("")}</div></section>
      </div>
      <div class="stack">
        <section class="glass card"><span class="eyebrow">Activation partenaires</span><div class="row" style="margin-top:14px;gap:18px"><div class="ring" style="--p:81;width:88px;height:88px"><span style="font-size:16px">81%</span></div><div class="small muted">118 des 146 machines vendues depuis janvier 2026 ont un programme de formation activé.<br><b style="color:var(--deep)">28 à relancer.</b></div></div></section>
        <section class="glass card"><div class="row between"><span class="eyebrow">File de vérification</span><a href="#/admin/verification" class="small" style="text-decoration:underline">Ouvrir</a></div>
          <div class="list">${S().queue.slice(0, 3).map((q) => `<div class="item"><div class="avatar">${initials(q.name)}</div><div style="flex:1"><div class="small" style="font-weight:600">${esc(q.name)}</div><div class="mono" style="font-size:9.5px">${esc(q.submitted)}</div></div></div>`).join("") || `<p class="small muted" style="padding:10px 0">La file est vide.</p>`}</div></section>
        <section class="glass card"><div class="row between"><span class="eyebrow">Alertes de protection</span><a href="#/admin/protection" class="small" style="text-decoration:underline">Examiner</a></div>
          <div class="list">${S().alerts.map((a) => `<div class="item"><span style="color:var(--warn)">${icon("alert", 16)}</span><div style="flex:1"><div class="small" style="font-weight:600">${esc(a.kind)}</div><div class="small muted">${esc(a.user)}</div></div><span class="badge ${a.score === "Élevée" ? "err" : "warn"}">${a.score}</span></div>`).join("") || `<p class="small muted" style="padding:10px 0">Aucune alerte ouverte.</p>`}</div></section>
      </div>
    </div>`;
  }

  /* ── Utilisateurs ── */
  const USER_FILTERS = [["All", "Tous"], ["Partenaire", "Partenaire"], ["Open Academy", "Open Academy"], ["Pending", "En attente"]];
  function users() {
    const q = window.__adminQ || "";
    return `${head("Personnes", "Utilisateurs", `<button class="btn solid" data-a="invite">${icon("plus", 16)} Inviter un professionnel</button>`)}
    <div class="glass card" style="padding:0">
      <div class="row wrap" style="padding:16px 18px;border-bottom:1px solid var(--line)"><div style="position:relative;flex:1;min-width:220px"><span style="position:absolute;left:14px;top:13px;color:var(--deep-soft)">${icon("search", 16)}</span><input class="input" style="padding-left:40px" placeholder="Nom, e-mail, ville…" value="${esc(q)}" data-in="adminq" aria-label="Rechercher un utilisateur"></div>
        ${USER_FILTERS.map(([v, l]) => `<button class="chip ${(window.__userFilter || "All") === v ? "on" : ""}" data-a="ufilter" data-v="${v}">${l}</button>`).join("")}</div>
      <div class="table-wrap" id="usertable">${userTable()}</div>
    </div>`;
  }
  function userTable() {
    const q = (window.__adminQ || "").toLowerCase(), f = window.__userFilter || "All";
    const list = S().users.filter((u) => (!q || [u.name, u.email, u.city, u.prof].join(" ").toLowerCase().includes(q)) && (f === "All" || (f === "Pending" ? u.status === "pending" : u.type === f)));
    return `<table class="t"><thead><tr><th>Professionnel</th><th>Profession</th><th>Ville</th><th>Modèle d'accès</th><th>Statut</th><th>Cours</th><th>Dernière activité</th><th></th></tr></thead><tbody>
      ${list.map((u) => `<tr><td><div class="row"><div class="avatar">${initials(u.name)}</div><div><div style="font-weight:600">${esc(u.name)}</div><div class="small muted">${esc(u.email)}</div></div></div></td>
        <td>${esc(u.prof)}</td><td>${esc(u.city)}</td><td><span class="badge ${u.type === "Partenaire" ? "included" : ""}">${u.type}</span></td><td>${statusBadge(u.status)}</td><td class="mono">${u.courses}</td><td class="mono">${u.last}</td>
        <td style="text-align:right"><button class="btn sm" data-a="usersheet" data-v="${u.id}">Gérer</button></td></tr>`).join("")}
      </tbody></table>${list.length ? "" : `<p class="small muted" style="padding:18px">Aucun utilisateur ne correspond.</p>`}`;
  }
  const sourceLabel = { equipment: "équipement", purchase: "achat", free: "gratuit", manual: "accord manuel" };
  function userSheet(uid) {
    const u = S().users.find((x) => x.id === uid);
    const st = stateOf(uid);
    const ents = st ? st.entitlements.filter((e) => !e.revoked) : [];
    const devs = st ? st.devices : S().sales.filter((s) => s.user === uid).map((s) => ({ device: s.device, serial: s.serial }));
    overlay(`<div class="row between"><span class="eyebrow">Utilisateur · ${u.id}</span><button class="icon-btn" data-a="close" aria-label="Fermer">${icon("x", 16)}</button></div>
      <div class="row" style="margin:16px 0"><div class="avatar lg">${initials(u.name)}</div><div><h2 class="h2 display">${esc(u.name)}</h2><div class="small muted">${esc(u.prof)} · ${esc(u.city)}</div><div class="row" style="margin-top:8px">${statusBadge(u.status)}<span class="badge ${u.type === "Partenaire" ? "included" : ""}">${u.type}</span></div></div></div>
      <div class="signal" style="margin:10px 0 18px"></div>
      <div class="eyebrow" style="margin-bottom:8px">Équipements liés</div>
      ${devs.length ? devs.map((d) => `<div class="row" style="padding:6px 0">${icon("cpu", 16)}<b class="small">${device(d.device).name}</b><span class="mono">N/S ${d.serial}</span></div>`).join("") : `<p class="small muted">Aucun</p>`}
      <div class="eyebrow" style="margin:18px 0 8px">Accès aux cours</div>
      ${st ? ents.map((e) => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line)"><div><div class="small" style="font-weight:600">${esc(course(e.course).title)}</div><div class="mono" style="font-size:9.5px">${sourceLabel[e.source] || e.source}${e.ref ? " · " + esc(e.ref) : ""}${e.until ? " · jusqu'au " + e.until : ""}</div></div>${e.source === "equipment" ? `<span class="small muted">via la machine</span>` : `<button class="btn sm danger" data-a="revoke" data-u="${uid}" data-i="${st.entitlements.indexOf(e)}">Révoquer</button>`}</div>`).join("") || `<p class="small muted">Aucun accès pour l'instant.</p>` : `<p class="small muted">${u.courses} cours (exemple — non modélisé dans le prototype)</p>`}
      <form data-form="grant" data-u="${uid}" class="stack hair" style="gap:10px;padding:16px;margin-top:18px"><b class="small">Accorder un accès manuellement</b>
        <select class="input" name="course" aria-label="Cours">${D.courses.map((c) => `<option value="${c.id}">${esc(c.title)}</option>`).join("")}</select>
        <div class="form-grid"><input class="input" name="reason" required placeholder="Motif (journalisé)"><input class="input" name="until" type="date" aria-label="Date de fin (facultative)"></div>
        <button class="btn solid sm">Accorder l'accès</button></form>
      <div class="row wrap" style="margin-top:18px">${u.status !== "verified" ? `<button class="btn sm" data-a="approve" data-v="${uid}">Marquer comme vérifié</button>` : ""}<button class="btn sm" data-a="toast" data-v="E-mail de réinitialisation envoyé (simulé)">Réinitialiser le mot de passe</button><button class="btn sm" data-a="toast" data-v="Toutes les sessions révoquées (simulé)">Déconnecter toutes les sessions</button><button class="btn sm danger" data-a="suspend" data-v="${uid}">${u.status === "suspended" ? "Réactiver" : "Suspendre"}</button></div>`, "sheet");
  }

  /* ── Vérification ── */
  function verification() {
    const q = S().queue;
    return `${head("Personnes", "Vérification professionnelle")}
    <p class="muted" style="margin:-8px 0 20px;max-width:720px">Vérifiez le numéro d'inscription auprès de l'organisme compétent (ex. CNOM pour les médecins) avant d'approuver. Les justificatifs sont stockés dans un espace privé et supprimés 90 jours après la décision.</p>
    ${q.length ? `<div class="grid g2 stagger">${q.map((v) => `<section class="glass card">
      <div class="row between"><span class="badge pending">À examiner</span><span class="mono">${esc(v.submitted)}</span></div>
      <h3 class="h3" style="margin:14px 0 4px">${esc(v.name)}</h3><div class="small muted">${esc(v.prof)}</div>
      <div class="hair" style="padding:12px 14px;margin:14px 0;display:grid;gap:6px"><div class="row between small"><span class="muted">Inscription</span><span class="mono">${esc(v.reg)}</span></div><div class="row between small"><span class="muted">Justificatif</span><a href="#" data-a="toast" data-v="Justificatif ouvert dans la visionneuse sécurisée (simulé)" style="text-decoration:underline">${esc(v.doc)}</a></div></div>
      <div class="row"><button class="btn solid sm" data-a="approve" data-v="${v.user}">${icon("check", 14)} Approuver</button><button class="btn sm danger" data-a="reject" data-v="${v.user}">Refuser</button></div></section>`).join("")}</div>`
      : `<div class="glass card" style="text-align:center;padding:48px"><h3 class="h3">La file est vide</h3><p class="small muted">Les nouvelles demandes apparaîtront ici.</p></div>`}`;
  }

  /* ── Cours ── */
  function courses() {
    return `${head("Contenus", "Cours", `<button class="btn solid" data-a="newcourse">${icon("plus", 16)} Nouveau cours</button>`)}
    <div class="glass card" style="padding:0"><div class="table-wrap"><table class="t"><thead><tr><th>Cours</th><th>Format</th><th>Règles d'accès</th><th>Leçons</th><th>Inscrits</th><th>Achèvement</th><th>Publié</th><th></th></tr></thead><tbody>
      ${D.courses.map((c, i) => { const s = stats(c, i); return `<tr><td><div class="row"><img src="img/${c.img}.jpg" alt="" style="width:34px;height:40px;object-fit:cover;border-radius:6px"><div><div style="font-weight:600">${esc(c.title)}</div><div class="small muted">${esc(D.trainers[c.trainer].name)}</div></div></div></td>
        <td class="small">${c.format}</td><td>${rulesOf(c)}</td><td class="mono">${c.lessonCount}</td><td class="mono">${s.enrolled}</td><td style="min-width:120px"><div class="row">${bar(s.completion)}<span class="mono">${s.completion}%</span></div></td>
        <td><label class="toggle"><input type="checkbox" data-a="publish" data-v="${c.id}" ${S().published[c.id] ? "checked" : ""} aria-label="Publié"><span></span></label></td>
        <td style="text-align:right"><a class="btn sm" href="#/admin/course/${c.id}">${icon("edit", 14)} Modifier</a></td></tr>`; }).join("")}
    </tbody></table></div></div>`;
  }
  const kindLabel = { quiz: "quiz", resource: "ressource" };
  function builder(id) {
    const c = course(id);
    if (!c) return `<p>Introuvable</p>`;
    const r = c.access;
    return `<div class="mono" style="margin-bottom:14px"><a href="#/admin/courses">${icon("left", 12)} Cours</a></div>
    ${head("Éditeur de cours", esc(c.title).replace(/—.*/, ""), `<a class="btn" href="#/course/${c.id}">${icon("eye", 16)} Aperçu apprenant</a><button class="btn solid" data-a="savecourse" data-v="${c.id}">Enregistrer & publier</button>`)}
    <div class="cols-main" style="grid-template-columns:minmax(0,1fr) 380px">
      <div class="stack">
        <section class="glass card"><div class="row between" style="margin-bottom:14px"><span class="eyebrow">Programme</span><button class="btn sm" data-a="toast" data-v="Module ajouté (simulé)">${icon("plus", 14)} Module</button></div>
          ${c.modules.map((m, mi) => `<div class="hair" style="padding:14px;margin-bottom:12px"><div class="row between"><b>${mi + 1}. ${esc(m.title)}</b><span class="mono">${m.lessons.length} leçons</span></div>
            ${m.lessons.map((l) => `<div class="row" style="padding:10px 0;border-top:1px solid var(--line);margin-top:8px"><span class="mono" style="width:30px">${l.id}</span>${icon(l.kind === "quiz" ? "quiz" : l.kind === "resource" ? "file" : "play", 15)}<span class="small" style="flex:1">${esc(l.title)}</span>
              ${l.kind === "video" ? `<span class="badge ok" id="vs-${c.id}-${l.id.replace(".", "-")}">${icon("shield", 10)} Encodée · DRM</span><button class="btn sm" data-a="upload" data-v="vs-${c.id}-${l.id.replace(".", "-")}">${icon("upload", 13)} Remplacer</button>` : `<span class="badge">${kindLabel[l.kind] || l.kind}</span>`}</div>`).join("")}
            <button class="btn ghost sm" style="margin-top:8px" data-a="toast" data-v="Leçon ajoutée (simulé)">${icon("plus", 13)} Ajouter une leçon</button></div>`).join("")}
          <div class="hair" style="padding:26px;text-align:center;border-style:dashed" data-a="upload" data-v="newupload" role="button" tabindex="0">${icon("upload", 22)}<div class="small" style="font-weight:600;margin-top:8px">Déposez des vidéos pour créer des leçons</div><div class="small muted">MP4/MOV jusqu'à 20 Go · envoi direct chez l'hébergeur vidéo · <span id="newupload">aucun envoi en cours</span></div></div>
        </section>
        ${simNote("Les fichiers ne sont envoyés nulle part. En production, le navigateur envoie la vidéo directement à l'hébergeur vidéo via une URL à usage unique ; l'hébergeur encode, chiffre (DRM) puis confirme par un webhook signé.")}
      </div>
      <div class="stack">
        <section class="glass card stack" style="gap:12px"><span class="eyebrow">Informations</span>
          <div class="field"><label for="b-title">Titre</label><input id="b-title" class="input" value="${esc(c.title)}"></div>
          <div class="field"><label for="b-sum">Résumé</label><textarea id="b-sum" class="input">${esc(c.summary)}</textarea></div>
          <div class="form-grid"><div class="field"><label for="b-level">Niveau</label><select id="b-level" class="input">${["Fondamental", "Intermédiaire", "Avancé", "Expert"].map((l) => `<option ${l === c.level ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div class="field"><label for="b-trainer">Formateur</label><select id="b-trainer" class="input">${Object.values(D.trainers).map((t) => `<option ${t.id === c.trainer ? "selected" : ""}>${esc(t.name)}</option>`).join("")}</select></div></div></section>
        <section class="glass card stack" style="gap:12px"><span class="eyebrow">Règles d'accès</span>
          ${[["free", "Gratuit pour les professionnels éligibles"], ["paid", "Inscription payante"], ["equipment", "Inclus avec l'équipement"], ["manual_only", "Sur invitation uniquement"]].map(([k, l]) => `<label class="check"><input type="checkbox" ${r.rules.includes(k) ? "checked" : ""}> ${l}</label>`).join("")}
          <div class="form-grid"><div class="field"><label for="b-price">Prix (MAD TTC)</label><input id="b-price" class="input" type="number" value="${r.price || ""}" placeholder="—"></div><div class="field"><label for="b-dur">Durée d'accès</label><select id="b-dur" class="input"><option>Illimitée</option><option>12 mois</option><option>6 mois</option></select></div></div>
          <div class="small muted">Machines : ${D.devices.filter((d) => S().equipRules[`${d.id}|${c.id}`]).map((d) => d.name).join(", ") || "aucune"} · <a href="#/admin/entitlements" style="text-decoration:underline">modifier la correspondance</a></div>
          <span class="eyebrow" style="margin-top:6px">Éligibilité</span>
          <label class="check"><input type="checkbox" ${r.verifiedOnly ? "checked" : ""}> Professionnels vérifiés uniquement</label>
          <label class="check"><input type="checkbox" ${r.professions ? "checked" : ""}> Médecins uniquement</label></section>
        <section class="glass card stack" style="gap:12px"><span class="eyebrow">Évaluation & certificat</span>
          <div class="form-grid"><div class="field"><label for="b-pass">Seuil de réussite</label><input id="b-pass" class="input" type="number" value="${c.passing}" min="0" max="100"></div><div class="field"><label for="b-att">Tentatives</label><input id="b-att" class="input" type="number" value="3"></div></div>
          <div class="field"><label for="b-cert">Type de certificat</label><select id="b-cert" class="input"><option selected>Certificat de fin de formation</option><option disabled>Accrédité (nécessite un organisme accréditeur)</option></select></div></section>
      </div>
    </div>`;
  }

  /* ── Accès & droits ── */
  function entitlements() {
    return `${head("Contrôle d'accès", `Équipement <span class="iridescent">×</span> formation`, `<button class="btn solid" data-a="grantmodal">${icon("key", 16)} Accorder l'accès</button>`)}
    <p class="muted" style="max-width:760px;margin:-8px 0 20px">Cochez une case pour inclure un programme avec un modèle de machine. Lier une machine à un compte crée automatiquement les droits correspondants. L'achat d'une technologie ne débloque jamais les autres.</p>
    <section class="glass card" style="padding:8px"><div class="table-wrap"><table class="t matrix"><thead><tr><th>Modèle de machine</th>${D.courses.map((c) => `<th class="rot" title="${esc(c.title)}">${esc(c.title.split(" — ")[0].split(" : ")[0].slice(0, 30))}</th>`).join("")}</tr></thead><tbody>
      ${D.devices.map((d) => `<tr><td style="white-space:nowrap"><div class="row"><img src="img/${d.id}.jpg" alt="" style="width:24px;height:30px;object-fit:cover;border-radius:4px"><b class="small">${d.name}</b></div></td>${D.courses.map((c) => `<td class="c"><input type="checkbox" data-a="rule" data-v="${d.id}|${c.id}" ${S().equipRules[`${d.id}|${c.id}`] ? "checked" : ""} aria-label="${d.name} inclut ${esc(c.title)}"></td>`).join("")}</tr>`).join("")}
    </tbody></table></div></section>
    <div class="section-title" style="margin-top:28px"><h2 class="h3">Accès accordés manuellement</h2><span class="mono">${S().grants.length} actifs</span></div>
    <section class="glass card" style="padding:0"><div class="table-wrap"><table class="t"><thead><tr><th>Professionnel</th><th>Cours</th><th>Motif</th><th>Jusqu'au</th><th>Accordé par</th><th></th></tr></thead><tbody>
      ${S().grants.map((g, i) => `<tr><td style="font-weight:600">${esc(g.user)}</td><td>${esc(course(g.course).title)}</td><td class="small">${esc(g.reason)}</td><td class="mono">${g.until || "—"}</td><td class="small muted">${esc(g.by)}</td><td style="text-align:right"><button class="btn sm danger" data-a="revokegrant" data-v="${i}">Révoquer</button></td></tr>`).join("")}
    </tbody></table></div></section>
    <div class="callout" style="margin-top:20px">${icon("link", 18)}<div class="small"><b>Provisionnement par le CRM (prévu).</b> Les mêmes droits seront créés plus tard à partir de la base clients CELLULIFT (vente enregistrée → machine liée → accès ouvert) ; cet écran restera pour les exceptions.</div></div>`;
  }

  /* ── Ventes d'équipements ── */
  function equipment() {
    S().crm ||= { last: "2026-10-20 10:30", incoming: [], runs: 1 };
    const crm = S().crm;
    const st = { linked: `<span class="badge ok">Liée</span>`, invite_sent: `<span class="badge pending">Invitation envoyée</span>`, unlinked: `<span class="badge locked">Non liée</span>`, no_email: `<span class="badge warn">À rattacher · pas d'e-mail</span>` };
    const n = (k) => S().sales.filter((x) => x.status === k).length;
    return `${head("Clients", `Ventes <span class="iridescent">&</span> CRM`, `<button class="btn" data-a="newsale">${icon("plus", 16)} Saisie manuelle</button><button class="btn solid" data-a="crmsync">${icon("link", 16)} Synchroniser maintenant</button>`)}
    <section class="glass card" style="margin-bottom:20px">
      <div class="row wrap between" style="gap:18px">
        <div class="row" style="gap:14px"><span class="dot-live"></span><div><div style="font-weight:600">Connecté au CRM Cellulift <span class="badge">Simulé</span></div><div class="small muted">Dernière synchronisation : ${esc(crm.last)} · automatique toutes les 15 min · ${crm.incoming.length} installation${crm.incoming.length > 1 ? "s" : ""} en attente côté CRM</div></div></div>
        <div class="row wrap" style="gap:8px">${[["Liées", n("linked"), "ok"], ["Invitations", n("invite_sent"), "pending"], ["À rattacher", n("no_email"), "warn"], ["Non liées", n("unlinked"), "locked"]].map(([l, v, c]) => `<span class="badge ${c}">${l} · ${v}</span>`).join("")}</div>
      </div>
      <div class="signal" style="margin:16px 0"></div>
      <div class="small muted">Chaque affaire gagnée dans le CRM avec une machine (<span class="mono">equipements_clients</span>) ouvre le programme de formation de cette machine au praticien indiqué : rattachement par e-mail à un compte Academy existant, sinon invitation. Sans e-mail, l'installation attend ici qu'un administrateur la rattache.</div>
    </section>
    <section class="glass card" style="padding:0"><div class="table-wrap"><table class="t"><thead><tr><th>Client</th><th>Machine</th><th>N° de série</th><th>Date</th><th>Origine</th><th>Compte Academy</th><th>Statut</th><th></th></tr></thead><tbody>
      ${S().sales.map((s, i) => `<tr><td><div style="font-weight:600">${esc(s.client)}</div>${s.rep ? `<div class="small muted">Commercial : ${esc(s.rep)}</div>` : ""}</td><td><div class="row"><img src="img/${s.device}.jpg" alt="" style="width:22px;height:28px;object-fit:cover;border-radius:4px">${device(s.device).name}</div></td><td class="mono">${s.serial}</td><td class="mono">${s.date}</td>
        <td>${s.src === "crm" ? `<span class="badge included">CRM</span>` : `<span class="badge">Manuelle</span>`}</td>
        <td>${s.user ? esc(userName(s.user)) : s.email ? `<span class="small muted">${esc(s.email)}</span>` : "—"}</td><td>${st[s.status]}</td>
        <td style="text-align:right">${s.status !== "linked" ? `<button class="btn sm" data-a="linksale" data-v="${i}">${icon("link", 13)} Rattacher</button>` : ""}</td></tr>`).join("")}
    </tbody></table></div></section>
    <div class="callout warn" style="margin-top:20px">${icon("alert", 18)}<div class="small"><b>Prérequis côté CRM.</b> Aujourd'hui, aucune des 34 affaires gagnées du CRM n'indique la machine vendue, et 5 seulement ont un e-mail client. La synchronisation ne pourra ouvrir des accès qu'une fois la machine, le n° de série et le praticien saisis à la vente (voir docs/05-integration-crm.md).</div></div>
    <div class="callout" style="margin-top:12px">${icon("users", 18)}<div class="small"><b>Astuce — d'Open Academy à client.</b> Rattachez une vente à <b>Youssef Amrani</b>, puis repassez sur le profil « Open Academy » : son cours gratuit, sa commande en attente et son historique sont conservés, et le programme de la machine apparaît.</div></div>`;
  }

  /* ── Protection des contenus ── */
  function protection() {
    const p = S().protection;
    const tg = (k, l, h) => `<div class="row between" style="padding:12px 0;border-bottom:1px solid var(--line)"><div><div class="small" style="font-weight:600">${l}</div>${h ? `<div class="small muted">${h}</div>` : ""}</div><label class="toggle"><input type="checkbox" data-a="prot" data-v="${k}" ${p[k] ? "checked" : ""} aria-label="${l}"><span></span></label></div>`;
    const sel = (k, l, opts, unit) => `<div class="row between" style="padding:12px 0;border-bottom:1px solid var(--line)"><div class="small" style="font-weight:600">${l}</div><select class="input" style="width:130px;height:36px" data-a="protsel" data-v="${k}" aria-label="${l}">${opts.map((o) => `<option value="${o}" ${p[k] == o ? "selected" : ""}>${o} ${unit}</option>`).join("")}</select></div>`;
    const level = [
      ["Lecture authentifiée, avec contrôle des droits", "Garanti côté serveur", "ok"],
      ["Jetons de lecture signés (expirants, liés à l'utilisateur)", "Garanti côté serveur", "ok"],
      ["Streaming chiffré, aucun MP4 exposé", "Garanti côté serveur", "ok"],
      ["Protection des clés Widevine / FairPlay / PlayReady", "Garanti côté serveur", "ok"],
      ["Limites de flux et d'appareils, révocation", "Garanti côté serveur", "ok"],
      ["Écran noir à la capture d'écran", "Plateforme-dépendant", "warn"],
      ["Filigrane dynamique visible", "Dissuasif · traçable", "pending"],
      ["Détection du partage de compte", "Détectif", "pending"],
      ["Blocage du clic droit / des outils de développement", "Cosmétique", "locked"],
      ["Filmer l'écran avec un téléphone", "Impossible à empêcher", "err"],
    ];
    return `${head("Sécurité", `Protection des <span class="iridescent">contenus</span>`, `<button class="btn solid" data-a="saveprot">Enregistrer la politique</button>`)}
    ${simNote("Ces réglages pilotent uniquement le lecteur simulé. Une protection réelle exige l'hébergeur vidéo / DRM décrit dans docs/04-production-roadmap.md.")}
    <div class="grid g2" style="margin-top:20px">
      <section class="glass card"><span class="eyebrow">Lecture</span>
        ${tg("drm", "Exiger le DRM pour toutes les vidéos de cours", "Widevine, FairPlay ou PlayReady selon le navigateur")}
        ${sel("ttl", "Durée de validité du jeton de lecture", [1, 2, 4, 6], "h")}${sel("streams", "Flux simultanés par compte", [1, 2, 3], "")}${sel("devices", "Appareils enregistrés par compte", [2, 3, 5], "")}
        ${tg("pdfStamp", "Marquer les PDF de protocoles à l'identité de l'apprenant", "Nom, identifiant et date sur chaque page")}</section>
      <section class="glass card"><span class="eyebrow">Filigrane dynamique</span>
        ${tg("watermark", "Afficher un filigrane mobile sur la vidéo", "Change de position toutes les quelques secondes")}${tg("wmName", "Nom complet")}${tg("wmEmail", "Adresse e-mail")}${tg("wmId", "Identifiant apprenant")}${tg("wmTime", "Date et heure")}
        <div class="video" style="margin-top:14px;aspect-ratio:16/6;border-radius:16px"><div class="stage"></div><div class="wm" style="left:12%;top:40%">${esc(p.watermark ? "Dr Salma Benali · ID 4821 · " + today() + " 14:32" : "Filigrane désactivé")}</div></div></section>
      <section class="glass card"><span class="eyebrow">Détection du partage</span>
        ${tg("travel", "Signaler les déplacements impossibles", "Deux pays éloignés en moins de 6 heures")}
        <div class="row between" style="padding:12px 0"><div class="small" style="font-weight:600">Action en cas d'alerte</div><select class="input" style="width:220px;height:36px" aria-label="Action en cas d'alerte"><option>Examen par un administrateur</option><option>Exiger une reconnexion</option><option>Suspendre automatiquement</option></select></div>
        ${tg("rightClick", "Désactiver le clic droit sur le lecteur", "Cosmétique uniquement — facilement contourné ; ne compte pas comme une protection")}</section>
      <section class="glass card"><span class="eyebrow">Ce que fait réellement chaque couche</span>
        <div class="list" style="margin-top:6px">${level.map(([l, t, c]) => `<div class="item" style="padding:9px 0"><span class="small" style="flex:1">${l}</span><span class="badge ${c}">${t}</span></div>`).join("")}</div></section>
    </div>
    <div class="section-title" style="margin-top:28px"><h2 class="h3">Alertes ouvertes</h2></div>
    <section class="glass card" style="padding:0"><div class="table-wrap"><table class="t"><thead><tr><th>Apprenant</th><th>Signal</th><th>Détail</th><th>Gravité</th><th>Quand</th><th></th></tr></thead><tbody>
      ${S().alerts.map((a, i) => `<tr><td style="font-weight:600">${esc(a.user)}</td><td>${esc(a.kind)}</td><td class="small">${esc(a.detail)}</td><td><span class="badge ${a.score === "Élevée" ? "err" : "warn"}">${a.score}</span></td><td class="mono">${a.when}</td>
        <td style="text-align:right;white-space:nowrap"><button class="btn sm" data-a="alertact" data-v="${i}" data-k="signout">Tout déconnecter</button> <button class="btn sm ghost" data-a="alertact" data-v="${i}" data-k="dismiss">Ignorer</button></td></tr>`).join("") || `<tr><td colspan="6" class="small muted">Aucune alerte ouverte.</td></tr>`}
    </tbody></table></div></section>`;
  }

  /* ── Analyses ── */
  function analytics() {
    return `${head("Activité & formation", "Analyses", sampleTag + `<button class="btn" data-a="toast" data-v="Export CSV généré (simulé)">Exporter en CSV</button>`)}
    <div class="grid g4 kpis stagger" style="margin-bottom:20px">
      ${kpi("Professionnels inscrits", "1 284", "+7,2 % sur un mois")}${kpi("Professionnels vérifiés", "812", "63 %")}${kpi("Apprenants actifs · 30 j", "437", "+12 %")}${kpi("Inscriptions · depuis janv.", "2 409", "+31 % sur un an")}
      ${kpi("Taux d'achèvement", "64 %", "+3 pts")}${kpi("Gratuit → payant", "18,6 %", "des apprenants gratuits")}${kpi("Open Academy → client", "23", "3,3 % · 2026")}${kpi("Rétention partenaires à 90 j", "72 %", "−2 pts", true)}
    </div>
    <div class="grid g2">
      <section class="glass card"><span class="eyebrow">Achèvement par cours</span><div style="margin-top:12px;display:grid;gap:12px">
        ${D.courses.map((c, i) => [c, stats(c, i)]).sort((a, b) => b[1].completion - a[1].completion).map(([c, s]) => `<div><div class="row between small"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:75%">${esc(c.title)}</span><span class="mono">${s.completion}%</span></div>${bar(s.completion)}</div>`).join("")}</div></section>
      <div class="stack">
        <section class="glass card"><span class="eyebrow">Activation partenaires par famille</span><div class="funnel" style="margin-top:14px">${[["Lasers", 88], ["Rajeunissement", 79], ["Remodelage corporel", 71], ["Photomodulation", 64]].map(([l, v]) => `<div class="f"><span>${l}</span>${bar(v)}<span class="mono">${v}%</span></div>`).join("")}</div>
          <p class="small muted" style="margin-top:12px">Part des machines vendues dont le propriétaire a commencé le programme correspondant sous 30 jours.</p></section>
        <section class="glass card"><span class="eyebrow">Engagement</span><div class="grid g2" style="margin-top:12px;gap:14px">
          ${[["Temps de visionnage médian / apprenant / semaine", "38 min"], ["Leçons terminées · 30 j", "3 112"], ["Réussite au quiz (1re tentative)", "71 %"], ["Inscriptions aux ateliers", "64"]].map(([l, v]) => `<div class="hair" style="padding:14px"><div class="mono" style="font-size:9.5px">${l}</div><div class="display" style="font-size:24px;margin-top:8px">${v}</div></div>`).join("")}</div></section>
        <div class="callout small">${icon("eye", 18)}<div>Les indicateurs commerciaux ne sont visibles que par l'équipe CELLULIFT. Les apprenants ne voient jamais de sollicitation commerciale pendant les leçons ; les recommandations restent pédagogiques.</div></div>
      </div>
    </div>`;
  }

  /* ── Journal d'audit ── */
  const AUDIT_FILTERS = [["All", "Tout"], ["entitlement", "Droits"], ["user", "Utilisateurs"], ["device", "Machines"], ["crm", "CRM"], ["course", "Cours"], ["order", "Commandes"], ["protection", "Protection"]];
  function auditView() {
    const f = window.__auditFilter || "All";
    const list = S().audit.filter((a) => f === "All" || a.action.startsWith(f));
    return `${head("Sécurité", "Journal d'audit", `<button class="btn" data-a="toast" data-v="Export signé et téléchargé (simulé)">Exporter</button>`)}
    <div class="row wrap" style="margin-bottom:14px">${AUDIT_FILTERS.map(([v, l]) => `<button class="chip ${f === v ? "on" : ""}" data-a="afilter" data-v="${v}">${l}</button>`).join("")}</div>
    <section class="glass card" style="padding:0"><div class="table-wrap"><table class="t"><thead><tr><th>Date</th><th>Auteur</th><th>Action</th><th>Cible</th><th>Note</th></tr></thead><tbody>
      ${list.map((a) => `<tr><td class="mono">${a.at}</td><td class="small">${esc(a.actor)}</td><td><span class="badge">${a.action}</span></td><td>${esc(a.target)}</td><td class="small muted">${esc(a.note)}</td></tr>`).join("")}
    </tbody></table></div></section>
    <p class="small muted" style="margin-top:12px">En production, le journal est en ajout seul : écrit dans la même transaction que la modification, jamais modifiable depuis l'administration.</p>`;
  }

  window.renderAdmin = (a, b) => {
    const views = { undefined: overview, "": overview, users, verification, courses, entitlements, equipment, protection, analytics, audit: auditView };
    if (a === "course") return A.shell("admin/courses", builder(b));
    const v = views[a] || overview;
    return A.shell(a ? `admin/${a}` : "admin", v());
  };

  const rerender = () => { save(); A.render(); };
  const linkDeviceTo = (uid, sale) => {
    const st = stateOf(uid);
    if (st && !st.devices.find((d) => d.serial === sale.serial)) st.devices.push({ device: sale.device, serial: sale.serial, date: sale.date, clinic: sale.client });
    const u = S().users.find((x) => x.id === uid);
    if (u) u.type = "Partenaire";
    sale.user = uid; sale.status = "linked";
    audit("device.link", `${sale.serial} → ${userName(uid)}`, st ? "Droits générés" : "");
  };

  window.ADMIN_ACTIONS = {
    toast: (el, e) => { e.preventDefault(); toast(el.dataset.v); },
    ufilter: (el) => { window.__userFilter = el.dataset.v; rerender(); },
    afilter: (el) => { window.__auditFilter = el.dataset.v; rerender(); },
    usersheet: (el) => userSheet(el.dataset.v),
    approve: (el) => {
      const uid = el.dataset.v, u = S().users.find((x) => x.id === uid);
      if (u) u.status = "verified";
      S().queue = S().queue.filter((q) => q.user !== uid);
      const st = stateOf(uid); if (st) st.verification = "verified";
      audit("user.verify", u?.name || uid, "Inscription vérifiée"); closeOverlay(); rerender(); toast(`${u?.name} vérifié(e) — apprenant notifié`);
    },
    reject: (el) => {
      const uid = el.dataset.v, u = S().users.find((x) => x.id === uid);
      if (u) u.status = "rejected";
      S().queue = S().queue.filter((q) => q.user !== uid);
      const st = stateOf(uid); if (st) st.verification = "unverified";
      audit("user.reject", u?.name || uid, "Numéro introuvable au tableau de l'Ordre"); rerender(); toast("Demande refusée — motif envoyé à l'apprenant");
    },
    suspend: (el) => { const u = S().users.find((x) => x.id === el.dataset.v); u.status = u.status === "suspended" ? "verified" : "suspended"; audit(u.status === "suspended" ? "user.suspend" : "user.reactivate", u.name); closeOverlay(); rerender(); toast(u.status === "suspended" ? "Compte suspendu · sessions et licences révoquées" : "Compte réactivé"); },
    revoke: (el) => { const st = stateOf(el.dataset.u); const e = st.entitlements[+el.dataset.i]; e.revoked = true; audit("entitlement.revoke", `${userName(el.dataset.u)} → ${course(e.course).title}`); save(); userSheet(el.dataset.u); toast("Accès révoqué · la lecture en cours s'arrête au prochain contrôle de licence"); },
    invite: () => overlay(`<div class="eyebrow">Invitation</div><h2 class="display h2" style="margin:10px 0 14px">Inviter un professionnel</h2><form data-form="invite" class="stack" style="gap:12px"><input class="input" required placeholder="Nom complet" aria-label="Nom complet"><input class="input" type="email" required placeholder="E-mail" aria-label="E-mail"><select class="input" aria-label="Cours attribué"><option value="">Aucun cours pré-attribué</option>${D.courses.map((c) => `<option>${esc(c.title)}</option>`).join("")}</select><div class="row between"><button type="button" class="btn ghost" data-a="close">Annuler</button><button class="btn solid">Envoyer l'invitation</button></div></form>`),
    publish: (el) => { S().published[el.dataset.v] = el.checked; audit(el.checked ? "course.publish" : "course.unpublish", course(el.dataset.v).title); save(); toast(el.checked ? "Cours publié" : "Cours retiré du catalogue"); },
    newcourse: () => overlay(`<div class="eyebrow">Nouveau cours</div><h2 class="display h2" style="margin:10px 0 14px">Créer un cours</h2><form data-form="invite" class="stack" style="gap:12px"><input class="input" required placeholder="Titre" aria-label="Titre"><select class="input" aria-label="Format"><option>Programme machine</option><option>Masterclass</option><option>Module</option></select><select class="input" aria-label="Machine">${D.devices.map((d) => `<option>${d.name}</option>`).join("")}<option>Aucune machine en particulier</option></select><div class="row between"><button type="button" class="btn ghost" data-a="close">Annuler</button><button class="btn solid">Créer le brouillon</button></div></form>`),
    savecourse: (el) => { audit("course.update", course(el.dataset.v).title); save(); toast("Cours enregistré — nouvelle version publiée"); },
    upload: (el) => {
      const target = document.getElementById(el.dataset.v);
      if (!target) return;
      const steps = ["Envoi 0 %", "Envoi 46 %", "Envoi 100 %", "Encodage…", "Chiffrement DRM…", "Prête · DRM"];
      let i = 0; target.className = target.className.replace("ok", "pending");
      const t = setInterval(() => { target.textContent = steps[i++]; if (i === steps.length) { clearInterval(t); target.className = target.className.replace("pending", "ok"); toast("Vidéo prête (chaîne simulée)"); } }, 650);
    },
    rule: (el) => { S().equipRules[el.dataset.v] = el.checked; const [d, c] = el.dataset.v.split("|"); audit("entitlement.mapping", `${device(d).name} ${el.checked ? "inclut" : "n'inclut plus"} ${course(c).title}`); save(); toast("Correspondance mise à jour — s'applique à tous les propriétaires de cette machine"); },
    grantmodal: () => overlay(`<div class="eyebrow">Accès manuel</div><h2 class="display h2" style="margin:10px 0 14px">Accorder l'accès</h2>
      <form data-form="grant" class="stack" style="gap:12px"><div class="field"><label for="g-user">Professionnel</label><select id="g-user" class="input" name="user">${S().users.map((u) => `<option value="${u.id}">${esc(u.name)} — ${esc(u.email)}</option>`).join("")}</select></div>
      <div class="field"><label for="g-course">Cours</label><select id="g-course" class="input" name="course">${D.courses.map((c) => `<option value="${c.id}">${esc(c.title)}</option>`).join("")}</select></div>
      <div class="form-grid"><div class="field"><label for="g-reason">Motif (journalisé)</label><input id="g-reason" class="input" name="reason" required placeholder="ex. Démo salon professionnel"></div><div class="field"><label for="g-until">Jusqu'au (facultatif)</label><input id="g-until" class="input" name="until" type="date"></div></div>
      <div class="row between"><button type="button" class="btn ghost" data-a="close">Annuler</button><button class="btn solid">Accorder l'accès</button></div></form>`),
    revokegrant: (el) => { const g = S().grants.splice(+el.dataset.v, 1)[0]; audit("entitlement.revoke", `${g.user} → ${course(g.course).title}`); rerender(); toast("Accès révoqué"); },
    linksale: (el) => { const s = S().sales[+el.dataset.v]; overlay(`<div class="eyebrow">Lier une machine</div><h2 class="display h2" style="margin:10px 0 6px">${device(s.device).name} · ${s.serial}</h2><p class="small muted" style="margin-bottom:14px">${esc(s.client)} · vendue le ${s.date}</p>
      <form data-form="linksale" data-v="${el.dataset.v}" class="stack" style="gap:12px"><div class="field"><label for="ls-user">Compte Academy existant</label><select id="ls-user" class="input" name="user">${S().users.map((u) => `<option value="${u.id}" ${u.id === D.personas.open.id ? "selected" : ""}>${esc(u.name)} — ${esc(u.email)}</option>`).join("")}</select><span class="hint">Cherchez par nom, e-mail ou numéro d'inscription avant d'inviter, pour éviter les comptes en double.</span></div>
      <div class="row between"><button type="button" class="btn" data-a="sendinvite" data-v="${el.dataset.v}">Envoyer une invitation à la place</button><button class="btn solid">Lier & ouvrir la formation</button></div></form>`); },
    crmsync: () => {
      const crm = S().crm, got = crm.incoming.splice(0);
      let linked = 0, invited = 0, review = 0;
      got.forEach((x) => {
        const sale = { ...x, user: null, status: "unlinked" };
        S().sales.unshift(sale);
        const u = x.email && S().users.find((u) => u.email.toLowerCase() === x.email.toLowerCase());
        if (u) { linkDeviceTo(u.id, sale); linked++; }
        else if (x.email) { sale.status = "invite_sent"; invited++; audit("device.invite", `${x.serial} → ${x.email}`, "Synchro CRM"); }
        else { sale.status = "no_email"; review++; }
      });
      crm.last = `${today()} ${new Date().toTimeString().slice(0, 5)}`; crm.runs++;
      audit("crm.sync", `${got.length} installation(s) reçue(s) du CRM`, `${linked} rattachée(s) · ${invited} invitation(s) · ${review} à rattacher`);
      rerender();
      toast(got.length ? `Synchro CRM : ${linked} rattachée(s), ${invited} invitation(s), ${review} à rattacher` : "Synchro CRM : rien de nouveau");
    },
    sendinvite: (el) => { const s = S().sales[+el.dataset.v]; s.status = "invite_sent"; s.email ||= "contact@client-sample.ma"; audit("device.invite", `${s.serial} → ${s.email}`); closeOverlay(); rerender(); toast("Invitation envoyée (simulé)"); },
    newsale: () => overlay(`<div class="eyebrow">Administration des ventes</div><h2 class="display h2" style="margin:10px 0 14px">Enregistrer une vente</h2>
      <form data-form="newsale" class="stack" style="gap:12px"><input class="input" name="client" required placeholder="Clinique / client" aria-label="Clinique ou client"><select class="input" name="device" aria-label="Machine">${D.devices.map((d) => `<option value="${d.id}">${d.name}</option>`).join("")}</select>
      <div class="form-grid"><input class="input" name="serial" required placeholder="Numéro de série" aria-label="Numéro de série"><input class="input" name="date" type="date" value="${today()}" aria-label="Date de vente"></div><input class="input" name="email" type="email" placeholder="E-mail du praticien (invitation)" aria-label="E-mail du praticien">
      <div class="row between"><button type="button" class="btn ghost" data-a="close">Annuler</button><button class="btn solid">Enregistrer</button></div></form>`),
    prot: (el) => { S().protection[el.dataset.v] = el.checked; save(); if (el.dataset.v.startsWith("wm") || el.dataset.v === "watermark") A.render(); },
    protsel: (el) => { S().protection[el.dataset.v] = +el.value; save(); },
    saveprot: () => { audit("protection.policy", "Politique de protection des contenus mise à jour"); save(); toast("Politique enregistrée"); },
    alertact: (el) => { const a = S().alerts.splice(+el.dataset.v, 1)[0]; audit("protection." + el.dataset.k, a.user, a.kind); rerender(); toast(el.dataset.k === "signout" ? "Toutes les sessions révoquées · nouveau mot de passe exigé" : "Alerte ignorée"); },
  };
  window.ADMIN_FORMS = {
    grant: (f) => {
      const d = Object.fromEntries(new FormData(f));
      const uid = f.dataset.u || d.user, st = stateOf(uid);
      if (st) st.entitlements.push({ course: d.course, source: "manual", ref: d.reason, until: d.until || null, at: today() });
      S().grants.unshift({ user: userName(uid), course: d.course, by: "Meryem (admin)", reason: d.reason, until: d.until || "" });
      audit("entitlement.grant", `${userName(uid)} → ${course(d.course).title}`, d.reason);
      closeOverlay(); rerender(); toast("Accès accordé — apprenant notifié");
    },
    invite: () => { closeOverlay(); toast("C'est fait (simulé)"); },
    linksale: (f) => { linkDeviceTo(new FormData(f).get("user"), S().sales[+f.dataset.v]); closeOverlay(); rerender(); toast("Machine liée — formation ouverte sur le compte existant"); },
    newsale: (f) => { const d = Object.fromEntries(new FormData(f)); S().sales.unshift({ client: d.client, device: d.device, serial: d.serial, date: d.date, user: null, status: d.email ? "invite_sent" : "unlinked", email: d.email }); audit("device.sale", `${d.serial} · ${d.client}`); closeOverlay(); rerender(); toast(d.email ? "Vente enregistrée · invitation envoyée" : "Vente enregistrée"); },
  };
  window.ADMIN_INPUTS = { adminq: (el) => { window.__adminQ = el.value; document.getElementById("usertable").innerHTML = userTable(); } };
})();
