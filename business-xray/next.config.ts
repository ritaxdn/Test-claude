import path from "node:path";
import type { NextConfig } from "next";

// Cette app vit dans un sous-dossier du dépôt Cellulift : on fixe sa racine pour que
// Next.js n'aille pas chercher les fichiers (dont src/proxy.ts) du site parent.
const root = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root },
  outputFileTracingRoot: root,
};

export default nextConfig;
