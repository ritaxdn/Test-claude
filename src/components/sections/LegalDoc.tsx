/** Mise en page sobre d'un document légal (titre, date, sections). */
export function LegalDoc({ doc }: { doc: { title: string; updated: string; intro: string; sections: { h: string; p: string[] }[] } }) {
  return (
    <article className="px-3 pb-20 pt-12 md:px-5 md:pt-16">
      <div className="mx-auto max-w-3xl px-3 md:px-7">
        <p className="data-label text-deep-soft">{doc.updated}</p>
        <h1 className="display mt-4 text-[clamp(1.8rem,3.4vw,3rem)] text-deep">{doc.title}</h1>
        <p className="mt-6 font-sans leading-relaxed text-deep">{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.h} className="mt-10 border-t border-deep/15 pt-6">
            <h2 className="font-sans text-lg font-semibold text-deep">{s.h}</h2>
            {s.p.map((t) => (
              <p key={t} className="mt-3 font-sans text-sm leading-relaxed text-deep-soft">{t}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
