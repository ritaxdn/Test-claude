import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";

// Moteurs de recherche ET assistants IA (ChatGPT, Claude, Perplexity, Gemini…) sont explicitement autorisés,
// pour que le cabinet puisse être cité dans leurs réponses (GEO).
const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/"] })),
    ],
    sitemap: absolute("/sitemap.xml"),
    host: absolute("/"),
  };
}
