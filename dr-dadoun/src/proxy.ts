import { NextResponse } from "next/server";

// Ce site n'a pas besoin de proxy. Ce fichier existe pour que Next.js ne
// récupère pas celui du site Cellulift (à la racine du dépôt) lorsque
// Vercel compile depuis la racine du monorepo.
export function proxy() {
  return NextResponse.next();
}

// Ne s'applique à aucune page réelle du site.
export const config = { matcher: ["/__aucune-route"] };
