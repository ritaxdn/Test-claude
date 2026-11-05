import "server-only";

/** Envoie l'invitation via Resend si une clé est configurée. Renvoie true si l'e-mail est parti. */
export async function sendInvitation(to: string, name: string, link: string, machines: string[]): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;color:#1D1B26">
    <p style="letter-spacing:.2em;text-transform:uppercase;font-size:13px">LIFT by CELLULIFT Academy</p>
    <p>Bonjour ${esc(name)},</p>
    <p>Votre formation ${machines.length ? `pour <b>${machines.map(esc).join(", ")}</b> ` : ""}est prête sur LIFT by CELLULIFT Academy.</p>
    <p><a href="${esc(link)}" style="display:inline-block;background:#1D1B26;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Créer mon accès</a></p>
    <p style="font-size:13px;color:#5D5B6B">Ce lien personnel est valable 14 jours. Si vous n'attendiez pas ce message, ignorez-le.</p></div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.MAIL_FROM ?? "LIFT by CELLULIFT Academy <academy@cellulift.ma>", to, subject: "Votre formation LIFT by CELLULIFT Academy", html }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendReset(to: string, name: string, link: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM ?? "LIFT by CELLULIFT Academy <academy@cellulift.ma>", to,
        subject: "Réinitialiser votre mot de passe LIFT by CELLULIFT Academy",
        text: `Bonjour ${name},\n\nPour choisir un nouveau mot de passe, ouvrez ce lien (valable 1 heure) :\n${link}\n\nSi vous n'avez rien demandé, ignorez ce message.`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ── Parcours commercial (lot 2) ── */
const FROM = () => process.env.MAIL_FROM ?? "LIFT by CELLULIFT Academy <academy@cellulift.ma>";
const escH = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Envoi générique (texte simple). Renvoie false si l'envoi n'est pas configuré ou échoue : jamais d'exception. */
export async function sendMail(to: string, subject: string, lines: string[], cta?: { label: string; href: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return false;
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;color:#1D1B26;line-height:1.55">
    <p style="letter-spacing:.2em;text-transform:uppercase;font-size:12px;color:#5D5B6B">LIFT by CELLULIFT Academy</p>
    ${lines.map((l) => `<p>${escH(l)}</p>`).join("")}
    ${cta ? `<p><a href="${escH(cta.href)}" style="display:inline-block;background:#1D1B26;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">${escH(cta.label)}</a></p>` : ""}
  </div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM(), to, subject, html, text: [...lines, cta ? `${cta.label} : ${cta.href}` : ""].join("\n\n") }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[mail] envoi refusé (${res.status}) : ${subject}`);
    return res.ok;
  } catch (e) {
    console.error(`[mail] envoi impossible : ${subject}`, e instanceof Error ? e.message : e);
    return false;
  }
}

/** Copie interne à l'équipe Cellulift (adresse dans LIFT_NOTIFY_EMAIL). */
export const notifyTeam = (subject: string, lines: string[]) => sendMail(process.env.LIFT_NOTIFY_EMAIL ?? "", `[LIFT] ${subject}`, lines);
