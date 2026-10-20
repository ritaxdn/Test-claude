import "server-only";

/** Envoie l'invitation via Resend si une clé est configurée. Renvoie true si l'e-mail est parti. */
export async function sendInvitation(to: string, name: string, link: string, machines: string[]): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;color:#1D1B26">
    <p style="letter-spacing:.2em;text-transform:uppercase;font-size:13px">CELLULIFT Academy</p>
    <p>Bonjour ${esc(name)},</p>
    <p>Votre formation ${machines.length ? `pour <b>${machines.map(esc).join(", ")}</b> ` : ""}est prête sur CELLULIFT Academy.</p>
    <p><a href="${esc(link)}" style="display:inline-block;background:#1D1B26;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Créer mon accès</a></p>
    <p style="font-size:13px;color:#5D5B6B">Ce lien personnel est valable 14 jours. Si vous n'attendiez pas ce message, ignorez-le.</p></div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.MAIL_FROM ?? "CELLULIFT Academy <academy@cellulift.ma>", to, subject: "Votre formation CELLULIFT Academy", html }),
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
        from: process.env.MAIL_FROM ?? "CELLULIFT Academy <academy@cellulift.ma>", to,
        subject: "Réinitialiser votre mot de passe CELLULIFT Academy",
        text: `Bonjour ${name},\n\nPour choisir un nouveau mot de passe, ouvrez ce lien (valable 1 heure) :\n${link}\n\nSi vous n'avez rien demandé, ignorez ce message.`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
