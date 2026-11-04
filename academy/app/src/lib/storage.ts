import "server-only";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";

// Deux espaces privés distincts : supports de cours et justificatifs professionnels.
export type Space = "docs" | "proofs";
const LOCAL_ROOT = (space: Space) => path.join(process.cwd(), "private-media", space === "docs" ? "docs" : "justificatifs");
const bucket = (space: Space) => (space === "docs" ? process.env.SUPABASE_BUCKET : process.env.SUPABASE_PROOF_BUCKET ?? "lift-justificatifs");
const provider = () => process.env.STORAGE_PROVIDER ?? "local";
// Clé serveur Supabase : nouvelle clé « secret » (sb_secret_…) ou ancienne clé service_role.
// Envoyée dans les deux en-têtes, acceptés par Supabase pour l'un et l'autre format.
const supabaseHeaders = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return { apikey: key, Authorization: `Bearer ${key}` };
};
const safeKey = (key: string) => {
  const clean = key.replace(/\\/g, "/").split("/").filter((p) => p && p !== "." && p !== "..").join("/");
  if (!clean) throw new Error("clé de stockage invalide");
  return clean;
};

export async function putDocument(key: string, data: Buffer, mime: string, space: Space = "docs") {
  key = safeKey(key);
  if (provider() === "supabase") {
    const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/${bucket(space)}/${key}`, {
      method: "POST",
      headers: { ...supabaseHeaders(), "Content-Type": mime, "x-upsert": "true" },
      body: new Uint8Array(data),
    });
    if (!res.ok) throw new Error(`stockage : ${res.status} ${await res.text()}`);
    return;
  }
  const file = path.join(LOCAL_ROOT(space), key);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
}

/** Local : renvoie le contenu. Supabase : URL signée (5 min pour les supports, 60 s pour les justificatifs). */
export async function getDocument(key: string, space: Space = "docs"): Promise<{ data: Buffer } | { url: string }> {
  key = safeKey(key);
  if (provider() === "supabase") {
    const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/sign/${bucket(space)}/${key}`, {
      method: "POST",
      headers: { ...supabaseHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: space === "docs" ? 300 : 60 }),
    });
    if (!res.ok) throw new Error(`stockage : ${res.status}`);
    const { signedURL } = (await res.json()) as { signedURL: string };
    return { url: `${process.env.SUPABASE_URL}/storage/v1${signedURL}` };
  }
  return { data: await readFile(path.join(LOCAL_ROOT(space), key)) };
}

/** Suppression définitive d'un fichier (justificatifs : conservation limitée). */
export async function deleteDocument(key: string, space: Space = "docs") {
  key = safeKey(key);
  if (provider() === "supabase") {
    const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/${bucket(space)}`, {
      method: "DELETE", headers: { ...supabaseHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ prefixes: [key] }),
    });
    if (!res.ok) throw new Error(`stockage : ${res.status}`);
    return;
  }
  await rm(path.join(LOCAL_ROOT(space), key), { force: true });
}
