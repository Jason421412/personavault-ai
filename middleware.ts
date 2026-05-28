import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSafeAppRedirect } from "@/lib/auth/redirects";
import type { Database } from "@/lib/supabase/types";
import { getOptionalPublicEnv, isSupabaseConfigured } from "@/lib/validators/env";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isSupabaseConfigured()) {
    if (pathname.startsWith("/app")) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirectTo", pathname + search);
      loginUrl.searchParams.set("error", "supabase_not_configured");

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  let response = NextResponse.next({
    request,
  });

  const {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  } = getOptionalPublicEnv();

  const supabase = createServerClient<Database>(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/app") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname + search);

    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && user) {
    const redirectTo = getSafeAppRedirect(request.nextUrl.searchParams.get("redirectTo"));

    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/login"],
};
