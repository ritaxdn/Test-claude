import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ce site vit dans un sous-dossier du dépôt : on fixe sa racine pour que
  // Turbopack n'utilise pas le projet parent.
  turbopack: { root: __dirname },
};

export default nextConfig;
