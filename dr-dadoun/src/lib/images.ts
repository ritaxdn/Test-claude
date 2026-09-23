import fs from "node:fs";
import path from "node:path";

/**
 * Renvoie le chemin public d'une photo si le fichier existe dans
 * `public/images/`, sinon null (un dégradé de remplacement s'affiche).
 * Pour ajouter une photo, il suffit de déposer le fichier avec le bon nom.
 */
export function image(name: string): string | null {
  const rel = `/images/${name}`;
  return fs.existsSync(path.join(process.cwd(), "public", rel)) ? rel : null;
}

/** Même principe pour les vidéos, déposées dans `public/videos/`. */
export function video(name: string): string | null {
  const rel = `/videos/${name}`;
  return fs.existsSync(path.join(process.cwd(), "public", rel)) ? rel : null;
}
