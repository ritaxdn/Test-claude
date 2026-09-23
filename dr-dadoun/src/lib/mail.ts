// Envoi d'e-mails au cabinet via Resend (mêmes variables que les rendez-vous).
//   RESEND_API_KEY, BOOKING_EMAIL_TO, BOOKING_EMAIL_FROM
// Sans configuration, le contenu est seulement journalisé côté serveur.

export const clean = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendToPractice(opts: {
  subject: string;
  heading: string;
  rows: [string, string][];
  replyTo: string;
  footer?: string;
}): Promise<boolean> {
  const { RESEND_API_KEY, BOOKING_EMAIL_TO, BOOKING_EMAIL_FROM } = process.env;
  if (!RESEND_API_KEY || !BOOKING_EMAIL_TO || !BOOKING_EMAIL_FROM) {
    console.log(`[mail] ${opts.subject} (e-mail non configuré) :`, Object.fromEntries(opts.rows));
    return true;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: BOOKING_EMAIL_FROM,
      to: BOOKING_EMAIL_TO,
      reply_to: opts.replyTo,
      subject: opts.subject,
      html: `<h2>${escape(opts.heading)}</h2><table>${opts.rows
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5d747c">${escape(k)}</td><td>${escape(v)}</td></tr>`)
        .join("")}</table>${opts.footer ? `<p>${escape(opts.footer)}</p>` : ""}`,
    }),
  });
  if (!res.ok) console.error("[mail] Échec d'envoi Resend :", res.status, await res.text());
  return res.ok;
}
