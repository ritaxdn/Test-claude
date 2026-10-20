export default function Introuvable() {
  return (
    <main className="page" style={{ maxWidth: 560 }}>
      <div className="glass card stack">
        <span className="eyebrow">Page introuvable</span>
        <h1 className="display h2">Cette page n'existe pas ou ne vous est pas accessible</h1>
        <p className="muted">Les parcours sont ouverts selon les machines liées à votre compte.</p>
        <a className="btn solid" href="/">Retour à l'accueil</a>
      </div>
    </main>
  );
}
