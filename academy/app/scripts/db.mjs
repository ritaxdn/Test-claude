// node scripts/db.mjs schema|seed|migrate|rollback-002|rollback-003|rollback-004|rollback-005 — applique db/schema.sql, db/seed.sql,
// les migrations db/migrations/0*.sql (hors *_down) dans l'ordre, ou le retour arrière du lot 1.
import { readFile, readdir } from "node:fs/promises";
import postgres from "postgres";

const what = process.argv[2];
if (!["schema", "seed", "migrate", "rollback-002", "rollback-003", "rollback-004", "rollback-005"].includes(what)) { console.error("Usage : node scripts/db.mjs schema|seed|migrate|rollback-002|rollback-003|rollback-004|rollback-005"); process.exit(1); }
if (!process.env.DATABASE_URL) { console.error("DATABASE_URL manquant."); process.exit(1); }
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, onnotice: () => {} });
try {
  if (what === "migrate") {
    const dir = new URL("../db/migrations/", import.meta.url);
    for (const f of (await readdir(dir)).filter((f) => /^\d{3}_.*\.sql$/.test(f) && !f.endsWith("_down.sql")).sort()) {
      await sql.unsafe(await readFile(new URL(f, dir), "utf8"));
      console.log(`db/migrations/${f} appliqué.`);
    }
  } else {
    const file = { "rollback-002": "migrations/002_formations_down", "rollback-003": "migrations/003_verificateurs_down", "rollback-004": "migrations/004_parcours_commercial_down", "rollback-005": "migrations/005_durcissement_down" }[what] ?? what;
    await sql.unsafe(await readFile(new URL(`../db/${file}.sql`, import.meta.url), "utf8"));
    console.log(`db/${file}.sql appliqué.`);
  }
} finally {
  await sql.end();
}
