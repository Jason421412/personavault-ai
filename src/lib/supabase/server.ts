import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/supabase/types";
import { getSupabasePublicEnv } from "@/lib/validators/env";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function createClient() {
  const cookieStore = await cookies();
  const {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  } = getSupabasePublicEnv();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Route Handlers and Server Actions can.
        }
      },
    },
  });
}
