import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { lessonForUser } from "@/lib/access";
import { recordBeat } from "@/lib/progress";

export async function POST(req: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "non_connecte" }, { status: 401 });
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return NextResponse.json({ error: "origine" }, { status: 403 });
  const { lessonId } = await params;
  const ctx = await lessonForUser(user.id, lessonId);
  if (!ctx || !ctx.lesson.unlocked) return NextResponse.json({ error: "acces" }, { status: 403 });
  const body = (await req.json().catch(() => ({}))) as { position?: number };
  const duration = ctx.lesson.duration_sec ?? 0;
  if (!duration) return NextResponse.json({ error: "duree_inconnue" }, { status: 409 });
  const r = await recordBeat(user.id, lessonId, duration, Number(body.position));
  return NextResponse.json(r);
}
