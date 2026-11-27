import { Fragment, type ReactNode } from "react";

/** Site officiel de la marque LGL Expert (CELLULIFT en est le distributeur). */
export const LGL_URL = "https://lglexpert.fr";

/** Lien « LGL Expert » vers le site officiel de la marque (lien suivi : il relie la marque à son site). */
export function LglLink({ className }: { className?: string }) {
  return (
    <a href={LGL_URL} target="_blank" rel="noopener" className={className ?? "underline decoration-current/30 underline-offset-4 hover:decoration-current"}>
      LGL Expert
    </a>
  );
}

/**
 * Transforme chaque « LGL Expert » d'un texte en lien vers lglexpert.fr.
 * À n'utiliser que dans du texte courant, jamais à l'intérieur d'un autre lien ou d'un bouton.
 */
export function withLgl(text: string): ReactNode {
  if (!text.includes("LGL Expert")) return text;
  const parts = text.split("LGL Expert");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <LglLink />}
    </Fragment>
  ));
}
