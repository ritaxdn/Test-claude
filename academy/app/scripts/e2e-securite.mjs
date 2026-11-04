// Tests de sécurité : accès croisés entre utilisateurs, sessions expirées / falsifiées / comptes
// désactivés, accès directs aux ressources, durée des jetons Mux.
// Nécessite l'application démarrée (BASE_URL), migrations 002 + 003, DATABASE_URL = compte academy_app.
// Optionnel : MUX_BASE_URL = une 2e instance lancée avec VIDEO_PROVIDER=mux et une clé de test.
import { createHash, randomBytes, randomUUID } from "node:crypto";
import postgres from "postgres";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });
const run = Date.now().toString(36);
let step = 0;
const ok = (msg) => console.log(`✓ S${String(++step).padStart(2, "0")} ${msg}`);
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
const as = (actorId, fn) => sql.begin(async (tx) => { await tx`select set_config('app.actor_id', ${actorId}, true)`; return fn(tx); });

async function account(full_name, role = "doctor", sessionExpires = "1 day") {
  const [u] = await sql`insert into users (email, full_name, role, status, password_hash, activated_at)
    values (${`sec-${role}-${randomBytes(4).toString("hex")}-${run}@lift.test`}, ${full_name}, ${role}, 'active', 'scrypt$x', now()) returning id`;
  const token = randomBytes(32).toString("base64url");
  await sql`insert into sessions (token_hash, user_id, expires_at) values (${createHash("sha256").update(token).digest("hex")}, ${u.id}, now() + ${sessionExpires}::interval)`;
  return { id: u.id, cookie: `academy_session=${token}` };
}
const req = (who, path, init = {}) => fetch(`${BASE}${path}`, { ...init, redirect: "manual", headers: { ...(init.headers ?? {}), ...(who ? { cookie: who.cookie } : {}) } });
const beat = (who, lessonId, base = BASE) => fetch(`${base}/api/progress/${lessonId}`, { method: "POST", redirect: "manual", headers: { ...(who ? { cookie: who.cookie } : {}), "Content-Type": "application/json" }, body: JSON.stringify({ position: 3 }) });
async function statuses(who, r) {
  const [page, lesson, video, doc, prog] = await Promise.all([
    req(who, `/parcours/${r.slug}`), req(who, `/parcours/${r.slug}/${r.l1}`), req(who, `/api/video/${r.l1}`), req(who, `/api/documents/${r.doc}`), beat(who, r.l1),
  ]);
  return { page: page.status, pageTo: page.headers.get("location") ?? "", lesson: lesson.status, video: video.status, doc: doc.status, prog: prog.status };
}
/** Sans session valide : pages → connexion, API → 401. */
const anonymous = (s) => s.page === 307 && s.pageTo.includes("/connexion") && s.lesson === 307 && s.video === 401 && s.doc === 401 && s.prog === 401;
const forbidden = (s) => s.page === 404 && s.lesson === 404 && s.video === 403 && s.doc === 403 && s.prog === 403;

try {
  // ── Préparation : 2 admins (dont un vérificateur), une formation, un parcours technologie ──
  const admin = await account("Admin Sécu", "admin");
  const admin2 = await account("Admin Sécu 2", "admin");
  await as(admin2.id, (tx) => tx`update users set can_verify_qualifications = true where id = ${admin.id}`);
  const slug = `formation-secu-${run}`;
  const [t] = await sql`insert into programs (slug, title, kind, eligible_professions, published) values (${slug}, 'Formation sécurité E2E', 'training', '{medecin_esthetique}', true) returning id`;
  const [m] = await sql`insert into modules (program_id, position, title) values (${t.id}, 1, 'M1') returning id`;
  const [l1] = await sql`insert into lessons (module_id, position, title, video_ref, duration_sec) values (${m.id}, 1, 'L1', 'lecon-1.webm', 12) returning id`;
  const [l2] = await sql`insert into lessons (module_id, position, title, video_ref, duration_sec) values (${m.id}, 2, 'L2', 'lecon-2.webm', 12) returning id`;
  const [d] = await sql`insert into documents (program_id, title, storage_key) values (${t.id}, 'Doc sécu', 'exemple/fiche-protocole.pdf') returning id`;
  const R = { slug, l1: l1.id, l2: l2.id, doc: d.id };
  const [hanover] = await sql`select p.id, p.device_model_id from programs p where slug = 'hanover-5g'`;
  const [hl1] = await sql`select lesson_id from program_lessons where program_id = ${hanover.id} order by seq limit 1`;
  const [hdoc] = await sql`select id from documents where program_id = ${hanover.id} limit 1`;

  // A : acheteur vérifié de la formation. B : même profession, vérifié, SANS accès. C : client HANOVER.
  const verify = (id, prof = "medecin_esthetique") => as(admin.id, (tx) => tx`update users set profession = ${prof}, qualification_status = 'verified', qualification_checked_by = ${admin.id}, qualification_checked_at = now() where id = ${id}`);
  const A = await account("Dr A (acheteur)"); await verify(A.id);
  const B = await account("Dr B (sans accès)"); await verify(B.id);
  const C = await account("Dr C (client HANOVER)");
  await as(admin.id, (tx) => tx`insert into device_ownerships (user_id, device_model_id, serial_number) values (${C.id}, ${hanover.device_model_id}, ${`HN-S-${run}`})`);
  const [o] = await as(admin.id, (tx) => tx`insert into orders (user_id, program_id, currency, amount, method, created_by) values (${A.id}, ${t.id}, 'MAD', 1000, 'virement', ${admin.id}) returning id`);
  await as(admin.id, (tx) => tx`update orders set status = 'paid', paid_checked_by = ${admin.id}, paid_checked_at = now(), reference = 'VIR-SECU-1' where id = ${o.id}`);
  await as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, order_id, granted_by) values (${A.id}, ${t.id}, 'purchase', ${o.id}, ${admin.id})`);
  const sa = await statuses(A, R);
  expect(sa.page === 200 && sa.lesson === 200 && sa.video === 200 && sa.doc === 200 && sa.prog === 200, `A doit tout ouvrir ${JSON.stringify(sa)}`);
  ok("Préparation : A (acheteur vérifié) ouvre sa formation ; B et C n'ont pas d'accès");

  // ── Accès croisés ──
  expect(forbidden(await statuses(B, R)), "B n'ouvre pas la formation de A (même profession, vérifié)");
  ok("Accès croisé : B (vérifié, même profession) n'ouvre ni la page, ni la leçon, ni la vidéo, ni le document de la formation de A");
  const [before] = await sql`select max_position_sec from lesson_progress where user_id = ${A.id} and lesson_id = ${R.l1}`;
  const pb = await beat(B, R.l1);
  const [after] = await sql`select max_position_sec from lesson_progress where user_id = ${A.id} and lesson_id = ${R.l1}`;
  const [bRow] = await sql`select count(*)::int as n from lesson_progress where user_id = ${B.id} and lesson_id = ${R.l1}`;
  expect(pb.status === 403 && String(before?.max_position_sec) === String(after?.max_position_sec) && bRow.n === 0, "B ne crée ni ne modifie de progression");
  ok("Accès croisé : B ne peut ni écrire sa progression ni modifier celle de A sur cette leçon");
  expect(forbidden(await statuses(C, R)), "le client HANOVER n'ouvre pas la formation");
  const aHan = await Promise.all([req(A, "/parcours/hanover-5g"), req(A, `/parcours/hanover-5g/${hl1.lesson_id}`), req(A, `/api/video/${hl1.lesson_id}`), req(A, `/api/documents/${hdoc.id}`), beat(A, hl1.lesson_id)]);
  expect(aHan.map((x) => x.status).join() === "404,404,403,403,403", `A n'ouvre pas HANOVER 5G (${aHan.map((x) => x.status)})`);
  ok("Accès croisé : le client HANOVER n'ouvre pas la formation, l'acheteur n'ouvre aucune ressource HANOVER");

  // ── Accès directs mal formés ou détournés ──
  const wrongSlug = await req(A, `/parcours/hanover-5g/${R.l1}`);
  expect(wrongSlug.status === 404, `leçon de formation sous le slug HANOVER refusée (${wrongSlug.status})`);
  const locked = await req(A, `/api/video/${R.l2}`);
  expect(locked.status === 403, `vidéo de la leçon 2 (verrouillée) refusée même avec accès (${locked.status})`);
  const lockedPage = await req(A, `/parcours/${slug}/${R.l2}`);
  expect(lockedPage.status === 307 && String(lockedPage.headers.get("location")).includes(R.l1), "page de la leçon 2 renvoyée vers la leçon 1");
  const ghost = await Promise.all([req(A, `/api/documents/${randomUUID()}`), req(A, `/api/documents/..%2F..%2Fetc%2Fpasswd`), req(A, `/api/video/${randomUUID()}`), req(A, `/parcours/${slug}/${randomUUID()}`), req(A, `/parcours/inexistant-${run}`)]);
  expect(ghost.map((x) => x.status).join() === "404,404,403,404,404", `identifiants inconnus ou malformés (${ghost.map((x) => x.status)})`);
  const range = await req(A, `/api/video/${R.l1}`, { headers: { range: "bytes=999999999-" } });
  expect(range.status === 416, `plage d'octets hors fichier refusée (${range.status})`);
  ok("Accès directs : mauvais slug, leçon verrouillée (vidéo et page), identifiants inconnus ou malformés, plage d'octets abusive");
  const origin = await fetch(`${BASE}/api/progress/${R.l1}`, { method: "POST", headers: { cookie: A.cookie, origin: "https://attaquant.example", "Content-Type": "application/json" }, body: "{}" });
  expect(origin.status === 403, `progression depuis un autre site refusée (${origin.status})`);
  ok("Progression : requête venant d'un autre site refusée (origine)");

  // ── Sessions ──
  expect(anonymous(await statuses(null, R)), "sans session");
  ok("Sans session : pages renvoyées vers la connexion, vidéo, document et progression en 401");
  const forged = { cookie: `academy_session=${randomBytes(32).toString("base64url")}` };
  expect(anonymous(await statuses(forged, R)), "jeton de session inventé");
  const hashAsToken = { cookie: `academy_session=${createHash("sha256").update("x").digest("hex")}` };
  expect(anonymous(await statuses(hashAsToken, R)), "empreinte utilisée comme jeton");
  ok("Session falsifiée (jeton inventé, empreinte réutilisée) : traitée comme anonyme");
  const E = await account("Dr E (session expirée)", "doctor", "-1 minute");
  await verify(E.id);
  await as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, reason, granted_by) values (${E.id}, ${t.id}, 'offered', 'Test session expirée', ${admin.id})`);
  expect(anonymous(await statuses(E, R)), "session expirée");
  ok("Session expirée (accès pourtant valide) : traitée comme anonyme");
  await sql`update users set status = 'disabled' where id = ${A.id}`;
  expect(anonymous(await statuses(A, R)), "compte désactivé");
  await sql`update users set status = 'active' where id = ${A.id}`;
  ok("Compte désactivé : sa session ouverte ne donne plus accès à rien");
  const adminRoute = await req(A, "/admin/medecins/" + B.id);
  expect(adminRoute.status === 307 && !String(adminRoute.headers.get("location")).includes("/admin"), `fiche admin refusée (${adminRoute.status})`);
  ok("Un professionnel n'ouvre pas une fiche de l'administration (autre utilisateur)");

  // ── Plein écran : le filigrane nominatif reste toujours dans l'image ──
  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext();
    await ctx.addCookies([{ name: "academy_session", value: A.cookie.split("=")[1], url: BASE }]);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/parcours/${slug}/${R.l1}`);
    await page.waitForSelector("video");
    await page.click(".fs-btn");
    await page.waitForFunction(() => document.fullscreenElement?.classList.contains("player"), null, { timeout: 5000 });
    const inFull = await page.evaluate(() => { const f = document.fullscreenElement; const wm = f?.querySelector(".wm"); return !!wm && wm.textContent.length > 3 && getComputedStyle(wm).display !== "none"; });
    expect(inFull, "plein écran LIFT : le cadre entier est en plein écran, filigrane compris");
    await page.click(".fs-btn");
    await page.waitForFunction(() => !document.fullscreenElement, null, { timeout: 5000 });
    // Plein écran natif de la vidéo seule (comme un double-clic) : doit être quitté aussitôt.
    await page.evaluate(() => { const b = document.createElement("button"); b.id = "native-fs"; b.textContent = "x"; b.onclick = () => document.querySelector("video").requestFullscreen(); document.body.append(b); });
    await page.click("#native-fs");
    await page.waitForTimeout(1200);
    const native = await page.evaluate(() => ({ el: document.fullscreenElement?.tagName ?? null, warn: document.body.textContent.includes("bouton « Plein écran » du lecteur LIFT") }));
    expect(native.el !== "VIDEO" && native.warn, `plein écran natif de la vidéo seule quitté (${JSON.stringify(native)})`);
    const attrs = await page.evaluate(() => document.querySelector("video").getAttribute("controlslist"));
    expect(attrs.includes("nofullscreen") && attrs.includes("nodownload"), "bouton plein écran natif et téléchargement masqués");
    await browser.close();
    ok("Plein écran : le cadre LIFT garde le filigrane ; un plein écran natif de la vidéo seule est quitté aussitôt");
  }

  // ── Jetons Mux : durée calée sur la leçon (si une instance Mux de test est fournie) ──
  if (process.env.MUX_BASE_URL) {
    const html = await (await fetch(`${process.env.MUX_BASE_URL}/parcours/${slug}/${R.l1}`, { headers: { cookie: A.cookie } })).text();
    const jwt = html.match(/eyJ[\w-]+\.eyJ[\w-]+\.[\w-]+/)?.[0];
    expect(jwt, "jeton Mux présent dans la page");
    const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString());
    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    expect(ttl > 850 && ttl <= 900, `leçon de 12 s : jeton de 15 min (minimum), obtenu ${ttl} s`);
    expect(payload.custom?.user === A.id && payload.aud === "v", "jeton lié au compte, audience vidéo");
    const denied = await fetch(`${process.env.MUX_BASE_URL}/parcours/${slug}/${R.l1}`, { headers: { cookie: B.cookie } });
    expect(denied.status === 404 && !(await denied.text()).match(/eyJ[\w-]+\.eyJ[\w-]+\./), "aucun jeton émis pour B");
    ok(`Mux : jeton lié au compte, valable ${Math.round(ttl / 60)} min pour une leçon courte ; aucun jeton émis sans droit`);
  } else console.log("· Mux : test ignoré (MUX_BASE_URL non fourni)");

  console.log(`\nSécurité validée : ${step} étapes réussies.`);
} catch (e) {
  console.error(`\n✗ Échec après ${step} étapes : ${e.message}`);
  process.exitCode = 1;
} finally {
  await sql.end();
}
