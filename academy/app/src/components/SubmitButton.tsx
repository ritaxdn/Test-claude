"use client";
import { useFormStatus } from "react-dom";

/** Bouton d'envoi qui se désactive et l'indique pendant l'enregistrement. */
export function SubmitButton({ children, pending = "Enregistrement…", className = "btn" }: { children: React.ReactNode; pending?: string; className?: string }) {
  const { pending: busy } = useFormStatus();
  return <button className={className} type="submit" disabled={busy} aria-busy={busy}>{busy ? pending : children}</button>;
}
