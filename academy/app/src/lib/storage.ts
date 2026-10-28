import "server-only";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const LOCAL_ROOT = path.join(process.cwd(), "private-media", "docs");
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

export async function putDocument(key: string, data: Buffer, mime: string) {
  key = safeKey(key);
  if (provider() === "supabase") {
    const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/${process.env.SUPABASE_BUCKET}/${key}`, {
      method: "POST",
      headers: { ...supabaseHeaders(), "Content-Type": mime, "x-upsert": "true" },
      body: new Uint8Array(data),
    });
    if (!res.ok) throw new Error(`stockage : ${res.status} ${await res.text()}`);
    return;
  }
  const file = path.join(LOCAL_ROOT, key);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
}

/** Local : renvoie le contenu. Supabase : renvoie une URL signée valable 5 minutes. */
export async function getDocument(key: string): Promise<{ data: Buffer } | { url: string }> {
  key = safeKey(key);
  if (provider() === "supabase") {
    const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/sign/${process.env.SUPABASE_BUCKET}/${key}`, {
      method: "POST",
      headers: { ...supabaseHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 300 }),
    });
    if (!res.ok) throw new Error(`stockage : ${res.status}`);
    const { signedURL } = (await res.json()) as { signedURL: string };
    return { url: `${process.env.SUPABASE_URL}/storage/v1${signedURL}` };
  }
  return { data: await readFile(path.join(LOCAL_ROOT, key)) };
}
