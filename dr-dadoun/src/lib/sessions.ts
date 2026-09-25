import { formationsPage, type Session } from "@/content/formations";

/**
 * Prochaines sessions et événements de formation.
 *
 * Source : un Google Sheet publié au format CSV (Fichier → Partager → Publier sur le web → CSV),
 * dont le lien est dans FORMATIONS_SHEET_CSV ou `formationsPage.sessions.sheetCsv`.
 * Colonnes attendues (première ligne, l'ordre n'importe pas) :
 *   debut | dates | formation | titre | lieu | modalites | statut
 * Le site relit la feuille toutes les 5 minutes. Sans feuille, la liste de formations.ts est utilisée.
 */
export const SESSIONS_REVALIDATE = 300;

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Petit lecteur CSV (gère les guillemets et les retours à la ligne dans une cellule). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((x) => x.trim()));
}

function fromCsv(text: string): Session[] {
  const [header, ...lines] = parseCsv(text);
  if (!header) return [];
  const col = (name: string) => header.findIndex((h) => norm(h) === name);
  const idx = {
    start: col("debut"),
    date: col("dates"),
    course: col("formation"),
    title: col("titre"),
    place: col("lieu"),
    format: col("modalites"),
    status: col("statut"),
    link: col("lien"),
  };
  const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");
  // La colonne « formation » accepte le nom affiché (« Lasers médicaux ») ou l'adresse (« lasers-medicaux »).
  const courseSlug = (v: string) =>
    formationsPage.courses.find((c) => norm(c.slug) === norm(v) || norm(c.title) === norm(v))?.slug;

  return lines
    .map((r) => {
      const course = courseSlug(get(r, idx.course));
      const title = get(r, idx.title) || undefined;
      const start = get(r, idx.start);
      return {
        course,
        title,
        start: /^\d{4}-\d{2}-\d{2}$/.test(start) ? start : undefined,
        date: get(r, idx.date) || start,
        place: get(r, idx.place),
        format: get(r, idx.format),
        status: norm(get(r, idx.status)).startsWith("complet") ? "full" : "open",
        link: /^https?:\/\//.test(get(r, idx.link)) ? get(r, idx.link) : undefined,
      } satisfies Session;
    })
    .filter((s) => (s.course || s.title) && s.date);
}

type ScriptEvent = {
  id: string;
  debut: string;
  dates: string;
  formation: string;
  titre: string;
  lieu: string;
  modalites: string;
  places: number | null;
  inscrits: number;
  complet: boolean;
  lien?: string;
};

/** Inscriptions en ligne : actives quand le script Google (docs/inscriptions-apps-script.js) est déployé. */
export const registrationEnabled = () => !!(process.env.FORMATIONS_SCRIPT_URL && process.env.FORMATIONS_SCRIPT_KEY);

async function fromScript(): Promise<Session[] | null> {
  const { FORMATIONS_SCRIPT_URL: url, FORMATIONS_SCRIPT_KEY: key } = process.env;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}?key=${encodeURIComponent(key)}`, { next: { revalidate: 60 } });
    const data = (await res.json()) as { events?: ScriptEvent[] };
    if (!data.events) return null;
    const courseSlug = (v: string) =>
      formationsPage.courses.find((c) => norm(c.slug) === norm(v) || norm(c.title) === norm(v))?.slug;
    return data.events.map((e) => ({
      id: e.id,
      course: courseSlug(e.formation),
      title: e.titre || undefined,
      start: /^\d{4}-\d{2}-\d{2}$/.test(e.debut) ? e.debut : undefined,
      date: e.dates || e.debut,
      place: e.lieu,
      format: e.modalites,
      capacity: e.places ?? undefined,
      registered: e.inscrits,
      status: e.complet ? "full" : "open",
      link: e.lien && /^https?:\/\//.test(e.lien) ? e.lien : undefined,
    }));
  } catch (e) {
    console.error("[formations] Script Google inaccessible :", e);
    return null;
  }
}

/** Sessions à venir, triées par date de début. */
export async function getSessions(): Promise<Session[]> {
  const url = process.env.FORMATIONS_SHEET_CSV || formationsPage.sessions.sheetCsv;
  let list = formationsPage.sessions.list;
  const scripted = await fromScript();
  if (scripted) list = scripted;
  else if (url) {
    try {
      const res = await fetch(url, { next: { revalidate: SESSIONS_REVALIDATE } });
      if (res.ok) list = fromCsv(await res.text());
      else console.error("[formations] Google Sheet illisible :", res.status);
    } catch (e) {
      console.error("[formations] Google Sheet inaccessible :", e);
    }
  }
  const today = new Date().toISOString().slice(0, 10);
  return list
    .filter((s) => !s.start || s.start >= today)
    .sort((a, b) => (a.start ?? "9999").localeCompare(b.start ?? "9999"));
}

export async function getSession(id: string) {
  return (await getSessions()).find((s) => s.id === id);
}

export const placesLeft = (s: Session) =>
  s.capacity !== undefined && s.registered !== undefined ? Math.max(0, s.capacity - s.registered) : undefined;

/** Lien du bouton « S'inscrire » : lien externe, sinon inscription du site, sinon formulaire de demande. */
export const registrationHref = (s: Session, online: boolean) =>
  s.link ??
  (online && s.id
    ? `/formations/inscription/${s.id}`
    : `/formations?demande=inscription${s.course ? `&formation=${s.course}` : ""}#demande`);

export const sessionTitle = (s: Session) =>
  s.title ?? formationsPage.courses.find((c) => c.slug === s.course)?.title ?? "Formation";
