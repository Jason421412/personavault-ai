import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/types";
import { getSupabasePublicEnv } from "@/lib/validators/env";

export function createClient() {
  const {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  } = getSupabasePublicEnv();

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
