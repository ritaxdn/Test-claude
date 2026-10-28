"use server";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { createSession, destroySession, findToken, hashPassword, issueToken, passwordProblem, recordAttempt, tooManyAttempts, verifyPassword } from "@/lib/auth";
import { audit } from "@/lib/db";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

export async function login(form: FormData) {
  const email = str(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  if (await tooManyAttempts(email)) redirect("/connexion?erreur=bloque");
  const [u] = await sql<{ id: string; role: string; password_hash: string | null; status: string }[]>`select id, role, password_hash, status from users where email = ${email}`;
  const ok = u && u.status === "active" && (await verifyPassword(password, u.password_hash));
  if (!ok) {
    await recordAttempt(email);
    redirect("/connexion?erreur=identifiants");
  }
  await createSession(u.id);
  redirect(u.role === "admin" ? "/admin" : "/tableau-de-bord");
}

export async function logout() {
  await destroySession();
  redirect("/connexion");
}

export async function acceptInvitation(form: FormData) {
  const token = str(form, "token");
  const password = String(form.get("password") ?? "");
  const t = await findToken(token, "invite");
  if (!t) redirect(`/invitation/${encodeURIComponent(token)}`);
  const problem = passwordProblem(password);
  if (problem) redirect(`/invitation/${encodeURIComponent(token)}?erreur=${encodeURIComponent(problem)}`);
  if (password !== String(form.get("password2") ?? "")) redirect(`/invitation/${encodeURIComponent(token)}?erreur=${encodeURIComponent("Les deux mots de passe ne sont pas identiques.")}`);
  if (form.get("cgu") !== "on") redirect(`/invitation/${encodeURIComponent(token)}?erreur=${encodeURIComponent("Merci d'accepter les conditions d'utilisation.")}`);
  const hash = await hashPassword(password);
  await sql.begin(async (tx) => {
    await tx`update auth_tokens set used_at = now() where user_id = ${t.user_id} and kind = 'invite' and used_at is null`;
    await tx`update users set password_hash = ${hash}, status = 'active', activated_at = coalesce(activated_at, now()) where id = ${t.user_id}`;
  });
  await audit(t.user_id, "user.activate", t.email);
  await createSession(t.user_id);
  redirect("/tableau-de-bord?bienvenue=1");
}

export async function requestReset(form: FormData) {
  const email = str(form, "email").toLowerCase();
  const [u] = await sql<{ id: string; full_name: string }[]>`select id, full_name from users where email = ${email} and status = 'active'`;
  if (u && !(await tooManyAttempts("reset:" + email))) {
    await recordAttempt("reset:" + email);
    const link = await issueToken(u.id, "reset", null);
    const { sendReset } = await import("@/lib/mail");
    await sendReset(email, u.full_name, link);
  }
  // Même réponse que l'adresse existe ou non.
  redirect("/mot-de-passe-oublie?envoye=1");
}

export async function resetPassword(form: FormData) {
  const token = str(form, "token");
  const password = String(form.get("password") ?? "");
  const t = await findToken(token, "reset");
  if (!t) redirect(`/reinitialiser/${encodeURIComponent(token)}`);
  const problem = passwordProblem(password) ?? (password !== String(form.get("password2") ?? "") ? "Les deux mots de passe ne sont pas identiques." : null);
  if (problem) redirect(`/reinitialiser/${encodeURIComponent(token)}?erreur=${encodeURIComponent(problem)}`);
  const hash = await hashPassword(password);
  await sql.begin(async (tx) => {
    await tx`update auth_tokens set used_at = now() where user_id = ${t.user_id} and kind = 'reset' and used_at is null`;
    await tx`update users set password_hash = ${hash} where id = ${t.user_id}`;
    await tx`delete from sessions where user_id = ${t.user_id}`;
  });
  await audit(t.user_id, "user.password_reset", t.email);
  await createSession(t.user_id);
  redirect("/");
}
