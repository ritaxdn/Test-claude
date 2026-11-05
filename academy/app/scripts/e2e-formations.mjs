// Test de bout en bout du lot 1 « Formations » (docs/07-formations-et-acces.md, §8).
// Nécessite l'application démarrée (BASE_URL) avec la migration 002 appliquée, et DATABASE_URL
// sur le compte de l'APPLICATION (academy_app) : les garde-fous sont testés avec ses droits réels.
import { createHash, randomBytes } from "node:crypto";
import postgres from "postgres";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });
const run = Date.now().toString(36);
let step = 0;
const ok = (msg) => console.log(`✓ F${String(++step).padStart(2, "0")} ${msg}`);
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
/** L'opération doit être refusée par la base (message attendu en partie). */
async function refused(fn, part, msg) {
  try { await fn(); } catch (e) { expect(String(e.message).includes(part), `${msg} — refus inattendu : ${e.message}`); return; }
  throw new Error(`${msg} — la base a accepté l'opération`);
}
/** Opération faite « au nom de » un compte : l'auteur est transmis au journal. */
const as = (actorId, fn) => sql.begin(async (tx) => { await tx`select set_config('app.actor_id', ${actorId}, true)`; return fn(tx); });

// ── Comptes de test (connexion par session directe : l'authentification est déjà couverte par e2e.mjs) ──
async function account(full_name, role = "doctor") {
  const [u] = await sql`insert into users (email, full_name, role, status, password_hash, activated_at)
    values (${`${role}-${randomBytes(4).toString("hex")}-${run}@lift.test`}, ${full_name}, ${role}, 'active', 'scrypt$x', now()) returning id`;
  const token = randomBytes(32).toString("base64url");
  await sql`insert into sessions (token_hash, user_id, expires_at) values (${createHash("sha256").update(token).digest("hex")}, ${u.id}, now() + interval '1 day')`;
  return { id: u.id, cookie: `academy_session=${token}` };
}
const get = (who, path) => fetch(`${BASE}${path}`, { headers: { cookie: who.cookie }, redirect: "manual" });
const beat = (who, lessonId) => fetch(`${BASE}/api/progress/${lessonId}`, { method: "POST", headers: { cookie: who.cookie, "Content-Type": "application/json" }, body: JSON.stringify({ position: 1 }) });
const dashboard = async (who) => (await get(who, "/tableau-de-bord")).text();

/** Tous les points d'entrée d'une formation, pour un compte : page, leçon, vidéo, document, progression. */
async function reach(who, t) {
  const [page, lesson, video, doc, prog] = await Promise.all([
    get(who, `/parcours/${t.slug}`), get(who, `/parcours/${t.slug}/${t.l1}`), get(who, `/api/video/${t.l1}`), get(who, `/api/documents/${t.doc}`), beat(who, t.l1),
  ]);
  return { page: page.status, lesson: lesson.status, video: video.status, doc: doc.status, prog: prog.status };
}
const open = (r) => r.page === 200 && r.lesson === 200 && r.video === 200 && r.doc === 200 && r.prog === 200;
const closed = (r) => r.page === 404 && r.lesson === 404 && r.video === 403 && r.doc === 403 && r.prog === 403;

try {
  // ── Préparation : un admin, une formation avec 2 leçons et un document ──
  const admin = await account("Admin Formations E2E", "admin");
  const boss = await account("Admin 2 E2E (sans droit de vérification)", "admin");
  const fake = await account("Professionnel qui se prend pour un admin");
  // Droit distinct « vérifier les qualifications » : accordé par un AUTRE admin, jamais à soi-même.
  await refused(() => as(admin.id, (tx) => tx`update users set can_verify_qualifications = true where id = ${admin.id}`), "soi-même", "droit de vérification auto-attribué");
  await refused(() => as(fake.id, (tx) => tx`update users set can_verify_qualifications = true where id = ${admin.id}`), "administrateur actif", "droit de vérification accordé par un non-admin");
  await refused(() => sql`update users set can_verify_qualifications = true where id = ${admin.id}`, "administrateur actif", "droit de vérification accordé sans auteur");
  await as(boss.id, (tx) => tx`update users set can_verify_qualifications = true where id = ${admin.id}`);
  const slug = `formation-e2e-${run}`;
  const [t] = await as(admin.id, (tx) => tx`insert into programs (slug, title, summary, kind, eligible_professions, published)
      values (${slug}, 'Formation E2E — Lasers : indications et sécurité', 'Contenu de test.', 'training', ${["medecin_esthetique", "dermatologue"]}, true) returning id`);
  const [m] = await sql`insert into modules (program_id, position, title) values (${t.id}, 1, 'Module 1') returning id`;
  const [l1] = await sql`insert into lessons (module_id, position, title, video_ref, duration_sec) values (${m.id}, 1, 'Leçon 1', 'lecon-1.webm', 12) returning id`;
  await sql`insert into lessons (module_id, position, title, video_ref, duration_sec) values (${m.id}, 2, 'Leçon 2', 'lecon-2.webm', 12)`;
  const [d] = await sql`insert into documents (program_id, title, storage_key) values (${t.id}, 'Fiche E2E', 'exemple/fiche-protocole.pdf') returning id`;
  const T = { id: t.id, slug, l1: l1.id, doc: d.id };
  const [hanover] = await sql`select p.id, p.device_model_id from programs p where slug = 'hanover-5g'`;
  ok("Préparation : formation publiée (2 leçons, 1 document) ; droit de vérification accordé par un autre admin (auto-attribution et non-admin refusés)");

  // ── 9. Contraintes de structure ──
  await refused(() => sql`insert into programs (slug, title, kind, device_model_id, eligible_professions, published) values (${`x-${run}`}, 'X', 'training', ${hanover.device_model_id}, '{medecin_esthetique}', true)`, "programs_kind_rules", "formation rattachée à une machine");
  await refused(() => sql`insert into programs (slug, title, kind, published) values (${`y-${run}`}, 'Y', 'technology', true)`, "programs_kind_rules", "technologie publiée sans machine");
  await refused(() => sql`insert into programs (slug, title, kind, published) values (${`z-${run}`}, 'Z', 'training', true)`, "programs_kind_rules", "formation publiée sans profession");
  ok("Refusé par la base : formation avec machine, technologie publiée sans machine, formation sans profession");

  // ── Professionnel non client, qualification en attente ──
  const pro = await account("Dr Non Client E2E");
  await sql`update users set profession = 'medecin_esthetique', professional_id = 'ORDRE-E2E-1', country = 'MA', qualification_status = 'pending' where id = ${pro.id}`;

  // ── 2. Commande en attente : pas d'accès possible ──
  const [o1] = await as(admin.id, (tx) => tx`insert into orders (user_id, program_id, currency, amount, method, created_by) values (${pro.id}, ${T.id}, 'MAD', 1500, 'virement', ${admin.id}) returning id`);
  await refused(() => as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, order_id, granted_by) values (${pro.id}, ${T.id}, 'purchase', ${o1.id}, ${admin.id})`), "pas payée", "accès « achat » avec une commande en attente");
  ok("Accès « achat » refusé par la base tant que la commande n'est pas payée");

  // ── 11 (base). Un non-admin ne crée ni commande, ni accès, ni validation ──
  await refused(() => sql`insert into orders (user_id, program_id, currency, amount, method, created_by) values (${pro.id}, ${T.id}, 'MAD', 1, 'virement', ${fake.id})`, "administrateur actif", "commande créée par un non-admin");
  await refused(() => sql`update orders set status = 'paid', paid_checked_by = ${fake.id}, paid_checked_at = now(), reference = ${'VIR-FAUX-' + run}, amount_received = amount where id = ${o1.id}`, "administrateur actif", "paiement validé par un non-admin");
  await refused(() => sql`insert into access_grants (user_id, program_id, source, reason, granted_by) values (${pro.id}, ${T.id}, 'offered', 'cadeau', ${fake.id})`, "administrateur actif", "accès offert par un non-admin");
  await refused(() => sql`update users set qualification_status = 'verified', qualification_checked_by = ${fake.id}, qualification_checked_at = now() where id = ${pro.id}`, "administrateur actif", "qualification validée par un non-admin");
  await refused(() => as(boss.id, (tx) => tx`update users set qualification_status = 'verified', qualification_checked_by = ${boss.id}, qualification_checked_at = now() where id = ${pro.id}`), "habilité", "qualification validée par un admin NON habilité");
  await refused(() => sql`update orders set status = 'paid', paid_checked_by = ${admin.id}, paid_checked_at = now(), amount_received = amount where id = ${o1.id}`, "orders_check", "paiement validé sans référence");
  ok("Refusé par la base : commande, paiement, accès et qualification par un non-admin ; qualification par un admin non habilité ; paiement sans référence");

  // ── 1 + 3. Paiement vérifié, accès acheté… mais qualification en attente → toujours fermé ──
  await as(admin.id, (tx) => tx`update orders set status = 'paid', paid_checked_by = ${admin.id}, paid_checked_at = now(), reference = ${'VIR-E2E-0001-' + run}, amount_received = amount where id = ${o1.id}`);
  const [g1] = await as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, order_id, granted_by, expires_at) values (${pro.id}, ${T.id}, 'purchase', ${o1.id}, ${admin.id}, now() + interval '12 months') returning id`);
  let r = await reach(pro, T);
  expect(closed(r), `qualification en attente : tout doit être fermé ${JSON.stringify(r)}`);
  ok("Accès acheté mais qualification « en attente » : page, leçon, vidéo, document et progression refusés");

  // ── 4. Profession non autorisée → fermé ; changer de profession remet la vérification à zéro ──
  await as(admin.id, (tx) => tx`update users set profession = 'kinesitherapeute', qualification_status = 'verified', qualification_checked_by = ${admin.id}, qualification_checked_at = now(), qualification_note = 'Carte vérifiée (test)' where id = ${pro.id}`);
  r = await reach(pro, T);
  expect(closed(r), `profession non autorisée : tout doit être fermé ${JSON.stringify(r)}`);
  await as(admin.id, (tx) => tx`update users set profession = 'medecin_esthetique' where id = ${pro.id}`);
  const [q] = await sql`select qualification_status from users where id = ${pro.id}`;
  expect(q.qualification_status === "pending", `changement de profession : vérification remise à zéro (${q.qualification_status})`);
  ok("Profession non autorisée : fermé ; un changement de profession repasse la qualification « en attente »");

  // ── 1. Qualification vérifiée par un admin → tout s'ouvre ──
  await as(admin.id, (tx) => tx`update users set qualification_status = 'verified', qualification_checked_by = ${admin.id}, qualification_checked_at = now(), qualification_note = 'N° d''Ordre vérifié (test)' where id = ${pro.id}`);
  r = await reach(pro, T);
  expect(open(r), `vérifié + payé : tout doit être ouvert ${JSON.stringify(r)}`);
  expect((await dashboard(pro)).includes("Formation E2E — Lasers"), "formation visible sur le tableau de bord");
  ok("Non-client vérifié + paiement vérifié : formation visible, page, leçon, vidéo, document et progression ouverts");

  // ── 8. Étanchéité : l'achat n'ouvre pas les parcours technologie ; un parcours technologie ne s'achète pas ──
  expect((await get(pro, "/parcours/hanover-5g")).status === 404, "un acheteur de formation n'ouvre pas HANOVER 5G");
  await refused(() => as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, reason, granted_by) values (${pro.id}, ${hanover.id}, 'offered', 'essai', ${admin.id})`), "jamais sur un parcours technologie", "accès offert sur un parcours technologie");
  await refused(() => as(admin.id, (tx) => tx`insert into orders (user_id, program_id, currency, amount, method, created_by) values (${pro.id}, ${hanover.id}, 'MAD', 1, 'virement', ${admin.id})`), "que sur une formation", "commande sur un parcours technologie");
  ok("Étanchéité : l'achat n'ouvre pas HANOVER 5G ; impossible d'acheter ou d'offrir un parcours technologie");

  // ── Historique non réécrivable ──
  await refused(() => sql`delete from access_grants where id = ${g1.id}`, "permission denied", "suppression d'un accès");
  await refused(() => sql`delete from orders where id = ${o1.id}`, "permission denied", "suppression d'une commande");
  await refused(() => sql`update audit_log set action = 'falsifie' where actor_id = ${admin.id}`, "permission denied", "modification du journal");
  await refused(() => sql`delete from audit_log where actor_id = ${admin.id}`, "permission denied", "suppression du journal");
  await refused(() => as(admin.id, (tx) => tx`update access_grants set expires_at = now() + interval '10 years' where id = ${g1.id}`), "ne se modifie pas", "prolongation silencieuse d'un accès");
  await refused(() => as(admin.id, (tx) => tx`update orders set amount = 1 where id = ${o1.id}`), "ne se modifie pas", "modification du montant d'une commande payée");
  ok("Historique protégé : ni suppression d'accès ou de commande, ni réécriture du journal, ni modification silencieuse");

  // ── 5. Révocation : perte immédiate, définitive, motivée ──
  await refused(() => as(admin.id, (tx) => tx`update access_grants set revoked_at = now(), revoked_by = ${admin.id} where id = ${g1.id}`), "access_grants_check", "révocation sans motif");
  await as(admin.id, (tx) => tx`update access_grants set revoked_at = now(), revoked_by = ${admin.id}, revoke_reason = 'Test de révocation' where id = ${g1.id}`);
  r = await reach(pro, T);
  expect(closed(r), `révoqué : tout doit être fermé ${JSON.stringify(r)}`);
  await refused(() => as(admin.id, (tx) => tx`update access_grants set revoked_at = null, revoked_by = null, revoke_reason = null where id = ${g1.id}`), "ne se rouvre pas", "réouverture d'un accès révoqué");
  ok("Révocation motivée : accès coupé immédiatement partout, et impossible de « dé-révoquer »");

  // ── 6. Remboursement intégral confirmé → accès acheté révoqué automatiquement ──
  const [o2] = await as(admin.id, (tx) => tx`insert into orders (user_id, program_id, currency, amount, method, created_by) values (${pro.id}, ${T.id}, 'EUR', 150, 'carte', ${admin.id}) returning id`);
  await as(admin.id, (tx) => tx`update orders set status = 'paid', paid_checked_by = ${admin.id}, paid_checked_at = now(), reference = ${'TPE-E2E-0002-' + run}, amount_received = amount where id = ${o2.id}`);
  const [g2] = await as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, order_id, granted_by) values (${pro.id}, ${T.id}, 'purchase', ${o2.id}, ${admin.id}) returning id`);
  expect(open(await reach(pro, T)), "nouvel achat : accès rouvert");
  await refused(() => as(admin.id, (tx) => tx`update orders set status = 'refunded' where id = ${o2.id}`), "administrateur actif", "remboursement sans auteur ni motif");
  await as(admin.id, (tx) => tx`update orders set status = 'refunded', closed_by = ${admin.id}, closed_at = now(), close_reason = 'Demande du client (test)' where id = ${o2.id}`);
  const [g2s] = await sql`select revoked_at, revoke_reason from access_grants where id = ${g2.id}`;
  expect(g2s.revoked_at && g2s.revoke_reason.startsWith("Remboursement intégral confirmé"), "accès révoqué par le remboursement");
  expect(closed(await reach(pro, T)), "remboursé : accès fermé");
  await refused(() => as(admin.id, (tx) => tx`update orders set status = 'paid' where id = ${o2.id}`), "interdit", "commande remboursée repassée « payée »");
  ok("Remboursement intégral confirmé : accès révoqué automatiquement (motif tracé) ; statut irréversible");

  // ── Exception tracée : accès offert avec motif après remboursement ──
  await refused(() => as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, granted_by) values (${pro.id}, ${T.id}, 'offered', ${admin.id})`), "access_grants_check", "accès offert sans motif");
  const [g3] = await as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, reason, granted_by) values (${pro.id}, ${T.id}, 'offered', 'Exception commerciale validée par la direction (test)', ${admin.id}) returning id`);
  expect(open(await reach(pro, T)), "accès offert : ouvert");
  await refused(() => as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, reason, granted_by) values (${pro.id}, ${T.id}, 'offered', 'doublon', ${admin.id})`), "access_grants_one_active", "deux accès actifs pour la même formation");
  ok("Exception : accès offert avec motif obligatoire, tracé ; un seul accès actif par formation");

  // ── 10. Accès expiré ──
  await as(admin.id, (tx) => tx`update access_grants set revoked_at = now(), revoked_by = ${admin.id}, revoke_reason = 'Remplacé (test expiration)' where id = ${g3.id}`);
  await as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, reason, granted_by, granted_at, expires_at) values (${pro.id}, ${T.id}, 'offered', 'Accès de 1 jour (test)', ${admin.id}, now() - interval '2 days', now() - interval '1 day')`);
  expect(closed(await reach(pro, T)), "expiré : fermé");
  ok("Accès expiré : fermé partout");

  // ── 7. Cumul : un client avec machine achète une formation ──
  const client = await account("Dr Client Machine E2E");
  const [own] = await as(admin.id, (tx) => tx`insert into device_ownerships (user_id, device_model_id, serial_number) values (${client.id}, ${hanover.device_model_id}, ${`HN5G-F-${run}`}) returning id`);
  expect((await get(client, "/parcours/hanover-5g")).status === 200, "client : HANOVER 5G ouvert");
  expect(closed(await reach(client, T)), "la machine n'ouvre pas la formation");
  await as(admin.id, (tx) => tx`update users set profession = 'dermatologue', qualification_status = 'verified', qualification_checked_by = ${admin.id}, qualification_checked_at = now() where id = ${client.id}`);
  const [g4] = await as(admin.id, (tx) => tx`insert into access_grants (user_id, program_id, source, reason, granted_by) values (${client.id}, ${T.id}, 'offered', 'Client partenaire (test)', ${admin.id}) returning id`);
  const dash = await dashboard(client);
  expect(dash.includes("HANOVER 5G — Programme opérateur") && dash.includes("Formation E2E — Lasers"), "les deux parcours au tableau de bord");
  await sql`update device_ownerships set revoked_at = now() where id = ${own.id}`;
  expect((await get(client, "/parcours/hanover-5g")).status === 404 && open(await reach(client, T)), "machine retirée : technologie fermée, formation gardée");
  await sql`update device_ownerships set revoked_at = null where id = ${own.id}`;
  await as(admin.id, (tx) => tx`update access_grants set revoked_at = now(), revoked_by = ${admin.id}, revoke_reason = 'Test cumul' where id = ${g4.id}`);
  expect((await get(client, "/parcours/hanover-5g")).status === 200 && closed(await reach(client, T)), "formation révoquée : technologie gardée");
  ok("Cumul : machine + formation ; retirer l'une ne touche pas l'autre ; la machine seule n'ouvre pas la formation");

  // ── 11 (écrans). Un professionnel n'atteint pas l'administration ──
  const adminPage = await get(pro, "/admin");
  expect(adminPage.status >= 300 && adminPage.status < 400 && !String(adminPage.headers.get("location")).includes("/admin"), `administration refusée (${adminPage.status})`);
  ok("Un professionnel est renvoyé hors de l'administration");

  // ── 12. Traçabilité : chaque changement journalisé avec son auteur ──
  const logs = await sql`select action, count(*)::int as n from audit_log where actor_id = ${admin.id} group by action order by action`;
  const n = Object.fromEntries(logs.map((x) => [x.action, x.n]));
  expect(n["orders.insert"] === 2 && n["orders.update"] >= 3, `commandes journalisées ${JSON.stringify(n)}`);
  expect(n["access_grants.insert"] === 5 && n["access_grants.update"] >= 4, `accès journalisés ${JSON.stringify(n)}`);
  expect(n["users.update"] >= 4, `qualifications journalisées ${JSON.stringify(n)}`);
  const [leak] = await sql`select count(*)::int as n from audit_log where action like 'users.%' and details::text like '%scrypt%'`;
  expect(leak.n === 0, "aucun mot de passe dans le journal");
  const [flag] = await sql`select count(*)::int as n from audit_log where actor_id = ${boss.id} and action = 'users.update' and target = ${admin.id} and details->'after'->>'can_verify_qualifications' = 'true'`;
  expect(flag.n === 1, "attribution du droit de vérification journalisée");
  const [refund] = await sql`select count(*)::int as n from audit_log where action = 'access_grants.update' and target = ${g2.id} and details->'after'->>'revoke_reason' like 'Remboursement%' and actor_id = ${admin.id}`;
  expect(refund.n === 1, "révocation par remboursement journalisée avec l'auteur du remboursement");
  ok(`Journal : ${Object.entries(n).map(([k, v]) => `${k} ×${v}`).join(", ")} — auteur renseigné, aucun mot de passe`);

  console.log(`\nLot 1 Formations validé : ${step} étapes réussies.`);
} catch (e) {
  console.error(`\n✗ Échec après ${step} étapes : ${e.message}`);
  process.exitCode = 1;
} finally {
  await sql.end();
}
