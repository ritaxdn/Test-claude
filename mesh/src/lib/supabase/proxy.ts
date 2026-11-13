import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/env";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth", "/check-email"];
const AUTH_PAGES = ["/login", "/signup"];

const matches = (pathname: string, paths: string[]) =>
  paths.some((p) => (p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(`${p}/`)));

/** Refreshes the Supabase session cookie and gates app routes. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, anonKey } = supabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Do not run code between createServerClient and getClaims().
  const { data } = await supabase.auth.getClaims();
  const isAuthed = Boolean(data?.claims?.sub);
  const { pathname, search } = request.nextUrl;

  const redirect = (to: string) => {
    const target = NextResponse.redirect(new URL(to, request.url));
    response.cookies.getAll().forEach((c) => target.cookies.set(c));
    return target;
  };

  if (!isAuthed && !matches(pathname, PUBLIC_PATHS)) {
    return redirect(`/login?next=${encodeURIComponent(pathname + search)}`);
  }
  if (isAuthed && matches(pathname, AUTH_PAGES)) {
    return redirect("/discover");
  }
  return response;
}
