import type { ReactNode } from "react";
import { Logo } from "./Logo";

export function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <div className="auth">
      <section className="auth-side">
        <div className="orb" aria-hidden="true" />
        <Logo tag="Metamorphosis Technology · Academy" />
        <div style={{ position: "relative", maxWidth: 480 }}>
          <span className="eyebrow">academy.cellulift.ma</span>
          <h1 className="display" style={{ fontSize: "clamp(2.2rem, 3.6vw, 3.2rem)", marginTop: 16 }}>
            La technologie s'acquiert.<br /><span className="iri">La maîtrise</span> se construit.
          </h1>
          <p className="muted" style={{ marginTop: 18 }}>Les parcours de formation de vos technologies CELLULIFT : vidéos, protocoles et suivi de votre progression.</p>
        </div>
        <span className="mono">© CELLULIFT · Maroc</span>
      </section>
      <section className="auth-main">{children}</section>
    </div>
  );
}
