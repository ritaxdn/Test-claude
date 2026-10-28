import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { currentUser } from "@/lib/auth";
import { lessonForUser } from "@/lib/access";

// Fournisseur « local » (développement et tests) : diffusion avec plages d'octets, réservée à
// l'utilisateur connecté qui a débloqué la leçon. En production, la vidéo passe par Mux (DRM).
export async function GET(req: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  if ((process.env.VIDEO_PROVIDER ?? "local") !== "local") return new Response("Introuvable", { status: 404 });
  const user = await currentUser();
  if (!user) return new Response("Non connecté", { status: 401 });
  const { lessonId } = await params;
  const ctx = await lessonForUser(user.id, lessonId);
  if (!ctx || !ctx.lesson.unlocked || !ctx.lesson.video_ref) return new Response("Accès refusé", { status: 403 });
  const file = path.join(process.cwd(), "private-media", "videos", path.basename(ctx.lesson.video_ref));
  const { size } = await stat(file).catch(() => ({ size: -1 }));
  if (size < 0) return new Response("Vidéo absente", { status: 404 });
  const type = file.endsWith(".webm") ? "video/webm" : file.endsWith(".mov") ? "video/quicktime" : "video/mp4";
  const headers = { "Content-Type": type, "Accept-Ranges": "bytes", "Cache-Control": "private, no-store", "Content-Disposition": "inline", "X-Content-Type-Options": "nosniff" };
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get("range") ?? "");
  if (!m) return new Response(Readable.toWeb(createReadStream(file)) as ReadableStream, { headers: { ...headers, "Content-Length": String(size) } });
  const start = m[1] ? +m[1] : Math.max(0, size - +m[2]);
  const end = m[1] && m[2] ? Math.min(+m[2], size - 1) : size - 1;
  if (start >= size || start > end) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  return new Response(Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream, {
    status: 206, headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
  });
}
