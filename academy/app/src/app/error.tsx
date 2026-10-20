"use client";

export default function Erreur({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="page" style={{ maxWidth: 560 }}>
      <div className="glass card stack">
        <span className="eyebrow">Erreur</span>
        <h1 className="display h2">Un problème est survenu</h1>
        <p className="muted">La page n'a pas pu s'afficher. Réessayez ; si le problème continue, contactez CELLULIFT. Votre progression est enregistrée.</p>
        <div className="row wrap"><button className="btn solid" onClick={() => reset()}>Réessayer</button><a className="btn" href="/">Retour à l'accueil</a></div>
      </div>
    </main>
  );
}
