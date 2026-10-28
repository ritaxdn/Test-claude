import { currentUser } from "@/lib/auth";
import { canAccessProgram } from "@/lib/access";
import { sql } from "@/lib/db";
import { getDocument } from "@/lib/storage";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return new Response("Non connecté", { status: 401 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Introuvable", { status: 404 });
  const [d] = await sql<{ program_id: string; title: string; storage_key: string; mime_type: string }[]>`select program_id, title, storage_key, mime_type from documents where id = ${id}`;
  if (!d) return new Response("Introuvable", { status: 404 });
  if (user.role !== "admin" && !(await canAccessProgram(user.id, d.program_id))) return new Response("Accès refusé", { status: 403 });
  const file = await getDocument(d.storage_key).catch(() => null);
  if (!file) return new Response("Document absent", { status: 404 });
  if ("url" in file) return Response.redirect(file.url, 302);
  const name = d.title.replace(/[^\p{L}\p{N} ._-]/gu, "").slice(0, 80) || "document";
  return new Response(new Uint8Array(file.data), {
    headers: { "Content-Type": d.mime_type, "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(name)}`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" },
  });
}
