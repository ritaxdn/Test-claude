"use server";
import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { notifyTeam } from "@/lib/mail";
import { professionLabel } from "@/lib/professions";

/** Confirme l'adresse e-mail d'une demande (bouton : un simple clic d'un antivirus de messagerie ne suffit pas). */
export async function confirmRequest(form: FormData) {
  const token = String(form.get("token") ?? "");
  if (!/^[\w-]{40,60}$/.test(token)) redirect("/formations/confirmer/invalide");
  const [r] = await sql<{ id: string; full_name: string; email: string; profession: string; country: string; title: string }[]>`
    update enrollment_requests r set email_confirmed_at = now(), confirm_token_hash = null
      from programs p
     where p.id = r.program_id and r.confirm_token_hash = ${createHash("sha256").update(token).digest("hex")}
       and r.confirm_expires_at > now() and r.status = 'new' and r.email_confirmed_at is null
    returning r.id, r.full_name, r.email, r.profession, r.country, p.title`;
  if (!r) redirect("/formations/confirmer/invalide");
  await notifyTeam(`Nouvelle demande : ${r.title}`, [`${r.full_name} (${professionLabel(r.profession)}, ${r.country}) — ${r.email}`, `Demande ${r.id}, adresse confirmée.`]);
  redirect("/formations/confirmer/ok");
}
