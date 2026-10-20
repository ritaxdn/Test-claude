"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin, issueToken } from "@/lib/auth";
import { sql, audit } from "@/lib/db";
import { grantForOwnership } from "@/lib/access";
import { sendInvitation } from "@/lib/mail";
import { putDocument } from "@/lib/storage";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const opt = (f: FormData, k: string) => s(f, k) || null;
const back = (path: string, params: Record<string, string>) => redirect(`${path}?${new URLSearchParams(params)}`);
const isUuid = (v: string) => /^[0-9a-f-]{36}$/i.test(v);

/** Invite un médecin : compte « invité », machine liée, parcours ouverts, lien d'invitation. */
export async function inviteDoctor(form: FormData) {
  const admin = await requireAdmin();
  const email = s(form, "email").toLowerCase();
  const name = s(form, "full_name");
  const model = s(form, "device_model_id");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !name) back("/admin/medecins/nouveau", { erreur: "Nom et e-mail valides obligatoires." });
  const [existing] = await sql<{ id: string }[]>`select id from users where email = ${email}`;
  if (existing) back(`/admin/medecins/${existing.id}`, { info: "Ce médecin a déjà un compte : ajoutez-lui la machine ici." });
  const [u] = await sql<{ id: string }[]>`
    insert into users (email, full_name, specialty, clinic, city) values (${email}, ${name}, ${opt(form, "specialty")}, ${opt(form, "clinic")}, ${opt(form, "city")}) returning id`;
  const machines: string[] = [];
  if (isUuid(model)) {
    const [o] = await sql<{ id: string; name: string }[]>`
      insert into device_ownerships (user_id, device_model_id, serial_number, clinic, installed_on, created_by)
      values (${u.id}, ${model}, ${opt(form, "serial_number")}, ${opt(form, "clinic")}, ${opt(form, "installed_on")}, ${admin.id})
      returning id, (select name from device_models where id = ${model})`;
    await grantForOwnership(o.id, admin.id);
    machines.push(o.name);
  }
  const link = await issueToken(u.id, "invite", admin.id);
  const sent = await sendInvitation(email, name, link, machines);
  await audit(admin.id, "user.invite", email, { machines, email_sent: sent });
  back(`/admin/medecins/${u.id}`, { lien: link, envoye: sent ? "1" : "0" });
}

export async function addMachine(form: FormData) {
  const admin = await requireAdmin();
  const userId = s(form, "user_id"), model = s(form, "device_model_id");
  if (!isUuid(userId) || !isUuid(model)) back(`/admin/medecins/${userId}`, { erreur: "Choisissez une machine." });
  const [o] = await sql<{ id: string }[]>`
    insert into device_ownerships (user_id, device_model_id, serial_number, clinic, installed_on, created_by)
    values (${userId}, ${model}, ${opt(form, "serial_number")}, ${opt(form, "clinic")}, ${opt(form, "installed_on")}, ${admin.id}) returning id`;
  await grantForOwnership(o.id, admin.id);
  await audit(admin.id, "device.link", userId, { device_model_id: model, serial: opt(form, "serial_number") });
  back(`/admin/medecins/${userId}`, { info: "Machine ajoutée : le parcours correspondant est ouvert." });
}

export async function removeMachine(form: FormData) {
  const admin = await requireAdmin();
  const id = s(form, "ownership_id"), userId = s(form, "user_id");
  await sql.begin(async (tx) => {
    await tx`update device_ownerships set revoked_at = now() where id = ${id}`;
    await tx`update entitlements set revoked_at = now() where device_ownership_id = ${id} and revoked_at is null`;
  });
  await audit(admin.id, "device.unlink", userId, { ownership_id: id });
  back(`/admin/medecins/${userId}`, { info: "Machine retirée. La progression est conservée." });
}

export async function newLink(form: FormData) {
  const admin = await requireAdmin();
  const userId = s(form, "user_id"), kind = s(form, "kind") === "reset" ? "reset" : "invite";
  const [u] = await sql<{ email: string; full_name: string }[]>`select email, full_name from users where id = ${userId}`;
  const link = await issueToken(userId, kind, admin.id);
  let sent = false;
  if (kind === "invite") {
    const ms = await sql<{ name: string }[]>`select dm.name from device_ownerships o join device_models dm on dm.id = o.device_model_id where o.user_id = ${userId} and o.revoked_at is null`;
    sent = await sendInvitation(u.email, u.full_name, link, ms.map((m) => m.name));
  }
  await audit(admin.id, kind === "invite" ? "user.reinvite" : "user.reset_link", u.email);
  back(`/admin/medecins/${userId}`, { lien: link, envoye: sent ? "1" : "0", type: kind });
}

export async function setUserStatus(form: FormData) {
  const admin = await requireAdmin();
  const userId = s(form, "user_id"), status = s(form, "status");
  if (userId === admin.id) back(`/admin/medecins/${userId}`, { erreur: "Vous ne pouvez pas désactiver votre propre compte." });
  if (status === "disabled") {
    await sql.begin(async (tx) => {
      await tx`update users set status = 'disabled' where id = ${userId}`;
      await tx`delete from sessions where user_id = ${userId}`;
    });
  } else {
    await sql`update users set status = case when password_hash is null then 'invited' else 'active' end where id = ${userId}`;
  }
  await audit(admin.id, status === "disabled" ? "user.disable" : "user.enable", userId);
  back(`/admin/medecins/${userId}`, { info: status === "disabled" ? "Accès désactivé et sessions fermées." : "Accès réactivé." });
}

/* ── Contenus ── */
export async function createDeviceModel(form: FormData) {
  const admin = await requireAdmin();
  const name = s(form, "name").toUpperCase();
  if (!name) back("/admin/machines", { erreur: "Nom obligatoire." });
  await sql`insert into device_models (name, family) values (${name}, ${opt(form, "family")}) on conflict (name) do nothing`;
  await audit(admin.id, "device_model.create", name);
  revalidatePath("/admin/machines");
  back("/admin/machines", { info: `${name} ajoutée.` });
}

export async function createProgram(form: FormData) {
  const admin = await requireAdmin();
  const title = s(form, "title");
  const slug = s(form, "slug").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!title || slug.length < 2) back("/admin/parcours", { erreur: "Titre et adresse obligatoires." });
  const model = s(form, "device_model_id");
  const [p] = await sql<{ id: string }[]>`
    insert into programs (slug, title, summary, device_model_id) values (${slug}, ${title}, ${opt(form, "summary")}, ${isUuid(model) ? model : null})
    on conflict (slug) do nothing returning id`;
  if (!p) back("/admin/parcours", { erreur: "Cette adresse de parcours existe déjà." });
  await audit(admin.id, "program.create", title);
  back(`/admin/parcours/${p.id}`, { info: "Parcours créé. Ajoutez un module puis des leçons." });
}

export async function updateProgram(form: FormData) {
  const admin = await requireAdmin();
  const id = s(form, "program_id"), model = s(form, "device_model_id");
  const published = form.get("published") === "on";
  await sql`update programs set title = ${s(form, "title")}, summary = ${opt(form, "summary")}, device_model_id = ${isUuid(model) ? model : null}, published = ${published} where id = ${id}`;
  // Les médecins qui ont déjà la machine reçoivent l'accès au parcours.
  if (isUuid(model)) {
    await sql`insert into entitlements (user_id, program_id, source, device_ownership_id, granted_by)
              select o.user_id, ${id}, 'equipment', o.id, ${admin.id} from device_ownerships o
               where o.device_model_id = ${model} and o.revoked_at is null on conflict do nothing`;
  }
  await audit(admin.id, "program.update", id, { published });
  back(`/admin/parcours/${id}`, { info: "Parcours enregistré." });
}

export async function addModule(form: FormData) {
  const admin = await requireAdmin();
  const id = s(form, "program_id");
  await sql`insert into modules (program_id, position, title) values (${id}, (select coalesce(max(position), 0) + 1 from modules where program_id = ${id}), ${s(form, "title") || "Nouveau module"})`;
  await audit(admin.id, "module.create", id);
  back(`/admin/parcours/${id}`, { info: "Module ajouté." });
}

const parseDuration = (v: string) => {
  const m = /^(\d+)(?::(\d{1,2}))?$/.exec(v.trim());
  return m ? +m[1] * 60 + (m[2] ? +m[2] : 0) : null;
};

export async function saveLesson(form: FormData) {
  const admin = await requireAdmin();
  const programId = s(form, "program_id"), lessonId = s(form, "lesson_id"), moduleId = s(form, "module_id");
  const duration = parseDuration(s(form, "duration"));
  if (!s(form, "title") || !duration) back(`/admin/parcours/${programId}`, { erreur: "Titre et durée (min:s) obligatoires pour chaque leçon." });
  const presenter = s(form, "presenter_id");
  const presenterId = isUuid(presenter) ? presenter : null;
  if (presenterId) {
    const [ok] = await sql`select 1 from presenters where id = ${presenterId}`;
    if (!ok) back(`/admin/parcours/${programId}`, { erreur: "Présentateur introuvable." });
  }
  if (isUuid(lessonId)) {
    await sql`update lessons set title = ${s(form, "title")}, video_ref = ${opt(form, "video_ref")}, duration_sec = ${duration}, body = ${opt(form, "body")}, presenter_id = ${presenterId} where id = ${lessonId}`;
  } else {
    await sql`insert into lessons (module_id, position, title, video_ref, duration_sec, body, presenter_id)
              values (${moduleId}, (select coalesce(max(position), 0) + 1 from lessons where module_id = ${moduleId}), ${s(form, "title")}, ${opt(form, "video_ref")}, ${duration}, ${opt(form, "body")}, ${presenterId})`;
  }
  await audit(admin.id, isUuid(lessonId) ? "lesson.update" : "lesson.create", s(form, "title"));
  back(`/admin/parcours/${programId}`, { info: "Leçon enregistrée." });
}

export async function deleteLesson(form: FormData) {
  const admin = await requireAdmin();
  const programId = s(form, "program_id"), lessonId = s(form, "lesson_id");
  await sql`delete from lessons where id = ${lessonId}`;
  await audit(admin.id, "lesson.delete", lessonId);
  back(`/admin/parcours/${programId}`, { info: "Leçon supprimée." });
}

export async function uploadDocument(form: FormData) {
  const admin = await requireAdmin();
  const programId = s(form, "program_id");
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) back(`/admin/parcours/${programId}`, { erreur: "Choisissez un fichier." });
  const f = file as File;
  if (f.size > 25 * 1024 * 1024) back(`/admin/parcours/${programId}`, { erreur: "Fichier trop lourd (25 Mo maximum)." });
  const allowed = ["application/pdf", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowed.includes(f.type)) back(`/admin/parcours/${programId}`, { erreur: "Formats acceptés : PDF, JPG, PNG, DOCX." });
  const ext = (f.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `${programId}/${crypto.randomUUID()}.${ext}`;
  await putDocument(key, Buffer.from(await f.arrayBuffer()), f.type);
  const lesson = s(form, "lesson_id");
  await sql`insert into documents (program_id, lesson_id, title, storage_key, mime_type, size_bytes)
            values (${programId}, ${isUuid(lesson) ? lesson : null}, ${s(form, "title") || f.name}, ${key}, ${f.type}, ${f.size})`;
  await audit(admin.id, "document.upload", s(form, "title") || f.name);
  back(`/admin/parcours/${programId}`, { info: "Document ajouté." });
}

export async function deleteDocument(form: FormData) {
  const admin = await requireAdmin();
  const programId = s(form, "program_id");
  await sql`delete from documents where id = ${s(form, "document_id")}`;
  await audit(admin.id, "document.delete", s(form, "document_id"));
  back(`/admin/parcours/${programId}`, { info: "Document retiré." });
}

/* ── Présentateurs ── */
export async function savePresenter(form: FormData) {
  const admin = await requireAdmin();
  const id = s(form, "presenter_id"), name = s(form, "name").replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 120) back("/admin/presentateurs", { erreur: "Indiquez le nom du présentateur (2 à 120 caractères)." });
  const title = opt(form, "title");
  if (title && title.length > 160) back("/admin/presentateurs", { erreur: "Titre trop long (160 caractères maximum)." });
  try {
    if (isUuid(id)) await sql`update presenters set name = ${name}, title = ${title}, active = ${form.get("active") === "on"} where id = ${id}`;
    else await sql`insert into presenters (name, title) values (${name}, ${title})`;
  } catch (e) {
    if ((e as { code?: string }).code === "23505") back("/admin/presentateurs", { erreur: `« ${name} » existe déjà.` });
    throw e;
  }
  await audit(admin.id, isUuid(id) ? "presenter.update" : "presenter.create", name);
  back("/admin/presentateurs", { info: isUuid(id) ? `${name} : enregistré.` : `${name} ajouté(e).` });
}
