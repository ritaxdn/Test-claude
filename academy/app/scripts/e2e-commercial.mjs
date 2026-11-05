// Test de bout en bout du lot 2 : parcours commercial minimum (docs/08, §6).
// Un professionnel non client découvre une formation, demande son inscription, est vérifié,
// paie par virement (validé par l'admin) et reçoit son accès. Navigateur réel (Playwright).
// Nécessite l'application démarrée (BASE_URL), migrations 002 → 004, DATABASE_URL = compte academy_app.
import { createHash, randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });
const run = Date.now().toString(36);
const IP = `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
let step = 0;
const ok = (msg) => console.log(`✓ C${String(++step).padStart(2, "0")} ${msg}`);
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
const as = (actorId, fn) => sql.begin(async (tx) => { await tx`select set_config('app.actor_id', ${actorId}, true)`; return fn(tx); });
const tmp = path.join(process.cwd(), ".e2e-tmp"); mkdirSync(tmp, { recursive: true });

async function account(full_name, role = "doctor") {
  const [u] = await sql`insert into users (email, full_name, role, status, password_hash, activated_at)
    values (${`com-${role}-${randomBytes(4).toString("hex")}-${run}@lift.test`}, ${full_name}, ${role}, 'active', 'scrypt$x', now()) returning id`;
  const token = randomBytes(32).toString("base64url");
  await sql`insert into sessions (token_hash, user_id, expires_at) values (${createHash("sha256").update(token).digest("hex")}, ${u.id}, now() + interval '1 day')`;
  return { id: u.id, token };
}
const browser = await chromium.launch();
async function pageFor(who, viewport = { width: 1280, height: 900 }) {
  const ctx = await browser.newContext({ viewport, extraHTTPHeaders: { "x-forwarded-for": IP } });
  if (who) await ctx.addCookies([{ name: "academy_session", value: who.token, url: BASE }]);
  return ctx.newPage();
}
const norm = (t) => (t ?? "").replace(/[\u202f\u00a0]/g, " ");
const text = async (p) => norm(await p.textContent("main"));
const sha = (t) => createHash("sha256").update(t).digest("hex");
async function confirmEmail(email) {
  const tok = randomBytes(32).toString("base64url");
  await sql`update enrollment_requests set confirm_token_hash = ${sha(tok)} where email = ${email} and email_confirmed_at is null and status = 'new'`;
  const p = await pageFor(null);
  await p.goto(`${BASE}/formations/confirmer/${tok}`);
  await p.click("button:has-text('Confirmer ma demande')"); await p.waitForURL(/confirmer\/ok/);
  return tok;
}

try {
  // ── Préparation : un vérificateur habilité, un admin non habilité, une formation au catalogue ──
  const V = await account("Vérificatrice E2E", "admin");
  const N = await account("Admin non habilité E2E", "admin");
  await as(N.id, (tx) => tx`update users set can_verify_qualifications = true where id = ${V.id}`);
  const slug = `formation-com-${run}`;
  const [T] = await as(V.id, (tx) => tx`insert into programs (slug, title, summary, kind, eligible_professions, published, listed, tagline, objectives, audience, prerequisites, price_mad, price_eur, access_months)
    values (${slug}, ${`Lasers et phototypes E2E ${run}`}, 'Résumé.', 'training', '{dermatologue,medecin_esthetique}', true, true, 'Choisir les bons paramètres selon le phototype.',
            ${["Classer un phototype", "Reconnaître une contre-indication"]}, 'Médecins pratiquant le laser.', 'Diplôme de médecine.', 2400, 220, 12) returning id`);
  const [m] = await sql`insert into modules (program_id, position, title) values (${T.id}, 1, 'Comprendre les phototypes') returning id`;
  const [pres] = await sql`select id from presenters where name = 'Dr Mohamed Dadoun'`;
  await sql`insert into lessons (module_id, position, title, video_ref, duration_sec, presenter_id) values (${m.id}, 1, 'La classification de Fitzpatrick', 'lecon-1.webm', 12, ${pres?.id ?? null}), (${m.id}, 2, 'Le test préalable', 'lecon-2.webm', 12, null)`;
  await sql`insert into documents (program_id, title, storage_key) values (${T.id}, 'Check-list sécurité', 'exemple/fiche-protocole.pdf')`;
  const [U] = await sql`insert into programs (slug, title, kind, eligible_professions, published, listed) values (${`non-listee-${run}`}, 'Formation non listée E2E', 'training', '{dermatologue}', true, false) returning id`;
  ok("Préparation : formation au catalogue (prix MAD et EUR, 12 mois), formation publiée non listée, vérificateur habilité");

  // ── C1. Catalogue vide : aucune carte inventée ──
  const listed = await sql`select id from programs where listed`;
  await sql`update programs set listed = false where listed`;
  const anon = await pageFor(null);
  await anon.goto(`${BASE}/formations`);
  expect((await text(anon)).includes("Catalogue en préparation") && (await anon.locator("article").count()) === 0, "catalogue vide");
  await sql`update programs set listed = true where id = any(${listed.map((r) => r.id)})`;
  ok("Catalogue sans formation listée : « Catalogue en préparation », aucune carte");

  // ── C2/C3. Catalogue, formation non listée, fiche publique ──
  await anon.goto(`${BASE}/formations`);
  const cat = await text(anon);
  expect(cat.includes(`Lasers et phototypes E2E ${run}`) && !cat.includes("Formation non listée E2E") && cat.includes("2 400 MAD"), "catalogue");
  expect((await anon.goto(`${BASE}/formations/non-listee-${run}`)).status() === 404 && (await anon.goto(`${BASE}/formations/non-listee-${run}/inscription`)).status() === 404, "non listée : 404");
  await anon.goto(`${BASE}/formations/${slug}`);
  const fiche = await text(anon);
  expect(fiche.includes("Classer un phototype") && fiche.includes("La classification de Fitzpatrick") && fiche.includes("Dr Mohamed Dadoun") && fiche.includes("2 400 MAD") && fiche.includes("220 €") && fiche.includes("12 mois") && fiche.includes("habilite pas"), "fiche : objectifs, programme, intervenant, prix, durée, mention");
  const leaks = await anon.locator("a[href*='/api/'], a[href*='/parcours/'], video").count();
  expect(leaks === 0, `fiche : aucun lien vers une vidéo, un document ou une leçon (${leaks})`);
  ok("Catalogue et fiche : non listée absente (404) ; programme, intervenant, prix MAD/EUR, 12 mois, mention ; aucun accès au contenu");

  // ── Formulaire : robots, profession non autorisée, fichiers refusés ──
  const fill = async (p, o = {}) => {
    await p.goto(`${BASE}/formations/${slug}/inscription`);
    await p.fill("#full_name", o.name ?? "Dr Inès Berrada"); await p.fill("#email", o.email ?? `ines-${run}@cabinet.test`);
    await p.selectOption("#country", o.country ?? "MA"); await p.selectOption("#profession", o.profession ?? "dermatologue");
    await p.fill("#professional_id", o.ordre ?? "ORDRE-12345"); await p.check("input[name=consent]");
    if (o.file) await p.setInputFiles("#proof", o.file);
    if (o.marketing) await p.check("input[name=marketing]");
  };
  const count = async (email) => (await sql`select count(*)::int as n from enrollment_requests where email = ${email}`)[0].n;
  let pf = await pageFor(null);
  await fill(pf, { email: `robot-${run}@x.test` });
  await pf.evaluate(() => { document.querySelector("input[name=website]").value = "spam"; });
  await pf.waitForTimeout(3100); await pf.click("button[type=submit]"); await pf.waitForURL(/merci/);
  await fill(pf, { email: `rapide-${run}@x.test` }); await pf.click("button[type=submit]"); await pf.waitForURL(/merci/);
  expect((await count(`robot-${run}@x.test`)) === 0 && (await count(`rapide-${run}@x.test`)) === 0, "robots : rien d'enregistré");
  ok("Robots (champ piège, envoi en moins de 3 s) : page « merci », rien d'enregistré");
  await fill(pf, { email: `kine-${run}@x.test` });
  await pf.evaluate(() => { const s = document.querySelector("#profession"); s.add(new Option("Kiné", "kinesitherapeute")); s.value = "kinesitherapeute"; });
  await pf.waitForTimeout(3100); await pf.click("button[type=submit]");
  await pf.waitForSelector(".alert.err");
  expect((await pf.textContent(".alert.err")).includes("réservée aux professions suivantes") && (await count(`kine-${run}@x.test`)) === 0, "profession non autorisée");
  expect((await pf.inputValue("#full_name")) === "Dr Inès Berrada", "saisie conservée après l'erreur");
  ok("Profession non autorisée (forcée hors de la liste) : refus clair côté serveur, saisie conservée, rien d'enregistré");
  const fakePdf = path.join(tmp, "faux.pdf"); writeFileSync(fakePdf, "ceci n'est pas un pdf");
  const big = path.join(tmp, "gros.pdf"); writeFileSync(big, Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(5 * 1024 * 1024 + 10)]));
  await fill(pf, { email: `faux-${run}@x.test`, file: fakePdf }); await pf.waitForTimeout(3100); await pf.click("button[type=submit]"); await pf.waitForSelector(".alert.err");
  expect((await pf.textContent(".alert.err")).includes("formats acceptés"), "faux PDF refusé");
  await fill(pf, { email: `gros-${run}@x.test`, file: big }); await pf.waitForTimeout(3100); await pf.click("button[type=submit]"); await pf.waitForSelector(".alert.err");
  expect((await pf.textContent(".alert.err")).includes("5 Mo"), "fichier > 5 Mo refusé");
  ok("Justificatif : faux PDF (contenu vérifié, pas le nom) et fichier de plus de 5 Mo refusés");

  // ── C4. Demande valide avec justificatif (Maroc → MAD) ──
  const proof = path.join(tmp, "carte.pdf"); writeFileSync(proof, "%PDF-1.4\n% carte professionnelle de test\n%%EOF\n");
  const email = `ines-${run}@cabinet.test`;
  await fill(pf, { file: proof, marketing: true }); await pf.waitForTimeout(3100); await pf.click("button[type=submit]"); await pf.waitForURL(/merci/);
  expect((await text(pf)).includes("votre demande est enregistrée") && (await text(pf)).includes("confirmez votre adresse e-mail"), "page de confirmation");
  const [req] = await sql`select r.id, r.status, r.marketing_consent_at is not null as marketing, r.email_confirmed_at, d.id as doc_id, d.storage_key, d.sha256, d.mime_type from enrollment_requests r join qualification_documents d on d.request_id = r.id where r.email = ${email}`;
  expect(req?.status === "new" && req.mime_type === "application/pdf" && existsSync(path.join(process.cwd(), "private-media", "justificatifs", req.storage_key)), "demande + justificatif enregistrés");
  expect(req.marketing && req.email_confirmed_at === null, "consentement commercial enregistré, adresse pas encore confirmée");
  ok("Demande valide : page de confirmation ; demande « nouvelle » et justificatif privé enregistrés (type réel, empreinte) ; consentement commercial distinct");

  // ── Adresse e-mail à confirmer avant toute décision ──
  {
    const vq = await pageFor(V);
    await vq.goto(`${BASE}/admin/demandes/${req.id}`);
    expect((await text(vq)).includes("pas encore confirmée") && (await vq.locator("button:has-text('accepter')").count()) === 0, "non confirmée : pas d'acceptation à l'écran");
    let blocked = false;
    try { await as(V.id, (tx) => tx`update enrollment_requests set status = 'approved', reviewed_by = ${V.id}, reviewed_at = now() where id = ${req.id}`); } catch (e) { blocked = /non confirmée/.test(e.message); }
    expect(blocked, "non confirmée : acceptation refusée par la base");
    const tok = await confirmEmail(email);
    const again = await pageFor(null); await again.goto(`${BASE}/formations/confirmer/${tok}`); await again.click("button:has-text('Confirmer ma demande')"); await again.waitForURL(/invalide/);
    const [c] = await sql`select email_confirmed_at is not null as ok, confirm_token_hash from enrollment_requests where id = ${req.id}`;
    expect(c.ok && c.confirm_token_hash === null, "adresse confirmée, jeton consommé");
    const pdup = await pageFor(null);
    await fill(pdup, { file: proof }); await pdup.waitForTimeout(3100); await pdup.click("button[type=submit]"); await pdup.waitForSelector(".alert.err");
    expect((await pdup.textContent(".alert.err")).includes("déjà en cours"), "doublon refusé");
    await fill(pdup, { name: "Dr Ines http://phishing.example", email: `nom-${run}@x.test` }); await pdup.waitForTimeout(3100); await pdup.click("button[type=submit]"); await pdup.waitForSelector(".alert.err");
    expect((await pdup.textContent(".alert.err")).includes("lettres uniquement") && (await count(`nom-${run}@x.test`)) === 0, "nom avec un lien refusé");
    ok("E-mail : demande non confirmée impossible à accepter (écran et base) ; confirmation par bouton, lien à usage unique ; doublon refusé ; nom contenant un lien refusé");
  }

  // ── C7. Justificatif : vérificateur seulement, consultation tracée ──
  const proofUrl = `${BASE}/api/justificatifs/${req.doc_id}`;
  const vp = await pageFor(V), np = await pageFor(N);
  expect((await (await pageFor(null)).request.get(proofUrl)).status() === 401, "anonyme : 401");
  expect((await np.request.get(proofUrl)).status() === 403, "admin non habilité : 403");
  const pr = await vp.request.get(proofUrl);
  expect(pr.status() === 200 && (await pr.body()).subarray(0, 5).toString() === "%PDF-", "vérificateur : fichier servi");
  const [view] = await sql`select count(*)::int as n from audit_log where action = 'justificatif.view' and actor_id = ${V.id} and target = ${req.doc_id}`;
  expect(view.n === 1, "consultation tracée");
  await np.goto(`${BASE}/admin/demandes/${req.id}`);
  expect((await text(np)).includes("Seul un vérificateur habilité") && (await np.locator("button:has-text('accepter')").count()) === 0, "admin non habilité : pas de bouton d'acceptation");
  ok("Justificatif : refusé sans connexion (401) et à un admin non habilité (403), servi au vérificateur, consultation tracée ; pas d'acceptation possible sans habilitation");

  // ── Acceptation par la vérificatrice : compte, qualification, commande MAD, référence ──
  await vp.goto(`${BASE}/admin/demandes/${req.id}`);
  await vp.click("button:has-text('Qualification vérifiée')");
  await vp.waitForSelector(".alert.ok");
  const [o1] = await sql`select o.id, o.status, o.currency, o.amount::text, o.payment_reference, u.status as ustatus, u.qualification_status, u.profession, u.id as uid
    from enrollment_requests r join orders o on o.id = r.order_id join users u on u.id = r.user_id where r.id = ${req.id}`;
  expect(o1.status === "pending" && o1.currency === "MAD" && o1.amount === "2400.00" && /^LIFT-\d{4}-\d{6}$/.test(o1.payment_reference), `commande ${JSON.stringify(o1)}`);
  expect(o1.ustatus === "invited" && o1.qualification_status === "verified" && o1.profession === "dermatologue", "compte invité, qualification vérifiée");
  expect((await vp.textContent(".alert.ok")).includes(o1.payment_reference), "référence affichée à l'admin");
  const [purge] = await sql`select purge_after > now() + interval '29 days' as ok from qualification_documents where id = ${req.doc_id}`;
  expect(purge.ok, "suppression du justificatif programmée à décision + 30 jours");
  ok(`Acceptation : compte invité, qualification vérifiée, commande ${o1.payment_reference} de 2 400 MAD (Maroc), suppression du justificatif programmée à +30 jours`);
  expect((await (await pageFor(null)).goto(`${BASE}/parcours/${slug}`)).url().includes("/connexion"), "pas d'accès sans compte actif");

  // ── C12. Paiement vérifié → accès ouvert (12 mois) → lien → mot de passe → formation ──
  await vp.goto(`${BASE}/admin/demandes/${req.id}`);
  expect((await text(vp)).includes("le paiement doit être validé par une autre personne") && (await vp.locator("button:has-text('Paiement vérifié')").count()) === 0, "séparation des tâches : pas de validation par la personne qui a accepté");
  let blocked4 = false;
  try { await as(V.id, (tx) => tx`update orders set status = 'paid', paid_checked_by = ${V.id}, paid_checked_at = now(), reference = ${'SEUL-' + run}, amount_received = amount where id = ${o1.id}`); } catch (e) { blocked4 = /Séparation des tâches/.test(e.message); }
  expect(blocked4, "séparation des tâches : refus de la base");
  ok("Séparation des tâches : la personne qui a accepté la demande ne valide pas le paiement (écran et base)");
  await np.goto(`${BASE}/admin/demandes/${req.id}`);
  await np.click("button:has-text('Paiement vérifié')"); // champ requis vide : le navigateur bloque
  expect((await sql`select status from orders where id = ${o1.id}`)[0].status === "pending", "référence bancaire obligatoire");
  await np.fill("#bank_reference", `VIR-BMCE-${run}`); await np.fill("#amount_received", "2000"); await np.click("button:has-text('Paiement vérifié')");
  await np.waitForSelector(".alert.err");
  expect((await np.textContent(".alert.err")).includes("différent du montant dû") && (await sql`select status from orders where id = ${o1.id}`)[0].status === "pending", "montant reçu différent : refus");
  await np.fill("#bank_reference", `VIR-BMCE-${run}`); await np.fill("#amount_received", "2 400"); await np.click("button:has-text('Paiement vérifié')");
  await np.waitForSelector(".copy input");
  expect(!np.url().includes("/invitation/") && !np.url().match(/[\w-]{40,}/), `aucun jeton dans l'adresse de la page (${np.url()})`);
  const link = (await np.inputValue(".copy input")).replace(/^https?:\/\/[^/]+/, BASE);
  const [g1] = await sql`select source, expires_at > now() + interval '11 months' as twelve from access_grants where order_id = ${o1.id} and revoked_at is null`;
  expect(g1?.source === "purchase" && g1.twelve, "accès acheté, 12 mois");
  const pro = await pageFor(null, { width: 390, height: 844 });
  await pro.goto(link);
  await pro.fill("#password", "Mot-de-passe-pro-e2e"); await pro.fill("#password2", "Mot-de-passe-pro-e2e"); await pro.check("input[name=cgu]");
  await pro.click("button[type=submit]"); await pro.waitForURL(/tableau-de-bord/);
  const dash = await text(pro);
  expect(dash.includes("Formations") && dash.includes(`Lasers et phototypes E2E ${run}`) && !dash.includes("Mes technologies") && !dash.includes("Aucune machine"), "tableau de bord : section Formations seulement");
  await pro.click("a.btn.solid"); await pro.waitForSelector("video");
  ok("Paiement vérifié (référence et montant reçu obligatoires, montant faux refusé ; lien hors de l'adresse de la page) : accès acheté de 12 mois, lien, mot de passe ; tableau de bord « Formations » seul (pas de bloc machines) ; leçon ouverte");
  await pro.goto(`${BASE}/mon-compte`);
  const acc = await text(pro);
  expect(acc.includes("Qualification : Vérifiée") && acc.includes(o1.payment_reference) && acc.includes("Payée"), "mon compte");
  ok("Mon compte : qualification vérifiée, commande payée avec sa référence");

  // ── C10 + C13. Hors Maroc → EUR ; remboursement intégral → accès révoqué ──
  const pf2 = await pageFor(null);
  const email2 = `marc-${run}@clinique.test`;
  await fill(pf2, { name: "Dr Marc Lefèvre", email: email2, country: "FR", profession: "medecin_esthetique" }); await pf2.waitForTimeout(3100); await pf2.click("button[type=submit]"); await pf2.waitForURL(/merci/);
  const [req2] = await sql`select id, marketing_consent_at from enrollment_requests where email = ${email2}`;
  expect(req2.marketing_consent_at === null, "case commerciale non cochée : aucun consentement");
  await confirmEmail(email2);
  await vp.goto(`${BASE}/admin/demandes/${req2.id}`); await vp.click("button:has-text('Qualification vérifiée')"); await vp.waitForSelector(".alert.ok");
  const [o2] = await sql`select o.id, o.currency, o.amount::text, o.payment_reference from enrollment_requests r join orders o on o.id = r.order_id where r.id = ${req2.id}`;
  expect(o2.currency === "EUR" && o2.amount === "220.00" && o2.payment_reference !== o1.payment_reference, "France : 220 EUR, référence unique");
  await np.goto(`${BASE}/admin/demandes/${req2.id}`); await np.fill("#bank_reference", `SEPA-FR-${run}`); await np.fill("#amount_received", "220"); await np.click("button:has-text('Paiement vérifié')"); await np.waitForSelector(".copy input");
  await vp.goto(`${BASE}/admin/demandes/${req2.id}`); await vp.click("summary:has-text('remboursement')");
  await vp.fill("form:has(input[name=confirm]) input[name=reason]", "Demande du client sous 14 jours"); await vp.check("input[name=confirm]"); await vp.click("button:has-text('Enregistrer le remboursement')"); await vp.waitForSelector(".alert.ok");
  const [g2] = await sql`select revoked_at is not null as revoked, revoke_reason from access_grants where order_id = ${o2.id}`;
  expect(g2.revoked && g2.revoke_reason.startsWith("Remboursement intégral"), "remboursement : accès révoqué");
  ok("Hors Maroc : 220 € (prix fixé, pas de conversion), référence unique ; remboursement intégral confirmé : accès révoqué");

  // ── Un même virement ne valide jamais deux commandes ──
  {
    const [o3] = await as(V.id, (tx) => tx`insert into orders (user_id, program_id, currency, amount, method, created_by) values (${o1.uid}, ${U.id}, 'MAD', 500, 'virement', ${V.id}) returning id`);
    await np.goto(`${BASE}/admin/medecins/${o1.uid}`);
    const f = np.locator(`form:has(input[name=order_id][value="${o3.id}"]):has(input[name=bank_reference])`);
    await f.locator("input[name=bank_reference]").fill(`vir bmce ${run}`); await f.locator("input[name=amount_received]").fill("500"); await f.locator("button").click();
    await np.waitForSelector(".alert.err");
    expect((await np.textContent(".alert.err")).includes("déjà servi") && (await sql`select status from orders where id = ${o3.id}`)[0].status === "pending", "référence de virement réutilisée : refus");
    ok("Paiement : une référence de virement déjà utilisée (même écrite autrement : casse, espaces) ne valide pas une seconde commande");

    // Revue indépendante : un admin ne peut pas cibler le compte d'un autre admin, ni ré-inviter un compte activé.
    await vp.goto(`${BASE}/admin/medecins/${o1.uid}`);
    await vp.evaluate((target) => { const f = [...document.querySelectorAll("form")].find((x) => x.querySelector("input[name=kind]")); f.querySelector("input[name=user_id]").value = target; f.querySelector("input[name=kind]").value = "reset"; f.requestSubmit(); }, N.id);
    await vp.waitForURL(/erreur=/);
    const [tk] = await sql`select count(*)::int as n from auth_tokens where user_id = ${N.id}`;
    expect(tk.n === 0, "aucun lien émis pour le compte d'un autre admin");
    await vp.goto(`${BASE}/admin/medecins/${o1.uid}`);
    await vp.evaluate((target) => { const f = [...document.querySelectorAll("form")].find((x) => x.querySelector("input[name=status]")); f.querySelector("input[name=user_id]").value = target; f.querySelector("input[name=status]").value = "disabled"; f.requestSubmit(); }, N.id);
    await vp.waitForURL(/erreur=/);
    expect((await sql`select status from users where id = ${N.id}`)[0].status === "active", "un admin ne désactive pas un autre admin par l'action des médecins");
    await vp.goto(`${BASE}/admin/medecins/${o1.uid}`);
    await vp.evaluate(() => { const f = [...document.querySelectorAll("form")].find((x) => x.querySelector("input[name=kind]")); f.querySelector("input[name=kind]").value = "invite"; f.requestSubmit(); });
    await vp.waitForURL(/erreur=/);
    expect((new URL(vp.url()).searchParams.get("erreur") ?? "").includes("déjà activé"), "pas de nouvelle invitation sur un compte activé");
    ok("Comptes : impossible de générer un lien ou de désactiver le compte d'un autre admin ; un compte activé ne reçoit pas de nouvelle invitation");
  }

  // Revue indépendante : refus « en retard » (écran ouvert avant l'acceptation) sans effet ni e-mail.
  {
    const pfr = await pageFor(null);
    const er = `tardif-${run}@x.test`;
    await fill(pfr, { name: "Dr Tardif", email: er, file: proof }); await pfr.waitForTimeout(3100); await pfr.click("button[type=submit]"); await pfr.waitForURL(/merci/);
    await confirmEmail(er);
    const [rq] = await sql`select r.id, d.id as doc from enrollment_requests r join qualification_documents d on d.request_id = r.id where r.email = ${er}`;
    const tabB = await pageFor(V); await tabB.goto(`${BASE}/admin/demandes/${rq.id}`);
    const tabA = await pageFor(V); await tabA.goto(`${BASE}/admin/demandes/${rq.id}`); await tabA.click("button:has-text('Qualification vérifiée')"); await tabA.waitForSelector(".alert.ok");
    const [p1] = await sql`select purge_after from qualification_documents where id = ${rq.doc}`;
    await tabB.fill("#reason", "Refus tardif"); await tabB.click("button:has-text('Refuser')"); await tabB.waitForSelector(".alert.err");
    const [after] = await sql`select r.status, d.purge_after from enrollment_requests r join qualification_documents d on d.request_id = r.id where r.id = ${rq.id}`;
    expect((await tabB.textContent(".alert.err")).includes("déjà été traitée") && after.status === "approved" && +after.purge_after === +p1.purge_after, "refus tardif sans effet");
    ok("Refus après acceptation (deux écrans) : refusé, statut et échéance du justificatif inchangés, aucun e-mail de refus");
  }

  // ── Identité d'un compte existant jamais écrasée par une demande ──
  {
    const slug2 = `formation-com2-${run}`;
    await as(V.id, (tx) => tx`insert into programs (slug, title, kind, eligible_professions, published, listed, price_mad, price_eur) values (${slug2}, ${`Deuxième formation E2E ${run}`}, 'training', '{dermatologue,medecin_esthetique}', true, true, 900, 90)`);
    const pi = await pageFor(null);
    await pi.goto(`${BASE}/formations/${slug2}/inscription`);
    await pi.fill("#full_name", "Dr Usurpateur"); await pi.fill("#email", email); await pi.selectOption("#profession", "medecin_esthetique"); await pi.fill("#professional_id", "AUTRE-999"); await pi.check("input[name=consent]");
    await pi.waitForTimeout(3100); await pi.click("button[type=submit]"); await pi.waitForURL(/merci/);
    await confirmEmail(email);
    const [ri] = await sql`select r.id from enrollment_requests r join programs p on p.id = r.program_id where r.email = ${email} and p.slug = ${slug2}`;
    await vp.goto(`${BASE}/admin/demandes/${ri.id}`);
    expect((await text(vp)).includes("qualification vérifiée différente"), "avertissement à l'écran");
    await vp.click("button:has-text('Qualification vérifiée')"); await vp.waitForSelector(".alert.err");
    const [still] = await sql`select profession, professional_id from users where id = ${o1.uid}`;
    expect(still.profession === "dermatologue" && still.professional_id === "ORDRE-12345", "identité inchangée");
    ok("Compte existant : une demande avec une autre identité professionnelle est signalée et ne peut pas être acceptée ; le compte reste intact");
  }

  // ── Refus motivé ──
  const pf3 = await pageFor(null);
  const email3 = `refus-${run}@x.test`;
  await fill(pf3, { name: "Dr Refus Test", email: email3 }); await pf3.waitForTimeout(3100); await pf3.click("button[type=submit]"); await pf3.waitForURL(/merci/);
  const [req3] = await sql`select id from enrollment_requests where email = ${email3}`;
  await confirmEmail(email3);
  await vp.goto(`${BASE}/admin/demandes/${req3.id}`); await vp.fill("#reason", "Numéro d'Ordre introuvable"); await vp.click("button:has-text('Refuser')"); await vp.waitForSelector(".alert.ok");
  const [r3] = await sql`select status, reject_reason, user_id from enrollment_requests where id = ${req3.id}`;
  expect(r3.status === "rejected" && r3.reject_reason === "Numéro d'Ordre introuvable" && r3.user_id === null, "refus");
  ok("Refus motivé : demande refusée, aucun compte créé");
  const [leak] = await sql`select count(*)::int as n from audit_log where action like 'enrollment_requests.%' and (details::text ilike ${'%' + email + '%'} or details::text ilike ${'%' + email2 + '%'} or details::text like '%ORDRE-12345%')`;
  expect(leak.n === 0, `journal sans e-mail ni n° d'Ordre (${leak.n})`);
  ok("Journal : les demandes sont tracées sans e-mail, téléphone ni n° d'Ordre (minimisation)");

  // ── Limite de fréquence (5 demandes par heure et par connexion) ──
  if (!process.env.SESSION_SECRET) {
    const flood = `10.250.${Math.floor(Math.random() * 250)}.1`;
    const ipHash = createHash("sha256").update(`lift:${flood}`).digest("hex");
    for (let i = 0; i < 5; i++) await sql`insert into enrollment_requests (program_id, full_name, email, country, profession, professional_id, terms_version, ip_hash) values (${T.id}, 'Flood', ${`flood${i}-${run}@x.test`}, 'MA', 'dermatologue', 'X123', 'test', ${ipHash})`;
    const fp = await (await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": flood } })).newPage();
    await fill(fp, { email: `flood-${run}@x.test` }); await fp.waitForTimeout(3100); await fp.click("button[type=submit]"); await fp.waitForSelector(".alert.err");
    expect((await fp.textContent(".alert.err")).includes("Trop de demandes"), "limite de fréquence");
    ok("Limite de fréquence : la 6e demande de l'heure depuis la même connexion est refusée");
  }

  // ── C9. Suppression du justificatif au terme de la conservation ──
  await sql`update qualification_documents set purge_after = now() - interval '1 minute' where id = ${req.doc_id}`;
  const out = execFileSync("node", ["scripts/purge-justificatifs.mjs"], { env: process.env }).toString();
  const [pd] = await sql`select purged_at, sha256 from qualification_documents where id = ${req.doc_id}`;
  expect(out.includes("supprimés") && pd.purged_at && pd.sha256 === req.sha256 && !existsSync(path.join(process.cwd(), "private-media", "justificatifs", req.storage_key)), "purge");
  expect((await vp.request.get(proofUrl)).status() === 410, "justificatif supprimé : 410");
  const [plog] = await sql`select count(*)::int as n from audit_log where action = 'qualification_documents.update' and target = ${req.doc_id} and details->'after'->>'purged_at' is not null`;
  expect(plog.n === 1, "suppression tracée");
  ok("Conservation : fichier supprimé après décision + 30 jours, métadonnées gardées, suppression tracée ; consultation → 410");

  // ── C14 + C15. Client existant inchangé ; accès expiré ──
  const client = await account("Dr Client Machine Com");
  const [han] = await sql`select device_model_id from programs where slug = 'hanover-5g'`;
  await sql`insert into device_ownerships (user_id, device_model_id, serial_number) values (${client.id}, ${han.device_model_id}, ${`HN-C-${run}`})`;
  const cp = await pageFor(client);
  await cp.goto(`${BASE}/tableau-de-bord`);
  const cd = await text(cp);
  expect(cd.includes("Mes technologies") && cd.includes("HANOVER 5G — Programme opérateur") && cd.includes("Votre HANOVER 5G") && !cd.includes("Inclus avec"), "client : Mes technologies");
  await as(V.id, (tx) => tx`update users set profession = 'dermatologue', qualification_status = 'verified', qualification_checked_by = ${V.id}, qualification_checked_at = now() where id = ${client.id}`);
  await as(N.id, (tx) => tx`insert into access_grants (user_id, program_id, source, reason, granted_by, granted_at, expires_at) values (${client.id}, ${T.id}, 'offered', 'Essai expiré (test)', ${N.id}, now() - interval '2 days', now() - interval '1 day')`);
  await cp.goto(`${BASE}/tableau-de-bord`);
  const ce = await text(cp);
  expect(ce.includes("Accès terminé") && ce.includes(`Lasers et phototypes E2E ${run}`) && ce.includes("Mes technologies"), "accès expiré affiché");
  expect((await cp.goto(`${BASE}/parcours/${slug}`)).status() === 404, "accès expiré : formation fermée");
  ok("Client existant : « Mes technologies » intact (« Votre HANOVER 5G ») ; formation expirée : « Accès terminé », contenu fermé");
  // Renouvellement après expiration : nouvelle commande payée → ancien accès clos (tracé), nouvel accès ouvert.
  {
    const [o5] = await as(V.id, (tx) => tx`insert into orders (user_id, program_id, currency, amount, method, created_by) values (${client.id}, ${T.id}, 'MAD', 2600, 'virement', ${V.id}) returning id`);
    await np.goto(`${BASE}/admin/medecins/${client.id}`);
    const f = np.locator(`form:has(input[name=order_id][value="${o5.id}"]):has(input[name=bank_reference])`);
    await f.locator("input[name=bank_reference]").fill(`RENOUV-${run}`); await f.locator("input[name=amount_received]").fill("2600"); await f.locator("button").click();
    await np.waitForSelector(".alert.ok");
    const gs = await sql`select revoked_at is not null as revoked, revoke_reason, source from access_grants where user_id = ${client.id} and program_id = ${T.id} order by granted_at`;
    expect(gs.length === 2 && gs[0].revoked && gs[0].revoke_reason.includes("renouvellement") && !gs[1].revoked && gs[1].source === "purchase", "renouvellement");
    expect((await cp.goto(`${BASE}/parcours/${slug}`)).status() === 200, "accès renouvelé ouvert");
    ok("Renouvellement après expiration : l'ancien accès est clos (tracé), le nouvel accès acheté s'ouvre");
  }

  // ── Fiche commerciale et vérificateurs (écrans admin) ──
  await vp.goto(`${BASE}/admin/parcours/${T.id}`);
  await vp.fill("#pm", "2600"); await vp.click("button:has-text('Enregistrer la fiche')"); await vp.waitForSelector(".alert.ok");
  await anon.goto(`${BASE}/formations/${slug}`);
  expect((await text(anon)).includes("2 600 MAD"), "nouveau prix publié");
  await vp.goto(`${BASE}/admin/verificateurs`);
  expect((await vp.textContent("main")).includes("Votre compte"), "pas de bouton sur son propre compte");
  ok("Admin : prix modifié dans la fiche commerciale et publié ; un admin ne peut pas modifier son propre droit de vérification");
  const dpage = await (await pageFor(client)).goto(`${BASE}/admin/demandes`);
  expect(!dpage.url().includes("/admin"), "un professionnel n'atteint pas les demandes");
  ok("Un professionnel n'atteint pas l'administration des demandes");

  console.log(`\nParcours commercial validé : ${step} étapes réussies.`);
} catch (e) {
  console.error(`\n✗ Échec après ${step} étapes : ${e.message}`);
  process.exitCode = 1;
} finally {
  await browser.close();
  await sql.end();
}
