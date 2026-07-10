import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="text-xs font-medium tracking-[0.16em] text-bronze-dark">ERREUR 404</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Cette page n&apos;existe pas.</h1>
      <p className="mt-4 max-w-md text-base text-graphite">
        La page que vous cherchez a peut-être été déplacée. Retrouvez notre catalogue ou contactez-nous
        directement.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-sm bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper transition-transform duration-fast hover:scale-[1.02]"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/catalogue"
          className="rounded-sm border border-border px-6 py-3 text-sm font-medium text-ink-soft transition-colors duration-fast hover:bg-paper-alt"
        >
          Voir le catalogue
        </Link>
      </div>
    </section>
  );
}
