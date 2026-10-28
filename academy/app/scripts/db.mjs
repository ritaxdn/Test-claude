// node scripts/db.mjs schema|seed — applique db/schema.sql ou db/seed.sql sur DATABASE_URL.
import { readFile } from "node:fs/promises";
import postgres from "postgres";

const what = process.argv[2];
if (!["schema", "seed"].includes(what)) { console.error("Usage : node scripts/db.mjs schema|seed"); process.exit(1); }
if (!process.env.DATABASE_URL) { console.error("DATABASE_URL manquant."); process.exit(1); }
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, onnotice: () => {} });
try {
  await sql.unsafe(await readFile(new URL(`../db/${what}.sql`, import.meta.url), "utf8"));
  console.log(`db/${what}.sql appliqué.`);
} finally {
  await sql.end();
}
