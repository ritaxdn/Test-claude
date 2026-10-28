// node scripts/create-admin.mjs email "Nom complet" — crée un administrateur et affiche son lien d'invitation.
import { createHash, randomBytes } from "node:crypto";
import postgres from "postgres";

const [email, ...nameParts] = process.argv.slice(2);
const name = nameParts.join(" ");
if (!email || !name) { console.error('Usage : node scripts/create-admin.mjs prenom@cellulift.ma "Prénom Nom"'); process.exit(1); }
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, onnotice: () => {} });
try {
  const [u] = await sql`insert into users (email, full_name, role) values (${email.toLowerCase()}, ${name}, 'admin')
                        on conflict (email) do update set role = 'admin' returning id`;
  const token = randomBytes(32).toString("base64url");
  await sql`insert into auth_tokens (token_hash, user_id, kind, expires_at) values (${createHash("sha256").update(token).digest("hex")}, ${u.id}, 'invite', now() + interval '14 days')`;
  console.log(`Administrateur prêt. Lien pour créer le mot de passe (14 jours) :\n${(process.env.APP_URL ?? "http://localhost:3100").replace(/\/$/, "")}/invitation/${token}`);
} finally {
  await sql.end();
}
