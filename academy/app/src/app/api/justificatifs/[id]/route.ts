import { currentUser } from "@/lib/auth";
import { sql, audit } from "@/lib/db";
import { getDocument } from "@/lib/storage";

// Justificatif professionnel : vérificateurs habilités uniquement, chaque consultation tracée.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return new Response("Non connecté", { status: 401 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Introuvable", { status: 404 });
  const [me] = await sql<{ ok: boolean }[]>`select (role = 'admin' and status = 'active' and can_verify_qualifications) as ok from users where id = ${user.id}`;
  if (!me?.ok) return new Response("Accès refusé", { status: 403 });
  const [d] = await sql<{ storage_key: string; mime_type: string; purged_at: Date | null; request_id: string }[]>`select storage_key, mime_type, purged_at, request_id from qualification_documents where id = ${id}`;
  if (!d) return new Response("Introuvable", { status: 404 });
  if (d.purged_at) return new Response("Justificatif supprimé (conservation limitée)", { status: 410 });
  await audit(user.id, "justificatif.view", id, { request_id: d.request_id });
  const file = await getDocument(d.storage_key, "proofs").catch(() => null);
  if (!file) return new Response("Fichier absent", { status: 404 });
  if ("url" in file) return Response.redirect(file.url, 302);
  return new Response(new Uint8Array(file.data), {
    headers: { "Content-Type": d.mime_type, "Content-Disposition": "inline", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox" },
  });
}
