// Public Supabase configuration. Only the URL and the anon/publishable key are
// read here — the service-role key is intentionally never referenced anywhere
// in this app.
export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Copy .env.example to .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { url, anonKey };
}

export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
