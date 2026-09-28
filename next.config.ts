import type { NextConfig } from "next";

// En-têtes de sécurité appliqués à toutes les pages (HTTPS forcé via HSTS, anti-clickjacking, etc.).
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Vidéos et images : mises en cache longtemps par le navigateur.
      { source: "/videos/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/images/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
  },
};

export default nextConfig;
