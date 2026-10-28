// Test de bout en bout du MVP (voir README). Nécessite l'application démarrée (BASE_URL) et DATABASE_URL.
// Chaque étape correspond à un critère du MVP ; le script s'arrête à la première erreur.
import { chromium } from "playwright";
import postgres from "postgres";
import { execFileSync } from "node:child_process";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });
const run = Date.now().toString(36);
const ADMIN = { email: `admin-${run}@cellulift.test`, password: "Admin-e2e-mot-de-passe" };
const DOC = { name: "Dr Test Benali", email: `medecin-${run}@clinique.test`, password: "Medecin-e2e-mot-de-passe" };
let step = 0;
const ok = (msg) => console.log(`✓ ${String(++step).padStart(2, "0")} ${msg}`);
const fail = (msg) => { throw new Error(msg); };
const expect = (cond, msg) => { if (!cond) fail(msg); };

const browser = await chromium.launch();
try {
  // ── Cellulift : premier administrateur ──
  const out = execFileSync("node", ["scripts/create-admin.mjs", ADMIN.email, "Admin E2E"], { env: process.env }).toString();
  const adminLink = out.match(/https?:\/\/\S+/)[0].replace(/^https?:\/\/[^/]+/, BASE);
  const admin = await browser.newPage();
  await admin.goto(adminLink);
  await admin.fill("#password", ADMIN.password); await admin.fill("#password2", ADMIN.password); await admin.check("input[name=cgu]");
  await admin.click("button[type=submit]");
  await admin.waitForURL(/\/(admin|tableau-de-bord)/);
  await admin.goto(`${BASE}/admin`);
  expect(await admin.locator("h1").textContent() === "Médecins", "page admin");
  ok("Administrateur Cellulift créé et connecté");

  // ── Invitation ──
  await admin.goto(`${BASE}/admin/medecins/nouveau`);
  await admin.fill("#full_name", DOC.name); await admin.fill("#email", DOC.email); await admin.fill("#clinic", "Clinique E2E");
  await admin.selectOption("#device_model_id", { label: "HANOVER 5G" }); await admin.fill("#serial_number", "HN5G-E2E-001");
  await admin.click("button:has-text('Créer et inviter')");
  await admin.waitForURL(/\/admin\/medecins\/[0-9a-f-]{36}/);
  const invite = (await admin.inputValue(".copy input")).replace(/^https?:\/\/[^/]+/, BASE);
  expect(invite.includes("/invitation/"), "lien d'invitation affiché");
  ok("Invitation : médecin créé avec HANOVER 5G, lien d'invitation généré");

  // ── Médecin : création du compte ──
  const ctx = await browser.newContext();
  const doc = await ctx.newPage();
  await doc.goto(invite);
  expect((await doc.textContent("h2")).includes(DOC.name), "invitation nominative");
  await doc.fill("#password", "court"); await doc.fill("#password2", "court"); await doc.check("input[name=cgu]");
  await doc.evaluate(() => document.querySelectorAll("input[minlength]").forEach((i) => i.removeAttribute("minlength")));
  await doc.click("button[type=submit]");
  expect(await doc.waitForSelector(".alert.err", { timeout: 8000 }).then(() => true, () => false), "mot de passe trop court refusé");
  await doc.fill("#password", DOC.password); await doc.fill("#password2", DOC.password); await doc.check("input[name=cgu]");
  await doc.click("button[type=submit]");
  await doc.waitForURL(/tableau-de-bord/);
  ok("Création du compte (mot de passe trop court refusé, puis accepté)");
  const reused = await (await browser.newContext()).newPage();
  await reused.goto(invite);
  expect((await reused.textContent("h2")).includes("expiré"), "lien d'invitation à usage unique");
  ok("Le lien d'invitation ne sert qu'une fois");

  // ── Connexion ──
  await doc.click("button:has-text('Se déconnecter')");
  await doc.waitForURL(/connexion/);
  await doc.fill("#email", DOC.email); await doc.fill("#password", "mauvais-mot-de-passe"); await doc.click("button[type=submit]");
  expect(await doc.waitForSelector(".alert.err", { timeout: 8000 }).then(() => true, () => false), "mauvais mot de passe refusé");
  await doc.fill("#email", DOC.email); await doc.fill("#password", DOC.password); await doc.click("button[type=submit]");
  await doc.waitForURL(/tableau-de-bord/);
  ok("Connexion (mauvais mot de passe refusé, bon accepté)");

  // ── Ses machines + parcours ──
  const dash = await doc.textContent("main");
  expect(dash.includes("HANOVER 5G") && dash.includes("HN5G-E2E-001"), "machine visible");
  expect(dash.includes("HANOVER 5G — Programme opérateur") && dash.includes("À commencer"), "parcours visible");
  ok("Tableau de bord : sa machine (n° de série) et le parcours correspondant");
  expect(dash.includes("Avec Dr Mohamed Dadoun"), "présentateur sur la carte du parcours");
  ok("Tableau de bord : le parcours indique son présentateur (Dr Mohamed Dadoun)");
  await doc.click("a:has-text('Programme et documents')");
  await doc.waitForURL(/\/parcours\/hanover-5g$/);
  const links = await doc.locator("a.lesson").count();
  const locked = await doc.locator(".lesson.locked").count();
  expect(links === 1 && locked === 2, `seule la leçon 1 ouverte (ouvertes ${links}, verrouillées ${locked})`);
  ok("Parcours : leçon 1 ouverte, leçons 2 et 3 verrouillées");
  expect((await doc.textContent("#h-pres")) === "Intervenant" && (await doc.textContent("main")).includes("Médecin esthétique & lasériste"), "bloc intervenant du parcours");
  ok("Parcours : bloc « Intervenant » avec le titre du Dr Dadoun");
  const [l1, l2, l3] = (await sql`select lesson_id from program_lessons pl join programs p on p.id = pl.program_id where p.slug = 'hanover-5g' order by seq`).map((r) => r.lesson_id);
  await doc.goto(`${BASE}/parcours/hanover-5g/${l3}`);
  expect(doc.url().endsWith(l1), "accès direct à la leçon 3 renvoyé vers la leçon 1");
  const vid = await doc.request.get(`${BASE}/api/video/${l2}`);
  expect(vid.status() === 403, `vidéo 2 refusée avant la leçon 1 (${vid.status()})`);
  ok("Ordre imposé : URL directe et vidéo d'une leçon verrouillée refusées");

  // ── Regarder dans l'ordre ──
  const cheat = await doc.evaluate(async (id) => (await (await fetch(`/api/progress/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ position: 12 }) })).json()), l1);
  expect(cheat.completed === false, "envoyer « position = fin » ne valide pas la leçon");
  ok("Anti-saut : déclarer la fin de la vidéo ne valide pas la leçon");
  async function watch(lessonId) {
    await doc.goto(`${BASE}/parcours/hanover-5g/${lessonId}`);
    await doc.waitForSelector("video");
    await doc.evaluate(() => { const v = document.querySelector("video"); v.muted = true; return v.play(); });
    await doc.waitForTimeout(1500);
    await doc.evaluate(() => { const v = document.querySelector("video"); v.currentTime = v.duration - 0.5; });
    await doc.waitForTimeout(400);
    const t = await doc.evaluate(() => document.querySelector("video").currentTime);
    expect(t < 6, `avance rapide bloquée (position ${t.toFixed(1)} s)`);
    await doc.waitForSelector(".badge.ok:has-text('Leçon terminée')", { timeout: 30000 });
  }
  await watch(l1);
  ok("Leçon 1 regardée jusqu'au bout (avance rapide bloquée), validée à 90 %");
  expect((await doc.textContent("main")).includes("Présenté parDr Mohamed Dadoun"), "présentateur sous la leçon");
  ok("Leçon : « Présenté par Dr Mohamed Dadoun »");
  await doc.click("a:has-text('Leçon suivante')");
  await doc.waitForURL(new RegExp(l2));
  ok("Leçon 2 débloquée après la leçon 1");

  // ── Documents ──
  const href = await doc.locator("a.doc").first().getAttribute("href");
  const pdf = await doc.request.get(`${BASE}${href}`);
  expect(pdf.status() === 200 && pdf.headers()["content-type"] === "application/pdf" && (await pdf.body()).subarray(0, 4).toString() === "%PDF", "document PDF servi");
  const anon = await (await browser.newContext()).request.get(`${BASE}${href}`);
  expect(anon.status() === 401, `document refusé sans connexion (${anon.status()})`);
  ok("Documents : PDF ouvert par le médecin, refusé sans connexion");

  // ── Progression ──
  await doc.goto(`${BASE}/tableau-de-bord`);
  expect((await doc.textContent("main")).includes("33 %"), "progression 1/3");
  ok("Progression affichée : 1 leçon sur 3 (33 %)");

  // ── Terminer ──
  await watch(l2); await watch(l3);
  await doc.goto(`${BASE}/tableau-de-bord`);
  const end = await doc.textContent("main");
  expect(end.includes("Formation terminée") && end.includes("100 %"), "formation terminée");
  ok("Formation terminée : 3/3 leçons, 100 %");

  // ── Cloisonnement ──
  const other = await (await browser.newContext()).newPage();
  const vidAnon = await other.request.get(`${BASE}/api/video/${l1}`);
  expect(vidAnon.status() === 401, "vidéo refusée sans connexion");
  const [{ id: otherId }] = await sql`insert into users (email, full_name, status) values (${"autre-" + run + "@clinique.test"}, 'Dr Sans Machine', 'invited') returning id`;
  ok("Vidéo refusée sans connexion");

  // ── Côté Cellulift ──
  await admin.goto(`${BASE}/admin?q=${encodeURIComponent(DOC.email)}`);
  const row = await admin.textContent("tbody");
  expect(row.includes(DOC.name) && row.includes("HANOVER 5G · HN5G-E2E-001") && row.includes("HANOVER 5G — Programme opérateur") && row.includes("100 %") && row.includes("Terminée"), "ligne admin complète");
  ok("Admin : médecin → machine → parcours assigné → 100 % → Terminée");
  await admin.goto(`${BASE}/admin?filtre=non_terminee&q=${encodeURIComponent(DOC.email)}`);
  expect((await admin.textContent("tbody")).includes("Aucun médecin"), "absent du filtre non terminée");
  await admin.goto(`${BASE}/admin?q=autre-${run}`);
  expect((await admin.textContent("tbody")).includes("Invitation en attente"), "invitation en attente visible");
  ok("Admin : filtres terminé / non terminé, invitation en attente visible");
  await admin.click(`a:has-text('${DOC.name}')`).catch(() => {});
  await admin.goto(`${BASE}/admin/medecins/${(await sql`select id from users where email = ${DOC.email}`)[0].id}`);
  expect((await admin.locator(".item:has-text('vue le')").count()) === 3, "détail par leçon");
  ok("Admin : détail du médecin, date de visionnage de chaque leçon");
  const forbidden = await doc.request.get(`${BASE}/admin`, { maxRedirects: 0 });
  expect([302, 303, 307].includes(forbidden.status()), `un médecin n'accède pas à l'admin (${forbidden.status()})`);
  ok("Un médecin ne peut pas ouvrir l'administration");
  // ── Contenus : Cellulift crée une machine, un parcours, une leçon, un document ──
  const machine = `TEST ${run.toUpperCase()}`;
  await admin.goto(`${BASE}/admin/machines`);
  await admin.fill("#n", machine); await admin.fill("#f", "Test"); await admin.click("button:has-text('Ajouter')");
  await admin.waitForSelector(`td:has-text('${machine}')`);
  await admin.goto(`${BASE}/admin/parcours`);
  await admin.fill("#title", `Parcours ${machine}`); await admin.fill("#slug", `test-${run}`); await admin.selectOption("#dm", { label: machine });
  await admin.click("button:has-text('Créer')");
  await admin.waitForURL(/\/admin\/parcours\/[0-9a-f-]{36}/);
  await admin.fill("#mt", "Module test"); await admin.click("button:has-text('Ajouter un module')");
  await admin.waitForSelector("text=Module ajouté");
  await admin.click("summary:has-text('Ajouter une leçon')");
  const lf = admin.locator("form:has(input[name=module_id])");
  await lf.locator("input[name=title]").fill("Leçon test"); await lf.locator("input[name=video_ref]").fill("lecon-1.webm"); await lf.locator("input[name=duration]").fill("0:12");
  await lf.locator("button:has-text('Ajouter')").click();
  await admin.waitForSelector("text=Leçon enregistrée");
  await admin.fill("input[name=title][aria-label='Titre du document']", "Protocole test");
  await admin.setInputFiles("input[type=file]", "private-media/docs/exemple/fiche-protocole.pdf");
  await admin.click("button:has-text('Ajouter le document')");
  await admin.waitForSelector("text=Document ajouté");
  await admin.check("input[name=published]"); await admin.click("form:has(input[name=published]) button:has-text('Enregistrer')");
  await admin.waitForSelector("text=Parcours enregistré");
  ok("Contenus : machine, parcours, module, leçon, document (envoi de fichier) et publication");
  // ── Accès limité aux machines achetées ──
  const [{ lesson_id: tl }] = await sql`select pl.lesson_id from program_lessons pl join programs p on p.id = pl.program_id where p.slug = ${"test-" + run}`;
  const [{ id: tdoc }] = await sql`select d.id from documents d join programs p on p.id = d.program_id where p.slug = ${"test-" + run}`;
  const noMachine = async (label) => {
    await doc.goto(`${BASE}/tableau-de-bord`);
    expect(!(await doc.textContent("main")).includes(`Parcours ${machine}`), `${label} : parcours absent du tableau de bord`);
    expect((await doc.goto(`${BASE}/parcours/test-${run}`)).status() === 404, `${label} : page du parcours refusée`);
    expect((await doc.goto(`${BASE}/parcours/test-${run}/${tl}`)).status() === 404, `${label} : leçon refusée`);
    expect((await doc.request.get(`${BASE}/api/video/${tl}`)).status() === 403, `${label} : vidéo refusée`);
    expect((await doc.request.get(`${BASE}/api/documents/${tdoc}`)).status() === 403, `${label} : document refusé`);
    const beat = await doc.request.post(`${BASE}/api/progress/${tl}`, { data: { position: 3 }, headers: { origin: BASE } });
    expect(beat.status() === 403, `${label} : progression refusée (${beat.status()})`);
  };
  await noMachine("Sans la machine");
  ok("Machine non achetée : parcours, leçon, vidéo, document et progression refusés (parcours pourtant publié)");
  // Le médecin reçoit cette nouvelle machine : le nouveau parcours apparaît chez lui.
  const docId = (await sql`select id from users where email = ${DOC.email}`)[0].id;
  await admin.goto(`${BASE}/admin/medecins/${docId}`);
  await admin.click("summary:has-text('Ajouter une machine')");
  await admin.selectOption("#dm", { label: machine }); await admin.fill("input[name=serial_number]", "TST-1");
  await admin.click("button:has-text('Ajouter et ouvrir le parcours')");
  await admin.waitForSelector("text=Machine ajoutée");
  await doc.goto(`${BASE}/tableau-de-bord`);
  const both = await doc.textContent("main");
  expect(both.includes(`Parcours ${machine}`) && both.includes("Formation terminée") && both.includes("À commencer"), "deuxième machine → deuxième parcours, le premier reste terminé");
  ok("Nouvelle machine ajoutée : son parcours s'ajoute, l'historique du premier est conservé");
  // Retirer la machine coupe l'accès immédiatement ; la rajouter le rouvre.
  const own = await sql`select o.id from device_ownerships o join device_models dm on dm.id = o.device_model_id where o.user_id = ${docId} and dm.name = ${machine} and o.revoked_at is null`;
  await admin.goto(`${BASE}/admin/medecins/${docId}`);
  await admin.locator(`form:has(input[name=ownership_id][value="${own[0].id}"]) button`).click();
  await admin.waitForSelector("text=Machine retirée");
  await noMachine("Machine retirée");
  ok("Machine retirée par l'admin : tout l'accès au parcours est coupé immédiatement");
  // Parcours rattaché à une autre machine : les anciens propriétaires perdent l'accès, la progression reste.
  const hanover = (await sql`select id, device_model_id from programs where slug = 'hanover-5g'`)[0];
  await sql`update programs set device_model_id = (select id from device_models where name = 'LA QUEEN') where id = ${hanover.id}`;
  expect((await doc.goto(`${BASE}/parcours/hanover-5g`)).status() === 404, "parcours rattaché à une autre machine : accès coupé");
  await sql`update programs set device_model_id = ${hanover.device_model_id} where id = ${hanover.id}`;
  await doc.goto(`${BASE}/tableau-de-bord`);
  expect((await doc.textContent("main")).includes("Formation terminée"), "accès rétabli avec la progression conservée");
  ok("Parcours rattaché à une autre machine : accès coupé ; remis sur la bonne machine : accès et progression rétablis");
  // La rajouter rouvre l'accès.
  await admin.goto(`${BASE}/admin/medecins/${docId}`);
  await admin.click("summary:has-text('Ajouter une machine')");
  await admin.selectOption("#dm", { label: machine }); await admin.click("button:has-text('Ajouter et ouvrir le parcours')");
  await admin.waitForSelector("text=Machine ajoutée");
  expect((await doc.goto(`${BASE}/parcours/test-${run}`)).status() === 200, "machine rajoutée : accès rouvert");
  ok("Machine rajoutée : accès rouvert");

  // ── Présentateurs ──
  const [{ lesson_id: testLesson }] = await sql`select pl.lesson_id from program_lessons pl join programs p on p.id = pl.program_id where p.slug = ${"test-" + run}`;
  await doc.goto(`${BASE}/parcours/test-${run}/${testLesson}`);
  expect(!(await doc.textContent("main")).includes("Présenté par") && (await doc.locator("#h-pres").count()) === 0, "pas de présentateur affiché quand la leçon n'en a pas");
  ok("Présentateurs : une leçon sans présentateur n'affiche rien (état vide)");
  await admin.goto(`${BASE}/admin/presentateurs`);
  const plist = await admin.textContent("main");
  expect(["Dr Mohamed Dadoun", "Meryem Belkhalfi", "Imane Souali"].every((n) => plist.includes(n)), "les trois présentateurs réels sont listés");
  const pname = `Présentateur ${run}`;
  await admin.fill("#pn", pname); await admin.fill("#pt", "Titre de test"); await admin.click("form:has(#pn) button[type=submit]");
  await admin.waitForSelector(`text=${pname} ajouté(e).`);
  await admin.fill("#pn", pname); await admin.click("form:has(#pn) button[type=submit]");
  await admin.waitForSelector(".alert.err:has-text('existe déjà')");
  ok("Présentateurs : liste des 3 présentateurs, ajout, doublon refusé avec un message");
  const progId = (await sql`select id from programs where slug = ${"test-" + run}`)[0].id;
  await admin.goto(`${BASE}/admin/parcours/${progId}`);
  await admin.click("summary:has-text('Leçon test')");
  const ef = admin.locator(`form:has(select[name=presenter_id]):has(input[name=lesson_id][value="${testLesson}"])`);
  await ef.locator("select[name=presenter_id]").selectOption({ label: pname });
  await ef.locator("button[type=submit]").click();
  await admin.waitForSelector("text=Leçon enregistrée");
  await doc.goto(`${BASE}/parcours/test-${run}/${testLesson}`);
  const lt = await doc.textContent("main");
  expect(lt.includes(`Présenté par${pname}`) && lt.includes("Titre de test"), "présentateur affecté visible par le médecin");
  ok("Présentateurs : affecté à une leçon par l'admin, visible par le médecin avec son titre");
  const pf = await doc.request.get(`${BASE}/admin/presentateurs`, { maxRedirects: 0 });
  expect([302, 303, 307].includes(pf.status()), `page présentateurs interdite au médecin (${pf.status()})`);
  ok("Présentateurs : page d'administration interdite au médecin");
  await sql`update lessons set presenter_id = null where id = ${testLesson}`;
  await sql`delete from presenters where name = ${pname}`;
  await sql`delete from users where id = ${otherId}`;
  console.log(`\nMVP validé : ${step} étapes réussies.`);
} catch (e) {
  console.error(`✗ Échec après ${step} étape(s) : ${e.message}`);
  process.exitCode = 1;
} finally {
  await browser.close();
  await sql.end();
}
