import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  // Cette application vit dans un sous-dossier du dépôt du site : on fixe sa racine pour que
  // Turbopack n'utilise pas le projet parent (son proxy.ts, sa config PostCSS).
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: "26mb" } }, // documents jusqu'à 25 Mo
  async headers() {
    // Pages qui portent un jeton dans l'adresse : aucun référent transmis, jamais en cache.
    const tokenPage = [{ key: "Referrer-Policy", value: "no-referrer" }, { key: "Cache-Control", value: "no-store" }];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/invitation/:token*", headers: tokenPage },
      { source: "/reinitialiser/:token*", headers: tokenPage },
      { source: "/formations/confirmer/:token*", headers: tokenPage },
    ];
  },
};

export default nextConfig;
