import "server-only";
import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "./db";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
export const SESSION_COOKIE = "academy_session";
const SESSION_DAYS = 14;

export type User = { id: string; email: string; full_name: string; role: "doctor" | "admin"; status: string };

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export const newToken = () => randomBytes(32).toString("base64url");

/** Format : scrypt$N$r$p$sel$empreinte (base64url). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize("NFKC"), salt, 64, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const [alg, N, r, p, salt, hash] = stored.split("$");
  if (alg !== "scrypt") return false;
  const expected = Buffer.from(hash, "base64url");
  const key = await scrypt(password.normalize("NFKC"), Buffer.from(salt, "base64url"), expected.length, { N: +N, r: +r, p: +p, maxmem: 64 * 1024 * 1024 });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

export function passwordProblem(pw: string): string | null {
  if (pw.length < 10) return "Le mot de passe doit faire au moins 10 caractères.";
  if (pw.length > 200) return "Le mot de passe est trop long.";
  if (/^(.)\1+$/.test(pw)) return "Choisissez un mot de passe moins prévisible.";
  return null;
}

export async function createSession(userId: string) {
  const token = newToken();
  const h = await headers();
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await sql`insert into sessions (token_hash, user_id, expires_at, user_agent, ip)
            values (${sha256(token)}, ${userId}, ${expires}, ${(h.get("user-agent") ?? "").slice(0, 300)}, ${(h.get("x-forwarded-for") ?? "").split(",")[0].trim() || null})`;
  await sql`update users set last_login_at = now() where id = ${userId}`;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await sql`delete from sessions where token_hash = ${sha256(token)}`;
  jar.delete(SESSION_COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [u] = await sql<User[]>`
    update sessions s set last_seen = now()
      from users u
     where s.token_hash = ${sha256(token)} and s.expires_at > now() and u.id = s.user_id and u.status = 'active'
    returning u.id, u.email, u.full_name, u.role, u.status`;
  return u ?? null;
}

export async function requireUser(): Promise<User> {
  const u = await currentUser();
  if (!u) redirect("/connexion");
  return u;
}

export async function requireAdmin(): Promise<User> {
  const u = await requireUser();
  if (u.role !== "admin") redirect("/");
  return u;
}

/** 8 essais par adresse sur 15 minutes. */
export async function tooManyAttempts(email: string): Promise<boolean> {
  const key = email.toLowerCase();
  await sql`delete from login_attempts where at < now() - interval '1 day'`;
  const [{ n }] = await sql<{ n: number }[]>`select count(*)::int n from login_attempts where key = ${key} and at > now() - interval '15 minutes'`;
  return n >= 8;
}
export const recordAttempt = (email: string) => sql`insert into login_attempts (key) values (${email.toLowerCase()})`;

/** Crée un jeton à usage unique et renvoie le lien à envoyer. */
export async function issueToken(userId: string, kind: "invite" | "reset", createdBy: string | null): Promise<string> {
  const token = newToken();
  const days = kind === "invite" ? 14 : 0.042; // invitation : 14 jours ; réinitialisation : 1 heure
  await sql`update auth_tokens set used_at = now() where user_id = ${userId} and kind = ${kind} and used_at is null`;
  await sql`insert into auth_tokens (token_hash, user_id, kind, expires_at, created_by)
            values (${sha256(token)}, ${userId}, ${kind}, ${new Date(Date.now() + days * 86400_000)}, ${createdBy})`;
  const base = (process.env.APP_URL ?? "http://localhost:3100").replace(/\/$/, "");
  return `${base}/${kind === "invite" ? "invitation" : "reinitialiser"}/${token}`;
}

export async function findToken(token: string, kind: "invite" | "reset") {
  const [t] = await sql<{ user_id: string; email: string; full_name: string }[]>`
    select t.user_id, u.email, u.full_name from auth_tokens t join users u on u.id = t.user_id
     where t.token_hash = ${sha256(token)} and t.kind = ${kind} and t.used_at is null and t.expires_at > now() and u.status <> 'disabled'`;
  return t ?? null;
}
