import Anthropic from "@anthropic-ai/sdk";
import { analyzeCompany } from "@/lib/analyze";
import type { StreamEvent } from "@/lib/schema";

export const runtime = "nodejs";
// La recherche web + la structuration prennent en général 1 à 4 minutes.
export const maxDuration = 300;

function errorMessage(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) return "Clé API Anthropic invalide ou absente (ANTHROPIC_API_KEY).";
  if (error instanceof Anthropic.RateLimitError) return "Limite de requêtes atteinte, réessayez dans une minute.";
  if (error instanceof Anthropic.APIError) return `Erreur de l'API (${error.status ?? "réseau"}) : ${error.message}`;
  if (error instanceof Error) return error.message;
  return "Erreur inconnue.";
}

export async function POST(request: Request) {
  let query = "";
  try {
    const body = (await request.json()) as { query?: unknown };
    query = typeof body.query === "string" ? body.query.trim() : "";
  } catch {
    // corps invalide : traité ci-dessous
  }
  if (!query || query.length > 200) {
    return Response.json({ error: "Indiquez un nom d'entreprise ou un site web (200 caractères maximum)." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return Response.json(
      { error: "Le serveur n'a pas de clé API Anthropic : définissez ANTHROPIC_API_KEY dans .env.local." },
      { status: 500 },
    );
  }

  const encoder = new TextEncoder();
  const abort = new AbortController();
  request.signal.addEventListener("abort", () => abort.abort());

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: StreamEvent) => {
        if (!abort.signal.aborted) controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };
      try {
        await analyzeCompany(query, emit, abort.signal);
      } catch (error) {
        if (!abort.signal.aborted) {
          console.error("[business-xray]", error);
          emit({ type: "error", message: errorMessage(error) });
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
