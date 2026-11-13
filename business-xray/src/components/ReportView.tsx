"use client";

import type { Claim, Report, Source } from "@/lib/schema";

const KIND_STYLE: Record<Claim["kind"], { label: string; className: string }> = {
  fait: { label: "Fait", className: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30" },
  estimation: { label: "Estimation", className: "bg-sky-500/15 text-sky-300 ring-sky-400/30" },
  hypothese: { label: "Hypothèse", className: "bg-amber-500/15 text-amber-300 ring-amber-400/30" },
};

const LEVEL_STYLE: Record<string, string> = {
  fort: "text-ray",
  haute: "text-ray",
  moyen: "text-sky-300",
  moyenne: "text-sky-300",
  faible: "text-muted",
};

function Badge({ kind }: { kind: Claim["kind"] }) {
  const style = KIND_STYLE[kind];
  return (
    <span className={`inline-flex shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${style.className}`}>
      {style.label}
    </span>
  );
}

function Cites({ ids, sources }: { ids: number[]; sources: Map<number, Source> }) {
  const known = [...new Set(ids)].filter((id) => sources.has(id));
  if (!known.length) return null;
  return (
    <span className="ml-1 inline-flex flex-wrap gap-0.5 align-baseline">
      {known.map((id) => (
        <a
          key={id}
          href={`#source-${id}`}
          title={sources.get(id)!.title || sources.get(id)!.url}
          className="rounded bg-line px-1 text-[10px] font-medium text-ray hover:bg-ray-dim"
        >
          {id}
        </a>
      ))}
    </span>
  );
}

function ClaimList({ claims, sources, empty = "Non documenté." }: { claims: Claim[]; sources: Map<number, Source>; empty?: string }) {
  if (!claims.length) return <p className="text-sm text-muted italic">{empty}</p>;
  return (
    <ul className="space-y-2">
      {claims.map((claim, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
          <Badge kind={claim.kind} />
          <span>
            {claim.text}
            <Cites ids={claim.sources} sources={sources} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 break-inside-avoid-page">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ray">{title}</h2>
      {children}
    </section>
  );
}

function Card({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`print-plain rounded-xl border border-line bg-panel p-4 ${className}`}>
      {title && <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>}
      {children}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="text-sm">{value || "Inconnu"}</dd>
    </div>
  );
}

function href(website: string) {
  if (!website) return undefined;
  return /^https?:\/\//.test(website) ? website : `https://${website}`;
}

function hostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

const IMPACT_RANK = { fort: 0, moyen: 1, faible: 2 } as const;

export function ReportView({ report, sources }: { report: Report; sources: Source[] }) {
  const byId = new Map(sources.map((s) => [s.id, s]));
  const { company, businessModel: bm, valueProposition: vp, swot } = report;
  const opportunities = [...report.opportunities].sort(
    (a, b) => IMPACT_RANK[a.impact] - IMPACT_RANK[b.impact] || IMPACT_RANK[a.effort] - IMPACT_RANK[b.effort],
  );

  return (
    <article className="space-y-12">
      <header className="print-plain rounded-2xl border border-line bg-panel p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold text-white">{company.name}</h1>
          {company.website && (
            <a href={href(company.website)} target="_blank" rel="noreferrer" className="text-sm text-ray hover:underline">
              {company.website}
            </a>
          )}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Meta label="Secteur" value={company.sector} />
          <Meta label="Siège" value={company.headquarters} />
          <Meta label="Création" value={company.founded} />
          <Meta label="Taille" value={company.size} />
        </dl>
        <p className="mt-5 leading-relaxed text-slate-200">{report.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span>Légende :</span>
          <Badge kind="fait" /> <span>affirmé par une source</span>
          <Badge kind="estimation" /> <span>déduit des sources</span>
          <Badge kind="hypothese" /> <span>à vérifier</span>
        </div>
      </header>

      <Section id="business-model" title="Business model">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card title="Segments de clients"><ClaimList claims={bm.customerSegments} sources={byId} /></Card>
          <Card title="Sources de revenus"><ClaimList claims={bm.revenueStreams} sources={byId} /></Card>
          <Card title="Tarification"><ClaimList claims={bm.pricing} sources={byId} /></Card>
          <Card title="Canaux"><ClaimList claims={bm.channels} sources={byId} /></Card>
          <Card title="Structure de coûts"><ClaimList claims={bm.costStructure} sources={byId} /></Card>
          <Card title="Ressources clés"><ClaimList claims={bm.keyResources} sources={byId} /></Card>
          <Card title="Partenaires clés" className="md:col-span-2 lg:col-span-3"><ClaimList claims={bm.keyPartners} sources={byId} /></Card>
        </div>
      </Section>

      <Section id="value-proposition" title="Proposition de valeur">
        <blockquote className="mb-4 border-l-2 border-ray pl-4 text-lg text-white">{vp.statement}</blockquote>
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Problèmes résolus"><ClaimList claims={vp.painsRelieved} sources={byId} /></Card>
          <Card title="Bénéfices apportés"><ClaimList claims={vp.gainsCreated} sources={byId} /></Card>
          <Card title="Différenciation"><ClaimList claims={vp.differentiators} sources={byId} /></Card>
        </div>
      </Section>

      <Section id="competitors" title="Concurrents">
        {report.competitors.length === 0 ? (
          <p className="text-sm text-muted italic">Aucun concurrent identifié.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {report.competitors.map((c, i) => (
              <Card key={i}>
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-white">
                    {c.name}
                    <Cites ids={c.sources} sources={byId} />
                  </h3>
                  <span className="rounded bg-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">{c.type}</span>
                </div>
                {c.website && (
                  <a href={href(c.website)} target="_blank" rel="noreferrer" className="text-xs text-ray hover:underline">
                    {c.website}
                  </a>
                )}
                <p className="mt-2 text-sm text-slate-200">{c.positioning}</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-rose-300">Son avantage</dt>
                    <dd>{c.edgeOverCompany}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-emerald-300">Notre avantage</dt>
                    <dd>{c.weaknessVsCompany}</dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section id="swot" title="SWOT">
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Forces"><ClaimList claims={swot.strengths} sources={byId} /></Card>
          <Card title="Faiblesses"><ClaimList claims={swot.weaknesses} sources={byId} /></Card>
          <Card title="Opportunités"><ClaimList claims={swot.opportunities} sources={byId} /></Card>
          <Card title="Menaces"><ClaimList claims={swot.threats} sources={byId} /></Card>
        </div>
      </Section>

      <Section id="opportunities" title="Opportunités à saisir">
        <div className="space-y-4">
          {opportunities.map((o, i) => (
            <Card key={i}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-white">
                  {o.title}
                  <Cites ids={o.sources} sources={byId} />
                </h3>
                <div className="flex gap-3 text-xs">
                  <span>Impact <b className={LEVEL_STYLE[o.impact]}>{o.impact}</b></span>
                  <span>Effort <b className={LEVEL_STYLE[o.effort]}>{o.effort}</b></span>
                  <span className="text-muted">{o.horizon}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-200">{o.description}</p>
              <p className="mt-2 text-sm text-muted"><span className="font-medium text-slate-300">Pourquoi : </span>{o.rationale}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="hypotheses" title="Hypothèses à vérifier">
        <div className="space-y-3">
          {report.hypotheses.map((h, i) => (
            <Card key={i} className="border-amber-400/20">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-white">
                  {h.statement}
                  <Cites ids={h.sources} sources={byId} />
                </p>
                <span className={`shrink-0 text-xs ${LEVEL_STYLE[h.confidence]}`}>confiance {h.confidence}</span>
              </div>
              <p className="mt-2 text-sm text-muted"><span className="text-slate-300">Indices : </span>{h.rationale}</p>
              <p className="mt-1 text-sm text-muted"><span className="text-slate-300">Pour vérifier : </span>{h.howToVerify}</p>
            </Card>
          ))}
        </div>
        {report.openQuestions.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-white">Questions ouvertes</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
              {report.openQuestions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        )}
      </Section>

      <Section id="sources" title={`Sources (${sources.length})`}>
        <ol className="space-y-1.5 text-sm">
          {sources.map((s) => (
            <li key={s.id} id={`source-${s.id}`} className="flex gap-2 target:rounded target:bg-ray-dim/40">
              <span className="w-6 shrink-0 text-right text-muted">{s.id}.</span>
              <a href={s.url} target="_blank" rel="noreferrer" className="min-w-0 break-words hover:text-ray">
                {s.title || s.url}
                <span className="ml-2 text-xs text-muted">{hostname(s.url)}</span>
              </a>
            </li>
          ))}
        </ol>
      </Section>
    </article>
  );
}
