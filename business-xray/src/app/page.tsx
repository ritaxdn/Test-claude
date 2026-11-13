"use client";

import { useRef, useState } from "react";
import { ReportView } from "@/components/ReportView";
import type { Report, Source, StreamEvent } from "@/lib/schema";

type Step = { kind: "search" | "fetch"; label: string };

type State =
  | { phase: "idle" }
  | { phase: "running"; status: string; steps: Step[]; notes: string }
  | { phase: "done"; report: Report; sources: Source[] }
  | { phase: "error"; message: string };

const EXAMPLES = ["Doctolib", "alan.com", "Back Market", "notion.so"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<State>({ phase: "idle" });
  const [showNotes, setShowNotes] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function run(input: string) {
    const value = input.trim();
    if (!value) return;
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    setQuery(value);
    setState({ phase: "running", status: "Démarrage…", steps: [], notes: "" });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
        signal: abort.signal,
      });
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `Erreur ${res.status}`);
      }

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      let finished = false;
      for (;;) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as StreamEvent;
          if (event.type === "report") {
            finished = true;
            setState({ phase: "done", report: event.report, sources: event.sources });
          } else if (event.type === "error") {
            finished = true;
            setState({ phase: "error", message: event.message });
          } else {
            setState((prev) => {
              if (prev.phase !== "running") return prev;
              switch (event.type) {
                case "status":
                  return { ...prev, status: event.message };
                case "search":
                  return { ...prev, steps: [...prev.steps, { kind: "search", label: event.query }] };
                case "fetch":
                  return { ...prev, steps: [...prev.steps, { kind: "fetch", label: event.url }] };
                case "notes":
                  return { ...prev, notes: prev.notes + event.text };
              }
            });
          }
        }
      }
      if (!finished) setState({ phase: "error", message: "La connexion s'est interrompue avant la fin de l'analyse." });
    } catch (error) {
      if (abort.signal.aborted) return;
      setState({ phase: "error", message: error instanceof Error ? error.message : "Erreur inconnue." });
    }
  }

  function cancel() {
    abortRef.current?.abort();
    setState({ phase: "idle" });
  }

  const running = state.phase === "running";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
      <div className="no-print">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ray">Business X-Ray</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Radiographiez n&apos;importe quelle entreprise</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Business model, proposition de valeur, concurrents et opportunités — chaque affirmation sourcée, chaque
            hypothèse signalée.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(query);
          }}
          className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom ou site web (ex. doctolib.fr)"
            maxLength={200}
            disabled={running}
            className="min-w-0 flex-1 rounded-xl border border-line bg-panel px-4 py-3 text-white placeholder:text-muted focus:border-ray focus:outline-none disabled:opacity-60"
          />
          {running ? (
            <button type="button" onClick={cancel} className="rounded-xl border border-line px-5 py-3 font-semibold text-muted hover:text-white">
              Annuler
            </button>
          ) : (
            <button type="submit" disabled={!query.trim()} className="rounded-xl bg-ray px-5 py-3 font-semibold text-ink hover:brightness-110 disabled:opacity-40">
              Analyser
            </button>
          )}
        </form>

        {state.phase === "idle" && (
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            <span className="text-muted">Essayer :</span>
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => run(ex)} className="rounded-full border border-line px-3 py-0.5 text-slate-300 hover:border-ray hover:text-ray">
                {ex}
              </button>
            ))}
          </div>
        )}
      </div>

      {state.phase === "running" && (
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-line bg-panel p-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ray opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-ray" />
            </span>
            <p className="font-medium text-white">{state.status}</p>
          </div>
          <p className="mt-1 text-xs text-muted">Une analyse complète prend en général 1 à 4 minutes.</p>
          {state.steps.length > 0 && (
            <ul className="mt-4 max-h-64 space-y-1 overflow-y-auto text-sm">
              {state.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-slate-300">
                  <span className="w-14 shrink-0 text-xs uppercase tracking-wide text-muted">{step.kind === "search" ? "Cherche" : "Lit"}</span>
                  <span className="min-w-0 truncate">{step.label}</span>
                </li>
              ))}
            </ul>
          )}
          {state.notes && (
            <div className="mt-4">
              <button onClick={() => setShowNotes((v) => !v)} className="text-xs text-ray hover:underline">
                {showNotes ? "Masquer" : "Afficher"} les notes de recherche
              </button>
              {showNotes && (
                <pre className="mt-2 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-lg bg-ink p-3 font-sans text-xs text-slate-300">{state.notes}</pre>
              )}
            </div>
          )}
        </div>
      )}

      {state.phase === "error" && (
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-rose-400/30 bg-rose-500/10 p-5 text-rose-200">
          <p className="font-medium">L&apos;analyse a échoué</p>
          <p className="mt-1 text-sm">{state.message}</p>
          <button onClick={() => run(query)} className="mt-3 text-sm font-semibold text-white hover:underline">
            Réessayer
          </button>
        </div>
      )}

      {state.phase === "done" && (
        <div className="mt-12">
          <div className="no-print mb-4 flex justify-end">
            <button onClick={() => window.print()} className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:text-white">
              Imprimer / PDF
            </button>
          </div>
          <ReportView report={state.report} sources={state.sources} />
          <p className="mt-12 text-center text-xs text-muted">
            Analyse générée par IA à partir de sources publiques. Vérifiez les points marqués « Hypothèse » avant toute décision.
          </p>
        </div>
      )}
    </main>
  );
}
