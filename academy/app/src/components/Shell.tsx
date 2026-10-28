import type { ReactNode } from "react";
import type { User } from "@/lib/auth";
import { logout } from "@/app/connexion/actions";
import { Logo } from "./Logo";

const initials = (name: string) => name.replace(/^Dr\.?\s+/i, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export function Shell({ user, active, children }: { user: User; active: string; children: ReactNode }) {
  const links = user.role === "admin"
    ? [["/admin", "Médecins"], ["/admin/parcours", "Parcours"], ["/admin/presentateurs", "Présentateurs"], ["/admin/machines", "Machines"]]
    : [["/tableau-de-bord", "Ma formation"]];
  return (
    <>
      <header className="top">
        <div className="top-in">
          <Logo tag={user.role === "admin" ? "Academy · Admin" : "Academy"} href={user.role === "admin" ? "/admin" : "/tableau-de-bord"} />
          <nav className="nav" aria-label="Navigation principale">
            {links.map(([href, label]) => (
              <a key={href} href={href} aria-current={active === href ? "page" : undefined}>{label}</a>
            ))}
          </nav>
          <div className="who">
            <span className="small muted" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.full_name}</span>
            <span className="avatar" aria-hidden="true">{initials(user.full_name)}</span>
            <form action={logout}><button className="btn sm ghost" type="submit">Se déconnecter</button></form>
          </div>
        </div>
      </header>
      <main className="page" id="contenu">{children}</main>
    </>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="row" style={{ gap: 10 }}>
      <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "Progression"}><i style={{ width: `${value}%` }} /></div>
      <span className="pct">{value} %</span>
    </div>
  );
}

export const pct = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0);

export function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
