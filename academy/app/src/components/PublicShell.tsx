import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { currentUser } from "@/lib/auth";

/** Pages publiques (catalogue, fiche, inscription) : aucune donnée de compte. */
export async function PublicShell({ children }: { children: ReactNode }) {
  const user = await currentUser();
  return (
    <>
      <header className="top">
        <div className="top-in">
          <Logo tag="LIFT by Cellulift Academy" href="/formations" />
          <nav className="nav" aria-label="Navigation principale"><a href="/formations">Formations</a></nav>
          <div className="who">{user ? <a className="btn sm" href={user.role === "admin" ? "/admin" : "/tableau-de-bord"}>Mon espace</a> : <a className="btn sm" href="/connexion">Se connecter</a>}</div>
        </div>
      </header>
      <main className="page" id="contenu">{children}</main>
      <footer className="page small muted" style={{ paddingTop: 0 }}>
        <hr className="signal" style={{ marginBottom: 16 }} />
        <p>LIFT by CELLULIFT Academy · formations en ligne pour les professionnels de la médecine esthétique. Une formation en ligne n&apos;habilite pas à pratiquer un acte : les formations pratiques supervisées restent nécessaires selon votre qualification et la réglementation applicable.</p>
      </footer>
    </>
  );
}
